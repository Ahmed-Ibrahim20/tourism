'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mountain,
  Waves,
  Landmark,
  Heart,
  Users,
  Sparkles,
  Check,
  ArrowRight,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

// ── Animation Variants ──────────────────────────────────────────────────────
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

const planReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

// ── Trip Type Configuration ─────────────────────────────────────────────────
const tripTypes = [
  { key: 'adventure', icon: Mountain, i18nKey: 'tripBuilder.typeAdventure' },
  { key: 'relaxation', icon: Waves, i18nKey: 'tripBuilder.typeRelaxation' },
  { key: 'cultural', icon: Landmark, i18nKey: 'tripBuilder.typeCultural' },
  { key: 'honeymoon', icon: Heart, i18nKey: 'tripBuilder.typeHoneymoon' },
  { key: 'family', icon: Users, i18nKey: 'tripBuilder.typeFamily' },
] as const;

type TripType = (typeof tripTypes)[number]['key'];

// ── Trip Suggestion Logic ───────────────────────────────────────────────────
interface TripSuggestion {
  dest: string;
  destI18nKey: string;
  includes: string[];
  price: number;
}

const getTripSuggestion = (
  budget: number,
  days: number,
  tripType: TripType
): TripSuggestion => {
  const dest =
    budget < 1500
      ? { value: 'Dahab', i18nKey: 'dahab.name' }
      : budget < 3000
        ? { value: 'Hurghada', i18nKey: 'hurghada.name' }
        : { value: 'Sharm El Sheikh', i18nKey: 'sharm.name' };

  const includes: string[] = [];

  if (tripType === 'adventure') {
    includes.push('Scuba Diving', 'Desert Safari', 'Mountain Hiking');
  } else if (tripType === 'relaxation') {
    includes.push('Beach Resort', 'Spa Treatment', 'Sunset Cruise');
  } else if (tripType === 'cultural') {
    includes.push('Ancient Temples Tour', 'Local Market Visit', 'Historical Museums');
  } else if (tripType === 'honeymoon') {
    includes.push('Private Beach Dinner', 'Couples Spa', 'Yacht Cruise');
  } else if (tripType === 'family') {
    includes.push('Snorkeling Trip', 'Water Park', 'Family Resort');
  }

  const price = Math.round(budget * 0.85 + days * 50);

  return {
    dest: dest.value,
    destI18nKey: dest.i18nKey,
    includes,
    price,
  };
};

// ── Days Options ────────────────────────────────────────────────────────────
const dayOptions = Array.from({ length: 12 }, (_, i) => i + 3); // 3–14

