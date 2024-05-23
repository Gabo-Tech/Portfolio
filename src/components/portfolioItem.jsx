import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import HoverSkill from "@/components/hoverSkill";

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
}) => {
  const ref = useRef();
  const isInView = useInView(ref, { margin: "-100px" });

  // Check if the item has an empty title
  if (!item.title) {
    return (
      <div
        className={`h-screen w-screen flex items-center justify-center ${
          item.id % 2 === 0
            ? "bg-gradient-to-b from-red-950 to-blue-950"
            : "bg-gradient-to-t from-blue-950 to-red-950"
        }`}
      ></div>
    );
  }

  // Function to validate URL
  const isValidURL = (url) => {
    const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    return urlRegex.test(url);
  };

  return (
    <div
      className={`h-screen w-screen flex items-center justify-center ${
        item.id % 2 === 0
          ? "bg-gradient-to-b from-red-950 to-blue-950"
          : "bg-gradient-to-t from-blue-950 to-red-950"
      }`}
    >
      <motion.div
        ref={ref}
        initial={{ y: item.id % 2 === 0 ? -300 : 300 }}
        animate={isInView ? { y: 0 } : { y: item.id % 2 === 0 ? -300 : 300 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-8 text-white"
      >
        <motion.div
          animate={{
            y: ["20px", "0px", "20px"],
            transition: {
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }}
        >
          <h1 className="text-xl font-bold md:text-4xl lg:text-6xl xl:text-8xl mb-4">
            {item.title}
          </h1>
          <div className="relative mb-4 w-80 h-56 md:w-96 md:h-64 lg:w-[500px] lg:h-[350px] xl:w-[600px] xl:h-[420px]">
            <Image
              src={item.img}
              alt={item.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={() => onTabClick(item.id, "desc")}
              className={`p-2 rounded ${
                isActiveTab === "desc"
                  ? "font-extrabold underline"
                  : "font-extrathin"
              }`}
              aria-pressed={isActiveTab === "desc"}
            >
              ABOUT THE PROJECT
            </button>
            <button
              onClick={() => onTabClick(item.id, "skills")}
              className={`p-2 rounded ${
                isActiveTab === "skills"
                  ? "font-extrabold underline"
                  : "font-extrathin"
              }`}
              aria-pressed={isActiveTab === "skills"}
            >
              SKILLS
            </button>
          </div>
          {isActiveTab === "desc" ? (
            <>
              <p className="w-80 md:w96 lg:w-[500px] lg:text-lg xl:w-[600px]">
                {isReadMore
                  ? item.desc
                  : `${item.desc.split(" ").slice(0, 20).join(" ")}...`}
              </p>
              <button
                onClick={() => onReadMoreClick(item.id)}
                className="text-sm font-semibold underline"
              >
                {isReadMore ? "Read Less" : "Read More"}
              </button>
            </>
          ) : (
            <div className="w-80 md:w96 lg:w-[500px] lg:text-lg xl:w-[600px] flex flex-wrap gap-2 justify-end">
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
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={item.link}
              className="flex justify-center"
              aria-label={`See project: ${item.title}`}
            >
              <button className="mt-4 p-2 text-sm md:p-4 md:text-md lg:p-8 lg:text-lg bg-white text-gray-600 font-semibold m-4 rounded">
                See Project
              </button>
            </Link>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PortfolioItem;
