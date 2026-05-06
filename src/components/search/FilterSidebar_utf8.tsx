'use client'

import { motion } from 'framer-motion'
import { Filter, Star, Search, X, ChevronDown, Check } from 'lucide-react'
import * as Slider from '@radix-ui/react-slider'
import { Checkbox } from '@/components/ui/checkbox'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface FilterSidebarProps {
  priceRange: [number, number]
  setPriceRange: (val: [number, number]) => void
  selectedCategories: string[]
  setSelectedCategories: (val: string[]) => void
  selectedRatings: number[]
  setSelectedRatings: (val: number[]) => void
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan">
            <Filter className="size-5" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-white">{t('search.filter')}</h2>
        </div>
        <button
          onClick={onReset}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan/50 transition-all hover:text-cyan hover:tracking-[0.3em]"
        >
          {t('filter.reset')}
        </button>
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'price', 'rating']} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories" className="border-cyan/10">
          <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-cyan hover:no-underline">
            {t('search.categories')}
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-col gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`group flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-300 ${
                    selectedCategories.includes(cat)
                      ? 'border-cyan/40 bg-cyan/10 text-cyan shadow-[0_0_20px_rgba(0,212,255,0.1)]'
                      : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[13px] font-bold tracking-wide">{t(`category.${cat}`)}</span>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                    selectedCategories.includes(cat) ? 'border-cyan bg-cyan text-navy' : 'border-white/10'
                  }`}>
                    {selectedCategories.includes(cat) && <Check className="size-3 stroke-[4px]" />}
                  </div>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-cyan/10">
          <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-cyan hover:no-underline">
            {t('search.priceRange')}
          </AccordionTrigger>
          <AccordionContent className="pt-6 pb-4">
            <div className="mb-6 flex items-center justify-between">
              <div className="rounded-lg bg-white/5 px-3 py-1.5 border border-white/10">
                <span className="text-xs font-bold text-cyan">${priceRange[0]}</span>
              </div>
              <div className="h-px w-4 bg-white/10" />
              <div className="rounded-lg bg-white/5 px-3 py-1.5 border border-white/10">
                <span className="text-xs font-bold text-cyan">${priceRange[1]}</span>
              </div>
            </div>
            <div className="px-2">
              <Slider.Root
                className="relative flex h-5 w-full touch-none select-none items-center"
                value={priceRange}
                max={2000}
                step={50}
                onValueChange={(val) => setPriceRange(val as [number, number])}
              >
                <Slider.Track className="relative h-1.5 grow rounded-full bg-white/10">
                  <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-cyan/50 to-cyan" />
                </Slider.Track>
                <Slider.Thumb
                  className="block size-5 rounded-full border-2 border-cyan bg-navy shadow-[0_0_10px_rgba(0,212,255,0.4)] transition-transform hover:scale-125 focus:outline-none"
                  aria-label="Min price"
                />
                <Slider.Thumb
                  className="block size-5 rounded-full border-2 border-cyan bg-navy shadow-[0_0_10px_rgba(0,212,255,0.4)] transition-transform hover:scale-125 focus:outline-none"
                  aria-label="Max price"
                />
              </Slider.Root>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating" className="border-cyan/10">
          <AccordionTrigger className="text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-cyan hover:no-underline">
            {t('search.starRating')}
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-col gap-1">
              {[5, 4, 3].map((rating) => (
                <label
                  key={rating}
                  className={`group flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 transition-all hover:bg-white/5 ${
                    selectedRatings.includes(rating) ? 'text-cyan' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={() => toggleRating(rating)}
                      className="size-5 border-white/20 data-[state=checked]:bg-cyan data-[state=checked]:border-cyan"
                    />
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${
                            i < rating ? 'fill-current' : 'text-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[11px] font-black opacity-40 group-hover:opacity-100">{rating}.0</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Mobile CTA */}
      <div className="mt-4 md:hidden">
        <Button className="cta-glow w-full bg-cyan text-navy font-bold h-12 rounded-xl">
          {t('filter.apply')}
        </Button>
      </div>
    </div>
  )
}

