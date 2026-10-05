'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Sparkles, Coffee } from 'lucide-react';
import Link from 'next/link';

/**
 * Seasonal announcement bar.
 *
 * Each campaign has a real start and end date and retires itself — no rolling
 * "offer ends in 6 days" countdown that resets on every page load. The first
 * campaign whose window contains today is the one that shows.
 *
 * To add or remove a campaign, edit CAMPAIGNS below. To turn the bar off
 * entirely, set every campaign's `live` to false.
 */
interface Campaign {
  id: string;
  live: boolean;
  /** inclusive — YYYY-MM-DD; omit for an evergreen message */
  from?: string;
  /** inclusive, hides at the end of this day — YYYY-MM-DD */
  to?: string;
  eyebrow: string;
  headline: string;
  detail?: string;
  ctaText: string;
  ctaLink: string;
  /** tailwind gradient stops */
  gradient: string;
  /** text colour class for the CTA pill */
  pill: string;
  icon?: 'sparkles' | 'coffee';
  /** Lower numbers are shown first when several campaigns are active. */
  priority: number;
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 'bank-holiday-2026-08-31',
    live: true,
    from: '2026-08-01',
    to: '2026-08-31',
    eyebrow: 'Open specially · Monday 31 August',
    headline: 'Summer Bank Holiday Monday',
    detail: 'Food served 12:00pm–7:30pm',
    ctaText: 'Book a table',
    ctaLink: 'https://www.sevenrooms.com/reservations/themerryfiddlers',
    gradient: 'from-[#b68b3d] via-[#c9a55c] to-[#b68b3d]',
    pill: 'text-[#2d4a4a]',
    icon: 'sparkles',
    priority: 1,
  },
  {
    id: 'christmas-day-2026',
    live: true,
    from: '2026-09-01',
    to: '2026-12-25',
    eyebrow: 'Christmas Day · Friday 25 December',
    headline: 'Christmas Day reservations are open',
    detail: 'No deposit required at this stage',
    ctaText: 'Reserve your place',
    ctaLink: '/christmas/christmas-day',
    gradient: 'from-[#6f202a] via-[#8c2f39] to-[#6f202a]',
    pill: 'text-[#8c2f39]',
    icon: 'sparkles',
    priority: 1,
  },
  {
    id: 'afternoon-tea-evergreen',
    live: true,
    eyebrow: 'Wednesday to Saturday · 12–4pm',
    headline: 'Afternoon Tea at The Fiddlers',
    detail: 'Fresh scones, finger sandwiches & delicate cakes',
    ctaText: 'See afternoon tea',
    ctaLink: '/afternoon-tea-offer',
    gradient: 'from-[#8f7138] via-[#b8944b] to-[#8f7138]',
    pill: 'text-[#2d4a4a]',
    icon: 'coffee',
    priority: 2,
  },
];

const ROTATION_MS = 7000;

function activeCampaigns(now: Date): Campaign[] {
  const today = now.toISOString().slice(0, 10);
  return CAMPAIGNS.filter(
    (campaign) =>
      campaign.live &&
      (!campaign.from || today >= campaign.from) &&
      (!campaign.to || today <= campaign.to)
  ).sort((a, b) => a.priority - b.priority);
}

export default function SpecialOfferBanner() {
  // Rendered only after mount so the server and client markup always agree.
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    const available = activeCampaigns(new Date());
    const hidden: string[] = [];

    try {
      for (const campaign of available) {
        const stored = localStorage.getItem(`mf-banner-${campaign.id}`);
        if (!stored) continue;
        const hours =
          (Date.now() - new Date(stored).getTime()) / (1000 * 60 * 60);
        if (hours < 24) hidden.push(campaign.id);
      }
    } catch {
      /* private browsing — just show it */
    }

    setDismissedIds(hidden);
    setCampaigns(available);
  }, []);

  const visibleCampaigns = campaigns.filter(
    (campaign) => !dismissedIds.includes(campaign.id)
  );

  useEffect(() => {
    if (visibleCampaigns.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleCampaigns.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, [visibleCampaigns.length]);

  useEffect(() => {
    if (activeIndex >= visibleCampaigns.length) setActiveIndex(0);
  }, [activeIndex, visibleCampaigns.length]);

  const campaign = visibleCampaigns[activeIndex];
  if (!campaign) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem(`mf-banner-${campaign.id}`, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setDismissedIds((current) => [...current, campaign.id]);
    setActiveIndex(0);
  };

  const isExternal = campaign.ctaLink.startsWith('http');
  const CampaignIcon = campaign.icon === 'coffee' ? Coffee : Sparkles;

  const cta = isExternal ? (
    <a
      href={campaign.ctaLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-5 py-2 bg-white ${campaign.pill} hover:bg-white/90 rounded-full text-[13px] font-bold transition-all whitespace-nowrap`}
    >
      {campaign.ctaText}
      <ChevronRight className="w-4 h-4" />
    </a>
  ) : (
    <Link
      href={campaign.ctaLink}
      className={`inline-flex items-center gap-1.5 px-5 py-2 bg-white ${campaign.pill} hover:bg-white/90 rounded-full text-[13px] font-bold transition-all whitespace-nowrap`}
    >
      {campaign.ctaText}
      <ChevronRight className="w-4 h-4" />
    </Link>
  );

  return (
    <div
      className={`bg-gradient-to-r ${campaign.gradient} text-white relative overflow-hidden`}
      role="region"
      aria-label="Current offers and announcements"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"
      />
      <div className="container mx-auto px-4 py-2.5 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <CampaignIcon className="hidden sm:block w-4 h-4 flex-shrink-0 text-white/80" />
            <div className="leading-tight">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/80">
                {campaign.eyebrow}
              </p>
              <p
                className="text-base sm:text-lg"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {campaign.headline}
                {campaign.detail && (
                  <span className="hidden md:inline text-white/85 text-sm font-normal">
                    {' '}
                    · {campaign.detail}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {visibleCampaigns.length > 1 && (
              <span className="hidden sm:inline text-[10px] tabular-nums text-white/65" aria-hidden>
                {activeIndex + 1}/{visibleCampaigns.length}
              </span>
            )}
            {cta}
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label={`Dismiss ${campaign.headline}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
