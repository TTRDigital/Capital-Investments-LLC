import Link from "next/link";
import type { AreaLinksSection } from "@/lib/types";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal, Section, SectionHeader } from "@/components/sections/parts";

/** A state page's cities and neighborhoods: a clean grid of links, one row each. */
export function AreaLinks({ s }: { s: AreaLinksSection }) {
  if (!s.links?.length) return null;
  return (
    <Section>
      <div className="container-box">
        <Reveal>
          <SectionHeader eyebrow={s.eyebrow} heading={s.heading} />
        </Reveal>
        <Reveal as="div">
          <ul className={`mx-auto mt-12 grid gap-3 md:mt-14 ${s.links.length > 2 ? "max-w-[1080px] sm:grid-cols-2 lg:grid-cols-3" : "max-w-[520px]"}`}>
            {s.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-white px-6 py-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-bronze/50 hover:shadow-card"
                >
                  <span className="font-serif text-[20px] leading-snug text-ink transition-colors group-hover:text-copper">{l.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-copper transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
