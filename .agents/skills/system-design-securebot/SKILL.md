---
name: system-design-securebot
description: "Complete design system and component library for the SecureBot Lab Telegram bot management dashboard. Built with React 19, Vite 5, TailwindCSS 3, Framer Motion, and TypeScript. Provides modular, production-ready components following the dashboard reference design."
category: frontend
risk: safe
source: custom
tags: "[design-system, react, tailwindcss, vite, dashboard, telegram-bot, components]"
date_added: "2026-03-29"
version: "1.0.0"
---

# System Design — SecureBot Lab Dashboard

Complete design system for the **SecureBot Lab** Telegram bot management dashboard. This skill defines the visual language, component architecture, design tokens, and implementation patterns used across the entire application.

## Reference Design

The design is based on the dashboard mockup stored at:
`resources/dashboard-reference.png`

**Visual Direction:** Modern SaaS dashboard with a clean, professional aesthetic. Light-dominant theme with soft blue/indigo accents, rounded card surfaces, soft shadows, and a three-column layout (sidebar + main content + events panel).

---

## When to Use This Skill

- Starting new pages or screens for the SecureBot Lab application
- Creating or modifying UI components that must match the design system
- Implementing layout patterns (sidebar, main content, panels)
- Applying consistent color tokens, typography, and spacing
- Building interactive dashboard cards, stat widgets, or event feeds
- Ensuring visual consistency across the entire application

---

## 1. Technology Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.x | UI framework |
| `react-dom` | ^19.x | DOM rendering |
| `react-router-dom` | ^7.x | Client routing |
| `framer-motion` | ^11.x | Animations & transitions |
| `clsx` | ^2.x | Conditional class merging |
| `tailwindcss` | ^3.x | Utility-first CSS |
| `vite` | ^6.x | Build tool & dev server |
| `typescript` | ^5.x | Type safety |
| `lucide-react` | ^0.400+ | Icon library |
| `recharts` | ^2.x | Chart/data visualization |

---

## 2. Project Structure (Modular Architecture)

```
src/
├── assets/
│   ├── fonts/
│   │   ├── PlusJakartaSans-Variable.woff2
│   │   └── Inter-Variable.woff2
│   └── images/
│       └── logo.svg
├── components/
│   ├── ui/                          # Primitive UI components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.types.ts
│   │   │   └── index.ts
│   │   ├── Card/
│   │   │   ├── Card.tsx
│   │   │   ├── Card.types.ts
│   │   │   └── index.ts
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── index.ts
│   │   ├── Avatar/
│   │   │   ├── Avatar.tsx
│   │   │   └── index.ts
│   │   ├── Toggle/
│   │   │   ├── Toggle.tsx
│   │   │   └── index.ts
│   │   └── index.ts                 # Barrel export
│   ├── layout/                      # Layout components
│   │   ├── AppShell/
│   │   │   ├── AppShell.tsx
│   │   │   └── index.ts
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarNav.tsx
│   │   │   ├── SidebarGroup.tsx
│   │   │   └── index.ts
│   │   ├── TopBar/
│   │   │   ├── TopBar.tsx
│   │   │   └── index.ts
│   │   ├── EventsPanel/
│   │   │   ├── EventsPanel.tsx
│   │   │   ├── EventCard.tsx
│   │   │   └── index.ts
│   │   └── PageContainer/
│   │       ├── PageContainer.tsx
│   │       └── index.ts
│   └── modules/                     # Feature-specific composites
│       ├── stats/
│       │   ├── StatCard.tsx
│       │   ├── StatsGrid.tsx
│       │   └── index.ts
│       ├── moderation/
│       │   ├── ModerationCard.tsx
│       │   ├── ModerationPanel.tsx
│       │   └── index.ts
│       ├── settings/
│       │   ├── SettingsCard.tsx
│       │   ├── InteractiveSettings.tsx
│       │   └── index.ts
│       └── social/
│           ├── SocialLinks.tsx
│           └── index.ts
├── hooks/
│   ├── useMediaQuery.ts
│   ├── useSidebar.ts
│   └── useAnimateOnScroll.ts
├── lib/
│   ├── cn.ts                        # clsx + twMerge utility
│   └── constants.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Statistics.tsx
│   ├── ModerationManual.tsx
│   ├── ModerationAuto.tsx
│   ├── UserSettings.tsx
│   ├── EventJournal.tsx
│   └── Settings.tsx
├── styles/
│   └── globals.css
├── types/
│   ├── navigation.ts
│   ├── stats.ts
│   ├── events.ts
│   └── moderation.ts
├── App.tsx
└── main.tsx
```

---

## 3. Design Tokens

### Color System

