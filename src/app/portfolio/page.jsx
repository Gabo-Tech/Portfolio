"use client";
import { motion } from "framer-motion";
import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import PortfolioItem from "@/components/portfolioItem";
import items from "../../../public/data/portfolioItems.json";
import ScrollSvg from "@/components/svgs/scroll";

const PortfolioPage = () => {
  const [activeTabs, setActiveTabs] = useState(() =>
    items.reduce((acc, item) => ({ ...acc, [item.id]: "skills" }), {}),
  );

  const [readMore, setReadMore] = useState(() =>
    items.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          isMobile={isMobile}
        />
      )),
    [activeTabs, readMore, handleTabClick, handleReadMoreClick, isMobile],
  );

  return (
    <motion.div
      className="h-full"
      initial={{ y: "-200vh" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1 }}
    >
      {/* ===== HERO SECTION ===== */}
      <div className={`w-screen flex flex-col items-center justify-center text-center text-white ${isMobile ? 'h-auto py-8 text-4xl bg-[#121212]' : 'h-[calc(100vh-6rem)] gap-48 lg:text-8xl text-5xl'}`}>
        <motion.div
          className="font-extrabold text-white"
          animate={!isMobile ? {
            y: ["20px", "-20px", "20px"],
            transition: {
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            },
          } : {}}
        >
          SOME OF MY WORKS
        </motion.div>
        {!isMobile && <ScrollSvg />}
      </div>

      {/* ===== PORTFOLIO SECTION: HORIZONTAL (Desktop) / VERTICAL (Mobile) ===== */}
      {!isMobile ? (
        <div className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hidden">
          {/* Hide scrollbar */}
          <style jsx>{`
            .scrollbar-hidden::-webkit-scrollbar { display: none; }
            .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          <div className="flex h-screen">
            {/* Gradient Intro Screen */}
            <div className="flex-shrink-0 w-screen h-full flex items-center justify-center bg-gradient-to-t from-blue-950 to-red-950 snap-center" />

            {/* Portfolio Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-screen h-full snap-center"
              >
                <PortfolioItem
                  item={item}
                  isActiveTab={activeTabs[item.id]}
                  isReadMore={readMore[item.id]}
                  onTabClick={handleTabClick}
                  onReadMoreClick={handleReadMoreClick}
                  isMobile={isMobile}
                />
              </div>
            ))}
          </div>

          {/* Scroll Hint Arrow (Desktop Only) */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      ) : (
        /* Mobile: Vertical Stack */
        <div className="flex flex-col bg-[#121212]">
          {memoizedItems}
        </div>
      )}

      {/* ===== CTA SECTION ===== */}
      <div className={`w-screen flex flex-col gap-16 items-center text-white justify-center text-center ${isMobile ? 'h-auto py-16 bg-[#121212]' : 'h-screen bg-gradient-to-b from-blue-950 to-black'}`}>
        <h1 className="text-4xl lg:text-8xl font-extrabold">
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
                Full-Stack JS/TS Software Developer
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
    </motion.div>
  );
};

export default PortfolioPage;
