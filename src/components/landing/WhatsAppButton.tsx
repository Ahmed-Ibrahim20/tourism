'use client'

import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

/* ------------------------------------------------------------------ */
/*  WhatsApp SVG Icon (official logo)                                   */
/* ------------------------------------------------------------------ */

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.742 3.054 9.378L1.054 31.29l6.118-1.962A15.9 15.9 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.314 22.614c-.39 1.1-1.932 2.014-3.168 2.28-.844.18-1.946.324-5.66-1.216-4.752-1.97-7.81-6.81-8.05-7.132-.228-.322-1.828-2.436-1.828-4.646s1.158-3.294 1.568-3.746c.39-.434.852-.544 1.136-.544.284 0 .568.002.814.014.262.014.614-.1.96.732.36.852 1.224 2.984 1.332 3.2.108.216.18.468.036.752-.144.284-.216.46-.432.708-.216.248-.454.554-.648.744-.216.216-.44.452-.19.888.252.434 1.12 1.848 2.404 2.992 1.652 1.478 3.044 1.936 3.48 2.152.432.216.684.18.936-.108.252-.29 1.082-1.26 1.372-1.692.288-.432.576-.36.97-.216.396.144 2.502 1.182 2.934 1.396.432.216.72.324.828.502.108.18.108 1.04-.284 2.14z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  WhatsApp Button                                                     */
/* ------------------------------------------------------------------ */

export default function WhatsAppButton() {
  const { t } = useI18n()

  const whatsappUrl = `https://wa.me/201061558461?text=${encodeURIComponent(
    'Hello! I am interested in booking a trip with Dahab Dream Tour.'
  )}`

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.tooltip')}
      title={t('whatsapp.tooltip')}
      initial={{ y: 80, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 1.2,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="pulse-ring fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#25D366]/40"
    >
      {/* Primary: WhatsApp SVG icon */}
      <WhatsAppIcon className="size-7" />

      {/* Visually hidden fallback icon */}
      <MessageCircle className="sr-only" />
    </motion.a>
  )
}
