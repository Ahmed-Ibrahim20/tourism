'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { SlidersHorizontal, ChevronDown, MapPin, Compass } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
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
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

const DESTINATION_IMAGES: Record<string, string> = {
  'dahab': '/images/hero/02-dahab.jpg',
  'دهب': '/images/hero/02-dahab.jpg',
  'sharm': '/images/hero/04-sharm.jpg',
  'شرم': '/images/hero/04-sharm.jpg',
  'hurghada': '/images/hero/03-hurghada.jpg',
  'الغردقة': '/images/hero/03-hurghada.jpg',
  'luxor': '/images/hero/05-luxor.jpg',
  'الأقصر': '/images/hero/05-luxor.jpg',
  'aswan': '/images/hero/01-giza.jpg',
  'أسوان': '/images/hero/01-giza.jpg',
  'cairo': '/images/hero/01-giza.jpg',
  'القاهرة': '/images/hero/01-giza.jpg',
  'giza': '/images/hero/01-giza.jpg',
  'الجيزة': '/images/hero/01-giza.jpg',
  'alexandria': '/images/hero/06-alexandria.jpg',
  'الإسكندرية': '/images/hero/06-alexandria.jpg',
  'nile': '/images/hero/07-nile.jpg',
  'النيل': '/images/hero/07-nile.jpg',
  'sinai': '/images/hero/08-sinai.jpg',
  'سيناء': '/images/hero/08-sinai.jpg',
}

