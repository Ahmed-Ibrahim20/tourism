'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { 
  Layers, Plus, Edit, Trash2, Search, X, Loader2, 
  Globe, ToggleLeft, ToggleRight, ArrowUpDown, Tag, Image as ImageIcon, Upload,
  Heart, Building2, Compass, Map, Plane, Star, Sun, Sparkles, Anchor, Car, Landmark, Eye
} from 'lucide-react';
import { apiService, Category } from '@/services/api';
import { toast } from 'sonner';
import Image from 'next/image';

/* ── Available Icon Options for Category Selection ────────────────────────── */

const ICON_OPTIONS = [
  { id: 'Heart', nameAr: 'شهر العسل (قلب)', nameEn: 'Honeymoon (Heart)', icon: Heart },
  { id: 'Building2', nameAr: 'فنادق ومنتجعات (مبنى)', nameEn: 'Hotels (Building)', icon: Building2 },
  { id: 'Compass', nameAr: 'تجارب وغوص (بوصلة)', nameEn: 'Experiences (Compass)', icon: Compass },
  { id: 'Map', nameAr: 'رحلات وجولات (خريطة)', nameEn: 'Trips (Map)', icon: Map },
  { id: 'Plane', nameAr: 'طيران وتنقلات (طائرة)', nameEn: 'Flights (Plane)', icon: Plane },
  { id: 'Star', nameAr: 'باقات مميزة (نجمة)', nameEn: 'Featured (Star)', icon: Star },
  { id: 'Palmtree', nameAr: 'شواطئ واستجمام (نخلة)', nameEn: 'Beach (Palmtree)', icon: Sun },
  { id: 'Sparkles', nameAr: 'عروض حصرية (بريق)', nameEn: 'Exclusive (Sparkles)', icon: Sparkles },
  { id: 'Anchor', nameAr: 'رحلات بحرية ويخوت (مخطاف)', nameEn: 'Cruises (Anchor)', icon: Anchor },
  { id: 'Car', nameAr: 'سفاري وصحراء (سيارة)', nameEn: 'Safari (Car)', icon: Car },
  { id: 'Landmark', nameAr: 'سياحة ثقافية (معلم)', nameEn: 'Cultural (Landmark)', icon: Landmark },
  { id: 'Sun', nameAr: 'استرخاء وسبا (شمس)', nameEn: 'Wellness (Sun)', icon: Sun },
];

