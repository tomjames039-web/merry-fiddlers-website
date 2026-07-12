'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock, Loader2, UserCheck, RotateCcw, AlertCircle, Ticket,
  MapPin, MessageSquare, Accessibility, ChevronLeft, Users,
} from 'lucide-react';
import type { TicketBooking, TicketEvent } from '@/lib/tickets';

function fmtDateTime(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function CheckinContent() {
  const params = useSearchParams();
  const urlToken = params.get('token') || '';

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [staffName, setStaffName] = useState('');

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<TicketBooking | null>(null);
  const [event, setEvent] = useState<TicketEvent | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('mf-admin-token');
    if (t) setToken(t);
    const s = localStorage.getItem('mf-staff-name');
    if (s) setStaffName(s);
  }, []);

  const loadBooking = useCallback(
    async (tk: string) => {
      if (!urlToken) {
        setError('This link is missing a booking token.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/tickets?token=${encodeURIComponent(urlToken)}`, {
          headers: { Authorization: `Bearer ${tk}` },
        });
        if (res.status === 401) {
          localStorage.removeItem('mf-admin-token');
          setToken(null);
          return;
        }
        if (res.status === 404) {
          setError('No booking found for this code.');
          setBooking(null);
          return;
        }
        const d = await res.json();
        setBooking(d.booking as TicketBooking);
        setEvent(d.event as TicketEvent);
      } catch {
        setError('Could not load the booking. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [urlToken]
  );

  useEffect(() => {
    if (token) loadBooking(token);
  }, [token, loadBooking]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        localStorage.setItem('mf-admin-token', data.token);
        setToken(data.token);
      } else {
        setLoginError('Incorrect password.');
      }
    } catch {
      setLoginError('Could not sign in. Please try again.');
    }
  };

  const act = async (action: string) => {
    if (!booking || !token) return;
    setBusy(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ref: booking.ref, action, by: staffName }),
      });
      const d = await res.json();
      if (d.booking) setBooking(d.booking as TicketBooking);
    } finally {
      setBusy(false);
    }
  };

  // ---- Not logged in ----
  if (!token) {
    return (
      <div className="min-h-screen bg-[#12292a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#12292a] rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#c9a55c]" />
            </div>
            <h1 className="text-xl font-bold text-[#12292a]" style={{ fontFamily: "'Cinzel', serif" }}>
              Staff Check-in
            </h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to scan guests in.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
              autoFocus
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-[#12292a] hover:bg-[#0d1f20] text-white rounded-lg font-medium transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  const arrived = booking
    ? booking.checkedIn
      ? booking.quantity
      : booking.checkedInCount || 0
    : 0;

  return (
    <div className="min-h-screen bg-[#12292a] py-6 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-5">
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm">
            <ChevronLeft className="w-4 h-4" /> Back office
          </Link>
          <span className="text-[#c9a55c] text-sm font-semibold">Check-in</span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#c9a55c] mx-auto" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <p className="text-[#12292a] font-medium">{error}</p>
            <Link href="/admin" className="inline-block mt-4 text-sm text-[#c9a55c] hover:underline">
              Open the guest list
            </Link>
          </div>
        ) : booking ? (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className={`px-6 py-5 text-white ${booking.checkedIn ? 'bg-green-600' : 'bg-[#12292a]'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-xs uppercase tracking-wider">{event?.name ?? 'England v Argentina'}</p>
                  <p className="text-2xl font-mono font-bold tracking-widest">{booking.ref}</p>
                </div>
                {booking.checkedIn && (
                  <span className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-sm font-semibold">
                    <UserCheck className="w-4 h-4" /> In
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-[#f4f1ea] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#c9a55c]" />
                </span>
                <div>
                  <p className="text-lg font-semibold text-[#12292a]">{booking.purchaserName}</p>
                  <p className="text-sm text-gray-500">
                    {booking.quantity} {booking.quantity === 1 ? 'ticket' : 'tickets'} · £{booking.amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#f4f1ea] p-4">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Attendees {arrived > 0 && !booking.checkedIn ? `· ${arrived}/${booking.quantity} in` : ''}
                </p>
                <ul className="space-y-1.5">
                  {booking.attendees.map((name, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#12292a]">
                      <span className="w-5 h-5 rounded-full bg-white text-xs font-semibold flex items-center justify-center text-gray-500">
                        {i + 1}
                      </span>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#c9a55c]" /> Preferred: {booking.viewingAreaLabel}
              </p>
              {booking.accessibilityNote && (
                <p className="flex items-start gap-2 text-sm text-gray-600">
                  <Accessibility className="w-4 h-4 text-[#c9a55c] mt-0.5" /> {booking.accessibilityNote}
                </p>
              )}
              {booking.bookingNotes && (
                <p className="flex items-start gap-2 text-sm text-gray-600">
                  <MessageSquare className="w-4 h-4 text-[#c9a55c] mt-0.5" /> {booking.bookingNotes}
                </p>
              )}

              {booking.checkedIn ? (
                <>
                  <div className="text-center py-2">
                    <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
                      <UserCheck className="w-5 h-5" /> Party checked in
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {fmtDateTime(booking.checkedInAt)}{booking.checkedInBy ? ` by ${booking.checkedInBy}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => act('undo-check-in')}
                    disabled={busy}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    Undo check-in
                  </button>
                </>
              ) : (
                <button
                  onClick={() => act('check-in')}
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-colors disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserCheck className="w-5 h-5" />}
                  Check in {booking.quantity} {booking.quantity === 1 ? 'guest' : 'guests'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Scan a booking QR code to check a guest in.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#12292a] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#c9a55c]" />
        </div>
      }
    >
      <CheckinContent />
    </Suspense>
  );
}
