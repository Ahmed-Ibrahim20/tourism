'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ContactFormData {
  name: string;
  email: string;
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
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Simulate a brief loading state to show the smooth animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Construct the email body
    const subject = encodeURIComponent(`New Travel Inquiry from ${data.name}`);
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
    );

    // Open user's default email client
    window.location.href = `mailto:info@dahabdreamtour.com?subject=${subject}&body=${body}`;

    // Show success toast for UX
    toast.success('Email client opened!', {
      description: `Thanks ${data.name}, please send the email to reach our travel experts.`,
      icon: <CheckCircle className="size-5 text-cyan" />,
    });

    reset();
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
      {/* Background: navy with subtle cyan glow at center */}
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
        {/* ── Split Layout: Info Left, Form Right ────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* ── LEFT SIDE: Contact Info ──────────────────────────────────── */}
          <motion.div
            className="flex flex-col justify-center"
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Tagline Badge */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium tracking-wide text-cyan-light">
                <Send className="size-3.5" />
                Start Planning
              </span>
            </motion.div>

            {/* Title */}
            <motion.h2
              custom={0.15}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="gradient-text mb-4 text-3xl font-extrabold tracking-tight md:text-4xl"
            >
              {t('contact.title')}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              custom={0.3}
              variants={fadeUp}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="mb-10 max-w-md text-base leading-relaxed text-slate-400 md:text-lg"
            >
              {t('contact.subtitle')}
            </motion.p>

            {/* Contact Info Items */}
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
                    <a
                      key={index}
                      href={item.href}
                      className="block no-underline"
                    >
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
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-5"
                noValidate
              >
                {/* Name Field */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="contact-name"
                    className="text-sm font-semibold uppercase tracking-wider text-cyan-light"
                  >
                    {t('contact.name')}
                  </Label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder={t('contact.name')}
                    className="h-12 rounded-xl border-cyan/15 bg-navy/80 text-foreground placeholder:text-slate-500 focus:border-cyan focus:ring-cyan/20"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="contact-email"
                    className="text-sm font-semibold uppercase tracking-wider text-cyan-light"
                  >
                    {t('contact.email')}
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder={t('contact.email')}
                    className="h-12 rounded-xl border-cyan/15 bg-navy/80 text-foreground placeholder:text-slate-500 focus:border-cyan focus:ring-cyan/20"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                {/* Message Field */}
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="contact-message"
                    className="text-sm font-semibold uppercase tracking-wider text-cyan-light"
                  >
                    {t('contact.message')}
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    placeholder={t('contact.message')}
                    className="min-h-[120px] rounded-xl border-cyan/15 bg-navy/80 text-foreground placeholder:text-slate-500 focus:border-cyan focus:ring-cyan/20"
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters',
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="cta-glow mt-2 h-13 w-full rounded-xl bg-cyan px-8 text-base font-bold text-navy hover:bg-cyan-light disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        className="inline-block size-4 rounded-full border-2 border-navy/30 border-t-navy"
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.8,
                          ease: 'linear',
                        }}
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
