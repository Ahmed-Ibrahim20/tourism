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

/* ── Single experience card ────────────────────────────────────────────────── */

function ExperienceCard({
  experience,
}: {
  experience: (typeof experiences)[number];
}) {
  const { t } = useI18n();
  const Icon = experience.icon;

  return (
    <motion.div variants={cardReveal} className="group flex w-full justify-center h-full">
      <div className="relative flex w-full max-w-[400px] flex-col overflow-hidden rounded-3xl bg-[#0B1728]/80 backdrop-blur-md border border-white/5 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(0,212,255,0.15)] hover:border-cyan/30 sm:max-w-none">
        {/* Subtle top glow on hover */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Image Container (Top) */}
        <div className="relative h-[240px] w-full shrink-0 overflow-hidden sm:h-[220px] lg:h-[250px]">
          <Image
            src={experience.image}
            alt={t(experience.nameKey)}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Dim overlay */}
          <div className="absolute inset-0 bg-navy/20 transition-colors duration-500 group-hover:bg-transparent" />
          
          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B1728]/90 to-transparent pointer-events-none" />

          {/* Badge */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-navy/60 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white/90 shadow-lg transition-transform duration-500 group-hover:border-cyan/40">
            <Icon className="size-3.5 text-cyan drop-shadow-[0_0_5px_rgba(0,212,255,0.5)]" />
            <span>{t(experience.nameKey)}</span>
          </div>
        </div>

        {/* Content Container (Bottom) */}
        <div className="relative z-10 flex flex-1 flex-col px-6 pb-6 pt-2">
          <h3 className="text-xl font-bold leading-tight text-white transition-colors duration-300 md:text-2xl group-hover:text-cyan-light">
            {t(experience.nameKey)}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">
            {experience.desc}
          </p>

          <div className="mt-6 flex flex-1 items-end pt-2">
            <div className="flex w-full items-center justify-between border-t border-white/10 pt-4 transition-colors duration-300 group-hover:border-cyan/20">
              <span className="text-sm font-semibold tracking-wide text-cyan-light transition-colors group-hover:text-cyan">
                {t("experiences.learnMore")}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 group-hover:bg-cyan group-hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                <ArrowRight className="size-4 text-white transition-transform duration-300 group-hover:-rotate-45 group-hover:text-navy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Experiences section ──────────────────────────────────────────────────── */

export default function Experiences() {
  const { t } = useI18n();

  return (
    <section
      id="experiences"
      className="relative overflow-hidden pt-24 pb-8 md:pb-12 px-4"
    >
      {/* Subtle animated background pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(30,58,138,0.08) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Subtle dot grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,212,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2 className="gradient-text text-4xl font-extrabold tracking-tight md:text-5xl">
            {t("experiences.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            {t("experiences.subtitle")}
          </p>
        </motion.div>

        {/* Experience cards grid */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </motion.div>

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 md:mt-8 flex justify-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="group relative overflow-hidden rounded-full border-cyan/30 bg-navy/50 backdrop-blur-md px-8 py-6 text-sm font-bold tracking-wide text-cyan transition-all duration-300 hover:border-cyan-light hover:bg-cyan/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] md:px-10 md:py-7 md:text-base"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("experiences.viewMore")}
              <ArrowRight className="size-4 md:size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
