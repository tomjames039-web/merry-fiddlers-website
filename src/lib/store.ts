import fs from 'node:fs/promises';
import path from 'node:path';
import {
  DEFAULT_WHATS_ON,
  type WhatsOnItem,
  sortWhatsOn,
} from './whatsOn';
import {
  type TicketEvent,
  type TicketBooking,
  type BookingSource,
  type PaymentStatus,
  DEFAULT_ARGENTINA_EVENT,
  ARGENTINA_EVENT_ID,
  generateBookingRef,
  generateBookingToken,
  isPublicSale,
} from './tickets';

/**
 * Persistence layer for The Merry Fiddlers.
 *
 * Primary store: Netlify Blobs (works automatically on Netlify, no setup).
 * Fallback store: local JSON files under `.data/` (used in local dev / preview).
 *
 * Each "collection" is a folder of records keyed by a string id.
 */

const DATA_DIR = path.join(process.cwd(), '.data');

// Cache whether Netlify Blobs is usable so we don't retry on every call.
let blobsUsable: boolean | null = null;

async function getBlobStore(collection: string) {
  const { getStore } = await import('@netlify/blobs');
  return getStore({ name: `mf-${collection}`, consistency: 'strong' });
}

async function blobsAreUsable(): Promise<boolean> {
  if (blobsUsable !== null) return blobsUsable;
  try {
    const store = await getBlobStore('healthcheck');
    // A no-op read confirms the environment is configured.
    await store.get('__ping__');
    blobsUsable = true;
  } catch {
    blobsUsable = false;
  }
  return blobsUsable;
}

// ---------------------------------------------------------------------------
// Filesystem helpers (dev fallback)
// ---------------------------------------------------------------------------

function safeKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function fsDir(collection: string): string {
  return path.join(DATA_DIR, collection);
}

function fsFile(collection: string, key: string): string {
  return path.join(fsDir(collection), `${safeKey(key)}.json`);
}

async function fsPut<T>(collection: string, key: string, value: T): Promise<void> {
  await fs.mkdir(fsDir(collection), { recursive: true });
  await fs.writeFile(fsFile(collection, key), JSON.stringify(value, null, 2), 'utf8');
}

