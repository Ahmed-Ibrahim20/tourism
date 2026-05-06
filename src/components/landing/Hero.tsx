"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

/* ── Slide Data ──────────────────────────────────────────────────────────── */

const slides = [
  {
    image: "/images/hero/01-giza.jpg",
    alt: "Great Pyramids of Giza",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.giza",
  },
  {
    image: "/images/hero/02-dahab.jpg",
    alt: "Dahab Blue Hole",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.dahab",
  },
  {
    image: "/images/hero/03-hurghada.jpg",
    alt: "Hurghada Coastline",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.hurghada",
  },
  {
    image: "/images/hero/04-sharm.jpg",
    alt: "Sharm El Sheikh",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.sharm",
  },
  {
    image: "/images/hero/05-luxor.jpg",
    alt: "Luxor Ancient Temples",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.luxor",
  },
  {
    image: "/images/hero/06-alexandria.jpg",
    alt: "Alexandria Mediterranean",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.alexandria",
  },
  {
    image: "/images/hero/07-nile.jpg",
    alt: "Nile River Cruise",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.nile",
  },
  {
    image: "/images/hero/08-sinai.jpg",
    alt: "Sinai Mountains",
    headlineKey: "hero.headline",
    subtitleKey: "hero.subheadline.sinai",
  },
];

/* ── Animation Variants ─────────────────────────────────────────────────── */

const customEase: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const textVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.1, ease: customEase },
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: { duration: 0.4, ease: customEase },
  }),
};

/* ── Slide Counter Animation ─────────────────────────────────────────────── */

function SlideCounter({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1 tabular-nums">
      <span className="text-sm font-bold text-white">0{current + 1}</span>
      <div className="mx-1.5 h-px w-5 bg-white/40" />
      <span className="text-sm text-white/50">0{total}</span>
    </div>
  );
}

/* ── Social Proof Avatars ───────────────────────────────────────────────── */

