import { LeadForm } from "@/components/forms/LeadForm";

/** Footer newsletter signup (old site: Full Name*, Email*), on the dark footer. */
export function NewsletterForm({ consentText }: { consentText: string }) {
  return (
    <div className="max-w-[460px]">
      <LeadForm kind="newsletter" consentText={consentText} tone="dark" showLabels={false} />
    </div>
  );
}
