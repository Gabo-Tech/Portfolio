"use client";

import { useParams } from "next/navigation";
import { useLayoutEffect } from "react";

const LANG = { en: "en", de: "de", es: "es" };

/**
 * Sets documentElement.lang for accessibility and SEO when locale changes.
 */
export default function HtmlLang() {
  const { locale } = useParams();
  const code = LANG[locale] ?? "en";
  useLayoutEffect(() => {
    document.documentElement.lang = code;
  }, [code]);
  return null;
}
