import type { AltOverride, Seo } from "@/lib/types";

/*
 * Fields the TTR OS page fixer writes to a Sanity draft, read here with the
 * code values (lib/data) as fallback. Document types "page" and "teamMember":
 *   seo.title            page title
 *   seo.description      meta description
 *   seo.noIndex          true hides the page from search
 *   seo.image            social share image
 *   seo.structuredData   JSON-LD as text (one object or an array); replaces the page-level schema built in code
 *   altOverrides[]       { match, alt }: match is a file name or path ("brickell-skyline.webp",
 *                        "/images/places/brickell-skyline.webp") or a Sanity asset id; alt replaces
 *                        the alt text of every image on that page that uses the file
 * A draft may carry only these fields plus path (pages) or slug (team): everything else falls back to the code.
 */

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Applies alt overrides to every image ({ src, alt }) found anywhere inside `value`. */
export function applyAltOverrides<T>(value: T, overrides?: AltOverride[]): T {
  const list = (overrides ?? []).filter((o) => o?.match && typeof o.alt === "string" && o.alt.trim());
  if (!list.length) return value;
  const walk = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(walk);
    if (!isObj(v)) return v;
    if (typeof v.src === "string" && "alt" in v) {
      const src = v.src;
      const hit = list.find((o) => src === o.match || src.endsWith(`/${o.match.replace(/^\//, "")}`) || src.includes(o.match));
      return hit ? { ...v, alt: hit.alt.trim() } : v;
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
  };
  return walk(value) as T;
}

/** JSON-LD objects from seo.structuredData, or null when empty or not valid JSON (the code values are used instead). */
export function parseStructuredData(seo: Seo): Record<string, unknown>[] | null {
  const raw = seo.structuredData?.trim();
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    const list = (Array.isArray(parsed) ? parsed : [parsed]).filter(isObj);
    return list.length ? list : null;
  } catch {
    return null;
  }
}
