import { defineArrayMember, defineField, defineType } from "sanity";

/*
 * Reusable objects and the page sections. Field names match lib/types.ts so
 * CMS content merges over the built-in content field for field.
 */

/* ---------- Basics ---------- */

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "SEO title", type: "string", description: "Shown in Google and the browser tab. Aim for under 60 characters.", validation: (r) => r.max(120).warning("Long titles may be cut off in Google.") }),
    defineField({ name: "description", title: "Meta description", type: "text", rows: 3, description: "Aim for under 160 characters.", validation: (r) => r.max(170).warning("Long descriptions may be cut off in Google.") }),
    defineField({ name: "image", title: "Social share image", type: "altImage", description: "1200 x 630. Leave empty to use the page's banner photo." }),
    defineField({ name: "noIndex", title: "Hide from search engines", type: "boolean", initialValue: false }),
  ],
});

/** Image that always offers alt text. */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: 'Describe the photo for people who cannot see it, e.g. "Capital Investment LLC office building in Bethesda, MD". Leave empty only for decorative graphics.',
    }),
  ],
});

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (r) => r.required() }),
    defineField({ name: "href", title: "Link", type: "string", description: "A page on this site like /contact-us/, a full URL, or #chat to open the “Let’s Chat” popup." }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

const TEXT_HELP = "One box per paragraph. **bold**, _italic_, *copper text*, [link text](/page/). Start a box with “- ” for a bullet or “## ” for a sub-heading.";
const paras = (name = "text", title = "Text") => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "text", rows: 4 })], description: TEXT_HELP });
const heading = (name = "heading", title = "Heading", required = true) =>
  defineField({ name, title, type: "text", rows: 2, description: "Wrap words in *single asterisks* to show them in copper.", validation: required ? (r) => r.required() : undefined });
const image = (name = "image", title = "Photo") => defineField({ name, title, type: "altImage" });
const imageSide = defineField({ name: "imageSide", title: "Photo side (desktop)", type: "string", options: { list: ["left", "right"], layout: "radio", direction: "horizontal" }, initialValue: "right" });
const button = (name = "button", title = "Button") => defineField({ name, title, type: "link", description: "Link #chat (or leave the link empty) to open the “Let’s Chat” popup." });
const style = [
  defineField({ name: "hFont", title: "Heading font", type: "string", options: { list: [{ title: "Lora (serif)", value: "serif" }, { title: "Outfit (sans)", value: "sans" }], layout: "radio", direction: "horizontal" }, initialValue: "serif", group: "style" }),
  defineField({ name: "hAccent", title: "Whole heading in copper", type: "boolean", initialValue: false, group: "style" }),
];
const groups = [{ name: "content", title: "Content", default: true }, { name: "style", title: "Style" }];
type Field = ReturnType<typeof defineField>;
const inContent = (f: Field): Field => ({ ...f, group: f.group ?? "content" }) as Field;

export const item = defineType({
  name: "item",
  title: "Card",
  type: "object",
  fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), paras(), defineField({ name: "icon", title: "Icon (optional)", type: "altImage" }), defineField({ name: "href", title: "Link (optional)", type: "string" })],
  preview: { select: { title: "title", subtitle: "text.0" } },
});
const items = (name = "items", title = "Cards") => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "item" })] });

/** Builds a section object type with the Content / Style tabs. */
function section(name: string, title: string, fields: Field[], previewField = "heading") {
  return defineType({
    name,
    title,
    type: "object",
    groups,
    fields: [...fields.map(inContent), ...style],
    preview: {
      select: { t: previewField, media: "image" },
      prepare: ({ t, media }: { t?: string; media?: unknown }) => ({ title: (t ?? "").replace(/\*/g, "") || title, subtitle: title, media: media as never }),
    },
  });
}

/* ---------- Sections used across pages ---------- */

export const hero = section("hero", "Banner", [
  heading("heading", "Main heading (H1)"),
  image("image", "Background photo"),
  defineField({ name: "overlay", title: "Photo shade (0 to 1)", type: "number", validation: (r) => r.min(0).max(1), initialValue: 0.4 }),
  defineField({ name: "position", title: "Keep in view", type: "string", options: { list: ["top", "center", "bottom"], layout: "radio", direction: "horizontal" }, initialValue: "center" }),
  defineField({ name: "breadcrumbs", title: "Show breadcrumbs (left-aligned banner)", type: "boolean", initialValue: false }),
  defineField({ name: "align", type: "string", options: { list: ["center", "left"], layout: "radio", direction: "horizontal" }, initialValue: "center" }),
]);

