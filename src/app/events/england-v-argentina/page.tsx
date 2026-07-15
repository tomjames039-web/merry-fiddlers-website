'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Clock, MapPin, Ticket, Music2, Trophy, UtensilsCrossed,
  Wine, Users, ShieldCheck, Loader2, AlertCircle, Check, Accessibility,
  MessageSquare, CreditCard, Calendar, Sparkles, RefreshCw,
} from 'lucide-react';
import Header from '@/components/Header';
import SiteFooter from '@/components/SiteFooter';
import StripeCheckout from '@/components/StripeCheckout';
import type { TicketEvent, SalesStatus } from '@/lib/tickets';

interface EventResponse {
  event: TicketEvent;
  availability: { allocation: number; sold: number; held: number; remaining: number };
  status: SalesStatus;
}

const NOTES_LIMIT = 500;

// Master switch — the event is completely sold out. This forces the sold-out
// state instantly (independent of the API) and disables all purchasing.
// Set back to false to re-enable ticket sales.
const SOLD_OUT = true;

const highlights = [
  { icon: Music2, text: 'DJ from 6:30pm' },
  { icon: Trophy, text: 'Kick-off at 8:00pm' },
  { icon: Music2, text: 'DJ after the match until ~11:00–11:30pm' },
  { icon: UtensilsCrossed, text: 'Food available · last orders 9:30pm' },
  { icon: Wine, text: 'Full bar all evening' },
  { icon: Ticket, text: '£15 per person · advance ticket required' },
];

