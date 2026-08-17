import apiClient from "./client";

/**
 * Builds a standard CRUD client for the paginated admin resources that all
 * share the same shape: POST /, GET / (page,size,sortBy,sortDir),
 * GET /search (query,page,size,sortBy,sortDir), GET /:id, PUT /:id, DELETE /:id
 */
export function createResourceApi(basePath) {
  return {
    list: ({ page = 0, size = 10, sortBy = "id", sortDir = "asc" } = {}) =>
      apiClient
        .get(basePath, { params: { page, size, sortBy, sortDir } })
        .then((r) => r.data),

    search: ({ query, page = 0, size = 10, sortBy = "id", sortDir = "asc" }) =>
      apiClient
        .get(`${basePath}/search`, { params: { query, page, size, sortBy, sortDir } })
        .then((r) => r.data),

    getById: (id) => apiClient.get(`${basePath}/${id}`).then((r) => r.data),

    create: (payload) => apiClient.post(basePath, payload).then((r) => r.data),

    update: (id, payload) => apiClient.put(`${basePath}/${id}`, payload).then((r) => r.data),

    remove: (id) => apiClient.delete(`${basePath}/${id}`).then((r) => r.data),
  };
}
