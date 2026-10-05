import type { Metadata } from 'next';

/**
 * This event took place on Wednesday 15 July 2026 and is finished.
 * The page is kept live so old links, emails and tickets still resolve, but it
 * is deliberately removed from search so it cannot outrank current content.
 */
export const metadata: Metadata = {
  title: 'England v Argentina (Past Event) | The Merry Fiddlers',
  description:
    'This event has finished. See what is on now at The Merry Fiddlers in Epping.',
  robots: { index: false, follow: true },
};

export default function EventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
