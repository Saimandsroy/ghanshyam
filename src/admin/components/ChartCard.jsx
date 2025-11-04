import React from 'react';

export function ChartCard({ title, right, children }) {
  return (
    <div className="rounded-2xl p-6 shadow-xl" style={{
      backgroundColor: 'var(--card-background)',
      border: '1px solid var(--border)'
    }}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}
