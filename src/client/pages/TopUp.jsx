import React, { useState, useEffect } from 'react';
import { clientAPI } from '../../lib/api';
import { Wallet, CheckCircle, AlertCircle, CreditCard, ArrowRight, DollarSign, RefreshCw } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext.jsx';

const TOPUP_AMOUNTS = [
  { value: 500, label: '$500', popular: false },
  { value: 1000, label: '$1,000', popular: true },
  { value: 1500, label: '$1,500', popular: false },
  { value: 2000, label: '$2,000', popular: false },
];

export function TopUp() {
  const { refreshUser } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      setWalletLoading(true);
      const data = await clientAPI.getWallet();
      setWalletData(data);
    } catch (err) {
      console.error('Failed to fetch wallet:', err);
    } finally {
      setWalletLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!selectedAmount) {
      setError('Please select a top-up amount');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Step 1: Create payment order on backend
      const orderData = await clientAPI.createPaymentOrder(selectedAmount);

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.key_id,
        amount: selectedAmount * 100,
        currency: orderData.currency || 'USD',
        name: 'Link Management',
        description: `Wallet Top-Up: $${selectedAmount}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyData = await clientAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setSuccess(`Payment successful! $${verifyData.credited_amount} added to your wallet. New balance: $${verifyData.new_balance.toFixed(2)}`);
            setSelectedAmount(null);
            fetchWallet();
            refreshUser(); // Update wallet balance in header
          } catch (verifyErr) {
            setError(verifyErr.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {},
        theme: {
          color: '#10B981'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      // Check if Razorpay script is loaded
      if (typeof window.Razorpay === 'undefined') {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        };
        script.onerror = () => {
          setError('Failed to load payment gateway. Please try again.');
          setLoading(false);
        };
        document.body.appendChild(script);
      } else {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      setError(err.message || 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Current Balance Card */}
      <div className="premium-card p-8 bg-[var(--card-background)] border border-[var(--border)]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-[var(--text-muted)] text-sm font-medium mb-1">Current Balance</p>
            <p className="text-4xl lg:text-5xl font-black text-[var(--color-primary)] tracking-tight">
              {walletLoading ? (
                <span className="animate-pulse">$---</span>
              ) : (
                `$${walletData?.balance?.toFixed(2) || '0.00'}`
              )}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
            <Wallet size={32} className="text-[var(--color-primary)]" />
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="premium-card p-4 border-red-500/20 bg-red-500/10 text-red-400 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0" /><span>{error}</span>
        </div>
      )}
      {success && (
        <div className="premium-card p-4 border-green-500/20 bg-green-500/10 text-green-400 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0" /><span>{success}</span>
        </div>
      )}

      {/* Top Up Section */}
      <div className="premium-card p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <CreditCard size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Top Up Your Wallet</h2>
            <p className="text-sm text-[var(--text-muted)]">Select an amount and pay securely via Razorpay</p>
          </div>
        </div>

        {/* Amount Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TOPUP_AMOUNTS.map((amt) => (
            <button
              key={amt.value}
              onClick={() => { setSelectedAmount(amt.value); setError(''); }}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 group ${
                selectedAmount === amt.value
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                  : 'border-[var(--border)] hover:border-emerald-500/30 hover:bg-emerald-500/5'
              }`}
            >
              {amt.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider">
                  Popular
                </span>
              )}
              <div className="flex flex-col items-center gap-2">
                <DollarSign size={20} className={selectedAmount === amt.value ? 'text-emerald-400' : 'text-[var(--text-muted)]'} />
                <span className={`text-2xl font-black ${selectedAmount === amt.value ? 'text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                  {amt.label}
                </span>
              </div>
              {selectedAmount === amt.value && (
                <div className="absolute top-3 right-3">
                  <CheckCircle size={18} className="text-emerald-400" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleTopUp}
          disabled={!selectedAmount || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
            selectedAmount && !loading
              ? 'premium-btn premium-btn-primary'
              : 'bg-[var(--background-dark)] text-[var(--text-muted)] cursor-not-allowed border border-[var(--border)]'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              Processing...
            </>
          ) : selectedAmount ? (
            <>
              Pay ${selectedAmount.toLocaleString()} <ArrowRight size={20} />
            </>
          ) : (
            'Select an Amount'
          )}
        </button>

        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          🔒 Payments are processed securely via Razorpay. All transactions are encrypted.
        </p>
      </div>

      {/* Recent Transactions */}
      {walletData?.transactions && walletData.transactions.length > 0 && (
        <div className="premium-card p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {walletData.transactions.slice(0, 10).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background-dark)] border border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                    tx.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {tx.status === 'completed' ? <CheckCircle size={14} /> : 
                     tx.status === 'failed' ? <AlertCircle size={14} /> : <RefreshCw size={14} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Wallet Top-Up</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {new Date(tx.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${tx.status === 'completed' ? 'text-emerald-400' : 'text-[var(--text-muted)]'}`}>
                    +${tx.amount}
                  </p>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    tx.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                    tx.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
