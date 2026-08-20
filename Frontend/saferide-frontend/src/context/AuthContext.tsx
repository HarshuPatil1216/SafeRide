import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthResponse, LoginRequest, User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isDriver: boolean;
  isParent: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  setDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [token, setToken] = useState<string | null>(() => authService.getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial verify
    const storedToken = authService.getStoredToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setIsLoading(false);

    // Event listener for 401 token expiry
    const handleAuthExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('saferide:auth-expired', handleAuthExpired);
    return () => {
      window.removeEventListener('saferide:auth-expired', handleAuthExpired);
    };
  }, []);

  const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const loggedUser: User = {
        id: response.id,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        phone: response.phone,
        driverId: response.driverId,
        parentId: response.parentId
      };
      setToken(response.token);
      setUser(loggedUser);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('saferide_user_data', JSON.stringify(updated));
  };

  // Helper for quick role simulation if backend is not seeded yet
  const setDemoUser = (role: UserRole) => {
    const demoUser: User = {
      id: 101,
      email: `${role.toLowerCase()}@saferide.school`,
      firstName: role === UserRole.ADMIN || role === UserRole.ROLE_ADMIN ? 'Sarah' : role === UserRole.DRIVER || role === UserRole.ROLE_DRIVER ? 'Marcus' : 'Elena',
      lastName: role === UserRole.ADMIN || role === UserRole.ROLE_ADMIN ? 'Admin' : role === UserRole.DRIVER || role === UserRole.ROLE_DRIVER ? 'Jenkins' : 'Vance',
      role: role,
      phone: '+1 (555) 234-5678',
      driverId: role === UserRole.DRIVER || role === UserRole.ROLE_DRIVER ? 1 : undefined,
      parentId: role === UserRole.PARENT || role === UserRole.ROLE_PARENT ? 1 : undefined
    };
    const demoToken = 'demo-jwt-token-saferide-' + Date.now();
    localStorage.setItem('saferide_jwt_token', demoToken);
    localStorage.setItem('saferide_user_data', JSON.stringify(demoUser));
    setToken(demoToken);
    setUser(demoUser);
  };

  const roleStr = user?.role ? String(user.role).toUpperCase() : '';
  const isAdmin = roleStr === 'ROLE_ADMIN' || roleStr === 'ADMIN';
  const isDriver = roleStr === 'ROLE_DRIVER' || roleStr === 'DRIVER';
  const isParent = roleStr === 'ROLE_PARENT' || roleStr === 'PARENT';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isAdmin,
        isDriver,
        isParent,
        login,
        logout,
        updateUser,
        setDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
