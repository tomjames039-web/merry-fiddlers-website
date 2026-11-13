import { beforeEach, expect, mock, test } from 'bun:test';
import { NextRequest } from 'next/server';

const saved: any[] = [];
const emails: any[] = [];
mock.module('@/lib/store', () => ({
  saveLead: async (lead: any) => { saved.push(lead); },
  getLeads: async () => [], updateLead: async () => {}, deleteLead: async () => {},
}));
mock.module('resend', () => ({ Resend: class {
  emails = { send: async (email: any) => { emails.push(email); return { data: { id: 'mock-only' }, error: null }; } };
} }));
process.env.RESEND_API_KEY = 'mock-not-a-real-key';
const { POST } = await import('../src/app/api/leads/route');
beforeEach(() => { saved.length = 0; emails.length = 0; });

async function enquire(source: string, preferredDate = '2026-12-25') {
  return POST(new NextRequest('https://example.invalid/api/leads', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source, preferredDate, fullName: 'Test Guest', email: 'test@example.invalid', expectedGuests: '4' }),
  }));
}

test('new 2027 interest stores an enquiry and sends replyable fully-booked acknowledgement', async () => {
  expect((await enquire('christmas-day-2027-interest')).status).toBe(200);
  expect(saved).toHaveLength(1);
  expect(saved[0]).toMatchObject({ source: 'christmas-day-2027-interest', preferredDate: '2027-12-25', status: 'new' });
  const email = emails.find(e => e.to === 'test@example.invalid');
  expect(email.replyTo).toBe('info@themerryfiddlers.co.uk');
  expect(email.html).toContain('fully booked for Christmas Day 2026');
  expect(email.html).toContain('50% deposit');
  expect(email.html).toContain('late September or early October 2027');
  expect(email.html).toContain('does not reserve a table for 2026 or 2027');
  expect(email.html).not.toContain('Your place is now held');
});

test('stale 2026 form cannot reserve a place or silently become 2027 interest', async () => {
  expect((await enquire('christmas-day-reservation')).status).toBe(200);
  expect(saved[0]).toMatchObject({ source: 'christmas-day-2026-fully-booked', preferredDate: '2026-12-25' });
  const email = emails.find(e => e.to === 'test@example.invalid');
  expect(email.subject).toContain('fully booked');
  expect(email.html).not.toContain('Your place is now held');
});

test('Christmas party enquiries retain their own acknowledgement', async () => {
  expect((await enquire('christmas-party-enquiry', '2026-12-12')).status).toBe(200);
  expect(saved[0].source).toBe('christmas-party-enquiry');
  const email = emails.find(e => e.to === 'test@example.invalid');
  expect(email.subject).toContain('party enquiry');
  expect(email.html).not.toContain('fully booked for Christmas Day');
  expect(email.html).toContain('No table or private space is reserved');
  expect(email.html).toContain('27 November, 4, 11 and 18 December 2026');
  expect(email.html).not.toContain('as soon as they are finalised');
  expect(email.html).not.toContain('hold a provisional slot');
});
