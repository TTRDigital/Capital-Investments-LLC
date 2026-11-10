import { createHmac, timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/*
 * Turns on draft preview so TTR OS and editors see unpublished Sanity changes.
 * Preview deployments only (never production). Two ways in, both need PREVIEW_SECRET
 * (SANITY_PREVIEW_SECRET also works) and, to read drafts, SANITY_READ_TOKEN:
 *
 *   Signed link (TTR OS page fixer):
 *     /api/preview?path=/services/&exp=<unix seconds>&sig=<hex>
 *     sig = HMAC-SHA256 hex of "<path>\n<exp>" keyed with PREVIEW_SECRET.
 *     exp must be in the future and at most 30 days ahead.
 *   Shared secret (editors): /api/preview?secret=<PREVIEW_SECRET>&path=/services/
 *
 * Both redirect to path with the draft cookie set. /api/preview/exit turns it off.
 * Values live in Vercel (Preview scope), never in the repo.
 */
const MAX_AHEAD_SECONDS = 30 * 24 * 60 * 60;

const same = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.PREVIEW_SECRET || process.env.SANITY_PREVIEW_SECRET;
  if (process.env.VERCEL_ENV === "production" || !secret) return notFound();

  const path = url.searchParams.get("path") ?? "/";
  const safePath = path.startsWith("/") && !path.startsWith("//") ? path : "/";
  const sig = url.searchParams.get("sig");
  const exp = url.searchParams.get("exp");

  let ok = false;
  if (sig && exp) {
    const expNum = Number(exp);
    const now = Math.floor(Date.now() / 1000);
    if (/^\d+$/.test(exp) && expNum > now && expNum <= now + MAX_AHEAD_SECONDS + 300) {
      const expected = createHmac("sha256", secret).update(`${path}\n${exp}`).digest("hex");
      ok = same(sig.toLowerCase(), expected);
    }
  } else {
    const given = url.searchParams.get("secret");
    ok = !!given && same(given, secret);
  }
  if (!ok) return notFound();

  (await draftMode()).enable();
  redirect(safePath);
}
