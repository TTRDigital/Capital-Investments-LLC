import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { ChevronsUp, Facebook, Instagram, LinkedIn } from "@/components/ui/Icons";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const SOCIAL = { linkedin: LinkedIn, facebook: Facebook, instagram: Instagram } as const;
const SOCIAL_LABEL = { linkedin: "LinkedIn", facebook: "Facebook", instagram: "Instagram" } as const;

/**
 * Old site footer: dark building photo in a rounded panel with the logo in a
 * notch (one background image, desktop and phone versions), copper "back to
 * top" tab, three link columns, then the copper copyright bar.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  const offices = settings.contactOffices.map((k) => settings.offices.find((o) => o.key === k)).filter((o) => !!o);
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-[50px] font-dm text-white">
      <div className="relative">
        <div className="absolute inset-0 -z-10 hidden bg-[length:100%_100%] bg-no-repeat md:block" style={{ backgroundImage: `url(${images.footerBg.src})` }} />
        <div className="absolute inset-0 -z-10 bg-[length:100%_100%] bg-no-repeat md:hidden" style={{ backgroundImage: `url(${images.footerBgMobile.src})` }} />
        <Link href="/" className="absolute left-[10px] top-[5px] block w-[180px] md:left-[30px] md:top-[10px] md:w-[223px]" aria-label={`${settings.name} home`}>
          <Picture img={settings.footerLogo} sizes="223px" className="h-auto w-full" />
        </Link>
        <a
          href="#main"
          className="absolute right-[18px] top-0 flex h-[30px] w-[145px] items-center justify-center bg-copper text-white [clip-path:polygon(0_0,100%_0,92%_100%,8%_100%)] md:right-[18px] md:h-[48px] md:w-[170px]"
          aria-label="Back to top"
        >
          <ChevronsUp className="h-[20px] w-[20px] md:h-[26px] md:w-[26px]" />
        </a>
        <div className="mx-auto grid max-w-[1440px] gap-10 px-[20px] pb-[70px] pt-[120px] md:grid-cols-[1fr_auto] md:px-[50px] md:pb-[100px] md:pt-[110px]">
          <div className="text-center md:max-w-[620px] md:text-left">
            <ul className="flex justify-center gap-[13px] md:justify-start">
              {settings.social.map((s) => {
                const Icon = SOCIAL[s.network];
                return (
                  <li key={s.network}>
                    <a href={s.href} target="_blank" rel="noopener" aria-label={`${settings.name} on ${SOCIAL_LABEL[s.network]}`} className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-copper transition-opacity hover:opacity-85">
                      <Icon className="h-[18px] w-[18px] fill-white" />
                    </a>
                  </li>
                );
              })}
            </ul>
            <h2 className="mt-[20px] text-left text-[20px] font-semibold leading-[26px]">Subscribe To Our Newsletter</h2>
            <NewsletterForm consentText={settings.consentText} />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[201px_201px_201px] md:gap-x-[21px] md:pt-[50px]">
            <FooterColumn title="Quick Links" links={settings.footerQuickLinks} />
            <FooterColumn title="Services" links={settings.footerServiceLinks} alignRight />
            <div className="col-span-2 md:col-span-1">
              <h2 className="text-[20px] font-semibold leading-[26px]">Contact Us</h2>
              <ul className="mt-[20px] space-y-[15px] font-sans text-[14px] leading-[23px]">
                {offices.map((o) => (
                  <li key={o.key} className="space-y-[15px]">
                    <p>{o.longAddress}</p>
                    {o.phone ? (
                      <p>
                        <a href={`tel:+1${o.phone.replace(/\D/g, "")}`} className="hover:text-copper">
                          {o.phone}
                        </a>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="-mt-[40px] bg-copper-bar px-5 pb-[50px] pt-[80px] text-center font-sans">
        <p className="text-[18px] font-bold uppercase leading-[1.6]">
          Copyright © {year} | {settings.name} |{" "}
          <Link href="/sitemap/" className="hover:underline">
            Sitemap
          </Link>
        </p>
        <p className="mt-[18px] text-[13px] font-bold uppercase">
          Website by{" "}
          <a href={settings.credit.href} target="_blank" rel="noopener" className="hover:underline">
            {settings.credit.label}
          </a>
        </p>
        <p className="mt-[30px] text-[14px]">
          <Link href="/privacy-policy/" className="underline">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms-of-service/" className="underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, alignRight = false }: { title: string; links: { label: string; href: string }[]; alignRight?: boolean }) {
  return (
    <div className={alignRight ? "text-right md:text-left" : ""}>
      <h2 className="text-[20px] font-semibold leading-[26px]">{title}</h2>
      <ul className="mt-[20px] space-y-[15px] font-sans text-[14px] leading-[23px]">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition-colors hover:text-copper">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
