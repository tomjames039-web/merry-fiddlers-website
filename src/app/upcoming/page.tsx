import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight, Calendar } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Upcoming', href: '/upcoming' },
  { name: 'Contact Us', href: '/contact' },
];

const events = [
  {
    title: 'Sunday Roast',
    description: 'Join us every Sunday for our famous traditional roast with all the trimmings.',
    date: 'Every Sunday',
    time: '12:00 - 18:00',
  },
  {
    title: 'Live Music Nights',
    description: 'Enjoy live entertainment while dining in our cosy atmosphere.',
    date: 'Selected Fridays & Saturdays',
    time: 'From 19:00',
  },
  {
    title: 'Afternoon Tea',
    description: 'Treat yourself to our delightful afternoon tea selection. Booking required.',
    date: 'Wednesday - Saturday',
    time: 'By reservation',
  },
];

export default function UpcomingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="teal-gradient sticky top-0 z-50">
        <div className="hidden md:block border-b border-white/10">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href="tel:+441992572142" className="hover:text-white">+44 1992 572142</a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Wed-Sat: 12:00-00:00 | Sun: 12:00-20:00</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="The Merry Fiddlers" className="h-14 md:h-16 w-auto" />
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                item.external ? (
                  <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white uppercase tracking-[0.12em] elegant-underline"
                    style={{ fontFamily: "'Cinzel', serif" }}>
                    {item.name}
                  </a>
                ) : (
                  <Link key={item.name} href={item.href}
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white uppercase tracking-[0.12em] elegant-underline"
                    style={{ fontFamily: "'Cinzel', serif" }}>
                    {item.name}
                  </Link>
                )
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-16 bg-[#f8f6f1]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#2d4a4a]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#2d4a4a]">Upcoming</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-[#2d4a4a] mb-4">What&apos;s On</h1>
          <div className="section-divider" />
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Discover upcoming events and special occasions at The Merry Fiddlers.
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {events.map((event, index) => (
              <div key={index} className="bg-[#f8f6f1] rounded-lg p-8 card-hover">
                <div className="flex items-start gap-6">
                  <div className="bg-[#2d4a4a] text-white p-4 rounded-lg text-center min-w-[80px]">
                    <Calendar className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-xs uppercase tracking-wider">Event</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl text-[#2d4a4a] mb-2">{event.title}</h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-[#c9a55c] font-medium">{event.date}</span>
                      <span className="text-gray-500">{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Follow us on social media for the latest updates and events.</p>
            <div className="flex justify-center gap-4">
              <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-full flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer"
                className="w-12 h-12 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-full flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
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
