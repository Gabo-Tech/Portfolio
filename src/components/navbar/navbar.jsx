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
          unoptimized
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
    <div className="box-border flex h-full min-h-[inherit] w-full border-b border-white/5 bg-stone-950/50 text-sm backdrop-blur-sm sm:text-base md:text-[0.95rem] lg:text-base 3xl:text-lg">
      <div className="grid w-full max-w-screen-3xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 md:px-5 md:py-2.5 lg:gap-4 lg:px-6 xl:px-8 2xl:px-10 3xl:px-12 4xl:px-16 min-[320px]:px-[max(0.75rem,env(safe-area-inset-left))]">
        <div className="flex min-w-0 max-w-full items-center">
          <div
            className="flex shrink-0 gap-0.5 sm:gap-1 md:hidden"
            role="group"
            aria-label={tLang("label")}
          >
            {langButtons}
          </div>
          <nav
            className="hidden min-w-0 items-center gap-0.5 md:flex md:flex-wrap md:gap-x-1.5 md:gap-y-1.5 md:pl-0 lg:gap-2 2xl:gap-2.5"
            aria-label={t("mainNavigation")}
          >
            {memoizedMenuLinks}
          </nav>
        </div>

        <div className="flex min-w-0 justify-center px-1 min-[400px]:px-2 sm:px-3">
          <Link
            rel="noopener noreferrer"
            href="/"
            className="font-display font-semibold text-stone-200 [font-size:clamp(0.7rem,0.35rem+1.2vw,0.95rem)] flex h-8 max-w-full shrink-0 items-stretch justify-center overflow-hidden rounded-md border border-stone-600/60 bg-stone-900/40 sm:h-9 2xl:h-10"
          >
            <span className="flex min-w-0 items-center px-1.5 min-[400px]:px-2 2xl:px-2.5">
              gabo
            </span>
            <span className="inline-flex min-w-0 max-w-full items-center bg-sky-500/90 px-2.5 text-[0.6rem] font-semibold tracking-wide text-white min-[400px]:px-3 min-[400px]:text-xs sm:px-4 2xl:text-sm">
              .rocks
            </span>
          </Link>
        </div>

        <div className="relative z-[150] flex min-w-0 max-w-full items-center justify-end gap-1.5 sm:gap-2">
          <div
            className="hidden flex-wrap items-center justify-end gap-1.5 md:flex md:gap-2 2xl:gap-2.5"
            role="group"
            aria-label={tLang("label")}
          >
            {langButtons}
          </div>
          <div className="hidden md:flex md:shrink-0">
            <div className="flex items-center gap-1.5 rounded-full border border-stone-600/50 bg-stone-900/40 px-1.5 py-1 sm:px-2 sm:py-1.5 lg:gap-2.5 lg:px-2.5 lg:py-1.5 2xl:px-3">
              {memoizedSocialLinks}
            </div>
          </div>
          <button
            className="flex h-8 w-10 min-h-11 min-w-11 flex-col items-center justify-between p-0.5 md:hidden"
            onClick={() => setOpen(!open)}
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.div
              variants={topVariants}
              animate={open ? "opened" : "closed"}
              className="h-1 w-8 min-w-8 max-w-8 origin-left rounded bg-stone-200"
            />
            <motion.div
              variants={centerVariants}
              animate={open ? "opened" : "closed"}
              className="h-1 w-8 min-w-8 max-w-8 rounded bg-stone-200"
            />
            <motion.div
              variants={bottomVariants}
              animate={open ? "opened" : "closed"}
              className="h-1 w-8 min-w-8 max-w-8 origin-left rounded bg-stone-200"
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
                      className="relative z-10 flex max-h-[min(85dvh,100%)] w-full max-w-md flex-col items-center justify-center gap-6 overflow-y-auto px-6 py-12 text-center text-2xl font-display font-semibold text-stone-100 min-[400px]:gap-8 min-[400px]:text-3xl sm:gap-10 sm:text-4xl"
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
    </div>
  );
};

export default Navbar;
