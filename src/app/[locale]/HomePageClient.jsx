"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { getFadeInUpProps } from "@/lib/motionVariants";
import TypingAnimation from "@/components/typingAnimation";
import CredibilityStrip from "@/components/credibilityStrip";
import { Link } from "@/i18n/navigation";
import Loader from "@/components/loader";
import { useLocale, useTranslations } from "next-intl";
import typingTextsByLocale from "../../../public/data/typingTexts.json";
import { RESUME_PATH } from "@/lib/resume";
import { usePageImageLoader } from "@/hooks/usePageImageLoader";
const HOME_IMAGE_URLS = ["/hero.webp", "/hero1.webp"];
const HomePageClient = () => {
  const t = useTranslations("Home");
  const locale = useLocale();
  const texts = typingTextsByLocale[locale] ?? typingTextsByLocale.en;
  const [mouseY, setMouseY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(1080);
  const { showLoader } = usePageImageLoader(HOME_IMAGE_URLS);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textContainerRef = useRef(null);
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
            !!document.msFullscreenElement,
        );
      };
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.addEventListener("mozfullscreenchange", handleFullscreenChange);
      document.addEventListener("MSFullscreenChange", handleFullscreenChange);
      handleFullscreenChange();
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange,
        );
        document.removeEventListener(
          "webkitfullscreenchange",
          handleFullscreenChange,
        );
        document.removeEventListener(
          "mozfullscreenchange",
          handleFullscreenChange,
        );
        document.removeEventListener(
          "MSFullscreenChange",
          handleFullscreenChange,
        );
      };
    }
    return undefined;
  }, []);
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
  if (showLoader) {
    return <Loader />;
  }
  return (
    <>
      <motion.div
        className="flex w-full min-h-0 flex-1 flex-col text-stone-100 page-gradient"
        initial={false}
        animate={{
          x: "0%",
          opacity: 1,
        }}
        transition={{
          duration: 0.4,
        }}
        aria-busy={false}
      >
        <div className="mx-auto flex w-full min-h-0 max-w-screen-3xl flex-1 flex-col items-stretch gap-0 pb-6 pt-1 sm:pb-8 sm:pt-2 md:min-h-0 md:pb-8 lg:min-h-[min(100dvh,100%)] lg:flex-row lg:items-stretch lg:pb-0 lg:pt-0 3xl:min-h-0 4xl:max-w-[min(100rem,100%)]">
          <div
            className="relative z-10 order-1 flex w-full min-h-[min(45dvh,20rem)] flex-1 flex-col items-center justify-center overflow-hidden min-[380px]:min-h-[min(50dvh,24rem)] sm:min-h-[min(52dvh,28rem)] sm:my-2 md:min-h-[min(55dvh,30rem)] md:my-3 lg:order-1 lg:my-0 lg:min-h-0 lg:max-w-[50%] lg:shrink-0 lg:basis-1/2 lg:py-2 xl:py-4 2xl:py-6 3xl:max-w-[min(50%,48rem)]"
          >
            <motion.div
              className="absolute inset-0 m-1 min-[400px]:m-2 sm:m-3 md:m-4 lg:m-2 lg:min-h-0 2xl:m-4"
              {...getFadeInUpProps(!!reducedMotion, 0.04)}
            >
              <div className="absolute inset-0">
                <Image
                  src="/hero.webp"
                  alt={t("ariaHeroBottom")}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                  className="object-contain object-bottom sm:object-center"
                  priority
                  unoptimized
                  sizes="(max-width: 1023px) 100vw, (max-width: 1920px) 50vw, min(50vw, 1200px)"
                />
              </div>
              <div
                className="absolute inset-0"
                style={{
                  clipPath: `inset(0px 0px ${topHeroClipBottom}px 0px)`,
                }}
              >
                <Image
                  src="/hero1.webp"
                  alt={t("ariaHeroTop")}
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                  className="object-contain object-bottom sm:object-center"
                  priority
                  unoptimized
                  sizes="(max-width: 1023px) 100vw, (max-width: 1920px) 50vw, min(50vw, 1200px)"
                />
              </div>
            </motion.div>
          </div>
          <div
            className="order-2 flex min-h-0 w-full min-w-0 max-w-full flex-col items-center justify-center px-3 [padding-bottom:max(1rem,env(safe-area-inset-bottom))] [padding-left:max(0.75rem,env(safe-area-inset-left))] [padding-right:max(0.75rem,env(safe-area-inset-right))] min-[400px]:px-4 sm:px-6 sm:min-h-0 sm:py-2 md:px-8 md:py-4 lg:min-h-0 lg:w-1/2 lg:max-w-[50%] lg:shrink-0 lg:basis-1/2 lg:px-6 lg:py-2 xl:px-10 2xl:px-12 2xl:py-6 3xl:px-14 3xl:py-8 4xl:px-20"
            ref={textContainerRef}
          >
            <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-5 text-center min-[400px]:gap-6 min-[500px]:gap-8 min-[500px]:max-w-4xl sm:gap-9 sm:pt-0 md:max-w-5xl lg:max-w-3xl lg:items-start lg:gap-8 lg:text-left xl:max-w-4xl 2xl:max-w-5xl 2xl:gap-10 3xl:max-w-6xl 3xl:gap-12 4xl:pl-2">
              <motion.div
                className="z-0 flex w-full min-h-[13rem] flex-col items-center justify-end text-center min-[400px]:min-h-[15rem] min-[500px]:min-h-[16rem] sm:min-h-[17rem] sm:items-center sm:justify-center md:min-h-[19rem] lg:min-h-[20rem] lg:items-start lg:justify-start lg:pb-1 lg:text-left xl:min-h-[22rem] 2xl:min-h-[24rem] 3xl:min-h-[26rem] 3xl:pb-2 4xl:min-h-[28rem]"
                {...getFadeInUpProps(!!reducedMotion, 0.08)}
              >
                <TypingAnimation texts={texts} />
              </motion.div>
              <motion.div
                className="z-0 mb-1 flex w-full max-w-full flex-col items-stretch justify-center gap-3 min-[500px]:flex-row min-[500px]:flex-wrap min-[500px]:justify-center min-[500px]:gap-3 sm:mb-2 sm:gap-4 md:gap-4 lg:mb-0 lg:justify-start lg:gap-3 2xl:gap-4"
                {...getFadeInUpProps(!!reducedMotion, 0.2)}
              >
                <Link
                  href="/portfolio"
                  className="btn-primary min-h-11 w-full !px-5 !py-3.5 !text-[0.95rem] min-[500px]:w-auto min-[500px]:min-w-[8.5rem] min-[500px]:!px-6 sm:!py-3.5 sm:!text-base md:!px-7 2xl:!px-8 2xl:!py-4 2xl:!text-lg"
                  aria-label={t("ariaViewWork")}
                >
                  {t("viewWork")}
                </Link>
                <Link
                  href="/contact"
                  className="btn-secondary min-h-11 w-full !px-5 !py-3.5 !text-[0.95rem] min-[500px]:w-auto min-[500px]:min-w-[8.5rem] min-[500px]:!px-6 sm:!py-3.5 sm:!text-base md:!px-7 2xl:!px-8 2xl:!py-4 2xl:!text-lg"
                  aria-label={t("ariaContact")}
                >
                  {t("contactMe")}
                </Link>
                <a
                  href={RESUME_PATH}
                  download
                  className="btn-secondary min-h-11 w-full !px-5 !py-3.5 !text-center !text-[0.95rem] min-[500px]:w-auto min-[500px]:min-w-[8.5rem] min-[500px]:!px-6 sm:!py-3.5 sm:!text-base md:!px-7 2xl:!px-8 2xl:!py-4 2xl:!text-lg"
                  aria-label={t("ariaResume")}
                >
                  {t("downloadResume")}
                </a>
              </motion.div>
              <motion.div
                className="w-full max-w-full 2xl:max-w-2xl 3xl:max-w-3xl"
                {...getFadeInUpProps(!!reducedMotion, 0.32)}
              >
                <CredibilityStrip
                  proofLine={t("proofLine")}
                  chips={[t("chip1"), t("chip2"), t("chip3")]}
                  chipsAriaLabel={t("chipsAriaLabel")}
                  className="max-w-full 2xl:max-w-2xl"
                />
              </motion.div>
              {!isFullscreen && (
                <motion.button
                  type="button"
                  onClick={openFullscreen}
                  className="mt-0 hidden min-h-11 min-w-[8.5rem] items-center justify-center rounded-full border border-stone-600/70 bg-stone-900/40 px-5 py-2.5 text-sm font-display text-stone-200 transition hover:border-stone-500 lg:mt-1 lg:inline-flex lg:px-6 lg:py-3 lg:text-base 2xl:px-7 2xl:py-3.5"
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
export default HomePageClient;
