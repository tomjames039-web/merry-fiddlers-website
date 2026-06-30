import type { MetadataRoute } from 'next';
import { allEventSlugs } from '@/lib/events';
import { getAllPosts } from '@/lib/blog';

const SITE = 'https://themerryfiddlers.co.uk';

export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    '',
    '/menu',
    '/upcoming',
    '/blog',
    '/private-hire',
    '/gift-vouchers',
    '/contact',
    '/getting-here',
    '/afternoon-tea-offer',
  ];

  const eventRoutes = allEventSlugs().map((s) => `/private-hire/${s}`);

  const base: MetadataRoute.Sitemap = [...staticRoutes, ...eventRoutes].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : path.startsWith('/private-hire') ? 0.8 : 0.6,
  }));

  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch {
    posts = [];
  }

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/${p.slug}`,
    lastModified: new Date(p.isoDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...base, ...postRoutes];
}
