import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight, CheckCircle2, Clock, Users, Flame, TreePine,
  Info, Phone, ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import ChristmasDayForm from '@/components/christmas/ChristmasDayForm';
import { CHRISTMAS_DAY } from '@/lib/christmas';

const SITE_URL = 'https://themerryfiddlers.co.uk';
const o = CHRISTMAS_DAY;

export const metadata: Metadata = {
  title: o.metaTitle,
  description: o.metaDescription,
  keywords: [
    'Christmas Day lunch Epping',
    'Christmas Day dinner Epping',
    'Christmas Day pub Epping Forest',
    'Christmas Day restaurant Essex',
  ],
  alternates: { canonical: `${SITE_URL}/christmas/${o.slug}` },
  openGraph: {
    title: o.metaTitle,
    description: o.metaDescription,
    url: `${SITE_URL}/christmas/${o.slug}`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
    images: [{ url: `${SITE_URL}${o.heroImage}` }],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Christmas', item: `${SITE_URL}/christmas` },
      { '@type': 'ListItem', position: 3, name: 'Christmas Day', item: `${SITE_URL}/christmas/${o.slug}` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Christmas Day Lunch at The Merry Fiddlers',
    startDate: o.isoDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description: o.metaDescription,
    url: `${SITE_URL}/christmas/${o.slug}`,
    image: `${SITE_URL}${o.heroImage}`,
    maximumAttendeeCapacity: 100,
    location: {
      '@type': 'Restaurant',
      name: 'The Merry Fiddlers',
      telephone: '+44 1992 572142',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4 Fiddlers Hamlet',
        addressLocality: 'Epping',
        addressRegion: 'Essex',
        postalCode: 'CM16 7PY',
        addressCountry: 'GB',
      },
    },
    organizer: { '@type': 'Organization', name: 'The Merry Fiddlers', url: SITE_URL },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: o.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
];

export default function ChristmasDayPage() {
  const paragraphs = o.intro.split('\n\n');

  return (
    <div className="min-h-screen bg-[#f8f4ec]">
      <Header />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden text-white">
          <img
            src={o.heroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#3c1418]/94 via-[#14302f]/90 to-[#1d3a3a]/94" />
          <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-white/55 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/christmas" className="hover:text-white transition-colors">Christmas</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">Christmas Day</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#8c2f39] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] font-bold text-[#f7e6c9]">
                <TreePine className="w-3.5 h-3.5" />
                {o.statusLabel}
              </span>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl mt-6 mb-4 leading-[1.05]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  textShadow: '0 3px 26px rgba(0,0,0,0.5)',
                }}
              >
                {o.h1}
              </h1>
              <p className="text-[#c9a55c] uppercase tracking-[0.24em] text-sm mb-6">
                {o.dateLine}
              </p>
              <p
                className="text-lg text-white/85 leading-relaxed max-w-2xl"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.45)' }}
              >
                {o.summary}
              </p>
              <a
                href="#reserve"
                className="inline-flex items-center gap-2.5 mt-9 px-8 py-4 bg-[#8c2f39] hover:bg-[#a03744] text-[#f8f1e3] rounded-lg uppercase tracking-[0.14em] text-[13px] font-semibold transition-colors shadow-xl shadow-black/30"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Reserve your Christmas Day place <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ---------------- Key facts strip ---------------- */}
        <section className="bg-[#14302f] text-white border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 max-w-5xl mx-auto">
              {[
                { icon: Flame, head: 'Fires lit all day', sub: 'The restaurant dressed for it' },
                { icon: Clock, head: 'Staggered sittings', sub: 'So the kitchen holds its standard' },
                { icon: Users, head: 'No deposit yet', sub: 'Reserve while the menu is finalised' },
              ].map((f) => (
                <div key={f.head} className="flex items-center gap-4 py-6 sm:px-8">
                  <f.icon className="w-6 h-6 text-[#c9a55c] flex-shrink-0" />
                  <div>
                    <p className="font-semibold leading-snug">{f.head}</p>
                    <p className="text-sm text-white/60">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Story + reservation ---------------- */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
              {/* Left: the story */}
              <div>
                <span className="inline-flex items-center gap-2 text-[#9c7e3f] uppercase tracking-[0.28em] text-[11px] font-semibold">
                  <span className="h-px w-8 bg-[#c9a55c]/60" /> {o.eyebrow}
                </span>
                <h2
                  className="text-3xl md:text-4xl text-[#2d4a4a] mt-4 mb-6"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  The Day, Done Properly
                </h2>
                {paragraphs.map((p) => (
                  <p key={p.slice(0, 32)} className="text-[#5c5343] leading-relaxed mb-5">
                    {p}
                  </p>
                ))}

                {/* Details table */}
                <dl className="mt-8 rounded-2xl border border-[#e0d5bf] bg-white overflow-hidden">
                  {o.details.map((d, i) => (
                    <div
                      key={d.label}
                      className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 px-6 py-4 ${
                        i % 2 ? 'bg-[#faf7f0]' : ''
                      }`}
                    >
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-[#9c8f77] font-semibold sm:w-40 flex-shrink-0">
                        {d.label}
                      </dt>
                      <dd className="text-[#2d4a4a] font-medium">{d.value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Honest status */}
                <div className="grid sm:grid-cols-2 gap-5 mt-8">
                  <div className="rounded-2xl border border-[#2d4a4a]/15 bg-white p-6">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#2d4a4a] font-bold mb-4">
                      Confirmed today
                    </h3>
                    <ul className="space-y-2.5">
                      {o.confirmed.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-[#5c5343]">
                          <CheckCircle2 className="w-4 h-4 text-[#2d7a5a] flex-shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-[#c9a55c]/40 bg-[#fffaf0] p-6">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#9c7e3f] font-bold mb-4">
                      Still to be released
                    </h3>
                    <ul className="space-y-2.5">
                      {o.toFollow.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-[#6b6252]">
                          <Info className="w-4 h-4 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right: the form */}
              <div id="reserve" className="lg:sticky lg:top-28 scroll-mt-28">
                <div className="rounded-3xl border border-[#e0d5bf] bg-[#fdfaf4] shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-[#8c2f39] to-[#5e1c24] text-[#f8f1e3] px-8 py-7">
                    <h2
                      className="text-2xl"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {o.formHeading}
                    </h2>
                    <p className="text-[#f0d9b5]/90 text-sm mt-2 leading-relaxed">
                      {o.formBlurb}
                    </p>
                  </div>
                  <div className="p-7 sm:p-8">
                    <ChristmasDayForm source={o.leadSource} />
                  </div>
                </div>

                <p className="flex items-center justify-center gap-2 text-sm text-[#6b6252] mt-6">
                  <Phone className="w-4 h-4 text-[#8c2f39]" />
                  Rather book by phone?{' '}
                  <a
                    href="tel:+441992572142"
                    className="font-semibold text-[#8c2f39] hover:underline"
                  >
                    01992 572142
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FAQs ---------------- */}
        <section className="py-16 lg:py-20 bg-white border-t border-[#eae0cc]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2
                className="text-3xl text-[#2d4a4a] mb-8 text-center"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Christmas Day Questions
              </h2>
              <div className="space-y-4">
                {o.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-xl border border-[#e6dcc8] bg-[#fdfaf4] px-6 py-5 open:border-[#c9a55c]/60"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[#2d4a4a] font-semibold">
                      {f.q}
                      <ChevronRight className="w-4 h-4 flex-shrink-0 text-[#c9a55c] group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-[#5c5343] leading-relaxed mt-3">{f.a}</p>
                  </details>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-[#6b6252] mb-5">
                  Planning a work do as well as the family lunch?
                </p>
                <Link
                  href="/christmas/christmas-parties"
                  className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white rounded-lg text-[13px] uppercase tracking-[0.14em] font-semibold transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Christmas parties in Epping <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
