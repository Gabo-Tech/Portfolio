"use client";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import menuData from "../../../public/data/navbarData.json";
import { useState, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import NavLink from "./navLink";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useAppScrollContainerRef } from "@/components/scrollContainerContext";

const NAV_LINKS = [
  { url: "/", key: "home" },
  { url: "/about", key: "about" },
  { url: "/portfolio", key: "portfolio" },
  { url: "/contact", key: "contact" },
];

/**
 * Navbar: main nav, logo, social links, mobile menu, language switcher.
 */
const Navbar = () => {
  const t = useTranslations("nav");
  const tLang = useTranslations("langSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const mainScrollRef = useAppScrollContainerRef();

  useEffect(() => {
    setMenuMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (typeof document === "undefined" || !open) return;
    const bodyPrev = document.body.style.overflow;
    const main = mainScrollRef?.current;
    const mainPrev = main?.style.overflow ?? "";
    document.body.style.overflow = "hidden";
    if (main) main.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyPrev;
      if (main) main.style.overflow = mainPrev;
    };
  }, [open, mainScrollRef]);

  const menuLinks = useMemo(
    () =>
      NAV_LINKS.map((item) => ({
        url: item.url,
        title: t(item.key),
      })),
    [t]
  );

  const topVariants = {
    closed: { rotate: 0 },
    opened: { rotate: 45 },
  };

  const centerVariants = {
    closed: { opacity: 1 },
    opened: { opacity: 0 },
  };

  const bottomVariants = {
    closed: { rotate: 0 },
    opened: { rotate: -45 },
  };

  const mobileOverlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.22,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.07,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.18,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const mobileLinkVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: { duration: 0.16 },
    },
  };

  const handleLinkClick = useCallback(() => {
    setOpen(false);
  }, []);

  const switchLocale = useCallback(
    (next) => {
      router.replace(pathname, { locale: next });
    },
    [router, pathname]
  );

  const memoizedMenuLinks = useMemo(() => {
    return menuLinks.map((link) => (
      <NavLink link={link} key={link.url} />
    ));
  }, [menuLinks]);

  const memoizedSocialLinks = useMemo(() => {
    return menuData.socialLinks.map((link, index) => (
      <a
        href={link.href}
        key={index}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Link to ${link.alt}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 ring-1 ring-stone-300/90 shadow-sm transition hover:ring-stone-400"
      >
        <Image
          src={link.src}
          alt={link.alt}
          width={20}
          height={20}
          className="object-contain"
          loading="lazy"
        />
      </a>
    ));
  }, []);

  const langButtons = useMemo(
    () =>
      routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          className={`rounded-md px-2.5 py-0.5 text-sm font-display font-medium transition ${
            locale === loc
              ? "bg-sky-500/90 text-white"
              : "bg-stone-800/80 text-stone-300 hover:bg-stone-700/80 hover:text-stone-100"
          }`}
          aria-pressed={locale === loc}
          aria-label={tLang("label") + ": " + loc}
        >
          {tLang(loc)}
        </button>
      )),
    [locale, switchLocale, tLang]
  );

  return (
    <div className="h-full flex items-center justify-between px-4 sm:px-8 md:px-3 lg:px-5 xl:px-40 text-base md:text-lg border-b border-white/5 bg-stone-950/50 backdrop-blur-sm">
      <div className="hidden md:flex gap-4 w-1/3 flex-wrap items-center">
        {memoizedMenuLinks}
      </div>
      <div className="md:hidden lg:flex xl:justify-center">
        <Link
          rel="noopener noreferrer"
          href="/"
          className="text-sm font-display font-semibold rounded-md border border-stone-600/60 bg-stone-900/40 p-1 flex items-center justify-center text-stone-200 hover:border-stone-500/80"
        >
          <span className="mx-1">gabo</span>
          <span className="h-8 rounded px-4 bg-sky-500/90 text-white flex items-center justify-center text-xs tracking-wide">
            .rocks
          </span>
        </Link>
      </div>
      <div className="hidden md:flex gap-2 w-1/3 justify-end items-center flex-wrap">
        <div
          className="flex gap-1 items-center"
          role="group"
          aria-label={tLang("label")}
        >
          {langButtons}
        </div>
        <div className="flex gap-3 rounded-full border border-stone-600/50 bg-stone-900/40 px-3 py-1.5">
          {memoizedSocialLinks}
        </div>
      </div>
      <div className="relative z-[150] flex items-center gap-2 md:hidden">
        <div className="flex gap-1" role="group" aria-label={tLang("label")}>
          {langButtons}
        </div>
        <button
          className="relative flex h-8 w-10 flex-col justify-between"
          onClick={() => setOpen(!open)}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <motion.div
            variants={topVariants}
            animate={open ? "opened" : "closed"}
            className="h-1 w-10 origin-left rounded bg-stone-200"
          />
          <motion.div
            variants={centerVariants}
            animate={open ? "opened" : "closed"}
            className="h-1 w-10 rounded bg-stone-200"
          />
          <motion.div
            variants={bottomVariants}
            animate={open ? "opened" : "closed"}
            className="h-1 w-10 origin-left rounded bg-stone-200"
          />
        </button>
        {menuMounted &&
          createPortal(
            <AnimatePresence>
              {open && (
                <motion.div
                  key="mobile-nav-overlay"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("mobileNavigation")}
                  variants={mobileOverlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 z-[140] flex items-center justify-center overscroll-contain"
                >
                  <button
                    type="button"
                    className="absolute inset-0 cursor-pointer border-0 bg-black/82 backdrop-blur-md"
                    aria-label={t("closeMenu")}
                    onClick={() => setOpen(false)}
                  />
                  <nav
                    className="relative z-10 flex max-h-[min(85dvh,100%)] flex-col items-center justify-center gap-8 overflow-y-auto px-8 py-16 text-center text-3xl font-display font-semibold text-stone-100 sm:gap-10 sm:text-4xl"
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {menuLinks.map((link) => (
                      <Link
                        href={link.url}
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        key={link.url}
                        aria-label={`Navigate to ${link.title}`}
                      >
                        <motion.div
                          variants={mobileLinkVariants}
                          className="hover:underline"
                          role="menuitem"
                        >
                          {link.title}
                        </motion.div>
                      </Link>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>
    </div>
  );
};

export default Navbar;
