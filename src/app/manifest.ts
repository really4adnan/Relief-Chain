import type { MetadataRoute } from "next";

/**
 * Installable PWA manifest — field teams can add ReliefChain to the
 * home screen and open it full-screen during operations.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReliefChain — Disaster Response India",
    short_name: "ReliefChain",
    description:
      "Verified disaster response network: live tracking, relief tenders, transparent funds and Know Nature lessons.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#e4e3d3",
    theme_color: "#1b0b07",
    categories: ["government", "utilities", "education"],
    icons: [
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
