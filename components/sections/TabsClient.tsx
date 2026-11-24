"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { TabsSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";

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
      <div role="tablist" className="mx-auto grid max-w-[860px] grid-cols-2 gap-1.5 rounded-[22px] border border-line bg-white p-1.5 shadow-card sm:flex sm:rounded-full">
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
            className={`caps rounded-full px-4 py-3.5 transition-colors sm:flex-1 ${i === active ? "bg-ink text-paper" : "text-body hover:text-ink"}`}
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
          className="relative isolate mt-10 grid overflow-hidden rounded-[28px] bg-ink shadow-lift md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]"
        >
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[440px]">
            <Picture img={t.image} fill sizes="(min-width: 1280px) 520px, (min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
          <div className="relative flex flex-col justify-center p-7 md:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-bronze/20 blur-[100px]" aria-hidden="true" />
            <p className="caps text-gold">{t.label}</p>
            <h3 className="h-sub mt-4 text-paper">
              <Inline text={t.title} accentClass="italic" />
            </h3>
            <span aria-hidden="true" className="mt-7 block h-px w-24 bg-gold/50" />
            <Rich paras={t.text} className="mt-7 text-[15px] leading-[1.85] text-white/75" />
          </div>
        </div>
      ))}
    </div>
  );
}
