import { type NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

const AFTERNOON_TEA_PRICE = 1750; // £17.50 in pence (50% off £35)
const PROSECCO_PRICE = 750; // £7.50 in pence

// Structural type for line items so we don't depend on Stripe's bundled types.
type CheckoutLineItem = {
  price_data: {
    currency: string;
    product_data: { name: string; description?: string };
    unit_amount: number;
  };
  quantity: number;
};

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const {
      type,
      quantity,
      addProsecco,
      customerName,
      customerEmail,
      customerPhone,
      specialRequests,
      voucherAmount,
      recipientName,
      recipientEmail,
      giftMessage,
    } = body;

    let lineItems: CheckoutLineItem[] = [];
    let metadata: Record<string, string> = {};

    if (type === 'afternoon-tea') {
      const qty = Math.max(1, Number(quantity) || 1);
      lineItems = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: '50% Off Afternoon Tea Voucher',
              description: `Afternoon Tea voucher for ${qty} ${qty === 1 ? 'person' : 'people'}`,
            },
            unit_amount: AFTERNOON_TEA_PRICE,
          },
          quantity: qty,
        },
      ];

      if (addProsecco) {
        lineItems.push({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Prosecco Upgrade',
              description: 'Glass of Prosecco per person',
            },
            unit_amount: PROSECCO_PRICE,
          },
          quantity: qty,
        });
      }

      metadata = {
        type: 'afternoon-tea',
        quantity: String(qty),
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        specialRequests: specialRequests || '',
        addProsecco: String(!!addProsecco),
      };
    } else if (type === 'gift-voucher') {
      const amount = Number(voucherAmount);
      if (!amount || amount < 10) {
        return NextResponse.json({ error: 'invalid_amount' }, { status: 400 });
      }
      lineItems = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'The Merry Fiddlers Gift Voucher',
              description: `Gift voucher worth £${amount} for ${recipientName || 'a lucky recipient'}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ];

      metadata = {
        type: 'gift-voucher',
        voucherAmount: String(amount),
        recipientName: recipientName || '',
        recipientEmail: recipientEmail || '',
        giftMessage: giftMessage || '',
        purchaserName: customerName || '',
        purchaserEmail: customerEmail || '',
      };
    } else {
      return NextResponse.json({ error: 'invalid_type' }, { status: 400 });
    }

    // Derive an absolute origin reliably (Stripe requires an absolute
    // return_url). Prefer an explicit site URL, then the forwarded host,
    // then the Origin header, then the request URL's own origin.
    const host = request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (host ? `${proto}://${host}` : '') ||
      request.headers.get('origin') ||
      request.nextUrl.origin;

    // Cast params: this Stripe build's bundled types differ from the live API,
    // which expects `ui_mode: 'embedded'` and returns a `client_secret`.
    type CreateParams = Parameters<typeof stripe.checkout.sessions.create>[0];
    const params = {
      ui_mode: 'embedded',
      mode: 'payment',
      line_items: lineItems,
      metadata,
      customer_email: customerEmail || undefined,
      return_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
    } as unknown as CreateParams;

    const session = await stripe.checkout.sessions.create(params);

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const detail = error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json(
      { error: 'Failed to create checkout session', detail },
      { status: 500 }
    );
  }
}
