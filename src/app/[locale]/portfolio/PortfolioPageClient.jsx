"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import PortfolioItem from "@/components/portfolioItem";
import items from "../../../../public/data/portfolioItems.json";
import MixedHeadline from "@/components/mixedHeadline";
import CredibilityStrip from "@/components/credibilityStrip";
import ScrollSvg from "@/components/svgs/scroll";
import { useTranslations } from "next-intl";
import { RESUME_PATH } from "@/lib/resume";
import { useAppScrollContainerRef } from "@/components/scrollContainerContext";
import Loader from "@/components/loader";
import { usePageImageLoader } from "@/hooks/usePageImageLoader";
import { fadeInUp, fadeInUpInView } from "@/lib/motionVariants";
const PORTFOLIO_IMAGE_URLS = items.map((item) => item.img);
const PortfolioPageClient = () => {
  const t = useTranslations("Portfolio");
  const rm = useReducedMotion();
  const mainScrollRef = useAppScrollContainerRef();
  const { showLoader } = usePageImageLoader(PORTFOLIO_IMAGE_URLS);
  const [activeTabs, setActiveTabs] = useState(() =>
    items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: "skills",
      }),
      {},
    ),
  );
  const [readMore, setReadMore] = useState(() =>
    items.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: false,
      }),
      {},
    ),
  );
  const handleTabClick = useCallback((id, tab) => {
    setActiveTabs((prevTabs) => ({
      ...prevTabs,
      [id]: tab,
    }));
  }, []);
  const handleReadMoreClick = useCallback((id) => {
    setReadMore((prevReadMore) => ({
      ...prevReadMore,
      [id]: !prevReadMore[id],
    }));
  }, []);
  const memoizedItems = useMemo(
    () =>
      items.map((item, index) => (
        <PortfolioItem
          key={item.id}
          item={item}
          isActiveTab={activeTabs[item.id]}
          isReadMore={readMore[item.id]}
          onTabClick={handleTabClick}
          onReadMoreClick={handleReadMoreClick}
          priority={index === 0}
        />
      )),
    [activeTabs, readMore, handleTabClick, handleReadMoreClick],
  );
  const heroChips = [t("chip1"), t("chip2"), t("chip3")];
  return (
    <>
      {showLoader && <Loader />}
      <motion.div
        className="h-full"
        initial={{
          y: "-200vh",
        }}
        animate={{
          y: "0%",
        }}
        transition={{
          duration: 1,
        }}
        aria-busy={showLoader}
      >
        <div className="flex w-full min-w-0 flex-col items-center justify-center gap-8 px-4 py-8 text-stone-100 page-gradient lg:min-h-[calc(100vh-6rem)] lg:gap-12 lg:py-12 xl:gap-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 sm:max-w-5xl lg:max-w-6xl lg:gap-8 xl:max-w-7xl 2xl:max-w-[min(112rem,calc(100vw-3rem))]">
            <motion.div
              {...fadeInUp(0.25, !!rm)}
              className="w-full text-center"
            >
              <MixedHeadline
                line={t("someOfMyWork")}
                as="h2"
                className="inline-block max-w-[min(100%,calc(100vw-2rem))] whitespace-nowrap text-center text-2xl !font-extrabold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
              />
            </motion.div>
            <div className="flex w-full flex-col items-center gap-6 lg:gap-8">
              <motion.div
                {...fadeInUp(0.4, !!rm)}
                className="flex w-full justify-center"
              >
                <CredibilityStrip
                  proofLine={t("heroSubhead")}
                  chips={heroChips}
                  chipsAriaLabel={t("chipsAriaLabel")}
                  centered
                  className="max-w-3xl xl:max-w-4xl 2xl:max-w-5xl"
                />
              </motion.div>
            </div>
          </div>
          <motion.div
            {...fadeInUp(0.55, !!rm)}
            className="hidden w-full justify-center lg:flex"
          >
            <ScrollSvg />
          </motion.div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-6 pb-24 page-gradient-deep sm:gap-10 sm:pb-28 md:gap-12 md:pb-32 lg:pb-40">
          {memoizedItems}
        </div>

        <div className="flex w-full min-w-0 flex-col items-center justify-center gap-8 px-4 py-16 text-stone-100 page-gradient-deep lg:min-h-screen lg:gap-12 lg:py-12">
          <motion.div
            {...fadeInUpInView(mainScrollRef, 0, !!rm)}
            className="w-full max-w-4xl px-2 text-center sm:px-4"
          >
            <MixedHeadline
              line={t("projectQuestion")}
              as="h1"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl !font-extrabold text-balance"
            />
          </motion.div>
          <motion.p
            {...fadeInUpInView(mainScrollRef, 0.1, !!rm)}
            className="mx-auto max-w-xl px-2 text-center text-base text-stone-400 sm:text-lg"
          >
            {t("availabilityLine")}
          </motion.p>
          <motion.div
            {...fadeInUpInView(mainScrollRef, 0.2, !!rm)}
            className="flex w-full flex-wrap items-center justify-center gap-4 px-2"
          >
            <a
              href={RESUME_PATH}
              download
              className="btn-secondary !px-5 !py-2.5 text-sm sm:!text-base"
              aria-label={t("ariaFooterResume")}
            >
              {t("footerResume")}
            </a>
          </motion.div>
          <motion.div
            {...fadeInUpInView(mainScrollRef, 0.3, !!rm)}
            className="relative mx-auto mt-4 w-full max-w-[min(100%,36rem)] md:max-w-[min(100%,42rem)]"
          >
            <motion.svg
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                ease: "linear",
                repeat: Infinity,
              }}
              viewBox="0 0 300 300"
              className="mx-auto block h-64 w-64 md:h-[500px] md:w-[500px]"
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
                  {t("devRole")}
                </textPath>
              </text>
            </motion.svg>
            <Link
              href="/contact"
              className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full border border-sky-400/50 bg-sky-500 font-display text-sm font-extrabold text-white shadow-sm md:h-28 md:w-28 md:text-base"
              aria-label={t("ariaHire")}
            >
              <motion.span
                className="px-1 text-center"
                animate={
                  rm
                    ? {}
                    : {
                        scale: [1, 1.08, 1],
                        transition: {
                          repeat: Infinity,
                          duration: 1,
                        },
                      }
                }
                whileTap={{
                  scale: 0.92,
                }}
              >
                {t("hireMe")}
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};
export default PortfolioPageClient;
