"use client";

import React, { useMemo, useCallback, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import HoverSkill from "@/components/hoverSkill";
import { useTranslations } from "next-intl";
import { useAppScrollContainerRef } from "@/components/scrollContainerContext";

const PORTFOLIO_IMAGE_BLUR =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+vxhHgAH2wJ/4fN7VQAAAABJRU5ErkJggg==";

/**
 * PortfolioItem Component
 * Displays a portfolio item with title, image, description, and skills.
 *
 * @param {Object} item - The portfolio item details.
 * @param {boolean} isActiveTab - The active tab state.
 * @param {boolean} isReadMore - The read more state.
 * @param {Function} onTabClick - Handler for tab click.
 * @param {Function} onReadMoreClick - Handler for read more click.
 */
const PortfolioItem = ({
  item,
  isActiveTab,
  isReadMore,
  onTabClick,
  onReadMoreClick,
  priority = false,
}) => {
  const t = useTranslations("Portfolio");
  const isGif = item.img?.endsWith(".gif");
  const isUnoptimized = isGif;
  const mainScrollRef = useAppScrollContainerRef();
  const prefersReducedMotion = useReducedMotion();
  const [allowFloatAnimation, setAllowFloatAnimation] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setAllowFloatAnimation(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const fromLeft = item.id % 2 === 0;
  const enterX = useMemo(
    () => (fromLeft ? "-11vw" : "11vw"),
    [fromLeft],
  );

  const isValidURL = useCallback((url) => {
    const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    return urlRegex.test(url);
  }, []);

  if (!item.title) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-transparent" />
    );
  }

  return (
    <div
      data-id={`portfolio-item-${item.id}`}
      className="flex min-h-[100dvh] w-full max-w-full items-start justify-center bg-transparent px-3 pb-16 pt-8 md:h-screen md:items-center md:pb-0 md:pt-0"
    >
      <motion.div
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: 0, x: enterX }
        }
        whileInView={
          prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
        }
        viewport={{
          root: mainScrollRef ?? undefined,
          once: true,
          amount: priority ? "some" : 0.12,
          margin: "0px",
        }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-4xl flex-col gap-8 text-white"
      >
        <motion.div
          animate={
            prefersReducedMotion || !allowFloatAnimation
              ? {}
              : {
                  y: ["20px", "0px", "20px"],
                  transition: {
                    duration: 4,
                    ease: "easeInOut",
                    repeat: Infinity,
                  },
                }
          }
        >
          <h1 className="text-xl font-bold md:text-4xl lg:text-6xl xl:text-8xl mb-4">
            {item.title}
          </h1>
          <div className="mb-4 flex w-full max-w-4xl justify-center px-2">
            <Image
              src={item.img}
              alt={item.title}
              width={1600}
              height={1200}
              sizes="(max-width: 768px) 100vw, 896px"
              className="h-auto w-auto max-w-full rounded-md border border-zinc-800/50 bg-zinc-950/80"
              style={{
                maxWidth: "100%",
                maxHeight: "min(90svh, 56rem)",
                width: "auto",
                height: "auto",
              }}
              priority={priority}
              placeholder={isUnoptimized ? "empty" : "blur"}
              blurDataURL={isUnoptimized ? undefined : PORTFOLIO_IMAGE_BLUR}
              unoptimized={isUnoptimized}
            />
          </div>
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={() => onTabClick(item.id, "desc")}
              className={`p-2 rounded ${
                isActiveTab === "desc"
                  ? "font-extrabold underline"
                  : "font-light"
              }`}
              aria-pressed={isActiveTab === "desc"}
            >
              {t("aboutTheProject")}
            </button>
            <button
              onClick={() => onTabClick(item.id, "skills")}
              className={`p-2 rounded ${
                isActiveTab === "skills"
                  ? "font-extrabold underline"
                  : "font-light"
              }`}
              aria-pressed={isActiveTab === "skills"}
            >
              {t("skills")}
            </button>
          </div>
          {isActiveTab === "desc" ? (
            <>
              <p className="w-full max-w-4xl lg:text-lg">
                {isReadMore
                  ? item.desc
                  : `${item.desc.split(" ").slice(0, 20).join(" ")}...`}
              </p>
              <button
                onClick={() => onReadMoreClick(item.id)}
                className="text-sm font-semibold underline"
              >
                {isReadMore ? t("readLess") : t("readMore")}
              </button>
            </>
          ) : (
            <div className="flex w-full max-w-4xl flex-wrap justify-end gap-1.5 sm:gap-2 lg:text-lg">
              {item.skills.map((skill, skillIndex) => (
                <HoverSkill key={skillIndex}>
                  {{
                    children: skill.name,
                    hoverBgColor: skill.hoverColor,
                    hoverTextColor: skill.hoverTextColor,
                  }}
                </HoverSkill>
              ))}
            </div>
          )}
          {isValidURL(item.link) && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={item.link}
              className="mt-4 inline-flex justify-center self-center rounded bg-white px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-stone-300/80 transition hover:bg-stone-50 md:px-6 md:py-3 md:text-base lg:px-8 lg:py-4 lg:text-lg"
              aria-label={`See project: ${item.title}`}
            >
              {t("seeProject")}
            </a>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PortfolioItem;
