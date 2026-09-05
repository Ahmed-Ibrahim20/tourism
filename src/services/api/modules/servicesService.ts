import { httpClient } from '../httpClient';
import { ApiResponse, PaginatedResponse, QueryFilters } from '../types/common';
import { Service } from '../types/models';

export interface StoreServicePayload {
  destination_id: number;
  category_id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  star_rating?: number;
  address?: string;
  latitude?: number;
  longitude?: number;
  gallery?: string[];
  cover_image?: string;
  amenities?: string[];
  policies?: string[];
  is_active?: boolean;
  sort_order?: number;
  name_translations?: Record<string, string>;
  short_description_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
}

export class AdminServicesService {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<Service>> {
    return httpClient.get<PaginatedResponse<Service>>('/admin/services', { params: filters });
  }

  async show(id: number): Promise<ApiResponse<Service>> {
    return httpClient.get<ApiResponse<Service>>(`/admin/services/${id}`);
  }

  async store(payload: StoreServicePayload): Promise<ApiResponse<Service>> {
    return httpClient.post<ApiResponse<Service>>('/admin/services', payload);
  }

  async update(id: number, payload: Partial<StoreServicePayload>): Promise<ApiResponse<Service>> {
    return httpClient.put<ApiResponse<Service>>(`/admin/services/${id}`, payload);
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    return httpClient.delete<ApiResponse<null>>(`/admin/services/${id}`);
  }

  async toggleActive(id: number): Promise<ApiResponse<Service>> {
    return httpClient.put<ApiResponse<Service>>(`/admin/services/${id}/toggle-active`);
  }
}

export class PublicServicesService {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<Service>> {
    return httpClient.get<PaginatedResponse<Service>>('/v1/services', { params: filters });
  }

  async show(slug: string): Promise<ApiResponse<Service>> {
    return httpClient.get<ApiResponse<Service>>(`/v1/services/${slug}`);
  }

  async search(query: string, filters: QueryFilters = {}): Promise<PaginatedResponse<Service>> {
    return httpClient.get<PaginatedResponse<Service>>('/v1/services/search', {
      params: { search: query, ...filters },
    });
  }

  async byDestination(destinationId: number, filters: QueryFilters = {}): Promise<PaginatedResponse<Service>> {
    return httpClient.get<PaginatedResponse<Service>>(`/v1/destinations/${destinationId}/services`, { params: filters });
  }
}

export const adminServicesService = new AdminServicesService();
export const publicServicesService = new PublicServicesService();
