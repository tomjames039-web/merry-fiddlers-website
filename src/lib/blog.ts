import { XMLParser } from 'fast-xml-parser';

const FEED_URL =
  process.env.NEXT_PUBLIC_BLOG_RSS_URL ||
  'https://app.trysoro.com/api/rss/c851530c-04e9-4d2a-a540-08c48e343faf';

export const SITE_URL = 'https://themerryfiddlers.co.uk';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  contentHtml: string;
  image?: string;
  isoDate: string;
  dateLabel: string;
  readingMinutes: number;
}

function textOf(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if ('__cdata' in o) return String(o.__cdata ?? '');
    if ('#text' in o) return String(o['#text'] ?? '');
  }
  return '';
}

function toSlug(link: string, title: string): string {
  try {
    const u = new URL(link);
    const seg = u.pathname.replace(/\/+$/, '').split('/').filter(Boolean).pop();
    if (seg) return seg;
  } catch {
    /* fall through */
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

interface RawItem {
  title?: unknown;
  link?: unknown;
  description?: unknown;
  pubDate?: unknown;
  'content:encoded'?: unknown;
  'media:content'?: { '@_url'?: string };
  enclosure?: { '@_url'?: string };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      cdataPropName: '__cdata',
      processEntities: true,
    });
    const data = parser.parse(xml);
    const channel = data?.rss?.channel;
    if (!channel) return [];

    const rawItems: RawItem[] = Array.isArray(channel.item)
      ? channel.item
      : channel.item
        ? [channel.item]
        : [];

    return rawItems
      .map((it): BlogPost => {
        const title = textOf(it.title);
        const link = textOf(it.link);
        const contentHtml = textOf(it['content:encoded']);
        const description = textOf(it.description);
        const image =
          it['media:content']?.['@_url'] || it.enclosure?.['@_url'] || undefined;
        const pub = textOf(it.pubDate);
        const d = pub ? new Date(pub) : new Date();
        return {
          slug: toSlug(link, title),
          title,
          description,
          contentHtml,
          image,
          isoDate: Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString(),
          dateLabel: (Number.isNaN(d.getTime()) ? new Date() : d).toLocaleDateString(
            'en-GB',
            { day: 'numeric', month: 'long', year: 'numeric' }
          ),
          readingMinutes: readingMinutes(contentHtml || description),
        };
      })
      .filter((p) => p.slug && p.title);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
