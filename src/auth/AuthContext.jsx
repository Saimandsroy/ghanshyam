import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authAPI } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('authUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('authRole') || '');
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role) localStorage.setItem('authRole', role);
    else localStorage.removeItem('authRole');
  }, [role]);

  useEffect(() => {
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('authUser', JSON.stringify(user));
    else localStorage.removeItem('authUser');
  }, [user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authAPI.login(email, password);

      // Store token and user data
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);

      return { success: true, role: data.user.role };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    setRole('');
    setError(null);
  };

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (token && !user) {
        try {
          const data = await authAPI.getCurrentUser();
          setUser(data.user);
          setRole(data.user.role);
        } catch (err) {
          // Token invalid, clear everything
          logout();
        }
      }
    };
    validateToken();
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      loading,
      error
    }),
    [user, role, token, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function RequireAuth({ roles = [], children }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles.length && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
