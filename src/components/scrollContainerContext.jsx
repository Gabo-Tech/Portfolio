"use client";

import { createContext, useContext } from "react";

/**
 * Ref to the scrollable app shell (TransitionProvider `#app-scroll-root`).
 * Use with `useMainScrollProgress` (or in-view) when the document is not the scrollport.
 */
export const AppScrollContainerRefContext = createContext(
  /** @type {React.RefObject<HTMLDivElement | null> | null} */ (null),
);

export function useAppScrollContainerRef() {
  return useContext(AppScrollContainerRefContext);
}
