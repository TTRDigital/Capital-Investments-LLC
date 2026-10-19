"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { HomeServicesSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { Carousel } from "@/components/ui/Carousel";
import { ArrowLeftLong, ArrowRightLong } from "@/components/ui/Icons";

/**
 * Home "Our Services": a list of the five services next to a card slider.
 * Picking a service moves the slider and the slider moves the list, as before.
 */
export function HomeServices({ s }: { s: HomeServicesSection }) {
  const [active, setActive] = useState(0);
  const [goTo, setGoTo] = useState<number | undefined>(undefined);
  const onIndex = useCallback((i: number) => setActive(i), []);
  const pick = (i: number) => {
    setActive(i);
    setGoTo(i);
  };
  const n = s.items.length;
  return (
    <section className="overflow-hidden py-[50px] md:py-[100px]">
      <div className="container-box grid items-center gap-[30px] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-[20px]">
        <div>
          <h2 className="text-center font-serif text-[24px] font-bold leading-[1.25] text-black md:text-left md:text-[58px] md:leading-[1.07]">
            <Inline text={s.heading} />
          </h2>
          <ul className="mt-[30px] hidden border-t border-black/15 md:mt-[60px] md:block">
            {s.items.map((it, i) => (
              <li key={i} className="border-b border-black/15">
                <button
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={i === active}
                  className={`w-full py-[14px] text-left font-serif text-[22px] font-medium leading-[1.3] transition-colors ${i === active ? "text-black" : "text-black/50 hover:text-black"}`}
                >
                  {it.title}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-[25px] hidden items-center justify-between md:flex">
            <div className="flex gap-[30px] text-black/60">
              <button type="button" onClick={() => pick((active - 1 + n) % n)} aria-label="Previous service" className="hover:text-copper">
                <ArrowLeftLong className="h-[16px] w-[62px]" />
              </button>
              <button type="button" onClick={() => pick((active + 1) % n)} aria-label="Next service" className="hover:text-copper">
                <ArrowRightLong className="h-[16px] w-[62px]" />
              </button>
            </div>
            <ol className="flex gap-[6px]">
              {s.items.map((_, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-label={`Show service ${i + 1}`}
                    className={`flex h-[20px] w-[20px] items-center justify-center rounded-full font-sans text-[11px] text-white ${i === active ? "bg-copper" : "bg-[#d8c2b2]"}`}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="min-w-0">
          <Carousel label="Our services" center goTo={goTo} onIndex={onIndex} slideClass="w-[242px] md:w-[442px]" gapClass="gap-[20px]" className="md:-mr-[50px]">
            {s.items.map((it, i) => (
              <div key={i} className={`my-[20px] rounded-[15px] bg-white shadow-[0_0_34px_0_rgb(209_209_209/0.37)] transition-transform duration-300 md:px-[20px] md:py-[18px] ${i === active ? "md:scale-100" : "md:scale-[0.82]"}`}>
                <Picture img={s.image} sizes="(min-width: 768px) 400px, 242px" className="h-auto w-full rounded-[15px] md:rounded-none" />
                <h3 className="mt-[18px] hidden font-outfit text-[24px] font-semibold leading-[1.3] text-black md:block">
                  {it.href ? <Link href={it.href} className="hover:text-copper">{it.title}</Link> : it.title}
                </h3>
                <Rich paras={it.text} className="mt-[12px] hidden font-dm text-[14px] leading-[1.65] text-black md:block" />
              </div>
            ))}
          </Carousel>
          <div className="md:hidden">
            {s.items.map((it, i) => (
              <div key={i} className="border-b border-black/15">
                <button type="button" onClick={() => pick(i)} aria-expanded={i === active} className={`w-full py-[14px] text-left font-serif text-[18px] font-medium leading-[1.3] ${i === active ? "text-black" : "text-black/50"}`}>
                  {it.title}
                </button>
                {i === active ? <Rich paras={it.text} className="pb-[15px] font-roboto text-[14.6px] leading-[1.65] text-black" /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
