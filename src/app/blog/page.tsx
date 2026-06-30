import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Clock, ArrowRight, Newspaper } from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import { getAllPosts, SITE_URL } from '@/lib/blog';

export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Journal | News, Events & Stories | The Merry Fiddlers, Epping',
  description:
    'News, events, food and stories from The Merry Fiddlers — a country pub and restaurant in Fiddlers Hamlet, Epping, Essex since the 1600s.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'The Fiddlers Journal | The Merry Fiddlers, Epping',
    description: 'News, events and stories from The Merry Fiddlers in Epping, Essex.',
    url: `${SITE_URL}/blog`,
    siteName: 'The Merry Fiddlers',
    type: 'website',
    images: [{ url: `${SITE_URL}/pub-flowers.jpeg` }],
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Fiddlers Journal',
    url: `${SITE_URL}/blog`,
    publisher: { '@type': 'Restaurant', name: 'The Merry Fiddlers', url: SITE_URL },
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.isoDate,
      url: `${SITE_URL}/${p.slug}`,
      image: p.image,
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-24 overflow-hidden text-white">
          <img src="/pub-flowers.jpeg" alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d3a3a]/92 via-[#2d4a4a]/82 to-[#1d3a3a]/92" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">Journal</span>
            </nav>
            <span className="text-[#c9a55c] uppercase tracking-[0.25em] text-xs font-semibold">
              News, Events &amp; Stories
            </span>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl mt-3 mb-4"
              style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}
            >
              The Fiddlers Journal
            </h1>
            <p className="text-lg text-white/85 max-w-2xl mx-auto">
              Stories from our kitchen and garden, what&rsquo;s on at the pub, and the best
              of life in Epping &amp; Epping Forest.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-[#2d4a4a] flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="w-7 h-7 text-[#c9a55c]" />
                </div>
                <h2 className="text-2xl text-[#2d4a4a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                  New articles coming soon
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  We&rsquo;re working on fresh stories and guides. Check back shortly.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48 bg-[#2d4a4a] overflow-hidden">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-10 h-10 text-[#c9a55c]" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                        <Clock className="w-3.5 h-3.5" /> {p.dateLabel} · {p.readingMinutes} min read
                      </p>
                      <h3 className="text-lg text-[#2d4a4a] mb-2 leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>
                        {p.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1">
                        {p.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#c9a55c] mt-4">
                        Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
