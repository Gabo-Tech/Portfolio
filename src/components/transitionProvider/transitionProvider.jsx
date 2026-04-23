"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../navbar/navbar";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { AppScrollContainerRefContext } from "@/components/scrollContainerContext";
import "./transitions.css";

/**
 * TransitionProvider: page transitions and first-visit home treatment.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
const TransitionProvider = ({ children }) => {
  const mainScrollRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const pathName = usePathname();
  const t = useTranslations("PageTitle");
  const [firstVisit, setFirstVisit] = useState(true);

  useEffect(() => {
    if (pathName === "/") {
      setFirstVisit(false);
    }
  }, [pathName]);

  const displayName = useMemo(() => {
    if (pathName === "/") {
      return t("home");
    }
    const segment = pathName.replace(/^\//, "").split("/")[0];
    const key = ["about", "portfolio", "contact"].includes(segment)
      ? segment
      : "home";
    return t(key);
  }, [pathName, t]);

  return (
    <AnimatePresence mode="wait">
      <div
        key={pathName}
        className="page-gradient flex min-h-screen w-full min-w-0 max-w-full flex-col"
        aria-live="polite"
      >
        {!(pathName === "/" && firstVisit) && (
          <>
            <motion.div
              className="transition-overlay-left"
              animate={{ width: "0vw" }}
              exit={{ width: "100vw" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            <motion.div
              className="transition-text"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              aria-hidden="true"
            >
              {displayName}
            </motion.div>
            <motion.div
              className="transition-overlay-right"
              initial={{ width: "100vw" }}
              animate={{ width: "0vw", transition: { delay: 0.5 } }}
            />
          </>
        )}
        <header className="relative z-50 h-24 shrink-0">
          <Navbar />
        </header>
        <AppScrollContainerRefContext.Provider value={mainScrollRef}>
          <main
            id="app-scroll-root"
            ref={mainScrollRef}
            className="relative z-0 flex min-h-0 w-full max-w-full flex-1 flex-col overflow-y-auto"
          >
            {children}
          </main>
        </AppScrollContainerRefContext.Provider>
      </div>
    </AnimatePresence>
  );
};

export default TransitionProvider;
