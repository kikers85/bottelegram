'use client';

import React from 'react';
import { cn } from '../lib/cn';
import { Bell, ChevronDown, Search } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   TopBar Component — SecureBot Lab Design System
   Current group info, search, notifications, user
   ═══════════════════════════════════════════════════ */

export interface TopBarProps {
  groupName?: string;
  memberCount?: number;
  userName?: string;
  userAvatar?: string;
  userBadge?: string;
  onChangePlan?: () => void;
  className?: string;
}

export function TopBar({
  groupName = 'Crypto',
  memberCount = 242753,
  userName = 'Mohammed Samir',
  userAvatar,
  userBadge = 'PRO',
  onChangePlan,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        'h-topbar flex items-center justify-between px-6',
        'bg-surface-card border-b border-border-light',
        className,
      )}
    >
      {/* Left — Group Info */}
      <div className="flex items-center gap-4">
        {/* Group avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{groupName[0]}</span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-base font-semibold text-text-primary">
              {groupName}
            </h1>
            <ChevronDown className="w-4 h-4 text-text-muted" />
          </div>
          <p className="text-xs text-text-muted">
            Members: {memberCount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Right — Search, Notifications, User */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="input-base pl-9 pr-4 py-2 w-48 lg:w-64 text-sm"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-btn text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-status-danger rounded-full" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-border-light hidden md:block" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-text-primary">{userName}</p>
            {onChangePlan && (
              <button
                onClick={onChangePlan}
                className="text-xs text-brand-500 hover:text-brand-600 transition-colors"
              >
                Change plan →
              </button>
            )}
          </div>

          {/* Avatar */}
          <div className="relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="avatar avatar-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-sm font-bold text-brand-600">
                  {userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
            {userBadge && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold bg-status-success text-white rounded-full">
                {userBadge}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

TopBar.displayName = 'TopBar';
export default TopBar;
