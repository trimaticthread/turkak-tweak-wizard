
import { apiClient } from '@/lib/api';
import { NewDeviceTypeDto } from '@/types/api.types';

export class DeviceTypeService {
  // Get all device types
  static async getAll(): Promise<NewDeviceTypeDto[]> {
    return await apiClient.get<NewDeviceTypeDto[]>('/newdevicetypes');
  }

  // Get device type by ID
  static async getById(id: number): Promise<NewDeviceTypeDto> {
    return await apiClient.get<NewDeviceTypeDto>(`/newdevicetypes/${id}`);
  }

  // Create new device type
  static async create(deviceType: Omit<NewDeviceTypeDto, 'newDeviceTypeId'>): Promise<NewDeviceTypeDto> {
    return await apiClient.post<NewDeviceTypeDto>('/newdevicetypes', deviceType);
  }

  // Update device type
  static async update(id: number, deviceType: Partial<NewDeviceTypeDto>): Promise<NewDeviceTypeDto> {
    return await apiClient.put<NewDeviceTypeDto>(`/newdevicetypes/${id}`, { 
      ...deviceType, 
      newDeviceTypeId: id 
    });
  }

  // Delete device type
  static async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/newdevicetypes/${id}`);
  }
}
