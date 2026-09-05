'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, MapPin, Clock, Share2, BookOpen,
  Sparkles, CheckCircle2, User, Quote, Bookmark,
  MessageCircle,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { apiService, Service } from '@/services/api';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { toast } from 'sonner';

const fallbackArticles: Record<string, {
  titleAr: string;
  titleEn: string;
  image: string;
  location: string;
  introAr: string;
  introEn: string;
  section1Ar: { title: string; body: string };
  section1En: { title: string; body: string };
  quoteAr: string;
  quoteEn: string;
  quoteAuthorAr: string;
  quoteAuthorEn: string;
  section2Ar: { title: string; body: string };
  section2En: { title: string; body: string };
  section3Ar: { title: string; body: string };
  section3En: { title: string; body: string };
  highlightsAr: string[];
  highlightsEn: string[];
  tagsAr: string[];
  tagsEn: string[];
}> = {
  '1': {
    titleAr: 'مغامرات الغوص وسحر الشعاب المرجانية في البحر الأحمر',
    titleEn: 'Scuba Diving & Red Sea Coral Reef Adventures',
    image: '/images/experience-diving.png',
    location: 'دهب وشرم الشيخ',
    introAr: 'يُعتبر البحر الأحمر واحداً من أكثر المقاصد البحرية إبهاراً على مستوى العالم.',
    introEn: 'The Red Sea is globally celebrated as one of the world\'s most pristine marine habitats.',
    section1Ar: { title: 'استكشاف الثقب الأزرق ومحمية رأس محمد', body: 'تتمتع دهب بسحر خاص ينبع من هدوء جبالها وشواطئها الفيروزية.' },
    section1En: { title: 'Exploring the Blue Hole & Ras Mohammed Drop-offs', body: 'Dahab combines bohemian serenity with dramatic mountain drop-offs into deep azure waters.' },
    quoteAr: 'النزول إلى أعماق البحر الأحمر كالدخول إلى عالم أسطوري.',
    quoteEn: 'Descending into the Red Sea is like stepping into an underwater cosmos.',
    quoteAuthorAr: 'فريق الاستكشاف البحري — دهب دريم تور',
    quoteAuthorEn: 'Marine Expedition Team — Dahab Dream Tour',
    section2Ar: { title: 'تجهيزات الغوص والسلامة البيئية', body: 'تلتزم جميع مراكز الغوص الشريكة بأعلى معايير السلامة الدولية المعتمدة من منظمة PADI.' },
    section2En: { title: 'Equipment Standards & Ecological Marine Preservation', body: 'All partner dive centers adhere strictly to international PADI safety regulations.' },
    section3Ar: { title: 'التصوير تحت الماء والغوص الليلي', body: 'تُتيح لك مياه البحر الأحمر الصافية التقاط صور وفيديوهات فائقة الدقة.' },
    section3En: { title: 'Underwater Photography & Bioluminescent Night Dives', body: 'Unmatched water visibility creates flawless conditions for underwater photography.' },
    highlightsAr: ['مواقع غوص عالمية معتمدة من PADI', 'رؤية فائقة تحت الماء', 'مرشدون محترفون', 'شعاب مرجانية نادرة'],
    highlightsEn: ['PADI Certified World-class Dive Sites', 'Crystal-clear Visibility Up to 40 Meters', 'Expert Private Guides', 'Vibrant Rare Corals & Tropical Marine Life'],
    tagsAr: ['#غوص_البحر_الأحمر', '#دهب', '#شرم_الشيخ', '#شعاب_مرجانية'],
    tagsEn: ['#RedSeaDiving', '#Dahab', '#SharmElSheikh', '#CoralReefs'],
  },
  '2': {
    titleAr: 'سحر الصحراء والنجوم الساطعة في سيناء',
    titleEn: 'Sinai Desert Magic & Star Gazing Experiences',
    image: '/images/experience-desert.png',
    location: 'صحراء سيناء',
    introAr: 'تخبئ صحراء سيناء في طياتها سحراً لا يضاهى.',
    introEn: 'The Sinai Desert holds timeless magic where colorful canyons meet golden sand dunes.',
    section1Ar: { title: 'مغامرة السفاري والجلسات البدوية', body: 'بعد مغامرة قيادة الدراجات بين الممرات الجبلية الوعرة.' },
    section1En: { title: 'ATV Quad Safari & Bedouin Camp Heritage', body: 'After an exciting quad ride through winding mountain canyons.' },
    quoteAr: 'الهدوء في صحراء سيناء ليلاً يمنح الروح سكينة لا توصف.',
    quoteEn: 'Nighttime in Sinai brings unbroken silence to the soul.',
    quoteAuthorAr: 'دليل السفاري الصحراوية — سيناء',
    quoteAuthorEn: 'Sinai Desert Guide Team',
    section2Ar: { title: 'رصد النجوم والتصوير الفلكي', body: 'بعيداً عن أضواء المدينة وصخبها، توفر صحراء سيناء واحدة من أصفى سماء الليل.' },
    section2En: { title: 'Stargazing & Astrophotography Hotspots', body: 'Far away from urban light pollution, Sinai offers some of the clearest night skies.' },
    section3Ar: { title: 'نصائح هامة قبل خوض رحلة السفاري', body: 'احرص على ارتداء الملابس المريحة والشال البدوي لحماية الوجه.' },
    section3En: { title: 'Essential Desert Safari Tips', body: 'Wear comfortable breathable clothing, pack a traditional scarf for dust protection.' },
    highlightsAr: ['سفاري بالدراجات الرباعية', 'جلسات بدوية', 'رصد النجوم', 'مرشدون بدويون'],
    highlightsEn: ['Exciting ATV Quad Mountain Safari', 'Traditional Bedouin Camp Dinner', 'Milky Way Stargazing', 'Expert Bedouin Guides'],
    tagsAr: ['#سفاري_سيناء', '#رصد_النجوم', '#مغامرات_مصر'],
    tagsEn: ['#SinaiSafari', '#Stargazing', '#DesertAdventure'],
  },
  '3': {
    titleAr: 'رحلات اليخوت الفاخرة ومواقع السباحة البكر',
    titleEn: 'Luxury Yacht Cruises & Virgin Reef Snorkeling',
    image: '/images/experience-yacht.png',
    location: 'الغردقة والجونة',
    introAr: 'تأخذك رحلات اليخوت الخاصة في إبحار هادئ عبر مياه البحر الأحمر الفيروزية.',
    introEn: 'Private yacht cruises offer serene sailing across turquoise Red Sea waters.',
    section1Ar: { title: 'الإبحار إلى جزيرة جفتون', body: 'استمتع بالسباحة في مياه دافئة وشفافة تسحر العقول.' },
    section1En: { title: 'Sailing to Giftun Island & Pristine Marine Reserves', body: 'Swim in crystalline warm waters surrounding Giftun Island.' },
    quoteAr: 'على متن اليخت الخاص، يلتقي زرقاء السماء بفيروز البحر.',
    quoteEn: 'Aboard a private yacht, sky and sea merge into turquoise harmony.',
    quoteAuthorAr: 'ربان اليخوت البحرية — الغردقة',
    quoteAuthorEn: 'Hurghada Marine Captains',
    section2Ar: { title: 'وجبات المأكولات البحرية الطازجة', body: 'يعد لك الطهاة على متن اليخت وجبات فاخرة من المأكولات البحرية.' },
    section2En: { title: 'Fresh Gourmet Seafood & Deck Dining', body: 'Onboard chefs prepare fresh seafood platters and flame-grilled delicacies.' },
    section3Ar: { title: 'الأنشطة البحرية المتاحة على متن الرحلة', body: 'تشمل الرحلة معدات السباحة والغطس السطحي.' },
    section3En: { title: 'Water Sports & Family Amenities', body: 'Cruises include professional snorkeling gear, paddleboards, and speedboat add-ons.' },
    highlightsAr: ['يخت خاص فاخر', 'وجبات بحرية طازجة', 'مراقبة الدلافين', 'معدات غطس'],
    highlightsEn: ['Fully Equipped Luxury Private Yacht', 'Fresh Gourmet Seafood', 'Dolphin Watching', 'Snorkeling Equipment'],
    tagsAr: ['#رحلات_يخوت', '#الغردقة', '#الجونة'],
    tagsEn: ['#YachtCruise', '#Hurghada', '#ElGouna'],
  },
};

