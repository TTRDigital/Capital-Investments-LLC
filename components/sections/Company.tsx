import Link from "next/link";
import type {
  CareersSection,
  JobsSection,
  LegalSection,
  MarketSliderSection,
  MessageSection,
  Office,
  OfficeCardsSection,
  OfficeListSection,
  Page,
  SitemapListSection,
  SubscribeSection,
  TeamGridSection,
  TeamMember,
} from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { Carousel } from "@/components/ui/Carousel";
import { CheckCircle, Minus, Phone, Pin, Plus } from "@/components/ui/Icons";
import { LeadForm } from "@/components/forms/LeadForm";
import { mapSrc } from "@/components/sections/Home";
import { Body, Reveal, Title } from "@/components/sections/parts";

const tel = (p: string) => `tel:+1${p.replace(/\D/g, "").slice(-10)}`;

/* ---------- Service area: office photo cards ---------- */

export function OfficeCards({ s, offices }: { s: OfficeCardsSection; offices: Office[] }) {
  return (
    <section className="py-[40px] md:py-[60px]">
      <div className="container-box">
        {s.eyebrow ? <p className="text-center font-serif text-[22px] font-bold text-copper md:text-[30px]">{s.eyebrow}</p> : null}
        <Title text={s.heading} font={s.hFont} size="section" className="mt-[5px] md:!text-[36px]" />
        <Reveal className="mx-auto mt-[30px] max-w-[1340px] rounded-[20px] bg-cream p-[10px] md:p-[20px]">
          <ul className="no-scrollbar flex snap-x snap-mandatory gap-[15px] overflow-x-auto md:grid md:grid-cols-2 md:gap-[20px] md:overflow-visible">
            {offices.map((o) => (
              <li key={o.key} className="w-[85%] shrink-0 snap-center rounded-[16px] bg-white p-[15px] md:w-auto">
                <Picture img={o.image} sizes="(min-width: 768px) 620px, 85vw" className="aspect-[1.18] h-auto w-full rounded-[8px] object-cover" />
                <h3 className="mt-[20px] font-serif text-[24px] font-semibold leading-[1.3] text-black md:text-[36px]">{o.name}</h3>
                <p className="mt-[12px] flex gap-[10px] font-sans text-[13px] leading-[1.6] text-black/80">
                  <Pin className="mt-[3px] h-[14px] w-[10px] shrink-0 text-[#555]" />
                  {o.address}
                </p>
                {o.phone ? (
                  <a href={tel(o.phone)} className="mt-[8px] flex items-center gap-[10px] font-sans text-[13px] text-black/80 hover:text-copper">
                    <Phone className="h-[12px] w-[12px] shrink-0 text-[#555]" />
                    {o.phone}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Service area: market slider ---------- */

export function MarketSlider({ s }: { s: MarketSliderSection }) {
  return (
    <section className="py-[40px] md:py-[60px]">
      <div className="container-box">
        <Title text={s.heading} font={s.hFont} size="section" align="left" className="md:!text-[32px]" />
        <Carousel label={s.heading.replace(/\*/g, "")} autoplay={7000} arrows="below" slideClass="w-full" gapClass="gap-0" className="mt-[25px]">
          {s.markets.map((m, i) => (
            <div key={i} className="grid gap-[20px] rounded-[20px] bg-cream p-[20px] md:grid-cols-2 md:gap-[30px] md:p-[30px]">
              <div>
                <h3 className="font-sans text-[20px] font-semibold text-black md:text-[22px]">{m.title}</h3>
                <p className="mt-[12px] font-sans text-[16px] font-semibold text-copper">{m.subtitle}</p>
                <Rich paras={m.text} className="mt-[12px] font-sans text-[13px] leading-[1.85] text-black/80" />
                <h4 className="mt-[20px] font-sans text-[16px] font-semibold text-black">{m.citiesHeading}</h4>
                <ul className="mt-[12px] flex flex-wrap gap-[10px]">
                  {m.cities.map((c, j) => (
                    <li key={j}>
                      {c.href ? (
                        <Link href={c.href} className="block rounded-full bg-white px-[16px] py-[6px] font-sans text-[12px] font-semibold text-copper hover:bg-copper hover:text-white">
                          {c.label}
                        </Link>
                      ) : (
                        <span className="block rounded-full bg-white px-[16px] py-[6px] font-sans text-[12px] font-semibold text-copper">{c.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <Picture img={m.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[16px]" />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
}

/* ---------- Our offices: map + photo per office ---------- */

export function OfficeList({ offices }: { s: OfficeListSection; offices: Office[] }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box space-y-[20px]">
        {offices.map((o) => (
          <Reveal key={o.key} className="grid gap-[20px] md:grid-cols-2">
            <div className="overflow-hidden rounded-[10px] bg-white shadow-[0_0_20px_rgb(0_0_0/0.08)]">
              <iframe title={`Map of the ${o.name} office`} src={mapSrc(o.mapQuery, 15)} loading="lazy" className="h-[200px] w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
              <div className="p-[20px]">
                <h2 className="font-serif text-[26px] font-bold text-black">{o.label}</h2>
                <p className="mt-[10px] flex gap-[10px] font-sans text-[13px] leading-[1.6] text-black/80">
                  <Pin className="mt-[3px] h-[14px] w-[10px] shrink-0 text-[#555]" />
                  {o.address}
                </p>
                {o.phone ? (
                  <a href={tel(o.phone)} className="mt-[12px] inline-flex items-center gap-[8px] rounded-full bg-copper px-[18px] py-[6px] font-sans text-[13px] font-semibold text-white hover:opacity-90">
                    <Phone className="h-[12px] w-[12px]" />
                    {o.phone}
                  </a>
                ) : null}
              </div>
            </div>
            <div className="relative min-h-[260px] overflow-hidden rounded-[10px]">
              <Picture img={o.image} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Our team grid ---------- */

export function TeamGrid({ s, team }: { s: TeamGridSection; team: TeamMember[] }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Title text={s.heading} font={s.hFont} size="section" />
        <span className="mx-auto mt-[20px] block h-px w-[80px] bg-black/40" aria-hidden="true" />
        <ul className="mt-[40px] grid grid-cols-2 gap-x-[20px] gap-y-[30px] md:grid-cols-3 lg:grid-cols-4">
          {team.map((m) => (
            <Reveal as="li" key={m.slug}>
              <Link href={`/team/${m.slug}/`} className="group block text-center">
                <div className="overflow-hidden bg-gradient-to-b from-[#6b6b6b] to-[#bdbdbd]">
                  <Picture img={m.photo} sizes="(min-width: 1024px) 300px, 45vw" className="aspect-[1.25] h-auto w-full object-cover object-top transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h2 className="mt-[12px] font-serif text-[15px] font-bold uppercase text-black group-hover:text-copper md:text-[16px]">{m.name}</h2>
                <p className="mt-[2px] font-sans text-[12px] text-black/60">{m.role}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Careers ---------- */

export function Careers({ s }: { s: CareersSection }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Body paras={s.text} align="left" className="text-[15px] leading-[1.7] text-black md:text-[16px]" />
        <h2 className="mt-[25px] font-serif text-[26px] font-bold text-black md:text-[28px]">{s.heading}</h2>
        <ul className="mt-[20px] space-y-[12px]">
          {s.openings.map((o, i) => (
            <li key={i} className="flex items-center gap-[12px] font-sans text-[14px] text-black">
              <CheckCircle className="h-[16px] w-[16px] shrink-0 text-[#5cb85c]" />
              <Link href={o.href} className="hover:text-copper">
                {o.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Jobs({ s, consentText }: { s: JobsSection; consentText: string }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box grid gap-[40px] md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <h2 className="font-serif text-[26px] font-bold text-black md:text-[28px]">{s.heading}</h2>
          <div className="mt-[20px] space-y-[12px]">
            {s.jobs.map((j, i) => (
              <details key={i} open={i === 0} className="group border-b border-black/10">
                <summary className="flex cursor-pointer items-center gap-[10px] py-[10px] font-sans text-[14px] font-medium text-black">
                  <Plus className="acc-plus h-[10px] w-[10px] shrink-0" />
                  <Minus className="acc-minus h-[10px] w-[10px] shrink-0" />
                  {j.title}
                </summary>
                <Rich paras={j.body} className="pb-[20px] font-sans text-[13px] leading-[1.8] text-black/85" listClass="list-disc pl-[20px]" />
              </details>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-serif text-[26px] font-bold text-black md:text-[28px]">{s.formHeading}</h2>
          <LeadForm kind="careers" consentText={consentText} position={s.jobs[0]?.title} />
        </div>
      </div>
    </section>
  );
}

/* ---------- Forms pages ---------- */

export function ContactFormBlock({ consentText }: { consentText: string }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <div className="mx-auto max-w-[566px]">
          <LeadForm kind="contact" consentText={consentText} />
        </div>
      </div>
    </section>
  );
}

export function Subscribe({ s, consentText }: { s: SubscribeSection; consentText: string }) {
  return (
    <section className="py-[40px] md:py-[60px]">
      <div className="container-box mx-auto max-w-[700px] text-center">
        <Title text={s.heading} font={s.hFont} size="intro" />
        <Body paras={s.text} className="mt-[15px] text-[15px] leading-[1.7] text-black/80" />
        <div className="mx-auto max-w-[520px]">
          <LeadForm kind="subscribe" consentText={consentText} showLabels={false} />
        </div>
      </div>
    </section>
  );
}

export function Message({ s }: { s: MessageSection }) {
  return (
    <section className="py-[60px] md:py-[80px]">
      <div className="container-box mx-auto max-w-[800px] text-center">
        <Title text={s.heading} font={s.hFont} size="intro" />
        <Body paras={s.text} className="mt-[15px] text-[15px] leading-[1.7] text-black/80" />
      </div>
    </section>
  );
}

/* ---------- HTML sitemap (built from the pages list) ---------- */

export function SitemapList({ s, pages }: { s: SitemapListSection; pages: Page[] }) {
  const visible = pages.filter((p) => !p.seo.noIndex && p.path !== "/sitemap/");
  const group = (g: Page["group"]) => visible.filter((p) => p.group === g);
  const item = (p: Page) => (
    <li key={p.path}>
      <Link href={p.path} className="text-copper hover:underline">
        <Inline text={p.title} accentClass="" />
      </Link>
    </li>
  );
  const locations = group("locations");
  const miami = locations.filter((p) => p.path.startsWith("/locations/miami-florida/") && p.path !== "/locations/miami-florida/");
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box font-sans text-[14px] leading-[1.9]">
        <h2 className="font-serif text-[24px] font-bold text-black">{s.heading}</h2>
        <ul className="mt-[10px] space-y-[2px] pl-[22px]">
          {group("company").map(item)}
          <li>
            <Link href="/services/" className="text-copper hover:underline">
              Services
            </Link>
            <ul className="pl-[22px]">{group("services").filter((p) => p.path !== "/services/").map(item)}</ul>
          </li>
          <li>
            <Link href="/locations/" className="text-copper hover:underline">
              Our Locations
            </Link>
            <ul className="pl-[22px]">
              {locations
                .filter((p) => p.path !== "/locations/" && !miami.includes(p))
                .map((p) =>
                  p.path === "/locations/miami-florida/" ? (
                    <li key={p.path}>
                      <Link href={p.path} className="text-copper hover:underline">
                        {p.title}
                      </Link>
                      <ul className="pl-[22px]">{miami.map(item)}</ul>
                    </li>
                  ) : (
                    item(p)
                  ),
                )}
            </ul>
          </li>
          {group("forms").map(item)}
          {group("legal").map(item)}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Privacy policy / terms (no banner on the old site) ---------- */

export function Legal({ s }: { s: LegalSection }) {
  return (
    <section className="bg-white pb-[50px]">
      <div className="h-[70px] bg-night min-[1025px]:h-[112px]" aria-hidden="true" />
      <div className="container-box pt-[40px]">
        <h1 className="font-serif text-[28px] font-bold text-black md:text-[32px]">{s.heading}</h1>
        <Rich paras={s.body} className="mt-[20px] font-sans text-[14px] leading-[1.75] text-black/85" headingClass="!mt-[28px] font-sans text-[20px] font-semibold text-black" listClass="list-disc pl-[22px]" />
      </div>
    </section>
  );
}
