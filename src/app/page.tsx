import dynamic from 'next/dynamic'

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Destinations from '@/components/landing/Destinations'

// Dynamically import below-the-fold components to split the JS bundle
const InteractiveMap = dynamic(() => import('@/components/landing/InteractiveMap'))
const Experiences = dynamic(() => import('@/components/landing/Experiences'))
const Honeymoon = dynamic(() => import('@/components/landing/Honeymoon'))
const WhyUs = dynamic(() => import('@/components/landing/WhyUs'))
const Testimonials = dynamic(() => import('@/components/landing/Testimonials'))
const Contact = dynamic(() => import('@/components/landing/Contact'))
const Footer = dynamic(() => import('@/components/landing/Footer'))

// No SSR constraint
const WhatsAppButton = dynamic(() => import('@/components/landing/WhatsAppButton'))

import { Toaster } from '@/components/ui/sonner'

export default function Home() {
  return (
    <div className="min-h-screen bg-navy text-foreground noise-overlay relative">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Destinations Section - Core Feature */}
        <Destinations />

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Interactive Map */}
        <InteractiveMap />

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Experiences Section */}
        <Experiences />

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Honeymoon Section */}
        <Honeymoon />

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Why Us Section */}
        <WhyUs />

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Section Divider */}
        <div className="section-divider" />

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Button */}
      <WhatsAppButton />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  )
}
