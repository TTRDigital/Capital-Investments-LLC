import Link from "next/link";
import type { HomeServicesSection } from "@/lib/types";
import { Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal, Rule, Section, Title } from "@/components/sections/parts";

/**
 * Grid spans (6 columns on large screens): rows of three cards, and when two
 * are left over they share the last row, so the grid never ends with a gap.
 * (Tailwind sees these class names in full here, so they are generated.)
 */
function span(i: number, n: number) {
  const md = n % 2 === 1 && i === n - 1 ? "md:col-span-2 " : ""; // two columns on tablets: a last odd card spans both
  const rest = n % 3;
  if (rest === 2 && i >= n - 2) return `${md}lg:col-span-3`;
  if (rest === 1 && i === n - 1) return `${md}lg:col-span-6`;
  return `${md}lg:col-span-2`;
}

/** Home "Our Services": the services as clean cards (swipeable on phones), each linking to its page. */
export function HomeServices({ s }: { s: HomeServicesSection }) {
  const n = s.items.length;
  return (
    <Section id="home-services">
      <div className="container-box">
        <Reveal>
          <Title text={s.heading} align="left" />
          <Rule className="mt-8 text-copper" />
        </Reveal>
        {/* Phones: swipeable cards. Tablets and up: a grid. */}
        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-6 md:mx-0 md:mt-16 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-6">
          {s.items.map((it, i) => {
            const body = (
              <>
                <div className="flex items-center justify-between">
                  <span className="caps text-copper" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {it.href ? (
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-10 font-serif text-[26px] font-normal leading-[1.2] text-ink md:mt-14 md:text-[28px]">{it.title}</h3>
                <span aria-hidden="true" className="mt-6 block h-px w-12 bg-bronze/60 transition-all duration-500 group-hover:w-20" />
                <Rich paras={it.text} className="mt-6 text-[14.5px] leading-[1.8] text-body" />
              </>
            );
            const card = "group flex h-full flex-col rounded-[22px] border border-line bg-white p-7 transition-all duration-300 md:p-9";
            return (
              <Reveal as="li" key={i} className={`w-[84vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none ${span(i, n)}`}>
                {it.href ? (
                  <Link href={it.href} className={`${card} hover:-translate-y-1 hover:border-transparent hover:shadow-lift`}>
                    {body}
                  </Link>
                ) : (
                  <div className={card}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
