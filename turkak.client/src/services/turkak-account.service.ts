
import { apiClient } from '@/lib/api';
import { TurkAkaccLoginDto, CalibrationCustomerDataDto, CertificateCustomerDto, CalibrationCertificateListItemDto } from '@/types/api.types';

export class TurkAkAccountService {
  // TürkAK Login
  static async login(credentials: TurkAkaccLoginDto): Promise<{ status: string; message: string }> {
    return await apiClient.post<{ status: string; message: string }>('/turkakaccapi/login', credentials);
  }

  // Verify TürkAK Token
  static async verifyToken(): Promise<{ valid: boolean; message?: string }> {
    return await apiClient.post<{ valid: boolean; message?: string }>('/turkakaccapi/verify-token');
  }

  // Get Token Status
  static async getTokenStatus(): Promise<{ valid: boolean; expiresInMinutes: number }> {
    return await apiClient.get<{ valid: boolean; expiresInMinutes: number }>('/turkakaccapi/token-status');
  }

  // TürkAK Logout
  static async logout(): Promise<{ status: string; message: string }> {
    return await apiClient.post<{ status: string; message: string }>('/turkakaccapi/logout');
  }

  // Clear Expired Token
  static async clearExpiredToken(): Promise<{ cleared: boolean; message: string }> {
    return await apiClient.post<{ cleared: boolean; message: string }>('/turkakaccapi/clear-expired-token');
  }

  // TBDS Services
  static async getCustomerPreData(): Promise<CalibrationCustomerDataDto> {
    return await apiClient.get<CalibrationCustomerDataDto>('/tbds/customers/pre-data');
  }

  static async getCertificateCustomers(): Promise<CertificateCustomerDto[]> {
    return await apiClient.get<CertificateCustomerDto[]>('/tbds/customers');
  }

  static async getCertificateList(): Promise<CalibrationCertificateListItemDto[]> {
    return await apiClient.get<CalibrationCertificateListItemDto[]>('/tbds/certificates');
  }

  static async getCertificateDetail(id: string): Promise<any> {
    return await apiClient.get<any>(`/tbds/certificates/${id}`);
  }

  static async deleteCertificate(id: string): Promise<{ status: string; message: string }> {
    return await apiClient.delete<{ status: string; message: string }>(`/tbds/certificates/${id}`);
  }
}
