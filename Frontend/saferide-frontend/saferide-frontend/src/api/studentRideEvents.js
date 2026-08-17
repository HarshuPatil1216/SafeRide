import apiClient from "./client";

export const studentRideEventsApi = {
  create: (payload) => apiClient.post("/student-ride-events", payload).then((r) => r.data),
  getById: (id) => apiClient.get(`/student-ride-events/${id}`).then((r) => r.data),
  byStudent: (studentId, { page = 0, size = 20 } = {}) =>
    apiClient.get(`/student-ride-events/student/${studentId}`, { params: { page, size } }).then((r) => r.data),
  byRide: (rideId, { page = 0, size = 20 } = {}) =>
    apiClient.get(`/student-ride-events/ride/${rideId}`, { params: { page, size } }).then((r) => r.data),
};
