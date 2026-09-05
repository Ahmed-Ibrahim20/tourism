'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { CalendarDays, Search, Filter, CheckCircle2, Clock, XCircle, Eye, RefreshCw } from 'lucide-react';
import { apiService, Booking } from '@/services/api';
import { toast } from 'sonner';

export default function BookingsPage() {
  const { t, dir } = useI18n();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.bookings.adminIndex({
        search,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setBookings(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to fetch bookings');
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await apiService.admin.bookings.adminUpdateStatus(id, status);
      if (res.success) {
        toast.success(`Booking status changed to ${status}`);
        fetchBookings();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return (
          <div className="flex w-24 items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            {t('admin.confirmed')}
          </div>
        );
      case 'pending':
        return (
          <div className="flex w-24 items-center justify-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
            <Clock className="size-3" />
            {t('admin.pending')}
          </div>
        );
      case 'canceled':
      case 'cancelled':
        return (
          <div className="flex w-24 items-center justify-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
            <XCircle className="size-3" />
            {t('admin.cancelled')}
          </div>
        );
      default:
        return (
          <div className="flex w-24 items-center justify-center gap-1.5 rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-bold text-slate-300 border border-slate-500/20">
            {status}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CalendarDays className="size-8 text-cyan" />
            {t('admin.bookings')}
          </h1>
          <p className="text-slate-400 mt-1">Manage all customer reservations, check-ins, and statuses.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, customer name..."
              className={`h-10 w-full sm:w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-white/10 bg-navy/80 px-3 text-sm text-slate-200 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="refunded">Refunded</option>
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
                <th className="px-6 py-4 rounded-tl-xl font-semibold">Reference</th>
                <th className="px-6 py-4 font-semibold">{t('admin.customer')}</th>
                <th className="px-6 py-4 font-semibold">Check-in Date</th>
                <th className="px-6 py-4 font-semibold">Pax</th>
                <th className="px-6 py-4 font-semibold">{t('admin.amount')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.status')}</th>
                <th className="px-6 py-4 rounded-tr-xl font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Loading bookings...</td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-mono text-cyan/90 font-bold">{row.reference_number}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{row.customer_name}</span>
                        <span className="text-xs text-slate-400">{row.customer_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{row.check_in_date || '-'}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-300">
                      {row.adults_count || 1} A / {row.children_count || 0} C
                    </td>
                    <td className="px-6 py-4 font-mono text-cyan font-bold">${row.total_amount}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(row.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedBooking(row)}
                          className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-cyan hover:bg-cyan/10 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </button>
                        <select
                          value={row.status}
                          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                          className="h-8 rounded-lg border border-white/10 bg-navy/90 text-xs text-slate-200 px-2 outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="canceled">Canceled</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-navy p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays className="size-5 text-cyan" />
              Booking Details #{selectedBooking.reference_number}
            </h2>
            <div className="space-y-2 text-sm text-slate-300 border-t border-b border-white/10 py-4">
              <p><strong>Customer:</strong> {selectedBooking.customer_name}</p>
              <p><strong>Email:</strong> {selectedBooking.customer_email}</p>
              <p><strong>Phone:</strong> {selectedBooking.customer_phone || 'N/A'}</p>
              <p><strong>Check-in Date:</strong> {selectedBooking.check_in_date || 'N/A'}</p>
              <p><strong>Pax:</strong> {selectedBooking.adults_count} Adults, {selectedBooking.children_count} Children</p>
              <p><strong>Total Amount:</strong> ${selectedBooking.total_amount} {selectedBooking.currency}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
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
