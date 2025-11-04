import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem('authRole') || '');

  useEffect(() => {
    if (role) localStorage.setItem('authRole', role);
    else localStorage.removeItem('authRole');
  }, [role]);

  const login = (nextRole) => setRole(nextRole);
  const logout = () => setRole('');

  const value = useMemo(() => ({ role, isAuthenticated: Boolean(role), login, logout }), [role]);
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
