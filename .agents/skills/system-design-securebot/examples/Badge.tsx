'use client';

import React from 'react';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════
   Badge Component — SecureBot Lab Design System
   Status indicators, labels, and notification counts
   ═══════════════════════════════════════════════════ */

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'brand' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-status-successBg text-status-success',
  danger:  'bg-status-dangerBg text-status-danger',
  warning: 'bg-status-warningBg text-status-warning',
  info:    'bg-status-infoBg text-status-info',
  brand:   'bg-brand-50 text-brand-600',
  neutral: 'bg-surface-hover text-text-secondary',
};

const dotColors: Record<BadgeVariant, string> = {
  success: 'bg-status-success',
  danger:  'bg-status-danger',
  warning: 'bg-status-warning',
  info:    'bg-status-info',
  brand:   'bg-brand-500',
  neutral: 'bg-text-muted',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({
  variant = 'brand',
  size = 'md',
  dot = false,
  icon,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-badge font-medium whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])}
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/* ─── Notification Badge (numeric) ─── */
export interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

export function NotificationBadge({ count, max = 99, className }: NotificationBadgeProps) {
  const display = count > max ? `${max}+` : String(count);

  if (count <= 0) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center min-w-[18px] h-[18px] px-1',
        'rounded-full text-[10px] font-bold bg-status-danger text-white',
        className,
      )}
    >
      {display}
    </span>
  );
}

Badge.displayName = 'Badge';
NotificationBadge.displayName = 'NotificationBadge';
export default Badge;
