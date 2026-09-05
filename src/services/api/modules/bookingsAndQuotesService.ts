import { httpClient } from '../httpClient';
import { ApiResponse, PaginatedResponse, QueryFilters } from '../types/common';
import { Booking, Payment, QuoteRequest, Service } from '../types/models';

export interface InitiateBookingPayload {
  package_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_country_code?: string;
  customer_type: 'individual' | 'couple' | 'group' | 'honeymoon' | 'family' | 'corporate';
  adults_count: number;
  children_count?: number;
  check_in_date: string;
  check_out_date?: string;
  special_requests?: string[];
}

export interface SubmitQuotePayload {
  first_name?: string;
  last_name?: string;
  name?: string;
  email?: string;
  phone: string;
  country_code?: string;
  package_id?: number;
  destination_id?: number;
  category_id?: number;
  preferred_date?: string;
  adults_count?: number;
  children_count?: number;
  guests?: number;
  nights_count?: number;
  message?: string;
  notes?: string;
}

export class BookingsService {
  // Public (authenticated)
  async initiate(payload: InitiateBookingPayload): Promise<ApiResponse<Booking>> {
    return httpClient.post<ApiResponse<Booking>>('/v1/bookings/initiate', payload);
  }

  // Guest (no auth required)
  async guestInitiate(payload: InitiateBookingPayload): Promise<ApiResponse<Booking>> {
    return httpClient.post<ApiResponse<Booking>>('/v1/bookings/guest', payload);
  }

  async userBookings(filters: QueryFilters = {}): Promise<PaginatedResponse<Booking>> {
    return httpClient.get<PaginatedResponse<Booking>>('/v1/bookings', { params: filters });
  }

  async showUserBooking(id: number): Promise<ApiResponse<Booking>> {
    return httpClient.get<ApiResponse<Booking>>(`/v1/bookings/${id}`);
  }

  async cancelUserBooking(id: number): Promise<ApiResponse<Booking>> {
    return httpClient.post<ApiResponse<Booking>>(`/v1/bookings/${id}/cancel`);
  }

  // Admin
  async adminIndex(filters: QueryFilters = {}): Promise<PaginatedResponse<Booking>> {
    return httpClient.get<PaginatedResponse<Booking>>('/admin/bookings', { params: filters });
  }

  async adminShow(id: number): Promise<ApiResponse<Booking>> {
    return httpClient.get<ApiResponse<Booking>>(`/admin/bookings/${id}`);
  }

  async adminUpdateStatus(id: number, status: string): Promise<ApiResponse<Booking>> {
    return httpClient.put<ApiResponse<Booking>>(`/admin/bookings/${id}/status`, { status });
  }

  async adminAddNote(id: number, note: string): Promise<ApiResponse<Booking>> {
    return httpClient.post<ApiResponse<Booking>>(`/admin/bookings/${id}/notes`, { note });
  }
}

export class QuotesService {
  // Public
  async submit(payload: SubmitQuotePayload): Promise<ApiResponse<any>> {
    return httpClient.post<ApiResponse<any>>('/v1/quote-requests', payload);
  }

  async create(payload: SubmitQuotePayload): Promise<ApiResponse<any>> {
    return this.submit(payload);
  }

  // Admin
  async adminIndex(filters: QueryFilters = {}): Promise<PaginatedResponse<QuoteRequest>> {
    return httpClient.get<PaginatedResponse<QuoteRequest>>('/admin/quote-requests', { params: filters });
  }

  async adminUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
    return httpClient.get<ApiResponse<{ unread_count: number }>>('/admin/quote-requests/unread-count');
  }

  async adminUpdateStatus(id: number, status: string): Promise<ApiResponse<QuoteRequest>> {
    return httpClient.put<ApiResponse<QuoteRequest>>(`/admin/quote-requests/${id}/status`, { status });
  }

  async adminMarkAsRead(id: number): Promise<ApiResponse<QuoteRequest>> {
    return httpClient.put<ApiResponse<QuoteRequest>>(`/admin/quote-requests/${id}/read`);
  }
}

export const bookingsService = new BookingsService();
export const quotesService = new QuotesService();
