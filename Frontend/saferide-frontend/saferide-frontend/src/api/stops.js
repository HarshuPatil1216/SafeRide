import apiClient from "./client";
import { createResourceApi } from "./resource";

export const stopsApi = {
  ...createResourceApi("/stops"),
  byRoute: (routeId) => apiClient.get(`/stops/route/${routeId}`).then((r) => r.data),
};
