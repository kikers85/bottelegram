# Accessibility Standards — SecureBot Lab

Guide for building accessible dashboard interfaces.

---

## Contrast Compliance

- **Primary Text:** Contrast 12.6:1 (AA/AAA pass)
- **Secondary Text:** Contrast 4.6:1 (AA pass)
- **Interactive States:** All buttons and inputs must have focus rings (`ring-brand-500`).

---

## Component Standards

### Buttons
- Icon-only: `aria-label="Description of action"`
- Loading: `aria-busy="true"`
- Disabled: `disabled` attribute

### Navigation
- Sidebar: Use semantic `<nav>` and `<ul>` / `<li>` structure.
- Active Link: `aria-current="page"`

### Inputs
- Every input **must** have a corresponding `<label>`.
- Error messages: Associate with input via `aria-describedby` and `aria-invalid`.

### Animations
- Respect user preference: `@media (prefers-reduced-motion: reduce)`
- Use `usePrefersReducedMotion` hook for Framer Motion.

---

## Keyboard Navigation

1. **Tab Order:** Ensure logical layout from Sidebar → TopBar → Content → Events.
2. **Focus Indicators:** Never use `outline: none` without a visible replacement.
3. **Esc Key:** Must close mobile drawer and modals.

---

## Dashboard Patterns

### Stat Cards
- Labels should precede values for screen readers.
- Trends: If using arrow icons, include hidden text: `<span className="sr-only">Trend: Down 5%</span>`.

### Tables / Grids
- Use `aria-colindex` and `aria-rowindex` if building complex interactive tables.
- Use `aria-label` on feature grids.
