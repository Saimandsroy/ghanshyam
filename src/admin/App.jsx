import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from './layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Reporting from './pages/Reporting';
import Orders from './pages/Orders';
import PriceCharts from './pages/PriceCharts';
import Bloggers from './pages/Bloggers';

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="reporting" element={<Reporting />} />
        <Route path="orders" element={<Orders />} />
        <Route path="price-charts" element={<PriceCharts />} />
        <Route path="bloggers" element={<Bloggers />} />
      </Route>
    </Routes>
  );
}
