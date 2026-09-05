'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Users, Search, Mail, Phone, CheckCircle2, XCircle, Shield, ShieldAlert, ToggleLeft, ToggleRight } from 'lucide-react';
import { apiService, User } from '@/services/api';
import { toast } from 'sonner';

export default function UsersPage() {
  const { t, dir } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.users.index({ search });
      setUsers(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to fetch users');
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleUpdateRole = async (id: number, role: string) => {
    try {
      const res = await apiService.admin.users.updateRole(id, role);
      if (res.success) {
        toast.success('User role updated successfully!');
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleSuspended = async (id: number) => {
    try {
      const res = await apiService.admin.users.toggleSuspended(id);
      if (res.success) {
        toast.success(res.message || 'Suspension status updated');
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to toggle suspension');
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'op_tier1' || role === 'Admin') {
      return <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">Admin</span>;
    }
    if (role === 'op_tier2' || role === 'Manager') {
      return <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">Manager</span>;
    }
    return <span className="px-2.5 py-1 rounded-md bg-slate-500/10 text-slate-300 border border-slate-500/20 text-xs font-bold">Customer</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="size-8 text-cyan" />
            {t('admin.users')}
          </h1>
          <p className="text-slate-400 mt-1">Manage system administrators, managers, and customer accounts.</p>
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
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 rounded-tr-xl font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">Loading users...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan/20 to-blue-600/20 text-cyan border border-cyan/20 font-bold uppercase">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-white">{user.name}</span>
                          <span className="text-xs font-mono text-slate-500">ID #{user.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-300"><Mail className="size-3 text-cyan" /> {user.email}</span>
                        <span className="flex items-center gap-1.5 text-slate-400"><Phone className="size-3 text-slate-500" /> {user.phone || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {!user.is_suspended ? (
                        <div className="flex w-20 items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="size-3" /> Active
                        </div>
                      ) : (
                        <div className="flex w-24 items-center justify-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
                          <XCircle className="size-3" /> Suspended
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="h-8 rounded-lg border border-white/10 bg-navy/90 text-xs text-slate-200 px-2 outline-none"
                        >
                          <option value="op_tier1">Admin</option>
                          <option value="op_tier2">Manager</option>
                          <option value="op_tier3">Customer</option>
                        </select>

                        <button
                          onClick={() => handleToggleSuspended(user.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            user.is_suspended
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
