import { type NextRequest, NextResponse } from 'next/server';
import {
  getTicketEvent,
  getAvailability,
  getBookings,
  getBookingByToken,
  updateBooking,
  createManualBooking,
} from '@/lib/store';
import {
  ARGENTINA_EVENT_ID,
  areaLabel,
  attendeeCheckins,
  partySizeOf,
  BOOKING_SOURCES,
  PAYMENT_STATUSES,
  type BookingSource,
  type PaymentStatus,
  type TicketBooking,
  type BookingHistoryEntry,
} from '@/lib/tickets';
import { isAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// GET — admin only.
//  • ?token=… → look up a single booking (for the QR check-in screen)
//  • otherwise → event + availability + the confirmed guest list
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = request.nextUrl.searchParams.get('token');
  if (token) {
    const booking = await getBookingByToken(token);
    if (!booking) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    const event = await getTicketEvent(booking.eventId);
    return NextResponse.json({ booking, event });
  }

  const eventId = request.nextUrl.searchParams.get('slug') || ARGENTINA_EVENT_ID;
  const event = await getTicketEvent(eventId);
  const availability = await getAvailability(eventId);
  const all = await getBookings(eventId);
  // Guest list = every confirmed booking (website + manual), not pending holds.
  const bookings = all.filter((b) => b.status === 'paid');

  return NextResponse.json({ event, availability, bookings });
}

// ---------------------------------------------------------------------------
// POST — admin only: create a manual booking (SevenRooms / phone / comp / etc.)
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const eventId = String(body.eventId || ARGENTINA_EVENT_ID);
  const event = await getTicketEvent(eventId);

  const purchaserName = String(body.purchaserName || '').trim();
  if (!purchaserName) {
    return NextResponse.json({ error: 'missing_lead_name' }, { status: 400 });
  }

  const quantity = Math.max(1, Math.floor(Number(body.partySize || body.quantity) || 1));

  // Normalise attendee names to the party size, padding with placeholders.
  const rawAttendees = Array.isArray(body.attendees) ? body.attendees : [];
  const attendees: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const name = String(rawAttendees[i] || '').trim();
    attendees.push(name || `Guest ${i + 1} of ${purchaserName}`);
  }

  const source: BookingSource = BOOKING_SOURCES.some((s) => s.value === body.source)
    ? body.source
    : 'other';
  const paymentStatus: PaymentStatus = PAYMENT_STATUSES.some(
    (s) => s.value === body.paymentStatus
  )
    ? body.paymentStatus
    : 'existing-reservation';

  const viewingArea =
    typeof body.viewingArea === 'string' &&
    event.viewingAreas.some((a) => a.id === body.viewingArea)
      ? body.viewingArea
      : 'no-preference';

  const booking = await createManualBooking({
    eventId,
    purchaserName,
    purchaserEmail: String(body.purchaserEmail || '').trim() || undefined,
    purchaserPhone: String(body.purchaserPhone || '').trim() || undefined,
    quantity,
    attendees,
    viewingArea,
    viewingAreaLabel: areaLabel(event, viewingArea),
    tableRef: String(body.tableRef || '').trim() || undefined,
    bookingNotes: String(body.bookingNotes || '').trim().slice(0, 800) || undefined,
    source,
    paymentStatus,
    externalRef: String(body.externalRef || '').trim() || undefined,
    amount: Number.isFinite(Number(body.amount)) ? Number(body.amount) : 0,
    by: String(body.by || '').trim() || 'Admin',
  });

  return NextResponse.json({ success: true, booking });
}

// ---------------------------------------------------------------------------
// PATCH — admin only: check-in actions + edits. Records booking history.
// ---------------------------------------------------------------------------
function pushHistory(
  b: TicketBooking,
  entry: BookingHistoryEntry
): BookingHistoryEntry[] {
  return [...(b.history || []), entry].slice(-50);
}

