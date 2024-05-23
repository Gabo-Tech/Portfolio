import { motion } from "framer-motion";

// Loader container styles
const loadingContainer = {
  width: "4rem",
  height: "4rem",
  display: "flex",
  justifyContent: "space-around",
};

// Loading circle styles
const loadingCircle = {
  display: "block",
  width: "1rem",
  height: "1rem",
  backgroundColor: "#3A36DB",
  borderRadius: "0.5rem",
};

// Variants for the loading container
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

// Variants for the loading circles
const loadingCircleVariants = {
  start: {
    y: "0%",
  },
  end: {
    y: "60%",
  },
};

// Transition settings for the loading circles
const loadingCircleTransition = {
  duration: 0.4,
  yoyo: Infinity,
  ease: "easeInOut",
};

/**
 * Loader Component
 * Displays a loading animation with three bouncing circles.
 */
const Loader = () => {
  return (
    <div
      className="fixed w-full min-h-screen z-50 bg-black opacity-30 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        style={loadingContainer}
        variants={loadingContainerVariants}
        initial="start"
        animate="end"
      >
        <motion.span
          style={loadingCircle}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        ></motion.span>
        <motion.span
          style={loadingCircle}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        ></motion.span>
        <motion.span
          style={loadingCircle}
          variants={loadingCircleVariants}
          transition={loadingCircleTransition}
        ></motion.span>
      </motion.div>
    </div>
  );
};

export default Loader;
