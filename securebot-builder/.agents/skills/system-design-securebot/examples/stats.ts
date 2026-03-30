/* ═══════════════════════════════════════════════════
   Stats Types — SecureBot Lab Design System
   ═══════════════════════════════════════════════════ */

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface Stat {
  /** Unique identifier for the stat */
  id: string;
  /** Display label (e.g., "Total users") */
  label: string;
  /** Main numeric or string value */
  value: number | string;
  /** Trend direction relative to previous period */
  trend?: TrendDirection;
  /** Percentage or absolute change string (e.g., "+12.3%") */
  trendValue?: string;
  /** Optional secondary text below the value */
  subtitle?: string;
}

export interface GroupStats {
  /** Total number of users in the group */
  totalUsers: number;
  /** Users joined in the current period */
  incomingUsers: number;
  /** Users left in the current period */
  outgoingUsers: number;
  /** Currently active/online users */
  activeUsers: number;
}
