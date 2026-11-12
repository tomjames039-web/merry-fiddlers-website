import { afterEach, describe, expect, mock, test } from 'bun:test';
import { NextRequest } from 'next/server';
import { getAdminPassword, isAuthorized } from '../src/lib/auth';

const originalPassword = process.env.ADMIN_PASSWORD;
const originalApiKey = process.env.ADMIN_API_KEY;
const originalSite = process.env.NEXT_PUBLIC_SITE_URL;
let checkoutParams;
mock.module('@/lib/stripe', () => ({
  getStripe: () => ({ checkout: { sessions: { create: async (params) => {
    checkoutParams = params;
    return { client_secret: 'unit-test-checkout' };
  } } } }),
}));

afterEach(() => {
  for (const [key, value] of Object.entries({ ADMIN_PASSWORD: originalPassword, ADMIN_API_KEY: originalApiKey, NEXT_PUBLIC_SITE_URL: originalSite })) {
    if (value === undefined) delete process.env[key]; else process.env[key] = value;
  }
});

describe('staff authentication', () => {
  test('missing configuration denies empty and former public fallback credentials', async () => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_API_KEY;
    expect(getAdminPassword()).toBe('');
    const { POST } = await import('../src/app/api/admin/login/route');
    for (const password of ['', 'merryfiddlers2025']) {
      const request = new NextRequest('https://example.invalid/api/admin/login', {
        method: 'POST', body: JSON.stringify({ password }), headers: { 'Content-Type': 'application/json' },
      });
      expect((await POST(request)).status).toBe(401);
      expect(isAuthorized(new NextRequest('https://example.invalid/api/leads', { headers: { Authorization: `Bearer ${password}` } }))).toBe(false);
    }
  });

  test('configured password grants staff access and rejects a wrong token', () => {
    process.env.ADMIN_PASSWORD = 'unit-test-only-staff-password';
    expect(isAuthorized(new NextRequest('https://example.invalid/api/leads', { headers: { Authorization: 'Bearer unit-test-only-staff-password' } }))).toBe(true);
    expect(isAuthorized(new NextRequest('https://example.invalid/api/leads', { headers: { Authorization: 'Bearer wrong' } }))).toBe(false);
  });

  test('diagnostic endpoints reject anonymous requests before reaching providers', async () => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_API_KEY;
    const email = await import('../src/app/api/test-email/route');
    const voucher = await import('../src/app/api/test-voucher/route');
    expect((await email.GET(new NextRequest('https://example.invalid/api/test-email'))).status).toBe(401);
    expect((await voucher.GET(new NextRequest('https://example.invalid/api/test-voucher?send=voucher'))).status).toBe(401);
  });
});

test('proxied checkout returns to the canonical website, ignoring hostile request headers', async () => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  const { POST } = await import('../src/app/api/checkout/route');
  const response = await POST(new NextRequest('https://themerryfiddlers.netlify.app/api/checkout', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Host: 'untrusted.invalid', Origin: 'https://untrusted.invalid', 'x-forwarded-proto': 'http' },
    body: JSON.stringify({ type: 'gift-voucher', voucherAmount: 10, customerEmail: 'test@example.invalid' }),
  }));
  expect(response.status).toBe(200);
  expect(checkoutParams?.return_url).toBe('https://themerryfiddlers.co.uk/booking-success?session_id={CHECKOUT_SESSION_ID}&type=gift-voucher');
});
