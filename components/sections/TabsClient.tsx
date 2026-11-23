"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { TabsSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { ACCENT } from "@/components/sections/parts";

/** Accessible tabs (arrow keys move between tabs). Panels stay in the HTML for search engines. */
export function TabsClient({ tabs }: { tabs: TabsSection["tabs"] }) {
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
    <div className="mt-12">
      <div role="tablist" className="mx-auto grid max-w-[880px] grid-cols-2 gap-1.5 rounded-2xl border border-line bg-white p-1.5 md:flex">
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
            className={`rounded-xl px-4 py-3 text-[14.5px] font-semibold transition-colors md:flex-1 ${i === active ? "bg-ink text-white" : "text-body hover:bg-sand hover:text-ink"}`}
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
          className="mt-8 grid overflow-hidden rounded-2xl border border-line bg-white md:mt-10 md:grid-cols-2"
        >
          <div className="relative min-h-[240px] md:order-2 md:min-h-[420px]">
            <Picture img={t.image} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="p-7 md:order-1 md:p-12">
            <h3 className="h-sub">
              <Inline text={t.title} accentClass={ACCENT} />
            </h3>
            <Rich paras={t.text} className="mt-5 text-[15.5px] leading-[1.75] text-body" headingClass="text-[16px]" />
          </div>
        </div>
      ))}
    </div>
  );
}
