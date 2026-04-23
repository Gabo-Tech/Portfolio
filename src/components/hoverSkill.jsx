"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * HoverSkill Component
 * Displays a skill with hover effects, changing background and text color.
 *
 * @param {Object} children - The content and hover styles for the skill.
 */
const HoverSkill = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [styleToggled, setStyleToggled] = useState(false);

  const isGradient = children.hoverBgColor.includes("linear-gradient");

  const hoverStyles = isGradient
    ? {
        backgroundImage: styleToggled ? children.hoverBgColor : "none",
        color: styleToggled ? children.hoverTextColor : "#fff",
      }
    : {
        backgroundColor: styleToggled ? children.hoverBgColor : "rgba(0,0,0,0)",
        color: styleToggled ? children.hoverTextColor : "#fff",
      };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setStyleToggled((prev) => !prev);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <motion.div
      className="cursor-pointer rounded border border-white px-2 py-1 text-xs font-bold leading-tight text-white sm:rounded-md sm:px-3 sm:py-1.5 sm:text-sm md:px-4 md:py-3 md:text-base"
      style={hoverStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={
        isHovered
          ? { scale: 1.2, zIndex: 10, x: 0, y: -5 }
          : { scale: 1, zIndex: 1, x: 0, y: 0 }
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
      role="button"
      aria-pressed={isHovered}
    >
      {children.children}
    </motion.div>
  );
};

export default HoverSkill;
