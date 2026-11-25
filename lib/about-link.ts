import type { SiteSettings } from "@/lib/types";

/**
 * The About Us page (/about-us/) is new in the redesign. Sanity holds the menu
 * and footer for the live site too, so the links are added here, after the
 * settings are loaded: "About Us" first and "Blog" last in the About dropdown, and the footer's
 * "About Us" link pointed at it. Service Area is reduced to the four states. Remove this (and its call in lib/content.ts)
 * once the links are in Sanity.
 */
export const ABOUT_PATH = "/about-us/";

export function withAboutLinks(s: SiteSettings): SiteSettings {
  const menu = s.menu.map((item) =>
    item.label === "About" && !item.children?.some((c) => c.href === ABOUT_PATH)
      ? { ...item, children: [{ label: "About Us", href: ABOUT_PATH }, ...(item.children ?? []), { label: "Blog", href: "/blog/" }] }
      : item,
  );
  // Service Area: just the states; each state page links its cities (lib/hero-override.ts).
  const states = [
    { label: "Florida", href: "/locations/miami-florida/" },
    { label: "Washington DC", href: "/locations/washington-dc/" },
    { label: "Virginia", href: "/locations/virginia/" },
    { label: "Maryland", href: "/locations/maryland/" },
  ];
  const menu2 = menu.map((item) => (item.label === "Service Area" ? { ...item, children: states } : item));
  const footerQuickLinks = s.footerQuickLinks.map((l) => (l.label === "About Us" ? { ...l, href: ABOUT_PATH } : l));
  return { ...s, menu: menu2, footerQuickLinks };
}
