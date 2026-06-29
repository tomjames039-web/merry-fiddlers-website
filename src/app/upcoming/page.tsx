'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight,
  Tv, Wine, UtensilsCrossed, Music, Sparkles, Trophy, CalendarDays,
  ArrowUpRight, MapPinned,
} from 'lucide-react';
import Header from '@/components/Header';
import SocialFeed from '@/components/SocialFeed';
import InstagramEmbed from '@/components/InstagramEmbed';
import {
  type WhatsOnItem,
  type WhatsOnCategory,
  BOOK_URL,
  publishedWhatsOn,
  DEFAULT_WHATS_ON,
} from '@/lib/whatsOn';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: BOOK_URL, external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: "What's On", href: '/upcoming' },
  { name: 'Contact Us', href: '/contact' },
];

const categoryIcons: Record<WhatsOnCategory, React.ElementType> = {
  screen: Tv,
  offer: Wine,
  dining: UtensilsCrossed,
  music: Music,
  special: Sparkles,
};

interface EnglandFixture {
  matchup: string;
  opponent: string;
  isHome: boolean;
  competition: string;
  dateEvent: string | null;
  kickoffISO: string | null;
  hasTime: boolean;
  venue: string | null;
}

function tracksEngland(item: WhatsOnItem): boolean {
  return item.trackTeam === 'england' || /england/i.test(item.title);
}

function fmtFixtureDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Europe/London',
  });
}

function fmtFixtureTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/London',
  });
}

