import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Search, Filter, ChevronDown, ChevronUp, Download, Eye } from 'lucide-react';
import api from '../../../lib/api';

export function WithdrawalRequests() {
    const navigate = useNavigate();
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'datetime', direction: 'desc' });
    const [expandedRows, setExpandedRows] = useState([]);

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const fetchWithdrawals = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/wallet/withdrawal-requests');
            setWithdrawals(response.data.withdrawals || []);
        } catch (err) {
            setError('Failed to load withdrawal requests');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const toggleExpand = (id) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/admin/wallet/withdrawal-requests/${id}/approve`);
            fetchWithdrawals();
        } catch (err) {
            console.error('Failed to approve:', err);
        }
    };

    const handleReject = async (id) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            try {
                await api.put(`/admin/wallet/withdrawal-requests/${id}/reject`, { reason });
                fetchWithdrawals();
            } catch (err) {
                console.error('Failed to reject:', err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const downloadBankDetails = () => {
        const bankData = withdrawals
            .filter(w => w.bank_type)
            .map(w => ({
                Name: w.user_name,
                Email: w.user_email,
                BankType: w.bank_type,
                AccountNumber: w.beneficiary_account_number,
                BeneficiaryName: w.beneficiary_name,
                IFSC: w.ifsc_code,
                BankName: w.bene_bank_name,
                BranchName: w.bene_bank_branch_name
            }));

        const csv = [
            Object.keys(bankData[0] || {}).join(','),
            ...bankData.map(row => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bank_details.csv';
        a.click();
    };

    const filteredWithdrawals = withdrawals
        .filter(w =>
            w.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const aValue = a[sortConfig.key] || '';
            const bValue = b[sortConfig.key] || '';

            if (sortConfig.key === 'amount') {
                return sortConfig.direction === 'asc'
                    ? (aValue || 0) - (bValue || 0)
                    : (bValue || 0) - (aValue || 0);
            }

            if (sortConfig.key === 'datetime') {
                const aDate = new Date(aValue || 0);
                const bDate = new Date(bValue || 0);
                return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
            }

            return sortConfig.direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        });

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronDown size={14} className="opacity-30" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} style={{ color: 'var(--primary-cyan)' }} />
            : <ChevronDown size={14} style={{ color: 'var(--primary-cyan)' }} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)' }}>
                <p style={{ color: 'var(--error)' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <ArrowUpRight size={28} style={{ color: 'var(--warning)' }} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Withdrawal Requests</h2>
            </div>

            {/* Search and Table Container */}
            <div className="card overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                {/* Toolbar */}
                <div className="p-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div></div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={downloadBankDetails}
                            className="premium-btn premium-btn-accent"
                        >
                            <Download className="h-4 w-4" />
                            Download Bank Details
                        </button>
                        <button
                            className="p-2 rounded-lg transition-colors relative"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <Filter size={20} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center"
                                style={{ backgroundColor: 'var(--error)', color: 'white' }}>0</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th className="text-left px-4 py-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    User
                                </th>
                                <th className="text-left px-4 py-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Payment Method
                                </th>
                                <th className="text-left px-4 py-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Invoice number
                                </th>
                                <th
                                    className="text-left px-4 py-4 font-medium cursor-pointer"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onClick={() => handleSort('amount')}
                                >
                                    <div className="flex items-center gap-2">
                                        Amount
                                        <SortIcon column="amount" />
                                    </div>
                                </th>
                                <th className="text-left px-4 py-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                                    Datetime
                                </th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWithdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                                        No withdrawal requests found
                                    </td>
                                </tr>
                            ) : (
                                filteredWithdrawals.map((withdrawal) => (
                                    <React.Fragment key={withdrawal.id}>
                                        <tr
                                            className="hover:bg-opacity-50 transition-colors cursor-pointer"
                                            style={{ borderBottom: '1px solid var(--border)' }}
                                            onClick={() => toggleExpand(withdrawal.id)}
                                        >
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{withdrawal.user_name}</p>
                                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{withdrawal.user_email}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                {/* Priority: Check payment_method field first */}
                                                {(withdrawal.payment_method === 'bank' || withdrawal.payment_method?.includes('bank')) ? (
                                                    <div>
                                                        <span
                                                            className="px-2 py-1 rounded text-xs font-medium"
                                                            style={{
                                                                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                                                                color: 'rgb(249, 115, 22)',
                                                                border: '1px solid rgb(249, 115, 22)'
                                                            }}
                                                        >
                                                            Bank Details
                                                        </span>
                                                        <div className="mt-2 text-sm space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                                                            {withdrawal.bank_type && <p><strong>Bank Type:-</strong> {withdrawal.bank_type}</p>}
                                                            {withdrawal.beneficiary_account_number && <p><strong>Beneficiary Account Number:-</strong> {withdrawal.beneficiary_account_number}</p>}
                                                            {withdrawal.beneficiary_name && <p><strong>Beneficiary Name:-</strong> {withdrawal.beneficiary_name}</p>}
                                                            {withdrawal.customer_reference_number && <p><strong>Customer Reference Number:-</strong> {withdrawal.customer_reference_number}</p>}
                                                            {withdrawal.bene_bank_name && <p><strong>Beneficiary Bank Name:-</strong> {withdrawal.bene_bank_name}</p>}
                                                            {withdrawal.bene_bank_branch_name && <p><strong>Beneficiary Bank Branch Name:-</strong> {withdrawal.bene_bank_branch_name}</p>}
                                                            {withdrawal.ifsc_code && <p><strong>IFSC Code:-</strong> {withdrawal.ifsc_code}</p>}
                                                            {withdrawal.beneficiary_email_id && <p><strong>Beneficiary Email id:-</strong> {withdrawal.beneficiary_email_id}</p>}
                                                        </div>
                                                    </div>
                                                ) : withdrawal.payment_method === 'upi' ? (
                                                    <div>
                                                        <span
                                                            className="px-2 py-1 rounded text-xs font-medium"
                                                            style={{
                                                                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                                                color: 'rgb(168, 85, 247)',
                                                                border: '1px solid rgb(168, 85, 247)'
                                                            }}
                                                        >
                                                            UPI ID
                                                        </span>
                                                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                                            {withdrawal.upi_id || '-'}
                                                        </p>
                                                    </div>
                                                ) : withdrawal.payment_method === 'qr' ? (
                                                    <div>
                                                        <span
                                                            className="px-2 py-1 rounded text-xs font-medium"
                                                            style={{
                                                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                                                color: 'rgb(34, 197, 94)',
                                                                border: '1px solid rgb(34, 197, 94)'
                                                            }}
                                                        >
                                                            QR Code
                                                        </span>
                                                        {withdrawal.qr_code_image ? (
                                                            <img
                                                                src={(withdrawal.qr_code_image.startsWith('http') || withdrawal.qr_code_image.startsWith('data:')) ? withdrawal.qr_code_image : `http://localhost:5001${withdrawal.qr_code_image}`}
                                                                alt="QR Code"
                                                                className="mt-2 w-20 h-20 object-cover rounded border cursor-pointer hover:scale-150 transition-transform"
                                                                style={{ borderColor: 'var(--border)' }}
                                                                onClick={() => window.open((withdrawal.qr_code_image.startsWith('http') || withdrawal.qr_code_image.startsWith('data:')) ? withdrawal.qr_code_image : `http://localhost:5001${withdrawal.qr_code_image}`, '_blank')}
                                                            />
                                                        ) : (
                                                            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>No QR image</p>
                                                        )}
                                                    </div>
                                                ) : (withdrawal.payment_method === 'paypal' || withdrawal.payment_method === 'paypal_id' || withdrawal.paypal_email) ? (
                                                    <div>
                                                        <span
                                                            className="px-2 py-1 rounded text-xs font-medium"
                                                            style={{
                                                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                                                color: 'rgb(59, 130, 246)',
                                                                border: '1px solid rgb(59, 130, 246)'
                                                            }}
                                                        >
                                                            Paypal ID
                                                        </span>
                                                        <p className="text-sm mt-1 break-all" style={{ color: 'var(--text-secondary)' }}>
                                                            {withdrawal.paypal_email || '-'}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4" style={{ color: 'var(--text-primary)' }}>
                                                {withdrawal.invoice_number}
                                            </td>
                                            <td className="px-4 py-4" style={{ color: 'var(--text-primary)' }}>
                                                {withdrawal.amount}
                                            </td>
                                            <td className="px-4 py-4" style={{ color: 'var(--text-primary)' }}>
                                                {formatDate(withdrawal.datetime)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/wallet/withdrawal-requests/${withdrawal.id}`);
                                                    }}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                                                    style={{ backgroundColor: 'var(--warning)', color: 'white' }}
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
