'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   StatCard Component — SecureBot Lab Design System
   Displays a statistic with trend indicator
   ═══════════════════════════════════════════════════ */

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

const trendConfig = {
  up: {
    color: 'text-status-success',
    bg: 'bg-status-successBg',
    Icon: TrendingUp,
  },
  down: {
    color: 'text-status-danger',
    bg: 'bg-status-dangerBg',
    Icon: TrendingDown,
  },
  neutral: {
    color: 'text-text-muted',
    bg: 'bg-surface-hover',
    Icon: Minus,
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export function StatCard({
  label,
  value,
  trend = 'neutral',
  trendValue,
  subtitle,
  icon,
  className,
  delay = 0,
}: StatCardProps) {
  const { color, bg, Icon } = trendConfig[trend];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
      className={cn(
        'stat-card flex flex-col justify-between min-h-[120px]',
        'hover:shadow-card-hover transition-shadow duration-200',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="stat-label uppercase tracking-wide">{label}</span>
        {icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', bg)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.2, ease: 'easeOut' }}
        className="mt-2"
      >
        <span className={cn('stat-value', trend === 'up' && 'stat-value-up', trend === 'down' && 'stat-value-down')}>
          {value}
        </span>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </motion.div>

      {/* Trend indicator */}
      {trendValue && (
        <div className={cn('flex items-center gap-1 mt-2', color)}>
          <Icon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
}

StatCard.displayName = 'StatCard';

/* ─── Stats Grid ─── */

export interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ children, columns = 3, className }: StatsGridProps) {
  const colClasses: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 },
        },
      }}
      className={cn('grid gap-card-gap', colClasses[columns], className)}
    >
      {children}
    </motion.div>
  );
}

export default StatCard;
