import type { ReactNode } from "react";
import Link from "next/link";
import type { Link as LinkT } from "@/lib/types";
import { Inline, Rich, SmartLink } from "@/components/ui/Rich";
import { Picture } from "@/components/ui/Picture";
import { images } from "@/lib/data/images";

/* Shared building blocks for the section components (see the design system in app/globals.css). */

export type Tone = "white" | "sand" | "ink";

const TONE: Record<Tone, string> = { white: "bg-white", sand: "bg-sand", ink: "bg-ink text-white/80" };

/** A page section: background tone plus the shared vertical rhythm (.sec). */
export function Section({ tone = "white", className = "", children, id }: { tone?: Tone; className?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} data-tone={tone} className={`sec ${TONE[tone]} ${className}`}>
      {children}
    </section>
  );
}

/** *accent* words in headings: Lora italic in copper. */
export const ACCENT = "italic text-copper";

/**
 * Heading. The CMS still stores the old per-section font and colour choices
 * (hFont, hAccent); the redesign uses one heading style, so they are accepted and ignored.
 */
export function Title({
  text,
  as: Tag = "h2",
  size = "section",
  align = "center",
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  font?: "serif" | "sans";
  accent?: boolean;
  size?: "display" | "section" | "panel" | "intro" | "sub" | "card";
  align?: "center" | "left";
  className?: string;
}) {
  const cls = size === "card" ? "h-card" : size === "sub" ? "h-sub" : "h-section";
  return (
    <Tag className={`${cls} ${align === "center" ? "text-center" : "text-left"} ${className}`}>
      <Inline text={text} accentClass={ACCENT} />
    </Tag>
  );
}

/** The brand's column mark, shown above a heading when a section's "icon" switch is on. */
export function LogoMark({ className = "" }: { className?: string }) {
  return <Picture img={images.logoMark} sizes="44px" className={`mx-auto h-11 w-11 ${className}`} />;
}

/** Heading + intro text at the top of a section. */
export function SectionHeader({
  heading,
  text,
  eyebrow,
  align = "center",
  as = "h2",
  className = "",
}: {
  heading?: string;
  text?: string[];
  eyebrow?: string;
  align?: "center" | "left";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  if (!heading && !text?.length && !eyebrow) return null;
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-[780px] text-center" : "max-w-[720px]"} ${className}`}>
      {eyebrow ? <p className="eyebrow mb-4">{eyebrow}</p> : null}
      {heading ? <Title text={heading} as={as} align={align} /> : null}
      <Body paras={text} className={`lead ${heading ? "mt-5" : ""}`} align={align} />
    </div>
  );
}

/** Body copy block. */
export function Body({ paras, className = "", align = "left" }: { paras?: string[]; className?: string; align?: "center" | "left" }) {
  return <Rich paras={paras} className={`text-body ${align === "center" ? "text-center [&_ol]:text-left [&_ul]:text-left" : ""} ${className}`} />;
}

/**
 * Button for a CMS link; href "#chat" (or empty) opens the contact popup.
 * Variants: primary (copper), outline, light (white on dark), ghost (outline on dark).
 */
export function PillButton({ link, className = "", variant = "primary" }: { link?: LinkT; className?: string; variant?: "primary" | "outline" | "light" | "ghost" }) {
  if (!link?.label) return null;
  const cls = `btn ${variant === "primary" ? "" : `btn-${variant}`} ${className}`;
  const chat = !link.href || link.href === "#chat";
  if (chat) {
    return (
      <Link href="/contact-us/" data-open-chat className={cls}>
        {link.label}
      </Link>
    );
  }
  return (
    <SmartLink href={link.href} className={cls}>
      {link.label}
    </SmartLink>
  );
}

/** Fades content in on scroll (see lib/reveal-script.ts). */
export function Reveal({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "li" }) {
  return (
    <Tag data-reveal className={className}>
      {children}
    </Tag>
  );
}

/** Grid column classes for card rows (1 column on phones). */
export function cols(n: number | undefined, count: number) {
  const c = n ?? (count === 4 ? 4 : count === 2 ? 2 : 3);
  return { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "md:grid-cols-2 lg:grid-cols-4", 5: "md:grid-cols-3 lg:grid-cols-5", 6: "md:grid-cols-3 lg:grid-cols-6" }[Math.min(Math.max(c, 1), 6) as 1];
}

/** Small numbered/check marker used in lists. */
export function CheckMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-copper-tint text-copper ${className}`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}
