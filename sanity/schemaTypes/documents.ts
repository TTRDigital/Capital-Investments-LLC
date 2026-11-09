import { defineArrayMember, defineField, defineType } from "sanity";
import { sectionTypes } from "./objects";

const seoField = defineField({ name: "seo", title: "SEO", type: "seo" });
const orderField = defineField({ name: "order", title: "Order", type: "number" });

/* ---------- Settings ---------- */

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "company", title: "Company", default: true },
    { name: "offices", title: "Offices" },
    { name: "menu", title: "Menu & footer" },
    { name: "forms", title: "Forms" },
  ],
  fields: [
    defineField({ name: "name", title: "Company name", type: "string", group: "company" }),
    defineField({ name: "legalName", title: "Legal name", type: "string", group: "company" }),
    defineField({ name: "tagline", type: "string", group: "company" }),
    defineField({ name: "phone", title: "Main phone", type: "string", group: "company" }),
    defineField({ name: "email", title: "Main email", type: "string", group: "company" }),
    defineField({ name: "logo", title: "Header logo (light)", type: "altImage", group: "company" }),
    defineField({ name: "footerLogo", title: "Footer logo (dark)", type: "altImage", group: "company" }),
    defineField({
      name: "social",
      title: "Social profiles",
      type: "array",
      group: "company",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({ name: "network", type: "string", options: { list: ["linkedin", "facebook", "instagram"] } }),
            defineField({ name: "href", title: "Profile URL", type: "url" }),
          ],
          preview: { select: { title: "network", subtitle: "href" } },
        }),
      ],
    }),
    defineField({ name: "offices", type: "array", group: "offices", of: [defineArrayMember({ type: "office" })] }),
    defineField({ name: "contactOffices", title: "Offices in the footer and “Let’s Chat” popup (keys)", type: "array", group: "offices", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "menu", title: "Main menu", type: "array", group: "menu", of: [defineArrayMember({ type: "menuItem" })] }),
    defineField({ name: "footerQuickLinks", title: "Footer: Quick Links", type: "array", group: "menu", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "footerServiceLinks", title: "Footer: Services", type: "array", group: "menu", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "credit", title: "Footer credit", type: "link", group: "menu" }),
    defineField({ name: "consentText", title: "Consent checkbox text (all forms)", type: "text", rows: 6, group: "forms" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

/* ---------- Pages ---------- */

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Page name", type: "string", group: "content", description: "Used in /cms, breadcrumbs and the HTML sitemap.", validation: (r) => r.required() }),
    defineField({
      name: "path",
      title: "URL",
      type: "string",
      group: "content",
      description: "With slashes, e.g. /services/property-management/ (/ for the home page). Changing it changes the page address: add a 301 redirect in public/.htaccess for the old one.",
      validation: (r) => r.required().regex(/^\/([a-z0-9-]+\/)*$/, { name: "path" }),
    }),
    defineField({ name: "group", type: "string", group: "content", options: { list: ["company", "services", "locations", "legal", "forms"] }, initialValue: "company" }),
    { ...orderField, group: "content" },
    defineField({ name: "sections", type: "array", group: "content", of: sectionTypes.map((t) => defineArrayMember({ type: t })) }),
    { ...seoField, group: "seo" },
  ],
  orderings: [{ title: "Site order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "path" } },
});

/* ---------- Team ---------- */

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL slug", type: "slug", options: { source: "name" }, validation: (r) => r.required(), description: "The page is /team/<slug>/. Keep the old slug unless you add a redirect." }),
    defineField({ name: "role", title: "Job title", type: "string" }),
    orderField,
    defineField({ name: "photo", type: "altImage" }),
    defineField({
      name: "bio",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      description: "One box per paragraph. **bold**, [link text](mailto:name@capitalinvestmentllc.com), “## ” for a sub-heading.",
    }),
    defineField({ name: "wpId", title: "Old WordPress ID", type: "number", readOnly: true, hidden: true }),
    seoField,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

/* ---------- Guides ---------- */

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "sources", title: "Sources & links" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", description: "The page's H1. Phrase it as the question or promise the guide answers.", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL slug", type: "slug", group: "content", options: { source: "title" }, validation: (r) => r.required(), description: "The page is /guides/<slug>/." }),
    defineField({
      name: "status",
      type: "string",
      group: "content",
      options: { list: [{ title: "In review (hidden from Google and the sitemap)", value: "review" }, { title: "Live", value: "live" }], layout: "radio" },
      initialValue: "review",
      description: "Set to Live only after the reviewer has approved the guide.",
    }),
    { ...orderField, group: "content" },
    defineField({ name: "publishedAt", title: "Published", type: "date", group: "content" }),
    defineField({ name: "updatedAt", title: "Last updated", type: "date", group: "content" }),
    defineField({ name: "sourcesCheckedOn", title: "Sources checked on", type: "string", group: "content", description: "In words, e.g. November 9, 2026." }),
    defineField({
      name: "author",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "role", title: "Job title", type: "string" }),
        defineField({ name: "slug", title: "Team page slug", type: "string", description: "Links the byline to /team/<slug>/." }),
      ],
    }),
    defineField({ name: "summary", type: "text", rows: 3, group: "content", description: "One or two sentences, used on the guides list and as the opening lead." }),
    defineField({ name: "image", title: "Banner photo", type: "altImage", group: "content" }),
    defineField({ name: "takeaways", title: "Key takeaways", type: "array", group: "content", of: [defineArrayMember({ type: "text", rows: 2 })] }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      description: "One box per paragraph. Start a box with “## ” for a main heading, “### ” for a sub-heading, “- ” for a bullet. Use questions as headings. **bold**, [link text](/page/).",
    }),
    defineField({ name: "faqs", title: "FAQ", type: "array", group: "content", of: [defineArrayMember({ type: "faqItem" })] }),
    defineField({ name: "sources", type: "array", group: "sources", of: [defineArrayMember({ type: "guideSource" })], description: "Every statistic or market claim needs a named public source here and in the text." }),
    defineField({ name: "related", title: "Related links", type: "array", group: "sources", of: [defineArrayMember({ type: "link" })] }),
    { ...seoField, group: "seo" },
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "status", media: "image" } },
});

export const documentTypes = [siteSettings, page, teamMember, guide];
export const singletonTypes = new Set(["siteSettings"]);
