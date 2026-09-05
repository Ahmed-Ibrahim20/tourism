import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from './config';
import { toast } from 'sonner';

/**
 * Singleton HTTP Client Class implementing Adapter & Interceptor Patterns.
 */
class HttpClient {
  private static instance: HttpClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Singleton Accessor
   */
  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  /**
   * Get underlying Axios instance
   */
  public getAxiosInstance(): AxiosInstance {
    return this.client;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Interceptors Setup
  // ───────────────────────────────────────────────────────────────────────────
  private setupInterceptors(): void {
    // 1. Request Interceptor: Attach Bearer Token & Language
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          // Token injection
          const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }

          // Locale injection
          const locale = localStorage.getItem(API_CONFIG.LOCALE_KEY) || API_CONFIG.DEFAULT_LOCALE;
          config.headers['Accept-Language'] = locale;
          
          // Optionally add ?lang= to query params if not explicitly passed
          config.params = {
            lang: locale,
            ...config.params,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: Extract data & handle global errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<any>) => {
        this.handleErrorResponse(error);
        return Promise.reject(error);
      }
    );
  }

  private handleErrorResponse(error: AxiosError<any>): void {
    if (typeof window === 'undefined') return;

    if (!error.response) {
      toast.error('Network Error: Unable to connect to server');
      return;
    }

    const { status, data } = error.response;
    const message = data?.message || 'An error occurred';

    switch (status) {
      case 401: {
        // Session expired or token revoked — clear local state and redirect
        localStorage.removeItem(API_CONFIG.TOKEN_KEY);
        localStorage.removeItem(API_CONFIG.USER_KEY);
        // Clear the Zustand persisted store key so useAuth() reflects logged-out state
        localStorage.removeItem('auth-storage');
        toast.error(message || 'Session expired. Please login again.');
        // Only redirect if not already on an auth page
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
          window.location.href = '/login';
        }
        break;
      }
      case 403:
        toast.error(message || 'Access denied: You do not have permission');
        break;
      case 404:
        toast.error(message || 'Requested resource not found');
        break;
      case 422:
        // Validation errors
        if (data?.errors) {
          const firstErrField = Object.keys(data.errors)[0];
          const firstErrMsg = data.errors[firstErrField]?.[0] || message;
          toast.error(firstErrMsg);
        } else {
          toast.error(message);
        }
        break;
      case 429:
        toast.error(message || 'Too many attempts. Please wait and try again.');
        break;
      case 500:
      default:
        toast.error(message || 'Server error occurred');
        break;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Convenience HTTP Methods
  // ───────────────────────────────────────────────────────────────────────────
  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, config);
    return res.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<T>(url, data, config);
    return res.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<T>(url, data, config);
    return res.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(url, config);
    return res.data;
  }
}

export const httpClient = HttpClient.getInstance();
