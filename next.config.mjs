import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      const stub = path.join(__dirname, "src/lib/vercel-telemetry-stub.js");
      config.resolve.alias = {
        ...config.resolve.alias,
        "@vercel/analytics/react": stub,
        "@vercel/speed-insights/next": stub,
      };
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
export default withNextIntl(nextConfig);
