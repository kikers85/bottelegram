/* ═══════════════════════════════════════════════════
   Events Types — SecureBot Lab Design System
   ═══════════════════════════════════════════════════ */

export type EventSeverity = 'info' | 'warning' | 'success' | 'danger';

export interface BotEvent {
  /** Unique identifier for the event */
  id: string;
  /** Primary event name/label */
  title: string;
  /** Main description or reason */
  description: string;
  /** Formatted timestamp (e.g., "Today, 10:27") */
  timestamp: string;
  /** Severity level for iconography (info/warning/success/danger) */
  type: EventSeverity;
  /** Optional associated Telegram group ID */
  groupId?: string;
  /** Optional associated Telegram user ID */
  userId?: string;
}
