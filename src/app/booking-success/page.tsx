'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, Calendar, Clock, Users, Gift, Mail, Download, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';

interface BookingDetails {
  type: string;
  date?: string;
  time?: string;
  quantity?: string;
  customerName?: string;
  customerEmail?: string;
  addProsecco?: string;
  voucherAmount?: string;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
  purchaserName?: string;
  purchaserEmail?: string;
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const type = searchParams.get('type');
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you would fetch the session details from Stripe
    // For now, we'll simulate this with mock data based on type
    const fetchBookingDetails = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (type === 'afternoon-tea') {
        setBookingDetails({
          type: 'afternoon-tea',
          date: 'Saturday, 24 May 2025',
          time: '15:00',
          quantity: '2',
          customerName: 'Guest',
          customerEmail: 'guest@example.com',
          addProsecco: 'true',
        });
      } else if (type === 'gift-voucher') {
        setBookingDetails({
          type: 'gift-voucher',
          voucherAmount: '50',
          recipientName: 'Lucky Recipient',
          recipientEmail: 'recipient@example.com',
          giftMessage: 'Enjoy your meal!',
          purchaserName: 'Guest',
          purchaserEmail: 'guest@example.com',
        });
      }
      setLoading(false);
    };

    fetchBookingDetails();
  }, [sessionId, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c9a55c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2d4a4a] text-lg">Loading your booking details...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-4xl md:text-5xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                {type === 'gift-voucher' ? 'Voucher Purchased!' : 'Booking Confirmed!'}
              </h1>
              <p className="text-xl text-gray-600">
                {type === 'gift-voucher'
                  ? 'Your gift voucher has been created and sent.'
                  : 'Your afternoon tea experience is booked!'}
              </p>
            </div>

            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="bg-[#2d4a4a] text-white px-6 py-4">
                <h2 className="text-xl font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                  {type === 'gift-voucher' ? 'Voucher Details' : 'Booking Details'}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {type === 'afternoon-tea' && bookingDetails && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[#c9a55c]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-lg font-medium text-[#2d4a4a]">{bookingDetails.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-[#c9a55c]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="text-lg font-medium text-[#2d4a4a]">{bookingDetails.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#c9a55c]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="text-lg font-medium text-[#2d4a4a]">
                          {bookingDetails.quantity} {Number(bookingDetails.quantity) === 1 ? 'person' : 'people'}
                          {bookingDetails.addProsecco === 'true' && ' + Prosecco upgrade'}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {type === 'gift-voucher' && bookingDetails && (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center">
                        <Gift className="w-6 h-6 text-[#c9a55c]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Voucher Value</p>
                        <p className="text-2xl font-bold text-[#c9a55c]">£{bookingDetails.voucherAmount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#c9a55c]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Recipient</p>
                        <p className="text-lg font-medium text-[#2d4a4a]">{bookingDetails.recipientName}</p>
                      </div>
                    </div>

                    {bookingDetails.giftMessage && (
                      <div className="bg-[#f8f6f1] rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Gift Message</p>
                        <p className="text-[#2d4a4a] italic">"{bookingDetails.giftMessage}"</p>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#c9a55c]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Confirmation sent to</p>
                      <p className="text-lg font-medium text-[#2d4a4a]">{bookingDetails?.customerEmail || bookingDetails?.purchaserEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Info (for afternoon tea) */}
            {type === 'afternoon-tea' && (
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <h3 className="font-semibold text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                  Find Us
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                    <span>4 Fiddlers Hamlet, Epping CM16 7PY</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                    <a href="tel:+441992572142" className="hover:text-[#2d4a4a]">+44 1992 572142</a>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {type === 'gift-voucher' && (
                <button
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Download className="w-5 h-5" />
                  Download Voucher
                </button>
              )}
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

            {/* Thank You Message */}
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

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#f8f6f1] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#c9a55c] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#2d4a4a] text-lg">Loading...</p>
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
