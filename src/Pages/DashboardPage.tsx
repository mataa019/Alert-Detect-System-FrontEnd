import React from 'react';
import { Dashboard } from '../components/dashboard/Dashboard';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Financial Crime Investigation Analytics</p>
        </div>
      </div>
      
      <Dashboard />
    </div>
  );
};
