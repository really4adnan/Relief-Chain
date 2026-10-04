import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieBanner } from "@/components/cookie-banner";
/* Editorial humanist type — Fraunces serif headlines, Jakarta body,
   JetBrains Mono for tickers, timestamps, helplines & live stats.
   Only the listed weights load, subsets latin, display=swap. */
import {
  Fraunces,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";

/* Headings H1/H2 + card titles — editorial serif, human-crafted warmth. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/* UI text, controls & body — clean geometric sans. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* Emergency timestamps, tickers, helplines (112, NDMA 1078) & live stats. */
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reliefchain.org";

export const viewport: Viewport = {
  themeColor: "#F8F7F4",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ReliefChain · Disaster Response, Relief & Know Nature — India",
    template: "%s · ReliefChain",
  },
  description:
    "ReliefChain connects NGOs, PWD companies and government bodies the moment a natural or man-made disaster is reported. Verified tenders, transparent funds, faster relief.",
  keywords: [
    "disaster relief India",
    "NGO registration",
    "disaster tenders",
    "emergency response",
    "relief funds",
  ],
  openGraph: {
    type: "website",
    siteName: "ReliefChain",
    title: "ReliefChain · Disaster Response, Relief & Know Nature — India",
    description:
      "NGOs, PWD companies and authorities on one verified chain. When disaster strikes, response shouldn't wait.",
    url: siteUrl,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReliefChain · Disaster Response, Relief & Know Nature — India",
    description:
      "NGOs, PWD companies and authorities on one verified chain.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-teal-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CookieBanner />
      </body>
    </html>
  );
}
