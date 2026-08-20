import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { PageResponse, Student, StudentRequestDTO } from '../types';

export const studentService = {
  async getAll(params?: {
    search?: string;
    routeId?: number | string;
    parentId?: number | string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<Student[]> {
    const response = await apiClient.get<Student[] | PageResponse<Student>>(ENDPOINTS.STUDENTS.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getById(id: number | string): Promise<Student> {
    const response = await apiClient.get<Student>(ENDPOINTS.STUDENTS.BY_ID(id));
    return response.data;
  },

  async create(dto: StudentRequestDTO): Promise<Student> {
    const response = await apiClient.post<Student>(ENDPOINTS.STUDENTS.BASE, dto);
    return response.data;
  },

  async update(id: number | string, dto: StudentRequestDTO): Promise<Student> {
    const response = await apiClient.put<Student>(ENDPOINTS.STUDENTS.BY_ID(id), dto);
    return response.data;
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(ENDPOINTS.STUDENTS.BY_ID(id));
  },

  async getByParent(parentId: number | string): Promise<Student[]> {
    const response = await apiClient.get<Student[] | PageResponse<Student>>(ENDPOINTS.STUDENTS.BY_PARENT(parentId));
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getByRoute(routeId: number | string): Promise<Student[]> {
    const response = await apiClient.get<Student[] | PageResponse<Student>>(ENDPOINTS.STUDENTS.BY_ROUTE(routeId));
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  }
};
