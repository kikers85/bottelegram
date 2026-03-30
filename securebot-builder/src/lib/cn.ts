import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes using clsx and tailwind-merge.
 * This ensures that conflicting classes (e.g., 'p-2 p-4') are handled correctly
 * while maintaining conditional logic support.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
