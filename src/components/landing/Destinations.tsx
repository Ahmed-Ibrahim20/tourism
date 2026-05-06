"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import dynamic from "next/dynamic";

const DestinationModal = dynamic(() => import("./DestinationModal"), {
  ssr: false,
});

/* ── Data ──────────────────────────────────────────────────────────────────── */

const destinations = [
  { id: "aswan", name: "aswan.name", tagline: "aswan.tagline", image: "/images/hero/01-giza.jpg" },
  { id: "dahab", name: "dahab.name", tagline: "dahab.tagline", image: "/images/hero/02-dahab.jpg" },
  { id: "hurghada", name: "hurghada.name", tagline: "hurghada.tagline", image: "/images/hero/03-hurghada.jpg" },
  { id: "sharm", name: "sharm.name", tagline: "sharm.tagline", image: "/images/hero/04-sharm.jpg" },
  { id: "luxor", name: "luxor.name", tagline: "luxor.tagline", image: "/images/hero/05-luxor.jpg" },
  { id: "alexandria", name: "alexandria.name", tagline: "alexandria.tagline", image: "/images/hero/06-alexandria.jpg" },
  { id: "nile", name: "nile.name", tagline: "nile.tagline", image: "/images/hero/07-nile.jpg" },
  { id: "sinai", name: "sinai.name", tagline: "sinai.tagline", image: "/images/hero/08-sinai.jpg" },
] as const;

/* ── Single destination card ───────────────────────────────────────────────── */

/* ── Single destination card ───────────────────────────────────────────────── */

function DestinationCard({
  destination,
  index,
  onSelect,
}: {
  destination: (typeof destinations)[number];
  index: number;
  onSelect: (id: string) => void;
}) {
  const { t } = useI18n();

  return (
    <div
      className="group cursor-pointer transition-transform duration-300 hover:-translate-y-2 will-change-transform animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both w-full flex justify-center"
      style={{ animationDelay: `${index * 150}ms` }}
      onClick={() => onSelect(destination.id)}
    >
      <div className="glass-card relative h-[320px] w-full max-w-[380px] min-[465px]:max-w-none min-[465px]:h-[240px] sm:h-[280px] md:h-[320px] overflow-hidden rounded-2xl">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={destination.image}
            alt={t(destination.name)}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 will-change-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>

        {/* Gradient overlay */}
        <div className="destination-overlay absolute inset-0 z-10" />

        {/* Hover glow ring */}
        <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border border-transparent transition-all duration-500 group-hover:border-cyan/30 group-hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]" />

        {/* Content */}
        <div className="relative z-30 flex h-full flex-col justify-end p-6 min-[465px]:p-4 sm:p-5 md:p-6">
          <h3
            className="font-bold text-white/90 transition-opacity duration-300 group-hover:text-white text-3xl min-[465px]:text-xl sm:text-2xl md:text-3xl lg:text-4xl"
          >
            {t(destination.name)}
          </h3>
          <p className="mt-1 text-sm min-[465px]:text-xs sm:text-sm font-medium text-cyan-light line-clamp-2">
            {t(destination.tagline)}
          </p>

          <Button
            variant="ghost"
            className="mt-3 md:mt-4 w-fit h-10 min-[465px]:h-8 sm:h-10 gap-2 self-start rounded-full border border-cyan/30 bg-cyan/10 px-5 min-[465px]:px-3 sm:px-5 text-sm min-[465px]:text-xs sm:text-sm font-medium text-cyan-light backdrop-blur-sm transition-all duration-300 hover:border-cyan/60 hover:bg-cyan/20 hover:text-white"
          >
            {t("destinations.cta")}
            <ArrowRight className="size-4 min-[465px]:size-3.5 sm:size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Destinations section ──────────────────────────────────────────────────── */

export default function Destinations() {
  const { t } = useI18n();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const selected = destinations.find((d) => d.id === selectedDestination) ?? null;

  return (
    <section
      id="destinations"
      className="relative overflow-hidden py-16 px-4 md:px-8 lg:px-12"
    >
      {/* Subtle radial glow at top */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Section header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="gradient-text text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("destinations.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            {t("destinations.subtitle")}
          </p>
        </motion.div>

        <div
          className="grid grid-cols-1 gap-4 min-[465px]:grid-cols-2 lg:grid-cols-4 xl:gap-6"
        >
          {destinations.map((dest, i) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              index={i}
              onSelect={setSelectedDestination}
            />
          ))}
        </div>
      </div>

      {/* Modal - key resets state when destination changes */}
      <DestinationModal
        key={selected?.id ?? 'closed'}
        destination={
          selected
            ? {
                id: selected.id,
                name: t(selected.name),
                tagline: t(selected.tagline),
                image: selected.image,
              }
            : null
        }
        onClose={() => setSelectedDestination(null)}
      />
    </section>
  );
}
