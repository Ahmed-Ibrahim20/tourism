'use client'

import { use, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, MapPin, Clock, ArrowRight, Check, 
  Calendar, Users, ShieldCheck, Share2, Heart, 
  ChevronLeft, ChevronRight, Info
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { MOCK_PRODUCTS } from '@/lib/mockData'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { t, dir } = useI18n()
  const product = MOCK_PRODUCTS.find(p => p.id === id)

  const [activeImage, setActiveImage] = useState(0)

  if (!product) return (
    <div className="flex h-screen items-center justify-center bg-navy text-white">
      Product not found
    </div>
  )

  const productImages = product.images || [product.image]

  return (
    <div className="min-h-screen bg-navy selection:bg-cyan/30">
      <Navbar />

      <main className="mx-auto max-w-[1600px] px-6 py-12 md:px-12 lg:px-20">
        {/* Breadcrumbs */}
        <nav className="mb-10 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/search" className="hover:text-cyan transition-colors">Search</Link>
          <span>/</span>
          <span className="text-slate-300">{t(`category.${product.category}`)}</span>
          <span>/</span>
          <span className="text-cyan font-bold">{t(product.titleKey)}</span>
        </nav>

        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          {/* Left: Gallery & Content */}
          <div className="flex-1 space-y-12">
            {/* Cinematic Gallery */}
            <section className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl"
              >
                <Image
                  src={productImages[activeImage]}
                  alt={t(product.titleKey)}
                  fill
                  className="object-cover transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                
                {/* Image Navigation */}
                <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 justify-between">
                  <Button 
                    variant="ghost" size="icon" 
                    className="size-12 rounded-full bg-navy/40 backdrop-blur-md border border-white/10 text-white hover:bg-cyan hover:text-navy"
                    onClick={() => setActiveImage((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                  >
                    <ChevronLeft className="size-6" />
                  </Button>
                  <Button 
                    variant="ghost" size="icon" 
                    className="size-12 rounded-full bg-navy/40 backdrop-blur-md border border-white/10 text-white hover:bg-cyan hover:text-navy"
                    onClick={() => setActiveImage((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                  >
                    <ChevronRight className="size-6" />
                  </Button>
                </div>
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === idx ? 'border-cyan scale-105 shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </section>

            {/* Content Tabs */}
            <section className="glass-strong rounded-[2.5rem] p-8 md:p-12 border border-white/10">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-10 h-auto bg-transparent p-0 gap-8">
                  {['overview', 'itinerary', 'includes', 'reviews'].map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab}
                      className="data-[state=active]:bg-transparent data-[state=active]:text-cyan data-[state=active]:border-cyan border-b-2 border-transparent rounded-none px-0 py-4 text-lg font-black uppercase tracking-widest text-slate-500 transition-all hover:text-white"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Experience Details</h2>
                    <p className="text-xl leading-relaxed text-slate-400 font-medium">
                      {product.description || "No description available for this package."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 md:grid-cols-4 pt-8 border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-600">Duration</p>
                      <p className="text-lg font-bold text-white">{product.duration || 'Flexible'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-600">Location</p>
                      <p className="text-lg font-bold text-white">{product.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-600">Guests</p>
                      <p className="text-lg font-bold text-white">Up to 4 Persons</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-600">Language</p>
                      <p className="text-lg font-bold text-white">English, Arabic</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-6">
                  {product.itinerary ? (
                    product.itinerary.map((item, idx) => (
                      <div key={idx} className="relative pl-12 pb-10 last:pb-0 border-l border-cyan/20">
                        <div className="absolute left-[-13px] top-0 flex size-6 items-center justify-center rounded-full bg-cyan text-navy font-black text-xs">
                          {item.day}
                        </div>
                        <h4 className="text-xl font-black text-white mb-2">{item.title}</h4>
                        <p className="text-slate-400 font-medium leading-relaxed">{item.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">Itinerary details will be provided upon booking.</p>
                  )}
                </TabsContent>

                <TabsContent value="includes" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.includes?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 border border-white/5">
                      <div className="flex size-6 items-center justify-center rounded-full bg-cyan/20 text-cyan">
                        <Check className="size-4" />
                      </div>
                      <span className="font-bold text-white">{item}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </section>
          </div>

          {/* Right: Sticky Booking Sidebar */}
          <aside className="w-full lg:max-w-[400px]">
            <div className="sticky top-32 space-y-6">
              <div className="glass-strong relative overflow-hidden rounded-[2.5rem] p-10 border border-white/10 shadow-2xl">
                {/* Floating Glow */}
                <div className="absolute -right-20 -top-20 size-40 bg-cyan/20 blur-[80px]" />
                
                <div className="mb-8">
                  <p className="text-sm font-black uppercase tracking-widest text-cyan/70 mb-1">Starting from</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">${product.price}</span>
                    <span className="text-slate-500 font-bold">/ Person</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Travel Dates</label>
                    <Button variant="outline" className="w-full h-14 justify-start gap-4 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Calendar className="size-5 text-cyan" />
                      <span className="font-bold">Select Dates</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Travelers</label>
                    <Button variant="outline" className="w-full h-14 justify-start gap-4 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Users className="size-5 text-cyan" />
                      <span className="font-bold">2 Adults, 0 Children</span>
                    </Button>
                  </div>

                  <Button className="cta-glow w-full h-16 rounded-2xl bg-cyan text-navy text-xl font-black tracking-tighter hover:bg-cyan-light transition-all">
                    Request Booking
                  </Button>

                  <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                      <ShieldCheck className="size-5 text-cyan" />
                      Secure Luxury Transaction
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-400">
                      <Info className="size-5 text-cyan" />
                      Free cancellation up to 48h
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2">
                  <Heart className="size-5 text-pink-500" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2">
                  <Share2 className="size-5 text-cyan" />
                  Share
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
