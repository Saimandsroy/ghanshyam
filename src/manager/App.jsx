import React from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CreateOrder } from './pages/orders/CreateOrder.jsx';
import { ViewOrders } from './pages/orders/ViewOrders.jsx';
import { PendingFromBloggers } from './pages/orders/PendingFromBloggers.jsx';
import { PendingBloggers } from './pages/pending/Bloggers.jsx';
import { PendingTeams } from './pages/pending/Teams.jsx';
import { PendingWriters } from './pages/pending/Writers.jsx';
import { RejectedBloggers } from './pages/rejected/Bloggers.jsx';
import { Threads } from './pages/Threads.jsx';
import { Sites } from './pages/Sites.jsx';

export function ManagerRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      {/* Orders */}
      <Route path="orders" element={<ViewOrders />} />
      <Route path="orders/view" element={<ViewOrders />} />
      <Route path="orders/create" element={<CreateOrder />} />
      <Route path="orders/pending-bloggers" element={<PendingFromBloggers />} />
      {/* Pending Approval */}
      <Route path="pending/bloggers" element={<PendingBloggers />} />
      <Route path="pending/writers" element={<PendingWriters />} />
      <Route path="pending/teams" element={<PendingTeams />} />
      {/* Rejected Orders */}
      <Route path="rejected/bloggers" element={<RejectedBloggers />} />
      {/* Threads & Sites */}
      <Route path="threads" element={<Threads />} />
      <Route path="sites" element={<Sites />} />
    </Routes>
  );
}