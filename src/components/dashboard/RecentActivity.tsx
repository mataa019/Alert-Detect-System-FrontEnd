import React from 'react';
import { Clock, User, FolderOpen, CheckSquare, AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { ApiService } from '../../services/api';
import { useQuery } from '@tanstack/react-query';

interface ActivityItem {
  id: string;
  type: 'case_created' | 'case_updated' | 'task_completed' | 'case_assigned' | 'status_changed';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  caseId?: string;
  taskId?: string;
}

export const RecentActivity: React.FC = () => {
  // Fetch real activity data from API
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => ApiService.get<ActivityItem[]>('/api/dashboard/recent-activity'),
    staleTime: 30 * 1000, // 30 seconds
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner message="Loading activity..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <ErrorMessage 
          message="Failed to load recent activity" 
          details={error.message}
        />
      </div>
    );
  }
  const activityList = activities?.data || [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'case_created':
        return <FolderOpen className="h-4 w-4 text-blue-600" />;
      case 'task_completed':
        return <CheckSquare className="h-4 w-4 text-green-600" />;
      case 'case_assigned':
        return <User className="h-4 w-4 text-purple-600" />;
      case 'status_changed':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'case_updated':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'case_created':
        return 'bg-blue-50';
      case 'task_completed':
        return 'bg-green-50';
      case 'case_assigned':
        return 'bg-purple-50';
      case 'status_changed':
        return 'bg-orange-50';
      case 'case_updated':
        return 'bg-gray-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - then.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return formatDate(timestamp);
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {activityList.length > 0 ? (
          activityList.map((activity: ActivityItem) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 p-2 rounded-lg ${getActivityBgColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      by {activity.user}
                    </p>
                    {activity.caseId && (
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {activity.caseId}
                        </span>
                        {activity.taskId && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {activity.taskId}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No recent activity</p>
          </div>
        )}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
};
