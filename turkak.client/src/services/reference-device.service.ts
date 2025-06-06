
import { apiClient } from '@/lib/api';
import { ReferenceDeviceAddDto } from '@/types/api.types';

export class ReferenceDeviceService {
  // Get all reference devices
  static async getAll(): Promise<ReferenceDeviceAddDto[]> {
    return await apiClient.get<ReferenceDeviceAddDto[]>('/referencedevices');
  }

  // Get reference device by ID
  static async getById(id: number): Promise<ReferenceDeviceAddDto> {
    return await apiClient.get<ReferenceDeviceAddDto>(`/referencedevices/${id}`);
  }

  // Create new reference device
  static async create(device: Omit<ReferenceDeviceAddDto, 'referenceDeviceId'>): Promise<ReferenceDeviceAddDto> {
    return await apiClient.post<ReferenceDeviceAddDto>('/referencedevices', device);
  }

  // Update reference device
  static async update(id: number, device: Partial<ReferenceDeviceAddDto>): Promise<ReferenceDeviceAddDto> {
    return await apiClient.put<ReferenceDeviceAddDto>(`/referencedevices/${id}`, { 
      ...device, 
      referenceDeviceId: id 
    });
  }

  // Delete reference device
  static async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/referencedevices/${id}`);
  }

  // Get devices that need calibration (expiring soon)
  static async getExpiringDevices(daysThreshold: number = 30): Promise<ReferenceDeviceAddDto[]> {
    const allDevices = await this.getAll();
    const today = new Date();
    const thresholdDate = new Date(today.getTime() + (daysThreshold * 24 * 60 * 60 * 1000));
    
    return allDevices.filter(device => {
      const nextCalibrationDate = new Date(device.nextCalibratorDate);
      return nextCalibrationDate <= thresholdDate && device.status;
    });
  }
}
