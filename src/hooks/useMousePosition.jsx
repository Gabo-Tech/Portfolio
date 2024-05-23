// hooks/useMousePosition.js
import { useState, useEffect } from "react";

/**
 * Custom hook to track the mouse position.
 * @returns {Object} position - The current mouse position with x and y coordinates.
 */
export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Add event listener to track mouse movement
    window.addEventListener("mousemove", updatePosition);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return position;
};
