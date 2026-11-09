import Link from "next/link";
import type { ReactNode } from "react";
import type { Guide, Img, TeamMember } from "@/lib/types";
import { Inline } from "@/components/ui/Rich";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/sections/parts";

/* Building blocks for the guides pages (/guides/ and /guides/<slug>/), in the same design as the rest of the site. */

type Crumb = { label: string; href?: string };

/** Banner with the guide title as the H1 (long titles, so smaller than the standard page banner). */
export function GuideHero({ title, image, crumbs }: { title: string; image?: Img; crumbs: Crumb[] }) {
  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden rounded-b-[24px] bg-night md:min-h-[480px]">
      {image ? <Picture img={image} fill priority sizes="100vw" className="-z-20 object-cover object-center" /> : null}
      <div className="absolute inset-0 -z-10 bg-black" style={{ opacity: 0.5 }} aria-hidden="true" />
      <div className="container-box w-full pb-[60px] pt-[130px] md:pb-[80px]">
        <h1 className="max-w-[1000px] font-serif text-[28px] font-bold leading-[1.3] text-white md:text-[44px] md:leading-[1.25]">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-[14px] font-sans text-[15px] font-medium text-white md:text-[16px]">
          <ol className="flex flex-wrap items-center gap-x-[10px]">
            {crumbs.map((c, i) => (
              <li key={i} className="flex items-center gap-[10px]">
                {i > 0 ? <span aria-hidden="true">/</span> : null}
                {c.href ? (
                  <Link href={c.href} className="hover:text-copper">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="break-words">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}

type Block = { kind: "h2" | "h3" | "p" | "ul" | "ol"; lines: string[] };

function toBlocks(paras: string[]): Block[] {
  const out: Block[] = [];
  for (const raw of paras) {
    const p = raw.trim();
    if (!p) continue;
    const kind = p.startsWith("### ") ? "h3" : p.startsWith("## ") ? "h2" : p.startsWith("- ") ? "ul" : /^\d+\.\s/.test(p) ? "ol" : "p";
    const line = kind === "h3" ? p.slice(4) : kind === "h2" ? p.slice(3) : kind === "ul" ? p.slice(2) : kind === "ol" ? p.replace(/^\d+\.\s/, "") : p;
    const prev = out[out.length - 1];
    if ((kind === "ul" || kind === "ol") && prev?.kind === kind) prev.lines.push(line);
    else out.push({ kind, lines: [line] });
  }
  return out;
}

/** Guide text: "## " is an H2 and "### " an H3 (the page title is the H1). */
export function GuideBody({ paras }: { paras: string[] }) {
  return (
    <div className="font-sans text-[16px] leading-[1.75] text-ink md:text-[17px]">
      {toBlocks(paras).map((b, i) => {
        const first = i === 0 ? "" : "mt-[18px]";
        if (b.kind === "h2")
          return (
            <h2 key={i} className="mt-[44px] font-serif text-[24px] font-bold leading-[1.3] text-black md:text-[30px]">
              <Inline text={b.lines[0]} />
            </h2>
          );
        if (b.kind === "h3")
          return (
            <h3 key={i} className="mt-[30px] font-serif text-[20px] font-bold leading-[1.35] text-copper md:text-[23px]">
              <Inline text={b.lines[0]} />
            </h3>
          );
        if (b.kind === "p")
          return (
            <p key={i} className={`${first} [&_a]:text-copper [&_a:hover]:underline`}>
              <Inline text={b.lines[0]} />
            </p>
          );
        const List = b.kind === "ul" ? "ul" : "ol";
        return (
          <List key={i} className={`${first} ${b.kind === "ul" ? "list-disc" : "list-decimal"} space-y-[8px] pl-[22px] marker:text-copper [&_a]:text-copper [&_a:hover]:underline`}>
            {b.lines.map((l, j) => (
              <li key={j}>
                <Inline text={l} />
              </li>
            ))}
          </List>
        );
      })}
    </div>
  );
}

const longDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
};

/** Author line: photo, name linked to the team page, role and dates. */
export function Byline({ guide, author }: { guide: Guide; author?: TeamMember }) {
  return (
    <div className="flex items-center gap-[14px]">
      {author?.photo ? (
        <Picture img={author.photo} sizes="64px" className="h-[56px] w-[56px] shrink-0 rounded-full object-cover object-top md:h-[64px] md:w-[64px]" />
      ) : null}
      <div className="font-sans text-[14px] leading-[1.5] text-ink/80 md:text-[15px]">
        <p>
          By{" "}
          <Link href={`/team/${guide.author.slug}/`} rel="author" className="font-semibold text-black hover:text-copper">
            {guide.author.name}
          </Link>
          , {guide.author.role}
        </p>
        <p>
          Updated <time dateTime={guide.updatedAt}>{longDate(guide.updatedAt)}</time>
          {guide.sourcesCheckedOn ? <> · Sources checked {guide.sourcesCheckedOn}</> : null}
        </p>
      </div>
    </div>
  );
}

export function ReviewNotice() {
  return (
    <p role="note" className="rounded-[10px] border border-copper/40 bg-cream px-[16px] py-[12px] font-sans text-[14px] leading-[1.6] text-ink">
      <strong>Draft for review.</strong> This guide is waiting for Reza Sabaii to review it. It is hidden from search engines until it is approved.
    </p>
  );
}

export function Takeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside aria-labelledby="takeaways-label" className="rounded-[14px] bg-cream-2 p-[20px] md:p-[28px]">
      <p id="takeaways-label" className="font-serif text-[20px] font-bold text-black md:text-[22px]">
        Key takeaways
      </p>
      <ul className="mt-[12px] list-disc space-y-[8px] pl-[22px] font-sans text-[15px] leading-[1.7] text-ink marker:text-copper md:text-[16px]">
        {items.map((t, i) => (
          <li key={i}>
            <Inline text={t} />
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Sources({ guide }: { guide: Guide }) {
  if (!guide.sources.length) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-[50px] rounded-[14px] border border-black/10 p-[20px] md:p-[28px]">
      <h2 id="sources-heading" className="font-serif text-[22px] font-bold text-black md:text-[26px]">
        Sources
      </h2>
      {guide.sourcesCheckedOn ? <p className="mt-[8px] font-sans text-[14px] text-ink/70">Public sources, checked {guide.sourcesCheckedOn}.</p> : null}
      <ol className="mt-[14px] list-decimal space-y-[12px] pl-[22px] font-sans text-[14px] leading-[1.6] text-ink marker:text-copper md:text-[15px]">
        {guide.sources.map((s, i) => (
          <li key={i} className="break-words">
            <a href={s.url} target="_blank" rel="noopener" className="font-semibold text-copper underline-offset-2 hover:underline">
              {s.label}
            </a>
            . {s.publisher}. {s.date}.
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return <p className="mt-[24px] font-sans text-[13px] leading-[1.7] text-ink/70">{children}</p>;
}

export function RelatedLinks({ links }: { links: Guide["related"] }) {
  if (!links.length) return null;
  return (
    <Reveal className="mt-[40px]">
      <h2 className="font-serif text-[22px] font-bold text-black md:text-[26px]">Where can you read more?</h2>
      <ul className="mt-[14px] grid gap-[12px] sm:grid-cols-2">
        {links.map((l, i) => (
          <li key={i}>
            <Link href={l.href} className="block h-full rounded-[10px] bg-cream-2 px-[16px] py-[14px] font-roboto text-[16px] font-semibold leading-[1.4] text-black hover:text-copper">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
