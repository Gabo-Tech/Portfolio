"use client";

import { useLayoutEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";

/**
 * Returns a 0–1 MotionValue describing how far a target element has traveled
 * through the viewport:
 *
 *   - 0 when the element's top edge just enters the viewport from the bottom.
 *   - 1 when the element's bottom edge leaves the viewport at the top.
 *
 * Works regardless of whether the document, `#app-scroll-root`, or a custom
 * container is the real scrollport (Framer's `useScroll` can miss this).
 *
 * @param {React.RefObject<HTMLElement | null>} targetRef
 * @returns {import("framer-motion").MotionValue<number>}
 */
export function useElementViewportProgress(targetRef) {
  const progress = useMotionValue(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useLayoutEffect(() => {
    if (typeof window === "undefined") return undefined;

    const update = () => {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = vh + rect.height;
      if (total <= 0) {
        progressRef.current.set(0);
        return;
      }
      const traveled = vh - rect.top;
      const p = Math.min(1, Math.max(0, traveled / total));
      progressRef.current.set(p);
    };

    update();

    const scrollRoot = document.getElementById("app-scroll-root");
    window.addEventListener("scroll", update, { passive: true });
    if (scrollRoot) {
      scrollRoot.addEventListener("scroll", update, { passive: true });
    }
    window.addEventListener("resize", update, { passive: true });

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      if (targetRef.current) ro.observe(targetRef.current);
      ro.observe(document.documentElement);
    }

    const onLoad = () => update();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("scroll", update);
      if (scrollRoot) scrollRoot.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", onLoad);
      if (ro) ro.disconnect();
    };
  }, [targetRef]);

  return progress;
}
