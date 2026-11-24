import type { FaqSection, ServiceSliderSection, SliderSection, SplitAccordionSection, TabsSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { Minus, Plus } from "@/components/ui/Icons";
import { ACCENT, Body, CheckMark, LogoMark, PillButton, Reveal, Rule, Section, SectionHeader, Title, cols } from "@/components/sections/parts";
import { TabsClient } from "@/components/sections/TabsClient";

const text = "text-[15px] leading-[1.75] text-body";

/* ---------- Process / checklist cards (were sliders; now every card is visible) ---------- */

export function Slider({ s }: { s: SliderSection }) {
  const check = s.variant === "check";
  return (
    <Section tone={check ? "white" : "sand"}>
      <div className="container-box">
        <Reveal>
          {s.icon ? <LogoMark className="mb-6" /> : null}
          <SectionHeader heading={s.heading} text={s.text} />
        </Reveal>
        <ol className={`mt-14 grid gap-5 md:gap-6 ${cols(undefined, s.items.length)}`}>
          {s.items.map((it, i) => (
            <Reveal as="li" key={i} className="card flex h-full flex-col p-7 md:p-8">
              <span className="flex items-center justify-between" aria-hidden="true">
                <span className="caps text-muted">{String(i + 1).padStart(2, "0")}</span>
                {check ? <CheckMark /> : <span className="h-px w-10 bg-bronze" />}
              </span>
              <h3 className="h-card mt-7">{it.title}</h3>
              <Rich paras={it.text} className={`mt-3 ${text}`} />
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ---------- Photo + accordion ---------- */

export function SplitAccordion({ s }: { s: SplitAccordionSection }) {
  const imgLeft = s.imageSide === "left";
  return (
    <Section>
      <div className="container-box grid items-start gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
        <Reveal className={imgLeft ? "md:order-2" : ""}>
          <Title text={s.heading} align="left" />
          <Rule className="mt-8 text-copper" />
          <Body paras={s.text} className="lead mt-8" />
          {s.button ? (
            <div className="mt-8">
              <PillButton link={s.button} />
            </div>
          ) : null}
          {s.image ? <Picture img={s.image} sizes="(min-width: 768px) 45vw, 100vw" className="mt-12 h-auto w-full rounded-[24px] shadow-lift" /> : null}
        </Reveal>
        <Reveal className={`border-t border-line ${imgLeft ? "md:order-1" : ""}`}>
          {s.items.map((it, i) => (
            <details key={i} name={`acc-${s._key ?? "x"}`} open={i === 0 ? true : undefined} className="group border-b border-line">
              <summary className="flex cursor-pointer items-center gap-5 py-6 text-left">
                <span className="flex-1 font-serif text-[22px] font-medium leading-snug text-ink transition-colors group-hover:text-copper">{it.title}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors group-open:border-ink group-open:bg-ink group-open:text-paper">
                  <Plus className="acc-plus h-3 w-3" />
                  <Minus className="acc-minus h-3 w-3" />
                </span>
              </summary>
              <Rich paras={it.body} className={`pb-6 pr-12 ${text}`} />
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Market tabs (Washington D.C. / Virginia / Maryland / Florida) ---------- */

export function Tabs({ s }: { s: TabsSection }) {
  return (
    <Section tone="sand">
      <div className="container-box">
        <Reveal>
          <SectionHeader heading={s.heading} text={s.text} />
        </Reveal>
        <TabsClient tabs={s.tabs} />
      </div>
    </Section>
  );
}

/* ---------- FAQ ---------- */

export function Faq({ s }: { s: FaqSection }) {
  return (
    <Section>
      <div className="container-box grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="caps text-copper">FAQ</p>
          <Title text={s.heading} align="left" className="mt-5" />
          <Rule className="mt-8 text-copper" />
        </div>
        <Reveal className="border-t border-line">
          {s.items.map((f, i) => (
            <details key={i} open={i === 0 ? true : undefined} className="group border-b border-line">
              <summary className="flex cursor-pointer items-center gap-5 py-6 text-left">
                <span className="flex-1 font-serif text-[22px] font-medium leading-snug text-ink transition-colors group-hover:text-copper">{f.question}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors group-open:border-ink group-open:bg-ink group-open:text-paper">
                  <Plus className="acc-plus h-3 w-3" />
                  <Minus className="acc-minus h-3 w-3" />
                </span>
              </summary>
              <Rich paras={f.answer} className={`pb-6 pr-12 ${text}`} />
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------- Services hub: one row per service ---------- */

export function ServiceSlider({ s }: { s: ServiceSliderSection }) {
  return (
    <Section>
      <div className="container-box">
        <Title text={s.heading} />
        <div className="mt-14 space-y-16 md:mt-20 md:space-y-24">
          {s.slides.map((sl, i) => (
            <Reveal key={i} className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-24">
              <div className={i % 2 ? "md:order-2" : ""}>
                <Picture img={sl.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[24px] shadow-lift" />
              </div>
              <div>
                <p className="caps text-muted" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="h-sub mt-4">{sl.title}</h3>
                <Rich paras={sl.text} className="mt-4 text-[16px] leading-[1.75] text-body" />
                <ul className="mt-6 flex flex-wrap gap-2">
                  {sl.bullets.map((b, j) => (
                    <li key={j} className="rounded-full border border-line bg-white px-4 py-2 text-[13px] font-medium text-ink">
                      <Inline text={b} accentClass={ACCENT} />
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
