/**
 * Paid event ticketing for The Merry Fiddlers.
 *
 * Built as a small, self-contained extension of the existing architecture:
 *  - Stripe (getStripe / EmbeddedCheckout) handles payment.
 *  - The persistence layer (src/lib/store.ts, Netlify Blobs + fs fallback)
 *    stores the event config and the bookings.
 *  - Fulfillment (src/lib/fulfillment.ts) + the verified Stripe webhook flip a
 *    reserved booking to "paid" and send the confirmation email via Resend.
 *
 * Inventory is DERIVED from the bookings (allocation − paid − active holds),
 * never a decremented counter — this is the safest approach under Netlify
 * Blobs and makes "reduce the allocation below what's sold" impossible to break
 * existing bookings.
 *
 * The model is intentionally generic (an "event" with viewing areas and a sales
 * status) so future fixtures can be added — free booking, paid admission, sold
 * out or coming soon — without rebuilding the ticket system.
 */

export type SalesStatus = 'on-sale' | 'paused' | 'sold-out' | 'coming-soon';

export interface ViewingArea {
  /** stable id stored on the booking, e.g. 'garden'. */
  id: string;
  /** label shown to the customer, e.g. 'Garden'. */
  label: string;
  /** short helper line shown under the option. */
  hint?: string;
}

/** Where a booking originated. */
export type BookingSource =
  | 'website'
  | 'sevenrooms'
  | 'telephone'
  | 'guest-list'
  | 'staff'
  | 'other';

/** The money / reservation status of a booking. */
export type PaymentStatus =
  | 'paid'
  | 'part-paid'
  | 'not-paid'
  | 'complimentary'
  | 'existing-reservation'
  | 'pay-on-arrival' // legacy, still accepted
  | 'unknown'
  | 'refunded'
  | 'cancelled'; // legacy booking-cancel marker

export const BOOKING_SOURCES: { value: BookingSource; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'sevenrooms', label: 'SevenRooms' },
  { value: 'telephone', label: 'Telephone' },
  { value: 'guest-list', label: 'Guest list' },
  { value: 'staff', label: 'Staff' },
  { value: 'other', label: 'Other' },
];

// The statuses offered in the admin dropdowns.
export const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: 'paid', label: 'Paid' },
  { value: 'part-paid', label: 'Part-paid' },
  { value: 'not-paid', label: 'Not paid' },
  { value: 'complimentary', label: 'Complimentary' },
  { value: 'existing-reservation', label: 'Existing reservation' },
  { value: 'unknown', label: 'Unknown' },
];