async function fsGet<T>(collection: string, key: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(fsFile(collection, key), 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function fsList<T>(collection: string): Promise<T[]> {
  try {
    const files = await fs.readdir(fsDir(collection));
    const out: T[] = [];
    for (const f of files) {
      if (!f.endsWith('.json')) continue;
      const raw = await fs.readFile(path.join(fsDir(collection), f), 'utf8');
      out.push(JSON.parse(raw) as T);
    }
    return out;
  } catch {
    return [];
  }
}

async function fsDelete(collection: string, key: string): Promise<void> {
  try {
    await fs.unlink(fsFile(collection, key));
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Public generic API (chooses Blobs or filesystem automatically)
// ---------------------------------------------------------------------------

export async function putRecord<T>(collection: string, key: string, value: T): Promise<void> {
  if (await blobsAreUsable()) {
    const store = await getBlobStore(collection);
    await store.setJSON(key, value as Record<string, unknown>);
    return;
  }
  await fsPut(collection, key, value);
}

export async function getRecord<T>(collection: string, key: string): Promise<T | null> {
  if (await blobsAreUsable()) {
    const store = await getBlobStore(collection);
    const data = (await store.get(key, { type: 'json' })) as T | null;
    return data ?? null;
  }
  return fsGet<T>(collection, key);
}

export async function listRecords<T>(collection: string): Promise<T[]> {
  if (await blobsAreUsable()) {
    const store = await getBlobStore(collection);
    const { blobs } = await store.list();
    const out: T[] = [];
    for (const b of blobs) {
      const data = (await store.get(b.key, { type: 'json' })) as T | null;
      if (data) out.push(data);
    }
    return out;
  }
  return fsList<T>(collection);
}

export async function deleteRecord(collection: string, key: string): Promise<void> {
  if (await blobsAreUsable()) {
    const store = await getBlobStore(collection);
    await store.delete(key);
    return;
  }
  await fsDelete(collection, key);
}

// ---------------------------------------------------------------------------
// Domain types
// ---------------------------------------------------------------------------

export type LeadStatus = 'new' | 'contacted' | 'booked' | 'lost';

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  eventType?: string;
  expectedGuests?: string;
  preferredDate?: string;
  message?: string;
  agreedToMarketing?: boolean;
  source: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  lastContactedAt?: string;
}

export type VoucherType = 'gift-voucher' | 'afternoon-tea';
export type VoucherStatus = 'unredeemed' | 'redeemed';

export interface Voucher {
  code: string;
  type: VoucherType;
  amount: number; // monetary value paid, in GBP
  status: VoucherStatus;
  createdAt: string;
  redeemedAt?: string;
  // Audit trail for reversing a redemption (see unredeemVoucher)
  unredeemedAt?: string;
  unredeemCount?: number;
  // Customer / recipient
  purchaserName?: string;
  purchaserEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
  // Afternoon tea specifics
  quantity?: number;
  addProsecco?: boolean;
  specialRequests?: string;
  // Payment linkage (for idempotent fulfilment)
  sessionId?: string;
  paymentRef?: string;
}

// ---------------------------------------------------------------------------
// Lead helpers
// ---------------------------------------------------------------------------

const LEADS = 'leads';

export async function saveLead(lead: Lead): Promise<void> {
  await putRecord(LEADS, lead.id, lead);
}

export async function getLeads(): Promise<Lead[]> {
  const leads = await listRecords<Lead>(LEADS);
  return leads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getLead(id: string): Promise<Lead | null> {
  return getRecord<Lead>(LEADS, id);
}

export async function updateLead(
  id: string,
  updates: Partial<Lead>
): Promise<Lead | null> {
  const existing = await getLead(id);
  if (!existing) return null;
  const merged: Lead = { ...existing, ...updates, id: existing.id };
  await putRecord(LEADS, id, merged);
  return merged;
}

export async function deleteLead(id: string): Promise<void> {
  await deleteRecord(LEADS, id);
}

// ---------------------------------------------------------------------------
// Voucher helpers
// ---------------------------------------------------------------------------

const VOUCHERS = 'vouchers';

export async function saveVoucher(voucher: Voucher): Promise<void> {
  await putRecord(VOUCHERS, voucher.code, voucher);
}

export async function getVouchers(): Promise<Voucher[]> {
  const vouchers = await listRecords<Voucher>(VOUCHERS);
  return vouchers.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getVoucherByCode(code: string): Promise<Voucher | null> {
  return getRecord<Voucher>(VOUCHERS, code.trim().toUpperCase());
}

export async function findVoucherBySession(
  sessionId: string
): Promise<Voucher | null> {
  if (!sessionId) return null;
  const all = await getVouchers();
  return all.find((v) => v.sessionId === sessionId) ?? null;
}

export async function redeemVoucher(
  code: string
): Promise<{ ok: boolean; reason?: string; voucher?: Voucher }> {
  const voucher = await getVoucherByCode(code);
  if (!voucher) return { ok: false, reason: 'not_found' };
  if (voucher.status === 'redeemed') {
    return { ok: false, reason: 'already_redeemed', voucher };
  }
  const updated: Voucher = {
    ...voucher,
    status: 'redeemed',
    redeemedAt: new Date().toISOString(),
  };
  await saveVoucher(updated);
  return { ok: true, voucher: updated };
}

/**
 * Reverses a redemption so the voucher can be used again (e.g. it was scanned
 * by mistake, or a booking fell through). This is a sensitive action — the API
 * layer additionally requires the admin password to be re-entered.
 *
 * Keeps an audit trail: records when it was reversed and how many times.
 */
export async function unredeemVoucher(
  code: string
): Promise<{ ok: boolean; reason?: string; voucher?: Voucher }> {
  const voucher = await getVoucherByCode(code);
  if (!voucher) return { ok: false, reason: 'not_found' };
  if (voucher.status === 'unredeemed') {
    return { ok: false, reason: 'not_redeemed', voucher };
  }
  const updated: Voucher = {
    ...voucher,
    status: 'unredeemed',
    redeemedAt: undefined,
    unredeemedAt: new Date().toISOString(),
    unredeemCount: (voucher.unredeemCount || 0) + 1,
  };
  await saveVoucher(updated);
  return { ok: true, voucher: updated };
}

// ---------------------------------------------------------------------------
// Event ticketing helpers (England v Argentina and future paid events)
// ---------------------------------------------------------------------------

const EVENTS = 'events';
const BOOKINGS = 'bookings';

/**
 * Returns the ticket event config, seeding the curated default on first use so
 * the public page and the admin dashboard always have real, editable content.
 */
export async function getTicketEvent(
  id: string = ARGENTINA_EVENT_ID
): Promise<TicketEvent> {
  const stored = await getRecord<TicketEvent>(EVENTS, id);
  if (stored) {
    // Heal any config that predates a field we now rely on.
    return { ...DEFAULT_ARGENTINA_EVENT, ...stored };
  }
  await putRecord(EVENTS, DEFAULT_ARGENTINA_EVENT.id, DEFAULT_ARGENTINA_EVENT);
  return DEFAULT_ARGENTINA_EVENT;
}

export async function saveTicketEvent(event: TicketEvent): Promise<void> {
  await putRecord(EVENTS, event.id, event);
}

export async function updateTicketEvent(
  id: string,
  updates: Partial<TicketEvent>
): Promise<TicketEvent> {
  const existing = await getTicketEvent(id);
  const merged: TicketEvent = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  await putRecord(EVENTS, id, merged);
  return merged;
}

// ---- Bookings ----

export async function saveBooking(booking: TicketBooking): Promise<void> {
  await putRecord(BOOKINGS, booking.ref, booking);
}

export async function getAllBookings(): Promise<TicketBooking[]> {
  const bookings = await listRecords<TicketBooking>(BOOKINGS);
  return bookings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getBookings(eventId?: string): Promise<TicketBooking[]> {
  const all = await getAllBookings();
  return eventId ? all.filter((b) => b.eventId === eventId) : all;
}

export async function getBookingByRef(
  ref: string
): Promise<TicketBooking | null> {
  if (!ref) return null;
  return getRecord<TicketBooking>(BOOKINGS, ref.trim().toUpperCase());
}

export async function getBookingByToken(
  token: string
): Promise<TicketBooking | null> {
  if (!token) return null;
  const all = await getAllBookings();
  return all.find((b) => b.token === token) ?? null;
}

export async function findBookingBySession(
  sessionId: string
): Promise<TicketBooking | null> {
  if (!sessionId) return null;
  const all = await getAllBookings();
  return all.find((b) => b.sessionId === sessionId) ?? null;
}

export interface Availability {
  allocation: number;
  sold: number; // paid tickets
  held: number; // active (non-expired) pending reservations
  remaining: number;
}

/** Whether a pending booking still holds inventory. */
function holdActive(b: TicketBooking, now: number): boolean {
  return (
    b.status === 'pending' &&
    !!b.heldUntil &&
    new Date(b.heldUntil).getTime() > now
  );
}

/**
 * Derives availability from the bookings themselves — never a decremented
 * counter — so it can't drift and reducing the allocation can never invalidate
 * bookings that already exist.
 */
export async function getAvailability(
  eventId: string = ARGENTINA_EVENT_ID
): Promise<Availability> {
  const event = await getTicketEvent(eventId);
  const bookings = await getBookings(eventId);
  const now = Date.now();
  let sold = 0;
  let held = 0;
  for (const b of bookings) {
    // Only PUBLIC (Stripe/website) bookings consume the public allocation.
    // Manual bookings (SevenRooms, comps, phone, staff) are counted separately.
    if (!isPublicSale(b)) continue;
    if (b.status === 'paid') sold += b.quantity;
    else if (holdActive(b, now)) held += b.quantity;
  }
  const remaining = Math.max(0, event.allocation - sold - held);
  return { allocation: event.allocation, sold, held, remaining };
}

export async function findBookingByExternalRef(
  externalRef: string
): Promise<TicketBooking | null> {
  if (!externalRef) return null;
  const all = await getAllBookings();
  const key = externalRef.trim().toLowerCase();
  return all.find((b) => (b.externalRef || '').toLowerCase() === key) ?? null;
}

/**
 * Creates a confirmed admin booking (SevenRooms, telephone, guest list, staff,
 * comp, etc.). These never require a Stripe transaction and appear in exactly
 * the same guest search / Door Mode as website bookings.
 */
export async function createManualBooking(input: {
  eventId?: string;
  purchaserName: string;
  purchaserEmail?: string;
  purchaserPhone?: string;
  quantity: number;
  attendees: string[];
  viewingArea: string;
  viewingAreaLabel: string;
  tableRef?: string;
  bookingNotes?: string;
  source: BookingSource;
  paymentStatus: PaymentStatus;
  externalRef?: string;
  amount?: number;
  by?: string;
}): Promise<TicketBooking> {
  const eventId = input.eventId || ARGENTINA_EVENT_ID;
  let ref = generateBookingRef();
  for (let i = 0; i < 6 && (await getBookingByRef(ref)); i++) {
    ref = generateBookingRef();
  }
  const now = new Date().toISOString();
  const booking: TicketBooking = {
    ref,
    token: generateBookingToken(),
    eventId,
    status: input.paymentStatus === 'cancelled' ? 'cancelled' : 'paid',
    quantity: input.quantity,
    amount: input.amount ?? 0,
    purchaserName: input.purchaserName,
    purchaserEmail: input.purchaserEmail || '',
    purchaserPhone: input.purchaserPhone || '',
    attendees: input.attendees,
    attendeesCheckedIn: input.attendees.map(() => false),
    viewingArea: input.viewingArea,
    viewingAreaLabel: input.viewingAreaLabel,
    tableRef: input.tableRef,
    bookingNotes: input.bookingNotes,
    source: input.source,
    paymentStatus: input.paymentStatus,
    externalRef: input.externalRef,
    checkedIn: false,
    manual: true,
    history: [
      {
        at: now,
        by: input.by || 'Admin',
        action: 'created',
        detail: `Manual ${input.source} booking`,
      },
    ],
    createdAt: now,
    paidAt: input.paymentStatus === 'paid' ? now : undefined,
  };
  await saveBooking(booking);
  return booking;
}

export interface ReserveResult {
  ok: boolean;
  reason?: 'sold_out' | 'not_on_sale' | 'invalid';
  booking?: TicketBooking;
  remaining?: number;
}

/**
 * Creates a PENDING booking that temporarily holds inventory, using a
 * reserve-then-verify pattern to reduce the chance of overselling when several
 * customers try to buy the final tickets at the same time.
 *
 * We write the hold, then re-read every committed booking (paid + active holds)
 * ordered by creation time and take the cumulative sum. If our booking falls
 * beyond the allocation line, an earlier reservation won the race, so we cancel
 * ours and report sold out. Earlier bookings deterministically win.
 */
export async function reserveBooking(
  input: Omit<
    TicketBooking,
    'ref' | 'token' | 'status' | 'checkedIn' | 'createdAt' | 'heldUntil'
  >
): Promise<ReserveResult> {
  const event = await getTicketEvent(input.eventId);

  if (event.salesStatus !== 'on-sale') {
    return { ok: false, reason: 'not_on_sale' };
  }
  if (
    !Number.isInteger(input.quantity) ||
    input.quantity < 1 ||
    input.quantity > event.maxPerOrder
  ) {
    return { ok: false, reason: 'invalid' };
  }

  const before = await getAvailability(input.eventId);
  if (input.quantity > before.remaining) {
    return { ok: false, reason: 'sold_out', remaining: before.remaining };
  }

  // Generate a unique reference.
  let ref = generateBookingRef();
  for (let i = 0; i < 6 && (await getBookingByRef(ref)); i++) {
    ref = generateBookingRef();
  }

  const now = new Date();
  const booking: TicketBooking = {
    ...input,
    ref,
    token: generateBookingToken(),
    status: 'pending',
    checkedIn: false,
    heldUntil: new Date(
      now.getTime() + event.holdMinutes * 60_000
    ).toISOString(),
    createdAt: now.toISOString(),
  };
  await saveBooking(booking);

  // Reserve-then-verify: make sure our hold actually fits within allocation.
  const all = await getBookings(input.eventId);
  const nowMs = Date.now();
  const committed = all
    .filter((b) => b.status === 'paid' || holdActive(b, nowMs))
    .sort((a, b) => {
      const t = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return t !== 0 ? t : a.ref.localeCompare(b.ref);
    });

  let cumulative = 0;
  let fits = false;
  for (const b of committed) {
    cumulative += b.quantity;
    if (b.ref === ref) {
      fits = cumulative <= event.allocation;
      break;
    }
  }

  if (!fits) {
    // An earlier reservation beat us to the last tickets — release the hold.
    await deleteRecord(BOOKINGS, ref);
    const avail = await getAvailability(input.eventId);
    return { ok: false, reason: 'sold_out', remaining: avail.remaining };
  }

  return { ok: true, booking, remaining: before.remaining - input.quantity };
}

/** Marks a reserved booking as paid (idempotent). */
export async function markBookingPaid(
  ref: string,
  patch: { amount?: number; paymentRef?: string; sessionId?: string }
): Promise<{ booking: TicketBooking; alreadyPaid: boolean } | null> {
  const booking = await getBookingByRef(ref);
  if (!booking) return null;
  if (booking.status === 'paid') {
    return { booking, alreadyPaid: true };
  }
  const updated: TicketBooking = {
    ...booking,
    status: 'paid',
    amount: patch.amount ?? booking.amount,
    paymentRef: patch.paymentRef ?? booking.paymentRef,
    sessionId: patch.sessionId ?? booking.sessionId,
    heldUntil: undefined,
    paidAt: new Date().toISOString(),
  };
  await saveBooking(updated);
  return { booking: updated, alreadyPaid: false };
}

export async function updateBooking(
  ref: string,
  updates: Partial<TicketBooking>
): Promise<TicketBooking | null> {
  const existing = await getBookingByRef(ref);
  if (!existing) return null;
  const merged: TicketBooking = { ...existing, ...updates, ref: existing.ref };
  await saveBooking(merged);
  return merged;
}

// ---------------------------------------------------------------------------
// What's On helpers (no-code events manager)
// ---------------------------------------------------------------------------

const WHATS_ON = 'whats-on';

/**
 * Returns the stored What's On items. If the store has never been populated,
 * it is seeded once with the curated defaults so the public page and the admin
 * manager always have real, editable content to work with.
 */
const WHATS_ON_META = 'whats-on-meta';

/**
 * One-time injection of the England v Argentina ticket promo into stores that
 * were seeded before it existed (i.e. production). It is added exactly once —
 * if staff later hide or delete it, the flag stops it coming back.
 */
async function ensureArgentinaWhatsOn(
  items: WhatsOnItem[]
): Promise<WhatsOnItem[]> {
  const id = 'england-v-argentina';
  if (items.some((i) => i.id === id)) return items;
  const flag = await getRecord<{ done: boolean }>(WHATS_ON_META, 'arg-injected');
  if (flag?.done) return items;
  const seed = DEFAULT_WHATS_ON.find((i) => i.id === id);
  if (!seed) return items;
  await putRecord(WHATS_ON, seed.id, seed);
  await putRecord(WHATS_ON_META, 'arg-injected', { done: true });
  return [...items, seed];
}

export async function getWhatsOnItems(): Promise<WhatsOnItem[]> {
  const stored = await listRecords<WhatsOnItem>(WHATS_ON);
  if (stored.length > 0) {
    const healed = await ensureArgentinaWhatsOn(stored);
    return sortWhatsOn(healed);
  }
  // First run — persist the defaults so future edits are stable.
  await Promise.all(
    DEFAULT_WHATS_ON.map((item) => putRecord(WHATS_ON, item.id, item))
  );
  return sortWhatsOn(DEFAULT_WHATS_ON);
}

export async function getWhatsOnItem(id: string): Promise<WhatsOnItem | null> {
  return getRecord<WhatsOnItem>(WHATS_ON, id);
}

export async function saveWhatsOnItem(item: WhatsOnItem): Promise<void> {
  await putRecord(WHATS_ON, item.id, item);
}

export async function updateWhatsOnItem(
  id: string,
  updates: Partial<WhatsOnItem>
): Promise<WhatsOnItem | null> {
  const existing = await getWhatsOnItem(id);
  if (!existing) return null;
  const merged: WhatsOnItem = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
  await putRecord(WHATS_ON, id, merged);
  return merged;
}

export async function deleteWhatsOnItem(id: string): Promise<void> {
  await deleteRecord(WHATS_ON, id);
}

/** Resets the What's On collection back to the curated defaults. */
export async function resetWhatsOnItems(): Promise<WhatsOnItem[]> {
  const existing = await listRecords<WhatsOnItem>(WHATS_ON);
  await Promise.all(existing.map((i) => deleteRecord(WHATS_ON, i.id)));
  await Promise.all(
    DEFAULT_WHATS_ON.map((item) => putRecord(WHATS_ON, item.id, item))
  );
  return sortWhatsOn(DEFAULT_WHATS_ON);
}
