import { httpClient } from '../httpClient';
import { ApiResponse, PaginatedResponse, QueryFilters } from '../types/common';
import { Destination } from '../types/models';

export interface StoreDestinationPayload {
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
  sort_order?: number;
  categories?: number[];
  cover_image?: string;
  name_translations?: Record<string, string>;
  short_description_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
}

export class AdminDestinationsService {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<Destination>> {
    return httpClient.get<PaginatedResponse<Destination>>('/admin/destinations', { params: filters });
  }

  async show(id: number): Promise<ApiResponse<Destination>> {
    return httpClient.get<ApiResponse<Destination>>(`/admin/destinations/${id}`);
  }

  async store(payload: StoreDestinationPayload): Promise<ApiResponse<Destination>> {
    return httpClient.post<ApiResponse<Destination>>('/admin/destinations', payload);
  }

  async update(id: number, payload: Partial<StoreDestinationPayload>): Promise<ApiResponse<Destination>> {
    return httpClient.put<ApiResponse<Destination>>(`/admin/destinations/${id}`, payload);
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    return httpClient.delete<ApiResponse<null>>(`/admin/destinations/${id}`);
  }

  async restore(id: number): Promise<ApiResponse<null>> {
    return httpClient.post<ApiResponse<null>>(`/admin/destinations/${id}/restore`);
  }

  async toggleActive(id: number): Promise<ApiResponse<Destination>> {
    return httpClient.put<ApiResponse<Destination>>(`/admin/destinations/${id}/toggle-active`);
  }

  async updateSortOrder(orders: { id: number; sort_order: number }[]): Promise<ApiResponse<null>> {
    return httpClient.put<ApiResponse<null>>('/admin/destinations/sort', { orders });
  }
}

export class PublicDestinationsService {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<Destination>> {
    return httpClient.get<PaginatedResponse<Destination>>('/v1/destinations', { params: filters });
  }

  async popular(limit: number = 6): Promise<ApiResponse<Destination[]>> {
    return httpClient.get<ApiResponse<Destination[]>>('/v1/destinations/popular', { params: { limit } });
  }

  async show(slug: string): Promise<ApiResponse<Destination>> {
    return httpClient.get<ApiResponse<Destination>>(`/v1/destinations/${slug}`);
  }
}

export const adminDestinationsService = new AdminDestinationsService();
export const publicDestinationsService = new PublicDestinationsService();
