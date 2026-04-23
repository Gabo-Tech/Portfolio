import React, { useMemo } from "react";
import Image from "next/image";

/**
 * BrandCarousel Component
 * Displays a carousel of brand logos that scrolls horizontally.
 *
 * @param {Array} logos - Array of logo objects containing src, alt, width, and height attributes.
 * @param {string} [props.className] - Optional classes for the outer wrapper (e.g. compact padding).
 */
const BrandCarousel = ({ logos, className = "" }) => {
  const memoizedLogos = useMemo(() => {
    return [...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos, ...logos];
  }, [logos]);

  return (
    <div
      className={`text-center text-white py-8 sm:py-10 lg:py-14 ${className}`.trim()}
    >
      <div className="overflow-hidden relative">
        <div className="flex animate-marquee">
          {memoizedLogos.map((logo, index) => (
            <div key={index} className="mx-4 flex flex-none items-center justify-center lg:mx-5">
              <a
                className="flex h-10 max-h-10 w-auto items-center sm:h-12 sm:max-h-12 lg:h-16 lg:max-h-16 xl:h-[4.5rem] xl:max-h-[4.5rem]"
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-full w-auto max-h-full min-h-0 object-contain object-center transition-all duration-200 filter opacity-75 grayscale hover:filter-none"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;
