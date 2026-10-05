import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight, ArrowRight, Flame, TreePine, PartyPopper, Sparkles,
  Clock, MapPin, Phone, CalendarDays, CheckCircle2, Info,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import {
  CHRISTMAS_DAY,
  CHRISTMAS_PARTIES,
  FESTIVE_DIARY,
  VENUE_STRENGTHS,
  BOOK_URL,
} from '@/lib/christmas';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title: 'Christmas 2026 in Epping | Christmas Day, Parties & New Year | The Merry Fiddlers',
  description:
    'Christmas at The Merry Fiddlers, a country pub near Epping Forest. Christmas Day reservations open with no deposit, office Christmas parties in Epping, Christmas Eve, Boxing Day and New Year.',
  keywords: [
    'Christmas Day lunch Epping',
    'Christmas parties Epping',
    'Christmas party venue near Epping Forest',
    'private Christmas dining Epping',
    'Boxing Day Epping',
    "New Year's Eve Epping",
  ],
  alternates: { canonical: `${SITE_URL}/christmas` },
  openGraph: {
    title: 'Christmas 2026 at The Merry Fiddlers, Epping',
    description:
      'Christmas Day reservations open with no deposit, office Christmas parties, Christmas Eve, Boxing Day and New Year at a proper country pub near Epping Forest.',
    url: `${SITE_URL}/christmas`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
    images: [{ url: `${SITE_URL}/christmas-hero-placeholder.jpg` }],
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Christmas', item: `${SITE_URL}/christmas` },
  ],
};

const eventsLd = FESTIVE_DIARY.map((o) => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: `${o.name} at The Merry Fiddlers`,
  startDate: o.isoDate,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  description: o.summary,
  url: `${SITE_URL}/christmas/${o.slug}`,
  image: `${SITE_URL}${o.heroImage}`,
  location: {
    '@type': 'Restaurant',
    name: 'The Merry Fiddlers',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4 Fiddlers Hamlet',
      addressLocality: 'Epping',
      addressRegion: 'Essex',
      postalCode: 'CM16 7PY',
      addressCountry: 'GB',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'The Merry Fiddlers',
    url: SITE_URL,
  },
}));

