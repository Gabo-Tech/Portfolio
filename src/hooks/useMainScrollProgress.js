"use client";

import { useLayoutEffect, useRef } from "react";
import { useMotionValue } from "framer-motion";
export function useMainScrollProgress(containerRef) {
  const progress = useMotionValue(0);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  useLayoutEffect(() => {
    if (typeof document === "undefined") return undefined;
    const getContainerEl = () =>
      containerRef?.current ?? document.getElementById("app-scroll-root");
    const getScrollSource = () => {
      const el = getContainerEl();
      if (el && el.scrollHeight - el.clientHeight > 1) {
        return {
          kind: "element",
          el,
        };
      }
      const doc = document.scrollingElement || document.documentElement;
      if (doc && doc.scrollHeight - doc.clientHeight > 1) {
        return {
          kind: "window",
          el: doc,
        };
      }
      return null;
    };
    let source = null;
    let ro = null;
    let pollId = null;
    const update = () => {
      const p = progressRef.current;
      if (!source) {
        p.set(0);
        return;
      }
      const { el, kind } = source;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) {
        p.set(0);
        return;
      }
      const top =
        kind === "window" ? window.scrollY || el.scrollTop : el.scrollTop;
      p.set(Math.min(1, Math.max(0, top / max)));
    };
    const onWindowScroll = () => update();
    const attachListeners = () => {
      if (!source) return;
      const { el, kind } = source;
      if (kind === "window") {
        window.addEventListener("scroll", onWindowScroll, {
          passive: true,
        });
      } else {
        el.addEventListener("scroll", update, {
          passive: true,
        });
      }
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(update);
        ro.observe(el);
      }
      window.addEventListener("resize", update, {
        passive: true,
      });
    };
    const detachListeners = () => {
      if (!source) return;
      const { el, kind } = source;
      if (kind === "window") {
        window.removeEventListener("scroll", onWindowScroll);
      } else {
        el.removeEventListener("scroll", update);
      }
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      window.removeEventListener("resize", update);
    };
    const ensureSource = () => {
      const next = getScrollSource();
      if (!next) return false;
      if (source && source.kind === next.kind && source.el === next.el) {
        return true;
      }
      if (source) detachListeners();
      source = next;
      attachListeners();
      update();
      return true;
    };
    if (!ensureSource()) {
      let attempts = 0;
      const tick = () => {
        attempts += 1;
        if (ensureSource() || attempts > 120) {
          pollId = null;
          return;
        }
        pollId = window.requestAnimationFrame(tick);
      };
      pollId = window.requestAnimationFrame(tick);
    }
    const reevaluate = () => ensureSource();
    window.addEventListener("load", reevaluate);
    return () => {
      if (pollId !== null) window.cancelAnimationFrame(pollId);
      detachListeners();
      window.removeEventListener("load", reevaluate);
    };
  }, [containerRef]);
  return progress;
}
