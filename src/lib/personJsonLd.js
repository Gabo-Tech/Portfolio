import { getSiteUrl } from "./siteUrl";
export function getPersonJsonLd(locale, description) {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site}/#person`,
    name: "Gabriel Clemente",
    url: site,
    jobTitle: "Full-stack developer",
    description:
      description.length > 500 ? description.slice(0, 497) + "…" : description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CH",
    },
    inLanguage: locale,
    sameAs: ["https://gabo.rocks"],
  };
}
