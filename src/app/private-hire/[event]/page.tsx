import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight, Check, Download, MessageSquare, ArrowRight, MapPin,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import { EVENTS, getEvent, allEventSlugs } from '@/lib/events';
import { BOOK_URL } from '@/lib/whatsOn';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export function generateStaticParams() {
  return allEventSlugs().map((event) => ({ event }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ event: string }> }): Promise<Metadata> {
  const { event } = await params;
  const ev = getEvent(event);
  if (!ev) return {};
  const url = `${SITE_URL}/private-hire/${ev.slug}`;
  return {
    title: ev.metaTitle,
    description: ev.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: ev.metaTitle,
      description: ev.metaDescription,
      url,
      siteName: 'The Merry Fiddlers',
      type: 'website',
      images: [{ url: `${SITE_URL}${ev.heroImage}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ev.metaTitle,
      description: ev.metaDescription,
      images: [`${SITE_URL}${ev.heroImage}`],
    },
  };
}

export default async function EventPage({
  params,
}: { params: Promise<{ event: string }> }) {
  const { event } = await params;
  const ev = getEvent(event);
  if (!ev) notFound();

  const url = `${SITE_URL}/private-hire/${ev.slug}`;
  const related = ev.related
    .map((s) => EVENTS.find((e) => e.slug === s))
    .filter(Boolean) as typeof EVENTS;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: ev.h1,
        serviceType: ev.name,
        description: ev.metaDescription,
        areaServed: 'Epping, Essex',
        provider: {
          '@type': 'Restaurant',
          name: 'The Merry Fiddlers',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '4 Fiddlers Hamlet',
            addressLocality: 'Epping',
            postalCode: 'CM16 7PY',
            addressCountry: 'GB',
          },
          telephone: '+44 1992 572142',
          url: SITE_URL,
        },
        url,
      },
      {
        '@type': 'FAQPage',
        mainEntity: ev.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Private Hire & Occasions', item: `${SITE_URL}/private-hire` },
          { '@type': 'ListItem', position: 3, name: ev.name, item: url },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden text-white">
          <img
            src={ev.heroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d3a3a]/92 via-[#2d4a4a]/82 to-[#1d3a3a]/92" />
          <div className="container mx-auto px-4 relative z-10">
            <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/private-hire" className="hover:text-white">Private Hire</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">{ev.name}</span>
            </nav>
            <div className="max-w-3xl">
              <span className="text-[#c9a55c] uppercase tracking-[0.25em] text-xs font-semibold">
                {ev.eyebrow}
              </span>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl mt-3 mb-5 leading-tight"
                style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}
              >
                {ev.h1}
              </h1>
              <p className="flex items-center gap-2 text-white/70 text-sm mb-7">
                <MapPin className="w-4 h-4 text-[#c9a55c]" /> Fiddlers Hamlet, Epping, Essex
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/download-brochure?event=${ev.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#c9a55c] hover:bg-[#b8944b] text-[#1d3a3a] rounded-lg font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Brochure
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4" /> Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            {ev.intro.split('\n\n').map((para) => (
              <p key={para.slice(0, 24)} className="text-lg text-gray-700 leading-relaxed mb-5">
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Highlights */}
        <section className="pb-4">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {ev.highlights.map((h) => (
                <div key={h.title} className="bg-[#f8f6f1] rounded-2xl p-7 border border-transparent hover:border-[#c9a55c]/30 transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-[#2d4a4a] flex items-center justify-center mb-4">
                    <Check className="w-5 h-5 text-[#c9a55c]" />
                  </div>
                  <h3 className="text-lg text-[#2d4a4a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    {h.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{h.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brochure band */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[#2d4a4a] to-[#1d3a3a] text-white p-8 lg:p-12 text-center">
              <h2 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                Planning {ev.name.toLowerCase()}?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-7">
                Download our event brochure for menus, spaces and ideas — or send us an
                enquiry and we&rsquo;ll help you plan every detail.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/download-brochure?event=${ev.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#c9a55c] hover:bg-[#b8944b] text-[#1d3a3a] rounded-lg font-semibold transition-colors"
                >
                  <Download className="w-4 h-4" /> Download Brochure
                </Link>
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  Book a Table
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="pb-16 lg:pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl text-[#2d4a4a] mb-8 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {ev.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group bg-[#f8f6f1] rounded-xl border border-gray-100 p-5 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between gap-3 cursor-pointer font-semibold text-[#2d4a4a]">
                    {f.q}
                    <ChevronRight className="w-5 h-5 text-[#c9a55c] flex-shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="text-gray-600 text-sm leading-relaxed mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="pb-20">
            <div className="container mx-auto px-4 max-w-5xl">
              <h2 className="text-2xl text-[#2d4a4a] mb-6 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                Other Occasions
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/private-hire/${r.slug}`}
                    className="group flex items-center justify-between gap-3 bg-white border border-gray-200 hover:border-[#c9a55c] rounded-xl p-5 transition-colors"
                  >
                    <span className="font-medium text-[#2d4a4a]">{r.name}</span>
                    <ArrowRight className="w-4 h-4 text-[#c9a55c] group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
