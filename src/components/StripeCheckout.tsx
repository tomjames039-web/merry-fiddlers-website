'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';
import { X, Lock, Phone, Loader2 } from 'lucide-react';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise =
  publishableKey && !publishableKey.includes('your_publishable')
    ? loadStripe(publishableKey)
    : null;

interface StripeCheckoutProps {
  payload: Record<string, unknown>;
  title: string;
  onClose: () => void;
}

export default function StripeCheckout({
  payload,
  title,
  onClose,
}: StripeCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    (async () => {
      if (!stripePromise) {
        if (active) setState('error');
        return;
      }
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!active) return;
        if (res.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
          setState('ready');
        } else {
          setState('error');
        }
      } catch {
        if (active) setState('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [payload]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2d4a4a] text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#c9a55c]" />
            <h3 className="font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-2 sm:p-4">
          {state === 'loading' && (
            <div className="flex flex-col items-center justify-center py-20 text-[#2d4a4a]">
              <Loader2 className="w-8 h-8 animate-spin text-[#c9a55c]" />
              <p className="mt-3 text-sm text-gray-500">Loading secure payment…</p>
            </div>
          )}

          {state === 'error' && (
            <div className="text-center py-12 px-6">
              <div className="w-14 h-14 bg-[#c9a55c]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-[#c9a55c]" />
              </div>
              <h4 className="text-lg font-semibold text-[#2d4a4a] mb-2">
                Card payments are being set up
              </h4>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Online card payment isn't available just yet. To purchase right
                now, please give us a quick call and we'll sort it for you.
              </p>
              <a
                href="tel:+441992572142"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg transition-colors font-medium"
              >
                <Phone className="w-4 h-4" />
                +44 1992 572142
              </a>
            </div>
          )}

          {state === 'ready' && clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Lock className="w-3.5 h-3.5" />
          Payments are secure and encrypted, powered by Stripe
        </div>
      </div>
    </div>
  );
}
