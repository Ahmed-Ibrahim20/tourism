"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, ArrowRight, Utensils, Sparkles, Sailboat, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

/* ── Feature items ─────────────────────────────────────────────────────────── */

const features = [
  { icon: Utensils, key: "honeymoon.feature1" },
  { icon: Sparkles, key: "honeymoon.feature2" },
  { icon: Sailboat, key: "honeymoon.feature3" },
  { icon: Map, key: "honeymoon.feature4" },
] as const;

/* ── Animation variants ────────────────────────────────────────────────────── */

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/* ── Honeymoon section ────────────────────────────────────────────────────── */

const honeymoonImages = [
  "/images/honeymoon.png",
  "/images/honeymoon-couple.png",
  "/images/hotel-luxury.png",
  "/images/experience-yacht.png",
];

export default function Honeymoon() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % honeymoonImages.length);
    }, 4500); // 4.5 seconds per image
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax effect for the top image container
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      id="honeymoon"
      className="relative w-full overflow-hidden py-24 md:py-32"
    >
      {/* Background with subtle gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(135deg, #0A192F 0%, #0B1E3D 50%, #0A192F 100%)",
        }}
      />

      {/* Ambient glow accent */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 h-[600px] w-[600px] rounded-full bg-cyan/5  pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center">
          
          {/* ─── Image Top Hero (Seamless Slideshow) ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full relative overflow-hidden rounded-[2rem] aspect-[4/3] md:aspect-[21/9] shadow-2xl ring-1 ring-white/10 bg-navy"
          >
            <div className="absolute inset-0 w-full h-full">
              {honeymoonImages.map((src, idx) => {
                const isActive = idx === currentImg;
                const isNext = idx === (currentImg + 1) % honeymoonImages.length;
                const isPrev = idx === (currentImg - 1 + honeymoonImages.length) % honeymoonImages.length;

                if (!isActive && !isNext && !isPrev) {
                  return null;
                }

                return (
                  <motion.div
                    key={src}
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className={`absolute inset-0 w-full h-full ${isActive ? "z-10" : "z-0 pointer-events-none"}`}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
                  >
                    <Image
                      src={src}
                      alt="Romantic honeymoon getaway"
                      fill
                      className="object-cover scale-105 transition-transform duration-[6000ms] ease-linear"
                      sizes="(max-width: 768px) 100vw, 1200px"
                      priority={idx === 0}
                      loading={idx === 0 ? "eager" : "lazy"}
                      quality={75}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Gradient overlay to seamlessly blend with the card below */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent pointer-events-none" />
          </motion.div>

          {/* ─── Overlapping Content Card ─────────────────────────────────── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative z-20 -mt-20 md:-mt-32 flex w-[92%] md:w-[85%] lg:w-[75%] flex-col items-center text-center rounded-[2rem] border border-cyan/10 bg-navy/80 p-8 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            {/* Pulsing Heart Icon */}
            <motion.div variants={fadeUp} className="mb-6">
              <div className="relative flex size-16 items-center justify-center rounded-2xl bg-cyan/10 ring-1 ring-cyan/30 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
                <Heart className="size-8 fill-cyan text-cyan" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={fadeUp}
              className="gradient-text mb-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl py-2"
            >
              {t("honeymoon.title")}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="mb-10 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg"
            >
              {t("honeymoon.subtitle")}
            </motion.p>

            {/* Features Grid with Lucide Icons */}
            <motion.div
              variants={fadeUp}
              className="mb-10 w-full grid grid-cols-1 gap-4 md:grid-cols-2 text-left"
            >
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.key}
                    className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4 transition-colors duration-300 hover:border-cyan/20 hover:bg-white/10"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan ring-1 ring-cyan/20 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-6" />
                    </div>
                    <span className="text-base font-medium text-slate-100">
                      {t(feat.key)}
                    </span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={fadeUp}>
              <Button
                size="lg"
                className="cta-glow h-14 rounded-full bg-cyan px-10 text-base font-bold text-navy transition-all duration-300 hover:scale-105 hover:bg-cyan-light"
                asChild
              >
                <a href="/#contact" className="flex items-center gap-2">
                  {t("honeymoon.cta")}
                  <ArrowRight className="size-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
