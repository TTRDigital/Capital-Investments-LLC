"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { Img, TabsSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";

/** Accessible tabs (arrow keys move between tabs). Panels stay in the HTML for search engines. */
export function TabsClient({ tabs, logo }: { tabs: TabsSection["tabs"]; logo: Img }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = (active + dir + tabs.length) % tabs.length;
    setActive(n);
    document.getElementById(`${id}-tab-${n}`)?.focus();
  };
  return (
    <div className="mt-[30px]">
      <div role="tablist" className="grid grid-cols-2 gap-[10px] md:flex md:justify-between md:gap-[30px]">
        {tabs.map((t, i) => (
          <button
            key={i}
            id={`${id}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
            className={`rounded-[60px] border-2 px-[10px] py-[13px] font-sans text-[14.6px] font-semibold leading-[2] transition-colors md:flex-1 md:py-[26px] md:text-[16px] ${
              i === active ? "border-sand bg-sand text-copper" : "border-[#f3ebe5] bg-white text-black/50 hover:text-copper"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={i}
          id={`${id}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          className="mt-[30px] grid gap-[20px] md:mt-[40px] md:grid-cols-2 md:gap-[35px]"
        >
          <div className="order-2 flex flex-col justify-between gap-[30px] rounded-[16px] bg-white p-[20px] shadow-soft md:order-1 md:p-[37px]">
            <Picture img={logo} sizes="223px" className="h-auto w-[223px] max-md:mx-auto" />
            <div>
              <h3 className="text-center font-serif text-[29px] font-bold capitalize leading-[1.25] text-ink md:text-left md:text-[40px] md:leading-[1.5]">
                <Inline text={t.title} />
              </h3>
              <Rich
                paras={t.text}
                className="mt-[15px] font-sans text-[14px] leading-[1.9] text-ink md:text-[15px] md:leading-[2.1]"
                headingClass="!mt-[18px] font-sans text-[15px] font-semibold text-black"
                listClass="list-disc pl-[18px]"
              />
            </div>
          </div>
          <div className="order-1 rounded-[16px] bg-sand p-[10px] md:order-2 md:p-[15px]">
            <Picture img={t.image} sizes="(min-width: 768px) 45vw, 100vw" className="h-full w-full rounded-[10px] object-cover" />
          </div>
        </div>
      ))}
    </div>
  );
}
