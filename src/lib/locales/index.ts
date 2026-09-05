import en from './en';
import ar from './ar';
import es from './es';
import it from './it';
import de from './de';
import fr from './fr';

export const translations = {
  en,
  ar,
  es,
  it,
  de,
  fr,
} as const;

export type Lang = keyof typeof translations;
