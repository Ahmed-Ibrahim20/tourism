import { httpClient } from '../httpClient';
import { ApiResponse, PaginatedResponse, QueryFilters } from '../types/common';
import { Package } from '../types/models';

export interface CalculatePricePayload {
  package_id: number;
  customer_type: string;
  adults_count: number;
  children_count?: number;
  date: string;
}

export interface PriceCalculationResult {
  package_id: number;
  customer_type: string;
  adults_count: number;
  children_count: number;
  date: string;
  adult_unit_price: number;
  adult_total: number;
  child_unit_price: number | null;
  child_total: number;
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  total: number;
  currency: string;
}

export class AdminPackagesService {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<Package>> {
    return httpClient.get<PaginatedResponse<Package>>('/admin/packages', { params: filters });
  }

  async show(id: number): Promise<ApiResponse<Package>> {
    return httpClient.get<ApiResponse<Package>>(`/admin/packages/${id}`);
  }

  async store(payload: any): Promise<ApiResponse<Package>> {
    return httpClient.post<ApiResponse<Package>>('/admin/packages', payload);
  }

  async update(id: number, payload: any): Promise<ApiResponse<Package>> {
    return httpClient.put<ApiResponse<Package>>(`/admin/packages/${id}`, payload);
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    return httpClient.delete<ApiResponse<null>>(`/admin/packages/${id}`);
  }

  async toggleActive(id: number): Promise<ApiResponse<Package>> {
    return httpClient.put<ApiResponse<Package>>(`/admin/packages/${id}/toggle-active`);
  }
}

export class PublicPackagesService {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<Package>> {
    return httpClient.get<PaginatedResponse<Package>>('/v1/packages', { params: filters });
  }

  async search(query: string, filters: QueryFilters = {}): Promise<PaginatedResponse<Package>> {
    return httpClient.get<PaginatedResponse<Package>>('/v1/packages/search', {
      params: { search: query, ...filters },
    });
  }

  async show(slug: string): Promise<ApiResponse<Package>> {
    return httpClient.get<ApiResponse<Package>>(`/v1/packages/${slug}`);
  }

  async related(id: number): Promise<ApiResponse<Package[]>> {
    return httpClient.get<ApiResponse<Package[]>>(`/v1/packages/${id}/related`);
  }

  async calculatePrice(payload: CalculatePricePayload): Promise<ApiResponse<PriceCalculationResult>> {
    return httpClient.get<ApiResponse<PriceCalculationResult>>('/v1/packages/calculate-price', {
      params: payload,
    });
  }
}

export const adminPackagesService = new AdminPackagesService();
export const publicPackagesService = new PublicPackagesService();
