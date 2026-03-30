# Color Tokens — Quick Reference

Visual reference for all colors in the SecureBot Lab design system.

---

## Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#EEF2FF` | Active states, selected bg |
| `brand-100` | `#E0E7FF` | Light accent backgrounds |
| `brand-200` | `#C7D2FE` | Selection highlight |
| `brand-300` | `#A5B4FC` | Decorative borders |
| `brand-400` | `#818CF8` | Secondary interactive |
| `brand-500` | `#6366F1` | **Primary brand** |
| `brand-600` | `#4F46E5` | **Primary hover** |
| `brand-700` | `#4338CA` | Active/pressed states |
| `brand-800` | `#3730A3` | Dark accent |
| `brand-900` | `#312E81` | Darkest accent |

## Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `surface-bg` | `#F0F4FA` | Page background |
| `surface-card` | `#FFFFFF` | Card surfaces |
| `surface-sidebar` | `#FFFFFF` | Sidebar bg |
| `surface-panel` | `#F8FAFC` | Events panel bg |
| `surface-hover` | `#F1F5F9` | Hover states |
| `surface-active` | `#EEF2FF` | Active/selected states |

## Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-primary` | `#0F172A` | Headlines, primary text |
| `text-secondary` | `#475569` | Body text, descriptions |
| `text-muted` | `#94A3B8` | Captions, placeholders |
| `text-inverse` | `#FFFFFF` | Text on dark/brand bg |
| `text-link` | `#4F46E5` | Link text |

## Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#10B981` | Positive trend, success |
| `successBg` | `#ECFDF5` | Success background |
| `danger` | `#EF4444` | Negative trend, error |
| `dangerBg` | `#FEF2F2` | Danger background |
| `warning` | `#F59E0B` | Warning indicators |
| `warningBg` | `#FFFBEB` | Warning background |
| `info` | `#3B82F6` | Informational |
| `infoBg` | `#EFF6FF` | Info background |

## Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `border-light` | `#E2E8F0` | Card borders, dividers |
| `border` (default) | `#CBD5E1` | Standard borders |
| `border-strong` | `#94A3B8` | Emphasized borders |

## Feature Card Gradients

| Name | Direction | Colors | Usage |
|------|-----------|--------|-------|
| `gradient-blue` | 135° | `#DBEAFE → #BFDBFE` | Manual moderation |
| `gradient-green` | 135° | `#D1FAE5 → #A7F3D0` | Auto moderation |
| `gradient-purple` | 135° | `#EDE9FE → #DDD6FE` | Users settings |
| `gradient-orange` | 135° | `#FEF3C7 → #FDE68A` | Additional features |
| `gradient-cyan` | 135° | `#CFFAFE → #A5F3FC` | Interactive settings |

---

## TailwindCSS Usage Examples

```html
<!-- Brand button -->
<button class="bg-brand-500 hover:bg-brand-600 text-white">Action</button>

<!-- Card -->
<div class="bg-surface-card border border-border-light shadow-card rounded-card">

<!-- Status badge -->
<span class="bg-status-successBg text-status-success">Active</span>

<!-- Muted text -->
<p class="text-text-muted text-xs">Last updated 5 min ago</p>

<!-- Feature card with gradient -->
<div class="gradient-blue rounded-card p-5">
```
