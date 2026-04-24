"use client";

import { createContext, useContext } from "react";
export const AppScrollContainerRefContext = createContext(null);
export function useAppScrollContainerRef() {
  return useContext(AppScrollContainerRefContext);
}
