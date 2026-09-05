"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import dynamic from "next/dynamic";
import { apiService, Destination } from "@/services/api";

const DestinationModal = dynamic(() => import("./DestinationModal"), {
  ssr: false,
});

/* Default fallback images by destination slug */
const fallbackImages: Record<string, string> = {
  aswan: "/images/hero/01-giza.jpg",
  dahab: "/images/hero/02-dahab.jpg",
  hurghada: "/images/hero/03-hurghada.jpg",
  "sharm-el-sheikh": "/images/hero/04-sharm.jpg",
  sharm: "/images/hero/04-sharm.jpg",
  luxor: "/images/hero/05-luxor.jpg",
  alexandria: "/images/hero/06-alexandria.jpg",
  nile: "/images/hero/07-nile.jpg",
  sinai: "/images/hero/08-sinai.jpg",
};

export default function Destinations() {
  const { t, lang } = useI18n();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  useEffect(() => {
    async function fetchPublicDestinations() {
      setLoading(true);
      try {
        const res = await apiService.public.destinations.index();
        if (res?.data && res.data.length > 0) {
          setDestinations(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch public destinations from API");
      } finally {
        setLoading(false);
      }
    }
    fetchPublicDestinations();
  }, [lang]);

  return (
    <section
      id="destinations"
      className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-12"
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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-navy-light/40 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                index={i}
                onSelect={(d) => setSelectedDestination(d)}
              />
            ))}
          </div>
        )}
      </div>

      <DestinationModal
        key={selectedDestination?.id ?? "closed"}
        destination={
          selectedDestination
            ? {
                id: selectedDestination.id,
                name: selectedDestination.name_translations?.[lang] || selectedDestination.name,
                tagline: selectedDestination.short_description_translations?.[lang] || selectedDestination.short_description || selectedDestination.name,
                image: selectedDestination.cover_url || fallbackImages[selectedDestination.slug] || "/images/hero/04-sharm.jpg",
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
  destination: Destination;
  index: number;
  onSelect: (dest: Destination) => void;
}) {
  const { t, lang, dir } = useI18n();
  const [imgSrc, setImgSrc] = useState(
    destination.cover_url || fallbackImages[destination.slug] || "/images/hero/04-sharm.jpg"
  );

  const destName = destination.name_translations?.[lang] || destination.name;
  const destTagline = destination.short_description_translations?.[lang] || destination.short_description || destName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={() => onSelect(destination)}
      className="group relative h-96 overflow-hidden rounded-3xl border border-white/10 bg-navy cursor-pointer shadow-xl transition-all duration-500 hover:border-cyan/40 hover:-translate-y-1.5"
    >
      {/* Background Image */}
      <Image
        src={imgSrc}
        alt={destName}
        fill
        unoptimized
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        onError={() => {
          const fallback = fallbackImages[destination.slug] || "/images/hero/04-sharm.jpg";
          if (imgSrc !== fallback) {
            setImgSrc(fallback);
          }
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent transition-opacity duration-300 group-hover:via-navy/30" />

      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-navy/80 border border-cyan/30 text-cyan text-xs font-bold backdrop-blur-md">
          <MapPin className="size-3" /> {destName}
        </span>
      </div>

      {/* Content Bottom */}
      <div className="absolute bottom-0 inset-x-0 p-6 z-10 space-y-2">
        <h3 className="text-2xl font-black text-white group-hover:text-cyan transition-colors">
          {destName}
        </h3>
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {destTagline}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-bold text-cyan flex items-center gap-1">
            {t("destinations.exploreOptions")}
            <ArrowRight className={`size-3.5 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
