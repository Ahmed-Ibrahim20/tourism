'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Compass, Plus, Edit, Trash2, Search, X, Loader2, Globe, Star, ToggleLeft, ToggleRight, MapPin, Layers } from 'lucide-react';
import Image from 'next/image';
import { apiService, Service, Destination, Category } from '@/services/api';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminServicesPage() {
  const { t, dir } = useI18n();
  const [services, setServices] = useState<Service[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name_ar: '',
    name_en: '',
    name_es: '',
    name_it: '',
    slug: '',
    short_desc_ar: '',
    short_desc_en: '',
    short_desc_es: '',
    short_desc_it: '',
    desc_ar: '',
    desc_en: '',
    desc_es: '',
    desc_it: '',
    star_rating: '5',
    address: '',
    destination_id: '',
    category_id: '',
    cover_image: '',
    cover_url: '',
    is_active: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [svcRes, destRes, catRes] = await Promise.all([
        apiService.admin.services.index({ search }),
        apiService.admin.destinations.index({ per_page: 100 }),
        apiService.admin.categories.index({ per_page: 100 }),
      ]);
      setServices(Array.isArray(svcRes?.data) ? svcRes.data : []);
      setDestinations(Array.isArray(destRes?.data) ? destRes.data : []);
      setCategories(Array.isArray(catRes?.data) ? catRes.data : []);
    } catch (err) {
      console.warn('Failed to fetch services data');
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenModal = (svc?: Service) => {
    if (svc) {
      setSelectedService(svc);
      setForm({
        name_ar: svc.name_translations?.ar || svc.name || '',
        name_en: svc.name_translations?.en || '',
        name_es: svc.name_translations?.es || '',
        name_it: svc.name_translations?.it || '',
        slug: svc.slug || '',
        short_desc_ar: svc.short_description_translations?.ar || svc.short_description || '',
        short_desc_en: svc.short_description_translations?.en || '',
        short_desc_es: svc.short_description_translations?.es || '',
        short_desc_it: svc.short_description_translations?.it || '',
        desc_ar: svc.description_translations?.ar || svc.description || '',
        desc_en: svc.description_translations?.en || '',
        desc_es: svc.description_translations?.es || '',
        desc_it: svc.description_translations?.it || '',
        star_rating: String(svc.star_rating || 5),
        address: svc.address || '',
        destination_id: String(svc.destination?.id || ''),
        category_id: String(svc.category?.id || ''),
        cover_image: '',
        cover_url: svc.cover_url || '',
        is_active: svc.is_active ?? true,
      });
    } else {
      setSelectedService(null);
      setForm({
        name_ar: '',
        name_en: '',
        name_es: '',
        name_it: '',
        slug: '',
        short_desc_ar: '',
        short_desc_en: '',
        short_desc_es: '',
        short_desc_it: '',
        desc_ar: '',
        desc_en: '',
        desc_es: '',
        desc_it: '',
        star_rating: '5',
        address: '',
        destination_id: String(destinations[0]?.id || ''),
        category_id: String(categories[0]?.id || ''),
        cover_image: '',
        cover_url: '',
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: number) => {
    try {
      const res = await apiService.admin.services.toggleActive(id);
      if (res.success) {
        toast.success('Service status updated!');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await apiService.admin.services.delete(id);
      if (res.success) {
        toast.success('Service deleted successfully');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: any = {
        destination_id: form.destination_id ? parseInt(form.destination_id) : undefined,
        category_id: form.category_id ? parseInt(form.category_id) : undefined,
        name: form.name_ar || form.name_en || 'Service',
        slug: form.slug || (form.name_en || form.name_ar).toLowerCase().trim().replace(/\s+/g, '-'),
        short_description: form.short_desc_ar || form.short_desc_en,
        description: form.desc_ar || form.desc_en,
        star_rating: parseFloat(form.star_rating),
        address: form.address,
        is_active: form.is_active,
        name_translations: {
          ar: form.name_ar,
          en: form.name_en,
          es: form.name_es,
          it: form.name_it,
        },
        short_description_translations: {
          ar: form.short_desc_ar,
          en: form.short_desc_en,
          es: form.short_desc_es,
          it: form.short_desc_it,
        },
        description_translations: {
          ar: form.desc_ar,
          en: form.desc_en,
          es: form.desc_es,
          it: form.desc_it,
        },
        ...(form.cover_image ? { cover_image: form.cover_image } : {}),
      };

      let res;
      if (selectedService) {
        res = await apiService.admin.services.update(selectedService.id, payload);
      } else {
        res = await apiService.admin.services.store(payload);
      }

      if (res.success) {
        toast.success(selectedService ? 'Service updated successfully!' : 'Service created successfully!');
        setIsModalOpen(false);
        setSearch(''); // Reset search so new/updated item is visible
        fetchData();
      }
    } catch (err) {
      // Handled by HTTP Client interceptor
    } finally {
      setSubmitting(false);
    }
  };

  const selectClass = 'w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none appearance-none cursor-pointer';
  const optionStyle = { backgroundColor: '#0f1a2e' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Compass className="size-8 text-cyan" />
            Services Management (4 Languages)
          </h1>
          <p className="text-slate-400 mt-1">Manage diving centers, cruise ships, and excursion providers across 4 languages.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className={`h-10 w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)] cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl border border-white/10 bg-navy/50 animate-pulse" />
          ))
        ) : services.length > 0 ? (
          services.map((svc, i) => {
            const hasAr = !!svc.name_translations?.ar;
            const hasEn = !!svc.name_translations?.en;
            const hasEs = !!svc.name_translations?.es;
            const hasIt = !!svc.name_translations?.it;

            return (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy/80 shadow-lg backdrop-blur-xl transition-all hover:border-cyan/30 flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden bg-navy-light shrink-0">
                  {!imgErrors[svc.id] && svc.cover_url ? (
                    <Image
                      src={svc.cover_url}
                      alt={svc.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => setImgErrors(prev => ({ ...prev, [svc.id]: true }))}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 via-navy to-blue-900/40 flex items-center justify-center">
                      <Compass className="size-12 text-cyan/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-90" />

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      onClick={() => handleToggleActive(svc.id)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:text-cyan cursor-pointer"
                      title="Toggle Active"
                    >
                      {svc.is_active ? <ToggleRight className="size-5 text-emerald-400" /> : <ToggleLeft className="size-5 text-rose-400" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(svc)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-cyan hover:text-navy cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-rose-500 hover:text-white cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Rating & Status */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-bold text-yellow-400 backdrop-blur-md">
                      <Star className="size-3 fill-yellow-400" />
                      {svc.star_rating || 5}
                    </div>
                    <div className={`rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-md ${svc.is_active ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                      {svc.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  {/* Info inside image overlay */}
                  <div className="absolute bottom-3 left-4 right-4 space-y-1">
                    <h3 className="text-base font-bold text-white group-hover:text-cyan transition-colors line-clamp-1">
                      {svc.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-300">
                      {svc.category && (
                        <span className="flex items-center gap-1">
                          <Layers className="size-3 text-cyan/60" />
                          {svc.category.name}
                        </span>
                      )}
                      {svc.destination && (
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3 text-cyan/60" />
                          {svc.destination.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer with Language Badges */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5" title="Available Translations">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasAr ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>AR</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>EN</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEs ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>ES</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasIt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>IT</span>
                  </div>
                  <span className="text-xs font-semibold text-cyan/80">
                    {svc.address || 'Address on booking'}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white/5 rounded-2xl border border-white/10">
            No services found
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-navy p-6 shadow-2xl no-scrollbar cursor-default"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="size-5 text-cyan" />
                  {selectedService ? 'Edit Service (4 Languages)' : 'Add New Service (4 Languages)'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Destination & Category Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Destination (الوجهة)</label>
                    <select
                      value={form.destination_id}
                      onChange={(e) => setForm({ ...form, destination_id: e.target.value })}
                      className={selectClass}
                    >
                      <option value="" style={optionStyle}>Select Destination (Optional)</option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id} style={optionStyle}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300">Category (التصنيف)</label>
                    <select
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      className={selectClass}
                    >
                      <option value="" style={optionStyle}>Select Category (Optional)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id} style={optionStyle}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Service Name (4 Languages) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> Service / Article Title (4 Languages)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Arabic (العربية) *</span>
                      <input type="text" required value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} placeholder="مغامرات الغوص وسحر الشعاب المرجانية" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">English *</span>
                      <input type="text" required value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} placeholder="Scuba Diving & Coral Reef Adventures" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                      <input type="text" value={form.name_es} onChange={(e) => setForm({ ...form, name_es: e.target.value })} placeholder="Aventuras de Buceo en el Mar Rojo" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                      <input type="text" value={form.name_it} onChange={(e) => setForm({ ...form, name_it: e.target.value })} placeholder="Avventure di Immersione nel Mar Rosso" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none" />
                    </div>
                  </div>
                </div>

                {/* 3. URL Slug */}
                <div>
                  <label className="text-xs font-bold text-slate-300">URL Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="scuba-diving-red-sea-adventures" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none" />
                </div>

                {/* 4. Short Summary (4 Languages) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> Short Summary (4 Languages)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Arabic (العربية)</span>
                      <textarea rows={2} value={form.short_desc_ar} onChange={(e) => setForm({ ...form, short_desc_ar: e.target.value })} placeholder="نبذة مختصرة تظهر في الكروت..." className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">English</span>
                      <textarea rows={2} value={form.short_desc_en} onChange={(e) => setForm({ ...form, short_desc_en: e.target.value })} placeholder="Brief summary for article cards..." className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                      <textarea rows={2} value={form.short_desc_es} onChange={(e) => setForm({ ...form, short_desc_es: e.target.value })} placeholder="Resumen para tarjetas..." className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                      <textarea rows={2} value={form.short_desc_it} onChange={(e) => setForm({ ...form, short_desc_it: e.target.value })} placeholder="Breve descrizione per schede..." className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none" />
                    </div>
                  </div>
                </div>

                {/* 5. Full Editorial Article Content (4 Languages) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> Full Editorial Content / Article Text (4 Languages)
                  </label>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 font-medium block mb-1">Arabic Article Content (المقال بالكامل - العربية)</span>
                      <textarea rows={4} value={form.desc_ar} onChange={(e) => setForm({ ...form, desc_ar: e.target.value })} placeholder="اكتب المقال المفصل باللغة العربية..." className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-y" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block mb-1">English Article Content (Full English Article Text)</span>
                      <textarea rows={4} value={form.desc_en} onChange={(e) => setForm({ ...form, desc_en: e.target.value })} placeholder="Write full long-form article text in English..." className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-y" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block mb-1">Spanish Article Content (Contenido del artículo en español)</span>
                      <textarea rows={3} value={form.desc_es} onChange={(e) => setForm({ ...form, desc_es: e.target.value })} placeholder="Escriba el artículo completo en español..." className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-y" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block mb-1">Italian Article Content (Testo completo articolo in italiano)</span>
                      <textarea rows={3} value={form.desc_it} onChange={(e) => setForm({ ...form, desc_it: e.target.value })} placeholder="Scrivi il testo completo dell'articolo in italiano..." className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-y" />
                    </div>
                  </div>
                </div>

                {/* 5. Star Rating & Address */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Star Rating</label>
                    <input type="number" step="0.1" min="1" max="5" value={form.star_rating} onChange={(e) => setForm({ ...form, star_rating: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300">Address / Location</label>
                    <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Ras Mohammed Reserve, Sharm El Sheikh" className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none" />
                  </div>
                </div>

                {/* 6. Cover Image Upload */}
                <ImageUploader
                  currentUrl={form.cover_url}
                  folder="services"
                  label="Service Cover Image"
                  onUpload={(path, url) => setForm({ ...form, cover_image: path, cover_url: url })}
                  onRemove={() => setForm({ ...form, cover_image: '', cover_url: '' })}
                />

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan text-navy font-bold text-sm hover:bg-cyan-light transition-all cursor-pointer">
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    {selectedService ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
