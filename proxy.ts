import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rules } from "./lib/legacy-redirects";

/*
 * Old WordPress addresses (moved here from the SiteGround .htaccess):
 * 301 to the new page, or 410 for things that no longer exist.
 * The rules are in lib/legacy-redirects.ts.
 */
const compiled = rules.map((r) => ({
  re: new RegExp(r.p, r.i ? "i" : ""),
  d: r.d,
  g: r.g,
  q: r.q ? new RegExp(r.q, "i") : null,
}));

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const path = pathname.replace(/^\//, "");
  const qs = search.replace(/^\?/, "");
  for (const r of compiled) {
    if (!r.re.test(path)) continue;
    if (r.q && !r.q.test(qs)) continue;
    if (r.g) return new NextResponse("Gone", { status: 410, headers: { "content-type": "text/plain" } });
    const to = req.nextUrl.clone();
    to.pathname = r.d;
    to.search = "";
    return NextResponse.redirect(to, 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|images/|fonts/|cms|api/|favicon.ico|robots.txt|sitemap.xml).*)"],
};
