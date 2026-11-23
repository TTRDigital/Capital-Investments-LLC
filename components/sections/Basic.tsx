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
import { Inline, Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { ACCENT, Body, CheckMark, LogoMark, PillButton, Reveal, Section, SectionHeader, Title, cols } from "@/components/sections/parts";

/* ---------- Page banner ---------- */

export function Hero({ s, crumbs, headingTag: H = "h1" }: { s: HeroSection; crumbs?: { label: string; href?: string }[]; headingTag?: "h1" | "p" }) {
  const pos = s.position === "top" ? "object-top" : s.position === "bottom" ? "object-bottom" : "object-center";
  const showCrumbs = s.breadcrumbs && !!crumbs?.length;
  return (
    <section data-tone="ink" className="relative isolate flex min-h-[340px] items-end overflow-hidden bg-ink md:min-h-[460px]">
      {s.image ? <Picture img={s.image} fill priority sizes="100vw" className={`-z-20 object-cover ${pos}`} /> : null}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_27_45/0.88)_0%,rgb(16_27_45/0.55)_55%,rgb(16_27_45/0.3)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink/60 to-transparent" aria-hidden="true" />
      <div className="container-box w-full pb-12 pt-24 md:pb-20 md:pt-32">
        {showCrumbs ? (
          <nav aria-label="Breadcrumb" className="mb-5 text-[13.5px] font-medium text-white/70">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {crumbs!.map((c, i) => (
                <li key={i} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-white/40">
                      /
                    </span>
                  ) : null}
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <H className="h-page max-w-[900px] text-white">
          <Inline text={s.heading} accentClass="" />
        </H>
        <span className="mt-6 block h-[3px] w-14 rounded-full bg-copper" aria-hidden="true" />
      </div>
    </section>
  );
}

/* ---------- Image + text (with "Let's Chat") ---------- */

export function Intro({ s }: { s: IntroSection }) {
  const imgLeft = s.imageSide === "left";
  return (
    <Section>
      <div className="container-box grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
        <Reveal className={imgLeft ? "md:order-2" : ""}>
          <Title text={s.heading} align="left" />
          {s.subheading ? <p className="mt-3 font-serif text-[20px] italic leading-snug text-copper md:text-[22px]">{s.subheading}</p> : null}
          <Body paras={s.text} className={`mt-6 ${s.variant === "about" ? "lead" : "text-[16px]"}`} />
          {s.button ? (
            <div className="mt-8">
              <PillButton link={s.button} />
            </div>
          ) : null}
        </Reveal>
        <Reveal className={imgLeft ? "md:order-1" : ""}>
          <Picture img={s.image} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-2xl" />
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Card used by panels and grids ---------- */

function ItemText({ text, className = "" }: { text: string[]; className?: string }) {
  return <Rich paras={text} className={`text-[15px] leading-[1.7] text-body ${className}`} />;
}

function Card({ it }: { it: Item }) {
  return (
    <div className="card group flex h-full flex-col p-6 transition-shadow hover:shadow-card md:p-7">
      <span className="mb-5 block h-[3px] w-8 rounded-full bg-copper" aria-hidden="true" />
      <h3 className="h-card">
        {it.href ? (
          <Link href={it.href} className="transition-colors hover:text-copper">
            {it.title}
          </Link>
        ) : (
          <Inline text={it.title} accentClass={ACCENT} />
        )}
      </h3>
      <ItemText text={it.text} className="mt-3" />
      {it.href ? (
        <Link href={it.href} className="link-arrow mt-auto pt-5 text-[14px]" aria-hidden="true" tabIndex={-1}>
          Learn more <ArrowRight className="h-4 w-4" />
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
          {s.icon ? <LogoMark className="mb-6" /> : null}
          <SectionHeader heading={s.heading} text={s.text} />
        </Reveal>
        {s.image ? (
          <Reveal className="mx-auto mt-12 max-w-[1080px] overflow-hidden rounded-2xl">
            <Picture img={s.image} sizes="(min-width: 1248px) 1080px, 100vw" className="h-auto w-full" />
          </Reveal>
        ) : null}
        {s.subheading ? <h3 className="h-sub mt-14 text-center">{s.subheading}</h3> : null}
        <ul className={`mt-10 grid gap-4 md:mt-12 md:gap-5 ${cols(s.columns, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <Card it={it} />
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
        <ul className={`mx-auto mt-10 grid gap-4 md:mt-12 md:gap-5 ${n === 2 ? "max-w-[960px] md:grid-cols-2" : cols(n, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <Card it={it} />
            </Reveal>
          ))}
        </ul>
        {s.button ? (
          <div className="mt-10 text-center">
            <PillButton link={s.button} />
          </div>
        ) : null}
      </div>
    </Section>
  );
}

/* ---------- Call to action ---------- */

export function Cta({ s }: { s: CtaSection }) {
  return (
    <Section>
      <div className="container-box">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center md:px-16 md:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-copper/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-[760px]">
            <h2 className="h-section text-white">
              <Inline text={s.heading} accentClass="italic text-[#e6b892]" />
            </h2>
            <Rich paras={s.text} className="lead mt-5 text-white/75" />
            <div className="mt-9">
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
          <Rich paras={s.body} className="mt-6 text-[16px] leading-[1.8] text-body" headingClass="text-[19px]" />
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
        <ol className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} className="card relative p-7 md:p-8">
              <span className="absolute right-6 top-6 font-serif text-[15px] italic text-muted" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {it.icon ? <Picture img={it.icon} sizes="80px" className="h-14 w-auto" /> : null}
              <h3 className="h-card mt-6">{it.title}</h3>
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
        <Reveal className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className={s.imageSide === "right" ? "md:order-2" : ""}>
            <Picture img={s.image} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-2xl" />
          </div>
          <SectionHeader heading={s.heading} text={s.text} align="left" />
        </Reveal>
        <ul className={`mt-12 grid gap-4 md:gap-5 ${cols(undefined, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <Card it={it} />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ---------- Why us: text + photo, list of reasons ---------- */

export function WhyList({ s }: { s: WhyListSection }) {
  return (
    <Section>
      <div className="container-box grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <Title text={s.heading} align="left" />
          <Body paras={s.text} className="lead mt-6" />
          {s.image ? <Picture img={s.image} sizes="(min-width: 768px) 45vw, 100vw" className="mt-10 h-auto w-full rounded-2xl" /> : null}
        </Reveal>
        <Reveal>
          {s.listHeading ? <Title text={s.listHeading} as="h3" size="sub" align="left" /> : null}
          <ul className={`divide-y divide-line border-y border-line ${s.listHeading ? "mt-8" : ""}`}>
            {s.items.map((it, i) => (
              <li key={i} className="flex gap-4 py-6">
                <CheckMark className="mt-0.5" />
                <div>
                  <h4 className="h-card text-[17px]">
                    <Inline text={it.title} accentClass={ACCENT} />
                  </h4>
                  <ItemText text={it.text} className="mt-2" />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Alternating rows: text + points, photo ---------- */

function PointList({ items }: { items: Item[] }) {
  return (
    <ul className="mt-6 space-y-5">
      {items.map((it, j) => (
        <li key={j} className="flex gap-4">
          <CheckMark className="mt-0.5" />
          <div>
            <h4 className="text-[16px] font-semibold leading-snug text-ink">
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
          <Reveal className="mb-14 md:mb-20">
            <SectionHeader heading={s.heading} text={s.text} />
          </Reveal>
        ) : null}
        <div className="space-y-16 md:space-y-24">
          {s.rows.map((r, i) => (
            <Reveal key={i} className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
              <div className={r.imageSide === "left" ? "md:order-2" : ""}>
                <Title text={r.heading} as="h3" size="sub" align="left" />
                <Body paras={r.text} className="mt-4 text-[16px]" />
                <PointList items={r.items} />
              </div>
              <div className={r.imageSide === "left" ? "md:order-1" : ""}>
                <Picture img={r.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-2xl" />
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
        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {s.blocks.map((b, i) => (
            <Reveal key={i} className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
              <div className={b.imageSide === "left" ? "md:order-2" : ""}>
                <Title text={b.heading} as="h3" size="sub" align="left" />
                <PointList items={b.items} />
              </div>
              <div className={b.imageSide === "left" ? "md:order-1" : ""}>
                <Picture img={b.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-2xl" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
