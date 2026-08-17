import apiClient from "./client";

export const ridesApi = {
  list: ({ page = 0, size = 10, sortBy = "id", sortDir = "desc" } = {}) =>
    apiClient.get("/rides", { params: { page, size, sortBy, sortDir } }).then((r) => r.data),

  search: ({ query, page = 0, size = 10, sortBy = "id", sortDir = "desc" }) =>
    apiClient.get("/rides/search", { params: { query, page, size, sortBy, sortDir } }).then((r) => r.data),

  getById: (id) => apiClient.get(`/rides/${id}`).then((r) => r.data),

  create: (payload) => apiClient.post("/rides", payload).then((r) => r.data),

  start: (id) => apiClient.put(`/rides/${id}/start`).then((r) => r.data),

  end: (id) => apiClient.put(`/rides/${id}/end`).then((r) => r.data),

  remove: (id) => apiClient.delete(`/rides/${id}`).then((r) => r.data),
};
