import React, { useMemo } from "react";
import Image from "next/image";

/**
 * BrandCarousel Component
 * Displays a carousel of brand logos that scrolls horizontally.
 *
 * @param {Array} logos - Array of logo objects containing src, alt, width, and height attributes.
 */
const BrandCarousel = ({ logos }) => {
  const memoizedLogos = useMemo(() => {
    return [...logos, ...logos];
  }, [logos]);

  return (
    <div className="text-white text-center py-12">
      <div className="overflow-hidden relative">
        <div className="flex animate-marquee">
          {memoizedLogos.map((logo, index) => (
            <div key={index} className="flex-none mx-4">
              <a href={logo.href} target="_blank" rel="noopener noreferrer">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-12 transition-all duration-200 hover:filter-none filter opacity-75 grayscale"
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
