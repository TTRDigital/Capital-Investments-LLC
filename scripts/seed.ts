/**
 * Loads the built-in content (lib/data) and its images into Sanity, so the
 * CMS starts full instead of empty.
 *
 *   npm run seed              # create documents that don't exist yet (add-missing)
 *   npm run seed -- --force   # overwrite every document with the built-in content
 *   npm run seed -- --dry-run # build every document without uploading or writing
 *   npm run seed -- --export  # write content-export/sanity-seed.json (+ .ndjson): no token, no network, nothing uploaded
 *                             # images point at https://www.capitalinvestmentllc.com/images/... (--assets-base=<url> to change)
 *
 * Writes to project 850gl5j0 / production unless NEXT_PUBLIC_SANITY_PROJECT_ID /
 * NEXT_PUBLIC_SANITY_DATASET say otherwise (environment or .env.local). Needs
 * SANITY_WRITE_TOKEN (Editor token from sanity.io/manage > API > Tokens).
 * Without --force, anything an editor already changed in /cms is kept.
 */
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createClient } from "@sanity/client";
import type { Img } from "../lib/types";
import { fallbackSettings } from "../lib/data/site.ts";
import { fallbackPages } from "../lib/data/pages.ts";
import { fallbackTeam } from "../lib/data/team.ts";

const root = new URL("..", import.meta.url).pathname;

