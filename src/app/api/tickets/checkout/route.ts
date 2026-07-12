import { type NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getTicketEvent, reserveBooking, updateBooking } from '@/lib/store';
import { ARGENTINA_EVENT_ID, areaLabel } from '@/lib/tickets';

type CheckoutLineItem = {
  price_data: {
    currency: string;
    product_data: { name: string; description?: string };
    unit_amount: number;
  };
  quantity: number;
};

const MAX_NOTE = 500;

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'stripe_not_configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }

  const eventId = (body.eventId as string) || ARGENTINA_EVENT_ID;
  const event = await getTicketEvent(eventId);

  if (event.salesStatus !== 'on-sale') {
    return NextResponse.json(
      { error: 'not_on_sale', status: event.salesStatus },
      { status: 409 }
    );
  }

  // ---- Validate the customer input ----
  const quantity = Number(body.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > event.maxPerOrder) {
    return NextResponse.json(
      { error: 'invalid_quantity', max: event.maxPerOrder },
      { status: 400 }
    );
  }

  const purchaserName = String(body.purchaserName || '').trim();
  const purchaserEmail = String(body.purchaserEmail || '').trim();
  const purchaserPhone = String(body.purchaserPhone || '').trim();
  if (!purchaserName || !purchaserEmail || !purchaserPhone) {
    return NextResponse.json({ error: 'missing_purchaser' }, { status: 400 });
  }
  if (!/.+@.+\..+/.test(purchaserEmail)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  const rawAttendees = Array.isArray(body.attendees) ? body.attendees : [];
  const attendees = rawAttendees
    .map((a) => String(a || '').trim())
    .slice(0, quantity);
  if (attendees.length !== quantity || attendees.some((a) => !a)) {
    return NextResponse.json({ error: 'missing_attendee_names' }, { status: 400 });
  }

  if (body.acceptedRules !== true) {
    return NextResponse.json({ error: 'rules_not_accepted' }, { status: 400 });
  }

  const viewingArea =
    typeof body.viewingArea === 'string' &&
    event.viewingAreas.some((a) => a.id === body.viewingArea)
      ? (body.viewingArea as string)
      : 'no-preference';

  const accessibilityNote = String(body.accessibilityNote || '')
    .trim()
    .slice(0, MAX_NOTE);
  const bookingNotes = String(body.bookingNotes || '')
    .trim()
    .slice(0, MAX_NOTE);

  const total = (event.pricePence * quantity) / 100;

  // ---- Reserve inventory (pending hold, reserve-then-verify) ----
  const reservation = await reserveBooking({
    eventId: event.id,
    quantity,
    amount: total,
    purchaserName,
    purchaserEmail,
    purchaserPhone,
    attendees,
    viewingArea,
    viewingAreaLabel: areaLabel(event, viewingArea),
    accessibilityNote: accessibilityNote || undefined,
    bookingNotes: bookingNotes || undefined,
  });

  if (!reservation.ok || !reservation.booking) {
    const code =
      reservation.reason === 'not_on_sale'
        ? 409
        : reservation.reason === 'invalid'
          ? 400
          : 409;
    return NextResponse.json(
      { error: reservation.reason || 'unavailable', remaining: reservation.remaining },
      { status: code }
    );
  }

  const booking = reservation.booking;

  // ---- Create the Stripe checkout session ----
  const host = request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || 'https';
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (host ? `${proto}://${host}` : '') ||
    request.headers.get('origin') ||
    request.nextUrl.origin;

  const lineItems: CheckoutLineItem[] = [
    {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: `${event.name} — Match Ticket`,
          description: `£${(event.pricePence / 100).toFixed(2)} per person · ${event.dateLabel}`,
        },
        unit_amount: event.pricePence,
      },
      quantity,
    },
  ];

  try {
    type CreateParams = Parameters<typeof stripe.checkout.sessions.create>[0];
    const params = {
      ui_mode: 'embedded_page',
      mode: 'payment',
      line_items: lineItems,
      customer_email: purchaserEmail,
      metadata: {
        type: 'event-ticket',
        bookingRef: booking.ref,
        eventId: event.id,
        quantity: String(quantity),
      },
      return_url: `${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}&type=event-ticket`,
    } as unknown as CreateParams;

    const session = await stripe.checkout.sessions.create(params);

    await updateBooking(booking.ref, { sessionId: session.id });

    return NextResponse.json({
      clientSecret: session.client_secret,
      bookingRef: booking.ref,
    });
  } catch (error) {
    // Release the hold so those tickets return to sale.
    await updateBooking(booking.ref, {
      status: 'cancelled',
      heldUntil: undefined,
    });
    console.error('Ticket checkout error:', error);
    const detail = error instanceof Error ? error.message : 'unknown error';
    return NextResponse.json(
      { error: 'checkout_failed', detail },
      { status: 500 }
    );
  }
}
