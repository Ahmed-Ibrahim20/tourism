'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { CalendarDays, Search, Filter, MoreVertical, CheckCircle2, Clock, XCircle } from 'lucide-react';

const bookings = [
  { id: 'BKG-762931', customer: 'Ahmed Hassan', package: 'Royal Honeymoon Package', amount: '$2,400', date: '2025-06-12', status: 'confirmed' },
  { id: 'BKG-192834', customer: 'Sarah Miller', package: 'Pyramids & Grand Museum Tour', amount: '$350', date: '2025-06-11', status: 'pending' },
  { id: 'BKG-548123', customer: 'Khaled Omar', package: 'Dahab Luxury Resort', amount: '$1,200', date: '2025-06-10', status: 'confirmed' },
  { id: 'BKG-992145', customer: 'Emma Watson', package: 'Private Yacht Trip', amount: '$800', date: '2025-06-09', status: 'cancelled' },
  { id: 'BKG-441239', customer: 'Ali Rahman', package: 'Old Cataract Aswan', amount: '$1,500', date: '2025-06-08', status: 'pending' },
  { id: 'BKG-112344', customer: 'John Doe', package: 'Nile Cruise Luxury', amount: '$3,200', date: '2025-06-05', status: 'confirmed' },
  { id: 'BKG-883211', customer: 'Fatima Ali', package: 'Sinai Desert Safari', amount: '$150', date: '2025-06-01', status: 'confirmed' },
];

export default function BookingsPage() {
  const { t, dir } = useI18n();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
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
      case 'cancelled':
        return (
          <div className="flex w-24 items-center justify-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
            <XCircle className="size-3" />
            {t('admin.cancelled')}
          </div>
        );
      default:
        return null;
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
          <p className="text-slate-400 mt-1">Manage all your travel inquiries and reservations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              placeholder="Search ID, Name..."
              className={`h-10 w-full sm:w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition-all hover:bg-cyan/10 hover:text-cyan hover:border-cyan/20">
            <Filter className="size-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
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
                <th className="px-6 py-4 rounded-tl-xl font-semibold">Booking ID</th>
                <th className="px-6 py-4 font-semibold">{t('admin.customer')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.packages')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.date')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.amount')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.status')}</th>
                <th className="px-6 py-4 rounded-tr-xl font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((row, index) => (
                <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-cyan/70 font-semibold">{row.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{row.customer}</td>
                  <td className="px-6 py-4">{row.package}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{row.date}</td>
                  <td className="px-6 py-4 font-mono text-cyan">{row.amount}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(row.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
          <span className="text-xs text-slate-400">Showing 1 to 7 of 24 entries</span>
          <div className="flex items-center gap-1">
            <button className="h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold disabled:opacity-50" disabled>Prev</button>
            <button className="h-8 px-3 rounded-lg bg-cyan/10 text-cyan border border-cyan/20 text-xs font-semibold">1</button>
            <button className="h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold">2</button>
            <button className="h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold">3</button>
            <button className="h-8 px-3 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold">Next</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