The palette is derived from the reference design — a soft, professional light theme with blue/indigo accents.

```js
// tailwind.config.ts — extend.colors
colors: {
  // Primary brand — soft blue/indigo
  brand: {
    50:  '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',   // Primary
    600: '#4F46E5',   // Primary hover
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Surface colors (light theme)
  surface: {
    bg:      '#F0F4FA',   // Page background (soft blue-gray)
    card:    '#FFFFFF',   // Card surfaces
    sidebar: '#FFFFFF',   // Sidebar background
    panel:   '#F8FAFC',   // Secondary panels
    hover:   '#F1F5F9',   // Hover states
    active:  '#EEF2FF',   // Active/selected states
  },

  // Text hierarchy
  text: {
    primary:   '#0F172A',  // Headings, primary content
    secondary: '#475569',  // Body text, descriptions
    muted:     '#94A3B8',  // Captions, placeholders
    inverse:   '#FFFFFF',  // Text on dark/brand surfaces
  },

  // Status indicators (matching stat cards)
  status: {
    success:    '#10B981',  // Green — incoming users
    successBg:  '#ECFDF5',
    danger:     '#EF4444',  // Red — outgoing users
    dangerBg:   '#FEF2F2',
    warning:    '#F59E0B',
    warningBg:  '#FFFBEB',
    info:       '#3B82F6',
    infoBg:     '#EFF6FF',
  },

  // Borders
  border: {
    light:   '#E2E8F0',
    DEFAULT: '#CBD5E1',
    strong:  '#94A3B8',
  },

  // Feature cards (gradient backgrounds)
  feature: {
    blue:     'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    green:    'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    purple:   'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
    orange:   'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
  },
}
```

### Typography

```js
// tailwind.config.ts — extend.fontFamily
fontFamily: {
  display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
  body:    ['"Inter"', 'system-ui', 'sans-serif'],
},
```

| Element | Font | Size | Weight | Class |
|---------|------|------|--------|-------|
| Page title | Plus Jakarta Sans | 24px | 700 | `font-display text-2xl font-bold` |
| Section title | Plus Jakarta Sans | 18px | 600 | `font-display text-lg font-semibold` |
| Card title | Inter | 16px | 600 | `font-body text-base font-semibold` |
| Stat number | Plus Jakarta Sans | 32px | 700 | `font-display text-3xl font-bold` |
| Body text | Inter | 14px | 400 | `font-body text-sm` |
| Caption | Inter | 12px | 400 | `font-body text-xs text-text-muted` |
| Nav item | Inter | 14px | 500 | `font-body text-sm font-medium` |
| Button | Inter | 14px | 500 | `font-body text-sm font-medium` |

### Spacing & Sizing

```js
// tailwind.config.ts — extend.spacing
spacing: {
  'sidebar':    '260px',    // Sidebar width
  'panel':      '320px',    // Events panel width
  'topbar':     '64px',     // Top bar height
  'card-gap':   '20px',     // Gap between cards
  'section-gap':'32px',     // Gap between sections
},

borderRadius: {
  'card':  '16px',    // Card border radius
  'btn':   '10px',    // Button border radius
  'badge': '20px',    // Badge/pill radius
  'input': '10px',    // Input border radius
  'avatar':'50%',     // Avatar (circular)
},

boxShadow: {
  'card':     '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
  'card-hover':'0 4px 12px rgba(0, 0, 0, 0.08)',
  'sidebar':  '2px 0 8px rgba(0, 0, 0, 0.04)',
  'panel':    '-2px 0 8px rgba(0, 0, 0, 0.04)',
  'stat':     '0 2px 8px rgba(0, 0, 0, 0.06)',
},
```

---

## 4. Core Component API

### Button

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'link';
  size: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

// Usage — matching "Change →" buttons in the reference
<Button variant="link" size="sm" icon={<ArrowRight />} iconPosition="right">
  Change
</Button>
```

### Card

```tsx
interface CardProps {
  variant: 'default' | 'stat' | 'feature' | 'event';
  gradient?: 'blue' | 'green' | 'purple' | 'orange';
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Feature card
<Card variant="feature" gradient="blue" hoverable>
  <FeatureIcon />
  <h3>Manual moderation</h3>
  <Button variant="link">Change →</Button>
</Card>
```

### StatCard

```tsx
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
}

// Matching the reference stat blocks
<StatCard label="Total users" value="12,562" trend="neutral" />
<StatCard label="Incoming users" value="+462" trend="up" />
<StatCard label="Outgoing users" value="-52" trend="down" />
```

### Sidebar

```tsx
interface SidebarNavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  badge?: string;
}

