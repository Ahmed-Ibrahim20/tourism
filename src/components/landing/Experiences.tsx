"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Anchor,
  Compass,
  Ship,
  Landmark,
  Fish,
  Sparkles,
  ArrowRight,
  MapPin,
  BookOpen
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { apiService, Service } from "@/services/api";

const defaultExperiences = [
  {
    id: 1,
    nameKey: "experience.scubaDiving",
    title: "مغامرات الغوص وسحر الشعاب المرجانية في البحر الأحمر",
    image: "/images/experience-diving.png",
    desc: "اقرأ عن تجارب واستكشاف أعماق البحر الأحمر، وأهم النصائح للغواصين المبتدئين والمحترفين في دهب وشرم الشيخ.",
    location: "دهب وشرم الشيخ",
    icon: Anchor,
  },
  {
    id: 2,
    nameKey: "experience.desertSafari",
    title: "سحر الصحراء والنجوم الساطعة في سيناء",
    image: "/images/experience-desert.png",
    desc: "دليل شامل لتجارب السفر في الصحراء، ركوب الدراجات الرباعية، وسهرات الجلسات البدوية تحت أضواء النجوم.",
    location: "صحراء سيناء",
    icon: Compass,
  },
  {
    id: 3,
    nameKey: "experience.yachtCruise",
    title: "رحلات اليخوت الفاخرة ومواقع السباحة البكر",
    image: "/images/experience-yacht.png",
    desc: "تجارب الإبحار الخاص في البحر الأحمر، استكشاف الجزر النائية وأجمل الجولات البحرية عند غروب الشمس.",
    location: "الغردقة والجونة",
    icon: Ship,
  },
  {
    id: 4,
    nameKey: "experience.culturalTours",
    title: "أسرار الفراعنة وعظمة التاريخ في الأقصر وأسوان",
    image: "/images/experience-culture.png",
    desc: "مقالة تفصيلية عن زيارة المقابر الفرعونية ومعابد الكرنك وفيلة، وأفضل الأوقات لالتقاط أروع الصور التذكارية.",
    location: "الأقصر وأسوان",
    icon: Landmark,
  },
  {
    id: 5,
    nameKey: "experience.snorkeling",
    title: "عالم الألوان تحت الماء في الثقب الأزرق",
    image: "/images/experience-snorkeling.png",
    desc: "نصائح وإرشادات للسباحة والغطس السطحي بين الأسماك الاستوائية والشعاب المرجانية في محميات سيناء.",
    location: "دهب - Blue Hole",
    icon: Fish,
  },
  {
    id: 6,
    nameKey: "experience.spaWellness",
    title: "الاسترخاء والرفاهية الصحية على شواطئ البحر",
    image: "/images/experience-spa.png",
    desc: "تجربة التعافي والاستجمام الطبيعي، وجلسات السبا المميزة مع إطلالات بانورامية ساحرة على البحر.",
    location: "منتجعات سيناء",
    icon: Sparkles,
  },
];

export default function Experiences() {
  const { t, lang, dir } = useI18n();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublicServices() {
      setLoading(true);
      try {
        const res = await apiService.public.services.index({ per_page: 6 });
        if (res?.data && res.data.length > 0) {
          setServices(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch public services for experiences section");
      } finally {
        setLoading(false);
      }
    }
    fetchPublicServices();
  }, [lang]);

  return (
    <section
      id="experiences"
      className="relative overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-12"
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
            {t("experience.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400 text-sm sm:text-base">
            {t("experience.subtitle")}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length > 0
            ? services.map((srv, i) => {
                const title = srv.name_translations?.[lang] || srv.name;
                const desc = srv.short_description_translations?.[lang] || srv.description_translations?.[lang] || srv.short_description || srv.description || title;
                const cover = srv.cover_url || defaultExperiences[i % defaultExperiences.length].image;
                const tag = srv.address || srv.destination?.name || srv.category?.name || 'تجارب وقصص السفر';

                return (
                  <motion.div
                    key={srv.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link
                      href={`/experiences/${srv.id}`}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-navy/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-cyan/40 hover:-translate-y-2 h-full"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="relative h-52 w-full overflow-hidden rounded-2xl mb-4 bg-navy-light">
                          <Image
                            src={cover}
                            alt={title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className="rounded-full bg-navy/80 border border-cyan/30 px-3 py-1 text-xs font-bold text-cyan backdrop-blur-md flex items-center gap-1">
                              <MapPin className="size-3 text-cyan" />
                              {tag}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white group-hover:text-cyan transition-colors mb-2.5 line-clamp-2 leading-snug">
                          {title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-cyan transition-colors">
                          {lang === 'ar' ? 'مقالة مفصلة' : 'Travel Article'}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-cyan group-hover:text-white transition-colors bg-cyan/10 px-3 py-1.5 rounded-xl border border-cyan/20">
                          <span>{t("experience.readArticle") || (lang === 'ar' ? 'اقرأ المقال' : 'Read Article')}</span>
                          <ArrowRight className={`size-3.5 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            : defaultExperiences.map((exp, i) => {
                const Icon = exp.icon;
                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link
                      href={`/experiences/${exp.id}`}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-navy/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-cyan/40 hover:-translate-y-2 h-full"
                    >
                      <div>
                        <div className="relative h-52 w-full overflow-hidden rounded-2xl mb-4 bg-navy-light">
                          <Image
                            src={exp.image}
                            alt={exp.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className="rounded-full bg-navy/80 border border-cyan/30 px-3 py-1 text-xs font-bold text-cyan backdrop-blur-md flex items-center gap-1">
                              <MapPin className="size-3 text-cyan" />
                              {exp.location}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white group-hover:text-cyan transition-colors mb-2.5 line-clamp-2 leading-snug">
                          {exp.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {exp.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-cyan transition-colors">
                          {lang === 'ar' ? 'مقالة مفصلة' : 'Travel Article'}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-cyan group-hover:text-white transition-colors bg-cyan/10 px-3 py-1.5 rounded-xl border border-cyan/20">
                          <span>{t("experience.readArticle") || (lang === 'ar' ? 'اقرأ المقال' : 'Read Article')}</span>
                          <ArrowRight className={`size-3.5 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
