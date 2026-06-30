import Link from 'next/link';
import { Phone, Clock, MapPin, Mail, Facebook, Instagram, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import ContactForm from '@/components/ContactForm';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Menus', href: '/menu' },
  { name: 'Book A Table', href: 'https://www.sevenrooms.com/reservations/themerryfiddlers', external: true },
  { name: 'Private Hire & Occasions', href: '/private-hire' },
  { name: 'Upcoming', href: '/upcoming' },
  { name: 'Getting Here', href: '/getting-here' },
  { name: 'Contact Us', href: '/contact' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Page Header */}
      <section className="py-16 bg-[#f8f6f1]">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#2d4a4a]">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#2d4a4a]">Contact Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-[#2d4a4a] mb-4">Contact Us</h1>
          <div className="section-divider" />
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Get in touch with us for reservations, enquiries, or any questions.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl text-[#2d4a4a] mb-6">Send Us a Message</h2>
              <ContactForm withEnquiryType source="contact-page" />
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl text-[#2d4a4a] mb-6">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#2d4a4a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d4a4a] mb-1">Address</h4>
                    <p className="text-gray-600">4 Fiddlers Hamlet, Epping CM16 7PY, United Kingdom</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#2d4a4a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d4a4a] mb-1">Phone</h4>
                    <a href="tel:+441992572142" className="text-gray-600 hover:text-[#2d4a4a]">+44 1992 572142</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#2d4a4a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d4a4a] mb-1">Email</h4>
                    <a href="mailto:info@themerryfiddlers.co.uk" className="text-gray-600 hover:text-[#2d4a4a]">info@themerryfiddlers.co.uk</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#f8f6f1] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#2d4a4a]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#2d4a4a] mb-1">Opening Hours</h4>
                    <p className="text-gray-600">Mon-Tue: Closed</p>
                    <p className="text-gray-600">Wed-Sat: 12:00 - 00:00</p>
                    <p className="text-gray-600">Sun: 12:00 - 20:00</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="font-semibold text-[#2d4a4a] mb-4">Follow Us</h4>
                <div className="flex gap-4">
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
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-gray-200">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2471.8607566839!2d0.0834!3d51.7153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a1234567890!2sThe%20Merry%20Fiddlers!5e0!3m2!1sen!2suk!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="The Merry Fiddlers Location"
        />
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
