import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
const AdminRoutes = lazy(() => import('./admin/App.jsx').then(m => ({ default: m.AdminRoutes || m.default })));
const ManagerRoutes = lazy(() => import('./manager/App.jsx').then(m => ({ default: m.ManagerRoutes || m.default })));
const TeamsApp = lazy(() => import('./teams/App.jsx').then(m => ({ default: m.App || m.default })));
const BloggerRoutes = lazy(() => import('./blogger/App.jsx').then(m => ({ default: m.BloggerRoutes || m.default })));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-white p-6">Loading...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/blogger/*" element={<BloggerRoutes />} />
          <Route path="/manager/*" element={<ManagerRoutes />} />
          <Route path="/teams" element={<TeamsApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
