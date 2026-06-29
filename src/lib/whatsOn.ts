/**
 * "What's On" content model for The Merry Fiddlers.
 *
 * Powers both the public /upcoming page and the no-code What's On manager in
 * the admin back office. Items are stored in the persistence layer (Netlify
 * Blobs / fs fallback). When the store is empty the curated DEFAULT_WHATS_ON
 * below is used so the page is never blank and the admin starts with real,
 * editable content.
 */

export type WhatsOnCategory =
  | 'screen' // The big screen / live sport
  | 'offer' // Drinks & food offers (2-for-1 etc.)
  | 'dining' // Signature dining (Sunday roast, afternoon tea, the domes)
  | 'music' // Live music
  | 'special'; // One-off / seasonal specials (tasting menu, BBQ)

export type WhatsOnStatus = 'published' | 'draft';

export interface WhatsOnItem {
  id: string;
  title: string;
  category: WhatsOnCategory;
  /** published = live on the website, draft = hidden (toggled off). */
  status: WhatsOnStatus;
  /** featured items are given a larger, highlighted treatment. */
  featured: boolean;
  /** short eyebrow line, e.g. "This Saturday" or "Every Friday". */
  subtitle?: string;
  /** small pill, e.g. "2-for-1", "On now", "Signature". */
  badge?: string;
  description: string;
  /** human-readable schedule, e.g. "Fridays · 5–9pm". */
  schedule?: string;
  /** optional ISO date used for ordering time-sensitive items. */
  eventDate?: string;
  /** link/embed a specific Instagram post or reel. */
  instagramUrl?: string;
  /** link a specific Facebook event. */
  facebookEventUrl?: string;
  /** auto-update this item with a live sports fixture (e.g. 'england'). */
  trackTeam?: string;
  /** optional hero/card image (path under /public or full URL). */
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  /** manual ordering (ascending). */
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const BOOK_URL =
  'https://www.sevenrooms.com/reservations/themerryfiddlers';

export const WHATS_ON_CATEGORIES: {
  key: WhatsOnCategory;
  label: string;
  blurb: string;
}[] = [
  {
    key: 'screen',
    label: 'On the Big Screen',
    blurb: 'Major tournaments live on our 4-metre garden screen.',
  },
  {
    key: 'offer',
    label: 'Offers & Drinks',
    blurb: 'Our regular treats at the bar.',
  },
  {
    key: 'dining',
    label: 'Signature Dining',
    blurb: 'The plates and experiences we are known for.',
  },
  { key: 'music', label: 'Live Music', blurb: 'Acoustic sets and event nights.' },
  {
    key: 'special',
    label: 'Specials & Seasonal',
    blurb: 'One-off events and seasonal happenings.',
  },
];

export function categoryLabel(key: WhatsOnCategory): string {
  return WHATS_ON_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}

const SEED = '2025-06-20T09:00:00.000Z';

/**
 * Curated starter content built directly from the owner's brief.
 * Steak Night and the Pub Quiz are intentionally gone; live music, the
 * tasting menu and the summer BBQ ship as drafts (toggled off).
 */
export const DEFAULT_WHATS_ON: WhatsOnItem[] = [
  // ---------------- The Big Screen / sport ----------------
  {
    id: 'big-screen',
    title: 'The Big Screen',
    category: 'screen',
    status: 'published',
    featured: true,
    subtitle: 'One of the largest screens in Essex',
    badge: '4 metres wide',
    description:
      'Our enormous 4-metre screen takes pride of place in the beer garden — gather your friends, grab a cold one and watch the biggest sporting moments under the open sky. The best seat in Essex.',
    schedule: 'Beer garden · Major tournaments only',
    imageUrl: '/big-screen-garden.jpg',
    ctaLabel: 'Book a garden table',
    ctaUrl: BOOK_URL,
    order: 1,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'world-cup',
    title: 'World Cup — Live in the Garden',
    category: 'screen',
    status: 'published',
    featured: true,
    subtitle: "We're right in the thick of it",
    badge: 'On now',
    description:
      'Every big World Cup fixture, live on the 4-metre garden screen. Ice-cold pints, proper pub food and a brilliant atmosphere with every kick-off.',
    schedule: 'Throughout the tournament',
    order: 2,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'england-saturday',
    title: 'England on the Big Screen',
    category: 'screen',
    status: 'published',
    featured: true,
    subtitle: 'Up next',
    badge: 'England',
    description:
      'Every England game, live on the 4-metre garden screen. It gets busy for the big ones — get down early to claim your spot and soak up the atmosphere. The next fixture updates automatically below.',
    schedule: 'Live on the big screen',
    facebookEventUrl: 'https://www.facebook.com/themerryfiddlerspub/',
    trackTeam: 'england',
    order: 3,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'wimbledon',
    title: 'Wimbledon on the Big Screen',
    category: 'screen',
    status: 'published',
    featured: false,
    subtitle: 'Centre Court in the garden',
    badge: 'Coming up',
    description:
      'The Championships come to Fiddlers Hamlet. Catch all the Wimbledon drama on the big screen with a jug of Pimms in hand — strawberries-and-summer done properly.',
    schedule: 'Throughout the Championships',
    order: 4,
    createdAt: SEED,
    updatedAt: SEED,
  },

  // ---------------- Offers ----------------
  {
    id: 'friday-cocktails',
    title: '2-for-1 Cocktails',
    category: 'offer',
    status: 'published',
    featured: true,
    subtitle: 'Every Friday',
    badge: '2-for-1',
    description:
      'The entire cocktail menu, two-for-one, every Friday from 5pm till 9pm. Start the weekend exactly the way it should be.',
    schedule: 'Fridays · 5–9pm',
    order: 5,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'wimbledon-pimms',
    title: '2-for-1 Pimms Jugs',
    category: 'offer',
    status: 'published',
    featured: false,
    subtitle: "While Wimbledon's on",
    badge: '2-for-1',
    description:
      'Jugs of classic Pimms, two-for-one, right through the Championships. Perfect for the garden, the sunshine and the tennis.',
    schedule: 'Throughout Wimbledon',
    order: 6,
    createdAt: SEED,
    updatedAt: SEED,
  },

  // ---------------- Signature dining ----------------
  {
    id: 'sunday-roast',
    title: 'Our Famous Sunday Roast',
    category: 'dining',
    status: 'published',
    featured: true,
    subtitle: 'What we are known for',
    badge: 'Signature',
    description:
      'The roast people travel for — beautifully cooked beef, pork or chicken with all the trimmings and a Yorkshire to be proud of. We get very busy, so booking is strongly recommended.',
    schedule: 'Every Sunday · 12–6pm',
    imageUrl: '/food-3.jpeg',
    ctaLabel: 'Book your roast',
    ctaUrl: BOOK_URL,
    order: 7,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'afternoon-tea',
    title: 'Afternoon Tea',
    category: 'dining',
    status: 'published',
    featured: false,
    subtitle: 'A Fiddlers favourite',
    badge: 'Booking essential',
    description:
      'Finger sandwiches, warm scones with clotted cream and a tier of delicate cakes, served with a pot of tea or a glass of fizz. One of our most popular bookings.',
    schedule: 'Wed–Sat · 12–4pm',
    imageUrl: '/afternoon-tea.jpg',
    ctaLabel: 'About afternoon tea',
    ctaUrl: '/afternoon-tea-offer',
    order: 8,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'the-domes',
    title: 'Fine Dining in The Domes',
    category: 'dining',
    status: 'published',
    featured: false,
    subtitle: 'Intimate & weather-proof',
    badge: 'À la carte',
    description:
      'A few steps from the pub, our private heated domes offer an intimate à la carte experience whatever the weather — wonderful all year round and especially cosy through the winter months.',
    schedule: 'À la carte · Booking required',
    imageUrl: '/dome.jpeg',
    ctaLabel: 'Enquire about The Domes',
    ctaUrl: '/private-hire',
    order: 9,
    createdAt: SEED,
    updatedAt: SEED,
  },

  // ---------------- Drafts (toggled off by default) ----------------
  {
    id: 'live-music',
    title: 'Live Acoustic Sessions',
    category: 'music',
    status: 'draft',
    featured: false,
    subtitle: 'By arrangement',
    description:
      'We host live acoustic music for private functions and special events. Switch this on whenever you have a date to promote.',
    schedule: 'Functions & events',
    order: 10,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'tasting-menu',
    title: "Chef's Tasting Menu",
    category: 'special',
    status: 'draft',
    featured: false,
    subtitle: 'An idea in the works',
    description:
      'A multi-course tasting experience from our kitchen. Toggle this on when you are ready to take bookings.',
    schedule: 'Coming soon',
    order: 11,
    createdAt: SEED,
    updatedAt: SEED,
  },
  {
    id: 'summer-bbq',
    title: 'Summer Garden BBQ',
    category: 'special',
    status: 'draft',
    featured: false,
    subtitle: 'Seasonal',
    description:
      'Flame-grilled weekends in the beer garden. A seasonal idea — switch it on once the dates are set.',
    schedule: 'Seasonal',
    order: 12,
    createdAt: SEED,
    updatedAt: SEED,
  },
];

export function sortWhatsOn(items: WhatsOnItem[]): WhatsOnItem[] {
  return [...items].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

export function publishedWhatsOn(items: WhatsOnItem[]): WhatsOnItem[] {
  return sortWhatsOn(items.filter((i) => i.status === 'published'));
}
