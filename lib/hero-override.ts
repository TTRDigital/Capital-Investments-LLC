import type { AreaLinksSection, Img, Page } from "@/lib/types";

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

/**
 * Redesign: the Service Area menu lists only the states, so each state page
 * links its cities and neighborhoods (inserted after the intro). Remove once
 * the section is added in Sanity.
 */
const AREAS: Record<string, AreaLinksSection> = {
  "/locations/miami-florida/": {
    _type: "areaLinks",
    _key: "areas",
    eyebrow: "Service Area",
    heading: "Areas We Serve in *Florida*",
    links: [
      { label: "Central Business District Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-central-business-district-miami/" },
      { label: "Coral Gables", href: "/locations/miami-florida/coral-gables-florida/" },
      { label: "Downtown Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-downtown-miami/" },
      { label: "Government Center Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-government-center-miami/" },
      { label: "Historic District Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-historic-district-miami/" },
      { label: "Miami Arts and Entertainment District", href: "/locations/miami-florida/commercial-real-estate-services-in-miami-arts-and-entertainment-district/" },
      { label: "Park West Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-park-west-miami/" },
      { label: "Brickell", href: "/locations/brickell-miami/" },
      { label: "South Beach", href: "/locations/south-beach-florida/" },
      { label: "Miami-Dade County", href: "/locations/miami-dade-county/" },
    ],
  },
  "/locations/virginia/": {
    _type: "areaLinks",
    _key: "areas",
    eyebrow: "Service Area",
    heading: "Areas We Serve in *Virginia*",
    links: [{ label: "Fairfax County", href: "/locations/fairfax-county/" }],
  },
};

export function withAreaLinks(pages: Page[]): Page[] {
  return pages.map((p) => {
    const add = AREAS[p.path];
    if (!add || p.sections.some((s) => s._type === "areaLinks")) return p;
    const at = p.sections.findIndex((s) => s._type === "intro");
    const sections = [...p.sections];
    sections.splice(at >= 0 ? at + 1 : 1, 0, add);
    return { ...p, sections };
  });
}
