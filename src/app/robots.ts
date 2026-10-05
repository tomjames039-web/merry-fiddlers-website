import type { MetadataRoute } from 'next';

const SITE = 'https://themerryfiddlers.co.uk';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
        '/booking-success',
        // finished event — kept live for old links, kept out of search
        '/events/england-v-argentina',
      ],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
