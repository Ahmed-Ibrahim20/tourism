'use client';

import { motion } from 'framer-motion';
import { Star, StarHalf, MapPin, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

/* ── Animation Variants ─────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

/* ── Google Maps Reviews Integration ────────────────────────────────────────── */
export default function Testimonials() {
  const { t } = useI18n();

  return (
    <section id="testimonials" className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Subtle background */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 60%)',
        }}
      />
      
      {/* Ambient glowing dots */}
      <div className="absolute right-[10%] top-[20%] z-0 h-[300px] w-[300px] rounded-full bg-cyan/5  pointer-events-none" />
      <div className="absolute left-[10%] bottom-[20%] z-0 h-[250px] w-[250px] rounded-full bg-royal-blue/5  pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Section Header ──────────────────────────────────────────────── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-8 lg:mb-12 flex flex-col items-center text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 backdrop-blur-md">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-4 fill-cyan text-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
              ))}
              <StarHalf className="size-4 fill-cyan text-cyan drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white">4.7 / 5.0</span>
            <span className="ml-1 text-xs font-medium uppercase tracking-wider text-cyan-light">On Google</span>
          </div>
          
          <h2 className="gradient-text text-2xl font-extrabold tracking-tight md:text-4xl py-2">
            {t('testimonials.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        {/* ── Google Maps Integration Card ────────────────────────────────── */}
        <motion.div
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative mx-auto mt-8 max-w-5xl rounded-[2rem] border border-cyan/10 bg-navy/60 p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-colors hover:border-cyan/30 sm:p-4"
        >
          {/* Inner map container */}
          <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-navy-light pt-[75%] sm:pt-[56.25%] md:pt-[45%]">
            {/* Seamless glow edges blending map into the dark theme */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-navy/50 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-navy/50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-navy/50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-navy/50 to-transparent" />
            
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.5574328011935!2d34.512543675003236!3d28.492871990410006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15ab4bb4389b83f3%3A0xeeb3fa103e18fc02!2sDAHAB%20DREAM%20TOUR!5e0!3m2!1sen!2seg!4v1775576421575!5m2!1sen!2seg"
              className="absolute inset-0 h-full w-full border-0 lg:filter lg:opacity-90 lg:grayscale-[15%] lg:hue-rotate-[-5deg] lg:transition-all lg:duration-[800ms] lg:ease-out lg:hover:opacity-100 lg:hover:filter-none"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dahab Dream Tour Google Maps Location"
            />
          </div>

          {/* Bottom Call-to-action Strip */}
          <div className="mt-4 flex flex-col items-center justify-between gap-4 px-2 pb-2 sm:flex-row sm:px-6">
            <div className="flex items-center gap-4">
               <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-cyan/20 bg-cyan/10">
                 <MapPin className="size-5 text-cyan" />
               </div>
               <div className="text-left">
                 <h3 className="text-lg font-bold tracking-wide text-white">Dahab Dream Tour</h3>
                 <p className="text-sm font-medium text-slate-400">Discover our top-rated reviews</p>
               </div>
            </div>
            <Button
              className="group h-12 w-full shrink-0 gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-8 font-bold text-cyan-light backdrop-blur-sm transition-all duration-300 hover:border-cyan hover:bg-cyan hover:text-navy hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] sm:w-auto"
              asChild
            >
              <a href="https://maps.app.goo.gl/TKaTgqf1UFPMxr8K6" target="_blank" rel="noopener noreferrer">
                View on Google Maps
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
