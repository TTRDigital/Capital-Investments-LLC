"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ATTRIBUTION_STORAGE_KEY, attributionKeys, RESUME_ACCEPT, RESUME_MAX_BYTES, type FormKind } from "@/lib/lead-options";

/*
 * The old site's four forms, same fields, plus a consent checkbox:
 * - contact (Let's Chat popup, /contact-us/): Full Name, Email, Phone
 * - newsletter (footer): Full Name*, Email*
 * - subscribe (/subscribe/): First Name*, Last Name*, Email*
 * - careers (/careers-in-…/): Name*, Email Address*, Phone Number, Upload Resume*
 * Posted to /api/lead.php, which checks the same rules and forwards to GoHighLevel.
 */

type FieldName = "full_name" | "first_name" | "last_name" | "email" | "phone" | "resume";
type FieldDef = { name: FieldName; label: string; required: boolean; type: "text" | "email" | "tel" | "file"; autoComplete?: string };

const FIELDS: Record<FormKind, FieldDef[]> = {
  contact: [
    { name: "full_name", label: "Full Name", required: true, type: "text", autoComplete: "name" },
    { name: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone", required: true, type: "tel", autoComplete: "tel" },
  ],
  newsletter: [
    { name: "full_name", label: "Full Name", required: true, type: "text", autoComplete: "name" },
    { name: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
  ],
  subscribe: [
    { name: "first_name", label: "First Name", required: true, type: "text", autoComplete: "given-name" },
    { name: "last_name", label: "Last Name", required: true, type: "text", autoComplete: "family-name" },
    { name: "email", label: "Email", required: true, type: "email", autoComplete: "email" },
  ],
  careers: [
    { name: "full_name", label: "Name", required: true, type: "text", autoComplete: "name" },
    { name: "email", label: "Email Address", required: true, type: "email", autoComplete: "email" },
    { name: "phone", label: "Phone Number", required: false, type: "tel", autoComplete: "tel" },
    { name: "resume", label: "Upload Resume", required: true, type: "file" },
  ],
};

/** Where a successful submit goes; forms without one show a thank-you message in place. */
const THANK_YOU: Partial<Record<FormKind, string>> = { newsletter: "/confirmation-thank-you/", subscribe: "/confirmation-thank-you/" };
const SUCCESS: Record<FormKind, string> = {
  contact: "Thank you. Your message has been sent.",
  newsletter: "Thank you for subscribing.",
  subscribe: "Thank you for subscribing.",
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
        res = await fetch("/api/lead.php", { method: "POST", body });
      } else {
        res = await fetch("/api/lead.php", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
    `block w-full rounded-[3px] border px-[15px] py-[8px] font-sans text-[14px] outline-none transition-[border-color,box-shadow] ${
      dark ? "border-white/40 bg-white/10 text-white placeholder:text-white/70 focus:border-white" : "border-[#d1d5db] bg-white text-ink placeholder:text-[#9ca3af] focus:border-copper"
    } ${bad ? "border-[#e53e3e]" : ""}`;
  const errCls = dark ? "text-[#ffb3b3]" : "text-[#c53030]";

  if (status === "sent") {
    return (
      <p role="status" className={`mt-5 font-sans text-[16px] font-semibold ${dark ? "text-white" : "text-ink"}`}>
        {SUCCESS[kind]}
      </p>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className={`mt-5 space-y-[14px] text-left font-sans ${dark ? "text-white" : "text-ink"}`}>
      {fields.map((f) => {
        const id = `${uid}-${f.name}`;
        const bad = !!errors[f.name];
        const describedBy = bad ? `${id}-err` : undefined;
        return (
          <div key={f.name}>
            <label htmlFor={id} className={showLabels ? "mb-[6px] block text-[14px] font-medium" : "sr-only"}>
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
                className="block w-full text-[14px] file:mr-3 file:rounded-[3px] file:border file:border-[#d1d5db] file:bg-white file:px-3 file:py-1.5 file:text-[13px]"
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
        <label htmlFor={`${uid}-consent`} className={`flex cursor-pointer items-start gap-3 text-[13px] leading-[1.5] ${dark ? "text-white/85" : "text-ink/85"}`}>
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
            className="mt-[3px] h-[16px] w-[16px] shrink-0 accent-[#bb6e3d]"
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
        className="block w-full rounded-[3px] bg-copper px-5 py-[12px] text-[14px] font-semibold uppercase tracking-[1px] text-white transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
