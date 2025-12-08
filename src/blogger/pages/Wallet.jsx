import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { RefreshCw, Wallet as WalletIcon, ArrowDownToLine } from 'lucide-react';
import { Pagination } from '../../components/Pagination.jsx';
import { bloggerAPI } from '../../lib/api';
import {
  WalletSummary,
  TransactionsTable,
  WithdrawalModal
} from '../components';

/**
 * Wallet Page - Displays blogger's wallet, transactions, and withdrawal functionality
 * Integrated with backend API for real data
 */
export function Wallet() {
  // State for data
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '' });

  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // State for withdrawal modal
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch wallet data
  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch wallet and withdrawals in parallel
      const [walletResponse, withdrawalsResponse] = await Promise.all([
        bloggerAPI.getWallet(),
        bloggerAPI.getWithdrawals()
      ]);

      setWallet(walletResponse);
      setWithdrawals(withdrawalsResponse.withdrawals || []);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // Combine transactions and withdrawals for display
  const allTransactions = useMemo(() => {
    const transactions = wallet?.transactions || [];

    // Convert withdrawals to transaction format
    const withdrawalTransactions = withdrawals.map(w => ({
      id: `W-${w.id}`,
      transaction_type: 'DEBIT',
      type: 'withdrawal',
      amount: w.amount,
      status: w.status,
      created_at: w.created_at,
      description: 'Withdrawal Request'
    }));

    // Combine and sort by date
    return [...transactions, ...withdrawalTransactions].sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );
  }, [wallet, withdrawals]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = allTransactions;

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(tx =>
        String(tx.id).toLowerCase().includes(search) ||
        (tx.description || '').toLowerCase().includes(search) ||
        (tx.type || tx.transaction_type || '').toLowerCase().includes(search)
      );
    }

    // Filter by date range
    if (filters.startDate) {
      result = result.filter(tx => new Date(tx.created_at) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      result = result.filter(tx => new Date(tx.created_at) <= new Date(filters.endDate));
    }

    return result;
  }, [allTransactions, filters]);

  // Paginated transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, page, pageSize]);

  // Handle withdrawal request
  const handleWithdrawal = async (amount) => {
    try {
      setSubmitting(true);
      await bloggerAPI.requestWithdrawal(amount);

      // Close modal and refresh data
      setIsWithdrawalModalOpen(false);
      await fetchWalletData();

      // TODO: Add toast notification for success
    } catch (err) {
      console.error('Error requesting withdrawal:', err);
      alert('Failed to request withdrawal: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({ search: '', startDate: '', endDate: '' });
    setPage(1);
  };

  const availableBalance = parseFloat(wallet?.available_balance || wallet?.balance || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <WalletIcon className="h-6 w-6" style={{ color: 'var(--primary-cyan)' }} />
          Wallet
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchWalletData}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} style={{ color: 'var(--text-muted)' }} />
          </button>
          <button
            onClick={() => setIsWithdrawalModalOpen(true)}
            disabled={loading || availableBalance < 50}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)',
              color: 'var(--background-dark)'
            }}
          >
            <ArrowDownToLine className="h-4 w-4" />
            Request Withdrawal
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
        >
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchWalletData}
            className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #6BF0FF 0%, #3ED9EB 100%)',
              color: 'var(--background-dark)'
            }}
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {/* Wallet Summary Cards */}
      <WalletSummary wallet={wallet} loading={loading && !wallet} />

      {/* Filters */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium" style={{ color: 'var(--text-secondary)' }}>Transaction History</div>
          {(filters.search || filters.startDate || filters.endDate) && (
            <button
              className="text-sm hover:opacity-80"
              style={{ color: 'var(--error)' }}
              onClick={handleResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>Search</label>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
              className="w-full rounded-xl px-3 py-2"
              style={{
                backgroundColor: 'var(--background-dark)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>From Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => {
                setFilters({ ...filters, startDate: e.target.value });
                setPage(1);
              }}
              className="w-full rounded-xl px-3 py-2"
              style={{
                backgroundColor: 'var(--background-dark)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div>
            <label className="text-sm block mb-1" style={{ color: 'var(--text-secondary)' }}>To Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => {
                setFilters({ ...filters, endDate: e.target.value });
                setPage(1);
              }}
              className="w-full rounded-xl px-3 py-2"
              style={{
                backgroundColor: 'var(--background-dark)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
      </div>

      {/* Transactions Table */}
      <TransactionsTable
        transactions={paginatedTransactions}
        loading={loading && allTransactions.length === 0}
      />

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredTransactions.length}
          pageSizeOptions={[20, 50]}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      )}

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
        onSubmit={handleWithdrawal}
        availableBalance={availableBalance}
        minAmount={50}
        submitting={submitting}
      />
    </div>
  );
}
