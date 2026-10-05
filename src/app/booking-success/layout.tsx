import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Confirmed | The Merry Fiddlers',
  description: 'Your booking with The Merry Fiddlers is confirmed.',
  robots: { index: false, follow: false },
};

export default function BookingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
