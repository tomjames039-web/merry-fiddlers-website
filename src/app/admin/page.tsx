'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Users, Mail, Phone, ChevronLeft, RefreshCw, Download, Search,
  Trash2, X, Send, Save, BarChart3, Ticket, Gift,
  Coffee, CheckCircle2, AlertCircle, LogOut, PoundSterling, Clock,
  ArrowRight, Lock,
} from 'lucide-react';

type LeadStatus = 'new' | 'contacted' | 'booked' | 'lost';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  eventType?: string;
  expectedGuests?: string;
  preferredDate?: string;
  message?: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  createdAt: string;
  lastContactedAt?: string;
}

interface Voucher {
  code: string;
  type: 'gift-voucher' | 'afternoon-tea';
  amount: number;
  status: 'unredeemed' | 'redeemed';
  createdAt: string;
  redeemedAt?: string;
  purchaserName?: string;
  purchaserEmail?: string;
  recipientName?: string;
  recipientEmail?: string;
  giftMessage?: string;
  quantity?: number;
  addProsecco?: boolean;
}

const PIPELINE: { key: LeadStatus; label: string; accent: string; dot: string }[] = [
  { key: 'new', label: 'New Leads', accent: 'border-t-emerald-400', dot: 'bg-emerald-500' },
  { key: 'contacted', label: 'Contacted', accent: 'border-t-amber-400', dot: 'bg-amber-500' },
  { key: 'booked', label: 'Booked', accent: 'border-t-[#c9a55c]', dot: 'bg-[#c9a55c]' },
  { key: 'lost', label: 'Lost', accent: 'border-t-gray-300', dot: 'bg-gray-400' },
];

const sourceLabels: Record<string, string> = {
  'brochure-download': 'Brochure',
  'gift-voucher-purchase': 'Gift Voucher',
  'afternoon-tea-purchase': 'Afternoon Tea',
  contact: 'Contact Form',
  website: 'Website',
};

