import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  AlertTriangle, 
  FileText,
  Hash,
  Building2,
  Activity
} from 'lucide-react';
import { useCreateCase } from '../../hooks/useCases';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { CASE_TYPES, PRIORITY_LEVELS, TYPOLOGIES } from '../../utils/constants';
import { validateCaseData } from '../../utils/helpers';
import type { CreateCaseForm } from '../../types';

export const CreateCase: React.FC = () => {
  const navigate = useNavigate();
  const createCaseMutation = useCreateCase();
  const [formData, setFormData] = useState<CreateCaseForm>({
    description: '',
    caseType: 'FRAUD_DETECTION',
    priority: 'MEDIUM',
    riskScore: undefined,
    entity: '',
    alertId: '',
    typology: undefined
  });
    const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof CreateCaseForm, value: any) => {    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateCaseData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const result = await createCaseMutation.mutateAsync(formData);
      navigate(`/cases/${result.data.id}`);
    } catch (error) {
      console.error('Failed to create case:', error);
    }
  };

  // Determine if this will be a complete case
  const isCompleteCase = formData.caseType && formData.priority && formData.riskScore !== undefined;

  const handleCancel = () => {
    navigate('/cases');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Case</h1>
              <p className="text-gray-600 mt-1">Start a new financial crime investigation</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <X className="h-4 w-4 mr-2 inline" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createCaseMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createCaseMutation.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (                  <>
                    <Save className="h-4 w-4 mr-2 inline" />
                    {isCompleteCase ? 'Create & Start Workflow' : 'Save as Draft'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Messages */}
          {errors.length > 0 && (
            <ErrorMessage
              message="Please fix the following errors:"
              details={errors.join(', ')}
            />
          )}

          {/* Case Creation Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Case Creation Options</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-1">
                    <strong>Draft Case:</strong> You can create a case with just a description to save your progress.
                  </p>
                  <p>
                    <strong>Complete Case:</strong> Fill in case type, priority, and risk score to automatically start the investigation workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Case Type *
              </label>
              <select
                value={formData.caseType}
                onChange={(e) => handleInputChange('caseType', e.target.value as keyof typeof CASE_TYPES)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {Object.entries(CASE_TYPES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Priority *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as keyof typeof PRIORITY_LEVELS)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                {Object.entries(PRIORITY_LEVELS).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Activity className="h-4 w-4 inline mr-1" />
                Risk Score (0-100)
              </label>
              <input
                type="number"
                value={formData.riskScore || ''}
                onChange={(e) => handleInputChange('riskScore', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter risk score..."
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Typology */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typology
              </label>
              <select
                value={formData.typology || ''}
                onChange={(e) => handleInputChange('typology', e.target.value as keyof typeof TYPOLOGIES)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a typology...</option>
                {Object.entries(TYPOLOGIES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {value.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Entity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="h-4 w-4 inline mr-1" />
                Entity
              </label>
              <input
                type="text"
                value={formData.entity || ''}
                onChange={(e) => handleInputChange('entity', e.target.value)}
                placeholder="Enter entity name or ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Alert ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="h-4 w-4 inline mr-1" />
                Alert ID
              </label>
              <input
                type="text"
                value={formData.alertId || ''}
                onChange={(e) => handleInputChange('alertId', e.target.value)}
                placeholder="Enter alert ID..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the case details, suspicious activity, and investigation requirements..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
};
