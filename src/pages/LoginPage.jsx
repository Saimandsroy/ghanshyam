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
        Blogger: '/blogger',
        Manager: '/manager',
        Team: '/teams',
        Writer: '/writer',
        Accountant: '/accountant'
      };
      navigate(routeMap[result.role] || '/');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden font-sans text-white">

      {/* --- Background Effects --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF8C42]/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Brand Header */}
        <div className="text-center mb-10">
          <a href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 rotate-45 bg-[#FF8C42] rounded-[8px] flex items-center justify-center shadow-[0_0_20px_rgba(255,140,66,0.3)] group-hover:rotate-90 transition-transform duration-500">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="font-semibold text-2xl tracking-tight text-white">LinkMag</span>
          </a>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-[#888]">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">

          {/* Top Border Gradient */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF8C42]/50 to-transparent"></div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-[#666] uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#444] group-focus-within:text-[#FF8C42] transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-[#444] focus:outline-none focus:border-[#FF8C42]/50 focus:bg-[#151515] transition-all duration-300"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-mono text-[#666] uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-[#888] hover:text-[#FF8C42] transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-[#444] group-focus-within:text-[#FF8C42] transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#111] border border-white/5 rounded-xl py-3 pl-12 pr-12 text-white placeholder-[#444] focus:outline-none focus:border-[#FF8C42]/50 focus:bg-[#151515] transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-[#444] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8C42] text-black font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#ff9d5e] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(255,140,66,0.2)] hover:shadow-[0_0_30px_rgba(255,140,66,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-[#666] text-sm">
              Don't have an account?{' '}
              <a href="/signup" className="text-white hover:text-[#FF8C42] font-medium transition-colors">Create one</a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 text-[#444] text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure SSL Encryption</span>
        </div>

      </div>
    </div>
  );
}

