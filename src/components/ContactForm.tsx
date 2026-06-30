'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface ContactFormProps {
  /** Show the "enquiry type" dropdown (used on the dedicated Contact page). */
  withEnquiryType?: boolean;
  /** Recorded against the lead so you can see where it came from. */
  source?: string;
  /** Default enquiry type sent when the dropdown is hidden. */
  defaultEventType?: string;
}

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2d4a4a] transition-colors';

export default function ContactForm({
  withEnquiryType = false,
  source = 'contact-form',
  defaultEventType = 'General',
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    message: '',
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('Please add your name, email and a message.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          eventType: (withEnquiryType ? form.eventType : '') || defaultEventType,
          message: form.message.trim(),
          source,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setForm({ name: '', phone: '', email: '', eventType: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong sending your message. Please try again or call us on 01992 572142.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center text-center bg-[#f8f6f1] border border-[#c9a55c]/30 rounded-2xl p-10 h-full">
        <div className="w-14 h-14 rounded-full bg-[#2d4a4a] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-[#c9a55c]" />
        </div>
        <h3 className="text-2xl text-[#2d4a4a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          Message sent
        </h3>
        <p className="text-gray-600 max-w-sm">
          Thank you for getting in touch — we&rsquo;ve received your message and will reply as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-semibold text-[#c9a55c] hover:text-[#2d4a4a] transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          className={inputClass}
          autoComplete="tel"
        />
      </div>
      <input
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        className={inputClass}
        autoComplete="email"
      />
      {withEnquiryType && (
        <select
          value={form.eventType}
          onChange={(e) => update('eventType', e.target.value)}
          className={`${inputClass} ${form.eventType ? 'text-[#2d4a4a]' : 'text-gray-500'}`}
        >
          <option value="">Select Enquiry Type</option>
          <option value="General">General Enquiry</option>
          <option value="Reservation">Reservation</option>
          <option value="Private Hire">Private Hire</option>
          <option value="Feedback">Feedback</option>
        </select>
      )}
      <textarea
        placeholder="Message"
        rows={5}
        value={form.message}
        onChange={(e) => update('message', e.target.value)}
        className={inputClass}
      />

      {status === 'error' && (
        <p className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-4 bg-[#c9a55c] hover:bg-[#b8944b] disabled:opacity-60 disabled:cursor-not-allowed text-white uppercase tracking-wider font-medium transition-all flex items-center justify-center gap-2"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {status === 'submitting' ? (
          'Sending…'
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit
          </>
        )}
      </button>
    </form>
  );
}
