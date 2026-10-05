'use client';

import { useEffect } from 'react';
import { isBookingUrl, tagBookingUrl, trackBookingClick } from '@/lib/analytics';

/**
 * Booking hand-off tracker.
 *
 * There are a dozen "Book A Table" links spread across the site — in the
 * header, the footer, the announcement bar, the sticky button, and inside
 * What's On items that staff create in the back office. Wiring an onClick to
 * each one would guarantee that a future link gets missed.
 *
 * Instead this mounts ONE delegated listener on the document. Every click that
 * ends up on a sevenrooms.com link, however it got onto the page:
 *
 *   1. is tagged with campaign parameters so the source is visible inside
 *      SevenRooms' own reservation records, and
 *   2. fires a GA4 `begin_booking` event with the page and link context.
 *
 * The gtag linker adds `_gl` to the same URL independently, which is what
 * actually carries the GA4 session across to sevenrooms.com. The two work
 * together — this component never touches `_gl`.
 *
 * It runs in the capture phase so the href is rewritten before any other
 * handler (including gtag's own) reads it.
 */
export default function BookingLinkTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Ignore modified clicks that the browser handles itself.
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      if (!isBookingUrl(href)) return;

      const pagePath = window.location.pathname;

      // 1. Tag the destination (idempotent — safe on repeat clicks).
      try {
        const tagged = tagBookingUrl(anchor.href, pagePath);
        if (tagged !== anchor.href) anchor.href = tagged;
      } catch {
        /* never block the click */
      }

      // 2. Record the hand-off.
      const location =
        anchor.dataset.bookLocation ||
        (anchor.textContent || '').trim().slice(0, 60) ||
        'book_a_table';

      trackBookingClick(location, {
        page_path: pagePath,
        page_title: document.title,
        link_url: anchor.href,
      });
    }

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
