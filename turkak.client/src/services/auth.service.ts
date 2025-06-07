
import { api } from '@/lib/api';
import { EmployeeLoginDto, EmployeeLoginResponseDto } from '@/types/api.types';
import { securityConfig, secureStorage } from '@/config/security.config';

export class AuthService {
  // Login
  static async login(credentials: EmployeeLoginDto): Promise<EmployeeLoginResponseDto> {
    // Input validation
    if (!credentials.employeeUserName || !credentials.employeePassword) {
      throw new Error('Kullanıcı adı ve şifre gereklidir');
    }

    // Güvenlik: Şifre uzunluk kontrolü
    if (credentials.employeePassword.length < 3) {
      throw new Error('Şifre en az 3 karakter olmalıdır');
    }

    console.log('Login attempt for user:', credentials.employeeUserName);
    console.log('API Base URL:', securityConfig.apiBaseUrl);

    try {
      // Backend'iniz /api/auth/login endpoint'i kullanıyor
      const response = await api.post<EmployeeLoginResponseDto>('/auth/login', {
        employeeUserName: credentials.employeeUserName,
        employeePassword: credentials.employeePassword
      });
      
      console.log('Login successful, response:', response);
      
      // Store token and user data securely
      if (response.token) {
        secureStorage.setItem(securityConfig.tokenStorageKey, response.token);
        secureStorage.setItem(securityConfig.userStorageKey, JSON.stringify(response));
      }
      
      return response;
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url
      });
      
      // Backend'den gelen hata mesajını kullan
      const message = error.response?.data?.message || error.message || 'Giriş başarısız';
      throw new Error(message);
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await api.post<void>('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      secureStorage.removeItem(securityConfig.tokenStorageKey);
      secureStorage.removeItem(securityConfig.userStorageKey);
    }
  }

  // Verify token
  static async verifyToken(): Promise<{ valid: boolean }> {
    try {
      return await api.post<{ valid: boolean }>('/auth/verify-token');
    } catch (error) {
      console.error('Token verification failed:', error);
      return { valid: false };
    }
  }

  // Get current user from localStorage
  static getCurrentUser(): EmployeeLoginResponseDto | null {
    const userStr = secureStorage.getItem(securityConfig.userStorageKey);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = secureStorage.getItem(securityConfig.tokenStorageKey);
    const user = this.getCurrentUser();
    return !!(token && user);
  }
}
