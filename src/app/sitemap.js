import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/siteUrl";

const PATHS = ["/", "/about", "/portfolio", "/contact"];

/**
 * @returns {import("next").MetadataRoute.Sitemap}
 */
export default function sitemap() {
  const base = getSiteUrl();
  const { defaultLocale, locales } = routing;

  return PATHS.map((path) => {
    const defaultPathname = getPathname({ href: path, locale: defaultLocale });
    const defaultUrl = new URL(defaultPathname, base).toString();

    const languageAlternates = Object.fromEntries(
      locales.map((loc) => {
        const p = getPathname({ href: path, locale: loc });
        return [loc, new URL(p, base).toString()];
      }),
    );
    languageAlternates["x-default"] = defaultUrl;

    return {
      url: defaultUrl,
      lastModified: new Date(),
      changeFrequency: path === "/" ? "weekly" : "monthly",
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: languageAlternates,
      },
    };
  });
}