export default function WhatsOnPage() {
  const [items, setItems] = useState<WhatsOnItem[]>(() =>
    publishedWhatsOn(DEFAULT_WHATS_ON)
  );

  useEffect(() => {
    let active = true;
    fetch('/api/whats-on')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data?.items) setItems(data.items as WhatsOnItem[]);
      })
      .catch(() => {/* keep defaults */});
    return () => {
      active = false;
    };
  }, []);

  // Live England fixture (auto-updates via free SportsDB API).
  const [fixture, setFixture] = useState<EnglandFixture | null>(null);
  useEffect(() => {
    fetch('/api/england-fixture')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.ok && d.fixture) setFixture(d.fixture as EnglandFixture);
      })
      .catch(() => {/* card falls back to its static text */});
  }, []);

  const screen = items.filter((i) => i.category === 'screen');
  const offers = items.filter((i) => i.category === 'offer');
  const dining = items.filter((i) => i.category === 'dining');
  const specials = items.filter(
    (i) => i.category === 'music' || i.category === 'special'
  );
  const igHighlights = items.filter((i) => i.instagramUrl);

  const feature =
    screen.find((i) => i.featured) || screen[0] || null;
  const sportCards = screen.filter((i) => !feature || i.id !== feature.id);
  // Self-healing image: replace earlier placeholder defaults with the real
  // garden big-screen photo, while respecting any custom image set in admin.
  const STALE_FEATURE_IMAGES = new Set([
    '/pub-front-4.jpeg',
    '/football-pitch.jpg',
  ]);
  const featureImg =
    feature && feature.imageUrl && !STALE_FEATURE_IMAGES.has(feature.imageUrl)
      ? feature.imageUrl
      : '/big-screen-garden.jpg';

  return (
    <div className="min-h-screen bg-[#f8f6f1]">
      <Header />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-br from-[#1d3a3a] via-[#2d4a4a] to-[#1d3a3a] text-white overflow-hidden">
          {/* Real garden big-screen photo behind the hero */}
          <img
            src="/big-screen-garden.jpg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1d3a3a]/85 via-[#1d3a3a]/60 to-[#1d3a3a]/92"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(40rem 24rem at 85% -10%, rgba(201,165,92,0.18), transparent 60%), radial-gradient(36rem 22rem at 0% 110%, rgba(201,165,92,0.12), transparent 60%)',
            }}
          />
          {/* faint stadium-light grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">What's On</span>
            </nav>
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-[#c9a55c] text-[#1d3a3a] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-6">
                <CalendarDays className="w-4 h-4" />
                LIVE SPORT · OFFERS · SIGNATURE DINING
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl mb-6 leading-none"
                style={{
                  fontFamily: "'Cinzel', serif",
                  textShadow: '0 2px 18px rgba(0,0,0,0.5)',
                }}
              >
                What's <span className="text-[#c9a55c]">On</span>
              </h1>
              <p
                className="text-lg md:text-xl text-white/90"
                style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}
              >
                Major tournaments on one of the largest screens in Essex,
                two-for-one weekends at the bar, and the Sunday roast people
                travel for.
              </p>
            </div>

            {/* highlight chips from featured items */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
              {items
                .filter((i) => i.featured)
                .slice(0, 4)
                .map((i) => {
                  const Icon = categoryIcons[i.category];
                  const live =
                    tracksEngland(i) && fixture?.kickoffISO
                      ? `vs ${fixture.opponent}, ${fmtFixtureDate(fixture.kickoffISO)}`
                      : i.subtitle;
                  return (
                    <span
                      key={i.id}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 backdrop-blur px-4 py-2 text-sm"
                    >
                      <Icon className="w-4 h-4 text-[#c9a55c]" />
                      <span className="font-medium">{i.title}</span>
                      {live && <span className="text-white/50">· {live}</span>}
                    </span>
                  );
                })}
            </div>
          </div>
        </section>

        {/* ---------------- The Big Screen feature ---------------- */}
        {feature && (
          <section className="relative -mt-10 lg:-mt-14 z-20 pb-4">
            <div className="container mx-auto px-4">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative min-h-[280px] lg:min-h-[460px]">
                    <img
                      src={featureImg}
                      alt={feature.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#1d3a3a]/90 via-[#1d3a3a]/30 to-transparent" />
                    {feature.badge && (
                      <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-[#c9a55c] text-[#1d3a3a] px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        <Trophy className="w-4 h-4" />
                        {feature.badge}
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="bg-[#2d4a4a] text-white p-8 lg:p-12 flex flex-col justify-center">
                    {feature.subtitle && (
                      <span className="text-[#c9a55c] uppercase tracking-[0.2em] text-xs font-semibold mb-3">
                        {feature.subtitle}
                      </span>
                    )}
                    <h2
                      className="text-3xl lg:text-4xl mb-4"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {feature.title}
                    </h2>
                    <p className="text-white/80 leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    {feature.schedule && (
                      <p className="flex items-center gap-2 text-sm text-white/70 mb-6">
                        <MapPinned className="w-4 h-4 text-[#c9a55c]" />
                        {feature.schedule}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={feature.ctaUrl || BOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a55c] hover:bg-[#b8944b] text-[#1d3a3a] rounded-lg font-semibold transition-colors"
                      >
                        {feature.ctaLabel || 'Book a table'}
                        <ChevronRight className="w-4 h-4" />
                      </a>
                      {feature.facebookEventUrl && (
                        <a
                          href={feature.facebookEventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:bg-white/10 rounded-lg font-medium transition-colors"
                        >
                          <Facebook className="w-4 h-4" /> Event
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------- On the Big Screen (sport) ---------------- */}
        {sportCards.length > 0 && (
          <section className="py-16 lg:py-20">
            <div className="container mx-auto px-4">
              <SectionHeading
                eyebrow="On the Big Screen"
                title="Major Tournaments, Live"
                blurb="We don't show everything — just the moments worth gathering for. Here's what's coming up on the 4-metre garden screen."
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {sportCards.map((ev) => (
                  <SportCard
                    key={ev.id}
                    item={ev}
                    fixture={tracksEngland(ev) ? fixture : null}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Offers ---------------- */}
        {offers.length > 0 && (
          <section className="py-16 lg:py-20 bg-[#2d4a4a] text-white relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  'radial-gradient(36rem 20rem at 100% 0%, rgba(201,165,92,0.16), transparent 60%)',
              }}
            />
            <div className="container mx-auto px-4 relative">
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 text-[#c9a55c] uppercase tracking-[0.25em] text-xs font-semibold">
                  <span className="h-px w-8 bg-[#c9a55c]/60" /> At the Bar
                  <span className="h-px w-8 bg-[#c9a55c]/60" />
                </span>
                <h2
                  className="text-3xl md:text-4xl mt-4"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Offers Worth Raising a Glass To
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {offers.map((ev) => (
                  <OfferCard key={ev.id} item={ev} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Signature dining ---------------- */}
        {dining.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <SectionHeading
                eyebrow="Signature at the Fiddlers"
                title="What We're Known For"
                blurb="From the roast people travel for to fine dining under the domes — these are the bookings that fill up fast."
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {dining.map((ev) => (
                  <DiningCard key={ev.id} item={ev} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Instagram highlights ---------------- */}
        {igHighlights.length > 0 && (
          <section className="py-16 lg:py-20 bg-white">
            <div className="container mx-auto px-4">
              <SectionHeading
                eyebrow="Straight from the garden"
                title="Highlights on Instagram"
                blurb="Real moments from recent nights at The Merry Fiddlers."
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {igHighlights.map((ev) => (
                  <div key={ev.id}>
                    <InstagramEmbed
                      url={ev.instagramUrl as string}
                      title={ev.title}
                      caption={ev.subtitle}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- Also on / specials ---------------- */}
        {specials.length > 0 && (
          <section className="py-16 lg:py-20 bg-[#f1ede4]">
            <div className="container mx-auto px-4">
              <SectionHeading
                eyebrow="Also On"
                title="Specials & Live Music"
                blurb="Seasonal happenings and one-off events at the pub."
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {specials.map((ev) => (
                  <SportCard key={ev.id} item={ev} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- CTA ---------------- */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-[#2d4a4a] to-[#1d3a3a] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Get the Best Seat in the Garden
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Tables go fast on match days and Sundays. Reserve yours now and
              we'll have a warm welcome waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-[#1d3a3a] rounded-lg transition-colors uppercase tracking-wider text-sm font-semibold"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Book A Table
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white/30 hover:bg-white/10 text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Enquire About Events
              </Link>
            </div>
          </div>
        </section>

        <SocialFeed />
      </main>

      <SiteFooter />
    </div>
  );
}

// ---------------- Sub-components ----------------

function SectionHeading({
  eyebrow, title, blurb,
}: { eyebrow: string; title: string; blurb?: string }) {
  return (
    <div className="text-center mb-12 max-w-2xl mx-auto">
      <span className="inline-flex items-center gap-2 text-[#c9a55c] uppercase tracking-[0.25em] text-xs font-semibold">
        <span className="h-px w-8 bg-[#c9a55c]/60" /> {eyebrow}
        <span className="h-px w-8 bg-[#c9a55c]/60" />
      </span>
      <h2 className="text-3xl md:text-4xl text-[#2d4a4a] mt-4 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
        {title}
      </h2>
      {blurb && <p className="text-gray-600">{blurb}</p>}
    </div>
  );
}

function SportCard({
  item,
  fixture,
}: { item: WhatsOnItem; fixture?: EnglandFixture | null }) {
  const Icon = categoryIcons[item.category];
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="w-11 h-11 rounded-xl bg-[#2d4a4a] flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#c9a55c]" />
          </span>
          {item.badge && (
            <span className="text-xs font-bold uppercase tracking-wide bg-[#c9a55c]/15 text-[#9c7e3f] px-3 py-1 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        {item.subtitle && (
          <span className="text-[#c9a55c] text-xs uppercase tracking-wider font-semibold">
            {item.subtitle}
          </span>
        )}
        <h3 className="text-xl text-[#2d4a4a] mt-1 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.description}</p>
        {fixture && (
          <div className="mt-4 rounded-xl bg-[#2d4a4a] text-white p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#c9a55c] font-semibold">
                Next match · auto-updated
              </span>
            </div>
            <p className="font-semibold leading-tight">{fixture.matchup}</p>
            <p className="text-sm text-white/70 mt-0.5">
              {fixture.kickoffISO && fmtFixtureDate(fixture.kickoffISO)}
              {fixture.hasTime && fixture.kickoffISO
                ? ` · ${fmtFixtureTime(fixture.kickoffISO)}`
                : ''}
              {fixture.competition ? ` · ${fixture.competition}` : ''}
            </p>
          </div>
        )}
        {item.schedule && !fixture && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
            <Clock className="w-4 h-4 text-[#c9a55c]" /> {item.schedule}
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href={item.ctaUrl || BOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2d4a4a] hover:text-[#c9a55c] transition-colors"
          >
            {item.ctaLabel || 'Book a table'} <ChevronRight className="w-4 h-4" />
          </a>
          {item.facebookEventUrl && (
            <a
              href={item.facebookEventUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#1877F2] hover:underline"
            >
              <Facebook className="w-4 h-4" /> Event
            </a>
          )}
          {item.instagramUrl && (
            <a
              href={item.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#d62976] hover:underline"
            >
              <Instagram className="w-4 h-4" /> Watch
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function OfferCard({ item }: { item: WhatsOnItem }) {
  return (
    <div className="relative rounded-2xl border border-[#c9a55c]/30 bg-white/5 backdrop-blur p-7 overflow-hidden">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#c9a55c]/15 blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            {item.subtitle && (
              <span className="text-[#c9a55c] text-xs uppercase tracking-[0.2em] font-semibold">
                {item.subtitle}
              </span>
            )}
            <h3 className="text-2xl mt-1" style={{ fontFamily: "'Cinzel', serif" }}>
              {item.title}
            </h3>
          </div>
          {item.badge && (
            <span className="flex-shrink-0 text-sm font-black bg-[#c9a55c] text-[#1d3a3a] px-3 py-1.5 rounded-lg shadow">
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-white/75 text-sm leading-relaxed">{item.description}</p>
        {item.schedule && (
          <p className="flex items-center gap-1.5 text-sm text-white/60 mt-4">
            <Clock className="w-4 h-4 text-[#c9a55c]" /> {item.schedule}
          </p>
        )}
      </div>
    </div>
  );
}

function DiningCard({ item }: { item: WhatsOnItem }) {
  const Icon = categoryIcons[item.category];
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-[#2d4a4a]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-10 h-10 text-[#c9a55c]" />
          </div>
        )}
        {item.badge && (
          <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wide bg-white/95 text-[#2d4a4a] px-3 py-1 rounded-full shadow">
            {item.badge}
          </span>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col">
        {item.subtitle && (
          <span className="text-[#c9a55c] text-xs uppercase tracking-wider font-semibold">
            {item.subtitle}
          </span>
        )}
        <h3 className="text-xl text-[#2d4a4a] mt-1 mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed flex-1">{item.description}</p>
        {item.schedule && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-4">
            <Clock className="w-4 h-4 text-[#c9a55c]" /> {item.schedule}
          </p>
        )}
        <a
          href={item.ctaUrl || BOOK_URL}
          target={item.ctaUrl?.startsWith('http') || !item.ctaUrl ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#2d4a4a] hover:text-[#c9a55c] transition-colors mt-4"
        >
          {item.ctaLabel || 'Book a table'} <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="teal-gradient text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src="/logo.png" alt="The Merry Fiddlers" className="h-16 w-auto mb-4" />
            <p className="text-white/70 text-sm">Country Pub & Restaurant proudly serving Epping & surrounding areas since the 1600s.</p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
              <Clock className="w-5 h-5 text-[#c9a55c]" />
              Opening Hours
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex justify-between"><span>Monday - Tuesday</span><span className="text-red-400">Closed</span></li>
              <li className="flex justify-between"><span>Wednesday - Saturday</span><span className="text-white">12:00 - 00:00</span></li>
              <li className="flex justify-between"><span>Sunday</span><span className="text-white">12:00 - 20:00</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Contact Us</h3>
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
          <div>
            <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Quick Links</h3>
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
  );
}
