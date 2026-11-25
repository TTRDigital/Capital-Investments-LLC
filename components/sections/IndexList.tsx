import Link from "next/link";
import type { ReactNode } from "react";
import type { Img, Item, Link as LinkT } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { ArrowRight, Minus, Plus } from "@/components/ui/Icons";
import { Body, LogoMark, PillButton, Reveal, Rule, Title } from "@/components/sections/parts";

/**
 * A numbered list that opens one item at a time (native <details>, so it
 * works without JavaScript and every word stays in the page for search
 * engines). Only the titles show until an item is opened; the first is open.
 */
export function IndexList({ items, name, dark = false, className = "" }: { items: Item[]; name: string; dark?: boolean; className?: string }) {
  const line = dark ? "border-white/15" : "border-line";
  return (
    <div className={`border-b ${line} ${className}`}>
      {items.map((it, i) => (
        <details key={i} name={name} open={i === 0 ? true : undefined} className={`acc group border-t ${line}`}>
          <summary className="grid cursor-pointer grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 py-6 text-left md:grid-cols-[56px_minmax(0,1fr)_auto] md:gap-4 md:py-7">
            <span className={`caps ${dark ? "text-gold" : "text-copper"}`} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`font-serif text-[22px] font-normal leading-snug transition-colors md:text-[26px] ${dark ? "text-paper group-hover:text-gold" : "text-ink group-hover:text-copper"}`}>
              <Inline text={it.title} accentClass="italic" />
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${dark ? "border-white/25 text-paper group-open:border-gold group-open:bg-gold group-open:text-ink" : "border-line text-ink group-open:border-ink group-open:bg-ink group-open:text-paper"}`}
            >
              <Plus className="acc-plus h-3 w-3" />
              <Minus className="acc-minus h-3 w-3" />
            </span>
          </summary>
          <div className="pb-8 pl-[52px] pr-2 md:pl-[72px] md:pr-14">
            <Rich paras={it.text} className={`rich-dash text-[15px] leading-[1.8] ${dark ? "text-white/70" : "text-body"}`} />
            {it.href ? (
              <Link href={it.href} className={`link-arrow mt-5 ${dark ? "text-gold" : ""}`}>
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

/**
 * The shared layout for list sections: heading, intro and button on the left
 * (it stays in view while the list scrolls); the photo, if any, and the list
 * on the right. One column on phones.
 */
export function ListLayout({
  heading,
  text,
  image,
  button,
  icon,
  aside,
  children,
}: {
  heading?: string;
  text?: string[];
  image?: Img;
  button?: LinkT;
  icon?: boolean;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="container-box grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <Reveal className="lg:sticky lg:top-32 lg:self-start">
        {icon ? <LogoMark className="!mx-0 mb-6" /> : null}
        {heading ? <Title text={heading} align="left" /> : null}
        <Rule className="mt-8 text-copper" />
        <Body paras={text} className="mt-8 text-[16px] leading-[1.8]" />
        {button ? (
          <div className="mt-9">
            <PillButton link={button} />
          </div>
        ) : null}
        {aside}
      </Reveal>
      <Reveal>
        {image ? (
          <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-[24px]">
            <Picture img={image} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
        ) : null}
        {children}
      </Reveal>
    </div>
  );
}
