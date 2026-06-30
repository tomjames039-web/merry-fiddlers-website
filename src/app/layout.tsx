import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://themerryfiddlers.co.uk"),
  title: "The Merry Fiddlers | Country Pub & Restaurant in Epping",
  description: "A charming country pub and restaurant in Fiddlers Hamlet, Epping. Serving excellent food, real ales, and hosting private events since the 1600s.",
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://themerryfiddlers.co.uk/#business",
  name: "The Merry Fiddlers",
  description:
    "Country pub and restaurant in Fiddlers Hamlet, Epping, Essex — food, real ales, private hire and events since the 1600s.",
  url: "https://themerryfiddlers.co.uk",
  telephone: "+44 1992 572142",
  priceRange: "££",
  servesCuisine: "British",
  image: "https://themerryfiddlers.co.uk/big-screen-garden.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4 Fiddlers Hamlet",
    addressLocality: "Epping",
    addressRegion: "Essex",
    postalCode: "CM16 7PY",
    addressCountry: "GB",
  },
  geo: { "@type": "GeoCoordinates", latitude: 51.6905, longitude: 0.1265 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday"], opens: "12:00", closes: "00:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "12:00", closes: "20:00" },
  ],
  sameAs: [
    "https://www.facebook.com/themerryfiddlerspub/",
    "https://www.instagram.com/themerryfiddlers/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics measurementId={gaId} />
        {children}
      </body>
    </html>
  );
}
