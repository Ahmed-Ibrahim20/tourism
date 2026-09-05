'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { 
  Package as PackageIcon, Plus, Edit, Trash2, Search, X, Loader2, 
  Globe, Star, ToggleLeft, ToggleRight, DollarSign, MapPin, Tag, Layers,
  Video, Image as ImageIcon, Check, Percent, Sparkles, HelpCircle, Film, Calendar, Users
} from 'lucide-react';
import Image from 'next/image';
import { apiService, Package, Destination, Category, PackagePriceProfile } from '@/services/api';
import { toast } from 'sonner';
import ImageUploader from '@/components/admin/ImageUploader';
import MediaGalleryUploader, { isVideoFile } from '@/components/admin/MediaGalleryUploader';

interface PackageFormProfile {
  id?: number;
  title_ar: string;
  title_en: string;
  title_es: string;
  title_it: string;
  pricing_type: 'per_person' | 'per_room' | 'per_unit' | 'per_group';
  customer_type: 'individual' | 'couple' | 'group' | 'honeymoon' | 'family' | 'corporate';
  original_price: string;
  price: string;
  discount_percent: string;
  currency: string;
  child_price: string;
  max_children_allowed: string;
  max_child_age: string;
  features_ar: string;
  features_en: string;
  features_es: string;
  features_it: string;
}

