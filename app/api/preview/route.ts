import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/*
 * Turns on draft preview so editors see unpublished Sanity changes.
 * Preview deployments only (never production), and needs the secret:
 *   /api/preview?secret=<SANITY_PREVIEW_SECRET>&path=/about-us/
 * Settings (Vercel environment variables, Preview): PREVIEW_SECRET (SANITY_PREVIEW_SECRET also works),
 * SANITY_READ_TOKEN (a Viewer token from sanity.io/manage > API > Tokens).
 * /api/preview/exit turns it off.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = process.env.PREVIEW_SECRET || process.env.SANITY_PREVIEW_SECRET;
  if (process.env.VERCEL_ENV === "production" || !secret || url.searchParams.get("secret") !== secret) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  }
  (await draftMode()).enable();
  const path = url.searchParams.get("path") ?? "/";
  redirect(path.startsWith("/") && !path.startsWith("//") ? path : "/");
}
