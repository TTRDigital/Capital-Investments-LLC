import { defineArrayMember, defineField, defineType } from "sanity";

/*
 * Guides: market conditions, statistics and client insights. Field names match
 * the Guide type in lib/types.ts, so CMS values merge over lib/data/guides.ts.
 */

export const guideSource = defineType({
  name: "guideSource",
  title: "Source",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Title of the page or report", type: "string", validation: (r) => r.required() }),
    defineField({ name: "publisher", type: "string", validation: (r) => r.required() }),
    defineField({ name: "url", title: "Link", type: "url", validation: (r) => r.required().uri({ scheme: ["https"] }) }),
    defineField({ name: "date", title: "Date", type: "string", description: 'Publication date if the source gives one, otherwise the day you read it, e.g. "Read on November 9, 2026".', validation: (r) => r.required() }),
    defineField({ name: "note", title: "What it supports", type: "string" }),
  ],
  preview: { select: { title: "label", subtitle: "publisher" } },
});

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "sources", title: "Sources and links" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Title (the page's H1)", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, description: "The guide is at /guides/<slug>/.", validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, group: "content", description: "One or two sentences for the guides list." }),
    defineField({ name: "author", type: "reference", to: [{ type: "teamMember" }], group: "content", description: "Shown in the byline and in the article's structured data." }),
    defineField({ name: "publishedAt", title: "Published", type: "date", group: "content", validation: (r) => r.required() }),
    defineField({ name: "updatedAt", title: "Last updated", type: "date", group: "content" }),
    defineField({ name: "banner", title: "Banner photo", type: "altImage", group: "content", description: "Leave empty to use the default banner." }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "text", rows: 5 })],
      description: "One box per paragraph. Start a box with “## ” for a heading, “### ” for a sub-heading, “- ” for a bullet. Write headings as questions. **bold**, _italic_, [link text](/page/). The title is the H1, so do not use a single “#”. No dashes as punctuation, no bracketed placeholders.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "sources", type: "array", group: "sources", of: [defineArrayMember({ type: "guideSource" })], description: "Every statistic needs a named public source here and in the text." }),
    defineField({ name: "related", title: "Related links", type: "array", group: "sources", of: [defineArrayMember({ type: "link" })] }),
    defineField({ name: "disclaimer", type: "array", group: "sources", of: [defineArrayMember({ type: "text", rows: 4 })] }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [{ title: "Newest first", name: "newest", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
