import { Inter } from "next/font/google";
import "./globals.css";
import TransitionProvider from "@/components/transitionProvider";
import CustomCursor from "@/components/customCursor";
import BackgroundMusic from "@/components/backgroundMusic";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
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
