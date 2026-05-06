'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { Star, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Product } from '@/lib/mockData'

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { t, dir } = useI18n()
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse move effect for shine
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10 }}
      className="glass-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-cyan/10 bg-navy-light/30 backdrop-blur-2xl transition-all duration-500 hover:border-cyan/40 hover:shadow-[0_30px_100px_rgba(0,212,255,0.2)]"
    >
      {/* Shine Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(0,212,255,0.15), transparent 40%)`,
        }}
      />

      {/* Image Section with Parallax */}
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <motion.div 
          className="h-full w-full"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <Image
            src={product.image}
            alt={t(product.titleKey)}
            fill
            className="object-cover"
          />
        </motion.div>
        
        <div className="destination-overlay absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute left-6 top-6 z-20 flex flex-col gap-2">
          <span className="flex items-center gap-2 rounded-full bg-navy/60 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan backdrop-blur-xl border border-cyan/20">
            <Sparkles className="size-3" />
            {t(`category.${product.category}`)}
          </span>
        </div>

        {/* Price Tag - Floating Style */}
        <div className="absolute bottom-6 right-6 z-20">
          <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-xl border border-white/20 shadow-2xl">
            <p className="text-[10px] font-bold text-cyan/70 uppercase tracking-widest">{t('from')}</p>
            <p className="text-2xl font-black text-white leading-none">
              ${product.price}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-1 flex-col p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-3.5 ${
                  i < product.rating 
                    ? 'fill-cyan text-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]' 
                    : 'text-cyan/10'
                }`}
              />
            ))}
          </div>
          {product.duration && (
            <span className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-400">
              {product.duration}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-2xl font-black tracking-tight text-white transition-colors duration-300 group-hover:text-cyan">
          {t(product.titleKey)}
        </h3>

        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-slate-500 font-medium">
          Experience the ultimate luxury at {t(product.titleKey)}. Located in the heart of {product.location}, this {product.category} offers world-class amenities and breathtaking views.
        </p>

        <div className="mb-8 flex items-center justify-between border-t border-white/5 pt-6">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
              <MapPin className="size-3.5" />
            </div>
            {product.location}
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-cyan uppercase tracking-widest">
            <Clock className="size-3.5" />
            {product.duration || 'Flexible'}
          </div>
        </div>

        <div className="mt-auto">
          <Link href={`/product/${product.id}`}>
            <Button
              className="cta-glow w-full group/btn relative h-14 overflow-hidden rounded-2xl border border-cyan/40 bg-cyan/10 text-lg font-black tracking-wider text-cyan transition-all duration-500 hover:bg-cyan/30 hover:border-cyan/60"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {t('destinations.bookNow')}
                <ArrowRight className={`size-5 transition-transform duration-500 ${dir === 'rtl' ? 'rotate-180 group-hover/btn:-translate-x-2' : 'group-hover/btn:translate-x-2'}`} />
              </span>
              
              {/* Animated background glow inside button */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
