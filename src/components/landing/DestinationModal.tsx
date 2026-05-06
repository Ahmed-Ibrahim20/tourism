"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Building2, Compass, Map, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface DestinationModalProps {
  destination: {
    id: string;
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

/* ── Modal component ───────────────────────────────────────────────────────── */

export default function DestinationModal({ destination, onClose }: DestinationModalProps) {
  const { t } = useI18n();

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

  /* Categories data */
  const categories = [
    {
      id: "honeymoon",
      titleKey: "tab.honeymoon",
      descKey: "honeymoon.subtitle",
      icon: Heart,
      image: "/images/honeymoon-couple.png",
      fallbackImage: "/images/hero/07-nile.jpg"
    },
    {
      id: "hotels",
      titleKey: "tab.hotels",
      descKey: "Discover premium 5-star resorts and luxurious boutique hotels tailored for unparalleled comfort.",
      icon: Building2,
      image: "/images/hotel-luxury.png",
      fallbackImage: "/images/hero/03-hurghada.jpg"
    },
    {
      id: "experiences",
      titleKey: "tab.experiences",
      descKey: "experiences.subtitle",
      icon: Compass,
      image: "/images/experience-diving.png",
      fallbackImage: "/images/hero/08-sinai.jpg"
    },
    {
      id: "trips",
      titleKey: "tab.trips",
      descKey: "trips.subtitle",
      icon: Map,
      image: "/images/experience-yacht.png",
      fallbackImage: "/images/hero/02-dahab.jpg"
    },
  ];

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
              className="absolute right-4 top-4 md:right-6 md:top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:bg-cyan/80 hover:scale-110"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* ── Header Section ───────────────────────────── */}
            <div className="relative h-[200px] md:h-[280px] w-full shrink-0 overflow-hidden">
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 lg:px-12">
                <h2 className="text-3xl font-black text-white md:text-5xl drop-shadow-lg">
                  {destination.name}
                </h2>
                <div className="mt-1.5 text-base font-semibold text-cyan-light drop-shadow-md md:text-lg">
                  {destination.tagline}
                </div>
                <p className="mt-3 max-w-3xl text-xs leading-relaxed text-slate-200 md:text-sm">
                  Immerse yourself in the magic of {destination.name}. Whether you are dreaming of a romantic escape, seeking the finest luxury resorts, or craving an unforgettable adventure, we have perfectly tailored experiences waiting just for you. Select your path below to begin.
                </p>
              </div>
            </div>

            {/* ── Content Section: Cards Grid ────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-navy/50 p-5 md:p-8 lg:px-12 lg:py-10">
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {categories.map((cat) => {
                  const categoryId = cat.id === 'experiences' || cat.id === 'trips' ? 'tours' : cat.id;
                  const searchUrl = `/search?category=${categoryId}&location=${destination.name}`;
                  
                  return (
                    <Link
                      key={cat.id}
                      href={searchUrl}
                      className="glass-card group relative flex h-[220px] md:h-[280px] cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1.5 will-change-transform"
                    >
                      {/* Card Background Image */}
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={cat.image}
                          alt={t(cat.titleKey)}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).srcset = "";
                            (e.target as HTMLImageElement).src = cat.fallbackImage;
                          }}
                        />
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent transition-opacity duration-300 group-hover:via-navy/40" />

                      {/* Card Content */}
                      <div className="relative z-20">
                        <div className="mb-3 w-fit rounded-full bg-cyan/20 p-2.5 backdrop-blur-md transition-colors duration-300 group-hover:bg-cyan/40">
                          <cat.icon className="size-5 text-cyan-light" />
                        </div>
                        
                        <h3 className="mb-1.5 text-xl md:text-2xl font-bold text-white drop-shadow-sm">
                          {t(cat.titleKey)}
                        </h3>
                        
                        <p className="line-clamp-2 text-xs md:text-sm font-medium text-slate-300">
                          {cat.descKey.includes('.') ? t(cat.descKey) : cat.descKey}
                        </p>

                        <div className="mt-5 flex items-center text-sm font-bold text-cyan-light transition-colors group-hover:text-white">
                          Explore Options <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
