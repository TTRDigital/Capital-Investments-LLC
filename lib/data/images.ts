/* Layout images (logos, backgrounds, office photos). Content images live in pages.ts / team.ts. */
import type { Img } from "@/lib/types";

export const images = {
  "logoLight": {
    "src": "/images/brand/logo-light.webp",
    "alt": "Capital Investment LLC, Commercial Real Estate Advisors",
    "width": 395,
    "height": 72
  },
  "logoDark": {
    "src": "/images/brand/logo-dark.webp",
    "alt": "Capital Investment LLC, Commercial Real Estate Advisors",
    "width": 223,
    "height": 40
  },
  "logoMark": {
    "src": "/images/brand/logo-mark.webp",
    "alt": "Capital Investment LLC logo mark",
    "width": 72,
    "height": 72
  },
  "footerBg": {
    "src": "/images/brand/footer-bg.webp",
    "alt": "",
    "width": 2400,
    "height": 609
  },
  "footerBgMobile": {
    "src": "/images/brand/footer-bg-mobile.webp",
    "alt": "",
    "width": 430,
    "height": 1026
  },
  "ctaShapes": {
    "src": "/images/brand/cta-shapes.webp",
    "alt": "",
    "width": 1220,
    "height": 302
  },
  "downArrow": {
    "src": "/images/icons/down-arrow.svg",
    "alt": "",
    "width": 45,
    "height": 55
  },
  "tysons": {
    "src": "/images/offices/tysons-va.webp",
    "alt": "Courthouse Center sign listing Capital Investment LLC at the Tysons, VA office",
    "width": 1462,
    "height": 1241
  },
  "dc": {
    "src": "/images/offices/washington-dc-wide.webp",
    "alt": "Capital Investment LLC logo wall and seating area at the Washington, D.C. office",
    "width": 590,
    "height": 508
  },
  "miami": {
    "src": "/images/offices/miami-fl.webp",
    "alt": "Reception area with the illuminated Capital Investment LLC sign at the Miami office",
    "width": 731,
    "height": 635
  },
  "bethesda": {
    "src": "/images/offices/bethesda-md.webp",
    "alt": "Capital Investment LLC office building in Bethesda, MD",
    "width": 1462,
    "height": 1271
  },
  "dcOffice": {
    "src": "/images/offices/washington-dc.webp",
    "alt": "Capital Investment LLC logo wall and seating area at the Washington, D.C. office",
    "width": 731,
    "height": 635
  }
} satisfies Record<string, Img>;
