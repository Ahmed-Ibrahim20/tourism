'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Package, Search, Filter, Plus, Edit, Trash2, Star } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/mockData';
import Image from 'next/image';

export default function PackagesPage() {
  const { t, dir } = useI18n();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Package className="size-8 text-cyan" />
            {t('admin.packages')}
          </h1>
          <p className="text-slate-400 mt-1">Manage tours, hotels, and honeymoon packages.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              placeholder="Search packages..."
              className={`h-10 w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Plus className="size-4" />
            <span>Add Package</span>
          </button>
        </div>
      </div>

      {/* Grid of Packages */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_PRODUCTS.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-navy/80 shadow-lg backdrop-blur-xl transition-all hover:border-cyan/30"
          >
            {/* Image */}
            <div className="relative h-40 w-full overflow-hidden bg-navy-light">
              <Image 
                src={pkg.image} 
                alt={t(pkg.titleKey)} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-md">
                <Star className="size-3 fill-yellow-400" />
                {pkg.rating}
              </div>
              <div className="absolute top-2 left-2 rounded-full bg-cyan/90 px-2 py-1 text-xs font-bold text-navy backdrop-blur-md capitalize">
                {pkg.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-white line-clamp-1" title={t(pkg.titleKey)}>
                {t(pkg.titleKey)}
              </h3>
              <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                {t(pkg.locationKey)}
              </p>
              
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Price</span>
                  <span className="text-sm font-black text-cyan">${pkg.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20" title="Edit">
                    <Edit className="size-4" />
                  </button>
                  <button className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20" title="Delete">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
