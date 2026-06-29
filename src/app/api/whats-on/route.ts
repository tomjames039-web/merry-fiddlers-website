import { type NextRequest, NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/auth';
import {
  getWhatsOnItems,
  saveWhatsOnItem,
  updateWhatsOnItem,
  deleteWhatsOnItem,
  resetWhatsOnItems,
} from '@/lib/store';
import {
  type WhatsOnItem,
  type WhatsOnCategory,
  type WhatsOnStatus,
  publishedWhatsOn,
} from '@/lib/whatsOn';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES: WhatsOnCategory[] = [
  'screen',
  'offer',
  'dining',
  'music',
  'special',
];

function clean(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

// GET — public returns published items; admin (?all=1 + auth) returns all
export async function GET(request: NextRequest) {
  const wantsAll = request.nextUrl.searchParams.get('all') === '1';
  const items = await getWhatsOnItems();

  if (wantsAll) {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ items, total: items.length });
  }

  const published = publishedWhatsOn(items);
  return NextResponse.json({ items: published, total: published.length });
}

// POST — create a new item, OR reset to defaults ({ reset: true }) (admin)
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  if (body?.reset === true) {
    const items = await resetWhatsOnItems();
    return NextResponse.json({ success: true, items });
  }

  const title = clean(body.title);
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const category: WhatsOnCategory = VALID_CATEGORIES.includes(body.category)
    ? body.category
    : 'special';
  const status: WhatsOnStatus =
    body.status === 'published' ? 'published' : 'draft';

  const existing = await getWhatsOnItems();
  const maxOrder = existing.reduce((m, i) => Math.max(m, i.order), 0);

  const now = new Date().toISOString();
  const item: WhatsOnItem = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    title,
    category,
    status,
    featured: Boolean(body.featured),
    subtitle: clean(body.subtitle),
    badge: clean(body.badge),
    description: clean(body.description) ?? '',
    schedule: clean(body.schedule),
    eventDate: clean(body.eventDate),
    instagramUrl: clean(body.instagramUrl),
    facebookEventUrl: clean(body.facebookEventUrl),
    trackTeam: clean(body.trackTeam),
    imageUrl: clean(body.imageUrl),
    ctaLabel: clean(body.ctaLabel),
    ctaUrl: clean(body.ctaUrl),
    order: typeof body.order === 'number' ? body.order : maxOrder + 1,
    createdAt: now,
    updatedAt: now,
  };

  await saveWhatsOnItem(item);
  return NextResponse.json({ success: true, item });
}

// PATCH — update an existing item (admin)
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const id = clean(body.id);
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const updates: Partial<WhatsOnItem> = {};
  if (typeof body.title === 'string') updates.title = body.title.trim();
  if (VALID_CATEGORIES.includes(body.category)) updates.category = body.category;
  if (body.status === 'published' || body.status === 'draft')
    updates.status = body.status;
  if (typeof body.featured === 'boolean') updates.featured = body.featured;
  if (typeof body.order === 'number') updates.order = body.order;
  if (typeof body.description === 'string')
    updates.description = body.description.trim();

  for (const key of [
    'subtitle',
    'badge',
    'schedule',
    'eventDate',
    'instagramUrl',
    'facebookEventUrl',
    'trackTeam',
    'imageUrl',
    'ctaLabel',
    'ctaUrl',
  ] as const) {
    if (typeof body[key] === 'string') {
      const v = body[key].trim();
      updates[key] = v.length ? v : undefined;
    }
  }

  const updated = await updateWhatsOnItem(id, updates);
  if (!updated) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, item: updated });
}

// DELETE — remove an item (admin)
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  await deleteWhatsOnItem(id);
  return NextResponse.json({ success: true });
}
