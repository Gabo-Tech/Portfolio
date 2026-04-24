import React, { useMemo } from "react";
import Image from "next/image";
const BrandCarousel = ({ logos, className = "" }) => {
  const memoizedLogos = useMemo(
    () => (logos && logos.length ? [...logos, ...logos] : []),
    [logos],
  );
  return (
    <div
      className={`text-center text-white py-8 sm:py-10 lg:py-14 ${className}`.trim()}
    >
      <div className="relative overflow-x-hidden">
        <div className="flex w-max max-w-none shrink-0 flex-nowrap justify-start motion-reduce:will-change-auto motion-reduce:animate-none animate-marquee will-change-transform">
          {memoizedLogos.map((logo, index) => (
            <div
              key={index}
              className="mx-2 flex w-[8.5rem] max-w-[8.5rem] flex-none items-center justify-center min-[400px]:mx-3 min-[400px]:w-36 min-[400px]:max-w-36 sm:mx-4 sm:w-40 sm:max-w-40 md:mx-4 md:w-48 md:max-w-48 lg:mx-5 lg:w-52 lg:max-w-52 2xl:mx-6 xl:max-w-56 2xl:max-w-[15rem]"
            >
              <a
                className="flex h-8 max-h-8 w-full min-w-0 items-center justify-center overflow-hidden min-[400px]:h-9 min-[400px]:max-h-9 sm:h-10 sm:max-h-10 md:h-12 md:max-h-12 lg:h-16 lg:max-h-16 xl:h-[4.5rem] xl:max-h-[4.5rem] [touch-action:manipulation]"
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-full w-full min-h-0 min-w-0 object-contain object-center opacity-75 grayscale filter transition-all duration-200 [touch-action:manipulation] hover:opacity-100 hover:grayscale-0"
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
