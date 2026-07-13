'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Lock, Search, X, RefreshCw, UserCheck, RotateCcw, ChevronLeft,
  ChevronDown, Users, MapPin, Pencil, Save, StickyNote, Loader2,
  Check, AlertTriangle, Ticket, UserPlus, Trash2,
} from 'lucide-react';
import type { TicketBooking, TicketEvent } from '@/lib/tickets';
import ManualBookingModal from '@/components/admin/ManualBookingModal';
import {
  matchesBookingQuery, matchingAttendeeIndexes, attendeeCheckins,
  checkedInCountOf, partySizeOf, arrivalState, surnameOf,
  sourceLabel, paymentLabel, paymentBadge, isPublicSale,
} from '@/lib/tickets';

type Filter =
  | 'all' | 'not-arrived' | 'partial' | 'checked-in'
  | 'garden' | 'patio' | 'bar' | 'unallocated'
  | 'website' | 'sevenrooms' | 'comp';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'not-arrived', label: 'Not arrived' },
  { key: 'partial', label: 'Partial' },
  { key: 'checked-in', label: 'Checked in' },
  { key: 'garden', label: 'Garden' },
  { key: 'patio', label: 'Patio' },
  { key: 'bar', label: 'Bar' },
  { key: 'unallocated', label: 'Unallocated' },
  { key: 'website', label: 'Website' },
  { key: 'sevenrooms', label: 'SevenRooms' },
  { key: 'comp', label: 'Comp / guest' },
];

