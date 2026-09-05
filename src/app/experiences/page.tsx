'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, BookOpen, Search, Filter } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { apiService, Service } from '@/services/api';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

export default function ExperiencesIndexPage() {
  const { t, lang, dir } = useI18n();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadServices() {
      setLoading(true);
      try {
        const res = await apiService.public.services.index({ search, per_page: 20 });
        if (res?.data) {
          setServices(res.data);
        }
      } catch (err) {
        console.warn('Failed to load services articles list');
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [search, lang]);

  return (
    <div className="min-h-screen bg-navy text-slate-100 flex flex-col justify-between selection:bg-cyan selection:text-navy">
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="glass mb-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan shadow-sm">
              <BookOpen className="h-4 w-4" />
              {t("experience.title")}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black gradient-text mb-4 py-2">
              {t("experience.title")}
            </h1>
            <p className="mx-auto max-w-2xl text-slate-400 text-sm sm:text-base">
              {t("experience.subtitle")}
            </p>
          </div>

          {/* Search Bar */}
          <div className="mx-auto max-w-xl mb-12 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث في المقالات والتجارب...' : 'Search articles and experiences...'}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none shadow-xl backdrop-blur-xl"
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv, i) => {
              const title = srv.name_translations?.[lang] || srv.name;
              const desc = srv.short_description_translations?.[lang] || srv.description_translations?.[lang] || srv.short_description || srv.description || title;
              const cover = srv.cover_url || '/images/experience-diving.png';
              const tag = srv.address || srv.destination?.name || srv.category?.name || 'تجارب وقصص السفر';

              return (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link
                    href={`/experiences/${srv.id}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-navy/80 p-6 shadow-xl backdrop-blur-xl transition-all duration-500 hover:border-cyan/40 hover:-translate-y-2 h-full"
                  >
                    <div>
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
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
