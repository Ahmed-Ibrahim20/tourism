'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Map, 
  Package, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onLogoutClick: () => void;
}

export default function Sidebar({ isCollapsed, toggleCollapse, onLogoutClick }: SidebarProps) {
  const { t, dir } = useI18n();
  const pathname = usePathname();

  const navItems = [
    { name: t('admin.dashboard'), href: '/admin', icon: LayoutDashboard },
    { name: t('admin.bookings'), href: '/admin/bookings', icon: CalendarDays },
    { name: t('admin.destinations'), href: '/admin/destinations', icon: Map },
    { name: t('admin.packages'), href: '/admin/packages', icon: Package },
    { name: t('admin.users'), href: '/admin/users', icon: Users },
    { name: t('admin.settings'), href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      <aside className={`flex h-full flex-col border-white/10 bg-navy/90 backdrop-blur-xl border-r transition-all duration-300 rtl:border-l rtl:border-r-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Brand & Toggle */}
        <div className={`relative flex h-20 items-center border-b border-white/5 ${isCollapsed ? 'justify-center' : 'justify-between px-4'}`}>
          {!isCollapsed && (
            <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20">
                <LayoutDashboard className="size-5 text-cyan" />
              </div>
              <span className="text-xl font-black uppercase tracking-widest text-white whitespace-nowrap">
                Admin
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/admin" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cyan/10 border border-cyan/20">
              <LayoutDashboard className="size-5 text-cyan" />
            </Link>
          )}

          {/* Toggle Button */}
          <button 
            onClick={toggleCollapse}
            className={`absolute top-6 flex size-8 items-center justify-center rounded-full border border-white/10 bg-navy text-slate-300 transition-colors hover:bg-cyan/10 hover:text-cyan z-50 ${
              dir === 'rtl' 
                ? (isCollapsed ? '-left-4' : 'left-2') 
                : (isCollapsed ? '-right-4' : 'right-2')
            }`}
          >
            {isCollapsed ? (
              dir === 'rtl' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />
            ) : (
              dir === 'rtl' ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-2 no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center rounded-xl transition-all duration-300 ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3.5'
                } ${
                  isActive
                    ? 'bg-cyan/10 border border-cyan/20 shadow-[0_0_15px_rgba(0,212,255,0.15)]'
                    : 'border border-transparent hover:bg-white/5 hover:border-white/10'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon
                  className={`size-5 shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-cyan' : 'text-slate-400 group-hover:text-cyan-light'
                  }`}
                />
                {!isCollapsed && (
                  <span
                    className={`text-sm font-bold tracking-wide whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-cyan' : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                )}
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute w-1 h-8 bg-cyan rounded-full ${dir === 'rtl' ? 'right-0' : 'left-0'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer / Logout */}
        <div className="border-t border-white/5 p-3">
          <button
            onClick={onLogoutClick}
            className={`group relative flex w-full items-center rounded-xl border border-transparent transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/20 ${
              isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3.5'
            }`}
            title={isCollapsed ? t('nav.logout') : undefined}
          >
            <LogOut className="size-5 shrink-0 text-slate-400 transition-colors duration-300 group-hover:text-red-400" />
            {!isCollapsed && (
              <span className="text-sm font-bold tracking-wide text-slate-300 whitespace-nowrap transition-colors duration-300 group-hover:text-red-400">
                {t('nav.logout')}
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
