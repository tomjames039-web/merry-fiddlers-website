'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Check,
  Calendar,
  Users,
  Gift,
  Mail,
  Ticket,
  MapPin,
  Phone,
  Loader2,
  AlertCircle,
  Clock,
  Music2,
  UtensilsCrossed,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import Header from '@/components/Header';
import type { TicketBooking, TicketEvent } from '@/lib/tickets';

interface Voucher {
  code: string;
  type: 'gift-voucher' | 'afternoon-tea';
  amount: number;
  status: string;
  purchaserName?: string;
  purchaserEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
  quantity?: number;
  addProsecco?: boolean;
}

type ConfirmStatus = 'loading' | 'paid' | 'unpaid' | 'not_configured' | 'error';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<ConfirmStatus>('loading');
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [booking, setBooking] = useState<TicketBooking | null>(null);
  const [event, setEvent] = useState<TicketEvent | null>(null);

  useEffect(() => {
    let active = true;
    if (!sessionId) {
      setStatus('error');
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();
        if (!active) return;
        if (data.status === 'paid' && data.booking) {
          setBooking(data.booking as TicketBooking);
          setStatus('paid');
          // Pull the event display details (date, kick-off, rules, etc.).
          fetch('/api/events')
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => active && d?.event && setEvent(d.event as TicketEvent))
            .catch(() => {});
        } else if (data.status === 'paid' && data.voucher) {
          setVoucher(data.voucher);
          setStatus('paid');
        } else {
          setStatus((data.status as ConfirmStatus) || 'error');
        }
      } catch {
        if (active) setStatus('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [sessionId]);

  // ---- Loading ----
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#f8f6f1] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#c9a55c] animate-spin mx-auto mb-4" />
          <p className="text-[#2d4a4a] text-lg">Confirming your payment…</p>
        </div>
      </div>
    );
  }

  // ---- Event ticket booking confirmed ----
  if (status === 'paid' && booking) {
    return <TicketConfirmation booking={booking} event={event} />;
  }

  // ---- Anything other than a confirmed payment ----
  if (status !== 'paid' || !voucher) {
    const isUnpaid = status === 'unpaid';
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20 bg-[#f8f6f1]">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-20 h-20 bg-[#c9a55c]/15 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-[#c9a55c]" />
              </div>
              <h1
                className="text-3xl md:text-4xl text-[#2d4a4a] mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isUnpaid ? 'Payment Not Completed' : 'Something went wrong'}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {isUnpaid
                  ? "It looks like your payment wasn't completed. You haven't been charged. Please try again."
                  : "We couldn't confirm this order automatically. If you've been charged, please contact us and we'll sort it right away."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+441992572142"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Phone className="w-4 h-4" /> Call Us
                </a>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---- Confirmed ----
  const isGift = voucher.type === 'gift-voucher';
  const emailedTo = isGift
    ? voucher.recipientEmail || voucher.purchaserEmail
    : voucher.purchaserEmail;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-16 bg-[#f8f6f1]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h1
                className="text-4xl md:text-5xl text-[#2d4a4a] mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isGift ? 'Voucher Purchased!' : 'Afternoon Tea Booked!'}
              </h1>
              <p className="text-xl text-gray-600">
                {isGift
                  ? 'Your gift voucher has been created and emailed.'
                  : 'Your afternoon tea voucher is ready.'}
              </p>
            </div>

            {/* Voucher code */}
            <div className="bg-gradient-to-br from-[#c9a55c] to-[#b8944b] text-white rounded-2xl shadow-xl p-8 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-white/90">
                <Ticket className="w-5 h-5" />
                <span className="uppercase tracking-wider text-sm">
                  Your Voucher Code
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-mono font-bold tracking-widest break-all">
                {voucher.code}
              </p>
              <p className="text-white/80 text-sm mt-3">
                Keep this safe — quote it when booking or paying. Valid 12 months.
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-[#2d4a4a] text-white px-6 py-4">
                <h2
                  className="text-xl font-semibold"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {isGift ? 'Voucher Details' : 'Booking Details'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                <DetailRow
                  icon={<Gift className="w-6 h-6 text-[#c9a55c]" />}
                  label={isGift ? 'Voucher Value' : 'Total Paid'}
                  value={`£${voucher.amount.toFixed(2)}`}
                  emphasize
                />

                {isGift && voucher.recipientName && (
                  <DetailRow
                    icon={<Users className="w-6 h-6 text-[#c9a55c]" />}
                    label="Recipient"
                    value={voucher.recipientName}
                  />
                )}

                {!isGift && (
                  <DetailRow
                    icon={<Users className="w-6 h-6 text-[#c9a55c]" />}
                    label="Guests"
                    value={`${voucher.quantity ?? 1} ${
                      (voucher.quantity ?? 1) === 1 ? 'person' : 'people'
                    }${voucher.addProsecco ? ' + Prosecco' : ''}`}
                  />
                )}

                {isGift && voucher.giftMessage && (
                  <div className="bg-[#f8f6f1] rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Gift Message</p>
                    <p className="text-[#2d4a4a] italic">
                      &ldquo;{voucher.giftMessage}&rdquo;
                    </p>
                  </div>
                )}

                {emailedTo && (
                  <div className="pt-4 border-t border-gray-200">
                    <DetailRow
                      icon={<Mail className="w-6 h-6 text-[#c9a55c]" />}
                      label="Emailed to"
                      value={emailedTo}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* How to book afternoon tea */}
            {!isGift && (
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <h3
                  className="font-semibold text-[#2d4a4a] mb-4 flex items-center gap-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Calendar className="w-5 h-5 text-[#c9a55c]" /> How to book your tea
                </h3>
                <p className="text-gray-600 mb-3">
                  All afternoon tea bookings are made by email. Email{' '}
                  <a href="mailto:info@themerryfiddlers.co.uk" className="text-[#c9a55c] hover:underline">info@themerryfiddlers.co.uk</a>{' '}
                  with your voucher code and preferred date. Afternoon Tea is served 12:00&ndash;4:00 PM, Wednesday to Saturday.
                </p>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                    <a href="mailto:info@themerryfiddlers.co.uk" className="hover:text-[#2d4a4a]">
                      info@themerryfiddlers.co.uk
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                    <span>4 Fiddlers Hamlet, Epping CM16 7PY</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Back to Home
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                View Menus
              </Link>
            </div>

            <div className="text-center mt-12 text-gray-600">
              <p className="text-lg">Thank you for choosing The Merry Fiddlers!</p>
              <p>We look forward to welcoming you.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TicketConfirmation({
  booking,
  event,
}: {
  booking: TicketBooking;
  event: TicketEvent | null;
}) {
  const [qr, setQr] = useState<string>('');

  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = `${origin}/admin/checkin?token=${encodeURIComponent(booking.token)}`;
    import('qrcode')
      .then(({ default: QRCode }) =>
        QRCode.toDataURL(url, { width: 260, margin: 1 })
      )
      .then(setQr)
      .catch(() => {});
  }, [booking.token]);

  const dateLabel = event?.dateLabel ?? 'Wednesday 15 July 2026';
  const kickoff = event?.kickoff ?? '8:00pm';
  const djFrom = event?.djFrom ?? '6:30pm';
  const lastFood = event?.lastFood ?? '9:30pm';
  const venue = event?.venue ?? 'The Merry Fiddlers, 4 Fiddlers Hamlet, Epping, CM16 7PY';
  const menuUrl = event?.menuUrl ?? '/menu';
  const rules = event?.rules ?? [
    'No outside food or drink is permitted, including takeaways and food deliveries.',
    'Tickets are non-refundable.',
    'Each ticket is valid only for the named attendee.',
    'Seating and viewing-area requests are not guaranteed.',
    'Please follow staff instructions during the event.',
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-16 bg-[#f4f1ea]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Success */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>
              <h1
                className="text-4xl md:text-5xl text-[#12292a] mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                You&apos;re booked for England v Argentina
              </h1>
              <p className="text-lg text-gray-600 flex items-center justify-center gap-2 flex-wrap">
                <Mail className="w-5 h-5 text-[#c9a55c]" />
                A confirmation email has been sent to {booking.purchaserEmail}.
              </p>
            </div>

            {/* Reference + QR */}
            <div className="bg-gradient-to-br from-[#c9a55c] to-[#b8944b] text-white rounded-2xl shadow-xl p-8 mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-white/90">
                <Ticket className="w-5 h-5" />
                <span className="uppercase tracking-wider text-sm">Booking Reference</span>
              </div>
              <p className="text-3xl md:text-4xl font-mono font-bold tracking-[0.2em] break-all">
                {booking.ref}
              </p>
              {qr && (
                <div className="mt-6 inline-block bg-white p-3 rounded-xl">
                  <img src={qr} alt="Check-in QR code" className="w-40 h-40" />
                </div>
              )}
              <p className="text-white/85 text-sm mt-4 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4" /> Show this reference or QR code when you arrive.
              </p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-[#12292a] text-white px-6 py-4">
                <h2 className="text-xl font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                  Your Booking
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <DetailRow
                  icon={<Users className="w-6 h-6 text-[#c9a55c]" />}
                  label="Lead booker"
                  value={booking.purchaserName}
                />
                <DetailRow
                  icon={<Ticket className="w-6 h-6 text-[#c9a55c]" />}
                  label="Tickets"
                  value={`${booking.quantity} · £${booking.amount.toFixed(2)} paid`}
                />
                <DetailRow
                  icon={<MapPin className="w-6 h-6 text-[#c9a55c]" />}
                  label="Preferred area"
                  value={booking.viewingAreaLabel}
                />
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Attendees</p>
                  <ul className="space-y-1.5">
                    {booking.attendees.map((name, i) => (
                      <li key={i} className="flex items-center gap-2 text-[#12292a]">
                        <span className="w-5 h-5 rounded-full bg-[#f4f1ea] text-xs font-semibold flex items-center justify-center text-gray-500">
                          {i + 1}
                        </span>
                        {name}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">
                    Each ticket is valid only for the named attendee.
                  </p>
                </div>
                {booking.bookingNotes && (
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Your booking note</p>
                    <p className="text-[#12292a] italic">&ldquo;{booking.bookingNotes}&rdquo;</p>
                    <p className="text-xs text-gray-400 mt-1">Requests are not guaranteed.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Match day */}
            <div className="bg-[#12292a] text-white rounded-2xl shadow-xl p-6 mb-8">
              <h3 className="text-[#c9a55c] font-semibold mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Match Day
              </h3>
              <div className="space-y-3 text-white/90">
                <p className="flex items-center gap-3"><Calendar className="w-5 h-5 text-[#c9a55c]" /> {dateLabel}</p>
                <p className="flex items-center gap-3"><Music2 className="w-5 h-5 text-[#c9a55c]" /> DJ from {djFrom}</p>
                <p className="flex items-center gap-3"><Clock className="w-5 h-5 text-[#c9a55c]" /> Kick-off at {kickoff}</p>
                <p className="flex items-center gap-3"><UtensilsCrossed className="w-5 h-5 text-[#c9a55c]" /> Last food orders at {lastFood}</p>
                <p className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#c9a55c]" /> {venue}</p>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-[#fff8e8] border border-[#e8c877] rounded-2xl p-6 mb-8">
              <h3 className="flex items-center gap-2 text-[#8a6a00] font-semibold mb-3">
                <ShieldCheck className="w-5 h-5" /> Important event rules
              </h3>
              <ul className="space-y-2 text-sm text-[#6a5220]">
                {rules.map((r) => (
                  <li key={r} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#b8944b] flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={menuUrl}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                View the Menu
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#12292a] text-[#12292a] hover:bg-[#12292a] hover:text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Back to Home
              </Link>
            </div>

            <div className="text-center mt-12 text-gray-600">
              <p className="text-lg">Thank you — see you in the garden!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  emphasize,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p
          className={
            emphasize
              ? 'text-2xl font-bold text-[#c9a55c]'
              : 'text-lg font-medium text-[#2d4a4a]'
          }
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#c9a55c] animate-spin mx-auto mb-4" />
        <p className="text-[#2d4a4a] text-lg">Loading…</p>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BookingSuccessContent />
    </Suspense>
  );
}
