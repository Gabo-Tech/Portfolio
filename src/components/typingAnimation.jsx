"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
function parseLine(line) {
  if (typeof line !== "string" || !line.includes("|")) {
    return {
      full: line,
      hasAccent: false,
      main: line,
      accent: null,
    };
  }
  const [m, a] = line.split("|", 2);
  const main = (m ?? "").trim();
  const accent = (a ?? "").trim();
  if (!accent) {
    return {
      full: main,
      hasAccent: false,
      main,
      accent: null,
    };
  }
  if (!main) {
    return {
      full: accent,
      hasAccent: false,
      main: accent,
      accent: null,
    };
  }
  return {
    full: `${main} ${accent}`,
    hasAccent: true,
    main,
    accent,
  };
}
const LONG_LINE_PAUSE_AFTER_CHARS = 80;
function pauseBeforeDeleteMs(full) {
  return full.length >= LONG_LINE_PAUSE_AFTER_CHARS ? 5000 : 3000;
}
function splitForRender(displayedText, main) {
  const n = main.length;
  if (displayedText.length <= n) {
    return {
      displayRun: displayedText,
      accent: "",
    };
  }
  const displayEnd = Math.min(displayedText.length, n + 1);
  return {
    displayRun: displayedText.slice(0, displayEnd),
    accent: displayedText.length > n + 1 ? displayedText.slice(n + 1) : "",
  };
}
const TypingAnimation = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const lineRaw = useMemo(
    () => texts[currentTextIndex] ?? "",
    [texts, currentTextIndex],
  );
  const { full, hasAccent, main } = useMemo(
    () => parseLine(lineRaw),
    [lineRaw],
  );
  useEffect(() => {
    const typeSpeed = isDeleting ? 18 : 36;
    if (!isDeleting && displayedText === full) {
      setTimeout(() => setIsDeleting(true), pauseBeforeDeleteMs(full));
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    } else {
      setTimeout(() => {
        setDisplayedText(
          full.slice(0, displayedText.length + (isDeleting ? -1 : 1)),
        );
      }, typeSpeed);
    }
  }, [displayedText, isDeleting, full, texts.length]);
  const { displayRun, accent: accentVisible } = useMemo(
    () =>
      hasAccent
        ? splitForRender(displayedText, main)
        : {
            displayRun: displayedText,
            accent: "",
          },
    [hasAccent, displayedText, main],
  );
  return (
    <h1
      className="w-full break-words font-semibold text-stone-100 leading-[1.12] sm:leading-[1.1] md:leading-[1.08] lg:leading-[1.06] [font-size:clamp(1.55rem,0.6rem+4.2vw,5.5rem)]"
      aria-live="polite"
    >
      <span className="font-display">
        {hasAccent ? (
          <>
            <span className="text-stone-100 tracking-tight">{displayRun}</span>
            {accentVisible !== "" && (
              <span className="font-editorial italic text-stone-400/90 tracking-normal text-[1.12em] leading-tight">
                {accentVisible}
              </span>
            )}
          </>
        ) : (
          <span className="font-display text-stone-100 tracking-tight">
            {displayedText}
          </span>
        )}
        <motion.span
          className="blinking-cursor"
          initial={{
            opacity: 1,
          }}
          animate={{
            opacity: 0,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
          }}
          aria-hidden
        >
          |
        </motion.span>
      </span>
    </h1>
  );
};
export default TypingAnimation;
