import apiClient from "./client";

export const authApi = {
  register: (payload) => apiClient.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => apiClient.post("/auth/login", payload).then((r) => r.data),
  getAuthorities: () => apiClient.get("/users/authorities").then((r) => r.data),
};
