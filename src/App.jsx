import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { BloggerDashboard } from './pages/BloggerDashboard';
import { ManagerRoutes } from './manager/App.jsx';
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
        <Route path="/manager/*" element={<ManagerRoutes />} />
        <Route path="/teams" element={<TeamsApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
