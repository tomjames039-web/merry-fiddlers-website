import { type NextRequest, NextResponse } from 'next/server';
import { getTicketEvent, getAvailability, updateTicketEvent } from '@/lib/store';
import {
  ARGENTINA_EVENT_ID,
  effectiveSalesStatus,
  type SalesStatus,
} from '@/lib/tickets';
import { isAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const VALID_STATUSES: SalesStatus[] = [
  'on-sale',
  'paused',
  'sold-out',
  'coming-soon',
];

// GET — public: event config + derived availability + effective status.
// Never returns bookings or any customer data.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug') || ARGENTINA_EVENT_ID;
  const event = await getTicketEvent(slug);
  const availability = await getAvailability(event.id);
  const status = effectiveSalesStatus(event, availability.remaining);

  return NextResponse.json({
    event,
    availability,
    status,
  });
}

// PATCH — admin: change allocation, pause/reopen sales, edit menu link, etc.
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const id: string = body.id || ARGENTINA_EVENT_ID;
  const updates: Record<string, unknown> = {};

  if (body.allocation !== undefined) {
    const n = Number(body.allocation);
    if (!Number.isInteger(n) || n < 0) {
      return NextResponse.json({ error: 'invalid_allocation' }, { status: 400 });
    }
    updates.allocation = n;
  }

  if (body.salesStatus !== undefined) {
    if (!VALID_STATUSES.includes(body.salesStatus)) {
      return NextResponse.json({ error: 'invalid_status' }, { status: 400 });
    }
    updates.salesStatus = body.salesStatus;
  }

  if (typeof body.menuUrl === 'string' && body.menuUrl.trim()) {
    updates.menuUrl = body.menuUrl.trim();
  }

  if (body.maxPerOrder !== undefined) {
    const n = Number(body.maxPerOrder);
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      return NextResponse.json({ error: 'invalid_max' }, { status: 400 });
    }
    updates.maxPerOrder = n;
  }

  if (Array.isArray(body.tables)) {
    updates.tables = body.tables
      .filter(
        (t: unknown): t is { ref: unknown } =>
          !!t && typeof (t as { ref?: unknown }).ref === 'string' &&
          ((t as { ref: string }).ref).trim().length > 0
      )
      .map((t: { ref: string; area?: unknown; capacity?: unknown; notes?: unknown }) => ({
        ref: String(t.ref).trim(),
        area: typeof t.area === 'string' ? t.area : 'garden',
        capacity: Number.isFinite(Number(t.capacity)) ? Number(t.capacity) : 6,
        notes:
          typeof t.notes === 'string' && t.notes.trim()
            ? t.notes.trim()
            : undefined,
      }));
  }

  const event = await updateTicketEvent(id, updates);
  const availability = await getAvailability(id);
  const status = effectiveSalesStatus(event, availability.remaining);

  return NextResponse.json({ success: true, event, availability, status });
}
