/*
 * Content model. lib/data holds the built-in content in these shapes; Sanity
 * documents (sanity/schemaTypes) mirror them field for field, so CMS values
 * merge over the fallbacks (lib/content.ts).
 *
 * Text conventions (one string per paragraph):
 * - "## Heading" is a sub-heading, "- item" a bullet, "1. item" a numbered item
 * - **bold**, _italic_, [label](/path/) links, and *accent* (copper) text
 * - a line break inside a paragraph is "\n"
 * In headings only *accent* is used.
 */

export type Img = { src: string; alt: string; width: number; height: number };
export type Link = { label: string; href: string };
export type Rich = string[];
export type Seo = { title: string; description: string; noIndex?: boolean; image?: Img };

/** A card / list entry: title plus paragraphs (bullets allowed). */
export type Item = { title: string; text: Rich; icon?: Img; href?: string };

type Base = {
  _key?: string;
  /** Heading font: Lora (serif, default) or Outfit (sans), as on the old pages. */
  hFont?: "serif" | "sans";
  /** Whole heading in the copper accent color. */
  hAccent?: boolean;
};

export type HeroSection = Base & {
  _type: "hero";
  heading: string;
  image?: Img;
  /** Black overlay strength, 0–1 (old pages: 0.25 on city photos, 0.4 on team photos). */
  overlay?: number;
  /** Which part of the photo stays in view. */
  position?: "top" | "center" | "bottom";
  breadcrumbs?: boolean;
  align?: "center" | "left";
};
export type IntroSection = Base & {
  _type: "intro";
  heading: string;
  subheading?: string;
  text: Rich;
  image: Img;
  imageSide?: "left" | "right";
  button?: Link;
  variant?: "default" | "about";
};
export type PanelSection = Base & { _type: "panel"; heading: string; text: Rich; image?: Img; icon?: boolean; subheading?: string; items: Item[]; columns?: number };
export type SliderSection = Base & { _type: "slider"; variant: "process" | "check"; heading: string; text: Rich; icon?: boolean; items: Item[] };
export type SplitAccordionSection = Base & {
  _type: "splitAccordion";
  heading: string;
  text: Rich;
  image?: Img;
  imageSide?: "left" | "right";
  style?: "pill" | "check";
  items: { title: string; body: Rich }[];
  button?: Link;
};
export type SplitStackSection = Base & {
  _type: "splitStack";
  heading?: string;
  text: Rich;
  rows: { heading: string; text: Rich; items: Item[]; image?: Img; imageSide?: "left" | "right" }[];
};
export type ImageCardsSection = Base & { _type: "imageCards"; heading: string; text: Rich; image?: Img; imageSide?: "left" | "right"; items: Item[] };
export type WhyListSection = Base & { _type: "whyList"; heading: string; text: Rich; image?: Img; listHeading?: string; items: Item[] };
export type TabsSection = Base & { _type: "tabs"; heading: string; text: Rich; tabs: { label: string; title: string; text: Rich; image?: Img }[] };
export type CtaSection = Base & { _type: "cta"; heading: string; text: Rich; button: Link };
export type FaqSection = Base & { _type: "faq"; heading: string; items: { question: string; answer: Rich }[] };
export type CardGridSection = Base & { _type: "cardGrid"; heading: string; text: Rich; items: Item[]; button?: Link; columns?: number };
export type ArticleSection = Base & { _type: "article"; heading: string; body: Rich };
export type StepsSection = Base & { _type: "steps"; heading: string; text: Rich; items: Item[] };
export type ServiceBlocksSection = Base & {
  _type: "serviceBlocks";
  heading: string;
  text: Rich;
  blocks: { heading: string; image?: Img; imageSide?: "left" | "right"; items: Item[] }[];
};
export type ServiceSliderSection = Base & { _type: "serviceSlider"; heading: string; slides: { title: string; text: Rich; bullets: string[]; image?: Img }[] };

