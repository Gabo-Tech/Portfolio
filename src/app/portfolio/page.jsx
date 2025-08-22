"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import PortfolioItem from "@/components/portfolioItem";
import items from "../../../public/data/portfolioItems.json";
import ScrollSvg from "@/components/svgs/scroll";

/**
 * PortfolioPage Component
 * Displays the portfolio page with animated scrolling and portfolio items.
 * Uses responsive design: fancy horizontal scroll animations for laptops (md and up),
 * simpler vertical stack for mobile devices.
 */
const PortfolioPage = () => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  const [activeTabs, setActiveTabs] = useState(() =>
    items.reduce((acc, item) => ({ ...acc, [item.id]: "skills" }), {}),
  );

  const [readMore, setReadMore] = useState(() =>
    items.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
  );

  const handleTabClick = useCallback((id, tab) => {
    setActiveTabs((prevTabs) => ({ ...prevTabs, [id]: tab }));
  }, []);

  const handleReadMoreClick = useCallback((id) => {
    setReadMore((prevReadMore) => ({
      ...prevReadMore,
      [id]: !prevReadMore[id],
    }));
  }, []);

  const memoizedItems = useMemo(
    () =>
      items.map((item) => (
        <PortfolioItem
          key={item.id}
          item={item}
          isActiveTab={activeTabs[item.id]}
          isReadMore={readMore[item.id]}
          onTabClick={handleTabClick}
          onReadMoreClick={handleReadMoreClick}
        />
      )),
    [activeTabs, readMore, handleTabClick, handleReadMoreClick],
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");
      setIsMobile(mediaQuery.matches);

      const handleChange = (e) => setIsMobile(e.matches);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      {isMobile ? (
        // Mobile layout: Simpler vertical stack, no horizontal scroll animation
        <>
          <div className="w-screen min-h-[50vh] flex flex-col gap-8 items-center justify-center text-5xl text-center py-10">
            <motion.div
              className="text-white font-extrabold"
              animate={{
                y: ["10px", "-10px", "10px"],
                transition: {
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                },
              }}
            >
              SOME OF MY WORKS
            </motion.div>
          </div>
          <div className="flex flex-col gap-8 p-4">
            {memoizedItems}
          </div>
          <div className="w-screen min-h-screen flex flex-col gap-16 items-center text-white justify-center text-center bg-gradient-to-b from-blue-950 to-black py-10">
            <h1 className="text-5xl font-extrabold">
              Do you have a project?
            </h1>
            <div className="relative">
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                viewBox="0 0 300 300"
                className="w-64 h-64"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "
                  />
                </defs>
                <text fill="#fff">
                  <textPath xlinkHref="#circlePath" className="text-xl">
                    Full-Stack JS/TS Software Engineer 💻
                  </textPath>
                </text>
              </motion.svg>
              <Link
                href="/contact"
                className="w-16 h-16 absolute top-0 left-0 right-0 bottom-0 m-auto"
                aria-label="Hire me"
              >
                <motion.button
                  className="bg-white text-blue-900 font-extrabold rounded-full flex items-center justify-center w-full h-full"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.1, 1],
                    transition: { repeat: Infinity, duration: 1 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  Hire Me
                </motion.button>
              </Link>
            </div>
          </div>
        </>
      ) : (
        // Desktop layout: Keep original animations and horizontal scroll
        <>
          <div className="h-[600vh] relative" ref={ref}>
            <div className="w-screen h-[calc(100vh-6rem)] flex flex-col gap-48 items-center justify-center lg:text-8xl text-5xl text-center">
              <motion.div
                className="text-white font-extrabold"
                animate={{
                  y: ["20px", "-20px", "20px"],
                  transition: {
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                }}
              >
                SOME OF MY WORKS
              </motion.div>
              <ScrollSvg size={150} />
            </div>
            <div className="sticky top-0 flex h-screen gap-4 items-center overflow-hidden">
              <motion.div style={{ x }} className="flex">
                <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-t from-blue-950 to-red-950" />
                {memoizedItems}
              </motion.div>
            </div>
          </div>
          <div className="w-screen h-screen flex flex-col gap-16 items-center text-white justify-center text-center bg-gradient-to-b from-blue-950 to-black">
            <h1 className="lg:text-8xl text-5xl font-extrabold">
              Do you have a project?
            </h1>
            <div className="relative">
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                viewBox="0 0 300 300"
                className="w-64 h-64 md:w-[500px] md:h-[500px]"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 150, 150 m -60, 0 a 60,60 0 0,1 120,0 a 60,60 0 0,1 -120,0 "
                  />
                </defs>
                <text fill="#fff">
                  <textPath xlinkHref="#circlePath" className="text-xl">
                    Full-Stack JS/TS Software Engineer 💻
                  </textPath>
                </text>
              </motion.svg>
              <Link
                href="/contact"
                className="w-16 h-16 md:w-28 md:h-28 absolute top-0 left-0 right-0 bottom-0 m-auto"
                aria-label="Hire me"
              >
                <motion.button
                  className="bg-white text-blue-900 font-extrabold rounded-full flex items-center justify-center w-full h-full"
                  initial={{ scale: 1 }}
                  animate={{
                    scale: [1, 1.1, 1],
                    transition: { repeat: Infinity, duration: 1 },
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  Hire Me
                </motion.button>
              </Link>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default PortfolioPage;
