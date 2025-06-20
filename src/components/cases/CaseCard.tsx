import React from 'react';
import { 
  Calendar, 
  User, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  MoreVertical,
  Eye,
  Edit,
  Archive
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import type { CaseCardProps } from '../../types';

export const CaseCard: React.FC<CaseCardProps> = ({
  case: caseData,
  onSelect,
  showActions = false
}) => {
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(caseData.id);
    }
  };

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-red-100 text-red-800';
    if (score >= 60) return 'bg-orange-100 text-orange-800';
    if (score >= 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'AML':
        return '🏦';
      case 'FRAUD':
        return '🚨';
      case 'SANCTIONS':
        return '⚖️';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={handleCardClick} className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(caseData.type)}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {caseData.title}
              </h3>
              <p className="text-sm text-gray-600">{caseData.caseNumber}</p>
            </div>
          </div>
          {showActions && (
            <div className="relative">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-4 w-4" />
              </button>
              {/* Dropdown menu would go here */}
            </div>
          )}
        </div>

        {/* Status and Risk */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={caseData.status} />
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskBadgeColor(caseData.riskScore)}`}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              Risk: {caseData.riskScore}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {caseData.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="truncate">
              {caseData.assignedToUser?.firstName} {caseData.assignedToUser?.lastName}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{formatDate(caseData.createdAt)}</span>
          </div>
          {caseData.amount && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{formatCurrency(caseData.amount, caseData.currency)}</span>
            </div>
          )}
          {caseData.dueDate && (
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>Due {formatDate(caseData.dueDate)}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {caseData.tags && caseData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {caseData.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {caseData.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                +{caseData.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Evidence: {caseData.evidence?.length || 0}</span>
            <span>Comments: {caseData.comments?.length || 0}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-indigo-600 h-1 rounded-full" 
              style={{ 
                width: `${caseData.status === 'COMPLETED' ? 100 : 
                        caseData.status === 'IN_INVESTIGATION' ? 75 :
                        caseData.status === 'PENDING_APPROVAL' ? 50 :
                        caseData.status === 'READY' ? 25 : 10}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-500">
                <Eye className="h-3 w-3 mr-1" />
                View
              </button>
              <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-500">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </button>
            </div>
            <button className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-500">
              <Archive className="h-3 w-3 mr-1" />
              Archive
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
