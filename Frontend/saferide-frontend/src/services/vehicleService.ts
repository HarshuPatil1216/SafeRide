import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { PageResponse, Vehicle, VehicleRequestDTO } from '../types';

export const vehicleService = {
  async getAll(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[] | PageResponse<Vehicle>>(ENDPOINTS.VEHICLES.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getById(id: number | string): Promise<Vehicle> {
    const response = await apiClient.get<Vehicle>(ENDPOINTS.VEHICLES.BY_ID(id));
    return response.data;
  },

  async getAvailable(): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>(ENDPOINTS.VEHICLES.AVAILABLE);
    return Array.isArray(response.data) ? response.data : [];
  },

  async create(dto: VehicleRequestDTO): Promise<Vehicle> {
    const response = await apiClient.post<Vehicle>(ENDPOINTS.VEHICLES.BASE, dto);
    return response.data;
  },

  async update(id: number | string, dto: VehicleRequestDTO): Promise<Vehicle> {
    const response = await apiClient.put<Vehicle>(ENDPOINTS.VEHICLES.BY_ID(id), dto);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.VEHICLES.BY_ID(id));
  },

  async getLocation(id: number | string): Promise<{ latitude: number; longitude: number; speed: number; lastUpdated: string }> {
    const response = await apiClient.get(ENDPOINTS.VEHICLES.LOCATION(id));
    return response.data;
  }
};
