import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reliefchain.org";

const staticRoutes = [
  "",
  "/live",
  "/disasters",
  "/directory",
  "/tenders",
  "/donate",
  "/register",
  "/login",
  "/signup",
  "/dashboard",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: ["/live", "/disasters", "/tenders", "/directory"].includes(route)
      ? "hourly"
      : "weekly",
    priority: route === "" ? 1 : route.startsWith("/register") ? 0.9 : 0.7,
  }));
}
