import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useCases } from '../../hooks/useCases';
import { useTasks } from '../../hooks/useTasks';
import { CASE_STATUS, CASE_TYPES } from '../../utils/constants';
import { 
  FolderOpen, 
  CheckSquare, 
  AlertTriangle, 
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Fetch real data from API
  const { data: casesData, isLoading: casesLoading, error: casesError } = useCases();
  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useTasks();

  if (casesLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  if (casesError || tasksError) {
    return (
      <ErrorMessage 
        message="Failed to load dashboard data" 
        details={casesError?.message || tasksError?.message}
        onRetry={() => window.location.reload()}
      />
    );
  }  // Calculate statistics from real data
  const cases = casesData?.data || [];
  const tasks = tasksData?.data || [];

  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status !== CASE_STATUS.CLOSED && c.status !== CASE_STATUS.REJECTED).length;
  const highRiskCases = cases.filter(c => c.riskScore !== undefined && c.riskScore >= 80).length;
  const myTasks = tasks.length;
  // Calculate case type distribution - filter out types with 0 cases
  const allCaseTypes = [
    { 
      type: 'Fraud Detection', 
      count: cases.filter(c => c.caseType === CASE_TYPES.FRAUD_DETECTION).length,
      key: CASE_TYPES.FRAUD_DETECTION
    },
    { 
      type: 'Money Laundering', 
      count: cases.filter(c => c.caseType === CASE_TYPES.MONEY_LAUNDERING).length,
      key: CASE_TYPES.MONEY_LAUNDERING
    },
    { 
      type: 'Suspicious Activity', 
      count: cases.filter(c => c.caseType === CASE_TYPES.SUSPICIOUS_ACTIVITY).length,
      key: CASE_TYPES.SUSPICIOUS_ACTIVITY
    },
    { 
      type: 'AML', 
      count: cases.filter(c => c.caseType === CASE_TYPES.AML).length,
      key: CASE_TYPES.AML
    },
    { 
      type: 'Fraud', 
      count: cases.filter(c => c.caseType === CASE_TYPES.FRAUD).length,
      key: CASE_TYPES.FRAUD
    },
    { 
      type: 'Compliance', 
      count: cases.filter(c => c.caseType === CASE_TYPES.COMPLIANCE).length,
      key: CASE_TYPES.COMPLIANCE
    },
    { 
      type: 'Sanctions', 
      count: cases.filter(c => c.caseType === CASE_TYPES.SANCTIONS).length,
      key: CASE_TYPES.SANCTIONS
    },
    { 
      type: 'KYC', 
      count: cases.filter(c => c.caseType === CASE_TYPES.KYC).length,
      key: CASE_TYPES.KYC
    }
  ];

  // Only show case types that have cases
  const casesByType = allCaseTypes
    .filter(item => item.count > 0)
    .map(item => ({
      type: item.type,
      count: item.count,
      percentage: Math.round((item.count / (totalCases || 1)) * 100)
    }));

  // Calculate risk distribution - only for cases with riskScore
  const casesWithRisk = cases.filter(c => c.riskScore !== undefined);
  const criticalCases = casesWithRisk.filter(c => c.riskScore! >= 90).length;
  const highRiskCasesCount = casesWithRisk.filter(c => c.riskScore! >= 80 && c.riskScore! < 90).length;
  const mediumRiskCases = casesWithRisk.filter(c => c.riskScore! >= 60 && c.riskScore! < 80).length;
  const lowRiskCases = casesWithRisk.filter(c => c.riskScore! < 60).length;
  const riskDistribution = [
    { 
      level: 'Critical', 
      count: criticalCases,
      percentage: Math.round((criticalCases / (casesWithRisk.length || 1)) * 100), 
      color: 'bg-red-500' 
    },
    { 
      level: 'High', 
      count: highRiskCasesCount,
      percentage: Math.round((highRiskCasesCount / (casesWithRisk.length || 1)) * 100), 
      color: 'bg-orange-500' 
    },
    { 
      level: 'Medium', 
      count: mediumRiskCases,
      percentage: Math.round((mediumRiskCases / (casesWithRisk.length || 1)) * 100), 
      color: 'bg-yellow-500' 
    },
    { 
      level: 'Low', 
      count: lowRiskCases,
      percentage: Math.round((lowRiskCases / (casesWithRisk.length || 1)) * 100), 
      color: 'bg-green-500' 
    }
  ];

  // Build stats from real data
  const stats = [
    {
      title: 'Total Cases',
      value: totalCases.toString(),
      change: 0, // Could calculate monthly change if we had historical data
      trend: 'neutral' as const,
      icon: FolderOpen,
      className: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Active Cases',
      value: activeCases.toString(),
      change: 0,
      trend: 'neutral' as const,
      icon: CheckSquare,
      className: 'text-green-600 bg-green-50'
    },
    {
      title: 'High Risk Cases',
      value: highRiskCases.toString(),
      change: 0,
      trend: 'neutral' as const,
      icon: AlertTriangle,
      className: 'text-red-600 bg-red-50'
    },
    {
      title: 'My Tasks',
      value: myTasks.toString(),
      change: 0,
      trend: 'neutral' as const,
      icon: Clock,
      className: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            className={stat.className}
          />
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">        {/* Case Types Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Type</h3>
          {casesByType.length > 0 ? (
            <div className="space-y-4">
              {casesByType.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-500 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No cases available</p>
            </div>
          )}
        </div>{/* Risk Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          {casesWithRisk.length > 0 ? (
            <div className="space-y-4">
              {riskDistribution.map((item) => (
                <div key={item.level} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.level}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full`} 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No cases with risk scores available</p>
            </div>
          )}
        </div>{/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};
