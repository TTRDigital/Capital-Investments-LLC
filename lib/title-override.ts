/**
 * David Krucoff's title is "Associate Broker" (TTR-2334). Sanity still holds
 * "Executive Vice President" on his teamMember document and in photo alts, and
 * existing Sanity documents cannot be edited from here, so this rewrites the
 * old title in code, after the Sanity fetch. Only strings that mention David
 * Krucoff are touched; every other string (other people's titles, bios) is left
 * as is. Remove this file (and its two calls in lib/content.ts) once Sanity is
 * updated.
 */
const OLD_TITLE = "Executive Vice President";
const NEW_TITLE = "Associate Broker";
const SLUG = "david-krucoff";

/** "an Executive Vice President" -> "an Associate Broker" (both take "an"), plain title -> new title. */
function fixString(s: string): string {
  return s.includes("David Krucoff") && s.includes(OLD_TITLE) ? s.split(OLD_TITLE).join(NEW_TITLE) : s;
}

function walk(v: unknown): unknown {
  if (typeof v === "string") return fixString(v);
  if (Array.isArray(v)) return v.map(walk);
  if (typeof v === "object" && v !== null) {
    return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, walk(x)]));
  }
  return v;
}

/** Applies to any content tree (pages, sections, photo alts, SEO text). */
export function fixDavidTitle<T>(v: T): T {
  return walk(v) as T;
}

/** Team members: his role is a bare title with no name next to it, so it is set by slug, then his other strings are fixed. */
export function applyMemberTitles<T extends { slug: string; role?: string }>(members: T[]): T[] {
  return members.map((m) => (m.slug === SLUG ? { ...fixDavidTitle(m), role: NEW_TITLE } : m));
}
