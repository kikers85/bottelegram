'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

/* ═══════════════════════════════════════════════════
   PageContainer — SecureBot Lab Design System
   Wraps page content with max-width, padding,
   and staggered entrance animation
   ═══════════════════════════════════════════════════ */

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  children: React.ReactNode;
}

const maxWidthStyles: Record<string, string> = {
  sm:   'max-w-2xl',
  md:   'max-w-4xl',
  lg:   'max-w-5xl',
  xl:   'max-w-7xl',
  full: 'max-w-full',
};

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

export function PageContainer({
  title,
  subtitle,
  actions,
  maxWidth = 'lg',
  className,
  children,
}: PageContainerProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={cn(maxWidthStyles[maxWidth], 'mx-auto space-y-section-gap', className)}
    >
      {/* Page header */}
      {(title || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h1 className="font-display text-2xl font-bold text-text-primary">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-text-muted mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}

      {/* Page content */}
      {children}
    </motion.div>
  );
}

PageContainer.displayName = 'PageContainer';
export default PageContainer;
