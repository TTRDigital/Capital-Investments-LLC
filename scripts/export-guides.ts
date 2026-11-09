/**
 * Seed export for the guides: turns lib/data/guides.ts into Sanity documents
 * and writes content/guides/guides.seed.json. No token, no network, nothing is
 * uploaded or written to Sanity. Ids have no dots (a dot in an id makes a
 * private draft in Sanity).
 *
 *   npm run export:guides
 *
 * Load the file with the Sanity CLI (one document per line is what `dataset
 * import` wants, so convert first):
 *   node -e 'const d=require("./content/guides/guides.seed.json");console.log(d.map(x=>JSON.stringify(x)).join("\n"))' > guides.ndjson
 *   npx sanity dataset import guides.ndjson production --missing
 * `--missing` leaves any document that already exists untouched.
 *
 * The guide documents point at the team member document "teamMember-<slug>",
 * which `npm run seed` already creates.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fallbackGuides } from "../lib/data/guides.ts";

const root = new URL("..", import.meta.url).pathname;
let n = 0;
const key = () => `k${(n++).toString(36)}`;

const docs = fallbackGuides.map((g) => ({
  _id: `guide-${g.slug}`,
  _type: "guide",
  title: g.title,
  slug: { _type: "slug", current: g.slug },
  excerpt: g.excerpt,
  author: { _type: "reference", _ref: `teamMember-${g.authorSlug}` },
  publishedAt: g.publishedAt,
  ...(g.updatedAt ? { updatedAt: g.updatedAt } : {}),
  body: g.body,
  sources: g.sources.map((s) => ({ _key: key(), _type: "guideSource", ...s })),
  related: g.related.map((r) => ({ _key: key(), _type: "link", ...r })),
  disclaimer: g.disclaimer,
  seo: { _type: "seo", ...g.seo },
}));

/* Content rules, checked on every export. */
const problems: string[] = [];
for (const d of docs) {
  if (d._id.includes(".")) problems.push(`${d._id}: id has a dot`);
  const text = JSON.stringify([d.title, d.excerpt, d.body, d.sources, d.related, d.disclaimer, d.seo]);
  if (/[–—]/.test(text)) problems.push(`${d._id}: contains an em or en dash`);
  if (/\[[A-Z][A-Za-z ]*\](?!\()/.test(d.body.join("\n"))) problems.push(`${d._id}: bracketed placeholder in the body`);
  if (/ora world/i.test(text)) problems.push(`${d._id}: mentions a name that must not appear`);
  if (d.body.some((p) => /^#\s/.test(p) || /^#{4,}\s/.test(p))) problems.push(`${d._id}: heading level other than ## or ###`);
  for (const p of d.body) if ((p.startsWith("## ") || p.startsWith("### ")) && !p.trim().endsWith("?")) problems.push(`${d._id}: heading is not a question: ${p}`);
  if (!d.sources.length) problems.push(`${d._id}: no sources`);
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

mkdirSync(join(root, "content/guides"), { recursive: true });
writeFileSync(join(root, "content/guides/guides.seed.json"), `${JSON.stringify(docs, null, 2)}\n`);
console.log(`Wrote ${docs.length} guide documents to content/guides/guides.seed.json (${docs.map((d) => d._id).join(", ")}).`);
