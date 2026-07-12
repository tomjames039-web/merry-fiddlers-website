import { type NextRequest, NextResponse } from 'next/server';
import {
  getTicketEvent,
  getBookings,
  createManualBooking,
} from '@/lib/store';
import {
  ARGENTINA_EVENT_ID,
  areaLabel,
  BOOKING_SOURCES,
  type BookingSource,
} from '@/lib/tickets';
import { isAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface ImportRow {
  leadBooker?: string;
  email?: string;
  mobile?: string;
  partySize?: string | number;
  area?: string;
  table?: string;
  notes?: string;
  ref?: string;
  source?: string;
  attendees?: string;
  datetime?: string;
}

type RowStatus = 'ok' | 'duplicate' | 'invalid';

interface RowResult {
  index: number;
  status: RowStatus;
  reason?: string;
  leadBooker: string;
  guests: number;
  attendees: string[];
  externalRef?: string;
  area: string;
  table?: string;
}

function splitAttendees(s?: string): string[] {
  if (!s) return [];
  return s
    .split(/[;|]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

function areaIdFrom(raw: string | undefined, event: { viewingAreas: { id: string; label: string }[] }): string {
  const v = (raw || '').trim().toLowerCase();
  if (!v) return 'no-preference';
  const match = event.viewingAreas.find(
    (a) => a.id === v || a.label.toLowerCase() === v
  );
  return match?.id ?? 'no-preference';
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const eventId = String(body.eventId || ARGENTINA_EVENT_ID);
  const confirm = body.confirm === true;
  const rows: ImportRow[] = Array.isArray(body.rows) ? body.rows : [];
  const by = String(body.by || '').trim() || 'Admin';
  const defaultSource: BookingSource = BOOKING_SOURCES.some(
    (s) => s.value === body.source
  )
    ? body.source
    : 'sevenrooms';

  const event = await getTicketEvent(eventId);
  const existing = await getBookings(eventId);
  const existingRefs = new Set(
    existing
      .map((b) => (b.externalRef || '').trim().toLowerCase())
      .filter(Boolean)
  );
  const existingNamePhone = new Set(
    existing.map(
      (b) =>
        `${b.purchaserName.trim().toLowerCase()}|${(b.purchaserPhone || '').replace(/\D/g, '')}`
    )
  );

  const seenRefs = new Set<string>();
  const seenNamePhone = new Set<string>();
  const results: RowResult[] = [];

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const leadBooker = String(r.leadBooker || '').trim();
    const attendees = splitAttendees(r.attendees);
    const partySize = Math.max(
      1,
      Math.floor(Number(r.partySize) || attendees.length || 1)
    );
    const externalRef = String(r.ref || '').trim();
    const refKey = externalRef.toLowerCase();
    const phoneDigits = String(r.mobile || '').replace(/\D/g, '');
    const namePhoneKey = `${leadBooker.toLowerCase()}|${phoneDigits}`;
    const area = areaIdFrom(r.area, event);

    let status: RowStatus = 'ok';
    let reason: string | undefined;

    if (!leadBooker) {
      status = 'invalid';
      reason = 'Missing lead booker name';
    } else if (refKey && (existingRefs.has(refKey) || seenRefs.has(refKey))) {
      status = 'duplicate';
      reason = 'Booking reference already imported';
    } else if (
      phoneDigits &&
      (existingNamePhone.has(namePhoneKey) || seenNamePhone.has(namePhoneKey))
    ) {
      status = 'duplicate';
      reason = 'Matches an existing name + mobile';
    }

    if (status === 'ok') {
      if (refKey) seenRefs.add(refKey);
      if (phoneDigits) seenNamePhone.add(namePhoneKey);
    }

    results.push({
      index: i,
      status,
      reason,
      leadBooker,
      guests: partySize,
      attendees,
      externalRef: externalRef || undefined,
      area,
      table: String(r.table || '').trim() || undefined,
    });
  }

  const okRows = results.filter((r) => r.status === 'ok');
  const summary = {
    total: results.length,
    importable: okRows.length,
    guests: okRows.reduce((s, r) => s + r.guests, 0),
    duplicates: results.filter((r) => r.status === 'duplicate').length,
    invalid: results.filter((r) => r.status === 'invalid').length,
  };

  // Preview only — do not create anything.
  if (!confirm) {
    return NextResponse.json({ preview: true, summary, results });
  }

  // Confirmed — create the importable rows.
  let created = 0;
  for (let i = 0; i < results.length; i++) {
    const res = results[i];
    if (res.status !== 'ok') continue;
    const r = rows[res.index];
    const attendees = res.attendees.length
      ? res.attendees
      : Array.from({ length: res.guests }, (_, k) => `Guest ${k + 1} of ${res.leadBooker}`);

    await createManualBooking({
      eventId,
      purchaserName: res.leadBooker,
      purchaserEmail: String(r.email || '').trim() || undefined,
      purchaserPhone: String(r.mobile || '').trim() || undefined,
      quantity: res.guests,
      attendees,
      viewingArea: res.area,
      viewingAreaLabel: areaLabel(event, res.area),
      tableRef: res.table,
      bookingNotes: String(r.notes || '').trim().slice(0, 800) || undefined,
      source: defaultSource,
      paymentStatus: 'existing-reservation',
      externalRef: res.externalRef,
      by,
    });
    created += 1;
  }

  return NextResponse.json({
    success: true,
    created,
    skipped: results.length - created,
    summary,
  });
}
