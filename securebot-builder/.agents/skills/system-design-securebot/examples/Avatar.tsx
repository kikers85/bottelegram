'use client';

import React from 'react';
import { cn } from '../lib/cn';
import { User } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Avatar Component — SecureBot Lab Design System
   User/group avatars with fallback initials and status
   ═══════════════════════════════════════════════════ */

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  badge?: string;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const statusSizeStyles: Record<AvatarSize, string> = {
  xs: 'w-2 h-2 border',
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
};

const statusColors: Record<AvatarStatus, string> = {
  online:  'bg-status-success',
  offline: 'bg-text-muted',
  away:    'bg-status-warning',
  busy:    'bg-status-danger',
};

function getInitials(name?: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  status,
  badge,
  className,
}: AvatarProps) {
  const initials = getInitials(name);
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;

  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {/* Avatar circle */}
      {showImage ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          onError={() => setImgError(true)}
          className={cn(
            'rounded-full object-cover border-2 border-surface-card shadow-sm',
            sizeStyles[size],
          )}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-bold',
            'bg-brand-100 text-brand-600 border-2 border-surface-card',
            sizeStyles[size],
          )}
          aria-label={name || 'User avatar'}
        >
          {initials || <User className="w-1/2 h-1/2" />}
        </div>
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-surface-card',
            statusSizeStyles[size],
            statusColors[status],
          )}
          aria-label={`Status: ${status}`}
        />
      )}

      {/* Badge (e.g. "PRO") */}
      {badge && (
        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold bg-status-success text-white rounded-full leading-none">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ─── Avatar Group (stacked) ─── */
export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({ avatars, max = 5, size = 'sm', className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((avatar, i) => (
        <Avatar key={i} {...avatar} size={size} />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-bold',
            'bg-surface-hover text-text-muted border-2 border-surface-card',
            sizeStyles[size],
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';
export default Avatar;