function fmtDate(d?: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'overview' | 'pipeline' | 'vouchers'>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [search, setSearch] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMsg, setRedeemMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('mf-admin-token');
    if (t) setToken(t);
  }, []);

  const fetchData = useCallback(async (tk: string) => {
    setLoading(true);
    try {
      const [lr, vr] = await Promise.all([
        fetch('/api/leads', { headers: { Authorization: `Bearer ${tk}` } }),
        fetch('/api/vouchers', { headers: { Authorization: `Bearer ${tk}` } }),
      ]);
      if (lr.status === 401 || vr.status === 401) {
        localStorage.removeItem('mf-admin-token');
        setToken(null);
        return;
      }
      const ld = await lr.json();
      const vd = await vr.json();
      setLeads(ld.leads || []);
      setVouchers(vd.vouchers || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchData(token);
  }, [token, fetchData]);

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
        setLoginError('Incorrect password. Please try again.');
      }
    } catch {
      setLoginError('Could not sign in. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('mf-admin-token');
    setToken(null);
    setLeads([]);
    setVouchers([]);
  };

  const patchLead = async (id: string, updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    if (selected?.id === id) setSelected((s) => (s ? { ...s, ...updates } : s));
    await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, ...updates }),
    });
  };

  const removeLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
    await fetch(`/api/leads?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const doRedeem = async (code: string) => {
    if (!code.trim()) return;
    setRedeemMsg(null);
    const res = await fetch('/api/vouchers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (data.success && data.voucher) {
      setVouchers((prev) => prev.map((v) => (v.code === data.voucher.code ? data.voucher : v)));
      setRedeemMsg({ ok: true, text: `${data.voucher.code} redeemed (£${data.voucher.amount.toFixed(2)})` });
      setRedeemCode('');
    } else {
      const reason =
        data.reason === 'already_redeemed' ? 'has already been redeemed' :
        data.reason === 'not_found' ? 'was not found' : 'could not be redeemed';
      setRedeemMsg({ ok: false, text: `Voucher ${reason}.` });
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Status', 'Event', 'Guests', 'Date', 'Notes'];
    const rows = leads.map((l) => [
      l.fullName, l.email, l.phone || '', sourceLabels[l.source] || l.source,
      l.status, l.eventType || '', l.expectedGuests || '', fmtDate(l.createdAt), l.notes || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- Login screen ----------------
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2d4a4a] via-[#3a5656] to-[#1d3a3a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2d4a4a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-[#c9a55c]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>
              Back Office
            </h1>
            <p className="text-gray-500 mt-2">The Merry Fiddlers</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg font-medium transition-colors">
              Sign In
            </button>
          </form>
          <Link href="/" className="flex items-center justify-center gap-2 mt-6 text-gray-500 hover:text-[#2d4a4a] transition-colors text-sm">
            <ChevronLeft className="w-4 h-4" /> Back to Website
          </Link>
        </div>
      </div>
    );
  }

  // ---------------- Derived data ----------------
  const filteredLeads = leads.filter((l) =>
    !search ||
    l.fullName.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.phone || '').includes(search)
  );
  const revenue = vouchers.reduce((s, v) => s + v.amount, 0);
  const unredeemed = vouchers.filter((v) => v.status === 'unredeemed');
  const redeemed = vouchers.filter((v) => v.status === 'redeemed');
  const liability = unredeemed.reduce((s, v) => s + v.amount, 0);
  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2d4a4a] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white/70 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-lg sm:text-xl font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                Back Office
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => token && fetchData(token)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Refresh">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={exportCSV} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#c9a55c] hover:bg-[#b8944b] rounded-lg transition-colors text-sm font-medium">
                <Download className="w-4 h-4" /> Export
              </button>
              <button onClick={logout} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 rounded-lg transition-colors text-sm">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
          <div className="flex gap-1 mt-4 border-t border-white/10 pt-3">
            {([
              { k: 'overview', label: 'Overview', icon: BarChart3 },
              { k: 'pipeline', label: 'Leads', icon: Users },
              { k: 'vouchers', label: 'Vouchers', icon: Ticket },
            ] as const).map(({ k, label, icon: Icon }) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${
                  tab === k ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
                {k === 'pipeline' && newCount > 0 && (
                  <span className="ml-1 bg-emerald-500 text-white text-xs px-1.5 rounded-full">{newCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Leads" value={String(leads.length)} icon={<Users className="w-6 h-6 text-[#2d4a4a]" />} tint="bg-[#2d4a4a]/10" />
              <StatCard label="New to Action" value={String(newCount)} icon={<AlertCircle className="w-6 h-6 text-emerald-600" />} tint="bg-emerald-100" />
              <StatCard label="Vouchers Sold" value={String(vouchers.length)} icon={<Ticket className="w-6 h-6 text-[#c9a55c]" />} tint="bg-[#c9a55c]/10" />
              <StatCard label="Total Revenue" value={`£${revenue.toFixed(2)}`} icon={<PoundSterling className="w-6 h-6 text-green-600" />} tint="bg-green-100" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#2d4a4a] mb-4">Lead Pipeline</h3>
                <div className="space-y-3">
                  {PIPELINE.map(({ key, label, dot }) => {
                    const count = leads.filter((l) => l.status === key).length;
                    const pct = leads.length ? (count / leads.length) * 100 : 0;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${dot}`} />
                        <span className="flex-1 text-gray-700">{label}</span>
                        <span className="font-semibold text-[#2d4a4a] w-8 text-right">{count}</span>
                        <div className="w-28 bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${dot}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#2d4a4a] mb-4">Vouchers</h3>
                <div className="grid grid-cols-2 gap-4">
                  <MiniStat label="Unredeemed" value={String(unredeemed.length)} sub={`£${liability.toFixed(2)} outstanding`} color="text-amber-600" />
                  <MiniStat label="Redeemed" value={String(redeemed.length)} sub="Completed" color="text-green-600" />
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                  Outstanding liability is the value of vouchers customers can still spend.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 font-medium text-[#2d4a4a]">Recent Activity</div>
              <div className="divide-y divide-gray-100">
                {leads.slice(0, 6).map((l) => (
                  <div key={l.id} className="px-6 py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-[#2d4a4a]">{l.fullName}</span>
                      <span className="text-gray-400 ml-2">{sourceLabels[l.source] || l.source}</span>
                    </div>
                    <span className="text-gray-400">{fmtDate(l.createdAt)}</span>
                  </div>
                ))}
                {leads.length === 0 && <div className="px-6 py-8 text-center text-gray-400">No activity yet</div>}
              </div>
            </div>
          </div>
        )}

        {/* PIPELINE */}
        {tab === 'pipeline' && (
          <div>
            <div className="relative mb-5 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone…"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {PIPELINE.map((col) => {
                const colLeads = filteredLeads.filter((l) => l.status === col.key);
                return (
                  <div key={col.key} className={`bg-gray-100/70 rounded-xl border-t-4 ${col.accent}`}>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                        <h3 className="font-semibold text-[#2d4a4a]">{col.label}</h3>
                      </div>
                      <span className="text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">{colLeads.length}</span>
                    </div>
                    <div className="px-3 pb-3 space-y-3 min-h-[120px] max-h-[70vh] overflow-y-auto">
                      {colLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onOpen={() => { setSelected(lead); setNotesDraft(lead.notes || ''); }}
                          onAdvance={(next) => patchLead(lead.id, { status: next })}
                        />
                      ))}
                      {colLeads.length === 0 && (
                        <p className="text-center text-sm text-gray-400 py-6">No leads</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VOUCHERS */}
        {tab === 'vouchers' && (
          <div className="space-y-6">
            {/* Redeem box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-[#2d4a4a] mb-1 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#c9a55c]" /> Redeem a Voucher
              </h3>
              <p className="text-sm text-gray-500 mb-4">Type the customer's voucher code to mark it as used.</p>
              <form
                onSubmit={(e) => { e.preventDefault(); doRedeem(redeemCode); }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                  placeholder="e.g. GIFT50-2406-AB12"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-mono uppercase focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                />
                <button type="submit" className="px-6 py-3 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg font-medium transition-colors">
                  Redeem
                </button>
              </form>
              {redeemMsg && (
                <div className={`mt-3 flex items-center gap-2 text-sm ${redeemMsg.ok ? 'text-green-600' : 'text-red-600'}`}>
                  {redeemMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {redeemMsg.text}
                </div>
              )}
            </div>

            {/* Unredeemed */}
            <VoucherSection
              title="Unredeemed"
              tone="amber"
              vouchers={unredeemed}
              onRedeem={(code) => doRedeem(code)}
            />
            {/* Redeemed */}
            <VoucherSection
              title="Redeemed"
              tone="green"
              vouchers={redeemed}
            />
          </div>
        )}
      </main>

      {/* Lead detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#2d4a4a] text-white px-6 py-4 flex items-center justify-between sticky top-0">
              <div>
                <h2 className="font-semibold text-lg">{selected.fullName}</h2>
                <p className="text-white/70 text-sm">{sourceLabels[selected.source] || selected.source}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                <div className="grid grid-cols-4 gap-2">
                  {PIPELINE.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => patchLead(selected.id, { status: s.key })}
                      className={`py-2 rounded-lg text-xs font-medium transition-all ${
                        selected.status === s.key ? 'bg-[#2d4a4a] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s.label.replace(' Leads', '')}
                    </button>
                  ))}
                </div>
              </div>
              {/* Contact */}
              <div className="space-y-2 text-sm">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-3 text-[#2d4a4a] hover:underline">
                  <Mail className="w-4 h-4 text-gray-400" /> {selected.email}
                </a>
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-3 text-[#2d4a4a] hover:underline">
                    <Phone className="w-4 h-4 text-gray-400" /> {selected.phone}
                  </a>
                )}
                {selected.eventType && <p className="text-gray-600 ml-7">Event: {selected.eventType}</p>}
                {selected.expectedGuests && <p className="text-gray-600 ml-7">Guests: {selected.expectedGuests}</p>}
              </div>
              {selected.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selected.message}</p>
                </div>
              )}
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Private Notes</label>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={3}
                  placeholder="Add internal notes…"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                />
                <button
                  onClick={() => patchLead(selected.id, { notes: notesDraft })}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg text-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save notes
                </button>
              </div>
              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <a
                  href={`mailto:${selected.email}?subject=The Merry Fiddlers`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg text-sm"
                >
                  <Send className="w-4 h-4" /> Email
                </a>
                <button
                  onClick={() => removeLead(selected.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
              <p className="text-xs text-gray-400">Created {fmtDate(selected.createdAt)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- Sub components ----------------

function StatCard({ label, value, icon, tint }: { label: string; value: string; icon: React.ReactNode; tint: string }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-[#2d4a4a] mt-1">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${tint}`}>{icon}</div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function LeadCard({ lead, onOpen, onAdvance }: { lead: Lead; onOpen: () => void; onAdvance: (s: LeadStatus) => void }) {
  const nextStage: Record<LeadStatus, LeadStatus | null> = {
    new: 'contacted', contacted: 'booked', booked: null, lost: null,
  };
  const next = nextStage[lead.status];
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <button onClick={onOpen} className="w-full text-left">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-[#2d4a4a] text-sm truncate">{lead.fullName}</p>
          <span className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
            {sourceLabels[lead.source] || lead.source}
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate mt-0.5">{lead.email}</p>
        {lead.message && <p className="text-xs text-gray-400 line-clamp-2 mt-1">{lead.message}</p>}
        <p className="text-[11px] text-gray-400 mt-2">{fmtDate(lead.createdAt)}</p>
      </button>
      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-50">
        <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 text-gray-400 hover:text-[#c9a55c] rounded">
          <Mail className="w-3.5 h-3.5" />
        </a>
        {lead.phone && (
          <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="p-1.5 text-gray-400 hover:text-[#c9a55c] rounded">
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}
        <div className="flex-1" />
        {lead.status !== 'lost' && (
          <button
            onClick={() => onAdvance('lost')}
            className="text-[11px] text-gray-400 hover:text-red-500 px-1.5"
          >
            Lost
          </button>
        )}
        {next && (
          <button
            onClick={() => onAdvance(next)}
            className="flex items-center gap-1 text-[11px] font-medium text-[#2d4a4a] bg-[#c9a55c]/15 hover:bg-[#c9a55c]/30 px-2 py-1 rounded"
          >
            {next === 'contacted' ? 'Contacted' : 'Booked'} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

function VoucherSection({
  title, tone, vouchers, onRedeem,
}: {
  title: string;
  tone: 'amber' | 'green';
  vouchers: Voucher[];
  onRedeem?: (code: string) => void;
}) {
  const toneDot = tone === 'amber' ? 'bg-amber-500' : 'bg-green-500';
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${toneDot}`} />
        <h3 className="font-semibold text-[#2d4a4a]">{title}</h3>
        <span className="text-sm text-gray-500">({vouchers.length})</span>
      </div>
      {vouchers.length === 0 ? (
        <p className="px-6 py-8 text-center text-gray-400 text-sm">No {title.toLowerCase()} vouchers</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 p-4">
          {vouchers.map((v) => (
            <div key={v.code} className="border border-gray-100 rounded-lg p-4 hover:border-[#c9a55c]/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  {v.type === 'gift-voucher' ? <Gift className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                  {v.type === 'gift-voucher' ? 'Gift Voucher' : 'Afternoon Tea'}
                </span>
                <span className="text-lg font-bold text-[#c9a55c]">£{v.amount.toFixed(2)}</span>
              </div>
              <p className="font-mono text-sm font-semibold text-[#2d4a4a] break-all">{v.code}</p>
              <div className="text-xs text-gray-500 mt-2 space-y-0.5">
                {v.purchaserName && <p>From: {v.purchaserName}</p>}
                {v.recipientName && <p>For: {v.recipientName}</p>}
                {v.quantity && <p>Guests: {v.quantity}{v.addProsecco ? ' + Prosecco' : ''}</p>}
                <p className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  {v.status === 'redeemed' ? `Redeemed ${fmtDate(v.redeemedAt)}` : `Sold ${fmtDate(v.createdAt)}`}
                </p>
              </div>
              {onRedeem && (
                <button
                  onClick={() => onRedeem(v.code)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg text-sm transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark Redeemed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
