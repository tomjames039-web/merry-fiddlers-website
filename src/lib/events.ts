import { BOOK_URL } from './whatsOn';

export { BOOK_URL };

export interface EventFaq {
  q: string;
  a: string;
}

export interface EventHighlight {
  title: string;
  body: string;
}

export interface EventType {
  slug: string;
  name: string; // short name, e.g. "Weddings"
  metaTitle: string; // SEO <title>
  metaDescription: string;
  eyebrow: string; // small label above the H1
  h1: string;
  /** 1–2 short paragraphs, separated by a blank line. */
  intro: string;
  heroImage: string;
  highlights: EventHighlight[];
  faqs: EventFaq[];
  /** value sent to the lead pipeline as the event type. */
  leadEventType: string;
  related: string[]; // slugs
}

export const LOCATION = '4 Fiddlers Hamlet, Epping CM16 7PY';

export const EVENTS: EventType[] = [
  {
    slug: 'weddings',
    name: 'Weddings',
    metaTitle: 'Wedding Venue in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      "A characterful wedding venue in Epping with Essex's largest beer garden, heated dining domes and bespoke menus. Download our wedding brochure.",
    eyebrow: 'Weddings & Receptions',
    h1: 'Wedding Receptions at The Merry Fiddlers',
    intro:
      "Tie the knot somewhere with real character. A country pub on the edge of Epping Forest since the 1600s, The Merry Fiddlers blends rustic charm with relaxed elegance — perfect for couples who want a warm, personal celebration rather than a conveyor-belt hotel wedding.\n\nWe offer part or full venue hire, with one of Essex's largest beer gardens for summer ceremonies and photographs, intimate heated dining domes for cosy winter weddings, and bespoke menus built entirely around your day.",
    heroImage: '/pub-front-1.jpeg',
    highlights: [
      { title: 'Flexible spaces', body: 'Hire a private area or take over the whole venue, indoors and out.' },
      { title: 'Bespoke wedding menus', body: 'From canapés and sharing feasts to a full sit-down meal, tailored to you.' },
      { title: 'Garden & domes for any season', body: 'Sunshine in the garden or fairy-lit domes when the weather turns.' },
    ],
    faqs: [
      { q: 'How many guests can you cater for?', a: 'We host everything from intimate gatherings to large parties — tell us your numbers and we will recommend the right space and layout.' },
      { q: 'Can we have exclusive use of the venue?', a: 'Yes, full venue hire is available for weddings. Get in touch early as weekend dates book up quickly.' },
      { q: 'Do you create bespoke menus and cater for dietaries?', a: 'Absolutely — our kitchen builds a menu around your tastes and accommodates allergies and dietary requirements.' },
      { q: 'Is there parking and step-free access?', a: 'There is on-site parking and accessible access; let us know your needs and we will make sure everyone is looked after.' },
    ],
    leadEventType: 'wedding',
    related: ['private-dining', 'christenings', 'birthday-parties'],
  },
  {
    slug: 'funeral-wakes',
    name: 'Funeral Wakes',
    metaTitle: 'Funeral Wakes & Celebration of Life Venue in Epping | The Merry Fiddlers',
    metaDescription:
      'A warm, private space for funeral wakes and celebrations of life in Epping, Essex, with caring service and tailored buffet menus. Speak to our team.',
    eyebrow: 'Funeral Wakes',
    h1: 'Funeral Wakes & Celebrations of Life',
    intro:
      'Saying goodbye is never easy. The Merry Fiddlers offers a calm, welcoming setting for funeral wakes and celebrations of life, where family and friends can gather, share memories and feel properly looked after.\n\nWe provide a private space, thoughtful catering and an experienced team who quietly take care of the details — so you can focus on the people who matter.',
    heroImage: '/pub-front-3.jpeg',
    highlights: [
      { title: 'A private, comfortable space', body: 'A quiet area set aside for your gathering, away from the main bar.' },
      { title: 'Thoughtful catering', body: 'Tea, coffee, sandwiches and warm buffets — simple, generous and done well.' },
      { title: 'A team that takes care of the details', body: 'We handle the arrangements with care and discretion at a difficult time.' },
    ],
    faqs: [
      { q: 'Can you accommodate wakes at short notice?', a: 'Yes — we understand timings are often tight. Call us and we will do everything we can to help.' },
      { q: 'Is there a private area?', a: 'We can set aside a private space appropriate to your numbers so your gathering feels comfortable and personal.' },
      { q: 'What catering is available?', a: 'From tea and sandwiches to hot and cold buffets — we will tailor it to your wishes and budget.' },
      { q: 'How do we make a booking?', a: 'Get in touch by phone or our enquiry form and a member of the team will gently guide you through everything.' },
    ],
    leadEventType: 'other',
    related: ['christenings', 'private-dining'],
  },
  {
    slug: 'christmas-parties',
    name: 'Christmas Parties',
    metaTitle: 'Christmas Party Venue in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      'Book your Christmas party in Epping at The Merry Fiddlers — festive menus, cosy heated dining domes and private hire for work dos and family get-togethers.',
    eyebrow: 'Festive Celebrations',
    h1: 'Christmas Parties at The Merry Fiddlers',
    intro:
      'Make this Christmas one to remember. Whether it is the office party, a get-together with friends or a family celebration, The Merry Fiddlers serves up proper festive food, a brilliant atmosphere and our famously cosy heated dining domes.\n\nFestive menus, drinks packages and private spaces are all available — and the best dates go early, so book ahead to avoid disappointment.',
    heroImage: '/hero.webp',
    highlights: [
      { title: 'Festive set menus', body: 'Generous, beautifully cooked Christmas menus for groups of all sizes.' },
      { title: 'Cosy heated domes', body: 'Fairy-lit, Dyson-heated domes — magical for a winter celebration.' },
      { title: 'Work dos & private hire', body: 'From team parties to full-venue takeovers, we will set the night up for you.' },
    ],
    faqs: [
      { q: 'Do you offer festive set menus?', a: 'Yes — we run dedicated Christmas menus with options for every taste and dietary need.' },
      { q: 'Can we book one of the domes?', a: 'The heated domes are very popular at Christmas and can be reserved for private groups — book early.' },
      { q: 'Do you take group bookings and deposits?', a: 'We welcome groups large and small; a deposit secures your date and we will confirm the details with you.' },
      { q: 'Can you do drinks packages?', a: 'Yes, we can arrange drinks packages and welcome reception options to suit your party.' },
    ],
    leadEventType: 'other',
    related: ['work-parties', 'corporate-events', 'private-dining'],
  },
  {
    slug: 'birthday-parties',
    name: 'Birthday Parties',
    metaTitle: 'Birthday Party Venue in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      'Celebrate your birthday at The Merry Fiddlers in Epping — flexible spaces, buffet and sharing menus, a huge beer garden and the famous garden big screen.',
    eyebrow: 'Birthday Celebrations',
    h1: 'Birthday Parties at The Merry Fiddlers',
    intro:
      'From milestone birthdays to relaxed get-togethers, The Merry Fiddlers is a brilliant spot to celebrate. Enjoy one of Essex\'s largest beer gardens, a warm and characterful interior, and food people actually rave about.\n\nWe will help you pick the right space, put together a buffet or sharing menu, and make sure the birthday guest of honour has a day to remember.',
    heroImage: '/food-1.jpeg',
    highlights: [
      { title: 'Spaces for any size', body: 'A reserved area for a few friends or a private hire for the whole gang.' },
      { title: 'Buffet & sharing menus', body: 'Crowd-pleasing food, from grazing boards to hot buffets.' },
      { title: 'Garden & big screen', body: 'Summer parties in the garden, with our 4-metre screen for the big occasions.' },
    ],
    faqs: [
      { q: 'Can we reserve an area just for our group?', a: 'Yes — depending on numbers we can reserve a section or arrange private hire.' },
      { q: 'Do you cater for large groups?', a: 'We do — from a dozen guests to a big party. Share your numbers and we will sort the rest.' },
      { q: 'Can we bring a cake and decorations?', a: 'Of course — bring your cake and decorations to make the space your own.' },
      { q: 'Is the garden available?', a: 'Our beer garden is perfect for birthdays in the warmer months and can be reserved for groups.' },
    ],
    leadEventType: 'birthday',
    related: ['work-parties', 'baby-showers', 'private-dining'],
  },
  {
    slug: 'corporate-events',
    name: 'Corporate Events',
    metaTitle: 'Corporate Events & Meeting Venue in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      'Host corporate events, meetings and away days near Epping at The Merry Fiddlers — private dining domes, flexible spaces, great food and easy parking.',
    eyebrow: 'Corporate & Business',
    h1: 'Corporate Events at The Merry Fiddlers',
    intro:
      'A refreshing change from the boardroom. The Merry Fiddlers is an easy-to-reach setting near Epping for meetings, away days, client lunches and team dinners — relaxed enough to get people talking, smart enough to impress.\n\nChoose a private space or one of our intimate dining domes, with bespoke menus, on-site parking and a team that keeps the day running smoothly.',
    heroImage: '/food-2.jpeg',
    highlights: [
      { title: 'Private & semi-private spaces', body: 'Set up for meetings, presentations or a relaxed team meal.' },
      { title: 'Working lunches & dinners', body: 'From sandwiches and coffee to a full sit-down menu.' },
      { title: 'Easy to reach, easy parking', body: 'Close to Epping with on-site parking for your team and guests.' },
    ],
    faqs: [
      { q: 'Do you have space for meetings and away days?', a: 'Yes — we offer private and semi-private areas that can be arranged to suit your agenda.' },
      { q: 'Can you provide working lunches?', a: 'We cater everything from tea, coffee and sandwiches to a full lunch or dinner menu.' },
      { q: 'Is there parking and connectivity?', a: 'There is on-site parking; let us know your requirements and we will get you set up.' },
      { q: 'Can you invoice the business?', a: 'Yes, we can arrange business billing — just mention it when you book.' },
    ],
    leadEventType: 'corporate',
    related: ['work-parties', 'christmas-parties', 'private-dining'],
  },
  {
    slug: 'work-parties',
    name: 'Work Parties',
    metaTitle: 'Work Party & Team Night Out Venue in Epping | The Merry Fiddlers',
    metaDescription:
      'Plan your work party or team night out at The Merry Fiddlers in Epping — buffets, drinks packages, a big beer garden and the 4-metre garden screen.',
    eyebrow: 'Team Socials',
    h1: 'Work Parties & Team Nights Out',
    intro:
      'Treat the team to a night out they will actually enjoy. Leaving dos, summer socials, end-of-quarter celebrations or the Christmas do — The Merry Fiddlers has the food, the drinks and the atmosphere to do it properly.\n\nReserve a space, add a buffet and a drinks package, and make the most of our huge beer garden and 4-metre big screen for those can\'t-miss occasions.',
    heroImage: '/pub-front-4.jpeg',
    highlights: [
      { title: 'Reserved areas & private hire', body: 'A space set aside for your team, or the whole place to yourselves.' },
      { title: 'Buffets & drinks packages', body: 'Easy, generous food and drink options that keep things flowing.' },
      { title: 'Garden & big screen', body: 'Sunny socials in the garden and big nights on the 4-metre screen.' },
    ],
    faqs: [
      { q: 'Can we reserve a space for the team?', a: 'Yes — tell us your numbers and we will reserve the right area or arrange private hire.' },
      { q: 'Do you do drinks packages?', a: 'We can put together drinks packages and welcome drinks to suit your budget.' },
      { q: 'Is food included?', a: 'Choose from buffets, sharing boards or a sit-down menu — whatever suits the night.' },
      { q: 'Can we watch the football/sport?', a: 'Absolutely — major tournaments play on our 4-metre garden screen, perfect for a team night.' },
    ],
    leadEventType: 'corporate',
    related: ['christmas-parties', 'corporate-events', 'birthday-parties'],
  },
  {
    slug: 'christenings',
    name: 'Christenings',
    metaTitle: 'Christening Reception Venue in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      'Host your christening reception at The Merry Fiddlers in Epping — a relaxed, family-friendly venue with buffets, afternoon tea and a safe garden for little ones.',
    eyebrow: 'Family Celebrations',
    h1: 'Christening Receptions',
    intro:
      'Celebrate your little one\'s special day with family and friends at The Merry Fiddlers. Our relaxed, welcoming country pub is ideal for christening receptions, with space for all ages and a beautiful garden for the children to enjoy.\n\nFrom afternoon tea to a generous buffet, we will tailor the food and the space so you can relax and enjoy the day.',
    heroImage: '/afternoon-tea.jpg',
    highlights: [
      { title: 'Family-friendly & relaxed', body: 'A warm welcome for all ages, with room for the whole family.' },
      { title: 'Afternoon tea or buffet', body: 'Dainty afternoon tea or a hearty buffet — your choice.' },
      { title: 'A garden for the little ones', body: 'Plenty of outdoor space for children to play in the warmer months.' },
    ],
    faqs: [
      { q: 'Is the venue suitable for children?', a: 'Very much so — we are family-friendly with a large, safe garden for little ones.' },
      { q: 'Can we have a private area?', a: 'Depending on numbers we can reserve a section or arrange private hire for your reception.' },
      { q: 'What food do you offer?', a: 'From afternoon tea to buffets, we will create the right spread for your gathering.' },
      { q: 'Can we decorate the space?', a: 'Yes — bring along your decorations and a cake to personalise the celebration.' },
    ],
    leadEventType: 'christening',
    related: ['baby-showers', 'birthday-parties', 'private-dining'],
  },
  {
    slug: 'baby-showers',
    name: 'Baby Showers',
    metaTitle: 'Baby Shower Venue in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      'Celebrate the mum-to-be at The Merry Fiddlers in Epping — pretty private spaces, afternoon tea and fizz, and a lovely garden. Download our brochure.',
    eyebrow: 'Family Celebrations',
    h1: 'Baby Showers at The Merry Fiddlers',
    intro:
      'Gather your nearest and dearest to celebrate the mum-to-be in lovely surroundings. The Merry Fiddlers is a charming spot for a baby shower, with pretty private spaces, our popular afternoon tea and a beautiful garden.\n\nAdd a glass of fizz, bring your decorations, and leave the food and fuss to us.',
    heroImage: '/pub-flowers.jpeg',
    highlights: [
      { title: 'Pretty, private spaces', body: 'A lovely area set aside for your celebration.' },
      { title: 'Afternoon tea & fizz', body: 'Finger sandwiches, scones and cakes, with bubbles to toast the occasion.' },
      { title: 'Decorate your way', body: 'Bring balloons, banners and a cake to make the day yours.' },
    ],
    faqs: [
      { q: 'Can we have a private space?', a: 'Yes — we can reserve a pretty, private area depending on your numbers.' },
      { q: 'Do you offer afternoon tea?', a: 'Our afternoon tea is a baby-shower favourite, and we can add prosecco or a soft alternative.' },
      { q: 'Can we bring decorations?', a: 'Absolutely — decorate the space and bring a cake to make it special.' },
      { q: 'How do we book?', a: 'Send an enquiry or download our brochure and a member of the team will help you plan.' },
    ],
    leadEventType: 'other',
    related: ['christenings', 'birthday-parties', 'private-dining'],
  },
  {
    slug: 'private-dining',
    name: 'Private Dining & The Domes',
    metaTitle: 'Private Dining & The Domes in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      'Intimate private dining in Epping at The Merry Fiddlers — book our heated, fairy-lit dining domes for à la carte meals, celebrations and special occasions.',
    eyebrow: 'Private Dining',
    h1: 'Private Dining & The Domes',
    intro:
      'For something truly special, dine under the stars in one of our private heated domes. A few steps from the pub, each fairy-lit dome offers an intimate à la carte experience whatever the weather — wonderful all year round and especially magical through the winter.\n\nWith Dyson heaters, Bluetooth speakers so you can play your own music, and attentive service, the domes are perfect for celebrations, date nights and small private gatherings.',
    heroImage: '/dome.jpeg',
    highlights: [
      { title: 'Heated, fairy-lit domes', body: 'Cosy, weather-proof and beautiful in every season.' },
      { title: 'À la carte fine dining', body: 'A refined menu served just for your party.' },
      { title: 'Your music, your night', body: 'Bluetooth speakers in each dome so you set the mood.' },
    ],
    faqs: [
      { q: 'How many people fit in a dome?', a: 'The domes suit intimate groups — tell us your numbers and we will advise on the best fit.' },
      { q: 'Are the domes available in winter?', a: 'Yes — they are heated by Dyson heaters and are especially lovely in the colder months.' },
      { q: 'Is there a minimum spend?', a: 'Dome bookings may carry a minimum spend depending on date and time; we will confirm when you enquire.' },
      { q: 'Can we play our own music?', a: 'Each dome has a Bluetooth speaker so you can play your own playlist.' },
    ],
    leadEventType: 'other',
    related: ['weddings', 'corporate-events', 'birthday-parties'],
  },
  {
    slug: 'festival-venue',
    name: 'Festival Venue',
    metaTitle: 'Festival & Outdoor Event Venue in Epping, Essex | The Merry Fiddlers',
    metaDescription:
      "An outdoor event and festival venue in Epping with one of Essex's largest beer gardens, a 4-metre big screen and full bar service. Enquire about hire.",
    eyebrow: 'Outdoor Events',
    h1: 'Festival & Outdoor Event Venue',
    intro:
      "With one of Essex's largest beer gardens, The Merry Fiddlers is a fantastic outdoor venue for festival-style events, big screenings and large garden gatherings.\n\nOur 4-metre garden big screen brings major tournaments and occasions to life, and our team can arrange bars, food and space for sizeable outdoor events on the edge of Epping Forest.",
    heroImage: '/big-screen-garden.jpg',
    highlights: [
      { title: "Essex's largest beer garden", body: 'Generous outdoor space for sizeable gatherings and events.' },
      { title: '4-metre big screen', body: 'One of the largest screens in Essex for live sport and screenings.' },
      { title: 'Bars & catering', body: 'Full bar service and food options to keep the crowd happy.' },
    ],
    faqs: [
      { q: 'How large an event can the garden hold?', a: 'Our beer garden is one of the largest in the area — share your plans and we will talk through what is possible.' },
      { q: 'Can you screen live sport and events?', a: 'Yes — our 4-metre garden screen is perfect for tournaments, finals and special screenings.' },
      { q: 'Do you provide bars and catering?', a: 'We can arrange bar service and food to match the scale of your event.' },
      { q: 'How do we discuss a larger event?', a: 'Send an enquiry with your dates and numbers and our team will be in touch to plan it with you.' },
    ],
    leadEventType: 'other',
    related: ['work-parties', 'birthday-parties', 'corporate-events'],
  },
];

export function getEvent(slug: string): EventType | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function allEventSlugs(): string[] {
  return EVENTS.map((e) => e.slug);
}
