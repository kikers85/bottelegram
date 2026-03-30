'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Events Panel — SecureBot Lab Design System
   Right sidebar showing latest events feed
   ═══════════════════════════════════════════════════ */

export interface Event {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}

export interface EventsPanelProps {
  events?: Event[];
  title?: string;
  className?: string;
}

const typeConfig = {
  info: {
    icon: Info,
    bg: 'bg-status-infoBg',
    border: 'border-blue-200',
    iconColor: 'text-status-info',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-status-warningBg',
    border: 'border-amber-200',
    iconColor: 'text-status-warning',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-status-successBg',
    border: 'border-emerald-200',
    iconColor: 'text-status-success',
  },
  danger: {
    icon: AlertTriangle,
    bg: 'bg-status-dangerBg',
    border: 'border-red-200',
    iconColor: 'text-status-danger',
  },
};

/* ─── Default mock events ─── */
const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'White Tiger blocked the spammer.',
    description: 'Ban for excessive spam on a daily basis',
    timestamp: 'Today, 10:27',
    type: 'danger',
  },
  {
    id: '2',
    title: 'White Tiger blocked the spammer.',
    description: 'Ban for excessive spam on a daily basis',
    timestamp: 'Today, 10:27',
    type: 'warning',
  },
  {
    id: '3',
    title: 'White Tiger blocked the spammer.',
    description: 'Ban for excessive spam on a daily basis',
    timestamp: 'Today, 10:27',
    type: 'info',
  },
  {
    id: '4',
    title: 'Auto moderation triggered.',
    description: 'Suspicious activity detected in Crypto group',
    timestamp: 'Today, 10:15',
    type: 'success',
  },
];

export function EventsPanel({
  events = defaultEvents,
  title = 'Last Events',
  className,
}: EventsPanelProps) {
  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
      className={cn(
        'w-panel h-full bg-surface-panel border-l border-border-light',
        'overflow-y-auto scrollbar-hide hidden lg:block',
        className,
      )}
    >
      <div className="p-5">
        {/* Header */}
        <h2 className="font-display text-lg font-semibold text-text-primary mb-5">
          {title}
        </h2>

        {/* Events list */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.06, delayChildren: 0.2 },
            },
          }}
          className="space-y-3"
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </motion.div>
      </div>
    </motion.aside>
  );
}

/* ─── Event Card ─── */
function EventCard({ event }: { event: Event }) {
  const config = typeConfig[event.type];
  const IconComponent = config.icon;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 12 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.3, ease: 'easeOut' },
        },
      }}
      className={cn(
        'event-card relative',
        'hover:border-brand-200',
      )}
    >
      {/* Timestamp */}
      <div className="flex items-center gap-1.5 mb-2">
        <Clock className="w-3 h-3 text-text-muted" />
        <span className="text-[11px] text-text-muted font-medium">{event.timestamp}</span>
      </div>

      {/* Content */}
      <div className="flex gap-3">
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          config.bg,
        )}>
          <IconComponent className={cn('w-4 h-4', config.iconColor)} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-primary leading-snug">
            {event.title}
          </p>
          <p className="text-xs text-text-muted mt-0.5 truncate-2">
            {event.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

EventsPanel.displayName = 'EventsPanel';
export default EventsPanel;
