# Visual Language — SecureBot Lab

Reference for spacing, typography, and component patterns.

---

## Typography

The design system uses two fonts: **Plus Jakarta Sans** for display (headings, stats) and **Inter** for body text.

| Element | Class | Font | Weight | Size |
|---------|-------|------|--------|------|
| **Page Title** | `font-display text-2xl font-bold` | Jakarta | 700/800 | 24px |
| **Section Title** | `font-display text-lg font-semibold` | Jakarta | 600 | 18px |
| **Card Title** | `font-body text-base font-semibold` | Inter | 600 | 16px |
| **Stat Number** | `font-display text-stat font-bold` | Jakarta | 800 | 32px |
| **Body Text** | `font-body text-sm` | Inter | 400 | 14px |
| **Caption** | `font-body text-xs text-text-muted` | Inter | 400 | 12px |
| **Small Label** | `font-body text-[10px] uppercase tracking-wide` | Inter | 600 | 10px |

---

## Spacing System

Tailwind's numeric scale is used for all spacing. Standardized aliases for dashboard dimensions:

| Dimension | Variable / Class | Value |
|-----------|------------------|-------|
| **Sidebar Width** | `w-sidebar` | 260px |
| **Sidebar (Collapsed)** | `w-sidebar-collapsed` | 72px |
| **Events Panel Width** | `w-panel` | 320px |
| **Topbar Height** | `h-topbar` | 64px |
| **Card Gap** | `gap-card-gap` | 20px |
| **Section Gap** | `space-y-section-gap` | 32px |
| **Page Padding** | `p-6` | 24px |
| **Card Padding** | `p-5` | 20px |

---

## Component Layouts

### Cards
Cards are the building blocks of the dashboard. Always use the `card-base` class or the `<Card />` component.

> [!TIP]
> Use `hoverable` on Interactive cards to apply the lift-up animation and shadow transition.

### Grid Layouts
- **Stats:** Usually 3 or 4 columns (`grid-cols-3` or `grid-cols-4`).
- **Features:** Usually 2 columns on desktop (`grid-cols-2`).
- **Settings:** Single column vertical stack inside a card.

---

## Patterns & State Indicators

### Animated Numbers
For all critical stats (Total Users, etc.), use the `counterVariant` from `animations.ts` to reveal the value with a slight slide up.

### Interactive Elements
- **Hover Transitions:** All interactive elements (buttons, nav items, cards) must have a transition period of at least `150ms`.
- **Active State:** Used for currently selected navigation items. Should use `bg-surface-active` and `text-brand-600`.
- **Loading State:** Use the `<Loader2 />` icon with `animate-spin` on buttons or panels during data fetching.

---

## Contrast & Accessibility

- **Standard Text:** Contrast ratio ≥ 4.5:1 against card background.
- **Interactive States:** Provide visual feedback beyond color change (e.g. underline, shadow shift).
- **Aria Labels:** Ensure `aria-label` is present on icon-only buttons (notifications, settings).
