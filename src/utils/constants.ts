// Case Types
export const CASE_TYPES = {
  FRAUD_DETECTION: 'FRAUD_DETECTION',
  AML: 'AML',
  SANCTIONS: 'SANCTIONS'
} as const;

// Case Status
export const CASE_STATUS = {
  DRAFT: 'DRAFT',
  READY_FOR_ASSIGNMENT: 'READY_FOR_ASSIGNMENT',
  UNDER_INVESTIGATION: 'UNDER_INVESTIGATION',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED'
} as const;

// Task Status
export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;

// Task Types
export const TASK_TYPES = {
  APPROVAL: 'APPROVAL',
  INVESTIGATION: 'INVESTIGATION',
  REVIEW: 'REVIEW',
  DOCUMENTATION: 'DOCUMENTATION'
} as const;

// User Roles
export const USER_ROLES = {
  INVESTIGATOR: 'INVESTIGATOR',
  SUPERVISOR: 'SUPERVISOR',
  MANAGER: 'MANAGER',
  ANALYST: 'ANALYST'
} as const;

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
} as const;

// Risk Score Thresholds
export const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 90
} as const;

// Status Colors
export const STATUS_COLORS = {
  [CASE_STATUS.DRAFT]: 'bg-gray-100 text-gray-800',
  [CASE_STATUS.READY_FOR_ASSIGNMENT]: 'bg-blue-100 text-blue-800',
  [CASE_STATUS.PENDING_APPROVAL]: 'bg-yellow-100 text-yellow-800',
  [CASE_STATUS.UNDER_INVESTIGATION]: 'bg-orange-100 text-orange-800',
  [CASE_STATUS.CLOSED]: 'bg-green-100 text-green-800',
  [CASE_STATUS.REJECTED]: 'bg-red-100 text-red-800'
} as const;

// Priority Colors
export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.LOW]: 'bg-green-100 text-green-800',
  [PRIORITY_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [PRIORITY_LEVELS.HIGH]: 'bg-orange-100 text-orange-800',
  [PRIORITY_LEVELS.CRITICAL]: 'bg-red-100 text-red-800'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  CASES: '/api/cases',
  TASKS: '/api/tasks',
  USERS: '/api/users',
  DASHBOARD: '/api/dashboard',
  AUDIT: '/api/audit'
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  FULL: 'EEEE, MMMM dd, yyyy'
} as const;

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CASES: '/cases',
  CASE_DETAILS: '/cases/:id',
  TASKS: '/tasks',
  CREATE_CASE: '/cases/create',
  PROFILE: '/profile',
  AUDIT: '/audit'
} as const;