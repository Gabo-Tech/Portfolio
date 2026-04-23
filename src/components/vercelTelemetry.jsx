"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/**
 * Real packages load in production builds; in `next dev` they resolve to
 * `src/lib/vercel-telemetry-stub.js` via webpack (see `next.config.mjs`).
 */
export function VercelTelemetry() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
