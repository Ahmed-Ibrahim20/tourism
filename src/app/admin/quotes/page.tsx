'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { MessageSquareQuote, Search, Mail, Phone, Calendar, User, Eye, CheckCircle2, Clock } from 'lucide-react';
import { apiService, QuoteRequest } from '@/services/api';
import { toast } from 'sonner';

export default function AdminQuotesPage() {
  const { t, dir } = useI18n();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<QuoteRequest | null>(null);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.quotes.adminIndex({
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setQuotes(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to fetch quotes');
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await apiService.admin.quotes.adminUpdateStatus(id, status);
      if (res.success) {
        toast.success(`Quote status changed to ${status}`);
        fetchQuotes();
      }
    } catch (err) {
      toast.error('Failed to update quote status');
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const res = await apiService.admin.quotes.adminMarkAsRead(id);
      if (res.success) {
        toast.success('Marked as read');
        fetchQuotes();
      }
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-bold border border-cyan/30">New</span>;
      case 'in_progress':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">In Progress</span>;
      case 'replied':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">Replied</span>;
      case 'closed':
        return <span className="px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-400 text-xs font-bold border border-slate-500/30">Closed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-500/20 text-slate-300 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <MessageSquareQuote className="size-8 text-cyan" />
            Quote Requests Management
          </h1>
          <p className="text-slate-400 mt-1">Manage customer custom tour and price quote inquiries.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone..."
              className={`h-10 w-full sm:w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-navy/80 px-3 text-sm text-slate-200 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="replied">Replied</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-navy/80 p-1 shadow-lg backdrop-blur-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Destination / Category</th>
                <th className="px-6 py-4 font-semibold">Pax / Nights</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 rounded-tr-xl font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">Loading quote requests...</td>
                </tr>
              ) : quotes.length > 0 ? (
                quotes.map((q) => (
                  <tr key={q.id} className={`border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors ${!q.is_read ? 'bg-cyan/5 font-semibold' : ''}`}>
                    <td className="px-6 py-4 font-medium text-white">
                      {q.first_name} {q.last_name}
                      {!q.is_read && <span className="ml-2 inline-block size-2 rounded-full bg-cyan" />}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-300"><Mail className="size-3 text-cyan" /> {q.email}</span>
                        <span className="flex items-center gap-1.5 text-slate-400"><Phone className="size-3 text-slate-500" /> {q.country_code} {q.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300">
                      {q.destination?.name || 'Any Destination'}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-300">
                      <div>
                        <span className="font-bold text-white">{q.adults_count || 1} Adults</span>
                        {q.children_count ? <span className="text-cyan"> • {q.children_count} Children</span> : null}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {q.nights_count || 1} Nights {q.preferred_date ? `(${q.preferred_date})` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(q.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedQuote(q)}
                          className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-cyan hover:bg-cyan/10 transition-colors"
                          title="View Message"
                        >
                          <Eye className="size-4" />
                        </button>
                        <select
                          value={q.status}
                          onChange={(e) => handleUpdateStatus(q.id, e.target.value)}
                          className="h-8 rounded-lg border border-white/10 bg-navy/90 text-xs text-slate-200 px-2 outline-none"
                        >
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="replied">Replied</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">No quote requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquareQuote className="size-5 text-cyan" />
              Quote Request Details
            </h2>
            <div className="space-y-2 text-sm text-slate-300 border-t border-b border-white/10 py-4">
              <p><strong>Customer:</strong> {selectedQuote.first_name} {selectedQuote.last_name}</p>
              <p><strong>Email:</strong> {selectedQuote.email}</p>
              <p><strong>Phone:</strong> {selectedQuote.country_code} {selectedQuote.phone}</p>
              <p><strong>Pax / Travellers:</strong> {selectedQuote.adults_count || 1} Adults, {selectedQuote.children_count || 0} Children</p>
              <p><strong>Duration (Nights):</strong> {selectedQuote.nights_count || 1} Nights</p>
              <p><strong>Start / Check-in Date:</strong> {selectedQuote.preferred_date || 'Flexible'}</p>
              <div className="mt-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 font-bold mb-1">Customer Message:</p>
                <p className="text-white text-xs whitespace-pre-wrap">{selectedQuote.message || 'No message provided'}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              {!selectedQuote.is_read && (
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedQuote.id);
                    setSelectedQuote(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold hover:bg-cyan/20"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
