'use client';

import { useMemo, useState } from 'react';
import {
  Armchair, AlertTriangle, Plus, Trash2, Save, Loader2, RotateCcw, ChevronDown,
} from 'lucide-react';
import {
  type TicketEvent, type TicketBooking, type SeatingRef,
  partySizeOf, defaultSeating,
} from '@/lib/tickets';

export default function SeatingView({
  token, event, bookings, onEventUpdate,
}: {
  token: string;
  event: TicketEvent;
  bookings: TicketBooking[];
  onEventUpdate: (e: TicketEvent) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [tables, setTables] = useState<SeatingRef[]>(event.tables);
  const [newRef, setNewRef] = useState('');
  const [newArea, setNewArea] = useState(event.viewingAreas[0]?.id ?? 'garden');
  const [newCap, setNewCap] = useState(6);
  const [saving, setSaving] = useState(false);

  // Group bookings by table reference.
  const byTable = useMemo(() => {
    const map = new Map<string, TicketBooking[]>();
    const unallocated: TicketBooking[] = [];
    for (const b of bookings) {
      if (b.tableRef) {
        const key = b.tableRef.toUpperCase();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(b);
      } else unallocated.push(b);
    }
    return { map, unallocated };
  }, [bookings]);

  // Merge configured tables with any ad-hoc refs used by bookings.
  const allRefs = useMemo(() => {
    const refs = new Map<string, SeatingRef>();
    for (const t of event.tables) refs.set(t.ref.toUpperCase(), t);
    for (const key of byTable.map.keys()) {
      if (!refs.has(key)) refs.set(key, { ref: key, area: 'other', capacity: 0 });
    }
    return Array.from(refs.values()).sort((a, b) => a.ref.localeCompare(b.ref));
  }, [event.tables, byTable.map]);

  const areaLabelOf = (id: string) =>
    event.viewingAreas.find((a) => a.id === id)?.label ?? id;

  const saveTables = async (next: SeatingRef[]) => {
    setSaving(true);
    try {
      const res = await fetch('/api/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tables: next }),
      });
      const d = await res.json();
      if (d.event) { onEventUpdate(d.event); setTables(d.event.tables); }
    } finally {
      setSaving(false);
    }
  };

  const addRef = () => {
    const ref = newRef.trim().toUpperCase();
    if (!ref) return;
    const next = [...tables.filter((t) => t.ref.toUpperCase() !== ref), { ref, area: newArea, capacity: newCap }];
    next.sort((a, b) => a.ref.localeCompare(b.ref));
    setTables(next);
    setNewRef('');
    saveTables(next);
  };

  const removeRef = (ref: string) => {
    const next = tables.filter((t) => t.ref !== ref);
    setTables(next);
    saveTables(next);
  };

  const resetLayout = () => {
    if (!confirm('Reset the seating layout to the default (Garden G01–G22, Patio P01–P03, Bar B01–B02)? Existing table allocations on bookings are not changed.')) return;
    const next = defaultSeating();
    setTables(next);
    saveTables(next);
  };

  return (
    <div className="space-y-5">
      {/* Layout editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <button
          onClick={() => setEditing((s) => !s)}
          className="w-full flex items-center justify-between px-5 py-4"
        >
          <span className="flex items-center gap-2 font-semibold text-[#12292a]">
            <Armchair className="w-5 h-5 text-[#c9a55c]" /> Seating layout ({event.tables.length} references)
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${editing ? 'rotate-180' : ''}`} />
        </button>
        {editing && (
          <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Reference</label>
                <input value={newRef} onChange={(e) => setNewRef(e.target.value.toUpperCase())} placeholder="G23" className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Area</label>
                <select value={newArea} onChange={(e) => setNewArea(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {event.viewingAreas.filter((a) => a.id !== 'no-preference').map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Capacity</label>
                <input type="number" min={1} value={newCap} onChange={(e) => setNewCap(Number(e.target.value))} className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <button onClick={addRef} disabled={saving || !newRef.trim()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#12292a] text-white rounded-lg text-sm font-medium disabled:opacity-50">
                <Plus className="w-4 h-4" /> Add
              </button>
              <button onClick={resetLayout} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 text-amber-600 hover:bg-amber-50 rounded-lg text-sm ml-auto">
                <RotateCcw className="w-4 h-4" /> Reset to default
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tables.map((t) => (
                <span key={t.ref} className="inline-flex items-center gap-1.5 bg-gray-100 rounded-full pl-3 pr-1.5 py-1 text-sm">
                  <span className="font-mono font-medium">{t.ref}</span>
                  <span className="text-gray-400 text-xs">·{t.capacity}</span>
                  <button onClick={() => removeRef(t.ref)} className="p-0.5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </span>
              ))}
              {saving && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
            </div>
          </div>
        )}
      </div>

      {/* Tables grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {allRefs.map((t) => {
          const list = byTable.map.get(t.ref.toUpperCase()) || [];
          const allocated = list.reduce((s, b) => s + partySizeOf(b), 0);
          const remaining = t.capacity - allocated;
          const over = t.capacity > 0 && allocated > t.capacity;
          return (
            <div key={t.ref} className={`rounded-xl border p-4 ${over ? 'border-amber-300 bg-amber-50' : 'border-gray-100 bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#12292a]">{t.ref}</span>
                  <span className="text-xs text-gray-400">{areaLabelOf(t.area)}</span>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${over ? 'bg-amber-200 text-amber-800' : remaining === 0 ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                  {allocated}/{t.capacity || '—'}
                </span>
              </div>
              {over && (
                <p className="flex items-center gap-1 text-xs text-amber-700 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5" /> Over capacity — add chairs if needed
                </p>
              )}
              {list.length === 0 ? (
                <p className="text-xs text-gray-400">Empty · {t.capacity} seats</p>
              ) : (
                <div className="space-y-2">
                  {list.map((b) => (
                    <div key={b.ref} className="text-sm">
                      <p className="font-medium text-[#12292a]">{b.purchaserName} <span className="text-gray-400 font-normal">· {partySizeOf(b)}</span></p>
                      <p className="text-xs text-gray-500">{b.attendees.join(', ')}</p>
                      {b.bookingNotes && <p className="text-xs text-amber-600 mt-0.5">{b.bookingNotes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unallocated */}
      {byTable.unallocated.length > 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
          <h4 className="font-semibold text-[#12292a] mb-2 flex items-center gap-2">
            Unallocated
            <span className="text-sm text-gray-500">
              ({byTable.unallocated.length} bookings · {byTable.unallocated.reduce((s, b) => s + partySizeOf(b), 0)} guests)
            </span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {byTable.unallocated.map((b) => (
              <span key={b.ref} className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm">
                {b.purchaserName} <span className="text-gray-400 text-xs">·{partySizeOf(b)}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
