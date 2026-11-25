import type { FounderSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { PillButton, Reveal, Section } from "@/components/sections/parts";

/** About page: the founder on a dark band, portrait beside name, title, bio and a pull quote. */
export function Founder({ s }: { s: FounderSection }) {
  return (
    <Section tone="ink" className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[520px] w-[520px] rounded-full bg-bronze/15 blur-[130px]" aria-hidden="true" />
      <div className="container-box grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        {s.image ? (
          <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-[28px] lg:max-w-none">
            <Picture img={s.image} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-top" />
          </Reveal>
        ) : null}
        <Reveal>
          {s.eyebrow ? <p className="eyebrow eyebrow-rule !text-gold">{s.eyebrow}</p> : null}
          <h2 className="mt-6 font-serif text-[clamp(40px,5vw,68px)] font-normal leading-[1.04] text-paper">{s.name}</h2>
          {s.role ? <p className="caps mt-5 text-gold">{s.role}</p> : null}
          <span aria-hidden="true" className="mt-8 block h-px w-24 bg-gold/50" />
          <Rich paras={s.text} className="mt-8 max-w-[620px] text-[16px] leading-[1.85] text-white/75" />
          {s.quote ? (
            <blockquote className="mt-10 max-w-[620px] border-l border-gold/60 pl-6 font-serif text-[22px] italic leading-[1.45] text-paper md:text-[26px]">{s.quote}</blockquote>
          ) : null}
          {s.button ? (
            <div className="mt-10">
              <PillButton link={s.button} />
            </div>
          ) : null}
        </Reveal>
      </div>
    </Section>
  );
}
