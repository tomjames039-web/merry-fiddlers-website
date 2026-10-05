'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, TreePine } from 'lucide-react';
import { trackLead } from '@/lib/analytics';

const field =
  'w-full px-4 py-3 bg-white border border-[#d8cdb8] rounded-lg text-[#2d4a4a] placeholder:text-[#a09480] focus:outline-none focus:border-[#8c2f39] focus:ring-2 focus:ring-[#8c2f39]/15 transition-all';

const label =
  'block text-[11px] uppercase tracking-[0.18em] text-[#7b6a52] font-semibold mb-2';

const SITTINGS = [
  'No preference',
  'Early — around midday',
  'Mid-afternoon',
  'Later afternoon / early evening',
];

interface Props {
  /** recorded against the lead so the back office knows where it came from */
  source: string;
}

export default function ChristmasDayForm({ source }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    children: '',
    sitting: 'No preference',
    dietary: '',
    notes: '',
    marketing: true,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.guests.trim()) {
      setStatus('error');
      setError('Please add your name, email, phone number and how many people are coming.');
      return;
    }
    setStatus('sending');
    setError('');

    const message = [
      `CHRISTMAS DAY RESERVATION — Friday 25 December 2026`,
      `Party size: ${form.guests}`,
      form.children.trim() ? `Children: ${form.children.trim()}` : null,
      `Preferred sitting: ${form.sitting}`,
      form.dietary.trim() ? `Dietary / access needs: ${form.dietary.trim()}` : null,
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
          eventType: 'Christmas Day 2026',
          expectedGuests: form.guests.trim(),
          preferredDate: 'Friday 25 December 2026',
          message,
          agreedToMarketing: form.marketing,
          source,
        }),
      });
      if (!res.ok) throw new Error('failed');
      trackLead(source, { party_size: form.guests.trim() });
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
          Your place is reserved
        </h3>
        <p className="text-[#5c5343] max-w-md mx-auto leading-relaxed">
          Thank you — you are in our Christmas Day book. We will be in touch as
          soon as the final menu, sitting times and booking terms are released,
          and you will hear from us before it goes out publicly.
        </p>
        <p className="text-sm text-[#8a7c65] mt-4">
          Anything urgent? Call us on{' '}
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
          <label className={label} htmlFor="cd-name">Your name *</label>
          <input
            id="cd-name"
            className={field}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoComplete="name"
            placeholder="Jane Fielding"
          />
        </div>
        <div>
          <label className={label} htmlFor="cd-phone">Phone *</label>
          <input
            id="cd-phone"
            type="tel"
            className={field}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
            placeholder="07…"
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="cd-email">Email *</label>
        <input
          id="cd-email"
          type="email"
          className={field}
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={label} htmlFor="cd-guests">Total guests *</label>
          <input
            id="cd-guests"
            inputMode="numeric"
            className={field}
            value={form.guests}
            onChange={(e) => set('guests', e.target.value)}
            placeholder="e.g. 6"
          />
        </div>
        <div>
          <label className={label} htmlFor="cd-children">Children (if any)</label>
          <input
            id="cd-children"
            className={field}
            value={form.children}
            onChange={(e) => set('children', e.target.value)}
            placeholder="e.g. 2 under 10"
          />
        </div>
        <div>
          <label className={label} htmlFor="cd-sitting">Preferred sitting</label>
          <select
            id="cd-sitting"
            className={field}
            value={form.sitting}
            onChange={(e) => set('sitting', e.target.value)}
          >
            {SITTINGS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="cd-dietary">Dietary or access requirements</label>
        <input
          id="cd-dietary"
          className={field}
          value={form.dietary}
          onChange={(e) => set('dietary', e.target.value)}
          placeholder="Allergies, vegetarian, step-free access…"
        />
      </div>

      <div>
        <label className={label} htmlFor="cd-notes">Anything else we should know</label>
        <textarea
          id="cd-notes"
          rows={3}
          className={field}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Celebrating something, high chairs needed, arriving together…"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-[#5c5343] cursor-pointer">
        <input
          type="checkbox"
          checked={form.marketing}
          onChange={(e) => set('marketing', e.target.checked)}
          className="mt-1 w-4 h-4 accent-[#8c2f39]"
        />
        <span>
          Keep me posted about the festive menus and what else is on at the pub.
        </span>
      </label>

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
            <Loader2 className="w-4 h-4 animate-spin" /> Reserving…
          </>
        ) : (
          <>
            <TreePine className="w-4 h-4" /> Reserve your Christmas Day place
          </>
        )}
      </button>

      <p className="text-xs text-[#8a7c65] leading-relaxed text-center">
        No deposit is taken today. Your place is held in our Christmas Day book
        and confirmed once we have contacted you with the final menu, sitting
        time and booking terms.
      </p>
    </form>
  );
}
