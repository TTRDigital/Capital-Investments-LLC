import type { MetadataRoute } from "next";
import { getPages, getPosts, getTeam } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Every indexable page and team member. Noindex pages and redirected old URLs (lib/url-map.ts, lib/legacy-redirects.ts) are left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, team, posts] = await Promise.all([getPages(), getTeam(), getPosts()]);
  const entry = (path: string, priority: number) => ({ url: absoluteUrl(path), changeFrequency: "monthly" as const, priority });
  return [
    ...pages.filter((p) => !p.seo.noIndex).map((p) => entry(p.path, p.path === "/" ? 1 : p.group === "legal" ? 0.3 : p.path.split("/").length > 4 ? 0.6 : 0.8)),
    ...team.map((m) => entry(`/team/${m.slug}/`, 0.5)),
    // The blog index is listed once it has posts (it is noindex while empty).
    ...(posts.length ? [entry("/blog/", 0.6), ...posts.filter((p) => !p.seo.noIndex).map((p) => entry(`/blog/${p.slug}/`, 0.5))] : []),
  ];
}
