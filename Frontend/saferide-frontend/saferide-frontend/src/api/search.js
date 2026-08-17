import apiClient from "./client";

export const searchApi = {
  search: (query) => apiClient.get("/search", { params: { query } }).then((r) => r.data),
};
