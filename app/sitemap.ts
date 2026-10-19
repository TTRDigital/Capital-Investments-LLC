import type { MetadataRoute } from "next";
import { getPages, getTeam } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every indexable page and team member. Noindex pages (subscribe and thank-you pages) and old URLs (301s in .htaccess) are left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, team] = await Promise.all([getPages(), getTeam()]);
  const entry = (path: string, priority: number) => ({ url: absoluteUrl(path), changeFrequency: "monthly" as const, priority });
  return [
    ...pages.filter((p) => !p.seo.noIndex).map((p) => entry(p.path, p.path === "/" ? 1 : p.group === "legal" ? 0.3 : p.path.split("/").length > 4 ? 0.6 : 0.8)),
    ...team.map((m) => entry(`/team/${m.slug}/`, 0.5)),
  ];
}
