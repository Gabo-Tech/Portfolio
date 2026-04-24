"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
const Loader = () => {
  const [mountNode, setMountNode] = useState(null);
  useLayoutEffect(() => {
    setMountNode(document.body);
  }, []);
  useEffect(() => {
    const scrollRoot = document.getElementById("app-scroll-root");
    const prevBody = document.body.style.overflow;
    const prevRoot = scrollRoot ? scrollRoot.style.overflowY : "";
    document.body.style.overflow = "hidden";
    if (scrollRoot) scrollRoot.style.overflowY = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      if (scrollRoot) scrollRoot.style.overflowY = prevRoot;
    };
  }, []);
  const containerStyle = {
    width: "4rem",
    height: "4rem",
    display: "flex",
    justifyContent: "space-around",
  };
  const circleStyle = {
    display: "block",
    width: "1rem",
    height: "1rem",
    backgroundColor: "#38bdf8",
    borderRadius: "0.5rem",
  };
  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };
  const circleVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "60%",
    },
  };
  const circleTransition = {
    duration: 0.4,
    yoyo: Infinity,
    ease: "easeInOut",
  };
  const content = (
    <div
      className="fixed inset-0 z-[100] flex min-h-screen w-full items-center justify-center bg-stone-950"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <motion.div
        style={containerStyle}
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {[...Array(3)].map((_, index) => (
          <motion.span
            key={index}
            style={circleStyle}
            variants={circleVariants}
            transition={circleTransition}
          />
        ))}
      </motion.div>
    </div>
  );
  if (mountNode) {
    return createPortal(content, mountNode);
  }
  return content;
};
export default Loader;
