'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Mail, Phone, Calendar, MessageSquare, ChevronLeft, RefreshCw,
  Download, Filter, Search, Eye, Trash2, Check, X, TrendingUp,
  Clock, Send, Plus, Edit2, Save, BarChart3, PieChart, ArrowUpRight,
  AlertCircle, CheckCircle2, UserPlus, FileText
} from 'lucide-react';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  eventType: string;
  expectedGuests?: string;
  preferredDate?: string;
  message?: string;
  agreedToMarketing: boolean;
  source: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'archived';
  notes?: string;
  lastContactedAt?: string;
}

// Initial mock data
const initialMockLeads: Lead[] = [
  {
    id: '1',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+44 7700 900123',
    eventType: 'wedding',
    expectedGuests: '60-80',
    preferredDate: '2025-08-15',
    message: 'Looking for a rustic venue for our summer wedding reception.',
    agreedToMarketing: true,
    source: 'brochure-download',
    createdAt: '2025-05-14T10:30:00Z',
    status: 'new',
    notes: '',
  },
  {
    id: '2',
    fullName: 'Michael Brown',
    email: 'michael.b@company.com',
    phone: '+44 7700 900456',
    eventType: 'corporate',
    expectedGuests: '20-40',
    preferredDate: '2025-06-20',
    message: 'Annual team building event with lunch.',
    agreedToMarketing: false,
    source: 'brochure-download',
    createdAt: '2025-05-13T14:15:00Z',
    status: 'contacted',
    notes: 'Called on 13/05, interested in private dining room.',
    lastContactedAt: '2025-05-13T15:00:00Z',
  },
  {
    id: '3',
    fullName: 'Emma Williams',
    email: 'emma.w@gmail.com',
    eventType: 'birthday',
    expectedGuests: '40-60',
    preferredDate: '2025-07-10',
    agreedToMarketing: true,
    source: 'brochure-download',
    createdAt: '2025-05-12T09:45:00Z',
    status: 'new',
    notes: '',
  },
  {
    id: '4',
    fullName: 'James Wilson',
    email: 'james.wilson@email.com',
    phone: '+44 7800 123456',
    eventType: 'anniversary',
    expectedGuests: '20-30',
    preferredDate: '2025-09-05',
    message: 'Golden wedding anniversary for my parents.',
    agreedToMarketing: true,
    source: 'brochure-download',
    createdAt: '2025-05-10T11:20:00Z',
    status: 'qualified',
    notes: 'Deposit received. Menu tasting scheduled for June.',
    lastContactedAt: '2025-05-11T10:00:00Z',
  },
];

const eventTypeLabels: Record<string, string> = {
  wedding: 'Wedding Reception',
  birthday: 'Birthday Party',
  corporate: 'Corporate Event',
  christening: 'Christening',
  anniversary: 'Anniversary',
  other: 'Other',
};

const statusColors: Record<string, string> = {
  new: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  qualified: 'bg-amber-100 text-amber-800 border-amber-200',
  converted: 'bg-purple-100 text-purple-800 border-purple-200',
  archived: 'bg-gray-100 text-gray-600 border-gray-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  new: <AlertCircle className="w-3 h-3" />,
  contacted: <Phone className="w-3 h-3" />,
  qualified: <CheckCircle2 className="w-3 h-3" />,
  converted: <TrendingUp className="w-3 h-3" />,
  archived: <X className="w-3 h-3" />,
};

