/**
 * Dev-only webpack aliases point `@vercel/analytics/react` and
 * `@vercel/speed-insights/next` here so `next dev` does not load real packages
 * (avoids missing `./vendor-chunks/@vercel.js` when navigating).
 */
export function Analytics() {
  return null;
}

export function SpeedInsights() {
  return null;
}
