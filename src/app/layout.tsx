import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import BookingLinkTracker from "@/components/BookingLinkTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://themerryfiddlers.co.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Merry Fiddlers | Country Pub & Restaurant in Epping",
    template: "%s",
  },
  description:
    "A country pub and restaurant in Fiddlers Hamlet, Epping — open fires, premium gastro dining, famous Sunday roasts, heated private dining domes and a huge garden, on the edge of Epping Forest since the 1600s.",
  applicationName: "The Merry Fiddlers",
  authors: [{ name: "The Merry Fiddlers" }],
  creator: "The Merry Fiddlers",
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "The Merry Fiddlers",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": `${SITE_URL}/#business`,
  name: "The Merry Fiddlers",
  alternateName: "The Merry Fiddlers Country Pub & Restaurant",
  description:
    "Country pub and restaurant in Fiddlers Hamlet, Epping, Essex — open fires and log burners, premium gastro-style dining, Sunday roasts, heated private dining domes, a large garden with a children's play area, private hire and events. On the edge of Epping Forest since the 1600s.",
  slogan: "Proudly serving Epping since the 1600s",
  url: SITE_URL,
  telephone: "+44 1992 572142",
  email: "info@themerryfiddlers.co.uk",
  priceRange: "££",
  currenciesAccepted: "GBP",
  paymentAccepted: "Cash, Credit Card, Debit Card, Apple Pay",
  servesCuisine: ["British", "Modern British", "Gastropub"],
  acceptsReservations: "https://www.sevenrooms.com/reservations/themerryfiddlers",
  hasMenu: `${SITE_URL}/menu`,
  image: [
    `${SITE_URL}/pub-front-1.jpeg`,
    `${SITE_URL}/food-3.jpeg`,
    `${SITE_URL}/dome.jpeg`,
  ],
  logo: `${SITE_URL}/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "4 Fiddlers Hamlet",
    addressLocality: "Epping",
    addressRegion: "Essex",
    postalCode: "CM16 7PY",
    addressCountry: "GB",
  },
  geo: { "@type": "GeoCoordinates", latitude: 51.6905, longitude: 0.1265 },
  areaServed: [
    { "@type": "City", name: "Epping" },
    { "@type": "Place", name: "Epping Forest" },
    { "@type": "City", name: "Theydon Bois" },
    { "@type": "City", name: "North Weald" },
    { "@type": "City", name: "Loughton" },
    { "@type": "AdministrativeArea", name: "Essex" },
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday"], opens: "12:00", closes: "00:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "20:00" },
  ],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Open fires & log burners", value: true },
    { "@type": "LocationFeatureSpecification", name: "Private dining rooms", value: true },
    { "@type": "LocationFeatureSpecification", name: "Heated dining domes", value: true },
    { "@type": "LocationFeatureSpecification", name: "Beer garden", value: true },
    { "@type": "LocationFeatureSpecification", name: "Children's play area", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dog friendly (bar area)", value: true },
    { "@type": "LocationFeatureSpecification", name: "On-site parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Full bar & cocktails", value: true },
  ],
  publicAccess: true,
  smokingAllowed: false,
  sameAs: [
    "https://www.facebook.com/themerryfiddlerspub/",
    "https://www.instagram.com/themerryfiddlers/",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "The Merry Fiddlers",
  publisher: { "@id": `${SITE_URL}/#business` },
  inLanguage: "en-GB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify([businessJsonLd, websiteJsonLd]) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics measurementId={gaId} />
        <MetaPixel pixelId={pixelId} />
        <BookingLinkTracker />
        {children}
      </body>
    </html>
  );
}
