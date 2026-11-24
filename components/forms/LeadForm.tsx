"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ATTRIBUTION_STORAGE_KEY, attributionKeys, RESUME_ACCEPT, RESUME_MAX_BYTES, type FormKind } from "@/lib/lead-options";

/*
 * The old site's four forms, same fields, plus a consent checkbox:
 * - contact (Let's Chat popup, /contact-us/): Full Name, Email, Phone
 * - consultation (footer, "be contacted"): Full Name*, Email*, Phone*
 * - careers (/careers-in-…/): Name*, Email Address*, Phone Number, Upload Resume*
 * Posted to /api/lead/, which checks the same rules and forwards to GoHighLevel.
 */

type FieldName = "full_name" | "first_name" | "last_name" | "email" | "phone" | "resume";
type FieldDef = { name: FieldName; label: string; required: boolean; type: "text" | "email" | "tel" | "file"; autoComplete?: string };

const FIELDS: Record<FormKind, FieldDef[]> = {
  contact: [
    { name: "full_name", label: "Full Name", required: true, type: "text", autoComplete: "name" },
    { name: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone", required: true, type: "tel", autoComplete: "tel" },
  ],
  consultation: [
    { name: "full_name", label: "Full Name", required: true, type: "text", autoComplete: "name" },
    { name: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone", required: true, type: "tel", autoComplete: "tel" },
  ],
  careers: [
    { name: "full_name", label: "Name", required: true, type: "text", autoComplete: "name" },
    { name: "email", label: "Email Address", required: true, type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone Number", required: false, type: "tel", autoComplete: "tel" },
    { name: "resume", label: "Upload Resume", required: true, type: "file" },
  ],
};

/** Where a successful submit goes; forms without one show a thank-you message in place. */
const THANK_YOU: Partial<Record<FormKind, string>> = {};
const SUCCESS: Record<FormKind, string> = {
  contact: "Thank you. Your message has been sent.",
  consultation: "Thank you. Your request has been sent.",
  careers: "Thank you. Your resume has been sent.",
};

function validate(f: FieldDef, value: string, file: File | null): string | undefined {
  if (f.type === "file") {
    if (!file) return f.required ? "Please attach your resume." : undefined;
    if (file.size > RESUME_MAX_BYTES) return "Please attach a file under 5 MB.";
    if (!/\.(pdf|docx?)$/i.test(file.name)) return "Please attach a PDF or Word document.";
    return undefined;
  }
  const v = value.trim();
  if (!v) return f.required ? `Please enter your ${f.label.toLowerCase()}.` : undefined;
  if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
  if (f.type === "tel" && (!/^[0-9()#&+*\-=. ]+$/.test(v) || v.replace(/\D/g, "").length < 10)) return "Please enter a phone number with area code.";
  if (f.type === "text" && v.length < 2) return `Please enter your ${f.label.toLowerCase()}.`;
  return undefined;
}

export function LeadForm({
  kind,
  consentText,
  tone = "light",
  submitLabel = "SEND",
  position,
  showLabels = true,
}: {
  kind: FormKind;
  consentText: string;
  tone?: "light" | "dark";
  submitLabel?: string;
  /** Job title sent with a careers application. */
  position?: string;
  showLabels?: boolean;
}) {
  const router = useRouter();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(0);
  const fields = FIELDS[kind];
  const [values, setValues] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const next: Record<string, string | undefined> = {};
    for (const f of fields) next[f.name] = validate(f, values[f.name] ?? "", file);
    if (!consent) next.consent = "Please check the box to agree.";
    setErrors(next);
    const firstBad = Object.keys(next).find((k) => next[k]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${uid}-${firstBad}`)}`)?.focus();
      return;
    }
    setStatus("sending");

    let attribution: Record<string, string> = {};
    try {
      attribution = JSON.parse(sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY) ?? "{}");
    } catch {
      /* storage unavailable */
    }
    const honeypot = (formRef.current?.elements.namedItem("website_url") as HTMLInputElement | null)?.value ?? "";
    const payload: Record<string, string | number | boolean> = {
      form: kind,
      ...Object.fromEntries(fields.filter((f) => f.type !== "file").map((f) => [f.name, values[f.name] ?? ""])),
      ...(position ? { position } : {}),
      consent: true,
      consent_text: consentText,
      website_url: honeypot,
      elapsed_ms: Date.now() - startedAt.current,
      page_url: window.location.href,
      landing_page: attribution.landing_page ?? "",
      referrer: attribution.referrer ?? document.referrer,
      ...Object.fromEntries(attributionKeys.map((k) => [k, attribution[k] ?? ""])),
    };

    try {
      let res: Response;
      if (kind === "careers" && file) {
        const body = new FormData();
        body.set("payload", JSON.stringify(payload));
        body.set("resume", file);
        res = await fetch("/api/lead/", { method: "POST", body });
      } else {
        res = await fetch("/api/lead/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      if (!res.ok) throw new Error(String(res.status));
      const w = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
      w.gtag?.("event", "generate_lead", { form: kind });
      w.dataLayer?.push({ event: "generate_lead", form: kind });
      const to = THANK_YOU[kind];
      if (to) router.push(to);
      else setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const dark = tone === "dark";
  const inputCls = (bad: boolean) =>
    `block w-full rounded-xl border px-4 py-3.5 font-sans text-[15px] outline-none transition-[border-color,box-shadow,background-color] ${
      dark
        ? "border-white/15 bg-white/[0.06] text-white placeholder:text-white/55 focus:border-white/60 focus:ring-2 focus:ring-white/15"
        : "border-line bg-paper text-ink placeholder:text-muted/80 focus:border-bronze focus:bg-white focus:ring-4 focus:ring-bronze/15"
    } ${bad ? (dark ? "!border-[#ff9b9b]" : "!border-[#c53030]") : ""}`;
  const errCls = dark ? "text-[#ffb3b3]" : "text-[#b42318]";

  if (status === "sent") {
    return (
      <p role="status" className={`mt-6 rounded-xl border px-5 py-4 font-serif text-[22px] leading-snug ${dark ? "border-white/15 text-white" : "border-line bg-paper text-ink"}`}>
        {SUCCESS[kind]}
      </p>
    );
  }

  return (
    <form data-ttr-skip ref={formRef} onSubmit={onSubmit} noValidate className={`mt-6 space-y-4 text-left font-sans ${dark ? "text-white" : "text-ink"}`}>
      {fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const bad = !!errors[f.name];
        const describedBy = bad ? `${id}-err` : undefined;
        return (
          <div key={f.name}>
            <label htmlFor={id} className={showLabels ? "mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em]" : "sr-only"}>
              {f.label}
              {f.required ? <span aria-hidden="true">{showLabels ? " *" : ""}</span> : null}
              {f.required ? <span className="sr-only"> (required)</span> : null}
            </label>
            {f.type === "file" ? (
              <input
                id={id}
                name={f.name}
                type="file"
                accept={RESUME_ACCEPT}
                aria-invalid={bad || undefined}
                aria-describedby={describedBy}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full rounded-xl border border-dashed border-line bg-paper p-3 text-[14px] text-body file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-[11px] file:font-bold file:uppercase file:tracking-[0.16em] file:text-paper"
              />
            ) : (
              <input
                id={id}
                name={f.name}
                type={f.type}
                autoComplete={f.autoComplete}
                placeholder={`${f.label}${!showLabels && f.required ? "*" : ""}`}
                value={values[f.name] ?? ""}
                aria-invalid={bad || undefined}
                aria-describedby={describedBy}
                onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
                className={inputCls(bad)}
              />
            )}
            {bad ? (
              <p id={`${id}-err`} className={`mt-1 text-[13px] ${errCls}`}>
                {errors[f.name]}
              </p>
            ) : null}
          </div>
        );
      })}

      <div>
        <label htmlFor={`${uid}-consent`} className={`flex cursor-pointer items-start gap-3 text-[12.5px] leading-[1.55] ${dark ? "text-white/60" : "text-muted"}`}>
          <input
            id={`${uid}-consent`}
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (e.target.checked) setErrors((er) => ({ ...er, consent: undefined }));
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
            className="mt-[2px] h-4 w-4 shrink-0 accent-[#151a22]"
          />
          <span>{consentText}</span>
        </label>
        {errors.consent ? (
          <p id={`${uid}-consent-err`} className={`mt-1 text-[13px] ${errCls}`}>
            {errors.consent}
          </p>
        ) : null}
      </div>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website_url`}>Leave this field empty</label>
        <input id={`${uid}-website_url`} name="website_url" type="text" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" />
      </div>

      {status === "error" ? (
        <p role="alert" className={`text-[14px] ${errCls}`}>
          Something went wrong sending the form. Please try again, or call us at <a href="tel:+15715408688" className="font-semibold underline">(571) 540-8688</a>.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className={`btn ${dark ? "" : "btn-dark"} w-full !py-4 disabled:opacity-70`}
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
