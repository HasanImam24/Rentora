import React from 'react';
import { getStatusColor } from '@/lib/utils';

export default function Badge({ status, label, className = '' }) {
  const colorClasses = getStatusColor(status);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClasses} ${className}`}>
      {label || status}
    </span>
  );
}
