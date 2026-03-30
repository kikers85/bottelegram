# SecureBot Lab — Implementation Guide

Detailed guide for implementing the SecureBot Lab dashboard from scratch using the design system skill.

---

## Phase 1: Project Setup

### 1.1 Create Vite Project

```bash
npm create vite@latest securebot-dashboard -- --template react-ts
cd securebot-dashboard
```

### 1.2 Install Dependencies

```bash
# Core
npm install react-router-dom framer-motion clsx lucide-react recharts

# Dev
npm install -D tailwindcss postcss autoprefixer @types/node
```

### 1.3 Initialize Tailwind

```bash
npx tailwindcss init -p
```

### 1.4 Copy Design System Files

Copy from the skill's `scripts/` directory:
- `tailwind.config.ts` → project root
- `globals.css` → `src/styles/globals.css`

### 1.5 Download Fonts

Download and place in `src/assets/fonts/`:
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — Variable weight WOFF2
- [Inter](https://fonts.google.com/specimen/Inter) — Variable weight WOFF2

**Alternative (CDN):** Add to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=Plus+Jakarta+Sans:wght@400..800&display=swap" rel="stylesheet">
```

### 1.6 Configure Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

### 1.7 Configure TypeScript Paths

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Phase 2: Create Directory Structure

```bash
# Components
mkdir -p src/components/ui/Button
mkdir -p src/components/ui/Card
mkdir -p src/components/ui/Badge
mkdir -p src/components/ui/Input
mkdir -p src/components/ui/Avatar
mkdir -p src/components/ui/Toggle
mkdir -p src/components/layout/AppShell
mkdir -p src/components/layout/Sidebar
mkdir -p src/components/layout/TopBar
mkdir -p src/components/layout/EventsPanel
mkdir -p src/components/layout/PageContainer
mkdir -p src/components/modules/stats
mkdir -p src/components/modules/moderation
mkdir -p src/components/modules/settings
mkdir -p src/components/modules/social

# Other directories
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/pages
mkdir -p src/styles
mkdir -p src/types
mkdir -p src/assets/fonts
mkdir -p src/assets/images
```

---

## Phase 3: Implement Core Utilities

### 3.1 Class Name Utility

```ts
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
```

### 3.2 Constants

```ts
// src/lib/constants.ts
export const APP_NAME = 'SecureBot Lab';
export const APP_DESCRIPTION = 'Telegram bot management dashboard';

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const TOPBAR_HEIGHT = 64;
export const EVENTS_PANEL_WIDTH = 320;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
```

### 3.3 Animation Variants

```ts
// src/lib/animations.ts
import type { Variants } from 'framer-motion';

// Page-level stagger container
export const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Card entrance
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Fade in
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

// Slide from right (for events panel)
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

// Hover lift effect
export const hoverLift = {
  whileHover: { y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};

// Scale on tap (for buttons)
export const tapScale = {
  whileTap: { scale: 0.97 },
};

// Counter number animation
export const counterVariant: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Sidebar item variants
export const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
};
```

---

## Phase 4: Implement Components

Follow this order (dependencies first):

### Order of Implementation

1. **Primitives** (`ui/`)
   - `cn.ts` utility
   - `Button.tsx`
   - `Card.tsx`
   - `Badge.tsx`
   - `Input.tsx`
   - `Avatar.tsx`
   - `Toggle.tsx`

2. **Layout** (`layout/`)
   - `Sidebar.tsx` + `SidebarNav.tsx`
   - `TopBar.tsx`
   - `EventsPanel.tsx` + `EventCard.tsx`
   - `PageContainer.tsx`
   - `AppShell.tsx` (composes all layout)

3. **Modules** (`modules/`)
   - `stats/StatCard.tsx` + `StatsGrid.tsx`
   - `moderation/FeatureCard.tsx`
   - `settings/SettingsCard.tsx`
   - `social/SocialLinks.tsx`

4. **Pages** (`pages/`)
   - `Dashboard.tsx` (main page using all modules)
   - Other pages

### Barrel Exports

Every component folder must have an `index.ts`:

```ts
// src/components/ui/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

```ts
// src/components/ui/index.ts
export * from './Button';
export * from './Card';
export * from './Badge';
export * from './Input';
export * from './Avatar';
export * from './Toggle';
```

---

## Phase 5: TypeScript Types

### Navigation Types

```ts
// src/types/navigation.ts
export interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
  children?: NavItem[];
}

export interface NavGroup {
  id: string;
  title: string;
  items: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
```

### Stats Types

```ts
// src/types/stats.ts
export type TrendDirection = 'up' | 'down' | 'neutral';

export interface Stat {
  id: string;
  label: string;
  value: number | string;
  trend?: TrendDirection;
  trendValue?: string;
  subtitle?: string;
}

export interface GroupStats {
  totalUsers: number;
  incomingUsers: number;
  outgoingUsers: number;
  activeUsers: number;
}
```

### Events Types

```ts
// src/types/events.ts
export type EventSeverity = 'info' | 'warning' | 'success' | 'danger';

export interface BotEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: EventSeverity;
  groupId?: string;
  userId?: string;
}
```

### Moderation Types

```ts
// src/types/moderation.ts
export type ModerationAction = 'ban' | 'mute' | 'warn' | 'delete' | 'restrict';

export interface ModerationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  action: ModerationAction;
  filters: string[];
}

export interface ModerationLog {
  id: string;
  action: ModerationAction;
  targetUser: string;
  moderator: string;
  reason: string;
  timestamp: string;
  groupId: string;
}
```

---

## Phase 6: Custom Hooks

### useMediaQuery

```ts
// src/hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Convenience hooks
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
```

### useSidebar

```ts
// src/hooks/useSidebar.ts
import { useState, useCallback } from 'react';
import { useIsMobile } from './useMediaQuery';

export function useSidebar() {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = useCallback(() => {
    if (isMobile) {
      setMobileOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  }, [isMobile]);

  const close = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return {
    collapsed: isMobile ? false : collapsed,
    mobileOpen,
    toggle,
    close,
    isMobile,
  };
}
```

---

## Phase 7: App Entry Point

### main.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### App.tsx

```tsx
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Dashboard } from '@/pages/Dashboard';

export default function App() {
  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add more routes as needed */}
        </Routes>
      </AnimatePresence>
    </AppShell>
  );
}
```

---

## Phase 8: Verification Checklist

After completing implementation, verify:

- [ ] `npm run dev` starts without errors
- [ ] All fonts load correctly
- [ ] Color tokens render matching the reference
- [ ] Sidebar navigation works (expand/collapse)
- [ ] Stat cards show animated entrance
- [ ] Feature cards hover with lift effect
- [ ] Events panel scrolls independently
- [ ] Responsive: sidebar collapses at `< md`
- [ ] Responsive: events panel hides at `< lg`
- [ ] Focus styles visible on keyboard navigation
- [ ] No console errors or warnings
- [ ] `npm run build` succeeds without TypeScript errors

---

## Common Patterns

### Adding a New Page

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `App.tsx`
3. Add nav item in Sidebar's `generalNav` array
4. Use `motion.div` with `pageVariants` for entrance animation

### Adding a New Component

1. Create folder in appropriate directory (`ui/`, `layout/`, or `modules/`)
2. Create component file + types file + `index.ts`
3. Export from parent `index.ts` barrel
4. Use design tokens — never hardcode colors/spacing
5. Add Framer Motion animation if interactive

### Dark Mode Extension

The design system is built light-first. To add dark mode:

1. Add `darkMode: 'class'` to `tailwind.config.ts`
2. Create dark variants for surface/text/border colors
3. Use the `frontend-ui-dark-ts` skill tokens as the dark palette
4. Toggle via `<html class="dark">` or use a context provider
