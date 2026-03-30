# Dark Mode Extension — SecureBot Lab

Reference for extending the design system to support Dark Mode.

---

## Configuration

To enable dark mode in Tailwind, add this to `tailwind.config.ts`:

```ts
darkMode: 'class', // Enable class-based dark mode
```

---

## Dark Palette Mapping

| Token Class | Light Hex | Dark Hex | Usage |
|-------------|-----------|----------|-------|
| `bg-surface-bg` | `#F0F4FA` | `#0B0F19` | Page background |
| `bg-surface-card`| `#FFFFFF` | `#111827` | Card surfaces |
| `bg-surface-panel`| `#F8FAFC` | `#1F2937` | Panels |
| `border-border-light`| `#E2E8F0` | `#1F2937` | Dividers / borders |
| `text-text-primary`| `#0F172A` | `#F9FAFB` | Primary text |
| `text-text-secondary`| `#475569` | `#9CA3AF` | Body text |
| `text-text-muted`| `#94A3B8` | `#6B7280` | Placeholder / caption |

---

## Component Overrides

### Features & Gradients
In dark mode, gradients should use slightly darker variants to maintain text readability.

- **Blue:** `linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)`
- **Green:** `linear-gradient(135deg, #064E3B 0%, #065F46 100%)`

### Shadows
Shadows on cards should be stronger or use a slight glow in dark mode.

- **Shadow:** `0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`

---

## Implementation Pattern

Use the `dark:` utility class in Tailwind or a CSS variable toggle.

```css
/* Custom properties for dark mode */
.dark {
  --color-surface-bg: #0B0F19;
  --color-surface-card: #111827;
  --color-text-primary: #F9FAFB;
  --color-border-light: #1F2937;
}
```
