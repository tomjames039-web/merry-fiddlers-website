'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight, Gift, CreditCard, User, MessageSquare, Check, Sparkles, Lock } from 'lucide-react';
import Header from '@/components/Header';
import StripeCheckout from '@/components/StripeCheckout';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: 'Upcoming', href: '/upcoming' },
  { name: 'Contact Us', href: '/contact' },
];

const voucherAmounts = [25, 50, 75, 100, 150, 200];

const voucherFeatures = [
  'Valid for 12 months from purchase',
  'Redeemable for food & drinks',
  'Can be used for afternoon tea, dinner, or Sunday roast',
  'Beautifully designed digital voucher',
  'Instant delivery via email',
  'Perfect for any occasion',
];

export default function GiftVouchersPage() {
  const [step, setStep] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    giftMessage: '',
    purchaserName: '',
    purchaserEmail: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'email' | 'download'>('email');

  const finalAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
  const isStep1Valid = finalAmount >= 10;
  const isStep2Valid = formData.recipientName.trim() !== '';
  const isStep3Valid = formData.purchaserName && formData.purchaserEmail;

  const handleSubmit = () => {
    setIsProcessing(false);
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#2d4a4a] via-[#3a5656] to-[#2d4a4a] text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a55c]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#c9a55c]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-[#c9a55c]">Gift Vouchers</span>
              </nav>

              <div className="inline-flex items-center gap-2 bg-[#c9a55c] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
                <Gift className="w-4 h-4" />
                THE PERFECT GIFT
                <Gift className="w-4 h-4" />
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
                Gift <span className="text-[#c9a55c]">Vouchers</span>
              </h1>

              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Give the gift of an unforgettable dining experience at The Merry Fiddlers.
                Perfect for birthdays, anniversaries, or just because.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
              {voucherFeatures.slice(0, 3).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-[#c9a55c]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Purchase Form */}
        <section className="py-16 bg-[#f8f6f1]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-4 mb-10">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors ${
                        step >= s ? 'bg-[#c9a55c] text-white' : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {step > s ? <Check className="w-6 h-6" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`w-12 md:w-20 h-1 mx-2 ${step > s ? 'bg-[#c9a55c]' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                {/* Step 1: Choose Amount */}
                {step === 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <Gift className="w-6 h-6 text-[#c9a55c]" />
                      <h3 className="text-2xl text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>
                        Choose Voucher Amount
                      </h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {voucherAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount('');
                          }}
                          className={`py-4 rounded-lg border-2 transition-all font-semibold text-lg ${
                            selectedAmount === amount
                              ? 'border-[#c9a55c] bg-[#c9a55c]/10 text-[#c9a55c]'
                              : 'border-gray-200 hover:border-[#c9a55c]/50 text-[#2d4a4a]'
                          }`}
                        >
                          £{amount}
                        </button>
                      ))}
                    </div>

                    <div className="relative mb-8">
                      <label className="block text-sm text-gray-600 mb-2">Or enter a custom amount (min £10)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">£</span>
                        <input
                          type="number"
                          min="10"
                          step="1"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                          }}
                          placeholder="Enter amount"
                          className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#c9a55c] text-lg"
                        />
                      </div>
                    </div>

                    {finalAmount > 0 && (
                      <div className="bg-[#f8f6f1] rounded-xl p-6 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Gift Voucher Value</span>
                          <span className="text-3xl font-bold text-[#c9a55c]">£{finalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setStep(2)}
                      disabled={!isStep1Valid}
                      className="w-full py-4 bg-[#c9a55c] hover:bg-[#b8944b] disabled:bg-gray-300 text-white rounded-lg transition-colors uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Step 2: Recipient Details */}
                {step === 2 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-6 h-6 text-[#c9a55c]" />
                      <h3 className="text-2xl text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>
                        Recipient Details
                      </h3>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Recipient's Name *</label>
                        <input
                          type="text"
                          value={formData.recipientName}
                          onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                          placeholder="Who is this gift for?"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Delivery Method</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setDeliveryOption('email')}
                            className={`py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                              deliveryOption === 'email'
                                ? 'border-[#c9a55c] bg-[#c9a55c]/10 text-[#c9a55c]'
                                : 'border-gray-200 text-gray-600'
                            }`}
                          >
                            <Mail className="w-5 h-5" />
                            Email to Recipient
                          </button>
                          <button
                            onClick={() => setDeliveryOption('download')}
                            className={`py-3 px-4 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                              deliveryOption === 'download'
                                ? 'border-[#c9a55c] bg-[#c9a55c]/10 text-[#c9a55c]'
                                : 'border-gray-200 text-gray-600'
                            }`}
                          >
                            <Gift className="w-5 h-5" />
                            Download & Print
                          </button>
                        </div>
                      </div>

                      {deliveryOption === 'email' && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Recipient's Email</label>
                          <input
                            type="email"
                            value={formData.recipientEmail}
                            onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                            placeholder="We'll send the voucher here"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          Gift Message (optional)
                        </label>
                        <textarea
                          value={formData.giftMessage}
                          onChange={(e) => setFormData({ ...formData, giftMessage: e.target.value })}
                          placeholder="Add a personal message..."
                          rows={3}
                          maxLength={200}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c] resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">{formData.giftMessage.length}/200 characters</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!isStep2Valid}
                        className="flex-1 py-4 bg-[#c9a55c] hover:bg-[#b8944b] disabled:bg-gray-300 text-white rounded-lg transition-colors uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Continue
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Your Details & Payment */}
                {step === 3 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <CreditCard className="w-6 h-6 text-[#c9a55c]" />
                      <h3 className="text-2xl text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>
                        Your Details & Payment
                      </h3>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Your Name *</label>
                        <input
                          type="text"
                          value={formData.purchaserName}
                          onChange={(e) => setFormData({ ...formData, purchaserName: e.target.value })}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Your Email *</label>
                        <input
                          type="email"
                          value={formData.purchaserEmail}
                          onChange={(e) => setFormData({ ...formData, purchaserEmail: e.target.value })}
                          placeholder="We'll send the receipt here"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                          required
                        />
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#f8f6f1] rounded-xl p-6 mb-6">
                      <h4 className="font-semibold text-[#2d4a4a] mb-4">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Gift Voucher</span>
                          <span className="font-medium">£{finalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recipient</span>
                          <span className="font-medium">{formData.recipientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery</span>
                          <span className="font-medium">{deliveryOption === 'email' ? 'Email' : 'Download'}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-gray-200 text-lg">
                          <span className="font-bold text-[#2d4a4a]">Total</span>
                          <span className="font-bold text-[#c9a55c]">£{finalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Secure Payment Notice */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                      <Lock className="w-4 h-4" />
                      <span>Secure card payment — you won't leave this page</span>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 py-4 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!isStep3Valid || isProcessing}
                        className="flex-1 py-4 bg-[#c9a55c] hover:bg-[#b8944b] disabled:bg-gray-300 text-white rounded-lg transition-colors uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        <CreditCard className="w-5 h-5" />
                        Pay £{finalAmount.toFixed(2)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Why Gift Vouchers */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl text-[#2d4a4a] text-center mb-8" style={{ fontFamily: "'Cinzel', serif" }}>
                Why Choose Our Gift Vouchers?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {voucherFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-[#f8f6f1] rounded-lg">
                    <div className="w-6 h-6 bg-[#c9a55c] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {showCheckout && (
        <StripeCheckout
          title={`Gift Voucher · £${finalAmount.toFixed(2)}`}
          payload={{
            type: 'gift-voucher',
            voucherAmount: finalAmount,
            recipientName: formData.recipientName,
            recipientEmail: deliveryOption === 'email' ? formData.recipientEmail : '',
            giftMessage: formData.giftMessage,
            customerName: formData.purchaserName,
            customerEmail: formData.purchaserEmail,
          }}
          onClose={() => setShowCheckout(false)}
        />
      )}

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
