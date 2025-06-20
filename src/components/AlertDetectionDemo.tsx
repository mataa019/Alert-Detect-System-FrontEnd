import React, { useState } from 'react';
import { 
  useAllCases, 
  useCasesByStatus, 
  useCreateCase, 
  useUpdateCaseStatus,
  useDashboardSummary,
  useMyTasks,
  useAssignTask,
  useCompleteTask
} from '../hooks/useAlertDetection';
import { LoadingSpinner } from './common/LoadingSpinner';
import { ErrorMessage } from './common/ErrorMessage';
import type { CreateCaseForm } from '../types';

export const AlertDetectionDemo: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState('DRAFT');
  const [assignee, setAssignee] = useState('john.doe');

  // Fetch data using the new hooks
  const { data: allCases, isLoading: casesLoading, error: casesError } = useAllCases();
  const { data: casesByStatus, isLoading: statusLoading } = useCasesByStatus(selectedStatus);
  const { data: dashboardData, isLoading: dashboardLoading } = useDashboardSummary();
  const { data: myTasks, isLoading: tasksLoading } = useMyTasks(assignee);

  // Mutations
  const createCaseMutation = useCreateCase();
  const updateStatusMutation = useUpdateCaseStatus();
  const assignTaskMutation = useAssignTask();
  const completeTaskMutation = useCompleteTask();

  // Handlers
  const handleCreateCase = () => {
    const newCase: CreateCaseForm = {
      caseType: 'FRAUD_DETECTION',
      priority: 'HIGH',
      description: 'Suspicious transaction detected',
      riskScore: 85.5,
      customerDetails: {
        customerId: 'CUST001',
        customerName: 'John Doe'
      }
    };

    createCaseMutation.mutate(newCase);
  };

  const handleStatusUpdate = (caseId: string, newStatus: string) => {
    updateStatusMutation.mutate({
      caseId,
      status: newStatus,
      comment: `Status updated to ${newStatus}`
    });
  };

  const handleTaskAssignment = (taskId: string, assigneeId: string) => {
    assignTaskMutation.mutate({
      taskId,
      assignee: assigneeId,
      comment: 'Task assigned via demo'
    });
  };

  const handleTaskCompletion = (taskId: string) => {
    completeTaskMutation.mutate({
      taskId,
      variables: {
        decision: 'APPROVED',
        comments: 'Task completed successfully'
      }
    });
  };

  if (casesLoading || dashboardLoading) {
    return <LoadingSpinner size="lg" message="Loading alert detection data..." />;
  }

  if (casesError) {
    return <ErrorMessage message="Failed to load data" details={casesError.message} />;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Alert Detection System Demo</h1>
      
      {/* Dashboard Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Dashboard Summary</h2>
        {dashboardData && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-blue-600">Total Cases</p>
              <p className="text-2xl font-bold text-blue-900">{dashboardData.totalCases}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded">
              <p className="text-sm text-yellow-600">Under Investigation</p>
              <p className="text-2xl font-bold text-yellow-900">{dashboardData.underInvestigationCases}</p>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <p className="text-sm text-green-600">Closed Cases</p>
              <p className="text-2xl font-bold text-green-900">{dashboardData.closedCases}</p>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <p className="text-sm text-red-600">Pending Approval</p>
              <p className="text-2xl font-bold text-red-900">{dashboardData.pendingApprovalCases}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Draft Cases</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardData.draftCases}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded">
              <p className="text-sm text-purple-600">Rejected Cases</p>
              <p className="text-2xl font-bold text-purple-900">{dashboardData.rejectedCases}</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={handleCreateCase}
            disabled={createCaseMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {createCaseMutation.isPending ? 'Creating...' : 'Create Sample Case'}
          </button>
        </div>
        {createCaseMutation.isSuccess && (
          <p className="text-green-600 mt-2">Case created successfully!</p>
        )}
        {createCaseMutation.error && (
          <p className="text-red-600 mt-2">Error: {createCaseMutation.error.message}</p>
        )}
      </div>

      {/* All Cases */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">All Cases ({allCases?.data?.length || 0})</h2>
        <div className="space-y-2">
          {allCases?.data?.slice(0, 5).map((caseItem: any) => (
            <div key={caseItem.id} className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">{caseItem.caseNumber || caseItem.id}</p>
                <p className="text-sm text-gray-600">{caseItem.description}</p>
                <p className="text-xs text-gray-500">Status: {caseItem.status}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusUpdate(caseItem.id, 'UNDER_INVESTIGATION')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Start Investigation
                </button>
                <button
                  onClick={() => handleStatusUpdate(caseItem.id, 'CLOSED')}
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cases by Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Cases by Status</h2>
        <div className="mb-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="DRAFT">Draft</option>
            <option value="READY_FOR_ASSIGNMENT">Ready for Assignment</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        {statusLoading ? (
          <LoadingSpinner />
        ) : (
          <p>Cases with status "{selectedStatus}": {casesByStatus?.data?.length || 0}</p>
        )}
      </div>

      {/* My Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">My Tasks</h2>
        <div className="mb-4">
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            placeholder="Enter assignee username"
            className="border rounded px-3 py-2"
          />
        </div>
        {tasksLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-2">
            {myTasks?.data?.slice(0, 3).map((task: any) => (
              <div key={task.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{task.taskName || task.title}</p>
                  <p className="text-sm text-gray-600">Status: {task.status}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTaskAssignment(task.id, assignee)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Reassign
                  </button>
                  <button
                    onClick={() => handleTaskCompletion(task.id)}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Complete
                  </button>
                </div>
              </div>
            )) || <p>No tasks found for {assignee}</p>}
          </div>
        )}
      </div>

      {/* API Connection Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">API Connection Status</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>Base URL: http://localhost:8080/api</p>
          <p>Cases loaded: {casesLoading ? 'Loading...' : (allCases?.success ? '✅ Success' : '❌ Failed')}</p>
          <p>Dashboard loaded: {dashboardLoading ? 'Loading...' : (dashboardData ? '✅ Success' : '❌ Failed')}</p>
        </div>
      </div>
    </div>
  );
};
