import type { Metadata } from 'next';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title: 'Download Our Event Brochure | The Merry Fiddlers, Epping',
  description:
    'Download the events and private hire brochure for The Merry Fiddlers in Epping — weddings, wakes, corporate events, Christmas parties and private dining.',
  alternates: { canonical: `${SITE_URL}/download-brochure` },
  openGraph: {
    title: 'Download Our Event Brochure | The Merry Fiddlers, Epping',
    description:
      'Everything about private hire, celebrations and corporate events at The Merry Fiddlers.',
    url: `${SITE_URL}/download-brochure`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
  },
};

export default function DownloadBrochureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
