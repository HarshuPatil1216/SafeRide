import apiClient, { TOKEN_KEY, USER_KEY } from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { AuthResponse, LoginRequest, User } from '../types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
      if (response.data?.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch (err: unknown) {
      // Fallback try to /auth/signin if /auth/login 404s
      const status = (err as { status?: number })?.status;
      if (status === 404) {
        const fallbackRes = await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.SIGNIN, credentials);
        if (fallbackRes.data?.token) {
          localStorage.setItem(TOKEN_KEY, fallbackRes.data.token);
          localStorage.setItem(USER_KEY, JSON.stringify(fallbackRes.data));
        }
        return fallbackRes.data;
      }
      throw err;
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(ENDPOINTS.AUTH.ME);
    return response.data;
  },

  async changePassword(dto: { currentPassword?: string; newPassword?: string; oldPassword?: string }): Promise<void> {
    await apiClient.post('/auth/change-password', dto);
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
