'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { ArrowRight, Loader2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Button Component — SecureBot Lab Design System
   ═══════════════════════════════════════════════════ */

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:   'bg-brand-500 text-white shadow-btn hover:bg-brand-600 hover:shadow-btn-hover active:scale-[0.98]',
  secondary: 'bg-surface-card text-text-primary border border-border-light shadow-btn hover:bg-surface-hover hover:border-border',
  ghost:     'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
  link:      'text-brand-500 hover:text-brand-600 p-0 h-auto',
  danger:    'bg-status-danger text-white hover:bg-red-600 active:scale-[0.98]',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-btn',
  lg: 'px-6 py-3 text-base rounded-btn',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isLink = variant === 'link';

  return (
    <motion.button
      whileTap={!isLink ? { scale: 0.97 } : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-body font-medium',
        'transition-all duration-200 ease-out',
        'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantStyles[variant],
        !isLink && sizeStyles[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
      {isLink && !icon && (
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      )}
    </motion.button>
  );
}

Button.displayName = 'Button';
export default Button;
