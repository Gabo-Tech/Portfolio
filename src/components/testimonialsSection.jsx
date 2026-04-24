"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
export default function TestimonialsSection() {
  const t = useTranslations("About.testimonials");
  const prefersReducedMotion = useReducedMotion();
  const items = useMemo(
    () => [
      {
        key: "arturo",
        quote: t("arturo.quote"),
        name: t("arturo.name"),
        role: t("arturo.role"),
        relation: t("arturo.relation"),
      },
      {
        key: "ciro",
        quote: t("ciro.quote"),
        name: t("ciro.name"),
        role: t("ciro.role"),
        relation: t("ciro.relation"),
      },
      {
        key: "michael",
        quote: t("michael.quote"),
        name: t("michael.name"),
        role: t("michael.role"),
        relation: t("michael.relation"),
      },
    ],
    [t],
  );
  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col gap-10 xl:max-w-7xl"
      aria-labelledby="testimonials-heading"
    >
      <h2
        id="testimonials-heading"
        className="font-display text-center text-2xl font-semibold tracking-tight text-stone-200 md:text-3xl"
      >
        {t("heading")}
      </h2>
      <ul className="grid list-none gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {items.map((item, index) => (
          <motion.li
            key={item.key}
            initial={
              prefersReducedMotion
                ? false
                : {
                    opacity: 0,
                    y: 16,
                  }
            }
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-40px",
            }}
            transition={{
              duration: 0.45,
              delay: prefersReducedMotion ? 0 : index * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex h-full flex-col rounded-xl border border-stone-700/50 bg-stone-900/35 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] sm:p-6"
          >
            <blockquote className="flex flex-1 flex-col gap-3">
              <p className="font-editorial text-base italic leading-relaxed text-stone-200 [text-wrap:pretty]">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-auto border-t border-stone-700/40 pt-4 text-left">
                <cite className="not-italic">
                  <span className="font-display font-semibold text-stone-100">
                    {item.name}
                  </span>
                  <span className="mt-1 block text-sm text-stone-400">
                    {item.role}
                  </span>
                  <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-sky-400/85">
                    {item.relation}
                  </span>
                </cite>
              </footer>
            </blockquote>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