export default function CategoriesPage() {
  const { t, dir } = useI18n();
  const isRTL = dir === 'rtl';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State with Cover Image & Icon Selection
  const [form, setForm] = useState({
    name_ar: '',
    name_en: '',
    name_es: '',
    name_it: '',
    slug: '',
    icon: 'Heart',
    cover_image: '',
    sort_order: '0',
    desc_ar: '',
    desc_en: '',
    desc_es: '',
    desc_it: '',
    is_active: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.categories.index({ search });
      setCategories(Array.isArray(res?.data) ? res.data : []);
    } catch {
      console.warn('Failed to fetch categories');
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setSelectedCategory(cat);
      setForm({
        name_ar: cat.name_translations?.ar || cat.name || '',
        name_en: cat.name_translations?.en || '',
        name_es: cat.name_translations?.es || '',
        name_it: cat.name_translations?.it || '',
        slug: cat.slug || '',
        icon: cat.icon || 'Heart',
        cover_image: cat.cover_image || cat.image || '',
        sort_order: String(cat.sort_order || 0),
        desc_ar: cat.description_translations?.ar || cat.description || '',
        desc_en: cat.description_translations?.en || '',
        desc_es: cat.description_translations?.es || '',
        desc_it: cat.description_translations?.it || '',
        is_active: cat.is_active ?? true,
      });
    } else {
      setSelectedCategory(null);
      setForm({
        name_ar: '',
        name_en: '',
        name_es: '',
        name_it: '',
        slug: '',
        icon: 'Heart',
        cover_image: '',
        sort_order: String(categories.length + 1),
        desc_ar: '',
        desc_en: '',
        desc_es: '',
        desc_it: '',
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  // Image Upload Handler with Canvas Compression
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(isRTL ? 'يرجى اختيار ملف صورة صالح' : 'Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = String(event.target?.result);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setForm(prev => ({ ...prev, cover_image: compressedBase64 }));
        toast.success(isRTL ? 'تم رفع وضغط الصورة بنجاح' : 'Image uploaded & optimized successfully');
      };
    };
    reader.readAsDataURL(file);
  };

  const handleToggleActive = async (id: number) => {
    try {
      const res = await apiService.admin.categories.toggleActive(id);
      if (res.success) {
        toast.success(res.message || 'Category status updated');
        fetchCategories();
      }
    } catch {
      toast.error('Failed to update category status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(isRTL ? 'هل أنت تأكد من رغبتك في حذف هذا القسم؟' : 'Are you sure you want to delete this category?')) return;
    try {
      const res = await apiService.admin.categories.delete(id);
      if (res.success) {
        toast.success('Category deleted successfully');
        fetchCategories();
      }
    } catch {
      toast.error('Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const cleanSlug = (form.slug || form.name_en || form.name_ar)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      const payload: any = {
        name: form.name_ar || form.name_en || 'Category',
        slug: cleanSlug || 'category-' + Date.now(),
        description: form.desc_ar || form.desc_en,
        icon: form.icon,
        sort_order: parseInt(form.sort_order) || 0,
        is_active: form.is_active,
        name_translations: {
          ar: form.name_ar,
          en: form.name_en,
          es: form.name_es,
          it: form.name_it,
        },
        description_translations: {
          ar: form.desc_ar,
          en: form.desc_en,
          es: form.desc_es,
          it: form.desc_it,
        },
      };

      if (form.cover_image && form.cover_image.trim()) {
        payload.cover_image = form.cover_image.trim();
      }

      let res;
      try {
        if (selectedCategory) {
          res = await apiService.admin.categories.update(selectedCategory.id, payload);
        } else {
          res = await apiService.admin.categories.store(payload);
        }
      } catch (err: any) {
        // Fallback retry without cover_image if remote server DB lacks cover_image column
        if (payload.cover_image) {
          const fallbackPayload = { ...payload };
          delete fallbackPayload.cover_image;
          if (selectedCategory) {
            res = await apiService.admin.categories.update(selectedCategory.id, fallbackPayload);
          } else {
            res = await apiService.admin.categories.store(fallbackPayload);
          }
        } else {
          throw err;
        }
      }

      if (res && res.success) {
        toast.success(selectedCategory ? (isRTL ? 'تم تحديث القسم بنجاح!' : 'Category updated successfully!') : (isRTL ? 'تم إنشاء القسم بنجاح!' : 'Category created successfully!'));
        setIsModalOpen(false);
        setSearch(''); // Reset search so the new/updated item is visible
        fetchCategories();
      }
    } catch {
      /* Error handled by http client toast */
    } finally {
      setSubmitting(false);
    }
  };

  // Icon Helper Component
  const renderIcon = (iconId?: string, className = "size-5") => {
    const found = ICON_OPTIONS.find(i => i.id.toLowerCase() === (iconId || '').toLowerCase());
    const IconComp = found ? found.icon : Heart;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <Layers className="size-8 text-cyan" />
            {isRTL ? 'إدارة الأقسام والتصنيفات (4 لغات)' : 'Categories Management (4 Languages)'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {isRTL 
              ? 'إدارة أقسام الموقع (شهر العسل، الفنادق، التجارب، الرحلات) واختيار الأيقونات وصورة الغلاف.' 
              : 'Manage main categories with image upload, custom icon selection, and 4-language support.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? 'بحث في الأقسام...' : 'Search categories...'}
              className={`h-10 w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)] cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{isRTL ? 'إضافة قسم جديد' : 'Add Category'}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-56 rounded-3xl border border-white/10 bg-navy/50 animate-pulse" />
          ))
        ) : categories.length > 0 ? (
          categories.map((cat, i) => {
            const hasAr = !!cat.name_translations?.ar;
            const hasEn = !!cat.name_translations?.en;
            const hasEs = !!cat.name_translations?.es;
            const hasIt = !!cat.name_translations?.it;
            const imgUrl = cat.cover_image || cat.image || '/images/hero/01-giza.jpg';

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-navy-light/40 backdrop-blur-xl shadow-lg transition-all hover:border-cyan/40 hover:shadow-[0_15px_40px_rgba(0,212,255,0.15)] flex flex-col justify-between"
              >
                {/* Category Image Banner Header */}
                <div className="relative h-32 w-full overflow-hidden bg-navy/80">
                  <Image
                    src={imgUrl}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

                  {/* Icon Badge */}
                  <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} z-10 flex size-10 items-center justify-center rounded-2xl bg-navy/80 text-cyan border border-cyan/30 shadow-lg backdrop-blur-md`}>
                    {renderIcon(cat.icon, "size-5")}
                  </div>

                  {/* Toggle Status */}
                  <button
                    onClick={() => handleToggleActive(cat.id)}
                    className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10 flex size-9 items-center justify-center rounded-2xl bg-navy/80 text-slate-300 border border-white/10 backdrop-blur-md hover:text-cyan transition-colors`}
                    title="Toggle Status"
                  >
                    {cat.is_active ? <ToggleRight className="size-5 text-emerald-400" /> : <ToggleLeft className="size-5 text-rose-400" />}
                  </button>

                  {/* Sort Order Pill */}
                  <div className={`absolute bottom-2 ${isRTL ? 'right-3' : 'left-3'} z-10 text-[10px] font-black uppercase text-cyan tracking-widest bg-navy/80 px-2.5 py-0.5 rounded-full border border-cyan/20`}>
                    #{cat.sort_order || 0}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{cat.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {cat.description || (isRTL ? 'لا يوجد وصف مضاف' : 'No description provided')}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Slug: <strong className="text-cyan font-mono">{cat.slug}</strong></span>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <div className="flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasAr ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>AR</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>EN</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEs ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>ES</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasIt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>IT</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-cyan/20 hover:text-cyan cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="flex size-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-rose-500/20 hover:text-rose-400 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white/5 rounded-3xl border border-white/10">
            {isRTL ? 'لم يتم العثور على أقسام' : 'No categories found'}
          </div>
        )}
      </div>

      {/* Create / Edit Modal with Image Upload & Icon Selector */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-navy p-6 md:p-8 shadow-2xl no-scrollbar cursor-default"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Layers className="size-6 text-cyan" />
                  {selectedCategory 
                    ? (isRTL ? 'تعديل بيانات القسم (صورة وأيقونة وترجمة)' : 'Edit Category (Image, Icon & 4 Languages)') 
                    : (isRTL ? 'إضافة قسم جديد (صورة وأيقونة وترجمة)' : 'Add New Category (Image, Icon & 4 Languages)')}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10">
                  <X className="size-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* ── Section A: Category Image Upload / URL & Icon Selector ── */}
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <ImageIcon className="size-4" /> 
                    {isRTL ? 'صورة الغلاف والأيقونة (Image & Icon Selection)' : 'Cover Image & Icon Selection'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* Image Upload Input & File Picker */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">
                        {isRTL ? 'صورة غلاف القسم (رفع صورة أو رابط)' : 'Category Cover Image'}
                      </label>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={form.cover_image}
                          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                          placeholder={isRTL ? 'رابط الصورة (URL) أو ارفع ملف...' : 'Image URL or Upload file...'}
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-cyan"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan/20 hover:bg-cyan/30 text-cyan text-xs font-bold border border-cyan/30 transition-all shrink-0 cursor-pointer"
                        >
                          <Upload className="size-4" />
                          <span>{isRTL ? 'رفع ملف' : 'Upload'}</span>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </div>

                      {/* Live Image Preview Thumbnail */}
                      {form.cover_image && (
                        <div className="relative h-28 w-full rounded-xl overflow-hidden border border-cyan/30 shadow-md">
                          <Image
                            src={form.cover_image}
                            alt="Cover Preview"
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2">
                            <span className="text-[10px] font-bold text-cyan flex items-center gap-1">
                              <Eye className="size-3" /> {isRTL ? 'معاينة الصورة' : 'Image Preview'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Icon Selection Dropdown */}
                    <div className="space-y-3">
                      <label className="text-xs font-semibold text-slate-300 block">
                        {isRTL ? 'اختر أيقونة القسم (Select Icon)' : 'Select Category Icon'}
                      </label>

                      <div className="relative">
                        <select
                          value={form.icon}
                          onChange={(e) => setForm({ ...form, icon: e.target.value })}
                          className="w-full h-11 px-4 rounded-xl bg-navy-light/80 border border-white/15 text-white text-xs font-bold outline-none focus:border-cyan appearance-none cursor-pointer"
                        >
                          {ICON_OPTIONS.map(opt => (
                            <option key={opt.id} value={opt.id} className="bg-navy text-white py-2">
                              {isRTL ? opt.nameAr : opt.nameEn}
                            </option>
                          ))}
                        </select>
                        <div className={`pointer-events-none absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 flex items-center gap-2 text-cyan`}>
                          {renderIcon(form.icon, "size-4 text-cyan")}
                        </div>
                      </div>

                      {/* Icon Grid Quick Select */}
                      <div className="grid grid-cols-6 gap-2 pt-1">
                        {ICON_OPTIONS.slice(0, 12).map(opt => {
                          const IconComponent = opt.icon;
                          const isSelected = form.icon.toLowerCase() === opt.id.toLowerCase();
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setForm({ ...form, icon: opt.id })}
                              className={`flex size-9 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan text-navy border-cyan shadow-[0_0_12px_rgba(0,212,255,0.5)] scale-110'
                                  : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                              }`}
                              title={isRTL ? opt.nameAr : opt.nameEn}
                            >
                              <IconComponent className="size-4" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section B: Category Names (4 Languages) ── */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> {isRTL ? 'اسم القسم (4 لغات)' : 'Category Name (4 Languages)'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Arabic (العربية) *</span>
                      <input
                        type="text"
                        required
                        value={form.name_ar}
                        onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                        placeholder="شهر العسل / الفنادق / التجارب / الرحلات"
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">English *</span>
                      <input
                        type="text"
                        required
                        value={form.name_en}
                        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                        placeholder="Honeymoon / Hotels / Experiences / Trips"
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                      <input
                        type="text"
                        value={form.name_es}
                        onChange={(e) => setForm({ ...form, name_es: e.target.value })}
                        placeholder="Luna de Miel / Hoteles"
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                      <input
                        type="text"
                        value={form.name_it}
                        onChange={(e) => setForm({ ...form, name_it: e.target.value })}
                        placeholder="Luna di Miele / Hotel"
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Section C: Slug & Sort Order ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300">URL Slug</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="honeymoon / hotels / experiences / trips"
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300">{isRTL ? 'الترتيب (Sort Order)' : 'Sort Order'}</label>
                    <input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                      className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                    />
                  </div>
                </div>

                {/* ── Section D: Description (4 Languages) ── */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                    <Globe className="size-4" /> {isRTL ? 'وصف القسم (4 لغات)' : 'Description (4 Languages)'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Arabic (العربية)</span>
                      <textarea
                        rows={2}
                        value={form.desc_ar}
                        onChange={(e) => setForm({ ...form, desc_ar: e.target.value })}
                        placeholder="وصف تفصيلي عن القسم..."
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">English</span>
                      <textarea
                        rows={2}
                        value={form.desc_en}
                        onChange={(e) => setForm({ ...form, desc_en: e.target.value })}
                        placeholder="Detailed category description..."
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                      <textarea
                        rows={2}
                        value={form.desc_es}
                        onChange={(e) => setForm({ ...form, desc_es: e.target.value })}
                        placeholder="Descripción de la categoría..."
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                      <textarea
                        rows={2}
                        value={form.desc_it}
                        onChange={(e) => setForm({ ...form, desc_it: e.target.value })}
                        placeholder="Descrizione della categoria..."
                        className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan text-navy font-bold text-sm hover:bg-cyan-light transition-all cursor-pointer shadow-[0_0_20px_rgba(0,212,255,0.4)]"
                  >
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    {selectedCategory ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : (isRTL ? 'إنشاء القسم' : 'Create Category')}
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
