'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/cn';
import {
  LayoutDashboard,
  BarChart3,
  HandMetal,
  Bot,
  Users,
  BookOpen,
  Settings2,
  User,
  Moon,
  Globe,
  ChevronLeft,
  Shield,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   Sidebar Component — SecureBot Lab Design System
   Three-section sidebar: General, My Groups, Account
   ═══════════════════════════════════════════════════ */

export interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface SidebarProps {
  activeItem?: string;
  onNavigate?: (href: string) => void;
  groups?: { id: string; name: string; avatar?: string }[];
  className?: string;
}

/* ─── Default navigation structure ─── */
const generalNav: NavItem[] = [
  { id: 'dashboard',      icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard',            href: '/' },
  { id: 'statistics',     icon: <BarChart3 className="w-5 h-5" />,       label: 'Statistics',            href: '/statistics' },
  { id: 'manual-mod',     icon: <HandMetal className="w-5 h-5" />,       label: 'Manual moderation',     href: '/moderation/manual' },
  { id: 'auto-mod',       icon: <Bot className="w-5 h-5" />,             label: 'Auto moderation',       href: '/moderation/auto' },
  { id: 'user-settings',  icon: <Users className="w-5 h-5" />,           label: 'User settings',         href: '/user-settings' },
  { id: 'event-journal',  icon: <BookOpen className="w-5 h-5" />,        label: 'Event journal',         href: '/events' },
  { id: 'add-settings',   icon: <Settings2 className="w-5 h-5" />,      label: 'Additional settings',   href: '/settings' },
];

const accountNav: NavItem[] = [
  { id: 'profile',  icon: <User className="w-5 h-5" />,   label: 'My profile', href: '/profile' },
  { id: 'mode',     icon: <Moon className="w-5 h-5" />,    label: 'Mode',       href: '/mode' },
  { id: 'language', icon: <Globe className="w-5 h-5" />,   label: 'Language',   href: '/language' },
];

/* ─── Sidebar Component ─── */
export function Sidebar({
  activeItem = 'dashboard',
  onNavigate,
  groups = [
    { id: 'crypto', name: 'Crypto' },
    { id: 'company', name: 'Company software' },
  ],
  className,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (href: string) => {
    onNavigate?.(href);
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'flex flex-col h-screen bg-surface-sidebar border-r border-border-light shadow-sidebar',
        'transition-all duration-300 ease-out',
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
        className,
      )}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border-light">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-display text-base font-bold text-text-primary whitespace-nowrap overflow-hidden"
            >
              SecureBot Lab
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
        {/* General */}
        <NavSection title="General" collapsed={collapsed}>
          {generalNav.map((item) => (
            <NavItemButton
              key={item.id}
              item={item}
              active={activeItem === item.id}
              collapsed={collapsed}
              onClick={() => handleClick(item.href)}
            />
          ))}
        </NavSection>

        {/* My Groups */}
        <NavSection title="My groups" collapsed={collapsed}>
          {groups.map((group) => (
            <NavItemButton
              key={group.id}
              item={{
                id: group.id,
                icon: (
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
                    {group.name[0]}
                  </div>
                ),
                label: group.name,
                href: `/groups/${group.id}`,
              }}
              active={activeItem === group.id}
              collapsed={collapsed}
              onClick={() => handleClick(`/groups/${group.id}`)}
            />
          ))}
        </NavSection>

        {/* Account Settings */}
        <NavSection title="Account settings" collapsed={collapsed}>
          {accountNav.map((item) => (
            <NavItemButton
              key={item.id}
              item={item}
              active={activeItem === item.id}
              collapsed={collapsed}
              onClick={() => handleClick(item.href)}
            />
          ))}
        </NavSection>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 border-t border-border-light
                   text-text-muted hover:text-text-primary hover:bg-surface-hover
                   transition-colors duration-200"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronLeft
          className={cn(
            'w-5 h-5 transition-transform duration-300',
            collapsed && 'rotate-180',
          )}
        />
      </button>
    </motion.aside>
  );
}

/* ─── Nav Section ─── */
function NavSection({
  title,
  collapsed,
  children,
}: {
  title: string;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <AnimatePresence>
        {!collapsed && (
          <motion.h4
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted"
          >
            {title}
          </motion.h4>
        )}
      </AnimatePresence>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

/* ─── Nav Item Button ─── */
function NavItemButton({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'nav-item w-full',
        active && 'nav-item-active',
        collapsed && 'justify-center px-0',
      )}
      title={collapsed ? item.label : undefined}
    >
      <span className={cn('nav-icon flex-shrink-0', active && 'text-brand-500')}>
        {item.icon}
      </span>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && item.badge && (
        <span className="ml-auto badge-brand text-[10px]">{item.badge}</span>
      )}
    </button>
  );
}

Sidebar.displayName = 'Sidebar';
export default Sidebar;
