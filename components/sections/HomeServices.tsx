import Link from "next/link";
import type { HomeServicesSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal, Section, Title } from "@/components/sections/parts";

/** Home "Our Services": the five services as numbered rows next to the photo. */
export function HomeServices({ s }: { s: HomeServicesSection }) {
  return (
    <Section>
      <div className="container-box grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24">
        <Reveal className="md:sticky md:top-28 md:self-start">
          <Title text={s.heading} align="left" />
          {s.image ? <Picture img={s.image} sizes="(min-width: 768px) 40vw, 100vw" className="mt-10 hidden h-auto w-full rounded-2xl md:block" /> : null}
        </Reveal>
        <Reveal as="div">
          <ol className="border-t border-line">
            {s.items.map((it, i) => {
              const body = (
                <>
                  <span className="pt-1 font-serif text-[18px] italic text-copper" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="h-sub transition-colors group-hover:text-copper">{it.title}</h3>
                    <Rich paras={it.text} className="mt-3 text-[15.5px] leading-[1.7] text-body" />
                  </div>
                  {it.href ? <ArrowRight className="mt-2 hidden h-5 w-5 shrink-0 text-muted transition-[color,transform] group-hover:translate-x-1 group-hover:text-copper sm:block" /> : null}
                </>
              );
              return (
                <li key={i} className="border-b border-line">
                  {it.href ? (
                    <Link href={it.href} className="group flex gap-5 py-7 md:gap-8 md:py-9">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex gap-5 py-7 md:gap-8 md:py-9">{body}</div>
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
