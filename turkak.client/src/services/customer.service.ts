
import { apiClient } from '@/lib/api';
import { CustomerDto } from '@/types/api.types';

export class CustomerService {
  // Get all customers
  static async getAll(): Promise<CustomerDto[]> {
    return await apiClient.get<CustomerDto[]>('/customers');
  }

  // Get customer by ID
  static async getById(id: number): Promise<CustomerDto> {
    return await apiClient.get<CustomerDto>(`/customers/${id}`);
  }

  // Create new customer
  static async create(customer: Omit<CustomerDto, 'customersId'>): Promise<CustomerDto> {
    return await apiClient.post<CustomerDto>('/customers', customer);
  }

  // Update customer
  static async update(id: number, customer: Partial<CustomerDto>): Promise<CustomerDto> {
    return await apiClient.put<CustomerDto>(`/customers/${id}`, { ...customer, customersId: id });
  }

  // Delete customer
  static async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/customers/${id}`);
  }

  // Search customers
  static async search(query: string): Promise<CustomerDto[]> {
    const allCustomers = await this.getAll();
    return allCustomers.filter(customer => 
      customer.title.toLowerCase().includes(query.toLowerCase()) ||
      customer.email.toLowerCase().includes(query.toLowerCase()) ||
      customer.taxNumber.includes(query)
    );
  }
}
