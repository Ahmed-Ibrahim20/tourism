'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { t } = useI18n()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-navy selection:bg-cyan/30">
      {/* ── Visual Side (Logo/Brand) ─────────────────────────────────── */}
      <div className="relative hidden md:flex md:w-1/2 lg:w-[55%] items-center justify-center overflow-hidden bg-[#07111D]">
        {/* Animated Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-royal-blue/10 blur-[150px] rounded-full" />
        
        {/* Brand Mark Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="relative h-48 w-48 lg:h-64 lg:w-64 mb-8">
            <div className="absolute inset-0 rounded-[2.5rem] bg-cyan/10 blur-3xl animate-pulse" />
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl">
              <Image 
                src="/images/image.png" 
                alt="Dahab Dream Tour" 
                fill 
                className="object-cover p-4 lg:p-6" 
                priority
              />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight text-center px-8 leading-tight">
            {t('brand.name')}
          </h2>
          <p className="mt-4 text-cyan/60 font-medium tracking-[0.2em] uppercase text-xs">
            {t('hero.tagline')}
          </p>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        </div>
      </div>

      {/* ── Form Side ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 relative">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden mb-12 flex flex-col items-center">
          <Link href="/">
             <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/10 shadow-xl mb-4">
                <Image src="/images/image.png" alt="Logo" fill className="object-cover" />
             </div>
          </Link>
          <h2 className="text-xl font-bold text-white">{t('brand.name')}</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col mb-10">
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">
              {title}
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="relative">
            {children}
          </div>

          {/* Footer actions */}
          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
            <Link href="/" className="text-sm font-medium text-slate-500 hover:text-cyan transition-colors flex items-center gap-2">
              <span className="text-lg">←</span> {t('nav.home')}
            </Link>
            <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Dahab Dream
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
