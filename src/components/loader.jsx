import { motion } from "framer-motion";
import { useMemo } from "react";

const Loader = () => {
  const loadingContainerStyle = {
    width: "4rem",
    height: "4rem",
    display: "flex",
    justifyContent: "space-around",
  };

  const loadingCircleStyle = {
    display: "block",
    width: "1rem",
    height: "1rem",
    backgroundColor: "#3A36DB",
    borderRadius: "0.5rem",
  };

  const loadingContainerVariants = {
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

  const loadingCircleVariants = {
    start: {
      y: "0%",
    },
    end: {
      y: "60%",
    },
  };

  const loadingCircleTransition = {
    duration: 0.4,
    yoyo: Infinity,
    ease: "easeInOut",
  };

  return (
    <div
      className="fixed w-full min-h-screen z-50 bg-black opacity-30 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        style={loadingContainerStyle}
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        {[...Array(3)].map((_, index) => (
          <motion.span
            key={index}
            style={loadingCircleStyle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          ></motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default Loader;
