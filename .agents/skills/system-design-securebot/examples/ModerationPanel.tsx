'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { ArrowRight, Shield, Info } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   ModerationPanel — SecureBot Lab Design System
   Displays moderation rules as a list with toggles
   and action summary
   ═══════════════════════════════════════════════════ */

export type ModerationAction = 'ban' | 'mute' | 'warn' | 'delete' | 'restrict';

export interface ModerationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  action: ModerationAction;
  count?: number;
}

export interface ModerationPanelProps {
  title?: string;
  rules: ModerationRule[];
  onToggleRule?: (ruleId: string, enabled: boolean) => void;
  onEditRule?: (ruleId: string) => void;
  className?: string;
}

const actionColors: Record<ModerationAction, string> = {
  ban:      'text-status-danger bg-status-dangerBg',
  mute:     'text-status-warning bg-status-warningBg',
  warn:     'text-status-warning bg-status-warningBg',
  delete:   'text-status-danger bg-status-dangerBg',
  restrict: 'text-status-info bg-status-infoBg',
};

const actionLabels: Record<ModerationAction, string> = {
  ban:      'Ban',
  mute:     'Mute',
  warn:     'Warn',
  delete:   'Delete',
  restrict: 'Restrict',
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function ModerationPanel({
  title = 'Moderation Rules',
  rules,
  onToggleRule,
  onEditRule,
  className,
}: ModerationPanelProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn('card-base', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-0">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-brand-500" />
          <h3 className="font-body text-base font-semibold text-text-primary">{title}</h3>
        </div>
        <span className="text-xs text-text-muted">{rules.length} rules</span>
      </div>

      {/* Rules list */}
      <div className="p-5 space-y-1">
        {rules.map((rule) => (
          <ModerationRuleRow
            key={rule.id}
            rule={rule}
            onToggle={(enabled) => onToggleRule?.(rule.id, enabled)}
            onEdit={() => onEditRule?.(rule.id)}
          />
        ))}
      </div>

      {/* Summary footer */}
      <div className="px-5 py-3 bg-surface-hover/50 rounded-b-card flex items-center gap-2 text-xs text-text-muted">
        <Info className="w-3.5 h-3.5" />
        <span>{rules.filter((r) => r.enabled).length} active rules</span>
      </div>
    </motion.div>
  );
}

/* ─── ModerationRuleRow ─── */
function ModerationRuleRow({
  rule,
  onToggle,
  onEdit,
}: {
  rule: ModerationRule;
  onToggle: (enabled: boolean) => void;
  onEdit: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-colors duration-150',
        'hover:bg-surface-hover group',
      )}
    >
      {/* Toggle */}
      <button
        role="switch"
        aria-checked={rule.enabled}
        onClick={() => onToggle(!rule.enabled)}
        className={cn(
          'relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0',
          rule.enabled ? 'bg-brand-500' : 'bg-border',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm',
            'transition-transform duration-200',
            rule.enabled && 'translate-x-4',
          )}
        />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium truncate',
          rule.enabled ? 'text-text-primary' : 'text-text-muted',
        )}>
          {rule.name}
        </p>
        <p className="text-xs text-text-muted truncate mt-0.5">{rule.description}</p>
      </div>

      {/* Action badge */}
      <span className={cn('px-2 py-0.5 rounded-badge text-[10px] font-semibold', actionColors[rule.action])}>
        {actionLabels[rule.action]}
      </span>

      {/* Count */}
      {rule.count !== undefined && (
        <span className="text-xs text-text-muted tabular-nums">{rule.count}</span>
      )}

      {/* Edit */}
      <button
        onClick={onEdit}
        className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-brand-500 transition-all"
        aria-label={`Edit ${rule.name}`}
      >
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

ModerationPanel.displayName = 'ModerationPanel';
export default ModerationPanel;
