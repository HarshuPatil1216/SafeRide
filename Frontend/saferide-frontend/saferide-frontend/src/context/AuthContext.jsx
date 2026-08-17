import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { authApi } from "../api/auth";
import { TOKEN_KEY, registerUnauthorizedHandler } from "../api/client";

export const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem("saferide_user");
  return raw ? JSON.parse(raw) : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const [initializing, setInitializing] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("saferide_user");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(clearSession);
  }, [clearSession]);

  // On mount, if we have a token but no cached role, resolve it from
  // /api/users/authorities (the backend's login response has no user info).
  useEffect(() => {
    async function resolve() {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          clearSession();
          setInitializing(false);
          return;
        }

        if (!user) {
          const authorities = await authApi.getAuthorities();
          const roleAuthority = Array.isArray(authorities)
            ? authorities.find((a) => (a.authority || a).startsWith("ROLE_"))
            : null;
          const role = roleAuthority
            ? (roleAuthority.authority || roleAuthority).replace("ROLE_", "")
            : null;

          const resolvedUser = { email: decoded.sub, role };
          localStorage.setItem("saferide_user", JSON.stringify(resolvedUser));
          setUser(resolvedUser);
        }
      } catch {
        clearSession();
      } finally {
        setInitializing(false);
      }
    }

    resolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = useCallback(async (email, password) => {
    const { token: newToken } = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);

    const decoded = jwtDecode(newToken);
    const authorities = await authApi.getAuthorities();
    const roleAuthority = Array.isArray(authorities)
      ? authorities.find((a) => (a.authority || a).startsWith("ROLE_"))
      : null;
    const role = roleAuthority ? (roleAuthority.authority || roleAuthority).replace("ROLE_", "") : null;

    const resolvedUser = { email: decoded.sub, role };
    localStorage.setItem("saferide_user", JSON.stringify(resolvedUser));
    setUser(resolvedUser);
    return resolvedUser;
  }, []);

  const register = useCallback(async (payload) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      initializing,
      login,
      register,
      logout,
    }),
    [token, user, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
