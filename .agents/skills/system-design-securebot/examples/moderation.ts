/* ═══════════════════════════════════════════════════
   Moderation Types — SecureBot Lab Design System
   ═══════════════════════════════════════════════════ */

export type ModerationAction = 'ban' | 'mute' | 'warn' | 'delete' | 'restrict';

export interface ModerationRule {
  /** Unique id for the moderation rule or filter */
  id: string;
  /** Human-readable name of the rule */
  name: string;
  /** Detailed explanation of rule behavior */
  description: string;
  /** Toggle status */
  enabled: boolean;
  /** Associated bot action when triggered */
  action: ModerationAction;
  /** Filter keywords or regex patterns */
  filters: string[];
}

export interface ModerationLog {
  /** Unique audit log id */
  id: string;
  /** Bot action taken */
  action: ModerationAction;
  /** Target Telegram username or ID */
  targetUser: string;
  /** Moderator ID (bot or human admin) */
  moderator: string;
  /** Human-readable reason */
  reason: string;
  /** ISO timestamp */
  timestamp: string;
  /** Associated Telegram group ID */
  groupId: string;
}
