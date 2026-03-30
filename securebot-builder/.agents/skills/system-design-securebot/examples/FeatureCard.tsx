'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { ArrowRight } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Feature Card — SecureBot Lab Design System
   Gradient cards for Manual Moderation, Auto Moderation,
   Users Settings, Interactive Settings
   ═══════════════════════════════════════════════════ */

export interface FeatureCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  gradient: 'blue' | 'green' | 'purple' | 'orange' | 'cyan';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  delay?: number;
}

const gradientMap: Record<string, string> = {
  blue:   'gradient-blue',
  green:  'gradient-green',
  purple: 'gradient-purple',
  orange: 'gradient-orange',
  cyan:   'gradient-cyan',
};

const iconBgMap: Record<string, string> = {
  blue:   'bg-blue-500/20 text-blue-600',
  green:  'bg-emerald-500/20 text-emerald-600',
  purple: 'bg-violet-500/20 text-violet-600',
  orange: 'bg-amber-500/20 text-amber-600',
  cyan:   'bg-cyan-500/20 text-cyan-600',
};

export function FeatureCard({
  title,
  description,
  icon,
  gradient,
  actionLabel = 'Change',
  onAction,
  className,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        y: -4,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      }}
      className={cn(
        'feature-card cursor-pointer group',
        gradientMap[gradient],
        className,
      )}
    >
      {/* Icon */}
      <div className={cn('feature-card-icon', iconBgMap[gradient])}>
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-body text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="font-body text-xs text-text-secondary mb-3 truncate-2">
          {description}
        </p>
      )}

      {/* Action */}
      <button
        onClick={onAction}
        className="btn-link group mt-auto"
      >
        <span>{actionLabel}</span>
        <ArrowRight className="w-4 h-4 btn-arrow transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  );
}

FeatureCard.displayName = 'FeatureCard';
export default FeatureCard;