export default function EnglandArgentinaPage() {
  const [data, setData] = useState<EventResponse | null>(null);
  // Distinguish loading vs a genuine API failure vs ready — never silently
  // present "Coming Soon" when the underlying request actually failed.
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const [quantity, setQuantity] = useState(2);
  const [purchaser, setPurchaser] = useState({ name: '', email: '', phone: '' });
  const [attendees, setAttendees] = useState<string[]>(['', '']);
  const [area, setArea] = useState('no-preference');
  const [accessibility, setAccessibility] = useState('');
  const [notes, setNotes] = useState('');
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const loadEvent = useCallback(async () => {
    setLoadState('loading');
    try {
      const res = await fetch('/api/events', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = (await res.json()) as EventResponse;
      if (!d?.event) throw new Error('malformed');
      setData(d);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  const event = data?.event;
  const remaining = data?.availability.remaining ?? 0;
  const status = data?.status;
  const maxPer = event?.maxPerOrder ?? 20;
  const maxSelectable = Math.max(1, Math.min(maxPer, remaining || maxPer));
  const price = (event?.pricePence ?? 1500) / 100;
  const total = price * quantity;

  // Keep the attendee-name fields matched to the ticket count.
  useEffect(() => {
    setAttendees((prev) => {
      const next = prev.slice(0, quantity);
      while (next.length < quantity) next.push('');
      return next;
    });
  }, [quantity]);

  // Never let the stepper exceed what's actually available.
  useEffect(() => {
    if (quantity > maxSelectable) setQuantity(maxSelectable);
  }, [maxSelectable, quantity]);

  const bookable = !SOLD_OUT && loadState === 'ready' && status === 'on-sale' && remaining > 0;

  const emailValid = /.+@.+\..+/.test(purchaser.email.trim());
  const attendeesValid =
    attendees.length === quantity && attendees.every((a) => a.trim().length > 0);
  const purchaserValid =
    purchaser.name.trim() && emailValid && purchaser.phone.trim();
  const formValid = Boolean(
    purchaserValid && attendeesValid && acceptedRules && bookable
  );

  const setAttendee = (i: number, v: string) =>
    setAttendees((prev) => prev.map((a, idx) => (idx === i ? v : a)));

  const payload = useMemo(
    () => ({
      eventId: event?.id,
      quantity,
      purchaserName: purchaser.name.trim(),
      purchaserEmail: purchaser.email.trim(),
      purchaserPhone: purchaser.phone.trim(),
      attendees: attendees.map((a) => a.trim()),
      viewingArea: area,
      accessibilityNote: accessibility.trim(),
      bookingNotes: notes.trim(),
      acceptedRules,
    }),
    [event?.id, quantity, purchaser, attendees, area, accessibility, notes, acceptedRules]
  );

  const handlePay = () => {
    setAttempted(true);
    if (!formValid) {
      document
        .getElementById('ticket-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setShowCheckout(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea]">
      {SOLD_OUT && (
        <div className="sticky top-0 z-[60] bg-red-600 text-white text-center px-3 py-2.5 font-bold text-sm sm:text-base leading-snug shadow-lg">
          TONIGHT IS COMPLETELY SOLD OUT — NO TICKET, NO ENTRY — PLEASE DO NOT TRAVEL WITHOUT A VALID TICKET
        </div>
      )}
      <Header />

      <main>
        {/* ---------------- Hero ---------------- */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 text-white overflow-hidden">
          <img
            src="/big-screen-garden.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 35%' }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#12292a]/92 via-[#14312f]/80 to-[#12292a]/95" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{
              background:
                'radial-gradient(42rem 26rem at 82% -8%, rgba(201,165,92,0.22), transparent 60%), radial-gradient(38rem 22rem at 0% 112%, rgba(201,165,92,0.14), transparent 60%)',
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <nav className="flex items-center justify-center gap-2 text-sm text-white/60 mb-7">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/upcoming" className="hover:text-white transition-colors">What&apos;s On</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#c9a55c]">England v Argentina</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-[#c9a55c] text-[#12292a] px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.18em] mb-6">
                <Sparkles className="w-4 h-4" />
                LIVE ON THE BIG SCREEN
              </div>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-5"
                style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 22px rgba(0,0,0,0.55)' }}
              >
                England <span className="text-[#c9a55c]">v</span> Argentina
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
                Wednesday 15 July · Kick-off 8pm. Watch every moment on our
                enormous four-metre outdoor LED screen, with the DJ above the
                screen and a full match-day atmosphere in the garden.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-9">
                <HeroStat icon={Calendar} label="Wed 15 July 2026" />
                <HeroStat icon={Clock} label="Kick-off 8:00pm" />
                {!SOLD_OUT && <HeroStat icon={Ticket} label="£15 per person" />}
              </div>

              {SOLD_OUT ? (
                <div className="mt-2">
                  <p
                    className="text-4xl sm:text-5xl md:text-7xl font-black text-red-400 leading-none"
                    style={{ fontFamily: "'Cinzel', serif", textShadow: '0 2px 18px rgba(0,0,0,0.7)' }}
                  >
                    COMPLETELY SOLD OUT
                  </p>
                  <p
                    className="text-2xl sm:text-3xl md:text-5xl font-black text-white mt-3 tracking-wide"
                    style={{ textShadow: '0 2px 14px rgba(0,0,0,0.7)' }}
                  >
                    NO TICKET — NO ENTRY
                  </p>
                  <p className="mt-5 text-base md:text-lg text-white/90 max-w-xl mx-auto">
                    Please do not travel to the venue without a valid ticket.
                  </p>
                </div>
              ) : loadState === 'loading' ? (
                <div className="inline-flex items-center gap-2 text-white/70">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading tickets…
                </div>
              ) : loadState === 'error' ? (
                <button
                  type="button"
                  onClick={loadEvent}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/25 hover:bg-white/20 rounded-full text-base font-medium transition-colors"
                >
                  <RefreshCw className="w-5 h-5 text-[#c9a55c]" /> Couldn&apos;t load tickets — tap to retry
                </button>
              ) : bookable ? (
                <a
                  href="#ticket-form"
                  className="inline-flex items-center gap-2 px-10 py-5 bg-[#c9a55c] hover:bg-[#b8944b] text-[#12292a] rounded-full text-lg font-semibold transition-all hover:scale-[1.03] shadow-xl"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <Ticket className="w-6 h-6" /> Buy Tickets — £15
                </a>
              ) : (
                <SoldOutBadge status={status ?? 'coming-soon'} />
              )}

              {bookable && remaining <= 15 && (
                <p className="mt-4 text-sm text-[#f0d9a8]">
                  Selling fast — only {remaining} ticket{remaining === 1 ? '' : 's'} left.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- The night ---------------- */}
        {!SOLD_OUT && (
        <section className="py-16 lg:py-20 bg-[#12292a] text-white relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{ background: 'radial-gradient(34rem 20rem at 100% 0%, rgba(201,165,92,0.16), transparent 60%)' }}
          />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center mb-10">
              <SectionEyebrow>The Big Night</SectionEyebrow>
              <h2 className="text-3xl md:text-4xl mt-4" style={{ fontFamily: "'Cinzel', serif" }}>
                A Proper Match-Day in the Garden
              </h2>
              <p className="text-white/75 mt-4">
                England take on Argentina this Wednesday at 8pm. Bring the crew,
                grab a cold one and roar them on under the open sky.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {highlights.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4"
                >
                  <span className="w-10 h-10 rounded-lg bg-[#c9a55c]/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#c9a55c]" />
                  </span>
                  <span className="text-white/90 text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ---------------- Viewing areas ---------------- */}
        {!SOLD_OUT && (
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-10">
              <SectionEyebrow dark>Choose Your Spot</SectionEyebrow>
              <h2 className="text-3xl md:text-4xl text-[#12292a] mt-4" style={{ fontFamily: "'Cinzel', serif" }}>
                Three Ways to Watch
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <AreaCard title="Garden" tag="Main event" desc="The heart of the action around our four-metre outdoor LED screen." />
              <AreaCard title="Patio" tag="Booths" desc="Three cosy booths, each with its own television in front." />
              <AreaCard title="Bar" tag="Indoors" desc="Comfortable indoor viewing on our 50-inch and 42-inch screens." />
            </div>
            <div className="max-w-3xl mx-auto mt-8 flex items-start gap-3 rounded-xl bg-[#fff8e8] border border-[#e8c877] p-5 text-sm text-[#6a5220]">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#b8944b]" />
              <p>
                Viewing-area requests are not guaranteed and seating will be
                allocated to make the best use of available space. Groups may
                share larger seating areas where appropriate. The standard £15
                ticket does not guarantee exclusive use of a complete bench,
                booth or table.
              </p>
            </div>
          </div>
        </section>
        )}

        {/* ---------------- Purchase form / sold out ---------------- */}
        <section id="ticket-form" className="pt-16 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {SOLD_OUT ? (
                <div className="bg-white rounded-2xl shadow-2xl border-4 border-red-600 overflow-hidden">
                  <div className="bg-red-600 text-white text-center px-6 py-8">
                    <p className="text-4xl md:text-6xl font-black leading-none" style={{ fontFamily: "'Cinzel', serif" }}>
                      COMPLETELY SOLD OUT
                    </p>
                    <p className="text-2xl md:text-4xl font-black mt-3 tracking-wide">NO TICKET — NO ENTRY</p>
                  </div>
                  <div className="p-6 md:p-8 text-center space-y-4 text-gray-700 text-base md:text-lg">
                    <p>Tonight&apos;s England v Argentina event is now completely sold out.</p>
                    <p>
                      Please do not travel to the venue without a valid ticket. There will be no
                      tickets available on the door, no additional spaces released and no entry for
                      unticketed guests.
                    </p>
                    <p>Our team cannot take further ticket requests or add names to a waiting list.</p>
                    <p className="font-bold text-[#12292a] text-lg md:text-xl">
                      Anyone arriving without a valid ticket will be refused entry.
                    </p>
                    <p>Thank you for understanding.</p>
                  </div>
                </div>
              ) : loadState === 'loading' ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
                  <Loader2 className="w-8 h-8 animate-spin text-[#c9a55c] mx-auto" />
                  <p className="mt-3 text-gray-500">Loading ticket availability…</p>
                </div>
              ) : loadState === 'error' ? (
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-red-100">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h2 className="text-2xl text-[#12292a] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                    We couldn&apos;t load ticket availability
                  </h2>
                  <p className="text-gray-600 mb-6">
                    This is usually a brief connection hiccup. Please tap retry — nothing you entered is lost.
                  </p>
                  <button
                    type="button"
                    onClick={loadEvent}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" /> Retry
                  </button>
                  <p className="mt-6 text-xs text-gray-400">
                    Administrators: the ticket API (<code>/api/events</code>) isn&apos;t responding. Check the Event
                    Tickets dashboard and the Netlify deployment logs.
                  </p>
                </div>
              ) : !bookable ? (
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-[#12292a] flex items-center justify-center mx-auto mb-5">
                    <Ticket className="w-8 h-8 text-[#c9a55c]" />
                  </div>
                  <h2 className="text-2xl text-[#12292a] mb-3" style={{ fontFamily: "'Cinzel', serif" }}>
                    {status === 'sold-out' ? 'Sold Out' : status === 'paused' ? 'Sales Paused' : 'Tickets Coming Soon'}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {status === 'sold-out'
                      ? 'Every ticket for England v Argentina has been snapped up. Thank you!'
                      : status === 'paused'
                        ? 'Ticket sales are paused for the moment. Please check back shortly.'
                        : 'Tickets for this event are not on sale just yet — check back soon.'}
                  </p>
                  <Link
                    href="/upcoming"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#12292a] text-[#12292a] hover:bg-[#12292a] hover:text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    See What&apos;s On <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-[#12292a] text-white px-7 py-5 flex items-center gap-3">
                    <Ticket className="w-6 h-6 text-[#c9a55c]" />
                    <div>
                      <h2 className="text-xl" style={{ fontFamily: "'Cinzel', serif" }}>Book Your Tickets</h2>
                      <p className="text-white/60 text-sm">£15 per person · up to {maxPer} per booking</p>
                    </div>
                  </div>

                  <div className="p-7 space-y-7">
                    {/* Quantity */}
                    <div>
                      <FieldLabel icon={Users}>Number of tickets</FieldLabel>
                      <div className="flex items-center gap-5">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-12 h-12 rounded-full border-2 border-[#12292a] text-[#12292a] hover:bg-[#12292a] hover:text-white transition-colors text-xl font-bold disabled:opacity-30"
                          disabled={quantity <= 1}
                          aria-label="Fewer tickets"
                        >
                          −
                        </button>
                        <div className="text-center min-w-[3.5rem]">
                          <span className="text-4xl font-bold text-[#12292a]">{quantity}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.min(maxSelectable, q + 1))}
                          className="w-12 h-12 rounded-full border-2 border-[#12292a] text-[#12292a] hover:bg-[#12292a] hover:text-white transition-colors text-xl font-bold disabled:opacity-30"
                          disabled={quantity >= maxSelectable}
                          aria-label="More tickets"
                        >
                          +
                        </button>
                        <div className="ml-auto text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-2xl font-bold text-[#c9a55c]">£{total.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Children need their own full-price ticket. Maximum {maxPer} tickets per booking.
                      </p>
                    </div>

                    {/* Lead purchaser */}
                    <div className="space-y-3">
                      <FieldLabel icon={ShieldCheck}>Lead booker</FieldLabel>
                      <input
                        value={purchaser.name}
                        onChange={(e) => setPurchaser({ ...purchaser, name: e.target.value })}
                        placeholder="Full name"
                        className={inputCls(attempted && !purchaser.name.trim())}
                      />
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input
                          type="email"
                          value={purchaser.email}
                          onChange={(e) => setPurchaser({ ...purchaser, email: e.target.value })}
                          placeholder="Email address"
                          className={inputCls(attempted && !emailValid)}
                        />
                        <input
                          type="tel"
                          value={purchaser.phone}
                          onChange={(e) => setPurchaser({ ...purchaser, phone: e.target.value })}
                          placeholder="Mobile number"
                          className={inputCls(attempted && !purchaser.phone.trim())}
                        />
                      </div>
                    </div>

                    {/* Attendees */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FieldLabel icon={Users}>Who&apos;s attending?</FieldLabel>
                        <span className="text-xs text-gray-400">Every ticket needs a name</span>
                      </div>
                      {attendees.map((name, i) => (
                        <div key={i} className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                            {i + 1}
                          </span>
                          <input
                            value={name}
                            onChange={(e) => setAttendee(i, e.target.value)}
                            placeholder={`Attendee ${i + 1} full name`}
                            className={`${inputCls(attempted && !name.trim())} pl-8`}
                          />
                          {i === 0 && purchaser.name.trim() && !name.trim() && (
                            <button
                              type="button"
                              onClick={() => setAttendee(0, purchaser.name.trim())}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#c9a55c] hover:underline"
                            >
                              Use my name
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Viewing area */}
                    <div>
                      <FieldLabel icon={MapPin}>Preferred viewing area</FieldLabel>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(event?.viewingAreas ?? []).map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => setArea(a.id)}
                            className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                              area === a.id
                                ? 'border-[#c9a55c] bg-[#c9a55c]/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span className="flex items-center gap-2 font-medium text-[#12292a] text-sm">
                              {area === a.id && <Check className="w-4 h-4 text-[#c9a55c]" />}
                              {a.label}
                            </span>
                            {a.hint && <span className="block text-xs text-gray-400 mt-0.5">{a.hint}</span>}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Requests are not guaranteed — seating is allocated by the venue.
                      </p>
                    </div>

                    {/* Accessibility */}
                    <div>
                      <FieldLabel icon={Accessibility}>Accessibility note <span className="font-normal text-gray-400">— optional</span></FieldLabel>
                      <input
                        value={accessibility}
                        onChange={(e) => setAccessibility(e.target.value.slice(0, NOTES_LIMIT))}
                        placeholder="Let us know if anyone needs step-free access, etc."
                        className={inputCls(false)}
                      />
                    </div>

                    {/* Booking notes */}
                    <div>
                      <FieldLabel icon={MessageSquare}>Booking notes <span className="font-normal text-gray-400">— optional</span></FieldLabel>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value.slice(0, NOTES_LIMIT))}
                        rows={3}
                        placeholder="Seating requests, who you'd like to sit near, anything else we should know…"
                        className={`${inputCls(false)} resize-none`}
                      />
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-400">Requests are not guaranteed.</p>
                        <p className="text-xs text-gray-400">{notes.length}/{NOTES_LIMIT}</p>
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-[#f4f1ea] px-4 py-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#c9a55c]" />
                        <span className="text-sm font-semibold text-[#12292a]">Event rules</span>
                      </div>
                      <ul className="p-4 space-y-2 text-sm text-gray-600">
                        {(event?.rules ?? []).map((r) => (
                          <li key={r} className="flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c9a55c] flex-shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                      <label
                        className={`flex items-start gap-3 px-4 py-3.5 border-t cursor-pointer transition-colors ${
                          attempted && !acceptedRules ? 'bg-red-50 border-red-200' : 'border-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={acceptedRules}
                          onChange={(e) => setAcceptedRules(e.target.checked)}
                          className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#c9a55c] focus:ring-[#c9a55c]"
                        />
                        <span className="text-sm text-[#12292a] font-medium">
                          I have read and accept the event rules, including the no
                          outside food or drink policy and that tickets are
                          non-refundable.
                        </span>
                      </label>
                    </div>

                    {attempted && !formValid && (
                      <p className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        Please complete every attendee name and accept the rules to continue.
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={handlePay}
                      className="w-full py-4 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg transition-colors uppercase tracking-wider font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      <CreditCard className="w-5 h-5" /> Pay £{total.toFixed(2)}
                    </button>
                    <p className="text-center text-xs text-gray-400">
                      Secure card payment powered by Stripe. You won&apos;t leave this page.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {!SOLD_OUT && showCheckout && event && (
        <StripeCheckout
          title={`England v Argentina · £${total.toFixed(2)}`}
          endpoint="/api/tickets/checkout"
          payload={payload}
          onClose={() => setShowCheckout(false)}
        />
      )}

      <SiteFooter />
    </div>
  );
}

// ---------------- Sub-components ----------------

function inputCls(error: boolean): string {
  return `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent transition ${
    error ? 'border-red-300 bg-red-50' : 'border-gray-300'
  }`;
}

function HeroStat({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 backdrop-blur px-4 py-2 text-sm font-medium">
      <Icon className="w-4 h-4 text-[#c9a55c]" /> {label}
    </span>
  );
}

function SoldOutBadge({ status }: { status: SalesStatus }) {
  const label =
    status === 'sold-out' ? 'Sold Out' : status === 'paused' ? 'Sales Paused' : 'Coming Soon';
  return (
    <div className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/25 rounded-full text-lg font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
      <Ticket className="w-5 h-5 text-[#c9a55c]" /> {label}
    </div>
  );
}

function SectionEyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 uppercase tracking-[0.25em] text-xs font-semibold ${dark ? 'text-[#b8944b]' : 'text-[#c9a55c]'}`}>
      <span className={`h-px w-8 ${dark ? 'bg-[#b8944b]/50' : 'bg-[#c9a55c]/60'}`} /> {children}
      <span className={`h-px w-8 ${dark ? 'bg-[#b8944b]/50' : 'bg-[#c9a55c]/60'}`} />
    </span>
  );
}

function AreaCard({ title, tag, desc }: { title: string; tag: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-[#9c7e3f] bg-[#c9a55c]/15 px-2.5 py-1 rounded-full mb-3">
        {tag}
      </span>
      <h3 className="text-xl text-[#12292a] mb-2" style={{ fontFamily: "'Cinzel', serif" }}>{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function FieldLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-sm font-semibold text-[#12292a] mb-2.5">
      <Icon className="w-4 h-4 text-[#c9a55c]" /> {children}
    </span>
  );
}
