'use client';

import { useState } from 'react';
import { AlertCircle, BellRing, CheckCircle2, Loader2 } from 'lucide-react';
import { trackLead } from '@/lib/analytics';

const field =
  'w-full px-4 py-3 bg-white border border-[#d8cdb8] rounded-lg text-[#2d4a4a] placeholder:text-[#a09480] focus:outline-none focus:border-[#8c2f39] focus:ring-2 focus:ring-[#8c2f39]/15 transition-all';

const label =
  'block text-[11px] uppercase tracking-[0.18em] text-[#7b6a52] font-semibold mb-2';

interface Props {
  /** e.g. 'Boxing Day' */
  occasion: string;
  /** e.g. 'Saturday 26 December 2026' */
  dateLine: string;
  /** e.g. 'festive-boxing-day' */
  source: string;
  ctaLabel: string;
}

export default function FestiveInterestForm({
  occasion,
  dateLine,
  source,
  ctaLabel,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    service: 'Either',
    notes: '',
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setStatus('error');
      setError('Please add your name and email so we can send you the details.');
      return;
    }
    setStatus('sending');
    setError('');

    const message = [
      `${occasion.toUpperCase()} — ${dateLine}`,
      `Approx guests: ${form.guests.trim() || 'not given'}`,
      `Lunch or dinner: ${form.service}`,
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
          phone: form.phone.trim() || undefined,
          eventType: occasion,
          expectedGuests: form.guests.trim() || undefined,
          preferredDate: dateLine,
          message,
          agreedToMarketing: true,
          source,
        }),
      });
      if (!res.ok) throw new Error('failed');
      trackLead(source, { occasion });
      setStatus('done');
    } catch {
      setStatus('error');
      setError('We could not send that. Please try again, or call us on 01992 572142.');
    }
  }

  if (status === 'done') {
    return (
      <div className="rounded-2xl border border-[#8c2f39]/25 bg-[#fffaf3] p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#8c2f39] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-[#f4e3c3]" />
        </div>
        <h3
          className="text-xl text-[#2d4a4a] mb-2"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Thank you &mdash; got it
        </h3>
        <p className="text-[#5c5343] leading-relaxed">
          We have your {occasion} enquiry and will come straight back to you to
          get the table booked in. In a hurry? Ring us on{' '}
          <a href="tel:+441992572142" className="font-semibold text-[#8c2f39] hover:underline">
            01992&nbsp;572142
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
          <label className={label} htmlFor={`${source}-name`}>Your name *</label>
          <input
            id={`${source}-name`}
            className={field}
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            autoComplete="name"
          />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-email`}>Email *</label>
          <input
            id={`${source}-email`}
            type="email"
            className={field}
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className={label} htmlFor={`${source}-phone`}>Phone</label>
          <input
            id={`${source}-phone`}
            type="tel"
            className={field}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel"
          />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-guests`}>Approx. guests</label>
          <input
            id={`${source}-guests`}
            className={field}
            value={form.guests}
            onChange={(e) => set('guests', e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
        <div>
          <label className={label} htmlFor={`${source}-service`}>Lunch or dinner</label>
          <select
            id={`${source}-service`}
            className={field}
            value={form.service}
            onChange={(e) => set('service', e.target.value)}
          >
            <option value="Either">Either</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor={`${source}-notes`}>Anything else</label>
        <textarea
          id={`${source}-notes`}
          rows={3}
          className={field}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Preferred time, dietary requirements, celebrating something…"
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
            <BellRing className="w-4 h-4" /> {ctaLabel}
          </>
        )}
      </button>
    </form>
  );
}
