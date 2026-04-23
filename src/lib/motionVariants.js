/**
 * Shared Framer Motion presets: fade+lift for page blocks (mount and in-view).
 */

export const FADE_EASE = /** @type {const} */ ([0.22, 1, 0.36, 1]);

const duration = 0.6;

/**
 * Fade + slight lift on mount. Respects `prefers-reduced-motion` when `reduced` is true.
 * @param {boolean} reduced
 * @param {number} [delay=0]
 */
export function getFadeInUpProps(reduced, delay = 0) {
  if (reduced) {
    return {
      initial: false,
      animate: { opacity: 1, y: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration, ease: FADE_EASE, delay },
  };
}

/**
 * Fade + lift when entering the scrollport.
 * @param {import("react").RefObject<HTMLElement | null> | null | undefined} mainScrollRef
 * @param {number} [delay=0]
 * @param {boolean} [reduced=false]
 */
export function getFadeInUpInViewProps(
  mainScrollRef,
  delay = 0,
  reduced = false,
) {
  if (reduced) {
    return {
      initial: false,
      whileInView: { opacity: 1, y: 0 },
      viewport: {
        root: mainScrollRef ?? undefined,
        once: true,
        amount: 0.2,
        margin: "0px 0px -10% 0px",
      },
    };
  }
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: {
      root: mainScrollRef ?? undefined,
      once: true,
      amount: 0.2,
      margin: "0px 0px -10% 0px",
    },
    transition: { duration, ease: FADE_EASE, delay },
  };
}

/**
 * @param {number} [delay=0]
 * @param {boolean} [reduced=false]
 */
export function fadeInUp(delay = 0, reduced = false) {
  if (reduced) {
    return { initial: false, animate: { opacity: 1, y: 0 } };
  }
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration, ease: FADE_EASE, delay },
  };
}

/**
 * @param {import("react").RefObject<HTMLElement | null> | null | undefined} mainScrollRef
 * @param {number} [delay=0]
 * @param {boolean} [reduced=false]
 */
export function fadeInUpInView(mainScrollRef, delay = 0, reduced = false) {
  return getFadeInUpInViewProps(mainScrollRef, delay, reduced);
}
