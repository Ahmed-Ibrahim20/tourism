'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Search as SearchIcon, SlidersHorizontal, LayoutGrid, List, ChevronDown, MapPin, Compass } from 'lucide-react'
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
          background: \adial-gradient(1000px circle at \px \px, rgba(0,212,255,0.08), transparent 80%)\,
        }}
      />

      <Navbar />

      <main className="relative z-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          <div className="mb-12 flex flex-col gap-8 lg:mb-16">
            <div className="flex flex-col gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white/5 px-4 py-2 border border-white/10 backdrop-blur-sm"
              >
                <Compass className="h-4 w-4 text-cyan animate-pulse" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan">
                  {selectedCategories.length > 0 ? t(\category.\\) : 'Discover Your Paradise'}
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-white"
              >
                {searchQuery 
                  ? \Luxury Hotels in \\ 
                  : t('search.title')
                }
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed"
              >
                {t('search.subtitle')}
              </motion.p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm w-full sm:w-auto">
                <MapPin className="h-5 w-5 text-cyan flex-shrink-0" />
                <p className="text-base font-bold text-white truncate">
                  {searchQuery || 'All Destinations'}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="lg:hidden flex-1 sm:flex-none gap-2 h-12 rounded-xl border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-colors"
                    >
                      <SlidersHorizontal className="h-5 w-5" />
                      <span>{t('search.filter')}</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent 
                    side={dir === 'rtl' ? 'right' : 'left'} 
                    className="bg-navy border-white/10 w-[90vw] sm:w-[340px] p-6"
                  >
                    <SheetHeader className="mb-8">
                      <SheetTitle className="text-2xl font-black text-white uppercase tracking-tight">
                        {t('search.filter')}
                      </SheetTitle>
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
                    className="h-12 appearance-none rounded-xl border border-white/10 bg-white/5 pl-4 pr-10 text-sm font-bold uppercase tracking-wider text-white outline-none transition-all hover:bg-white/10 focus:border-cyan/30 focus:ring-1 focus:ring-cyan/20"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
            
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl shadow-xl">
                  <div className="absolute -right-20 -top-20 h-40 w-40 bg-cyan/5 blur-[80px] pointer-events-none" />
                  
                  <div className="relative p-6 lg:p-8">
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
              </div>
            </aside>

            <div className="lg:col-span-9 flex flex-col gap-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-cyan/30" />
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-slate-500">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Experience' : 'Experiences'} Found
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-lg text-cyan bg-cyan/10 hover:bg-cyan/20 transition-colors"
                  >
                    <LayoutGrid className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-lg text-slate-600 hover:text-cyan hover:bg-cyan/10 transition-colors"
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredProducts.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
                    className="flex flex-col items-center justify-center py-20 lg:py-32"
                  >
                    <div className="relative mb-8">
                      <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-cyan/20 to-transparent" />
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
                        <SearchIcon className="h-12 w-12 text-slate-500" />
                      </div>
                    </div>

                    <h3 className="mb-3 text-2xl sm:text-3xl font-black tracking-tight text-white text-center">
                      {t('search.noResults')}
                    </h3>
                    <p className="mb-8 text-center text-slate-500 max-w-sm">
                      Try adjusting your filters to find your next escape.
                    </p>

                    <Button 
                      onClick={handleReset} 
                      className="px-8 py-3 font-bold uppercase tracking-wider text-cyan border border-cyan/30 bg-transparent hover:bg-cyan/10 transition-all rounded-lg"
                    >
                      Reset Filters
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

