import { httpClient } from '../httpClient';
import { ApiResponse } from '../types/common';
import { User } from '../types/models';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  country_code?: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  country_code?: string;
  gender?: string;
  birthdate?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export class AuthService {
  /**
   * Login user and retrieve Sanctum token
   */
  async login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
    return httpClient.post<ApiResponse<AuthData>>('/auth/login', payload);
  }

  /**
   * Register new user account
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthData>> {
    return httpClient.post<ApiResponse<AuthData>>('/auth/register', payload);
  }

  /**
   * Logout user and revoke Sanctum token
   */
  async logout(): Promise<ApiResponse<null>> {
    return httpClient.post<ApiResponse<null>>('/auth/logout');
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<ApiResponse<AuthData>> {
    return httpClient.post<ApiResponse<AuthData>>('/auth/refresh-token');
  }

  /**
   * Get current authenticated user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return httpClient.get<ApiResponse<User>>('/auth/profile');
  }

  /**
   * Update profile information
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    return httpClient.put<ApiResponse<User>>('/auth/profile', payload);
  }

  /**
   * Change account password
   */
  async changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<null>> {
    return httpClient.put<ApiResponse<null>>('/auth/change-password', payload);
  }
}

export const authService = new AuthService();
