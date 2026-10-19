import type { FaqSection, ServiceSliderSection, SliderSection, SplitAccordionSection, TabsSection } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { Carousel } from "@/components/ui/Carousel";
import { CheckCircle, MinusSquare, Plus, Minus, PlusSquare } from "@/components/ui/Icons";
import { Body, PillButton, Reveal, Title } from "@/components/sections/parts";
import { TabsClient } from "@/components/sections/TabsClient";

const list = "list-disc pl-[18px] font-system text-[14.6px] leading-[1.65] text-slate";

/* ---------- Card sliders ---------- */

export function Slider({ s }: { s: SliderSection }) {
  if (s.variant === "check") {
    return (
      <section className="px-[10px] py-[30px] md:px-[50px] md:py-[50px]">
        <Reveal className="mx-auto max-w-[1340px] rounded-[20px] bg-white px-0 py-[30px] shadow-panel md:px-[60px] md:py-[60px]">
          <div className="px-[10px] md:px-0">
            <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="section" />
            <Body paras={s.text} className="mx-auto mt-[20px] max-w-[1040px] text-[14px] leading-[2] text-black/70 md:text-[15px]" />
          </div>
          <Carousel
            label={s.heading.replace(/\*/g, "")}
            autoplay={5000}
            dots
            slideClass="w-[250px] md:w-[540px]"
            gapClass="gap-[20px]"
            trackClass="px-[60px] scroll-px-[60px] py-[20px] md:px-[60px] md:scroll-px-[60px]"
            className="mt-[10px]"
          >
            {s.items.map((it, i) => (
              <div key={i} className="h-full rounded-[24px] bg-white p-[20px] shadow-card">
                <h3 className="flex items-start justify-center gap-[10px] text-center font-roboto text-[21px] font-semibold leading-[1.43] text-black md:justify-start md:text-left">
                  <CheckCircle className="mt-[5px] h-[20px] w-[20px] shrink-0 text-copper" />
                  <span>{it.title}</span>
                </h3>
                <Rich paras={it.text} className="mt-[10px] text-center font-sans text-[16px] font-medium leading-[1.56] text-[#515151] md:pl-[33px] md:text-left" listClass={`${list} md:text-[16px]`} />
              </div>
            ))}
          </Carousel>
        </Reveal>
      </section>
    );
  }
  return (
    <section className="bg-cream py-[50px]">
      <Reveal className="container-box">
        {s.icon ? <Picture img={images.logoMark} sizes="72px" className="mx-auto mb-[20px] h-[72px] w-[72px]" /> : null}
        <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="display" />
        <Body paras={s.text} className="mx-auto mt-[20px] max-w-[922px] text-[14px] leading-[2] text-ink md:text-[18px] md:leading-[1.56]" />
      </Reveal>
      <Carousel
        label={s.heading.replace(/\*/g, "")}
        autoplay={5000}
        slideClass="w-[250px] md:w-[640px]"
        gapClass="gap-[20px]"
        trackClass="px-[70px] scroll-px-[70px]"
        className="mt-[30px] md:mt-[40px]"
      >
        {s.items.map((it, i) => (
          <div key={i} className="h-full rounded-[24px] bg-white px-[20px] py-[20px] md:px-[60px]">
            <h3 className={`text-center text-[14px] font-bold capitalize leading-[1.7] text-ink md:text-left md:text-[28px] md:leading-[1.18] ${s.hFont === "sans" ? "font-roboto" : "font-serif"}`}>{it.title}</h3>
            <Rich paras={it.text} className="mt-[12px] text-center font-sans text-[13px] leading-[1.77] text-[#637381] md:text-left md:text-[18px] md:leading-[1.67]" listClass={list} />
          </div>
        ))}
      </Carousel>
    </section>
  );
}

/* ---------- Photo + accordion ---------- */

