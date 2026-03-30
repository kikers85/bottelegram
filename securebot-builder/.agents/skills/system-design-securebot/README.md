# 🛡️ System Design — SecureBot Lab

Complete design system and component library for the **SecureBot Lab** Telegram bot management dashboard.

## Overview

This skill provides everything needed to build a consistent, production-ready dashboard UI:

- 🎨 **Design Tokens** — Colors, typography, spacing, shadows, radii
- 🧩 **Component Templates** — Button, Card, StatCard, FeatureCard, Sidebar, TopBar, EventsPanel
- 📐 **Layout Blueprint** — Three-column AppShell (Sidebar + Content + Events Panel)
- 🎭 **Animation Library** — Framer Motion variants for page transitions, card entrances, hover effects
- 📱 **Responsive System** — Breakpoints and adaptive layout rules
- 📘 **Implementation Guide** — Step-by-step instructions from zero to running dashboard

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| Vite | 6.x | Build/dev server |
| TypeScript | 5.x | Type safety |
| TailwindCSS | 3.x | Utility-first CSS |
| Framer Motion | 11.x | Animations |
| Lucide React | latest | Icon library |
| Recharts | 2.x | Data visualization |

## Quick Start

```bash
# 1. Create project
npm create vite@latest securebot-dashboard -- --template react-ts
cd securebot-dashboard

# 2. Install deps
npm install framer-motion clsx react-router-dom lucide-react recharts
npm install -D tailwindcss postcss autoprefixer @types/node

# 3. Initialize Tailwind
npx tailwindcss init -p

# 4. Copy design system files from this skill:
#    scripts/tailwind.config.ts → ./tailwind.config.ts
#    scripts/globals.css        → ./src/styles/globals.css
#    scripts/postcss.config.js  → ./postcss.config.js
#    scripts/vite.config.ts     → ./vite.config.ts
#    scripts/animations.ts      → ./src/lib/animations.ts

# 5. Start building!
npm run dev
```

## File Structure

```
system-design-securebot/
├── SKILL.md              # Main design system documentation
├── README.md             # This file
├── resources/
│   └── dashboard-reference.png    # Visual reference design
├── scripts/
│   ├── tailwind.config.ts         # Complete Tailwind config
│   ├── globals.css                # Global styles + components
│   ├── animations.ts              # Framer Motion variants
│   ├── postcss.config.js          # PostCSS config
│   └── vite.config.ts             # Vite config
├── examples/
│   ├── cn.ts                      # Class utility
│   ├── Button.tsx                 # Button component
│   ├── Card.tsx                   # Card component
│   ├── StatCard.tsx               # Statistics card
│   ├── FeatureCard.tsx            # Feature/action card
│   ├── Sidebar.tsx                # Navigation sidebar
│   ├── TopBar.tsx                 # Top navigation bar
│   ├── EventsPanel.tsx            # Events feed panel
│   ├── AppShell.tsx               # Layout shell
│   └── Dashboard.tsx              # Dashboard page example
└── references/
    └── implementation-guide.md    # Detailed build guide
```

## Design Direction

**Aesthetic:** Modern SaaS Dashboard — Clean, Professional, Light-dominant

**Key Visual Traits:**
- Soft blue-gray background (`#F0F4FA`)
- White card surfaces with subtle shadows
- Indigo/violet brand accent (`#6366F1`)
- Gradient feature cards (blue, green, purple, orange)
- Plus Jakarta Sans for display / Inter for body text
- Rounded corners (16px cards, 10px buttons)
- Purposeful Framer Motion animations

## Integration With Other Skills

| Skill | Integration |
|-------|-------------|
| `frontend-developer` | React patterns, hooks, state management |
| `frontend-design` | Aesthetic scoring (DFII), design thinking |
| `frontend-ui-dark-ts` | Dark mode variant, glass effects |
| `senior-frontend` | Project scaffolding, bundle analysis, testing |

## License

Internal project skill — SecureBot Lab
