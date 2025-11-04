import React from 'react';

export function Dashboard() {
  const cards = [
    { label: 'Completed Orders', value: 363 },
    { label: 'Order Added Notifications', value: 0 },
    { label: 'Rejected Notifications', value: 0 },
    { label: 'Threads', value: 0 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl p-6" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.label}</div>
            <div className="mt-2 text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
        <div className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>Order Added Today Notification</div>
        <div className="border-t" style={{ borderColor: 'var(--border)' }} />
        <div className="p-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          No new orders
        </div>
      </div>
    </div>
  );
}
