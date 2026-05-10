'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  CalendarCheck, 
  CreditCard, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ── Mock Data ────────────────────────────────────────── */
const revenueData = [
  { name: 'Jan', total: 4000 },
  { name: 'Feb', total: 3000 },
  { name: 'Mar', total: 5000 },
  { name: 'Apr', total: 4500 },
  { name: 'May', total: 6000 },
  { name: 'Jun', total: 5500 },
  { name: 'Jul', total: 7000 },
];

const recentInquiries = [
  { id: 'BKG-762931', customer: 'Ahmed Hassan', package: 'Royal Honeymoon Package', amount: '$2,400', date: '2025-06-12', status: 'confirmed' },
  { id: 'BKG-192834', customer: 'Sarah Miller', package: 'Pyramids & Grand Museum Tour', amount: '$350', date: '2025-06-11', status: 'pending' },
  { id: 'BKG-548123', customer: 'Khaled Omar', package: 'Dahab Luxury Resort', amount: '$1,200', date: '2025-06-10', status: 'confirmed' },
  { id: 'BKG-992145', customer: 'Emma Watson', package: 'Private Yacht Trip', amount: '$800', date: '2025-06-09', status: 'cancelled' },
  { id: 'BKG-441239', customer: 'Ali Rahman', package: 'Old Cataract Aswan', amount: '$1,500', date: '2025-06-08', status: 'pending' },
];

export default function AdminDashboard() {
  const { t, dir } = useI18n();

  const stats = [
    {
      title: t('admin.totalRevenue'),
      value: '$45,231.89',
      trend: '+20.1%',
      trendUp: true,
      icon: CreditCard,
      color: 'text-cyan',
      bg: 'bg-cyan/10 border-cyan/20',
    },
    {
      title: t('admin.activeBookings'),
      value: '+2350',
      trend: '+15.2%',
      trendUp: true,
      icon: CalendarCheck,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: t('admin.totalUsers'),
      value: '12,234',
      trend: '+5.4%',
      trendUp: true,
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Conversion Rate',
      value: '4.3%',
      trend: '-1.2%',
      trendUp: false,
      icon: TrendingUp,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

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
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">{t('admin.dashboard')}</h1>
        <p className="text-slate-400 mt-1">Overview of your travel business performance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-lg backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                  <h3 className="mt-2 text-3xl font-bold text-white">{stat.value}</h3>
                </div>
                <div className={`flex size-12 items-center justify-center rounded-xl border ${stat.bg}`}>
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`flex items-center font-bold ${stat.trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.trendUp ? <ArrowUpRight className="mr-1 size-4" /> : <ArrowDownRight className="mr-1 size-4" />}
                  {stat.trend}
                </span>
                <span className="ml-2 text-slate-500">from last month</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 lg:col-span-4 rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-lg backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t('admin.revenueChart')}</h2>
            <select className="rounded-lg border border-white/10 bg-navy/50 px-3 py-1.5 text-sm text-slate-300 outline-none">
              <option>Last 7 months</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A192F', borderColor: 'rgba(0, 212, 255, 0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#00D4FF', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#00D4FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Inquiries List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 lg:col-span-3 rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-lg backdrop-blur-xl flex flex-col"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{t('admin.recentInquiries')}</h2>
            <button className="text-sm font-semibold text-cyan hover:text-cyan-light transition-colors">
              {t('admin.viewAll')}
            </button>
          </div>
          
          <div className="flex-1 overflow-auto pr-2 no-scrollbar">
            <div className="space-y-4">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white">{inq.customer}</span>
                    <span className="text-xs text-slate-400">{inq.package}</span>
                    <span className="text-xs font-mono text-cyan/70 mt-1">{inq.id}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-white">{inq.amount}</span>
                    {getStatusBadge(inq.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bookings Table Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-lg backdrop-blur-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Latest Transactions</h2>
          <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <MoreVertical className="size-5" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-6 py-4 rounded-l-lg font-semibold">{t('admin.customer')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.packages')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.date')}</th>
                <th className="px-6 py-4 font-semibold">{t('admin.amount')}</th>
                <th className="px-6 py-4 rounded-r-lg font-semibold">{t('admin.status')}</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((row, index) => (
                <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{row.customer}</td>
                  <td className="px-6 py-4">{row.package}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{row.date}</td>
                  <td className="px-6 py-4 font-mono text-cyan">{row.amount}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(row.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
}
