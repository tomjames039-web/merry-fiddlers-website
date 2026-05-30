'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight, Check, Coffee, Cake, Gift, Calendar, CreditCard, Users, Sparkles, AlertCircle, Lock } from 'lucide-react';
import Header from '@/components/Header';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Plan Your Visit', href: '/plan-your-visit' },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: 'Contact Us', href: '/contact' },
];

const teaIncludes = [
  'Selection of finger sandwiches',
  'Freshly baked scones with clotted cream & jam',
  'Assortment of cakes & pastries',
  'Pot of premium loose-leaf tea or coffee',
  'Glass of Prosecco (optional upgrade)',
];

const OFFER_END_DATE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
const ORIGINAL_PRICE = 35;
const DISCOUNTED_PRICE = 17.50;

function calculateTimeLeft(endDate: Date): TimeLeft | null {
  const difference = endDate.getTime() - new Date().getTime();

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export default function AfternoonTeaOfferPage() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(2);
  const [addProsecco, setAddProsecco] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(OFFER_END_DATE));
    }, 1000);
    setTimeLeft(calculateTimeLeft(OFFER_END_DATE));
    return () => clearInterval(timer);
  }, []);

  const proseccoPrice = 7.50;
  const totalPrice = (DISCOUNTED_PRICE * quantity) + (addProsecco ? proseccoPrice * quantity : 0);
  const savings = (ORIGINAL_PRICE * quantity) - (DISCOUNTED_PRICE * quantity);

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      // Store customer details for confirmation email
      const bookingData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        quantity,
        addProsecco,
        specialRequests: formData.specialRequests,
        totalPrice,
      };

      // Send booking details to backend
      await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'afternoon-tea-purchase',
          ...bookingData,
        }),
      });

      // Create PayPal payment URL
      const paypalEmail = 'tomjames039@gmail.com';
      const itemName = `Afternoon Tea for ${quantity} ${quantity === 1 ? 'person' : 'people'}${addProsecco ? ' with Prosecco' : ''}`;
      const paypalUrl = `https://www.paypal.com/paypalme/tomjames039/${totalPrice.toFixed(2)}GBP`;

      // Alternative: Use PayPal checkout link
      // const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalEmail)}&item_name=${encodeURIComponent(itemName)}&amount=${totalPrice.toFixed(2)}&currency_code=GBP&return=${encodeURIComponent(window.location.origin + '/booking-success?type=afternoon-tea')}&cancel_return=${encodeURIComponent(window.location.origin + '/afternoon-tea-offer')}`;

      // Redirect to PayPal
      window.location.href = paypalUrl;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Something went wrong. Please try again or contact us directly.');
      setIsProcessing(false);
    }
  };

  const isStep1Valid = quantity >= 1;
  const isStep2Valid = formData.name && formData.email && formData.phone;

  if (isComplete) {
    return (
      <div className="min-h-screen">
        <Header />
        <main id="main-content" className="py-20 bg-[#f8f6f1]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Purchase Confirmed!
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Your 50% Off Afternoon Tea voucher for <strong>{quantity} {quantity === 1 ? 'person' : 'people'}</strong> has been purchased!
              </p>
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8 text-left">
                <h3 className="font-semibold text-[#2d4a4a] mb-4 text-lg">Purchase Details</h3>
                <div className="space-y-3 text-gray-600">
                  <p><strong>Voucher for:</strong> {quantity} {quantity === 1 ? 'person' : 'people'}</p>
                  <p><strong>Total Paid:</strong> £{totalPrice.toFixed(2)}</p>
                  {addProsecco && <p><strong>Includes:</strong> Prosecco upgrade</p>}
                  <p className="text-green-600 font-medium">You saved: £{savings.toFixed(2)}!</p>
                </div>
              </div>

              <div className="bg-[#c9a55c]/10 border-2 border-[#c9a55c] rounded-xl p-6 mb-8">
                <div className="flex items-start gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-[#c9a55c] flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-bold text-[#2d4a4a] text-lg mb-2">What happens next?</h3>
                    <p className="text-gray-700 mb-3">
                      We'll contact you within <strong>1-2 business days</strong> to arrange your afternoon tea booking at a time that suits you.
                    </p>
                    <p className="text-sm text-gray-600">
                      We serve Afternoon Tea Wednesday to Sunday between 2:00 PM - 5:00 PM.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 mb-8">
                A confirmation email has been sent to <strong>{formData.email}</strong>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-8 py-4 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Back to Home
                </Link>
                <Link
                  href="/getting-here"
                  className="px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Plan Your Visit
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#2d4a4a] via-[#3a5656] to-[#2d4a4a] text-white overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a55c]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c9a55c]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Breadcrumb */}
              <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#c9a55c]">50% Off Afternoon Tea</span>
              </nav>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#c9a55c] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Sparkles className="w-4 h-4" />
                LIMITED TIME OFFER
                <Sparkles className="w-4 h-4" />
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                50% Off<br />
                <span className="text-[#c9a55c]">Afternoon Tea</span>
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Purchase your voucher now and we'll contact you to arrange your booking.
                Freshly baked scones, delicate sandwiches, and sweet treats await.
              </p>

              {/* Timer */}
              {timeLeft && (
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#c9a55c]" />
                    <span className="text-white/70">Offer ends in:</span>
                  </div>
                  <div className="flex gap-2 font-mono text-xl font-bold">
                    {timeLeft.days > 0 && (
                      <div className="bg-white/20 px-3 py-2 rounded-lg">
                        <span>{timeLeft.days}</span>
                        <span className="text-xs text-white/60 ml-1">d</span>
                      </div>
                    )}
                    <div className="bg-white/20 px-3 py-2 rounded-lg">
                      <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                      <span className="text-xs text-white/60 ml-1">h</span>
                    </div>
                    <div className="bg-white/20 px-3 py-2 rounded-lg">
                      <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                      <span className="text-xs text-white/60 ml-1">m</span>
                    </div>
                    <div className="bg-white/20 px-3 py-2 rounded-lg">
                      <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                      <span className="text-xs text-white/60 ml-1">s</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Price display */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-2xl text-white/50 line-through">£{ORIGINAL_PRICE.toFixed(2)}</span>
                <span className="text-5xl font-bold text-[#c9a55c]">£{DISCOUNTED_PRICE.toFixed(2)}</span>
                <span className="text-white/70">per person</span>
              </div>

              <a
                href="#purchase-now"
                className="inline-flex items-center gap-2 px-10 py-5 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-full text-lg font-semibold transition-all hover:scale-105 shadow-lg"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <Gift className="w-6 h-6" />
                Purchase Your Voucher
              </a>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl text-[#2d4a4a] mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                    What's Included
                  </h2>
                  <ul className="space-y-4">
                    {teaIncludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-[#c9a55c] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-700 text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 p-4 bg-[#f8f6f1] rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong className="text-[#c9a55c]">Dietary requirements?</strong> We cater for vegetarian, vegan, and gluten-free options. Just let us know when we contact you to book.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="/afternoon-tea.jpg"
                    alt="Afternoon Tea at The Merry Fiddlers"
                    className="rounded-2xl shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-[#c9a55c] text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                    50% OFF
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purchase Form */}
        <section id="purchase-now" className="py-16 bg-[#f8f6f1]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                  Purchase Your Voucher
                </h2>
                <p className="text-gray-600">Complete your purchase in 2 simple steps</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 text-left">
                      <strong>Please note:</strong> This is a voucher purchase. We'll contact you within 1-2 business days to arrange your afternoon tea booking at a convenient time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mb-10">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        step >= s ? 'bg-[#c9a55c] text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {step > s ? <Check className="w-6 h-6" /> : s}
                    </div>
                    {s < 2 && (
                      <div className={`w-12 md:w-20 h-1 mx-2 ${step > s ? 'bg-[#c9a55c]' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                {/* Step 1: Select Quantity */}
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Users className="w-6 h-6 text-[#c9a55c]" />
                      <h3 className="text-2xl text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>
                        How many guests?
                      </h3>
                    </div>

                    <div className="flex items-center justify-center gap-6 py-8">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-14 h-14 rounded-full border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-colors text-2xl font-bold"
                      >
                        -
                      </button>
                      <div className="text-center">
                        <span className="text-6xl font-bold text-[#2d4a4a]">{quantity}</span>
                        <p className="text-gray-500 mt-1">{quantity === 1 ? 'Guest' : 'Guests'}</p>
                      </div>
                      <button
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        className="w-14 h-14 rounded-full border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-colors text-2xl font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Prosecco Upgrade */}
                    <div className="mt-6 p-4 bg-[#f8f6f1] rounded-xl">
                      <label className="flex items-center gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addProsecco}
                          onChange={(e) => setAddProsecco(e.target.checked)}
                          className="w-6 h-6 rounded border-gray-300 text-[#c9a55c] focus:ring-[#c9a55c]"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-[#2d4a4a]">Add Prosecco Upgrade</p>
                          <p className="text-sm text-gray-500">Glass of Prosecco for each guest</p>
                        </div>
                        <span className="text-[#c9a55c] font-bold">+£{proseccoPrice.toFixed(2)}/person</span>
                      </label>
                    </div>

                    {/* Price Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Afternoon Tea x {quantity}</span>
                        <span className="font-medium">£{(DISCOUNTED_PRICE * quantity).toFixed(2)}</span>
                      </div>
                      {addProsecco && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Prosecco Upgrade x {quantity}</span>
                          <span className="font-medium">£{(proseccoPrice * quantity).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2 text-green-600">
                        <span>You save</span>
                        <span className="font-medium">-£{savings.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-xl font-bold text-[#2d4a4a]">Total</span>
                        <span className="text-2xl font-bold text-[#c9a55c]">£{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className="w-full mt-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] disabled:bg-gray-300 text-white rounded-lg transition-colors uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Step 2: Your Details & Payment */}
                {step === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="w-6 h-6 text-[#c9a55c]" />
                      <h3 className="text-2xl text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>
                        Your details & payment
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Special Requests / Dietary Requirements</label>
                        <textarea
                          value={formData.specialRequests}
                          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                          placeholder="Any allergies or dietary requirements we should know about?"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c] resize-none"
                        />
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 p-4 bg-[#f8f6f1] rounded-xl">
                      <h4 className="font-semibold text-[#2d4a4a] mb-3">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Guests</span>
                          <span className="font-medium">{quantity}</span>
                        </div>
                        {addProsecco && (
                          <div className="flex justify-between text-[#c9a55c]">
                            <span>Prosecco Upgrade</span>
                            <span className="font-medium">Included</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-200 text-lg">
                          <span className="font-bold text-[#2d4a4a]">Total</span>
                          <span className="font-bold text-[#c9a55c]">£{totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-semibold mb-1">We'll arrange your booking</p>
                        <p>After purchase, we'll contact you within 1-2 business days to schedule your afternoon tea at a time that works for you. Served Wednesday to Sunday, 2:00 PM - 5:00 PM.</p>
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="mt-6 p-6 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <Lock className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">Secure payment via PayPal</p>
                      <p className="text-xs text-gray-400 mt-1">You'll be redirected to PayPal to complete payment</p>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!isStep2Valid || isProcessing}
                        className="flex-1 py-4 bg-[#c9a55c] hover:bg-[#b8944b] disabled:bg-gray-300 text-white rounded-lg transition-colors uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Pay £{totalPrice.toFixed(2)}
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-4">
                      By completing this purchase you agree to our terms and conditions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="teal-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <img src="/logo.png" alt="The Merry Fiddlers" className="h-16 w-auto mb-4" />
              <p className="text-white/70 text-sm">Country Pub & Restaurant proudly serving Epping & surrounding areas since the 1600s.</p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                <Clock className="w-5 h-5 text-[#c9a55c]" />
                Opening Hours
              </h3>
              <ul className="space-y-2 text-white/70 text-sm">
                <li className="flex justify-between"><span>Monday - Tuesday</span><span className="text-red-400">Closed</span></li>
                <li className="flex justify-between"><span>Wednesday - Saturday</span><span className="text-white">12:00 - 00:00</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="text-white">12:00 - 20:00</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Contact Us</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 text-white/70">
                  <Phone className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="tel:+441992572142" className="hover:text-white">+44 1992 572142</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <Mail className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <a href="mailto:info@themerryfiddlers.co.uk" className="hover:text-white">info@themerryfiddlers.co.uk</a>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <MapPin className="w-5 h-5 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                  <span>4 Fiddlers Hamlet, Epping CM16 7PY</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {navigation.map((item) => (
                  <li key={item.name}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white">{item.name}</a>
                    ) : (
                      <Link href={item.href} className="text-white/70 hover:text-white">{item.name}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} The Merry Fiddlers. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
