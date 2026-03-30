import { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════
   useAnimateOnScroll Hook — SecureBot Lab Design System
   Triggers animation when element enters viewport
   Uses IntersectionObserver for performance
   ═══════════════════════════════════════════════════ */

export interface UseAnimateOnScrollOptions {
  /** Percentage of element visible before triggering (0–1). Default: 0.1 */
  threshold?: number;
  /** Root margin for earlier/later triggering. Default: '0px' */
  rootMargin?: string;
  /** Only trigger once (no re-animation on re-enter). Default: true */
  triggerOnce?: boolean;
}

export interface UseAnimateOnScrollReturn {
  /** Ref to attach to the target element */
  ref: React.RefObject<HTMLElement>;
  /** True when element is in view (has been observed) */
  isInView: boolean;
  /** True when element is currently intersecting */
  isIntersecting: boolean;
}

export function useAnimateOnScroll({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: UseAnimateOnScrollOptions = {}): UseAnimateOnScrollReturn {
  const ref = useRef<HTMLElement>(null!);
  const [isInView, setIsInView] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const intersecting = entry.isIntersecting;
        setIsIntersecting(intersecting);

        if (intersecting) {
          setIsInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isInView, isIntersecting };
}

export default useAnimateOnScroll;
