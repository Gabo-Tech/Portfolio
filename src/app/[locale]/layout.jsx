import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import dynamic from "next/dynamic";
import HtmlLang from "@/components/html-lang";
import { getPersonJsonLd } from "@/lib/personJsonLd";
import { getSiteUrl } from "@/lib/siteUrl";
const TransitionProvider = dynamic(
  () => import("@/components/transitionProvider/transitionProvider"),
);
export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}
const OG_LOCALE = {
  en: "en_CH",
  de: "de_CH",
  es: "es_ES",
};
export async function generateMetadata({ params }) {
  const { locale } = params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  const t = await getTranslations({
    locale,
    namespace: "Meta",
  });
  const title = t("title");
  const description = t("description");
  const keywords = t("keywords");
  const site = getSiteUrl();
  const ogLocale = OG_LOCALE[locale] ?? "en_GB";
  const alternateLocale = routing.locales
    .filter((l) => l !== locale)
    .map((l) => OG_LOCALE[l])
    .filter(Boolean);
  return {
    metadataBase: new URL(site),
    title,
    description,
    keywords: keywords.split(",").map((k) => k.trim()),
    authors: [
      {
        name: "Gabriel Clemente",
        url: site,
      },
    ],
    creator: "Gabriel Clemente",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      siteName: "Gabriel Clemente",
      title,
      description,
      locale: ogLocale,
      alternateLocale: alternateLocale.length > 0 ? alternateLocale : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
export default async function LocaleLayout({ children, params }) {
  const { locale } = params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({
    locale,
    namespace: "Meta",
  });
  const personLd = getPersonJsonLd(locale, t("description"));
  const jsonLd = JSON.stringify(personLd);
  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd,
        }}
      />
      <HtmlLang />
      <TransitionProvider>{children}</TransitionProvider>
    </NextIntlClientProvider>
  );
}
