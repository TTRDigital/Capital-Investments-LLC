/* Constants for the lead forms. app/api/lead/route.ts repeats the field rules: keep them in sync. */

export const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

export const ATTRIBUTION_STORAGE_KEY = "ci_attribution";

/** Minimum time a human needs to fill a form. Faster submits are treated as suspect. */
export const MIN_FILL_MS = 2500;

/** Resume upload limits (careers form). */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_ACCEPT = ".pdf,.doc,.docx";

/**
 * Separate, unchecked, optional text message (SMS) consent shown on the contact and consultation forms.
 * The exact wording is sent with the lead (app/api/lead/route.ts) so the opt-in can be shown to a carrier.
 * Keep the words "Privacy Policy" and "Terms": the form turns them into links.
 */
export const SMS_CONSENT_TEXT =
  "I agree to receive SMS messages from Capital Investment LLC about my inquiry, scheduling and service updates. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Privacy Policy and Terms.";

export type FormKind = "contact" | "consultation" | "careers";
