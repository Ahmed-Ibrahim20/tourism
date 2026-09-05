import { httpClient } from '../httpClient';
import { ApiResponse, PaginatedResponse, QueryFilters } from '../types/common';
import { Category } from '../types/models';

export const adminCategoriesService = {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<Category>> {
    return httpClient.get<PaginatedResponse<Category>>('/admin/categories', { params: filters });
  },

  async show(id: number): Promise<ApiResponse<Category>> {
    return httpClient.get<ApiResponse<Category>>(`/admin/categories/${id}`);
  },

  async store(payload: Partial<Category>): Promise<ApiResponse<Category>> {
    return httpClient.post<ApiResponse<Category>>('/admin/categories', payload);
  },

  async update(id: number, payload: Partial<Category>): Promise<ApiResponse<Category>> {
    return httpClient.put<ApiResponse<Category>>(`/admin/categories/${id}`, payload);
  },

  async delete(id: number): Promise<ApiResponse<null>> {
    return httpClient.delete<ApiResponse<null>>(`/admin/categories/${id}`);
  },

  async toggleActive(id: number): Promise<ApiResponse<Category>> {
    return httpClient.put<ApiResponse<Category>>(`/admin/categories/${id}/toggle-active`);
  },
};

export const publicCategoriesService = {
  async index(): Promise<ApiResponse<Category[]>> {
    return httpClient.get<ApiResponse<Category[]>>('/v1/categories');
  },

  async show(slug: string): Promise<ApiResponse<Category>> {
    return httpClient.get<ApiResponse<Category>>(`/v1/categories/${slug}`);
  },
};