function checkinPatch(
  b: TicketBooking,
  checks: boolean[],
  by: string,
  action: string,
  detail?: string
): Partial<TicketBooking> {
  const n = checks.length;
  const count = checks.filter(Boolean).length;
  const now = new Date().toISOString();
  return {
    attendeesCheckedIn: checks,
    checkedIn: n > 0 && count >= n,
    checkedInCount: count,
    checkedInAt: count > 0 ? now : undefined,
    checkedInBy: count > 0 ? by : undefined,
    history: pushHistory(b, { at: now, by, action, detail }),
  };
}

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const ref = String(body.ref || '').trim().toUpperCase();
  const action = String(body.action || '');
  const by = String(body.by || '').trim() || 'Staff';
  if (!ref) {
    return NextResponse.json({ error: 'missing_ref' }, { status: 400 });
  }

  const current = await getBookings().then((all) =>
    all.find((b) => b.ref === ref)
  );
  if (!current) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const checks = attendeeCheckins(current);
  const size = partySizeOf(current);
  const now = new Date().toISOString();
  let updates: Partial<TicketBooking>;

  switch (action) {
    case 'check-in':
    case 'check-in-all':
      updates = checkinPatch(current, checks.map(() => true), by, 'check-in-all', 'Whole party checked in');
      break;
    case 'undo-check-in':
    case 'check-in-none':
      updates = checkinPatch(current, checks.map(() => false), by, 'undo-check-in', 'Check-in reset');
      break;
    case 'check-in-index': {
      const index = Number(body.index);
      const value = body.value !== false; // default true
      if (!Number.isInteger(index) || index < 0 || index >= size) {
        return NextResponse.json({ error: 'invalid_index' }, { status: 400 });
      }
      const next = [...checks];
      next[index] = value;
      updates = checkinPatch(
        current,
        next,
        by,
        value ? 'check-in-one' : 'undo-one',
        `${current.attendees[index] || `Guest ${index + 1}`}`
      );
      break;
    }
    case 'check-in-count': {
      const count = Math.max(0, Math.min(size, Math.floor(Number(body.count) || 0)));
      const next = Array.from({ length: size }, (_, i) => i < count);
      updates = checkinPatch(current, next, by, 'check-in-count', `${count}/${size} arrived`);
      break;
    }
    case 'update': {
      updates = { history: pushHistory(current, { at: now, by, action: 'edited' }) };
      // Attendee names
      if (Array.isArray(body.attendees)) {
        const names = body.attendees.map((a: unknown) => String(a || '').trim());
        const cleaned = names.map(
          (nm: string, i: number) => nm || `Guest ${i + 1} of ${current.purchaserName}`
        );
        updates.attendees = cleaned;
        updates.quantity = cleaned.length;
        // resize check-ins to match
        const resized = cleaned.map((_: string, i: number) => checks[i] ?? false);
        const count = resized.filter(Boolean).length;
        updates.attendeesCheckedIn = resized;
        updates.checkedIn = resized.length > 0 && count >= resized.length;
        updates.checkedInCount = count;
      }
      // Seating / area
      if (typeof body.tableRef === 'string') {
        updates.tableRef = body.tableRef.trim() || undefined;
      }
      if (typeof body.viewingArea === 'string') {
        const event = await getTicketEvent(current.eventId);
        if (event.viewingAreas.some((a) => a.id === body.viewingArea)) {
          updates.viewingArea = body.viewingArea;
          updates.viewingAreaLabel = areaLabel(event, body.viewingArea);
        }
      }
      // Lead details
      if (typeof body.purchaserName === 'string' && body.purchaserName.trim())
        updates.purchaserName = body.purchaserName.trim();
      if (typeof body.purchaserEmail === 'string')
        updates.purchaserEmail = body.purchaserEmail.trim();
      if (typeof body.purchaserPhone === 'string')
        updates.purchaserPhone = body.purchaserPhone.trim();
      // Source / payment
      if (BOOKING_SOURCES.some((s) => s.value === body.source))
        updates.source = body.source;
      if (PAYMENT_STATUSES.some((s) => s.value === body.paymentStatus)) {
        updates.paymentStatus = body.paymentStatus;
        if (body.paymentStatus === 'cancelled') updates.status = 'cancelled';
        else if (current.status === 'cancelled') updates.status = 'paid';
      }
      // Notes
      if (typeof body.bookingNotes === 'string')
        updates.bookingNotes = body.bookingNotes.trim().slice(0, 800) || undefined;
      if (typeof body.adminNote === 'string')
        updates.adminNote = body.adminNote.trim().slice(0, 1000) || undefined;
      if (typeof body.externalRef === 'string')
        updates.externalRef = body.externalRef.trim() || undefined;
      break;
    }
    case 'note':
      updates = {
        adminNote:
          typeof body.note === 'string' ? body.note.trim().slice(0, 1000) : '',
        history: pushHistory(current, { at: now, by, action: 'note' }),
      };
      break;
    case 'door-note':
      updates = {
        doorNote:
          typeof body.doorNote === 'string' ? body.doorNote.trim().slice(0, 300) : '',
        history: pushHistory(current, { at: now, by, action: 'door-note' }),
      };
      break;
    default:
      return NextResponse.json({ error: 'invalid_action' }, { status: 400 });
  }

  const updated = await updateBooking(ref, updates);
  if (!updated) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, booking: updated });
}
