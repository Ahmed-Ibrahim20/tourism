import { httpClient } from '../httpClient';
import { ApiResponse, PaginatedResponse, QueryFilters } from '../types/common';
import { User } from '../types/models';

export class AdminUsersService {
  async index(filters: QueryFilters = {}): Promise<PaginatedResponse<User>> {
    return httpClient.get<PaginatedResponse<User>>('/admin/users', { params: filters });
  }

  async show(id: number): Promise<ApiResponse<User>> {
    return httpClient.get<ApiResponse<User>>(`/admin/users/${id}`);
  }

  async update(id: number, payload: Partial<User>): Promise<ApiResponse<User>> {
    return httpClient.put<ApiResponse<User>>(`/admin/users/${id}`, payload);
  }

  async toggleSuspended(id: number): Promise<ApiResponse<User>> {
    return httpClient.put<ApiResponse<User>>(`/admin/users/${id}/toggle-suspended`);
  }

  async updateRole(id: number, role: string): Promise<ApiResponse<User>> {
    return httpClient.put<ApiResponse<User>>(`/admin/users/${id}/role`, { role });
  }

  async delete(id: number): Promise<ApiResponse<null>> {
    return httpClient.delete<ApiResponse<null>>(`/admin/users/${id}`);
  }
}

export const adminUsersService = new AdminUsersService();
