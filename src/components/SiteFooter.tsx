import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Christmas 2026', href: '/christmas' },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: "What's On", href: '/upcoming' },
  { name: 'Journal', href: '/blog' },
  { name: 'Getting Here', href: '/getting-here' },
  { name: 'Contact Us', href: '/contact' },
];

const festiveLinks = [
  { name: 'Christmas Day Lunch', href: '/christmas/christmas-day' },
  { name: 'Christmas Parties in Epping', href: '/christmas/christmas-parties' },
  { name: 'Christmas Eve', href: '/christmas/christmas-eve' },
  { name: 'Boxing Day', href: '/christmas/boxing-day' },
  { name: "New Year's Eve", href: '/christmas/new-years-eve' },
  { name: "New Year's Day", href: '/christmas/new-years-day' },
];

export default function SiteFooter() {
  return (
    <footer className="teal-gradient text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src="/logo.png" alt="The Merry Fiddlers" className="h-16 w-auto mb-4" />
            <p className="text-white/70 text-sm">Country Pub &amp; Restaurant proudly serving Epping &amp; surrounding areas since the 1600s.</p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.facebook.com/themerryfiddlerspub/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="The Merry Fiddlers on Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/themerryfiddlers/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center" aria-label="The Merry Fiddlers on Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6 space-y-2 text-sm">
              <p className="flex items-start gap-3 text-white/70">
                <Phone className="w-4 h-4 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                <a href="tel:+441992572142" className="hover:text-white">+44 1992 572142</a>
              </p>
              <p className="flex items-start gap-3 text-white/70">
                <Mail className="w-4 h-4 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                <a href="mailto:info@themerryfiddlers.co.uk" className="hover:text-white">info@themerryfiddlers.co.uk</a>
              </p>
              <p className="flex items-start gap-3 text-white/70">
                <MapPin className="w-4 h-4 text-[#c9a55c] flex-shrink-0 mt-0.5" />
                <span>4 Fiddlers Hamlet, Epping CM16 7PY</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-6 uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
              <Clock className="w-5 h-5 text-[#c9a55c]" />
              Opening Hours
            </h2>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex justify-between"><span>Monday - Tuesday</span><span className="text-red-400">Closed</span></li>
              <li className="flex justify-between"><span>Wednesday - Saturday</span><span className="text-white">12:00 - 00:00</span></li>
              <li className="flex justify-between"><span>Sunday</span><span className="text-white">12:00 - 20:00</span></li>
            </ul>
            <p className="text-white/50 text-xs mt-4 leading-relaxed">
              Festive opening times differ — see{' '}
              <Link href="/christmas" className="text-[#c9a55c] hover:underline">
                Christmas 2026
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Christmas 2026</h2>
            <ul className="space-y-2 text-sm">
              {festiveLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-white/70 hover:text-white">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-6 uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>Quick Links</h2>
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
  );
}
