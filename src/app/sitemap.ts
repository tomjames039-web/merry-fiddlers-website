import type { MetadataRoute } from 'next';
import { allEventSlugs } from '@/lib/events';
import { getAllPosts } from '@/lib/blog';
import { festiveSlugs } from '@/lib/christmas';

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
    '/download-brochure',
  ];

  // Christmas is the seasonal commercial priority — crawl it often and rank it high.
  const christmasRoutes = [
    '/christmas',
    '/christmas/christmas-day',
    '/christmas/christmas-parties',
    ...festiveSlugs().map((s) => `/christmas/${s}`),
  ];

  const eventRoutes = allEventSlugs().map((s) => `/private-hire/${s}`);

  function priorityFor(path: string): number {
    if (path === '') return 1;
    if (path === '/christmas/christmas-day' || path === '/christmas/christmas-parties') return 0.95;
    if (path.startsWith('/christmas')) return 0.9;
    if (path.startsWith('/private-hire')) return 0.8;
    return 0.6;
  }

  const base: MetadataRoute.Sitemap = [
    ...staticRoutes,
    ...christmasRoutes,
    ...eventRoutes,
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: (path.startsWith('/christmas') ? 'daily' : 'weekly') as
      | 'daily'
      | 'weekly',
    priority: priorityFor(path),
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
