import { useState, useEffect } from "react";
export const useMousePosition = () => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener("mousemove", updatePosition, {
      passive: true,
    });
    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);
  return position;
};
