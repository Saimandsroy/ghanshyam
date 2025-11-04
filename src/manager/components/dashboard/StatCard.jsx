import React from 'react';
export const StatCard = ({
  icon,
  label,
  value,
  type = 'default'
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-success';
      case 'warning':
        return 'border-l-4 border-l-warning';
      case 'error':
        return 'border-l-4 border-l-error';
      default:
        return 'border-l-4 border-l-accent';
    }
  };
  return <div className={`card card-hover p-5 ${getTypeStyles()} animate-fade-in`}>
      <div className="text-muted mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-text-secondary text-sm">{label}</div>
    </div>;
};