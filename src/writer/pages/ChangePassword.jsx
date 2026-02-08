import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export function ChangePassword() {
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [saving, setSaving] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.old_password) {
            newErrors.old_password = 'Current password is required';
        }
        if (!formData.new_password) {
            newErrors.new_password = 'New password is required';
        } else if (formData.new_password.length < 8) {
            newErrors.new_password = 'New password must be at least 8 characters';
        }
        if (!formData.confirm_password) {
            newErrors.confirm_password = 'Please confirm your new password';
        } else if (formData.new_password !== formData.confirm_password) {
            newErrors.confirm_password = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setSaving(true);
            await authAPI.changePassword(formData);
            showSuccess('Password changed successfully');
            navigate('/writer/profile');
        } catch (error) {
            console.error('Error changing password:', error);
            showError(error.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-fadeIn max-w-md mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/writer/profile')}
                    className="p-2.5 rounded-xl hover:bg-[var(--card-background)] border border-transparent hover:border-[var(--border)] transition-all text-[var(--text-secondary)]"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Change Password
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="bg-[var(--card-background)] rounded-2xl border border-[var(--border)] shadow-sm">
                    <div className="px-6 py-4 border-b border-[var(--border)] font-medium text-[var(--text-secondary)] uppercase tracking-wider text-xs flex items-center gap-2">
                        <Key className="h-4 w-4 text-[var(--primary-cyan)]" />
                        Update Password
                    </div>
                    <div className="p-6 space-y-5">
                        {/* Old Password */}
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                                Current Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showOldPassword ? 'text' : 'password'}
                                    name="old_password"
                                    value={formData.old_password}
                                    onChange={handleChange}
                                    className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-cyan)] transition-colors pr-12 ${errors.old_password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    placeholder="Enter your current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.old_password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.old_password}</p>}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                                New Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-cyan)] transition-colors pr-12 ${errors.new_password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.new_password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.new_password}</p>}
                            <p className="text-[10px] uppercase tracking-wide mt-1.5 text-[var(--text-secondary)]">
                                Must be at least 8 characters
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase mb-2">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className={`w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-cyan)] transition-colors pr-12 ${errors.confirm_password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.confirm_password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirm_password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-[var(--primary-cyan)] text-black font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-black/20 border-t-black"></div>
                                    Changing Password...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Change Password
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
