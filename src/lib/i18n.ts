import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ar from './locales/ar';
import en from './locales/en';
import es from './locales/es';
import it from './locales/it';
import de from './locales/de';
import fr from './locales/fr';

const translations = { ar, en, es, it, de, fr };

export type Lang = 'en' | 'ar' | 'es' | 'it' | 'de' | 'fr';

interface I18nState {
  lang: Lang;
  dir: 'ltr' | 'rtl';
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      dir: 'rtl',
      setLang: (lang) => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        if (typeof document !== 'undefined') {
          document.documentElement.dir = dir;
          document.documentElement.lang = lang;
        }
        set({ lang, dir });
      },
      t: (key, params) => {
        const state = get();
        const activeLang = state.lang || 'ar';
        
        // Safety check to ensure the language exists in our dictionary
        const dict = (translations as any)[activeLang] || translations['ar'];
        
        // Try direct key access first (for flat objects)
        let value = dict[key];

        // If not found, try nested access (just in case)
        if (value === undefined) {
          const keys = key.split('.');
          let current: any = dict;
          for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
              current = current[k];
            } else {
              current = undefined;
              break;
            }
          }
          value = current;
        }

        // Fallback to English if still not found
        if (value === undefined) {
          const enDict = translations['en'] as any;
          value = enDict[key];
          if (value === undefined) {
            const keys = key.split('.');
            let current: any = enDict;
            for (const k of keys) {
              if (current && typeof current === 'object' && k in current) {
                current = current[k];
              } else {
                current = undefined;
                break;
              }
            }
            value = current;
          }
        }

        // Final fallback: return the key itself
        if (value === undefined || typeof value !== 'string') return key;

        if (params) {
          let str = value;
          Object.entries(params).forEach(([k, v]) => {
            str = str.split(`{${k}}`).join(String(v));
          });
          return str;
        }

        return value;
      },
    }),
    {
      name: 'dahab-dream-tour-v5',
      skipHydration: true,
    }
  )
);

if (typeof window !== 'undefined') {
  // Rehydrate after initial client hydration pass to prevent SSR mismatch
  setTimeout(() => {
    useI18n.persist.rehydrate();
    const state = useI18n.getState();
    if (state && state.lang) {
      const dir = state.lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = state.lang;
    }
  }, 0);
}

export const LANGUAGES = [
  { code: 'ar', label: 'العربية', flag: 'AR' },
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'es', label: 'Español', flag: 'ES' },
  { code: 'it', label: 'Italiano', flag: 'IT' },
] as const;

export const AR_TO_EN_DICTIONARY: Record<string, string> = {
  // Destinations
  'القاهرة': 'Cairo',
  'أهرامات الجيزة': 'Giza Pyramids',
  'الجيزة': 'Giza',
  'دهب': 'Dahab',
  'شرم الشيخ': 'Sharm El-Sheikh',
  'الغردقة': 'Hurghada',
  'الجونة': 'El Gouna',
  'الأقصر': 'Luxor',
  'أسوان': 'Aswan',
  'رحلة النيل الملكية': 'Nile Cruise',
  'رحلة النيل': 'Nile Cruise',
  'النيل': 'Nile',
  'الإسكندرية': 'Alexandria',
  'واحة سيوة': 'Siwa Oasis',
  'سيوة': 'Siwa Oasis',
  'الصحراء البيضاء': 'White Desert',
  'جبل سيناء': 'Mount Sinai',
  'سيناء': 'Sinai',
  'مرسى علم': 'Marsa Alam',
  'طابا': 'Taba',
  'نويبع': 'Nuweiba',
  'مصر': 'Egypt',

  // Categories & Services
  'شهر العسل': 'Honeymoon',
  'باقات شهر العسل': 'Honeymoon Packages',
  'فنادق': 'Hotels',
  'فنادق ومنتجعات': 'Hotels & Resorts',
  'فنادق فاخرة': 'Luxury Hotels',
  'رحلات': 'Trips',
  'رحلات سياحية': 'Guided Trips',
  'رحلات خاصة': 'Private Tours',
  'تجارب': 'Experiences',
  'تجارب وأنشطة': 'Experiences & Activities',
  'تجارب مميزة': 'Featured Experiences',
  'جولات': 'Tours',
  'جولات استكشافية': 'Sightseeing Tours',
  'غطس بحري': 'Diving & Marine',
  'رحلات وغوص': 'Diving & Marine',
  'أنشطة بحرية': 'Marine Activities',

  // Durations & Packages
  'رحلة يوم واحد': '1-Day Tour',
  '3 أيام / 2 ليلة': '3 Days / 2 Nights',
  '4 أيام / 3 ليالي': '4 Days / 3 Nights',
  '5 أيام / 4 ليالي': '5 Days / 4 Nights',
  '7 أيام / 6 ليالي': '7 Days / 6 Nights',
  'يوم واحد': '1 Day',
  'حسب الاختيار': 'Custom',

  // Common titles / Mock items
  'مغامرة الغوص في دهب': 'Dahab Diving Adventure',
  'سفاري صحراء سيوة': 'Siwa Desert Safari',
  'إبحار النيل الفاخر بين الأقصر وأسوان': 'Luxurious Nile Cruise between Luxor & Aswan',
  'إقامة ملكية في الجونة': 'Royal Stay in El Gouna',
  'رحلة وادي الملوك والأقصر': 'Valley of the Kings & Luxor Tour',
  'سفاري الصحراء البيضاء وشروق الشمس': 'White Desert Safari & Sunrise',
  'عطلة شرم الشيخ الشاملة': 'All-Inclusive Sharm El-Sheikh Getaway',
  'جولة أهرامات الجيزة والمتحف الكبير': 'Giza Pyramids & Grand Museum Tour',

  // Common UI labels
  'عرض التفاصيل والحجز': 'View Details & Book',
  'عرض التفاصيل': 'View Details',
  'خطّط رحلتك': 'Plan Your Trip',
  'ابحث الآن': 'Search Now',
  'تصفية': 'Filter',
  'الكل': 'All',
  'جميع الباقات': 'All Packages',
  'يبدأ من': 'From',
  'شامل الإفطار': 'Breakfast Included',
  'شامل جميع الوجبات': 'All Inclusive',
};

