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
} from 'lucide-react';
import Header from '@/components/Header';

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
        if (data.status === 'paid' && data.voucher) {
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
