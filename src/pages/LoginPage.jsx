import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('blogger');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo logic - in real app, this would authenticate with backend
    if (formData.email && formData.password) {
      if (userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/blogger');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1724] flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#2D1066] rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6BF0FF] rounded-full opacity-20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#4E2C93] rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6BF0FF] to-[#3ED9EB] rounded-2xl mb-4 shadow-lg shadow-[#6BF0FF]/30">
            <User className="w-8 h-8 text-[#0F1724]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-[#D1D5DB]">Sign in to your Link Management account</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1A2233] border border-[#2C3445] rounded-2xl p-8 shadow-xl">
          {/* User Type Selection */}
          <div className="flex bg-[#0F1724] rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setUserType('blogger')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === 'blogger'
                  ? 'bg-[#6BF0FF] text-[#0F1724] shadow-md'
                  : 'text-[#D1D5DB] hover:text-white'
              }`}
            >
              Blogger
            </button>
            <button
              type="button"
              onClick={() => setUserType('admin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                userType === 'admin'
                  ? 'bg-[#6BF0FF] text-[#0F1724] shadow-md'
                  : 'text-[#D1D5DB] hover:text-white'
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#9AA4B2]" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-[#0F1724] border border-[#2C3445] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent text-white placeholder-[#9AA4B2] transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#D1D5DB] mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#9AA4B2]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-12 py-3 bg-[#0F1724] border border-[#2C3445] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6BF0FF] focus:border-transparent text-white placeholder-[#9AA4B2] transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-[#9AA4B2] hover:text-[#6BF0FF] transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#6BF0FF] bg-[#0F1724] border-[#2C3445] rounded focus:ring-[#6BF0FF] focus:ring-2"
                />
                <span className="ml-2 text-sm text-[#D1D5DB]">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#6BF0FF] hover:text-[#3ED9EB] transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#6BF0FF] hover:bg-[#3ED9EB] text-[#0F1724] font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(107,240,255,0.5)]"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-[#D1D5DB]">
              Don't have an account?{' '}
              <a href="/signup" className="text-[#6BF0FF] hover:text-[#3ED9EB] font-medium transition-colors">
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Demo Note */}
        <div className="mt-6 p-4 bg-[#1A2233]/50 border border-[#2C3445] rounded-lg">
          <p className="text-sm text-[#9AA4B2] text-center">
            <strong className="text-[#6BF0FF]">Demo Mode:</strong> Enter any email and password to access the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
