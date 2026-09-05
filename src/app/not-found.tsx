'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-navy text-foreground overflow-hidden px-4">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[350px] h-[350px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Animated Icon & Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="relative inline-flex items-center justify-center size-28 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-cyan/10"
        >
          <Compass className="size-14 text-cyan animate-pulse" />
          <span className="absolute -top-3 -right-3 px-3 py-1 bg-cyan text-navy font-extrabold text-xs rounded-full shadow-lg">
            404
          </span>
        </motion.div>

        {/* Heading & Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Destination Not Found
          </h1>
          <p className="text-foreground/60 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Oops! It seems you&apos;ve wandered off the map. The page or trip destination you are looking for doesn&apos;t exist or has been relocated.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
        >
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan text-navy font-bold hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="size-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
