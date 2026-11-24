"use client";

import Link from "next/link";
import { useState } from "react";
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
 * Home "Our Services" as a photo gallery. Large screens: tall panels side by
 * side; the one hovered or focused opens up and shows its text, the others
 * show only a number and their title. Phones and tablets: swipeable photo cards
 * with the title only (the full text is on each service page).
 */
export function HomeServices({ s }: { s: HomeServicesSection }) {
  const [active, setActive] = useState(0);
  return (
    <Section id="home-services">
      <div className="container-box">
        <Reveal>
          <Title text={s.heading} align="left" />
          <Rule className="mt-8 text-copper" />
        </Reveal>
        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:-mx-10 md:scroll-px-10 md:px-10 lg:mx-0 lg:mt-16 lg:h-[600px] lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0">
          {s.items.map((it, i) => {
            const open = i === active;
            const photo = (it.href && PHOTOS[it.href]) || s.image;
            const num = String(i + 1).padStart(2, "0");
            const inner = (
              <>
                <Picture img={photo ? { ...photo, alt: "" } : undefined} fill sizes="(min-width: 1024px) 50vw, 80vw" className={`-z-20 object-cover transition-transform duration-[1200ms] ease-out ${open ? "lg:scale-100" : "lg:scale-110"}`} />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/5" aria-hidden="true" />
                <div className={`absolute inset-0 -z-10 hidden bg-ink/45 transition-opacity duration-700 lg:block ${open ? "opacity-0" : "opacity-100"}`} aria-hidden="true" />

                {/* Closed panel (large screens): number and a vertical title. */}
                <div className={`pointer-events-none absolute inset-0 hidden flex-col justify-between p-7 transition-opacity duration-500 lg:flex ${open ? "opacity-0" : "opacity-100 delay-200"}`} aria-hidden="true">
                  <span className="caps text-gold">{num}</span>
                  <span className="rotate-180 font-serif text-[22px] leading-none text-paper [writing-mode:vertical-rl]">{it.title}</span>
                </div>

                {/* Open panel, and every card on phones and tablets. */}
                <div className={`absolute inset-x-0 bottom-0 p-7 transition-all duration-500 md:p-9 lg:p-11 ${open ? "lg:translate-y-0 lg:opacity-100 lg:delay-300" : "lg:pointer-events-none lg:translate-y-4 lg:opacity-0"}`}>
                  <span className="caps text-gold" aria-hidden="true">
                    {num}
                  </span>
                  <h3 className="mt-4 max-w-[460px] font-serif text-[26px] font-normal leading-[1.15] text-paper md:text-[30px] lg:text-[36px]">{it.title}</h3>
                  <Rich paras={it.text} className="mt-4 hidden max-w-[460px] text-[14.5px] leading-[1.75] text-white/75 lg:line-clamp-3" />
                  {it.href ? (
                    <span className="caps mt-7 inline-flex items-center gap-3 text-paper">
                      Learn more
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </span>
                  ) : null}
                </div>
              </>
            );
            const cls = "group relative isolate block h-full overflow-hidden rounded-[24px] bg-ink";
            return (
              <li
                key={i}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`aspect-[3/4] w-[78vw] max-w-[360px] shrink-0 snap-start transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] lg:aspect-auto lg:w-auto lg:min-w-0 lg:max-w-none lg:shrink lg:basis-0 ${open ? "lg:grow-[4]" : "lg:grow"}`}
              >
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
        </ul>
      </div>
    </Section>
  );
}