export default function ChristmasHubPage() {
  return (
    <div className="min-h-screen bg-[#f8f4ec]">
      <Header />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsLd) }}
      />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative isolate overflow-hidden bg-[#14302f] text-white">
          {/*
            PLACEHOLDER festive image. Swap for a real photo of the pub dressed
            for Christmas the moment the owner supplies one.
          */}
          <img
            src="/christmas-hero-placeholder.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 -z-10 w-full h-full object-cover"
          />
          {/* Depth scrim — inline so it can never depend on class generation */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                'linear-gradient(115deg, rgba(20,48,47,0.94) 0%, rgba(20,48,47,0.80) 38%, rgba(43,15,19,0.72) 72%, rgba(60,20,24,0.86) 100%)',
            }}
          />
          {/* Warm festive glow + bottom vignette so the copy always sits clear */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(46rem 28rem at 84% -8%, rgba(201,165,92,0.28), transparent 62%), radial-gradient(34rem 22rem at 2% 106%, rgba(140,47,57,0.34), transparent 62%), linear-gradient(to top, rgba(9,26,25,0.72), transparent 46%)',
            }}
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-px -z-10"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(201,165,92,0.5), transparent)',
            }}
          />

          <div className="container mx-auto px-4 relative z-10 py-20 lg:py-28">
            <nav className="flex items-center gap-2 text-sm text-white/55 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">Christmas</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a55c]/40 bg-[#c9a55c]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-[#e6cd94] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                Christmas 2026
              </span>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl mt-6 mb-6 leading-[1.05]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  textShadow: '0 3px 26px rgba(0,0,0,0.55)',
                }}
              >
                Christmas at{' '}
                <span className="block text-[#c9a55c]">The Merry Fiddlers</span>
              </h1>
              <p
                className="text-lg sm:text-xl text-white/85 leading-relaxed max-w-2xl"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.5)' }}
              >
                Fires lit, log burners going, the restaurant properly dressed and
                a kitchen that takes December seriously. A country pub on the
                edge of Epping Forest — for the office party, the family lunch
                and everything in between.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link
                  href="/christmas/christmas-day"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#8c2f39] hover:bg-[#a03744] text-[#f8f1e3] rounded-lg uppercase tracking-[0.14em] text-[13px] font-semibold transition-colors shadow-xl shadow-black/25"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <TreePine className="w-4 h-4" />
                  Reserve your Christmas Day place
                </Link>
                <Link
                  href="/christmas/christmas-parties"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border-2 border-[#c9a55c]/60 hover:bg-[#c9a55c] hover:text-[#1d3a3a] text-[#e6cd94] rounded-lg uppercase tracking-[0.14em] text-[13px] font-semibold transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <PartyPopper className="w-4 h-4" />
                  Christmas parties
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Two commercial priorities ---------------- */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-7 max-w-6xl mx-auto">
              {/* Christmas Day */}
              <article className="group relative overflow-hidden rounded-3xl bg-[#1d3a3a] text-white shadow-xl">
                <div className="absolute inset-0">
                  <img
                    src={CHRISTMAS_DAY.heroImage}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14302f] via-[#1d3a3a]/85 to-[#1d3a3a]/55" />
                </div>
                <div className="relative p-8 lg:p-10 flex flex-col h-full min-h-[420px]">
                  <span className="inline-flex self-start items-center gap-2 rounded-full bg-[#8c2f39] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] font-bold text-[#f7e6c9]">
                    {CHRISTMAS_DAY.statusLabel}
                  </span>
                  <h2
                    className="text-3xl lg:text-4xl mt-6 mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Christmas Day
                  </h2>
                  <p className="text-[#c9a55c] text-sm uppercase tracking-[0.2em] mb-5">
                    {CHRISTMAS_DAY.dateLine}
                  </p>
                  <p className="text-white/80 leading-relaxed mb-6 flex-1">
                    {CHRISTMAS_DAY.summary}
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {[
                      'Fires lit and the restaurant dressed for the day',
                      'Staggered sittings so the kitchen holds its standard',
                      'A glass in your hand the moment you walk in',
                      'No deposit required to reserve right now',
                    ].map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-sm text-white/85">
                        <CheckCircle2 className="w-4 h-4 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/christmas/christmas-day"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#8c2f39] hover:bg-[#a03744] text-[#f8f1e3] rounded-lg text-[13px] uppercase tracking-[0.14em] font-semibold transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Reserve your place <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>

              {/* Christmas parties */}
              <article className="group relative overflow-hidden rounded-3xl bg-white border border-[#e0d5bf] shadow-xl">
                <div className="relative h-56 overflow-hidden bg-[#2b0f13]">
                  <img
                    src={CHRISTMAS_PARTIES.heroImage}
                    alt="Christmas party toast — festive dining at The Merry Fiddlers, Epping"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(45,74,74,0.55), rgba(45,74,74,0.10) 45%, transparent 72%)',
                    }}
                  />
                </div>
                <div className="p-8 lg:p-10">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#2d4a4a] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] font-bold text-[#c9a55c]">
                    {CHRISTMAS_PARTIES.statusLabel}
                  </span>
                  <h2
                    className="text-3xl lg:text-4xl text-[#2d4a4a] mt-6 mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Christmas Parties
                  </h2>
                  <p className="text-[#9c7e3f] text-sm uppercase tracking-[0.2em] mb-5">
                    Office · Corporate · Groups
                  </p>
                  <p className="text-[#5c5343] leading-relaxed mb-6">
                    {CHRISTMAS_PARTIES.summary} Premium food, cocktails and a
                    proper wine list, minutes from Epping.
                  </p>
                  <Link
                    href="/christmas/christmas-parties"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#2d4a4a] hover:bg-[#14302f] text-white rounded-lg text-[13px] uppercase tracking-[0.14em] font-semibold transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Enquire now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ---------------- Festive diary ---------------- */}
        <section className="py-16 lg:py-20 bg-[#2d4a4a] text-white relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(38rem 22rem at 96% 0%, rgba(201,165,92,0.16), transparent 62%), radial-gradient(32rem 20rem at 0% 100%, rgba(140,47,57,0.28), transparent 62%)',
            }}
          />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 text-[#c9a55c] uppercase tracking-[0.28em] text-[11px] font-semibold">
                <span className="h-px w-8 bg-[#c9a55c]/60" /> The Festive Diary
                <span className="h-px w-8 bg-[#c9a55c]/60" />
              </span>
              <h2
                className="text-3xl md:text-4xl mt-4 mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Every Date That Matters
              </h2>
              <p className="text-white/70 leading-relaxed">
                We are open right through the festive week, serving food and
                taking bookings on every date below. Fires lit, the old place
                dressed for it, and a table with your name on it.
              </p>
            </div>

            <ol className="max-w-4xl mx-auto space-y-4">
              {FESTIVE_DIARY.map((o) => (
                <li key={o.slug}>
                  <Link
                    href={`/christmas/${o.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-2xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.09] hover:border-[#c9a55c]/45 p-5 sm:p-6 transition-all"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#c9a55c]/15 border border-[#c9a55c]/30 flex items-center justify-center">
                      <CalendarDays className="w-6 h-6 text-[#c9a55c]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3
                          className="text-xl sm:text-2xl"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          {o.name}
                        </h3>
                        <span className="text-[#c9a55c] text-xs uppercase tracking-[0.18em]">
                          {o.dateLine}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm mt-2 leading-relaxed">
                        {o.summary}
                      </p>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] font-semibold text-[#c9a55c] group-hover:gap-3 transition-all">
                      Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            <p className="flex items-start gap-2.5 justify-center text-sm text-white/55 max-w-2xl mx-auto mt-10 text-center sm:text-left">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#c9a55c]" />
              <span>
                December books up quickly &mdash; especially Christmas Eve and
                New Year&rsquo;s Eve. Reserve online, or ring us on{' '}
                <a href="tel:+441992572142" className="text-[#c9a55c] font-semibold hover:underline">
                  01992&nbsp;572142
                </a>{' '}
                and we will sort it out with you.
              </span>
            </p>
          </div>
        </section>

        {/* ---------------- Why here ---------------- */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-2 text-[#9c7e3f] uppercase tracking-[0.28em] text-[11px] font-semibold">
                <span className="h-px w-8 bg-[#c9a55c]/60" /> Why Here
                <span className="h-px w-8 bg-[#c9a55c]/60" />
              </span>
              <h2
                className="text-3xl md:text-4xl text-[#2d4a4a] mt-4 mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                A Proper Country Pub, Not a Function Room
              </h2>
              <p className="text-[#5c5343] leading-relaxed">
                Everything below is genuinely ours — no stock photography, no
                packages we cannot deliver.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {VENUE_STRENGTHS.map((s) => (
                <div
                  key={s.title}
                  className="rounded-2xl bg-white border border-[#e6dcc8] p-6 hover:border-[#c9a55c]/60 hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#2d4a4a] flex items-center justify-center mb-4">
                    <Flame className="w-5 h-5 text-[#c9a55c]" />
                  </div>
                  <h3
                    className="text-lg text-[#2d4a4a] mb-2 leading-snug"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#6b6252] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Contact strip ---------------- */}
        <section className="py-14 bg-[#14302f] text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid md:grid-cols-[1.4fr_1fr] gap-10 items-center">
              <div>
                <h2
                  className="text-2xl md:text-3xl mb-3"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Prefer to talk it through?
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Ring the pub and speak to someone who can actually see the
                  book. We are happy to walk you through the spaces, the
                  timings and what we can do for your group.
                </p>
              </div>
              <div className="space-y-3 text-sm">
                <a
                  href="tel:+441992572142"
                  className="flex items-center gap-3 text-white/85 hover:text-[#c9a55c] transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#c9a55c]" /> +44 1992 572142
                </a>
                <p className="flex items-center gap-3 text-white/70">
                  <MapPin className="w-5 h-5 text-[#c9a55c]" /> 4 Fiddlers Hamlet, Epping CM16 7PY
                </p>
                <p className="flex items-center gap-3 text-white/70">
                  <Clock className="w-5 h-5 text-[#c9a55c]" /> Wed–Sat 12:00–00:00 · Sun 12:00–20:00
                </p>
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-5 py-3 bg-[#c9a55c] hover:bg-[#b8944b] text-[#14302f] rounded-lg text-[12px] uppercase tracking-[0.14em] font-bold transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Book an ordinary table
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
