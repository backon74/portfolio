import type { MetadataRoute } from "next";

function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && env.length > 0) return env.replace(/\/$/, "");
  return "https://hamzaos.vercel.app";
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
