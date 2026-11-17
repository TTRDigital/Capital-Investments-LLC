import { rules } from "@/lib/legacy-redirects";
import { moves } from "@/lib/url-map";

/*
 * One place that decides where an old address goes. Used by proxy.ts and by
 * scripts/check-redirects.mjs. Returns null when the address is a normal page.
 * - lib/url-map.ts rows (this project's URL changes) are checked first
 * - then the old WordPress rules (lib/legacy-redirects.ts)
 * Query strings are kept (utm_, gclid, ...). Only the old WordPress ?p= and ?page_id= are dropped.
 */
export type Result = { status: 301 | 410; to?: string };

const norm = (p: string) => p.toLowerCase().replace(/\/+$/, "") + "/";
const moveByPath = new Map(moves.map((m) => [norm(m.from), m.to]));
const legacy = rules.map((r) => ({ re: new RegExp(r.p, r.i ? "i" : ""), d: r.d, g: r.g, q: r.q ? new RegExp(r.q, "i") : null }));

function withQuery(to: string, search: string, dropIds: boolean) {
  const params = new URLSearchParams(search);
  if (dropIds) {
    params.delete("p");
    params.delete("page_id");
  }
  const qs = params.toString();
  return qs ? `${to}?${qs}` : to;
}

export function resolve(pathname: string, search: string): Result | null {
  const direct = moveByPath.get(norm(pathname));
  if (direct) return { status: 301, to: withQuery(direct, search, false) };
  const path = pathname.replace(/^\//, "");
  const qs = search.replace(/^\?/, "");
  for (const r of legacy) {
    if (!r.re.test(path)) continue;
    if (r.q && !r.q.test(qs)) continue;
    if (r.g) return { status: 410 };
    // Chain flattening: an old address that pointed at a page which has itself moved goes straight to the final page.
    const to = moveByPath.get(norm(r.d)) ?? r.d;
    return { status: 301, to: withQuery(to, search, !!r.q) };
  }
  return null;
}
