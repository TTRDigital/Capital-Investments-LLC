/* Constants for the lead forms. public/api/lead.php repeats the field rules: keep them in sync. */

export const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

export const ATTRIBUTION_STORAGE_KEY = "ci_attribution";

/** Minimum time a human needs to fill a form. Faster submits are treated as suspect. */
export const MIN_FILL_MS = 2500;

/** Resume upload limits (careers form). */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_ACCEPT = ".pdf,.doc,.docx";

export type FormKind = "contact" | "newsletter" | "subscribe" | "careers";
