import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolve } from "./lib/redirect";

/*
 * Old and moved addresses: 301 to the new page (query string kept), or 410 for
 * things that no longer exist. The rules are in lib/url-map.ts (this project's
 * URL changes) and lib/legacy-redirects.ts (old WordPress addresses).
 */
export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hit = resolve(pathname, search);
  if (!hit) return NextResponse.next();
  if (hit.status === 410 || !hit.to) return new NextResponse("Gone", { status: 410, headers: { "content-type": "text/plain" } });
  return NextResponse.redirect(new URL(hit.to, req.nextUrl), 301);
}

export const config = {
  matcher: ["/((?!_next/|images/|fonts/|cms|api/|favicon.ico|robots.txt|sitemap.xml).*)"],
};
