import type { Metadata } from 'next';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title: 'Afternoon Tea in Epping | The Merry Fiddlers',
  description:
    'Afternoon tea at The Merry Fiddlers in Epping — finger sandwiches, warm scones with clotted cream and a tier of cakes, with tea or a glass of fizz. Booking essential.',
  keywords: ['afternoon tea Epping', 'afternoon tea Essex', 'afternoon tea near Epping Forest'],
  alternates: { canonical: `${SITE_URL}/afternoon-tea-offer` },
  openGraph: {
    title: 'Afternoon Tea in Epping | The Merry Fiddlers',
    description:
      'Sandwiches, warm scones and a tier of cakes at a country pub on the edge of Epping Forest.',
    url: `${SITE_URL}/afternoon-tea-offer`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
  },
};

export default function AfternoonTeaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
