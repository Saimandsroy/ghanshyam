import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';

export function FilterBar({
  value = { q: '', status: 'all', start: '', end: '' },
  onChange = () => {},
  fields = { q: true, status: true, start: true, end: true },
  extras = null,
}) {
  const set = (patch) => onChange({ ...value, ...patch });
  return (
    <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: 'var(--card-background)', border: '1px solid var(--border)' }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
        {fields.q && (
          <div className="relative col-span-2">
            <input value={value.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search..." className="rounded-xl pl-9 pr-3 py-2 w-full" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        {fields.status && (
          <div className="relative">
            <select value={value.status} onChange={(e) => set({ status: e.target.value })} className="rounded-xl pl-9 pr-3 py-2 w-full appearance-none" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-process">In Process</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        {fields.start && (
          <div className="relative">
            <input type="date" value={value.start} onChange={(e) => set({ start: e.target.value })} className="rounded-xl pl-9 pr-3 py-2 w-full" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        {fields.end && (
          <div className="relative">
            <input type="date" value={value.end} onChange={(e) => set({ end: e.target.value })} className="rounded-xl pl-9 pr-3 py-2 w-full" style={{ backgroundColor: 'var(--background-dark)', border: '1px solid var(--border)', color: 'var(--text-primary)' }} />
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          </div>
        )}
        {extras}
      </div>
      <div className="mt-3">
        <button onClick={() => onChange({ q: '', status: 'all', start: '', end: '' })} className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <X size={14} className="inline mr-1" /> Reset
        </button>
      </div>
    </div>
  );
}
