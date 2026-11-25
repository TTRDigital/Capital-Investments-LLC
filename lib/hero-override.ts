import type { Img, Page } from "@/lib/types";

/**
 * Redesign: every service page opens with the team photo. Two of them still
 * have city photos in Sanity, which the live site shares, so their banner
 * photo is swapped here after the content is loaded. Remove this (and its
 * call in lib/content.ts) once the photos are changed in Sanity.
 */
const TEAM_PHOTO: Img = { src: "/images/team/group-photo-white-2.webp", alt: "The Capital Investment LLC team", width: 2400, height: 1262 };
const TEAM_BANNER_PATHS = new Set(["/services/", "/services/investment-sales-and-acquisition-services/"]);

export function withTeamBanners(pages: Page[]): Page[] {
  return pages.map((p) =>
    TEAM_BANNER_PATHS.has(p.path) ? { ...p, sections: p.sections.map((s) => (s._type === "hero" ? { ...s, image: TEAM_PHOTO } : s)) } : p,
  );
}
