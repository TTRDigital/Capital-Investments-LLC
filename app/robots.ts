import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Search and AI crawlers are welcome; only the studio, API and thank-you page are off limits.
export default function robots(): MetadataRoute.Robots {
  // Staging copy previews: keep everything out of search.
  if (process.env.VERCEL_ENV === "preview") return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/cms/", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
