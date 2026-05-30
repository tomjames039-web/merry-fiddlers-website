'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Percent, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code?: string;
  endDate: Date;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  isActive: boolean;
}

// Configure your current offer - 50% Off Afternoon Tea
const currentOffer: Offer = {
  id: 'afternoon-tea-50',
  title: 'Claim Your 50% Off Afternoon Tea',
  subtitle: 'Limited Time Offer',
  discount: '50% OFF',
  code: 'TEA50',
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  ctaText: 'Claim Now',
  ctaLink: '/afternoon-tea-offer',
  bgGradient: 'from-[#c9a55c] via-[#d4b366] to-[#c9a55c]',
  isActive: true,
};

function calculateTimeLeft(endDate: Date): TimeLeft | null {
  const difference = endDate.getTime() - new Date().getTime();

  if (difference <= 0) {
    return null;
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function SpecialOfferBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [offer] = useState<Offer>(currentOffer);

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem(`offer-dismissed-${offer.id}`);
    if (dismissed) {
      const dismissedTime = new Date(dismissed);
      const hoursSinceDismissed = (new Date().getTime() - dismissedTime.getTime()) / (1000 * 60 * 60);
      // Show again after 24 hours
      if (hoursSinceDismissed < 24) {
        setIsVisible(false);
      }
    }
  }, [offer.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(offer.endDate);
      setTimeLeft(newTimeLeft);
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft(offer.endDate));

    return () => clearInterval(timer);
  }, [offer.endDate]);

  const handleDismiss = () => {
    localStorage.setItem(`offer-dismissed-${offer.id}`, new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible || !offer.isActive || !timeLeft) return null;

  return (
    <div className={`bg-gradient-to-r ${offer.bgGradient} text-white relative overflow-hidden`}>
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />

      <div className="container mx-auto px-4 py-3 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Left - Offer info */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden sm:flex w-10 h-10 bg-white/20 rounded-full items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <span className="text-xs uppercase tracking-wider text-white/90">{offer.subtitle}</span>
                <span className="px-2 py-0.5 bg-white text-[#c9a55c] rounded text-xs font-bold">{offer.discount}</span>
              </div>
              <p className="font-semibold text-lg">{offer.title}</p>
            </div>
          </div>

          {/* Center - Countdown */}
          <div className="flex items-center gap-2 text-sm bg-black/20 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="text-white/80 hidden sm:inline">Offer ends in:</span>
            <div className="flex gap-1 font-mono">
              {timeLeft.days > 0 && (
                <span className="bg-white/20 px-2 py-1 rounded font-bold">
                  {timeLeft.days}d
                </span>
              )}
              <span className="bg-white/20 px-2 py-1 rounded font-bold">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span className="bg-white/20 px-2 py-1 rounded font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span className="bg-white/20 px-2 py-1 rounded font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Right - CTA & Close */}
          <div className="flex items-center gap-3">
            {offer.code && (
              <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded border border-white/30">
                <span className="text-xs text-white/70">Code:</span>
                <span className="font-mono font-bold text-lg">{offer.code}</span>
              </div>
            )}
            <Link
              href={offer.ctaLink}
              className="flex items-center gap-2 px-6 py-2.5 bg-white text-[#2d4a4a] hover:bg-white/90 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-lg"
            >
              {offer.ctaText}
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Dismiss offer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