function SocialAvatars() {
  const colors = ["bg-cyan-400", "bg-cyan-light", "bg-cyan-dark", "bg-royal-blue"];
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-2.5">
        {colors.map((c, i) => (
          <div key={i} className={`h-9 w-9 md:h-10 md:w-10 rounded-full ${c} ring-2 ring-navy flex items-center justify-center text-[11px] md:text-xs font-bold text-navy shadow-lg`}>
            {["AK", "SM", "JL", "NR"][i]}
          </div>
        ))}
      </div>
      <span className="ml-1 text-[13px] md:text-sm font-bold text-white/80">+5,000</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 *  HERO SWIPER COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

export default function Hero() {
  const { t } = useI18n();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isPausedRef = useRef(false);

  const total = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  /* Autoplay */
  useEffect(() => {
    const start = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isPausedRef.current) goNext();
      }, 5000);
    };
    start();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const slide = slides[current];

  return (
    <section id="home" className="relative min-h-[100svh] lg:min-h-[100vh] w-full overflow-hidden">
      {/* ── Background Slides ──────────────────────────────────────── */}
      {/* ── Background Slides (Optimized for Preload & Performance) ── */}
      {slides.map((slideItem, index) => {
        const isActive = index === current;
        return (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
          >
            <Image
              src={slideItem.image}
              alt={slideItem.alt}
              fill
              className={`object-cover transition-transform duration-[10s] ease-out ${isActive ? "scale-105" : "scale-100"
                }`}
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              quality={90}
              sizes="100vw"
            />
          </div>
        );
      })}

      {/* ── Persistent Overlay ─────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-navy/50 via-navy/40 to-navy" />

      {/* ── Side vignette for cinematic feel ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,25,47,0.6)_100%)]" />

      {/* ── Bottom fade ────────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-40 bg-gradient-to-t from-navy to-transparent" />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-20 min-h-[100svh] lg:min-h-[100vh] w-full px-4 sm:px-6 lg:px-16 pointer-events-none flex flex-col justify-center">

        {/* Top bar — slide counter only since Navbar has the logo */}
        <div className="absolute top-24 lg:top-32 right-4 sm:right-6 lg:right-16 rtl:right-auto rtl:left-4 rtl:sm:left-6 rtl:lg:left-16 pointer-events-auto z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <SlideCounter current={current} total={total} />
          </motion.div>
        </div>

        {/* Center content & Text Wrap (Vertically Centered) */}
        <div className="flex w-full flex-col items-start md:items-center justify-center pointer-events-none pb-20 md:pb-0">
          <div className="flex max-w-4xl flex-col items-start gap-4 md:items-center md:text-center mx-auto pointer-events-auto w-full">
            {/* Elegantly Styled Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-2 md:px-10 md:py-3 backdrop-blur-md border border-white/20 shadow-xl mb-1 mt-6 md:mt-0"
            >
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-xs md:text-sm lg:text-base font-black uppercase tracking-[0.25em] md:tracking-[0.4em] text-transparent drop-shadow-lg">
                {t('brand.name')}
              </span>
            </motion.div>

            {/* Headline */}
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.h1
                key={`headline-${current}`}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="gradient-text text-4xl font-black leading-[1.1] tracking-tight md:text-5xl lg:text-6xl xl:text-[4rem] w-full"
              >
                {t(slide.headlineKey)}
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.p
                key={`sub-${current}`}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base lg:text-lg"
              >
                {t(slide.subtitleKey)}
              </motion.p>
            </AnimatePresence>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-start gap-3 mt-3 w-full sm:w-auto sm:flex-row md:items-center md:justify-center"
            >
              <Button
                size="lg"
                className="cta-glow h-11 md:h-12 w-full sm:w-auto rounded-full bg-[#00D4FF] px-8 sm:px-10 md:px-12 text-[14px] md:text-[15px] font-bold tracking-wide text-navy hover:bg-[#00D4FF]/90 pointer-events-auto"
                asChild
              >
                <a href="#contact">
                  {t("hero.cta")}
                  <svg className="ml-1.5 h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 md:h-12 w-full sm:w-auto rounded-full border-cyan/30 bg-[#0A192F]/50 backdrop-blur-md px-6 md:px-8 text-[14px] md:text-[15px] font-bold text-cyan hover:border-cyan-light hover:bg-cyan/10 pointer-events-auto"
                asChild
              >
                <a href="#destinations">{t("hero.secondaryCta")}</a>
              </Button>
            </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 mt-4 md:justify-center w-full sm:w-auto"
          >
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 rounded-full bg-navy/40 px-3 py-1.5 backdrop-blur-md border border-white/5">
                <div className="flex gap-0.5 text-cyan">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current drop-shadow-[0_0_4px_rgba(0,212,255,0.6)]" />
                  ))}
                </div>
                <span className="text-[12px] md:text-sm font-bold text-white">4.9/5</span>
              </div>
              <SocialAvatars />
            </div>
            <span className="text-[12px] md:text-sm font-medium text-slate-300 w-full sm:w-auto">{t("hero.travelers")}</span>
          </motion.div>
          </div>
        </div>

        {/* Floating Side Arrows (Left & Right Centered Vertically) */}
        <div className="absolute left-2 right-2 md:left-6 md:right-6 lg:left-10 lg:right-10 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
          <button
            onClick={goPrev}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/10 bg-navy/30 text-white/80 backdrop-blur-md transition-all hover:border-cyan/50 hover:bg-cyan/20 hover:text-cyan hover:scale-110 pointer-events-auto"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goNext}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/10 bg-navy/30 text-white/80 backdrop-blur-md transition-all hover:border-cyan/50 hover:bg-cyan/20 hover:text-cyan hover:scale-110 pointer-events-auto"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom indicators */}
        <div className="absolute bottom-10 left-6 right-6 md:left-16 md:right-16 flex items-end justify-between pointer-events-none">
          {/* Slide location name */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`loc-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <div className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
              <span className="text-[10px] md:text-xs font-medium tracking-widest text-white/80 uppercase">
                {slide.alt}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div
            className="flex items-center gap-1.5 md:gap-2 pointer-events-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {slides.map((_, i) => {
              const isActive = i === current;
              return (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative flex items-center justify-center h-6"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <motion.div
                    className="rounded-full"
                    animate={{
                      width: isActive ? 24 : 6,
                      height: 6,
                      backgroundColor: isActive ? "#00D4FF" : "rgba(255,255,255,0.25)",
                      boxShadow: isActive ? "0 0 12px rgba(0,212,255,0.5)" : "none",
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom fade (Reduced height) ─────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-navy to-transparent" />

      {/* ── Progress Bar (auto-play indicator) ─────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-0.5 bg-white/5">
        {!isPaused && (
          <motion.div
            key={`progress-${current}`}
            className="h-full bg-cyan/60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        )}
      </div>
    </section>
  );
}
