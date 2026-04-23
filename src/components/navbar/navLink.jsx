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
      ? "font-display text-stone-950 bg-stone-100 font-semibold rounded-md py-1.5 px-3 border border-stone-200/80"
      : "font-display text-stone-300 font-medium rounded-md py-1.5 px-3 hover:text-stone-100 hover:bg-white/5";
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
