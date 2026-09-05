export type UserRole = 'op_tier1' | 'op_tier2' | 'op_tier3'; // Admin, Manager, User

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  role_label?: string;
  is_admin?: boolean;
  is_manager?: boolean;
  is_suspended?: boolean;
  phone?: string;
  country_code?: string;
  gender?: string;
  birthdate?: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface TranslationMap {
  ar?: string;
  en?: string;
  es?: string;
  it?: string;
  [key: string]: string | undefined;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  has_icon?: boolean;
  cover_image?: string;
  cover_url?: string;
  image?: string;
  is_active?: boolean;
  sort_order?: number;
  name_translations?: TranslationMap;
  description_translations?: TranslationMap;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  has_coordinates?: boolean;
  cover_url?: string;
  is_active?: boolean;
  sort_order?: number;
  services_count?: number;
  packages_count?: number;
  categories?: Category[];
  name_translations?: TranslationMap;
  short_description_translations?: TranslationMap;
  description_translations?: TranslationMap;
}

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  star_rating?: number;
  formatted_star_rating?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  gallery?: string[];
  cover_url?: string;
  amenities?: string[];
  policies?: string[];
  is_active?: boolean;
  sort_order?: number;
  destination?: Destination;
  category?: Category;
  name_translations?: TranslationMap;
  short_description_translations?: TranslationMap;
  description_translations?: TranslationMap;
}

export interface PackagePriceProfile {
  id?: number;
  package_id?: number;
  title?: string;
  title_translations?: TranslationMap;
  pricing_type: 'per_person' | 'per_room' | 'per_unit' | 'per_group';
  customer_type: 'individual' | 'couple' | 'group' | 'honeymoon' | 'family' | 'corporate';
  min_pax: number;
  max_pax?: number;
  original_price?: number;
  price: number;
  discounted_price?: number;
  discount_percent: number;
  child_price?: number;
  max_children_allowed?: number;
  max_child_age?: number;
  currency: string;
  features?: string[];
  features_translations?: Record<string, string[]>;
  description?: string;
  valid_from?: string;
  valid_to?: string;
  is_high_season?: boolean;
  is_active?: boolean;
}

export interface PackageItem {
  id: number;
  package_id: number;
  service_id?: number;
  title: string;
  description?: string;
  sort_order?: number;
  service?: Service;
}

export interface Package {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  price?: number;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  gallery?: string[];
  cover_url?: string;
  video_url?: string;
  duration_nights?: number;
  duration_days?: number;
  start_date?: string;
  end_date?: string;
  max_children_allowed?: number;
  max_child_age?: number;
  duration_label?: string;
  tags?: string[];
  is_active?: boolean;
  sort_order?: number;
  min_price?: number;
  currency?: string;
  package_type?: string;
  destination_id?: number;
  category_id?: number;
  service_id?: number;
  destination?: Destination;
  category?: Category;
  service?: Service;
  price_profiles?: PackagePriceProfile[];
  items?: PackageItem[];
  name_translations?: TranslationMap;
  short_description_translations?: TranslationMap;
  description_translations?: TranslationMap;
}

export interface BookingItem {
  id: number;
  booking_id: number;
  package_id?: number;
  service_id?: number;
  title: string;
  date?: string;
  pricing_type?: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Booking {
  id: number;
  reference_number: string;
  user_id?: number;
  destination_id?: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'refunded';
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_country_code?: string;
  adults_count: number;
  children_count: number;
  check_in_date?: string;
  check_out_date?: string;
  special_requests?: string[];
  notes?: string[];
  created_at?: string;
  items?: BookingItem[];
  destination?: Destination;
}

export interface Payment {
  id: number;
  booking_id: number;
  user_id?: number;
  reference_number?: string;
  method: 'cash' | 'card' | 'wallet' | 'bank_transfer' | 'online_gateway';
  provider?: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  amount: number;
  currency: string;
  paid_at?: string;
  created_at?: string;
  booking?: Booking;
}

export interface QuoteRequest {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  country_code?: string;
  destination_id?: number;
  category_id?: number;
  preferred_date?: string;
  adults_count?: number;
  children_count?: number;
  nights_count?: number;
  message?: string;
  status: 'new' | 'in_progress' | 'replied' | 'closed' | 'spam';
  source?: string;
  is_read: boolean;
  created_at?: string;
  destination?: Destination;
  category?: Category;
}

export interface ContentSection {
  id: number;
  title: string;
  slug: string;
  content?: string;
  icon?: string;
  icon_label?: string;
  has_icon?: boolean;
  has_icon_label?: boolean;
  cover_url?: string;
  gallery?: string[];
  section_type: 'about_us' | 'why_choose_us' | 'how_it_works' | 'article' | 'testimonial' | 'faq' | 'custom';
  meta_title?: string;
  meta_description?: string;
  is_active?: boolean;
  sort_order?: number;
  title_translations?: TranslationMap;
  content_translations?: TranslationMap;
}

export interface DashboardOverview {
  total_bookings: number;
  total_revenue: number;
  total_users: number;
  total_destinations: number;
  total_services: number;
  new_bookings_today: number;
  new_bookings_this_week: number;
  new_bookings_this_month: number;
  revenue_today: number;
  revenue_this_week: number;
  revenue_this_month: number;
  active_quote_requests: number;
  conversion_rate: number;
}
