'use client';

import Script from 'next/script';

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

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) {
    return null;
  }

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
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

// Event tracking helper functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
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

export const trackBookingClick = () => {
  trackEvent('click', 'booking', 'book_a_table');
};

export const trackPhoneClick = () => {
  trackEvent('click', 'contact', 'phone_number');
};

export const trackEmailClick = () => {
  trackEvent('click', 'contact', 'email_address');
};
