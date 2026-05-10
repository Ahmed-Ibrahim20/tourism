'use client'

import { Filter, Star, Check, Search, X, ChevronRight } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { Checkbox } from '@/components/ui/checkbox'
import { useI18n } from '@/lib/i18n'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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

const CATEGORIES = ['all', 'hotels', 'honeymoon', 'tours']

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
  const { t, dir } = useI18n()

  const toggleCategory = (cat: string) => {
    if (cat === 'all') {
      setSelectedCategories([])
      return
    }

    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat))
    } else {
      setSelectedCategories([...selectedCategories, cat])
    }
  }

  const isCategorySelected = (cat: string) => {
    if (cat === 'all') return selectedCategories.length === 0
    return selectedCategories.includes(cat)
  }

  const toggleRating = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating))
    } else {
      setSelectedRatings([...selectedRatings, rating])
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Filter className="size-4 text-cyan" />
          <h2 className="text-sm font-black tracking-widest text-white uppercase">{t('search.filter')}</h2>
        </div>
        
        <button
          onClick={onReset}
          className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-cyan transition-colors"
        >
          {t('filter.reset')}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative group">
        <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-cyan transition-colors`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('nav.search') + "..."}
          className={`w-full h-12 bg-white/[0.02] border border-white/10 rounded-xl ${dir === 'rtl' ? 'pr-11 pl-10' : 'pl-11 pr-10'} text-white text-sm font-medium outline-none focus:border-cyan/20 focus:bg-white/[0.04] transition-all placeholder:text-slate-600`}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className={`absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-500 hover:text-white`}
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'price', 'rating']} className="space-y-2">
        {/* Categories */}
        <AccordionItem value="categories" className="border-none">
          <AccordionTrigger className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:no-underline transition-colors">
            {t('search.categories')}
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-col gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 transition-all ${
                    isCategorySelected(cat)
                      ? 'bg-cyan/10 text-cyan border border-cyan/20'
                      : 'bg-white/[0.01] border border-white/[0.03] text-slate-500 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider">{t(`category.${cat}`)}</span>
                  {isCategorySelected(cat) && <Check className="size-3.5 stroke-[3px]" />}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:no-underline transition-colors">
            {t('search.priceRange')}
          </AccordionTrigger>
          <AccordionContent className="pt-4 px-1">
            <div className={`flex items-center justify-between mb-8 text-[10px] font-black text-slate-500 tabular-nums uppercase tracking-widest ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex flex-col gap-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <span className="text-[8px] text-slate-600">{dir === 'rtl' ? 'الأقل' : 'Min'}</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white">${priceRange[0]}</span>
              </div>
              <div className="h-px w-4 bg-white/10 mt-4" />
              <div className={`flex flex-col gap-1 ${dir === 'rtl' ? 'text-left' : 'text-right'}`}>
                <span className="text-[8px] text-slate-600">{dir === 'rtl' ? 'الأقصى' : 'Max'}</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white">${priceRange[1]}</span>
              </div>
            </div>
            <Slider.Root
              className="relative flex h-5 w-full touch-none select-none items-center"
              value={priceRange}
              max={2000}
              step={50}
              onValueChange={(val) => setPriceRange(val as [number, number])}
            >
              <Slider.Track className="relative h-1 grow rounded-full bg-white/10">
                <Slider.Range className="absolute h-full rounded-full bg-cyan shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
              </Slider.Track>
              <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-navy bg-white shadow-xl focus:outline-none cursor-pointer transition-transform hover:scale-120 active:scale-90" />
              <Slider.Thumb className="block h-5 w-5 rounded-full border-2 border-navy bg-white shadow-xl focus:outline-none cursor-pointer transition-transform hover:scale-120 active:scale-90" />
            </Slider.Root>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating" className="border-none">
          <AccordionTrigger className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white hover:no-underline transition-colors">
            {t('search.starRating')}
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-col gap-1.5">
              {[5, 4, 3].map((rating) => (
                <div
                  key={rating}
                  onClick={() => toggleRating(rating)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all ${
                    selectedRatings.includes(rating) 
                      ? 'bg-cyan/10 border border-cyan/20' 
                      : 'bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={() => toggleRating(rating)}
                      className="size-5 border-white/20 data-[state=checked]:bg-cyan data-[state=checked]:border-cyan rounded-lg"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`size-3 ${i < rating ? 'fill-cyan text-cyan' : 'text-white/5'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-slate-600">{rating}.0</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}