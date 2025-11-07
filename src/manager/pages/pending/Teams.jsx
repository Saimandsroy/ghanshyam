import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { EmptyState } from '../../components/empty/EmptyState';
import { Search } from 'lucide-react';

export const PendingTeams = () => {
  const [q, setQ] = useState('');
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Pending Approval For Teams</h1>
      <div className="card">
        <div className="flex items-center justify-end p-3 border-b border-border">
          <div className="relative w-full max-w-xs">
            <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search" className="input w-full pl-9" />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
        </div>
        <EmptyState title="No Pending Approval For Teams" />
      </div>
    </Layout>
  );
};
