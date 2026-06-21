import Stripe from 'stripe';

/**
 * Returns a configured Stripe client, or null if the secret key has not been
 * set up yet (so the rest of the app can degrade gracefully in preview).
 */
let cached: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  const isPlaceholder =
    !key ||
    key === 'sk_test_placeholder' ||
    key.includes('your_secret') ||
    key.includes('your_secret_key');

  cached = isPlaceholder ? null : new Stripe(key as string);
  return cached;
}

export function isStripeConfigured(): boolean {
  return getStripe() !== null;
}