// Minimal .env.local reader so the script works without extra packages.
if (existsSync(join(root, ".env.local"))) {
  for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// Imported after .env.local is loaded so its values apply.
const { dataset, projectId } = await import("../sanity/env.ts");
const token = process.env.SANITY_WRITE_TOKEN;
const force = process.argv.includes("--force");
const exportMode = process.argv.includes("--export");
const dryRun = process.argv.includes("--dry-run") || exportMode;
const assetsBase = (process.argv.find((a) => a.startsWith("--assets-base="))?.split("=")[1] ?? "https://www.capitalinvestmentllc.com").replace(/\/$/, "");

if (!dryRun && (!projectId || !token)) {
  console.error("Set SANITY_WRITE_TOKEN (Editor token from sanity.io/manage > API > Tokens) in .env.local or the environment.");
  process.exit(1);
}

const client = createClient({ projectId: projectId || "dry-run", dataset, token, apiVersion: "2025-02-19", useCdn: false });

/* ---------- helpers ---------- */

let keyN = 0;
const key = () => `k${(keyN++).toString(36)}`;
const uploaded = new Map<string, string>();

async function asset(src: string) {
  if (uploaded.has(src)) return uploaded.get(src)!;
  const file = join(root, "public", src);
  if (!existsSync(file)) throw new Error(`Missing file: ${file}`);
  if (dryRun) {
    uploaded.set(src, `image-dry${uploaded.size}-1x1-webp`);
    return uploaded.get(src)!;
  }
  const doc = await client.assets.upload("image", createReadStream(file), { filename: basename(file) });
  uploaded.set(src, doc._id);
  process.stdout.write(".");
  return doc._id;
}

type Json = unknown;
const isImg = (v: Json): v is Img => !!v && typeof v === "object" && !Array.isArray(v) && "src" in v && "alt" in v && typeof (v as Img).src === "string" && (v as Img).src.startsWith("/");

/** Sanity array member type for an array field, by field name (and section type for "items"). */
function memberType(field: string, parentType?: string): string | undefined {
  if (field === "items") return parentType === "splitAccordion" ? "accordionItem" : parentType === "faq" ? "faqItem" : parentType === "stats" ? "statItem" : "item";
  return (
    {
      tabs: "tab",
      rows: "stackRow",
      blocks: "serviceBlock",
      slides: "serviceSlide",
      markets: "market",
      members: "carouselMember",
      jobs: "job",
      openings: "link",
      cities: "link",
      footerQuickLinks: "link",
      footerServiceLinks: "link",
      offices: "office",
      social: "socialLink",
      menu: "menuItem",
    } as Record<string, string>
  )[field];
}
const childMenuType = (parent?: string) => (parent === "menuItem" ? "subMenuItem" : "subSubMenuItem");

/** Built-in data -> Sanity document values: images uploaded, array objects keyed and typed. */
async function toSanity(v: Json, field = "", parentType?: string): Promise<Json> {
  if (isImg(v) && exportMode) {
    if (!existsSync(join(root, "public", v.src))) throw new Error(`Missing file: ${v.src}`);
    // `sanity dataset import` downloads and uploads this file, then replaces the marker with a reference.
    uploaded.set(v.src, v.src);
    return { _type: "altImage", alt: v.alt, asset: { _sanityAsset: `image@${assetsBase}${v.src}` } };
  }
  if (isImg(v)) return { _type: "altImage", alt: v.alt, asset: { _type: "reference", _ref: await asset(v.src) } };
  if (Array.isArray(v)) {
    const out = [];
    for (const item of v) {
      if (item && typeof item === "object") {
        const t = isImg(item) ? undefined : field === "children" ? childMenuType(parentType) : field === "sections" ? undefined : memberType(field, parentType);
        const conv = (await toSanity(item, field, t ?? (item as { _type?: string })._type)) as Record<string, unknown>;
        out.push({ _key: key(), ...(t ? { _type: t } : {}), ...conv });
      } else if (item !== undefined && item !== null && item !== "") out.push(item);
    }
    return out;
  }
  if (v && typeof v === "object") {
    const obj = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    const type = typeof obj._type === "string" ? obj._type : parentType;
    for (const [k, x] of Object.entries(obj)) {
      if (x === undefined || x === null || x === "" || k === "_key") continue;
      out[k] = await toSanity(x, k, type);
    }
    // Offices are keyed by their own "key" field; a field named key is fine inside objects.
    return out;
  }
  return v;
}

const pageId = (path: string) => `page-${path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "--")}`;

/* ---------- documents ---------- */

async function build() {
  const docs: Record<string, unknown>[] = [];
  docs.push({ _id: "siteSettings", _type: "siteSettings", ...((await toSanity(fallbackSettings)) as object) });
  for (const p of fallbackPages) {
    const { sections, seo, ...rest } = p;
    docs.push({
      _id: pageId(p.path),
      _type: "page",
      ...rest,
      sections: await toSanity(sections, "sections"),
      seo: { _type: "seo", ...((await toSanity(seo)) as object) },
    });
  }
  for (const m of fallbackTeam) {
    const { slug, seo, ...rest } = m;
    docs.push({ _id: `teamMember-${slug}`, _type: "teamMember", ...((await toSanity(rest)) as object), slug: { _type: "slug", current: slug }, seo: { _type: "seo", ...((await toSanity(seo)) as object) } });
  }
  return docs as { _id: string; _type: string }[];
}

console.log(`Seeding ${projectId}/${dataset}${force ? " (overwrite)" : " (add missing, keeping existing documents)"}${dryRun ? " [dry run]" : ""}. Uploading images`);
const docs = await build();
console.log(`\n${uploaded.size} images ${dryRun ? "checked" : "uploaded"}. Writing ${docs.length} documents…`);
if (exportMode) {
  const dotted = docs.filter((d) => d._id.includes("."));
  if (dotted.length) throw new Error(`Document ids with dots become private: ${dotted.map((d) => d._id).join(", ")}`);
  const ids = new Set(docs.map((d) => d._id));
  if (ids.size !== docs.length) throw new Error("Duplicate document ids");
  const dir = join(root, "content-export");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "sanity-seed.json"), JSON.stringify(docs, null, 2) + "\n");
  writeFileSync(join(dir, "sanity-seed.ndjson"), docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
  const counts = docs.reduce<Record<string, number>>((acc, d) => ((acc[d._type] = (acc[d._type] ?? 0) + 1), acc), {});
  console.log("Exported to content-export/sanity-seed.json and .ndjson:", counts, `${uploaded.size} images referenced, no dots in ids`);
  process.exit(0);
}
if (dryRun) {
  const counts = docs.reduce<Record<string, number>>((acc, d) => ((acc[d._type] = (acc[d._type] ?? 0) + 1), acc), {});
  const bad = JSON.stringify(docs).match(/"src":"\/images/g)?.length ?? 0;
  console.log("Dry run, nothing written:", counts, `${Math.round(JSON.stringify(docs).length / 1024)} KB of content`, bad ? `WARNING: ${bad} images not converted` : "all images converted");
  process.exit(bad ? 1 : 0);
}

// Small transactions keep each request well under Sanity's size limit.
for (let i = 0; i < docs.length; i += 10) {
  const tx = client.transaction();
  for (const d of docs.slice(i, i + 10)) {
    if (force) tx.createOrReplace(d);
    else tx.createIfNotExists(d);
  }
  await tx.commit({ visibility: "async" });
  process.stdout.write(`${Math.min(i + 10, docs.length)}/${docs.length} `);
}
console.log("\nDone. Open /cms to see the content.");