export const EN_TO_AR_DICTIONARY: Record<string, string> = {
  'Cairo': 'القاهرة',
  'Giza Pyramids': 'أهرامات الجيزة',
  'Giza': 'الجيزة',
  'Dahab': 'دهب',
  'Sharm El-Sheikh': 'شرم الشيخ',
  'Sharm El Sheikh': 'شرم الشيخ',
  'Hurghada': 'الغردقة',
  'El Gouna': 'الجونة',
  'Luxor': 'الأقصر',
  'Aswan': 'أسوان',
  'Nile Cruise': 'رحلة النيل الملكية',
  'Nile': 'النيل',
  'Alexandria': 'الإسكندرية',
  'Siwa Oasis': 'واحة سيوة',
  'Siwa': 'سيوة',
  'White Desert': 'الصحراء البيضاء',
  'Mount Sinai': 'جبل سيناء',
  'Sinai': 'سيناء',
  'Marsa Alam': 'مرسى علم',
  'Taba': 'طابا',
  'Nuweiba': 'نويبع',
  'Egypt': 'مصر',
  'Honeymoon': 'شهر العسل',
  'Luxury Hotels': 'فنادق فاخرة',
  'Hotels': 'فنادق',
  'Private Tours': 'رحلات خاصة',
  'Trips': 'رحلات',
  'Experiences': 'تجارب',
  'Featured Experiences': 'تجارب مميزة',
  'Tours': 'جولات',
  'Diving & Marine': 'غطس بحري',
};

/**
 * Ensures strict language isolation.
 * If active language is non-Arabic (e.g., 'en'), guarantees NO Arabic characters are returned.
 * If active language is Arabic ('ar'), guarantees NO English destination/category placeholders remain.
 */
export function sanitizeText(text: string, lang: string): string {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();

  // If language is English (or non-Arabic)
  if (lang !== 'ar') {
    if (AR_TO_EN_DICTIONARY[trimmed]) {
      return AR_TO_EN_DICTIONARY[trimmed];
    }
    if (/[\u0600-\u06FF]/.test(trimmed)) {
      let cleaned = trimmed;
      for (const [arKey, enVal] of Object.entries(AR_TO_EN_DICTIONARY)) {
        if (cleaned.includes(arKey)) {
          cleaned = cleaned.replace(new RegExp(arKey, 'g'), enVal);
        }
      }
      if (/[\u0600-\u06FF]/.test(cleaned)) {
        return AR_TO_EN_DICTIONARY[trimmed] || 'Explore Egypt';
      }
      return cleaned;
    }
    return trimmed;
  }

  // If language is Arabic ('ar')
  if (lang === 'ar') {
    if (EN_TO_AR_DICTIONARY[trimmed]) {
      return EN_TO_AR_DICTIONARY[trimmed];
    }
    let cleaned = trimmed;
    for (const [enKey, arVal] of Object.entries(EN_TO_AR_DICTIONARY)) {
      if (cleaned.toLowerCase().includes(enKey.toLowerCase())) {
        cleaned = cleaned.replace(new RegExp(enKey, 'gi'), arVal);
      }
    }
    return cleaned;
  }

  return trimmed;
}

export function getLocalizedField(
  entity: any,
  field: string,
  lang: string
): string {
  if (!entity) return '';

  const translationsMap =
    entity[`${field}_translations`] || entity.translations || entity.title_translations;
  if (translationsMap && typeof translationsMap === 'object') {
    const val = translationsMap[lang] || translationsMap[lang === 'ar' ? 'ar' : 'en'];
    if (val && typeof val === 'string') {
      return sanitizeText(val, lang);
    }
  }

  if (lang === 'ar') {
    const valAr = entity[`${field}_ar`] || entity[`${field}Ar`];
    if (valAr) return sanitizeText(String(valAr), lang);
  } else {
    const valEn = entity[`${field}_en`] || entity[`${field}En`];
    if (valEn) return sanitizeText(String(valEn), lang);
  }

  const baseVal = entity[field] || entity.title || entity.name;
  if (baseVal) {
    return sanitizeText(String(baseVal), lang);
  }

  return '';
}


