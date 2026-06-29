'use client';

import { useEffect, useRef, useState } from 'react';
import { Instagram, Play, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_SRC = 'https://www.instagram.com/embed.js';

/**
 * Normalises an Instagram permalink to its canonical embeddable form.
 * Accepts post (/p/), reel (/reel/ or /reels/) and tv (/tv/) links.
 */
function normalise(url: string): string {
  try {
    const u = new URL(url.trim());
    // strip query/hash, ensure trailing slash
    let path = u.pathname.replace(/\/+$/, '');
    path = path.replace('/reels/', '/reel/');
    return `https://www.instagram.com${path}/`;
  } catch {
    return url.trim();
  }
}

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.instgrm) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      // It may already be loaded
      if (window.instgrm) resolve(true);
      return;
    }
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

interface InstagramEmbedProps {
  url: string;
  title?: string;
  caption?: string;
}

export default function InstagramEmbed({
  url,
  title,
  caption,
}: InstagramEmbedProps) {
  const permalink = normalise(url);
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'fallback'>(
    'loading'
  );

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setState((s) => (s === 'loading' ? 'fallback' : s));
    }, 6000);

    loadScript().then((ok) => {
      if (cancelled) return;
      if (!ok) {
        setState('fallback');
        return;
      }
      try {
        window.instgrm?.Embeds.process();
        setState('ready');
      } catch {
        setState('fallback');
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  if (state === 'fallback') {
    return (
      <a
        href={permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-[#f9f4ef] to-[#fdf0e9]"
      >
        <span className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <span className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
            <Play className="w-7 h-7 text-white fill-white" />
          </span>
          <span className="font-semibold text-[#2d4a4a]">
            {title || 'Watch on Instagram'}
          </span>
          {caption && (
            <span className="text-sm text-gray-500 mt-1 max-w-xs">{caption}</span>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#c9a55c]">
            Open reel <ExternalLink className="w-4 h-4" />
          </span>
        </span>
      </a>
    );
  }

  return (
    <div ref={ref} className="instagram-embed-wrap w-full">
      {state === 'loading' && (
        <div className="flex items-center justify-center min-h-[420px] rounded-2xl border border-gray-100 bg-[#f8f6f1]">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Instagram className="w-8 h-8 animate-pulse" />
            <span className="text-sm">Loading Instagram…</span>
          </div>
        </div>
      )}
      {/* Official Instagram blockquote — processed into an iframe by embed.js */}
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
        style={{
          background: '#fff',
          border: 0,
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          margin: 0,
          maxWidth: '100%',
          minWidth: 'unset',
          width: '100%',
          display: state === 'loading' ? 'none' : 'block',
        }}
      >
        <a href={permalink} target="_blank" rel="noopener noreferrer">
          {title || 'View this post on Instagram'}
        </a>
      </blockquote>
    </div>
  );
}
