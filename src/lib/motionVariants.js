export const FADE_EASE = [0.22, 1, 0.36, 1];
const duration = 0.6;
export function getFadeInUpProps(reduced, delay = 0) {
  if (reduced) {
    return {
      initial: false,
      animate: {
        opacity: 1,
        y: 0,
      },
    };
  }
  return {
    initial: {
      opacity: 0,
      y: 24,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration,
      ease: FADE_EASE,
      delay,
    },
  };
}
export function getFadeInUpInViewProps(
  mainScrollRef,
  delay = 0,
  reduced = false,
) {
  if (reduced) {
    return {
      initial: false,
      whileInView: {
        opacity: 1,
        y: 0,
      },
      viewport: {
        root: mainScrollRef ?? undefined,
        once: true,
        amount: 0.2,
        margin: "0px 0px -10% 0px",
      },
    };
  }
  return {
    initial: {
      opacity: 0,
      y: 24,
    },
    whileInView: {
      opacity: 1,
      y: 0,
    },
    viewport: {
      root: mainScrollRef ?? undefined,
      once: true,
      amount: 0.2,
      margin: "0px 0px -10% 0px",
    },
    transition: {
      duration,
      ease: FADE_EASE,
      delay,
    },
  };
}
export function fadeInUp(delay = 0, reduced = false) {
  if (reduced) {
    return {
      initial: false,
      animate: {
        opacity: 1,
        y: 0,
      },
    };
  }
  return {
    initial: {
      opacity: 0,
      y: 24,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    transition: {
      duration,
      ease: FADE_EASE,
      delay,
    },
  };
}
export function fadeInUpInView(mainScrollRef, delay = 0, reduced = false) {
  return getFadeInUpInViewProps(mainScrollRef, delay, reduced);
}
