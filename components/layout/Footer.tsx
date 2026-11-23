import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { ArrowUp, Facebook, Instagram, LinkedIn } from "@/components/ui/Icons";
import { LeadForm } from "@/components/forms/LeadForm";

const SOCIAL = { linkedin: LinkedIn, facebook: Facebook, instagram: Instagram } as const;
const SOCIAL_LABEL = { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram" } as const;
const tel = (p: string) => `tel:+1${p.replace(/\D/g, "").slice(-10)}`;

/**
 * Dark footer: logo, consultation form and social links on the left; quick
 * links, services and the two contact offices on the right; then the
 * copyright bar. The white logo is the design's asset (not the CMS logo field).
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  const offices = settings.contactOffices.map((k) => settings.offices.find((o) => o.key === k)).filter((o) => !!o);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-night text-[15px] text-white/70">
      <div className="container-box grid gap-14 pb-14 pt-16 md:pt-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="max-w-[460px]">
          <Link href="/" className="block w-[188px]" aria-label={`${settings.name} home`}>
            <Picture img={images.logoLight} sizes="188px" className="h-auto w-full" />
          </Link>
          <h2 className="mt-10 font-serif text-[26px] font-medium leading-tight text-white">{settings.consultationHeading || "Request a consultation"}</h2>
          {settings.consultationText ? <p className="mt-3 leading-relaxed">{settings.consultationText}</p> : null}
          <LeadForm kind="consultation" consentText={settings.consentText} tone="dark" showLabels={false} submitLabel="SUBMIT" />
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:pt-2">
          <FooterColumn title="Quick Links" links={settings.footerQuickLinks} />
          <FooterColumn title="Services" links={settings.footerServiceLinks} />
          <div>
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white">Contact Us</h2>
            <ul className="mt-5 space-y-6">
              {offices.map((o) => (
                <li key={o.key}>
                  <p className="leading-relaxed">{o.longAddress}</p>
                  {o.phone ? (
                    <p className="mt-1.5">
                      <a href={tel(o.phone)} className="font-medium text-white transition-colors hover:text-copper-tint">
                        {o.phone}
                      </a>
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <ul className="mt-8 flex gap-2.5">
              {settings.social.map((s) => {
                const Icon = SOCIAL[s.network];
                return (
                  <li key={s.network}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={`${settings.name} on ${SOCIAL_LABEL[s.network]}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-copper hover:bg-copper hover:text-white"
                    >
                      <Icon className="h-4 w-4 fill-current" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-box flex flex-col gap-4 py-7 text-[13.5px] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1.5 md:flex-row md:gap-6">
            <p>
              Copyright © {year} | {settings.name} |{" "}
              <Link href="/sitemap/" className="hover:text-white">
                Sitemap
              </Link>
            </p>
            <p>
              <Link href="/privacy-policy/" className="hover:text-white">
                Privacy Policy
              </Link>{" "}
              |{" "}
              <Link href="/terms-of-service/" className="hover:text-white">
                Terms of Service
              </Link>
            </p>
          </div>
          <div className="flex items-center justify-between gap-6">
            <p>
              Website by{" "}
              <a href={settings.credit.href} target="_blank" rel="noopener" className="hover:text-white">
                {settings.credit.label}
              </a>
            </p>
            <a href="#main" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white hover:text-white" aria-label="Back to top">
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition-colors hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
