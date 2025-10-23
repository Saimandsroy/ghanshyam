import React from 'react';
import { AlertCircle } from 'lucide-react';

export const EmptyState = ({
  icon = <AlertCircle size={48} />,
  title,
  message,
  type = 'default'
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted';
    }
  };
  return <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className={`mb-4 ${getTypeStyles()}`}>{icon}</div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      {message && <p className="text-text-secondary text-center max-w-md">{message}</p>}
    </div>;
};