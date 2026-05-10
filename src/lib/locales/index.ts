import { en } from './en';
import { ar } from './ar';
import { de } from './de';
import { fr } from './fr';

export const translations = {
  en,
  ar,
  de,
  fr
} as const;

export type Lang = keyof typeof translations;
