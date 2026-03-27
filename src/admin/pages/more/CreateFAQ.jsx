import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { RichTextEditor } from '../../../components/RichTextEditor';
import { useAutoSaveForm, AutoSaveIndicator } from '../../../hooks/useAutoSave';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export function CreateFAQ() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Auto-save form state
    const { formData: form, setFormData: setForm, clearAllSaved, isSaved } = useAutoSaveForm('admin-create-faq', {
        question: '',
        answer: '',
        is_active: true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (createAnother = false) => {
        if (!form.question || !form.answer) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/admin/faqs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('FAQ created successfully!');
                if (createAnother) {
                    setForm({ question: '', answer: '', is_active: true });
                } else {
                    navigate('/admin/more/faqs');
                }
            } else {
                toast.error(data.message || 'Failed to create FAQ');
            }
        } catch (error) {
            toast.error('Failed to create FAQ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Breadcrumb */}
            <div className="mb-2 text-sm text-[var(--text-muted)]">
                <Link to="/admin/more/faqs" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">Faqs</Link>
                {' > '} Create
            </div>

            {/* Header */}
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                Create Faq
            </h1>

            {/* Form Card */}
            <div className="bg-[var(--card-background)] border border-[var(--border)] rounded-xl p-6">
                <h3 className="mb-6 text-[var(--text-primary)] text-base font-medium">
                    Add New Faq
                </h3>

                {/* Form Fields */}
                <div className="mb-5">
                    <RichTextEditor
                        label="Question"
                        value={form.question}
                        onChange={(value) => setForm({ ...form, question: value })}
                        placeholder="Enter the FAQ question..."
                        required={true}
                    />
                </div>

                <div className="mb-6">
                    <RichTextEditor
                        label="Answer"
                        value={form.answer}
                        onChange={(value) => setForm({ ...form, answer: value })}
                        placeholder="Enter the FAQ answer..."
                        required={true}
                    />
                </div>

                {/* Active Toggle */}
                <div className="mb-8">
                    <label className="flex items-center gap-3 cursor-pointer w-max">
                        <div className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? 'bg-amber-500' : 'bg-gray-600'}`}>
                            <div className={`absolute top-[2px] w-5 h-5 rounded-full bg-white transition-all ${form.is_active ? 'left-[22px]' : 'left-[2px]'}`} />
                        </div>
                        <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="hidden" />
                        <span className="text-[var(--text-primary)] text-sm">
                            Active<span className="text-red-500">*</span>
                        </span>
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                        className="px-5 py-2.5 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                        Create
                    </button>
                    <button
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                        className="px-5 py-2.5 bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg font-medium text-sm hover:bg-white/5 disabled:opacity-50 transition-colors"
                    >
                        Create & create another
                    </button>
                    <Link
                        to="/admin/more/faqs"
                        className="px-5 py-2.5 bg-[var(--background)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg font-medium text-sm hover:bg-white/5 transition-colors text-center block"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}
