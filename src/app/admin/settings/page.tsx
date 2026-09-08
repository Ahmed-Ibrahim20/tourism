'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { 
  Settings, 
  Save, 
  Globe, 
  Lock, 
  Bell, 
  Palette,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Mail,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

type TabType = 'general' | 'security' | 'notifications' | 'appearance';

export default function SettingsPage() {
  const { t, dir } = useI18n();
  const { theme, setTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    siteName: 'Dahab Dream Tour',
    contactEmail: 'info@dahabdreamtour.com',
    contactPhone: '+20 123 456 7890',
    defaultCurrency: 'USD',
    siteDescription: 'Dahab Dream Tour is your premier partner for luxury travel experiences across Egypt. We craft unforgettable journeys.',
    maintenanceMode: false,
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: true,
  });

  const [notificationsForm, setNotificationsForm] = useState({
    emailAlerts: true,
    bookingAlerts: true,
    whatsappAlerts: false,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setIsSaving(false);
    toast.success(t('admin.savedSuccess'));
  };

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Settings className="size-8 text-cyan" />
            {t('admin.settings')}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{t('admin.settingsSubtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-5 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_20px_rgba(0,212,255,0.3)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t('admin.saving')}</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>{t('admin.saveChanges')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Navigation / Sidebar Tabs */}
        <div className="col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 rounded-xl p-4 text-start font-bold transition-all ${
              activeTab === 'general'
                ? 'bg-cyan/10 border border-cyan/30 text-cyan shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Globe className="size-5 shrink-0" />
            <span>{t('admin.tabGeneral')}</span>
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 rounded-xl p-4 text-start font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-cyan/10 border border-cyan/30 text-cyan shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Lock className="size-5 shrink-0" />
            <span>{t('admin.tabSecurity')}</span>
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 rounded-xl p-4 text-start font-bold transition-all ${
              activeTab === 'notifications'
                ? 'bg-cyan/10 border border-cyan/30 text-cyan shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Bell className="size-5 shrink-0" />
            <span>{t('admin.tabNotifications')}</span>
          </button>

          <button 
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 rounded-xl p-4 text-start font-bold transition-all ${
              activeTab === 'appearance'
                ? 'bg-cyan/10 border border-cyan/30 text-cyan shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Palette className="size-5 shrink-0" />
            <span>{t('admin.tabAppearance')}</span>
          </button>
        </div>

        {/* Form Tab Content */}
        <div className="col-span-1 lg:col-span-2">
          <form onSubmit={handleSave}>
            <AnimatePresence mode="wait">
              {/* General Tab */}
              {activeTab === 'general' && (
                <motion.div 
                  key="general"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-xl backdrop-blur-xl space-y-6"
                >
                  <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Globe className="size-5 text-cyan" />
                    {t('admin.tabGeneral')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">{t('admin.siteName')}</label>
                        <input 
                          type="text" 
                          value={generalForm.siteName}
                          onChange={(e) => setGeneralForm({ ...generalForm, siteName: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">{t('admin.contactEmail')}</label>
                        <input 
                          type="email" 
                          value={generalForm.contactEmail}
                          onChange={(e) => setGeneralForm({ ...generalForm, contactEmail: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">{t('admin.contactPhone')}</label>
                        <input 
                          type="text" 
                          value={generalForm.contactPhone}
                          onChange={(e) => setGeneralForm({ ...generalForm, contactPhone: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">{t('admin.defaultCurrency')}</label>
                        <select 
                          value={generalForm.defaultCurrency}
                          onChange={(e) => setGeneralForm({ ...generalForm, defaultCurrency: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50"
                        >
                          <option value="USD" className="bg-navy text-white">USD ($)</option>
                          <option value="EUR" className="bg-navy text-white">EUR (€)</option>
                          <option value="EGP" className="bg-navy text-white">EGP (E£)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300">{t('admin.siteDescription')}</label>
                      <textarea 
                        rows={3} 
                        value={generalForm.siteDescription}
                        onChange={(e) => setGeneralForm({ ...generalForm, siteDescription: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <span className="text-sm font-bold text-white block">{t('admin.maintenanceMode')}</span>
                        <span className="text-xs text-slate-400">{t('admin.maintenanceDesc')}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGeneralForm({ ...generalForm, maintenanceMode: !generalForm.maintenanceMode })}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          generalForm.maintenanceMode ? 'bg-cyan' : 'bg-white/20'
                        }`}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-navy transition-transform ${
                            generalForm.maintenanceMode 
                              ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') 
                              : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div 
                  key="security"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-xl backdrop-blur-xl space-y-6"
                >
                  <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Lock className="size-5 text-cyan" />
                    {t('admin.tabSecurity')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-300">{t('admin.currentPassword')}</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">{t('admin.newPassword')}</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">{t('admin.confirmPassword')}</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-navy/50 px-4 py-2.5 text-white focus:border-cyan/50 focus:outline-none focus:ring-1 focus:ring-cyan/50" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="size-6 text-cyan shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-white block">{t('admin.twoFactor')}</span>
                          <span className="text-xs text-slate-400">{t('admin.twoFactorDesc')}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSecurityForm({ ...securityForm, twoFactor: !securityForm.twoFactor })}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          securityForm.twoFactor ? 'bg-cyan' : 'bg-white/20'
                        }`}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-navy transition-transform ${
                            securityForm.twoFactor 
                              ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') 
                              : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div 
                  key="notifications"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-xl backdrop-blur-xl space-y-6"
                >
                  <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Bell className="size-5 text-cyan" />
                    {t('admin.tabNotifications')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Mail className="size-5 text-cyan shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-white block">{t('admin.emailAlerts')}</span>
                          <span className="text-xs text-slate-400">{t('admin.emailAlertsDesc')}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationsForm({ ...notificationsForm, emailAlerts: !notificationsForm.emailAlerts })}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          notificationsForm.emailAlerts ? 'bg-cyan' : 'bg-white/20'
                        }`}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-navy transition-transform ${
                            notificationsForm.emailAlerts 
                              ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') 
                              : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')
                          }`} 
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Smartphone className="size-5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="text-sm font-bold text-white block">{t('admin.whatsappAlerts')}</span>
                          <span className="text-xs text-slate-400">{t('admin.whatsappAlertsDesc')}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationsForm({ ...notificationsForm, whatsappAlerts: !notificationsForm.whatsappAlerts })}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          notificationsForm.whatsappAlerts ? 'bg-cyan' : 'bg-white/20'
                        }`}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-navy transition-transform ${
                            notificationsForm.whatsappAlerts 
                              ? (dir === 'rtl' ? '-translate-x-6' : 'translate-x-6') 
                              : (dir === 'rtl' ? '-translate-x-1' : 'translate-x-1')
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div 
                  key="appearance"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-white/10 bg-navy/80 p-6 shadow-xl backdrop-blur-xl space-y-6"
                >
                  <h2 className="text-xl font-bold text-white border-b border-white/10 pb-4 flex items-center gap-2">
                    <Palette className="size-5 text-cyan" />
                    {t('admin.tabAppearance')}
                  </h2>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-300 block">{t('admin.themePreference')}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setTheme('dark')}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          theme === 'dark'
                            ? 'border-cyan bg-cyan/10 text-cyan shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Moon className="size-5 text-cyan" />
                          <span className="font-bold">{t('admin.themeDark')}</span>
                        </div>
                        {theme === 'dark' && <CheckCircle2 className="size-5 text-cyan" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setTheme('light')}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          theme === 'light'
                            ? 'border-cyan bg-cyan/10 text-cyan shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Sun className="size-5 text-amber-400" />
                          <span className="font-bold">{t('admin.themeLight')}</span>
                        </div>
                        {theme === 'light' && <CheckCircle2 className="size-5 text-cyan" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
