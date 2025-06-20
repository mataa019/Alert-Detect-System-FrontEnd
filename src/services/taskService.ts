import { ApiService } from './api';
import type { 
  Task, 
  CreateTaskForm, 
  CompleteTaskForm,
  TaskFilters, 
  SortConfig,
  ApiResponse, 
  PaginatedResponse,
  Comment
} from '../types';

export class TaskService {
  // Get all tasks with filtering and pagination
  static async getTasks(
    filters?: TaskFilters,
    sort?: SortConfig,
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Task>> {
    const params = {
      page: page - 1, // Backend uses 0-based indexing
      size,
      ...(sort && { sort: `${sort.field},${sort.direction}` }),
      ...(filters?.status && { status: filters.status.join(',') }),
      ...(filters?.type && { type: filters.type.join(',') }),
      ...(filters?.assignedTo && { assignedTo: filters.assignedTo.join(',') }),
      ...(filters?.priority && { priority: filters.priority.join(',') }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.caseId && { caseId: filters.caseId }),
      ...(filters?.dueDate && {
        dueDateStart: filters.dueDate.start,
        dueDateEnd: filters.dueDate.end
      })
    };

    return ApiService.getPaginated<Task>('/api/tasks', params);
  }

  // Get task by ID
  static async getTaskById(id: string): Promise<ApiResponse<Task>> {
    return ApiService.get<Task>(`/api/tasks/${id}`);
  }
  // Create new task
  static async createTask(taskData: {
    taskName: string;
    assignee: string;
    status: string;
    caseId: string;
  }): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>('/api/tasks/create', taskData);
  }

  // Update task
  static async updateTask(id: string, taskData: Partial<CreateTaskForm>): Promise<ApiResponse<Task>> {
    return ApiService.put<Task>(`/api/tasks/${id}`, taskData);
  }

  // Delete task
  static async deleteTask(id: string): Promise<ApiResponse<void>> {
    return ApiService.delete<void>(`/api/tasks/${id}`);
  }

