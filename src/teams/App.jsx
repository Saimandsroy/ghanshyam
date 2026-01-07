import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './components/Dashboard';

import { CompletedOrders } from './pages/CompletedOrders.jsx';
import { CompletedOrderDetail } from './pages/CompletedOrderDetail.jsx';
import { OrderNotifications } from './pages/OrderNotifications.jsx';
import { RejectedLinks } from './pages/RejectedLinks.jsx';
import { NewSites } from './pages/NewSites.jsx';
import { Threads } from './pages/Threads.jsx';
import { PushToManager } from './pages/PushToManager.jsx';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="completed-orders" element={<CompletedOrders />} />
        <Route path="completed-orders/:id/detail" element={<CompletedOrderDetail />} />
        <Route path="order-notifications" element={<OrderNotifications />} />
        <Route path="order-notifications/push/:id" element={<PushToManager />} />
        <Route path="rejected-links" element={<RejectedLinks />} />
        <Route path="new-sites" element={<NewSites />} />
        <Route path="threads" element={<Threads />} />
      </Route>
    </Routes>
  );
}