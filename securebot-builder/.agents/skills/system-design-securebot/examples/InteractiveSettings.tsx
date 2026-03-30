'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { Card, CardHeader, CardTitle, CardDescription } from './Card';
import { Toggle } from './Toggle';
import { Badge } from './Badge';
import { 
  Zap, 
  Settings2, 
  MessageSquare, 
  UserPlus, 
  Link as LinkIcon 
} from 'lucide-react';

/* ═══════════════════════════════════════════════════
   InteractiveSettings — SecureBot Lab Design System
   A feature module for managing interactive bot behaviors
   (welcomes, surveys, links)
   ═══════════════════════════════════════════════════ */

export interface SettingToggle {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  badge?: string;
}

const defaultSettings: SettingToggle[] = [
  {
    id: 'welcome',
    label: 'Welcome messages',
    description: 'Greet new members automatically',
    icon: UserPlus,
    enabled: true,
  },
  {
    id: 'surveys',
    label: 'User surveys',
    description: 'Collect feedback from members',
    icon: MessageSquare,
    enabled: false,
    badge: 'NEW',
  },
  {
    id: 'links',
    label: 'Link previewer',
    description: 'Show rich details for shared links',
    icon: LinkIcon,
    enabled: true,
  },
];

export function InteractiveSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-500" />
          <CardTitle>Interactive settings</CardTitle>
        </div>
        <Settings2 className="w-4 h-4 text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
      </CardHeader>
      
      <CardDescription className="mb-6">
        Configure how the bot interacts with your community members in real-time.
      </CardDescription>

      <div className="space-y-4">
        {settings.map((setting) => {
          const Icon = setting.icon;
          return (
            <div 
              key={setting.id}
              className="flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  setting.enabled ? "bg-cyan-50 text-cyan-600" : "bg-surface-hover text-text-muted"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {setting.label}
                    </span>
                    {setting.badge && (
                      <Badge variant="brand" size="sm">{setting.badge}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-muted leading-tight">
                    {setting.description}
                  </p>
                </div>
              </div>

              <Toggle 
                checked={setting.enabled}
                onChange={() => toggleSetting(setting.id)}
                size="sm"
              />
            </div>
          );
        })}
      </div>
      
      <div className="mt-8">
        <button className="btn-link text-cyan-600 hover:text-cyan-700 w-full justify-center py-2 bg-cyan-50/50 rounded-xl hover:bg-cyan-50 transition-colors">
          View all interactive modules →
        </button>
      </div>
    </Card>
  );
}

InteractiveSettings.displayName = 'InteractiveSettings';
export default InteractiveSettings;
