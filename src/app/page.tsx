import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Phone, Clock, MapPin, Mail, Facebook, Instagram, FileText, CalendarCheck,
  Star, Flame, UtensilsCrossed, Tent, Trees, Wine, Users, TreePine,
  ArrowRight, PartyPopper,
} from 'lucide-react';
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';
import SocialFeed from '@/components/SocialFeed';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title:
    'The Merry Fiddlers | Country Pub & Restaurant in Epping, Essex',
  description:
    'A proper country pub near Epping Forest — open fires and log burners, premium gastro dining, famous Sunday roasts, heated private dining domes and a huge garden. Christmas Day reservations now open.',
  keywords: [
    'pub Epping',
    'restaurant Epping',
    'country pub Epping',
    'Sunday roast Epping',
    'pub near Epping Forest',
    'private dining Epping',
    'Christmas Day lunch Epping',
    'Christmas parties Epping',
  ],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'The Merry Fiddlers | Country Pub & Restaurant in Epping, Essex',
    description:
      'Open fires, log burners, premium gastro dining and the Sunday roast people travel for — on the edge of Epping Forest since the 1600s.',
    url: SITE_URL,
    siteName: 'The Merry Fiddlers',
    type: 'website',
    images: [{ url: `${SITE_URL}/pub-front-1.jpeg` }],
  },
};

const BOOK_URL = 'https://www.sevenrooms.com/reservations/themerryfiddlers';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: BOOK_URL, external: true },
  { name: 'Christmas', href: '/christmas' },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: "What's On", href: '/upcoming' },
  { name: 'Journal', href: '/blog' },
  { name: 'Getting Here', href: '/getting-here' },
  { name: 'Contact Us', href: '/contact' },
];

const testimonials = [
  { name: 'Susan Poulton', text: 'Come here for Mother\'s Day and the whole experience was amazing! The food was unbelievable, service was perfect. Cannot wait to come back - thank you so much!' },
  { name: 'Damien Walters', text: 'Lovely pub with welcoming staff. Great salt beef sandwich and chips. Best Sunday roast ever. Excellent value at £10' },
  { name: 'Mike Marsh', text: 'Amazing place with very good food and very friendly and helpful staff. I had the mixed roast which was massive and really tasty.' },
];

/** Genuine, owner-confirmed reasons to come. No invented claims. */
const reasons = [
  {
    icon: Flame,
    title: 'Open fires & log burners',
    body: 'Real fires in the bar from the first cold snap. Muddy boots and dogs welcome — this is what a country pub is supposed to feel like.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Premium gastro-style dining',
    body: 'Classic French and English technique with a modern hand, served in proper restaurant sections rather than squeezed round the bar.',
  },
  {
    icon: Star,
    title: 'The Sunday roast people travel for',
    body: 'Beef, lamb or chicken, proper roast potatoes and a Yorkshire to be proud of. Every Sunday, 12 till 6 — and it books out.',
  },
  {
    icon: Tent,
    title: 'Heated private dining domes',
    body: 'Fairy-lit, heated and completely your own. Magical from October onwards, whatever the weather is doing outside.',
  },
  {
    icon: Trees,
    title: 'Huge garden & children\u2019s play area',
    body: 'One of the largest gardens in the area with a proper space for the kids — and a four-metre screen for the big matches.',
  },
  {
    icon: Wine,
    title: 'Cocktails, wine & premium lager',
    body: 'A full cocktail list, a wine list worth lingering over, real ales and premium draught. Two-for-one cocktails every Friday.',
  },
  {
    icon: Users,
    title: 'Private dining & celebrations',
    body: 'Private and semi-private rooms, corporate events, wakes, weddings and work dos — built around what you actually want.',
  },
  {
    icon: MapPin,
    title: 'Minutes from Epping Forest',
    body: 'Fiddlers Hamlet, on the edge of the forest, with on-site parking. Walk the forest, then sit down somewhere warm.',
  },
];

/** Temporary promo — retires itself after the date passes. */
const BANK_HOLIDAY = {
  live: true,
  showUntil: '2026-08-31', // inclusive; the block disappears on 1 September
  title: 'Summer Bank Holiday Monday',
  date: 'Monday 31 August 2026',
};

