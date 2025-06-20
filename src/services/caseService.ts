import { ApiService } from './api';
import type { 
  Case, 
  CreateCaseForm, 
  UpdateCaseForm, 
  CaseFilters, 
  SortConfig,
  ApiResponse, 
  PaginatedResponse,
  Comment,
  AuditEntry
} from '../types';

export class CaseService {
  // Get all cases with filtering and pagination
  static async getCases(
    filters?: CaseFilters,
    sort?: SortConfig,
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Case>> {
    const params = {
      page: page - 1, // Backend uses 0-based indexing
      size,
      ...(sort && { sort: `${sort.field},${sort.direction}` }),
      ...(filters?.status && { status: filters.status.join(',') }),
      ...(filters?.type && { type: filters.type.join(',') }),
      ...(filters?.assignedTo && { assignedTo: filters.assignedTo.join(',') }),
      ...(filters?.priority && { priority: filters.priority.join(',') }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.riskScore && { 
        riskScoreMin: filters.riskScore.min,
        riskScoreMax: filters.riskScore.max
      }),
      ...(filters?.dateRange && {
        startDate: filters.dateRange.start,
        endDate: filters.dateRange.end
      }),
      ...(filters?.tags && { tags: filters.tags.join(',') })
    };

    return ApiService.getPaginated<Case>('/api/cases', params);
  }

  // Get case by ID
  static async getCaseById(id: string): Promise<ApiResponse<Case>> {
    return ApiService.get<Case>(`/api/cases/${id}`);
  }
  // Create new case
  static async createCase(caseData: CreateCaseForm): Promise<ApiResponse<Case>> {
    return ApiService.post<Case>('/api/cases/create', caseData);
  }

  // Update case
  static async updateCase(id: string, caseData: UpdateCaseForm): Promise<ApiResponse<Case>> {
    return ApiService.put<Case>(`/api/cases/${id}`, caseData);
  }

  // Delete case
  static async deleteCase(id: string): Promise<ApiResponse<void>> {
    return ApiService.delete<void>(`/api/cases/${id}`);
  }
  // Change case status
  static async changeStatus(id: string, status: string, comment?: string): Promise<ApiResponse<Case>> {
    return ApiService.put<Case>(`/api/cases/${id}/status`, { status, comment });
  }
  // Assign case
  static async assignCase(id: string, assigneeId: string, comments?: string): Promise<ApiResponse<Case>> {
    return ApiService.patch<Case>(`/api/cases/${id}/assign`, { assigneeId, comments });
  }

  // Get cases by status
  static async getCasesByStatus(status: string): Promise<ApiResponse<Case[]>> {
    return ApiService.get<Case[]>(`/api/cases/by-status/${status}`);
  }

  // Get case comments
  static async getCaseComments(caseId: string): Promise<ApiResponse<Comment[]>> {
    return ApiService.get<Comment[]>(`/api/cases/${caseId}/comments`);
  }

  // Add comment
  static async addComment(
    caseId: string, 
    content: string, 
    isInternal: boolean = false,
    mentionedUsers: string[] = []
  ): Promise<ApiResponse<Comment>> {
    return ApiService.post<Comment>(`/api/cases/${caseId}/comments`, {
      content,
      isInternal,
      mentionedUsers
    });
  }

  // Update comment
  static async updateComment(
    caseId: string, 
    commentId: string, 
    content: string
  ): Promise<ApiResponse<Comment>> {
    return ApiService.put<Comment>(`/api/cases/${caseId}/comments/${commentId}`, { content });
  }

  // Delete comment
  static async deleteComment(caseId: string, commentId: string): Promise<ApiResponse<void>> {
    return ApiService.delete<void>(`/api/cases/${caseId}/comments/${commentId}`);
  }

  // Get case audit trail
  static async getCaseAuditTrail(caseId: string): Promise<ApiResponse<AuditEntry[]>> {
    return ApiService.get<AuditEntry[]>(`/api/cases/${caseId}/audit`);
  }

  // Get my cases (assigned to current user)
  static async getMyCases(
    page: number = 1,
    size: number = 20,
    status?: string[]
  ): Promise<PaginatedResponse<Case>> {
    const params = {
      page: page - 1,
      size,
      assignedToMe: true,
      ...(status && { status: status.join(',') })
    };

    return ApiService.getPaginated<Case>('/api/cases', params);
  }

  // Get cases requiring approval
  static async getCasesForApproval(
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Case>> {
    const params = {
      page: page - 1,
      size,
      status: 'PENDING_APPROVAL',
      requiresApproval: true
    };

    return ApiService.getPaginated<Case>('/api/cases', params);
  }

  // Approve case
  static async approveCase(id: string, comments?: string): Promise<ApiResponse<Case>> {
    return ApiService.post<Case>(`/api/cases/${id}/approve`, { comments });
  }

  // Reject case
  static async rejectCase(id: string, reason: string): Promise<ApiResponse<Case>> {
    return ApiService.post<Case>(`/api/cases/${id}/reject`, { reason });
  }

  // Get related cases
  static async getRelatedCases(caseId: string): Promise<ApiResponse<Case[]>> {
    return ApiService.get<Case[]>(`/api/cases/${caseId}/related`);
  }

  // Link cases
  static async linkCases(caseId: string, relatedCaseIds: string[]): Promise<ApiResponse<void>> {
    return ApiService.post<void>(`/api/cases/${caseId}/link`, { relatedCaseIds });
  }

  // Unlink cases
  static async unlinkCases(caseId: string, relatedCaseIds: string[]): Promise<ApiResponse<void>> {
    return ApiService.post<void>(`/api/cases/${caseId}/unlink`, { relatedCaseIds });
  }

  // Export case
  static async exportCase(caseId: string, format: 'PDF' | 'EXCEL'): Promise<void> {
    return ApiService.download(`/api/cases/${caseId}/export?format=${format}`, `case-${caseId}.${format.toLowerCase()}`);
  }

  // Bulk operations
  static async bulkUpdateStatus(caseIds: string[], status: string, comments?: string): Promise<ApiResponse<void>> {
    return ApiService.post<void>('/api/cases/bulk/status', { caseIds, status, comments });
  }

  static async bulkAssign(caseIds: string[], assigneeId: string, comments?: string): Promise<ApiResponse<void>> {
    return ApiService.post<void>('/api/cases/bulk/assign', { caseIds, assigneeId, comments });
  }

  static async bulkDelete(caseIds: string[]): Promise<ApiResponse<void>> {
    return ApiService.post<void>('/api/cases/bulk/delete', { caseIds });
  }

  // Search cases
  static async searchCases(
    query: string,
    filters?: Partial<CaseFilters>,
    page: number = 1,
    size: number = 20
  ): Promise<PaginatedResponse<Case>> {
    const params = {
      q: query,
      page: page - 1,
      size,
      ...filters
    };

    return ApiService.getPaginated<Case>('/api/cases/search', params);
  }

  // Get case statistics
  static async getCaseStatistics(dateRange?: { start: string; end: string }): Promise<ApiResponse<any>> {
    const params = dateRange ? { startDate: dateRange.start, endDate: dateRange.end } : {};
    return ApiService.get<any>('/api/cases/statistics', params);  }
}