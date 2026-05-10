'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Settings, Save, Globe, Lock, Bell, Palette } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Settings className="size-8 text-cyan" />
            {t('admin.settings')}
          </h1>
          <p className="text-slate-400 mt-1">Manage global platform configurations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Save className="size-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Navigation / Sections */}
        <div className="col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 rounded-xl bg-cyan/10 border border-cyan/20 p-4 text-left text-cyan transition-colors">
            <Globe className="size-5" />
            <span className="font-bold">General Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl border border-transparent p-4 text-left text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <Lock className="size-5" />
            <span className="font-bold">Security</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl border border-transparent p-4 text-left text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <Bell className="size-5" />
            <span className="font-bold">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl border border-transparent p-4 text-left text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
            <Palette className="size-5" />
            <span className="font-bold">Appearance</span>
          </button>
        </div>

        {/* Forms Content */}
        <div className="col-span-1 lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-lg backdrop-blur-xl space-y-6"
          >
            <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4">General Settings</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Site Name</label>
                  <input type="text" defaultValue="Dahab Dream Tour" className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300">Contact Email</label>
                  <input type="email" defaultValue="info@dahabdreamtour.com" className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Default Currency</label>
                <select className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50">
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="egp">EGP (E£)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Site Description (SEO)</label>
                <textarea rows={4} defaultValue="Dahab Dream Tour is your premier partner for luxury travel experiences across Egypt. We craft unforgettable journeys." className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50 resize-none"></textarea>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-cyan transition-colors cursor-pointer">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-navy transition-transform translate-x-6" />
                </div>
                <span className="text-sm font-medium text-slate-300">Enable Maintenance Mode</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
