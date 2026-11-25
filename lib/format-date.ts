/** "2026-11-25" -> "November 25, 2026" (read as a calendar date, so no time zone shift). */
export function formatDate(d: string) {
  const t = Date.parse(`${d}T12:00:00Z`);
  return Number.isNaN(t) ? d : new Date(t).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
