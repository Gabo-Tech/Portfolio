import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import "./globals.css";

const TransitionProvider = dynamic(
  () => import("@/components/transitionProvider/transitionProvider")
);
const CustomCursor = dynamic(() => import("@/components/customCursor"), {
  ssr: false,
});
const BackgroundMusic = dynamic(() => import("@/components/backgroundMusic"), {
  ssr: false,
});
const Analytics = dynamic(
  () => import("@vercel/analytics/react").then((mod) => mod.Analytics),
  { ssr: false }
);
const SpeedInsights = dynamic(
  () => import("@vercel/speed-insights/next").then((mod) => mod.SpeedInsights),
  { ssr: false }
);

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gabriel Clemente - Full-Stack JavaScript Software Engineer",
  description:
    "Gabriel Clemente - Full-Stack JavaScript Software Engineer specializing in developing innovative, user-friendly, and scalable web applications. Contact me now!",
};

/**
 * RootLayout Component
 * The root layout for the application, including global styles, custom cursor, and transition provider.
 *
 * @param {Object} children - The child components to be rendered within the layout.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <link
          rel="preload"
          href={inter.href}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <CustomCursor />
        <TransitionProvider>{children}</TransitionProvider>
        <BackgroundMusic />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
