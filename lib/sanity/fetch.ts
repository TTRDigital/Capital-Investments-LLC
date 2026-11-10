import "server-only";

import { draftMode } from "next/headers";
import { apiVersion, dataset, projectId } from "@/sanity/env";

/**
 * Reads content from Sanity.
 *
 * - Production and normal visits: published content from the API CDN, cached
 *   and refreshed in the background every 60 seconds (and at build time).
 * - Previews: after /api/preview turns Draft Mode on (only outside
 *   production, needs SANITY_READ_TOKEN), unpublished drafts are read live.
 * - Never throws: returns null on any failure so pages fall back to the
 *   built-in content in lib/data and the site keeps working.
 */
async function isDraft() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // not inside a request (build step)
  }
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = [],
): Promise<T | null> {
  if (!projectId) return null;

  const token = process.env.SANITY_READ_TOKEN;
  const draft = !!token && process.env.VERCEL_ENV !== "production" && (await isDraft());

  const search = new URLSearchParams({ query, perspective: draft ? "drafts" : "published" });
  for (const [key, value] of Object.entries(params)) {
    search.set(`$${key}`, JSON.stringify(value));
  }
  // SANITY_API_URL points the build at another API host (used to test the
  // queries against a local mock of the seeded dataset); normally unset.
  const host = process.env.SANITY_API_URL?.replace(/\/$/, "") || `https://${projectId}.${draft ? "api" : "apicdn"}.sanity.io`;
  const url = `${host}/v${apiVersion}/data/query/${dataset}?${search}`;

  try {
    const res = await fetch(url, draft ? { cache: "no-store", headers: { Authorization: `Bearer ${token}` } } : { next: { revalidate: 60, tags } });
    if (!res.ok) {
      console.warn(`[sanity] ${res.status} for query tags=${tags.join(",")}`);
      return null;
    }
    const json = (await res.json()) as { result?: T };
    return json.result ?? null;
  } catch (error) {
    console.warn("[sanity] fetch failed, using fallbacks", error);
    return null;
  }
}