function bankHolidayIsOn(): boolean {
  if (!BANK_HOLIDAY.live) return false;
  return new Date().toISOString().slice(0, 10) <= BANK_HOLIDAY.showUntil;
}

export default function Home() {
  const showBankHoliday = bankHolidayIsOn();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/pub-flowers.jpeg"
            alt="The Merry Fiddlers country pub in Fiddlers Hamlet, Epping"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/55" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <img
            src="/logo.png"
            alt="The Merry Fiddlers - Country Pub & Restaurant - Fiddlers Hamlet"
            className="h-28 md:h-36 lg:h-40 w-auto mx-auto mb-6"
          />
          <h1
            className="text-base md:text-lg mb-3 text-white/90 uppercase tracking-[0.2em] font-normal"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Proudly Serving Epping Since the 1600s
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            A country pub and restaurant on the edge of Epping Forest &mdash;
            open fires, proper food and a good bottle of red.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <CalendarCheck className="w-5 h-5" />
              Book A Table
            </a>
            <Link
              href="/download-brochure"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#2d4a4a] transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <FileText className="w-5 h-5" />
              Download Event Brochure
            </Link>
          </div>
        </div>
      </section>

      {/* Temporary: Summer Bank Holiday Monday */}
      {showBankHoliday && (
        <section className="bg-[#c9a55c]">
          <div className="container mx-auto px-4 py-7">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 max-w-5xl mx-auto text-center lg:text-left">
              <div className="flex items-center gap-5">
                <span className="hidden sm:flex w-14 h-14 rounded-full bg-white/25 items-center justify-center flex-shrink-0">
                  <PartyPopper className="w-7 h-7 text-white" />
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/85 font-semibold">
                    We are open specially · {BANK_HOLIDAY.date}
                  </p>
                  <h2
                    className="text-2xl md:text-3xl text-white mt-1"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {BANK_HOLIDAY.title}
                  </h2>
                  <p className="text-white/90 mt-1.5">
                    Food served <strong>12:00pm&nbsp;&ndash;&nbsp;7:30pm</strong>.
                    We are normally closed on Mondays, so tables will go quickly
                    — booking online is strongly recommended.
                  </p>
                </div>
              </div>
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-[#2d4a4a] hover:bg-[#14302f] text-white rounded-lg uppercase tracking-[0.14em] text-[13px] font-semibold transition-colors"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <CalendarCheck className="w-4 h-4" />
                Book for the Bank Holiday
              </a>
            </div>
          </div>
        </section>
      )}

      {/* About Section — autumn rewrite */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl text-[#2d4a4a] mb-4">
            A Proper Country Pub on the Edge of Epping Forest
          </h2>
          <div className="section-divider" />
          <p className="text-lg text-[#4a5a58] leading-relaxed mt-8 mb-6">
            <span className="font-semibold text-[#2d4a4a]">
              The fires are lit, the log burners are going and the kitchen is at
              its best.
            </span>{' '}
            This is the time of year The Merry Fiddlers was built for.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            We have stood in Fiddlers Hamlet since the 1600s, and we still do the
            things a country pub should do properly. A long walk in the forest and
            then somewhere warm to sit. A Sunday roast that people genuinely
            travel for. A restaurant that takes its food seriously — classic
            French and English technique with a modern hand — and a bar with real
            ales, premium lager, a proper cocktail list and wine worth lingering
            over.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            Come for a roast and stay for the afternoon. Book the formal
            restaurant for a birthday, or one of the heated domes for a table of
            eight under the fairy lights. Bring the children — there is a huge
            garden and a play area. Bring the dog and your muddy boots into the
            bar. Eat well, drink well, and take your time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#14302f] text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <CalendarCheck className="w-5 h-5" />
              Book A Table
            </a>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              View Our Menus
            </Link>
          </div>
        </div>
      </section>

      {/* Food Gallery */}
      <section>
        <div className="grid grid-cols-3">
          <div className="aspect-square overflow-hidden">
            <img src="/food-1.jpeg" alt="Gastro-style dish at The Merry Fiddlers, Epping" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square overflow-hidden">
            <img src="/food-2.jpeg" alt="Seasonal fish dish from our à la carte menu" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square overflow-hidden">
            <img src="/food-3.jpeg" alt="Sunday roast in Epping at The Merry Fiddlers" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Why The Merry Fiddlers — genuine USPs */}
      <section className="relative py-20 lg:py-28 bg-[#f4f1e8] overflow-hidden">
        {/* warm paper glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(55rem 38rem at 12% -12%, rgba(201,165,92,0.18), transparent 62%), radial-gradient(48rem 34rem at 102% 112%, rgba(45,74,74,0.10), transparent 66%)',
          }}
        />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.92fr_1.08fr] gap-14 lg:gap-20">
            {/* Left — sticky masthead */}
            <div className="lg:sticky lg:top-28 self-start">
              <span className="inline-flex items-center gap-3 text-[#9c7e3f] uppercase tracking-[0.3em] text-[10px] font-semibold">
                <span className="h-px w-10 bg-[#c9a55c]" />
                Why The Fiddlers
              </span>
              <h2
                className="text-4xl md:text-5xl text-[#2d4a4a] mt-5 leading-[1.06]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                What You&rsquo;ll
                <span className="block text-[#9c7e3f]">Find Here</span>
              </h2>
              <p className="text-[#5c6b68] leading-relaxed mt-6 text-lg max-w-md">
                Eight honest reasons people keep coming back &mdash; no
                marketing gloss, just what is actually waiting for you in
                Fiddlers Hamlet.
              </p>

              <div className="flex flex-wrap gap-3 mt-9">
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2d4a4a] hover:bg-[#14302f] text-white transition-colors uppercase tracking-[0.14em] text-xs font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book A Table
                </a>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#2d4a4a]/35 text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-colors uppercase tracking-[0.14em] text-xs font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  View Menus
                </Link>
              </div>

              <div className="mt-10 pt-8 border-t border-[#d8ccb0] max-w-md">
                <p
                  className="text-[11px] uppercase tracking-[0.24em] text-[#9c7e3f]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Fiddlers Hamlet &middot; Epping &middot; Est. 1600s
                </p>
                <p className="text-[#6b6252] text-sm leading-relaxed mt-3">
                  Wednesday to Saturday from noon, Sundays 12&ndash;8.
                  On-site parking, dogs welcome in the bar.
                </p>
              </div>
            </div>

            {/* Right — numbered editorial index */}
            <ol className="relative">
              {reasons.map((r, i) => (
                <li
                  key={r.title}
                  className="group border-t border-[#d8ccb0] last:border-b"
                >
                  <div className="flex gap-5 sm:gap-7 py-6 px-3 -mx-3 transition-colors duration-300 group-hover:bg-white/70">
                    <span
                      className="text-sm pt-1 shrink-0 tracking-[0.12em] text-[#c9a55c] transition-colors duration-300 group-hover:text-[#9c7e3f]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className="flex items-center gap-2.5 text-lg sm:text-xl text-[#2d4a4a] leading-snug"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        <r.icon className="w-[18px] h-[18px] text-[#c9a55c] shrink-0" />
                        {r.title}
                      </h3>
                      <p className="text-[#6b6252] leading-relaxed mt-2">
                        {r.body}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Christmas band */}
      <section className="relative isolate overflow-hidden bg-[#2b0f13] text-white">
        <img
          src="/dome.jpeg"
          alt=""
          aria-hidden
          className="absolute inset-0 -z-10 w-full h-full object-cover opacity-20"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(43,15,19,0.94) 0%, rgba(60,20,24,0.82) 40%, rgba(20,48,47,0.90) 100%)',
          }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(201,165,92,0.6), transparent)',
          }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(201,165,92,0.35), transparent)',
          }}
        />

        <div className="container mx-auto px-4 relative py-20 lg:py-28">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a55c]/40 bg-[#c9a55c]/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.26em] text-[#e6cd94] font-semibold">
                <TreePine className="w-3.5 h-3.5" />
                Christmas 2026
              </span>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl mt-6 mb-5 leading-[1.12]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Christmas Day reservations
                <span className="block text-[#c9a55c]">are open now</span>
              </h2>
              <p className="text-white/85 leading-relaxed text-lg mb-4">
                Fires lit, candles on the tables and the old place dressed for
                the day. A glass in your hand the moment you walk in, and
                everything cooked to order.
              </p>
              <p className="text-white/60 leading-relaxed mb-9">
                Spend Christmas Day with us and let someone else do the
                washing up. No deposit needed to reserve while we put the
                final touches to the menu.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/christmas/christmas-day"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8c2f39] hover:bg-[#a03744] text-[#f8f1e3] uppercase tracking-[0.12em] text-xs font-semibold transition-colors shadow-xl shadow-black/30"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Reserve your place
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/christmas/christmas-parties"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-[#c9a55c]/60 hover:bg-[#c9a55c] hover:text-[#1d3a3a] text-[#e6cd94] uppercase tracking-[0.12em] text-xs font-semibold transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Christmas parties
                </Link>
              </div>
            </div>

            {/* Festive itinerary */}
            <div className="border border-[#c9a55c]/25 bg-black/30 p-2 sm:p-3">
              <p className="px-3 pt-2.5 pb-3 text-[10px] uppercase tracking-[0.3em] text-[#c9a55c]">
                The Festive Week
              </p>
              <ul>
                {[
                  { name: 'Christmas Eve', date: '24 Dec', href: '/christmas/christmas-eve', note: 'Lunch & dinner · booking now' },
                  { name: 'Christmas Day', date: '25 Dec', href: '/christmas/christmas-day', note: 'Reservations open · no deposit yet', highlight: true },
                  { name: 'Boxing Day', date: '26 Dec', href: '/christmas/boxing-day', note: 'Lunch & dinner · booking now' },
                  { name: "New Year's Eve", date: '31 Dec', href: '/christmas/new-years-eve', note: 'No set menu · booking now' },
                  { name: "New Year's Day", date: '1 Jan', href: '/christmas/new-years-day', note: 'Open from midday · booking now' },
                ].map((d) => (
                  <li key={d.name}>
                    <Link
                      href={d.href}
                      className={`group flex items-center gap-4 px-3 py-3.5 border-t border-white/10 transition-colors ${
                        d.highlight
                          ? 'bg-[#8c2f39]/40 hover:bg-[#8c2f39]/60'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-14 shrink-0 text-[11px] uppercase tracking-[0.1em] text-[#c9a55c]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {d.date}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-sm">
                          {d.name}
                        </span>
                        <span className="block text-[11px] text-white/60 mt-0.5">
                          {d.note}
                        </span>
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#c9a55c] shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Events & Private Hire */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl text-[#2d4a4a] mb-4">
            Events & Private Hire in Epping
          </h2>
          <div className="section-divider" />
          <p className="text-gray-600 max-w-2xl mx-auto mt-8 text-lg leading-relaxed">
            Private and semi-private dining rooms, formal restaurant sections,
            heated domes and a garden that takes a marquee. Weddings, wakes,
            christenings, birthdays, corporate dinners and work parties — built
            around what you actually want.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/private-hire"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#14302f] text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Private Hire & Occasions
            </Link>
            <Link
              href="/download-brochure"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <FileText className="w-5 h-5" />
              Download Event Brochure
            </Link>
          </div>
        </div>
      </section>

      {/* Book & Menu Cards */}
      <section className="py-20 bg-[#f8f6f1]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Sunday roast */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden card-hover">
              <div className="h-64 overflow-hidden">
                <img src="/food-3.jpeg" alt="Sunday roast at The Merry Fiddlers in Epping" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl text-[#2d4a4a] mb-4">Sunday Roast</h3>
                <p className="text-gray-600 mb-6">
                  Every Sunday, 12 till 6. Beef, lamb or chicken, all the
                  trimmings and a Yorkshire to be proud of. Booking strongly
                  recommended.
                </p>
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <CalendarCheck className="w-5 h-5" />
                  Book Your Roast
                </a>
              </div>
            </div>

            {/* View Menus */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden card-hover">
              <div className="h-64 overflow-hidden">
                <img src="/food-2.jpeg" alt="Our à la carte menu at The Merry Fiddlers" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl text-[#2d4a4a] mb-4">View Menus</h3>
                <p className="text-gray-600 mb-6">
                  À la carte Wednesday to Saturday, roasts on Sunday, afternoon
                  tea in the week and a full bar all day.
                </p>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  View Menus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 teal-gradient text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl text-center mb-4">
            What Our Customers Say
          </h2>
          <div className="section-divider" />
          <p className="text-center text-white/80 text-lg mt-6 mb-12 max-w-2xl mx-auto">
            Thousands of Sunday lunches, birthdays and long evenings by the fire
            — here is what a few of them said afterwards.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex gap-1 mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-[#c9a55c] text-[#c9a55c]" />
                  ))}
                </div>
                <p className="text-white/90 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="text-[#c9a55c] font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl text-[#2d4a4a] text-center mb-4">
            Get In Touch
          </h2>
          <div className="section-divider" />
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-12">
            <ContactForm source="homepage" />
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#2d4a4a] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#2d4a4a]">Address</h3>
                  <p className="text-gray-600">4 Fiddlers Hamlet, Epping CM16 7PY, United Kingdom</p>
                  <Link href="/getting-here" className="text-sm text-[#9c7e3f] hover:text-[#2d4a4a] font-semibold">
                    Directions & parking
                  </Link>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#2d4a4a] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#2d4a4a]">Phone</h3>
                  <a href="tel:+441992572142" className="text-gray-600 hover:text-[#2d4a4a]">+44 1992 572142</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#2d4a4a] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#2d4a4a]">Email</h3>
                  <a href="mailto:info@themerryfiddlers.co.uk" className="text-gray-600 hover:text-[#2d4a4a]">info@themerryfiddlers.co.uk</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-[#2d4a4a] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-[#2d4a4a]">Opening Hours</h3>
                  <p className="text-gray-600">Wednesday – Saturday: 12:00 – 00:00</p>
                  <p className="text-gray-600">Sunday: 12:00 – 20:00</p>
                  <p className="text-gray-600">Monday & Tuesday: closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dine at Dome */}
      <section className="py-20 bg-[#f8f6f1]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl text-[#2d4a4a] mb-6">Dine At Dome</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                Our heated dining domes are a few steps from the pub — fairy-lit,
                warmed for the occasion by Dyson heaters, with Bluetooth speakers
                so you can play your own music. Your own private room under the
                stars, whatever the weather is doing. You can book directly with
                us or through Dine at Dome.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/private-hire/private-dining"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#14302f] text-white transition-all uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Private Dining
                </Link>
                <a
                  href="https://dineatdome.com/listin/the-merry-fiddlers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-all uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  See More
                </a>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl aspect-[4/3] bg-black">
              <img src="/hero.webp" alt="Heated fairy-lit dining dome at The Merry Fiddlers" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Feed */}
      <SocialFeed />

      {/* Footer */}
      <footer className="teal-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo & About */}
            <div>
              <img
                src="/logo.png"
                alt="The Merry Fiddlers"
                className="h-16 w-auto mb-4"
              />
              <p className="text-white/70 text-sm">
                Country Pub & Restaurant proudly serving Epping & surrounding areas since the 1600s.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="The Merry Fiddlers on Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="The Merry Fiddlers on Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h2 className="text-lg font-semibold mb-6 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                <Clock className="w-5 h-5 text-[#c9a55c]" />
                Opening Hours
              </h2>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex justify-between"><span>Monday - Tuesday</span><span className="text-red-400">Closed</span></li>
                <li className="flex justify-between"><span>Wednesday - Saturday</span><span className="text-white">12:00 - 00:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="text-white">12:00 - 20:00</span></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Contact Us</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-white/70">
                  <Phone className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="tel:+441992572142" className="hover:text-white">+44 1992 572142</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <Mail className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="mailto:info@themerryfiddlers.co.uk" className="hover:text-white">info@themerryfiddlers.co.uk</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <span>4 Fiddlers Hamlet, Epping CM16 7PY</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Quick Links</h2>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">{item.name}</a>
                    ) : (
                      <Link href={item.href} className="text-white/70 hover:text-white">{item.name}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} The Merry Fiddlers. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Sticky CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href={BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-full shadow-lg transition-all uppercase tracking-wider text-sm font-medium"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <CalendarCheck className="w-5 h-5" />
          Book A Table
        </a>
      </div>
    </div>
  );
}
