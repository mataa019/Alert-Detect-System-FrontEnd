import React from 'react';
import { useParams } from 'react-router-dom';
import { useCase } from '../../hooks/useCases';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../../utils/helpers';

export const CaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: caseData, isLoading, error } = useCase(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading case details..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load case details" 
        details={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!caseData?.data) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Case not found</p>
      </div>
    );
  }

  const case_ = caseData.data;

  return (
    <div className="space-y-6">
      {/* Case Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{case_.title}</h1>
            <p className="text-gray-600 mt-1">Case #{case_.caseNumber}</p>
          </div>
          <StatusBadge status={case_.status} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <p className="mt-1 text-sm text-gray-900">{case_.type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <p className="mt-1 text-sm text-gray-900">{case_.priority}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Score</label>
            <p className="mt-1 text-sm text-gray-900">{case_.riskScore}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(case_.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <p className="mt-1 text-sm text-gray-900">
              {case_.dueDate ? formatDate(case_.dueDate) : 'Not set'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned To</label>
            <p className="mt-1 text-sm text-gray-900">
              {case_.assignedToUser?.firstName} {case_.assignedToUser?.lastName}
            </p>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <p className="mt-1 text-sm text-gray-900">{case_.description}</p>
        </div>
      </div>

      {/* Customer Information */}
      {case_.customer && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{case_.customer.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Number</label>
              <p className="mt-1 text-sm text-gray-900">{case_.customer.accountNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Risk Rating</label>
              <p className="mt-1 text-sm text-gray-900">{case_.customer.riskRating}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <p className="mt-1 text-sm text-gray-900">{case_.customer.country}</p>
            </div>
          </div>
        </div>
      )}

      {/* Amount Information */}
      {case_.amount && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amount Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <p className="mt-1 text-sm text-gray-900">
                {case_.currency} {case_.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      {case_.tags && case_.tags.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {case_.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
