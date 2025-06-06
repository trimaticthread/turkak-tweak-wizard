
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { securityConfig, secureStorage } from '@/config/security.config';

// Güvenli axios instance oluştur
const createSecureApiClient = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: securityConfig.apiBaseUrl,
    timeout: securityConfig.requestTimeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    // CSRF koruması
    withCredentials: false,
    // SSL sertifika doğrulaması (development'ta false)
    validateStatus: (status) => status >= 200 && status < 300,
  });

  // Request interceptor - Token ekleme
  instance.interceptors.request.use(
    (config) => {
      const token = secureStorage.getItem(securityConfig.tokenStorageKey);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Request logging (sadece development'ta)
      if (process.env.NODE_ENV === 'development') {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        console.log('Request config:', config);
      }
      
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - Hata yönetimi
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response:', response);
      }
      return response;
    },
    (error) => {
      console.error('API Error Details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });

      // 401 durumunda otomatik logout
      if (error.response?.status === 401) {
        secureStorage.removeItem(securityConfig.tokenStorageKey);
        secureStorage.removeItem(securityConfig.userStorageKey);
        window.location.href = '/login';
      }
      
      // Network hatası kontrolü
      if (!error.response) {
        console.error('Network error - API sunucusuna ulaşılamıyor');
        throw new Error('Sunucuya bağlanılamadı. Backend çalışıyor mu? Port doğru mu?');
      }
      
      // Genel hata mesajı
      const message = error.response?.data?.message || error.message || 'Bir hata oluştu';
      throw new Error(message);
    }
  );

  return instance;
};

// Güvenli API client instance
const secureApiInstance = createSecureApiClient();

// API helper functions
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await secureApiInstance.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await secureApiInstance.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await secureApiInstance.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await secureApiInstance.delete<T>(url, config);
    return response.data;
  }
};

// Backward compatibility
export const apiClient = api;
export default api;
