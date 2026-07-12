'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshCw, Download, Search, X, Ticket, PoundSterling, Users,
  CheckCircle2, Clock, UserCheck, Pause, Play, ChevronDown,
  AlertTriangle, Phone, Mail, MapPin, MessageSquare,
  RotateCcw, Loader2, Trophy, DoorOpen, UserPlus, Upload, Save,
  Armchair, Check, Pencil,
} from 'lucide-react';
import {
  type TicketEvent, type TicketBooking, type SalesStatus,
  attendeeCheckins, checkedInCountOf, partySizeOf, arrivalState,
  surnameOf, sourceLabel, paymentLabel, isPublicSale,
  matchesBookingQuery, BOOKING_SOURCES, PAYMENT_STATUSES,
} from '@/lib/tickets';
import ManualBookingModal from './ManualBookingModal';
import ImportModal from './ImportModal';
import SeatingView from './SeatingView';

interface TicketsResponse {
  event: TicketEvent;
  availability: { allocation: number; sold: number; held: number; remaining: number };
  bookings: TicketBooking[];
}

type Filter =
  | 'all' | 'not-arrived' | 'partial' | 'checked-in'
  | 'garden' | 'patio' | 'bar' | 'unallocated'
  | 'website' | 'sevenrooms' | 'comp';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'not-arrived', label: 'Not arrived' },
  { key: 'partial', label: 'Partial' },
  { key: 'checked-in', label: 'Fully in' },
  { key: 'garden', label: 'Garden' },
  { key: 'patio', label: 'Patio' },
  { key: 'bar', label: 'Bar' },
  { key: 'unallocated', label: 'Unallocated' },
  { key: 'website', label: 'Website' },
  { key: 'sevenrooms', label: 'SevenRooms' },
  { key: 'comp', label: 'Comp / guest' },
];

