import type {
  ArticleSection,
  CardGridSection,
  CtaSection,
  HeroSection,
  ImageCardsSection,
  IntroSection,
  Item,
  PanelSection,
  ServiceBlocksSection,
  SplitStackSection,
  StepsSection,
  WhyListSection,
} from "@/lib/types";
import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich, plain } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { ACCENT, Body, CheckMark, LogoMark, PillButton, Reveal, Rule, Section, SectionHeader, Title, cols } from "@/components/sections/parts";

const num = (i: number) => String(i + 1).padStart(2, "0");

/* ---------- Page banner ---------- */

export function Hero({ s, crumbs, headingTag: H = "h1" }: { s: HeroSection; crumbs?: { label: string; href?: string }[]; headingTag?: "h1" | "p" }) {
  const pos = s.position === "top" ? "object-top" : s.position === "bottom" ? "object-bottom" : "object-center";
  const showCrumbs = s.breadcrumbs && !!crumbs?.length;
  return (
    <section data-tone="ink" className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-ink md:min-h-[600px]">
      {s.image ? <Picture img={s.image} fill priority sizes="100vw" className={`-z-20 object-cover ${pos}`} /> : null}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_21_29/0.86)_0%,rgb(16_21_29/0.5)_55%,rgb(16_21_29/0.2)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-ink/75 to-transparent" aria-hidden="true" />
      <div className="container-box w-full pb-14 pt-28 md:pb-24 md:pt-40">
        {showCrumbs ? (
          <nav aria-label="Breadcrumb" className="caps mb-7 text-white/60">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {crumbs!.map((c, i) => (
                <li key={i} className="flex items-center gap-3">
                  {i > 0 ? <span aria-hidden="true" className="h-px w-5 bg-white/35" /> : null}
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-gold">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-gold">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <H className="h-page max-w-[960px] text-paper">
          <Inline text={s.heading} accentClass="italic" />
        </H>
        <Rule className="mt-8 text-paper" />
      </div>
    </section>
  );
}

/* ---------- Image + text (with "Let's Chat") ---------- */

export function Intro({ s }: { s: IntroSection }) {
  const imgLeft = s.imageSide === "left";
  return (
    <Section>
      <div className="container-box grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-28">
        <Reveal className={imgLeft ? "md:order-2" : ""}>
          <Title text={s.heading} align="left" />
          {s.subheading ? <p className="mt-4 font-serif text-[22px] italic leading-snug text-copper md:text-[26px]">{s.subheading}</p> : null}
          <Rule className="mt-8 text-copper" />
          <Body paras={s.text} className={`mt-8 ${s.variant === "about" ? "lead" : "text-[16px]"}`} />
          {s.button ? (
            <div className="mt-10">
              <PillButton link={s.button} />
            </div>
          ) : null}
        </Reveal>
        <Reveal className={`relative ${imgLeft ? "md:order-1" : ""}`}>
          <Picture img={s.image} sizes="(min-width: 768px) 50vw, 100vw" className="relative h-auto w-full rounded-[24px] shadow-lift" />
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Card used by panels and grids ---------- */

function ItemText({ text, className = "" }: { text: string[]; className?: string }) {
  return <Rich paras={text} className={`text-[15px] leading-[1.75] text-body ${className}`} />;
}

function Card({ it, i }: { it: Item; i: number }) {
  return (
    <div className="card group flex h-full flex-col p-7 transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-lift md:p-8">
      <span className="caps flex items-center gap-3 text-muted" aria-hidden="true">
        {num(i)}
        <span className="h-px w-8 bg-line" />
      </span>
      <h3 className="h-card mt-6">
        {it.href ? (
          <Link href={it.href} className="transition-colors hover:text-copper">
            {it.title}
          </Link>
        ) : (
          <Inline text={it.title} accentClass={ACCENT} />
        )}
      </h3>
      <ItemText text={it.text} className="mt-4" />
      {it.href ? (
        <Link href={it.href} className="link-arrow mt-auto pt-6" aria-hidden="true" tabIndex={-1}>
          Learn more <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

/* ---------- Panel: heading, text, photo, card grid ---------- */

export function Panel({ s }: { s: PanelSection }) {
  return (
    <Section tone="sand">
      <div className="container-box">
        <Reveal>
          {s.icon ? <LogoMark className="mb-8" /> : null}
          <SectionHeader heading={s.heading} text={s.text} />
        </Reveal>
        {s.image ? (
          <Reveal className="mx-auto mt-14 max-w-[1100px] overflow-hidden rounded-[24px] shadow-card">
            <Picture img={s.image} sizes="(min-width: 1280px) 1100px, 100vw" className="h-auto w-full" />
          </Reveal>
        ) : null}
        {s.subheading ? <h3 className="h-sub mt-16 text-center">{s.subheading}</h3> : null}
        <ul className={`mt-12 grid gap-5 md:mt-14 md:gap-6 ${cols(s.columns, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <Card it={it} i={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------- Cards with a heading (location pages) ---------- */

export function CardGrid({ s }: { s: CardGridSection }) {
  const n = s.columns ?? (s.items.length === 4 || s.items.length === 2 ? 2 : 3);
  return (
    <Section>
      <div className="container-box">
        <Reveal>
          <SectionHeader heading={s.heading} text={s.text} />
        </Reveal>
        <ul className={`mx-auto mt-12 grid gap-5 md:mt-14 md:gap-6 ${n === 2 ? "max-w-[1000px] md:grid-cols-2" : cols(n, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <Card it={it} i={i} />
            </Reveal>
          ))}
        </ul>
        {s.button ? (
          <div className="mt-12 text-center">
            <PillButton link={s.button} />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/* ---------- Call to action: a dark banner ---------- */

export function Cta({ s }: { s: CtaSection }) {
  const caps = plain(s.heading).length <= 34;
  return (
    <Section>
      <div className="container-box">
        <Reveal className="relative isolate overflow-hidden rounded-[28px] bg-ink px-7 py-14 md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[460px] w-[460px] rounded-full bg-bronze/30 blur-[110px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-48 left-1/4 -z-10 h-[380px] w-[380px] rounded-full bg-[#3a4a63]/40 blur-[110px]" aria-hidden="true" />
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,8fr)_auto] lg:gap-16">
            <div className="max-w-[780px]">
              <h2 className={`h-section text-paper ${caps ? "h-caps" : ""}`}>
                <Inline text={s.heading} accentClass="italic text-gold" />
              </h2>
              <Rich paras={s.text} className="lead mt-6 text-white/70" />
            </div>
            <div>
              <PillButton link={s.button} />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Long-form text ---------- */

export function Article({ s }: { s: ArticleSection }) {
  return (
    <Section>
      <Reveal className="container-box">
        <div className="mx-auto max-w-[820px]">
          <Title text={s.heading} align="left" size="sub" />
          <Rule className="mt-7 text-copper" />
          <Rich paras={s.body} className="mt-8 text-[16px] leading-[1.85] text-body" />
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------- Process steps with illustrations ---------- */

export function Steps({ s }: { s: StepsSection }) {
  return (
    <Section tone="sand">
      <div className="container-box">
        <SectionHeader heading={s.heading} text={s.text} />
        <ol className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} className="card relative p-8">
              <span className="caps absolute right-7 top-7 text-muted" aria-hidden="true">
                {num(i)}
              </span>
              {it.icon ? <Picture img={it.icon} sizes="80px" className="h-14 w-auto" /> : null}
              <h3 className="h-card mt-7">{it.title}</h3>
              <ItemText text={it.text} className="mt-3" />
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ---------- Photo + text, cards below ---------- */

export function ImageCards({ s }: { s: ImageCardsSection }) {
  return (
    <Section tone="sand">
      <div className="container-box">
        <Reveal className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className={s.imageSide === "right" ? "md:order-2" : ""}>
            <Picture img={s.image} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-[24px] shadow-lift" />
          </div>
          <SectionHeader heading={s.heading} text={s.text} align="left" />
        </Reveal>
        <ul className={`mt-14 grid gap-5 md:gap-6 ${cols(undefined, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <Card it={it} i={i} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------- Why us: a photo panel with the reasons in a frosted glass card ---------- */

export function WhyList({ s }: { s: WhyListSection }) {
  return (
    <Section>
      <div className="container-box">
        <Reveal className="relative isolate overflow-hidden rounded-[28px] bg-ink shadow-lift">
          {/* Phones: the photo is a band on top (a full-height background would crop and blur it). Desktop: background. */}
          {s.image ? (
            <div className="relative aspect-[16/10] lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
              <Picture img={s.image} fill sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent lg:hidden" aria-hidden="true" />
            </div>
          ) : null}
          <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgb(16_21_29/0.9)_0%,rgb(16_21_29/0.66)_48%,rgb(16_21_29/0.4)_100%)] lg:block" aria-hidden="true" />
          <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16 lg:p-16">
            <div className="lg:self-center">
              <Rule className="mb-8 text-gold" />
              <h2 className="h-section text-paper">
                <Inline text={s.heading} accentClass="italic text-gold" />
              </h2>
              <Rich paras={s.text} className="lead mt-6 text-white/75" />
            </div>
            <div className="glass p-6 md:p-9">
              {s.listHeading ? (
                <h3 className="caps text-gold">
                  <Inline text={s.listHeading} accentClass="" />
                </h3>
              ) : null}
              <ul className={`divide-y divide-white/10 ${s.listHeading ? "mt-5" : ""}`}>
                {s.items.map((it, i) => (
                  <li key={i} className="flex gap-4 py-5 first:pt-2 last:pb-0">
                    <CheckMark className="mt-1" />
                    <div>
                      <h4 className="font-serif text-[21px] font-medium leading-snug text-paper">
                        <Inline text={it.title} accentClass="italic" />
                      </h4>
                      <Rich paras={it.text} className="mt-1.5 text-[14.5px] leading-[1.7] text-white/65" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Alternating rows: text + points, photo ---------- */

function PointList({ items }: { items: Item[] }) {
  return (
    <ul className="mt-8 divide-y divide-line border-y border-line">
      {items.map((it, j) => (
        <li key={j} className="flex gap-4 py-5">
          <CheckMark className="mt-1" />
          <div>
            <h4 className="font-serif text-[21px] font-medium leading-snug text-ink">
              <Inline text={it.title} accentClass={ACCENT} />
            </h4>
            <ItemText text={it.text} className="mt-1.5" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SplitStack({ s }: { s: SplitStackSection }) {
  return (
    <Section>
      <div className="container-box">
        {s.heading ? (
          <Reveal className="mb-16 md:mb-24">
            <SectionHeader heading={s.heading} text={s.text} />
          </Reveal>
        ) : null}
        <div className="space-y-20 md:space-y-32">
          {s.rows.map((r, i) => (
            <Reveal key={i} className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-28">
              <div className={r.imageSide === "left" ? "md:order-2" : ""}>
                <p className="caps text-muted" aria-hidden="true">
                  {num(i)}
                </p>
                <Title text={r.heading} as="h3" size="sub" align="left" className="mt-4" />
                <Body paras={r.text} className="mt-5 text-[16px]" />
                <PointList items={r.items} />
              </div>
              <div className={r.imageSide === "left" ? "md:order-1" : ""}>
                <Picture img={r.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[24px] shadow-lift" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------- Development page: service blocks with photo and checked points ---------- */

export function ServiceBlocks({ s }: { s: ServiceBlocksSection }) {
  return (
    <Section>
      <div className="container-box">
        <Reveal>
          <SectionHeader heading={s.heading} text={s.text} />
        </Reveal>
        <div className="mt-16 space-y-20 md:mt-24 md:space-y-32">
          {s.blocks.map((b, i) => (
            <Reveal key={i} className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-28">
              <div className={b.imageSide === "left" ? "md:order-2" : ""}>
                <p className="caps text-muted" aria-hidden="true">
                  {num(i)}
                </p>
                <Title text={b.heading} as="h3" size="sub" align="left" className="mt-4" />
                <PointList items={b.items} />
              </div>
              <div className={b.imageSide === "left" ? "md:order-1" : ""}>
                <Picture img={b.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[24px] shadow-lift" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
