"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Heart, Compass, Sparkles, Landmark, Waves } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

/* ─────────────────────────────────────────────────────────────────────────────
 * Types & Interfaces
 * ───────────────────────────────────────────────────────────────────────────── */

export interface ModalOption {
  /** Unique identifier for the option */
  id: string;
  /** Translation key for the title */
  titleKey: string;
  /** Translation key for the description */
  descriptionKey: string;
  /** Icon component to display */
  icon: React.ComponentType<{ className?: string }>;
  /** Destination route path */
  href: string;
  /** Background image URL for the option card */
  image?: string;
}

export interface SelectionModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Title displayed at the top of the modal */
  title?: string;
  /** Subtitle displayed below the title */
  subtitle?: string;
  /** Array of options to display (3-4 recommended) */
  options: ModalOption[];
  /** Position of trigger button relative to modal */
  triggerPosition?: "top" | "center";
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Animation Variants
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * Overlay fade animation
 */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/**
 * Modal container scale/fade animation
 */
const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 340,
      damping: 28,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

/**
 * Staggered children animation for option cards
 */
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.15 + index * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/* ─────────────────────────────────────────────────────────────────────────────
 * Single Option Card Component
 * ───────────────────────────────────────────────────────────────────────────── */

function OptionCard({
  option,
  index,
  onClick,
}: {
  option: ModalOption;
  index: number;
  onClick: () => void;
}) {
  const { t } = useI18n();
  const Icon = option.icon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="group"
    >
      <Link
        href={option.href}
        onClick={onClick}
        className="relative flex h-full min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl border border-cyan/10 bg-navy-light/60 backdrop-blur-md transition-all duration-400 hover:border-cyan/30 hover:bg-navy-light/80 hover:shadow-[0_8px_40px_rgba(0,212,255,0.15)]"
      >
        {/* ── Background Image (if provided) ── */}
        {option.image && (
          <div className="absolute inset-0 z-0">
            <img
              src={option.image}
              alt={t(option.titleKey)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-transparent" />
          </div>
        )}

        {/* ── Gradient Overlay (when no image) ── */}
        {!option.image && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 via-transparent to-royal-blue/5" />
        )}

        {/* ── Hover Glow Ring ── */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent transition-all duration-500 group-hover:border-cyan/40 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]" />

        {/* ── Content Container ── */}
        <div className="relative z-10 flex flex-col p-5 md:p-6">
          {/* ── Icon ── */}
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan/15 text-cyan transition-all duration-300 group-hover:bg-cyan/25 group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]">
            <Icon className="size-6" />
          </div>

          {/* ── Title ── */}
          <h3 className="mb-2 text-lg font-bold text-white transition-colors duration-300 group-hover:text-cyan-light">
            {t(option.titleKey)}
          </h3>

          {/* ── Description ── */}
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-300 transition-colors duration-300 group-hover:text-slate-200">
            {t(option.descriptionKey)}
          </p>

          {/* ── Arrow Indicator ── */}
          <div className="mt-4 flex items-center text-sm font-semibold text-cyan opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
            <span className="mr-2">{t("common.explore") || "Explore"}</span>
            <svg
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Main Selection Modal Component
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * SelectionModal - A premium glassmorphic modal for displaying 3-4 clickable options
 *
 * @param isOpen - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param title - Modal title
 * @param subtitle - Modal subtitle
 * @param options - Array of clickable options
 *
 * @example
 * ```tsx
 * const options = [
 *   { id: 'destinations', titleKey: 'modal.destinations', descriptionKey: 'modal.destinationsDesc', icon: MapPin, href: '/destinations' },
 *   { id: 'honeymoon', titleKey: 'modal.honeymoon', descriptionKey: 'modal.honeymoonDesc', icon: Heart, href: '/honeymoon' },
 *   { id: 'experiences', titleKey: 'modal.experiences', descriptionKey: 'modal.experiencesDesc', icon: Compass, href: '/experiences' },
 * ];
 *
 * <SelectionModal isOpen={isOpen} onClose={() => setIsOpen(false)} options={options} />
 * ```
 */
