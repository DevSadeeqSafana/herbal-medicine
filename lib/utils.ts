/**
 * Utility functions for the application
 */

/**
 * Format currency with proper decimal places
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'NGN')
 * @returns Formatted currency string with 2 decimal places
 */
export function formatCurrency(amount: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get user-friendly payment status label
 * @param status - The payment status from database
 * @returns User-friendly status label
 */
export function getPaymentStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    COMPLETED: 'Successful',
    PENDING: 'Pending',
    FAILED: 'Failed',
    PROCESSING: 'Processing',
    CANCELLED: 'Cancelled',
    // Legacy support for old status values
    SUCCESS: 'Successful',
  };

  return statusMap[status] || status;
}

/**
 * Get payment status badge color class
 * @param status - The payment status from database
 * @returns Tailwind CSS class for status badge
 */
export function getPaymentStatusBadge(status: string): string {
  switch (status) {
    case 'COMPLETED':
    case 'SUCCESS':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'FAILED':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PROCESSING':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}
