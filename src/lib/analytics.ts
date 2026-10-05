'use client';

/**
 * Tiny analytics facade.
 *
 * Fires GA4 events when Google Analytics is installed and Meta Pixel events
 * when the pixel is installed. Both are optional — nothing here ever throws or
 * loads a script by itself, so there is no risk of duplicate tracking.
 */

type Params = Record<string, unknown>;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

function w(): AnalyticsWindow | null {
  return typeof window === 'undefined' ? null : (window as AnalyticsWindow);
}

/** GA4 event. */
export function gaEvent(name: string, params: Params = {}): void {
  try {
    w()?.gtag?.('event', name, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** Meta Pixel standard event (e.g. 'Lead', 'Contact'). */
export function pixelEvent(name: string, params: Params = {}): void {
  try {
    w()?.fbq?.('track', name, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** Meta Pixel custom event. */
export function pixelCustom(name: string, params: Params = {}): void {
  try {
    w()?.fbq?.('trackCustom', name, params);
  } catch {
    /* analytics must never break the page */
  }
}

// ---------------------------------------------------------------------------
// Cross-domain measurement
// ---------------------------------------------------------------------------

/**
 * Domains that share one GA4 session with us.
 *
 * Table bookings hand the guest over to SevenRooms. Listing the domains here
 * makes gtag.js decorate those outbound links with the `_gl` parameter, so the
 * booking journey stays in a single session instead of being logged as
 * "sevenrooms.com / referral".
 */
export const CROSS_DOMAINS = [
  'themerryfiddlers.co.uk',
  'www.themerryfiddlers.co.uk',
  'sevenrooms.com',
  'www.sevenrooms.com',
];

/** The booking system we hand off to. */
export const BOOKING_HOST = 'sevenrooms.com';

/**
 * Tag outbound booking links so the source is visible inside SevenRooms itself,
 * not just in GA4.
 *
 * Set this to FALSE if the GA4 tag is ever deployed on the SevenRooms booking
 * widget — campaign parameters on the landing URL would then override the
 * cross-domain session that `_gl` is preserving.
 */
export const TAG_OUTBOUND_UTMS = true;

/** True for any link that hands the guest over to the booking system. */
export function isBookingUrl(href: string): boolean {
  if (!href) return false;
  try {
    const url = new URL(href, typeof window === 'undefined' ? 'https://themerryfiddlers.co.uk' : window.location.href);
    return url.hostname === BOOKING_HOST || url.hostname.endsWith(`.${BOOKING_HOST}`);
  } catch {
    return false;
  }
}

/**
 * Adds campaign parameters to a booking URL so the reservation record shows
 * where it came from. Existing parameters are never overwritten, and `_gl`
 * (added by gtag's linker) is left completely untouched.
 */
export function tagBookingUrl(href: string, pagePath: string): string {
  if (!TAG_OUTBOUND_UTMS || !isBookingUrl(href)) return href;
  try {
    const url = new URL(href);
    if (url.searchParams.has('utm_source')) return href;
    url.searchParams.set('utm_source', 'themerryfiddlers.co.uk');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'website-book-a-table');
    url.searchParams.set('utm_content', pagePath || '/');
    return url.toString();
  } catch {
    return href;
  }
}

// ---------------------------------------------------------------------------
// Conversions
// ---------------------------------------------------------------------------

/**
 * An enquiry / reservation form was submitted successfully.
 * `form` should be a stable id, e.g. 'christmas-day-reservation'.
 */
export function trackLead(form: string, params: Params = {}): void {
  gaEvent('generate_lead', { form_name: form, ...params });
  pixelEvent('Lead', { content_name: form, ...params });
}

/**
 * Someone clicked through to the SevenRooms booking system.
 *
 * This is the closest thing we have to a booking conversion on our side, so
 * mark `begin_booking` as a Key Event in GA4. Once the GA4 tag is also live on
 * the SevenRooms widget the `_gl` linker joins the two halves together and the
 * completed booking becomes properly attributable.
 */
export function trackBookingClick(location: string, params: Params = {}): void {
  gaEvent('begin_booking', {
    link_location: location,
    link_domain: BOOKING_HOST,
    outbound: true,
    ...params,
  });
  pixelCustom('BookTableClick', { link_location: location, ...params });
}

/** A phone number was tapped. */
export function trackPhoneClick(location: string): void {
  gaEvent('contact_phone', { link_location: location });
  pixelEvent('Contact', { method: 'phone', link_location: location });
}
