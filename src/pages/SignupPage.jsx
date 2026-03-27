import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../lib/api';

/**
 * SignupPage - Blogger Registration
 * Official signup page for new blogger users (ATLAS Styled)
 */
export function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    whatsapp: '',
    skype: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Validation (Simplified for brevity, but kept functional) ---
    if (!formData.name || formData.name.trim().length < 2) return setError('Name is required');
    if (!formData.email || !formData.email.includes('@')) return setError('Invalid email address');
    if (!formData.password || formData.password.length < 8) return setError('Password too short (min 8 chars)');
    if (formData.password !== formData.confirm_password) return setError('Passwords do not match');
    if (!formData.whatsapp) return setError('WhatsApp number is required');
    if (!formData.skype) return setError('Skype ID is required');

    try {
      setLoading(true);
      await api.post('/auth/register', formData);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans text-slate-900">

      {/* --- Soft Premium Ambient Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60 overflow-hidden">
        <div className="absolute top-0 right-0 md:right-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-50 blur-[80px] md:blur-[120px] rounded-full mix-blend-multiply"></div>
        <div className="absolute bottom-1/4 left-0 md:left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-orange-50 blur-[70px] md:blur-[100px] rounded-full mix-blend-multiply"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-50/50 blur-[100px] md:blur-[150px] rounded-full mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">

        {/* Brand Header */}
        {/* Brand Header */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="w-14 h-14 relative overflow-hidden rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-[#F97316]/40 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-300">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[250%] max-w-none absolute left-0 top-1/2 -translate-y-1/2 object-cover"
                style={{ objectPosition: 'left center' }}
              />
            </div>
            <span className="font-bold text-3xl tracking-tight text-slate-900">Link Management</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-slate-900">Create Account</h1>
          <p className="text-slate-500 text-lg">Join the exclusive network of premium publishers</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-6 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl relative overflow-visible min-h-[600px]">

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F97316] transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316]/50 focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F97316] transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316]/50 focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2">WhatsApp</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F97316] transition-colors" />
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316]/50 focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 transition-all duration-300"
                    placeholder="+1 234..."
                  />
                </div>
              </div>

              {/* Skype */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2">Skype ID</label>
                <div className="relative group">
                  <MessageCircle className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F97316] transition-colors" />
                  <input
                    type="text"
                    name="skype"
                    value={formData.skype}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316]/50 focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 transition-all duration-300"
                    placeholder="live:skype"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2">Password</label>
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
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-900 transition-colors"><Eye className="h-4 w-4" /></button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-wider mb-2">Confirm</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-[#F97316] transition-colors" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-12 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#F97316]/50 focus:bg-white focus:ring-4 focus:ring-[#F97316]/10 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-900 transition-colors"><Eye className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F97316] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#EA580C] active:scale-[0.98] transition-all duration-200 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:opacity-50 disabled:cursor-not-allowed mt-4 group"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-500 font-medium text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-900 hover:text-[#F97316] font-bold transition-colors">Sign in here</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 text-slate-400 font-medium text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure Registration</span>
        </div>

      </div>
    </div>
  );
}

