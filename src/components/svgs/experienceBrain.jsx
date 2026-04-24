"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Brain from "./brain";

/**
 * Experience Brain: portaled, `position: fixed` brain driven by the experience
 * section's bounding rect. Rendered into `document.body` so no ancestor
 * transform, filter, overflow, or containing-block trick can affect it.
 *
 * Behavior:
 *  - While the section is entering the viewport from below, the brain rides
 *    the section's top edge upward (scrolls in).
 *  - While the section straddles the main scrollport's vertical center, the
 *    brain stays pinned at the center (sticky-like).
 *  - Once the section's bottom passes above center, the brain rides the
 *    section's bottom edge up and out (scrolls out with the section).
 *
 * @param {{
 *   sectionRef: React.RefObject<HTMLElement | null>,
 *   scrollYProgress: import("framer-motion").MotionValue<number>,
 * }} props
 */
export default function ExperienceBrain({ sectionRef, scrollYProgress }) {
  const [mounted, setMounted] = useState(false);
  const boxRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return undefined;

    let raf = 0;

    const compute = () => {
      raf = 0;
      const section = sectionRef.current;
      const box = boxRef.current;
      if (!section || !box) return;

      const scrollRoot = document.getElementById("app-scroll-root");
      const rootRect =
        scrollRoot && scrollRoot.getBoundingClientRect
          ? scrollRoot.getBoundingClientRect()
          : null;
      const viewportTop = rootRect ? rootRect.top : 0;
      const viewportHeight = rootRect
        ? rootRect.height
        : window.innerHeight || document.documentElement.clientHeight;

      const sectionRect = section.getBoundingClientRect();
      const brainHeight = box.offsetHeight;

      const viewportBottom = viewportTop + viewportHeight;
      const isBelow = sectionRect.top > viewportBottom;
      const isAbove = sectionRect.bottom < viewportTop;

      if (isBelow || isAbove) {
        box.style.visibility = "hidden";
        return;
      }

      const centerTarget = viewportTop + viewportHeight / 2;
      const centerY = Math.max(
        sectionRect.top,
        Math.min(sectionRect.bottom, centerTarget),
      );
      const top = centerY - brainHeight / 2;

      box.style.top = `${top}px`;
      box.style.visibility = "visible";
    };

    const update = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    compute();

    const scrollRoot = document.getElementById("app-scroll-root");
    window.addEventListener("scroll", update, { passive: true });
    if (scrollRoot) {
      scrollRoot.addEventListener("scroll", update, { passive: true });
    }
    window.addEventListener("resize", update, { passive: true });

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      if (sectionRef.current) ro.observe(sectionRef.current);
      if (boxRef.current) ro.observe(boxRef.current);
      ro.observe(document.documentElement);
    }

    const onLoad = () => update();
    window.addEventListener("load", onLoad);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      if (scrollRoot) scrollRoot.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", onLoad);
      if (ro) ro.disconnect();
    };
  }, [sectionRef, mounted]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={boxRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-0 z-10 hidden h-[min(86dvh,960px)] w-[min(50vw,640px)] items-center justify-end will-change-transform lg:flex 2xl:h-[min(84dvh,1000px)]"
      style={{ visibility: "hidden", top: 0 }}
    >
      <Brain
        className="h-full w-full"
        preserveAspectRatio="xMaxYMid meet"
        scrollYProgress={scrollYProgress}
      />
    </div>,
    document.body,
  );
}
