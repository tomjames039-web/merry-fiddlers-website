import fs from 'node:fs/promises';
import path from 'node:path';

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
