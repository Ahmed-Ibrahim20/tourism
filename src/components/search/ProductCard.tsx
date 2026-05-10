'use client'

import { useRef } from 'react'
import { motion, useMotionValue } from 'framer-motion'
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl transition-all duration-300 hover:border-cyan/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
    >
      {/* Shine Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(0,212,255,0.08), transparent 60%)`,
        }}
      />

      {/* Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={product.image}
          alt={t(product.titleKey)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className={`absolute top-2 sm:top-4 ${dir === 'rtl' ? 'right-2 sm:right-4' : 'left-2 sm:left-4'} z-20`}>
          <span className="flex items-center gap-1.5 rounded-full bg-navy/80 px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-cyan backdrop-blur-md border border-cyan/20">
            <Sparkles className="size-2 sm:size-3" />
            {t(`category.${product.category}`)}
          </span>
        </div>

        {/* Price Tag */}
        <div className={`absolute bottom-2 sm:bottom-4 ${dir === 'rtl' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'} z-20`}>
          <div className="text-right">
            <p className="text-[8px] sm:text-[10px] font-bold text-cyan/70 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">{t('from')}</p>
            <p className="text-lg sm:text-2xl font-black text-white leading-none">${product.price}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-3 sm:p-5 lg:p-6">
        <div className="mb-2 sm:mb-3 flex items-center justify-between">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`size-2.5 sm:size-3 ${i < product.rating ? 'fill-cyan text-cyan' : 'text-white/10'}`}
              />
            ))}
          </div>
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {product.duration || 'Daily'}
          </span>
        </div>

        <h3 className="mb-1.5 text-sm sm:text-lg lg:text-xl font-black tracking-tight text-white group-hover:text-cyan transition-colors line-clamp-1">
          {t(product.titleKey)}
        </h3>

        <p className="mb-4 sm:mb-6 line-clamp-2 text-[10px] sm:text-xs leading-relaxed text-slate-400 font-medium">
          {product.descriptionKey ? t(product.descriptionKey) : t('hero.subheadline.' + product.titleKey.split('.').pop())}
        </p>

        {/* Info Row */}
        <div className="mb-4 sm:mb-6 flex items-center justify-between border-t border-white/5 pt-3 sm:pt-5">
          <div className="flex items-center gap-1.5 text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
            <MapPin className="size-2.5 sm:size-3 text-cyan flex-shrink-0" />
            <span className="truncate">{product.locationKey ? t(product.locationKey) : product.location}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link href={`/product/${product.id}?location=${encodeURIComponent(product.location)}`} className="block">
            <Button
              className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl bg-white text-navy font-black text-[10px] sm:text-xs uppercase tracking-wider hover:bg-cyan hover:text-navy transition-all duration-300 group/btn"
            >
              <span className="flex items-center gap-2">
                {t('destinations.bookNow')}
                <ArrowRight className={`size-3 sm:size-4 transition-transform duration-300 ${dir === 'rtl' ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
