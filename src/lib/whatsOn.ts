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
  /**
   * Optional ISO date (YYYY-MM-DD). The item disappears from the public site
   * automatically at the END of this day — so temporary promotions retire
   * themselves without anyone having to remember to switch them off.
   */
  endDate?: string;
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
const AUTUMN = '2026-08-24T09:00:00.000Z';

/**
 * Curated starter content.
 *
 * Anything summer-led (World Cup, Wimbledon, Pimms, the England v Argentina
 * ticket event) is archived as a draft — kept for the record, hidden from the
 * public site. The live feed is now autumn- and Christmas-led.
 */
export const DEFAULT_WHATS_ON: WhatsOnItem[] = [
  // ---------------- Temporary: Summer Bank Holiday ----------------
  {
    id: 'bank-holiday-monday',
    title: 'Summer Bank Holiday Monday',
    category: 'special',
    status: 'published',
    featured: true,
    subtitle: 'Monday 31 August',
    badge: 'Open specially',
    description:
      'We are normally closed on a Monday — but not this one. We are opening specially for the Summer Bank Holiday, with food served from 12:00pm until 7:30pm, the garden open and the kitchen in full flow. It is the last proper long weekend of the summer, so tables will go quickly. Booking online is strongly recommended.',
    schedule: 'Monday 31 August · Food 12:00pm–7:30pm',
    eventDate: '2026-08-31',
    endDate: '2026-08-31',
    imageUrl: '/pub-flowers.jpeg',
    ctaLabel: 'Book your table',
    ctaUrl: BOOK_URL,
    order: 0,
    createdAt: AUTUMN,
    updatedAt: AUTUMN,
  },

  // ---------------- Christmas ----------------
  {
    id: 'christmas-day-2026',
    title: 'Christmas Day at The Merry Fiddlers',
    category: 'dining',
    status: 'published',
    featured: true,
    subtitle: 'Friday 25 December 2026',
    badge: 'Reservations open',
    description:
      'Christmas Day done properly: fires lit, the restaurant dressed for it, a glass in your hand the moment you walk in and a kitchen cooking everything to order. Sittings are staggered through the day. Reservations are open now and no deposit is required while we finalise the menu.',
    schedule: 'Friday 25 December · Staggered sittings through the day',
    eventDate: '2026-12-25',
    imageUrl: '/food-3.jpeg',
    ctaLabel: 'Reserve your Christmas Day place',
    ctaUrl: '/christmas/christmas-day',
    order: 1,
    createdAt: AUTUMN,
    updatedAt: AUTUMN,
  },
  {
    id: 'christmas-parties-2026',
    title: 'Christmas Parties & Office Nights',
    category: 'special',
    status: 'published',
    featured: true,
    subtitle: 'Work dos · Private dining · Groups',
    badge: 'Now taking enquiries',
    description:
      'Private and semi-private dining rooms, roughly 30+ covers in each main restaurant section, bar seating for drinks receptions and heated domes for smaller groups. Premium food, proper cocktails and a wine list worth lingering over — five minutes from Epping.',
    schedule: 'Lunch or evening · December dates',
    eventDate: '2026-12-01',
    imageUrl: '/dome.jpeg',
    ctaLabel: 'Enquire about a Christmas party',
    ctaUrl: '/christmas/christmas-parties',
    order: 2,
    createdAt: AUTUMN,
    updatedAt: AUTUMN,
  },
  {
    id: 'festive-week-2026',
    title: 'Christmas Eve, Boxing Day & New Year',
    category: 'special',
    status: 'published',
    featured: false,
    subtitle: 'The whole festive week',
    badge: 'Booking now',
    description:
      'We are open right through the festive week — Christmas Eve for lunch and dinner, Boxing Day for lunch and dinner with a menu of its own, New Year\u2019s Eve with no compulsory set menu and the bar open late, and New Year\u2019s Day from midday. Fires lit throughout, and tables can be booked now.',
    schedule: '24, 26, 31 December & 1 January',
    eventDate: '2026-12-24',
    ctaLabel: 'See the festive week',
    ctaUrl: '/christmas',
    order: 3,
    createdAt: AUTUMN,
    updatedAt: AUTUMN,
  },

  // ---------------- Autumn signature dining ----------------
  {
    id: 'sunday-roast',
    title: 'Our Famous Sunday Roast',
    category: 'dining',
    status: 'published',
    featured: true,
    subtitle: 'What we are known for',
    badge: 'Signature',
    description:
      'The roast people travel for — beautifully cooked beef, lamb or chicken, proper roast potatoes, seasonal veg and a Yorkshire to be proud of. Long autumn afternoons, a glass of red and a fire going in the bar. We get very busy, so booking is strongly recommended.',
    schedule: 'Every Sunday · 12–6pm',
    imageUrl: '/food-3.jpeg',
    ctaLabel: 'Book your roast',
    ctaUrl: BOOK_URL,
    order: 4,
    createdAt: SEED,
    updatedAt: AUTUMN,
  },
  {
    id: 'open-fires',
    title: 'Fires Lit, Log Burners Going',
    category: 'dining',
    status: 'published',
    featured: false,
    subtitle: 'Autumn at the Fiddlers',
    badge: 'Cosy season',
    description:
      'The nights are drawing in, the log burners are lit and the bar is at its best. Muddy boots and dogs welcome, a proper pint or a large red in hand, and a kitchen that takes the food seriously. This is the time of year we do best.',
    schedule: 'Wed–Sat from 12pm · Sundays 12–8pm',
    imageUrl: '/pub-front-3.jpeg',
    ctaLabel: 'Book a table by the fire',
    ctaUrl: BOOK_URL,
    order: 5,
    createdAt: AUTUMN,
    updatedAt: AUTUMN,
  },
  {
    id: 'the-domes',
    title: 'Private Dining in The Heated Domes',
    category: 'dining',
    status: 'published',
    featured: false,
    subtitle: 'Intimate & weather-proof',
    badge: 'À la carte',
    description:
      'A few steps from the pub, our fairy-lit heated domes give you your own private room under the stars — whatever the weather is doing. Wonderful all year, but genuinely magical from October onwards.',
    schedule: 'À la carte · Booking required',
    imageUrl: '/dome.jpeg',
    ctaLabel: 'Enquire about The Domes',
    ctaUrl: '/private-hire/private-dining',
    order: 6,
    createdAt: SEED,
    updatedAt: AUTUMN,
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
      'Finger sandwiches, warm scones with clotted cream and a tier of delicate cakes, served with a pot of tea or a glass of fizz. One of our most popular bookings — and a lovely thing to do on a cold afternoon.',
    schedule: 'Wed–Sat · 12–4pm',
    imageUrl: '/afternoon-tea.jpg',
    ctaLabel: 'About afternoon tea',
    ctaUrl: '/afternoon-tea-offer',
    order: 7,
    createdAt: SEED,
    updatedAt: AUTUMN,
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
    order: 8,
    createdAt: SEED,
    updatedAt: SEED,
  },

  // ---------------- The big screen (kept, seasonally reframed) ----------------
  {
    id: 'big-screen',
    title: 'The Big Screen',
    category: 'screen',
    status: 'published',
    featured: false,
    subtitle: 'One of the largest screens in Essex',
    badge: '4 metres wide',
    description:
      'Our enormous 4-metre garden screen comes out for the biggest sporting moments of the year. Wrap up, gather your friends and watch it properly — with a pint and food from the kitchen rather than a bag of crisps.',
    schedule: 'Beer garden · Major tournaments only',
    imageUrl: '/stadium-night.jpg',
    ctaLabel: 'Book a table',
    ctaUrl: BOOK_URL,
    order: 9,
    createdAt: SEED,
    updatedAt: AUTUMN,
  },

  // ---------------- Archived: finished summer 2026 promotions ----------------
  {
    id: 'england-v-argentina',
    title: 'England v Argentina (finished)',
    category: 'screen',
    status: 'draft',
    featured: false,
    subtitle: 'Wed 15 July · Sold out',
    badge: 'Archived',
    description:
      'Archived. The England v Argentina big-screen event on Wednesday 15 July sold out and has now taken place. Kept here for the record only.',
    schedule: 'Wednesday 15 July · Completed',
    eventDate: '2026-07-15',
    imageUrl: '/stadium-night.jpg',
    order: 90,
    createdAt: SEED,
    updatedAt: AUTUMN,
  },
  {
    id: 'world-cup',
    title: 'World Cup — Live in the Garden (finished)',
    category: 'screen',
    status: 'draft',
    featured: false,
    subtitle: 'Archived',
    badge: 'Archived',
    description:
      'Archived after the tournament. Switch back on for the next major football tournament.',
    schedule: 'Throughout the tournament',
    order: 91,
    createdAt: SEED,
    updatedAt: AUTUMN,
  },
  {
    id: 'england-saturday',
    title: 'England on the Big Screen (archived)',
    category: 'screen',
    status: 'draft',
    featured: false,
    subtitle: 'Archived',
    badge: 'Archived',
    description:
      'Archived for the summer. This card auto-updates with the next England fixture — switch it back on when the next tournament comes round.',
    schedule: 'Live on the big screen',
    facebookEventUrl: 'https://www.facebook.com/themerryfiddlerspub/',
    trackTeam: 'england',
    order: 92,
    createdAt: SEED,
    updatedAt: AUTUMN,
  },
  {
    id: 'wimbledon',
    title: 'Wimbledon on the Big Screen (archived)',
    category: 'screen',
    status: 'draft',
    featured: false,
    subtitle: 'Archived',
    badge: 'Archived',
    description:
      'Archived until the next Championships. Switch back on in late June.',
    schedule: 'Throughout the Championships',
    order: 93,
    createdAt: SEED,
    updatedAt: AUTUMN,
  },
  {
    id: 'wimbledon-pimms',
    title: '2-for-1 Pimms Jugs (archived)',
    category: 'offer',
    status: 'draft',
    featured: false,
    subtitle: 'Archived',
    badge: 'Archived',
    description:
      'Archived with Wimbledon. Switch back on next summer.',
    schedule: 'Throughout Wimbledon',
    order: 94,
    createdAt: SEED,
    updatedAt: AUTUMN,
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
    order: 95,
    createdAt: SEED,
    updatedAt: SEED,
  },

  // ---------------- Drafts (ideas, toggled off) ----------------
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
    order: 96,
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
    order: 97,
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

/**
 * True once the item's `endDate` has passed (end of that day, UK time).
 * Temporary promotions therefore retire themselves.
 */
export function hasExpired(item: WhatsOnItem, now: Date = new Date()): boolean {
  if (!item.endDate) return false;
  const end = new Date(`${item.endDate}T23:59:59+01:00`);
  if (Number.isNaN(end.getTime())) return false;
  return now.getTime() > end.getTime();
}

export function publishedWhatsOn(items: WhatsOnItem[]): WhatsOnItem[] {
  return sortWhatsOn(
    items.filter((i) => i.status === 'published' && !hasExpired(i))
  );
}
