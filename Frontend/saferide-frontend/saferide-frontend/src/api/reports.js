import apiClient from "./client";

export const reportsApi = {
  allRides: () => apiClient.get("/reports/rides").then((r) => r.data),
  completedRides: () => apiClient.get("/reports/rides/completed").then((r) => r.data),
  runningRides: () => apiClient.get("/reports/rides/running").then((r) => r.data),
  scheduledRides: () => apiClient.get("/reports/rides/scheduled").then((r) => r.data),
  allAttendance: () => apiClient.get("/reports/attendance").then((r) => r.data),
  attendanceByType: (eventType) =>
    apiClient.get("/reports/attendance/type", { params: { eventType } }).then((r) => r.data),
  allVehicleLocations: () => apiClient.get("/reports/vehicle-locations").then((r) => r.data),
  vehicleLocationReport: (vehicleId) =>
    apiClient.get(`/reports/vehicle-locations/${vehicleId}`).then((r) => r.data),
};
