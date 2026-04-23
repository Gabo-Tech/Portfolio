import { defineRouting } from "next-intl/routing";

/**
 * - localeDetection: use Accept-Language to pick a locale on first visit (no
 *   NEXT_LOCALE cookie yet). Subtags are matched (e.g. de-AT → de, es-MX → es).
 *   Locales not in `locales` fall back to defaultLocale (en).
 * - After a locale is set, NEXT_LOCALE remembers the user’s choice so it can
 *   override the header (e.g. after using the language switcher).
 */
export const routing = defineRouting({
  locales: ["en", "de", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: true,
});
