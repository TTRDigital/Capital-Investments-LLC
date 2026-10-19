import Link from "next/link";
import type { ComparisonSection, OfficeMapsSection, Office, StatsSection, TeamCarouselSection, TeamMember } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";

import { Carousel } from "@/components/ui/Carousel";
import { CheckCircle, Pin, Phone, XCircle } from "@/components/ui/Icons";
import { CountUp } from "@/components/sections/CountUp";
import { PillButton, Reveal, Title } from "@/components/sections/parts";

/* ---------- Capital Investment LLC vs other firms ---------- */

export function Comparison({ s }: { s: ComparisonSection }) {
  const card = (side: ComparisonSection["ours"], good: boolean) => (
    <Reveal className={`rounded-[26px] px-[20px] pb-[40px] pt-[25px] md:px-[30px] md:pb-[50px] md:pt-[30px] ${good ? "bg-[rgb(99_186_103/0.1)]" : "bg-[rgb(255_148_148/0.1)]"}`}>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-serif text-[24px] font-bold leading-[1.3] text-black md:text-[38px]">{side.title}</h3>
        <Picture img={side.icon} sizes="48px" className="h-auto w-[40px] md:w-[48px]" />
      </div>
      <ul className="mt-[30px] space-y-[16px] font-sans text-[15px] leading-[1.6] text-black md:text-[16px]">
        {side.points.map((p, i) => (
          <li key={i} className="flex items-start gap-[12px]">
            {good ? <CheckCircle className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#5cb85c]" /> : <XCircle className="mt-[3px] h-[18px] w-[18px] shrink-0 text-[#e53e3e]" />}
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box md:px-[60px]">
        <Title text={s.heading} font={s.hFont} size="panel" />
        <div className="mt-[30px] grid gap-[20px] md:mt-[60px] md:grid-cols-2">
          {card(s.ours, true)}
          {card(s.theirs, false)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Track record counters ---------- */

export function Stats({ s }: { s: StatsSection }) {
  return (
    <section className="px-[10px] py-[10px] md:px-[50px]">
      <Reveal className="relative isolate mx-auto max-w-[1340px] overflow-hidden rounded-[24px] bg-night px-[20px] py-[40px] text-white md:p-[40px]">
        {s.image ? <Picture img={s.image} fill sizes="(min-width: 1440px) 1340px, 100vw" className="-z-10 object-cover" /> : null}
        <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden="true" />
        <div className="flex flex-col items-center gap-[20px] md:flex-row">
          <h2 className="font-sans text-[32px] font-light italic leading-none md:text-[47px]">{s.heading}</h2>
          <span className="h-px w-[33px] bg-white" aria-hidden="true" />
        </div>
        <ul className="mt-[40px] grid gap-[30px] text-center md:grid-cols-3 md:gap-[20px]">
          {s.items.map((it, i) => (
            <li key={i}>
              <h3 className="font-sans text-[20px] font-normal leading-[1.3]">{it.label}</h3>
              <p className="mt-[8px] font-sans text-[48px] font-medium leading-[1.3] text-[#bf7444]">
                <CountUp to={it.value} />
                {it.suffix ? <span className="ml-[12px]">{it.suffix}</span> : null}
              </p>
              {it.caption ? <p className="mt-[4px] font-sans text-[20px] leading-[1.3]">{it.caption}</p> : null}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ---------- Meet the team carousel ---------- */

export function TeamCarousel({ s, team }: { s: TeamCarouselSection; team: TeamMember[] }) {
  const members = s.members.map((m) => ({ ...m, member: team.find((t) => t.slug === m.slug) })).filter((m) => m.member);
  return (
    <section className="py-[40px] md:py-[60px]">
      <div className="container-box">
        <Title text={s.heading} font={s.hFont} size="section" className="md:!text-[52px]" />
        <Carousel label={s.heading} arrows="sides" autoplay={0} slideClass="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] xl:w-[calc(25%-15px)]" gapClass="gap-[20px]" className="mt-[30px] px-[10px] md:mt-[50px]">
          {members.map(({ slug, photo, member }) => (
            <Link key={slug} href={`/team/${slug}/`} className="group block overflow-hidden rounded-[16px] border border-black/[0.11] bg-[linear-gradient(180deg,#5c5c5c_0%,#bdbdbd_100%)] pt-[15px]">
              <Picture img={photo ?? member!.photo} sizes="240px" className="mx-auto h-[243px] w-auto object-contain" />
              <div className="rounded-b-[14px] bg-white px-[10px] py-[25px] text-center">
                <p className="font-sans text-[17px] font-medium leading-[1.3] text-black">{member!.role}</p>
                <h3 className="mt-[10px] font-serif text-[22px] font-semibold uppercase leading-[1.3] text-black transition-colors group-hover:text-copper md:text-[26px]">
                  {member!.name}
                </h3>
              </div>
            </Link>
          ))}
        </Carousel>
        {s.button ? (
          <div className="mt-[30px] text-center">
            <PillButton link={s.button} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Office maps (home) ---------- */

export const mapSrc = (q: string, zoom = 13) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=m&z=${zoom}&output=embed&iwloc=near`;

export function OfficeMaps({ s, offices }: { s: OfficeMapsSection; offices: Office[] }) {
  return (
    <section className="py-[40px] md:py-[60px]">
      <div className="container-box">
        <Title text={s.heading} font={s.hFont} size="section" />
        <div className="mt-[30px] grid gap-[20px] md:grid-cols-2">
          {offices.map((o) => (
            <Reveal key={o.key} className="overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-[0_0_10px_rgb(0_0_0/0.12)]">
              <iframe title={`Map of the ${o.name} office`} src={mapSrc(o.mapQuery)} loading="lazy" className="h-[260px] w-full border-0 md:h-[300px]" referrerPolicy="no-referrer-when-downgrade" />
              <div className="flex items-start justify-between gap-4 p-[20px] md:p-[30px]">
                <div>
                  <div className="flex items-center gap-[12px]">
                    <h3 className="font-serif text-[24px] font-bold text-black md:text-[28px]">{o.label}</h3>
                    <span className="rounded-full bg-[#e8f5e9] px-[10px] py-[2px] font-sans text-[12px] font-semibold text-[#2e7d32]">Open</span>
                  </div>
                  <p className="mt-[12px] flex gap-[10px] font-sans text-[15px] leading-[1.6] text-black/80">
                    <Pin className="mt-[4px] h-[16px] w-[12px] shrink-0 text-copper" />
                    {o.longAddress}
                  </p>
                  {o.phone ? (
                    <a href={`tel:+1${o.phone.replace(/\D/g, "")}`} className="mt-[8px] flex items-center gap-[10px] font-sans text-[15px] text-black/80 hover:text-copper">
                      <Phone className="h-[14px] w-[14px] shrink-0 text-copper" />
                      {o.phone}
                    </a>
                  ) : null}
                </div>
                <Picture img={images.logoMark} sizes="72px" className="h-[50px] w-[50px] shrink-0" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

