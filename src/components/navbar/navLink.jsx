"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

/**
 * NavLink Component
 * Displays a navigation link with dynamic styles based on the current pathname.
 *
 * @param {Object} link - The link object containing the URL and title.
 */
const NavLink = ({ link }) => {
  const pathName = usePathname();

  const isActive = useMemo(() => pathName === link.url, [pathName, link.url]);

  const linkClasses = useMemo(() => {
    return isActive
      ? "text-black bg-white font-extrabold rounded py-1 px-3"
      : "text-white font-semibold bg-gradient-to-bl from-blue-950 to-red-950 rounded py-1 px-3";
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
