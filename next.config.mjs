import path from "node:path";
import { fileURLToPath } from "node:url";
import createNextIntlPlugin from "next-intl/plugin";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");
const nextConfig = {
  // @xenova/transformers ships both a Node backend (onnxruntime-node, a
  // native .node binary) and a browser backend (onnxruntime-web). We only
  // ever use it in the browser; tell Next to treat the Node backend as an
  // external on the server so webpack doesn't try to parse the .node file.
  experimental: {
    serverComponentsExternalPackages: ["onnxruntime-node", "@xenova/transformers"],
  },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      const stub = path.join(__dirname, "src/lib/vercel-telemetry-stub.js");
      config.resolve.alias = {
        ...config.resolve.alias,
        "@vercel/analytics/react": stub,
        "@vercel/speed-insights/next": stub,
      };
    }

    // On the client bundle, kill onnxruntime-node entirely — Transformers.js
    // will fall through to onnxruntime-web at runtime.
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "onnxruntime-node$": false,
        "onnxruntime-node": false,
        // Node-only deps occasionally dragged in by transformers.js:
        sharp$: false,
      };
      // Stop webpack from trying to resolve Node built-ins in the browser.
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false,
        crypto: false,
        stream: false,
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
