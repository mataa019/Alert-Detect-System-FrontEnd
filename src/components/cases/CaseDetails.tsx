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
    <div className="space-y-6">      {/* Case Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Case #{case_.caseNumber}</h1>
            <p className="text-gray-600 mt-1">{case_.caseType?.replace(/_/g, ' ')}</p>
          </div>
          <StatusBadge status={case_.status} />
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Case Type</label>
            <p className="mt-1 text-sm text-gray-900">{case_.caseType?.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <p className="mt-1 text-sm text-gray-900">{case_.priority}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Risk Score</label>
            <p className="mt-1 text-sm text-gray-900">{case_.riskScore || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Created</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(case_.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Entity</label>
            <p className="mt-1 text-sm text-gray-900">{case_.entity || 'Not specified'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Alert ID</label>
            <p className="mt-1 text-sm text-gray-900">{case_.alertId || 'Not specified'}</p>
          </div>
          {case_.typology && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Typology</label>
              <p className="mt-1 text-sm text-gray-900">{case_.typology.replace(/_/g, ' ')}</p>
            </div>
          )}
          {case_.assignedToUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <p className="mt-1 text-sm text-gray-900">
                {case_.assignedToUser.firstName} {case_.assignedToUser.lastName}
              </p>
            </div>
          )}
          {case_.processInstanceId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Process ID</label>
              <p className="mt-1 text-sm text-gray-900">{case_.processInstanceId}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <p className="mt-1 text-sm text-gray-900">{case_.description}</p>
        </div>
      </div>      {/* Tags */}
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

      {/* Comments Section */}
      {case_.comments && case_.comments.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Comments</h2>
          <div className="space-y-4">
            {case_.comments.map((comment, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">
                    {comment.authorUser?.firstName} {comment.authorUser?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Trail */}
      {case_.auditTrail && case_.auditTrail.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h2>
          <div className="space-y-3">
            {case_.auditTrail.slice(0, 5).map((entry, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                  <p className="text-xs text-gray-500">by {entry.createdBy}</p>
                </div>
                <p className="text-xs text-gray-500">{formatDate(entry.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
