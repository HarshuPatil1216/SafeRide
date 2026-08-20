import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { PageResponse, Route, RouteRequestDTO } from '../types';

export const routeService = {
  async getAll(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<Route[]> {
    const response = await apiClient.get<Route[] | PageResponse<Route>>(ENDPOINTS.ROUTES.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getById(id: number | string): Promise<Route> {
    const response = await apiClient.get<Route>(ENDPOINTS.ROUTES.BY_ID(id));
    return response.data;
  },

  async create(dto: RouteRequestDTO): Promise<Route> {
    const response = await apiClient.post<Route>(ENDPOINTS.ROUTES.BASE, dto);
    return response.data;
  },

  async update(id: number | string, dto: RouteRequestDTO): Promise<Route> {
    const response = await apiClient.put<Route>(ENDPOINTS.ROUTES.BY_ID(id), dto);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.ROUTES.BY_ID(id));
  },

  async assignDriver(routeId: number | string, driverId: number | string): Promise<Route> {
    const response = await apiClient.post<Route>(ENDPOINTS.ROUTES.ASSIGN_DRIVER(routeId), { driverId });
    return response.data;
  },

  async assignVehicle(routeId: number | string, vehicleId: number | string): Promise<Route> {
    const response = await apiClient.post<Route>(ENDPOINTS.ROUTES.ASSIGN_VEHICLE(routeId), { vehicleId });
    return response.data;
  }
};
