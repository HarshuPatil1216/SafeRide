import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { PageResponse, Parent, ParentRequestDTO, Student } from '../types';

export const parentService = {
  async getAll(params?: { search?: string; status?: string; page?: number; size?: number }): Promise<Parent[]> {
    const response = await apiClient.get<Parent[] | PageResponse<Parent>>(ENDPOINTS.PARENTS.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getById(id: number | string): Promise<Parent> {
    const response = await apiClient.get<Parent>(ENDPOINTS.PARENTS.BY_ID(id));
    return response.data;
  },

  async create(dto: ParentRequestDTO): Promise<Parent> {
    const response = await apiClient.post<Parent>(ENDPOINTS.PARENTS.BASE, dto);
    return response.data;
  },

  async update(id: number | string, dto: ParentRequestDTO): Promise<Parent> {
    const response = await apiClient.put<Parent>(ENDPOINTS.PARENTS.BY_ID(id), dto);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.PARENTS.BY_ID(id));
  },

  async getMyChildren(): Promise<Student[]> {
    try {
      const response = await apiClient.get<Student[] | PageResponse<Student>>(ENDPOINTS.PARENTS.MY_CHILDREN);
      if (response.data && 'content' in response.data) {
        return response.data.content;
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch {
      return [];
    }
  }
};
