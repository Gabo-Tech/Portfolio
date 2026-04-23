import dynamic from "next/dynamic";
import { Inter, Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const isProd = process.env.NODE_ENV === "production";

const CustomCursor = dynamic(() => import("@/components/customCursor"), {
  ssr: false,
});
// Only in production: avoid pulling `@vercel/*` (and their vendor chunk) in `next dev`.
const VercelTelemetry = isProd
  ? dynamic(
      () => import("@/components/vercelTelemetry").then((m) => m.VercelTelemetry),
      { ssr: false },
    )
  : () => null;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
  style: ["normal", "italic"],
});

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
      </head>
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${sourceSerif.variable} font-sans antialiased text-stone-200 bg-stone-950`}
      >
        <CustomCursor />
        {children}
        {isProd ? <VercelTelemetry /> : null}
      </body>
    </html>
  );
}
