import apiClient from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { Notification, NotificationRequestDTO, PageResponse } from '../types';

export const notificationService = {
  async getAll(params?: { page?: number; size?: number }): Promise<Notification[]> {
    const response = await apiClient.get<Notification[] | PageResponse<Notification>>(ENDPOINTS.NOTIFICATIONS.BASE, { params });
    if (response.data && 'content' in response.data) {
      return response.data.content;
    }
    return Array.isArray(response.data) ? response.data : [];
  },

  async getUnread(): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>(ENDPOINTS.NOTIFICATIONS.UNREAD);
    return Array.isArray(response.data) ? response.data : [];
  },

  async markAsRead(id: number | string): Promise<void> {
    await apiClient.put(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  async broadcast(dto: NotificationRequestDTO): Promise<Notification> {
    const response = await apiClient.post<Notification>(ENDPOINTS.NOTIFICATIONS.BROADCAST, dto);
    return response.data;
  }
};
