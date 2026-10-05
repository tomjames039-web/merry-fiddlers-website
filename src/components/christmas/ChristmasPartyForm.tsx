'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';
import { trackLead } from '@/lib/analytics';

const field =
  'w-full px-4 py-3 bg-white border border-[#d8cdb8] rounded-lg text-[#2d4a4a] placeholder:text-[#a09480] focus:outline-none focus:border-[#8c2f39] focus:ring-2 focus:ring-[#8c2f39]/15 transition-all';

const label =
  'block text-[11px] uppercase tracking-[0.18em] text-[#7b6a52] font-semibold mb-2';

const SERVICE = ['Evening', 'Lunch', 'Either — advise us'];

const SPACES = [
  'Not sure — please advise',
  'Private room',
  'Semi-private area',
  'A restaurant section to ourselves',
  'Heated dome (smaller group)',
  'Bar area / drinks reception',
  'Whole venue',
];

const BUDGETS = [
  'Prefer not to say',
  'Under £30 per head',
  '£30–£45 per head',
  '£45–£65 per head',
  '£65+ per head',
  'Total budget — see notes',
];

interface Props {
  source: string;
}

export default function ChristmasPartyForm({ source }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    guests: '',
    dates: '',
    service: 'Evening',
    space: 'Not sure — please advise',
    budget: 'Prefer not to say',
    notes: '',
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.guests.trim()) {
      setStatus('error');
      setError('Please add your name, phone, email and approximate numbers.');
      return;
    }
    setStatus('sending');
    setError('');

    const message = [
      'CHRISTMAS PARTY ENQUIRY — December 2026',
      form.company.trim() ? `Company: ${form.company.trim()}` : 'Company: not given',
      `Approx guests: ${form.guests.trim()}`,
      `Preferred date / range: ${form.dates.trim() || 'Flexible'}`,
      `Lunch or evening: ${form.service}`,
      `Private space required: ${form.space}`,
      `Budget: ${form.budget}`,
      form.notes.trim() ? `Notes: ${form.notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          eventType: 'Christmas Party 2026',
          expectedGuests: form.guests.trim(),
          preferredDate: form.dates.trim() || 'Flexible',
          message,
          source,
        }),
      });
      if (!res.ok) throw new Error('failed');
      trackLead(source, {
        party_size: form.guests.trim(),
        company: form.company.trim() || undefined,
      });
      setStatus('done');
    } catch {
      setStatus('error');
      setError('We could not send that. Please try again, or call us on 01992 572142.');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-[#8c2f39]/25 bg-[#fffaf3] p-8 sm:p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-[#8c2f39] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-[#f4e3c3]" />
        </div>
        <h3
          className="text-2xl text-[#2d4a4a] mb-3"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Enquiry received
        </h3>
        <p className="text-[#5c5343] max-w-md mx-auto leading-relaxed">
          Thank you. One of the team will come back to you with the right space,
          availability for your dates and the festive menus as soon as they are
          released.
        </p>
        <p className="text-sm text-[#8a7c65] mt-4">
          In a hurry? Call{' '}
          <a href="tel:+441992572142" className="font-semibold text-[#8c2f39] hover:underline">
            01992 572142
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="cp-name">Your name *</label>
          <input
            id="cp-name"
            className={field}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoComplete="name"
          />
        </div>
        <div>
          <label className={label} htmlFor="cp-company">Company / organisation</label>
          <input
            id="cp-company"
            className={field}
            value={form.company}
            onChange={(e) => set('company', e.target.value)}
            autoComplete="organization"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="cp-phone">Phone *</label>
          <input
            id="cp-phone"
            type="tel"
            className={field}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
          />
        </div>
        <div>
          <label className={label} htmlFor="cp-email">Email *</label>
          <input
            id="cp-email"
            type="email"
            className={field}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={label} htmlFor="cp-guests">Approx. number of guests *</label>
          <input
            id="cp-guests"
            className={field}
            value={form.guests}
            onChange={(e) => set('guests', e.target.value)}
            placeholder="e.g. 24"
          />
        </div>
        <div>
          <label className={label} htmlFor="cp-dates">Preferred date or date range</label>
          <input
            id="cp-dates"
            className={field}
            value={form.dates}
            onChange={(e) => set('dates', e.target.value)}
            placeholder="e.g. Fri 11 or 18 Dec, or any week commencing 7 Dec"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={label} htmlFor="cp-service">Lunch or evening</label>
          <select
            id="cp-service"
            className={field}
            value={form.service}
            onChange={(e) => set('service', e.target.value)}
          >
            {SERVICE.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="cp-space">Private space required</label>
          <select
            id="cp-space"
            className={field}
            value={form.space}
            onChange={(e) => set('space', e.target.value)}
          >
            {SPACES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="cp-budget">Approx. budget</label>
          <select
            id="cp-budget"
            className={field}
            value={form.budget}
            onChange={(e) => set('budget', e.target.value)}
          >
            {BUDGETS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="cp-notes">Notes</label>
        <textarea
          id="cp-notes"
          rows={4}
          className={field}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Arrival drinks, dietary requirements, speeches, music, timings, anything that matters…"
        />
      </div>

      {status === 'error' && (
        <p className="flex items-start gap-2 text-sm text-[#8c2f39]">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#8c2f39] hover:bg-[#761f29] disabled:opacity-60 text-[#f8f1e3] rounded-lg uppercase tracking-[0.14em] text-sm font-semibold transition-colors shadow-lg shadow-[#8c2f39]/20"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" /> Send Christmas party enquiry
          </>
        )}
      </button>

      <p className="text-xs text-[#8a7c65] leading-relaxed text-center">
        No obligation. We will come back with the right space and options for
        your group — festive menus follow as soon as they are finalised.
      </p>
    </form>
  );
}
