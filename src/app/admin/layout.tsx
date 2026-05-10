'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import { useI18n } from '@/lib/i18n';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { dir, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <div className="flex h-screen bg-[#0A192F] selection:bg-cyan/30" dir={dir}>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div 
        className={`fixed inset-y-0 z-40 transform transition-all duration-300 ease-in-out md:static md:translate-x-0 shrink-0 ${
          mobileMenuOpen 
            ? 'translate-x-0' 
            : dir === 'rtl' ? 'translate-x-full' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
          onLogoutClick={() => setShowLogoutModal(true)}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-[#0A192F]/50 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-navy p-6 shadow-2xl"
              dir={dir}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {dir === 'rtl' ? 'تسجيل الخروج' : 'Log Out'}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                {dir === 'rtl' ? 'هل أنت متأكد أنك تريد تسجيل الخروج من لوحة التحكم؟' : 'Are you sure you want to log out of the dashboard?'}
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors"
                >
                  {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  {dir === 'rtl' ? 'نعم، تسجيل خروج' : 'Yes, Log Out'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
