"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Anchor,
  Compass,
  Ship,
  Landmark,
  Fish,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

/* ── Data ──────────────────────────────────────────────────────────────────── */

const experiences = [
  {
    id: "diving",
    nameKey: "experience.scubaDiving",
    image: "/images/experience-diving.png",
    desc: "Explore vibrant coral reefs and encounter majestic marine life in the crystal-clear waters of the Red Sea.",
    icon: Anchor,
  },
  {
    id: "desert",
    nameKey: "experience.desertSafari",
    image: "/images/experience-desert.png",
    desc: "Ride through golden sand dunes, discover hidden oases, and witness breathtaking desert sunsets.",
    icon: Compass,
  },
  {
    id: "yacht",
    nameKey: "experience.yachtCruise",
    image: "/images/experience-yacht.png",
    desc: "Sail along the stunning Red Sea coastline on a private luxury yacht with gourmet dining.",
    icon: Ship,
  },
  {
    id: "culture",
    nameKey: "experience.culturalTours",
    image: "/images/experience-culture.png",
    desc: "Discover ancient Egyptian temples, historic sites, and immerse yourself in rich cultural heritage.",
    icon: Landmark,
  },
  {
    id: "snorkeling",
    nameKey: "experience.snorkeling",
    image: "/images/experience-snorkeling.png",
    desc: "Swim among colorful tropical fish and explore shallow coral gardens perfect for all skill levels.",
    icon: Fish,
  },
  {
    id: "spa",
    nameKey: "experience.spaWellness",
    image: "/images/experience-spa.png",
    desc: "Indulge in world-class spa treatments with ocean views and holistic wellness programs.",
    icon: Sparkles,
  },
];

/* ── Animation variants ────────────────────────────────────────────────────── */

const sectionFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 50, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};


export default function Experiences() {
  const { t } = useI18n();

  return (
    <section
      id="experiences"
      className="relative overflow-hidden py-[var(--section-spacing)] px-[var(--container-padding)]"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-4 py-2">
            {t("experiences.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            {t("experiences.subtitle")}
          </p>
        </motion.div>

        {/* Experience cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiences.map((exp, i) => (
            <ExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
        </div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex justify-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-cyan/30 px-10 py-6 text-cyan hover:bg-cyan/10"
          >
            {t("experiences.viewMore")}
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function ExperienceCard({
  experience,
  index,
}: {
  experience: (typeof experiences)[number];
  index: number;
}) {
  const { t } = useI18n();
  const Icon = experience.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative flex flex-col bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-cyan/30 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={experience.image}
          alt={t(experience.nameKey)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-navy/20 group-hover:bg-transparent transition-colors" />
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-navy/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <Icon className="size-4 text-cyan" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {t(experience.nameKey)}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-cyan transition-colors">
          {t(experience.nameKey)}
        </h3>
        <p className="text-sm text-slate-400 mb-8 flex-1 leading-relaxed">
          {experience.desc}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <span className="text-xs font-bold text-cyan uppercase tracking-wider">
            {t("experiences.learnMore")}
          </span>
          <div className="size-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan transition-all">
            <ArrowRight className="size-4 text-white group-hover:text-navy transition-transform group-hover:-rotate-45" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
