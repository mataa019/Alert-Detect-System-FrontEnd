import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse, PaginatedResponse } from '../types';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Handle forbidden access
      console.error('Access forbidden - insufficient permissions');
    }    
    if (error.response?.status && error.response.status >= 500) {
      // Handle server errors
      console.error('Server error:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export class ApiService {
  // GET request
  static async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    const response = await api.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  // GET request with pagination
  static async getPaginated<T>(url: string, params?: any): Promise<PaginatedResponse<T>> {
    const response = await api.get<PaginatedResponse<T>>(url, { params });
    return response.data;
  }

  // POST request
  static async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  // PUT request
  static async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  // PATCH request
  static async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await api.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  // DELETE request
  static async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await api.delete<ApiResponse<T>>(url);
    return response.data;
  }

  // Upload file
  static async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(Math.round(progress));
        }
      },
    });

    return response.data;
  }

  // Download file
  static async download(url: string, filename?: string): Promise<void> {
    const response = await api.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
}

// Authentication methods
export class AuthService {
  static async login(credentials: { username: string; password: string }): Promise<ApiResponse<{ token: string; user: any }>> {
    return ApiService.post('/auth/login', credentials);
  }

  static async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }

  static async getCurrentUser(): Promise<ApiResponse<any>> {
    return ApiService.get('/auth/me');
  }

  static async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return ApiService.post('/auth/refresh');
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  static getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  static getCurrentUserFromStorage(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}

// Error handling utilities
export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: any;

  constructor(message: string, status: number, code: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: AxiosError): ApiError {
  if (error.response) {
    const { status, data } = error.response;
    return new ApiError(
      (data as any)?.message || 'An error occurred',
      status,
      (data as any)?.code || 'UNKNOWN_ERROR',
      data
    );
  }
  
  if (error.request) {
    return new ApiError(
      'Network error - please check your connection',
      0,
      'NETWORK_ERROR'
    );
  }
  
  return new ApiError(
    error.message || 'An unexpected error occurred',
    0,
    'UNKNOWN_ERROR'
  );
}

export default api;