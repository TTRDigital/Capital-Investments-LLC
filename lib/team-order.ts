import type { TeamMember } from "@/lib/types";

/**
 * Display order that wins over the `order` stored in Sanity (TTR-2305).
 * Applied by slug after the teamMember fetch, so row 2 of /our-team/ reads
 * Justin, Christina, Boyd, Yassin even while Sanity still holds the old
 * numbers. Everyone not listed keeps the order they already have.
 */
export const TEAM_ORDER_OVERRIDE: Record<string, number> = {
  "brooke-fontan": 5,
  "justin-katz": 6,
  "christina-davies": 7,
  "boyd-lawrence": 8,
  "yassin-kadir": 9,
};

/** Overrides `order` by slug only (names, photos and bios are untouched), then sorts by order. Stable for equal values. */
export function applyTeamOrder<T extends Pick<TeamMember, "slug" | "order">>(members: T[]): T[] {
  return members
    .map((m, i) => ({ m: m.slug in TEAM_ORDER_OVERRIDE ? { ...m, order: TEAM_ORDER_OVERRIDE[m.slug] } : m, i }))
    .sort((a, b) => a.m.order - b.m.order || a.i - b.i)
    .map((x) => x.m);
}
