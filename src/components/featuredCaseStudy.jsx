"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const CASE_IMG = "/images/arturorodes.webp";
const CASE_HREF = "https://arturorodes.com";

/**
 * Deep-dive case study block (single flagship project).
 */
export default function FeaturedCaseStudy() {
  const t = useTranslations("About.caseStudy");
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-2xl border border-stone-700/45 bg-stone-900/25 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.4)] sm:p-8 xl:max-w-7xl lg:flex-row lg:items-start lg:gap-10"
      aria-labelledby="case-study-heading"
    >
      <motion.div
        className="relative w-full shrink-0 self-start overflow-hidden rounded-xl border border-stone-800/60 bg-stone-950/50 lg:w-[min(100%,420px)]"
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={CASE_IMG}
          alt={t("imageAlt")}
          width={1200}
          height={900}
          className="h-auto w-full max-w-full object-contain object-top"
          sizes="(max-width: 1024px) 100vw, 420px"
          priority
          unoptimized
        />
      </motion.div>
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <h2
          id="case-study-heading"
          className="font-display text-2xl font-semibold tracking-tight text-stone-100 md:text-3xl"
        >
          {t("title")}
        </h2>
        <p className="text-lg leading-relaxed text-stone-300 [text-wrap:pretty]">
          {t("lede")}
        </p>
        <div className="space-y-3 text-base leading-relaxed text-stone-400 [text-wrap:pretty]">
          <p>
            <span className="font-semibold text-stone-300">{t("problemLabel")}</span>{" "}
            {t("problem")}
          </p>
          <p>
            <span className="font-semibold text-stone-300">{t("approachLabel")}</span>{" "}
            {t("approach")}
          </p>
          <p>
            <span className="font-semibold text-stone-300">{t("outcomeLabel")}</span>{" "}
            {t("outcome")}
          </p>
        </div>
        <a
          href={CASE_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-fit items-center gap-2 text-base font-semibold text-sky-400 underline-offset-4 transition hover:text-sky-300 hover:underline"
        >
          {t("linkLabel")}
          <span aria-hidden>↗</span>
        </a>
      </div>
    </section>
  );
}
