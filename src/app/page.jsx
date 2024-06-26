"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import TypingAnimation from "../components/typingAnimation";
import Link from "next/link";
import Loader from "../components/loader";
import textsData from "../../public/data/typingTexts.json";

const Homepage = () => {
  const [mouseY, setMouseY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textContainerRef = useRef(null);
  const controls = useAnimation();
  const { texts } = textsData;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowHeight(window.innerHeight);

      const handleMouseMove = (e) => {
        setMouseY(e.clientY);
      };

      const handleFullscreenChange = () => {
        setIsFullscreen(
          !!document.fullscreenElement ||
          !!document.webkitFullscreenElement ||
          !!document.mozFullScreenElement ||
          !!document.msFullscreenElement
        );
      };

      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.addEventListener("mozfullscreenchange", handleFullscreenChange);
      document.addEventListener("MSFullscreenChange", handleFullscreenChange);

      handleFullscreenChange();

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("fullscreenchange", handleFullscreenChange);
        document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
        document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      };
    }

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const startFloatingAnimation = () => {
      setTimeout(() => {
        if (isMounted) {
          controls.start({
            y: ["10px", "-10px", "10px", "-10px"],
            x: ["20px", "-20px", "20px"],
            transition: {
              y: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              },
              x: {
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              },
            },
          });
        }
      }, 15000);
    };

    document.addEventListener("click", startFloatingAnimation);

    return () => {
      isMounted = false;
      document.removeEventListener("click", startFloatingAnimation);
      controls.stop();
    };
  }, [controls]);

  const openFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }, []);

  useEffect(() => {
    if (textContainerRef.current) {
      const textContainerHeight = textContainerRef.current.offsetHeight;
      if (textContainerHeight > windowHeight) {
        setWindowHeight(textContainerHeight);
      }
    }
  }, [windowHeight, texts]);

  return (
    <>
      {loading && <Loader />}
      <motion.div
        className="min-h-screen w-screen text-white bg-gradient-to-b from-blue-950 to-red-950"
        initial={{ x: "-300vw" }}
        animate={{ x: "0%" }}
        transition={{ duration: 1 }}
      >
        <div className="h-full flex flex-col lg:flex-row">
          {/* IMAGE CONTAINER */}
          <motion.div
            className="relative overflow-hidden flex-1 flex items-center justify-center lg:justify-end min-h-[50vh] lg:min-h-screen"
            style={{ margin: "20px 0", zIndex: 10 }}
            animate={controls}
          >
            {/* Bottom Image (hero.png) */}
            <div className="absolute inset-0">
              <Image
                src="/hero.png"
                alt="Gabriel Sketch Portrait"
                fill
                style={{ objectFit: "contain" }}
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setLoading(false)}
              />
            </div>
            {/* Top Image (hero1.png) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `inset(0px 0px ${windowHeight - mouseY - 20}px 0px)`,
              }}
            >
              <Image
                src="/hero1.png"
                alt="Gabriel Artistic Portrait"
                fill
                style={{ objectFit: "contain" }}
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => setLoading(false)}
              />
            </div>
          </motion.div>
          {/* TEXT CONTAINER */}
          <div
            className="flex-1 flex items-center justify-center lg:justify-stretch px-4 sm:px-8 md:px-12 lg:pr-0 lg:pl-0 min-h-[70vh] lg:min-h-screen"
            ref={textContainerRef}
          >
            <div className="w-full xl:w-1/2 flex flex-col gap-8 items-center lg:items-start justify-center text-center lg:text-left">
              {/* TITLE */}
              <div className="text-4xl md:text-6xl font-bold z-0">
                <TypingAnimation texts={texts} />
              </div>
              {/* DESCRIPTION */}
              <p className="md:text-xl z-0 px-4 sm:px-8 md:px-12 lg:px-0">
                Welcome to my digital canvas, where innovation and creativity
                converge. With a keen eye for aesthetics and a mastery of both
                front-end and back-end development, my portfolio showcases a
                diverse collection of projects that reflect my commitment to
                excellence. From advanced online platforms to secure cloud
                storage solutions, each project demonstrates my dedication to
                creating efficient, scalable, and visually appealing web
                applications. Explore my work and discover the passion and
                expertise that drive me to deliver exceptional results in every
                endeavor.
              </p>
              {/* BUTTONS */}
              <div className="w-full flex flex-col lg:flex-row gap-4 z-0 mb-5 px-4 sm:px-8 md:px-12 lg:px-0">
                <Link
                  href="/portfolio"
                  className="p-4 rounded-lg ring-1 ring-white bg-white text-black font-extrabold"
                  aria-label="View my work"
                >
                  View My Work
                </Link>
                <Link
                  href="/contact"
                  className="p-4 rounded-lg ring-1 ring-white"
                  aria-label="Contact me"
                >
                  Contact Me
                </Link>
              </div>
              {/* Fullscreen Button - Visible on large screens and up */}
              {!isFullscreen && (
                <button
                  onClick={openFullscreen}
                  className="hidden lg:block p-4 mt-4 bg-white text-black ring-black border-4 rounded-full"
                >
                  Go Fullscreen
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Homepage;
