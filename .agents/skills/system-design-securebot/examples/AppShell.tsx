'use client';

import React from 'react';
import { Sidebar } from '../layout/Sidebar';
import { TopBar } from '../layout/TopBar';
import { EventsPanel } from '../layout/EventsPanel';

/* ═══════════════════════════════════════════════════
   AppShell — SecureBot Lab Design System
   Three-column layout: Sidebar | Main | Events Panel
   ═══════════════════════════════════════════════════ */

export interface AppShellProps {
  children: React.ReactNode;
  activeNav?: string;
  onNavigate?: (href: string) => void;
}

export function AppShell({ children, activeNav, onNavigate }: AppShellProps) {
  return (
    <div className="flex h-screen bg-surface-bg overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar activeItem={activeNav} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar onChangePlan={() => console.log('Change plan')} />

        {/* Content + Events Panel */}
        <main className="flex flex-1 overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 max-w-5xl">
              {children}
            </div>
          </div>

          {/* Right Events Panel */}
          <EventsPanel />
        </main>
      </div>
    </div>
  );
}

AppShell.displayName = 'AppShell';
export default AppShell;
