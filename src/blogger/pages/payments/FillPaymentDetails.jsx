import React, { useState } from 'react';

export function FillPaymentDetails() {
  const [paypalId, setPaypalId] = useState('https://www.paypal.com/invoice/p/#INV2-WU54-PYS9-MR7K-28Y2');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Fill Payment Details</h2>
      <form onSubmit={handleSubmit} className="rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="border-b px-4 py-3 font-medium rounded-t-2xl" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Paypal Details</div>
        <div className="p-4 space-y-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Paypal ID</label>
          <input value={paypalId} onChange={(e)=>setPaypalId(e.target.value)} className="w-full rounded-xl px-3 py-2" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
        </div>
        <div className="px-4 pb-4">
          <button type="submit" className="px-4 py-2 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors">Submit</button>
        </div>
      </form>
    </div>
  );
}
