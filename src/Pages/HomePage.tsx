import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  FolderOpen, 
  CheckSquare, 
  AlertTriangle,
  Shield,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const quickStats = [
    { label: 'Active Cases', value: '24', icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'My Tasks', value: '8', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'High Risk', value: '5', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Completed Today', value: '12', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const quickActions = [
    {
      title: 'Create New Case',
      description: 'Start a new AML, Fraud, or Sanctions investigation',
      href: '/cases/create',
      icon: Plus,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      title: 'View Dashboard',
      description: 'See comprehensive analytics and insights',
      href: '/dashboard',
      icon: BarChart3,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'My Tasks',
      description: 'Review assigned tasks and pending approvals',
      href: '/tasks',
      icon: CheckSquare,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'All Cases',
      description: 'Browse and filter through all investigations',
      href: '/cases',
      icon: FolderOpen,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'case_created',
      title: 'New AML case created',
      description: 'CASE-2025-0124 - Suspicious wire transfer',
      time: '5 minutes ago',
      user: 'Sarah Johnson'
    },
    {
      id: '2',
      type: 'task_completed',
      title: 'Investigation completed',
      description: 'CASE-2025-0123 - Documentation review finished',
      time: '1 hour ago',
      user: 'Mike Chen'
    },
    {
      id: '3',
      type: 'case_approved',
      title: 'Case approved for investigation',
      description: 'CASE-2025-0122 - Fraud investigation approved',
      time: '2 hours ago',
      user: 'Lisa Wang'
    },
    {
      id: '4',
      type: 'case_closed',
      title: 'Case closed',
      description: 'CASE-2025-0121 - No further action required',
      time: '3 hours ago',
      user: 'David Rodriguez'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-indigo-100 text-lg">
              Financial Crime Investigation Platform
            </p>
            <p className="text-indigo-200 mt-2">
              Monitor, investigate, and resolve financial crimes efficiently
            </p>
          </div>
          <div className="hidden lg:block">
            <Shield className="h-24 w-24 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg text-white ${action.color}`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link
              to="/audit"
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Clock className="h-4 w-4 text-indigo-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">by {activity.user}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-2xl font-bold text-gray-900">94.2%</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">+2.1%</p>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Resolution Time</p>
                  <p className="text-2xl font-bold text-gray-900">4.2 days</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-medium">-0.8 days</p>
                  <p className="text-xs text-gray-500">vs last month</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">High Risk Cases</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-600 font-medium">+2</p>
                  <p className="text-xs text-gray-500">requires attention</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/dashboard"
                  className="w-full bg-indigo-600 text-white text-center py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                  View Full Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
