import { MIN_FILL_MS, attributionKeys } from "@/lib/lead-options";

/*
 * Lead forms (contact, consultation, careers). Checks the same rules
 * as the form, filters spam, then sends the lead to TTR OS, which saves it for
 * Capital Investment LLC. Settings (Vercel environment variables):
 *   TTR_SITE_KEY   the public site key from TTR OS (Capital > Integrations)
 *   TTR_OS_URL     optional, default https://portal.ttrdigitalmarketing.com
 * A careers resume cannot be emailed from here: the lead is saved with the
 * file name, and the person is asked to email the resume.
 */
export const runtime = "nodejs";

const FORMS: Record<string, Record<string, boolean>> = {
  contact: { full_name: true, email: true, phone: true },
  consultation: { full_name: true, email: true, phone: true },
  careers: { full_name: true, email: true, phone: false },
};

function reply(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = (req.headers.get("host") ?? "").replace(/:\d+$/, "").toLowerCase();
  if (origin) {
    let oh = "";
    try { oh = new URL(origin).hostname.toLowerCase(); } catch { /* bad origin */ }
    if (oh !== host) return reply(403, { ok: false, error: "Forbidden." });
  }

  let input: Record<string, unknown> | null = null;
  let hasResume = false;
  let resumeName = "";
  try {
    if ((req.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data")) {
      const fd = await req.formData();
      input = JSON.parse(String(fd.get("payload") ?? ""));
      const f = fd.get("resume");
      if (f && typeof f === "object" && "name" in f) {
        hasResume = true;
        resumeName = String((f as File).name).replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 120);
        const size = (f as File).size;
        const ext = resumeName.split(".").pop()?.toLowerCase() ?? "";
        if (size > 5 * 1024 * 1024 || !["pdf", "doc", "docx"].includes(ext)) {
          return reply(422, { ok: false, error: "Please check the form.", fields: { resume: "Please attach a PDF or Word document under 5 MB." } });
        }
      }
    } else {
      input = JSON.parse((await req.text()).slice(0, 64 * 1024));
    }
  } catch {
    return reply(400, { ok: false, error: "Invalid request." });
  }
  if (!input || typeof input !== "object") return reply(400, { ok: false, error: "Invalid request." });

  const form = text(input.form, 20);
  const rules = FORMS[form];
  if (!rules) return reply(400, { ok: false, error: "Invalid request." });

  const lead: Record<string, string> = {};
  const errors: Record<string, string> = {};
  for (const [field, required] of Object.entries(rules)) {
    const v = text(input[field], field === "email" ? 200 : 120);
    lead[field] = v;
    if (!v) {
      if (required) errors[field] = "This field is required.";
      continue;
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors[field] = "Please enter a valid email address.";
    if (field === "phone" && (!/^[0-9()#&+*\-=. ]+$/.test(v) || v.replace(/\D/g, "").length < 10)) errors[field] = "Please enter a phone number with area code.";
    if (["full_name", "first_name", "last_name"].includes(field) && v.length < 2) errors[field] = "Please enter your name.";
  }
  if (input.consent !== true) errors.consent = "Please check the box to agree.";
  if (form === "careers" && !hasResume) errors.resume = "Please attach your resume.";
  if (Object.keys(errors).length) return reply(422, { ok: false, error: "Please check the form.", fields: errors });

  const trapFilled = text(input.website_url, 200) !== "";
  const elapsed = typeof input.elapsed_ms === "number" ? input.elapsed_ms : null;
  const tooFast = elapsed !== null && elapsed < MIN_FILL_MS;
  if (trapFilled && tooFast) return reply(200, { ok: true });
  const spam = trapFilled ? "suspect: hidden field filled" : tooFast ? `suspect: sent in ${elapsed} ms` : "ok";

  const key = process.env.TTR_SITE_KEY;
  if (!key) {
    console.error("[lead] TTR_SITE_KEY is not set: lead NOT saved");
    return reply(503, { ok: false, error: "Please call us instead." });
  }

  const fullName = lead.full_name ?? `${lead.first_name} ${lead.last_name}`.trim();
  const body = new URLSearchParams();
  body.set("k", key);
  body.set("p", new URL(text(input.page_url, 1000) || "https://www.capitalinvestmentllc.com/").pathname);
  body.set("r", text(input.referrer, 1000));
  body.set("u", text(input.landing_page, 1000));
  const f = (n: string, v: string) => { if (v) body.set(`f_${n}`, v); };
  f("form", form);
  f("name", fullName);
  f("first_name", lead.first_name ?? "");
  f("last_name", lead.last_name ?? "");
  f("email", lead.email ?? "");
  f("phone", lead.phone ?? "");
  f("position", text(input.position, 200));
  if (hasResume) f("resume_file", `${resumeName} (not delivered: ask the person to email it)`);
  f("consent", "yes");
  f("consent_text", text(input.consent_text, 1000));
  f("spam_check", spam);
  f("page_url", text(input.page_url, 1000));
  for (const k of attributionKeys) f(k, text(input[k], 200));

  try {
    const res = await fetch(`${process.env.TTR_OS_URL || "https://portal.ttrdigitalmarketing.com"}/api/site/form`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": req.headers.get("user-agent") ?? "",
        "x-forwarded-for": req.headers.get("x-forwarded-for") ?? "",
        origin: origin ?? "https://www.capitalinvestmentllc.com",
      },
      body,
    });
    if (!res.ok) throw new Error(String(res.status));
  } catch (e) {
    console.error("[lead] could not send to TTR OS", String(e).slice(0, 200));
    return reply(502, { ok: false, error: "Please call us instead." });
  }
  return reply(200, { ok: true });
}
