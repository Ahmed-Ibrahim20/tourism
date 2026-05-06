'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Search as SearchIcon, SlidersHorizontal, LayoutGrid, List, ChevronDown, MapPin, Compass, Filter, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import ProductCard from '@/components/search/ProductCard'
import FilterSidebar from '@/components/search/FilterSidebar'
import { MOCK_PRODUCTS } from '@/lib/mockData'
import { useI18n } from '@/lib/i18n'
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
      <motion.div
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          background: `radial-gradient(1000px circle at ${springX}px ${springY}px, rgba(0,212,255,0.08), transparent 80%)`,
        }}
      />

      <Navbar />

      <main className="relative z-10 pt-8 pb-20 lg:pt-12 lg:pb-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-10 lg:px-16">
          {/* Hero Section - Aligned with the Grid Content */}
          <div className="mb-12 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <div className="h-px w-8 bg-cyan/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan">
                  {selectedCategories.length > 0 ? t(`category.${selectedCategories[0]}`) : 'Premier Destinations'}
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white leading-[0.9]"
              >
                {searchQuery || t('search.title')}
              </motion.h1>
              
              <div className="flex items-center gap-3 mt-4">
                <div className="h-px w-12 bg-cyan/30" />
                <span className="text-[10px] font-black text-cyan uppercase tracking-[0.4em]">
                  {selectedCategories.length > 0 ? t(`category.${selectedCategories[0]}`) : 'Premier Collection'}
                </span>
              </div>
            </div>

            {/* Top Status Bar - Enhanced Spacing */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-12 border-b border-white/5">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl shadow-2xl">
                  <MapPin className="h-5 w-5 text-cyan" />
                  <span className="text-sm font-black text-white tracking-[0.1em] uppercase">
                    {searchQuery || 'Global Search'}
                  </span>
                </div>
                <div className="flex items-center gap-4 px-6 py-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-xl shadow-2xl">
                  <Compass className="h-5 w-5 text-cyan" />
                  <span className="text-sm font-black text-white tracking-[0.1em] uppercase">
                    {filteredProducts.length} Results Found
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="lg:hidden h-12 px-6 rounded-xl border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                      <SlidersHorizontal className="h-4 w-4 text-cyan" />
                      <span>{t('search.filter')}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side={dir === 'rtl' ? 'right' : 'left'} 
                    className="bg-navy border-white/10 w-[90vw] sm:w-[380px] p-0 overflow-hidden"
                  >
                    <div className="h-full flex flex-col">
                      <div className="p-6 border-b border-white/5">
                        <SheetTitle className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
                          <Compass className="h-5 w-5 text-cyan" />
                          {t('search.filter')}
                        </SheetTitle>
                      </div>
                      <div className="flex-1 overflow-y-auto p-6">
                        <FilterSidebar
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                          selectedCategories={selectedCategories}
                          setSelectedCategories={setSelectedCategories}
                          selectedRatings={selectedRatings}
                          setSelectedRatings={setSelectedRatings}
                          searchQuery={searchQuery}
                          setSearchQuery={setSearchQuery}
                          onReset={handleReset}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort Dropdown */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-cyan/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="relative h-12 appearance-none rounded-xl border border-white/10 bg-white/[0.03] pl-5 pr-12 text-[11px] font-black uppercase tracking-[0.15em] text-white outline-none transition-all hover:bg-white/10 focus:border-cyan/30"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Sidebar - Spans 3 columns */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative group"
                >
                  {/* Subtle Glow behind sidebar */}
                  <div className="absolute -inset-4 bg-cyan/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  {/* Glassmorphism Container */}
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:border-white/10">
                    {/* Interior Gradient Shine */}
                    <div className="absolute -right-20 -top-20 h-40 w-40 bg-cyan/[0.03] blur-[80px] pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 h-40 w-40 bg-purple-500/[0.02] blur-[80px] pointer-events-none" />
                    
                    <div className="relative p-8 lg:p-10">
                      <FilterSidebar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        selectedRatings={selectedRatings}
                        setSelectedRatings={setSelectedRatings}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onReset={handleReset}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </aside>

            {/* Main Content - Spans 9 columns */}
            <div className="lg:col-span-9 flex flex-col gap-10">
              
              {/* Results Logic Header */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                      {searchQuery ? `Searching for "${searchQuery}"` : 'All Experiences'}
                    </h2>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                      {filteredProducts.length} results in {selectedCategories.length > 0 ? selectedCategories.join(' & ') : 'All Categories'}
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <div className="h-10 w-px bg-white/10 mx-2" />
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-cyan/10 text-cyan">
                      <LayoutGrid className="size-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-600 hover:bg-white/5 transition-colors">
                      <List className="size-5" />
                    </Button>
                  </div>
                </div>

                {/* Applied Filters Tags (Logical Organization) */}
                {(selectedCategories.length > 0 || selectedRatings.length > 0 || searchQuery) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mr-2">Active Filters:</span>
                    {searchQuery && (
                      <span className="px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-[10px] font-bold text-cyan flex items-center gap-2">
                        "{searchQuery}"
                        <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
                      </span>
                    )}
                    {selectedCategories.map(cat => (
                      <span key={cat} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                        {t(`category.${cat}`)}
                        <X className="h-3 w-3 cursor-pointer hover:text-cyan" onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))} />
                      </span>
                    ))}
                    {selectedRatings.map(rating => (
                      <span key={rating} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                        {rating} Stars
                        <X className="h-3 w-3 cursor-pointer hover:text-cyan" onClick={() => setSelectedRatings(selectedRatings.filter(r => r !== rating))} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                  >
                    {filteredProducts.map((product, idx) => (
                      <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center py-32 lg:py-48 rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01]"
                  >
                    <div className="relative mb-10">
                      {/* Animated Glow Rings */}
                      <div className="absolute inset-0 animate-ping rounded-full bg-cyan/10" />
                      <div className="absolute inset-0 animate-pulse rounded-full bg-cyan/5 scale-150" />
                      
                      <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-2xl">
                        <Compass className="h-16 w-16 text-cyan/40" />
                      </div>
                    </div>

                    <h3 className="mb-4 text-3xl sm:text-4xl font-black tracking-tight text-white text-center">
                      0 EXPERIENCES FOUND
                    </h3>
                    <p className="mb-10 text-center text-slate-500 max-w-sm text-lg font-medium leading-relaxed">
                      We couldn't find any matches for your current selection. Try broadening your horizons.
                    </p>

                    <Button 
                      onClick={handleReset} 
                      className="group relative h-14 px-10 overflow-hidden rounded-2xl bg-white text-navy font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Reset Filters
                        <div className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
                      </span>
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
