import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../auth/AuthContext.jsx';

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      // Basic validation handled by 'required' formatting usually, but good to have
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      const routeMap = {
        Admin: '/admin',
        admin: '/admin',
        Blogger: '/blogger',
        vendor: '/blogger',
        Manager: '/manager',
        manager: '/manager',
        Team: '/teams',
        team: '/teams',
        Writer: '/writer',
        writer: '/writer',
        Accountant: '/accountant',
        super_admin: '/admin'
      };
      navigate(routeMap[result.role] || '/');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 relative overflow-hidden font-sans text-slate-900">

      {/* --- Soft Premium Ambient Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60 overflow-hidden">
        <div className="absolute top-0 right-0 md:right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-50 blur-[80px] md:blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 left-0 md:left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-orange-50 blur-[70px] md:blur-[100px] rounded-full mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-50/50 blur-[100px] md:blur-[150px] rounded-full mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 w-full max-w-[520px]">

        {/* Brand Header */}
        {/* Brand Header */}
        <div className="text-center mb-12">
          <a href="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="w-14 h-14 relative overflow-hidden rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-[#F97316]/40 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[250%] max-w-none absolute left-0 top-1/2 -translate-y-1/2 object-cover"
                style={{ objectPosition: 'left center' }}
              />
            </div>
            <span className="font-bold text-3xl tracking-tight text-slate-900">Link Management</span>
          </a>
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 text-lg">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl relative overflow-hidden min-h-[500px]">

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F97316] transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316]/50 focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 transition-all duration-300"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-500 tracking-wider">Password</label>
                <a href="#" className="text-xs font-medium text-slate-500 hover:text-[#F97316] transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F97316] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316]/50 focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F97316] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#EA580C] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 font-medium text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-slate-900 hover:text-[#F97316] font-bold transition-colors">Create one</a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 text-slate-400 font-medium text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure SSL Encryption</span>
        </div>

      </div>
    </div>
  );
}

