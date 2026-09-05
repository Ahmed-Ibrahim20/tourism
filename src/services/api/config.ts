/**
 * Central API Configuration - Single Source of Truth
 * Changing API_BASE_URL or API_DOMAIN here updates all API calls across the frontend.
 */

export const API_CONFIG = {
  // Domain / Base URL configuration
  // Defaulting to official production URL: https://apitourism.fikriti.com/api
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apitourism.fikriti.com/api',
  TIMEOUT: 8000,
  
  // Storage keys
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  LOCALE_KEY: 'app_locale',
  
  // Supported locales
  DEFAULT_LOCALE: 'ar',
  SUPPORTED_LOCALES: ['ar', 'en', 'es', 'it', 'de', 'fr'] as const,
};

export type SupportedLocale = typeof API_CONFIG.SUPPORTED_LOCALES[number];

/**
 * Get current base URL
 */
export function getApiBaseUrl(): string {
  return API_CONFIG.BASE_URL;
}
