/*
 * Checks every URL change against a running site (preview or localhost):
 *   node scripts/check-redirects.mjs https://<preview-url>
 * Each row of lib/url-map.ts and a set of old WordPress addresses must answer 301
 * (never 302/307/308), keep the query string, and land on a page that answers 200
 * in a single hop. Exits 1 on any failure.
 */
import { readFileSync } from "node:fs";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const src = readFileSync(new URL("../lib/url-map.ts", import.meta.url), "utf8");
const from = [...src.matchAll(/from: "([^"]+)"/g)].map((m) => m[1]);
const hoods = [...src.matchAll(/^\s+"(commercial-real-estate-services-[a-z-]+)",$/gm)].map((m) => m[1]);
const paths = new Set(from.filter((p) => !p.includes("${")));
for (const h of hoods) {
  paths.add(`/locations/${h}/`);
  paths.add(`/${h}/`);
}
for (const p of ["/investments-in-miami/", "/investments-in-washington-dc/", "/investments-in-northern-virginia/", "/home/", "/about/", "/contact/", "/team/"]) paths.add(p);

let bad = 0;
const get = (u) => fetch(u, { redirect: "manual" });
for (const p of [...paths].sort()) {
  const q = "?utm_source=test&gclid=abc";
  for (const variant of [p + q]) {
    const r = await get(base + variant);
    const loc = r.headers.get("location") || "";
    const dest = loc ? new URL(loc, base) : null;
    let note = "";
    if (r.status !== 301) note = `status ${r.status}`;
    else if (dest && !(dest.search.includes("utm_source=test") && dest.search.includes("gclid=abc"))) note = "query string lost";
    else if (dest) {
      const hop = await get(dest.href);
      if (hop.status !== 200) note = `destination ${dest.pathname} answers ${hop.status}`;
    }
    if (note) {
      bad++;
      console.log(`FAIL ${variant} -> ${loc || "(none)"}: ${note}`);
    }
  }
}
console.log(bad ? `${bad} problem(s)` : `OK: ${paths.size} addresses, 301, query kept, destination 200`);
process.exit(bad ? 1 : 0);
