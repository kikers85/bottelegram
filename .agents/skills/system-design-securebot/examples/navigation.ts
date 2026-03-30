/* ═══════════════════════════════════════════════════
   Navigation Types — SecureBot Lab Design System
   ═══════════════════════════════════════════════════ */

export interface NavItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Lucide icon component or SVG node */
  icon: React.ReactNode;
  /** Display label */
  label: string;
  /** URL path */
  href: string;
  /** Optional notification badge (e.g. 'PRO' or a number) */
  badge?: string;
  /** Optional nested children items */
  children?: NavItem[];
}

export interface NavGroup {
  /** Unique identifier for the group */
  id: string;
  /** Group title/header */
  title: string;
  /** Navigation items inside this group */
  items: NavItem[];
}

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Optional URL path; if omitted, treated as active terminal node */
  href?: string;
}
