'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Search as SearchIcon, SlidersHorizontal, LayoutGrid, List, ChevronDown, MapPin, Compass } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import ProductCard from '@/components/search/ProductCard'
import FilterSidebar from '@/components/search/FilterSidebar'
import { MOCK_PRODUCTS } from '@/lib/mockData'
import { useI18n } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function SearchPage() {
  const { t, dir } = useI18n()
  const searchParams = useSearchParams()
  
  // Mouse position for background glow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // State for filters
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('featured')

  // Initialize filters from URL params
  useEffect(() => {
    const category = searchParams.get('category')
    const location = searchParams.get('location')

    if (category) {
      setSelectedCategories([category])
    }
    if (location) {
      setSearchQuery(location)
    }
  }, [searchParams])

  // Filter logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesSearch = t(product.titleKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating))
      
      return matchesSearch && matchesPrice && matchesCategory && matchesRating
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })
  }, [searchQuery, priceRange, selectedCategories, selectedRatings, sortBy, t])

  const handleReset = () => {
    setSearchQuery('')
    setPriceRange([0, 2000])
    setSelectedCategories([])
    setSelectedRatings([])
    setSortBy('featured')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-navy selection:bg-cyan/30">
      {/* Dynamic Background Glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          background: `radial-gradient(1000px circle at ${springX}px ${springY}px, rgba(0,212,255,0.08), transparent 80%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1700px] px-6 py-12 md:px-12 lg:px-20 lg:py-24">
        {/* Advanced Hero Section */}
        <div className="mb-16 flex flex-col gap-10 lg:mb-24">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/10 backdrop-blur-md">
              <Compass className="size-4 text-cyan animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-light">
                {selectedCategories.length > 0 ? t(`category.${selectedCategories[0]}`) : 'Discover Your Paradise'}
              </span>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="gradient-text text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl"
            >
              {searchQuery ? `${t(`category.${selectedCategories[0] || 'hotels'}`)} ${t('in')} ${searchQuery}` : t('search.title')}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto lg:mx-0 max-w-3xl text-xl font-medium leading-relaxed text-slate-400"
            >
              {t('search.subtitle')}
            </motion.p>
          </div>

          {/* Controls Bar - Elevated Design (Removed Search Input as requested) */}
          <div className="glass-strong flex flex-col gap-4 rounded-[2.5rem] p-4 border border-white/5 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 px-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/10 text-cyan">
                <MapPin className="size-5" />
              </div>
              <p className="text-lg font-bold text-white">
                {searchQuery || 'All Destinations'}
              </p>
            </div>

            <div className="flex items-center gap-3 px-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-16 gap-3 rounded-2xl border-white/10 bg-white/5 px-8 font-black text-white hover:bg-white/10 md:hidden">
                    <SlidersHorizontal className="size-5" />
                    {t('search.filter')}
                  </Button>
                </SheetTrigger>
                <SheetContent side={dir === 'rtl' ? 'right' : 'left'} className="bg-navy border-white/10 w-[340px] p-8">
                  <SheetHeader className="mb-10">
                    <SheetTitle className="text-2xl font-black text-white uppercase tracking-tighter">{t('search.filter')}</SheetTitle>
                  </SheetHeader>
                  <FilterSidebar
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedRatings={selectedRatings}
                    setSelectedRatings={setSelectedRatings}
                    onReset={handleReset}
                  />
                </SheetContent>
              </Sheet>

              <div className="relative hidden sm:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-16 appearance-none rounded-2xl border border-white/10 bg-white/5 pl-8 pr-14 text-sm font-black uppercase tracking-widest text-white outline-none transition-all hover:bg-white/10 focus:border-cyan/30"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-6 top-1/2 size-5 -translate-y-1/2 text-cyan" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout Grid */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          {/* Desktop Sidebar - Premium Style */}
          <aside className="hidden w-full max-w-[340px] lg:block">
            <div className="sticky top-32">
              <div className="glass-strong relative overflow-hidden rounded-[2.5rem] p-10 border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.3)]">
                {/* Decorative glow in sidebar */}
                <div className="absolute -right-20 -top-20 size-40 bg-cyan/10 blur-[80px]" />
                <FilterSidebar
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedRatings={selectedRatings}
                  setSelectedRatings={setSelectedRatings}
                  onReset={handleReset}
                />
              </div>
            </div>
          </aside>

          {/* Main Grid Content */}
          <div className="flex-1">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-1px w-12 bg-cyan/20" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                  {filteredProducts.length} {t('search.resultsFound', { count: filteredProducts.length }).split(' ').slice(1).join(' ')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,212,255,0.1)]">
                  <LayoutGrid className="size-5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-600 hover:text-cyan">
                  <List className="size-5" />
                </Button>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {filteredProducts.map((product, idx) => (
                    <ProductCard key={product.id} product={product} index={idx} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-center"
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 animate-ping rounded-full bg-cyan/10" />
                    <div className="relative flex size-24 items-center justify-center rounded-full bg-white/5 border border-white/10">
                      <SearchIcon className="size-10 text-slate-700" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-white">{t('search.noResults')}</h3>
                  <p className="mt-4 text-slate-500">Try adjusting your filters to find your next escape.</p>
                  <Button 
                    onClick={handleReset} 
                    variant="link"
                    className="mt-8 text-cyan font-black uppercase tracking-widest hover:tracking-[0.2em] transition-all"
                  >
                    {t('filter.reset')}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