export const intro = section("intro", "Photo + text", [
  heading(),
  defineField({ name: "subheading", type: "string" }),
  paras(),
  image(),
  imageSide,
  button(),
  defineField({ name: "variant", type: "string", options: { list: ["default", "about"], layout: "radio", direction: "horizontal" }, initialValue: "default" }),
]);

export const panel = section("panel", "Boxed panel with cards", [
  defineField({ name: "icon", title: "Show logo mark above the heading", type: "boolean" }),
  heading(),
  paras(),
  image(),
  defineField({ name: "subheading", type: "string" }),
  items(),
  defineField({ name: "columns", title: "Cards per row (desktop)", type: "number", options: { list: [2, 3, 4] } }),
]);

export const slider = section("slider", "Card slider", [
  defineField({ name: "variant", type: "string", options: { list: [{ title: "Cream band", value: "process" }, { title: "Boxed with check marks", value: "check" }], layout: "radio" }, initialValue: "process" }),
  defineField({ name: "icon", title: "Show logo mark above the heading", type: "boolean" }),
  heading(),
  paras(),
  items(),
]);

export const accordionItem = defineType({
  name: "accordionItem",
  title: "Accordion item",
  type: "object",
  fields: [defineField({ name: "title", type: "string", validation: (r) => r.required() }), paras("body", "Content")],
  preview: { select: { title: "title" } },
});

export const splitAccordion = section("splitAccordion", "Photo + accordion", [
  heading(),
  paras(),
  image(),
  imageSide,
  defineField({ name: "style", type: "string", options: { list: [{ title: "Copper-edged boxes", value: "pill" }, { title: "Check marks", value: "check" }], layout: "radio" }, initialValue: "check" }),
  defineField({ name: "items", title: "Items", type: "array", of: [defineArrayMember({ type: "accordionItem" })] }),
  button(),
]);

export const stackRow = defineType({
  name: "stackRow",
  title: "Row",
  type: "object",
  fields: [heading(), paras(), items("items", "Points"), image(), imageSide],
  preview: { select: { title: "heading", media: "image" } },
});
export const splitStack = section("splitStack", "Alternating rows", [heading("heading", "Heading", false), paras(), defineField({ name: "rows", type: "array", of: [defineArrayMember({ type: "stackRow" })] })]);

export const imageCards = section("imageCards", "Photo + text band with cards", [heading(), paras(), image(), imageSide, items()]);
export const whyList = section("whyList", "Why us (text, photo, reasons)", [heading(), paras(), image(), defineField({ name: "listHeading", title: "List heading", type: "string" }), items("items", "Reasons")]);

export const tab = defineType({
  name: "tab",
  title: "Tab",
  type: "object",
  fields: [defineField({ name: "label", title: "Tab label", type: "string", validation: (r) => r.required() }), defineField({ name: "title", type: "string" }), paras(), image()],
  preview: { select: { title: "label", media: "image" } },
});
export const tabs = section("tabs", "Market tabs", [heading(), paras(), defineField({ name: "tabs", type: "array", of: [defineArrayMember({ type: "tab" })] })]);

export const cta = section("cta", "Call to action box", [heading(), paras(), button()]);

export const faqItem = defineType({
  name: "faqItem",
  title: "Question",
  type: "object",
  fields: [defineField({ name: "question", type: "string", validation: (r) => r.required() }), paras("answer", "Answer")],
  preview: { select: { title: "question" } },
});
export const faq = section("faq", "FAQ", [heading(), defineField({ name: "items", title: "Questions", type: "array", of: [defineArrayMember({ type: "faqItem" })] })]);

export const cardGrid = section("cardGrid", "Cards", [heading(), paras(), items(), defineField({ name: "columns", title: "Cards per row (desktop)", type: "number", options: { list: [2, 3, 4] } }), button()]);
export const article = section("article", "Text article", [heading(), paras("body", "Text")]);
export const steps = section("steps", "Process steps", [heading(), paras(), items("items", "Steps")]);

export const serviceBlock = defineType({
  name: "serviceBlock",
  title: "Service block",
  type: "object",
  fields: [heading(), image(), imageSide, items("items", "Points")],
  preview: { select: { title: "heading", media: "image" } },
});
export const serviceBlocks = section("serviceBlocks", "Service blocks", [heading(), paras(), defineField({ name: "blocks", type: "array", of: [defineArrayMember({ type: "serviceBlock" })] })]);

