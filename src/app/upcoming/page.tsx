'use client';

import Link from 'next/link';
import {
  Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight,
  Music, Wine, Coffee, Beef, HelpCircle, Flame, CalendarDays, Utensils,
} from 'lucide-react';
import Header from '@/components/Header';
import SocialFeed from '@/components/SocialFeed';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: "What's On", href: '/upcoming' },
  { name: 'Contact Us', href: '/contact' },
];

const BOOK_URL = 'https://www.sevenrooms.com/reservations/themerryfiddlers';

interface FeatureEvent {
  title: string;
  day: string;
  month: string;
  weekday: string;
  time: string;
  description: string;
  icon: React.ElementType;
  tag: string;
}

const featured: FeatureEvent[] = [
  {
    title: 'Pub Quiz Night',
    day: '24',
    month: 'Jun',
    weekday: 'Wednesday',
    time: '7:30 PM',
    description:
      'Gather your team for our legendary quiz night. £2 per person, cash prizes for the winners and a free round of drinks for the runners-up.',
    icon: HelpCircle,
    tag: 'Quiz',
  },
  {
    title: 'Live Acoustic Sessions',
    day: '26',
    month: 'Jun',
    weekday: 'Friday',
    time: '8:00 PM',
    description:
      'Unwind to live acoustic music from talented local artists in our cosy bar. Great drinks, great atmosphere, no ticket needed.',
    icon: Music,
    tag: 'Live Music',
  },
  {
    title: 'Summer BBQ Weekend',
    day: '11',
    month: 'Jul',
    weekday: 'Sat & Sun',
    time: 'From 12:00 PM',
    description:
      'Our garden BBQ returns for the summer. Flame-grilled steaks, burgers, and seafood served in the sunshine with ice-cold drinks.',
    icon: Flame,
    tag: 'Seasonal',
  },
  {
    title: 'Wine & Dine Tasting Evening',
    day: '16',
    month: 'Jul',
    weekday: 'Thursday',
    time: '7:00 PM',
    description:
      'A five-course tasting menu paired with hand-selected wines, hosted by our head chef. Limited covers — booking essential.',
    icon: Wine,
    tag: 'Dining',
  },
];

interface RegularEvent {
  title: string;
  when: string;
  description: string;
  icon: React.ElementType;
}

const weekly: RegularEvent[] = [
  {
    title: 'Sunday Roast',
    when: 'Every Sunday · 12:00 – 6:00 PM',
    description: 'Our famous traditional roast with all the trimmings. Booking recommended.',
    icon: Utensils,
  },
  {
    title: 'Afternoon Tea',
    when: 'Wednesday – Saturday · 12:00 – 4:00 PM',
    description: 'Finger sandwiches, fresh scones and cakes with tea or fizz. Bookings by email only.',
    icon: Coffee,
  },
  {
    title: 'Steak Night',
    when: 'Every Thursday · From 5:00 PM',
    description: 'Two premium steaks and a bottle of house wine for a special midweek price.',
    icon: Beef,
  },
  {
    title: 'Weekend Live Music',
    when: 'Selected Fridays & Saturdays · From 8:00 PM',
    description: 'Live bands and soloists through the season — follow us for the line-up.',
    icon: Music,
  },
];

const tagColors: Record<string, string> = {
  Quiz: 'bg-emerald-100 text-emerald-700',
  'Live Music': 'bg-purple-100 text-purple-700',
  Seasonal: 'bg-orange-100 text-orange-700',
  Dining: 'bg-[#c9a55c]/20 text-[#9c7e3f]',
};

export default function WhatsOnPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-[#2d4a4a] via-[#3a5656] to-[#2d4a4a] text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c9a55c]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#c9a55c]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-6">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">What's On</span>
            </nav>
            <div className="inline-flex items-center gap-2 bg-[#c9a55c] text-white px-4 py-2 rounded-full text-sm font-bold mb-6">
              <CalendarDays className="w-4 h-4" />
              EVENTS & HAPPENINGS
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6" style={{ fontFamily: "'Cinzel', serif" }}>
              What's <span className="text-[#c9a55c]">On</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              From quiz nights and live music to seasonal feasts — there's always
              something happening at The Merry Fiddlers.
            </p>
          </div>
        </section>

        {/* Featured events */}
        <section className="py-16 lg:py-20 bg-[#f8f6f1]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Upcoming Events
              </h2>
              <div className="w-16 h-1 bg-[#c9a55c] mx-auto" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {featured.map((ev) => {
                const Icon = ev.icon;
                return (
                  <div
                    key={ev.title}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex"
                  >
                    {/* Date badge */}
                    <div className="bg-[#2d4a4a] text-white flex flex-col items-center justify-center px-6 py-8 min-w-[110px]">
                      <span className="text-4xl font-bold" style={{ fontFamily: "'Cinzel', serif" }}>{ev.day}</span>
                      <span className="uppercase tracking-wider text-[#c9a55c] text-sm">{ev.month}</span>
                      <span className="text-xs text-white/60 mt-1 text-center">{ev.weekday}</span>
                    </div>
                    {/* Content */}
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${tagColors[ev.tag] || 'bg-gray-100 text-gray-600'}`}>
                          {ev.tag}
                        </span>
                        <Icon className="w-5 h-5 text-[#c9a55c]" />
                      </div>
                      <h3 className="text-xl text-[#2d4a4a] mb-1" style={{ fontFamily: "'Cinzel', serif" }}>
                        {ev.title}
                      </h3>
                      <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                        <Clock className="w-4 h-4" /> {ev.time}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{ev.description}</p>
                      <a
                        href={BOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-[#c9a55c] hover:text-[#b8944b]"
                      >
                        Book a table <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Weekly regulars */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-[#2d4a4a] mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Every Week at The Fiddlers
              </h2>
              <div className="w-16 h-1 bg-[#c9a55c] mx-auto" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {weekly.map((ev) => {
                const Icon = ev.icon;
                return (
                  <div key={ev.title} className="text-center p-6 rounded-2xl bg-[#f8f6f1] hover:bg-[#c9a55c]/5 transition-colors border border-transparent hover:border-[#c9a55c]/30">
                    <div className="w-14 h-14 rounded-full bg-[#2d4a4a] flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-[#c9a55c]" />
                    </div>
                    <h3 className="text-lg text-[#2d4a4a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>{ev.title}</h3>
                    <p className="text-xs uppercase tracking-wide text-[#c9a55c] mb-3">{ev.when}</p>
                    <p className="text-sm text-gray-600">{ev.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-[#2d4a4a] to-[#1d3a3a] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
              Don't Miss Out
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Tables fill up fast for our events. Reserve yours now and we'll have a
              warm welcome waiting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Book A Table
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white/30 hover:bg-white/10 text-white rounded-lg transition-colors uppercase tracking-wider text-sm font-medium"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Enquire About Events
              </Link>
            </div>
          </div>
        </section>

        {/* Social feed */}
        <SocialFeed />
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
