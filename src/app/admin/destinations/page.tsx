'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { Map, Plus, Edit, Trash2, Search, X, Loader2, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import Image from 'next/image';
import { apiService, Destination } from '@/services/api';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';

export default function DestinationsPage() {
  const { t, dir } = useI18n();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [submitting, setSubmitting] = useState(false);



  // Form State with Full 4-Language Support (ar, en, es, it)
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
    latitude: '',
    longitude: '',
    cover_image: '',
    cover_url: '',
    is_active: true,
  });

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.destinations.index({ search });
      // Always update – even if the array is empty
      setDestinations(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.warn('Failed to fetch destinations');
      // Do NOT clear destinations on error – keep existing data visible
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchDestinations();
  }, [search]);

  const handleOpenModal = (dest?: Destination) => {
    if (dest) {
      setSelectedDestination(dest);
      setForm({
        name_ar: dest.name_translations?.ar || dest.name || '',
        name_en: dest.name_translations?.en || '',
        name_es: dest.name_translations?.es || '',
        name_it: dest.name_translations?.it || '',
        slug: dest.slug || '',
        short_desc_ar: dest.short_description_translations?.ar || dest.short_description || '',
        short_desc_en: dest.short_description_translations?.en || '',
        short_desc_es: dest.short_description_translations?.es || '',
        short_desc_it: dest.short_description_translations?.it || '',
        desc_ar: dest.description_translations?.ar || dest.description || '',
        desc_en: dest.description_translations?.en || '',
        desc_es: dest.description_translations?.es || '',
        desc_it: dest.description_translations?.it || '',
        latitude: dest.latitude ? String(dest.latitude) : '',
        longitude: dest.longitude ? String(dest.longitude) : '',
        cover_image: '',
        cover_url: dest.cover_url || '',
        is_active: dest.is_active ?? true,
      });
    } else {
      setSelectedDestination(null);
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
        latitude: '',
        longitude: '',
        cover_image: '',
        cover_url: '',
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: number) => {
    try {
      const res = await apiService.admin.destinations.toggleActive(id);
      if (res.success) {
        toast.success(res.message || 'Status updated successfully');
        fetchDestinations();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;
    try {
      const res = await apiService.admin.destinations.delete(id);
      if (res.success) {
        toast.success('Destination deleted successfully');
        fetchDestinations();
      }
    } catch (err) {
      toast.error('Failed to delete destination');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload: any = {
        name: form.name_ar || form.name_en || 'Destination',
        slug: form.slug || (form.name_en || form.name_ar).toLowerCase().trim().replace(/\s+/g, '-'),
        short_description: form.short_desc_ar || form.short_desc_en,
        description: form.desc_ar || form.desc_en,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
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
      if (selectedDestination) {
        res = await apiService.admin.destinations.update(selectedDestination.id, payload);
      } else {
        res = await apiService.admin.destinations.store(payload);
      }

      if (res.success) {
        toast.success(selectedDestination ? 'Destination updated successfully!' : 'Destination created successfully!');
        setIsModalOpen(false);
        setSearch(''); // Reset search so the new/updated item is visible
        fetchDestinations();
      }
    } catch (err: any) {
      // Handled by HTTP Client interceptor
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Map className="size-8 text-cyan" />
            {t('admin.destinations')}
          </h1>
          <p className="text-slate-400 mt-1">Manage 4-lingual travel destinations (Arabic, English, Spanish, Italian).</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations..."
              className={`h-10 w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)] cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Add Destination</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl border border-white/10 bg-navy/50 animate-pulse" />
          ))
        ) : destinations.length > 0 ? (
          destinations.map((dest, i) => {
            const hasAr = !!dest.name_translations?.ar;
            const hasEn = !!dest.name_translations?.en;
            const hasEs = !!dest.name_translations?.es;
            const hasIt = !!dest.name_translations?.it;

            return (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy/80 shadow-lg backdrop-blur-xl transition-all hover:border-cyan/30 flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-navy-light shrink-0">
                  {!imgErrors[dest.id] && dest.cover_url ? (
                    <Image
                      src={dest.cover_url}
                      alt={dest.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => setImgErrors(prev => ({ ...prev, [dest.id]: true }))}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 via-navy to-blue-900/40 flex items-center justify-center">
                      <Map className="size-12 text-cyan/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-90" />

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      onClick={() => handleToggleActive(dest.id)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:text-cyan cursor-pointer"
                      title="Toggle Active"
                    >
                      {dest.is_active ? <ToggleRight className="size-5 text-emerald-400" /> : <ToggleLeft className="size-5 text-rose-400" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(dest)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-cyan hover:text-navy cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-rose-500 hover:text-white cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-bold backdrop-blur-md ${dest.is_active ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'}`}>
                    {dest.is_active ? 'Active' : 'Inactive'}
                  </div>

                  {/* Title & Info inside Image Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan transition-colors">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {dest.short_description || 'No description provided'}
                    </p>
                  </div>
                </div>

                {/* Footer with Language Badges & Stats */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5" title="Available Translations">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasAr ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>AR</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>EN</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEs ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>ES</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasIt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>IT</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan/80">
                    <span>{dest.services_count || 0} Services</span>
                    <span>•</span>
                    <span>{dest.packages_count || 0} Packages</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white/5 rounded-2xl border border-white/10">
            No destinations found
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
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
                  <Map className="size-5 text-cyan" />
                  {selectedDestination ? 'Edit Destination (4 Languages)' : 'Add New Destination (4 Languages)'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Multi-language Name Inputs (4 Languages) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> Destination Name (4 Languages)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Arabic (العربية) *</span>
                      <input
                        type="text"
                        required
                        value={form.name_ar}
                        onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                        placeholder="شرم الشيخ"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">English *</span>
                      <input
                        type="text"
                        required
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        placeholder="Sharm El-Sheikh"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                      <input
                        type="text"
                        value={form.name_es}
                        onChange={(e) => setForm({ ...form, name_es: e.target.value })}
                        placeholder="Sharm El-Sheij"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                      <input
                        type="text"
                        value={form.name_it}
                        onChange={(e) => setForm({ ...form, name_it: e.target.value })}
                        placeholder="Sharm el-Sheikh"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. URL Slug */}
                <div>
                  <label className="text-xs font-bold text-slate-300">URL Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="sharm-el-sheikh"
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                  />
                </div>

                {/* 3. Short Descriptions (4 Languages) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> Short Description (4 Languages)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Arabic (العربية)</span>
                      <textarea
                        rows={2}
                        value={form.short_desc_ar}
                        onChange={(e) => setForm({ ...form, short_desc_ar: e.target.value })}
                        placeholder="مدينة السحر والجمال والشعاب المرجانية"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">English</span>
                      <textarea
                        rows={2}
                        value={form.short_desc_en}
                        onChange={(e) => setForm({ ...form, short_desc_en: e.target.value })}
                        placeholder="City of magic, beauty and coral reefs"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                      <textarea
                        rows={2}
                        value={form.short_desc_es}
                        onChange={(e) => setForm({ ...form, short_desc_es: e.target.value })}
                        placeholder="Ciudad de magia, belleza y arrecifes de coral"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                      <textarea
                        rows={2}
                        value={form.short_desc_it}
                        onChange={(e) => setForm({ ...form, short_desc_it: e.target.value })}
                        placeholder="Città di magia, bellezza e barriere coralline"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Full Descriptions (4 Languages) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> Detailed Description (4 Languages)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Arabic (العربية)</span>
                      <textarea
                        rows={3}
                        value={form.desc_ar}
                        onChange={(e) => setForm({ ...form, desc_ar: e.target.value })}
                        placeholder="وصف تفصيلي للوجهة والمعالم السياحية..."
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">English</span>
                      <textarea
                        rows={3}
                        value={form.desc_en}
                        onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
                        placeholder="Detailed description of attractions and features..."
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                      <textarea
                        rows={3}
                        value={form.desc_es}
                        onChange={(e) => setForm({ ...form, desc_es: e.target.value })}
                        placeholder="Descripción detallada de atracciones..."
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                      <textarea
                        rows={3}
                        value={form.desc_it}
                        onChange={(e) => setForm({ ...form, desc_it: e.target.value })}
                        placeholder="Descrizione dettagliata delle attrazioni..."
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Geo Location */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300">Latitude</label>
                    <input
                      type="text"
                      value={form.latitude}
                      onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                      placeholder="27.9158"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300">Longitude</label>
                    <input
                      type="text"
                      value={form.longitude}
                      onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                      placeholder="34.3299"
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                    />
                  </div>
                </div>



                {/* 7. Cover Image Upload */}
                <ImageUploader
                  currentUrl={form.cover_url}
                  folder="destinations"
                  label="Cover Image"
                  onUpload={(path, url) => setForm({ ...form, cover_image: path, cover_url: url })}
                  onRemove={() => setForm({ ...form, cover_image: '', cover_url: '' })}
                />

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan text-navy font-bold text-sm hover:bg-cyan-light transition-all cursor-pointer"
                  >
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    {selectedDestination ? 'Save Changes' : 'Create Destination'}
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
