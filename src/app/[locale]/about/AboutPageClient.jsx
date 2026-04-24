"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  getFadeInUpProps,
  getFadeInUpInViewProps,
} from "@/lib/motionVariants";
import { useRef, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import HoverSkill from "@/components/hoverSkill";
import MixedHeadline from "@/components/mixedHeadline";
import TimelineList from "@/components/timeline/timelineList";
import FeaturedCaseStudy from "@/components/featuredCaseStudy";
import TestimonialsSection from "@/components/testimonialsSection";
import Brain from "@/components/svgs/brain";
import SignatureSvg from "@/components/svgs/signature";
import ScrollSvg from "@/components/svgs/scroll";
import { Link } from "@/i18n/navigation";
import skillsData from "../../../../public/data/skills.json";
import experienceData from "../../../../public/data/experience.json";
import { useMessages, useTranslations } from "next-intl";
import { RESUME_PATH } from "@/lib/resume";
import { useAppScrollContainerRef } from "@/components/scrollContainerContext";
import Loader from "@/components/loader";
import { usePageImageLoader } from "@/hooks/usePageImageLoader";
import { useElementViewportProgress } from "@/hooks/useElementViewportProgress";

const ABOUT_IMAGE_URLS = [
  "/images/profilepic.webp",
  "/images/arturorodes.webp",
];

/**
 * About page client: biography, skills, languages, and experience.
 */
const AboutPageClient = () => {
  const t = useTranslations("About");
  const messages = useMessages();
  const languageItems = messages.About.langItems;

  /**
   * Same ref as on `#app-scroll-root` in TransitionProvider. Used for in-view and hire CTA.
   */
  const scrollContainerRef = useAppScrollContainerRef();

  const skillRef = useRef(null);
  const isSkillRefInView = useInView(skillRef, { margin: "-100px" });

  const experienceRef = useRef(null);
  const isExperienceRefInView = useInView(experienceRef, { margin: "-100px" });

  const brainScrollProgress = useElementViewportProgress(experienceRef);

  const languageRef = useRef(null);
  const isLanguageRefInView = useInView(languageRef, { margin: "-100px" });

  const { showLoader } = usePageImageLoader(ABOUT_IMAGE_URLS);
  const reducedMotion = useReducedMotion();

  const pageMotionRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  /**
   * Framer’s `x` uses `transform` on this node; that creates a containing block and
   * breaks `position: sticky` in descendants relative to #app-scroll-root. Clear
   * after the entrance so the experience brain can stick in the main scrollport.
   */
  const clearPageEntryTransform = useCallback(() => {
    const el = pageMotionRef.current;
    if (!el) return;
    el.style.removeProperty("transform");
  }, []);

  useEffect(() => {
    const id = window.setTimeout(clearPageEntryTransform, 1200);
    return () => window.clearTimeout(id);
  }, [clearPageEntryTransform]);

  const memoizedSkills = useMemo(
    () =>
      skillsData.map((skill, index) => (
        <HoverSkill key={index}>
          {{
            children: skill.name,
            hoverBgColor: skill.hoverColor,
            hoverTextColor: skill.hoverTextColor,
          }}
        </HoverSkill>
      )),
    []
  );

  return (
    <>
      {showLoader && <Loader />}
      <motion.div
        ref={pageMotionRef}
        className="w-full min-h-0"
        initial={{ x: "-200vh", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        transition={{ duration: 1 }}
        onAnimationComplete={clearPageEntryTransform}
        aria-busy={showLoader}
      >
      <div className="relative z-10 flex flex-col gap-24 p-4 text-stone-100 page-gradient sm:p-6 md:gap-32 md:p-10 lg:gap-48 lg:p-16 xl:gap-64 xl:p-20 2xl:p-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10 sm:gap-12">
            <motion.div {...getFadeInUpProps(!!reducedMotion, 0)}>
              <Image
                src="/images/profilepic.webp"
                alt="Profile Picture"
                width={256}
                height={256}
                className="h-40 w-40 rounded-full object-cover ring-2 ring-stone-600/50 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64"
                priority
                unoptimized
              />
            </motion.div>
            <motion.div
              className="w-full"
              {...getFadeInUpProps(!!reducedMotion, 0.08)}
            >
              <MixedHeadline
                as="h1"
                line={t("biography")}
                className="text-center text-3xl sm:text-4xl md:text-5xl"
              />
            </motion.div>
            <motion.p
              className="w-full max-w-5xl text-center text-lg leading-relaxed text-stone-300 [text-wrap:balance] sm:text-xl md:max-w-6xl md:text-2xl xl:max-w-7xl"
              {...getFadeInUpProps(!!reducedMotion, 0.14)}
            >
              {t("bio")}
            </motion.p>
            <motion.p
              className="w-full max-w-5xl text-center text-base leading-relaxed text-stone-400 [text-wrap:balance] sm:text-lg md:max-w-6xl"
              {...getFadeInUpProps(!!reducedMotion, 0.2)}
            >
              {t("bioPath")}
            </motion.p>
            <motion.blockquote
              className="w-full max-w-5xl text-center text-xl font-editorial italic leading-relaxed text-stone-400 [text-wrap:balance] sm:text-2xl md:max-w-6xl xl:max-w-7xl"
              {...getFadeInUpProps(!!reducedMotion, 0.26)}
            >
              {t("quoteFowler")}
            </motion.blockquote>
            <motion.blockquote
              className="w-full max-w-5xl text-center text-lg font-editorial italic text-stone-500 [text-wrap:balance] sm:text-xl md:max-w-6xl md:text-2xl xl:max-w-7xl"
              {...getFadeInUpProps(!!reducedMotion, 0.32)}
            >
              {t("quoteMe")}
            </motion.blockquote>
            <motion.div
              className="self-end"
              {...getFadeInUpProps(!!reducedMotion, 0.38)}
            >
              <SignatureSvg />
            </motion.div>
            <motion.div {...getFadeInUpProps(!!reducedMotion, 0.44)}>
              <ScrollSvg />
            </motion.div>
          </div>
          <FeaturedCaseStudy />
          <div
            className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-12 xl:max-w-7xl 2xl:px-2"
            ref={skillRef}
          >
            <motion.h1
              initial={{ x: "-300px", opacity: 0 }}
              animate={isSkillRefInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="font-display text-stone-200 font-semibold text-2xl tracking-tight"
            >
              {t("skills")}
            </motion.h1>
            <motion.div
              initial={{ x: "-300px", opacity: 0 }}
              animate={isSkillRefInView ? { x: 0, opacity: 1 } : {}}
              className="flex flex-wrap justify-center gap-1.5 sm:gap-3 md:justify-start md:gap-4 lg:gap-5"
            >
              {memoizedSkills}
            </motion.div>
            <div className="flex justify-center">
              <ScrollSvg />
            </div>
          </div>
          <div
            className="mx-auto flex w-full max-w-6xl flex-col justify-center gap-12 xl:max-w-7xl 2xl:px-2"
            ref={languageRef}
          >
            <motion.h1
              initial={{ x: "-300px", opacity: 0 }}
              animate={isLanguageRefInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="font-display text-stone-200 font-semibold text-2xl tracking-tight"
            >
              {t("languagesHeading")}
            </motion.h1>
            <motion.ul
              initial={{ x: "-300px", opacity: 0 }}
              animate={isLanguageRefInView ? { x: 0, opacity: 1 } : {}}
              className="w-full list-inside list-disc space-y-2 text-center text-lg md:text-left"
            >
              {languageItems.map((lang) => (
                <li key={lang.name}>
                  <span className="font-semibold">{lang.name}</span>
                  {lang.note ? `: ${lang.note}` : ""}
                </li>
              ))}
            </motion.ul>
            <motion.p
              className="mx-auto w-full max-w-3xl text-center text-sm text-stone-400 [text-wrap:balance] md:mx-0 md:text-left"
              initial={{ x: "-300px", opacity: 0 }}
              animate={isLanguageRefInView ? { x: 0, opacity: 1 } : {}}
            >
              {t("languagesNote")}
            </motion.p>
            <div className="flex justify-center">
              <ScrollSvg />
            </div>
          </div>
          <div
            className="relative flex min-w-0 flex-col gap-12 pb-24 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-stretch lg:gap-x-8 lg:gap-y-0 xl:gap-x-10"
            ref={experienceRef}
          >
            <motion.h1
              initial={{ x: "-300px", opacity: 0 }}
              animate={isExperienceRefInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="font-display text-stone-200 font-semibold text-2xl tracking-tight lg:col-span-2"
            >
              {t("experience")}
            </motion.h1>
            <div className="relative z-10 bg-neutral-950/96 backdrop-blur-[2px] sm:bg-neutral-950/94 md:bg-stone-950/90 lg:col-start-1 lg:bg-transparent lg:backdrop-blur-none">
              <TimelineList
                experiences={experienceData}
                isInView={isExperienceRefInView}
              />
            </div>
            {/* Desktop: Sticky must sit in a full-height track (tall as the timeline
                cell). Inset-0 gives a box as tall as the row; `transform` on the page
                `motion` ancestor is cleared after the entrance (see ref). */}
            <div
              className="relative -mr-4 hidden min-w-0 sm:-mr-6 md:-mr-10 lg:col-start-2 lg:row-start-2 lg:block lg:h-full lg:min-h-0 lg:max-w-none lg:self-stretch lg:-mr-16 xl:-mr-20 2xl:-mr-24"
            >
              <div className="absolute inset-0 z-20 min-h-0 min-w-0">
                <div className="sticky top-0 z-30 flex h-[100dvh] w-full min-h-0 min-w-0 items-center justify-end pl-0 sm:pl-1 md:pl-2 lg:pl-3">
                  <div className="h-[min(86dvh,960px)] w-full 2xl:h-[min(84dvh,1000px)]">
                    <Brain
                      className="h-full w-full"
                      preserveAspectRatio="xMaxYMid meet"
                      scrollYProgress={brainScrollProgress}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile/tablet: Brain as ambient background behind timeline. */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.16] sm:opacity-[0.22] md:opacity-[0.28] lg:hidden">
              <Brain
                className="h-full w-full"
                preserveAspectRatio="none"
                scrollYProgress={brainScrollProgress}
              />
            </div>
          </div>
          <TestimonialsSection />
          <motion.div
            className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 pb-32 text-center sm:px-6"
            {...getFadeInUpInViewProps(scrollContainerRef, 0, !!reducedMotion)}
          >
            <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-100 md:text-3xl">
              {t("hireCtaTitle")}
            </h2>
            <p className="text-lg leading-relaxed text-stone-400 [text-wrap:balance]">
              {t("hireCtaBody")}
            </p>
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="btn-primary !px-6 !py-3.5 text-center sm:!px-8"
                aria-label={t("ariaHireCtaContact")}
              >
                {t("hireCtaContact")}
              </Link>
              <a
                href={RESUME_PATH}
                download
                className="btn-secondary !px-6 !py-3.5 text-center sm:!px-8"
                aria-label={t("ariaHireCtaResume")}
              >
                {t("hireCtaResume")}
              </a>
            </div>
          </motion.div>
      </div>
    </motion.div>
    </>
  );
};

export default AboutPageClient;