function fmtDateTime(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

const STATUS_META: Record<SalesStatus, { label: string; cls: string }> = {
  'on-sale': { label: 'On sale', cls: 'bg-green-100 text-green-700' },
  paused: { label: 'Paused', cls: 'bg-amber-100 text-amber-700' },
  'sold-out': { label: 'Sold out', cls: 'bg-red-100 text-red-700' },
  'coming-soon': { label: 'Coming soon', cls: 'bg-gray-100 text-gray-600' },
};

export default function EventDashboard({ token }: { token: string }) {
  const [data, setData] = useState<TicketsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'guests' | 'seating'>('guests');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sortBy, setSortBy] = useState<'attendee' | 'lead' | 'table'>('lead');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [allocDraft, setAllocDraft] = useState('');
  const [menuDraft, setMenuDraft] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const authHeaders = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tickets', { headers: authHeaders() });
      const d = (await res.json()) as TicketsResponse;
      setData(d);
      setAllocDraft(String(d.event.allocation));
      setMenuDraft(d.event.menuUrl);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const s = localStorage.getItem('mf-staff-name');
    if (s) setStaffName(s);
  }, []);

  const event = data?.event;
  const bookings = useMemo(() => data?.bookings ?? [], [data]);

  const stats = useMemo(() => {
    let sold = 0, revenue = 0, expected = 0, arrived = 0, partial = 0, manual = 0;
    for (const b of bookings) {
      const size = partySizeOf(b);
      const c = checkedInCountOf(b);
      expected += size;
      arrived += c;
      if (c > 0 && c < size) partial += 1;
      revenue += b.amount;
      if (isPublicSale(b)) sold += b.quantity; else manual += size;
    }
    const allocation = event?.allocation ?? 0;
    return {
      allocation, sold, remaining: Math.max(0, allocation - sold),
      revenue, orders: bookings.length, expected, arrived,
      still: Math.max(0, expected - arrived), partial, manual,
    };
  }, [bookings, event]);

  const filtered = useMemo(() => {
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
    const arr = bookings.filter((b) => matchFilter(b) && matchesBookingQuery(b, search));
    arr.sort((a, b) => {
      if (sortBy === 'table') return (a.tableRef || 'zzz').localeCompare(b.tableRef || 'zzz');
      if (sortBy === 'attendee') return surnameOf(a.attendees[0] || a.purchaserName).localeCompare(surnameOf(b.attendees[0] || b.purchaserName));
      return surnameOf(a.purchaserName).localeCompare(surnameOf(b.purchaserName));
    });
    return arr;
  }, [bookings, filter, search, sortBy]);

  const saveSettings = async (updates: Record<string, unknown>) => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates),
      });
      const d = await res.json();
      if (d.event) {
        setData((prev) => (prev ? { ...prev, event: d.event, availability: d.availability } : prev));
        setAllocDraft(String(d.event.allocation));
        setMenuDraft(d.event.menuUrl);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAllocationSave = () => {
    const n = Number(allocDraft);
    if (!Number.isInteger(n) || n < 0) return;
    if (n <= stats.sold) {
      const msg = n < stats.sold
        ? `Allocation ${n} is BELOW the ${stats.sold} public tickets already sold. Existing bookings stay valid, but no new tickets can be sold. Continue?`
        : `This leaves NO tickets available for public sale. Continue?`;
      if (!confirm(msg)) return;
    }
    saveSettings({ allocation: n });
  };

  const toggleSales = () => {
    if (!event) return;
    const next: SalesStatus = event.salesStatus === 'paused' ? 'on-sale' : 'paused';
    saveSettings({ salesStatus: next });
  };

  const updateBookingLocal = (b: TicketBooking) =>
    setData((prev) => prev ? { ...prev, bookings: prev.bookings.map((x) => (x.ref === b.ref ? b : x)) } : prev);

  const rememberStaff = (v: string) => {
    setStaffName(v);
    localStorage.setItem('mf-staff-name', v);
  };

  const exportCSV = () => {
    const headers = ['Reference', 'Lead booker', 'Email', 'Phone', 'Party', 'Amount', 'Source', 'Payment', 'Area', 'Table', 'Attendees', 'Checked in', 'Checked in at', 'Booking notes', 'Admin note'];
    const rows = bookings.map((b) => [
      b.ref, b.purchaserName, b.purchaserEmail, b.purchaserPhone, String(partySizeOf(b)),
      b.amount.toFixed(2), sourceLabel(b.source), paymentLabel(b.paymentStatus),
      b.viewingAreaLabel, b.tableRef || '', b.attendees.join(' | '),
      `${checkedInCountOf(b)}/${partySizeOf(b)}`, fmtDateTime(b.checkedInAt),
      b.bookingNotes || '', b.adminNote || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `england-argentina-guests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading && !data) {
    return <div className="flex items-center justify-center py-20 text-gray-400"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  }
  if (!event) {
    return <div className="text-center py-16 text-gray-400">Could not load the event.</div>;
  }

  const statusMeta = STATUS_META[event.salesStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-[#12292a] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-[#c9a55c]" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[#12292a]">{event.name}</h3>
              <p className="text-sm text-gray-500">
                {event.dateLabel} · KO {event.kickoff}
                <span className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusMeta.cls}`}>{statusMeta.label}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href="/admin/door" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg text-sm font-semibold">
              <DoorOpen className="w-4 h-4 text-[#c9a55c]" /> Door Mode
            </a>
            <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
              <UserPlus className="w-4 h-4" /> Add booking
            </button>
            <button onClick={() => setShowImport(true)} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium text-gray-700">
              <Upload className="w-4 h-4" /> Import
            </button>
            <button onClick={load} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh">
              <RefreshCw className={`w-5 h-5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={exportCSV} className="inline-flex items-center gap-2 px-3 py-2 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg text-sm font-medium">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Allocation" value={String(stats.allocation)} icon={<Ticket className="w-5 h-5 text-[#12292a]" />} tint="bg-[#12292a]/10" />
        <Stat label="Public sold" value={String(stats.sold)} icon={<Users className="w-5 h-5 text-[#c9a55c]" />} tint="bg-[#c9a55c]/10" />
        <Stat label="Remaining" value={String(stats.remaining)} icon={<Ticket className="w-5 h-5 text-amber-600" />} tint="bg-amber-100" />
        <Stat label="Revenue" value={`£${stats.revenue.toFixed(2)}`} icon={<PoundSterling className="w-5 h-5 text-green-600" />} tint="bg-green-100" />
        <Stat label="Total expected" value={String(stats.expected)} icon={<Users className="w-5 h-5 text-[#12292a]" />} tint="bg-[#12292a]/10" />
        <Stat label="Checked in" value={String(stats.arrived)} icon={<UserCheck className="w-5 h-5 text-green-600" />} tint="bg-green-100" />
        <Stat label="Still expected" value={String(stats.still)} icon={<Clock className="w-5 h-5 text-amber-600" />} tint="bg-amber-100" />
        <Stat label="Partial groups" value={String(stats.partial)} icon={<AlertTriangle className="w-5 h-5 text-amber-600" />} tint="bg-amber-100" />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h4 className="font-semibold text-[#12292a] mb-4">Event controls</h4>
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tickets on public sale</label>
            <div className="flex gap-2">
              <input type="number" min={0} value={allocDraft} onChange={(e) => setAllocDraft(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent" />
              <button onClick={handleAllocationSave} disabled={savingSettings || allocDraft === String(event.allocation)}
                className="px-4 py-2.5 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg text-sm font-medium disabled:opacity-40">Save</button>
            </div>
            {Number(allocDraft) <= stats.sold && (
              <p className="flex items-start gap-1.5 text-xs text-amber-600 mt-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> Leaves no public tickets. Existing bookings stay valid.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticket sales</label>
            <button onClick={toggleSales} disabled={savingSettings || event.salesStatus === 'sold-out'}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                event.salesStatus === 'paused' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}>
              {event.salesStatus === 'paused' ? <><Play className="w-4 h-4" /> Reopen sales</> : <><Pause className="w-4 h-4" /> Pause sales</>}
            </button>
            <p className="text-xs text-gray-400 mt-1.5">Paused hides the buy button; the event stays visible.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Food menu link</label>
            <div className="flex gap-2">
              <input value={menuDraft} onChange={(e) => setMenuDraft(e.target.value)} placeholder="/menu"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent" />
              <button onClick={() => saveSettings({ menuUrl: menuDraft })} disabled={savingSettings || menuDraft === event.menuUrl || !menuDraft.trim()}
                className="px-4 py-2.5 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg text-sm font-medium disabled:opacity-40">Save</button>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Your name (for check-in records)</label>
          <input value={staffName} onChange={(e) => rememberStaff(e.target.value)} placeholder="e.g. Sam"
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent sm:w-48" />
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2">
        <button onClick={() => setView('guests')} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${view === 'guests' ? 'bg-[#12292a] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
          <Users className="w-4 h-4" /> Guest list
        </button>
        <button onClick={() => setView('seating')} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${view === 'seating' ? 'bg-[#12292a] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
          <Armchair className="w-4 h-4" /> Seating
        </button>
      </div>

      {view === 'seating' ? (
        <SeatingView token={token} event={event} bookings={bookings}
          onEventUpdate={(e) => setData((prev) => prev ? { ...prev, event: e } : prev)} />
      ) : (
        <>
          {/* Search + sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, attendee, reference, phone, table…"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent" />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-[#c9a55c]">
              <option value="lead">Sort: Lead surname</option>
              <option value="attendee">Sort: Attendee surname</option>
              <option value="table">Sort: Table ref</option>
            </select>
          </div>

          {/* Filters */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {FILTERS.map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.key ? 'bg-[#c9a55c] text-[#12292a]' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Guest list */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="font-medium text-[#12292a]">Guest list</span>
              <span className="text-sm text-gray-500">{filtered.length} {filtered.length === 1 ? 'order' : 'orders'}</span>
            </div>
            {filtered.length === 0 ? (
              <p className="px-6 py-12 text-center text-gray-400 text-sm">
                {bookings.length === 0 ? 'No bookings yet. Use “Add booking” or “Import”.' : 'No matches.'}
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((b) => (
                  <BookingRow key={b.ref} booking={b} event={event} staffName={staffName} authHeaders={authHeaders}
                    open={expanded === b.ref} onToggle={() => setExpanded(expanded === b.ref ? null : b.ref)}
                    onUpdate={updateBookingLocal} />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {showAdd && (
        <ManualBookingModal token={token} event={event} onClose={() => setShowAdd(false)}
          onCreated={(b) => { setShowAdd(false); setData((prev) => prev ? { ...prev, bookings: [b, ...prev.bookings] } : prev); }} />
      )}
      {showImport && (
        <ImportModal token={token} event={event} onClose={() => setShowImport(false)}
          onDone={() => { setShowImport(false); load(); }} />
      )}
    </div>
  );
}

function Stat({ label, value, icon, tint }: { label: string; value: string; icon: React.ReactNode; tint: string }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-[#12292a] mt-0.5">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tint}`}>{icon}</div>
      </div>
    </div>
  );
}

function BookingRow({
  booking, event, staffName, authHeaders, open, onToggle, onUpdate,
}: {
  booking: TicketBooking;
  event: TicketEvent;
  staffName: string;
  authHeaders: () => Record<string, string>;
  open: boolean;
  onToggle: () => void;
  onUpdate: (b: TicketBooking) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [editNames, setEditNames] = useState(false);
  const [names, setNames] = useState<string[]>(booking.attendees);
  const [area, setArea] = useState(booking.viewingArea);
  const [tableRef, setTableRef] = useState(booking.tableRef || '');
  const [source, setSource] = useState(booking.source || 'website');
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus || 'paid');
  const [note, setNote] = useState(booking.adminNote || '');

  useEffect(() => { setNames(booking.attendees); setArea(booking.viewingArea); setTableRef(booking.tableRef || ''); }, [booking]);

  const checks = attendeeCheckins(booking);
  const size = partySizeOf(booking);
  const count = checkedInCountOf(booking);
  const state = arrivalState(booking);

  const act = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ref: booking.ref, by: staffName, ...body }),
      });
      const d = await res.json();
      if (d.booking) onUpdate(d.booking);
    } finally {
      setBusy(false);
    }
  };

  const tableOptions = event.tables.filter((t) => area === 'no-preference' || t.area === area).map((t) => t.ref);

  return (
    <div>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-gray-50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-semibold text-[#12292a]">{booking.ref}</span>
            {state === 'full' ? <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full"><UserCheck className="w-3 h-3" /> In</span>
              : state === 'partial' ? <span className="text-[11px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{count}/{size} in</span> : null}
            {!isPublicSale(booking) && <span className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{sourceLabel(booking.source)}</span>}
          </div>
          <p className="text-sm text-gray-600 truncate">
            {booking.purchaserName} · {size} {size === 1 ? 'guest' : 'guests'} · {booking.viewingAreaLabel}{booking.tableRef ? ` · ${booking.tableRef}` : ''}
          </p>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 bg-gray-50/60 space-y-4">
          {/* Contact + meta */}
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {booking.purchaserEmail && <InfoLine icon={<Mail className="w-4 h-4" />} href={`mailto:${booking.purchaserEmail}`}>{booking.purchaserEmail}</InfoLine>}
            {booking.purchaserPhone && <InfoLine icon={<Phone className="w-4 h-4" />} href={`tel:${booking.purchaserPhone}`}>{booking.purchaserPhone}</InfoLine>}
            <InfoLine icon={<MapPin className="w-4 h-4" />}>{booking.viewingAreaLabel}{booking.tableRef ? ` · Table ${booking.tableRef}` : ' · Unallocated'}</InfoLine>
            <InfoLine icon={<Clock className="w-4 h-4" />}>Booked {fmtDateTime(booking.createdAt)}</InfoLine>
          </div>

          {/* Attendees + per-person check-in */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs uppercase tracking-wide text-gray-400">Attendees ({size}) — tap to check in</p>
              <button onClick={() => setEditNames((s) => !s)} className="text-xs text-[#c9a55c] hover:underline inline-flex items-center gap-1"><Pencil className="w-3 h-3" /> {editNames ? 'Cancel' : 'Edit names'}</button>
            </div>
            {editNames ? (
              <div className="space-y-2">
                {names.map((n, i) => (
                  <input key={i} value={n} onChange={(e) => setNames((p) => p.map((x, idx) => (idx === i ? e.target.value : x)))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                ))}
                <button onClick={() => act({ action: 'update', attendees: names }).then(() => setEditNames(false))} disabled={busy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a55c] text-white rounded-lg text-sm"><Save className="w-3.5 h-3.5" /> Save names</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {booking.attendees.map((name, i) => (
                  <button key={i} onClick={() => act({ action: 'check-in-index', index: i, value: !checks[i] })} disabled={busy}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-60 ${checks[i] ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                    {checks[i] ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs text-gray-400">{i + 1}</span>} {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Check-in actions */}
          <div className="flex flex-wrap gap-2">
            {state !== 'full' ? (
              <button onClick={() => act({ action: 'check-in-all' })} disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />} Check in all ({size})
              </button>
            ) : (
              <button onClick={() => act({ action: 'undo-check-in' })} disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium disabled:opacity-50">
                <RotateCcw className="w-4 h-4" /> Undo check-in
              </button>
            )}
          </div>

          {/* Allocation + details editor */}
          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Viewing area</label>
              <select value={area} onChange={(e) => { setArea(e.target.value); setTableRef(''); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {event.viewingAreas.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Table / seating ref</label>
              <input value={tableRef} onChange={(e) => setTableRef(e.target.value.toUpperCase())} list={`tr-${booking.ref}`}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="e.g. G12" />
              <datalist id={`tr-${booking.ref}`}>{tableOptions.map((r) => <option key={r} value={r} />)}</datalist>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value as typeof source)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {BOOKING_SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Payment</label>
              <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as typeof paymentStatus)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {PAYMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <button onClick={() => act({ action: 'update', viewingArea: area, tableRef, source, paymentStatus })} disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#12292a] text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save allocation & details
          </button>

          {booking.bookingNotes && (
            <div className="rounded-lg bg-white border border-gray-200 p-3">
              <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-400 mb-1"><MessageSquare className="w-3.5 h-3.5" /> Booking notes (not guaranteed)</p>
              <p className="text-sm text-[#12292a]">{booking.bookingNotes}</p>
            </div>
          )}

          {/* Admin note */}
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Internal admin note</label>
            <div className="flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Private note…"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={() => act({ action: 'note', note })} disabled={busy}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 inline-flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /> Save</button>
            </div>
          </div>

          {booking.checkedInAt && (
            <p className="text-xs text-gray-500">Last check-in {fmtDateTime(booking.checkedInAt)}{booking.checkedInBy ? ` by ${booking.checkedInBy}` : ''}</p>
          )}
        </div>
      )}
    </div>
  );
}

function InfoLine({ icon, href, children }: { icon: React.ReactNode; href?: string; children: React.ReactNode }) {
  const content = <span className="flex items-center gap-2 text-gray-600"><span className="text-gray-400">{icon}</span> {children}</span>;
  return href ? <a href={href} className="hover:text-[#12292a]">{content}</a> : content;
}