export default function PackagesPage() {
  const { t, dir } = useI18n();
  const isRTL = dir === 'rtl';

  const [packages, setPackages] = useState<Package[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'offer' | 'packages'>('offer');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Main Offer Form State
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
    duration_days: '',
    duration_nights: '',
    start_date: '',
    end_date: '',
    max_children_allowed: '0',
    max_child_age: '12',
    destination_id: '',
    category_id: '',
    cover_image: '',
    cover_url: '',
    video_url: '',
    gallery: [] as string[],
    is_active: true,
  });

  // Multiple Packages inside Offer State
  const [priceProfiles, setPriceProfiles] = useState<PackageFormProfile[]>([
    {
      title_ar: 'الباقة القياسية (Standard Package)',
      title_en: 'Standard Package',
      title_es: 'Paquete Estándar',
      title_it: 'Pacchetto Standard',
      pricing_type: 'per_person',
      customer_type: 'individual',
      original_price: '500',
      price: '400',
      discount_percent: '20',
      currency: 'USD',
      child_price: '200',
      max_children_allowed: '1',
      max_child_age: '12',
      features_ar: 'إقامة شاملة الفطور, تنقلات من وإلى المطار, جولة سياحية مجانية',
      features_en: 'Breakfast included, Airport transfers, Free city tour',
      features_es: 'Desayuno incluido, Traslados al aeropuerto, Tour por la ciudad gratis',
      features_it: 'Colazione inclusa, Trasferimenti aeroportuali, Tour della città gratuito',
    }
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pkgRes, destRes, catRes] = await Promise.all([
        apiService.admin.packages.index({ search }).catch(() => null),
        apiService.admin.destinations.index({ per_page: 100 }).catch(() => null),
        apiService.admin.categories.index({ per_page: 100 }).catch(() => null),
      ]);

      if (pkgRes && pkgRes.data) {
        setPackages(Array.isArray(pkgRes.data) ? pkgRes.data : []);
      }
      if (destRes && destRes.data) {
        setDestinations(Array.isArray(destRes.data) ? destRes.data : []);
      }
      if (catRes && catRes.data) {
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
      }
    } catch (err) {
      console.warn('Failed to fetch admin packages data');
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenModal = (pkg?: Package) => {
    setActiveTab('offer');
    if (pkg) {
      setSelectedPackage(pkg);
      setForm({
        name_ar: pkg.name_translations?.ar || pkg.name || '',
        name_en: pkg.name_translations?.en || '',
        name_es: pkg.name_translations?.es || '',
        name_it: pkg.name_translations?.it || '',
        slug: pkg.slug || '',
        short_desc_ar: pkg.short_description_translations?.ar || pkg.short_description || '',
        short_desc_en: pkg.short_description_translations?.en || '',
        short_desc_es: pkg.short_description_translations?.es || '',
        short_desc_it: pkg.short_description_translations?.it || '',
        desc_ar: pkg.description_translations?.ar || pkg.description || '',
        desc_en: pkg.description_translations?.en || '',
        desc_es: pkg.description_translations?.es || '',
        desc_it: pkg.description_translations?.it || '',
        duration_days: pkg.duration_days !== undefined && pkg.duration_days !== null ? String(pkg.duration_days) : '',
        duration_nights: pkg.duration_nights !== undefined && pkg.duration_nights !== null ? String(pkg.duration_nights) : '',
        start_date: pkg.start_date || '',
        end_date: pkg.end_date || '',
        max_children_allowed: pkg.max_children_allowed !== undefined && pkg.max_children_allowed !== null ? String(pkg.max_children_allowed) : '0',
        max_child_age: pkg.max_child_age !== undefined && pkg.max_child_age !== null ? String(pkg.max_child_age) : '12',
        destination_id: String(pkg.destination?.id || pkg.destination_id || destinations[0]?.id || ''),
        category_id: String(pkg.category?.id || pkg.category_id || categories[0]?.id || ''),
        cover_image: '',
        cover_url: pkg.cover_url || '',
        video_url: pkg.video_url || '',
        gallery: pkg.gallery || [],
        is_active: pkg.is_active ?? true,
      });

      if (pkg.price_profiles && pkg.price_profiles.length > 0) {
        setPriceProfiles(pkg.price_profiles.map(p => {
          const featTrans = (p as any).features_translations;
          return {
            id: p.id,
            title_ar: p.title_translations?.ar || p.title || '',
            title_en: p.title_translations?.en || '',
            title_es: p.title_translations?.es || '',
            title_it: p.title_translations?.it || '',
            pricing_type: p.pricing_type || 'per_person',
            customer_type: p.customer_type || 'individual',
            original_price: String(p.original_price || p.price || 500),
            price: String(p.price || 400),
            discount_percent: String(p.discount_percent || 0),
            currency: p.currency || 'USD',
            child_price: p.child_price ? String(p.child_price) : '',
            max_children_allowed: p.max_children_allowed !== undefined && p.max_children_allowed !== null ? String(p.max_children_allowed) : '',
            max_child_age: p.max_child_age !== undefined && p.max_child_age !== null ? String(p.max_child_age) : '',
            features_ar: Array.isArray(featTrans?.ar) ? featTrans.ar.join(', ') : (Array.isArray(p.features) ? p.features.join(', ') : ''),
            features_en: Array.isArray(featTrans?.en) ? featTrans.en.join(', ') : '',
            features_es: Array.isArray(featTrans?.es) ? featTrans.es.join(', ') : '',
            features_it: Array.isArray(featTrans?.it) ? featTrans.it.join(', ') : '',
          };
        }));
      } else {
        setPriceProfiles([{
          title_ar: 'الباقة القياسية (Standard Package)',
          title_en: 'Standard Package',
          title_es: 'Paquete Estándar',
          title_it: 'Pacchetto Standard',
          pricing_type: 'per_person',
          customer_type: 'individual',
          original_price: '500',
          price: '400',
          discount_percent: '20',
          currency: 'USD',
          child_price: '200',
          max_children_allowed: '1',
          max_child_age: '12',
          features_ar: 'إقامة شاملة الفطور, تنقلات مجانية',
          features_en: 'Breakfast included, Free transfers',
          features_es: 'Desayuno incluido, Traslados gratis',
          features_it: 'Colazione inclusa, Trasferimenti gratuiti',
        }]);
      }
    } else {
      setSelectedPackage(null);
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
        duration_days: '',
        duration_nights: '',
        start_date: '',
        end_date: '',
        max_children_allowed: '0',
        max_child_age: '12',
        destination_id: String(destinations[0]?.id || ''),
        category_id: String(categories[0]?.id || ''),
        cover_image: '',
        cover_url: '',
        video_url: '',
        gallery: [],
        is_active: true,
      });
      setPriceProfiles([{
        title_ar: 'الباقة القياسية (Standard Package)',
        title_en: 'Standard Package',
        title_es: 'Paquete Estándar',
        title_it: 'Pacchetto Standard',
        pricing_type: 'per_person',
        customer_type: 'individual',
        original_price: '500',
        price: '400',
        discount_percent: '20',
        currency: 'USD',
        child_price: '200',
        max_children_allowed: '1',
        max_child_age: '12',
        features_ar: 'إقامة شاملة الفطور, تنقلات مجانية',
        features_en: 'Breakfast included, Free transfers',
        features_es: 'Desayuno incluido, Traslados gratis',
        features_it: 'Colazione inclusa, Trasferimenti gratuiti',
      }]);
    }
    setIsModalOpen(true);
  };

  const addPriceProfileRow = () => {
    setPriceProfiles(prev => [
      ...prev,
      {
        title_ar: `باقة مميزة #${prev.length + 1}`,
        title_en: `Premium Package #${prev.length + 1}`,
        title_es: `Paquete Premium #${prev.length + 1}`,
        title_it: `Pacchetto Premium #${prev.length + 1}`,
        pricing_type: 'per_person',
        customer_type: 'individual',
        original_price: '600',
        price: '480',
        discount_percent: '20',
        currency: 'USD',
        child_price: '240',
        max_children_allowed: '',
        max_child_age: '',
        features_ar: 'خدمات إضافية, إقامة فاخرة',
        features_en: 'Extra services, Luxury accommodation',
        features_es: 'Servicios extra, Alojamiento de lujo',
        features_it: 'Servizi extra, Alloggio di lusso',
      }
    ]);
  };

  const removePriceProfileRow = (index: number) => {
    if (priceProfiles.length <= 1) {
      toast.error('يجب أن يحتوي العرض على باقة واحدة على الأقل');
      return;
    }
    setPriceProfiles(prev => prev.filter((_, i) => i !== index));
  };

  const updatePriceProfileField = (index: number, field: keyof PackageFormProfile, val: string) => {
    setPriceProfiles(prev => {
      const updated = [...prev];
      const current = { ...updated[index], [field]: val };

      // Auto calculate discount percentage if original_price & price change
      if (field === 'original_price' || field === 'price') {
        const orig = parseFloat(field === 'original_price' ? val : current.original_price);
        const fin = parseFloat(field === 'price' ? val : current.price);
        if (orig > 0 && fin >= 0 && orig > fin) {
          const disc = Math.round(((orig - fin) / orig) * 100);
          current.discount_percent = String(disc);
        }
      }

      updated[index] = current;
      return updated;
    });
  };

  const handleToggleActive = async (id: number) => {
    try {
      const res = await apiService.admin.packages.toggleActive(id);
      if (res.success) {
        toast.success(res.message || 'Status updated successfully');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت تأكد من رغبتك في حذف هذا العرض بالكامل؟')) return;
    try {
      const res = await apiService.admin.packages.delete(id);
      if (res.success) {
        toast.success('Offer deleted successfully');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete offer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!form.destination_id || isNaN(parseInt(form.destination_id))) {
      setActiveTab('offer');
      toast.error(isRTL ? 'يرجى اختيار الوجهة السياحية للعرض' : 'Please select a destination for the offer.');
      setSubmitting(false);
      return;
    }

    if (!form.name_ar && !form.name_en) {
      setActiveTab('offer');
      toast.error(isRTL ? 'يرجى إدخال عنوان العرض باللغة العربية أو الإنجليزية على الأقل' : 'Please enter an offer title in Arabic or English.');
      setSubmitting(false);
      return;
    }

    let validStartDate = form.start_date || null;
    let validEndDate = form.end_date || null;
    if (validStartDate && validEndDate && new Date(validStartDate) > new Date(validEndDate)) {
      // Auto-swap if start_date is after end_date
      const temp = validStartDate;
      validStartDate = validEndDate;
      validEndDate = temp;
      setForm(prev => ({ ...prev, start_date: validStartDate || '', end_date: validEndDate || '' }));
      toast.info(isRTL ? 'تم ترتيب تاريخ البداية والنهاية تلقائياً' : 'Start date and end date were automatically adjusted.');
    }

    try {
      const formattedProfiles = priceProfiles.map(p => {
        const origPrice = parseFloat(p.original_price) || parseFloat(p.price) || 0;
        const finalPrice = parseFloat(p.price) || 0;

        const parseFeatures = (str: string) =>
          (str || '').split(/,|\n/).map(s => s.trim()).filter(Boolean);

        const featAr = parseFeatures(p.features_ar);
        const featEn = parseFeatures(p.features_en);
        const featEs = parseFeatures(p.features_es);
        const featIt = parseFeatures(p.features_it);

        const mainTitle = p.title_ar || p.title_en || 'Package';
        const mainFeatures = featAr.length > 0 ? featAr : (featEn.length > 0 ? featEn : []);

        return {
          id: p.id,
          title: mainTitle,
          title_translations: {
            ar: p.title_ar,
            en: p.title_en,
            es: p.title_es,
            it: p.title_it,
          },
          pricing_type: p.pricing_type,
          customer_type: p.customer_type,
          min_pax: 1,
          original_price: origPrice,
          price: finalPrice,
          discount_percent: parseFloat(p.discount_percent) || 0,
          currency: p.currency || 'USD',
          child_price: p.child_price !== '' ? parseFloat(p.child_price) : null,
          max_children_allowed: p.max_children_allowed !== '' ? parseInt(p.max_children_allowed) : null,
          max_child_age: p.max_child_age !== '' ? parseInt(p.max_child_age) : null,
          features: mainFeatures,
          features_translations: {
            ar: featAr,
            en: featEn,
            es: featEs,
            it: featIt,
          },
        };
      });

      const payload: any = {
        destination_id: parseInt(form.destination_id),
        category_id: form.category_id ? parseInt(form.category_id) : undefined,
        name: form.name_ar || form.name_en || 'Offer',
        slug: form.slug || (form.name_en || form.name_ar).toLowerCase().trim().replace(/\s+/g, '-'),
        short_description: form.short_desc_ar || form.short_desc_en,
        description: form.desc_ar || form.desc_en,
        duration_days: form.duration_days !== '' ? parseInt(form.duration_days) : null,
        duration_nights: form.duration_nights !== '' ? parseInt(form.duration_nights) : null,
        start_date: validStartDate,
        end_date: validEndDate,
        max_children_allowed: form.max_children_allowed !== '' ? parseInt(form.max_children_allowed) : 0,
        max_child_age: form.max_child_age !== '' ? parseInt(form.max_child_age) : 12,
        is_active: form.is_active,
        video_url: form.video_url || undefined,
        gallery: form.gallery || [],
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
        price_profiles: formattedProfiles,
        ...(form.cover_image ? { cover_image: form.cover_image } : {}),
      };

      let res;
      if (selectedPackage) {
        res = await apiService.admin.packages.update(selectedPackage.id, payload);
      } else {
        res = await apiService.admin.packages.store(payload);
      }

      if (res.success) {
        toast.success(selectedPackage ? 'تم تحديث العرض والباكجات بنجاح!' : 'تم إنشاء العرض والباكجات بنجاح!');
        setIsModalOpen(false);
        setSearch(''); // Reset search so new item shows immediately
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
            <PackageIcon className="size-8 text-cyan" />
            {isRTL ? 'إدارة العروض والباكجات' : 'Offers & Packages Management'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isRTL 
              ? 'إدارة العروض السياحية الرئيسية والباكجات التابعة لها والأسعار والخصومات والخدمات المشمولة.' 
              : 'Manage hero travel offers, sub-packages, multi-tier pricing, video links and included features.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className={`absolute ${dir === 'rtl' ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-slate-500`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRTL ? 'بحث في العروض...' : 'Search offers...'}
              className={`h-10 w-64 rounded-xl border border-white/10 bg-navy/50 text-sm text-white placeholder:text-slate-500 focus:border-cyan/30 focus:bg-white/10 focus:outline-none transition-all ${dir === 'rtl' ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-transparent bg-cyan px-4 text-sm font-bold text-navy transition-all hover:bg-cyan-light shadow-[0_0_15px_rgba(0,212,255,0.4)] cursor-pointer"
          >
            <Plus className="size-4" />
            <span>{isRTL ? 'إضافة عرض جديد' : 'Add New Offer'}</span>
          </button>
        </div>
      </div>

      {/* Grid View of Offers */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl border border-white/10 bg-navy/50 animate-pulse" />
          ))
        ) : packages.length > 0 ? (
          packages.map((pkg, i) => {
            const hasAr = !!pkg.name_translations?.ar;
            const hasEn = !!pkg.name_translations?.en;
            const hasEs = !!pkg.name_translations?.es;
            const hasIt = !!pkg.name_translations?.it;
            const profiles = pkg.price_profiles || [];

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-navy/80 shadow-lg backdrop-blur-xl transition-all hover:border-cyan/30 flex flex-col"
              >
                {/* Media Container */}
                <div className="relative h-48 w-full overflow-hidden bg-navy-light shrink-0">
                  {!imgErrors[pkg.id] && pkg.cover_url ? (
                    <Image
                      src={pkg.cover_url}
                      alt={pkg.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => setImgErrors(prev => ({ ...prev, [pkg.id]: true }))}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan/20 via-navy to-blue-900/40 flex items-center justify-center">
                      <PackageIcon className="size-12 text-cyan/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent opacity-90" />

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    <button
                      onClick={() => handleToggleActive(pkg.id)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:text-cyan cursor-pointer"
                      title="Toggle Active"
                    >
                      {pkg.is_active ? <ToggleRight className="size-5 text-emerald-400" /> : <ToggleLeft className="size-5 text-rose-400" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(pkg)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-cyan hover:text-navy cursor-pointer"
                      title="Edit Offer & Packages"
                    >
                      <Edit className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="flex size-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-rose-500 hover:text-white cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                    {pkg.destination && (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-cyan text-xs font-bold backdrop-blur-md border border-cyan/20">
                        <MapPin className="size-3" />
                        {pkg.destination.name}
                      </span>
                    )}
                    {pkg.gallery && pkg.gallery.length > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyan/80 text-navy text-[10px] font-bold backdrop-blur-md">
                        <ImageIcon className="size-3" />
                        {pkg.gallery.length} {isRTL ? 'ملفات' : 'Media'}
                      </span>
                    )}
                    {pkg.video_url && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/80 text-white text-[10px] font-bold backdrop-blur-md">
                        <Video className="size-3" />
                        VIDEO
                      </span>
                    )}
                  </div>

                  {/* Offer Title & Duration */}
                  <div className="absolute bottom-3 left-4 right-4 space-y-1">
                    <div className="flex items-center justify-between text-xs text-cyan font-semibold">
                      <span>{pkg.duration_days ? `${pkg.duration_days} Days / ${pkg.duration_nights || 0} Nights` : 'Flexible'}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan/20 text-cyan text-[10px] font-bold">
                        {profiles.length} {profiles.length === 1 ? 'Package' : 'Packages'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan transition-colors line-clamp-1">
                      {pkg.name}
                    </h3>
                  </div>
                </div>

                {/* Sub-Packages List Preview */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>{isRTL ? 'الباكجات المتاحة للعرض:' : 'Available Packages:'}</span>
                    </p>
                    
                    <div className="space-y-2 max-h-36 overflow-y-auto no-scrollbar">
                      {profiles.length > 0 ? (
                        profiles.map((p, pIdx) => {
                          const orig = p.original_price || p.price;
                          const disc = p.discount_percent > 0;
                          return (
                            <div key={pIdx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-white truncate">{p.title || `Package #${pIdx + 1}`}</p>
                                {p.features && p.features.length > 0 && (
                                  <p className="text-[11px] text-slate-400 truncate">
                                    {p.features.join(' • ')}
                                  </p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                {disc && (
                                  <span className="text-[10px] text-slate-400 line-through block">
                                    ${orig}
                                  </span>
                                )}
                                <span className="text-xs font-bold text-cyan">
                                  ${p.price} <span className="text-[10px] text-slate-400 font-normal">/{p.pricing_type === 'per_person' ? 'pax' : 'unit'}</span>
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-slate-500 italic">No packages defined</p>
                      )}
                    </div>
                  </div>

                  {/* Languages footer */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasAr ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>AR</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEn ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>EN</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasEs ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>ES</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${hasIt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-500'}`}>IT</span>
                    </div>
                    <span className="text-slate-400 font-medium">
                      {pkg.category?.name || 'Tour Category'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center text-slate-400 bg-white/5 rounded-2xl border border-white/10">
            No offers found
          </div>
        )}
      </div>

      {/* Main Create/Edit Modal with Tabs */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-navy p-6 shadow-2xl no-scrollbar cursor-default"
            >
              {/* Modal Header & Tabs */}
              <div className="border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <PackageIcon className="size-6 text-cyan" />
                    {selectedPackage ? (isRTL ? 'تعديل العرض والباكجات' : 'Edit Offer & Packages') : (isRTL ? 'إضافة عرض جديد وباكجات' : 'Add New Offer & Packages')}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                    <X className="size-5" />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('offer')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeTab === 'offer'
                        ? 'border-cyan text-cyan bg-cyan/10 rounded-t-xl'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="size-4" />
                    <span>1. {isRTL ? 'بيانات العرض الرئيسي والوسائط' : 'Offer Details & Media'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('packages')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                      activeTab === 'packages'
                        ? 'border-cyan text-cyan bg-cyan/10 rounded-t-xl'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="size-4 text-cyan" />
                    <span>2. {isRTL ? 'الباكجات والأسعار المشمولة' : 'Offer Packages Builder'}</span>
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-cyan/20 text-cyan text-[10px]">
                      {priceProfiles.length}
                    </span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* TAB 1: Main Offer Details */}
                {activeTab === 'offer' && (
                  <div className="space-y-6">
                    {/* Destination & Category Selects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Destination */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2 mb-1">
                          <MapPin className="size-4" /> {isRTL ? 'الوجهة السياحية *' : 'Destination *'}
                        </label>
                        <select
                          required
                          value={form.destination_id}
                          onChange={(e) => setForm({ ...form, destination_id: e.target.value })}
                          className={selectClass}
                        >
                          <option value="" style={optionStyle}>— Select Destination —</option>
                          {destinations.map((d) => (
                            <option key={d.id} value={d.id} style={optionStyle}>
                              {isRTL ? (d.name_translations?.ar || d.name) : (d.name_translations?.en || d.name)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2 mb-1">
                          <Layers className="size-4" /> {isRTL ? 'القسم / التصنيف الرئيسي' : 'Category'}
                        </label>
                        <select
                          value={form.category_id}
                          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                          className={selectClass}
                        >
                          <option value="" style={optionStyle}>— Select Category —</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id} style={optionStyle}>
                              {isRTL ? (c.name_translations?.ar || c.name) : (c.name_translations?.en || c.name)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Offer Name (4 Languages) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                        <Globe className="size-4" /> {isRTL ? 'اسم العرض الرئيسي (4 لغات)' : 'Offer Title (4 Languages)'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Arabic (العربية) *</span>
                          <input
                            type="text"
                            required
                            value={form.name_ar}
                            onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                            placeholder="عرض شهر العسل الـ VIP في شرم الشيخ"
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
                            placeholder="Sharm El Sheikh Honeymoon VIP Offer"
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Spanish (Español)</span>
                          <input
                            type="text"
                            value={form.name_es}
                            onChange={(e) => setForm({ ...form, name_es: e.target.value })}
                            placeholder="Oferta VIP Luna de Miel Sharm"
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Italian (Italiano)</span>
                          <input
                            type="text"
                            value={form.name_it}
                            onChange={(e) => setForm({ ...form, name_it: e.target.value })}
                            placeholder="Offerta VIP Luna di Miele Sharm"
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* URL Slug & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="text-xs font-bold text-slate-300">URL Slug</label>
                        <input
                          type="text"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: e.target.value })}
                          placeholder="sharm-vip-honeymoon"
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300">{isRTL ? 'عدد الأيام (اختياري)' : 'Days (Optional)'}</label>
                        <input
                          type="number"
                          min="0"
                          value={form.duration_days}
                          onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
                          placeholder="4"
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300">{isRTL ? 'عدد الليالي (اختياري)' : 'Nights (Optional)'}</label>
                        <input
                          type="number"
                          min="0"
                          value={form.duration_nights}
                          onChange={(e) => setForm({ ...form, duration_nights: e.target.value })}
                          placeholder="3"
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                        />
                      </div>
                    </div>



                    {/* Child Policy Section */}
                    <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-amber-500/20">
                      <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Users className="size-4" />
                        {isRTL ? 'سياسة الأطفال وأعمارهم في العرض / الفندق' : 'Children Policy & Allowed Ages'}
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <span className="text-xs text-slate-300 font-semibold">{isRTL ? 'عدد الأطفال المسموح بهم' : 'Max Allowed Children'}</span>
                          <select
                            value={form.max_children_allowed}
                            onChange={(e) => setForm({ ...form, max_children_allowed: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0b1329] border border-white/10 text-white text-sm focus:border-amber-400 outline-none cursor-pointer"
                          >
                            <option value="0" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? '0 - لا يسمح بأطفال (بالغين فقط)' : '0 - Adults Only (No Children)'}</option>
                            <option value="1" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? '1 - طفل واحد فقط' : '1 Child'}</option>
                            <option value="2" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? '2 - طفلان' : '2 Children'}</option>
                            <option value="3" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? '3 - 3 أطفال' : '3 Children'}</option>
                            <option value="4" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? '4 - 4 أطفال فأكثر' : '4+ Children'}</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-xs text-slate-300 font-semibold">{isRTL ? 'الحد الأقصى لسن الطفل (سن مجانية/تخفيض الطفل)' : 'Max Child Age (Years)'}</span>
                          <select
                            value={form.max_child_age}
                            onChange={(e) => setForm({ ...form, max_child_age: e.target.value })}
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-[#0b1329] border border-white/10 text-white text-sm focus:border-amber-400 outline-none cursor-pointer"
                          >
                            <option value="2" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? 'حتى سنتين (رضيع Infant)' : 'Up to 2 Years (Infant)'}</option>
                            <option value="6" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? 'حتى 6 سنوات' : 'Up to 6 Years'}</option>
                            <option value="12" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? 'حتى 12 سنة' : 'Up to 12 Years'}</option>
                            <option value="16" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>{isRTL ? 'حتى 16 سنة' : 'Up to 16 Years'}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Short Description (4 Languages) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-cyan flex items-center gap-2">
                        <Globe className="size-4" /> {isRTL ? 'وصف مختصر (4 لغات)' : 'Short Description (4 Languages)'}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <span className="text-xs text-slate-400 font-medium">Arabic (العربية)</span>
                          <textarea
                            rows={2}
                            value={form.short_desc_ar}
                            onChange={(e) => setForm({ ...form, short_desc_ar: e.target.value })}
                            placeholder="نبذة مختصرة عن مميزات العرض..."
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                          />
                        </div>
                        <div>
                          <span className="text-xs text-slate-400 font-medium">English</span>
                          <textarea
                            rows={2}
                            value={form.short_desc_en}
                            onChange={(e) => setForm({ ...form, short_desc_en: e.target.value })}
                            placeholder="Short summary of offer highlights..."
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Media Uploads: Cover Image & Media Gallery (Images & Videos) */}
                    <div className="space-y-6 pt-2">
                      <ImageUploader
                        currentUrl={form.cover_url}
                        folder="packages"
                        label={isRTL ? 'صورة الغلاف الأساسية للعرض' : 'Primary Cover Image'}
                        onUpload={(path, url) => setForm({ ...form, cover_image: path, cover_url: url })}
                        onRemove={() => setForm({ ...form, cover_image: '', cover_url: '' })}
                      />

                      <MediaGalleryUploader
                        gallery={form.gallery}
                        folder="packages"
                        label={isRTL ? 'معرض الصور والفيديوهات للعرض (مكتبة الوسائط)' : 'Offer Media Gallery (Images & Videos)'}
                        hint={isRTL ? 'يمكنك رفع عدة صور وفيديوهات (MP4, WebM) للعرض. اختر أو اسحب ملفات عديدة معاً.' : 'Upload multiple images and videos (MP4, WebM) for this offer.'}
                        onChange={(gallery) => setForm({ ...form, gallery })}
                      />

                      {/* Optional Video Link */}
                      <div className="pt-2 border-t border-white/5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-1">
                          <Video className="size-4 text-rose-400" /> {isRTL ? 'رابط فيديو خارجي (اختياري - YouTube / Vimeo)' : 'External Video Link (Optional - YouTube / Vimeo)'}
                        </label>
                        <input
                          type="text"
                          value={form.video_url}
                          onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Multiple Packages Builder */}
                {activeTab === 'packages' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-cyan/10 p-4 rounded-xl border border-cyan/20">
                      <div>
                        <h4 className="text-sm font-bold text-cyan flex items-center gap-2">
                          <Sparkles className="size-4" />
                          {isRTL ? 'إدارة الباكجات المشمولة داخل هذا العرض' : 'Manage Sub-Packages for this Offer'}
                        </h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          {isRTL ? 'يمكنك إضافة أكثر من باقة (مثل: باقة ستاندرد، باقة VIP) مع تحديد السعر الأصلي والخصومات والخدمات المشمولة.' : 'Define tier packages (e.g. Standard vs VIP) with strike-through original prices and package features.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={addPriceProfileRow}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan text-navy font-bold text-xs hover:bg-cyan-light transition-all cursor-pointer shrink-0"
                      >
                        <Plus className="size-4" />
                        <span>{isRTL ? 'إضافة باقة جديدة' : 'Add Sub-Package'}</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
                      {priceProfiles.map((prof, index) => (
                        <div key={index} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
                          {/* Top row Header & Delete button */}
                          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                            <span className="text-xs font-bold text-cyan uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="size-4 text-cyan" />
                              {isRTL ? `الباقة المشمولة #${index + 1}` : `Sub-Package #${index + 1}`}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePriceProfileRow(index)}
                              className="size-8 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Delete package"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>

                          {/* 4-Language Package Title */}
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-cyan uppercase tracking-wider flex items-center gap-1.5">
                              <Globe className="size-3.5" />
                              {isRTL ? 'عنوان الباقة (4 لغات)' : 'Package Title (4 Languages)'}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">Arabic (العربية) *</span>
                                <input
                                  type="text"
                                  required
                                  value={prof.title_ar}
                                  onChange={(e) => updatePriceProfileField(index, 'title_ar', e.target.value)}
                                  placeholder="الباقة القياسية (Standard Package)"
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-cyan outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">English *</span>
                                <input
                                  type="text"
                                  required
                                  value={prof.title_en}
                                  onChange={(e) => updatePriceProfileField(index, 'title_en', e.target.value)}
                                  placeholder="Standard Package"
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-cyan outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">Spanish (Español)</span>
                                <input
                                  type="text"
                                  value={prof.title_es}
                                  onChange={(e) => updatePriceProfileField(index, 'title_es', e.target.value)}
                                  placeholder="Paquete Estándar"
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-cyan outline-none"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">Italian (Italiano)</span>
                                <input
                                  type="text"
                                  value={prof.title_it}
                                  onChange={(e) => updatePriceProfileField(index, 'title_it', e.target.value)}
                                  placeholder="Pacchetto Standard"
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-medium focus:border-cyan outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Pricing Row: Original Price, Final Price, Discount %, Pricing Mode */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-white/5">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-300">{isRTL ? 'السعر الأصلي' : 'Original Price'}</label>
                              <div className="relative mt-1">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={prof.original_price}
                                  onChange={(e) => updatePriceProfileField(index, 'original_price', e.target.value)}
                                  className="w-full pl-6 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-cyan outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-cyan">{isRTL ? 'السعر النهائي *' : 'Final Price *'}</label>
                              <div className="relative mt-1">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cyan text-xs">$</span>
                                <input
                                  type="number"
                                  min="0"
                                  required
                                  value={prof.price}
                                  onChange={(e) => updatePriceProfileField(index, 'price', e.target.value)}
                                  className="w-full pl-6 pr-3 py-1.5 rounded-lg bg-white/5 border border-cyan/40 text-cyan font-bold text-xs focus:border-cyan outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-rose-400">{isRTL ? 'الخصم %' : 'Discount %'}</label>
                              <div className="relative mt-1">
                                <Percent className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-rose-400" />
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={prof.discount_percent}
                                  onChange={(e) => updatePriceProfileField(index, 'discount_percent', e.target.value)}
                                  className="w-full pl-6 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-cyan outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-slate-300">{isRTL ? 'نوع التسعير' : 'Pricing Mode'}</label>
                              <select
                                value={prof.pricing_type}
                                onChange={(e) => updatePriceProfileField(index, 'pricing_type', e.target.value as any)}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-cyan outline-none appearance-none cursor-pointer"
                              >
                                <option value="per_person" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>لكل فرد (Per Person)</option>
                                <option value="per_room" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>لكل غرفة (Per Room)</option>
                                <option value="per_unit" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>للوحدة (Per Unit)</option>
                                <option value="per_group" style={{ backgroundColor: '#0b1329', color: '#ffffff' }}>للمجموعة (Per Group)</option>
                              </select>
                            </div>
                          </div>

                          {/* 4-Language Package Features & Included Services */}
                          <div className="space-y-2 pt-1 border-t border-white/5">
                            <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                              <Tag className="size-3.5 text-cyan" />
                              {isRTL ? 'الخدمات والمميزات المشمولة (4 لغات - افصل بفاصلة أو سطر جديد)' : 'Included Services & Features (4 Languages - Comma or new line separated)'}
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">Arabic (العربية)</span>
                                <textarea
                                  rows={2}
                                  value={prof.features_ar}
                                  onChange={(e) => updatePriceProfileField(index, 'features_ar', e.target.value)}
                                  placeholder="إقامة شاملة الفطور, تنقلات مجانية من وإلى المطار..."
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-cyan outline-none resize-none"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">English</span>
                                <textarea
                                  rows={2}
                                  value={prof.features_en}
                                  onChange={(e) => updatePriceProfileField(index, 'features_en', e.target.value)}
                                  placeholder="Breakfast included, Airport transfers..."
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-cyan outline-none resize-none"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">Spanish (Español)</span>
                                <textarea
                                  rows={2}
                                  value={prof.features_es}
                                  onChange={(e) => updatePriceProfileField(index, 'features_es', e.target.value)}
                                  placeholder="Desayuno incluido, Traslados al aeropuerto..."
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-cyan outline-none resize-none"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 font-medium">Italian (Italiano)</span>
                                <textarea
                                  rows={2}
                                  value={prof.features_it}
                                  onChange={(e) => updatePriceProfileField(index, 'features_it', e.target.value)}
                                  placeholder="Colazione inclusa, Trasferimenti aeroportuali..."
                                  className="w-full mt-0.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-cyan outline-none resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  {activeTab === 'offer' ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab('packages')}
                      className="px-4 py-2 rounded-xl bg-cyan/20 text-cyan text-xs font-bold hover:bg-cyan/30 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{isRTL ? 'الانتقال لتحديد الباكجات والأسعار ➔' : 'Proceed to Packages & Pricing ➔'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('offer')}
                      className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      <span>{isRTL ? '⬅ العودة لبيانات العرض' : '⬅ Back to Offer Details'}</span>
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan text-navy font-bold text-sm hover:bg-cyan-light transition-all cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                    >
                      {submitting && <Loader2 className="size-4 animate-spin" />}
                      {selectedPackage ? (isRTL ? 'حفظ التعديلات' : 'Save Changes') : (isRTL ? 'إنشاء العرض' : 'Create Offer')}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
