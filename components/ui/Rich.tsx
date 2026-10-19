import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/*
 * Renders the text conventions from lib/types.ts:
 * paragraphs, "## " sub-headings, "- " / "1. " lists, **bold**, _italic_,
 * *accent*, [label](href) and "\n" line breaks.
 */

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*(.+?)\*\*|(?<![\w])_(.+?)_(?![\w])|\*(.+?)\*|\n/g;

export function Inline({ text, accentClass = "text-copper" }: { text: string; accentClass?: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index! > last) out.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1]) out.push(<SmartLink key={i++} href={m[2]}>{<Inline text={m[1]} accentClass={accentClass} />}</SmartLink>);
    else if (m[3]) out.push(<strong key={i++} className="font-bold">{<Inline text={m[3]} accentClass={accentClass} />}</strong>);
    else if (m[4]) out.push(<em key={i++}>{m[4]}</em>);
    else if (m[5]) out.push(<span key={i++} className={accentClass}>{m[5]}</span>);
    else out.push(<br key={i++} />);
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

export function SmartLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      {children}
    </a>
  );
}

type Block = { kind: "p" | "h" | "ul" | "ol"; lines: string[] };

function blocks(paras: string[]): Block[] {
  const out: Block[] = [];
  for (const raw of paras) {
    const p = raw.trim();
    if (!p) continue;
    const kind = p.startsWith("## ") ? "h" : p.startsWith("- ") ? "ul" : /^\d+\.\s/.test(p) ? "ol" : "p";
    const line = kind === "h" ? p.slice(3) : kind === "ul" ? p.slice(2) : kind === "ol" ? p.replace(/^\d+\.\s/, "") : p;
    const prev = out[out.length - 1];
    if ((kind === "ul" || kind === "ol") && prev?.kind === kind) prev.lines.push(line);
    else out.push({ kind, lines: [line] });
  }
  return out;
}

/** Paragraph list from the CMS. `listClass` styles bullet lists, `headingClass` the "## " lines. */
export function Rich({ paras, className = "", headingClass = "", listClass = "" }: { paras?: string[]; className?: string; headingClass?: string; listClass?: string }) {
  if (!paras?.length) return null;
  return (
    <div className={`rich ${className}`}>
      {blocks(paras).map((b, i) => {
        if (b.kind === "h") return <h3 key={i} className={headingClass}><Inline text={b.lines[0]} /></h3>;
        if (b.kind === "p") return <p key={i}><Inline text={b.lines[0]} /></p>;
        const List = b.kind === "ul" ? "ul" : "ol";
        return (
          <List key={i} className={listClass}>
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

/** Heading text with *accent* spans (copper) and line breaks. */
export function HeadingText({ text }: { text: string }) {
  return <Inline text={text} />;
}

export const plain = (s: string) => s.replace(/\*\*|\*|_(?=\S)|(?<=\S)_|\[([^\]]+)\]\([^)]*\)/g, (m, label) => label ?? "").replace(/\n/g, " ");
