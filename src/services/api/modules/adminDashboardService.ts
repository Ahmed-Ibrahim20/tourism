import { httpClient } from '../httpClient';
import { ApiResponse } from '../types/common';
import { Booking, DashboardOverview, Destination, Package, QuoteRequest, Service, User } from '../types/models';

export interface ChartDataPoint {
  period: string;
  total_bookings?: number;
  total_revenue?: number;
  net_revenue?: number;
  new_customers?: number;
  total_quotes?: number;
}

export interface TopDestinationStat {
  id: number;
  name: string;
  slug: string;
  cover_url?: string;
  bookings_count: number;
  revenue: number;
  percentage: number;
}

export interface TopServiceStat {
  id: number;
  name: string;
  bookings_count: number;
  revenue: number;
}

export interface BookingsByStatusStat {
  status: string;
  status_label: string;
  count: number;
  revenue: number;
}

export class AdminDashboardService {
  /**
   * Overall dashboard metrics
   */
  async getOverview(): Promise<ApiResponse<DashboardOverview>> {
    return httpClient.get<ApiResponse<DashboardOverview>>('/admin/dashboard/overview');
  }

  /**
   * Bookings trend chart data
   */
  async getBookingsChart(period: 'day' | 'week' | 'month' | 'year' = 'month', limit: number = 12): Promise<ApiResponse<ChartDataPoint[]>> {
    return httpClient.get<ApiResponse<ChartDataPoint[]>>('/admin/dashboard/bookings-chart', {
      params: { period, limit },
    });
  }

  /**
   * Revenue chart data
   */
  async getRevenueChart(period: 'day' | 'week' | 'month' | 'year' = 'month', limit: number = 12): Promise<ApiResponse<ChartDataPoint[]>> {
    return httpClient.get<ApiResponse<ChartDataPoint[]>>('/admin/dashboard/revenue-chart', {
      params: { period, limit },
    });
  }

  /**
   * Top performing destinations
   */
  async getTopDestinations(): Promise<ApiResponse<TopDestinationStat[]>> {
    return httpClient.get<ApiResponse<TopDestinationStat[]>>('/admin/dashboard/top-destinations');
  }

  /**
   * Top performing services
   */
  async getTopServices(): Promise<ApiResponse<TopServiceStat[]>> {
    return httpClient.get<ApiResponse<TopServiceStat[]>>('/admin/dashboard/top-services');
  }

  /**
   * Top performing packages
   */
  async getTopPackages(): Promise<ApiResponse<any[]>> {
    return httpClient.get<ApiResponse<any[]>>('/admin/dashboard/top-packages');
  }

  /**
   * Bookings broken down by status
   */
  async getBookingsByStatus(): Promise<ApiResponse<BookingsByStatusStat[]>> {
    return httpClient.get<ApiResponse<BookingsByStatusStat[]>>('/admin/dashboard/bookings-by-status');
  }

  /**
   * Revenue broken down by payment method
   */
  async getRevenueByMethod(): Promise<ApiResponse<any[]>> {
    return httpClient.get<ApiResponse<any[]>>('/admin/dashboard/revenue-by-method');
  }

  /**
   * Recent bookings list
   */
  async getRecentBookings(): Promise<ApiResponse<Booking[]>> {
    return httpClient.get<ApiResponse<Booking[]>>('/admin/dashboard/recent-bookings');
  }

  /**
   * Recent quote requests list
   */
  async getRecentQuotes(): Promise<ApiResponse<QuoteRequest[]>> {
    return httpClient.get<ApiResponse<QuoteRequest[]>>('/admin/dashboard/recent-quotes');
  }

  /**
   * Occupancy rates
   */
  async getOccupancyRates(): Promise<ApiResponse<any[]>> {
    return httpClient.get<ApiResponse<any[]>>('/admin/dashboard/occupancy-rates');
  }
}

export const adminDashboardService = new AdminDashboardService();
