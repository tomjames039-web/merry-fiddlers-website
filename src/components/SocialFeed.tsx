'use client';

import { Facebook, Instagram, ExternalLink } from 'lucide-react';

const FACEBOOK_URL = 'https://www.facebook.com/themerryfiddlerspub/';
const INSTAGRAM_URL = 'https://www.instagram.com/themerryfiddlers/';

// Live Facebook feed via the official Page Plugin (no API key / signup needed).
const FB_PLUGIN_SRC =
  'https://www.facebook.com/plugins/page.php?' +
  new URLSearchParams({
    href: FACEBOOK_URL,
    tabs: 'timeline',
    width: '500',
    height: '600',
    small_header: 'false',
    adapt_container_width: 'true',
    hide_cover: 'false',
    show_facepile: 'true',
  }).toString();

interface SocialFeedProps {
  /**
   * Optional: paste a free Instagram widget iframe URL here (e.g. from
   * LightWidget or Behold) to show a live Instagram feed. If omitted, an
   * elegant "Follow us" card is shown instead.
   */
  instagramEmbedUrl?: string;
}

export default function SocialFeed({ instagramEmbedUrl }: SocialFeedProps) {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-[#c9a55c] uppercase tracking-[0.2em] text-sm font-medium">
            Stay Social
          </span>
          <h2
            className="text-3xl md:text-4xl text-[#2d4a4a] mt-3 mb-4"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Follow The Merry Fiddlers
          </h2>
          <div className="w-16 h-1 bg-[#c9a55c] mx-auto" />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Keep up with our latest events, specials and behind-the-scenes moments.
            Tag us in your visit — we love to share your photos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Facebook live feed */}
          <div className="bg-[#f8f6f1] rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#2d4a4a]">Latest on Facebook</p>
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
            <div className="flex-1 rounded-xl overflow-hidden bg-white min-h-[500px] flex justify-center">
              <iframe
                title="The Merry Fiddlers on Facebook"
                src={FB_PLUGIN_SRC}
                className="w-full"
                style={{ border: 'none', minHeight: 500 }}
                scrolling="no"
                frameBorder="0"
                allow="encrypted-media; clipboard-write"
              />
            </div>
          </div>

          {/* Instagram */}
          <div className="rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col bg-gradient-to-br from-[#f9f4ef] to-[#fdf0e9]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#2d4a4a]">On Instagram</p>
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

            {instagramEmbedUrl ? (
              <div className="flex-1 rounded-xl overflow-hidden bg-white min-h-[500px]">
                <iframe
                  title="The Merry Fiddlers on Instagram"
                  src={instagramEmbedUrl}
                  className="w-full h-full"
                  style={{ border: 'none', minHeight: 500 }}
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="grid grid-cols-3 gap-2 mb-6 w-full max-w-xs">
                  {[
                    'pub-flowers.jpeg',
                    'food-1.jpeg',
                    'food-2.jpeg',
                    'food-3.jpeg',
                    'pub-front-1.jpeg',
                    'dome.jpeg',
                  ].map((img) => (
                    <a
                      key={img}
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-lg overflow-hidden group relative"
                    >
                      <img
                        src={`/${img}`}
                        alt="The Merry Fiddlers"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <Instagram className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    </a>
                  ))}
                </div>
                <p className="text-gray-600 mb-5 max-w-xs">
                  See our latest dishes, events and forest views over on Instagram.
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
