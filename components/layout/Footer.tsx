import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { ArrowUp, Facebook, Instagram, LinkedIn, Phone, Pin } from "@/components/ui/Icons";
import { LeadForm } from "@/components/forms/LeadForm";

const SOCIAL = { linkedin: LinkedIn, facebook: Facebook, instagram: Instagram } as const;
const SOCIAL_LABEL = { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram" } as const;
const tel = (p: string) => `tel:+1${p.replace(/\D/g, "").slice(-10)}`;

/**
 * Site footer in two parts: a dark consultation band (heading, text and the
 * two contact offices beside the form in a white card), then the footer
 * proper (logo, link columns, social links, copyright bar). The logos are the
 * design's assets, not the CMS logo fields.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  const offices = settings.contactOffices.map((k) => settings.offices.find((o) => o.key === k)).filter((o) => !!o);
  const year = new Date().getFullYear();
  return (
    <footer className="bg-night text-[15px] text-white/65">
      <div className="relative isolate overflow-hidden bg-ink">
        <div className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-bronze/15 blur-[120px]" aria-hidden="true" />
        <div className="container-box grid gap-14 py-20 md:py-28 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
          <div className="lg:pt-6">
            <p className="eyebrow eyebrow-rule !text-gold">Contact Us</p>
            <h2 className="h-section h-caps mt-6 max-w-[520px] text-paper">{settings.consultationHeading || "Request a consultation"}</h2>
            {settings.consultationText ? <p className="lead mt-6 max-w-[460px] text-white/70">{settings.consultationText}</p> : null}
            <ul className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2">
              {offices.map((o) => (
                <li key={o.key}>
                  <h3 className="font-serif text-[24px] font-medium text-paper">{o.label}</h3>
                  <p className="mt-3 flex gap-2.5 text-[14px] leading-relaxed">
                    <Pin className="mt-[5px] h-3.5 w-3 shrink-0 text-gold" />
                    {o.longAddress}
                  </p>
                  {o.phone ? (
                    <a href={tel(o.phone)} className="mt-3 inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.16em] text-paper transition-colors hover:text-gold">
                      <Phone className="h-3 w-3 text-gold" />
                      {o.phone}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[22px] bg-white p-6 shadow-lift md:p-10">
            <div className="flex items-center justify-between gap-6 border-b border-line pb-6">
              <Picture img={images.logoInk} sizes="150px" className="h-auto w-[150px]" />
              <span className="caps hidden text-muted sm:block">{settings.tagline}</span>
            </div>
            <LeadForm kind="consultation" consentText={settings.consentText} submitLabel="SUBMIT" />
          </div>
        </div>
      </div>

      <div className="container-box grid gap-12 pb-12 pt-16 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:pt-20">
        <div>
          <Link href="/" className="block w-[184px]" aria-label={`${settings.name} home`}>
            <Picture img={images.logoLight} sizes="184px" className="h-auto w-full" />
          </Link>
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
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-bronze hover:bg-bronze hover:text-ink"
                  >
                    <Icon className="h-4 w-4 fill-current" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="grid gap-10 sm:grid-cols-2">
          <FooterColumn title="Quick Links" links={settings.footerQuickLinks} />
          <FooterColumn title="Services" links={settings.footerServiceLinks} />
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-box flex flex-col gap-4 py-7 text-[13px] md:flex-row md:items-center md:justify-between">
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
            <a href="#main" className="caps flex items-center gap-3 text-white/75 transition-colors hover:text-white" aria-label="Back to top">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15">
                <ArrowUp className="h-4 w-4" />
              </span>
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
      <h2 className="caps text-gold">{title}</h2>
      <ul className="mt-6 space-y-3">
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
