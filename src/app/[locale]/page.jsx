"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import {
  getFadeInUpProps,
} from "@/lib/motionVariants";
import TypingAnimation from "@/components/typingAnimation";
import CredibilityStrip from "@/components/credibilityStrip";
import { Link } from "@/i18n/navigation";
import Loader from "@/components/loader";
import { useLocale, useTranslations } from "next-intl";
import typingTextsByLocale from "../../../public/data/typingTexts.json";
import { RESUME_PATH } from "@/lib/resume";
import { usePageImageLoader } from "@/hooks/usePageImageLoader";

const HOME_IMAGE_URLS = ["/hero.png", "/hero1.png"];

const Homepage = () => {
  const t = useTranslations("Home");
  const locale = useLocale();
  const texts =
    typingTextsByLocale[locale] ?? typingTextsByLocale.en;
  const [mouseY, setMouseY] = useState(0);
  // Not 0: clip would be invalid. Same default on server + client to avoid hydration mismatch.
  const [windowHeight, setWindowHeight] = useState(1080);
  const { showLoader } = usePageImageLoader(HOME_IMAGE_URLS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textContainerRef = useRef(null);
  const controls = useAnimation();
  const reducedMotion = useReducedMotion();

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
    return undefined;
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

  const topHeroClipBottom = Math.max(0, windowHeight - mouseY - 20);

  return (
    <>
      {showLoader && <Loader />}
      <motion.div
        className="flex w-full min-h-0 flex-1 flex-col text-stone-100 page-gradient"
        initial={{ x: "-300vw", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        transition={{ duration: 1 }}
        aria-busy={showLoader}
      >
        <div className="flex w-full min-h-0 flex-1 flex-col items-stretch lg:flex-row">
          <motion.div
            className="relative z-10 my-5 flex w-full min-w-0 min-h-[50vh] flex-1 flex-col items-center justify-center overflow-hidden sm:min-h-[55vh] lg:my-0 lg:min-h-0 lg:max-w-[50%] lg:shrink-0 lg:basis-1/2 lg:justify-end"
            animate={controls}
          >
            <motion.div
              className="absolute inset-0"
              {...getFadeInUpProps(!!reducedMotion, 0.04)}
            >
              <div className="absolute inset-0">
                <Image
                  src="/hero.png"
                  alt={t("ariaHeroBottom")}
                  fill
                  style={{ objectFit: "contain" }}
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(0px 0px ${topHeroClipBottom}px 0px)`,
                }}
              >
                <Image
                  src="/hero1.png"
                  alt={t("ariaHeroTop")}
                  fill
                  style={{ objectFit: "contain" }}
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </motion.div>
          </motion.div>
          <div
            className="flex min-h-[70vh] w-full min-w-0 flex-col items-center justify-center px-4 sm:px-8 md:px-10 lg:min-h-0 lg:w-1/2 lg:px-12 xl:px-16 2xl:px-20"
            ref={textContainerRef}
          >
            <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-8 text-center sm:gap-10 lg:items-start lg:py-4 lg:text-left">
              <motion.div
                className="z-0 flex w-full min-h-[20rem] flex-col items-center justify-center text-center sm:min-h-[22rem] md:min-h-[26rem] lg:min-h-[30rem] lg:items-start lg:justify-start lg:text-left xl:min-h-[36rem] 2xl:min-h-[38rem]"
                {...getFadeInUpProps(!!reducedMotion, 0.08)}
              >
                <TypingAnimation texts={texts} />
              </motion.div>
              <motion.div
                className="z-0 mb-2 flex w-full flex-col flex-wrap justify-center gap-4 sm:flex-row sm:gap-5 lg:justify-start"
                {...getFadeInUpProps(!!reducedMotion, 0.2)}
              >
                <Link
                  href="/portfolio"
                  className="btn-primary !px-6 !py-3.5 !text-base sm:!px-8 sm:!py-4 sm:!text-lg"
                  aria-label={t("ariaViewWork")}
                >
                  {t("viewWork")}
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary !px-6 !py-3.5 !text-base sm:!px-8 sm:!py-4 sm:!text-lg"
                  aria-label={t("ariaContact")}
                >
                  {t("contactMe")}
                </Link>
                <a
                  href={RESUME_PATH}
                  download
                  className="btn-secondary !px-6 !py-3.5 !text-center !text-base sm:!px-8 sm:!py-4 sm:!text-lg"
                  aria-label={t("ariaResume")}
                >
                  {t("downloadResume")}
                </a>
              </motion.div>
              <motion.div {...getFadeInUpProps(!!reducedMotion, 0.32)}>
                <CredibilityStrip
                  proofLine={t("proofLine")}
                  chips={[t("chip1"), t("chip2"), t("chip3")]}
                  chipsAriaLabel={t("chipsAriaLabel")}
                  className="max-w-2xl"
                />
              </motion.div>
              {!isFullscreen && (
                <motion.button
                  type="button"
                  onClick={openFullscreen}
                  className="hidden lg:inline-flex mt-1 rounded-full border border-stone-600/70 bg-stone-900/40 px-6 py-3 text-base font-display text-stone-200 transition hover:border-stone-500"
                  {...getFadeInUpProps(!!reducedMotion, 0.42)}
                >
                  {t("goFullscreen")}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Homepage;
