import React from 'react';
import { ChevronLeft, ChevronRight, Eye, Trash2, AlertCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'accepted':
        return 'badge-success';
      case 'rejected':
        return 'badge-error';
      case 'pending':
      case 'in-process':
        return 'badge-warning';
    }
  };
  return <span className={`badge ${getStatusStyles()}`}>{status}</span>;
};

export const DataTable = ({
  columns,
  data,
  isLoading = false,
  emptyStateMessage = 'No data available'
}) => {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header">
              {columns.map((column, index) => (
                <th key={index} className="table-cell text-left">
                  {column}
                </th>
              ))}
              <th className="table-cell text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="table-cell text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-6 h-6 border-2 border-t-accent border-r-accent border-b-transparent border-l-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-text-secondary">Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="table-cell text-center py-12">
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle size={36} className="text-muted mb-2" />
                    <p className="text-text-secondary">{emptyStateMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="table-row">
                  {Object.keys(row).map((key, cellIndex) => {
                    if (key === 'status') {
                      return (
                        <td key={cellIndex} className="table-cell">
                          <StatusBadge status={row[key]} />
                        </td>
                      );
                    }
                    return (
                      <td key={cellIndex} className="table-cell">
                        {row[key]}
                      </td>
                    );
                  })}
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-md hover:bg-surface-hover transition-colors" title="View">
                        <Eye size={16} className="text-accent" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-surface-hover transition-colors" title="Delete">
                        <Trash2 size={16} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-surface border-t border-border px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-text-secondary">
          Showing <span className="font-medium">1</span> to{' '}
          <span className="font-medium">10</span> of{' '}
          <span className="font-medium">100</span> results
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn btn-outline p-1.5">
            <ChevronLeft size={18} />
          </button>
          <button className="btn btn-accent p-1.5">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};