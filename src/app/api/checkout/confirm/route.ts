import { type NextRequest, NextResponse } from 'next/server';
import { fulfillCheckout } from '@/lib/fulfillment';

/**
 * Called by the booking-success page after Stripe redirects back.
 * Verifies the payment and records/sends the voucher (idempotent).
 */
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'missing_session_id' }, { status: 400 });
  }

  const result = await fulfillCheckout(sessionId);
  return NextResponse.json(result);
}
