'use client'

import { useEffect, useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Calendar, MapPin, Heart, Clock, Settings, LogOut, Camera, Shield, CheckCircle2, ChevronRight, Ticket, Compass } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// Mock User Bookings
const MOCK_BOOKINGS = [
  {
    id: 'BKG-782910',
    titleEn: 'Luxury Hotel in Alexandria',
    titleAr: 'فندق فاخر في الإسكندرية',
    date: '2026-06-15',
    price: 900,
    status: 'confirmed',
    image: '/images/hero/06-alexandria.jpg',
    guests: 2
  },
  {
    id: 'BKG-339102',
    titleEn: 'Dahab Diving Experience',
    titleAr: 'تجربة غوص في دهب',
    date: '2026-07-22',
    price: 350,
    status: 'pending',
    image: '/images/hero/02-dahab.jpg',
    guests: 1
  },
  {
    id: 'BKG-110293',
    titleEn: 'Nile Cruise Honeymoon',
    titleAr: 'شهر عسل في رحلة نيلية',
    date: '2025-10-05',
    price: 2400,
    status: 'completed',
    image: '/images/hero/07-nile.jpg',
    guests: 2
  }
]

function ProfileContent() {
  const { user, isAuthenticated, logout } = useAuth()
  const { t, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const router = useRouter()

  const [isMounted, setIsMounted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
      </div>
    )
  }

  // Fallback user if not logged in, just to allow viewing the design without annoying redirects
  const displayUser = user || {
    name: isRTL ? 'ضيف مميز' : 'Guest User',
    email: 'guest@dahab-dream.com'
  };

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success(isRTL ? 'تم حفظ التغييرات بنجاح!' : 'Settings saved successfully!')
    }, 1500)
  }

  const handleCameraClick = () => {
    toast.success(isRTL ? 'ميزة تغيير الصورة ستتوفر قريباً!' : 'Profile picture update coming soon!')
  }

  return (
    <div className="min-h-screen bg-navy selection:bg-cyan/30 flex flex-col" dir={dir}>
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto w-full relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mt-8">
          
          {/* Sidebar / User Info */}
          <aside className="w-full lg:w-[340px] shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-3xl sticky top-32"
            >
              <div className="flex flex-col items-center text-center pb-8 border-b border-white/5">
                <div className="relative mb-6 group cursor-pointer" onClick={handleCameraClick}>
                  <div className="w-32 h-32 rounded-full bg-cyan/10 border-4 border-white/5 flex items-center justify-center overflow-hidden transition-all group-hover:border-cyan/30">
                    <User className="w-16 h-16 text-cyan/70" />
                  </div>
                  <div className="absolute inset-0 bg-navy/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-[#030712]" />
                </div>
                
                <h2 className="text-2xl font-black text-white capitalize mb-1">{displayUser.name}</h2>
                <p className="text-sm font-medium text-slate-400 flex items-center justify-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  {displayUser.email}
                </p>
                
                <div className="mt-6 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Shield className="w-4 h-4 text-cyan" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">{isRTL ? 'عضو موثق' : 'Verified Member'}</span>
                </div>
              </div>

              <div className="py-8 space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{isRTL ? 'تاريخ الانضمام' : 'Joined'}</span>
                  <span className="text-white font-bold">{isRTL ? 'مايو 2026' : 'May 2026'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{isRTL ? 'الرحلات المحجوزة' : 'Total Bookings'}</span>
                  <span className="text-white font-bold">{MOCK_BOOKINGS.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{isRTL ? 'التقييمات' : 'Reviews'}</span>
                  <span className="text-white font-bold">0</span>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-500/30 font-bold rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isRTL ? 'تسجيل خروج' : 'Logout'}
                </Button>
              </div>
            </motion.div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-8">
                {isRTL ? 'مرحباً،' : 'Welcome,'} <span className="text-cyan">{displayUser.name}</span>
              </h1>

              <Tabs defaultValue="bookings" className="w-full" dir={dir}>
                <TabsList className="bg-white/5 p-1.5 rounded-2xl mb-8 flex flex-wrap h-auto gap-2 border border-white/10 w-fit">
                  <TabsTrigger value="bookings" className="py-3 px-6 rounded-xl data-[state=active]:bg-cyan data-[state=active]:text-navy transition-all uppercase font-bold text-xs tracking-wider flex items-center gap-2">
                    <Ticket className="w-4 h-4" /> {isRTL ? 'حجوزاتي' : 'My Bookings'}
                  </TabsTrigger>
                  <TabsTrigger value="favorites" className="py-3 px-6 rounded-xl data-[state=active]:bg-cyan data-[state=active]:text-navy transition-all uppercase font-bold text-xs tracking-wider flex items-center gap-2">
                    <Heart className="w-4 h-4" /> {isRTL ? 'المفضلة' : 'Favorites'}
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="py-3 px-6 rounded-xl data-[state=active]:bg-cyan data-[state=active]:text-navy transition-all uppercase font-bold text-xs tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4" /> {isRTL ? 'الإعدادات' : 'Settings'}
                  </TabsTrigger>
                </TabsList>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="mt-0 focus-visible:outline-none space-y-6">
                  {MOCK_BOOKINGS.map((booking, idx) => (
                    <motion.div 
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/[0.02] border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col md:flex-row gap-6 hover:border-cyan/30 hover:bg-white/[0.04] transition-all group"
                    >
                      {/* Image */}
                      <div className="relative w-full md:w-48 h-48 md:h-full rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:border-cyan/30 transition-colors">
                        <Image src={booking.image} alt={booking.titleEn} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent md:hidden" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                            {isRTL ? booking.titleAr : booking.titleEn}
                          </h3>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1.5 ${
                            booking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          }`}>
                            {booking.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                            {booking.status === 'pending' && <Clock className="w-3 h-3" />}
                            {isRTL ? (
                              booking.status === 'confirmed' ? 'مؤكد' :
                              booking.status === 'pending' ? 'قيد المراجعة' : 'مكتمل'
                            ) : booking.status}
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
                          <Ticket className="w-3.5 h-3.5 text-cyan" /> {booking.id}
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{isRTL ? 'التاريخ' : 'Date'}</p>
                            <p className="text-sm text-white font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan" /> {booking.date}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{isRTL ? 'الضيوف' : 'Guests'}</p>
                            <p className="text-sm text-white font-medium flex items-center gap-2"><User className="w-4 h-4 text-cyan" /> {booking.guests} {isRTL ? 'أشخاص' : 'Persons'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{isRTL ? 'التكلفة' : 'Total'}</p>
                            <p className="text-lg text-cyan font-black">${booking.price}</p>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                          <Link href={`/booking-details/${booking.id}?title=${encodeURIComponent(isRTL ? booking.titleAr : booking.titleEn)}&date=${booking.date}&price=${booking.price}&guests=${booking.guests}&status=${booking.status}&image=${encodeURIComponent(booking.image)}`}>
                            <Button className="h-10 px-6 bg-white hover:bg-cyan text-navy font-bold text-xs uppercase tracking-wider rounded-xl transition-all">
                              {isRTL ? 'عرض التفاصيل' : 'View Details'}
                            </Button>
                          </Link>
                          {booking.status === 'completed' && (
                            <Button 
                              variant="outline" 
                              onClick={() => toast.success(isRTL ? 'شكراً لتقييمك!' : 'Thanks for your review!')}
                              className="h-10 px-6 border-white/10 hover:border-cyan/50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                            >
                              {isRTL ? 'إضافة تقييم' : 'Add Review'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                {/* Favorites Tab */}
                <TabsContent value="favorites" className="mt-0 focus-visible:outline-none">
                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-20 h-20 rounded-full bg-cyan/10 flex items-center justify-center mb-6">
                      <Heart className="w-10 h-10 text-cyan" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">{isRTL ? 'لا توجد مفضلات بعد' : 'No Favorites Yet'}</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
                      {isRTL ? 'اكتشف رحلاتنا ووجهاتنا السياحية وأضف ما يعجبك إلى قائمة مفضلاتك للرجوع إليها لاحقاً.' : 'Explore our tours and destinations, and add your favorite ones here to easily find them later.'}
                    </p>
                    <Link href="/search">
                      <Button className="h-12 px-8 bg-cyan hover:bg-cyan-light text-navy font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                        <Compass className="w-4 h-4 mr-2" />
                        {isRTL ? 'استكشف الوجهات' : 'Explore Destinations'}
                      </Button>
                    </Link>
                  </div>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
                  <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-10 max-w-3xl">
                    <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest border-b border-white/5 pb-4">
                      {isRTL ? 'المعلومات الشخصية' : 'Personal Information'}
                    </h3>
                    
                    <form className="space-y-6" onSubmit={handleSaveSettings}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? 'الاسم' : 'Name'}</label>
                          <input 
                            type="text" 
                            defaultValue={displayUser.name}
                            className="w-full h-12 bg-navy border border-white/10 rounded-xl px-4 text-white focus:border-cyan focus:ring-1 focus:ring-cyan/30 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? 'البريد الإلكتروني' : 'Email'}</label>
                          <input 
                            type="email" 
                            defaultValue={displayUser.email}
                            disabled
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-slate-400 cursor-not-allowed outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? 'رقم الهاتف' : 'Phone Number'}</label>
                          <input 
                            type="tel" 
                            placeholder="+20 100 000 0000"
                            className="w-full h-12 bg-navy border border-white/10 rounded-xl px-4 text-white focus:border-cyan focus:ring-1 focus:ring-cyan/30 outline-none transition-all"
                            dir="ltr"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isRTL ? 'دولة الإقامة' : 'Country'}</label>
                          <input 
                            type="text" 
                            placeholder={isRTL ? 'مصر' : 'Egypt'}
                            className="w-full h-12 bg-navy border border-white/10 rounded-xl px-4 text-white focus:border-cyan focus:ring-1 focus:ring-cyan/30 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <Button type="submit" disabled={isSaving} className="h-12 px-8 bg-cyan hover:bg-cyan-light text-navy font-bold text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-70">
                          {isSaving ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
                              {isRTL ? 'جاري الحفظ...' : 'Saving...'}
                            </span>
                          ) : (
                            isRTL ? 'حفظ التغييرات' : 'Save Changes'
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>

              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  )
}
