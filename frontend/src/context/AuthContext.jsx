import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../api/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
  const [registrationStep, setRegistrationStepState] = useState(
    Number(localStorage.getItem('registration_step') || '0')
  );

  const saveToken = useCallback((newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, []);

  const saveUser = useCallback((userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('auth_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, []);

  const loadUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await authService.me();
      saveUser(userData);
    } catch {
      saveToken(null);
      saveUser(null);
    } finally {
      setLoading(false);
    }
  }, [token, saveToken, saveUser]);

  useEffect(() => {
    const stored = localStorage.getItem('auth_user');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    loadUser();
  }, []);

  const setRegistrationStep = useCallback((step) => {
    setRegistrationStepState(step);
    localStorage.setItem('registration_step', String(step));
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password);
    saveToken(response.token);
    saveUser(response.user);
    return response;
  }, [saveToken, saveUser]);

  const register = useCallback(async (data) => {
    return await authService.register(data);
  }, []);

  const logout = useCallback(async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    saveToken(null);
    saveUser(null);
    setRegistrationStep(0);
  }, [saveToken, saveUser, setRegistrationStep]);

  const refreshProfile = useCallback(async () => {
    try {
      const userData = await authService.me();
      saveUser(userData);
      return userData;
    } catch { return null; }
  }, [saveUser]);

  const updateUser = useCallback((userData) => {
    saveUser(userData);
  }, [saveUser]);

  const role = user?.role || null;
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{
      user, token, loading, role, isAuthenticated,
      registrationStep, setRegistrationStep,
      login, register, logout, refreshProfile, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
