import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChevronRight, Download, ArrowRight,
  Heart, Flower2, TreePine, Cake, Briefcase, PartyPopper, Church, Baby,
  UtensilsCrossed, Tent,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import { EVENTS } from '@/lib/events';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title: 'Private Hire & Events Venue in Epping, Essex | The Merry Fiddlers',
  description:
    "Private hire and events in Epping at The Merry Fiddlers — weddings, wakes, Christmas & work parties, christenings, baby showers and private dining in our heated domes. Download our brochure.",
  alternates: { canonical: `${SITE_URL}/private-hire` },
  openGraph: {
    title: 'Private Hire & Events Venue in Epping, Essex | The Merry Fiddlers',
    description:
      'Weddings, wakes, parties, christenings and private dining at a characterful country pub on the edge of Epping Forest.',
    url: `${SITE_URL}/private-hire`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
    images: [{ url: `${SITE_URL}/pub-front-1.jpeg` }],
  },
};

const icons: Record<string, React.ElementType> = {
  weddings: Heart,
  'funeral-wakes': Flower2,
  'christmas-parties': TreePine,
  'birthday-parties': Cake,
  'corporate-events': Briefcase,
  'work-parties': PartyPopper,
  christenings: Church,
  'baby-showers': Baby,
  'private-dining': UtensilsCrossed,
  'festival-venue': Tent,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Private Hire & Occasions', item: `${SITE_URL}/private-hire` },
  ],
};

export default function PrivateHirePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden text-white">
          <img src="/pub-front-1.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d3a3a]/92 via-[#2d4a4a]/82 to-[#1d3a3a]/92" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">Private Hire & Occasions</span>
            </nav>
            <h1 className="text-4xl md:text-5xl lg:text-6xl mb-5" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}>
              Private Hire & Events
            </h1>
            <p className="text-lg text-white/85 max-w-2xl mx-auto">
              From weddings and wakes to work parties and private dining under the domes —
              a characterful country pub on the edge of Epping Forest for every occasion.
            </p>
            <div className="mt-8">
              <Link
                href="/download-brochure"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#c9a55c] hover:bg-[#b8944b] text-[#1d3a3a] rounded-lg font-semibold transition-colors"
              >
                <Download className="w-4 h-4" /> Download Event Brochure
              </Link>
            </div>
          </div>
        </section>

        {/* Event grid */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="inline-flex items-center gap-2 text-[#c9a55c] uppercase tracking-[0.25em] text-xs font-semibold">
                <span className="h-px w-8 bg-[#c9a55c]/60" /> Occasions
                <span className="h-px w-8 bg-[#c9a55c]/60" />
              </span>
              <h2 className="text-3xl md:text-4xl text-[#2d4a4a] mt-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Whatever You&rsquo;re Celebrating
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {EVENTS.map((ev) => {
                const Icon = icons[ev.slug] || PartyPopper;
                return (
                  <Link
                    key={ev.slug}
                    href={`/private-hire/${ev.slug}`}
                    className="group bg-[#f8f6f1] rounded-2xl p-7 border border-transparent hover:border-[#c9a55c]/40 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#2d4a4a] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#c9a55c]" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#c9a55c] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-[#c9a55c] text-xs uppercase tracking-wider font-semibold">{ev.eyebrow}</span>
                    <h3 className="text-xl text-[#2d4a4a] mt-1 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>{ev.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{ev.highlights[0].body}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Venue features */}
        <section className="py-16 lg:py-20 bg-[#f8f6f1]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl text-[#2d4a4a] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>Our Venue</h2>
            <div className="w-16 h-1 bg-[#c9a55c] mx-auto" />
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12 text-left">
              <div>
                <h3 className="text-xl text-[#2d4a4a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Epping&rsquo;s Largest Beer Garden</h3>
                <p className="text-gray-600 text-sm">Beautiful outdoor space for summer celebrations, with our 4-metre big screen.</p>
              </div>
              <div>
                <h3 className="text-xl text-[#2d4a4a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Heated Dining Domes</h3>
                <p className="text-gray-600 text-sm">Intimate, fairy-lit domes for private dining whatever the weather.</p>
              </div>
              <div>
                <h3 className="text-xl text-[#2d4a4a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>Bespoke Menus</h3>
                <p className="text-gray-600 text-sm">Tailored dining options built around your event and your guests.</p>
              </div>
            </div>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/download-brochure" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg transition-all uppercase tracking-wider text-sm font-medium" style={{ fontFamily: "'Cinzel', serif" }}>
                Download Brochure
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white rounded-lg transition-all uppercase tracking-wider text-sm font-medium" style={{ fontFamily: "'Cinzel', serif" }}>
                Enquire Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
