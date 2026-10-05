import type { Metadata } from 'next';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title: 'Menus | Restaurant & Sunday Roast in Epping | The Merry Fiddlers',
  description:
    'Our à la carte, Sunday roast, afternoon tea and drinks menus at The Merry Fiddlers, a country pub and restaurant in Epping on the edge of Epping Forest.',
  keywords: [
    'restaurant Epping menu',
    'Sunday roast Epping',
    'gastro pub menu Essex',
    'afternoon tea Epping',
  ],
  alternates: { canonical: `${SITE_URL}/menu` },
  openGraph: {
    title: 'Menus at The Merry Fiddlers, Epping',
    description:
      'À la carte Wednesday to Saturday, Sunday roasts, afternoon tea and a full bar.',
    url: `${SITE_URL}/menu`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
  },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
