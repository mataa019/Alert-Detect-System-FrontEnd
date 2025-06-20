import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { CASE_STATUS, PRIORITY_LEVELS, RISK_THRESHOLDS, DATE_FORMATS } from './constants';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Generate case number with auto-increment
export function generateCaseNumber(year: number = new Date().getFullYear(), sequence: number): string {
  return `CASE-${year}-${sequence.toString().padStart(4, '0')}`;
}

// Format dates for display
export function formatDate(date: string | Date, formatType: keyof typeof DATE_FORMATS = 'DISPLAY'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return format(dateObj, DATE_FORMATS[formatType]);
  } catch {
    return 'Invalid Date';
  }
}

// Get relative time (e.g., "2 hours ago")
export function getRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid Date';
  }
}

// Determine risk level based on score
export function getRiskLevel(score: number): keyof typeof PRIORITY_LEVELS {
  if (score >= RISK_THRESHOLDS.CRITICAL) return 'CRITICAL';
  if (score >= RISK_THRESHOLDS.HIGH) return 'HIGH';
  if (score >= RISK_THRESHOLDS.MEDIUM) return 'MEDIUM';
  return 'LOW';
}

// Get risk color based on score
export function getRiskColor(score: number): string {
  const level = getRiskLevel(score);
  const colors = {
    LOW: 'text-green-600 bg-green-50',
    MEDIUM: 'text-yellow-600 bg-yellow-50',
    HIGH: 'text-orange-600 bg-orange-50',
    CRITICAL: 'text-red-600 bg-red-50'
  };
  return colors[level];
}

// Check if case requires supervisor approval
export function requiresApproval(riskScore: number): boolean {
  return riskScore >= RISK_THRESHOLDS.HIGH;
}

// Get status progression - Updated to match backend case statuses
export function getNextStatus(currentStatus: keyof typeof CASE_STATUS): keyof typeof CASE_STATUS | null {
  const progression = {
    [CASE_STATUS.DRAFT]: CASE_STATUS.READY_FOR_ASSIGNMENT,
    [CASE_STATUS.READY_FOR_ASSIGNMENT]: CASE_STATUS.UNDER_INVESTIGATION,
    [CASE_STATUS.UNDER_INVESTIGATION]: CASE_STATUS.PENDING_APPROVAL,
    [CASE_STATUS.PENDING_APPROVAL]: CASE_STATUS.CLOSED,
    [CASE_STATUS.CLOSED]: null,
    [CASE_STATUS.REJECTED]: null
  };
  return progression[currentStatus] || null;
}

// Validate case data - Updated to match backend requirements
export function validateCaseData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Only description is required for creating a case
  if (!data.description?.trim()) {
    errors.push('Case description is required');
  }
  
  // Optional validation for risk score if provided
  if (data.riskScore !== undefined && data.riskScore !== null && (data.riskScore < 0 || data.riskScore > 100)) {
    errors.push('Risk score must be between 0 and 100');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Sort array by multiple criteria
export function multiSort<T>(
  array: T[],
  sortConfig: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
}