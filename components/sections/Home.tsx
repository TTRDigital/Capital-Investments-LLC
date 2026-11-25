import type { CSSProperties } from "react";
import Link from "next/link";
import type { ComparisonSection, Img, OfficeMapsSection, Office, TeamCarouselSection, TeamMember } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Carousel } from "@/components/ui/Carousel";
import { Phone, Pin } from "@/components/ui/Icons";
import { CheckMark, PillButton, Reveal, Rule, Section, Title } from "@/components/sections/parts";

const tel = (p: string) => `tel:+1${p.replace(/\D/g, "").slice(-10)}`;

/* ---------- Capital Investment LLC vs other firms ---------- */

function Cross() {
  return (
    <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-muted">
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M7 7l10 10M17 7 7 17" />
      </svg>
    </span>
  );
}

/**
 * Capital Investment LLC vs other firms: our card dark with a gold glow, theirs
 * light and muted, a "VS" badge between them. The points slide in one by one
 * and the ticks pop in as the cards scroll into view.
 */
export function Comparison({ s }: { s: ComparisonSection }) {
  const card = (side: ComparisonSection["ours"], good: boolean) => (
    <Reveal
      className={`relative isolate overflow-hidden rounded-[28px] p-8 md:p-11 ${good ? "bg-ink text-paper shadow-lift" : "border border-line bg-white/50"}`}
    >
      {good ? <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-bronze/30 blur-[90px]" aria-hidden="true" /> : null}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className={`font-serif text-[28px] font-normal leading-tight md:text-[32px] ${good ? "text-paper" : "text-muted"}`}>{side.title}</h3>
        </div>
        <Picture img={side.icon} sizes="44px" className={`h-auto w-10 ${good ? "brightness-0 invert" : "opacity-50 grayscale"}`} />
      </div>
      <ul className="mt-8 text-[15px] leading-[1.6]">
        {side.points.map((p, i) => (
          <li
            key={i}
            style={{ "--d": `${200 + i * 110}ms` } as CSSProperties}
            className={`cmp-row -mx-3 flex items-start gap-4 rounded-xl border-t px-3 py-4 transition-colors first:border-t-0 ${
              good ? "border-white/10 text-white/85 hover:bg-white/[0.05]" : "border-line text-body"
            }`}
          >
            {good ? <CheckMark /> : <Cross />}
            <span className="pt-[3px]">{p}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
  return (
    <Section tone="sand">
      <div className="container-box">
        <Title text={s.heading} />
        <div className="relative mx-auto mt-12 grid max-w-[1080px] items-stretch gap-5 md:mt-16 md:grid-cols-2 md:gap-8">
          {card(s.ours, true)}
          <span
            aria-hidden="true"
            className="cmp-vs absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bronze/40 bg-paper font-serif text-[18px] italic text-copper shadow-card md:flex"
          >
            vs
          </span>
          {card(s.theirs, false)}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Meet the team carousel ---------- */

/** The larger of two photos (the old carousel crops are only ~240px wide; portraits are 470-1200px). */
const sharper = (a?: Img, b?: Img) => (!a ? b : !b ? a : (b.width ?? 0) > (a.width ?? 0) ? b : a);

export function TeamCarousel({ s, team }: { s: TeamCarouselSection; team: TeamMember[] }) {
  const members = s.members.map((m) => ({ ...m, member: team.find((t) => t.slug === m.slug) })).filter((m) => m.member);
  return (
    <Section>
      <div className="container-box">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Title text={s.heading} align="left" />
            <Rule className="mt-8 text-copper" />
          </div>
          {s.button ? <PillButton link={s.button} variant="dark" className="hidden md:inline-flex" /> : null}
        </div>
        <Carousel
          label={s.heading}
          arrows="below"
          counter
          autoplay={0}
          slideClass="w-[78%] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]"
          gapClass="gap-5"
          className="mt-12 md:mt-14"
        >
          {members.map(({ slug, photo, member }) => (
            <Link key={slug} href={`/team/${slug}/`} className="group block">
              <div className="overflow-hidden rounded-[20px] bg-gradient-to-b from-[#e8e1d6] to-[#cfc5b7]">
                <Picture img={sharper(photo, member!.photo)} sizes="(min-width: 1280px) 290px, (min-width: 640px) 45vw, 78vw" className="aspect-[4/5] h-auto w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <h3 className="h-card mt-6 transition-colors group-hover:text-copper">{member!.name}</h3>
              <p className="caps mt-2 text-muted">{member!.role}</p>
            </Link>
          ))}
        </Carousel>
        {s.button ? (
          <div className="mt-8 md:hidden">
            <PillButton link={s.button} variant="dark" />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/* ---------- Office maps (home) ---------- */

export const mapSrc = (q: string, zoom = 13) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=m&z=${zoom}&output=embed&iwloc=near`;

export function OfficeMaps({ s, offices }: { s: OfficeMapsSection; offices: Office[] }) {
  return (
    <Section tone="sand">
      <div className="container-box">
        <Title text={s.heading} />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {offices.map((o) => (
            <Reveal key={o.key} className="card overflow-hidden p-2.5">
              <iframe title={`Map of the ${o.name} office`} src={mapSrc(o.mapQuery)} loading="lazy" className="h-[260px] w-full rounded-[14px] border-0 grayscale-[45%] sepia-[12%] md:h-[320px]" referrerPolicy="no-referrer-when-downgrade" />
              <div className="px-5 pb-6 pt-7 md:px-8 md:pb-8">
                <h3 className="h-sub">{o.label}</h3>
                <p className="mt-3 flex gap-2.5 text-[15px] leading-relaxed">
                  <Pin className="mt-[5px] h-3.5 w-3 shrink-0 text-copper" />
                  {o.longAddress}
                </p>
                {o.phone ? (
                  <a href={tel(o.phone)} className="mt-4 inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.16em] text-ink transition-colors hover:text-copper">
                    <Phone className="h-3 w-3 text-copper" />
                    {o.phone}
                  </a>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
