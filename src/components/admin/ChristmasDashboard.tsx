'use client';

import { useMemo, useState } from 'react';
import {
  TreePine, PartyPopper, CalendarDays, Users, Search, Download, X,
  Phone, Mail, Building2, ChevronDown, Save, Trash2, AlertTriangle,
  CheckCircle2, Clock, UserCheck,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types (kept structurally compatible with the admin page's Lead)
// ---------------------------------------------------------------------------

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'lost';

export interface FestiveLead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  eventType?: string;
  expectedGuests?: string;
  preferredDate?: string;
  message?: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  lastContactedAt?: string;
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Christmas Day capacity target. Change here if the plan changes. */
const CHRISTMAS_DAY_TARGET = 100;

interface Bucket {
  key: string;
  source: string;
  label: string;
  short: string;
  dateLine: string;
  accent: string;
  chip: string;
}

const BUCKETS: Bucket[] = [
  {
    key: 'christmas-day',
    source: 'christmas-day-reservation',
    label: 'Christmas Day reservations',
    short: 'Christmas Day',
    dateLine: 'Fri 25 Dec 2026',
    accent: 'bg-[#8c2f39]',
    chip: 'bg-[#8c2f39]/10 text-[#8c2f39] border-[#8c2f39]/25',
  },
  {
    key: 'parties',
    source: 'christmas-party-enquiry',
    label: 'Christmas party enquiries',
    short: 'Parties',
    dateLine: 'December 2026',
    accent: 'bg-[#2d4a4a]',
    chip: 'bg-[#2d4a4a]/10 text-[#2d4a4a] border-[#2d4a4a]/25',
  },
  {
    key: 'christmas-eve',
    source: 'festive-christmas-eve',
    label: 'Christmas Eve',
    short: 'Christmas Eve',
    dateLine: 'Thu 24 Dec 2026',
    accent: 'bg-[#9c7e3f]',
    chip: 'bg-[#c9a55c]/15 text-[#8a6c2f] border-[#c9a55c]/35',
  },
  {
    key: 'boxing-day',
    source: 'festive-boxing-day',
    label: 'Boxing Day',
    short: 'Boxing Day',
    dateLine: 'Sat 26 Dec 2026',
    accent: 'bg-[#9c7e3f]',
    chip: 'bg-[#c9a55c]/15 text-[#8a6c2f] border-[#c9a55c]/35',
  },
  {
    key: 'nye',
    source: 'festive-new-years-eve',
    label: "New Year's Eve",
    short: "New Year's Eve",
    dateLine: 'Thu 31 Dec 2026',
    accent: 'bg-[#9c7e3f]',
    chip: 'bg-[#c9a55c]/15 text-[#8a6c2f] border-[#c9a55c]/35',
  },
  {
    key: 'nyd',
    source: 'festive-new-years-day',
    label: "New Year's Day",
    short: "New Year's Day",
    dateLine: 'Fri 1 Jan 2027',
    accent: 'bg-[#9c7e3f]',
    chip: 'bg-[#c9a55c]/15 text-[#8a6c2f] border-[#c9a55c]/35',
  },
];

const FESTIVE_SOURCES = new Set(BUCKETS.map((b) => b.source));

export function isFestiveLead(source: string): boolean {
  return FESTIVE_SOURCES.has(source);
}

/** Status vocabulary, reworded for a festive booking rather than a sales lead. */
const STATUS: Record<
  LeadStatus,
  { label: string; hint: string; cls: string; dot: string }
> = {
  new: {
    label: 'Reserved',
    hint: 'Awaiting menu & terms',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  contacted: {
    label: 'Contacted',
    hint: 'Menu sent, awaiting reply',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  booked: {
    label: 'Confirmed',
    hint: 'Deposit / terms agreed',
    cls: 'bg-[#8c2f39]/10 text-[#8c2f39] border-[#8c2f39]/25',
    dot: 'bg-[#8c2f39]',
  },
  lost: {
    label: 'Cancelled',
    hint: 'No longer coming',
    cls: 'bg-gray-100 text-gray-600 border-gray-200',
    dot: 'bg-gray-400',
  },
};

const STATUS_ORDER: LeadStatus[] = ['new', 'contacted', 'booked', 'lost'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** The forms write "Label: value" lines — turn them back into rows. */
function parseDetails(message?: string): { label: string; value: string }[] {
  if (!message) return [];
  return message
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return null;
      const label = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (!label || !value) return null;
      return { label, value };
    })
    .filter((r): r is { label: string; value: string } => r !== null);
}

function guestsOf(lead: FestiveLead): number {
  const raw = (lead.expectedGuests || '').match(/\d+/);
  return raw ? Number.parseInt(raw[0], 10) : 0;
}

function companyOf(lead: FestiveLead): string {
  const row = parseDetails(lead.message).find(
    (r) => r.label.toLowerCase() === 'company'
  );
  const v = row?.value ?? '';
  return v && v.toLowerCase() !== 'not given' ? v : '';
}

function fmtDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function downloadCSV(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  leads: FestiveLead[];
  onPatch: (id: string, updates: Partial<FestiveLead>) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
}

export default function ChristmasDashboard({ leads, onPatch, onDelete }: Props) {
  const [filter, setFilter] = useState<string>('christmas-day');
  const [search, setSearch] = useState('');
  const [hideCancelled, setHideCancelled] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const festive = useMemo(
    () =>
      leads
        .filter((l) => isFestiveLead(l.source))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [leads]
  );

  const bySource = useMemo(() => {
    const map: Record<string, FestiveLead[]> = {};
    for (const b of BUCKETS) map[b.source] = [];
    for (const l of festive) map[l.source]?.push(l);
    return map;
  }, [festive]);

  // ---- Christmas Day headline numbers ----
  const cdAll = bySource['christmas-day-reservation'] ?? [];
  const cdLive = cdAll.filter((l) => l.status !== 'lost');
  const cdCovers = cdLive.reduce((s, l) => s + guestsOf(l), 0);
  const cdConfirmedCovers = cdLive
    .filter((l) => l.status === 'booked')
    .reduce((s, l) => s + guestsOf(l), 0);
  const cdPct = Math.min(100, Math.round((cdCovers / CHRISTMAS_DAY_TARGET) * 100));
  const cdRemaining = Math.max(0, CHRISTMAS_DAY_TARGET - cdCovers);
  const cdAwaiting = cdLive.filter((l) => l.status === 'new').length;

  // ---- Party numbers ----
  const partyAll = bySource['christmas-party-enquiry'] ?? [];
  const partyLive = partyAll.filter((l) => l.status !== 'lost');
  const partyGuests = partyLive.reduce((s, l) => s + guestsOf(l), 0);
  const partyNew = partyLive.filter((l) => l.status === 'new').length;

  // ---- Other festive dates ----
  const otherKeys = ['christmas-eve', 'boxing-day', 'nye', 'nyd'];
  const otherCount = BUCKETS.filter((b) => otherKeys.includes(b.key)).reduce(
    (s, b) => s + (bySource[b.source]?.length ?? 0),
    0
  );

  // ---- Visible list ----
  const visible = useMemo(() => {
    const bucket = BUCKETS.find((b) => b.key === filter);
    let list =
      filter === 'all'
        ? festive
        : filter === 'festive-dates'
          ? festive.filter((l) =>
              BUCKETS.filter((b) => otherKeys.includes(b.key))
                .map((b) => b.source)
                .includes(l.source)
            )
          : bucket
            ? (bySource[bucket.source] ?? [])
            : festive;

    if (hideCancelled) list = list.filter((l) => l.status !== 'lost');

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((l) =>
        [l.fullName, l.email, l.phone, l.message, companyOf(l)]
          .some((f) => (f || '').toLowerCase().includes(q))
      );
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, festive, bySource, hideCancelled, search]);

  const bucketOf = (source: string) =>
    BUCKETS.find((b) => b.source === source);

  const exportCurrent = () => {
    const label =
      filter === 'all'
        ? 'all-festive'
        : filter === 'festive-dates'
          ? 'festive-dates'
          : filter;
    const rows: string[][] = [
      [
        'Occasion',
        'Name',
        'Company',
        'Guests',
        'Email',
        'Phone',
        'Status',
        'Received',
        'Details',
        'Internal notes',
      ],
      ...visible.map((l) => [
        bucketOf(l.source)?.short ?? l.source,
        l.fullName,
        companyOf(l),
        l.expectedGuests || '',
        l.email,
        l.phone || '',
        STATUS[l.status].label,
        fmtDate(l.createdAt),
        (l.message || '').replace(/\n/g, ' | '),
        l.notes || '',
      ]),
    ];
    downloadCSV(`christmas-${label}-${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  const openLead = (l: FestiveLead) => {
    if (openId === l.id) {
      setOpenId(null);
      return;
    }
    setOpenId(l.id);
    setNoteDraft(l.notes || '');
  };

  return (
    <div className="space-y-6">
      {/* ---------------- Headline cards ---------------- */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Christmas Day covers */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-[#8c2f39] flex items-center justify-center">
                <TreePine className="w-5 h-5 text-[#f7e6c9]" />
              </span>
              <div>
                <h3 className="font-semibold text-[#2d4a4a] leading-tight">
                  Christmas Day covers
                </h3>
                <p className="text-sm text-gray-500">Friday 25 December 2026</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-[#8c2f39] leading-none">
                {cdCovers}
                <span className="text-lg text-gray-400 font-normal">
                  /{CHRISTMAS_DAY_TARGET}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {cdRemaining > 0 ? `${cdRemaining} left` : 'Target reached'}
              </p>
            </div>
          </div>

          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#8c2f39] to-[#c9a55c] transition-all"
              style={{ width: `${cdPct}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 text-center">
            <div className="rounded-lg bg-gray-50 py-3">
              <p className="text-xl font-semibold text-[#2d4a4a]">{cdLive.length}</p>
              <p className="text-xs text-gray-500 mt-0.5">Reservations</p>
            </div>
            <div className="rounded-lg bg-gray-50 py-3">
              <p className="text-xl font-semibold text-[#8c2f39]">{cdConfirmedCovers}</p>
              <p className="text-xs text-gray-500 mt-0.5">Confirmed covers</p>
            </div>
            <div className="rounded-lg bg-gray-50 py-3">
              <p className="text-xl font-semibold text-emerald-600">{cdAwaiting}</p>
              <p className="text-xs text-gray-500 mt-0.5">Awaiting contact</p>
            </div>
          </div>

          {cdCovers > CHRISTMAS_DAY_TARGET && (
            <p className="mt-4 flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              You are over the {CHRISTMAS_DAY_TARGET}-cover target. Consider
              closing reservations or confirming which are firm.
            </p>
          )}
        </div>

        {/* Parties + other dates */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-[#2d4a4a] flex items-center justify-center">
                <PartyPopper className="w-5 h-5 text-[#c9a55c]" />
              </span>
              <div>
                <h3 className="font-semibold text-[#2d4a4a] leading-tight">
                  Party enquiries
                </h3>
                <p className="text-xs text-gray-500">December 2026</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-[#2d4a4a] leading-none">
                  {partyLive.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {partyNew} new to action
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#c9a55c] leading-none">
                  {partyGuests}
                </p>
                <p className="text-xs text-gray-500 mt-1">guests enquired</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-[#9c7e3f] flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </span>
              <div>
                <h3 className="font-semibold text-[#2d4a4a] leading-tight">
                  Festive dates
                </h3>
                <p className="text-xs text-gray-500">Eve · Boxing · NYE · NYD</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-[#9c7e3f] leading-none">
              {otherCount}
            </p>
            <p className="text-xs text-gray-500 mt-1">on the contact list</p>
          </div>
        </div>
      </div>

      {/* ---------------- Filters ---------------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: 'christmas-day', label: 'Christmas Day', count: cdAll.length },
            { key: 'parties', label: 'Parties', count: partyAll.length },
            { key: 'festive-dates', label: 'Festive dates', count: otherCount },
            { key: 'all', label: 'Everything', count: festive.length },
          ].map((f) => (
            <button
              type="button"
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-[#2d4a4a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === f.key ? 'bg-white/20' : 'bg-white'
                }`}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, company, email, phone or details…"
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap px-1">
            <input
              type="checkbox"
              checked={hideCancelled}
              onChange={(e) => setHideCancelled(e.target.checked)}
              className="w-4 h-4 accent-[#8c2f39]"
            />
            Hide cancelled
          </label>
          <button
            type="button"
            onClick={exportCurrent}
            disabled={visible.length === 0}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#c9a55c] hover:bg-[#b8944b] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export list
          </button>
        </div>
      </div>

      {/* ---------------- List ---------------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {visible.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <TreePine className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Nothing here yet.</p>
            <p className="text-sm text-gray-400 mt-1">
              Reservations and enquiries from the Christmas pages appear here
              automatically.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {visible.map((l) => {
              const bucket = bucketOf(l.source);
              const isOpen = openId === l.id;
              const details = parseDetails(l.message);
              const company = companyOf(l);
              const guests = guestsOf(l);

              return (
                <li key={l.id}>
                  {/* Row */}
                  <div className="px-4 sm:px-6 py-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <button
                        type="button"
                        onClick={() => openLead(l)}
                        className="flex-1 min-w-0 text-left group"
                      >
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-semibold text-[#2d4a4a] group-hover:text-[#8c2f39] transition-colors">
                            {l.fullName || 'No name given'}
                          </span>
                          {bucket && (
                            <span
                              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${bucket.chip}`}
                            >
                              {bucket.short}
                            </span>
                          )}
                          {guests > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                              <Users className="w-3 h-3" /> {guests}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                          {company && (
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="w-3 h-3" /> {company}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {l.email}
                          </span>
                          {l.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {l.phone}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {fmtDate(l.createdAt)}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STATUS[l.status].cls}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS[l.status].dot}`} />
                          {STATUS[l.status].label}
                        </span>
                        <button
                          type="button"
                          onClick={() => openLead(l)}
                          className="p-1.5 text-gray-400 hover:text-[#2d4a4a] hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label={isOpen ? 'Collapse' : 'Expand'}
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded */}
                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-6 bg-gray-50/70 border-t border-gray-100">
                      <div className="grid lg:grid-cols-2 gap-6 pt-5">
                        {/* Details */}
                        <div>
                          <h4 className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-bold mb-3">
                            What they told us
                          </h4>
                          {details.length > 0 ? (
                            <dl className="rounded-lg border border-gray-200 bg-white overflow-hidden text-sm">
                              {details.map((d, i) => (
                                <div
                                  key={`${d.label}-${d.value}`}
                                  className={`flex flex-col sm:flex-row sm:gap-4 px-4 py-2.5 ${i % 2 ? 'bg-gray-50/60' : ''}`}
                                >
                                  <dt className="text-gray-500 sm:w-44 flex-shrink-0">
                                    {d.label}
                                  </dt>
                                  <dd className="text-[#2d4a4a] font-medium break-words">
                                    {d.value}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          ) : (
                            <p className="text-sm text-gray-400">
                              No extra details supplied.
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 mt-4">
                            <a
                              href={`mailto:${l.email}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:border-[#2d4a4a] rounded-lg text-sm text-[#2d4a4a] transition-colors"
                            >
                              <Mail className="w-4 h-4" /> Email
                            </a>
                            {l.phone && (
                              <a
                                href={`tel:${l.phone.replace(/\s/g, '')}`}
                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:border-[#2d4a4a] rounded-lg text-sm text-[#2d4a4a] transition-colors"
                              >
                                <Phone className="w-4 h-4" /> Call
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Manage */}
                        <div>
                          <h4 className="text-[11px] uppercase tracking-[0.16em] text-gray-500 font-bold mb-3">
                            Where it&rsquo;s up to
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                            {STATUS_ORDER.map((s) => (
                              <button
                                type="button"
                                key={s}
                                onClick={() =>
                                  onPatch(l.id, {
                                    status: s,
                                    ...(s === 'contacted'
                                      ? { lastContactedAt: new Date().toISOString() }
                                      : {}),
                                  })
                                }
                                className={`px-2 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                                  l.status === s
                                    ? `${STATUS[s].cls} ring-2 ring-offset-1 ring-[#2d4a4a]/20`
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}
                                title={STATUS[s].hint}
                              >
                                {STATUS[s].label}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 -mt-3 mb-4">
                            {STATUS[l.status].hint}
                            {l.lastContactedAt
                              ? ` · last contacted ${fmtDate(l.lastContactedAt)}`
                              : ''}
                          </p>

                          <label
                            className="block text-[11px] uppercase tracking-[0.16em] text-gray-500 font-bold mb-2"
                            htmlFor={`note-${l.id}`}
                          >
                            Internal notes
                          </label>
                          <textarea
                            id={`note-${l.id}`}
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            rows={3}
                            placeholder="Table allocated, deposit taken, dietary flagged to kitchen…"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                          />
                          <div className="flex flex-wrap items-center gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => onPatch(l.id, { notes: noteDraft })}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Save className="w-4 h-4" /> Save note
                            </button>

                            {confirmDelete === l.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDelete(l.id);
                                    setConfirmDelete(null);
                                    setOpenId(null);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete for good
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDelete(null)}
                                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(l.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Prefer &ldquo;Cancelled&rdquo; over deleting — it keeps
                            the record and the covers count stays honest.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ---------------- Per-date summary ---------------- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 font-medium text-[#2d4a4a] flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-[#c9a55c]" /> Every festive date at a glance
        </div>
        <div className="divide-y divide-gray-100">
          {BUCKETS.map((b) => {
            const list = (bySource[b.source] ?? []).filter((l) => l.status !== 'lost');
            const guests = list.reduce((s, l) => s + guestsOf(l), 0);
            const confirmed = list.filter((l) => l.status === 'booked').length;
            return (
              <button
                type="button"
                key={b.key}
                onClick={() => {
                  setFilter(b.key);
                  setSearch('');
                }}
                className="w-full px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-8 rounded-full ${b.accent}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-[#2d4a4a] truncate">{b.label}</p>
                    <p className="text-xs text-gray-500">{b.dateLine}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-sm flex-shrink-0">
                  <span className="text-gray-500">
                    <strong className="text-[#2d4a4a]">{list.length}</strong> entries
                  </span>
                  <span className="text-gray-500 hidden sm:inline">
                    <strong className="text-[#2d4a4a]">{guests}</strong> guests
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#8c2f39]">
                    <CheckCircle2 className="w-4 h-4" />
                    {confirmed}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
