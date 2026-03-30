import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════
   useMediaQuery Hook — SecureBot Lab Design System
   Reactive media query matching for responsive layouts
   ═══════════════════════════════════════════════════ */

/**
 * Returns true if the given CSS media query matches.
 *
 * @example
 * const isWide = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/* ─── Convenience hooks ─── */

/** True when viewport < 768px (mobile) */
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');

/** True when viewport is 768px–1023px (tablet) */
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

/** True when viewport >= 1024px (desktop) */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');

/** True when viewport >= 1280px (wide desktop) */
export const useIsWide = () => useMediaQuery('(min-width: 1280px)');

/** True when user prefers reduced motion */
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** True when user prefers dark color scheme */
export const usePrefersDark = () => useMediaQuery('(prefers-color-scheme: dark)');

export default useMediaQuery;
