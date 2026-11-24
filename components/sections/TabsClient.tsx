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
          className="relative isolate mt-10 overflow-hidden rounded-[28px] bg-ink shadow-lift"
        >
          <Picture img={t.image} fill sizes="(min-width: 1280px) 1200px, 100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_21_29/0.25)_0%,rgb(16_21_29/0.55)_55%,rgb(16_21_29/0.8)_100%)]" aria-hidden="true" />
          <div className="grid min-h-[480px] items-end p-5 pt-56 md:min-h-[540px] md:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-center lg:pt-12">
            <div className="glass p-7 md:p-10 lg:col-start-2">
              <p className="caps text-gold">{t.label}</p>
              <h3 className="h-sub mt-4 text-paper">
                <Inline text={t.title} accentClass="italic" />
              </h3>
              <Rich paras={t.text} className="mt-5 text-[15px] leading-[1.8] text-white/75" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
