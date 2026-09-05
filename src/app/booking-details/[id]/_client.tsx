'use client'

import { use, useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Ticket, MapPin, Calendar, Users, Clock, CreditCard, Download, Printer, ChevronRight, CheckCircle2, User, Phone, Map, Plane } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Button } from '@/components/ui/button'

function BookingDetailsContent({ id }: { id: string }) {
  const { t, dir } = useI18n()
  const isRTL = dir === 'rtl'
  const searchParams = useSearchParams()
  
  const title = searchParams.get('title') || (isRTL ? 'تفاصيل الرحلة المحجوزة' : 'Booked Trip Details')
  const date = searchParams.get('date') || '2026-06-15'
  const price = searchParams.get('price') || '900'
  const guests = searchParams.get('guests') || '2'
  const status = searchParams.get('status') || 'confirmed'
  const image = searchParams.get('image') || '/images/hero/06-alexandria.jpg'

  return (
    <div className="min-h-screen bg-navy selection:bg-cyan/30 flex flex-col" dir={dir}>
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[100px] opacity-50" />
        </div>

        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <Link href="/profile" className="inline-flex items-center text-cyan hover:text-cyan-light font-bold text-sm mb-4 transition-colors">
                {isRTL ? <ChevronRight className="w-4 h-4 ml-1 rotate-180" /> : <ChevronRight className="w-4 h-4 mr-1 rotate-180" />}
                {isRTL ? 'العودة للبروفايل' : 'Back to Profile'}
              </Link>
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                {isRTL ? 'تذكرة الحجز' : 'Booking Ticket'}
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border flex items-center gap-2 ${
                  status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {status === 'confirmed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                  {isRTL ? (
                    status === 'confirmed' ? 'مؤكد' :
                    status === 'pending' ? 'قيد المراجعة' : 'مكتمل'
                  ) : status}
                </span>
              </h1>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="h-10 border-white/10 hover:bg-white/5 text-white font-bold rounded-xl transition-all">
                <Printer className="w-4 h-4 mr-2" /> {isRTL ? 'طباعة' : 'Print'}
              </Button>
              <Button className="h-10 bg-cyan hover:bg-cyan-light text-navy font-bold rounded-xl transition-all">
                <Download className="w-4 h-4 mr-2" /> {isRTL ? 'تحميل PDF' : 'Download PDF'}
              </Button>
            </div>
          </div>

          {/* Ticket Design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_50px_rgba(0,0,0,0.3)]"
          >
            {/* Cutout circles for ticket effect */}
            <div className="hidden md:block absolute -top-4 left-[280px] w-8 h-8 bg-navy rounded-full border-b border-white/10" />
            <div className="hidden md:block absolute -bottom-4 left-[280px] w-8 h-8 bg-navy rounded-full border-t border-white/10" />
            <div className="md:hidden absolute top-[280px] -left-4 w-8 h-8 bg-navy rounded-full border-r border-white/10" />
            <div className="md:hidden absolute top-[280px] -right-4 w-8 h-8 bg-navy rounded-full border-l border-white/10" />

            {/* Left side (Image & Code) */}
            <div className="w-full md:w-[296px] bg-navy/40 border-b md:border-b-0 md:border-r border-white/10 border-dashed p-8 flex flex-col items-center justify-between relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/5 mb-6 shadow-xl">
                <img src={image} alt="Destination" className="w-full h-full object-cover" />
              </div>
              <div className="text-center w-full">
                <p className="text-xs text-slate-400 font-bold tracking-[0.2em] uppercase mb-2">{isRTL ? 'رقم الحجز' : 'Booking Ref'}</p>
                <p className="text-2xl font-black text-cyan tracking-wider">{id}</p>
              </div>
              
              {/* Mock Barcode */}
              <div className="w-full h-16 mt-8 flex flex-col items-center opacity-70">
                <div className="w-full h-12 bg-[repeating-linear-gradient(90deg,white,white_2px,transparent_2px,transparent_4px,white_4px,white_5px,transparent_5px,transparent_8px)] rounded-sm" />
                <p className="text-[10px] text-white/50 tracking-[0.5em] mt-2 font-mono">{id.replace('-', '')}9938</p>
              </div>
            </div>

            {/* Right side (Details) */}
            <div className="flex-1 p-8 md:p-12">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">{title}</h2>
                  <p className="text-slate-400 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-cyan" /> 
                    {isRTL ? 'رحلة سياحية معتمدة' : 'Verified Tour Package'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-cyan/10 flex items-center justify-center shrink-0 border border-cyan/20">
                  <Plane className="w-6 h-6 text-cyan" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">{isRTL ? 'التاريخ' : 'Date'}</p>
                  <p className="text-white font-bold text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan" /> {date}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">{isRTL ? 'المدة' : 'Duration'}</p>
                  <p className="text-white font-bold text-sm flex items-center gap-2"><Clock className="w-4 h-4 text-cyan" /> {isRTL ? 'محددة بالباقة' : 'As per package'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">{isRTL ? 'الضيوف' : 'Guests'}</p>
                  <p className="text-white font-bold text-sm flex items-center gap-2"><Users className="w-4 h-4 text-cyan" /> {guests} {isRTL ? 'أشخاص' : 'Persons'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1.5">{isRTL ? 'التكلفة الإجمالية' : 'Total Price'}</p>
                  <p className="text-cyan font-black text-xl">${price}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-3">
                  {isRTL ? 'معلومات المسافر الأساسي' : 'Primary Traveler Info'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{isRTL ? 'الاسم' : 'Name'}</p>
                      <p className="text-sm text-white font-bold">{isRTL ? 'ضيف مميز' : 'Guest User'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                      <Phone className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{isRTL ? 'التواصل' : 'Contact'}</p>
                      <p className="text-sm text-white font-bold">+20 100 000 0000</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

          {/* Help Section */}
          <div className="mt-8 flex justify-center">
            <p className="text-sm text-slate-400 flex items-center gap-2">
              {isRTL ? 'هل تواجه مشكلة؟' : 'Need help with your booking?'} 
              <Link href="/#contact" className="text-cyan hover:underline font-bold">
                {isRTL ? 'تواصل مع الدعم' : 'Contact Support'}
              </Link>
            </p>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function BookingDetailsClient({ id }: { id: string }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-cyan/30 border-t-cyan animate-spin" />
      </div>
    }>
      <BookingDetailsContent id={id} />
    </Suspense>
  )
}
