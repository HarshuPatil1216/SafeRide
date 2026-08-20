import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { PageResponse, Stop, StopRequestDTO } from '../types';

export const stopService = {
  async getAll(params?: { search?: string; routeId?: number | string; page?: number; size?: number }): Promise<Stop[]> {
    const response = await apiClient.get<Stop[] | PageResponse<Stop>>(ENDPOINTS.STOPS.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getById(id: number | string): Promise<Stop> {
    const response = await apiClient.get<Stop>(ENDPOINTS.STOPS.BY_ID(id));
    return response.data;
  },

  async getByRoute(routeId: number | string): Promise<Stop[]> {
    const response = await apiClient.get<Stop[] | PageResponse<Stop>>(ENDPOINTS.STOPS.BY_ROUTE(routeId));
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async create(dto: StopRequestDTO): Promise<Stop> {
    const response = await apiClient.post<Stop>(ENDPOINTS.STOPS.BASE, dto);
    return response.data;
  },

  async update(id: number | string, dto: StopRequestDTO): Promise<Stop> {
    const response = await apiClient.put<Stop>(ENDPOINTS.STOPS.BY_ID(id), dto);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.STOPS.BY_ID(id));
  }
};