export function SplitAccordion({ s }: { s: SplitAccordionSection }) {
  const imgLeft = s.imageSide === "left";
  if (s.style === "pill") {
    // Investment sales page: boxed row, heading/text/accordion beside a photo.
    return (
      <section className="px-[10px] md:px-[50px]">
        <Reveal className="mx-auto grid max-w-[1340px] items-start gap-[20px] bg-white py-[20px] md:grid-cols-2 md:gap-[40px] md:p-[40px]">
          <div className={imgLeft ? "md:order-2" : ""}>
            <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="panel" align="left" className="max-md:!text-[24px]" />
            <div className="mt-[20px] md:hidden">
              <Picture img={s.image} sizes="100vw" className="h-auto w-full rounded-[25px]" />
            </div>
            <Body paras={s.text} align="left" className="mt-[20px] text-[14px] leading-[1.65] text-black/60 md:text-[23px]" />
            <div className="mt-[30px] space-y-[20px]">
              {s.items.map((it, i) => (
                <details key={i} className="group rounded-[8px] border-l-[3px] border-copper bg-cream-2">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-[15px] py-[12px] font-system text-[14.6px] font-semibold leading-[1.65] text-black md:text-[16px]">
                    <span>{it.title}</span>
                  </summary>
                  <Rich paras={it.body} className="px-[15px] pb-[15px] font-system text-[14.6px] leading-[1.65] text-slate" listClass="list-none space-y-[10px] pl-0" />
                </details>
              ))}
            </div>
            {s.button ? <PillButton link={s.button} className="mt-[20px]" /> : null}
          </div>
          <div className={`hidden md:block ${imgLeft ? "md:order-1" : ""}`}>
            <Picture img={s.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[25px]" />
          </div>
        </Reveal>
      </section>
    );
  }
  // Location pages: centred heading, photo beside a checked accordion.
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Reveal>
          <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="section" />
          <Body paras={s.text} className="mx-auto mt-[15px] max-w-[1040px] text-[13px] leading-[1.77] text-black" />
        </Reveal>
        <Reveal className="mt-[30px] grid items-start gap-[25px] md:grid-cols-2 md:gap-[30px]">
          <Picture img={s.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-auto w-full rounded-[16px]" />
          <div className="space-y-[14px] md:pt-[10px]">
            {s.items.map((it, i) => (
              <details key={i} name={`acc-${s._key ?? "x"}`} className="group">
                <summary className="flex cursor-pointer items-center gap-[15px] py-[6px] font-outfit text-[16px] font-semibold text-black md:text-[19px]">
                  <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#f3e3d8] md:h-[38px] md:w-[38px]">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[16px] w-[16px] text-copper" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  <span className="flex-1">{it.title}</span>
                  <Plus className="acc-plus h-[12px] w-[12px] text-black" />
                  <Minus className="acc-minus h-[12px] w-[12px] text-black" />
                </summary>
                <Rich paras={it.body} className="pb-[10px] pl-[47px] font-sans text-[14px] leading-[1.77] text-black/70 md:pl-[53px]" listClass="list-disc pl-[18px]" />
              </details>
            ))}
          </div>
        </Reveal>
        {s.button ? (
          <div className="mt-[30px] text-center">
            <PillButton link={s.button} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Market tabs (Washington D.C. / Virginia / Maryland / Florida) ---------- */

export function Tabs({ s }: { s: TabsSection }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Reveal>
          <Title text={s.heading} font={s.hFont} accent={s.hAccent} size="display" className="md:!font-semibold" />
          <Body paras={s.text} className="mx-auto mt-[20px] max-w-[1040px] text-[14px] leading-[1.9] text-black md:text-[15px]" />
        </Reveal>
        <TabsClient tabs={s.tabs} logo={images.logoDark} />
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

export function Faq({ s }: { s: FaqSection }) {
  const half = Math.ceil(s.items.length / 2);
  const columns = [s.items.slice(0, half), s.items.slice(half)];
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Title text={s.heading} font={s.hFont} size="section" />
        <Reveal className="mt-[40px] grid gap-[15px] rounded-[20px] bg-white p-[15px] shadow-[0_0_34px_0_rgb(209_209_209/0.71)] md:grid-cols-2 md:gap-[40px] md:p-[40px]">
          {columns.map((col, c) => (
            <div key={c} className="space-y-[15px]">
              {col.map((f, i) => (
                <details key={i} open={i === 0 ? true : undefined} className="group rounded-[10px] bg-cream-2">
                  <summary className="flex cursor-pointer items-center justify-between gap-3 px-[15px] py-[15px] font-system text-[13px] font-medium text-[#1f2124] md:px-[30px] md:py-[21px] md:text-[16px]">
                    <span>{f.question}</span>
                    <PlusSquare className="acc-plus h-[16px] w-[16px] shrink-0 text-[#d5b49e]" />
                    <MinusSquare className="acc-minus h-[16px] w-[16px] shrink-0 text-copper" />
                  </summary>
                  <Rich paras={f.answer} className="px-[15px] pb-[20px] font-sans text-[13px] leading-[1.75] text-black/80 md:px-[30px] md:pb-[30px] md:text-[14px]" listClass="list-disc pl-[18px]" />
                </details>
              ))}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Services hub slider ---------- */

export function ServiceSlider({ s }: { s: ServiceSliderSection }) {
  return (
    <section className="py-[40px] md:py-[50px]">
      <div className="container-box">
        <Title text={s.heading} font={s.hFont} size="section" align="left" className="!text-left" />
        <Reveal className="mt-[30px] rounded-[20px] bg-white py-[20px] shadow-[0_0_65px_0_rgb(0_0_0/0.05)] md:px-[10px]">
          <Carousel label={s.heading.replace(/\*/g, "")} autoplay={7000} arrows="below" slideClass="w-full" gapClass="gap-0">
            {s.slides.map((sl, i) => (
              <div key={i} className="grid gap-[20px] px-[15px] md:grid-cols-2 md:gap-[40px] md:px-[40px] md:py-[30px]">
                <div>
                  <h3 className="font-roboto text-[22px] font-semibold capitalize leading-[1.3] text-black md:text-[30px]">{sl.title}</h3>
                  <Rich paras={sl.text} className="mt-[20px] font-sans text-[14px] leading-[1.9] text-ink md:text-[16px]" />
                  <ul className="mt-[20px] space-y-[10px]">
                    {sl.bullets.map((b, j) => (
                      <li key={j} className="rounded-[5px] bg-cream px-[15px] py-[8px] font-sans text-[12px] leading-[1.6] text-copper">
                        <Inline text={b} />
                      </li>
                    ))}
                  </ul>
                </div>
                <Picture img={sl.image} sizes="(min-width: 768px) 45vw, 100vw" className="order-first h-auto w-full md:order-none" />
              </div>
            ))}
          </Carousel>
        </Reveal>
      </div>
    </section>
  );
}
