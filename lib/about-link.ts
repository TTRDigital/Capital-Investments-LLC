import type { SiteSettings } from "@/lib/types";

/**
 * The About Us page (/about-us/) is new in the redesign. Sanity holds the menu
 * and footer for the live site too, so the links are added here, after the
 * settings are loaded: "About Us" first in the About dropdown, and the footer's
 * "About Us" link pointed at it. Remove this (and its call in lib/content.ts)
 * once the links are in Sanity.
 */
export const ABOUT_PATH = "/about-us/";

export function withAboutLinks(s: SiteSettings): SiteSettings {
  const menu = s.menu.map((item) =>
    item.label === "About" && !item.children?.some((c) => c.href === ABOUT_PATH) ? { ...item, children: [{ label: "About Us", href: ABOUT_PATH }, ...(item.children ?? [])] } : item,
  );
  const footerQuickLinks = s.footerQuickLinks.map((l) => (l.label === "About Us" ? { ...l, href: ABOUT_PATH } : l));
  return { ...s, menu, footerQuickLinks };
}
