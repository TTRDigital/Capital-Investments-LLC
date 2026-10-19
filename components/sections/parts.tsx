import type { ReactNode } from "react";
import Link from "next/link";
import type { Link as LinkT } from "@/lib/types";
import { HeadingText, Rich } from "@/components/ui/Rich";
import { SmartLink } from "@/components/ui/Rich";

/* Shared building blocks for the section components. */

type Font = "serif" | "sans" | undefined;

/** Section heading. Sizes follow the old pages: desktop / phone in px. */
export function Title({
  text,
  as: Tag = "h2",
  font,
  accent,
  size = "section",
  align = "center",
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  font?: Font;
  accent?: boolean;
  size?: "display" | "section" | "panel" | "intro" | "card";
  align?: "center" | "left";
  className?: string;
}) {
  const sizes = {
    display: "text-[26px] leading-[1.35] md:text-[48px] md:leading-[1.19]",
    section: "text-[26px] leading-[1.35] md:text-[42px] md:leading-[1.3]",
    panel: "text-[26px] leading-[1.35] md:text-[38px] md:leading-[1.3]",
    intro: "text-[20px] leading-[1.3] md:text-[32px] md:leading-[1.3]",
    card: "text-[20px] leading-[1.3] md:text-[24px] md:leading-[1.3]",
  }[size];
  const family = font === "sans" ? "font-outfit font-semibold" : "font-serif font-bold";
  return (
    <Tag className={`${family} ${sizes} ${accent ? "text-copper" : "text-black"} ${align === "center" ? "text-center" : "text-center md:text-left"} ${className}`}>
      <HeadingText text={text} />
    </Tag>
  );
}

/** Body copy block. */
export function Body({ paras, className = "", align = "center" }: { paras?: string[]; className?: string; align?: "center" | "left" }) {
  return <Rich paras={paras} className={`font-sans ${align === "center" ? "text-center" : "text-center md:text-left"} ${className}`} listClass="text-left" />;
}

/** "Let's Chat" style pill; href "#chat" (or empty) opens the contact popup. */
export function PillButton({ link, className = "" }: { link?: LinkT; className?: string }) {
  if (!link?.label) return null;
  const chat = !link.href || link.href === "#chat";
  if (chat) {
    return (
      <Link href="/contact-us/" data-open-chat className={`btn ${className}`}>
        {link.label}
      </Link>
    );
  }
  return (
    <SmartLink href={link.href} className={`btn ${className}`}>
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
