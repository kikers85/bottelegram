'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════
   Card Component — SecureBot Lab Design System
   ═══════════════════════════════════════════════════ */

export interface CardProps {
  variant?: 'default' | 'stat' | 'feature' | 'event';
  gradient?: 'blue' | 'green' | 'purple' | 'orange' | 'cyan';
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}

const gradientStyles: Record<string, string> = {
  blue:   'gradient-blue',
  green:  'gradient-green',
  purple: 'gradient-purple',
  orange: 'gradient-orange',
  cyan:   'gradient-cyan',
};

const paddingStyles: Record<string, string> = {
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function Card({
  variant = 'default',
  gradient,
  hoverable = false,
  padding = 'md',
  className,
  children,
}: CardProps) {
  const isFeature = variant === 'feature' && gradient;

  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable
    ? {
        whileHover: { y: -3, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)' },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Component
      className={cn(
        'rounded-card overflow-hidden',
        isFeature
          ? gradientStyles[gradient]
          : 'bg-surface-card border border-border-light shadow-card',
        hoverable && 'cursor-pointer',
        paddingStyles[padding],
        className,
      )}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

Card.displayName = 'Card';

/* ─── Card Sub-components ─── */

export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn('font-body text-base font-semibold text-text-primary', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn('font-body text-sm text-text-secondary', className)}>
      {children}
    </p>
  );
}

export default Card;
