'use client';

import { useEffect, useRef, useState } from 'react';
import { Facebook, Instagram, ExternalLink, Heart, ArrowUpRight } from 'lucide-react';

const FACEBOOK_URL =
  process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL ||
  'https://www.facebook.com/themerryfiddlerspub/';
const INSTAGRAM_URL = 'https://www.instagram.com/themerryfiddlers/';

// Live Instagram feed via LightWidget (@themerryfiddlers). This is the built-in
// default so the live feed works on production with no extra config. To change
// the feed later, regenerate the widget and update this URL, or override it with
// the NEXT_PUBLIC_INSTAGRAM_EMBED_URL env var. See .same/SOCIAL-FEED-SETUP.md
const DEFAULT_INSTAGRAM_EMBED =
  'https://lightwidget.com/widgets/f16a9764a50f50719f77383080088076.html';
const ENV_INSTAGRAM_EMBED =
  process.env.NEXT_PUBLIC_INSTAGRAM_EMBED_URL || DEFAULT_INSTAGRAM_EMBED;

// Live Facebook feed via the official Page Plugin (no API key / signup needed).
const FB_PLUGIN_SRC =
  'https://www.facebook.com/plugins/page.php?' +
  new URLSearchParams({
    href: FACEBOOK_URL,
    tabs: 'timeline',
    width: '500',
    height: '640',
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'true',
  }).toString();

// Curated wall — real pub photos that always render, styled like a live feed.
// Interleaved for variety (food / scene / food / scene ...).
const GALLERY: { img: string; caption: string }[] = [
  { img: 'food-1.jpeg', caption: 'Fresh from our kitchen' },
  { img: 'pub-flowers.jpeg', caption: 'Blooming lovely out front' },
  { img: 'afternoon-tea.jpg', caption: "Afternoon tea o'clock" },
  { img: 'food-2.jpeg', caption: 'Catch of the day' },
  { img: 'dome.jpeg', caption: 'Dine under the Dome' },
  { img: 'pub-front-4.jpeg', caption: 'Sunny days in the garden' },
  { img: 'food-3.jpeg', caption: 'Sunday roasts done properly' },
  { img: 'hero.webp', caption: 'Magical evenings at the Fiddlers' },
  { img: 'pub-front-1.jpeg', caption: 'Your local since the 1600s' },
];

interface SocialFeedProps {
  /**
   * Optional: paste a free Instagram widget iframe URL here (e.g. from
   * LightWidget, SnapWidget or Behold) to show a live Instagram feed. If
   * omitted, the curated photo wall is shown instead. Falls back to the
   * NEXT_PUBLIC_INSTAGRAM_EMBED_URL environment variable.
   */
  instagramEmbedUrl?: string;
}

