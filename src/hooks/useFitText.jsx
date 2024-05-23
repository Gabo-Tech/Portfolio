import { useState, useEffect, useRef } from "react";

/**
 * Custom hook to dynamically adjust the font size of a text element to fit its container.
 *
 * @param {number} minFontSize - Minimum font size in pixels.
 * @param {number} maxFontSize - Maximum font size in pixels.
 * @returns {Array} - Array containing the fontSize state and a ref for the text element.
 */
const useFitText = (minFontSize = 20, maxFontSize = 120) => {
  const [fontSize, setFontSize] = useState(maxFontSize);
  const textRef = useRef(null);

  useEffect(() => {
    const resizeText = () => {
      const parent = textRef.current.parentElement;
      const { width: parentWidth, height: parentHeight } = parent.getBoundingClientRect();
      const { width: textWidth, height: textHeight } = textRef.current.getBoundingClientRect();

      let newFontSize = fontSize;
      if (textWidth > parentWidth || textHeight > parentHeight) {
        newFontSize = Math.max(minFontSize, fontSize - 1);
      } else if (newFontSize < maxFontSize) {
        newFontSize = Math.min(maxFontSize, fontSize + 1);
      }

      if (newFontSize !== fontSize) {
        setFontSize(newFontSize);
      }
    };

    resizeText();
    window.addEventListener("resize", resizeText);

    return () => {
      window.removeEventListener("resize", resizeText);
    };
  }, [fontSize, minFontSize, maxFontSize]);

  return [fontSize, textRef];
};

export default useFitText;
