"use client";

import { useEffect, useState } from "react";

/**
 * Deduplicate and sort (stable, order-independent key and preload list).
 * @param {readonly string[]} urls
 * @returns {string[]}
 */
function getUniqueUrlsSorted(urls) {
  const out = /** @type {string[]} */ ([]);
  const seen = Object.create(null);
  for (let i = 0; i < urls.length; i += 1) {
    const u = urls[i];
    if (seen[u]) continue;
    seen[u] = true;
    out.push(u);
  }
  out.sort();
  return out;
}

/**
 * Preloads every URL with `new Image()` (bypassing lazy `next/image`), then waits for
 * each resource to `decode()` so it is paint-ready, and defers an extra frame so the
 * first paint with cached pixels can run before the loader hides.
 *
 * @param {readonly string[]} urls - Image sources to gate on (e.g. all portfolio item `img` paths).
 * @param {{ maxMs?: number, minShowMs?: number }} [options] - Fails open after maxMs. minShowMs keeps
 *   the loader visible at least that long (helps cached loads on client navigation so it actually registers).
 * @returns {{ showLoader: boolean }}
 */
export function usePageImageLoader(
  urls,
  { maxMs = 15000, minShowMs = 220 } = {},
) {
  const [ready, setReady] = useState(false);
  const key = getUniqueUrlsSorted([...urls]).join("|");

  useEffect(() => {
    if (!urls.length) {
      setReady(true);
      return undefined;
    }

    const t0 = performance.now();
    const uniqueUrls = getUniqueUrlsSorted(urls);
    let mounted = true;
    let completed = 0;
    const total = uniqueUrls.length;

    let revealAfterMin;
    const setReadyRespectingMin = () => {
      if (!mounted) return;
      if (revealAfterMin) {
        window.clearTimeout(revealAfterMin);
        revealAfterMin = undefined;
      }
      const elapsed = performance.now() - t0;
      const rest = Math.max(0, minShowMs - elapsed);
      if (rest === 0) {
        if (mounted) setReady(true);
      } else {
        revealAfterMin = window.setTimeout(() => {
          revealAfterMin = undefined;
          if (mounted) setReady(true);
        }, rest);
      }
    };

    const markAllDecoded = () => {
      if (!mounted) return;
      // Two rAFs: first schedules layout, second runs after a chance to composite.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!mounted) return;
          setReadyRespectingMin();
        });
      });
    };

    const completeOne = () => {
      if (!mounted) return;
      completed += 1;
      if (completed >= total) markAllDecoded();
    };

    const imgs = uniqueUrls.map((src) => {
      const img = new window.Image();
      img.decoding = "async";
      img.onload = () => {
        if (!mounted) return;
        if (typeof img.decode === "function") {
          img.decode().then(completeOne, completeOne);
        } else {
          completeOne();
        }
      };
      img.onerror = () => completeOne();
      img.src = src;
      return img;
    });

    const maxTimer = window.setTimeout(() => {
      if (revealAfterMin) {
        window.clearTimeout(revealAfterMin);
        revealAfterMin = undefined;
      }
      if (mounted) setReady(true);
    }, maxMs);

    return () => {
      mounted = false;
      window.clearTimeout(maxTimer);
      if (revealAfterMin) window.clearTimeout(revealAfterMin);
      imgs.forEach((im) => {
        im.onload = null;
        im.onerror = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, maxMs, minShowMs]);

  return { showLoader: !ready };
}
