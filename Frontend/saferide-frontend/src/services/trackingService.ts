import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { UpdateLocationRequestDTO, VehicleTrackingData } from '../types';

export const trackingService = {
  async getAllActiveVehicles(): Promise<VehicleTrackingData[]> {
    const response = await apiClient.get<VehicleTrackingData[]>(ENDPOINTS.TRACKING.ALL_ACTIVE);
    return Array.isArray(response.data) ? response.data : [];
  },

  async getVehicleLocation(vehicleId: number | string): Promise<VehicleTrackingData> {
    const response = await apiClient.get<VehicleTrackingData>(ENDPOINTS.TRACKING.BY_VEHICLE(vehicleId));
    return response.data;
  },

  async getRideTracking(rideId: number | string): Promise<VehicleTrackingData> {
    const response = await apiClient.get<VehicleTrackingData>(ENDPOINTS.TRACKING.BY_RIDE(rideId));
    return response.data;
  },

  async sendDriverLocation(dto: UpdateLocationRequestDTO): Promise<void> {
    await apiClient.post(ENDPOINTS.TRACKING.UPDATE, dto);
  }
};
