'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { Star, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Package } from '@/services/api'
import { Product } from '@/lib/mockData'

interface ProductCardProps {
  product: any
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { t, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const cardRef = useRef<HTMLDivElement>(null)

  // Normalise product fields
  const title = (product as any).name || ((product as any).titleKey ? t((product as any).titleKey) : '')
  const rawImage = (product as any).cover_url || (product as any).image || '/images/hero/01-giza.jpg'
  const [imgSrc, setImgSrc] = useState<string>(rawImage)
  const price = (product as any).min_price ?? (product as any).price ?? 150
  const currency = (product as any).currency || '$'
  const category = (product as any).package_type || (product as any).category || (product as any).service?.category?.slug || 'tours'
  const location = (product as any).destination?.name || (product as any).location || (isRTL ? 'مصر' : 'Egypt')
  const duration = (product as any).duration_label || (product as any).duration || (isRTL ? 'رحلة خاصة' : 'Private Tour')
  const description = (product as any).short_description || ((product as any).descriptionKey ? t((product as any).descriptionKey) : '')
  const slugOrId = (product as any).slug || (product as any).id

  // Mouse move effect for shine
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const categoryLabel = {
    honeymoon: isRTL ? 'شهر العسل' : 'Honeymoon',
    hotels: isRTL ? 'فنادق فاخرة' : 'Luxury Hotel',
    tours: isRTL ? 'رحلات خاصة' : 'Private Tours',
    experiences: isRTL ? 'تجارب مميزة' : 'Experience',
  }[category] || (t(`category.${category}`) || category)

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-navy-light/40 backdrop-blur-xl transition-all duration-500 hover:border-cyan/40 hover:shadow-[0_20px_50px_rgba(0,212,255,0.15)] hover:-translate-y-1.5"
    >
      {/* Shine Overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(0,212,255,0.06), transparent 70%)`,
        }}
      />

      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-navy-light">
        <Image
          src={imgSrc}
          alt={title}
          fill
          unoptimized
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => {
            const fallback = '/images/hero/01-giza.jpg';
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-90" />

        {/* Category Tag */}
        <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-20`}>
          <span className="flex items-center gap-1.5 rounded-full bg-navy/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan backdrop-blur-md border border-cyan/30 shadow-lg">
            <Sparkles className="h-3 w-3 text-cyan" />
            {categoryLabel}
          </span>
        </div>


        {/* Price Floating Tag */}
        <div className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} z-20`}>
          <div className="rounded-2xl bg-navy/85 px-3.5 py-1.5 backdrop-blur-md border border-white/15 shadow-xl">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">{isRTL ? 'يبدأ من' : 'From'}</p>
            <p className="text-lg font-black text-white leading-none">
              <span className="text-cyan font-bold text-sm mr-0.5">{currency}</span>
              {Number(price).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Location Tag on Image */}
        <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'} z-20 flex items-center gap-1 text-[11px] font-bold text-white/90 drop-shadow-md`}>
          <MapPin className="h-3.5 w-3.5 text-cyan shrink-0" />
          <span>{location}</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        {/* Rating & Duration */}
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-white">5.0</span>
          </div>

          {duration && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <Clock className="h-3 w-3 text-cyan shrink-0" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold text-white group-hover:text-cyan-light transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mb-5 line-clamp-2 text-xs text-slate-400 leading-relaxed font-normal">
            {description}
          </p>
        )}

        {/* CTA Button */}
        <div className="mt-auto pt-3 border-t border-white/5">
          <Link href={`/product/${slugOrId}?location=${encodeURIComponent(location)}`} className="block">
            <Button
              className="w-full h-11 rounded-2xl bg-white/10 hover:bg-cyan text-white hover:text-navy font-bold text-xs uppercase tracking-wider transition-all duration-300 border border-white/10 hover:border-cyan hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] group/btn"
            >
              <span className="flex items-center justify-center gap-2">
                <span>{isRTL ? 'عرض التفاصيل والحجز' : 'View Details & Book'}</span>
                <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
