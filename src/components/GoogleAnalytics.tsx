'use client';

import Script from 'next/script';
import { CROSS_DOMAINS } from '@/lib/analytics';

interface GoogleAnalyticsProps {
  measurementId: string;
}

// Extend window type for gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4.
 *
 * Renders nothing at all when NEXT_PUBLIC_GA_MEASUREMENT_ID is empty, so there
 * is never a duplicate or half-configured tag.
 *
 * CROSS-DOMAIN MEASUREMENT
 * ------------------------
 * Table bookings leave the site for sevenrooms.com. Without cross-domain
 * measurement GA4 treats that as the end of the session and the booking gets
 * attributed to "sevenrooms.com / referral" instead of the campaign, search or
 * page that actually earned it.
 *
 * `linker.domains` tells gtag.js to decorate every outbound link to those
 * domains with the `_gl` parameter, which carries the client id and session
 * across. `accept_incoming` accepts the same parameter coming back the other
 * way, so a guest who returns from SevenRooms stays in one session.
 *
 * NOTE: this only completes the loop once the same GA4 measurement ID is also
 * firing on the SevenRooms booking widget, and once both domains are listed
 * under Admin > Data Streams > Configure tag settings > Configure your domains.
 * See `.same/GA4-SEVENROOMS.md`.
 */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) {
    return null;
  }

  const domains = JSON.stringify(CROSS_DOMAINS);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
            allow_linker: true,
            linker: {
              domains: ${domains},
              accept_incoming: true,
              decorate_forms: true
            }
          });
        `}
      </Script>
    </>
  );
}

// ---------------------------------------------------------------------------
// Legacy helpers — kept so older imports keep working.
// New code should use the facade in `src/lib/analytics.ts`.
// ---------------------------------------------------------------------------

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Pre-defined event trackers for common actions
export const trackBrochureDownload = () => {
  trackEvent('download', 'brochure', 'event_brochure');
};

export const trackFormSubmission = (formName: string) => {
  trackEvent('submit', 'form', formName);
};

export const trackPhoneClick = () => {
  trackEvent('click', 'contact', 'phone_number');
};

export const trackEmailClick = () => {
  trackEvent('click', 'contact', 'email_address');
};
