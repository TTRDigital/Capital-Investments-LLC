import Link from "next/link";
import type { ComparisonSection, Img, OfficeMapsSection, Office, StatsSection, TeamCarouselSection, TeamMember } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Carousel } from "@/components/ui/Carousel";
import { Phone, Pin } from "@/components/ui/Icons";
import { CountUp } from "@/components/sections/CountUp";
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

export function Comparison({ s }: { s: ComparisonSection }) {
  const card = (side: ComparisonSection["ours"], good: boolean) => (
    <Reveal className={`rounded-[24px] p-8 md:p-12 ${good ? "bg-white shadow-lift ring-1 ring-bronze/30" : "border border-line bg-transparent"}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className={`h-sub ${good ? "" : "text-muted"}`}>{side.title}</h3>
        <Picture img={side.icon} sizes="44px" className={`h-auto w-10 ${good ? "" : "opacity-60 grayscale"}`} />
      </div>
      <span aria-hidden="true" className={`mt-7 block h-px w-full ${good ? "bg-bronze/40" : "bg-line"}`} />
      <ul className="mt-7 space-y-5 text-[15px] leading-[1.6]">
        {side.points.map((p, i) => (
          <li key={i} className={`flex items-start gap-3.5 ${good ? "text-ink" : "text-body"}`}>
            {good ? <CheckMark /> : <Cross />}
            <span className="pt-px">{p}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
  return (
    <Section tone="sand">
      <div className="container-box">
        <Title text={s.heading} />
        <div className="mx-auto mt-12 grid max-w-[1080px] gap-5 md:mt-14 md:grid-cols-2">
          {card(s.ours, true)}
          {card(s.theirs, false)}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Track record counters ---------- */

export function Stats({ s }: { s: StatsSection }) {
  return (
    <Section tone="ink" className="relative isolate overflow-hidden">
      <div className="container-box">
        <span aria-hidden="true" className="block h-px w-24 bg-gold/60" />
        <h2 className="h-section h-caps mt-8 text-paper">{s.heading}</h2>
        <ul className="mt-14 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-3 md:gap-0">
          {s.items.map((it, i) => (
            <li key={i} className={`md:px-12 ${i === 0 ? "md:pl-0" : "md:border-l md:border-white/10"}`}>
              <h3 className="caps text-gold">{it.label}</h3>
              <p className="mt-5 font-serif text-[64px] font-normal leading-none text-paper md:text-[84px]">
                <CountUp to={it.value} />
                {it.suffix ? <span className="ml-3 font-serif text-[36px] italic text-gold md:text-[44px]">{it.suffix}</span> : null}
              </p>
              {it.caption ? <p className="mt-4 text-[14.5px] text-white/65">{it.caption}</p> : null}
            </li>
          ))}
        </ul>
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
