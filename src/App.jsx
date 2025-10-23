import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BloggerDashboard } from './pages/BloggerDashboard';
import { Dashboard as ManagerDashboard } from './manager/pages/Dashboard.jsx';
import { Orders as ManagerOrders } from './manager/pages/Orders.jsx';
import './manager/index.css';
import { App as TeamsApp } from './teams/App.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/blogger" element={<BloggerDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/orders" element={<ManagerOrders />} />
        <Route path="/teams" element={<TeamsApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
