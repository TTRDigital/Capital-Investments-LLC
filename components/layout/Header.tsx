"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MenuItem } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { ChevronDown, Close, MenuIcon, Phone } from "@/components/ui/Icons";

/**
 * Sticky white header: logo, menu (hover and keyboard dropdowns on desktop,
 * an expandable full-height panel on phones), "Let's Chat" (the phone number is in the phone menu and the footer).
 * The logo is the design's dark version of the brand logo, not the CMS logo field,
 * so a light logo uploaded in /cms can't end up on the white header.
 */

/** A link is current when it points at this page. */
const isActive = (item: MenuItem, path: string): boolean => !!item.href && item.href === path;
const inSection = (item: MenuItem, path: string): boolean => isActive(item, path) || !!item.children?.some((c) => inSection(c, path));
const tel = (p: string) => `tel:+1${p.replace(/\D/g, "").slice(-10)}`;

function DesktopItem({ item, path, depth }: { item: MenuItem; path: string; depth: number }) {
  const top = depth === 0;
  const sub = useRef<HTMLUListElement>(null);
  const [flip, setFlip] = useState(false);
  // Open a submenu towards the left when it would run past the right edge of the window.
  const place = () => {
    const ul = sub.current;
    const li = ul?.parentElement;
    if (!ul || !li) return;
    const r = li.getBoundingClientRect();
    setFlip((top ? r.left : r.right) + ul.offsetWidth > document.documentElement.clientWidth);
  };
  const current = top ? inSection(item, path) : isActive(item, path);
  const label = (
    <>
      <span>{item.label}</span>
      {item.children ? <ChevronDown className={`h-3 w-3 opacity-50 transition-transform ${top ? "group-hover/item:rotate-180" : flip ? "rotate-90" : "-rotate-90"}`} /> : null}
    </>
  );
  const cls = top
    ? `relative flex h-[84px] items-center gap-1.5 px-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-copper xl:px-4 ${current ? "text-copper" : "text-ink"}`
    : `flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-paper hover:text-copper ${current ? "text-copper" : "text-ink"}`;
  return (
    <li className="group/item relative" onMouseEnter={item.children ? place : undefined} onFocus={item.children ? place : undefined}>
      {item.href ? (
        <Link href={item.href} className={cls} aria-haspopup={item.children ? "true" : undefined} aria-current={isActive(item, path) ? "page" : undefined}>
          {label}
        </Link>
      ) : (
        <button type="button" className={cls} aria-haspopup="true">
          {label}
        </button>
      )}
      {item.children ? (
        <ul
          ref={sub}
          className={`invisible absolute z-10 min-w-[280px] rounded-2xl border border-line/70 bg-white p-2 opacity-0 shadow-lift transition-[opacity,transform] duration-150 group-hover/item:visible group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:opacity-100 ${
            top ? `top-[calc(100%-14px)] ${flip ? "right-0" : "left-0"}` : `-top-2 ${flip ? "right-[calc(100%+8px)]" : "left-[calc(100%+8px)]"}`
          }`}
        >
          {item.children.map((c) => (
            <DesktopItem key={c.label} item={c} path={path} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function MobileItem({ item, path, depth, onNavigate }: { item: MenuItem; path: string; depth: number; onNavigate: () => void }) {
  const [open, setOpen] = useState(() => !!item.children && inSection(item, path));
  const current = isActive(item, path);
  const pad = { paddingLeft: `${depth * 16}px` };
  const text = depth === 0 ? "font-serif text-[26px] font-medium leading-tight" : "text-[15.5px]";
  return (
    <li className={depth === 0 ? "border-b border-line" : ""}>
      <div className="flex items-center justify-between">
        {item.href ? (
          <Link href={item.href} onClick={onNavigate} style={pad} aria-current={current ? "page" : undefined} className={`flex-1 py-3.5 ${text} ${current ? "text-copper" : "text-ink"}`}>
            {item.label}
          </Link>
        ) : (
          <button type="button" onClick={() => setOpen(!open)} style={pad} className={`flex-1 py-3.5 text-left ${text} text-ink`}>
            {item.label}
          </button>
        )}
        {item.children ? (
          <button type="button" aria-expanded={open} aria-label={`${open ? "Close" : "Open"} ${item.label} menu`} onClick={() => setOpen(!open)} className="-mr-2 p-3 text-ink">
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>
      {item.children && open ? (
        <ul className="pb-3">
          {item.children.map((c) => (
            <MobileItem key={c.label} item={c} path={path} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function Header({ menu, siteName, phone }: { menu: MenuItem[]; siteName: string; phone?: string }) {
  const path = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    // Lock the page behind the open menu (on <html>, which is the element that scrolls).
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 border-b bg-paper/95 backdrop-blur transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-paper/85 ${scrolled || open ? "border-line shadow-[0_10px_30px_-24px_rgb(21_26_34/0.45)]" : "border-line/60"}`}>
      <div className="container-box flex h-[68px] items-center gap-4 min-[1025px]:grid min-[1025px]:h-[84px] min-[1025px]:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="block w-[148px] shrink-0 min-[380px]:w-[170px] sm:w-[196px] min-[1025px]:w-[250px]" aria-label={`${siteName} home`}>
          <Picture img={images.logoInk} sizes="(min-width: 1025px) 250px, 196px" eager className="h-auto w-full" />
        </Link>
        <nav aria-label="Main" className="hidden min-[1025px]:block">
          <ul className="flex items-center">
            {menu.map((item) => (
              <DesktopItem key={item.label} item={item} path={path} depth={0} />
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-3 min-[1025px]:justify-self-end">
          <Link href="/contact-us/" data-open-chat className="btn whitespace-nowrap !px-5 !py-3 !text-[11px] min-[1025px]:!px-6">
            Let’s Chat
          </Link>
          <button
            type="button"
            className="-mr-2 p-2 text-ink min-[1025px]:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <Close className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-menu" aria-label="Main" className="absolute inset-x-0 top-full h-[calc(100dvh-68px)] overflow-y-auto overscroll-contain border-t border-line bg-paper min-[1025px]:hidden">
          <div className="container-box pb-10 pt-2">
            <ul>
              {menu.map((item) => (
                <MobileItem key={item.label} item={item} path={path} depth={0} onNavigate={() => setOpen(false)} />
              ))}
            </ul>
            {phone ? (
              <a href={tel(phone)} className="btn btn-dark mt-10 w-full">
                <Phone className="h-3.5 w-3.5 text-gold" />
                {phone}
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
