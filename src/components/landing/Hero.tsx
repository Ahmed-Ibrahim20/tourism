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
    image: "/images/hero/dahab.jpeg",
    alt: "Dahab",
    headlineKey: "hero.headline.dahab",
    subtitleKey: "hero.subheadline.dahab",
  },
  {
    image: "/images/hero/sharm.jpeg",
    alt: "Sharm El Sheikh",
    headlineKey: "hero.headline.sharm",
    subtitleKey: "hero.subheadline.sharm",
  },
  {
    image: "/images/hero/hurghada.jpeg",
    alt: "Hurghada",
    headlineKey: "hero.headline.hurghada",
    subtitleKey: "hero.subheadline.hurghada",
  },
  {
    image: "/images/hero/pyramids.jpeg",
    alt: "Pyramids",
    headlineKey: "hero.headline.giza",
    subtitleKey: "hero.subheadline.giza",
  },
  {
    image: "/images/hero/luxor.jpeg",
    alt: "Luxor",
    headlineKey: "hero.headline.luxor",
    subtitleKey: "hero.subheadline.luxor",
  },
  {
    image: "/images/hero/aswan.jpeg",
    alt: "Aswan",
    headlineKey: "hero.headline.aswan",
    subtitleKey: "hero.subheadline.aswan",
  },
  {
    image: "/images/hero/sewa.jpeg",
    alt: "Siwa Oasis",
    headlineKey: "hero.headline.siwa",
    subtitleKey: "hero.subheadline.siwa",
  },
  {
    image: "/images/hero/whitedesert.jpeg",
    alt: "White Desert",
    headlineKey: "hero.headline.whiteDesert",
    subtitleKey: "hero.subheadline.whiteDesert",
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
    <section
      id="home"
      className="relative h-screen min-h-[650px] max-h-[1080px] w-full overflow-hidden keep-dark"
      style={{ position: "relative", width: "100%", height: "100vh", minHeight: "650px", maxHeight: "1080px", overflow: "hidden" }}
    >
      {/* ── Background Slides (Bulletproof CSS Safety Net & Stable DOM Nodes) ── */}
      {slides.map((slideItem, index) => {
        const isActive = index === current;

        return (
          <div
            key={slideItem.image}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-0" : "opacity-0 pointer-events-none -z-10"
            }`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              opacity: isActive ? 1 : 0,
              pointerEvents: isActive ? "auto" : "none",
              zIndex: isActive ? 0 : -10,
              transition: "opacity 1000ms ease-in-out",
            }}
          >
            <Image
              src={slideItem.image}
              alt={t(slideItem.headlineKey)}
              fill
              className={`object-cover transition-transform duration-[10s] ease-out ${
                isActive ? "scale-105" : "scale-100"
              }`}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              quality={75}
              sizes="(max-width: 768px) 100vw, 100vw"
            />
          </div>
        );
      })}

      {/* ── Persistent Overlay ─────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-navy/60 via-navy/40 to-navy"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}
      />

      {/* ── Side vignette for cinematic feel ───────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,25,47,0.6)_100%)]"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10 }}
      />

      {/* ── Bottom fade ────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-navy to-transparent"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "128px", pointerEvents: "none", zIndex: 10 }}
      />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-20 h-full w-full px-4 sm:px-6 lg:px-16 pointer-events-none flex flex-col justify-center">

        {/* Top bar — slide counter */}
        <div className="absolute top-24 lg:top-28 right-4 sm:right-6 lg:right-16 rtl:right-auto rtl:left-4 rtl:sm:left-6 rtl:lg:left-16 pointer-events-auto z-30">
          <SlideCounter current={current} total={total} />
        </div>

        {/* Center content & Text Wrap */}
        <div className="flex w-full flex-col items-start md:items-center justify-center pointer-events-none pb-12 md:pb-8">
          <div className="flex max-w-4xl flex-col items-start gap-3 md:items-center md:text-center mx-auto pointer-events-auto w-full">
            {/* Floating Badge */}
            <div
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-1.5 md:px-8 md:py-2.5 backdrop-blur-md border border-white/20 shadow-xl mb-1 mt-4 md:mt-0"
            >
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-xs md:text-sm font-black uppercase tracking-[0.25em] md:tracking-[0.35em] text-transparent drop-shadow-lg">
                {t('brand.name')}
              </span>
            </div>

            {/* Headline & Subtitle Wrapper (Fixed layout height to prevent CSS collapse) */}
            <div className="min-h-[140px] sm:min-h-[160px] md:min-h-[190px] flex flex-col items-center justify-center w-full my-2">
              <motion.div
                key={`slide-text-${current}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: customEase }}
                className="flex flex-col items-center text-center w-full"
              >
                <h1 className="gradient-text text-2xl font-black leading-[1.2] tracking-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl w-full">
                  {t(slide.headlineKey)}
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base lg:text-lg mt-3">
                  {t(slide.subtitleKey)}
                </p>
              </motion.div>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col items-start gap-2.5 mt-4 w-full sm:w-auto sm:flex-row md:items-center md:justify-center"
            >
              <Button
                size="lg"
                className="cta-glow h-11 md:h-12 w-full sm:w-auto rounded-full bg-[#00D4FF] px-8 sm:px-10 md:px-12 text-[14px] md:text-[15px] font-bold tracking-wide text-navy hover:bg-[#00D4FF]/90 pointer-events-auto"
                asChild
              >
                <a href="/#contact">
                  {t("hero.cta")}
                  <svg className="ml-1.5 h-4 w-4 md:h-5 md:w-5 rtl:mr-1.5 rtl:ml-0 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 md:h-12 w-full sm:w-auto rounded-full border-cyan/30 bg-[#0A192F]/50 backdrop-blur-md px-6 md:px-8 text-[14px] md:text-[15px] font-bold text-cyan hover:border-cyan-light hover:bg-cyan/10 pointer-events-auto"
                asChild
              >
                <a href="/#destinations">{t("hero.secondaryCta")}</a>
              </Button>
            </div>

            {/* Social proof */}
            <div
              className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3 mt-3 md:justify-center w-full sm:w-auto"
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
            </div>
          </div>
        </div>

        {/* Floating Side Arrows */}
        <div className="absolute left-2 right-2 md:left-6 md:right-6 lg:left-10 lg:right-10 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-30">
          <button
            onClick={goPrev}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/10 bg-navy/40 text-white/80 backdrop-blur-md transition-all hover:border-cyan/50 hover:bg-cyan/20 hover:text-cyan hover:scale-110 pointer-events-auto"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5 rtl:rotate-180" />
          </button>

          <button
            onClick={goNext}
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full border border-white/10 bg-navy/40 text-white/80 backdrop-blur-md transition-all hover:border-cyan/50 hover:bg-cyan/20 hover:text-cyan hover:scale-110 pointer-events-auto"
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5 rtl:rotate-180" />
          </button>
        </div>

        {/* Bottom indicators */}
        <div className="absolute bottom-6 left-6 right-6 md:left-16 md:right-16 flex items-end justify-between pointer-events-none z-30">
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
                {t(slide.headlineKey)}
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
