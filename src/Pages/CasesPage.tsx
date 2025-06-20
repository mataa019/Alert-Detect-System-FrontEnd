import React from 'react';
import { CaseList } from '../components/cases/CaseList';

export const CasesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cases</h1>
          <p className="text-gray-600">Manage AML, Fraud, and Sanctions investigations</p>
        </div>
      </div>
      
      <CaseList />
    </div>
  );
};
