
import { apiClient } from '@/lib/api';
import { CustomersCertificateDto } from '@/types/api.types';

export class CertificateService {
  // Get all certificates
  static async getAll(): Promise<CustomersCertificateDto[]> {
    return await apiClient.get<CustomersCertificateDto[]>('/customerscertificates');
  }

  // Get certificate by ID
  static async getById(id: number): Promise<CustomersCertificateDto> {
    return await apiClient.get<CustomersCertificateDto>(`/customerscertificates/${id}`);
  }

  // Create new certificate
  static async create(certificate: Omit<CustomersCertificateDto, 'certificateId'>): Promise<CustomersCertificateDto> {
    return await apiClient.post<CustomersCertificateDto>('/customerscertificates', certificate);
  }

  // Update certificate
  static async update(id: number, certificate: Partial<CustomersCertificateDto>): Promise<CustomersCertificateDto> {
    return await apiClient.put<CustomersCertificateDto>(`/customerscertificates/${id}`, { 
      ...certificate, 
      certificateId: id 
    });
  }

  // Delete certificate
  static async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/customerscertificates/${id}`);
  }

  // Get certificates by customer
  static async getByCustomer(customerId: number): Promise<CustomersCertificateDto[]> {
    const allCertificates = await this.getAll();
    return allCertificates.filter(cert => cert.customer === customerId);
  }
}
