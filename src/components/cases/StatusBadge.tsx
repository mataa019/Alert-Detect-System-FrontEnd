import React from 'react';
import { cn } from '../../utils/helpers';
import { STATUS_COLORS } from '../../utils/constants';
import type { CASE_STATUS } from '../../utils/constants';

interface StatusBadgeProps {
  status: keyof typeof CASE_STATUS;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      STATUS_COLORS[status],
      className
    )}>
      {formatStatus(status)}
    </span>
  );
};
