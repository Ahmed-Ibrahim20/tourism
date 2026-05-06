'use client'

import { Filter, Star, Check, Search, X, ChevronRight } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { Checkbox } from '@/components/ui/checkbox'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterSidebarProps {
  priceRange: [number, number]
  setPriceRange: (val: [number, number]) => void
  selectedCategories: string[]
  setSelectedCategories: (val: string[]) => void
  selectedRatings: number[]
  setSelectedRatings: (val: number[]) => void
  searchQuery: string
  setSearchQuery: (val: string) => void
  onReset: () => void
}

const CATEGORIES = ['hotels', 'honeymoon', 'tours']

export default function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedRatings,
  setSelectedRatings,
  searchQuery,
  setSearchQuery,
  onReset,
}: FilterSidebarProps) {
  const { t } = useI18n()

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat))
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  const toggleRating = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating))
    } else {
      setSelectedRatings([...selectedRatings, rating])
    }
  }

  return (
    <div className="flex flex-col gap-12">
      {/* ─── Premium Filter Header ─── */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-cyan/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-navy border border-cyan/30 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.2),transparent)]" />
              <Filter className="relative size-6 text-cyan" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white leading-none mb-1 uppercase italic">{t('search.filter')}</h2>
            <p className="text-[10px] font-black text-cyan/50 uppercase tracking-[0.4em]">Curated Search</p>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="group relative px-4 py-2"
        >
          <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-cyan transition-colors">
            {t('filter.reset')}
          </span>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-cyan shadow-[0_0_10px_rgba(0,212,255,0.8)] group-hover:w-full transition-all duration-500" />
        </button>
      </div>

      {/* ─── Futuristic Search Field ─── */}
      <div className="relative group px-2">
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan/20 via-purple-500/10 to-cyan/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition duration-700" />
        <div className="relative flex items-center">
          <div className="absolute left-5 text-cyan/40 group-focus-within:text-cyan transition-colors">
            <Search className="size-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-3xl pl-14 pr-12 text-white text-sm font-bold outline-none focus:border-cyan/40 focus:bg-white/[0.05] transition-all placeholder:text-slate-600 shadow-inner"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-4 h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors border border-white/5"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'price', 'rating']} className="w-full space-y-4">
        {/* Categories Section */}
        <AccordionItem value="categories" className="border-none bg-gradient-to-b from-white/[0.04] to-transparent rounded-[2.5rem] px-6 py-2 border border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <AccordionTrigger className="py-5 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-cyan hover:no-underline transition-all [&[data-state=open]>svg]:rotate-90">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
              {t('search.categories')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-8">
            <div className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`group relative flex items-center justify-between rounded-[1.5rem] border px-6 py-5 transition-all duration-500 ${
                    selectedCategories.includes(cat)
                      ? 'border-cyan/40 bg-cyan/10 text-cyan shadow-[0_15px_40px_rgba(0,212,255,0.2)]'
                      : 'border-white/[0.04] bg-white/[0.02] text-slate-500 hover:border-white/20 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full transition-all duration-500 ${selectedCategories.includes(cat) ? 'bg-cyan shadow-[0_0_10px_rgba(0,212,255,1)] scale-150' : 'bg-white/10'}`} />
                    <span className="text-[13px] font-black tracking-widest uppercase">{t(`category.${cat}`)}</span>
                  </div>
                  
                  <div className={`flex h-7 w-7 items-center justify-center rounded-2xl border-2 transition-all duration-700 ${
                    selectedCategories.includes(cat) ? 'border-cyan bg-cyan text-navy rotate-0' : 'border-white/10 group-hover:border-cyan/30 rotate-45'
                  }`}>
                    {selectedCategories.includes(cat) ? <Check className="size-3.5 stroke-[4px]" /> : <ChevronRight className="size-4 opacity-0 group-hover:opacity-100" />}
                  </div>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Section */}
        <AccordionItem value="price" className="border-none bg-gradient-to-b from-white/[0.04] to-transparent rounded-[2.5rem] px-6 py-2 border border-white/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <AccordionTrigger className="py-5 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-cyan hover:no-underline transition-all [&[data-state=open]>svg]:rotate-90">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
              {t('search.priceRange')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-6 pb-10">
            <div className="mb-10 flex items-center justify-between gap-6 relative">
              <div className="flex-1 flex flex-col gap-2 group">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] text-center">Min Price</span>
                <div className="relative rounded-xl bg-white/[0.03] px-4 py-4 border border-white/[0.05] text-center overflow-hidden group-hover:border-cyan/30 transition-colors">
                  <span className="relative text-base font-black text-white tabular-nums italic">${priceRange[0]}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-col items-center gap-1">
                <div className="h-1 w-1 rounded-full bg-cyan/20" />
                <div className="h-1 w-1 rounded-full bg-cyan/20" />
              </div>
              <div className="flex-1 flex flex-col gap-2 group">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] text-center">Max Price</span>
                <div className="relative rounded-xl bg-white/[0.03] px-4 py-4 border border-white/[0.05] text-center overflow-hidden group-hover:border-cyan/30 transition-colors">
                  <span className="relative text-base font-black text-white tabular-nums italic">${priceRange[1]}</span>
                </div>
              </div>
            </div>
            <div className="px-2">
              <Slider.Root
                className="relative flex h-6 w-full touch-none select-none items-center"
                value={priceRange}
                max={2000}
                step={50}
                onValueChange={(val) => setPriceRange(val as [number, number])}
              >
                <Slider.Track className="relative h-1.5 grow rounded-full bg-white/5 overflow-hidden">
                  <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-cyan/20 via-cyan to-cyan/20" />
                </Slider.Track>
                <Slider.Thumb
                  className="block size-7 rounded-full border-4 border-navy bg-cyan shadow-[0_0_20px_rgba(0,212,255,0.7)] transition-all hover:scale-125 focus:outline-none cursor-pointer"
                  aria-label="Min price"
                />
                <Slider.Thumb
                  className="block size-7 rounded-full border-4 border-navy bg-cyan shadow-[0_0_20px_rgba(0,212,255,0.7)] transition-all hover:scale-125 focus:outline-none cursor-pointer"
                  aria-label="Max price"
                />
              </Slider.Root>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating Section */}
        <AccordionItem value="rating" className="border-none bg-gradient-to-b from-white/[0.04] to-transparent rounded-[2.5rem] px-6 py-2 border border-white/[0.05] shadow-[0_20px_50_rgba(0,0,0,0.3)]">
          <AccordionTrigger className="py-5 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-cyan hover:no-underline transition-all [&[data-state=open]>svg]:rotate-90">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
              {t('search.starRating')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-10">
            <div className="flex flex-col gap-3">
              {[5, 4, 3].map((rating) => (
                <label
                  key={rating}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-[1.5rem] px-6 py-5 transition-all duration-500 ${
                    selectedRatings.includes(rating) 
                      ? 'bg-cyan/10 border border-cyan/40 shadow-[0_0_40px_rgba(0,212,255,0.1)]' 
                      : 'hover:bg-white/[0.03] border border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <Checkbox
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={() => toggleRating(rating)}
                      className="size-6 border-white/10 data-[state=checked]:bg-cyan data-[state=checked]:border-cyan rounded-xl transition-all group-hover:scale-110 shadow-inner"
                    />
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-4 transition-all duration-700 ${
                            i < rating 
                              ? selectedRatings.includes(rating)
                                ? 'fill-cyan text-cyan drop-shadow-[0_0_10px_rgba(0,212,255,0.6)] scale-110' 
                                : 'fill-cyan/40 text-cyan/40'
                              : 'text-white/5'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border transition-all duration-500 ${selectedRatings.includes(rating) ? 'border-cyan text-cyan bg-cyan/10' : 'border-white/5 text-slate-600'}`}>
                    <span className="text-[11px] font-black tracking-widest">{rating}.0</span>
                  </div>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Mobile Global CTA */}
      <div className="mt-8 lg:hidden px-2">
        <Button className="group relative w-full h-20 rounded-[2.5rem] bg-white text-navy font-black tracking-[0.3em] uppercase text-lg overflow-hidden shadow-[0_30px_60px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.02] active:scale-95">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10">{t('filter.apply')}</span>
        </Button>
      </div>
    </div>
  )
}