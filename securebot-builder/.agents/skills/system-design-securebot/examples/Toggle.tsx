'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════
   Toggle / Switch Component — SecureBot Lab Design System
   On/off toggle switch matching the reference design
   ═══════════════════════════════════════════════════ */

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

const sizeConfig = {
  sm: {
    track: 'w-8 h-[18px]',
    thumb: 'w-3.5 h-3.5',
    translate: 14,
  },
  md: {
    track: 'w-10 h-[22px]',
    thumb: 'w-[18px] h-[18px]',
    translate: 18,
  },
  lg: {
    track: 'w-12 h-[26px]',
    thumb: 'w-[22px] h-[22px]',
    translate: 22,
  },
};

export function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
  id,
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-') || 'toggle';
  const { track, thumb, translate } = sizeConfig[size];

  const handleToggle = () => {
    if (disabled) return;
    const newValue = !isChecked;
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Toggle switch */}
      <button
        id={toggleId}
        role="switch"
        type="button"
        aria-checked={isChecked}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'relative inline-flex items-center rounded-full p-0.5 cursor-pointer',
          'transition-colors duration-200 ease-out',
          'focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          track,
          isChecked ? 'bg-brand-500' : 'bg-border',
        )}
      >
        <motion.span
          className={cn(
            'rounded-full bg-white shadow-sm',
            thumb,
          )}
          animate={{ x: isChecked ? translate : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>

      {/* Label + Description */}
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={toggleId}
              className={cn(
                'text-sm font-medium cursor-pointer select-none',
                disabled ? 'text-text-muted' : 'text-text-primary',
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-xs text-text-muted mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

Toggle.displayName = 'Toggle';
export default Toggle;
