"use client";
import Link from "next/link";
import Image from "next/image";
import menuData from "../../../public/data/navbarData.json";
import { useState } from "react";
import NavLink from "./navLink";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navbar Component
 * Displays a responsive navigation bar with links, a logo, and social icons.
 */
const Navbar = () => {
  const [open, setOpen] = useState(false);

  const topVariants = {
    closed: {
      rotate: 0,
    },
    opened: {
      rotate: 45,
    },
  };

  const centerVariants = {
    closed: {
      opacity: 1,
    },
    opened: {
      opacity: 0,
    },
  };

  const bottomVariants = {
    closed: {
      rotate: 0,
    },
    opened: {
      rotate: -45,
    },
  };

  const listVariants = {
    closed: {
      x: "100vw",
    },
    opened: {
      x: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      x: "100vw",
      transition: {
        when: "afterChildren",
        staggerChildren: 0.2,
        staggerDirection: -1,
      },
    },
  };

  const listItemVariants = {
    closed: {
      x: -10,
      opacity: 0,
    },
    opened: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -10,
      opacity: 0,
    },
  };

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div className="h-full flex items-center justify-between px-4 sm:px-8 md:px-3 lg:px-5 xl:px-40 text-xl">
      {/* LINKS */}
      <div className="hidden md:flex gap-4 w-1/3">
        {menuData.menuLinks.map((link) => (
          <NavLink link={link} key={link.title} />
        ))}
      </div>
      {/* LOGO */}
      <div className="md:hidden lg:flex xl:justify-center">
        <Link
          rel="noopener noreferrer"
          href="/"
          className="text-sm bg-white rounded-md p-1 font-bold flex items-center justify-center"
        >
          <span className="mx-1">gabo</span>
          <span className="w-12 h-8 rounded px-6 bg-black text-white flex items-center justify-center">
            .rocks
          </span>
        </Link>
      </div>
      {/* SOCIAL */}
      <div className="hidden md:flex gap-4 w-1/3 justify-end">
        <div className="bg-white md:flex gap-4 border-4 rounded-tr-sm rounded-br-sm rounded-full">
          {menuData.socialLinks.map((link, index) => (
            <Link
              href={link.href}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Link to ${link.alt}`}
            >
              <Image src={link.src} alt={link.alt} width={24} height={24} />
            </Link>
          ))}
        </div>
      </div>
      {/* RESPONSIVE MENU */}
      <div className="md:hidden">
        {/* MENU BUTTON */}
        <button
          className="w-10 h-8 flex flex-col justify-between z-50 relative"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <motion.div
            variants={topVariants}
            animate={open ? "opened" : "closed"}
            className="w-10 h-1 bg-white rounded origin-left"
          ></motion.div>
          <motion.div
            variants={centerVariants}
            animate={open ? "opened" : "closed"}
            className="w-10 h-1 bg-white rounded"
          ></motion.div>
          <motion.div
            variants={bottomVariants}
            animate={open ? "opened" : "closed"}
            className="w-10 h-1 bg-white rounded origin-left"
          ></motion.div>
        </button>
        {/* MENU LIST */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              variants={listVariants}
              initial="closed"
              animate="opened"
              exit="exit"
              className="absolute top-0 left-0 w-screen h-screen bg-black text-white flex flex-col items-center justify-center gap-8 text-4xl font-extrabold z-40"
              role="menu"
            >
              {menuData.menuLinks.map((link) => (
                <motion.div
                  variants={listItemVariants}
                  className="hover:underline"
                  key={link.title}
                  role="menuitem"
                >
                  <Link
                    href={link.url}
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    aria-label={`Navigate to ${link.title}`}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
