'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Send,
  CreditCard,
  Shield,
} from 'lucide-react'
import { useI18n } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  Wave SVG Icon (brand mark – same as Navbar)                        */
/* ------------------------------------------------------------------ */

function WaveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sun circle */}
      <circle cx="20" cy="12" r="5" fill="currentColor" opacity="0.9" />
      {/* Three wave lines */}
      <path
        d="M4 24c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 30c3-4 6 4 9 0s6 4 9 0 6 4 9 0 6 4 9 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.15 1.56.76 3.01 1.76 4.14 1.14 1.25 2.64 1.94 4.3 2.15v4.06c-1.52-.08-2.99-.48-4.32-1.16-.62-.31-1.19-.7-1.69-1.15v7.41c-.04 2.1-.81 4.1-2.18 5.64-1.4 1.58-3.32 2.52-5.41 2.66-2.11.14-4.2-.47-5.83-1.7-1.61-1.22-2.61-3.03-2.8-5.08-.18-2.03.47-4.06 1.83-5.55 1.34-1.48 3.23-2.4 5.3-2.58v4.18c-1.07.12-2.08.6-2.82 1.35-.74.75-1.18 1.74-1.22 2.81-.04 1.05.34 2.06 1.05 2.83.71.77 1.68 1.25 2.72 1.35 1.06.1 2.12-.22 2.94-.88.8-.64 1.3-1.56 1.38-2.58h-.02v-17z"/>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Social Icon Button                                                  */
/* ------------------------------------------------------------------ */

const socialLinks = [
  { icon: Facebook, href: 'https://www.facebook.com/dahabdreamtour', label: 'Facebook' },
  { icon: Instagram, href: 'https://www.instagram.com/dahab.dream.tour/', label: 'Instagram' },
  { icon: Send, href: 'https://t.me/+dTDLRWJSpDYxYmY0', label: 'Telegram' },
  // { icon: Linkedin, href: 'https://www.linkedin.com/in/dahab-dream-tour-692822287/', label: 'LinkedIn' },
  { icon: TikTokIcon, href: 'https://tiktok.com/@dahabdreamtour', label: 'TikTok' },
  // { icon: Youtube, href: 'https://www.youtube.com/@Dahab-dream', label: 'YouTube' },
] as const

function SocialIcon({ icon: Icon, href, label }: (typeof socialLinks)[number]) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-slate-400 backdrop-blur-sm transition-all duration-300 hover:bg-cyan/15 hover:text-cyan hover:shadow-[0_0_16px_rgba(0,212,255,0.2)]"
    >
      <Icon className="size-4" />
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  Footer Link                                                         */
/* ------------------------------------------------------------------ */

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-slate-400 transition-colors duration-300 hover:text-cyan"
      >
        {children}
      </a>
    </li>
  )
}

/* ------------------------------------------------------------------ */
/*  Payment Badge                                                       */
/* ------------------------------------------------------------------ */

const paymentBadges = [
  {
    name: 'Visa',
    svg: (
      <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#1A1F71" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial">VISA</text>
      </svg>
    ),
  },
  {
    name: 'Mastercard',
    svg: (
      <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#1A1A1A" />
        <circle cx="19" cy="16" r="8" fill="#EB001B" opacity="0.9" />
        <circle cx="29" cy="16" r="8" fill="#F79E1B" opacity="0.9" />
        <path d="M24 9.5a8 8 0 010 13" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: 'PayPal',
    svg: (
      <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#003087" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">PayPal</text>
      </svg>
    ),
  },
  {
    name: 'Apple Pay',
    svg: (
      <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="32" rx="4" fill="#1D1D1F" />
        <text x="24" y="19" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">&#63743;</text>
      </svg>
    ),
  },
] as const

/* ------------------------------------------------------------------ */
/*  Animation Variants                                                  */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="relative w-full bg-[#0A192F] keep-dark">
      {/* Top gradient divider */}
      <div className="section-divider" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8"
      >
        {/* ── 4-Column Grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            {/* Logo */}
            <a href="#home" className="mb-4 inline-flex items-center justify-center no-underline">
              <div className="relative flex h-16 w-16 md:h-20 md:w-20 rounded-md overflow-hidden shadow-lg border border-cyan/20">
                <Image src="/images/image.png" alt="Dahab Dream Tour" fill className="object-cover" />
              </div>
            </a>

            {/* Description */}
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {t('footer.description')}
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <SocialIcon key={social.label} {...social} />
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.quickLinks')}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="#home">{t('nav.home')}</FooterLink>
              <FooterLink href="#about">{t('nav.about')}</FooterLink>
              <FooterLink href="#contact">{t('nav.contact')}</FooterLink>
              <FooterLink href="#">Blog</FooterLink>
            </ul>
          </motion.div>

          {/* Column 3: Destinations */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.destinations')}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="#destinations">{t('dahab.name')}</FooterLink>
              <FooterLink href="#destinations">{t('hurghada.name')}</FooterLink>
              <FooterLink href="#destinations">{t('sharm.name')}</FooterLink>
            </ul>
          </motion.div>

          {/* Column 4: Support & Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.support')}
            </h4>
            <ul className="flex flex-col gap-2.5">
              <FooterLink href="#">FAQ</FooterLink>
              <FooterLink href="#">{t('footer.privacy')}</FooterLink>
              <FooterLink href="#">{t('footer.terms')}</FooterLink>
              <FooterLink href="#">{t('footer.cookies')}</FooterLink>
            </ul>
          </motion.div>
        </div>

        {/* ── Bottom Bar ─────────────────────────────────────────────── */}
        <div className="mt-14">
          <div className="section-divider" />

          <div className="mt-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            {/* Copyright */}
            <p className="text-center text-xs text-slate-500 md:text-left">
              © 2025 Dahab Dream Tour. {t('footer.rights')}.
            </p>

            {/* Payment + security icons */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {paymentBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className="flex h-8 items-center rounded bg-white/5 px-1.5 transition-colors hover:bg-white/10"
                  >
                    {badge.svg}
                  </div>
                ))}
              </div>
              <div className="ml-1 flex items-center gap-1 text-slate-500" title="Secure payments">
                <Shield className="size-4" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
