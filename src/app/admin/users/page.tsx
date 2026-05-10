'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Users, Search, Filter, MoreVertical, CheckCircle2, XCircle, Mail, Phone } from 'lucide-react';

const users = [
  { id: 'USR-001', name: 'Ahmed Hassan', email: 'ahmed@example.com', phone: '+20 100 123 4567', role: 'Admin', status: 'active', joinDate: 'Jan 15, 2025' },
  { id: 'USR-002', name: 'Sarah Miller', email: 'sarah.m@example.com', phone: '+1 555 123 4567', role: 'Customer', status: 'active', joinDate: 'Feb 22, 2025' },
  { id: 'USR-003', name: 'Khaled Omar', email: 'khaled.o@example.com', phone: '+20 111 987 6543', role: 'Customer', status: 'inactive', joinDate: 'Mar 10, 2025' },
  { id: 'USR-004', name: 'Emma Watson', email: 'emma.w@example.com', phone: '+44 7700 900077', role: 'Customer', status: 'active', joinDate: 'Apr 05, 2025' },
  { id: 'USR-005', name: 'Ali Rahman', email: 'ali.r@example.com', phone: '+971 50 123 4567', role: 'Manager', status: 'active', joinDate: 'Apr 12, 2025' },
];

export default function UsersPage() {
  const { t, dir } = useI18n();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="size-8 text-cyan" />
            {t('admin.users')}
          </h1>
          <p className="text-slate-400 mt-1">Manage system administrators and customers.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              placeholder="Search users..."
              className={`h-10 w-full sm:w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Users className="size-4" />
            <span className="hidden sm:inline">Add User</span>
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
                <th className="px-6 py-4 rounded-tl-xl font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Join Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 rounded-tr-xl font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan/20 to-blue-600/20 text-cyan border border-cyan/20 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{user.name}</span>
                        <span className="text-xs font-mono text-slate-500">{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 text-xs text-slate-300"><Mail className="size-3 text-cyan" /> {user.email}</span>
                      <span className="flex items-center gap-2 text-xs text-slate-400"><Phone className="size-3 text-slate-500" /> {user.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-md px-2 py-1 text-xs font-bold ${
                      user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 
                      user.role === 'Manager' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      'bg-slate-500/10 text-slate-300 border border-slate-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <div className="flex w-20 items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="size-3" /> Active
                      </div>
                    ) : (
                      <div className="flex w-20 items-center justify-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
                        <XCircle className="size-3" /> Inactive
                      </div>
                    )}
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
      </motion.div>
    </div>
  );
}
