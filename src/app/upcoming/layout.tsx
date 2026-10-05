import type { Metadata } from 'next';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title: "What's On in Epping | Events, Offers & Sunday Roast | The Merry Fiddlers",
  description:
    "What's on at The Merry Fiddlers in Epping — Sunday roasts, 2-for-1 cocktails, afternoon tea, heated dining domes, Christmas 2026 and the big screen in the garden.",
  keywords: [
    "what's on Epping",
    'events Epping pub',
    'Sunday roast Epping',
    'pub offers Epping',
  ],
  alternates: { canonical: `${SITE_URL}/upcoming` },
  openGraph: {
    title: "What's On at The Merry Fiddlers, Epping",
    description:
      'Sunday roasts, cocktails, afternoon tea, private dining domes and the Christmas 2026 diary.',
    url: `${SITE_URL}/upcoming`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
  },
};

export default function UpcomingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
