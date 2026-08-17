import apiClient from "./client";

export const notificationsApi = {
  create: (payload) => apiClient.post("/notifications", payload).then((r) => r.data),
  getById: (id) => apiClient.get(`/notifications/${id}`).then((r) => r.data),
  byParent: (parentId, { page = 0, size = 20 } = {}) =>
    apiClient.get(`/notifications/parent/${parentId}`, { params: { page, size } }).then((r) => r.data),
  unreadByParent: (parentId, { page = 0, size = 20 } = {}) =>
    apiClient.get(`/notifications/parent/${parentId}/unread`, { params: { page, size } }).then((r) => r.data),
  unreadCount: (parentId) => apiClient.get(`/notifications/parent/${parentId}/unread/count`).then((r) => r.data),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`).then((r) => r.data),
  remove: (id) => apiClient.delete(`/notifications/${id}`).then((r) => r.data),
};
