/**
 * Christmas & festive season 2026 content model.
 *
 * Everything the site says about the festive period lives here so the copy can
 * be corrected in one place as the owner confirms menus, times and terms.
 *
 * IMPORTANT EDITORIAL RULE: nothing in this file should state a dish, price,
 * package or act as confirmed unless the owner has actually confirmed it.
 * Where details are still to be settled we say so plainly.
 */

import { BOOK_URL } from './whatsOn';

export { BOOK_URL };

export const CHRISTMAS_YEAR = 2026;

export interface FestiveFaq {
  q: string;
  a: string;
}

export interface FestiveDetail {
  label: string;
  value: string;
}

export type FestiveStatus = 'reservations-open' | 'register-interest' | 'open';

export interface FestiveOccasion {
  slug: string;
  /** short name for cards and nav */
  name: string;
  /** full date line, e.g. "Friday 25 December 2026" */
  dateLine: string;
  /** ISO date for schema.org + ordering */
  isoDate: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** one-line summary used on the hub cards */
  summary: string;
  /** 1–3 paragraphs, separated by blank lines */
  intro: string;
  heroImage: string;
  status: FestiveStatus;
  statusLabel: string;
  /** key facts shown as a small table */
  details: FestiveDetail[];
  /** what we can honestly say today */
  confirmed: string[];
  /** what is still being finalised — shown as "still to come" */
  toFollow: string[];
  ctaLabel: string;
  formHeading: string;
  formBlurb: string;
  /** value recorded against the lead */
  leadSource: string;
  faqs: FestiveFaq[];
}

// ---------------------------------------------------------------------------
// Christmas Day — the commercial priority
// ---------------------------------------------------------------------------

