'use client';

import React from 'react';
import { cn } from '../lib/cn';
import { Search, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Input Component — SecureBot Lab Design System
   Text input, search, password, textarea variants
   ═══════════════════════════════════════════════════ */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'search' | 'ghost';
  fullWidth?: boolean;
}

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
};

export function Input({
  label,
  helperText,
  error,
  success,
  icon,
  size = 'md',
  variant = 'default',
  fullWidth = true,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const hasIcon = !!icon || variant === 'search';

  return (
    <div className={cn(fullWidth ? 'w-full' : 'w-auto', className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Icon */}
        {hasIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {variant === 'search' ? <Search className="w-4 h-4" /> : icon}
          </span>
        )}

        <input
          id={inputId}
          className={cn(
            'w-full rounded-input border bg-surface-card',
            'font-body text-text-primary placeholder:text-text-muted',
            'focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none',
            'transition-all duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-hover',
            sizeStyles[size],
            hasIcon && 'pl-9',
            error
              ? 'border-status-danger focus:border-status-danger focus:ring-red-100'
              : success
                ? 'border-status-success focus:border-status-success focus:ring-emerald-100'
                : 'border-border-light',
            variant === 'ghost' && 'border-transparent bg-transparent hover:bg-surface-hover focus:bg-surface-card',
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {/* Status icon */}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-status-danger" />
        )}
        {success && !error && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-status-success" />
        )}
      </div>

      {/* Helper / Error text */}
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-status-danger" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-text-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}

/* ─── Password Input ─── */
export function PasswordInput(props: Omit<InputProps, 'type'>) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? 'text' : 'password'} />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary transition-colors"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

/* ─── Textarea ─── */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-input border border-border-light bg-surface-card',
          'px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted',
          'focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none',
          'transition-all duration-150 resize-y min-h-[80px]',
          error && 'border-status-danger focus:border-status-danger focus:ring-red-100',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-status-danger">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-xs text-text-muted">{helperText}</p>}
    </div>
  );
}

Input.displayName = 'Input';
PasswordInput.displayName = 'PasswordInput';
Textarea.displayName = 'Textarea';
export default Input;
