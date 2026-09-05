'use client';

import React, { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, Clock, Send, CheckCircle, Calendar, Moon, Users, Baby, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { apiService } from '@/services/api';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  adultsCount: number;
  childrenCount: number;
  durationMode: 'dates' | 'nights';
  startDate: string;
  endDate: string;
  nightsCount: number;
  message: string;
}

// ── Animation Variants ─────────────────────────────────────────────────────────
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

const infoItemVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

// ── Component ──────────────────────────────────────────────────────────────────
export default function Contact() {
  const { t, dir } = useI18n();
  const isRTL = dir === 'rtl';
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [durationMode, setDurationMode] = useState<'dates' | 'nights'>('dates');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      adultsCount: 2,
      childrenCount: 0,
      nightsCount: 3,
      durationMode: 'dates',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const nightsCountVal = watch('nightsCount');

  // Auto-compute nights count when dates mode is active
  const calculatedNights = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : null;
  }, [startDate, endDate]);

  const onSubmit = async (data: ContactFormData) => {
    try {
      const nameParts = data.name.trim().split(' ');
      const firstName = nameParts[0] || data.name;
      const lastName = nameParts.slice(1).join(' ') || undefined;

      const computedNights =
        durationMode === 'dates'
          ? calculatedNights || 1
          : parseInt(String(data.nightsCount)) || 1;

      const res = await apiService.public.quotes.submit({
        first_name: firstName,
        last_name: lastName,
        email: data.email,
        phone: data.phone,
        adults_count: parseInt(String(data.adultsCount)) || 1,
        children_count: parseInt(String(data.childrenCount)) || 0,
        nights_count: computedNights,
        preferred_date: data.startDate || undefined,
        message: data.message,
      });

      if (res.success || res.data) {
        toast.success(t('quote.success_title') || 'Inquiry Submitted Successfully!', {
          description: `Thanks ${data.name}, our travel experts will contact you shortly.`,
          icon: <CheckCircle className="size-5 text-cyan" />,
        });
        reset();
      }
    } catch (err) {
      // Fallback open mailto if API network fails
      const computedNights =
        durationMode === 'dates'
          ? calculatedNights || 1
          : parseInt(String(data.nightsCount)) || 1;

      const subject = encodeURIComponent(`New Travel Inquiry from ${data.name}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nAdults: ${data.adultsCount}\nChildren: ${data.childrenCount}\nNights: ${computedNights}\nStart Date: ${data.startDate}\n\nMessage:\n${data.message}`
      );
      window.location.href = `mailto:info@dahabdreamtour.com?subject=${subject}&body=${body}`;
      toast.success('Email client opened!', {
        description: `Thanks ${data.name}, please send the email to reach our travel experts.`,
      });
      reset();
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'info@dahabdreamtour.com',
      href: 'mailto:info@dahabdreamtour.com',
    },
    {
      icon: Phone,
      label: '+20 10 61558461',
      href: 'tel:+201061558461',
    },
    {
      icon: Clock,
      label: 'Available 24/7',
      href: null,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full overflow-hidden py-24 md:py-32"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-navy">
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,212,255,0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* ── LEFT SIDE: Contact Info ──────────────────────────────────── */}
          <motion.div
            className="flex flex-col justify-center"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
              <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium tracking-wide text-cyan-light">
                <Send className="size-3.5" />
                Start Planning
              </span>
            </motion.div>

            <motion.h2
              custom={0.15}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="gradient-text mb-4 text-3xl font-extrabold tracking-tight md:text-4xl"
            >
              {t('contact.title')}
            </motion.h2>

            <motion.p
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="mb-10 max-w-md text-base leading-relaxed text-slate-400 md:text-lg"
            >
              {t('contact.subtitle')}
            </motion.p>

            <div className="flex flex-col gap-6">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                const content = (
                  <motion.div
                    key={index}
                    custom={0.4 + index * 0.1}
                    variants={infoItemVariant}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    className="group flex items-center gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 transition-all duration-300 group-hover:border-cyan/40 group-hover:bg-cyan/15">
                      <Icon className="size-5 text-cyan" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-slate-200 transition-colors duration-300 group-hover:text-cyan-light">
                        {item.label}
                      </p>
                    </div>
                  </motion.div>
                );

                if (item.href) {
                  return (
                    <a key={index} href={item.href} className="block no-underline">
                      {content}
                    </a>
                  );
                }

                return <div key={index}>{content}</div>;
              })}
            </div>
          </motion.div>

          {/* ── RIGHT SIDE: Contact Form ─────────────────────────────────── */}
          <motion.div
            custom={0.2}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="glass-strong rounded-2xl p-6 sm:p-8 md:p-10">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-cyan-light">
                      {t('contact.name')}
                    </Label>
                    <Input
                      id="contact-name"
                      type="text"
                      placeholder={t('contact.name')}
                      className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground placeholder:text-slate-500 focus:border-cyan focus:ring-cyan/20"
                      {...register('name', { required: 'Name is required' })}
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-cyan-light">
                      {t('contact.email')}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder={t('contact.email')}
                      className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground placeholder:text-slate-500 focus:border-cyan focus:ring-cyan/20"
                      {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Phone & Pax Row (Adults + Children) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Phone */}
                  <div className="flex flex-col gap-2 sm:col-span-1">
                    <Label htmlFor="contact-phone" className="text-xs font-semibold uppercase tracking-wider text-cyan-light flex items-center gap-1">
                      <Phone className="size-3 text-cyan" />
                      {t('contact.phone') || 'Phone'}
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      placeholder="+20 ..."
                      className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground placeholder:text-slate-500 focus:border-cyan focus:ring-cyan/20"
                      {...register('phone', { required: 'Phone is required' })}
                    />
                    {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
                  </div>

                  {/* Adults Count */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-adults" className="text-xs font-semibold uppercase tracking-wider text-cyan-light flex items-center gap-1">
                      <Users className="size-3 text-cyan" />
                      {t('contact.adults') || 'Adults'}
                    </Label>
                    <Input
                      id="contact-adults"
                      type="number"
                      min="1"
                      max="50"
                      className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground focus:border-cyan focus:ring-cyan/20"
                      {...register('adultsCount', { required: true, min: 1 })}
                    />
                  </div>

                  {/* Children Count */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-children" className="text-xs font-semibold uppercase tracking-wider text-cyan-light flex items-center gap-1">
                      <Baby className="size-3 text-cyan" />
                      {t('contact.children') || 'Children'}
                    </Label>
                    <Input
                      id="contact-children"
                      type="number"
                      min="0"
                      max="50"
                      className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground focus:border-cyan focus:ring-cyan/20"
                      {...register('childrenCount', { min: 0 })}
                    />
                  </div>
                </div>

                {/* Duration Mode Switcher Toggle */}
                <div className="space-y-2 pt-2 border-t border-cyan/10">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-1.5">
                      <Clock className="size-3.5 text-cyan" />
                      {t('contact.durationMode') || 'Duration Option'}
                    </Label>
                    {durationMode === 'dates' && calculatedNights && (
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan/20 border border-cyan/30 text-cyan text-xs font-bold">
                        <Sparkles className="size-3" />
                        {calculatedNights} {isRTL ? 'ليالي' : 'Nights'}
                      </span>
                    )}
                  </div>

                  {/* Mode Buttons */}
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-navy/60 border border-cyan/15">
                    <button
                      type="button"
                      onClick={() => setDurationMode('dates')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        durationMode === 'dates'
                          ? 'bg-cyan text-navy shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Calendar className="size-3.5" />
                      <span>{t('contact.modeDates') || 'By Dates'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationMode('nights')}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        durationMode === 'nights'
                          ? 'bg-cyan text-navy shadow-md'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Moon className="size-3.5" />
                      <span>{t('contact.modeNights') || 'By Nights'}</span>
                    </button>
                  </div>
                </div>

                {/* Duration Mode Inputs */}
                {durationMode === 'dates' ? (
                  /* Option A: Start Date & End Date */
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="start-date" className="text-xs font-semibold text-slate-300">
                        {t('filter.from') || 'Check-in Date'}
                      </Label>
                      <Input
                        id="start-date"
                        type="date"
                        className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground focus:border-cyan [color-scheme:dark]"
                        {...register('startDate', { required: durationMode === 'dates' })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="end-date" className="text-xs font-semibold text-slate-300">
                        {t('filter.to') || 'Check-out Date'}
                      </Label>
                      <Input
                        id="end-date"
                        type="date"
                        className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground focus:border-cyan [color-scheme:dark]"
                        {...register('endDate', { required: durationMode === 'dates' })}
                      />
                    </div>
                  </div>
                ) : (
                  /* Option B: Nights Count & Start Date */
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="nights-count" className="text-xs font-semibold text-slate-300">
                        {t('contact.nights') || 'Number of Nights'}
                      </Label>
                      <Input
                        id="nights-count"
                        type="number"
                        min="1"
                        max="60"
                        className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground focus:border-cyan"
                        {...register('nightsCount', { required: durationMode === 'nights', min: 1 })}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="start-date-nights" className="text-xs font-semibold text-slate-300">
                        {t('contact.startDate') || 'Start Date'}
                      </Label>
                      <Input
                        id="start-date-nights"
                        type="date"
                        className="h-11 rounded-xl border-cyan/15 bg-navy/80 text-foreground focus:border-cyan [color-scheme:dark]"
                        {...register('startDate', { required: durationMode === 'nights' })}
                      />
                    </div>
                  </div>
                )}

                {/* Message Field */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-cyan-light">
                    {t('contact.message')}
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={3}
                    placeholder={t('contact.message')}
                    className="min-h-[90px] rounded-xl border-cyan/15 bg-navy/80 text-foreground placeholder:text-slate-500 focus:border-cyan"
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="cta-glow mt-1 h-12 w-full rounded-xl bg-cyan px-8 text-base font-bold text-navy hover:bg-cyan-light disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        className="inline-block size-4 rounded-full border-2 border-navy/30 border-t-navy"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="size-4" />
                      {t('contact.submit')}
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
