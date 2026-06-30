'use client';

import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, FileText, CalendarCheck, Star } from 'lucide-react';
import Header from '@/components/Header';
import SocialFeed from '@/components/SocialFeed';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: "What's On", href: '/upcoming' },
  { name: 'Journal', href: '/blog' },
  { name: 'Getting Here', href: '/getting-here' },
  { name: 'Contact Us', href: '/contact' },
];

const testimonials = [
  { name: 'Susan Poulton', text: 'Come here for Mother\'s Day and the whole experience was amazing! The food was unbelievable, service was perfect. Cannot wait to come back - thank you so much!' },
  { name: 'Damien Walters', text: 'Lovely pub with welcoming staff. Great salt beef sandwich and chips. Best Sunday roast ever. Excellent value at £10' },
  { name: 'Mike Marsh', text: 'Amazing place with very good food and very friendly and helpful staff. I had the mixed roast which was massive and really tasty.' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="/pub-flowers.jpeg"
            alt="The Merry Fiddlers pub exterior with hanging baskets"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {/* Large centered logo */}
          <img
            src="/logo.png"
            alt="The Merry Fiddlers - Country Pub & Restaurant - Fiddlers Hamlet"
            className="h-28 md:h-36 lg:h-40 w-auto mx-auto mb-6"
          />
          <p
            className="text-base md:text-lg mb-8 text-white/90 uppercase tracking-[0.2em]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Proudly Serving Epping Since The 1600s
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/download-brochure"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#2d4a4a] transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <FileText className="w-5 h-5" />
              Download Event Brochure
            </Link>
            <a
              href="https://www.sevenrooms.com/reservations/themerryfiddlers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <CalendarCheck className="w-5 h-5" />
              Book A Table
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl text-[#2d4a4a] mb-4">
            About The Merry Fiddlers
          </h2>
          <div className="section-divider" />
          <p className="text-lg text-gray-600 leading-relaxed mt-8 mb-6">
            <span className="font-semibold text-[#2d4a4a]">At The Merry Fiddlers we offer meals of excellent quality</span>{' '}
            <em className="text-[#c9a55c]">and</em> invite you to try our delicious food.
          </p>
          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            The key to our success is simple: providing quality, consistent food that tastes great every single time.
            We pride ourselves on serving the finest dishes in Epping. Using classic French and English techniques
            with a modern twist. We serve à la carte menu Wednesday – Saturday and are sure we can WOW even the
            finest of pallets. Always stock a vast array of drinks from real ales to cocktails, fresh Coffee & more.
            We boast Epping&apos;s largest beer garden and have a great space for the kids to play. Muddy boots and
            dogs are welcome in our bar area. Eat delicious food. Grab a drink. But most of all, relax!
          </p>
          <Link
            href="/download-brochure"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white transition-all uppercase tracking-wider text-sm font-medium"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            <FileText className="w-5 h-5" />
            Download Event Brochure
          </Link>
        </div>
      </section>

      {/* Food Gallery */}
      <section>
        <div className="grid grid-cols-3">
          <div className="aspect-square overflow-hidden">
            <img src="/food-1.jpeg" alt="Delicious roast" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square overflow-hidden">
            <img src="/food-2.jpeg" alt="Gourmet dish" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="aspect-square overflow-hidden">
            <img src="/food-3.jpeg" alt="Afternoon tea" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Events & Private Hire */}
      <section className="py-20 bg-[#f8f6f1]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl text-[#2d4a4a] mb-4">
            Events & Private Hire
          </h2>
          <div className="section-divider" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/download-brochure"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              <FileText className="w-5 h-5" />
              Download Event Brochure
            </Link>
            <Link
              href="/private-hire"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-all uppercase tracking-wider text-sm font-medium"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Book & Menu Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Book a Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden card-hover">
              <div className="h-64 overflow-hidden">
                <img src="/dome.jpeg" alt="Dining experience" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl text-[#2d4a4a] mb-4">Book A Table</h3>
                <p className="text-gray-600 mb-6">Reserve your table for an unforgettable dining experience.</p>
                <a
                  href="https://www.sevenrooms.com/reservations/themerryfiddlers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <CalendarCheck className="w-5 h-5" />
                  Book A Table
                </a>
              </div>
            </div>

            {/* View Menus */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden card-hover">
              <div className="h-64 overflow-hidden">
                <img src="/food-2.jpeg" alt="Our menu" className="w-full h-full object-cover" />
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl text-[#2d4a4a] mb-4">View Menus</h3>
                <p className="text-gray-600 mb-6">Explore our selection of menus and daily specials.</p>
                <Link
                  href="/menu"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#c9a55c] hover:bg-[#b8944b] text-white transition-all uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  View Menus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 teal-gradient text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl text-center mb-4">
            What Our Customers Say
          </h2>
          <div className="section-divider" />
          <p className="text-center text-white/80 text-lg mt-6 mb-12 max-w-2xl mx-auto">
            At The Merry Fiddlers we offer meals of excellent quality <em className="text-[#c9a55c]">and</em> invite you to try our delicious food.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#c9a55c] text-[#c9a55c]" />
                  ))}
                </div>
                <p className="text-white/90 italic mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="text-[#c9a55c] font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl text-[#2d4a4a] text-center mb-4">
            Get In Touch
          </h2>
          <div className="section-divider" />
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-12">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Name" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2d4a4a]" />
                <input type="tel" placeholder="Phone" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2d4a4a]" />
              </div>
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2d4a4a]" />
              <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2d4a4a]" />
              <button
                type="submit"
                className="w-full py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white uppercase tracking-wider font-medium transition-all"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Submit
              </button>
            </form>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-[#2d4a4a] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-[#2d4a4a]">Address</h4>
                  <p className="text-gray-600">4 Fiddlers Hamlet, Epping CM16 7PY, United Kingdom</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-[#2d4a4a] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-[#2d4a4a]">Phone</h4>
                  <a href="tel:+441992572142" className="text-gray-600 hover:text-[#2d4a4a]">+44 1992 572142</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-[#2d4a4a] flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-[#2d4a4a]">Email</h4>
                  <a href="mailto:info@themerryfiddlers.co.uk" className="text-gray-600 hover:text-[#2d4a4a]">info@themerryfiddlers.co.uk</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dine at Dome */}
      <section className="py-20 bg-[#f8f6f1]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-4xl md:text-5xl text-[#2d4a4a] mb-6">Dine At Dome</h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                We are happy to announce that we have partnered up with Dine at Dome where from now on
                you can book your unique dining experience. Sit at the comfort of our fairy-lights lit
                domes which are heated up for the occasion by Dyson heaters. Bluetooth speakers are at
                your disposal, too, so you can play your music inside.
              </p>
              <a
                href="https://dineatdome.com/listin/the-merry-fiddlers/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#2d4a4a] text-[#2d4a4a] hover:bg-[#2d4a4a] hover:text-white transition-all uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                See More
              </a>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl aspect-[4/3] bg-black">
              <img src="/hero.webp" alt="Dine at Dome - fairy lights dining experience" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Feed */}
      <SocialFeed />

      {/* Footer */}
      <footer className="teal-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Logo & About */}
            <div>
              <img
                src="/logo.png"
                alt="The Merry Fiddlers"
                className="h-16 w-auto mb-4"
              />
              <p className="text-white/70 text-sm">
                Country Pub & Restaurant proudly serving Epping & surrounding areas since the 1600s.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Opening Hours */}
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

            {/* Contact */}
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

            {/* Quick Links */}
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

      {/* Sticky CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          href="https://www.sevenrooms.com/reservations/themerryfiddlers"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-full shadow-lg transition-all uppercase tracking-wider text-sm font-medium"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          <CalendarCheck className="w-5 h-5" />
          Book A Table
        </a>
      </div>
    </div>
  );
}
