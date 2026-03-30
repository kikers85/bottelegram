import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from './useMediaQuery';

/* ═══════════════════════════════════════════════════
   useSidebar Hook — SecureBot Lab Design System
   Manages sidebar collapsed/expanded state
   with mobile drawer support
   ═══════════════════════════════════════════════════ */

export interface UseSidebarReturn {
  /** True when sidebar is collapsed to icons-only (desktop) */
  collapsed: boolean;
  /** True when mobile drawer is open */
  mobileOpen: boolean;
  /** Toggle sidebar expand/collapse (desktop) or open/close (mobile) */
  toggle: () => void;
  /** Expand the sidebar */
  expand: () => void;
  /** Collapse the sidebar */
  collapse: () => void;
  /** Close mobile drawer */
  closeMobile: () => void;
  /** True if viewport is mobile */
  isMobile: boolean;
}

export function useSidebar(): UseSidebarReturn {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  const expand = useCallback(() => setCollapsed(false), []);
  const collapse = useCallback(() => setCollapsed(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close mobile drawer when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Close mobile drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  return {
    collapsed: isMobile ? false : collapsed,
    mobileOpen,
    toggle,
    expand,
    collapse,
    closeMobile,
    isMobile,
  };
}

export default useSidebar;
