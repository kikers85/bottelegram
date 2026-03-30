'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { ArrowRight, ChevronRight } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   SettingsCard — SecureBot Lab Design System
   A card for settings options with optional toggle,
   icon, value display, and navigation action
   ═══════════════════════════════════════════════════ */

export interface SettingsItem {
  id: string;
  icon?: React.ReactNode;
  label: string;
  description?: string;
  value?: string | React.ReactNode;
  type?: 'navigate' | 'toggle' | 'action';
  enabled?: boolean;
  badge?: string;
}

export interface SettingsCardProps {
  title: string;
  icon?: React.ReactNode;
  items: SettingsItem[];
  onItemClick?: (itemId: string) => void;
  onToggle?: (itemId: string, enabled: boolean) => void;
  className?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function SettingsCard({
  title,
  icon,
  items,
  onItemClick,
  onToggle,
  className,
}: SettingsCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn('card-base overflow-hidden', className)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-5 pb-3">
        {icon && <span className="text-brand-500">{icon}</span>}
        <h3 className="font-body text-base font-semibold text-text-primary">{title}</h3>
      </div>

      {/* Items */}
      <div className="px-2 pb-2">
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            <SettingsRow
              item={item}
              onClick={() => onItemClick?.(item.id)}
              onToggle={(enabled) => onToggle?.(item.id, enabled)}
            />
            {index < items.length - 1 && (
              <div className="mx-3 border-t border-border-light/50" />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Settings Row ─── */
function SettingsRow({
  item,
  onClick,
  onToggle,
}: {
  item: SettingsItem;
  onClick: () => void;
  onToggle: (enabled: boolean) => void;
}) {
  const isNavigable = item.type === 'navigate' || (!item.type && !item.enabled !== undefined);

  return (
    <button
      onClick={item.type === 'toggle' ? () => onToggle(!item.enabled) : onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-3 rounded-xl',
        'text-left transition-colors duration-150',
        'hover:bg-surface-hover group',
      )}
    >
      {/* Icon */}
      {item.icon && (
        <div className="w-9 h-9 rounded-xl bg-surface-hover flex items-center justify-center text-text-secondary flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
          {item.icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-primary">{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-brand-50 text-brand-600 rounded-badge">
              {item.badge}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-text-muted mt-0.5 truncate">{item.description}</p>
        )}
      </div>

      {/* Value / Action */}
      {item.type === 'toggle' ? (
        <div
          className={cn(
            'relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
            item.enabled ? 'bg-brand-500' : 'bg-border',
          )}
          role="switch"
          aria-checked={item.enabled}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              item.enabled && 'translate-x-4',
            )}
          />
        </div>
      ) : item.value ? (
        <span className="text-sm text-text-muted flex-shrink-0">{item.value}</span>
      ) : (
        <ChevronRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

SettingsCard.displayName = 'SettingsCard';
export default SettingsCard;
