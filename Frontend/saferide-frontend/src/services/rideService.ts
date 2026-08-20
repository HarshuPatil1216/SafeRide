import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import {
  AttendanceStatus,
  EndRideRequestDTO,
  PageResponse,
  Ride,
  StartRideRequestDTO,
  UpdateAttendanceRequestDTO,
  UpdateLocationRequestDTO
} from '../types';

export const rideService = {
  async getAll(params?: { status?: string; date?: string; routeId?: number; page?: number; size?: number }): Promise<Ride[]> {
    const response = await apiClient.get<Ride[] | PageResponse<Ride>>(ENDPOINTS.RIDES.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getToday(): Promise<Ride[]> {
    const response = await apiClient.get<Ride[] | PageResponse<Ride>>(ENDPOINTS.RIDES.TODAY);
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getActive(): Promise<Ride[]> {
    const response = await apiClient.get<Ride[] | PageResponse<Ride>>(ENDPOINTS.RIDES.ACTIVE);
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getById(id: number | string): Promise<Ride> {
    const response = await apiClient.get<Ride>(ENDPOINTS.RIDES.BY_ID(id));
    return response.data;
  },

  async startRide(dto: StartRideRequestDTO | number): Promise<Ride> {
    const rideId = typeof dto === 'number' ? dto : dto.rideId;
    const body = typeof dto === 'number' ? { rideId } : dto;
    const response = await apiClient.post<Ride>(ENDPOINTS.RIDES.START(rideId), body);
    return response.data;
  },

  async endRide(dto: EndRideRequestDTO | number): Promise<Ride> {
    const rideId = typeof dto === 'number' ? dto : dto.rideId;
    const body = typeof dto === 'number' ? { rideId } : dto;
    const response = await apiClient.post<Ride>(ENDPOINTS.RIDES.END(rideId), body);
    return response.data;
  },

  async cancelRide(id: number | string, reason?: string): Promise<Ride> {
    const response = await apiClient.post<Ride>(`/rides/${id}/cancel`, { reason });
    return response.data;
  },

  async updateLocation(dto: UpdateLocationRequestDTO): Promise<void> {
    if (dto.rideId) {
      await apiClient.post(ENDPOINTS.RIDES.UPDATE_LOCATION(dto.rideId), dto);
    } else {
      await apiClient.post(ENDPOINTS.TRACKING.UPDATE, dto);
    }
  },

  async updateAttendance(dto: UpdateAttendanceRequestDTO): Promise<Ride> {
    const response = await apiClient.post<Ride>(ENDPOINTS.RIDES.ATTENDANCE(dto.rideId), dto);
    return response.data;
  },

  async getByDriverToday(driverId: number | string): Promise<Ride[]> {
    const response = await apiClient.get<Ride[] | PageResponse<Ride>>(ENDPOINTS.RIDES.BY_DRIVER_TODAY(driverId));
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getCurrentChildRide(studentId: number | string): Promise<Ride | null> {
    try {
      const response = await apiClient.get<Ride>(ENDPOINTS.RIDES.BY_STUDENT_CURRENT(studentId));
      return response.data;
    } catch {
      return null;
    }
  }
};
