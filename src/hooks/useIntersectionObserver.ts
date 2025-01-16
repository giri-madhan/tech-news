import { useRef, useCallback, useEffect } from 'react';

interface UseIntersectionObserverProps {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export const useIntersectionObserver = ({
  onIntersect,
  enabled = true,
  rootMargin = '0px',
  threshold = 0,
}: UseIntersectionObserverProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (!enabled) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting) {
            onIntersect();
          }
        },
        { rootMargin, threshold }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [enabled, onIntersect, rootMargin, threshold]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return lastElementRef;
};
