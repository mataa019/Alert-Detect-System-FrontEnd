import { ApiService } from './api';
import type { 
  Case, 
  Task,
  CreateCaseForm, 
  ApiResponse 
} from '../types';

/**
 * Alert Detection Service
 * This service provides methods specifically aligned with your backend API structure
 */
export class AlertDetectionService {
  
  // ==================== CASE MANAGEMENT ====================
  
  /**
   * Create a new case
   * Matches: POST /api/cases/create
   */
  static async createCase(caseData: CreateCaseForm): Promise<ApiResponse<Case>> {
    return ApiService.post<Case>('/api/cases/create', caseData);
  }

  /**
   * Get all cases
   * Matches: GET /api/cases
   */
  static async getAllCases(): Promise<ApiResponse<Case[]>> {
    return ApiService.get<Case[]>('/api/cases');
  }

  /**
   * Get case by ID
   * Matches: GET /api/cases/{caseId}
   */
  static async getCaseById(caseId: string): Promise<ApiResponse<Case>> {
    return ApiService.get<Case>(`/api/cases/${caseId}`);
  }

  /**
   * Update case status
   * Matches: PUT /api/cases/{caseId}/status
   */
  static async updateCaseStatus(
    caseId: string, 
    status: string, 
    comment?: string
  ): Promise<ApiResponse<Case>> {
    return ApiService.put<Case>(`/api/cases/${caseId}/status`, { status, comment });
  }

  /**
   * Get cases by status
   * Matches: GET /api/cases/by-status/{status}
   */
  static async getCasesByStatus(status: string): Promise<ApiResponse<Case[]>> {
    return ApiService.get<Case[]>(`/api/cases/by-status/${status}`);
  }

  // ==================== TASK MANAGEMENT ====================

  /**
   * Get my tasks
   * Matches: GET /api/tasks/my/{assignee}
   */
  static async getMyTasks(assignee: string): Promise<ApiResponse<Task[]>> {
    return ApiService.get<Task[]>(`/api/tasks/my/${assignee}`);
  }

  /**
   * Get group tasks
   * Matches: GET /api/tasks/group/{groupId}
   */
  static async getGroupTasks(groupId: string): Promise<ApiResponse<Task[]>> {
    return ApiService.get<Task[]>(`/api/tasks/group/${groupId}`);
  }

  /**
   * Get task by ID
   * Matches: GET /api/tasks/{taskId}
   */
  static async getTaskById(taskId: string): Promise<ApiResponse<Task>> {
    return ApiService.get<Task>(`/api/tasks/${taskId}`);
  }

  /**
   * Get tasks by case
   * Matches: GET /api/tasks/by-case/{caseId}
   */
  static async getTasksByCase(caseId: string): Promise<ApiResponse<Task[]>> {
    return ApiService.get<Task[]>(`/api/tasks/by-case/${caseId}`);
  }

  /**
   * Assign task
   * Matches: POST /api/tasks/assign
   */
  static async assignTask(
    taskId: string, 
    assignee: string, 
    comment?: string
  ): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>('/api/tasks/assign', { taskId, assignee, comment });
  }

  /**
   * Complete task
   * Matches: POST /api/tasks/complete
   */
  static async completeTask(
    taskId: string, 
    variables: Record<string, any>
  ): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>('/api/tasks/complete', { taskId, variables });
  }

  /**
   * Create task
   * Matches: POST /api/tasks/create
   */
  static async createTask(taskData: {
    taskName: string;
    assignee: string;
    status: string;
    caseId: string;
  }): Promise<ApiResponse<Task>> {
    return ApiService.post<Task>('/api/tasks/create', taskData);
  }

  // ==================== HELPER METHODS ====================

  /**
   * Get dashboard summary data
   * This combines multiple API calls to provide dashboard overview
   */
  static async getDashboardSummary(): Promise<{
    totalCases: number;
    draftCases: number;
    underInvestigationCases: number;
    pendingApprovalCases: number;
    closedCases: number;
    rejectedCases: number;
  }> {
    try {
      const [
        allCases,
        draftCases,
        underInvestigationCases,
        pendingApprovalCases,
        closedCases,
        rejectedCases
      ] = await Promise.all([
        this.getAllCases(),
        this.getCasesByStatus('DRAFT'),
        this.getCasesByStatus('UNDER_INVESTIGATION'),
        this.getCasesByStatus('PENDING_APPROVAL'),
        this.getCasesByStatus('CLOSED'),
        this.getCasesByStatus('REJECTED')
      ]);

      return {
        totalCases: allCases.data?.length || 0,
        draftCases: draftCases.data?.length || 0,
        underInvestigationCases: underInvestigationCases.data?.length || 0,
        pendingApprovalCases: pendingApprovalCases.data?.length || 0,
        closedCases: closedCases.data?.length || 0,
        rejectedCases: rejectedCases.data?.length || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  /**
   * Get user workload summary
   */
  static async getUserWorkload(assignee: string): Promise<{
    myTasks: Task[];
    taskCount: number;
    pendingTasks: number;
    inProgressTasks: number;
    completedTasks: number;
  }> {
    try {
      const myTasksResponse = await this.getMyTasks(assignee);
      const myTasks = myTasksResponse.data || [];

      return {
        myTasks,
        taskCount: myTasks.length,
        pendingTasks: myTasks.filter(task => task.status === 'PENDING').length,
        inProgressTasks: myTasks.filter(task => task.status === 'IN_PROGRESS').length,
        completedTasks: myTasks.filter(task => task.status === 'COMPLETED').length
      };
    } catch (error) {
      console.error('Error fetching user workload:', error);
      throw error;
    }
  }

  /**
   * Quick case status update with predefined comments
   */
  static async quickStatusUpdate(caseId: string, newStatus: string): Promise<ApiResponse<Case>> {
    const statusComments = {
      'READY_FOR_ASSIGNMENT': 'Case is ready for assignment',
      'UNDER_INVESTIGATION': 'Investigation started',
      'PENDING_APPROVAL': 'Case submitted for approval',
      'CLOSED': 'Case investigation completed',
      'REJECTED': 'Case rejected after review'
    };

    const comment = statusComments[newStatus as keyof typeof statusComments] || `Status updated to ${newStatus}`;
    
    return this.updateCaseStatus(caseId, newStatus, comment);
  }
}
