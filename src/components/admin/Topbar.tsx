'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Menu,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { useI18n, LANGUAGES, Lang } from '@/lib/i18n';

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { lang, setLang, dir, t } = useI18n();
  const [isLightMode, setIsLightMode] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Initialize theme from HTML class
  useEffect(() => {
    setIsLightMode(document.documentElement.classList.contains('light'));
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isLightMode) {
      html.classList.remove('light');
      setIsLightMode(false);
    } else {
      html.classList.add('light');
      setIsLightMode(true);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-b border-white/5 bg-navy/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Left section: Mobile menu + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-cyan/10 hover:text-cyan md:hidden"
        >
          <Menu className="size-5" />
        </button>

        <div className="relative hidden sm:block">
          <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
          <input
            type="text"
            placeholder="Search..."
            className={`h-11 w-64 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
          />
        </div>
      </div>

      {/* Right section: Theme, Lang, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-cyan/10 hover:text-cyan hover:border-cyan/20"
          aria-label="Toggle Theme"
        >
          {isLightMode ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </button>

        {/* Language Toggle */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-bold uppercase tracking-wider text-slate-300 transition-all hover:bg-cyan/10 hover:text-cyan hover:border-cyan/20"
          >
            <Globe className="size-4" />
            <span className="hidden sm:inline">{lang}</span>
          </button>

          <AnimatePresence>
            {langDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full mt-2 w-40 rounded-xl border border-white/10 bg-navy/95 p-2 shadow-2xl backdrop-blur-xl ${dir === 'rtl' ? 'left-0' : 'right-0'}`}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code as Lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-bold transition-colors ${
                      lang === l.code
                        ? 'bg-cyan/10 text-cyan'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span>{l.flag}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-all hover:bg-cyan/10 hover:text-cyan hover:border-cyan/20"
          >
            <Bell className="size-5" />
            <span className="absolute right-2 top-2 flex size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          </button>

          <AnimatePresence>
            {notifDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full mt-2 w-72 rounded-xl border border-white/10 bg-navy/95 p-4 shadow-2xl backdrop-blur-xl ${dir === 'rtl' ? 'left-0' : 'right-0'}`}
              >
                <h3 className="font-bold text-white mb-3 pb-2 border-b border-white/10">{dir === 'rtl' ? 'الإشعارات' : 'Notifications'}</h3>
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-white">{dir === 'rtl' ? 'حجز جديد!' : 'New Booking!'}</span>
                    <span className="text-xs text-slate-400">Ahmed Hassan - Royal Honeymoon</span>
                    <span className="text-xs text-cyan">2 mins ago</span>
                  </div>
                  <div className="flex flex-col gap-1 opacity-60">
                    <span className="text-sm font-semibold text-white">{dir === 'rtl' ? 'تم الدفع' : 'Payment Received'}</span>
                    <span className="text-xs text-slate-400">Booking #BKG-548123</span>
                    <span className="text-xs text-cyan">1 hour ago</span>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifDropdownOpen(false)}
                  className="w-full mt-4 py-2 rounded-lg bg-white/5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {dir === 'rtl' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile */}
        <div className="ml-2 flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="hidden flex-col text-right sm:flex">
            <span className="text-sm font-bold text-white">Admin User</span>
            <span className="text-xs font-medium uppercase tracking-widest text-cyan">Manager</span>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan to-blue-600 text-sm font-black text-white shadow-lg">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
