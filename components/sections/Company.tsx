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
  TeamGridSection,
  TeamMember,
} from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { ArrowRight, Minus, Phone, Pin, Plus } from "@/components/ui/Icons";
import { LeadForm } from "@/components/forms/LeadForm";
import { mapSrc } from "@/components/sections/Home";
import { Body, Reveal, Section, SectionHeader, Title } from "@/components/sections/parts";

const tel = (p: string) => `tel:+1${p.replace(/\D/g, "").slice(-10)}`;

function OfficeContact({ o, address }: { o: Office; address: string }) {
  return (
    <>
      <p className="mt-3 flex gap-2.5 text-[15px] leading-relaxed">
        <Pin className="mt-[5px] h-3.5 w-3 shrink-0 text-copper" />
        {address}
      </p>
      {o.phone ? (
        <a href={tel(o.phone)} className="mt-4 inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.16em] text-ink transition-colors hover:text-copper">
          <Phone className="h-3 w-3 text-copper" />
          {o.phone}
        </a>
      ) : null}
    </>
  );
}

/* ---------- Service area: office photo cards ---------- */

export function OfficeCards({ s, offices }: { s: OfficeCardsSection; offices: Office[] }) {
  return (
    <Section>
      <div className="container-box">
        <SectionHeader eyebrow={s.eyebrow} heading={s.heading} />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offices.map((o) => (
            <Reveal as="li" key={o.key} className="card overflow-hidden p-2.5">
              <Picture img={o.image} sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] h-auto w-full rounded-[14px] object-cover" />
              <div className="px-4 pb-5 pt-6">
                <h3 className="h-card">{o.name}</h3>
                <OfficeContact o={o} address={o.address} />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------- Service area: markets (were a slider; now all four are visible) ---------- */

export function MarketSlider({ s }: { s: MarketSliderSection }) {
  return (
    <Section tone="sand">
      <div className="container-box">
        <Title text={s.heading} />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {s.markets.map((m, i) => (
            <Reveal key={i} className="card flex flex-col overflow-hidden p-2.5">
              <Picture img={m.image} sizes="(min-width: 768px) 600px, 100vw" className="aspect-[16/9] h-auto w-full rounded-[14px] object-cover" />
              <div className="flex flex-1 flex-col px-5 pb-6 pt-7 md:px-8 md:pb-8">
                <h3 className="h-sub">{m.title}</h3>
                <p className="caps mt-3 text-copper">{m.subtitle}</p>
                <Rich paras={m.text} className="mt-4 text-[15px] leading-[1.7] text-body" />
                <h4 className="caps mt-7 text-ink">{m.citiesHeading}</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {m.cities.map((c, j) => (
                    <li key={j}>
                      {c.href ? (
                        <Link href={c.href} className="block rounded-full border border-line px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper">
                          {c.label}
                        </Link>
                      ) : (
                        <span className="block rounded-full border border-line px-4 py-2 text-[13px] font-medium text-body">{c.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Our offices: map + photo per office ---------- */

export function OfficeList({ offices }: { s: OfficeListSection; offices: Office[] }) {
  return (
    <Section>
      <div className="container-box space-y-5">
        {offices.map((o) => (
          <Reveal key={o.key} className="card grid gap-2.5 overflow-hidden p-2.5 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,4fr)]">
            <div className="p-5 md:p-8">
              <h2 className="h-sub">{o.label}</h2>
              <OfficeContact o={o} address={o.address} />
            </div>
            <iframe title={`Map of the ${o.name} office`} src={mapSrc(o.mapQuery, 15)} loading="lazy" className="h-[240px] w-full rounded-[14px] border-0 grayscale-[45%] sepia-[12%] md:h-full md:min-h-[280px]" referrerPolicy="no-referrer-when-downgrade" />
            <div className="relative min-h-[240px] overflow-hidden rounded-[14px]">
              <Picture img={o.image} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------- Our team grid ---------- */

export function TeamGrid({ s, team }: { s: TeamGridSection; team: TeamMember[] }) {
  return (
    <Section>
      <div className="container-box">
        <Title text={s.heading} />
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {team.map((m) => (
            <Reveal as="li" key={m.slug}>
              <Link href={`/team/${m.slug}/`} className="group block">
                <div className="overflow-hidden rounded-[20px] bg-gradient-to-b from-[#e8e1d6] to-[#cfc5b7]">
                  <Picture img={m.photo} sizes="(min-width: 1024px) 290px, (min-width: 768px) 30vw, 46vw" className="aspect-[4/5] h-auto w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <h2 className="mt-5 font-serif text-[21px] font-medium leading-snug text-ink transition-colors group-hover:text-copper md:text-[24px]">{m.name}</h2>
                <p className="caps mt-1.5 text-[10.5px] leading-snug text-muted md:text-[11px]">{m.role}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------- Careers ---------- */

export function Careers({ s }: { s: CareersSection }) {
  return (
    <Section>
      <div className="container-box">
        <div className="mx-auto max-w-[820px]">
          <Body paras={s.text} className="lead" />
          <h2 className="h-sub mt-14">{s.heading}</h2>
          <ul className="mt-6 grid gap-3">
            {s.openings.map((o, i) => (
              <li key={i}>
                <Link href={o.href} className="card group flex items-center justify-between gap-4 px-7 py-6 transition-shadow hover:shadow-lift">
                  <span className="font-serif text-[24px] font-medium text-ink transition-colors group-hover:text-copper">{o.label}</span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-[color,transform] group-hover:translate-x-1 group-hover:text-copper" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

export function Jobs({ s, consentText }: { s: JobsSection; consentText: string }) {
  return (
    <Section>
      <div className="container-box grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div>
          <Title text={s.heading} align="left" />
          <div className="mt-8 border-t border-line">
            {s.jobs.map((j, i) => (
              <details key={i} open={i === 0} className="group border-b border-line">
                <summary className="flex cursor-pointer items-center gap-4 py-5">
                  <span className="flex-1 font-serif text-[22px] font-medium leading-snug text-ink transition-colors group-hover:text-copper">{j.title}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors group-open:border-ink group-open:bg-ink group-open:text-paper">
                    <Plus className="acc-plus h-3 w-3" />
                    <Minus className="acc-minus h-3 w-3" />
                  </span>
                </summary>
                <Rich paras={j.body} className="pb-6 text-[15px] leading-[1.75] text-body" headingClass="text-[16px]" />
              </details>
            ))}
          </div>
        </div>
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6 md:p-10">
            <h2 className="h-sub">{s.formHeading}</h2>
            <LeadForm kind="careers" consentText={consentText} position={s.jobs[0]?.title} />
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Contact page ---------- */

export function ContactFormBlock({ consentText, offices = [] }: { consentText: string; offices?: Office[] }) {
  return (
    <Section>
      <div className="container-box grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {offices.length ? (
          <ul className="space-y-8 lg:pt-2">
            {offices.map((o) => (
              <li key={o.key} className="border-t border-line pt-8 first:border-0 first:pt-0">
                <h2 className="h-sub">{o.label}</h2>
                <OfficeContact o={o} address={o.longAddress} />
              </li>
            ))}
          </ul>
        ) : null}
        <div className={`card p-6 md:p-10 ${offices.length ? "" : "mx-auto w-full max-w-[640px] lg:col-span-2"}`}>
          <LeadForm kind="contact" consentText={consentText} />
        </div>
      </div>
    </Section>
  );
}

export function Message({ s }: { s: MessageSection }) {
  return (
    <Section>
      <div className="container-box">
        <SectionHeader heading={s.heading} text={s.text} />
      </div>
    </Section>
  );
}

/* ---------- HTML sitemap (built from the pages list) ---------- */

export function SitemapList({ s, pages }: { s: SitemapListSection; pages: Page[] }) {
  const visible = pages.filter((p) => !p.seo.noIndex && p.path !== "/sitemap/");
  const group = (g: Page["group"]) => visible.filter((p) => p.group === g);
  const link = "text-body transition-colors hover:text-copper";
  const item = (p: Page) => (
    <li key={p.path}>
      <Link href={p.path} className={link}>
        <Inline text={p.title} accentClass="" />
      </Link>
    </li>
  );
  const locations = group("locations");
  const miami = locations.filter((p) => p.path.startsWith("/locations/miami-florida/") && p.path !== "/locations/miami-florida/");
  const head = "text-[13px] font-semibold uppercase tracking-[0.14em] text-ink";
  return (
    <Section>
      <div className="container-box">
        <Title text={s.heading} align="left" />
        <div className="mt-10 grid gap-10 text-[15.5px] leading-[1.6] md:grid-cols-3">
          <div>
            <ul className="space-y-2.5">
              {group("company").map(item)}
              {group("forms").map(item)}
              {group("legal").map(item)}
            </ul>
          </div>
          <div>
            <Link href="/services/" className={head}>
              Services
            </Link>
            <ul className="mt-4 space-y-2.5">{group("services").filter((p) => p.path !== "/services/").map(item)}</ul>
          </div>
          <div>
            <Link href="/locations/" className={head}>
              Our Locations
            </Link>
            <ul className="mt-4 space-y-2.5">
              {locations
                .filter((p) => p.path !== "/locations/" && !miami.includes(p))
                .map((p) =>
                  p.path === "/locations/miami-florida/" ? (
                    <li key={p.path}>
                      <Link href={p.path} className={link}>
                        {p.title}
                      </Link>
                      <ul className="mt-2.5 space-y-2.5 border-l border-line pl-4">{miami.map(item)}</ul>
                    </li>
                  ) : (
                    item(p)
                  ),
                )}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------- Privacy policy / terms ---------- */

export function Legal({ s }: { s: LegalSection }) {
  return (
    <Section className="!pt-14 md:!pt-20">
      <div className="container-box">
        <div className="mx-auto max-w-[820px]">
          <h1 className="h-page">{s.heading}</h1>
          <span className="mt-6 block h-[3px] w-14 rounded-full bg-copper" aria-hidden="true" />
          <Rich paras={s.body} className="mt-10 text-[16px] leading-[1.8] text-body" headingTag="h2" headingClass="text-[20px]" />
        </div>
      </div>
    </Section>
  );
}
