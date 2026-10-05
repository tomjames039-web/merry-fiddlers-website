import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight, ArrowRight, CheckCircle2, Info, Phone, CalendarDays,
  CalendarCheck,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import FestiveInterestForm from '@/components/christmas/FestiveInterestForm';
import {
  FESTIVE_OCCASIONS,
  festiveSlugs,
  getFestiveOccasion,
  BOOK_URL,
} from '@/lib/christmas';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export function generateStaticParams() {
  return festiveSlugs().map((occasion) => ({ occasion }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ occasion: string }>;
}): Promise<Metadata> {
  const { occasion } = await params;
  const o = getFestiveOccasion(occasion);
  if (!o) return { title: 'Christmas | The Merry Fiddlers' };

  return {
    title: o.metaTitle,
    description: o.metaDescription,
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
}

export default async function FestiveOccasionPage({
  params,
}: {
  params: Promise<{ occasion: string }>;
}) {
  const { occasion } = await params;
  const o = getFestiveOccasion(occasion);
  if (!o) notFound();

  const paragraphs = o.intro.split('\n\n');
  const others = FESTIVE_OCCASIONS.filter((x) => x.slug !== o.slug);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Christmas', item: `${SITE_URL}/christmas` },
        { '@type': 'ListItem', position: 3, name: o.name, item: `${SITE_URL}/christmas/${o.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `${o.name} at The Merry Fiddlers`,
      startDate: o.isoDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      description: o.metaDescription,
      url: `${SITE_URL}/christmas/${o.slug}`,
      image: `${SITE_URL}${o.heroImage}`,
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
    ...(o.faqs.length
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: o.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]
      : []),
  ];

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
          <div className="container mx-auto px-4 relative z-10 py-16 lg:py-20">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-white/55 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/christmas" className="hover:text-white transition-colors">Christmas</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">{o.name}</span>
            </nav>

            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c9a55c]/45 bg-[#c9a55c]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#e6cd94]">
                <CalendarDays className="w-3.5 h-3.5" />
                {o.statusLabel}
              </span>
              <h1
                className="text-4xl sm:text-5xl mt-6 mb-4 leading-[1.08]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  textShadow: '0 3px 24px rgba(0,0,0,0.5)',
                }}
              >
                {o.h1}
              </h1>
              <p className="text-[#c9a55c] uppercase tracking-[0.24em] text-sm">
                {o.dateLine}
              </p>
              <p className="text-lg text-white/85 leading-relaxed max-w-2xl mt-5">
                {o.summary}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#8c2f39] hover:bg-[#a03744] text-[#f8f1e3] rounded-lg uppercase tracking-[0.14em] text-[13px] font-semibold transition-colors shadow-xl shadow-black/30"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book a table
                </a>
                <a
                  href="tel:+441992572142"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border-2 border-[#c9a55c]/60 hover:bg-[#c9a55c] hover:text-[#1d3a3a] text-[#e6cd94] rounded-lg uppercase tracking-[0.14em] text-[13px] font-semibold transition-colors"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Phone className="w-4 h-4" />
                  01992 572142
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- Body ---------------- */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-[1fr_0.95fr] gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
              <div>
                <span className="inline-flex items-center gap-2 text-[#9c7e3f] uppercase tracking-[0.28em] text-[11px] font-semibold">
                  <span className="h-px w-8 bg-[#c9a55c]/60" /> {o.eyebrow}
                </span>
                <h2
                  className="text-3xl text-[#2d4a4a] mt-4 mb-6"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {o.name} at The Fiddlers
                </h2>
                {paragraphs.map((p) => (
                  <p key={p.slice(0, 32)} className="text-[#5c5343] leading-relaxed mb-5">
                    {p}
                  </p>
                ))}

                <dl className="mt-8 rounded-2xl border border-[#e0d5bf] bg-white overflow-hidden">
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

                <div
                  className={`grid gap-5 mt-8 ${
                    o.toFollow.length > 0 ? 'sm:grid-cols-2' : ''
                  }`}
                >
                  <div className="rounded-2xl border border-[#2d4a4a]/15 bg-white p-6">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#2d4a4a] font-bold mb-4">
                      What to expect
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
                  {o.toFollow.length > 0 && (
                    <div className="rounded-2xl border border-[#c9a55c]/40 bg-[#fffaf0] p-6">
                      <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#9c7e3f] font-bold mb-4">
                        Still to come
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
                </div>
              </div>

              <div className="lg:sticky lg:top-28">
                {/* Primary action: an actual booking */}
                <div className="rounded-3xl border border-[#c9a55c]/40 bg-[#14302f] text-white p-7 shadow-xl mb-5">
                  <h2 className="text-xl" style={{ fontFamily: "'Cinzel', serif" }}>
                    Book your table
                  </h2>
                  <p className="text-white/70 text-sm mt-2 leading-relaxed">
                    {o.name} bookings are open. Reserve online in under a
                    minute, or ring the pub and speak to someone who can see
                    the book.
                  </p>
                  <a
                    href={BOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#c9a55c] hover:bg-[#b8944b] text-[#14302f] rounded-lg uppercase tracking-[0.14em] text-[13px] font-bold transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Book online
                  </a>
                  <a
                    href="tel:+441992572142"
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 text-[#e6cd94] hover:text-white text-sm font-semibold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    01992 572142
                  </a>
                </div>

                <div className="rounded-3xl border border-[#e0d5bf] bg-[#fdfaf4] shadow-xl overflow-hidden">
                  <div className="bg-gradient-to-br from-[#8c2f39] to-[#5e1c24] text-[#f8f1e3] px-7 py-6">
                    <h2 className="text-xl" style={{ fontFamily: "'Cinzel', serif" }}>
                      {o.formHeading}
                    </h2>
                    <p className="text-[#f0d9b5]/90 text-sm mt-2 leading-relaxed">
                      {o.formBlurb}
                    </p>
                  </div>
                  <div className="p-6 sm:p-7">
                    <FestiveInterestForm
                      occasion={o.name}
                      dateLine={o.dateLine}
                      source={o.leadSource}
                      ctaLabel={o.ctaLabel}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FAQs ---------------- */}
        {o.faqs.length > 0 && (
          <section className="py-14 bg-white border-t border-[#eae0cc]">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2
                  className="text-2xl text-[#2d4a4a] mb-7 text-center"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Common questions
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
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Other festive dates ---------------- */}
        <section className="py-16 bg-[#2d4a4a] text-white">
          <div className="container mx-auto px-4">
            <h2
              className="text-2xl md:text-3xl text-center mb-10"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              The Rest of the Festive Week
            </h2>
            <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {others.map((x) => (
                <Link
                  key={x.slug}
                  href={`/christmas/${x.slug}`}
                  className="group rounded-2xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.09] hover:border-[#c9a55c]/45 p-6 transition-all"
                >
                  <p className="text-[#c9a55c] text-[11px] uppercase tracking-[0.18em] mb-2">
                    {x.dateLine}
                  </p>
                  <h3 className="text-lg mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                    {x.name}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] font-semibold text-[#c9a55c] group-hover:gap-3 transition-all">
                    Details <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/christmas/christmas-day"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#8c2f39] hover:bg-[#a03744] text-[#f8f1e3] rounded-lg text-[13px] uppercase tracking-[0.14em] font-semibold transition-colors"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Reserve your Christmas Day place <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
