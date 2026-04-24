"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
const TimelineItem = ({
  title,
  description,
  date,
  company,
  alternate,
  isInView,
}) => {
  const content = useMemo(
    () => (
      <div className="inline-block max-w-full rounded-b-lg rounded-s-lg p-3 font-display font-semibold ring-1 ring-stone-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-[2px] lg:ring-0 lg:shadow-none lg:backdrop-blur-none bg-black/72 sm:bg-black/65 lg:bg-transparent">
        <h3 className="rounded bg-slate-900/95 px-2 py-0.5 text-stone-100 lg:bg-slate-800/60 lg:px-1 lg:py-0">
          {title}
        </h3>
        <div className="p-3 text-base font-editorial italic leading-relaxed text-stone-100 lg:text-stone-300">
          {description}
        </div>
        <div className="px-3 pb-1 text-sm font-semibold text-sky-400/90">
          <time dateTime={date}>{date}</time>
        </div>
        {company && (
          <div className="mt-1 w-fit rounded bg-slate-900/90 p-1.5 text-sm font-semibold text-stone-200 lg:bg-slate-800/50">
            {company}
          </div>
        )}
      </div>
    ),
    [title, description, date, company],
  );
  const initialPosition = useMemo(
    () => ({
      left: alternate ? "700px" : "-700px",
      center: "-700px",
      right: alternate ? "-700px" : "700px",
    }),
    [alternate],
  );
  const animatePosition = useMemo(
    () => ({
      x: "0",
    }),
    [],
  );
  const transitionSettings = useMemo(
    () => ({
      delay: alternate ? 0.9 : 0.2,
    }),
    [alternate],
  );
  return (
    <div
      className="flex flex-col md:flex-row justify-between mb-8"
      role="listitem"
    >
      <motion.div
        initial={{
          x: initialPosition.left,
        }}
        animate={isInView ? animatePosition : {}}
        transition={{
          delay: 0.2,
        }}
        className={`w-full md:w-1/3 ${alternate ? "order-3 md:order-1" : "order-1"}`}
      >
        {!alternate && content}
      </motion.div>
      <motion.div
        initial={{
          x: initialPosition.center,
        }}
        animate={isInView ? animatePosition : {}}
        transition={{
          delay: 0.6,
        }}
        className="w-full md:w-1/6 flex justify-center order-2"
      >
        <div className="w-1 h-full bg-stone-600 rounded relative">
          <div className="absolute w-5 h-5 rounded-full ring-2 ring-sky-500/50 bg-stone-800 -left-2" />
        </div>
      </motion.div>
      <motion.div
        initial={{
          x: initialPosition.right,
        }}
        animate={isInView ? animatePosition : {}}
        transition={transitionSettings}
        className={`w-full md:w-1/3 ${alternate ? "order-1 md:order-3" : "order-3"}`}
      >
        {alternate && content}
      </motion.div>
    </div>
  );
};
export default TimelineItem;
