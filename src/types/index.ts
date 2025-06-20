import { CASE_TYPES, CASE_STATUS, TASK_STATUS, TASK_TYPES, USER_ROLES, PRIORITY_LEVELS, TYPOLOGIES } from '../utils/constants';

// Base Entity
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

// User Interface
export interface User extends BaseEntity {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: keyof typeof USER_ROLES;
  department: string;
  isActive: boolean;
  lastLogin?: string;
}

// Case Interface
// Case Interface - Updated to match backend
export interface Case extends BaseEntity {
  id: string;
  caseNumber: string;
  caseType: keyof typeof CASE_TYPES;
  priority: keyof typeof PRIORITY_LEVELS;
  status: keyof typeof CASE_STATUS;
  description: string;
  riskScore?: number;
  entity?: string;
  alertId?: string;
  typology?: keyof typeof TYPOLOGIES;
  processInstanceId?: string;
  assignedTo?: string;
  assignedToUser?: User;
  supervisorId?: string;
  supervisor?: User;
  dueDate?: string;
  comments: Comment[];
  auditTrail: AuditEntry[];
  tags: string[];
  relatedCases: string[];
}

// Customer Interface
export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  customerType: 'INDIVIDUAL' | 'CORPORATE';
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  country: string;
  industry?: string;
  onboardingDate: string;
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
}

// Task Interface
export interface Task extends BaseEntity {
  taskId: string;
  title: string;
  description: string;
  type: keyof typeof TASK_TYPES;
  status: keyof typeof TASK_STATUS;
  priority: keyof typeof PRIORITY_LEVELS;
  caseId: string;
  case?: Case;  assignedTo?: string;
  assignedToUser?: User;
  assignedGroup?: string;
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  variables: Record<string, any>;
  comments: Comment[];
}

// Comment Interface
export interface Comment extends BaseEntity {
  content: string;
  author: string;
  authorUser?: User;
  caseId?: string;
  taskId?: string;
  isInternal: boolean;
  mentionedUsers: string[];
}

// Audit Entry Interface
export interface AuditEntry extends BaseEntity {
  entityType: 'CASE' | 'TASK' | 'USER';
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'ASSIGN' | 'COMPLETE';
  oldValue?: any;
  newValue?: any;
  field?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  overdueItems: number;
  myTasks: number;
  myActiveCases: number;
  averageResolutionTime: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  casesByType: {
    aml: number;
    fraud: number;
    sanctions: number;
  };
  monthlyTrends: {
    month: string;
    cases: number;
    resolved: number;
  }[];
}

// Recent Activity
export interface RecentActivity {
  id: string;
  type: 'CASE_CREATED' | 'CASE_UPDATED' | 'TASK_COMPLETED' | 'CASE_ASSIGNED' | 'STATUS_CHANGED';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  userName?: string;
  caseId?: string;
  taskId?: string;
  metadata?: Record<string, any>;
}

// Notification Interface
export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  priority: keyof typeof PRIORITY_LEVELS;
}

// Search and Filter Interfaces
export interface CaseFilters {
  status?: (keyof typeof CASE_STATUS)[];
  type?: (keyof typeof CASE_TYPES)[];
  assignedTo?: string[];
  priority?: (keyof typeof PRIORITY_LEVELS)[];
  riskScore?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  search?: string;
}

export interface TaskFilters {
  status?: (keyof typeof TASK_STATUS)[];
  type?: (keyof typeof TASK_TYPES)[];
  assignedTo?: string[];
  priority?: (keyof typeof PRIORITY_LEVELS)[];
  dueDate?: {
    start: string;
    end: string;
  };
  caseId?: string;
  search?: string;
}

// Sort Configuration
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

// Pagination
export interface Pagination {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}

// Form Types - Updated to match backend API
export interface CreateCaseForm {
  // Required for complete cases
  caseType?: keyof typeof CASE_TYPES;
  priority?: keyof typeof PRIORITY_LEVELS;
  description: string;
  riskScore?: number;
  
  // Optional fields
  entity?: string;
  alertId?: string;
  typology?: keyof typeof TYPOLOGIES;
}

export interface UpdateCaseForm extends Partial<CreateCaseForm> {
  status?: keyof typeof CASE_STATUS;
  comment?: string;
}

export interface CreateTaskForm {
  taskName: string;
  assignee: string;
  status: keyof typeof TASK_STATUS;
  caseId: string;
}

export interface CompleteTaskForm {
  taskId: string;
  variables: Record<string, any>;
}

// Component Props Types
export interface CaseCardProps {
  case: Case;
  onSelect?: (caseId: string) => void;
  onStatusChange?: (caseId: string, status: keyof typeof CASE_STATUS) => void;
  showActions?: boolean;
}

export interface TaskCardProps {
  task: Task;
  onSelect?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: keyof typeof TASK_STATUS) => void;
  onClaim?: (taskId: string) => void;
  showActions?: boolean;
}

export interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

// Navigation and Layout Types
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}
