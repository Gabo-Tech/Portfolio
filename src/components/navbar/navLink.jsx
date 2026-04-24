"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useMemo } from "react";

/**
 * NavLink: active styles for the current pathname (locale-unaware path).
 *
 * @param {Object} props
 * @param {{ url: string, title: string }} props.link
 */
const NavLink = ({ link }) => {
  const pathName = usePathname();

  const isActive = useMemo(() => pathName === link.url, [pathName, link.url]);

  const linkClasses = useMemo(() => {
    return isActive
      ? "font-display text-stone-950 bg-stone-100 text-xs sm:text-sm font-semibold rounded-md border border-stone-200/80 py-1 px-2 sm:px-2.5 md:px-3 md:py-1.5 lg:text-[0.95rem] whitespace-nowrap"
      : "font-display text-stone-300 text-xs sm:text-sm font-medium rounded-md py-1 px-2 sm:px-2.5 md:px-3 md:py-1.5 lg:text-[0.95rem] hover:text-stone-100 hover:bg-white/5 whitespace-nowrap";
  }, [isActive]);

  return (
    <Link
      rel="noopener noreferrer"
      className={linkClasses}
      href={link.url}
      aria-current={isActive ? "page" : undefined}
    >
      {link.title}
    </Link>
  );
};

export default NavLink;
