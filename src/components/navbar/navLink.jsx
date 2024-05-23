"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * NavLink Component
 * Displays a navigation link with dynamic styles based on the current pathname.
 *
 * @param {Object} link - The link object containing the URL and title.
 */
const NavLink = ({ link }) => {
  const pathName = usePathname();

  return (
    <Link
      rel="noopener noreferrer"
      className={`rounded py-1 px-3 ${
        pathName === link.url
          ? "text-black bg-white font-extrabold"
          : "text-white font-semibold bg-gradient-to-bl from-blue-950 to-red-950"
      }`}
      href={link.url}
      aria-current={pathName === link.url ? "page" : undefined}
    >
      {link.title}
    </Link>
  );
};

export default NavLink;