// All accepted values (incl. legacy) for validation + labelling.
const PAYMENT_LABELS: Record<string, string> = {
  paid: 'Paid',
  'part-paid': 'Part-paid',
  'not-paid': 'Not paid',
  complimentary: 'Complimentary',
  'existing-reservation': 'Existing reservation',
  'pay-on-arrival': 'Pay on arrival',
  unknown: 'Unknown',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_VALUES = Object.keys(PAYMENT_LABELS) as PaymentStatus[];

export function sourceLabel(s?: BookingSource): string {
  return BOOKING_SOURCES.find((x) => x.value === s)?.label ?? 'Website';
}

export function paymentLabel(s?: PaymentStatus): string {
  return PAYMENT_LABELS[s ?? ''] ?? 'Unknown';
}

/** A coloured badge for a payment status (used in Door Mode + guest list). */
export function paymentBadge(
  s?: PaymentStatus
): { label: string; tone: 'ok' | 'warn' | 'danger' | 'muted' } {
  switch (s) {
    case 'paid':
      return { label: 'Paid', tone: 'ok' };
    case 'existing-reservation':
      return { label: 'Prepaid', tone: 'ok' };
    case 'part-paid':
      return { label: 'Part-paid', tone: 'warn' };
    case 'not-paid':
      return { label: 'Not paid', tone: 'danger' };
    case 'unknown':
      return { label: 'Payment unknown', tone: 'warn' };
    case 'complimentary':
      return { label: 'Complimentary', tone: 'muted' };
    case 'pay-on-arrival':
      return { label: 'Pay on arrival', tone: 'warn' };
    case 'refunded':
      return { label: 'Refunded', tone: 'muted' };
    case 'cancelled':
      return { label: 'Cancelled', tone: 'danger' };
    default:
      return { label: 'Paid', tone: 'ok' };
  }
}

/** A seating reference (bench, booth, table) staff can allocate guests to. */
export interface SeatingRef {
  ref: string; // e.g. 'G12'
  area: string; // viewing-area id, e.g. 'garden'
  capacity: number; // typical seats
  notes?: string;
}

/** An entry in a booking's change history. */
export interface BookingHistoryEntry {
  at: string;
  by: string;
  action: string;
  detail?: string;
}

export interface TicketEvent {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  /** human date, e.g. "Wednesday 15 July 2026". */
  dateLabel: string;
  /** ISO date used for ordering / "is it in the past" checks. */
  dateISO: string;
  kickoff: string; // "8:00pm"
  djFrom: string; // "6:30pm"
  djUntil?: string; // "approx 11:00–11:30pm"
  lastFood: string; // "9:30pm"
  /** price per ticket, in pence (GBP). */
  pricePence: number;
  /** public allocation of tickets on sale (editable in admin). */
  allocation: number;
  /** maximum tickets per single transaction. */
  maxPerOrder: number; // default 20
  salesStatus: SalesStatus;
  viewingAreas: ViewingArea[];
  /** seating references staff can allocate guests to (benches, booths, tables). */
  tables: SeatingRef[];
  venue: string;
  /** link to the current food menu (editable in admin). */
  menuUrl: string;
  /** minutes a reservation is held before it can be reclaimed. */
  holdMinutes: number;
  rules: string[];
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'paid' | 'cancelled';

export interface TicketBooking {
  ref: string; // ARG-XXXXX (shown everywhere)
  token: string; // opaque, used for the QR check-in URL
  eventId: string;
  status: BookingStatus;
  quantity: number;
  /** total amount in GBP (set to the paid total once confirmed). */
  amount: number;
  purchaserName: string;
  purchaserEmail: string;
  purchaserPhone: string;
  attendees: string[];
  /** per-attendee check-in, parallel to `attendees` (source of truth for arrivals). */
  attendeesCheckedIn?: boolean[];
  viewingArea: string; // area id
  viewingAreaLabel: string; // area label snapshot
  /** allocated seating reference (bench/booth/table), e.g. 'G12'. */
  tableRef?: string;
  accessibilityNote?: string;
  bookingNotes?: string;
  // Origin & money state (defaults: website / paid for Stripe purchases)
  source?: BookingSource;
  paymentStatus?: PaymentStatus;
  /** external system reference (e.g. a SevenRooms booking ref) for de-duping imports. */
  externalRef?: string;
  /** arrival / reservation time, e.g. "5:45pm" (offline bookings). */
  arrivalTime?: string;
  /** money tracking for offline / SevenRooms bookings (GBP). */
  amountPrepaid?: number;
  amountDue?: number;
  amountWaived?: number;
  // Check-in
  checkedIn: boolean;
  checkedInCount?: number; // for partial arrivals
  checkedInAt?: string;
  checkedInBy?: string;
  partialNote?: string;
  doorNote?: string;
  // Internal
  adminNote?: string;
  history?: BookingHistoryEntry[];
  // Refund tracking
  refundedAt?: string;
  refundId?: string;
  // Payment linkage
  sessionId?: string;
  paymentRef?: string;
  /** ISO time until which a pending reservation holds inventory. */
  heldUntil?: string;
  createdAt: string;
  paidAt?: string;
  /** true for admin-created bookings (SevenRooms, comps, phone, etc.). */
  manual?: boolean;
}

// ---------------------------------------------------------------------------
// The England v Argentina event (default seed).
// ---------------------------------------------------------------------------

export const ARGENTINA_EVENT_ID = 'england-v-argentina';

export const VIEWING_AREAS: ViewingArea[] = [
  {
    id: 'garden',
    label: 'Garden',
    hint: 'The main event area with the four-metre screen',
  },
  { id: 'patio', label: 'Patio', hint: 'Booths, each with its own television' },
  { id: 'bar', label: 'Bar', hint: 'Indoor viewing on the bar TVs' },
  { id: 'no-preference', label: 'No preference', hint: 'Seat me anywhere' },
];

export const EVENT_RULES: string[] = [
  'Every attendee, including children, requires a valid ticket.',
  'Tickets are valid only for the named attendees on the booking.',
  'Tickets are non-refundable.',
  'No outside food or drink is permitted — this includes takeaway food and food deliveries.',
  'Anyone bringing or consuming outside food or drink may be asked to leave.',
  'Management reserves the right to refuse admission or remove anyone behaving dangerously, abusively or inappropriately.',
  'Viewing areas and seating are allocated by the venue and specific requests cannot be guaranteed.',
  'Customers must follow staff instructions throughout the event.',
];

const SEED = '2026-07-12T09:00:00.000Z';

/** Build a run of seating refs, e.g. seatingRun('G', 1, 22, 'garden', 6). */
export function seatingRun(
  prefix: string,
  from: number,
  to: number,
  area: string,
  capacity: number
): SeatingRef[] {
  const out: SeatingRef[] = [];
  for (let n = from; n <= to; n++) {
    out.push({ ref: `${prefix}${String(n).padStart(2, '0')}`, area, capacity });
  }
  return out;
}

/**
 * Default seating layout from the brief:
 *  • Garden: 22 benches (G01–G22), up to 6 each
 *  • Patio: 3 booths (P01–P03)
 *  • Bar: indoor TVs (B01–B02)
 */
export function defaultSeating(): SeatingRef[] {
  return [
    ...seatingRun('G', 1, 22, 'garden', 6),
    ...seatingRun('P', 1, 3, 'patio', 6),
    ...seatingRun('B', 1, 2, 'bar', 10),
  ];
}

export const DEFAULT_ARGENTINA_EVENT: TicketEvent = {
  id: ARGENTINA_EVENT_ID,
  slug: ARGENTINA_EVENT_ID,
  name: 'England v Argentina',
  subtitle: 'Live on the Big Screen',
  dateLabel: 'Wednesday 15 July 2026',
  dateISO: '2026-07-15T19:00:00.000Z', // 8:00pm BST
  kickoff: '8:00pm',
  djFrom: '6:30pm',
  djUntil: 'approx 11:00–11:30pm',
  lastFood: '9:30pm',
  pricePence: 1500,
  allocation: 50,
  maxPerOrder: 20,
  salesStatus: 'on-sale',
  viewingAreas: VIEWING_AREAS,
  tables: defaultSeating(),
  venue: 'The Merry Fiddlers, 4 Fiddlers Hamlet, Epping, CM16 7PY',
  menuUrl: '/menu',
  holdMinutes: 20,
  rules: EVENT_RULES,
  createdAt: SEED,
  updatedAt: SEED,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Characters chosen to be unambiguous when read aloud or typed. */
const REF_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** e.g. ARG-7K4P2 — uniqueness is enforced by the store layer. */
export function generateBookingRef(prefix = 'ARG'): string {
  let body = '';
  for (let i = 0; i < 5; i++) {
    body += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  }
  return `${prefix}-${body}`;
}

/** Opaque token for the QR check-in URL (no customer data inside). */
export function generateBookingToken(): string {
  const a = Math.random().toString(36).slice(2, 12);
  const b = Math.random().toString(36).slice(2, 12);
  const c = Date.now().toString(36);
  return `${a}${b}${c}`;
}

export function areaLabel(event: TicketEvent, id: string): string {
  return event.viewingAreas.find((a) => a.id === id)?.label ?? 'No preference';
}

export function priceGBP(event: TicketEvent): number {
  return event.pricePence / 100;
}

/**
 * The status the customer should actually see. Even when an event is nominally
 * "on-sale", if there are no tickets left it is effectively sold out.
 */
export function effectiveSalesStatus(
  event: TicketEvent,
  remaining: number
): SalesStatus {
  if (event.salesStatus === 'on-sale' && remaining <= 0) return 'sold-out';
  return event.salesStatus;
}

export function isBookable(status: SalesStatus): boolean {
  return status === 'on-sale';
}

// ---------------------------------------------------------------------------
// Check-in + booking helpers (pure — safe on client and server)
// ---------------------------------------------------------------------------

/**
 * Whether a booking consumes a PUBLIC (Stripe/website) ticket from the
 * allocation. Manual bookings (SevenRooms, comps, phone, staff) are extra and
 * are tracked separately, so they never eat into the public 50.
 */
export function isPublicSale(b: {
  source?: BookingSource;
  manual?: boolean;
}): boolean {
  if (b.manual) return false;
  if (b.source && b.source !== 'website') return false;
  return true; // website, or legacy Stripe bookings with no source set
}

/** Per-attendee check-in flags, normalised (falls back to legacy fields). */
export function attendeeCheckins(b: TicketBooking): boolean[] {
  const n = Math.max(b.attendees.length, b.quantity || 0) || 1;
  if (Array.isArray(b.attendeesCheckedIn) && b.attendeesCheckedIn.length === n) {
    return b.attendeesCheckedIn;
  }
  const count = b.checkedIn ? n : b.checkedInCount || 0;
  return Array.from({ length: n }, (_, i) => i < count);
}

export function checkedInCountOf(b: TicketBooking): number {
  return attendeeCheckins(b).filter(Boolean).length;
}

export function partySizeOf(b: TicketBooking): number {
  return Math.max(b.attendees.length, b.quantity || 0) || 1;
}

export function arrivalState(b: TicketBooking): 'none' | 'partial' | 'full' {
  const c = checkedInCountOf(b);
  const n = partySizeOf(b);
  if (c <= 0) return 'none';
  if (c >= n) return 'full';
  return 'partial';
}

export function surnameOf(name: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  return (parts.length > 1 ? parts[parts.length - 1] : parts[0]).toLowerCase();
}

/**
 * Free-text search across a booking: every attendee name, the lead booker,
 * reference, mobile, email and the seating/table reference.
 */
export function matchesBookingQuery(b: TicketBooking, q: string): boolean {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const phone = (b.purchaserPhone || '').replace(/\s/g, '');
  const hay = [
    b.ref,
    b.purchaserName,
    b.purchaserEmail,
    b.purchaserPhone,
    phone,
    b.tableRef,
    b.externalRef,
    ...b.attendees,
  ];
  return hay.some((f) => (f || '').toLowerCase().includes(query));
}

/** Which attendee indexes match a query (for highlighting the matched guest). */
export function matchingAttendeeIndexes(b: TicketBooking, q: string): number[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  return b.attendees
    .map((name, i) => ((name || '').toLowerCase().includes(query) ? i : -1))
    .filter((i) => i >= 0);
}
