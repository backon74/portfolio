import type { MetadataRoute } from "next";

function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && env.length > 0) return env.replace(/\/$/, "");
  return "https://hamzaos.vercel.app";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/recruiter`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