export const serviceSlide = defineType({
  name: "serviceSlide",
  title: "Slide",
  type: "object",
  fields: [defineField({ name: "title", type: "string" }), paras(), defineField({ name: "bullets", type: "array", of: [defineArrayMember({ type: "string" })] }), image()],
  preview: { select: { title: "title", media: "image" } },
});
export const serviceSlider = section("serviceSlider", "Services slider", [heading(), defineField({ name: "slides", type: "array", of: [defineArrayMember({ type: "serviceSlide" })] })]);

/* ---------- Home ---------- */

export const heroVideo = defineType({
  name: "heroVideo",
  title: "Background video",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "webm", title: "WebM link (desktop)", type: "string", description: "e.g. /videos/miami-skyline-timelapse-1280.webm" }),
    defineField({ name: "mp4", title: "MP4 link (desktop)", type: "string", description: "e.g. /videos/miami-skyline-timelapse-1280.mp4" }),
    defineField({ name: "webmMobile", title: "WebM link (phones, optional)", type: "string" }),
    defineField({ name: "mp4Mobile", title: "MP4 link (phones, optional)", type: "string" }),
  ],
});

export const homeHero = section("homeHero", "Home banner", [
  heading("heading", "Main heading (H1)"),
  defineField({ name: "words", title: "Typewriter words", type: "array", of: [defineArrayMember({ type: "string" })] }),
  image("image", "Background photo"),
  defineField({ name: "video", title: "Background video", type: "heroVideo", description: "Plays over the photo after the page loads. Leave empty for the photo only." }),
  paras("text", "Welcome text"),
  button(),
  defineField({ name: "galleryLeft", title: "Photo grid (left, 6 photos)", type: "array", of: [defineArrayMember({ type: "altImage" })] }),
  defineField({ name: "galleryRight", title: "Photo grid (right, 6 photos)", type: "array", of: [defineArrayMember({ type: "altImage" })] }),
]);
export const homeServices = section("homeServices", "Home services", [heading(), image("image", "Card photo"), items("items", "Services")]);

export const comparisonSide = defineType({
  name: "comparisonSide",
  title: "Column",
  type: "object",
  fields: [defineField({ name: "title", type: "string" }), defineField({ name: "icon", type: "altImage" }), defineField({ name: "points", type: "array", of: [defineArrayMember({ type: "string" })] })],
});
export const comparison = section("comparison", "Comparison", [heading(), defineField({ name: "ours", title: "Capital Investment LLC column", type: "comparisonSide" }), defineField({ name: "theirs", title: "Other firms column", type: "comparisonSide" })]);

export const statItem = defineType({
  name: "statItem",
  title: "Counter",
  type: "object",
  fields: [defineField({ name: "label", type: "string" }), defineField({ name: "value", type: "number" }), defineField({ name: "suffix", type: "string" }), defineField({ name: "caption", type: "string" })],
  preview: { select: { title: "label", subtitle: "value" } },
});
export const stats = section("stats", "Track record counters", [heading(), image("image", "Background photo"), defineField({ name: "items", title: "Counters", type: "array", of: [defineArrayMember({ type: "statItem" })] })]);

export const carouselMember = defineType({
  name: "carouselMember",
  title: "Team member",
  type: "object",
  fields: [defineField({ name: "slug", title: "Team member URL slug", type: "string", description: "e.g. reza-sabaii-esq (from Team)", validation: (r) => r.required() }), defineField({ name: "photo", title: "Photo (optional, cropped)", type: "altImage" })],
  preview: { select: { title: "slug", media: "photo" } },
});
export const teamCarousel = section("teamCarousel", "Team carousel", [heading(), defineField({ name: "members", type: "array", of: [defineArrayMember({ type: "carouselMember" })] }), button()]);

const officeKeys = defineField({ name: "offices", title: "Offices (keys from Site settings)", type: "array", of: [defineArrayMember({ type: "string" })], description: "tysons, dc, miami, bethesda" });
export const officeMaps = section("officeMaps", "Office maps", [heading(), officeKeys]);
export const officeCards = section("officeCards", "Office photo cards", [defineField({ name: "eyebrow", title: "Small heading", type: "string" }), heading(), officeKeys]);
export const officeList = section("officeList", "Office list (map + photo)", [officeKeys], "offices.0");

export const market = defineType({
  name: "market",
  title: "Market",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "subtitle", type: "string" }),
    paras(),
    defineField({ name: "citiesHeading", type: "string" }),
    defineField({ name: "cities", type: "array", of: [defineArrayMember({ type: "link" })], description: "Leave a city's link empty to show it as text." }),
    image(),
  ],
  preview: { select: { title: "title", media: "image" } },
});
export const marketSlider = section("marketSlider", "Markets slider", [heading(), defineField({ name: "markets", type: "array", of: [defineArrayMember({ type: "market" })] })]);

