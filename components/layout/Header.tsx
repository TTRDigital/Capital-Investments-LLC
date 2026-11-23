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
 * an expandable full-height panel on phones), main phone number and "Let's Chat".
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
      {item.children ? <ChevronDown className={`h-3.5 w-3.5 opacity-60 transition-transform ${top ? "group-hover/item:rotate-180" : flip ? "rotate-90" : "-rotate-90"}`} /> : null}
    </>
  );
  const cls = top
    ? `relative flex h-[76px] items-center gap-1.5 px-3.5 text-[15px] font-medium transition-colors hover:text-copper xl:px-4 ${current ? "text-copper" : "text-ink"}`
    : `flex items-center justify-between gap-4 rounded-lg px-3.5 py-2.5 text-[14.5px] font-medium transition-colors hover:bg-sand hover:text-copper ${current ? "text-copper" : "text-ink"}`;
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
          className={`invisible absolute z-10 min-w-[270px] rounded-xl border border-line bg-white p-2 opacity-0 shadow-lift transition-[opacity,transform] duration-150 group-hover/item:visible group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:opacity-100 ${
            top ? `top-[calc(100%-10px)] ${flip ? "right-0" : "left-0"}` : `-top-2 ${flip ? "right-[calc(100%+8px)]" : "left-[calc(100%+8px)]"}`
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
  const text = depth === 0 ? "text-[18px] font-medium" : "text-[16px]";
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
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-white/85 ${scrolled || open ? "border-line shadow-[0_6px_24px_-18px_rgb(16_27_45/0.35)]" : "border-transparent"}`}>
      <div className="container-box flex h-16 items-center gap-4 min-[1025px]:h-[76px]">
        <Link href="/" className="block w-[156px] shrink-0 min-[1025px]:w-[188px]" aria-label={`${siteName} home`}>
          <Picture img={images.logoInk} sizes="188px" eager className="h-auto w-full" />
        </Link>
        <nav aria-label="Main" className="ml-auto hidden min-[1025px]:block">
          <ul className="flex items-center">
            {menu.map((item) => (
              <DesktopItem key={item.label} item={item} path={path} depth={0} />
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2 min-[1025px]:ml-4">
          {phone ? (
            <a href={tel(phone)} className="hidden items-center gap-2 px-3 text-[15px] font-medium text-ink transition-colors hover:text-copper xl:flex">
              <Phone className="h-3.5 w-3.5 text-copper" />
              {phone}
            </a>
          ) : null}
          <Link href="/contact-us/" data-open-chat className="btn !px-4 !py-2.5 text-[14px] min-[1025px]:!px-5 min-[1025px]:!py-3">
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
        <nav id="mobile-menu" aria-label="Main" className="h-[calc(100dvh-64px)] overflow-y-auto border-t border-line bg-white min-[1025px]:hidden">
          <div className="container-box pb-10 pt-2">
            <ul>
              {menu.map((item) => (
                <MobileItem key={item.label} item={item} path={path} depth={0} onNavigate={() => setOpen(false)} />
              ))}
            </ul>
            {phone ? (
              <a href={tel(phone)} className="btn btn-outline mt-8 w-full">
                <Phone className="h-3.5 w-3.5 text-copper" />
                {phone}
              </a>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
