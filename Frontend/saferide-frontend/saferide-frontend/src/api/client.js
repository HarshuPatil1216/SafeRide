import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

export const TOKEN_KEY = "saferide_token";

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalizes every backend error shape (ApiErrorResponse, validation-errors map,
// Spring default error body, network failure) into { status, message, fieldErrors }
function normalizeError(error) {
  if (!error.response) {
    return {
      status: 0,
      message: "Can't reach the SafeRide server. Check your connection and that the backend is running.",
      fieldErrors: null,
    };
  }

  const { status, data } = error.response;

  // Bean validation errors: { messages: { field: msg } }
  if (data && data.messages && typeof data.messages === "object") {
    const firstMessage = Object.values(data.messages)[0];
    return { status, message: firstMessage || "Please check the form and try again.", fieldErrors: data.messages };
  }

  // ApiErrorResponse: { message }
  if (data && data.message) {
    return { status, message: data.message, fieldErrors: null };
  }

  if (status === 401) return { status, message: "Your session has expired. Please sign in again.", fieldErrors: null };
  if (status === 403) return { status, message: "You don't have permission to do that.", fieldErrors: null };
  if (status === 404) return { status, message: "We couldn't find that.", fieldErrors: null };
  if (status >= 500) return { status, message: "Something went wrong on the server. Please try again.", fieldErrors: null };

  return { status, message: "Something went wrong. Please try again.", fieldErrors: null };
}

let onUnauthorized = null;
export function registerUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeError(error);
    if (normalized.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(normalized);
  }
);

export default apiClient;
