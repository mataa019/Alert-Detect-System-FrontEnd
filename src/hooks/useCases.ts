import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CaseService } from '../services/caseService';
import type { 
  CreateCaseForm, 
  UpdateCaseForm, 
  CaseFilters, 
  SortConfig
} from '../types';

// Query keys
export const caseKeys = {
  all: ['cases'] as const,
  lists: () => [...caseKeys.all, 'list'] as const,
  list: (filters?: CaseFilters, sort?: SortConfig, page?: number) => 
    [...caseKeys.lists(), { filters, sort, page }] as const,
  details: () => [...caseKeys.all, 'detail'] as const,
  detail: (id: string) => [...caseKeys.details(), id] as const,
  myCases: () => [...caseKeys.all, 'my'] as const,
  approval: () => [...caseKeys.all, 'approval'] as const,
  comments: (caseId: string) => [...caseKeys.detail(caseId), 'comments'] as const,
  audit: (caseId: string) => [...caseKeys.detail(caseId), 'audit'] as const,
  related: (caseId: string) => [...caseKeys.detail(caseId), 'related'] as const,
  statistics: () => [...caseKeys.all, 'statistics'] as const,
};

// Get cases with pagination and filtering
export function useCases(
  filters?: CaseFilters,
  sort?: SortConfig,
  page: number = 1,
  size: number = 20
) {
  return useQuery({
    queryKey: caseKeys.list(filters, sort, page),
    queryFn: () => CaseService.getCases(filters, sort, page, size),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get case by ID
export function useCase(id: string) {
  return useQuery({
    queryKey: caseKeys.detail(id),
    queryFn: () => CaseService.getCaseById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get my cases
export function useMyCases(page: number = 1, size: number = 20, status?: string[]) {
  return useQuery({
    queryKey: [...caseKeys.myCases(), { page, size, status }],
    queryFn: () => CaseService.getMyCases(page, size, status),
    staleTime: 2 * 60 * 1000,
  });
}

// Get cases for approval
export function useCasesForApproval(page: number = 1, size: number = 20) {
  return useQuery({
    queryKey: [...caseKeys.approval(), { page, size }],
    queryFn: () => CaseService.getCasesForApproval(page, size),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

// Get case comments
export function useCaseComments(caseId: string) {
  return useQuery({
    queryKey: caseKeys.comments(caseId),
    queryFn: () => CaseService.getCaseComments(caseId),
    enabled: !!caseId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Get case audit trail
export function useCaseAuditTrail(caseId: string) {
  return useQuery({
    queryKey: caseKeys.audit(caseId),
    queryFn: () => CaseService.getCaseAuditTrail(caseId),
    enabled: !!caseId,
    staleTime: 2 * 60 * 1000,
  });
}

// Get related cases
export function useRelatedCases(caseId: string) {
  return useQuery({
    queryKey: caseKeys.related(caseId),
    queryFn: () => CaseService.getRelatedCases(caseId),
    enabled: !!caseId,
    staleTime: 5 * 60 * 1000,
  });
}

// Get case statistics
export function useCaseStatistics(dateRange?: { start: string; end: string }) {
  return useQuery({
    queryKey: [...caseKeys.statistics(), dateRange],
    queryFn: () => CaseService.getCaseStatistics(dateRange),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Mutations
export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCaseForm) => CaseService.createCase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.statistics() });
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCaseForm }) =>
      CaseService.updateCase(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
    },
  });
}

export function useDeleteCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => CaseService.deleteCase(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.statistics() });
    },
  });
}

export function useChangeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, comments }: { id: string; status: string; comments?: string }) =>
      CaseService.changeStatus(id, status, comments),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.audit(id) });
    },
  });
}

export function useAssignCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, assigneeId, comments }: { id: string; assigneeId: string; comments?: string }) =>
      CaseService.assignCase(id, assigneeId, comments),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.audit(id) });
    },  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      caseId, 
      content, 
      isInternal, 
      mentionedUsers 
    }: { 
      caseId: string; 
      content: string; 
      isInternal?: boolean; 
      mentionedUsers?: string[] 
    }) => CaseService.addComment(caseId, content, isInternal, mentionedUsers),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.comments(caseId) });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      caseId, 
      commentId, 
      content 
    }: { 
      caseId: string; 
      commentId: string; 
      content: string 
    }) => CaseService.updateComment(caseId, commentId, content),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.comments(caseId) });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, commentId }: { caseId: string; commentId: string }) =>
      CaseService.deleteComment(caseId, commentId),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.comments(caseId) });
    },
  });
}

export function useApproveCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) =>
      CaseService.approveCase(id, comments),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.approval() });
      queryClient.invalidateQueries({ queryKey: caseKeys.audit(id) });
    },
  });
}

export function useRejectCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      CaseService.rejectCase(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.approval() });
      queryClient.invalidateQueries({ queryKey: caseKeys.audit(id) });
    },
  });
}

export function useLinkCases() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, relatedCaseIds }: { caseId: string; relatedCaseIds: string[] }) =>
      CaseService.linkCases(caseId, relatedCaseIds),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.related(caseId) });
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(caseId) });
    },
  });
}

export function useUnlinkCases() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ caseId, relatedCaseIds }: { caseId: string; relatedCaseIds: string[] }) =>
      CaseService.unlinkCases(caseId, relatedCaseIds),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: caseKeys.related(caseId) });
      queryClient.invalidateQueries({ queryKey: caseKeys.detail(caseId) });
    },
  });
}

// Bulk operations
export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      caseIds, 
      status, 
      comments 
    }: { 
      caseIds: string[]; 
      status: string; 
      comments?: string 
    }) => CaseService.bulkUpdateStatus(caseIds, status, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.statistics() });
    },
  });
}

export function useBulkAssign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      caseIds, 
      assigneeId, 
      comments 
    }: { 
      caseIds: string[]; 
      assigneeId: string; 
      comments?: string 
    }) => CaseService.bulkAssign(caseIds, assigneeId, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
    },
  });
}

export function useBulkDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (caseIds: string[]) => CaseService.bulkDelete(caseIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: caseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: caseKeys.statistics() });
    },
  });
}