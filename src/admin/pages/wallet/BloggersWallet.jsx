import React, { useState, useEffect } from 'react';
import { Wallet, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../../lib/api';

export function BloggersWallet() {
    const [bloggers, setBloggers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'wallet_balance', direction: 'desc' });

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchBloggers();
    }, [page, limit, sortConfig]);

    const fetchBloggers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/wallet/bloggers', {
                params: {
                    page,
                    limit,
                    sort_by: sortConfig.key,
                    sort_order: sortConfig.direction
                }
            });
            setBloggers(response.data.bloggers || []);
            setTotal(response.data.total || 0);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError('Failed to load bloggers wallet data');
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
        setPage(1); // Reset to first page on sort
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e?.preventDefault();
        setPage(1);
        try {
            setLoading(true);
            const response = await api.get('/admin/wallet/bloggers', {
                params: {
                    page: 1,
                    limit,
                    search: searchTerm,
                    sort_by: sortConfig.key,
                    sort_order: sortConfig.direction
                }
            });
            setBloggers(response.data.bloggers || []);
            setTotal(response.data.total || 0);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <ChevronDown size={14} className="opacity-30" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} style={{ color: 'var(--primary-cyan)' }} />
            : <ChevronDown size={14} style={{ color: 'var(--primary-cyan)' }} />;
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, page - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

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
                <Wallet size={28} style={{ color: 'var(--primary-cyan)' }} />
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Bloggers Wallet</h2>
                <span className="ml-2 px-3 py-1 rounded-full text-sm" style={{ backgroundColor: 'var(--primary-cyan)', color: 'white' }}>
                    {total} total
                </span>
            </div>

            {/* Search and Table Container */}
            <div className="card overflow-hidden" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
                {/* Toolbar */}
                <div className="p-4 flex justify-between items-center flex-wrap gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-muted)' }}>Show:</span>
                        {[50, 100, 200].map((rowCount) => (
                            <button
                                key={rowCount}
                                onClick={() => handleLimitChange(rowCount)}
                                className="px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                style={{
                                    backgroundColor: limit === rowCount ? 'var(--primary-cyan)' : 'var(--background-dark)',
                                    color: limit === rowCount ? 'white' : 'var(--text-secondary)',
                                    border: '1px solid var(--border)'
                                }}
                            >
                                {rowCount}
                            </button>
                        ))}
                        <span style={{ color: 'var(--text-muted)' }}>rows</span>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchTerm}
                            onChange={handleSearch}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            className="pl-10 pr-4 py-2 rounded-lg w-64"
                            style={{
                                backgroundColor: 'var(--background-dark)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </form>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th
                                    className="text-left px-6 py-4 font-medium cursor-pointer hover:bg-opacity-50"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Name
                                        <SortIcon column="name" />
                                    </div>
                                </th>
                                <th
                                    className="text-left px-6 py-4 font-medium cursor-pointer hover:bg-opacity-50"
                                    style={{ color: 'var(--text-secondary)' }}
                                    onClick={() => handleSort('wallet_balance')}
                                >
                                    <div className="flex items-center gap-2">
                                        Wallet Balance
                                        <SortIcon column="wallet_balance" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--primary-cyan)' }}></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : bloggers.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                                        No bloggers found
                                    </td>
                                </tr>
                            ) : (
                                bloggers.map((blogger) => (
                                    <tr
                                        key={blogger.id}
                                        className="hover:bg-opacity-50 transition-colors"
                                        style={{ borderBottom: '1px solid var(--border)' }}
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{blogger.name}</p>
                                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{blogger.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className="font-medium"
                                                style={{ color: blogger.wallet_balance > 0 ? 'var(--success)' : 'var(--text-muted)' }}
                                            >
                                                {blogger.wallet_balance}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex justify-between items-center flex-wrap gap-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} bloggers
                    </div>

                    <div className="flex items-center gap-2">
                        {/* First page */}
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={page === 1}
                            className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                            style={{
                                backgroundColor: 'var(--background-dark)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <ChevronLeft size={16} />
                            <ChevronLeft size={16} className="-ml-2" />
                        </button>

                        {/* Previous */}
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                            style={{
                                backgroundColor: 'var(--background-dark)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* Page numbers */}
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className="px-3 py-2 rounded-lg transition-colors min-w-[40px]"
                                style={{
                                    backgroundColor: page === pageNum ? 'var(--primary-cyan)' : 'var(--background-dark)',
                                    color: page === pageNum ? 'white' : 'var(--text-secondary)',
                                    border: '1px solid var(--border)'
                                }}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Next */}
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                            className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                            style={{
                                backgroundColor: 'var(--background-dark)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <ChevronRight size={16} />
                        </button>

                        {/* Last page */}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={page === totalPages}
                            className="px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                            style={{
                                backgroundColor: 'var(--background-dark)',
                                border: '1px solid var(--border)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <ChevronRight size={16} />
                            <ChevronRight size={16} className="-ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
