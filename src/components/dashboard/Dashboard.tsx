import React from 'react';
import { StatsCard } from './StatsCard';
import { RecentActivity } from './RecentActivity';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { useCaseStatistics } from '../../hooks/useCases';
import { useTaskStatistics } from '../../hooks/useTasks';
import { 
  FolderOpen, 
  CheckSquare, 
  AlertTriangle, 
  Clock
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Fetch real data from API
  const { data: caseStats, isLoading: caseStatsLoading, error: caseStatsError } = useCaseStatistics();
  const { data: taskStats, isLoading: taskStatsLoading, error: taskStatsError } = useTaskStatistics();

  if (caseStatsLoading || taskStatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  if (caseStatsError || taskStatsError) {
    return (
      <ErrorMessage 
        message="Failed to load dashboard data" 
        details={caseStatsError?.message || taskStatsError?.message}
        onRetry={() => window.location.reload()}
      />
    );
  }
  // Build stats from real data
  const stats = [
    {
      title: 'Total Cases',
      value: caseStats?.data?.totalCases?.toString() || '0',
      change: caseStats?.data?.monthlyTrends?.[0]?.cases || 0,
      trend: 'up' as const,
      icon: FolderOpen,
      className: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Active Cases',
      value: caseStats?.data?.activeCases?.toString() || '0',
      change: caseStats?.data?.activeCases - caseStats?.data?.completedCases || 0,
      trend: 'up' as const,
      icon: CheckSquare,
      className: 'text-green-600 bg-green-50'
    },
    {
      title: 'High Risk Cases',
      value: caseStats?.data?.riskDistribution?.high?.toString() || '0',
      change: caseStats?.data?.riskDistribution?.critical || 0,
      trend: 'up' as const,
      icon: AlertTriangle,
      className: 'text-red-600 bg-red-50'
    },
    {
      title: 'My Tasks',
      value: caseStats?.data?.myTasks?.toString() || '0',
      change: taskStats?.data?.myActiveTasks || 0,
      trend: 'neutral' as const,
      icon: Clock,
      className: 'text-purple-600 bg-purple-50'
    }
  ];

  // Build case distribution from real data
  const casesByType = [
    { 
      type: 'AML', 
      count: caseStats?.data?.casesByType?.aml || 0, 
      percentage: Math.round(((caseStats?.data?.casesByType?.aml || 0) / (caseStats?.data?.totalCases || 1)) * 100) 
    },
    { 
      type: 'Fraud', 
      count: caseStats?.data?.casesByType?.fraud || 0, 
      percentage: Math.round(((caseStats?.data?.casesByType?.fraud || 0) / (caseStats?.data?.totalCases || 1)) * 100) 
    },
    { 
      type: 'Sanctions', 
      count: caseStats?.data?.casesByType?.sanctions || 0, 
      percentage: Math.round(((caseStats?.data?.casesByType?.sanctions || 0) / (caseStats?.data?.totalCases || 1)) * 100) 
    }
  ];

  // Build risk distribution from real data
  const riskDistribution = [
    { 
      level: 'Critical', 
      count: caseStats?.data?.riskDistribution?.critical || 0, 
      percentage: Math.round(((caseStats?.data?.riskDistribution?.critical || 0) / (caseStats?.data?.totalCases || 1)) * 100), 
      color: 'bg-red-500' 
    },
    { 
      level: 'High', 
      count: caseStats?.data?.riskDistribution?.high || 0, 
      percentage: Math.round(((caseStats?.data?.riskDistribution?.high || 0) / (caseStats?.data?.totalCases || 1)) * 100), 
      color: 'bg-orange-500' 
    },
    { 
      level: 'Medium', 
      count: caseStats?.data?.riskDistribution?.medium || 0, 
      percentage: Math.round(((caseStats?.data?.riskDistribution?.medium || 0) / (caseStats?.data?.totalCases || 1)) * 100), 
      color: 'bg-yellow-500' 
    },
    { 
      level: 'Low', 
      count: caseStats?.data?.riskDistribution?.low || 0, 
      percentage: Math.round(((caseStats?.data?.riskDistribution?.low || 0) / (caseStats?.data?.totalCases || 1)) * 100), 
      color: 'bg-green-500' 
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Case Types Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Type</h3>
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
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
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
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month) => (
            <div key={month} className="text-center">
              <div className="text-xs text-gray-500 mb-2">{month}</div>
              <div className="h-20 bg-gray-100 rounded relative">
                <div 
                  className="bg-indigo-500 rounded absolute bottom-0 w-full"
                  style={{ height: `${Math.random() * 80 + 20}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-500 rounded"></div>
            <span className="text-gray-600">Cases Created</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-600">Cases Resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};
