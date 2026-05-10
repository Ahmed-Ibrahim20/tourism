'use client';

import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Map, Plus, Edit, Trash2, Search } from 'lucide-react';
import Image from 'next/image';

const destinations = [
  { id: "aswan", name: "aswan.name", image: "/images/hero/01-giza.jpg", packages: 12, status: 'Active' },
  { id: "dahab", name: "dahab.name", image: "/images/hero/02-dahab.jpg", packages: 8, status: 'Active' },
  { id: "hurghada", name: "hurghada.name", image: "/images/hero/03-hurghada.jpg", packages: 15, status: 'Active' },
  { id: "sharm", name: "sharm.name", image: "/images/hero/04-sharm.jpg", packages: 18, status: 'Active' },
  { id: "luxor", name: "luxor.name", image: "/images/hero/05-luxor.jpg", packages: 10, status: 'Inactive' },
  { id: "alexandria", name: "alexandria.name", image: "/images/hero/06-alexandria.jpg", packages: 5, status: 'Active' },
];

export default function DestinationsPage() {
  const { t, dir } = useI18n();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Map className="size-8 text-cyan" />
            {t('admin.destinations')}
          </h1>
          <p className="text-slate-400 mt-1">Manage the available destinations and regions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              placeholder="Search destinations..."
              className={`h-10 w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Plus className="size-4" />
            <span>Add Destination</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy/80 shadow-lg backdrop-blur-xl transition-all hover:border-cyan/30"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image 
                src={dest.image} 
                alt={t(dest.name)} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-80" />
              
              {/* Actions */}
              <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex size-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-cyan hover:text-navy">
                  <Edit className="size-4" />
                </button>
                <button className="flex size-8 items-center justify-center rounded-lg bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-rose-500 hover:text-white">
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* Status */}
              <div className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-md ${dest.status === 'Active' ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                {dest.status}
              </div>

              {/* Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan transition-colors">
                  {t(dest.name)}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-300">
                  {dest.packages} Active Packages
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
