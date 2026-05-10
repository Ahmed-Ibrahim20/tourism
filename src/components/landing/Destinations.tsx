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


export default function Destinations() {
  const { t } = useI18n();
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const selected = destinations.find((d) => d.id === selectedDestination) ?? null;

  return (
    <section
      id="destinations"
      className="relative overflow-hidden py-[var(--section-spacing)] px-[var(--container-padding)]"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4 py-2">
            {t("destinations.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            {t("destinations.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onSelect(destination.id)}
    >
      <div className="glass-card relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 group-hover:border-cyan/30 transition-all duration-300">
        <Image
          src={destination.image}
          alt={t(destination.name)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan transition-colors">
            {t(destination.name)}
          </h3>
          <p className="text-xs text-white/60 line-clamp-2 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {t(destination.tagline)}
          </p>
          
          <div className="mt-4 flex items-center text-cyan text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
            {t("destinations.cta")}
            <ArrowRight className="ml-2 size-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
