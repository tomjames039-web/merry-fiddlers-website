import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight, ArrowRight, Users, DoorClosed, Tent, Wine,
  UtensilsCrossed, Building2, CheckCircle2, Info, Phone, MapPin,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import ChristmasPartyForm from '@/components/christmas/ChristmasPartyForm';
import { CHRISTMAS_PARTIES } from '@/lib/christmas';

const SITE_URL = 'https://themerryfiddlers.co.uk';
const o = CHRISTMAS_PARTIES;

export const metadata: Metadata = {
  title: o.metaTitle,
  description: o.metaDescription,
  keywords: [
    'Christmas parties Epping',
    'office Christmas party Epping',
    'corporate Christmas party venue Epping',
    'private Christmas dining Epping',
    'Christmas party venue near Epping Forest',
    'work Christmas party Essex',
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
      { '@type': 'ListItem', position: 3, name: 'Christmas Parties', item: `${SITE_URL}/christmas/${o.slug}` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Christmas Party Venue Hire in Epping',
    serviceType: 'Christmas party and corporate event venue',
    provider: {
      '@type': 'Restaurant',
      name: 'The Merry Fiddlers',
      telephone: '+44 1992 572142',
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '4 Fiddlers Hamlet',
        addressLocality: 'Epping',
        addressRegion: 'Essex',
        postalCode: 'CM16 7PY',
        addressCountry: 'GB',
      },
    },
    areaServed: [
      { '@type': 'City', name: 'Epping' },
      { '@type': 'Place', name: 'Epping Forest' },
      { '@type': 'AdministrativeArea', name: 'Essex' },
    ],
    description: o.metaDescription,
    url: `${SITE_URL}/christmas/${o.slug}`,
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

const spaces = [
  {
    icon: Building2,
    name: 'Main restaurant sections',
    capacity: 'Approximately 30+ covers each',
    body: 'Proper formal dining areas. Take one section for your party or combine sections for larger groups.',
  },
  {
    icon: DoorClosed,
    name: 'Private & semi-private rooms',
    capacity: 'Several sizes',
    body: 'A room of your own for speeches, presentations or simply a party that does not spill into the pub.',
  },
  {
    icon: Tent,
    name: 'Heated dining domes',
    capacity: 'Smaller groups',
    body: 'Fairy-lit, heated and completely private — the one people photograph and post.',
  },
  {
    icon: Wine,
    name: 'Bar seating & receptions',
    capacity: 'Standing or seated',
    body: 'Cocktails and arrival drinks at the bar before you sit down, so nobody is stood about awkwardly.',
  },
];

export default function ChristmasPartiesPage() {
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
          <div className="absolute inset-0 bg-gradient-to-br from-[#14302f]/95 via-[#1d3a3a]/90 to-[#3c1418]/92" />
          <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-white/55 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/christmas" className="hover:text-white transition-colors">Christmas</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">Christmas Parties</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a55c]/45 bg-[#c9a55c]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#e6cd94]">
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
                Office parties · Corporate dinners · Private dining
              </p>
              <p
                className="text-lg text-white/85 leading-relaxed max-w-2xl"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.45)' }}
              >
                Private and semi-private dining minutes from Epping, on the edge
                of Epping Forest. Real restaurant sections, heated domes, proper
                cocktails and food worth the trip.
              </p>
              <a
                href="#enquire"
                className="inline-flex items-center gap-2.5 mt-9 px-8 py-4 bg-[#8c2f39] hover:bg-[#a03744] text-[#f8f1e3] rounded-lg uppercase tracking-[0.14em] text-[13px] font-semibold transition-colors shadow-xl shadow-black/30"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Enquire about your Christmas party <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ---------------- Intro ---------------- */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-2 text-[#9c7e3f] uppercase tracking-[0.28em] text-[11px] font-semibold">
                <span className="h-px w-8 bg-[#c9a55c]/60" /> {o.eyebrow}
                <span className="h-px w-8 bg-[#c9a55c]/60" />
              </span>
              <h2
                className="text-3xl md:text-4xl text-[#2d4a4a] mt-4 mb-7"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                A Work Christmas Party People Actually Want to Come To
              </h2>
              {paragraphs.map((p) => (
                <p key={p.slice(0, 32)} className="text-[#5c5343] leading-relaxed mb-5 text-left sm:text-center">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Spaces ---------------- */}
        <section className="py-16 lg:py-20 bg-[#2d4a4a] text-white relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(38rem 22rem at 100% 0%, rgba(201,165,92,0.16), transparent 60%), radial-gradient(30rem 20rem at 0% 100%, rgba(140,47,57,0.3), transparent 60%)',
            }}
          />
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2
                className="text-3xl md:text-4xl mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                The Spaces
              </h2>
              <p className="text-white/70 leading-relaxed">
                Different rooms, different sizes — used on their own or combined.
                Tell us the numbers and we will tell you honestly what works.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {spaces.map((s) => (
                <div
                  key={s.name}
                  className="rounded-2xl border border-white/12 bg-white/[0.05] p-7 hover:border-[#c9a55c]/45 hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-11 h-11 rounded-xl bg-[#c9a55c]/15 border border-[#c9a55c]/30 flex items-center justify-center">
                      <s.icon className="w-5 h-5 text-[#c9a55c]" />
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-[#c9a55c] font-semibold">
                      {s.capacity}
                    </span>
                  </div>
                  <h3 className="text-xl mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    {s.name}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mt-6">
              {[
                { icon: UtensilsCrossed, text: 'Premium gastro-style food' },
                { icon: Wine, text: 'Cocktails, wine & premium lager' },
                { icon: Users, text: 'Bespoke events built to your brief' },
              ].map((t) => (
                <div
                  key={t.text}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4"
                >
                  <t.icon className="w-5 h-5 text-[#c9a55c] flex-shrink-0" />
                  <span className="text-sm text-white/85">{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Honest status + form ---------------- */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
              <div>
                <h2
                  className="text-3xl text-[#2d4a4a] mb-6"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  What You Get
                </h2>
                <ul className="space-y-3 mb-9">
                  {o.confirmed.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-[#5c5343]">
                      <CheckCircle2 className="w-5 h-5 text-[#2d7a5a] flex-shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>

                {o.toFollow.length > 0 && (
                  <div className="rounded-2xl border border-[#c9a55c]/40 bg-[#fffaf0] p-6 mb-9">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#9c7e3f] font-bold mb-4">
                      Still being finalised
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
                )}

                <dl className="rounded-2xl border border-[#e0d5bf] bg-white overflow-hidden">
                  {o.details.map((d, i) => (
                    <div
                      key={d.label}
                      className={`flex flex-col sm:flex-row sm:gap-6 px-6 py-4 ${i % 2 ? 'bg-[#faf7f0]' : ''}`}
                    >
                      <dt className="text-[11px] uppercase tracking-[0.18em] text-[#9c8f77] font-semibold sm:w-44 flex-shrink-0 pt-0.5">
                        {d.label}
                      </dt>
                      <dd className="text-[#2d4a4a] font-medium text-[15px]">{d.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 space-y-2.5 text-sm">
                  <a
                    href="tel:+441992572142"
                    className="flex items-center gap-3 text-[#2d4a4a] hover:text-[#8c2f39] transition-colors font-semibold"
                  >
                    <Phone className="w-4 h-4 text-[#8c2f39]" /> 01992 572142
                  </a>
                  <p className="flex items-center gap-3 text-[#6b6252]">
                    <MapPin className="w-4 h-4 text-[#8c2f39]" /> 4 Fiddlers Hamlet, Epping CM16 7PY
                  </p>
                </div>
              </div>

              <div id="enquire" className="scroll-mt-28">
                <div className="rounded-3xl border border-[#e0d5bf] bg-[#fdfaf4] shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-[#8c2f39] to-[#5e1c24] text-[#f8f1e3] px-8 py-7">
                    <h2 className="text-2xl" style={{ fontFamily: "'Cinzel', serif" }}>
                      {o.formHeading}
                    </h2>
                    <p className="text-[#f0d9b5]/90 text-sm mt-2 leading-relaxed">
                      {o.formBlurb}
                    </p>
                  </div>
                  <div className="p-7 sm:p-8">
                    <ChristmasPartyForm source={o.leadSource} />
                  </div>
                </div>
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
                Christmas Party Questions
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

              <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/christmas"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white rounded-lg text-[13px] uppercase tracking-[0.14em] font-semibold transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  All Christmas dates
                </Link>
                <Link
                  href="/private-hire"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border-2 border-[#c9a55c] text-[#9c7e3f] hover:bg-[#c9a55c] hover:text-white rounded-lg text-[13px] uppercase tracking-[0.14em] font-semibold transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Private hire all year
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
