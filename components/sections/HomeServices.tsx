import Link from "next/link";
import type { HomeServicesSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal, Rule, Section, Title } from "@/components/sections/parts";

/** Home "Our Services": the five services as numbered rows next to the photo. */
export function HomeServices({ s }: { s: HomeServicesSection }) {
  return (
    <Section id="home-services">
      <div className="container-box grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-28">
        <Reveal className="md:sticky md:top-32 md:self-start">
          <Title text={s.heading} align="left" />
          <Rule className="mt-8 text-copper" />
          {s.image ? (
            <div className="relative mt-12 hidden md:block">
              <span aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full rounded-[24px] border border-bronze/40" />
              <Picture img={s.image} sizes="(min-width: 768px) 40vw, 100vw" className="relative h-auto w-full rounded-[24px] shadow-lift" />
            </div>
          ) : null}
        </Reveal>
        <Reveal as="div">
          <ol className="border-t border-line">
            {s.items.map((it, i) => {
              const body = (
                <>
                  <span className="caps pt-3 text-muted" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="h-sub transition-colors group-hover:text-copper">{it.title}</h3>
                    <Rich paras={it.text} className="mt-4 text-[15px] leading-[1.8] text-body" />
                  </div>
                  {it.href ? (
                    <span className="mt-1 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper sm:flex">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={i} className="border-b border-line">
                  {it.href ? (
                    <Link href={it.href} className="group flex gap-5 py-8 md:gap-8 md:py-10">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex gap-5 py-8 md:gap-8 md:py-10">{body}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
