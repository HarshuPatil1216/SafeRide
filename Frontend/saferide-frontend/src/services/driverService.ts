import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { Driver, DriverRequestDTO, PageResponse } from '../types';

export const driverService = {
  async getAll(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<Driver[]> {
    const response = await apiClient.get<Driver[] | PageResponse<Driver>>(ENDPOINTS.DRIVERS.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getById(id: number | string): Promise<Driver> {
    const response = await apiClient.get<Driver>(ENDPOINTS.DRIVERS.BY_ID(id));
    return response.data;
  },

  async getAvailable(): Promise<Driver[]> {
    const response = await apiClient.get<Driver[]>(ENDPOINTS.DRIVERS.AVAILABLE);
    return Array.isArray(response.data) ? response.data : [];
  },

  async create(dto: DriverRequestDTO): Promise<Driver> {
    const response = await apiClient.post<Driver>(ENDPOINTS.DRIVERS.BASE, dto);
    return response.data;
  },

  async update(id: number | string, dto: DriverRequestDTO): Promise<Driver> {
    const response = await apiClient.put<Driver>(ENDPOINTS.DRIVERS.BY_ID(id), dto);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.DRIVERS.BY_ID(id));
  },

  async assignVehicle(driverId: number | string, vehicleId: number | string): Promise<Driver> {
    const response = await apiClient.post<Driver>(ENDPOINTS.DRIVERS.ASSIGN_VEHICLE(driverId), { vehicleId });
    return response.data;
  }
};
