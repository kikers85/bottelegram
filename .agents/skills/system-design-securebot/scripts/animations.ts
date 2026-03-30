import type { Variants, Transition } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   Animation Library — SecureBot Lab Design System
   Approved Framer Motion variants and transitions
   ═══════════════════════════════════════════════════ */

// ─── Easing Curves ───
export const easings = {
  smooth: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  bounce: [0.68, -0.55, 0.265, 1.55] as [number, number, number, number],
  snappy: [0.4, 0, 0.2, 1] as [number, number, number, number],
};

// ─── Spring Config ───
export const springs = {
  gentle: { type: 'spring', stiffness: 200, damping: 20 } as Transition,
  snappy: { type: 'spring', stiffness: 400, damping: 25 } as Transition,
  bouncy: { type: 'spring', stiffness: 300, damping: 15 } as Transition,
};

// ─── Page Variants ───
export const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// ─── Card Variants ───
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: easings.smooth,
    },
  },
};

// ─── Fade Variants ───
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easings.smooth },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easings.smooth },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

// ─── Scale Variants ───
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: easings.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

// ─── Stagger Containers ───
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

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
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

// ─── Counter Animation ───
export const counterVariant: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

// ─── Interactive States ───
export const hoverLift = {
  whileHover: {
    y: -3,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
  },
  transition: springs.gentle,
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: springs.snappy,
};

export const tapScale = {
  whileTap: { scale: 0.97 },
};

export const hoverGlow = (color: string = 'rgba(99, 102, 241, 0.3)') => ({
  whileHover: {
    boxShadow: `0 0 20px ${color}`,
  },
  transition: { duration: 0.2 },
});

// ─── Sidebar Variants ───
export const sidebarVariants: Variants = {
  expanded: {
    width: 260,
    transition: { duration: 0.3, ease: easings.smooth },
  },
  collapsed: {
    width: 72,
    transition: { duration: 0.3, ease: easings.smooth },
  },
};

export const sidebarLabelVariants: Variants = {
  expanded: {
    opacity: 1,
    width: 'auto',
    display: 'block',
    transition: { duration: 0.2, delay: 0.1 },
  },
  collapsed: {
    opacity: 0,
    width: 0,
    transitionEnd: { display: 'none' },
    transition: { duration: 0.15 },
  },
};

// ─── Modal / Dialog ───
export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const dialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: easings.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15 },
  },
};

// ─── Tooltip ───
export const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 4, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.95,
    transition: { duration: 0.1 },
  },
};

// ─── Notification / Toast ───
export const toastVariants: Variants = {
  hidden: { opacity: 0, y: -20, x: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: easings.smooth },
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};
