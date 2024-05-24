"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../navbar/navbar";
import { usePathname } from "next/navigation";
import "./transitions.css";

/**
 * TransitionProvider Component
 * Provides page transition animations and manages the first visit state.
 *
 * @param {Object} children - The child components to be rendered.
 */
const TransitionProvider = ({ children }) => {
  const pathName = usePathname();
  const [firstVisit, setFirstVisit] = useState(true);

  useEffect(() => {
    if (pathName === "/") {
      setFirstVisit(false);
    }
  }, [pathName]);

  const displayName =
    pathName === "/"
      ? "Home"
      : pathName.charAt(1).toUpperCase() + pathName.substring(2);

  return (
    <AnimatePresence mode="wait">
      <div
        key={pathName}
        className="w-screen h-full bg-gradient-to-b from-blue-950 to-red-950"
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
        <div className="h-24">
          <Navbar />
        </div>
        <div className="h-[calc(100vh-6rem)]">{children}</div>
      </div>
    </AnimatePresence>
  );
};

export default TransitionProvider;