export const CHRISTMAS_DAY: FestiveOccasion = {
  slug: 'christmas-day',
  name: 'Christmas Day',
  dateLine: 'Friday 25 December 2026',
  isoDate: '2026-12-25',
  eyebrow: 'The main event',
  h1: 'Christmas Day Lunch in Epping',
  metaTitle:
    'Christmas Day Lunch in Epping 2026 | The Merry Fiddlers, Epping Forest',
  metaDescription:
    'Reserve your Christmas Day place at The Merry Fiddlers, a country pub near Epping Forest. Fires lit, staggered sittings and everything cooked to order. No deposit required to reserve now.',
  summary:
    'Fires lit, the restaurant dressed for the day and a kitchen cooking everything to order. Reservations are open now, with no deposit while we finalise the menu.',
  intro:
    'Christmas Day at The Merry Fiddlers is the one we plan hardest for. Fires lit, the restaurant properly dressed, a glass in your hand the moment you walk in, and a kitchen cooking to order rather than running a conveyor belt.\n\nSittings are staggered through the day so every course leaves the pass the way it should. Tell us the time you would like on the reservation form and we will do our best to match it when the timings are confirmed.\n\nReservations are open now. For approximately the next two weeks no deposit is required while we finish the menu and confirm the booking terms. Everyone who reserves will be contacted first, as soon as the final menu and arrangements are released.',
  heroImage: '/food-3.jpeg',
  status: 'reservations-open',
  statusLabel: 'Reservations open · No deposit yet',
  details: [
    { label: 'Date', value: 'Friday 25 December 2026' },
    { label: 'Sittings', value: 'Staggered through the day' },
    { label: 'The setting', value: 'Fires lit and the restaurant dressed for it' },
    { label: 'Deposit', value: 'None required to reserve at this stage' },
  ],
  confirmed: [
    'We are open on Christmas Day and taking reservations now.',
    'Sittings are staggered through the day so the kitchen can hold its standard.',
    'No deposit is required for approximately the next two weeks.',
    'Everyone who reserves now is contacted first when the menu is released.',
  ],
  toFollow: [
    'The final Christmas Day menu.',
    'Confirmed sitting times.',
    'Deposit amount, payment date and booking terms.',
  ],
  ctaLabel: 'Reserve your Christmas Day place',
  formHeading: 'Reserve your Christmas Day place',
  formBlurb:
    'This holds your place in our Christmas Day book. It is a reservation, not a waiting list — but it is not fully confirmed until the final menu, sitting time and deposit terms are agreed with you. We will be in touch as soon as they are released.',
  leadSource: 'christmas-day-reservation',
  faqs: [
    {
      q: 'Is this a confirmed booking?',
      a: 'It reserves your place in our Christmas Day book. Because the final menu, sitting times and deposit terms are still being completed, your booking is confirmed once we have contacted you and you have agreed those details with us.',
    },
    {
      q: 'Do I have to pay a deposit now?',
      a: 'No. For approximately the next two weeks no deposit is required. When the menu and booking terms are released we will contact you with the deposit arrangements.',
    },
    {
      q: 'What time can we eat?',
      a: 'Sittings run across the day. Tell us the time you would prefer on the reservation form and we will do our best to match it. We will confirm your table time with you when the final arrangements are released.',
    },
    {
      q: 'Can you cater for dietary requirements and children?',
      a: 'Yes. Add the details to your reservation and the kitchen will build them in when the final menu is set.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Christmas parties — corporate / work dos
// ---------------------------------------------------------------------------

export const CHRISTMAS_PARTIES: FestiveOccasion = {
  slug: 'christmas-parties',
  name: 'Christmas Parties',
  dateLine: 'December 2026 · lunch or evening',
  isoDate: '2026-12-01',
  eyebrow: 'Work dos, teams & celebrations',
  h1: 'Christmas Parties in Epping',
  metaTitle:
    'Christmas Parties Epping | Office & Corporate Christmas Party Venue | The Merry Fiddlers',
  metaDescription:
    'Office and corporate Christmas parties in Epping. Private and semi-private dining, roughly 30+ covers per restaurant section, bar seating and heated domes — a proper country pub near Epping Forest.',
  summary:
    'Private and semi-private rooms, roughly 30+ covers in each main restaurant section, bar seating and heated domes for smaller teams.',
  intro:
    'If the office Christmas party has been a chain-pub buffet for the last three years, do something better with it. The Merry Fiddlers is a proper country pub minutes from Epping and the edge of Epping Forest, with real restaurant sections, private and semi-private space, and a kitchen that cooks at a level people talk about afterwards.\n\nWe host everything from a table of eight in a heated dome to a full department taking over a restaurant section — roughly 30+ covers in each main area, with bar seating for drinks receptions and the flexibility to combine spaces for larger groups.\n\nTell us your numbers, your date and how you want the night to feel. We build the event around it — food, drinks, timings and layout.',
  // PLACEHOLDER festive image — swap for a real photo of a party at the pub
  // as soon as the owner supplies one. See .same/todos.md (image library note).
  heroImage: '/christmas-parties-placeholder.jpg',
  status: 'register-interest',
  statusLabel: 'Now taking enquiries for December',
  details: [
    { label: 'Group sizes', value: 'From small teams to full-section takeovers' },
    { label: 'Restaurant sections', value: 'Approximately 30+ covers in each main section' },
    { label: 'Private & semi-private', value: 'Several room sizes, combinable for larger parties' },
    { label: 'Heated domes', value: 'Fairy-lit private domes for smaller groups' },
    { label: 'Bar seating', value: 'For drinks receptions and standing elements' },
    { label: 'Timing', value: 'Lunch or evening bookings' },
  ],
  confirmed: [
    'Private and semi-private dining areas in several sizes.',
    'Roughly 30+ covers in each main restaurant section.',
    'Bar seating for arrival drinks and receptions.',
    'Heated, fairy-lit domes for smaller groups.',
    'Formal restaurant dining, premium food, cocktails and a proper wine list.',
    'Bespoke events built around your brief.',
  ],
  toFollow: [
    'Festive party menus for 2026.',
    'Drinks package options.',
    'Minimum numbers and deposit terms per space.',
  ],
  ctaLabel: 'Enquire about a Christmas party',
  formHeading: 'Christmas party enquiry',
  formBlurb:
    'Tell us roughly what you need and we will come back with the right space, timings and options. The good December dates go early — particularly Fridays and Saturdays.',
  leadSource: 'christmas-party-enquiry',
  faqs: [
    {
      q: 'How many people can you seat for a Christmas party?',
      a: 'Each main restaurant section takes roughly 30+ covers, and sections can be combined for larger parties. Smaller groups often prefer one of the heated domes. Tell us your numbers and we will recommend the right layout.',
    },
    {
      q: 'Can we have a private room?',
      a: 'Yes — we have private and semi-private dining areas in different sizes, plus bar seating for a drinks reception beforehand.',
    },
    {
      q: 'Do you do lunchtime Christmas parties?',
      a: 'We do. Daytime bookings suit a lot of teams and there is usually more choice of date.',
    },
    {
      q: 'What are the festive menus and prices?',
      a: 'The 2026 festive party menus are being finalised. Send an enquiry and you will be among the first to receive them.',
    },
    {
      q: 'Where are you and is there parking?',
      a: 'We are at 4 Fiddlers Hamlet, Epping CM16 7PY — a few minutes from Epping and on the edge of Epping Forest, with on-site parking.',
    },
  ],
};

// ---------------------------------------------------------------------------
// The rest of the festive week
// ---------------------------------------------------------------------------

export const FESTIVE_OCCASIONS: FestiveOccasion[] = [
  {
    slug: 'christmas-eve',
    name: "Christmas Eve",
    dateLine: 'Thursday 24 December 2026',
    isoDate: '2026-12-24',
    eyebrow: 'Lunch & dinner',
    h1: 'Christmas Eve at The Merry Fiddlers',
    metaTitle: 'Christmas Eve 2026 in Epping | The Merry Fiddlers Country Pub',
    metaDescription:
      'Christmas Eve lunch and dinner at The Merry Fiddlers in Epping. Open Thursday 24 December with the fires lit and the bar running on. Book your table now.',
    summary:
      'Open for lunch and dinner, fires lit and the bar full of people who have finally finished work. Book your table now.',
    intro:
      'Christmas Eve is one of the best nights of the year here — the fires going, the bar full of people who have finally finished work, and everyone in a good mood.\n\nWe are open for lunch and dinner on Thursday 24 December. The kitchen closes a little earlier than a normal evening so our team can get home to their own families, and the bar stays open after that.\n\nTables are being taken now. Christmas Eve is always busy, so book early.',
    heroImage: '/pub-front-3.jpeg',
    status: 'register-interest',
    statusLabel: 'Open · Booking now',
    details: [
      { label: 'Date', value: 'Thursday 24 December 2026' },
      { label: 'Service', value: 'Lunch and dinner' },
      { label: 'Kitchen', value: 'Closes earlier than a normal evening' },
      { label: 'Bar', value: 'Open on after the kitchen closes' },
      { label: 'Booking', value: 'Open now' },
    ],
    confirmed: [
      'Open for lunch and dinner on Christmas Eve.',
      'Fires lit and the bar running on into the evening.',
      'Tables can be booked now.',
    ],
    toFollow: [],
    ctaLabel: 'Send my enquiry',
    formHeading: 'Booking a bigger group?',
    formBlurb:
      'Book online for most tables. For larger groups, or anything you would like to arrange in advance, send us a note and we will come straight back to you.',
    leadSource: 'festive-christmas-eve',
    faqs: [
      {
        q: 'Are you open on Christmas Eve?',
        a: 'Yes — open for both lunch and dinner on Thursday 24 December, with the bar running on into the evening.',
      },
      {
        q: 'Do I need to book?',
        a: 'We would strongly recommend it. Christmas Eve is one of our busiest days. Book online or give us a ring on 01992 572142.',
      },
    ],
  },
  {
    slug: 'boxing-day',
    name: 'Boxing Day',
    dateLine: 'Saturday 26 December 2026',
    isoDate: '2026-12-26',
    eyebrow: 'Lunch & dinner',
    h1: 'Boxing Day at The Merry Fiddlers',
    metaTitle: 'Boxing Day Lunch & Dinner in Epping 2026 | The Merry Fiddlers',
    metaDescription:
      'Open for Boxing Day lunch and dinner at The Merry Fiddlers, Epping. A proper Boxing Day menu rather than Christmas dinner all over again. Book your table now.',
    summary:
      'Open for lunch and dinner with a proper Boxing Day menu — not Christmas dinner all over again. Book your table now.',
    intro:
      'Boxing Day should not be Christmas dinner again. We are open for lunch and dinner on Saturday 26 December with something rather better in mind.\n\nOur kitchen builds a menu for the 26th that makes intelligent use of everything Christmas leaves behind — the sort of cooking that is genuinely better the day after. Fires lit, a long lunch, and nobody cooking it but us.\n\nTables are being taken now.',
    heroImage: '/food-1.jpeg',
    status: 'register-interest',
    statusLabel: 'Open · Booking now',
    details: [
      { label: 'Date', value: 'Saturday 26 December 2026' },
      { label: 'Service', value: 'Lunch and dinner' },
      { label: 'Menu', value: 'A proper Boxing Day menu, not a repeat of the 25th' },
      { label: 'Booking', value: 'Open now' },
    ],
    confirmed: [
      'Open for lunch and dinner on Boxing Day.',
      'A Boxing Day menu of its own, rather than Christmas dinner twice.',
      'Tables can be booked now.',
    ],
    toFollow: [],
    ctaLabel: 'Send my enquiry',
    formHeading: 'Booking a bigger group?',
    formBlurb:
      'Book online for most tables. For larger groups, or anything you would like to arrange in advance, send us a note and we will come straight back to you.',
    leadSource: 'festive-boxing-day',
    faqs: [
      {
        q: 'Are you open on Boxing Day?',
        a: 'Yes — open for both lunch and dinner on Saturday 26 December.',
      },
      {
        q: 'What is on the Boxing Day menu?',
        a: 'A menu built for the 26th rather than a second Christmas dinner. It goes up on the site closer to the date — ring us on 01992 572142 if you would like to know more before then.',
      },
    ],
  },
  {
    slug: 'new-years-eve',
    name: "New Year's Eve",
    dateLine: 'Thursday 31 December 2026',
    isoDate: '2026-12-31',
    eyebrow: 'See the year out',
    h1: "New Year's Eve at The Merry Fiddlers",
    metaTitle: "New Year's Eve 2026 in Epping | The Merry Fiddlers Country Pub",
    metaDescription:
      "New Year's Eve at The Merry Fiddlers, Epping. Open Thursday 31 December, food served through the evening, no compulsory set menu and the bar open late. Book your table now.",
    summary:
      'Open on 31 December with food served through the evening, no compulsory set menu and the bar open late. Book your table now.',
    intro:
      'New Year\u2019s Eve at a proper country pub, rather than a hotel ballroom with a fixed price and a menu you did not choose.\n\nWe are open on Thursday 31 December, serving food through the evening with the fires lit and the bar open late. There is no compulsory set menu — have three courses, or something good at the bar, and keep your table for the night either way.\n\nTables are being taken now. New Year\u2019s Eve fills faster than any other night in our calendar, so book early.',
    heroImage: '/hero.webp',
    status: 'register-interest',
    statusLabel: 'Open · Booking now',
    details: [
      { label: 'Date', value: 'Thursday 31 December 2026' },
      { label: 'Food', value: 'Served through the evening' },
      { label: 'Set menu', value: 'None — eat as much or as little as you like' },
      { label: 'Bar', value: 'Open late' },
      { label: 'Booking', value: 'Open now' },
    ],
    confirmed: [
      'Open on New Year\u2019s Eve with food served through the evening.',
      'No compulsory set menu and no fixed price to see the year out.',
      'Fires lit and the bar open late.',
      'Tables can be booked now.',
    ],
    toFollow: [],
    ctaLabel: 'Send my enquiry',
    formHeading: 'Booking a bigger group?',
    formBlurb:
      'Book online for most tables. For larger groups, or anything you would like to arrange in advance, send us a note and we will come straight back to you.',
    leadSource: 'festive-new-years-eve',
    faqs: [
      {
        q: 'Is there a set menu on New Year\u2019s Eve?',
        a: 'No compulsory set menu and no fixed ticket price. Eat as much or as little as you like and keep your table for the evening.',
      },
      {
        q: 'Do I need to book?',
        a: 'Yes — New Year\u2019s Eve is the busiest night of our year and it does sell out. Book online or give us a ring on 01992 572142.',
      },
    ],
  },
  {
    slug: 'new-years-day',
    name: "New Year's Day",
    dateLine: 'Friday 1 January 2027',
    isoDate: '2027-01-01',
    eyebrow: 'Start the year properly',
    h1: "New Year's Day at The Merry Fiddlers",
    metaTitle: "New Year's Day 2027 in Epping | The Merry Fiddlers Country Pub",
    metaDescription:
      "Open on New Year's Day, Friday 1 January 2027, at The Merry Fiddlers in Epping. Fires lit, food from midday and Epping Forest on the doorstep. Book your table now.",
    summary:
      'Open from midday on Friday 1 January — fires lit, and Epping Forest on the doorstep for the walk beforehand. Book your table now.',
    intro:
      'We are open on New Year\u2019s Day, Friday 1 January 2027, from midday.\n\nA long walk in Epping Forest and then somewhere warm with a fire going is about as good as the 1st of January gets. Bring the dog, bring the muddy boots, and let us do the cooking.\n\nTables are being taken now.',
    heroImage: '/pub-front-1.jpeg',
    status: 'register-interest',
    statusLabel: 'Open · Booking now',
    details: [
      { label: 'Date', value: 'Friday 1 January 2027' },
      { label: 'Open from', value: 'Midday' },
      { label: 'Nearby', value: 'Epping Forest walks on the doorstep' },
      { label: 'Booking', value: 'Open now' },
    ],
    confirmed: [
      'Open from midday on New Year\u2019s Day.',
      'Fires lit, dogs and muddy boots welcome in the bar.',
      'Tables can be booked now.',
    ],
    toFollow: [],
    ctaLabel: 'Send my enquiry',
    formHeading: 'Booking a bigger group?',
    formBlurb:
      'Book online for most tables. For larger groups, or anything you would like to arrange in advance, send us a note and we will come straight back to you.',
    leadSource: 'festive-new-years-day',
    faqs: [
      {
        q: 'Are you open on New Year\u2019s Day?',
        a: 'Yes — open from midday on Friday 1 January 2027, with the fires lit.',
      },
      {
        q: 'Do I need to book?',
        a: 'It is worth it. New Year\u2019s Day is popular with walkers coming out of the forest. Book online or ring us on 01992 572142.',
      },
    ],
  },
];

export const ALL_FESTIVE: FestiveOccasion[] = [
  CHRISTMAS_DAY,
  CHRISTMAS_PARTIES,
  ...FESTIVE_OCCASIONS,
];

export function festiveSlugs(): string[] {
  return FESTIVE_OCCASIONS.map((o) => o.slug);
}

export function getFestiveOccasion(slug: string): FestiveOccasion | undefined {
  return FESTIVE_OCCASIONS.find((o) => o.slug === slug);
}

/** Ordered list used for the "festive diary" on the hub page. */
export const FESTIVE_DIARY: FestiveOccasion[] = [
  FESTIVE_OCCASIONS[0], // Christmas Eve
  CHRISTMAS_DAY,
  FESTIVE_OCCASIONS[1], // Boxing Day
  FESTIVE_OCCASIONS[2], // New Year's Eve
  FESTIVE_OCCASIONS[3], // New Year's Day
];

/** Genuine venue advantages — used across the Christmas pages. */
export const VENUE_STRENGTHS: { title: string; body: string }[] = [
  {
    title: 'Open fires & log burners',
    body: 'Real fires in the bar and log burners going from October — the reason people come back through the winter.',
  },
  {
    title: 'Formal restaurant dining',
    body: 'Proper restaurant sections, not tables squeezed into a bar. Roughly 30+ covers in each main area.',
  },
  {
    title: 'Private & semi-private rooms',
    body: 'Several room sizes that can be used on their own or combined for larger parties.',
  },
  {
    title: 'Heated dining domes',
    body: 'Fairy-lit, heated private domes — ideal for smaller groups who want a room of their own.',
  },
  {
    title: 'Premium gastro-style food',
    body: 'Classic French and English technique with a modern hand. The food is the reason to book.',
  },
  {
    title: 'Cocktails, wine & premium lager',
    body: 'A full cocktail list, a wine list worth lingering over and premium draught at the bar.',
  },
  {
    title: 'Bar seating for receptions',
    body: 'Space to gather with a drink before you sit down, so arrivals never feel awkward.',
  },
  {
    title: 'Minutes from Epping',
    body: 'Fiddlers Hamlet, on the edge of Epping Forest, with on-site parking and easy access from Epping.',
  },
];
