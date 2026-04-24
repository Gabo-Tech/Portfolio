import PortfolioPageClient from "./PortfolioPageClient";

/** ISR: rebuild portfolio shell periodically; client JSON + images are versioned in deploys. */
export const revalidate = 3600;

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
