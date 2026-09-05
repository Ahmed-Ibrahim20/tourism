'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';
import AuthGuard from '@/components/auth/AuthGuard';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import { apiService } from '@/services/api';
import { toast } from 'sonner';
import { LogOut, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { dir, t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Tell the backend to revoke the Sanctum token
      await apiService.auth.logout();
    } catch {
      // Even if the request fails (token already expired), we still clear locally
    } finally {
      // Clear Zustand store + localStorage
      logout();
      setShowLogoutModal(false);
      setIsLoggingOut(false);
      toast.success(dir === 'rtl' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully');
      router.replace('/login');
    }
  };

  return (
    // AuthGuard: verifies auth with backend before rendering anything
    <AuthGuard>
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

        {/* ── Logout Confirmation Modal ────────────────────────────────────── */}
        <AnimatePresence>
          {showLogoutModal && (
            <div 
              onClick={() => setShowLogoutModal(false)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 cursor-pointer"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0D2137] p-6 shadow-2xl cursor-default"
                dir={dir}
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                  <LogOut className="h-5 w-5 text-red-400" />
                </div>

                <h3 className="text-lg font-bold text-white mb-1">
                  {dir === 'rtl' ? 'تسجيل الخروج' : 'Sign Out'}
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {dir === 'rtl'
                    ? 'هل أنت متأكد أنك تريد تسجيل الخروج من لوحة التحكم؟ سيتم إنهاء جلستك الحالية.'
                    : 'Are you sure you want to sign out? Your current session will be terminated.'}
                </p>

                <div className="flex items-center gap-3 justify-end">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    disabled={isLoggingOut}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/5 transition-colors disabled:opacity-50"
                  >
                    {dir === 'rtl' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {dir === 'rtl' ? 'جاري الخروج...' : 'Signing out…'}
                      </>
                    ) : (
                      dir === 'rtl' ? 'نعم، تسجيل خروج' : 'Yes, Sign Out'
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AuthGuard>
  );
}