export default function SocialFeed({ instagramEmbedUrl }: SocialFeedProps) {
  // LightWidget/SnapWidget often hand back a protocol-relative URL
  // (//lightwidget.com/widgets/xxxx.html). Normalise it to https so the
  // iframe loads correctly, and trim any stray whitespace.
  const rawEmbed = (instagramEmbedUrl || ENV_INSTAGRAM_EMBED).trim();
  const igEmbed = rawEmbed.startsWith('//') ? `https:${rawEmbed}` : rawEmbed;

  // Facebook iframe state: skeleton until it loads, fallback card if blocked.
  const [fbState, setFbState] = useState<'loading' | 'loaded' | 'fallback'>(
    'loading'
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If the plugin is blocked (ad-blocker / sandbox) onLoad never fires.
    // After 7s, gracefully swap to a branded fallback so it never looks broken.
    timeoutRef.current = setTimeout(() => {
      setFbState((s) => (s === 'loading' ? 'fallback' : s));
    }, 7000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
      {/* Soft decorative backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(60rem 30rem at 100% 0%, rgba(201,165,92,0.10), transparent 60%), radial-gradient(50rem 28rem at 0% 100%, rgba(45,74,74,0.07), transparent 60%)',
        }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#c9a55c] uppercase tracking-[0.25em] text-xs sm:text-sm font-medium">
            <span className="h-px w-8 bg-[#c9a55c]/60" /> Stay Social
            <span className="h-px w-8 bg-[#c9a55c]/60" />
          </span>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-[#2d4a4a] mt-4 mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Follow The Merry Fiddlers
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Keep up with our latest events, specials and behind-the-scenes
            moments. Tag us in your visit — we love to share your photos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
          {/* ---------------- Facebook ---------------- */}
          <div className="bg-[#f8f6f1] rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center shadow-sm">
                  <Facebook className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#2d4a4a] leading-tight">
                    Latest on Facebook
                  </p>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-[#c9a55c] inline-flex items-center gap-1"
                  >
                    @themerryfiddlerspub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1877F2] hover:bg-[#1465d8] text-white text-sm font-medium transition-colors"
              >
                Follow <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="relative flex-1 rounded-xl overflow-hidden bg-white min-h-[560px] flex justify-center">
              {/* Skeleton while loading */}
              {fbState === 'loading' && (
                <div className="absolute inset-0 p-4 space-y-4">
                  <div className="h-28 rounded-lg bg-gray-200/70 animate-pulse" />
                  {[0, 1].map((i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-100 p-4 space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200/80 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-1/3 bg-gray-200/80 rounded animate-pulse" />
                          <div className="h-2.5 w-1/4 bg-gray-200/70 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-gray-200/70 rounded animate-pulse" />
                      <div className="h-2.5 w-4/5 bg-gray-200/70 rounded animate-pulse" />
                      <div className="h-36 bg-gray-200/70 rounded-lg animate-pulse" />
                    </div>
                  ))}
                </div>
              )}

              {/* Friendly fallback if the plugin is blocked */}
              {fbState === 'fallback' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center mb-4">
                    <Facebook className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-[#2d4a4a] font-semibold mb-1">
                    See our latest posts on Facebook
                  </p>
                  <p className="text-gray-500 text-sm mb-5 max-w-xs">
                    Event nights, specials and what&rsquo;s on this week — all on
                    our page.
                  </p>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1877F2] hover:bg-[#1465d8] text-white font-medium transition-colors"
                  >
                    <Facebook className="w-4 h-4" /> Open Facebook Page
                  </a>
                </div>
              )}

              {/* The live plugin (revealed once loaded) */}
              <iframe
                title="The Merry Fiddlers on Facebook"
                src={FB_PLUGIN_SRC}
                className="w-full transition-opacity duration-500"
                style={{
                  border: 'none',
                  minHeight: 560,
                  opacity: fbState === 'loaded' ? 1 : 0,
                }}
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media; clipboard-write"
                onLoad={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                  setFbState('loaded');
                }}
              />
            </div>

            {fbState === 'loaded' && (
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 sm:hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#1877F2] text-white font-medium"
              >
                <Facebook className="w-4 h-4" /> Visit our Facebook
              </a>
            )}
          </div>

          {/* ---------------- Instagram ---------------- */}
          <div className="rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col bg-gradient-to-br from-[#f9f4ef] to-[#fdf0e9]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] flex items-center justify-center shadow-sm">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#2d4a4a] leading-tight">
                    On Instagram
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-[#c9a55c] inline-flex items-center gap-1"
                  >
                    @themerryfiddlers <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] hover:opacity-90 transition-opacity"
              >
                Follow <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            {igEmbed ? (
              /* Live Instagram feed (LightWidget / SnapWidget / Behold) */
              <div className="flex-1 rounded-xl overflow-hidden bg-white min-h-[560px]">
                <iframe
                  title="The Merry Fiddlers on Instagram"
                  src={igEmbed}
                  className="lightwidget-widget w-full h-full"
                  style={{ border: 'none', minHeight: 560 }}
                  frameBorder="0"
                  scrolling="auto"
                  loading="lazy"
                />
              </div>
            ) : (
              /* Curated photo wall — always renders */
              <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 rounded-xl overflow-hidden">
                  {GALLERY.map(({ img, caption }) => (
                    <a
                      key={img}
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square overflow-hidden group relative"
                    >
                      <img
                        src={`/${img}`}
                        alt={caption}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Instagram className="w-4 h-4 text-white drop-shadow" />
                      </span>
                      <span className="absolute bottom-0 left-0 right-0 p-2 flex items-end justify-between gap-1 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-[10px] leading-tight text-white font-medium line-clamp-2">
                          {caption}
                        </span>
                        <Heart className="w-3.5 h-3.5 text-white flex-shrink-0 fill-white/90" />
                      </span>
                    </a>
                  ))}
                </div>

                <div className="mt-auto pt-6 text-center">
                  <p className="text-gray-600 mb-4 text-sm max-w-xs mx-auto">
                    See our latest dishes, events and forest views over on
                    Instagram.
                  </p>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-5 h-5" /> Follow Us
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
