import apiClient from "./client";

export const vehicleLocationsApi = {
  update: (payload) => apiClient.post("/vehicle-locations", payload).then((r) => r.data),
  latest: (vehicleId) => apiClient.get(`/vehicle-locations/${vehicleId}/latest`).then((r) => r.data),
  history: (vehicleId, { page = 0, size = 20 } = {}) =>
    apiClient.get(`/vehicle-locations/${vehicleId}/history`, { params: { page, size } }).then((r) => r.data),
};