/* ---------- Company pages ---------- */

export const teamGrid = section("teamGrid", "Team grid (all team members)", [heading()]);
export const careers = section("careers", "Careers intro", [paras(), heading(), defineField({ name: "openings", type: "array", of: [defineArrayMember({ type: "link" })] })]);
export const job = defineType({ name: "job", title: "Job", type: "object", fields: [defineField({ name: "title", type: "string" }), paras("body", "Description")], preview: { select: { title: "title" } } });
export const jobs = section("jobs", "Job descriptions + resume form", [heading(), defineField({ name: "jobs", type: "array", of: [defineArrayMember({ type: "job" })] }), defineField({ name: "formHeading", type: "string" })]);
export const contactForm = section("contactForm", "Contact form", [defineField({ name: "note", title: "Note", type: "string", readOnly: true, initialValue: "Shows the contact form (Full Name, Email, Phone, consent)." })], "note");
export const subscribe = section("subscribe", "Newsletter signup", [heading(), paras()]);
export const message = section("message", "Message", [heading(), paras()]);
export const sitemapList = section("sitemapList", "HTML sitemap (automatic)", [heading()]);
export const legal = section("legal", "Legal text", [heading("heading", "Main heading (H1)"), paras("body", "Text")]);

export const sectionTypes = [
  "hero",
  "intro",
  "panel",
  "slider",
  "splitAccordion",
  "splitStack",
  "imageCards",
  "whyList",
  "tabs",
  "cta",
  "faq",
  "cardGrid",
  "article",
  "steps",
  "serviceBlocks",
  "serviceSlider",
  "homeHero",
  "homeServices",
  "comparison",
  "stats",
  "teamCarousel",
  "officeMaps",
  "officeCards",
  "officeList",
  "marketSlider",
  "teamGrid",
  "careers",
  "jobs",
  "contactForm",
  "subscribe",
  "message",
  "sitemapList",
  "legal",
] as const;

/* ---------- Menu ---------- */

export const subSubMenuItem = defineType({ name: "subSubMenuItem", title: "Menu link", type: "object", fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string" })], preview: { select: { title: "label", subtitle: "href" } } });
export const subMenuItem = defineType({
  name: "subMenuItem",
  title: "Dropdown link",
  type: "object",
  fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string", description: "Leave empty for a label that only opens its dropdown." }), defineField({ name: "children", title: "Third-level links", type: "array", of: [defineArrayMember({ type: "subSubMenuItem" })] })],
  preview: { select: { title: "label", subtitle: "href" } },
});
export const menuItem = defineType({
  name: "menuItem",
  title: "Menu item",
  type: "object",
  fields: [defineField({ name: "label", type: "string" }), defineField({ name: "href", type: "string" }), defineField({ name: "children", title: "Dropdown", type: "array", of: [defineArrayMember({ type: "subMenuItem" })] })],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const office = defineType({
  name: "office",
  title: "Office",
  type: "object",
  fields: [
    defineField({ name: "key", title: "Key", type: "string", description: "Used by page sections: tysons, dc, miami, bethesda.", validation: (r) => r.required() }),
    defineField({ name: "name", type: "string" }),
    defineField({ name: "label", title: "Short label", type: "string" }),
    defineField({ name: "address", type: "string" }),
    defineField({ name: "longAddress", title: "Address line in the footer and popup", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "mapQuery", title: "Google Maps search", type: "string" }),
    defineField({ name: "image", title: "Office photo", type: "altImage" }),
  ],
  preview: { select: { title: "name", subtitle: "address", media: "image" } },
});

export const objectTypes = [
  seo,
  altImage,
  link,
  item,
  accordionItem,
  stackRow,
  tab,
  faqItem,
  serviceBlock,
  serviceSlide,
  comparisonSide,
  heroVideo,
  statItem,
  carouselMember,
  market,
  job,
  subSubMenuItem,
  subMenuItem,
  menuItem,
  office,
  hero,
  intro,
  panel,
  slider,
  splitAccordion,
  splitStack,
  imageCards,
  whyList,
  tabs,
  cta,
  faq,
  cardGrid,
  article,
  steps,
  serviceBlocks,
  serviceSlider,
  homeHero,
  homeServices,
  comparison,
  stats,
  teamCarousel,
  officeMaps,
  officeCards,
  officeList,
  marketSlider,
  teamGrid,
  careers,
  jobs,
  contactForm,
  subscribe,
  message,
  sitemapList,
  legal,
];
