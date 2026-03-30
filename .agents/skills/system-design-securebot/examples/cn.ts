import { clsx, type ClassValue } from 'clsx';

/**
 * Utility for merging Tailwind CSS classes conditionally.
 * Combines clsx for conditional logic.
 *
 * Usage:
 *   cn('base-class', variant === 'primary' && 'bg-brand-500', className)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
