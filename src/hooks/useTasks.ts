import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '../services/taskService';
import type { 
  CreateTaskForm, 
  CompleteTaskForm,
  TaskFilters, 
  SortConfig
} from '../types';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: TaskFilters, sort?: SortConfig, page?: number) => 
    [...taskKeys.lists(), { filters, sort, page }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  myTasks: () => [...taskKeys.all, 'my'] as const,
  available: () => [...taskKeys.all, 'available'] as const,
  group: (groupName: string) => [...taskKeys.all, 'group', groupName] as const,
  byCase: (caseId: string) => [...taskKeys.all, 'case', caseId] as const,
  overdue: () => [...taskKeys.all, 'overdue'] as const,
  comments: (taskId: string) => [...taskKeys.detail(taskId), 'comments'] as const,
  history: (taskId: string) => [...taskKeys.detail(taskId), 'history'] as const,
  statistics: () => [...taskKeys.all, 'statistics'] as const,
  workload: (userId?: string) => [...taskKeys.all, 'workload', userId] as const,
  performance: (userId?: string) => [...taskKeys.all, 'performance', userId] as const,
};

// Get tasks with pagination and filtering
export function useTasks(
  filters?: TaskFilters,
  sort?: SortConfig,
  page: number = 1,
  size: number = 20
) {
  return useQuery({
    queryKey: taskKeys.list(filters, sort, page),
    queryFn: () => TaskService.getTasks(filters, sort, page, size),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get task by ID
export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => TaskService.getTaskById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get my tasks
export function useMyTasks(page: number = 1, size: number = 20, status?: string[]) {
  return useQuery({
    queryKey: [...taskKeys.myTasks(), { page, size, status }],
    queryFn: () => TaskService.getMyTasks(page, size, status),
    staleTime: 1 * 60 * 1000,
  });
}

// Get available tasks
export function useAvailableTasks(page: number = 1, size: number = 20) {
  return useQuery({
    queryKey: [...taskKeys.available(), { page, size }],
    queryFn: () => TaskService.getAvailableTasks(page, size),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get group tasks
export function useGroupTasks(groupName: string, page: number = 1, size: number = 20) {
  return useQuery({
    queryKey: [...taskKeys.group(groupName), { page, size }],
    queryFn: () => TaskService.getGroupTasks(groupName, page, size),
    enabled: !!groupName,
    staleTime: 1 * 60 * 1000,
  });
}

// Get tasks by case
export function useTasksByCase(caseId: string, page: number = 1, size: number = 20) {
  return useQuery({
    queryKey: [...taskKeys.byCase(caseId), { page, size }],
    queryFn: () => TaskService.getTasksByCase(caseId, page, size),
    enabled: !!caseId,
    staleTime: 2 * 60 * 1000,
  });
}

// Get overdue tasks
export function useOverdueTasks(page: number = 1, size: number = 20) {
  return useQuery({
    queryKey: [...taskKeys.overdue(), { page, size }],
    queryFn: () => TaskService.getOverdueTasks(page, size),
    staleTime: 1 * 60 * 1000,
  });
}

// Get task comments
export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => TaskService.getTaskComments(taskId),
    enabled: !!taskId,
    staleTime: 30 * 1000,
  });
}

// Get task history
export function useTaskHistory(taskId: string) {
  return useQuery({
    queryKey: taskKeys.history(taskId),
    queryFn: () => TaskService.getTaskHistory(taskId),
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
  });
}

// Get task statistics
export function useTaskStatistics(dateRange?: { start: string; end: string }) {
  return useQuery({
    queryKey: [...taskKeys.statistics(), dateRange],
    queryFn: () => TaskService.getTaskStatistics(dateRange),
    staleTime: 10 * 60 * 1000,
  });
}

// Get user workload
export function useUserWorkload(userId?: string) {
  return useQuery({
    queryKey: taskKeys.workload(userId),
    queryFn: () => TaskService.getUserWorkload(userId),
    staleTime: 5 * 60 * 1000,
  });
}

// Get task performance
export function useTaskPerformance(
  userId?: string,
  dateRange?: { start: string; end: string }
) {
  return useQuery({
    queryKey: [...taskKeys.performance(userId), dateRange],
    queryFn: () => TaskService.getTaskPerformance(userId, dateRange),
    staleTime: 10 * 60 * 1000,
  });
}

// Mutations
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskForm) => TaskService.createTask(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.byCase(variables.caseId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTaskForm> }) =>
      TaskService.updateTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

export function useClaimTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskService.claimTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.available() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
}

export function useReleaseTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskService.releaseTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.available() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
}

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assigneeId, comments }: { id: string; assigneeId: string; comments?: string }) =>
      TaskService.assignTask(id, assigneeId, comments),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CompleteTaskForm }) =>
      TaskService.completeTask(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
      queryClient.invalidateQueries({ queryKey: taskKeys.history(id) });
    },
  });
}

export function useStartTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskService.startTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
}

export function usePauseTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      TaskService.pauseTask(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
}

export function useResumeTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TaskService.resumeTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
}

export function useCancelTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      TaskService.cancelTask(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

export function useAddTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      taskId, 
      content, 
      isInternal, 
      mentionedUsers 
    }: { 
      taskId: string; 
      content: string; 
      isInternal?: boolean; 
      mentionedUsers?: string[] 
    }) => TaskService.addTaskComment(taskId, content, isInternal, mentionedUsers),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    },
  });
}

export function useUpdateTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      taskId, 
      commentId, 
      content 
    }: { 
      taskId: string; 
      commentId: string; 
      content: string 
    }) => TaskService.updateTaskComment(taskId, commentId, content),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    },
  });
}

export function useDeleteTaskComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, commentId }: { taskId: string; commentId: string }) =>
      TaskService.deleteTaskComment(taskId, commentId),
    onSuccess: (_, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
    },
  });
}

export function useUpdateTaskVariables() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, variables }: { id: string; variables: Record<string, any> }) =>
      TaskService.updateTaskVariables(id, variables),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}

// Bulk operations
export function useBulkAssignTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      taskIds, 
      assigneeId, 
      comments 
    }: { 
      taskIds: string[]; 
      assigneeId: string; 
      comments?: string 
    }) => TaskService.bulkAssign(taskIds, assigneeId, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useBulkCompleteTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      taskIds, 
      completionData 
    }: { 
      taskIds: string[]; 
      completionData: CompleteTaskForm 
    }) => TaskService.bulkComplete(taskIds, completionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

export function useBulkCancelTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      taskIds, 
      reason 
    }: { 
      taskIds: string[]; 
      reason: string 
    }) => TaskService.bulkCancel(taskIds, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}