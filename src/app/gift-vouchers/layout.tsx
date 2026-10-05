import type { Metadata } from 'next';

const SITE_URL = 'https://themerryfiddlers.co.uk';

export const metadata: Metadata = {
  title: 'Gift Vouchers | The Merry Fiddlers, Epping',
  description:
    'Gift vouchers for The Merry Fiddlers country pub and restaurant in Epping — Sunday lunch, afternoon tea or dinner in the heated domes. Sent by email straight away.',
  alternates: { canonical: `${SITE_URL}/gift-vouchers` },
  openGraph: {
    title: 'Gift Vouchers | The Merry Fiddlers, Epping',
    description:
      'A gift voucher for a proper country pub — sent by email straight away.',
    url: `${SITE_URL}/gift-vouchers`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
  },
};

export default function GiftVouchersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
