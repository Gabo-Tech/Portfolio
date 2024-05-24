import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

/**
 * TypingAnimation Component
 * Displays an animated typing effect for an array of texts.
 *
 * @param {Array} texts - Array of strings to be displayed with typing animation.
 */
const TypingAnimation = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentText = useMemo(
    () => texts[currentTextIndex],
    [texts, currentTextIndex],
  );

  useEffect(() => {
    let typeSpeed = isDeleting ? 75 : 150;

    if (!isDeleting && displayedText === currentText) {
      setTimeout(() => setIsDeleting(true), 3000);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    } else {
      setTimeout(() => {
        setDisplayedText(
          currentText.slice(0, displayedText.length + (isDeleting ? -1 : 1)),
        );
      }, typeSpeed);
    }
  }, [displayedText, isDeleting, currentText, texts]);

  return (
    <h1 className="text-4xl md:text-6xl font-extrabold" aria-live="polite">
      <motion.div className="inline">
        {displayedText.split(/(\s+)/).map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.05,
              delay: index * 0.05,
            }}
            className={word.trim() === "" ? "inline-block w-2" : ""}
          >
            {word}
          </motion.span>
        ))}
        <motion.span
          className="blinking-cursor"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
        >
          |
        </motion.span>
      </motion.div>
    </h1>
  );
};

export default TypingAnimation;
