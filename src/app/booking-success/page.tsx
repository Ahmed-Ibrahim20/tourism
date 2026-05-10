'use client'

import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ChevronRight, Home, Map, Calendar, CreditCard, Clock, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'

function BookingSuccessContent() {
  const { t, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const searchParams = useSearchParams()
  
  const [bookingDetails, setBookingDetails] = useState({
    ref: '',
    price: '',
    title: ''
  })

  useEffect(() => {
    // We read from searchParams after hydration to avoid mismatch
    setBookingDetails({
      ref: searchParams.get('ref') || `BKG-${Math.floor(Math.random() * 1000000)}`,
      price: searchParams.get('price') || '0',
      title: searchParams.get('title') ? decodeURIComponent(searchParams.get('title') as string) : (isRTL ? 'باقة سياحية' : 'Tour Package')
    })
  }, [searchParams, isRTL])

  return (
    <div className="min-h-screen bg-navy selection:bg-cyan/30 flex flex-col" dir={dir}>
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-[120px] opacity-50" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl w-full bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan/20 blur-xl rounded-full animate-pulse" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
              >
                <CheckCircle2 className="w-24 h-24 text-cyan relative z-10" strokeWidth={1.5} />
              </motion.div>
            </div>
          </div>

          {/* Titles */}
          <div className="text-center space-y-4 mb-10">
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight"
            >
              {isRTL ? 'تم استلام طلبك بنجاح!' : 'Booking Request Received!'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed"
            >
              {isRTL 
                ? 'شكراً لاختيارك خدماتنا. لقد تلقينا طلب الحجز الخاص بك وسيقوم فريقنا بالتواصل معك قريباً لتأكيد التفاصيل.' 
                : 'Thank you for choosing us. We have received your booking request and our team will contact you shortly to confirm the details.'}
            </motion.p>
          </div>

          {/* Booking Summary Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0a1428] rounded-2xl border border-white/5 p-6 mb-10"
          >
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 text-center">
              {isRTL ? 'تفاصيل الطلب' : 'Request Summary'}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-slate-400 text-sm font-medium">{isRTL ? 'رقم المرجع' : 'Reference Number'}</span>
                <span className="text-white font-bold tracking-wider">{bookingDetails.ref}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-slate-400 text-sm font-medium">{isRTL ? 'الباقة المحددة' : 'Selected Package'}</span>
                <span className="text-white font-bold truncate max-w-[200px] md:max-w-xs">{bookingDetails.title}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-slate-400 text-sm font-medium">{isRTL ? 'المبلغ التقديري' : 'Estimated Amount'}</span>
                <span className="text-cyan font-black text-xl">${bookingDetails.price}</span>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
          >
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex gap-4">
              <div className="bg-blue-500/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">{isRTL ? 'مراجعة الطلب' : 'Request Review'}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{isRTL ? 'نحن نقوم بمراجعة توافر الأماكن في التواريخ المحددة.' : 'We are reviewing the availability for your selected dates.'}</p>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex gap-4">
              <div className="bg-green-500/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">{isRTL ? 'التواصل معك' : 'We Contact You'}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{isRTL ? 'سيتم التواصل معك عبر الواتساب لتأكيد الحجز والدفع.' : 'We will reach out via WhatsApp to confirm booking and payment.'}</p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full h-14 px-8 bg-cyan hover:bg-cyan-light text-navy font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(0,212,255,0.2)] hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]">
                <Home className="w-4 h-4 mr-2" /> {isRTL ? 'العودة للرئيسية' : 'Return to Home'}
              </Button>
            </Link>
            <Link href="/search" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full h-14 px-8 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all">
                <Map className="w-4 h-4 mr-2" /> {isRTL ? 'استكشاف المزيد' : 'Explore More'}
              </Button>
            </Link>
          </motion.div>

        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
          <p className="text-cyan text-xs font-bold uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}
