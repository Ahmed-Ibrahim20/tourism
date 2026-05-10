'use client'

import { use, useState } from 'react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, MapPin, Clock, ArrowRight, Check, 
  Calendar, Users, ShieldCheck, Share2, Heart, 
  ChevronLeft, ChevronRight, Info, ChevronDown, Languages
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { MOCK_PRODUCTS } from '@/lib/mockData'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'

import { useSearchParams, useRouter } from 'next/navigation'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const searchParams = useSearchParams()
  const locationParam = searchParams.get('location')
  
  let product = MOCK_PRODUCTS.find(p => p.id === id)

  if (!product) {
    const parts = id.split('-');
    const isBooking = id.startsWith('BKG-');
    const cat = isBooking ? 'tours' : (parts[1] || 'tours');
    
    const loc = locationParam || (dir === 'rtl' ? 'مصر' : 'Egypt');
    const titleName = t(`category.${cat}`);
    const formattedTitle = isBooking && locationParam 
      ? locationParam 
      : (dir === 'rtl' ? `${titleName} في ${loc}` : `${loc} - ${titleName}`);
      
    const descText = dir === 'rtl' 
      ? (isBooking ? `هذه تفاصيل حجزك الخاص بـ ${formattedTitle}. نتمنى لك رحلة سعيدة!` : `استمتع بأفضل عروض ${titleName} في ${loc} المصممة خصيصاً لتجربة لا تنسى.`)
      : (isBooking ? `These are the details for your booking: ${formattedTitle}. Enjoy your trip!` : `Enjoy the best ${titleName} offers in ${loc} designed for an unforgettable experience.`);

    product = {
      id,
      category: cat,
      titleKey: formattedTitle,
      price: cat === 'honeymoon' ? 1200 : cat === 'hotels' ? 450 : 150,
      rating: 5,
      image: '/images/hero/01-giza.jpg',
      images: ['/images/hero/01-giza.jpg', '/images/hero/02-dahab.jpg', '/images/hero/04-sharm.jpg'],
      location: loc,
      locationKey: '',
      duration: dir === 'rtl' ? 'حسب الاختيار' : 'Custom',
      descriptionKey: descText,
      includes: [
        dir === 'rtl' ? 'إقامة مميزة' : 'Premium accommodation',
        dir === 'rtl' ? 'وجبات مشمولة' : 'Meals included',
        dir === 'rtl' ? 'جولات سياحية' : 'Guided tours'
      ],
      itinerary: [
        {
          day: 1,
          title: dir === 'rtl' ? 'الوصول والاستقبال' : 'Arrival & Welcome',
          description: dir === 'rtl' ? 'استقبال في المطار أو محطة الوصول والتسكين في مكان الإقامة.' : 'Pickup and accommodation check-in.'
        },
        {
          day: 2,
          title: dir === 'rtl' ? 'جولة حرة' : 'Free Tour',
          description: dir === 'rtl' ? 'استكشاف أهم المعالم السياحية.' : 'Explore the main attractions.'
        }
      ]
    } as any;
  }

  const [activeImg, setActiveImg] = useState(0)

  // Booking Form State
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [date, setDate] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      toast.error(dir === 'rtl' ? 'يرجى اختيار تاريخ السفر' : 'Please select a travel date');
      return;
    }
    if (!name || name.trim().length < 3) {
      toast.error(dir === 'rtl' ? 'يرجى إدخال الاسم بالكامل (3 أحرف على الأقل)' : 'Please enter your full name (at least 3 characters)');
      return;
    }
    if (!phone || phone.trim().length < 8) {
      toast.error(dir === 'rtl' ? 'يرجى إدخال رقم هاتف صحيح' : 'Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);
    const totalPrice = product.price * (adults + children * 0.5);

    setTimeout(() => {
      setIsSubmitting(false);
      const ref = 'BKG-' + Math.floor(100000 + Math.random() * 900000);
      toast.success(dir === 'rtl' ? 'تم إرسال طلبك بنجاح!' : 'Your request has been sent successfully!');
      router.push(
        `/booking-success?ref=${ref}&price=${totalPrice}&title=${encodeURIComponent(t(product.titleKey))}`
      );
    }, 1500);
  }

  if (!product) return <div className="flex h-screen items-center justify-center bg-navy text-white">Product not found</div>

  const images = product.images || [product.image]

  return (
    <div className="min-h-screen bg-navy selection:bg-cyan/30" dir={dir}>
      <Navbar />
      <main className="mx-auto max-w-[1600px] px-6 py-12 md:px-12 lg:px-20">
        <nav className="mb-10 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-cyan transition-colors">{t('nav.home')}</Link>
          <span className="opacity-50">/</span>
          <span className="text-slate-300">{t(`category.${product.category}`)}</span>
          <span className="opacity-50">/</span>
          <span className="text-cyan font-bold">{t(product.titleKey)}</span>
        </nav>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* SIDEBAR */}
          <aside className="w-full lg:max-w-[400px] lg:sticky lg:top-32 order-2 lg:order-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-navy-light/40 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                <div>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">{t('product.startingFrom')}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl md:text-4xl font-black text-white">${product.price}</span>
                    <span className="text-gray-500 text-xs font-bold">/ {t('product.person')}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-yellow-500 mb-1.5"><Star className="w-4 h-4 fill-current" /><span className="font-bold text-sm text-white">{product.rating}</span></div>
                  <p className="text-cyan text-[10px] font-bold underline decoration-cyan/30 underline-offset-4">{product.reviews?.length || 0} {t('product.reviews')}</p>
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-6">
                {/* Dates */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan" /> {t('product.travelDates')}
                  </label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full h-14 bg-[#0a1428] border border-white/10 text-white rounded-xl px-4 text-sm font-medium outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Travelers */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-cyan" /> {t('product.travelers')}
                  </label>
                  <div className="bg-[#0a1428] border border-white/5 rounded-2xl p-4 space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-sm font-bold">{t('product.adults')}</p>
                        <p className="text-slate-500 text-[10px]">{isRTL ? '+12 سنة' : '+12 years'}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-navy rounded-xl border border-white/10 p-1">
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">-</button>
                        <span className="w-4 text-center text-sm font-black text-white">{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">+</button>
                      </div>
                    </div>
                    {/* Children */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div>
                        <p className="text-white text-sm font-bold">{t('product.children')}</p>
                        <p className="text-slate-500 text-[10px]">{isRTL ? '2-12 سنة' : '2-12 years'}</p>
                      </div>
                      <div className="flex items-center gap-4 bg-navy rounded-xl border border-white/10 p-1">
                        <button type="button" onClick={() => setChildren(Math.max(0, children - 1))} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">-</button>
                        <span className="w-4 text-center text-sm font-black text-white">{children}</span>
                        <button type="button" onClick={() => setChildren(children + 1)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{isRTL ? 'الاسم بالكامل' : 'Full Name'}</label>
                    <input 
                      type="text" 
                      required
                      placeholder={isRTL ? 'أدخل اسمك بالكامل' : 'Enter your full name'}
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full h-14 bg-[#0a1428] border border-white/10 text-white rounded-xl px-4 text-sm outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{isRTL ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+20 100 000 0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full h-14 bg-[#0a1428] border border-white/10 text-white rounded-xl px-4 text-sm outline-none focus:border-cyan focus:ring-1 focus:ring-cyan/30 transition-all placeholder:text-slate-600"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Total Price Calculation */}
                <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between bg-cyan/5 p-4 rounded-2xl">
                  <span className="text-white font-bold">{isRTL ? 'الإجمالي التقديري' : 'Estimated Total'}</span>
                  <span className="text-2xl font-black text-cyan">${product.price * (adults + (children * 0.5))}</span>
                </div>

                {/* Submit */}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-cyan hover:bg-cyan-light text-navy font-black text-lg rounded-2xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                      {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                    </span>
                  ) : (
                    t('product.requestBooking')
                  )}
                </Button>
              </form>

              <div className="flex gap-4 pt-6">
                <Button variant="outline" className="flex-1 h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-cyan rounded-xl gap-2 text-slate-300 text-xs font-bold transition-all">
                  <Heart className="w-4 h-4" /> {t('product.save')}
                </Button>
                <Button variant="outline" className="flex-1 h-12 border-white/10 bg-white/5 hover:bg-white/10 hover:text-cyan rounded-xl gap-2 text-slate-300 text-xs font-bold transition-all">
                  <Share2 className="w-4 h-4" /> {t('product.share')}
                </Button>
              </div>

              <div className="pt-8 mt-6 border-t border-white/5 space-y-4 bg-navy/30 -mx-8 -mb-8 p-8 rounded-b-[2rem]">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </div>
                  {t('product.secureTransaction')}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Info className="w-4 h-4 text-blue-400" />
                  </div>
                  {t('product.freeCancellation')}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 space-y-10 w-full order-1 lg:order-2">
            <section className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-[16/9] rounded-3xl overflow-hidden group shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
                    <Image src={images[activeImg]} alt={t(product.titleKey)} fill className="object-cover" priority />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent" />
                <div className={`absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button onClick={() => setActiveImg((prev) => (prev > 0 ? prev - 1 : images.length - 1))} className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-cyan hover:text-navy transition-all"><ChevronLeft className="w-5 h-5" /></button>
                  <button onClick={() => setActiveImg((prev) => (prev < images.length - 1 ? prev + 1 : 0))} className="p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-cyan hover:text-navy transition-all"><ChevronRight className="w-5 h-5" /></button>
                </div>
              </motion.div>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`relative w-32 aspect-video rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImg === i ? 'border-cyan' : 'border-transparent'}`}>
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-navy-light/20 rounded-3xl p-8 md:p-10 border border-white/5">
              <Tabs defaultValue="overview" className="w-full" dir={isRTL ? 'rtl' : 'ltr'}>
                <TabsList className="bg-white/5 p-1 rounded-xl mb-8 flex flex-wrap h-auto gap-1">
                  {['overview', 'itinerary', 'includes', 'reviews'].map((tab) => (
                    <TabsTrigger key={tab} value={tab} className="flex-1 min-w-[100px] py-2.5 rounded-lg data-[state=active]:bg-cyan data-[state=active]:text-navy transition-all uppercase font-bold text-[10px] tracking-wider">
                      {t(`product.${tab}`)}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
                  <div className="max-w-none">
                    <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-tight">{t(product.titleKey)}</h2>
                    <p className="text-lg text-slate-400 leading-relaxed mb-10">{t(product.descriptionKey)}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/5">
                      {[
                        { icon: Clock, label: t('product.duration'), value: product.duration || 'Flexible' },
                        { icon: MapPin, label: t('product.location'), value: t(product.locationKey) },
                        { icon: Users, label: t('product.guests'), value: t('product.guestsLabel', { count: 4 }) },
                        { icon: Languages, label: t('product.language'), value: t('product.languagesList') }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                          <item.icon className="w-4 h-4 text-cyan" />
                          <div><p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-0.5">{item.label}</p><p className="text-white font-bold text-base">{item.value}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-0 focus-visible:outline-none">
                  <div className="space-y-8">
                    {product.itinerary?.map((item, idx) => (
                      <div key={idx} className="flex gap-6 relative">
                        {idx !== product.itinerary!.length - 1 && <div className={`absolute top-10 bottom-0 w-px bg-white/5 ${isRTL ? 'right-[15px]' : 'left-[15px]'}`} />}
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-cyan flex items-center justify-center font-bold text-sm shrink-0 z-10">{idx + 1}</div>
                        <div className="pt-1 space-y-2">
                          <h4 className="text-lg font-bold text-white">{t('product.day')} {idx + 1}: {item.title}</h4>
                          <p className="text-slate-400 text-base leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    )) || <p className="text-slate-500 text-sm italic">{t('product.itineraryEmpty')}</p>}
                  </div>
                </TabsContent>

                <TabsContent value="includes" className="mt-0 focus-visible:outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.includes?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-white font-medium text-sm">{item}</span>
                      </div>
                    )) || <p className="text-slate-500 text-sm italic">{t('product.itineraryEmpty')}</p>}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 focus-visible:outline-none">
                  <div className="space-y-6">
                    {product.reviews?.map((review, idx) => (
                      <div key={idx} className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-cyan/10 flex items-center justify-center text-cyan font-bold text-sm">{review.user[0]}</div>
                            <div><h4 className="font-bold text-white text-sm">{review.user}</h4><p className="text-slate-500 text-[10px]">{review.date}</p></div>
                          </div>
                          <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}`} />))}</div>
                        </div>
                        <p className="text-slate-300 text-sm italic leading-relaxed">"{review.comment}"</p>
                      </div>
                    )) || <div className="text-center py-10 opacity-30"><Users className="w-10 h-10 mx-auto mb-2" /><p className="text-sm">{t('product.noReviews')}</p></div>}
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