// ── Component ───────────────────────────────────────────────────────────────
export default function TripBuilder() {
  const { t } = useI18n();

  const [budget, setBudget] = useState(2000);
  const [days, setDays] = useState(7);
  const [tripType, setTripType] = useState<TripType>('adventure');
  const [showPlan, setShowPlan] = useState(false);

  const suggestion = useMemo(
    () => getTripSuggestion(budget, days, tripType),
    [budget, days, tripType]
  );

  const handleBuild = () => {
    if (showPlan) {
      setShowPlan(false);
      // Brief delay so exit animation completes before re-showing
      setTimeout(() => setShowPlan(true), 350);
    } else {
      setShowPlan(true);
    }
  };

  return (
    <section id="trip-builder" className="relative w-full py-[var(--section-spacing)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* ── Section Header ───────────────────────────────────────────── */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-8 lg:mb-12 text-center"
        >
          <h2 className="gradient-text mb-4 text-2xl font-extrabold tracking-tight md:text-4xl py-2">
            {t('tripBuilder.title')}
          </h2>
          <p className="mx-auto max-w-xl text-lg text-slate-400">
            {t('tripBuilder.subtitle')}
          </p>
        </motion.div>

        {/* ── Glass Form Card ──────────────────────────────────────────── */}
        <motion.div
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="glass-strong rounded-2xl p-6 sm:p-8 md:p-10"
        >
          {/* 1. Budget Slider */}
          <div className="mb-10">
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-cyan-light">
              {t('tripBuilder.budget')}
            </label>
            <div className="mb-4 text-center">
              <span className="text-4xl font-extrabold text-cyan md:text-5xl">
                ${budget.toLocaleString()}
              </span>
            </div>
            <Slider
              min={500}
              max={5000}
              step={100}
              value={[budget]}
              onValueChange={(val) => setBudget(val[0])}
              className="w-full [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-navy-light [&_[data-slot=slider-range]]:bg-cyan [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-cyan [&_[data-slot=slider-thumb]]:bg-cyan [&_[data-slot=slider-thumb]]:shadow-[0_0_12px_rgba(0,212,255,0.5)] [&_[data-slot=slider-thumb]]:hover:shadow-[0_0_20px_rgba(0,212,255,0.7)]"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>$500</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* 2. Days Selector */}
          <div className="mb-10">
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-cyan-light">
              {t('tripBuilder.days')}
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {dayOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                    days === d
                      ? 'bg-cyan text-navy shadow-[0_0_16px_rgba(0,212,255,0.4)]'
                      : 'glass text-slate-300 hover:border-cyan/30 hover:text-cyan'
                  }`}
                  aria-label={`${d} ${t('tripBuilder.daysLabel')}`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-sm text-slate-400">
              {days} {t('tripBuilder.daysLabel')}
            </p>
          </div>

          {/* 3. Trip Type Selector */}
          <div className="mb-10">
            <label className="mb-3 block text-sm font-semibold uppercase tracking-wider text-cyan-light">
              {t('tripBuilder.type')}
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
              {tripTypes.map(({ key, icon: Icon, i18nKey }) => {
                const isSelected = tripType === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTripType(key)}
                    className={`group flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-300 ${
                      isSelected
                        ? 'border border-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,212,255,0.2)]'
                        : 'glass hover:border-cyan/30 hover:bg-cyan/5'
                    }`}
                  >
                    <Icon
                      className={`size-6 transition-colors duration-300 ${
                        isSelected ? 'text-cyan' : 'text-slate-400 group-hover:text-cyan-light'
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold transition-colors duration-300 ${
                        isSelected ? 'text-cyan' : 'text-slate-400 group-hover:text-foreground'
                      }`}
                    >
                      {t(i18nKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Build Button */}
          <div className="text-center">
            <Button
              size="lg"
              onClick={handleBuild}
              className="cta-glow h-14 rounded-full bg-cyan px-10 text-base font-bold text-navy hover:bg-cyan-light"
            >
              <Sparkles className="mr-2 size-5" />
              {t('tripBuilder.buildBtn')}
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </div>
        </motion.div>

        {/* ── Suggested Plan Output ─────────────────────────────────────── */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            {showPlan && (
              <motion.div
                key={`${budget}-${days}-${tripType}`}
                variants={planReveal}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glass-strong rounded-2xl p-6 sm:p-8 md:p-10"
              >
                {/* Plan Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan/15">
                    <Sparkles className="size-5 text-cyan" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {t('tripBuilder.suggestedPlan')}
                  </h3>
                </div>

                {/* Destination */}
                <div className="mb-6 rounded-xl border border-cyan/15 bg-cyan/5 p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Destination
                  </p>
                  <p className="text-2xl font-extrabold text-cyan">
                    {t(suggestion.destI18nKey)}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {days} {t('tripBuilder.daysLabel')} &middot; ${budget.toLocaleString()} {t('tripBuilder.budget').toLowerCase()}
                  </p>
                </div>

                {/* Includes List */}
                <div className="mb-8">
                  <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-light">
                    {t('tripBuilder.includes')}
                  </p>
                  <ul className="space-y-3">
                    {suggestion.includes.map((item, index) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.1, duration: 0.4 }}
                        className="flex items-center gap-3"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan/15">
                          <Check className="size-3.5 text-cyan" />
                        </span>
                        <span className="text-base font-medium text-slate-200">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-col items-center gap-4 border-t border-cyan/10 pt-6 sm:flex-row sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {t('tripBuilder.totalPrice')}
                    </p>
                    <p className="text-3xl font-extrabold text-cyan text-glow-cyan">
                      ${suggestion.price.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="cta-glow rounded-full bg-cyan px-8 font-bold text-navy hover:bg-cyan-light"
                    asChild
                  >
                    <a href="#contact">
                      {t('tripBuilder.inquire')}
                      <ArrowRight className="ml-2 size-4" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
