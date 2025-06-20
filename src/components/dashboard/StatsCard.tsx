import React from 'react';
import type { StatsCardProps } from '../../types';

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  className = ''
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendSymbol = () => {
    switch (trend) {
      case 'up':
        return '+';
      case 'down':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${className}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change !== undefined && change !== 0 && (
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {getTrendSymbol()}{change}{typeof change === 'number' && change % 1 !== 0 ? '' : '%'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