const relatedArticles = [
  { id: '1', titleAr: 'مغامرات الغوص وسحر الشعاب المرجانية', titleEn: 'Scuba Diving & Red Sea Coral Reef Adventures', image: '/images/experience-diving.png', location: 'دهب وشرم الشيخ', time: '5 min read' },
  { id: '2', titleAr: 'سحر الصحراء والنجوم الساطعة في سيناء', titleEn: 'Sinai Desert Magic & Star Gazing Experiences', image: '/images/experience-desert.png', location: 'صحراء سيناء', time: '4 min read' },
  { id: '3', titleAr: 'رحلات اليخوت الفاخرة ومواقع السباحة البكر', titleEn: 'Luxury Yacht Cruises & Virgin Reef Snorkeling', image: '/images/experience-yacht.png', location: 'الغردقة والجونة', time: '6 min read' },
];

export default function ArticleDetailsClient() {
  const params = useParams();
  const router = useRouter();
  const { t, lang, dir } = useI18n();

  const idParam = String(params?.id || '1');
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      try {
        const res = await apiService.public.services.show(idParam);
        if (res && res.data) {
          setService(res.data);
        }
      } catch (err) {
        console.warn('Could not fetch dynamic service article, using fallback display');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [idParam]);

  const fallback = fallbackArticles[idParam] || fallbackArticles['1'];

  const title = service
    ? (service.name_translations?.[lang] || service.name)
    : (lang === 'ar' ? fallback.titleAr : fallback.titleEn);

  const introText = lang === 'ar' ? fallback.introAr : fallback.introEn;
  const section1 = lang === 'ar' ? fallback.section1Ar : fallback.section1En;
  const section2 = lang === 'ar' ? fallback.section2Ar : fallback.section2En;
  const section3 = lang === 'ar' ? fallback.section3Ar : fallback.section3En;
  const quote = lang === 'ar' ? fallback.quoteAr : fallback.quoteEn;
  const quoteAuthor = lang === 'ar' ? fallback.quoteAuthorAr : fallback.quoteAuthorEn;
  const highlights = service?.amenities || service?.policies || (lang === 'ar' ? fallback.highlightsAr : fallback.highlightsEn);
  const tags = lang === 'ar' ? fallback.tagsAr : fallback.tagsEn;

  const coverImage = service?.cover_url || fallback.image;
  const locationTag = service?.address || service?.destination?.name || service?.category?.name || fallback.location;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === 'ar' ? 'تم نسخ رابط المقال' : 'Article link copied!');
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked
      ? (lang === 'ar' ? 'تمت إزالة المقال من المحفوظات' : 'Removed from bookmarks')
      : (lang === 'ar' ? 'تم حفظ المقال بنجاح' : 'Saved to bookmarks!'));
  };

  return (
    <div className="min-h-screen bg-navy text-slate-100 flex flex-col justify-between selection:bg-cyan selection:text-navy">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Top Header & Breadcrumb */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-8">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:border-cyan/40 hover:text-cyan transition-all mb-6"
          >
            {dir === 'rtl' ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
            <span>{lang === 'ar' ? 'العودة إلى المقالات والتجارب' : 'Back to Articles & Experiences'}</span>
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan/10 border border-cyan/30 text-cyan text-xs font-extrabold tracking-wide">
              <MapPin className="size-3.5" />
              {locationTag}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-full border text-xs font-semibold transition-all cursor-pointer ${isBookmarked ? 'bg-cyan text-navy border-cyan' : 'bg-white/5 border-white/10 text-slate-300 hover:text-cyan hover:border-cyan/40'}`}
                title="Bookmark article"
              >
                <Bookmark className="size-4" />
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-cyan/40 text-xs font-semibold transition-all cursor-pointer"
              >
                <Share2 className="size-3.5 text-cyan" />
                <span>{lang === 'ar' ? 'مشاركة' : 'Share'}</span>
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            {title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium border-b border-white/10 pb-6">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5 text-cyan" />
              Dahab Dream Tour Editorial
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-cyan" />
              {lang === 'ar' ? '5 دقائق قراءة' : '5 min read'}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-3.5 text-cyan" />
              {lang === 'ar' ? 'دليل شامل' : 'Comprehensive Guide'}
            </span>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-16">
          <div className="relative h-[360px] sm:h-[480px] md:h-[540px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-navy-light">
            <Image src={coverImage} alt={title} fill unoptimized priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-70" />
          </div>
        </div>

        {/* Editorial Body */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative">
          <div className="flex gap-12 items-start justify-center">

            {/* Sticky Social Bar */}
            <aside className="hidden lg:flex flex-col gap-3 sticky top-36 shrink-0 py-2">
              <button onClick={handleShare} className="flex size-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:border-cyan/40 hover:text-cyan hover:bg-cyan/10 transition-all cursor-pointer shadow-lg" title="Share Article">
                <Share2 className="size-4" />
              </button>
              <button onClick={toggleBookmark} className={`flex size-11 items-center justify-center rounded-2xl border transition-all cursor-pointer shadow-lg ${isBookmarked ? 'bg-cyan text-navy border-cyan' : 'bg-white/5 border-white/10 text-slate-300 hover:border-cyan/40 hover:text-cyan hover:bg-cyan/10'}`} title="Save Article">
                <Bookmark className="size-4" />
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" className="flex size-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all cursor-pointer shadow-lg" title="Share on WhatsApp">
                <MessageCircle className="size-4" />
              </a>
            </aside>

            {/* Main Article Column */}
            <article className="w-full max-w-3xl space-y-8 text-slate-200">

              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-normal first-letter:text-6xl first-letter:font-black first-letter:text-cyan first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                {introText}
              </p>

              <div className="space-y-4 pt-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight border-b border-white/10 pb-3">{section1.title}</h2>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">{section1.body}</p>
              </div>

              <figure className="my-10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
                    <Image src="/images/experience-diving.png" alt="Coral Reefs" fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
                  </div>
                  <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
                    <Image src="/images/experience-snorkeling.png" alt="Marine Wildlife" fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-60" />
                  </div>
                </div>
                <figcaption className="text-center text-xs text-slate-400 font-medium italic">
                  {lang === 'ar' ? 'شعاب مرجانية نادرة وأسماك استوائية في مياه البحر الأحمر الشفافة' : 'High-visibility coral reef gardens and exotic marine wildlife off the coast of Dahab.'}
                </figcaption>
              </figure>

              <blockquote className="my-12 relative p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-cyan/15 via-white/[0.03] to-transparent border-l-4 border-cyan shadow-2xl backdrop-blur-md">
                <Quote className="size-10 text-cyan/40 mb-3" />
                <p className="text-xl sm:text-2xl font-bold italic text-white leading-relaxed">"{quote}"</p>
                <cite className="block mt-4 text-xs font-black uppercase tracking-wider text-cyan not-italic">— {quoteAuthor}</cite>
              </blockquote>

              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight border-b border-white/10 pb-3">{section2.title}</h2>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">{section2.body}</p>
              </div>

              <div className="my-12 p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-cyan/20 border border-cyan/40 text-cyan">
                    <Sparkles className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{lang === 'ar' ? 'أبرز نقاط التقييم والتجربة' : 'Key Expedition Highlights'}</h4>
                    <p className="text-xs text-slate-400">{lang === 'ar' ? 'معلومات أساسية لكل مسافر ومستكشف' : 'Essential insights for your adventure'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
                      <CheckCircle2 className="size-5 text-cyan shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200 font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight border-b border-white/10 pb-3">{section3.title}</h2>
                <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal">{section3.body}</p>
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-bold mr-2">{lang === 'ar' ? 'الوسوم:' : 'Tags:'}</span>
                {tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-cyan text-xs font-semibold hover:border-cyan/40 transition-colors">{tag}</span>
                ))}
              </div>

              <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-navy-light/80 border border-white/10 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
                <div className="relative size-20 rounded-full overflow-hidden border-2 border-cyan shrink-0 shadow-lg">
                  <Image src="/images/hero/02-dahab.jpg" alt="Author" fill unoptimized className="object-cover" />
                </div>
                <div className="space-y-1.5 text-center sm:text-left">
                  <h4 className="text-base font-bold text-white">Written by Dahab Dream Tour Editorial Team</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {lang === 'ar'
                      ? 'فريق من مدربي الغوص والمرشدين الجغرافيين وكُتّاب الرحلات المخصصين لتقديم أحدث أدلة ومقالات السفر في مصر.'
                      : 'Our passionate team of dive instructors, marine guides, and travel writers crafting authentic Egyptian travel guides.'}
                  </p>
                </div>
              </div>

            </article>
          </div>

          {/* Related Articles */}
          <div className="mt-24 pt-16 border-t border-white/10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <BookOpen className="size-6 text-cyan" />
                <span>{lang === 'ar' ? 'مقالات وتجارب قد تعجبك' : 'Read Next: Related Articles'}</span>
              </h3>
              <Link href="/experiences" className="text-xs font-bold text-cyan hover:text-white transition-colors flex items-center gap-1">
                <span>{lang === 'ar' ? 'عرض الكل' : 'View All'}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((art) => (
                <Link key={art.id} href={`/experiences/${art.id}`} className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-navy-light/60 p-5 shadow-xl hover:border-cyan/40 hover:-translate-y-1.5 transition-all duration-300">
                  <div>
                    <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-4 bg-navy">
                      <Image src={art.image} alt={art.titleEn} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2">
                        <span className="rounded-full bg-navy/80 border border-cyan/30 px-2.5 py-0.5 text-[10px] font-bold text-cyan backdrop-blur-md">{art.location}</span>
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan transition-colors line-clamp-2 leading-snug mb-2">
                      {lang === 'ar' ? art.titleAr : art.titleEn}
                    </h4>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="size-3 text-cyan" />{art.time}</span>
                    <span className="text-cyan font-bold flex items-center gap-1 group-hover:text-white transition-colors">
                      <span>{lang === 'ar' ? 'اقرأ' : 'Read'}</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
