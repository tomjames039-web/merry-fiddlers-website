'use client';

import { useState } from 'react';
import {
  X, Loader2, Upload, Download, CheckCircle2, AlertTriangle, FileWarning,
} from 'lucide-react';
import type { TicketEvent } from '@/lib/tickets';

const HEADER_ALIASES: Record<string, string[]> = {
  leadBooker: ['lead booker', 'lead', 'name', 'booker', 'guest name', 'lead name', 'client'],
  email: ['email', 'e-mail'],
  mobile: ['mobile', 'phone', 'telephone', 'tel', 'contact', 'phone number'],
  partySize: ['party size', 'party', 'guests', 'covers', 'pax', 'size', 'no. of guests', 'number of guests'],
  area: ['area', 'viewing area', 'section'],
  table: ['table', 'seating', 'bench', 'booth', 'table ref'],
  notes: ['notes', 'note', 'comments', 'requests', 'special requests'],
  ref: ['reference', 'ref', 'booking ref', 'confirmation', 'sevenrooms ref', 'external ref', 'booking reference'],
  source: ['source'],
  attendees: ['attendees', 'attendee names', 'guest names', 'names'],
  datetime: ['date', 'time', 'date/time', 'datetime', 'reservation time', 'date & time'],
};

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { cur.push(field); field = ''; }
    else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((c) => c.trim().length));
}

function mapHeader(h: string): string | null {
  const norm = h.trim().toLowerCase();
  for (const [key, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(norm)) return key;
  }
  return null;
}

interface PreviewResult {
  index: number;
  status: 'ok' | 'duplicate' | 'invalid';
  reason?: string;
  leadBooker: string;
  guests: number;
  area: string;
  table?: string;
}
interface Summary {
  total: number; importable: number; guests: number; duplicates: number; invalid: number;
}

const TEMPLATE =
  'Lead Booker,Email,Mobile,Party Size,Date/Time,Area,Table,Notes,Reference,Attendees\n' +
  'Thomas Jones,thomas@email.com,07700900000,5,2026-07-15 20:00,Garden,G12,Birthday group,SR-12345,Thomas Jones;Sarah Jones;Amy Jones;Ben Jones;Kate Jones\n' +
  'Maria Silva,,07700900111,2,2026-07-15 20:00,Patio,P01,,SR-12346,Maria Silva;Joao Silva\n';

export default function ImportModal({
  token, event, onClose, onDone,
}: {
  token: string;
  event: TicketEvent;
  onClose: () => void;
  onDone: () => void;
}) {
  void event;
  const [raw, setRaw] = useState('');
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mappedKeys, setMappedKeys] = useState<string[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [results, setResults] = useState<PreviewResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState<{ created: number; skipped: number } | null>(null);

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sevenrooms-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRaw(String(reader.result || ''));
    reader.readAsText(file);
  };

  const buildPreview = async () => {
    setError('');
    const table = parseCSV(raw);
    if (table.length < 2) {
      setError('Please paste or upload a CSV with a header row and at least one booking.');
      return;
    }
    const headers = table[0].map(mapHeader);
    const mapped = headers.filter(Boolean) as string[];
    if (!mapped.includes('leadBooker')) {
      setError('Could not find a "Lead Booker" (or Name) column. Please check the header row.');
      return;
    }
    setMappedKeys(mapped);
    const parsedRows: Record<string, string>[] = table.slice(1).map((cells) => {
      const obj: Record<string, string> = {};
      headers.forEach((key, i) => {
        if (key) obj[key] = (cells[i] ?? '').trim();
      });
      return obj;
    });
    setRows(parsedRows);

    setBusy(true);
    try {
      const res = await fetch('/api/tickets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rows: parsedRows, confirm: false }),
      });
      const d = await res.json();
      setSummary(d.summary);
      setResults(d.results || []);
    } catch {
      setError('Could not build a preview. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const confirmImport = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/tickets/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rows, confirm: true }),
      });
      const d = await res.json();
      if (d.success) setDone({ created: d.created, skipped: d.skipped });
      else setError('Import failed. Please try again.');
    } catch {
      setError('Import failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !busy && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#12292a] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#c9a55c]" /> Import bookings (CSV)
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#12292a] mb-2">Import complete</h3>
              <p className="text-gray-600">
                Created <strong>{done.created}</strong> booking{done.created === 1 ? '' : 's'}.
                {done.skipped > 0 && <> Skipped {done.skipped} (duplicates or invalid).</>}
              </p>
              <button onClick={onDone} className="mt-6 px-6 py-2.5 bg-[#12292a] text-white rounded-lg font-medium">Done</button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={downloadTemplate} className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4" /> Download template
                </button>
                <label className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
                  <Upload className="w-4 h-4" /> Upload CSV
                  <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">…or paste CSV here</label>
                <textarea
                  value={raw}
                  onChange={(e) => setRaw(e.target.value)}
                  rows={5}
                  placeholder="Lead Booker,Email,Mobile,Party Size,Area,Table,Notes,Reference,Attendees…"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#c9a55c]"
                />
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-red-600">
                  <FileWarning className="w-4 h-4" /> {error}
                </p>
              )}

              {!summary ? (
                <button
                  onClick={buildPreview}
                  disabled={busy || !raw.trim()}
                  className="w-full py-3 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Preview import
                </button>
              ) : (
                <>
                  <div className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-gray-100 text-center">
                      <PreviewStat label="Bookings" value={summary.total} />
                      <PreviewStat label="Importable" value={summary.importable} tone="green" />
                      <PreviewStat label="Guests" value={summary.guests} />
                      <PreviewStat label="Duplicates" value={summary.duplicates} tone="amber" />
                      <PreviewStat label="Invalid" value={summary.invalid} tone="red" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Mapped columns: {mappedKeys.join(', ') || 'none'}</p>

                  <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-50">
                    {results.map((r) => (
                      <div key={r.index} className="flex items-center gap-2 px-3 py-2 text-sm">
                        {r.status === 'ok' ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          : r.status === 'duplicate' ? <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          : <FileWarning className="w-4 h-4 text-red-500 shrink-0" />}
                        <span className="font-medium text-[#12292a] truncate">{r.leadBooker || '(no name)'}</span>
                        <span className="text-gray-400">· {r.guests}g · {r.area}{r.table ? ` · ${r.table}` : ''}</span>
                        {r.reason && <span className="ml-auto text-xs text-gray-400 truncate">{r.reason}</span>}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => { setSummary(null); setResults([]); }} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm">
                      Back
                    </button>
                    <button
                      onClick={confirmImport}
                      disabled={busy || summary.importable === 0}
                      className="flex-1 py-2.5 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Import {summary.importable} booking{summary.importable === 1 ? '' : 's'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewStat({ label, value, tone }: { label: string; value: number; tone?: 'green' | 'amber' | 'red' }) {
  const cls = tone === 'green' ? 'text-green-600' : tone === 'amber' ? 'text-amber-600' : tone === 'red' ? 'text-red-600' : 'text-[#12292a]';
  return (
    <div className="py-3">
      <div className={`text-xl font-bold ${cls}`}>{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-gray-400">{label}</div>
    </div>
  );
}
