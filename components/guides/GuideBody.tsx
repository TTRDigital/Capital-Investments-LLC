import { Inline } from "@/components/ui/Rich";

/*
 * Body of a guide. Same text conventions as page copy, but the page title is
 * the H1, so "## " is an h2 and "### " an h3 (the shared Rich renderer maps
 * "## " to h3 for pages that already have an h1 banner).
 */

type Block = { kind: "p" | "h2" | "h3" | "ul" | "ol"; lines: string[] };

function blocks(paras: string[]): Block[] {
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

export function GuideBody({ paras }: { paras: string[] }) {
  return (
    <div className="font-sans text-[16px] leading-[1.8] text-ink md:text-[17px]">
      {blocks(paras).map((b, i) => {
        if (b.kind === "h2")
          return (
            <h2 key={i} className="mt-[44px] font-serif text-[24px] font-bold leading-[1.3] text-black first:mt-0 md:text-[30px]">
              <Inline text={b.lines[0]} />
            </h2>
          );
        if (b.kind === "h3")
          return (
            <h3 key={i} className="mt-[28px] font-serif text-[19px] font-bold leading-[1.35] text-copper md:text-[22px]">
              <Inline text={b.lines[0]} />
            </h3>
          );
        if (b.kind === "p")
          return (
            <p key={i} className="mt-[16px]">
              <Inline text={b.lines[0]} />
            </p>
          );
        const List = b.kind === "ul" ? "ul" : "ol";
        return (
          <List key={i} className={`mt-[16px] space-y-[10px] pl-[22px] ${b.kind === "ul" ? "list-disc" : "list-decimal"} marker:text-copper`}>
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

/** Rough reading time at 220 words a minute. */
export function readingMinutes(paras: string[]) {
  const words = paras.join(" ").replace(/[*_#\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
