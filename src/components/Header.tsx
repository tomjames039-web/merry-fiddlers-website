'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Clock, Menu, X } from 'lucide-react';
import SpecialOfferBanner from './SpecialOfferBanner';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Gift Vouchers', href: '/gift-vouchers' },
  { name: 'Upcoming', href: '/upcoming' },
  { name: 'Getting Here', href: '/getting-here' },
  { name: 'Contact Us', href: '/contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Special Offer Banner */}
      <SpecialOfferBanner />

      {/* Main Header */}
      <header className="teal-gradient sticky top-0 z-50">
        {/* Top bar with contact info */}
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

        {/* Main nav */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="The Merry Fiddlers"
                className="h-14 md:h-16 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white uppercase tracking-[0.12em] elegant-underline"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white uppercase tracking-[0.12em] elegant-underline"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="container mx-auto px-4 pb-6 border-t border-white/10">
            <div className="flex flex-col space-y-1 pt-4">
              {navigation.map((item) => (
                item.external ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg uppercase tracking-[0.12em] transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-lg uppercase tracking-[0.12em] transition-colors"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* Mobile Contact Info */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <a href="tel:+441992572142" className="flex items-center gap-3 px-4 py-2 text-white/80 hover:text-white">
                <Phone className="w-5 h-5 text-[#c9a55c]" />
                <span>+44 1992 572142</span>
              </a>
              <div className="flex items-center gap-3 px-4 py-2 text-white/80">
                <Clock className="w-5 h-5 text-[#c9a55c]" />
                <div className="text-sm">
                  <p>Wed-Sat: 12:00-00:00</p>
                  <p>Sun: 12:00-20:00</p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
