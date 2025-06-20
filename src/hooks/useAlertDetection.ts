import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertDetectionService } from '../services/alertDetectionService';
import type { CreateCaseForm } from '../types';

// ==================== QUERY KEYS ====================
export const alertKeys = {
  all: ['alert-detection'] as const,
  
  // Case keys
  cases: () => [...alertKeys.all, 'cases'] as const,
  case: (id: string) => [...alertKeys.cases(), id] as const,
  casesByStatus: (status: string) => [...alertKeys.cases(), 'by-status', status] as const,
  
  // Task keys
  tasks: () => [...alertKeys.all, 'tasks'] as const,
  task: (id: string) => [...alertKeys.tasks(), id] as const,
  myTasks: (assignee: string) => [...alertKeys.tasks(), 'my', assignee] as const,
  groupTasks: (groupId: string) => [...alertKeys.tasks(), 'group', groupId] as const,
  tasksByCase: (caseId: string) => [...alertKeys.tasks(), 'by-case', caseId] as const,
  
  // Dashboard keys
  dashboard: () => [...alertKeys.all, 'dashboard'] as const,
  userWorkload: (assignee: string) => [...alertKeys.dashboard(), 'workload', assignee] as const,
};

// ==================== CASE HOOKS ====================

/**
 * Get all cases
 */
export function useAllCases() {
  return useQuery({
    queryKey: alertKeys.cases(),
    queryFn: () => AlertDetectionService.getAllCases(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get case by ID
 */
export function useCaseById(caseId: string) {
  return useQuery({
    queryKey: alertKeys.case(caseId),
    queryFn: () => AlertDetectionService.getCaseById(caseId),
    enabled: !!caseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get cases by status
 */
export function useCasesByStatus(status: string) {
  return useQuery({
    queryKey: alertKeys.casesByStatus(status),
    queryFn: () => AlertDetectionService.getCasesByStatus(status),
    enabled: !!status,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Create new case mutation
 */
export function useCreateCase() {
  const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (caseData: CreateCaseForm) => AlertDetectionService.createCase(caseData),
    onSuccess: () => {
      // Invalidate and refetch cases
      queryClient.invalidateQueries({ queryKey: alertKeys.cases() });
      queryClient.invalidateQueries({ queryKey: alertKeys.dashboard() });
    },
  });
}

/**
 * Update case status mutation
 */
export function useUpdateCaseStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, status, comment }: { 
      caseId: string; 
      status: string; 
      comment?: string; 
    }) => AlertDetectionService.updateCaseStatus(caseId, status, comment),    onSuccess: (_, variables) => {
      // Update the specific case in cache
      queryClient.invalidateQueries({ queryKey: alertKeys.case(variables.caseId) });
      queryClient.invalidateQueries({ queryKey: alertKeys.cases() });
      queryClient.invalidateQueries({ queryKey: alertKeys.casesByStatus(variables.status) });
      queryClient.invalidateQueries({ queryKey: alertKeys.dashboard() });
    },
  });
}

/**
 * Quick status update mutation
 */
export function useQuickStatusUpdate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ caseId, status }: { caseId: string; status: string }) => 
      AlertDetectionService.quickStatusUpdate(caseId, status),    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.case(variables.caseId) });
      queryClient.invalidateQueries({ queryKey: alertKeys.cases() });
      queryClient.invalidateQueries({ queryKey: alertKeys.casesByStatus(variables.status) });
    },
  });
}

// ==================== TASK HOOKS ====================

/**
 * Get my tasks
 */
export function useMyTasks(assignee: string) {
  return useQuery({
    queryKey: alertKeys.myTasks(assignee),
    queryFn: () => AlertDetectionService.getMyTasks(assignee),
    enabled: !!assignee,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get group tasks
 */
export function useGroupTasks(groupId: string) {
  return useQuery({
    queryKey: alertKeys.groupTasks(groupId),
    queryFn: () => AlertDetectionService.getGroupTasks(groupId),
    enabled: !!groupId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

/**
 * Get task by ID
 */
export function useTaskById(taskId: string) {
  return useQuery({
    queryKey: alertKeys.task(taskId),
    queryFn: () => AlertDetectionService.getTaskById(taskId),
    enabled: !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get tasks by case
 */
export function useTasksByCase(caseId: string) {
  return useQuery({
    queryKey: alertKeys.tasksByCase(caseId),
    queryFn: () => AlertDetectionService.getTasksByCase(caseId),
    enabled: !!caseId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Assign task mutation
 */
export function useAssignTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, assignee, comment }: { 
      taskId: string; 
      assignee: string; 
      comment?: string; 
    }) => AlertDetectionService.assignTask(taskId, assignee, comment),    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.task(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: alertKeys.myTasks(variables.assignee) });
      queryClient.invalidateQueries({ queryKey: alertKeys.tasks() });
    },
  });
}

/**
 * Complete task mutation
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, variables }: { 
      taskId: string; 
      variables: Record<string, any>; 
    }) => AlertDetectionService.completeTask(taskId, variables),    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.task(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: alertKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: alertKeys.dashboard() });
    },
  });
}

/**
 * Create task mutation
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: {
      taskName: string;
      assignee: string;
      status: string;
      caseId: string;
    }) => AlertDetectionService.createTask(taskData),    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: alertKeys.tasks() });
      queryClient.invalidateQueries({ queryKey: alertKeys.tasksByCase(variables.caseId) });
      queryClient.invalidateQueries({ queryKey: alertKeys.myTasks(variables.assignee) });
    },
  });
}

// ==================== DASHBOARD HOOKS ====================

/**
 * Get dashboard summary
 */
export function useDashboardSummary() {
  return useQuery({
    queryKey: alertKeys.dashboard(),
    queryFn: () => AlertDetectionService.getDashboardSummary(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

/**
 * Get user workload
 */
export function useUserWorkload(assignee: string) {
  return useQuery({
    queryKey: alertKeys.userWorkload(assignee),
    queryFn: () => AlertDetectionService.getUserWorkload(assignee),
    enabled: !!assignee,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

// ==================== CONVENIENCE HOOKS ====================

/**
 * Get cases by multiple statuses for dashboard cards
 */
export function useCaseStatusCounts() {
  const draftCases = useCasesByStatus('DRAFT');
  const readyCases = useCasesByStatus('READY_FOR_ASSIGNMENT');
  const investigationCases = useCasesByStatus('UNDER_INVESTIGATION');
  const pendingCases = useCasesByStatus('PENDING_APPROVAL');
  const closedCases = useCasesByStatus('CLOSED');
  const rejectedCases = useCasesByStatus('REJECTED');

  return {
    draft: draftCases.data?.data?.length || 0,
    ready: readyCases.data?.data?.length || 0,
    investigation: investigationCases.data?.data?.length || 0,
    pending: pendingCases.data?.data?.length || 0,
    closed: closedCases.data?.data?.length || 0,
    rejected: rejectedCases.data?.data?.length || 0,
    isLoading: draftCases.isLoading || readyCases.isLoading || 
               investigationCases.isLoading || pendingCases.isLoading || 
               closedCases.isLoading || rejectedCases.isLoading,
    error: draftCases.error || readyCases.error || 
           investigationCases.error || pendingCases.error || 
           closedCases.error || rejectedCases.error
  };
}
