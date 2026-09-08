"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Building2, Compass, Map, ArrowRight, Sparkles, Layers, Loader2 } from "lucide-react";
import { useI18n, sanitizeText } from "@/lib/i18n";
import { apiService, Category } from "@/services/api";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface DestinationModalProps {
  destination: {
    id: number | string;
    name: string;
    tagline: string;
    image: string;
  } | null;
  onClose: () => void;
}

/* ── Animation helpers ─────────────────────────────────────────────────────── */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 30,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

/* Icon & Fallback Image Resolver */
const categoryMeta: Record<string, { image: string; icon: any }> = {
  honeymoon: { image: "/images/honeymoon-couple.png", icon: Heart },
  hotels: { image: "/images/hotel-luxury.png", icon: Building2 },
  experiences: { image: "/images/experience-diving.png", icon: Compass },
  trips: { image: "/images/experience-yacht.png", icon: Map },
  tours: { image: "/images/experience-yacht.png", icon: Map },
};

/* ── Modal component ───────────────────────────────────────────────────────── */

export default function DestinationModal({ destination, onClose }: DestinationModalProps) {
  const { t, lang, dir } = useI18n();
  const isRTL = dir === 'rtl';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /* Fetch dynamic categories from API */
  useEffect(() => {
    if (!destination) return;

    let isMounted = true;
    async function loadCategories() {
      setLoading(true);
      try {
        const res = await apiService.public.categories.index();
        if (isMounted && res?.data && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch dynamic categories for destination modal");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [destination]);

  /* ESC key handler */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (destination) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [destination, handleKeyDown]);

  if (!destination) return null;

  const destName = sanitizeText(destination.name, lang);
  const destTagline = sanitizeText(destination.tagline, lang);

  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-10"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          onClick={onClose}
          dir={dir}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* ── Modal panel ─────────────────────────────────────── */}
          <motion.div
            className="glass-strong border border-white/10 relative z-10 flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 md:top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-cyan/80 hover:scale-110 cursor-pointer ${
                isRTL ? 'left-4 md:left-6' : 'right-4 md:right-6'
              }`}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* ── Header Section ───────────────────────────── */}
            <div data-dark="true" className="relative h-[200px] md:h-[280px] w-full shrink-0 overflow-hidden">
              <Image
                src={destination.image}
                alt={destName}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />

              <div className={`absolute inset-0 flex flex-col justify-end p-5 md:p-10 lg:px-12 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h2 className="text-3xl font-black text-white md:text-5xl drop-shadow-lg">
                  {destName}
                </h2>
                <div className="mt-1.5 text-base font-semibold text-cyan-light drop-shadow-md md:text-lg">
                  {destTagline}
                </div>
                <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-200 md:text-sm">
                  {t("destinations.modalDescription", { name: destName })}
                </p>
              </div>
            </div>

            {/* ── Content Section: Dynamic Categories Grid ────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-navy/50 p-5 md:p-8 lg:px-12 lg:py-10">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-cyan">
                  <Loader2 className="size-8 animate-spin text-cyan" />
                  <span className="text-sm font-semibold text-slate-300">
                    {isRTL ? 'جاري تحميل التصنيفات والعروض المتاحة...' : 'Loading available categories and offers...'}
                  </span>
                </div>
              ) : categories.length > 0 ? (
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                  {categories.map((cat) => {
                    const catSlug = cat.slug || String(cat.id);
                    const rawName = cat.name_translations?.[lang] || cat.name_translations?.['en'] || cat.name;
                    const catName = sanitizeText(rawName, lang);
                    const rawDesc = cat.description_translations?.[lang] || cat.description_translations?.['en'] || cat.description || '';
                    const catDesc = sanitizeText(rawDesc, lang);
                    
                    const meta = categoryMeta[catSlug.toLowerCase()] || { image: "/images/hero/02-dahab.jpg", icon: Layers };
                    const IconComponent = meta.icon;
                    const catImg = cat.cover_url || cat.cover_image || cat.image || meta.image;

                    // Search URL pointing specifically to BOTH destination_id AND category_id
                    const searchUrl = `/offers/${catSlug}?destination_id=${destination.id}&category_id=${cat.id}&location=${encodeURIComponent(destName)}`;


                    return (
                      <Link
                        key={cat.id}
                        href={searchUrl}
                        data-dark="true"
                        className="glass-card group relative flex h-[220px] md:h-[280px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1.5 will-change-transform"
                      >
                        {/* Card Background Image */}
                        <div className="absolute inset-0 z-0 bg-navy-light">
                          <Image
                            src={catImg}
                            alt={catName}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target && target.src !== meta.image) {
                                target.srcset = "";
                                target.src = meta.image;
                              }
                            }}
                          />
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent transition-opacity duration-300 group-hover:via-navy/40" />

                        {/* Card Content */}
                        <div className={`relative z-20 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <div className={`mb-3 w-fit rounded-full bg-cyan/20 p-2.5 backdrop-blur-md transition-colors duration-300 group-hover:bg-cyan/40 ${isRTL ? 'mr-0 ml-auto' : ''}`}>
                            <IconComponent className="size-5 text-cyan-light" />
                          </div>

                          <h3 className="mb-1.5 text-xl md:text-2xl font-bold text-white drop-shadow-sm line-clamp-1">
                            {catName}
                          </h3>

                          <p className="line-clamp-2 text-xs md:text-sm font-medium text-slate-300">
                            {catDesc || (isRTL ? `استكشف أفضل العروض والرحلات الفاخرة في ${destination.name}` : `Explore best luxury offers in ${destination.name}`)}
                          </p>

                          <div className={`mt-5 flex items-center text-sm font-bold text-cyan-light transition-colors group-hover:text-white ${isRTL ? 'flex-row-reverse justify-start' : ''}`}>
                            {t("destinations.exploreOptions")}
                            <ArrowRight className={`size-4 transition-transform ${isRTL ? 'mr-0 ml-2 rotate-180 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'}`} />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 bg-white/5 rounded-2xl border border-white/10">
                  {isRTL ? 'لا توجد تصنيفات متاحة حالياً' : 'No categories available at the moment'}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