interface SidebarGroup {
  title: string;
  items: SidebarNavItem[];
}
```

### EventCard

```tsx
interface EventCardProps {
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'danger';
}
```

---

## 5. Layout Blueprint

The dashboard uses a **three-column layout**:

```
┌─────────────┬──────────────────────────────────┬──────────────┐
│             │        Top Bar (64px)             │              │
│   Sidebar   ├──────────────────────────────────┤   Events     │
│   (260px)   │                                  │   Panel      │
│             │        Main Content              │   (320px)    │
│  - General  │   ┌─────────────────────────┐    │              │
│  - My groups│   │  Stats Grid             │    │  - Event 1   │
│  - Account  │   └─────────────────────────┘    │  - Event 2   │
│             │   ┌──────┐  ┌──────────────┐     │  - Event 3   │
│             │   │ Card │  │  Card        │     │  - Event 4   │
│             │   └──────┘  └──────────────┘     │              │
│             │   ┌──────┐  ┌──────────────┐     │              │
│             │   │ Card │  │  Social      │     │              │
│             │   └──────┘  └──────────────┘     │              │
└─────────────┴──────────────────────────────────┴──────────────┘
```

### AppShell Implementation Pattern

```tsx
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface-bg overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
          <EventsPanel />
        </main>
      </div>
    </div>
  );
}
```

---

## 6. Animation Patterns

Use Framer Motion sparingly with these approved patterns:

```tsx
// Page entrance — stagger children
export const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Stat counter — animated number
export const counterVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// Card hover lift
export const hoverLift = {
  whileHover: { y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' },
  transition: { type: 'spring', stiffness: 300, damping: 20 },
};
```

---

## 7. Responsive Breakpoints

```js
screens: {
  'sm':  '640px',   // Mobile landscape
  'md':  '768px',   // Tablet — sidebar collapses
  'lg':  '1024px',  // Desktop — full layout
  'xl':  '1280px',  // Wide desktop
  '2xl': '1536px',  // Ultra-wide
},
```

| Breakpoint | Sidebar | Events Panel | Main Grid |
|------------|---------|--------------|-----------|
| `< md` | Hidden (hamburger) | Hidden (slide-in) | 1 column |
| `md - lg` | Collapsed (icons only) | Hidden (toggle) | 2 columns |
| `>= lg` | Full (260px) | Visible (320px) | 2 columns |

---

## 8. File Naming & Module Conventions

- **Components**: PascalCase → `StatCard.tsx`, `ModerationPanel.tsx`
- **Hooks**: camelCase with `use` prefix → `useSidebar.ts`
- **Types**: camelCase → `navigation.ts`, `stats.ts`
- **Utilities**: camelCase → `cn.ts`, `constants.ts`
- **Pages**: PascalCase → `Dashboard.tsx`, `Statistics.tsx`
- **Barrel exports**: Every module folder has an `index.ts`
- **Type definitions**: Colocated in `.types.ts` files or `types/` directory

---

## 9. Integration With Other Skills

| Skill | Role in System Design |
|-------|----------------------|
| **frontend-developer** | React 19 patterns, hooks, state management, Vite config |
| **frontend-design** | Aesthetic direction, DFII scoring, visual memorability |
| **frontend-ui-dark-ts** | Component patterns, animation variants, glass effects (dark mode variant) |
| **senior-frontend** | Project scaffolding, bundle analysis, TypeScript patterns, testing |

---

## 10. Quick Start Workflow

```bash
# 1. Create Vite project
npm create vite@latest securebot-dashboard -- --template react-ts

# 2. Install dependencies
cd securebot-dashboard
npm install framer-motion clsx react-router-dom lucide-react recharts
npm install -D tailwindcss postcss autoprefixer @types/node

# 3. Initialize Tailwind
npx tailwindcss init -p

# 4. Copy design tokens into tailwind.config.ts
# 5. Copy globals.css from this skill's scripts/
# 6. Start building with the component structure above

npm run dev
```

---

## 11. Operator Checklist

Before finalizing any component or page:

- [ ] Matches reference design visual direction
- [ ] Uses only approved design tokens (no hardcoded colors/spacing)
- [ ] Responsive across all breakpoints
- [ ] Accessible: keyboard nav, ARIA labels, contrast ≥ 4.5:1
- [ ] Animations use approved Framer Motion variants
- [ ] TypeScript types are strict (no `any`)
- [ ] Component has barrel export in `index.ts`
- [ ] Follows modular folder structure

---

## References

- **Dashboard Reference**: `resources/dashboard-reference.png`
- **Design Tokens Script**: `scripts/tailwind.config.ts`
- **Global Styles**: `scripts/globals.css`
- **Component Templates**: `examples/`
- **Detailed Implementation Guide**: `references/implementation-guide.md`
