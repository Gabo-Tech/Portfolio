import React from "react";
import { motion } from "framer-motion";

/**
 * TimelineItem Component
 * Displays a timeline item with animations.
 *
 * @param {string} title - The title of the timeline item.
 * @param {string} description - The description of the timeline item.
 * @param {string} date - The date of the timeline item.
 * @param {string} company - The company associated with the timeline item.
 * @param {boolean} alternate - Flag to indicate if the item is on an alternate side.
 * @param {boolean} isInView - Flag to indicate if the timeline item is in view.
 */
const TimelineItem = ({
  title,
  description,
  date,
  company,
  alternate,
  isInView,
}) => (
  <div className="flex flex-col md:flex-row justify-between mb-8" role="listitem">
    <motion.div
      initial={{ x: alternate ? "700px" : "-700px" }}
      animate={isInView ? { x: "0" } : {}}
      transition={{ delay: 0.2 }}
      className={`w-full md:w-1/3 ${alternate ? "order-3 md:order-1" : "order-1"}`}
    >
      {!alternate && (
        <div className="p-3 font-semibold rounded-b-lg rounded-s-lg inline-block">
          <h3 className="bg-blue-950">{title}</h3>
          <div className="p-3 text-sm italic">{description}</div>
          <div className="p-3 text-red-400 text-sm font-semibold">
            <time dateTime={date}>{date}</time>
          </div>
          {company && (
            <div className="p-1 rounded bg-blue-950 text-sm font-semibold w-fit">
              {company}
            </div>
          )}
        </div>
      )}
    </motion.div>
    <motion.div
      initial={{ x: "-700px" }}
      animate={isInView ? { x: "0" } : {}}
      transition={{ delay: 0.6 }}
      className="w-full md:w-1/6 flex justify-center order-2"
    >
      <div className="w-1 h-full bg-red-950 rounded relative">
        <div className="absolute w-5 h-5 rounded-full ring-4 ring-red-400 bg-red-950 -left-2"></div>
      </div>
    </motion.div>
    <motion.div
      initial={{ x: alternate ? "-700px" : "700px" }}
      animate={isInView ? { x: "0" } : {}}
      transition={{ delay: 0.9 }}
      className={`w-full md:w-1/3 ${alternate ? "order-1 md:order-3" : "order-3"}`}
    >
      {alternate && (
        <div className="p-3 font-semibold rounded-b-lg rounded-s-lg inline-block">
          <h3 className="bg-blue-950">{title}</h3>
          <div className="p-3 text-sm italic">{description}</div>
          <div className="p-3 text-red-400 text-sm font-semibold">
            <time dateTime={date}>{date}</time>
          </div>
          {company && (
            <div className="p-1 rounded bg-blue-950 text-sm font-semibold w-fit">
              {company}
            </div>
          )}
        </div>
      )}
    </motion.div>
  </div>
);

export default TimelineItem;
