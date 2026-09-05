'use client';

import { useAdminAuth } from '@/hooks/useAdminAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Wraps admin pages. Renders a full-screen loading screen while verifying
 * the user's identity & role with the backend. Redirects automatically on
 * any auth failure — children are NEVER rendered for unauthorized users.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isVerified, isLoading } = useAdminAuth();

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="auth-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A192F]"
          >
            {/* Animated background glows */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan/5 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full animate-pulse delay-700" />

            {/* Spinner card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="relative z-10 flex flex-col items-center gap-6"
            >
              {/* Shield icon with spinner ring */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-cyan/20 animate-ping" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10 backdrop-blur-xl shadow-[0_0_40px_rgba(0,229,255,0.15)]">
                  <Shield className="h-8 w-8 text-cyan" />
                </div>
              </div>

              {/* Spinner */}
              <Loader2 className="h-5 w-5 text-cyan/60 animate-spin" />

              {/* Text */}
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold text-white/80 tracking-wide">
                  Verifying Access
                </p>
                <p className="text-xs text-slate-500">
                  Authenticating your session with the server…
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Only render children once backend verification passes */}
      {isVerified && children}
    </>
  );
}
