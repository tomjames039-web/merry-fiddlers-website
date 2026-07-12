'use client';

import { useState, useMemo } from 'react';
import { X, Loader2, UserPlus } from 'lucide-react';
import {
  type TicketEvent,
  type TicketBooking,
  BOOKING_SOURCES,
  PAYMENT_STATUSES,
} from '@/lib/tickets';

const inputCls =
  'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent';

export default function ManualBookingModal({
  token, event, onClose, onCreated,
}: {
  token: string;
  event: TicketEvent;
  onClose: () => void;
  onCreated: (b: TicketBooking) => void;
}) {
  const [leadName, setLeadName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [attendees, setAttendees] = useState<string[]>(['', '']);
  const [area, setArea] = useState('no-preference');
  const [tableRef, setTableRef] = useState('');
  const [notes, setNotes] = useState('');
  const [source, setSource] = useState('sevenrooms');
  const [paymentStatus, setPaymentStatus] = useState('existing-reservation');
  const [externalRef, setExternalRef] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const setSize = (n: number) => {
    const size = Math.max(1, Math.min(50, n));
    setPartySize(size);
    setAttendees((prev) => {
      const next = prev.slice(0, size);
      while (next.length < size) next.push('');
      return next;
    });
  };

  const tableOptions = useMemo(
    () =>
      event.tables
        .filter((t) => area === 'no-preference' || t.area === area)
        .map((t) => t.ref),
    [event.tables, area]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim()) {
      setError('Lead booker name is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          purchaserName: leadName,
          purchaserEmail: email,
          purchaserPhone: phone,
          partySize,
          attendees,
          viewingArea: area,
          tableRef,
          bookingNotes: notes,
          source,
          paymentStatus,
          externalRef,
        }),
      });
      const d = await res.json();
      if (d.booking) onCreated(d.booking);
      else setError('Could not create booking. Please try again.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !busy && onClose()}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
      >
        <div className="bg-[#12292a] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#c9a55c]" /> Add a booking
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-500">
            For SevenRooms, phone, guest-list, staff or complimentary bookings. No card payment required.
          </p>

          <Field label="Lead booker name *">
            <input value={leadName} onChange={(e) => setLeadName(e.target.value)} className={inputCls} placeholder="e.g. Thomas Jones" autoFocus />
          </Field>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Email (optional)">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="name@email.com" />
            </Field>
            <Field label="Mobile (optional)">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="07…" />
            </Field>
          </div>

          <Field label="Party size">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setSize(partySize - 1)} className="w-10 h-10 rounded-full border-2 border-[#12292a] text-[#12292a] text-xl font-bold">−</button>
              <span className="text-2xl font-bold text-[#12292a] w-10 text-center">{partySize}</span>
              <button type="button" onClick={() => setSize(partySize + 1)} className="w-10 h-10 rounded-full border-2 border-[#12292a] text-[#12292a] text-xl font-bold">+</button>
            </div>
          </Field>

          <Field label="Attendee names (optional — blanks become placeholders)">
            <div className="space-y-2">
              {attendees.map((n, i) => (
                <input
                  key={i}
                  value={n}
                  onChange={(e) => setAttendees((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))}
                  className={inputCls}
                  placeholder={`Guest ${i + 1} of ${leadName || 'lead booker'}`}
                />
              ))}
            </div>
          </Field>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Viewing area">
              <select value={area} onChange={(e) => { setArea(e.target.value); setTableRef(''); }} className={inputCls}>
                {event.viewingAreas.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Table / seating ref">
              <input
                value={tableRef}
                onChange={(e) => setTableRef(e.target.value.toUpperCase())}
                className={inputCls}
                placeholder="e.g. G12"
                list="table-refs"
              />
              <datalist id="table-refs">
                {tableOptions.map((r) => <option key={r} value={r} />)}
              </datalist>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Booking source">
              <select value={source} onChange={(e) => setSource(e.target.value)} className={inputCls}>
                {BOOKING_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Payment status">
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={inputCls}>
                {PAYMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="External ref (e.g. SevenRooms)">
              <input value={externalRef} onChange={(e) => setExternalRef(e.target.value)} className={inputCls} placeholder="Optional" />
            </Field>
            <Field label="Notes">
              <input value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} placeholder="Optional" />
            </Field>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button type="button" onClick={onClose} className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button type="submit" disabled={busy || !leadName.trim()} className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg font-medium disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create booking
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