export default function SelectionModal({
  isOpen,
  onClose,
  title,
  subtitle,
  options,
}: SelectionModalProps) {
  const { t } = useI18n();

  // Handle ESC key press
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  // Lock body scroll when modal is open
  // and add keyboard listener
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  if (typeof window !== "undefined") {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    }
  }

  const handleOptionClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* ── Backdrop ── */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* ── Modal Container ── */}
          <motion.div
            className="glass-strong relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* ── Close Button ── */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-navy/60 text-white backdrop-blur-md transition-all duration-300 hover:bg-cyan/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan/50"
              aria-label="Close modal"
            >
              <X className="size-5" />
            </button>

            {/* ── Header Section ── */}
            <div className="relative border-b border-cyan/10 bg-navy/30 px-6 py-8 md:px-10 md:py-10">
              {/* Subtle background glow */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30">
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      "radial-gradient(ellipse at right center, rgba(0,212,255,0.15) 0%, transparent 70%)",
                  }}
                />
              </div>

              <div className="relative z-10">
                {/* Optional badge/tag */}
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="size-4 text-cyan" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-cyan-light">
                    {t("modal.badge") || "Choose Your Experience"}
                  </span>
                </div>

                {/* Title */}
                <h2
                  id="modal-title"
                  className="gradient-text mb-2 text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl"
                >
                  {title || t("modal.defaultTitle") || "What would you like to explore?"}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                  <p className="max-w-xl text-base leading-relaxed text-slate-400">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* ── Options Grid ── */}
            <div className="flex-1 overflow-y-auto bg-navy/20 p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
                {options.map((option, index) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    index={index}
                    onClick={handleOptionClick}
                  />
                ))}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-cyan/10 bg-navy/30 px-6 py-4 md:px-10 md:py-5">
              <p className="text-center text-xs text-slate-500">
                {t("modal.footer") || "Select an option to continue"}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Hook for Managing Modal State
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * useModalState - Custom hook to manage SelectionModal state
 *
 * @returns { isOpen, open, close, toggle }
 *
 * @example
 * ```tsx
 * const { isOpen, open, close, toggle } = useModalState();
 *
 * return (
 *   <>
 *     <button onClick={open}>Open Modal</button>
 *     <SelectionModal isOpen={isOpen} onClose={close} options={options} />
 *   </>
 * );
 * ```
 */
export function useModalState() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Example Usage & Demo Component
 * ───────────────────────────────────────────────────────────────────────────── */

/**
 * DemoSelectionModal - Complete working example with all 4 options
 * This component demonstrates how to use the SelectionModal with
 * real data and proper routing
 *
 * Replace the placeholder routes (/destinations, /honeymoon, etc.)
 * with your actual page routes when implementing
 */
export function DemoSelectionModal() {
  const { isOpen, open, close } = useModalState();

  // Define the 4 exploration options
  // These would typically come from a config or CMS
  const explorationOptions: ModalOption[] = [
    {
      id: "destinations",
      titleKey: "nav.destinations",
      descriptionKey: "modal.destinationsDesc",
      icon: MapPin,
      href: "/destinations",
      image: "/images/hero/01-giza.jpg",
    },
    {
      id: "honeymoon",
      titleKey: "nav.honeymoon",
      descriptionKey: "modal.honeymoonDesc",
      icon: Heart,
      href: "/honeymoon",
      image: "/images/honeymoon-couple.png",
    },
    {
      id: "experiences",
      titleKey: "nav.experiences",
      descriptionKey: "modal.experiencesDesc",
      icon: Compass,
      href: "/experiences",
      image: "/images/experience-diving.png",
    },
    {
      id: "packages",
      titleKey: "modal.packages",
      descriptionKey: "modal.packagesDesc",
      icon: Landmark,
      href: "/packages",
    },
  ];

  const { t } = useI18n();

  return (
    <>
      {/* Trigger Button - Replace with your own trigger */}
      <button
        onClick={open}
        className="cta-glow rounded-full bg-cyan px-8 py-3 font-bold text-navy transition-all hover:bg-cyan-light"
      >
        Explore Egypt
      </button>

      {/* The Modal */}
      <SelectionModal
        isOpen={isOpen}
        onClose={close}
        title={t("modal.exploreTitle") || "Discover Your Perfect Egyptian Adventure"}
        subtitle={
          t("modal.exploreSubtitle") ||
          "Select a category below to begin planning your dream journey"
        }
        options={explorationOptions}
      />
    </>
  );
}

export { MapPin, Heart, Compass, Sparkles, Landmark, Waves };