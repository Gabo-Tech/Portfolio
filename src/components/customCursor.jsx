"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

/**
 * CustomCursor Component
 * A custom cursor component that follows the mouse movements and applies various transformations.
 */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const controls = useAnimation();
  const { x, y } = useMousePosition();
  const speed = 0.17;
  const previousMouse = useRef({ x: 0, y: 0 });
  const circle = useRef({ x: 0, y: 0 });
  const currentScale = useRef(0);
  const currentAngle = useRef(0);
  const idleTimeoutRef = useRef(null);

  useEffect(() => {
    let request;

    const startIdleAnimation = () => {
      controls.start({
        y: [0, -5, 0, 5, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      });
    };

    const stopIdleAnimation = () => {
      controls.stop();
      controls.set({ y: 0 });
    };

    const tick = () => {
      // MOVE the cursor
      circle.current.x += (x - circle.current.x) * speed;
      circle.current.y += (y - circle.current.y) * speed;
      const translateTransform = `translate(${circle.current.x}px, ${circle.current.y}px)`;

      // SQUEEZE the cursor based on velocity
      const deltaMouseX = x - previousMouse.current.x;
      const deltaMouseY = y - previousMouse.current.y;
      previousMouse.current.x = x;
      previousMouse.current.y = y;
      const mouseVelocity = Math.min(
        Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 4,
        150,
      );
      const scaleValue = (mouseVelocity / 150) * 0.5;
      currentScale.current += (scaleValue - currentScale.current) * speed;
      const scaleTransform = `scale(${1 + currentScale.current}, ${1 - currentScale.current})`;

      // ROTATE the cursor based on direction
      const angle = (Math.atan2(deltaMouseY, deltaMouseX) * 180) / Math.PI;
      if (mouseVelocity > 20) {
        currentAngle.current = angle;
      }
      const rotateTransform = `rotate(${currentAngle.current}deg)`;

      // Apply all transformations to the cursor element
      if (cursorRef.current) {
        cursorRef.current.style.transform = `${translateTransform} ${rotateTransform} ${scaleTransform}`;
      }

      // Check for idle state
      clearTimeout(idleTimeoutRef.current);
      stopIdleAnimation();
      idleTimeoutRef.current = setTimeout(startIdleAnimation, 1000);

      request = window.requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.cancelAnimationFrame(request);
      clearTimeout(idleTimeoutRef.current);
    };
  }, [x, y, controls]);

  return (
    <motion.div
      ref={cursorRef}
      className="circle"
      aria-hidden="true"
      animate={controls}
    />
  );
};

export default CustomCursor;