/* Home page */
export type HomeHeroSection = Base & {
  _type: "homeHero";
  heading: string;
  words: string[];
  image?: Img;
  text: Rich;
  button?: Link;
  galleryLeft: Img[];
  galleryRight: Img[];
};
export type HomeServicesSection = Base & { _type: "homeServices"; heading: string; image?: Img; items: Item[] };
export type ComparisonSection = Base & {
  _type: "comparison";
  heading: string;
  ours: { title: string; icon?: Img; points: string[] };
  theirs: { title: string; icon?: Img; points: string[] };
};
export type StatsSection = Base & { _type: "stats"; heading: string; image?: Img; items: { label: string; value: number; suffix?: string; caption?: string }[] };
export type TeamCarouselSection = Base & { _type: "teamCarousel"; heading: string; members: { slug: string; photo?: Img }[]; button?: Link };
/** Office keys refer to Site settings > Offices. */
export type OfficeMapsSection = Base & { _type: "officeMaps"; heading: string; offices: string[] };
export type OfficeCardsSection = Base & { _type: "officeCards"; eyebrow?: string; heading: string; offices: string[] };
export type OfficeListSection = Base & { _type: "officeList"; offices: string[] };
export type MarketSliderSection = Base & {
  _type: "marketSlider";
  heading: string;
  markets: { title: string; subtitle: string; text: Rich; citiesHeading: string; cities: Link[]; image?: Img }[];
};
export type TeamGridSection = Base & { _type: "teamGrid"; heading: string };
export type CareersSection = Base & { _type: "careers"; text: Rich; heading: string; openings: Link[] };
export type JobsSection = Base & { _type: "jobs"; heading: string; jobs: { title: string; body: Rich }[]; formHeading: string };
export type ContactFormSection = Base & { _type: "contactForm" };
export type SubscribeSection = Base & { _type: "subscribe"; heading: string; text: Rich };
export type MessageSection = Base & { _type: "message"; heading: string; text: Rich };
export type SitemapListSection = Base & { _type: "sitemapList"; heading: string };
export type LegalSection = Base & { _type: "legal"; heading: string; body: Rich };

export type Section =
  | HeroSection
  | IntroSection
  | PanelSection
  | SliderSection
  | SplitAccordionSection
  | SplitStackSection
  | ImageCardsSection
  | WhyListSection
  | TabsSection
  | CtaSection
  | FaqSection
  | CardGridSection
  | ArticleSection
  | StepsSection
  | ServiceBlocksSection
  | ServiceSliderSection
  | HomeHeroSection
  | HomeServicesSection
  | ComparisonSection
  | StatsSection
  | TeamCarouselSection
  | OfficeMapsSection
  | OfficeCardsSection
  | OfficeListSection
  | MarketSliderSection
  | TeamGridSection
  | CareersSection
  | JobsSection
  | ContactFormSection
  | SubscribeSection
  | MessageSection
  | SitemapListSection
  | LegalSection;

export type SectionType = Section["_type"];

export type Page = {
  /** URL with leading and trailing slash, e.g. "/services/property-management/" ("/" for home). */
  path: string;
  /** Name in /cms and in breadcrumbs. */
  title: string;
  group: "company" | "services" | "locations" | "legal" | "forms";
  order: number;
  seo: Seo;
  sections: Section[];
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  order: number;
  photo?: Img;
  bio: Rich;
  /** Old WordPress post ID, for ?p= redirects. */
  wpId?: number;
  seo: Seo;
};

export type Office = {
  key: string;
  name: string;
  /** Short label used in the popup and home map cards ("Tysons, VA"). */
  label: string;
  address: string;
  /** Address line as the footer and "Let's Chat" popup print it. */
  longAddress: string;
  phone?: string;
  mapQuery: string;
  image?: Img;
};

export type MenuItem = { label: string; href: string; children?: MenuItem[] };

export type SiteSettings = {
  name: string;
  legalName: string;
  tagline: string;
  phone: string;
  email: string;
  offices: Office[];
  /** Offices shown in the "Let's Chat" popup and the footer. */
  contactOffices: string[];
  social: { network: "linkedin" | "facebook" | "instagram"; href: string }[];
  menu: MenuItem[];
  footerQuickLinks: Link[];
  footerServiceLinks: Link[];
  consentText: string;
  credit: Link;
  logo: Img;
  footerLogo: Img;
};
