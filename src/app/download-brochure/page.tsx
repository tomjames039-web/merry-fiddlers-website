'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight, FileText, Download, Check, Loader2, PartyPopper, Users, Heart, Baby, Cake } from 'lucide-react';
import Header from '@/components/Header';
import { getEvent } from '@/lib/events';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: 'Upcoming', href: '/upcoming' },
  { name: 'Contact Us', href: '/contact' },
];

const eventTypes = [
  { value: 'wedding', label: 'Wedding Reception', icon: Heart },
  { value: 'birthday', label: 'Birthday Party', icon: Cake },
  { value: 'corporate', label: 'Corporate Event', icon: Users },
  { value: 'christening', label: 'Christening', icon: Baby },
  { value: 'anniversary', label: 'Anniversary', icon: PartyPopper },
  { value: 'other', label: 'Other', icon: PartyPopper },
];

export default function DownloadBrochurePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    expectedGuests: '',
    preferredDate: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [eventTag, setEventTag] = useState('');
  const [eventName, setEventName] = useState('');

  // Pick up ?event=<slug> from the event landing pages so the lead is tagged.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('event') || '';
    if (!slug) return;
    const ev = getEvent(slug);
    setEventTag(slug);
    if (ev) {
      setEventName(ev.name);
      setFormData((prev) => ({ ...prev, eventType: ev.leadEventType }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save lead data via API
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agreedToMarketing,
          source: eventTag ? `brochure-${eventTag}` : 'brochure-download',
        }),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.fullName && formData.email && formData.eventType;

  return (
    <div className="min-h-screen">
      <Header />

      {/* Page Header */}
      <section className="py-16 bg-gradient-to-br from-[#2d4a4a] via-[#3a5656] to-[#2d4a4a] text-white">
        <div className="container mx-auto px-4 text-center">
          <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#c9a55c]">Event Brochure</span>
          </nav>
          <h1 className="text-5xl md:text-6xl mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
            Event Brochure
          </h1>
          <div className="w-16 h-1 bg-[#c9a55c] mx-auto mb-6" />
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Download our comprehensive event brochure to discover all the ways we can make your special occasion unforgettable.
          </p>
          {eventName && (
            <p className="mt-5 inline-block bg-[#c9a55c] text-[#1d3a3a] px-4 py-1.5 rounded-full text-sm font-semibold">
              Enquiry for: {eventName}
            </p>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-[#f8f6f1]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {!isSubmitted ? (
              /* Lead Capture Form */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-[#2d4a4a] text-white px-8 py-6 text-center">
                  <FileText className="w-12 h-12 text-[#c9a55c] mx-auto mb-3" />
                  <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                    Get Your Free Event Brochure
                  </h2>
                  <p className="text-white/70 mt-2 text-sm">
                    Fill in your details below and get instant access
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c] focus:ring-1 focus:ring-[#c9a55c]"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c] focus:ring-1 focus:ring-[#c9a55c]"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c] focus:ring-1 focus:ring-[#c9a55c]"
                    />
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Event <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {eventTypes.map((event) => {
                        const Icon = event.icon;
                        return (
                          <button
                            key={event.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, eventType: event.value })}
                            className={`p-3 rounded-lg border-2 transition-all text-sm flex flex-col items-center gap-1 ${
                              formData.eventType === event.value
                                ? 'border-[#c9a55c] bg-[#c9a55c]/10 text-[#2d4a4a]'
                                : 'border-gray-200 text-gray-600 hover:border-[#c9a55c]/50'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${formData.eventType === event.value ? 'text-[#c9a55c]' : 'text-gray-400'}`} />
                            <span>{event.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Expected Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Guests
                      </label>
                      <select
                        value={formData.expectedGuests}
                        onChange={(e) => setFormData({ ...formData, expectedGuests: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c] text-gray-600"
                      >
                        <option value="">Select...</option>
                        <option value="10-20">10-20 guests</option>
                        <option value="20-40">20-40 guests</option>
                        <option value="40-60">40-60 guests</option>
                        <option value="60-80">60-80 guests</option>
                        <option value="80+">80+ guests</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c]"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tell us about your event (optional)
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any specific requirements or questions?"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a55c] resize-none"
                    />
                  </div>

                  {/* Marketing Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={agreedToMarketing}
                      onChange={(e) => setAgreedToMarketing(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-[#c9a55c] focus:ring-[#c9a55c]"
                    />
                    <label htmlFor="marketing" className="text-sm text-gray-600">
                      I'd like to receive updates about events, special offers, and news from The Merry Fiddlers
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full py-4 bg-[#c9a55c] hover:bg-[#b8944b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors uppercase tracking-wider font-medium flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Get Your Brochure
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                </form>
              </div>
            ) : (
              /* Success State with Download */
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-br from-[#2d4a4a] to-[#3a5656] text-white px-8 py-10 text-center">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </div>
                  <h2 className="text-3xl font-semibold mb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    Thank You, {formData.fullName.split(' ')[0]}!
                  </h2>
                  <p className="text-white/80">
                    Your brochure is ready to download
                  </p>
                </div>

                <div className="p-8 text-center">
                  <div className="bg-[#f8f6f1] rounded-xl p-6 mb-6">
                    <FileText className="w-16 h-16 text-[#c9a55c] mx-auto mb-4" />
                    <h3 className="text-xl text-[#2d4a4a] font-semibold mb-2">
                      The Merry Fiddlers Event Brochure
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Everything you need to plan your perfect event
                    </p>
                    <a
                      href="https://drive.google.com/file/d/1ZvLlQeVPo2ksjHns8q014LfCTaeCBsLg/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      <Download className="w-5 h-5" />
                      View & Download Brochure
                    </a>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-gray-600 mb-4">
                      We've also sent a copy to <strong>{formData.email}</strong>
                    </p>
                    <p className="text-gray-600 mb-6">
                      Want to discuss your event? We'd love to hear from you!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="tel:+441992572142"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                        Call Us
                      </a>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white rounded-lg transition-colors"
                      >
                        <Mail className="w-5 h-5" />
                        Send Enquiry
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {!isSubmitted && (
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Prefer to speak to someone directly?</p>
                <a
                  href="tel:+441992572142"
                  className="text-[#2d4a4a] font-semibold hover:text-[#c9a55c] transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call us on +44 1992 572142
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="teal-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <img src="/logo.png" alt="The Merry Fiddlers" className="h-16 w-auto mb-4" />
              <p className="text-white/70 text-sm">Country Pub & Restaurant proudly serving Epping & surrounding areas since the 1600s.</p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
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
