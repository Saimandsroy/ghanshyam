import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ManagerRoutes } from './manager/App.jsx';
import { App as TeamsApp } from './teams/App.jsx';
import { AdminLayout } from './admin/Layout.jsx';
import { Dashboard as AdminDashboard } from './admin/pages/Dashboard.jsx';
import { ReportingLayout as AdminReportingLayout } from './admin/pages/reports/ReportingLayout.jsx';
import { Orders as AdminOrders } from './admin/pages/Orders.jsx';
import { PriceCharts as AdminPriceCharts } from './admin/pages/PriceCharts.jsx';
import { Bloggers as AdminBloggers } from './admin/pages/Bloggers.jsx';
import { TeamMembers as AdminTeamMembers } from './admin/pages/TeamMembers.jsx';
import { BloggerLayout } from './blogger/Layout.jsx';
import { Dashboard as BloggerDashboard } from './blogger/pages/Dashboard.jsx';
import { Orders as BloggerOrders } from './blogger/pages/Orders.jsx';
import { Wallet as BloggerWallet } from './blogger/pages/Wallet.jsx';
import { Threads as BloggerThreads } from './blogger/pages/Threads.jsx';
import { Reports as BloggerReports } from './blogger/pages/Reports.jsx';
import { Settings as BloggerSettings } from './blogger/pages/Settings.jsx';
import { WriterLayout } from './writer/Layout.jsx';
import { Dashboard as WriterDashboard } from './writer/pages/Dashboard.jsx';
import { CompletedOrders as WriterCompleted } from './writer/pages/CompletedOrders.jsx';
import { AccountantLayout } from './accountant/Layout.jsx';
import { Payments as AccountantPayments } from './accountant/pages/Payments.jsx';
import { RequireAuth } from './auth/AuthContext.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="reporting/*" element={<AdminReportingLayout />} />
          <Route path="bloggers" element={<AdminBloggers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="price-charts" element={<AdminPriceCharts />} />
          <Route path="team-members" element={<AdminTeamMembers />} />
        </Route>
        <Route path="/blogger" element={<BloggerLayout />}>
          <Route index element={<BloggerDashboard />} />
          <Route path="orders" element={<BloggerOrders />} />
          <Route path="wallet" element={<BloggerWallet />} />
          <Route path="threads" element={<BloggerThreads />} />
          <Route path="reports" element={<BloggerReports />} />
          <Route path="settings" element={<BloggerSettings />} />
        </Route>
        <Route path="/writer" element={<WriterLayout />}>
          <Route index element={<WriterDashboard />} />
          <Route path="completed-orders" element={<WriterCompleted />} />
        </Route>
        <Route path="/accountant" element={<AccountantLayout />}>
          <Route index element={<AccountantPayments />} />
        </Route>
        <Route path="/manager/*" element={<ManagerRoutes />} />
        <Route path="/teams/*" element={<TeamsApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
