import React from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
export const TableFilter = () => {
  return <div className="bg-surface border border-border rounded-lg p-4 mb-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" placeholder="Search by keyword..." className="input pl-9 w-full" />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        </div>
        <div className="relative min-w-[180px]">
          <select className="input w-full pl-9 appearance-none">
            <option>All Statuses</option>
            <option>Accepted</option>
            <option>Rejected</option>
            <option>Pending</option>
            <option>In Process</option>
          </select>
          <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        </div>
        <div className="relative min-w-[180px]">
          <input type="date" className="input w-full pl-9" />
          <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" />
        </div>
        <button className="btn btn-outline">
          <X size={16} className="mr-1.5" />
          Clear Filters
        </button>
      </div>
    </div>;
};