import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Storage keys
export const TOKEN_KEY = 'saferide_jwt_token';
export const USER_KEY = 'saferide_user_data';
export const CUSTOM_API_URL_KEY = 'saferide_custom_api_url';

export const getBaseApiUrl = (): string => {
  const customUrl = localStorage.getItem(CUSTOM_API_URL_KEY);
  if (customUrl) return customUrl;
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
};

// Create Axios Instance
export const apiClient = axios.create({
  baseURL: getBaseApiUrl(),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Dynamic Base URL check in case it was updated
    config.baseURL = getBaseApiUrl();

    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Error Handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string; errors?: Record<string, string> | string[]; status?: number }>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // Token expired or invalid
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.dispatchEvent(new CustomEvent('saferide:auth-expired'));
      }

      // Extract user friendly message from Spring Boot error structure
      let errorMsg = 'An unexpected server error occurred';
      if (data) {
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (Array.isArray(data.errors) && data.errors.length > 0) {
          errorMsg = data.errors.join(', ');
        } else if (data.errors && typeof data.errors === 'object') {
          errorMsg = Object.values(data.errors).join(', ');
        }
      }

      const enhancedError = new Error(errorMsg);
      (enhancedError as unknown as { status?: number; response?: unknown }).status = status;
      (enhancedError as unknown as { status?: number; response?: unknown }).response = error.response;
      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Network or CORS error
      const netError = new Error(
        `Unable to reach backend at ${getBaseApiUrl()}. Please verify that your Spring Boot server is running and CORS is enabled.`
      );
      return Promise.reject(netError);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
