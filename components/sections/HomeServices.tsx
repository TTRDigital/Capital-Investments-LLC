import Link from "next/link";
import type { HomeServicesSection, Img } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal, Rule, Section, Title } from "@/components/sections/parts";

/**
 * A photo for each service, by the page it links to (all are the client's own
 * photos from the service and location pages). The CMS item has no photo
 * field yet, so they are set here; decorative (the title carries the meaning).
 */
const PHOTOS: Record<string, Img> = {
  "/services/investment-sales-and-acquisition-services/": { src: "/images/places/dc-office-tower.webp", alt: "", width: 1218, height: 1118 },
  "/services/valuation-consultation/": { src: "/images/places/richmond-skyline.webp", alt: "", width: 1220, height: 1116 },
  "/services/landlord-and-tenant-representation/": { src: "/images/places/downtown-miami-street.webp", alt: "", width: 1220, height: 1116 },
  "/services/property-management/": { src: "/images/places/maryland-office-building.webp", alt: "", width: 1220, height: 1116 },
  "/services/development-services-and-project-management/": { src: "/images/places/miami-beach-aerial.webp", alt: "", width: 1218, height: 1118 },
};

/**
 * Home "Our Services": each service is a wide photo panel, its number and
 * title on the left and a frosted card with a short summary and "Learn more"
 * on the right. On large screens the panels stack over each other as the
 * page scrolls (sticky), so the section reads one service at a time.
 */
export function HomeServices({ s }: { s: HomeServicesSection }) {
  return (
    <Section id="home-services">
      <div className="container-box">
        <Reveal>
          <Title text={s.heading} align="left" />
          <Rule className="mt-8 text-copper" />
        </Reveal>
        <ol className="mt-12 space-y-5 lg:mt-16 lg:space-y-8">
          {s.items.map((it, i) => {
            const photo = (it.href && PHOTOS[it.href]) || s.image;
            const num = String(i + 1).padStart(2, "0");
            const inner = (
              <>
                <Picture img={photo ? { ...photo, alt: "" } : undefined} fill sizes="(min-width: 1280px) 1200px, 100vw" className="-z-20 object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/15 md:bg-gradient-to-r md:from-ink/85 md:via-ink/45 md:to-ink/20" aria-hidden="true" />
                <div className="flex h-full flex-col justify-end gap-6 p-6 md:flex-row md:items-center md:justify-between md:gap-10 md:p-12 lg:p-14">
                  <div className="max-w-[460px]">
                    <span aria-hidden="true" className="block h-px w-12 bg-gold/70" />
                    <p className="caps mt-5 text-gold" aria-hidden="true">
                      {num} / {String(s.items.length).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-serif text-[28px] font-normal leading-[1.15] text-paper md:text-[34px] lg:text-[40px]">{it.title}</h3>
                  </div>
                  <div className="glass w-full p-5 md:w-[360px] md:shrink-0 md:p-6">
                    <p className="caps text-gold">Our Service</p>
                    <Rich paras={it.text} className="mt-3 line-clamp-3 text-[14px] leading-[1.7] text-white/75" />
                    {it.href ? (
                      <span className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] font-semibold text-paper transition-colors group-hover:border-gold/50">
                        Learn more
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </span>
                    ) : null}
                  </div>
                </div>
              </>
            );
            const cls = "group relative isolate block h-[520px] overflow-hidden rounded-[28px] bg-ink shadow-lift md:h-[440px] lg:h-[460px]";
            return (
              <li key={i} className="lg:sticky" style={{ top: `calc(110px + ${i * 18}px)` }}>
                {it.href ? (
                  <Link href={it.href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <div className={cls}>{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
