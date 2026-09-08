'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Compass, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import ProductCard from '@/components/search/ProductCard';
import FilterSidebar from '@/components/search/FilterSidebar';
import { useI18n, sanitizeText } from '@/lib/i18n';
import { apiService, Package, Destination, Category } from '@/services/api';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const DESTINATION_IMAGES: Record<string, string> = {
  'dahab': '/images/hero/02-dahab.jpg',
  'دهب': '/images/hero/02-dahab.jpg',
  // 'sharm': '/images/hero/04-sharm.jpg',
  // 'شرم': '/images/hero/04-sharm.jpg',
  // 'hurghada': '/images/hero/03-hurghada.jpg',
  // 'الغردقة': '/images/hero/03-hurghada.jpg',
  // 'luxor': '/images/hero/05-luxor.jpg',
  // 'الأقصر': '/images/hero/05-luxor.jpg',
  // 'aswan': '/images/hero/01-giza.jpg',
  // 'أسوان': '/images/hero/01-giza.jpg',
  // 'cairo': '/images/hero/01-giza.jpg',
  // 'القاهرة': '/images/hero/01-giza.jpg',
  // 'giza': '/images/hero/01-giza.jpg',
  // 'الجيزة': '/images/hero/01-giza.jpg',
  // 'alexandria': '/images/hero/06-alexandria.jpg',
  // 'الإسكندرية': '/images/hero/06-alexandria.jpg',
  // 'nile': '/images/hero/07-nile.jpg',
  // 'النيل': '/images/hero/07-nile.jpg',
  // 'sinai': '/images/hero/08-sinai.jpg',
  // 'سيناء': '/images/hero/08-sinai.jpg',
};

function OffersClientContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { t, dir, lang } = useI18n();
  const isRTL = dir === 'rtl';

  const categoryParam = String(params?.category || 'trips');
  const destinationId = searchParams.get('destination_id');
  const categoryId = searchParams.get('category_id');
  const locationParam = searchParams.get('location') || '';

  // Backend Real Data State
  const [destinationDetails, setDestinationDetails] = useState<Destination | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<Category | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('featured');

  // Load 100% Real Data from Laravel Backend API
  useEffect(() => {
    async function loadBackendData() {
      setLoading(true);
      try {
        // 1. Fetch Destination details from API
        const destQuery = destinationId || locationParam || categoryParam;
        if (destQuery) {
          try {
            const destRes = await apiService.public.destinations.show(String(destQuery));
            if (destRes?.data) setDestinationDetails(destRes.data);
          } catch {
            // Ignore API 404
          }
        }

        // 2. Fetch Category details from API
        const catQuery = categoryId || categoryParam;
        if (catQuery && catQuery !== 'all') {
          try {
            const catRes = await apiService.public.categories.show(String(catQuery));
            if (catRes?.data) setCategoryDetails(catRes.data);
          } catch {
            // Ignore API 404
          }
        }

        // 3. Query Packages from Laravel Backend
        const query: any = {};
        if (destinationId) {
          query.destination_id = destinationId;
        } else if (locationParam) {
          query.destination = locationParam;
        }

        if (categoryId) {
          query.category_id = categoryId;
        } else if (categoryParam && categoryParam !== 'all') {
          const knownCategories = ['honeymoon', 'hotels', 'experiences', 'trips', 'tours', 'diving-marine', 'services'];
          if (knownCategories.includes(categoryParam.toLowerCase())) {
            query.category = categoryParam;
          }
        }

        const pkgRes = await apiService.public.packages.index(query);
        let items: Package[] = [];

        if (pkgRes?.data && Array.isArray(pkgRes.data)) {
          items = pkgRes.data;
        } else if ((pkgRes as any)?.data?.data && Array.isArray((pkgRes as any).data.data)) {
          items = (pkgRes as any).data.data;
        } else if (Array.isArray(pkgRes)) {
          items = pkgRes;
        }

        // Fallback to destination packages if category + destination combination has 0 items in DB
        if (items.length === 0 && (destinationId || locationParam)) {
          const destOnlyQuery: any = {};
          if (destinationId) destOnlyQuery.destination_id = destinationId;
          else if (locationParam) destOnlyQuery.destination = locationParam;

          const destPkgRes = await apiService.public.packages.index(destOnlyQuery);
          if (destPkgRes?.data && Array.isArray(destPkgRes.data)) {
            items = destPkgRes.data;
          } else if ((destPkgRes as any)?.data?.data && Array.isArray((destPkgRes as any).data.data)) {
            items = (destPkgRes as any).data.data;
          } else if (Array.isArray(destPkgRes)) {
            items = destPkgRes;
          }
        }

        // Fallback to all packages stored in Laravel database if items is still empty
        if (items.length === 0) {
          const allPkgRes = await apiService.public.packages.index({});
          if (allPkgRes?.data && Array.isArray(allPkgRes.data)) {
            items = allPkgRes.data;
          } else if ((allPkgRes as any)?.data?.data && Array.isArray((allPkgRes as any).data.data)) {
            items = (allPkgRes as any).data.data;
          } else if (Array.isArray(allPkgRes)) {
            items = allPkgRes;
          }
        }

        setPackages(items);
      } catch (err) {
        console.warn('Backend API connection notice:', err);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }

    loadBackendData();
  }, [categoryParam, categoryId, destinationId, locationParam]);

  // Destination Name from Backend or URL
  const destinationName = useMemo(() => {
    let raw = '';
    if (destinationDetails) {
      const trans = destinationDetails.name_translations;
      if (trans && (trans[lang] || trans.ar || trans.en)) {
        raw = trans[lang] || trans.ar || trans.en;
      } else if (destinationDetails.name) {
        raw = destinationDetails.name;
      }
    }
    if (!raw && locationParam) raw = locationParam;

    if (!raw) {
      const catLower = categoryParam.toLowerCase();
      for (const key of Object.keys(DESTINATION_IMAGES)) {
        if (catLower.includes(key)) {
          raw = isRTL ? key : key.charAt(0).toUpperCase() + key.slice(1);
          break;
        }
      }
    }
    if (!raw) raw = isRTL ? 'شرم الشيخ' : 'Sharm El Sheikh';

    return sanitizeText(raw, lang);
  }, [destinationDetails, locationParam, categoryParam, isRTL, lang]);

  // Hero Cover Image from Backend or Location Map
  const heroImage = useMemo(() => {
    if (destinationDetails && (destinationDetails.cover_url || (destinationDetails as any).cover_image)) {
      return destinationDetails.cover_url || (destinationDetails as any).cover_image;
    }
    const query = (destinationName || '').toLowerCase();
    for (const [key, img] of Object.entries(DESTINATION_IMAGES)) {
      if (query.includes(key)) return img;
    }
    return '/images/hero/04-sharm.jpg';
  }, [destinationDetails, destinationName]);

  // Category Title from Backend or Formatted Map
  const categoryTitleFormatted = useMemo(() => {
    let raw = '';
    if (categoryDetails) {
      const trans = categoryDetails.name_translations;
      if (trans && (trans[lang] || trans.ar || trans.en)) {
        raw = trans[lang] || trans.ar || trans.en;
      } else if (categoryDetails.name) {
        raw = categoryDetails.name;
      }
    }

    if (!raw) {
      const formattedCatMap: Record<string, { ar: string; en: string }> = {
        honeymoon: { ar: 'شهر العسل', en: 'Honeymoon' },
        hotels: { ar: 'فنادق ومنتجعات', en: 'Hotels & Resorts' },
        experiences: { ar: 'تجارب وأنشطة', en: 'Experiences & Activities' },
        trips: { ar: 'رحلات سياحية', en: 'Guided Trips' },
        tours: { ar: 'جولات استكشافية', en: 'Sightseeing Tours' },
        'diving-marine': { ar: 'رحلات وغوص', en: 'Diving & Marine' },
      };

      const catInfo = formattedCatMap[categoryParam.toLowerCase()];
      if (catInfo) raw = isRTL ? catInfo.ar : catInfo.en;
      else raw = categoryParam;
    }

    return sanitizeText(raw, lang);
  }, [categoryDetails, categoryParam, isRTL, lang]);

  // Subtitle Description from Backend
  const heroDescription = useMemo(() => {
    let raw = '';
    if (destinationDetails) {
      const shortDesc = destinationDetails.short_description_translations || (destinationDetails as any).short_description;
      if (typeof shortDesc === 'object' && shortDesc && (shortDesc[lang] || shortDesc.ar || shortDesc.en)) {
        raw = shortDesc[lang] || shortDesc.ar || shortDesc.en;
      } else if (typeof shortDesc === 'string' && shortDesc) {
        raw = shortDesc;
      }
    }
    if (!raw) {
      raw = isRTL
        ? `أفضل الحزم والعروض الفاخرة المتاحة في ${destinationName} لـ ${categoryTitleFormatted}.`
        : `Handpicked luxury packages available in ${destinationName} for ${categoryTitleFormatted}.`;
    }
    return sanitizeText(raw, lang);
  }, [destinationDetails, destinationName, categoryTitleFormatted, isRTL, lang]);

  // Real Backend Database Filtered Packages
  const displayPackages = useMemo(() => {
    let list: any[] = [...packages];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p: any) => {
        const title = (p.name || p.title || (p.titleKey ? t(p.titleKey) : '')).toLowerCase();
        const loc = (p.destination?.name || p.location || '').toLowerCase();
        return title.includes(q) || loc.includes(q);
      });
    }

    // Filter by Price Range
    list = list.filter((p: any) => {
      const price = p.min_price ?? p.price ?? 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by Rating
    if (selectedRatings.length > 0) {
      list = list.filter((p: any) => {
        const rating = Math.floor(p.rating || p.star_rating || 5);
        return selectedRatings.includes(rating);
      });
    }

    // Sort
    list.sort((a: any, b: any) => {
      const priceA = a.min_price ?? a.price ?? 0;
      const priceB = b.min_price ?? b.price ?? 0;
      const ratingA = a.rating ?? a.star_rating ?? 5;
      const ratingB = b.rating ?? b.star_rating ?? 5;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return 0;
    });

    return list;
  }, [packages, searchQuery, priceRange, selectedRatings, sortBy, t]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 5000]);
    setSelectedRatings([]);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-navy selection:bg-cyan/30 flex flex-col font-sans" dir={dir}>
      <Navbar />

      {/* HERO SECTION WITH BACKGROUND IMAGE & GRADIENT */}
      <section data-dark="true" className="relative min-h-[380px] sm:min-h-[440px] pt-32 pb-16 flex items-center overflow-hidden border-b border-white/10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage || '/images/hero/04-sharm.jpg'}
            alt={destinationName || 'Destination'}
            fill
            priority
            unoptimized
            className="object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/40" />
          <div className="absolute inset-0 bg-navy/30 backdrop-blur-[2px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 w-full">
          <div className="max-w-4xl space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Link href="/" className="hover:text-cyan transition-colors">
                {isRTL ? 'الرئيسية' : 'Home'}
              </Link>
              <span className="opacity-40">/</span>
              <span className="text-cyan font-bold">{destinationName}</span>
              <span className="opacity-40">/</span>
              <span className="text-white capitalize">{categoryTitleFormatted}</span>
            </div>

            {/* Title: Destination — Category */}
            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight drop-shadow-lg">
              {destinationName} <span className="text-cyan font-light mx-2">—</span> {categoryTitleFormatted}
            </h1>

            {/* Subtitle Description from Backend */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              {heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 xl:gap-12">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-navy-light/40 backdrop-blur-xl p-6 shadow-2xl">
              <FilterSidebar
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedRatings={selectedRatings}
                setSelectedRatings={setSelectedRatings}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* RIGHT COLUMN: RESULTS & TOOLBAR */}
          <section className="lg:col-span-3 space-y-8">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              {/* Active Filter Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
                  {isRTL ? 'الفلاتر النشطة:' : 'Active Filters:'}
                </span>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold">
                  <span>{destinationName}</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-bold capitalize">
                  <span>{categoryTitleFormatted}</span>
                </div>

                {searchQuery && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                    <span>"{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')} className="hover:text-cyan">
                      <X className="size-3" />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-4 ml-2 transition-colors"
                >
                  {isRTL ? 'إعادة ضبط الكل' : 'Reset All Filters'}
                </button>
              </div>

              {/* Mobile Filter & Sort Dropdown */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 border-white/10 bg-white/5 hover:bg-white/10 text-white gap-2 rounded-xl text-xs font-bold"
                      >
                        <SlidersHorizontal className="size-4 text-cyan" />
                        {isRTL ? 'تصفية النتائج' : 'Filter Results'}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side={isRTL ? 'right' : 'left'} className="bg-navy border-white/10 text-white p-6 overflow-y-auto">
                      <SheetTitle className="text-white font-bold text-lg mb-6">{isRTL ? 'تصفية النتائج' : 'Filter Results'}</SheetTitle>
                      <FilterSidebar
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        selectedRatings={selectedRatings}
                        setSelectedRatings={setSelectedRatings}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onReset={handleResetFilters}
                      />
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="relative min-w-[160px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-[#0f172a] pl-4 pr-10 text-xs font-bold text-white outline-none focus:border-cyan/40 cursor-pointer"
                  >
                    <option value="featured">{isRTL ? 'المميز أولاً' : 'Featured'}</option>
                    <option value="price-low">{isRTL ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                    <option value="price-high">{isRTL ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                    <option value="rating">{isRTL ? 'الأعلى تقييماً' : 'Top Rated'}</option>
                  </select>
                  <ChevronDown className={`pointer-events-none absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-cyan`} />
                </div>
              </div>
            </div>

            {/* OFFERS GRID */}
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse rounded-3xl border border-white/5 bg-white/[0.02] h-96" />
                  ))}
                </div>
              ) : displayPackages.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  {displayPackages.map((pkg, idx) => (
                    <ProductCard key={pkg.id || idx} product={pkg} index={idx} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-24 bg-white/[0.02] rounded-3xl border border-white/10 max-w-xl mx-auto space-y-4">
                  <Compass className="size-12 text-cyan/40 mx-auto" />
                  <h3 className="text-xl font-bold text-white">
                    {isRTL ? `لا توجد عروض مخصصة حالياً لـ (${destinationName} - ${categoryTitleFormatted})` : `No offers currently available for (${destinationName} - ${categoryTitleFormatted})`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isRTL ? 'جرّب التصفح في الوجهات الأخرى أو قم بإضافة عروض جديدة لهذه الوجهة والصنف من لوحة التحكم.' : 'Try browsing other destinations or add new offers for this category in backend.'}
                  </p>
                  <Link href="/#destinations">
                    <Button className="mt-2 bg-cyan hover:bg-cyan-light text-navy font-bold rounded-xl px-6">
                      {isRTL ? 'استكشاف بقية الوجهات' : 'Explore Other Destinations'}
                    </Button>
                  </Link>
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OffersClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
      </div>
    }>
      <OffersClientContent />
    </Suspense>
  );
}
