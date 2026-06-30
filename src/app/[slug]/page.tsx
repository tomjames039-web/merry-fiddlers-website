import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Clock,
  Calendar,
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  UtensilsCrossed,
  Newspaper,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import { getAllPosts, getPostBySlug, SITE_URL } from '@/lib/blog';
import { BOOK_URL } from '@/lib/whatsOn';

export const revalidate = 600;
// Allow articles published after build (Soro autopilot) to render on demand.
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: 'Article not found | The Merry Fiddlers' };
  }
  const url = `${SITE_URL}/${post.slug}`;
  const image = post.image || `${SITE_URL}/pub-flowers.jpeg`;
  return {
    title: `${post.title} | The Merry Fiddlers, Epping`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: 'The Merry Fiddlers',
      type: 'article',
      publishedTime: post.isoDate,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const url = `${SITE_URL}/${post.slug}`;
  const heroImage = post.image || '/pub-flowers.jpeg';
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        ...(post.image ? { image: [post.image] } : {}),
        datePublished: post.isoDate,
        dateModified: post.isoDate,
        author: {
          '@type': 'Organization',
          name: 'The Merry Fiddlers',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Restaurant',
          name: 'The Merry Fiddlers',
          url: SITE_URL,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
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
        <section className="relative py-20 lg:py-28 overflow-hidden text-white">
          <img
            src={heroImage}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1d3a3a]/92 via-[#2d4a4a]/85 to-[#1d3a3a]/92" />
          <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
            <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/blog" className="hover:text-white">Journal</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c] line-clamp-1">{post.title}</span>
            </nav>
            <span className="text-[#c9a55c] uppercase tracking-[0.25em] text-xs font-semibold">
              The Fiddlers Journal
            </span>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl mt-4 mb-6 leading-tight"
              style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 18px rgba(0,0,0,0.45)' }}
            >
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-5 text-sm text-white/75">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#c9a55c]" /> {post.dateLabel}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c9a55c]" /> {post.readingMinutes} min read
              </span>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="py-14 lg:py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#c9a55c] hover:text-[#2d4a4a] transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" /> Back to the Journal
            </Link>

            {post.description && (
              <p
                className="text-xl md:text-2xl leading-relaxed text-[#2d4a4a] italic mb-8 pb-8 border-b border-[#c9a55c]/25"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {post.description}
              </p>
            )}

            {/* eslint-disable-next-line react/no-danger */}
            <div
              className="article-prose"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </div>
        </article>

        {/* CTA band */}
        <section className="pb-16 lg:pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="rounded-3xl bg-gradient-to-br from-[#2d4a4a] to-[#1d3a3a] text-white p-8 lg:p-12 text-center">
              <span className="text-[#c9a55c] uppercase tracking-[0.25em] text-xs font-semibold">
                A country pub since the 1600s
              </span>
              <h2 className="text-3xl md:text-4xl mt-3 mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                Come and enjoy The Merry Fiddlers
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Date night, a Sunday roast, or a celebration with friends in Fiddlers Hamlet,
                Epping — we&rsquo;d love to welcome you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#c9a55c] hover:bg-[#b8944b] text-[#1d3a3a] rounded-lg font-semibold transition-colors"
                >
                  <UtensilsCrossed className="w-4 h-4" /> Book a Table
                </a>
                <Link
                  href="/upcoming"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  <Calendar className="w-4 h-4" /> What&rsquo;s On
                </Link>
                <Link
                  href="/private-hire"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/30 hover:bg-white/10 rounded-lg font-medium transition-colors"
                >
                  <CalendarHeart className="w-4 h-4" /> Private Events
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
              <h2 className="text-2xl text-[#2d4a4a] mb-8 text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                More from the Journal
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${p.slug}`}
                    className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-44 bg-[#2d4a4a] overflow-hidden">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-9 h-9 text-[#c9a55c]" />
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
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#c9a55c] mt-auto">
                        Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
