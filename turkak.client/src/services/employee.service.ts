
import { apiClient } from '@/lib/api';
import { EmployeeDto } from '@/types/api.types';

export class EmployeeService {
  // Get all employees
  static async getAll(): Promise<EmployeeDto[]> {
    return await apiClient.get<EmployeeDto[]>('/employee');
  }

  // Get employee by ID
  static async getById(id: number): Promise<EmployeeDto> {
    return await apiClient.get<EmployeeDto>(`/employee/${id}`);
  }

  // Create new employee
  static async create(employee: Omit<EmployeeDto, 'employeeId'>): Promise<EmployeeDto> {
    return await apiClient.post<EmployeeDto>('/employee', employee);
  }

  // Update employee
  static async update(id: number, employee: Partial<EmployeeDto>): Promise<EmployeeDto> {
    return await apiClient.put<EmployeeDto>(`/employee/${id}`, { ...employee, employeeId: id });
  }

  // Delete employee
  static async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/employee/${id}`);
  }
}