  // Claim task (assign to current user)
  static async claimTask(id: string): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>(`/api/tasks/${id}/claim`);
  }

  // Release task (unassign from current user)
  static async releaseTask(id: string): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>(`/api/tasks/${id}/release`);
  }
  // Assign task to user
  static async assignTask(taskId: string, assignee: string, comment?: string): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>('/api/tasks/assign', { taskId, assignee, comment });
  }
  // Complete task
  static async completeTask(taskId: string, variables: Record<string, any>): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>('/api/tasks/complete', { taskId, variables });
  }

  // Start task
  static async startTask(id: string): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>(`/api/tasks/${id}/start`);
  }

  // Pause task
  static async pauseTask(id: string, reason?: string): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>(`/api/tasks/${id}/pause`, { reason });
  }

  // Resume task
  static async resumeTask(id: string): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>(`/api/tasks/${id}/resume`);
  }

  // Cancel task
  static async cancelTask(id: string, reason: string): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>(`/api/tasks/${id}/cancel`, { reason });
  }
  // Get my tasks (assigned to current user)
  static async getMyTasks(assignee: string): Promise<ApiResponse<Task[]>> {
    return ApiService.get<Task[]>(`/api/tasks/my/${assignee}`);
  }

  // Get available tasks (unassigned tasks for current user's groups)
  static async getAvailableTasks(
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Task>> {
    const params = {
      page: page - 1,
      size,
      available: true
    };

    return ApiService.getPaginated<Task>('/api/tasks', params);
  }
  // Get group tasks
  static async getGroupTasks(groupId: string): Promise<ApiResponse<Task[]>> {
    return ApiService.get<Task[]>(`/api/tasks/group/${groupId}`);  }

  // Get tasks by case ID
  static async getTasksByCase(caseId: string): Promise<ApiResponse<Task[]>> {
    return ApiService.get<Task[]>(`/api/tasks/by-case/${caseId}`);
  }

  // Get overdue tasks
  static async getOverdueTasks(
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Task>> {
    const params = {
      page: page - 1,
      size,
      overdue: true
    };

    return ApiService.getPaginated<Task>('/api/tasks', params);
  }

  // Get task comments
  static async getTaskComments(taskId: string): Promise<ApiResponse<Comment[]>> {
    return ApiService.get<Comment[]>(`/api/tasks/${taskId}/comments`);
  }

  // Add task comment
  static async addTaskComment(
    taskId: string, 
    content: string, 
    isInternal: boolean = false,
    mentionedUsers: string[] = []
  ): Promise<ApiResponse<Comment>> {
    return ApiService.post<Comment>(`/api/tasks/${taskId}/comments`, {
      content,
      isInternal,
      mentionedUsers
    });
  }

  // Update task comment
  static async updateTaskComment(
    taskId: string, 
    commentId: string, 
    content: string
  ): Promise<ApiResponse<Comment>> {
    return ApiService.put<Comment>(`/api/tasks/${taskId}/comments/${commentId}`, { content });
  }

  // Delete task comment
  static async deleteTaskComment(taskId: string, commentId: string): Promise<ApiResponse<void>> {
    return ApiService.delete<void>(`/api/tasks/${taskId}/comments/${commentId}`);
  }

  // Update task variables
  static async updateTaskVariables(id: string, variables: Record<string, any>): Promise<ApiResponse<Task>> {
    return ApiService.patch<Task>(`/api/tasks/${id}/variables`, { variables });
  }

  // Get task history
  static async getTaskHistory(taskId: string): Promise<ApiResponse<any[]>> {
    return ApiService.get<any[]>(`/api/tasks/${taskId}/history`);
  }

  // Bulk operations
  static async bulkAssign(taskIds: string[], assigneeId: string, comments?: string): Promise<ApiResponse<void>> {
    return ApiService.post<void>('/api/tasks/bulk/assign', { taskIds, assigneeId, comments });
  }

  static async bulkComplete(taskIds: string[], completionData: CompleteTaskForm): Promise<ApiResponse<void>> {
    return ApiService.post<void>('/api/tasks/bulk/complete', { taskIds, ...completionData });
  }

  static async bulkCancel(taskIds: string[], reason: string): Promise<ApiResponse<void>> {
    return ApiService.post<void>('/api/tasks/bulk/cancel', { taskIds, reason });
  }

  // Search tasks
  static async searchTasks(
    query: string,
    filters?: Partial<TaskFilters>,
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Task>> {
    const params = {
      q: query,
      page: page - 1,
      size,
      ...filters
    };

    return ApiService.getPaginated<Task>('/api/tasks/search', params);
  }

  // Get task statistics
  static async getTaskStatistics(dateRange?: { start: string; end: string }): Promise<ApiResponse<any>> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {};
    return ApiService.get<any>('/api/tasks/statistics', params);
  }

  // Get user workload
  static async getUserWorkload(userId?: string): Promise<ApiResponse<any>> {
    const params = userId ? { userId } : {};
    return ApiService.get<any>('/api/tasks/workload', params);
  }

  // Get task performance metrics
  static async getTaskPerformance(
    userId?: string,
    dateRange?: { start: string; end: string }
  ): Promise<ApiResponse<any>> {
    const params = {
      ...(userId && { userId }),
      ...(dateRange && { startDate: dateRange.start, endDate: dateRange.end })
    };
    return ApiService.get<any>('/api/tasks/performance', params);
  }
  // Export tasks
  static async exportTasks(
    filters?: TaskFilters,
    format: 'PDF' | 'EXCEL' = 'EXCEL'
  ): Promise<void> {
    const queryParams = new URLSearchParams({
      format,
      ...(filters && Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, String(value)])
      ))
    });
    return ApiService.download(`/api/tasks/export?${queryParams}`, `tasks.${format.toLowerCase()}`);
  }
}