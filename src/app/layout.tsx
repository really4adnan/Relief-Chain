import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CookieBanner } from "@/components/cookie-banner";
/* Human font pack — each face has one crisis job (see globals.css).
   Only the listed weights load, subsets latin, display=swap:
   fast on 2G/3G, self-hosted (no render-blocking Google <link>). */
import {
  Archivo,
  IBM_Plex_Mono,
  Inter,
  Open_Sans,
  Plus_Jakarta_Sans,
} from "next/font/google";

/* Emergency alerts & high-visibility notices — condensed punch,
   open counters, legible through smoke / glare / distance. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600", "900"],
  display: "swap",
});

/* Main headings & page titles — warm geometric authority. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

/* Body copy & general reading — tall x-height humanist sans,
   tireless for stressed / low-vision readers. */
const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/* Buttons, navigation & small UI — micro-text engineering,
   distinct I/l/1 so vital taps never misread. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

/* Maps, data & system readouts — every glyph same width,
   live numbers never jump during refresh. */
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reliefchain.org";

export const viewport: Viewport = {
  themeColor: "#1b0b07",
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
      className={`${archivo.variable} ${jakarta.variable} ${openSans.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
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
