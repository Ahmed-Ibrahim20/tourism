import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import ar from './locales/ar';
import en from './locales/en';
import de from './locales/de';
import fr from './locales/fr';

const translations = { ar, en, de, fr };

export type Lang = 'en' | 'de' | 'fr' | 'ar';

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
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          const dir = state.lang === 'ar' ? 'rtl' : 'ltr';
          document.documentElement.dir = dir;
          document.documentElement.lang = state.lang || 'ar';
        }
      },
    }
  )
);

export const LANGUAGES = [
  { code: 'ar', label: 'العربية', flag: '🇪🇬' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
] as const;
