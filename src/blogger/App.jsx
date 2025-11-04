import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export function BloggerRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
    </Routes>
  );
}