// ── Search Content Component ────────────────────────────────────────────────
function SearchContent() {
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

  // Get Background Image based on search query
  const backgroundImage = useMemo(() => {
    if (!searchQuery) return '/images/hero/01-giza.jpg'
    const query = searchQuery.toLowerCase()
    for (const [key, img] of Object.entries(DESTINATION_IMAGES)) {
      if (query.includes(key)) return img
    }
    return '/images/hero/01-giza.jpg'
  }, [searchQuery])

  // Get Dynamic Content based on search query
  const dynamicContent = useMemo(() => {
    if (!searchQuery) return { title: t('search.title'), subtitle: t('search.subtitle') }
    const query = searchQuery.toLowerCase()
    
    // Check for specific destinations to show their tagline
    const destinations = [
      { en: 'dahab', ar: 'دهب' },
      { en: 'sharm', ar: 'شرم' },
      { en: 'hurghada', ar: 'الغردقة' },
      { en: 'luxor', ar: 'الأقصر' },
      { en: 'aswan', ar: 'أسوان' },
      { en: 'alexandria', ar: 'الإسكندرية' },
      { en: 'nile', ar: 'النيل' },
      { en: 'sinai', ar: 'سيناء' }
    ]
    
    for (const d of destinations) {
      if (query.includes(d.en) || query.includes(d.ar)) {
        return {
          title: t(`${d.en}.name`),
          subtitle: t(`${d.en}.tagline`)
        }
      }
    }
    
    return { title: searchQuery, subtitle: t('search.subtitle') }
  }, [searchQuery, t])

  // Filter logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const translatedTitle = t(product.titleKey).toLowerCase()
      const translatedLocation = product.locationKey ? t(product.locationKey).toLowerCase() : ''
      const rawLocation = product.location.toLowerCase()
      const query = searchQuery.toLowerCase()

      // If "All Packages" is explicitly selected or no search query, show everything
      // Otherwise, filter by destination
      const isAllPackages = selectedCategories.length === 0
      
      const matchesSearch = !query ||
                            translatedTitle.includes(query) || 
                            translatedLocation.includes(query) ||
                            rawLocation.includes(query)
                            
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      const matchesCategory = isAllPackages || selectedCategories.includes(product.category)
      const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating))
      
      return matchesSearch && matchesPrice && matchesCategory && matchesRating
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'featured') return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
      return 0
    })
  }, [searchQuery, priceRange, selectedCategories, selectedRatings, sortBy, t])

  // Fallback Dummy products if missing
  const displayProducts = useMemo(() => {
    // Determine the categories we WANT to display
    const targetCategories = selectedCategories.length > 0 ? selectedCategories : ['hotels', 'honeymoon', 'tours'];
    
    // Find what categories are already present in filteredProducts
    const presentCategories = new Set(filteredProducts.map(p => p.category));
    
    // Find missing categories
    const missingCategories = targetCategories.filter(cat => !presentCategories.has(cat));
    
    // Create dummies for missing categories
    const loc = searchQuery || (dir === 'rtl' ? 'مصر' : 'Egypt');
    
    const dummyProducts = missingCategories.map((cat, idx) => {
      const basePrices: Record<string, number> = {
        hotels: 450,
        honeymoon: 1200,
        tours: 150
      };
      
      let finalPrice = basePrices[cat] || 500;
      if (priceRange[0] > finalPrice) finalPrice = priceRange[0] + 50;
      if (priceRange[1] < finalPrice) finalPrice = priceRange[1] - 50;

      const titleName = t(`category.${cat}`);
      const formattedTitle = dir === 'rtl' ? `${titleName} في ${loc}` : `${loc} - ${titleName}`;
      const descText = dir === 'rtl' ? `استمتع بأفضل عروض ${titleName} في ${loc} المصممة خصيصاً لتجربة لا تنسى.` : `Enjoy the best ${titleName} offers in ${loc} designed for an unforgettable experience.`;

      return {
        id: `dummy-${cat}-${idx}`,
        category: cat as any,
        titleKey: formattedTitle, // Fallback string since it's not a translation key
        price: finalPrice,
        rating: 5,
        image: backgroundImage,
        location: loc,
        duration: dir === 'rtl' ? 'حسب الاختيار' : 'Custom',
        descriptionKey: descText // Fallback string
      }
    });
    
    return [...filteredProducts, ...dummyProducts];
  }, [filteredProducts, selectedCategories, searchQuery, backgroundImage, priceRange, dir, t]);

  const handleReset = () => {
    setSearchQuery('')
    setPriceRange([0, 2000])
    setSelectedCategories([])
    setSelectedRatings([])
    setSortBy('featured')
  }

  return (
    <div className="relative min-h-screen bg-navy selection:bg-cyan/30">
      <Navbar />

      {/* ─── Hero Header with Image Background ─── */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={backgroundImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={backgroundImage}
              alt="Destination Header"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#030712]/80 via-[#030712]/40 to-[#030712]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#030712] via-transparent to-[#030712] opacity-60" />

        <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-8 lg:px-12 mx-auto max-w-[1600px]">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="h-[2px] w-12 bg-cyan shadow-[0_0_15px_rgba(0,212,255,0.5)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-cyan">
                {selectedCategories.length > 0 ? t(`category.${selectedCategories[0]}`) : t('search.title')}
              </span>
            </motion.div>
            
            <motion.h1 
              key={dynamicContent.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-[1.1] mb-8"
            >
              {dynamicContent.title}
            </motion.h1>
            
            <motion.p
              key={dynamicContent.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-2xl leading-relaxed font-medium"
            >
              {dynamicContent.subtitle}
            </motion.p>
          </div>
        </div>
      </section>

      <main className="relative z-10 -mt-10 pb-20 lg:pb-40">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* ─── Sidebar (Desktop) ─── */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                <div className="rounded-[2rem] border border-white/5 bg-white/[0.01] backdrop-blur-3xl p-8 xl:p-10 shadow-2xl">
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
            </aside>

            {/* ─── Main Content ─── */}
            <div className="lg:col-span-9 flex flex-col gap-10">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
                    <Compass className="h-4 w-4 text-cyan" />
                    <span className="text-xs font-bold text-white uppercase tracking-widest">
                      {displayProducts.length} {t('search.resultsFound').replace('{count}', '')}
                    </span>
                  </div>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="lg:hidden h-11 px-5 rounded-xl border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-3"
                      >
                        <SlidersHorizontal className="h-4 w-4 text-cyan" />
                        <span className="text-xs">{t('search.filter')}</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent 
                      side={dir === 'rtl' ? 'right' : 'left'} 
                      className="bg-navy border-white/10 w-full sm:w-[400px] p-0"
                    >
                      <div className="h-full flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                          <SheetTitle className="text-xl font-black text-white uppercase tracking-wider">
                            {t('search.filter')}
                          </SheetTitle>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8">
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
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-11 w-full sm:w-[180px] appearance-none rounded-xl border border-white/10 bg-[#0f172a] pl-4 pr-10 text-[10px] font-black uppercase tracking-[0.1em] text-white outline-none transition-all focus:border-cyan/30 cursor-pointer hover:bg-white/5"
                    >
                      <option value="featured" className="bg-[#0f172a] text-white py-2">Featured</option>
                      <option value="price-low" className="bg-[#0f172a] text-white py-2">Price: Low to High</option>
                      <option value="price-high" className="bg-[#0f172a] text-white py-2">Price: High to Low</option>
                      <option value="rating" className="bg-[#0f172a] text-white py-2">Top Rated</option>
                    </select>
                    <ChevronDown className={`pointer-events-none absolute ${dir === 'rtl' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cyan`} />
                  </div>
                </div>
              </div>

              {/* Section Header */}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  {searchQuery ? (
                    <>
                      <span className="text-cyan">{searchQuery}</span>
                      <span className="mx-3 opacity-20">/</span>
                      <span>{selectedCategories.length > 0 ? t(`category.${selectedCategories[0]}`) : t('filter.allCategories')}</span>
                    </>
                  ) : (
                    selectedCategories.length > 0 ? t(`category.${selectedCategories[0]}`) : t('filter.allCategories')
                  )}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">
                  {displayProducts.length > 0 
                    ? `${displayProducts.length} ${t('search.resultsFound').replace('{count}', '')}`
                    : t('search.popular')}
                </p>
              </div>

              {/* Grid */}
              <AnimatePresence mode="wait">
                {displayProducts.length > 0 ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
                  >
                    {displayProducts.map((product, idx) => (
                      <ProductCard key={product.id} product={product} index={idx} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                      {t('search.noResults')}
                    </p>
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

// ── Main Page Component with Suspense ──────────────────────────────────────
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
          <p className="text-cyan text-xs font-bold uppercase tracking-widest">Discovering experiences...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
