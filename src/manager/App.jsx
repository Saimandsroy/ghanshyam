import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Orders } from './pages/Orders';

export function ManagerRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="orders" element={<Orders />} />
    </Routes>
  );
}