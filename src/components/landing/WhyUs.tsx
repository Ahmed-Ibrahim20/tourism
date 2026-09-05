'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  MapPin,
  Settings2,
  Building2,
  Headphones,
  Users,
  Star,
  Calendar,
  Award,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';

/* ── Stats Data ──────────────────────────────────────────────────────────────── */
const stats = [
  { valueKey: 'stat.travelers', labelKey: 'stat.travelersLabel', icon: Users, numericValue: 5000, suffix: '+', prefix: '' },
  { valueKey: 'stat.rating', labelKey: 'stat.ratingLabel', icon: Star, numericValue: 4.7, suffix: '', prefix: '' },
  { valueKey: 'stat.destinations', labelKey: 'stat.destinationsLabel', icon: Award, numericValue: 50, suffix: '+', prefix: '' },
  { valueKey: 'stat.years', labelKey: 'stat.yearsLabel', icon: Calendar, numericValue: 10, suffix: '+', prefix: '' },
] as const;

/* ── Reasons Data ────────────────────────────────────────────────────────────── */
const reasons = [
  { icon: MapPin, titleKey: 'whyUs.reason1Title', descKey: 'whyUs.reason1Desc' },
  { icon: Settings2, titleKey: 'whyUs.reason2Title', descKey: 'whyUs.reason2Desc' },
  { icon: Building2, titleKey: 'whyUs.reason3Title', descKey: 'whyUs.reason3Desc' },
  { icon: Headphones, titleKey: 'whyUs.reason4Title', descKey: 'whyUs.reason4Desc' },
] as const;

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

const cardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/* ── Animated Counter Hook ───────────────────────────────────────────────────── */
function useCountUp(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const isDecimal = target % 1 !== 0;
    let startTime: number | null = null;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease-out cubic for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [inView, target, duration]);

  return count;
}

/* ── Single Stat Item ────────────────────────────────────────────────────────── */
function StatItem({
  stat,
  index,
  isInView,
}: {
  stat: (typeof stats)[number];
  index: number;
  isInView: boolean;
}) {
  const { t } = useI18n();
  const count = useCountUp(stat.numericValue, isInView);
  const Icon = stat.icon;

  return (
    <motion.div
      custom={0.1 * index}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="relative flex flex-col items-center gap-3 py-4 text-center"
    >
      {/* Vertical divider (hide last item) */}
      {index < stats.length - 1 && (
        <div className="pointer-events-none absolute right-0 top-1/2 h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan/30 to-transparent max-md:hidden" />
      )}

      <Icon className="mb-1 size-5 text-cyan/60" />
      <span className="gradient-text text-4xl font-bold md:text-5xl">
        {stat.prefix}
        {count.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="text-sm text-slate-400">{t(stat.labelKey)}</span>
    </motion.div>
  );
}

/* ── Single Reason Card ──────────────────────────────────────────────────────── */
function ReasonCard({
  reason,
  index,
}: {
  reason: (typeof reasons)[number];
  index: number;
}) {
  const { t } = useI18n();
  const Icon = reason.icon;

  return (
    <motion.div
      custom={index * 0.12}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <div className="glass-card group relative h-full rounded-2xl p-6 md:p-8">
        {/* Hover glow ring */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-all duration-500 group-hover:border-cyan/25 group-hover:shadow-[0_0_40px_rgba(0,212,255,0.12)]" />

        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-cyan/10 transition-all duration-300 group-hover:bg-cyan/20 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]">
          <Icon className="size-7 text-cyan" />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-lg font-semibold text-white">{t(reason.titleKey)}</h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-400">{t(reason.descKey)}</p>
      </div>
    </motion.div>
  );
}

/* ── WhyUs Section ───────────────────────────────────────────────────────────── */
export default function WhyUs() {
  const { t } = useI18n();
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  return (
    <section id="why-us" className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Subtle background pattern */}
      <div className="noise-overlay pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(0,212,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(30,58,138,0.06) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Row 1: Stats Bar ────────────────────────────────────────────── */}
        <div
          ref={statsRef}
          className="glass-strong mb-12 lg:mb-16 rounded-2xl p-6 sm:p-8 md:p-10"
        >
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
            {stats.map((stat, i) => (
              <StatItem key={stat.valueKey} stat={stat} index={i} isInView={statsInView} />
            ))}
          </div>
        </div>

        {/* ── Row 2: Reason Cards ─────────────────────────────────────────── */}
        <motion.div
          className="mb-8 lg:mb-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="gradient-text text-2xl font-extrabold tracking-tight md:text-4xl py-2">
            {t('whyUs.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            {t('whyUs.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reasons.map((reason, i) => (
            <ReasonCard key={reason.titleKey} reason={reason} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