export default function AdminPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesText, setNotesText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'analytics'>('leads');

  // Load leads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('merry-fiddlers-leads');
    if (stored) {
      setLeads(JSON.parse(stored));
    } else {
      setLeads(initialMockLeads);
      localStorage.setItem('merry-fiddlers-leads', JSON.stringify(initialMockLeads));
    }
  }, []);

  // Save leads to localStorage when changed
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('merry-fiddlers-leads', JSON.stringify(leads));
    }
  }, [leads]);

  // Filter leads
  useEffect(() => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone && lead.phone.includes(searchTerm))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (eventFilter !== 'all') {
      filtered = filtered.filter(lead => lead.eventType === eventFilter);
    }

    // Sort by date, newest first
    filtered = filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setFilteredLeads(filtered);
  }, [searchTerm, statusFilter, eventFilter, leads]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'merryfiddlers2025') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? {
        ...lead,
        status: newStatus,
        lastContactedAt: newStatus === 'contacted' ? new Date().toISOString() : lead.lastContactedAt
      } : lead
    );
    setLeads(updatedLeads);
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const updateLeadNotes = (leadId: string, notes: string) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId ? { ...lead, notes } : lead
    );
    setLeads(updatedLeads);
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, notes });
    }
    setEditingNotes(false);
  };

  const deleteLead = (leadId: string) => {
    setLeads(leads.filter(lead => lead.id !== leadId));
    if (selectedLead?.id === leadId) {
      setSelectedLead(null);
    }
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
    });
  };

  const refreshLeads = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Event Type', 'Guests', 'Preferred Date', 'Message', 'Marketing Consent', 'Status', 'Notes', 'Created'];
    const rows = filteredLeads.map(lead => [
      lead.fullName,
      lead.email,
      lead.phone || '',
      eventTypeLabels[lead.eventType] || lead.eventType,
      lead.expectedGuests || '',
      lead.preferredDate || '',
      lead.message || '',
      lead.agreedToMarketing ? 'Yes' : 'No',
      lead.status,
      lead.notes || '',
      formatDate(lead.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Analytics calculations
  const getAnalytics = () => {
    const total = leads.length;
    const byStatus = {
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      qualified: leads.filter(l => l.status === 'qualified').length,
      converted: leads.filter(l => l.status === 'converted').length,
      archived: leads.filter(l => l.status === 'archived').length,
    };
    const byEvent = Object.entries(
      leads.reduce((acc, lead) => {
        acc[lead.eventType] = (acc[lead.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).sort((a, b) => b[1] - a[1]);

    const conversionRate = total > 0 ? ((byStatus.converted / total) * 100).toFixed(1) : '0';
    const marketingOptIn = leads.filter(l => l.agreedToMarketing).length;

    // Leads by week (last 4 weeks)
    const now = new Date();
    const weeklyData = [0, 0, 0, 0];
    leads.forEach(lead => {
      const leadDate = new Date(lead.createdAt);
      const diffDays = Math.floor((now.getTime() - leadDate.getTime()) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.min(3, Math.floor(diffDays / 7));
      weeklyData[weekIndex]++;
    });

    return { total, byStatus, byEvent, conversionRate, marketingOptIn, weeklyData };
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2d4a4a] via-[#3a5656] to-[#2d4a4a] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#2d4a4a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-[#c9a55c]" />
            </div>
            <h1 className="text-2xl font-bold text-[#2d4a4a]" style={{ fontFamily: "'Cinzel', serif" }}>
              Admin Dashboard
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent transition-all"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#2d4a4a] hover:bg-[#1d3a3a] text-white rounded-lg font-medium transition-colors"
            >
              Sign In
            </button>
          </form>

          <Link href="/" className="flex items-center justify-center gap-2 mt-6 text-gray-500 hover:text-[#2d4a4a] transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </div>
      </div>
    );
  }

  const analytics = getAnalytics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#2d4a4a] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <h1 className="text-xl font-bold" style={{ fontFamily: "'Cinzel', serif" }}>
                Lead Management
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refreshLeads}
                disabled={isLoading}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-[#c9a55c] hover:bg-[#b8944b] rounded-lg transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4 border-t border-white/10 pt-4">
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'leads' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              Leads
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'analytics' ? (
          /* Analytics Tab */
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Leads</p>
                    <p className="text-3xl font-bold text-[#2d4a4a]">{analytics.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#2d4a4a]/10 rounded-full flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-[#2d4a4a]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-3xl font-bold text-emerald-600">{analytics.conversionRate}%</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">New This Week</p>
                    <p className="text-3xl font-bold text-blue-600">{analytics.weeklyData[0]}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Marketing Opt-in</p>
                    <p className="text-3xl font-bold text-[#c9a55c]">{analytics.marketingOptIn}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#c9a55c]/10 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-[#c9a55c]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Status Breakdown */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#2d4a4a] mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Lead Status Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(analytics.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        status === 'new' ? 'bg-emerald-500' :
                        status === 'contacted' ? 'bg-blue-500' :
                        status === 'qualified' ? 'bg-amber-500' :
                        status === 'converted' ? 'bg-purple-500' : 'bg-gray-400'
                      }`} />
                      <span className="flex-1 capitalize text-gray-700">{status}</span>
                      <span className="font-semibold text-[#2d4a4a]">{count}</span>
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            status === 'new' ? 'bg-emerald-500' :
                            status === 'contacted' ? 'bg-blue-500' :
                            status === 'qualified' ? 'bg-amber-500' :
                            status === 'converted' ? 'bg-purple-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${analytics.total > 0 ? (count / analytics.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event Types */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-[#2d4a4a] mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Leads by Event Type
                </h3>
                <div className="space-y-3">
                  {analytics.byEvent.map(([eventType, count]) => (
                    <div key={eventType} className="flex items-center gap-3">
                      <span className="flex-1 text-gray-700">{eventTypeLabels[eventType] || eventType}</span>
                      <span className="font-semibold text-[#2d4a4a]">{count}</span>
                      <div className="w-32 bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-[#c9a55c]"
                          style={{ width: `${analytics.total > 0 ? (count / analytics.total) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Leads Tab */
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Leads List */}
            <div className="flex-1">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="archived">Archived</option>
                  </select>
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                  >
                    <option value="all">All Events</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="corporate">Corporate</option>
                    <option value="christening">Christening</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{filteredLeads.length}</span> of <span className="font-medium">{leads.length}</span> leads
                  </p>
                </div>

                {filteredLeads.length === 0 ? (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leads found</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setNotesText(lead.notes || '');
                          setEditingNotes(false);
                        }}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedLead?.id === lead.id ? 'bg-[#c9a55c]/5 border-l-4 border-[#c9a55c]' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-[#2d4a4a] truncate">{lead.fullName}</h3>
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
                                {statusIcons[lead.status]}
                                {lead.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {eventTypeLabels[lead.eventType] || lead.eventType}
                              </span>
                              <span>{formatShortDate(lead.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${lead.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 text-gray-400 hover:text-[#c9a55c] hover:bg-[#c9a55c]/10 rounded-lg transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 text-gray-400 hover:text-[#c9a55c] hover:bg-[#c9a55c]/10 rounded-lg transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lead Detail Panel */}
            {selectedLead && (
              <div className="lg:w-96 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit sticky top-6">
                <div className="bg-[#2d4a4a] text-white p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold">{selectedLead.fullName}</h2>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-white/70 mt-1">{eventTypeLabels[selectedLead.eventType]}</p>
                </div>

                <div className="p-4 space-y-4">
                  {/* Status Actions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {(['new', 'contacted', 'qualified', 'converted', 'archived'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateLeadStatus(selectedLead.id, status)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            selectedLead.status === status
                              ? 'bg-[#2d4a4a] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a href={`mailto:${selectedLead.email}`} className="text-sm text-[#2d4a4a] hover:underline">
                        {selectedLead.email}
                      </a>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${selectedLead.phone}`} className="text-sm text-[#2d4a4a] hover:underline">
                          {selectedLead.phone}
                        </a>
                      </div>
                    )}
                    {selectedLead.preferredDate && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(selectedLead.preferredDate).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    {selectedLead.expectedGuests && (
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedLead.expectedGuests} guests</span>
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  {selectedLead.message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedLead.message}</p>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      {!editingNotes && (
                        <button
                          onClick={() => {
                            setEditingNotes(true);
                            setNotesText(selectedLead.notes || '');
                          }}
                          className="text-xs text-[#c9a55c] hover:underline flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                      )}
                    </div>
                    {editingNotes ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesText}
                          onChange={(e) => setNotesText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a55c] focus:border-transparent"
                          rows={3}
                          placeholder="Add notes about this lead..."
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateLeadNotes(selectedLead.id, notesText)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#2d4a4a] text-white rounded-lg text-sm hover:bg-[#1d3a3a]"
                          >
                            <Save className="w-3 h-3" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotes(false)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                        {selectedLead.notes || <span className="text-gray-400 italic">No notes yet</span>}
                      </p>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <a
                      href={`mailto:${selectedLead.email}?subject=Your Event Enquiry at The Merry Fiddlers`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#c9a55c] hover:bg-[#b8944b] text-white rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      Send Email
                    </a>
                    <button
                      onClick={() => setShowDeleteConfirm(selectedLead.id)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Lead
                    </button>
                  </div>

                  {/* Meta */}
                  <div className="pt-4 border-t border-gray-100 text-xs text-gray-400 space-y-1">
                    <p>Created: {formatDate(selectedLead.createdAt)}</p>
                    {selectedLead.lastContactedAt && (
                      <p>Last contacted: {formatDate(selectedLead.lastContactedAt)}</p>
                    )}
                    <p>Marketing consent: {selectedLead.agreedToMarketing ? 'Yes' : 'No'}</p>
                    <p>Source: {selectedLead.source}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Lead?</h3>
              <p className="text-gray-600 mb-6">This action cannot be undone. The lead will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteLead(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
