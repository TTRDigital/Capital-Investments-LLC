import "server-only";
import { cache } from "react";
import { sanityFetch } from "@/lib/sanity/fetch";
import { merge } from "@/lib/merge";
import { dataset, projectId } from "@/sanity/env";
import { fallbackSettings } from "@/lib/data/site";
import { fallbackPages } from "@/lib/data/pages";
import { fallbackTeam } from "@/lib/data/team";
import type { Img, Office, Page, Section, SiteSettings, TeamMember } from "@/lib/types";

/* ==========================================================================
   Content layer
   Every page reads through these functions. Sanity values win when present;
   anything missing falls back to lib/data, so the site works before the CMS
   is filled in, and an empty field never breaks a page.
   ========================================================================== */

type Loose = Record<string, unknown>;
const isObj = (v: unknown): v is Loose => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * Sanity image object -> Img. The asset reference already carries the file id
 * and size ("image-<id>-<w>x<h>-<ext>"), so no dereferencing is needed.
 */
function sanityImage(v: Loose): Img | null {
  const ref = isObj(v.asset) ? String(v.asset._ref ?? "") : "";
  const m = ref.match(/^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/);
  if (!m) return null;
  return { src: `https://cdn.sanity.io/images/${projectId}/${dataset}/${m[1]}-${m[2]}x${m[3]}.${m[4]}`, alt: String(v.alt ?? ""), width: Number(m[2]), height: Number(m[3]) };
}

/** Walks CMS data: images become Img, Sanity bookkeeping keys (_id, _rev, _key on items, …) are dropped. */
function fromCms(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(fromCms).filter((x) => x !== null && x !== undefined);
  if (!isObj(v)) return v;
  if (v._type === "altImage" || (isObj(v.asset) && typeof v.asset._ref === "string")) return sanityImage(v);
  const out: Loose = {};
  for (const [k, x] of Object.entries(v)) {
    if (k.startsWith("_") && k !== "_type" && k !== "_key") continue;
    out[k] = fromCms(x);
  }
  return out;
}

/** Every list a section component reads exists, even when an editor emptied the field. */
const LISTS = ["text", "items", "tabs", "rows", "blocks", "slides", "markets", "members", "offices", "openings", "jobs", "body", "words", "galleryLeft", "galleryRight"];
function normalizeSection(raw: unknown): Section | null {
  if (!isObj(raw) || typeof raw._type !== "string") return null;
  const s: Loose = { ...raw };
  for (const key of LISTS) if (key in s && !Array.isArray(s[key])) s[key] = [];
  if (Array.isArray(s.items)) s.items = (s.items as Loose[]).map((it) => (isObj(it) && "title" in it && !Array.isArray(it.text) && !("body" in it) && !("answer" in it) ? { ...it, text: [] } : it));
  return s as Section;
}

/* ---------- Settings ---------- */

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const cms = await sanityFetch<Loose>(`*[_id == "siteSettings"][0]`, {}, ["siteSettings"]);
  return merge(fallbackSettings, fromCms(cms));
});

export async function getOffice(key: string): Promise<Office | undefined> {
  return (await getSiteSettings()).offices.find((o) => o.key === key);
}

/* ---------- Pages ---------- */

export const getPages = cache(async (): Promise<Page[]> => {
  const cms = await sanityFetch<Loose[]>(`*[_type == "page" && defined(path)] | order(order asc)`, {}, ["page"]);
  if (!cms?.length) return fallbackPages;
  const byPath = new Map(fallbackPages.map((p) => [p.path, p]));
  const merged = cms.map((doc) => {
    const c = fromCms(doc) as Partial<Page>;
    const base = byPath.get(c.path ?? "") ?? { path: c.path ?? "", title: c.title ?? "", group: "company" as const, order: 99, seo: { title: c.title ?? "", description: "" }, sections: [] };
    const page = merge(base, c);
    return { ...page, sections: page.sections.map(normalizeSection).filter((s): s is Section => !!s) };
  });
  const missing = fallbackPages.filter((f) => !merged.some((m) => m.path === f.path));
  return [...merged, ...missing].sort((a, b) => a.order - b.order);
});

export async function getPage(path: string): Promise<Page | undefined> {
  return (await getPages()).find((p) => p.path === path);
}

/* ---------- Team ---------- */

export const getTeam = cache(async (): Promise<TeamMember[]> => {
  const cms = await sanityFetch<Loose[]>(`*[_type == "teamMember" && defined(slug.current)] | order(order asc)`, {}, ["teamMember"]);
  if (!cms?.length) return fallbackTeam;
  const bySlug = new Map(fallbackTeam.map((m) => [m.slug, m]));
  const merged = cms.map((doc) => {
    const c = fromCms({ ...doc, slug: isObj(doc.slug) ? doc.slug.current : doc.slug }) as Partial<TeamMember>;
    const base = bySlug.get(c.slug ?? "") ?? { slug: c.slug ?? "", name: c.name ?? "", role: "", order: 99, bio: [], seo: { title: `${c.name ?? ""} - Capital Investment LLC`, description: "" } };
    return merge(base, c);
  });
  const missing = fallbackTeam.filter((f) => !merged.some((m) => m.slug === f.slug));
  return [...merged, ...missing].sort((a, b) => a.order - b.order);
});

export async function getTeamMember(slug: string) {
  return (await getTeam()).find((m) => m.slug === slug);
}