function fmtTime(d?: string) {
  if (!d) return '';
  return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function DoorModePage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [staffName, setStaffName] = useState('');

  const [bookings, setBookings] = useState<TicketBooking[]>([]);
  const [event, setEvent] = useState<TicketEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showAdd, setShowAdd] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = localStorage.getItem('mf-admin-token');
    if (t) setToken(t);
    const s = localStorage.getItem('mf-staff-name');
    if (s) setStaffName(s);
  }, []);

  const load = useCallback(async (tk: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', { headers: { Authorization: `Bearer ${tk}` } });
      if (res.status === 401) {
        localStorage.removeItem('mf-admin-token');
        setToken(null);
        return;
      }
      const d = await res.json();
      setBookings(d.bookings || []);
      setEvent(d.event || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) load(token);
  }, [token, load]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem('mf-admin-token', data.token);
        setToken(data.token);
      } else setLoginError('Incorrect password.');
    } catch {
      setLoginError('Could not sign in.');
    }
  };

  const focusSearch = useCallback(() => {
    requestAnimationFrame(() => {
      searchRef.current?.focus();
      searchRef.current?.select();
    });
  }, []);

  const act = useCallback(
    async (ref: string, patch: Record<string, unknown>, opts?: { refocus?: boolean }) => {
      if (!token) return;
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ref, by: staffName, ...patch }),
      });
      const d = await res.json();
      if (d.booking) {
        setBookings((prev) => prev.map((b) => (b.ref === ref ? d.booking : b)));
      }
      if (opts?.refocus !== false) focusSearch();
    },
    [token, staffName, focusSearch]
  );

  const del = useCallback(
    async (ref: string) => {
      if (!token) return;
      await fetch(`/api/tickets?ref=${encodeURIComponent(ref)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b.ref !== ref));
      focusSearch();
    },
    [token, focusSearch]
  );

  // ---- Derived ----
  const summary = useMemo(() => {
    let expected = 0, checkedIn = 0, partial = 0;
    for (const b of bookings) {
      const size = partySizeOf(b);
      const c = checkedInCountOf(b);
      expected += size;
      checkedIn += c;
      if (c > 0 && c < size) partial += 1;
    }
    return { expected, checkedIn, still: Math.max(0, expected - checkedIn), partial };
  }, [bookings]);

  const results = useMemo(() => {
    const matchFilter = (b: TicketBooking) => {
      switch (filter) {
        case 'not-arrived': return arrivalState(b) === 'none';
        case 'partial': return arrivalState(b) === 'partial';
        case 'checked-in': return arrivalState(b) === 'full';
        case 'garden': return b.viewingArea === 'garden';
        case 'patio': return b.viewingArea === 'patio';
        case 'bar': return b.viewingArea === 'bar';
        case 'unallocated': return !b.tableRef;
        case 'website': return isPublicSale(b);
        case 'sevenrooms': return b.source === 'sevenrooms';
        case 'comp': return b.paymentStatus === 'complimentary' || b.source === 'guest-list' || b.source === 'staff';
        default: return true;
      }
    };
    return bookings
      .filter((b) => matchFilter(b) && matchesBookingQuery(b, query))
      .sort((a, b) => surnameOf(a.purchaserName).localeCompare(surnameOf(b.purchaserName)));
  }, [bookings, query, filter]);

  // ---- Login screen ----
  if (!token) {
    return (
      <div className="min-h-screen bg-[#12292a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#12292a] rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#c9a55c]" />
            </div>
            <h1 className="text-xl font-bold text-[#12292a]" style={{ fontFamily: "'Cinzel', serif" }}>
              Door Mode
            </h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to check guests in.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
              autoFocus
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg font-medium">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f2323] text-white">
      {/* Sticky header + search */}
      <div className="sticky top-0 z-30 bg-[#12292a] border-b border-white/10 shadow-lg">
        <div className="max-w-2xl mx-auto px-3 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <Link href="/admin" className="inline-flex items-center gap-1 text-white/60 hover:text-white text-sm">
              <ChevronLeft className="w-4 h-4" /> Admin
            </Link>
            <span className="text-[#c9a55c] font-semibold text-sm" style={{ fontFamily: "'Cinzel', serif" }}>
              Door Mode · England v Argentina
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#c9a55c] text-[#12292a] rounded-lg text-xs font-semibold" title="Add a booking">
                <UserPlus className="w-4 h-4" /> Add
              </button>
              <button onClick={() => token && load(token)} className="p-1.5 hover:bg-white/10 rounded-lg" title="Refresh">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Big search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any guest, booker, ref, phone…"
              autoFocus
              autoComplete="off"
              className="w-full pl-13 pr-11 py-4 text-lg rounded-xl bg-white text-[#12292a] placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-[#c9a55c]/50"
              style={{ paddingLeft: '3.25rem' }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); focusSearch(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Summary */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <SummaryChip label="Expected" value={summary.expected} />
            <SummaryChip label="Checked in" value={summary.checkedIn} tone="green" />
            <SummaryChip label="Still due" value={summary.still} tone="amber" />
            <SummaryChip label="Partial" value={summary.partial} />
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 mt-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filter === f.key ? 'bg-[#c9a55c] text-[#12292a]' : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-3 py-3 space-y-3">
        {loading && bookings.length === 0 ? (
          <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-[#c9a55c]" /></div>
        ) : results.length === 0 ? (
          <div className="text-center py-16 text-white/50">
            <Ticket className="w-10 h-10 mx-auto mb-3 opacity-40" />
            {query ? `No guests match “${query}”.` : 'No bookings in this filter.'}
          </div>
        ) : (
          results.map((b) => (
            <DoorCard key={b.ref} booking={b} query={query} act={act} del={del} focusSearch={focusSearch} event={event} />
          ))
        )}
        <div className="h-16" />
      </div>

      {showAdd && event && token && (
        <ManualBookingModal
          token={token}
          event={event}
          onClose={() => setShowAdd(false)}
          onCreated={(b) => { setShowAdd(false); setBookings((prev) => [b, ...prev]); focusSearch(); }}
        />
      )}
    </div>
  );
}

function SummaryChip({ label, value, tone }: { label: string; value: number; tone?: 'green' | 'amber' }) {
  const cls = tone === 'green' ? 'text-green-300' : tone === 'amber' ? 'text-amber-300' : 'text-white';
  return (
    <div className="flex-1 bg-white/5 rounded-lg px-2 py-1.5 text-center">
      <div className={`text-base font-bold ${cls}`}>{value}</div>
      <div className="text-white/50 text-[10px] uppercase tracking-wide">{label}</div>
    </div>
  );
}

function DoorCard({
  booking, query, act, del, focusSearch, event,
}: {
  booking: TicketBooking;
  query: string;
  act: (ref: string, patch: Record<string, unknown>, opts?: { refocus?: boolean }) => Promise<void>;
  del: (ref: string) => Promise<void>;
  focusSearch: () => void;
  event: TicketEvent | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [names, setNames] = useState<string[]>(booking.attendees);
  const [doorNote, setDoorNote] = useState(booking.doorNote || '');
  const [busy, setBusy] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);

  useEffect(() => { setNames(booking.attendees); }, [booking.attendees]);

  const checks = attendeeCheckins(booking);
  const size = partySizeOf(booking);
  const count = checkedInCountOf(booking);
  const state = arrivalState(booking);
  const matchIdx = matchingAttendeeIndexes(booking, query);

  const run = async (patch: Record<string, unknown>, opts?: { refocus?: boolean }) => {
    setBusy(true);
    try { await act(booking.ref, patch, opts); } finally { setBusy(false); }
  };

  const toggleOne = (i: number) =>
    run({ action: 'check-in-index', index: i, value: !checks[i] }, { refocus: false });

  const checkInAll = () => {
    if (state === 'full') { setConfirmAll(true); return; }
    run({ action: 'check-in-all' });
  };

  const saveNames = async () => {
    await run({ action: 'update', attendees: names }, { refocus: false });
    setEditing(false);
  };

  const stateBadge =
    state === 'full'
      ? <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full"><UserCheck className="w-3.5 h-3.5" /> All in</span>
      : state === 'partial'
        ? <span className="bg-amber-400 text-[#12292a] text-xs font-bold px-2.5 py-1 rounded-full">{count}/{size} in</span>
        : <span className="bg-white/15 text-white/80 text-xs font-bold px-2.5 py-1 rounded-full">Not arrived</span>;

  return (
    <div className={`rounded-2xl overflow-hidden border ${state === 'full' ? 'border-green-500/40 bg-green-500/5' : 'border-white/10 bg-white/[0.04]'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {matchIdx.length > 0 && (
              <p className="text-[#c9a55c] font-bold text-lg leading-tight truncate">
                {booking.attendees[matchIdx[0]]}
              </p>
            )}
            <p className={`${matchIdx.length ? 'text-white/60 text-sm' : 'text-white font-bold text-lg'} truncate`}>
              {matchIdx.length ? <>Lead: {booking.purchaserName}</> : booking.purchaserName}
            </p>
            <p className="text-white/50 text-sm mt-0.5">
              {booking.arrivalTime ? `${booking.arrivalTime} · ` : ''}{size} {size === 1 ? 'guest' : 'guests'} · {booking.viewingAreaLabel}
              {booking.tableRef ? ` · Table ${booking.tableRef}` : ' · Unallocated'}
            </p>
            {!isPublicSale(booking) && <PayBadge status={booking.paymentStatus} />}
          </div>
          <div className="text-right shrink-0">
            {stateBadge}
            <p className="font-mono text-white/50 text-xs mt-1.5">{booking.ref}</p>
          </div>
        </div>

        {/* Attendee chips — tap to check in individually */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {booking.attendees.map((name, i) => (
            <button
              key={i}
              onClick={() => toggleOne(i)}
              disabled={busy}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                checks[i]
                  ? 'bg-green-500 text-white'
                  : matchIdx.includes(i)
                    ? 'bg-[#c9a55c] text-[#12292a]'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {checks[i] ? <Check className="w-4 h-4" /> : <span className="w-4 text-center text-xs opacity-70">{i + 1}</span>}
              {name}
            </button>
          ))}
        </div>

        {/* Primary actions */}
        <div className="flex gap-2 mt-3">
          {state !== 'full' ? (
            <button
              onClick={checkInAll}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-base disabled:opacity-60"
            >
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
              Check in all ({size})
            </button>
          ) : (
            <button
              onClick={() => run({ action: 'undo-check-in' })}
              disabled={busy}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 border border-white/25 text-white/80 hover:bg-white/10 rounded-xl font-medium disabled:opacity-60"
            >
              <RotateCcw className="w-5 h-5" /> Undo
            </button>
          )}
          <button
            onClick={() => setExpanded((s) => !s)}
            className="px-4 py-3.5 bg-white/10 hover:bg-white/20 rounded-xl"
            title="More"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {confirmAll && (
          <div className="mt-3 rounded-xl bg-amber-500/15 border border-amber-400/40 p-3 text-sm">
            <p className="flex items-center gap-2 text-amber-200 mb-2">
              <AlertTriangle className="w-4 h-4" /> This party is already fully checked in.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { setConfirmAll(false); run({ action: 'check-in-all' }); }}
                className="px-3 py-2 bg-amber-500 text-[#12292a] rounded-lg font-medium text-sm"
              >
                Check in again anyway
              </button>
              <button onClick={() => setConfirmAll(false)} className="px-3 py-2 text-white/70 text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-white/10 bg-black/20 p-4 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-2 text-white/70">
            <Info label="Source" value={sourceLabel(booking.source)} />
            <Info label="Payment" value={paymentLabel(booking.paymentStatus)} />
            {booking.arrivalTime && <Info label="Arrival" value={booking.arrivalTime} />}
            {booking.amountPrepaid != null && <Info label="Prepaid" value={`£${booking.amountPrepaid.toFixed(2)}`} />}
            {!!booking.amountDue && <Info label="Due on arrival" value={`£${booking.amountDue.toFixed(2)}`} />}
            {booking.purchaserPhone && <Info label="Mobile" value={booking.purchaserPhone} href={`tel:${booking.purchaserPhone}`} />}
            {booking.purchaserEmail && <Info label="Email" value={booking.purchaserEmail} />}
          </div>
          {booking.adminNote && (
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-white/40 text-xs uppercase mb-1">Admin note</p>
              <p className="text-white/80">{booking.adminNote}</p>
            </div>
          )}

          {booking.bookingNotes && (
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-white/40 text-xs uppercase mb-1">Booking notes (not guaranteed)</p>
              <p className="text-white/80">{booking.bookingNotes}</p>
            </div>
          )}

          {booking.checkedInAt && (
            <p className="text-white/50 text-xs">
              Last check-in {fmtTime(booking.checkedInAt)}{booking.checkedInBy ? ` by ${booking.checkedInBy}` : ''}
            </p>
          )}

          {/* Edit attendee names */}
          {editing ? (
            <div className="space-y-2">
              <p className="text-white/40 text-xs uppercase">Correct attendee names</p>
              {names.map((n, i) => (
                <input
                  key={i}
                  value={n}
                  onChange={(e) => setNames((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))}
                  className="w-full px-3 py-2.5 rounded-lg bg-white text-[#12292a]"
                />
              ))}
              <div className="flex gap-2">
                <button onClick={saveNames} disabled={busy} className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#c9a55c] text-[#12292a] rounded-lg font-medium">
                  <Save className="w-4 h-4" /> Save names
                </button>
                <button onClick={() => { setEditing(false); setNames(booking.attendees); }} className="px-3 py-2 text-white/60">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-[#c9a55c] hover:underline">
              <Pencil className="w-4 h-4" /> Add or correct names
            </button>
          )}

          {/* Door note */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <StickyNote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                value={doorNote}
                onChange={(e) => setDoorNote(e.target.value)}
                placeholder="Add a quick door note…"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#c9a55c]/50"
              />
            </div>
            <button
              onClick={() => run({ action: 'door-note', doorNote }, { refocus: false })}
              disabled={busy}
              className="px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
          {booking.doorNote && <p className="text-white/60 text-xs">Saved note: {booking.doorNote}</p>}

          {/* Delete */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={async () => {
                if (!confirm(`Delete booking ${booking.ref} for ${booking.purchaserName}? This permanently removes it and cannot be undone.`)) return;
                setBusy(true);
                try { await del(booking.ref); } finally { setBusy(false); }
              }}
              disabled={busy}
              className="inline-flex items-center gap-1.5 text-red-300 hover:text-red-200 text-sm disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Delete booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const DOOR_BADGE_TONES: Record<string, string> = {
  ok: 'bg-green-500/20 text-green-300',
  warn: 'bg-amber-500/25 text-amber-200',
  danger: 'bg-red-500/30 text-red-200',
  muted: 'bg-white/15 text-white/70',
};

function PayBadge({ status }: { status?: TicketBooking['paymentStatus'] }) {
  const b = paymentBadge(status);
  return (
    <span className={`inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full ${DOOR_BADGE_TONES[b.tone]}`}>
      {b.label}
    </span>
  );
}

function Info({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <p className="text-white/40 text-[10px] uppercase">{label}</p>
      {href ? (
        <a href={href} className="text-white/90 hover:text-[#c9a55c] break-all">{value}</a>
      ) : (
        <p className="text-white/90 break-all">{value}</p>
      )}
    </div>
  );
}
