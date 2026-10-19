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
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { Check, DotCircle, DoubleChevron } from "@/components/ui/Icons";
import { Body, PillButton, Reveal, Title, cols } from "@/components/sections/parts";

/* ---------- Page banner ---------- */

export function Hero({ s, crumbs, headingTag: H = "h1" }: { s: HeroSection; crumbs?: { label: string; href?: string }[]; headingTag?: "h1" | "p" }) {
  const left = s.align === "left";
  const pos = s.position === "top" ? "object-top" : s.position === "bottom" ? "object-bottom" : "object-center";
  return (
    <section className="relative isolate flex min-h-[500px] items-end overflow-hidden rounded-b-[24px] bg-night">
      {s.image ? <Picture img={s.image} fill priority sizes="100vw" className={`-z-20 object-cover ${pos}`} /> : null}
      <div className="absolute inset-0 -z-10 bg-black" style={{ opacity: s.overlay ?? 0.4 }} aria-hidden="true" />
      <div className={`container-box w-full pb-[100px] pt-[130px] ${left ? "text-left" : "text-center"}`}>
        <H className={`font-serif font-bold text-white ${left ? "text-[28px] uppercase leading-[1.4] md:text-[40px]" : "text-[32px] leading-[1.4] md:text-[56px] md:leading-[1.3]"}`}>
          <Inline text={s.heading} accentClass="" />
        </H>
        {s.breadcrumbs && crumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mt-[10px] font-sans text-[16px] font-medium text-white">
            <ol className="flex flex-wrap items-center gap-x-[10px]">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-[10px]">
                  {i > 0 ? <span aria-hidden="true">/</span> : null}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-copper">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Image + text (with "Let's Chat") ---------- */

export function Intro({ s }: { s: IntroSection }) {
  const imgLeft = s.imageSide === "left";
  const about = s.variant === "about";
  return (
    <section className={about ? "py-[50px] md:py-[10px]" : "pt-[50px] md:pt-[100px]"}>
      <div className={`container-box grid items-center gap-[20px] ${about ? "md:grid-cols-2 md:gap-[20px] md:px-[60px]" : imgLeft ? "md:grid-cols-[590fr_608fr] md:gap-[80px]" : "md:grid-cols-[608fr_590fr] md:gap-[80px]"}`}>
        <Reveal className={`flex flex-col ${imgLeft ? "md:order-2" : ""} ${about ? "md:pr-[40px]" : ""}`}>
          <Title
            text={s.heading}
            as="h2"
            font={s.hFont}
            accent={s.hAccent}
            size="intro"
            align="left"
            className={about ? "!text-left !text-[26px] md:!text-[44px] md:capitalize" : ""}
          />
          {s.subheading ? <p className="mt-[10px] text-center font-serif text-[20px] font-bold text-copper md:text-left md:text-[24px]">{s.subheading}</p> : null}
          <div className={`mt-[20px] md:hidden ${about ? "order-last" : ""}`}>
            <Picture img={s.image} sizes="100vw" className="h-auto w-full rounded-[20px]" />
          </div>
          <Body
            paras={s.text}
            align="left"
            className={`mt-[20px] ${about ? "!text-left text-[17px] font-medium leading-[1.65] text-black md:text-[24px]" : s.hFont === "sans" ? "text-[14px] leading-[2.7] text-ink/70 md:text-[15px] md:leading-[2.1]" : "text-[14px] leading-[1.75] text-ink md:text-[15px] md:leading-[1.65]"}`}
          />
          {s.button ? (
            <div className="mt-[20px] text-center md:text-left">
              <PillButton link={s.button} />
            </div>
          ) : null}
        </Reveal>
        <Reveal className={`hidden md:block ${imgLeft ? "md:order-1" : ""}`}>
          <Picture img={s.image} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Card used by panels and grids ---------- */

function ItemText({ text, className = "" }: { text: string[]; className?: string }) {
  return <Rich paras={text} className={className} listClass="list-disc pl-[18px] font-system text-[14.6px] leading-[1.65] text-slate" />;
}

function CardBox({ it, icon, tone = "cream" }: { it: Item; icon?: "dot" | "check" | "none"; tone?: "cream" | "white" }) {
  return (
    <div className={`h-full rounded-[10px] p-[20px] md:p-[25px] ${tone === "cream" ? "bg-cream-2" : "bg-white shadow-card"}`}>
      <h3 className="flex items-start gap-[10px] font-roboto text-[18px] font-semibold capitalize leading-[1.3] text-black md:text-[19px]">
        {icon === "dot" ? <DotCircle className="mt-[3px] h-[16px] w-[16px] shrink-0 text-copper" /> : null}
        {icon === "check" ? <Check className="mt-[3px] h-[14px] w-[14px] shrink-0 text-copper" /> : null}
        <span>{it.href ? <Link href={it.href} className="hover:text-copper">{it.title}</Link> : <Inline text={it.title} />}</span>
      </h3>
      <ItemText text={it.text} className={`mt-[12px] font-sans text-[13px] leading-[1.77] text-black ${icon === "dot" ? "md:pl-[26px]" : ""}`} />
    </div>
  );
}

/* ---------- Boxed panel: heading, text, photo, card grid ---------- */

export function Panel({ s }: { s: PanelSection }) {
  return (
    <section className="px-[10px] py-[30px] md:px-[50px] md:py-[50px]">
      <Reveal className="mx-auto max-w-[1340px] rounded-[20px] bg-white px-[10px] py-[30px] shadow-panel md:px-[60px] md:py-[60px]">
        {s.icon ? <Picture img={images.logoMark} sizes="72px" className="mx-auto mb-[20px] h-[72px] w-[72px]" /> : null}
        <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="section" />
        <Body paras={s.text} className="mx-auto mt-[20px] max-w-[920px] text-[14px] leading-[2] text-ink md:text-[16px] md:leading-[1.75]" />
        {s.image ? (
          <div className="mt-[30px] overflow-hidden rounded-[20px] border border-black/[0.06]">
            <Picture img={s.image} sizes="(min-width: 1440px) 1220px, 100vw" className="h-auto w-full" />
          </div>
        ) : null}
        {s.subheading ? <h3 className="mt-[30px] text-center font-serif text-[26px] font-bold text-copper md:text-[36px]">{s.subheading}</h3> : null}
        <ul className={`mt-[30px] grid gap-[15px] px-[10px] md:gap-[20px] md:px-0 ${cols(s.columns, s.items.length)}`}>
          {s.items.map((it, i) => (
            <li key={i}>
              <CardBox it={it} />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ---------- Cards with a heading (location pages) ---------- */

export function CardGrid({ s }: { s: CardGridSection }) {
  const n = s.columns ?? (s.items.length === 4 || s.items.length === 2 ? 2 : 3);
  // Two short cards sit centred; two cards with longer text use the full width (as on the old pages).
  const narrow = n === 2 && s.items.every((it) => it.text.join(" ").length < 90);
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Reveal>
          <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="section" />
          <Body paras={s.text} className="mx-auto mt-[20px] max-w-[1040px] text-[14px] leading-[2] text-black/50 md:text-[15px]" />
        </Reveal>
        <ul className={`mx-auto mt-[30px] grid justify-center gap-[15px] md:gap-[20px] ${n === 2 ? (narrow ? "max-w-[580px] md:grid-cols-2" : "md:grid-cols-2") : cols(n, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <CardBox it={it} icon="dot" />
            </Reveal>
          ))}
        </ul>
        {s.button ? (
          <div className="mt-[30px] text-center">
            <PillButton link={s.button} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Call to action box ---------- */

export function Cta({ s }: { s: CtaSection }) {
  return (
    <section className="px-[10px] py-[50px] md:px-[50px]">
      <Reveal className="mx-auto max-w-[1340px] rounded-[20px] bg-cream-2 px-[20px] pb-[30px] pt-[50px] md:p-[40px]">
        <div className="relative overflow-hidden rounded-[20px] bg-white px-[15px] py-[40px] shadow-[0_0_30px_0_rgb(209_209_209/0.2)] md:px-[120px] md:py-[63px] lg:px-[189px]">
          <div className="pointer-events-none absolute inset-0 hidden bg-contain bg-center bg-no-repeat md:block" style={{ backgroundImage: `url(${images.ctaShapes.src})` }} aria-hidden="true" />
          <div className="relative">
            <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="intro" className="md:!text-[36px]" />
            <Body paras={s.text} className="mx-auto mt-[20px] max-w-[790px] text-[14px] leading-[1.9] text-black md:text-[14px]" />
            <div className="mt-[20px] text-center">
              <PillButton link={s.button} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Long-form text (the old pages' plain content blocks) ---------- */

export function Article({ s }: { s: ArticleSection }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <Reveal className="container-box">
        <h2 className="font-sans text-[24px] font-semibold leading-[1.3] text-[#5fa8d3] md:text-[28px]">
          <Inline text={s.heading} />
        </h2>
        <Rich
          paras={s.body}
          className="mt-[20px] font-sans text-[14px] leading-[1.75] text-black/80"
          headingClass="!mt-[25px] text-[18px] font-semibold text-black md:text-[20px]"
          listClass="list-disc pl-[20px]"
        />
      </Reveal>
    </section>
  );
}

/* ---------- Process steps with illustrations ---------- */

export function Steps({ s }: { s: StepsSection }) {
  return (
    <section className="bg-cream py-[50px]">
      <div className="container-box">
        <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="intro" />
        <ul className="mx-auto mt-[40px] grid max-w-[1100px] gap-[30px] md:grid-cols-3">
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} className="text-center">
              {it.icon ? <Picture img={it.icon} sizes="80px" className="mx-auto h-[60px] w-auto" /> : null}
              <h3 className="mt-[15px] font-roboto text-[20px] font-bold leading-[1.3] text-black">{it.title}</h3>
              <ItemText text={it.text} className="mx-auto mt-[12px] max-w-[300px] font-sans text-[13px] leading-[1.77] text-black/70" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Photo + text on a cream band, cards below ---------- */

export function ImageCards({ s }: { s: ImageCardsSection }) {
  return (
    <section className="bg-cream-2 py-[40px] md:py-[50px]">
      <div className="container-box">
        <Reveal className="grid items-center gap-[20px] md:grid-cols-2 md:gap-[40px]">
          <div className={s.imageSide === "right" ? "md:order-2" : ""}>
            <Picture img={s.image} sizes="(min-width: 768px) 50vw, 100vw" className="h-auto w-full rounded-[21px]" />
          </div>
          <div>
            <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="intro" align="left" />
            <Body paras={s.text} align="left" className="mt-[20px] text-[14px] leading-[1.9] text-black md:text-[15px]" />
          </div>
        </Reveal>
        <ul className={`mt-[30px] grid gap-[15px] md:gap-[20px] ${cols(undefined, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i}>
              <div className="h-full rounded-[10px] bg-white p-[20px] shadow-[0_0_10px_rgb(0_0_0/0.06)] md:p-[30px]">
                <h3 className="font-sans text-[18px] font-bold leading-[1.3] text-ink md:text-[20px]">
                  <Inline text={it.title} />
                </h3>
                <ItemText text={it.text} className="mt-[15px] font-sans text-[13px] leading-[1.77] text-black" />
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Why us: text + photo, list of reasons ---------- */

export function WhyList({ s }: { s: WhyListSection }) {
  return (
    <section className="py-[20px] md:px-[50px] md:py-[20px]">
      <Reveal className="mx-auto grid max-w-[1340px] gap-[20px] rounded-[20px] px-[20px] py-[30px] shadow-[7px_14px_34px_0_rgb(209_209_209/0.25)] md:grid-cols-2 md:gap-[20px] md:px-[35px] md:py-[50px]">
        <div>
          <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="intro" align="left" className="md:!text-[33px]" />
          <Body paras={s.text} align="left" className="mt-[20px] text-[15px] leading-[1.67] text-black/70 md:text-[18px] md:leading-[1.78]" />
          <Picture img={s.image} sizes="(min-width: 768px) 45vw, 100vw" className="mt-[20px] h-auto w-full" />
        </div>
        <div className="rounded-[16px] bg-cream-2 px-[15px] py-[15px] md:px-[35px] md:py-[30px]">
          {s.listHeading ? <Title text={s.listHeading} as="h3" font={s.hFont} size="intro" className="!text-[18px] md:!text-[32px]" /> : null}
          <ul className="mt-[25px] space-y-[15px]">
            {s.items.map((it, i) => (
              <li key={i} className="flex gap-[15px] rounded-[10px] bg-white p-[15px] md:p-[20px]">
                <DoubleChevron className="mt-[4px] h-[18px] w-[18px] shrink-0 text-[#d9b49b]" />
                <div>
                  <h4 className="font-sans text-[17px] font-bold leading-[1.5] text-black md:text-[18px]">
                    <Inline text={it.title} />
                  </h4>
                  <ItemText text={it.text} className="mt-[8px] font-sans text-[15px] leading-[1.55] text-black/60 md:text-[13px] md:leading-[1.77]" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Alternating rows: text + boxed points, photo ---------- */

export function SplitStack({ s }: { s: SplitStackSection }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        {s.heading ? (
          <Reveal className="mb-[40px]">
            <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="section" />
            <Body paras={s.text} className="mx-auto mt-[20px] max-w-[1040px] text-[14px] leading-[1.9] text-black md:text-[15px]" />
          </Reveal>
        ) : null}
        <div className="space-y-[40px] md:space-y-[50px]">
          {s.rows.map((r, i) => (
            <Reveal key={i} className="grid items-center gap-[20px] md:grid-cols-2 md:gap-[20px] md:px-[25px]">
              <div className={r.imageSide === "left" ? "md:order-2" : ""}>
                <Title text={r.heading} as="h3" font={s.hFont} size="intro" align="left" className="md:!text-[24px]" />
                <Body paras={r.text} align="left" className="mt-[12px] text-[13px] leading-[1.77] text-black/60" />
                <ul className="mt-[20px] space-y-[12px]">
                  {r.items.map((it, j) => (
                    <li key={j} className="rounded-[10px] bg-cream-2 p-[15px] md:px-[20px]">
                      <h4 className="font-sans text-[16px] font-semibold leading-[1.4] text-black">
                        <Inline text={it.title} />
                      </h4>
                      <ItemText text={it.text} className="mt-[8px] font-sans text-[13px] leading-[1.77] text-black/80" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className={r.imageSide === "left" ? "md:order-1" : ""}>
                <Picture img={r.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[20px]" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Development page: service blocks with photo and checked points ---------- */

export function ServiceBlocks({ s }: { s: ServiceBlocksSection }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Reveal>
          <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="intro" />
          <Body paras={s.text} className="mx-auto mt-[15px] max-w-[880px] text-[13px] leading-[1.77] text-black" />
        </Reveal>
        <div className="mt-[30px] space-y-[20px]">
          {s.blocks.map((b, i) => (
            <Reveal key={i} className={`grid items-center gap-[20px] rounded-[16px] border border-[#f3e6dc] p-[20px] md:grid-cols-2 md:gap-[30px] ${i % 2 ? "bg-cream-2" : "bg-white"}`}>
              <div className={b.imageSide === "left" ? "md:order-2" : ""}>
                <Title text={b.heading} as="h3" font={s.hFont} size="intro" align="left" className="md:!text-[24px]" />
                <ul className="mt-[20px] space-y-[18px]">
                  {b.items.map((it, j) => (
                    <li key={j}>
                      <h4 className="flex items-center gap-[10px] font-sans text-[15px] font-semibold text-black/70">
                        <Check className="h-[14px] w-[14px] shrink-0 text-copper" />
                        <Inline text={it.title} />
                      </h4>
                      <ItemText text={it.text} className="mt-[6px] pl-[24px] font-sans text-[12px] leading-[1.75] text-black/60" />
                    </li>
                  ))}
                </ul>
              </div>
              <div className={b.imageSide === "left" ? "md:order-1" : ""}>
                <Picture img={b.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[16px]" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
