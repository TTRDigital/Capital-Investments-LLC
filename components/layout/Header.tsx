"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Img, MenuItem } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Caret, Close, MenuIcon } from "@/components/ui/Icons";

/**
 * Old site header: transparent over the hero, black at 80% once scrolled
 * (43px, as before). Desktop menu opens on hover and keyboard focus; the
 * phone menu is a full-width panel with expandable groups.
 */

/** The old menu highlighted only the link to the current page. */
const isActive = (item: MenuItem, path: string): boolean => !!item.href && item.href === path;

function DesktopItem({ item, path, depth }: { item: MenuItem; path: string; depth: number }) {
  const active = isActive(item, path);
  const top = depth === 0;
  const label = (
    <>
      <span>{item.label}</span>
      {item.children ? <Caret className={`h-[10px] w-[10px] ${top ? "" : "-rotate-90"}`} /> : null}
    </>
  );
  const cls = top
    ? `flex items-center gap-[10px] px-[20px] py-[13px] text-[18px] font-medium leading-[20px] transition-colors hover:text-copper ${active ? "text-copper" : "text-white"}`
    : `flex items-center justify-between gap-3 px-[20px] py-[13px] text-[13px] font-medium leading-[20px] transition-colors hover:text-copper ${active ? "text-copper" : "text-white"}`;
  return (
    <li className="group/item relative">
      {item.href ? (
        <Link href={item.href} className={cls} aria-haspopup={item.children ? "true" : undefined}>
          {label}
        </Link>
      ) : (
        <button type="button" className={cls} aria-haspopup="true">
          {label}
        </button>
      )}
      {item.children ? (
        <ul
          className={`invisible absolute z-10 min-w-[250px] bg-black/[0.83] opacity-0 transition-opacity duration-150 group-hover/item:visible group-hover/item:opacity-100 group-focus-within/item:visible group-focus-within/item:opacity-100 ${top ? "left-0 top-full" : "left-full top-0"}`}
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
  const [open, setOpen] = useState(false);
  const active = isActive(item, path);
  const pad = { paddingLeft: `${20 + depth * 16}px` };
  return (
    <li>
      <div className={`flex items-center justify-between ${active && depth === 0 ? "bg-copper" : ""}`}>
        {item.href ? (
          <Link href={item.href} onClick={onNavigate} style={pad} className="flex-1 py-[12px] pr-3 text-[16px] font-medium text-white">
            {item.label}
          </Link>
        ) : (
          <button type="button" onClick={() => setOpen(!open)} style={pad} className="flex-1 py-[12px] pr-3 text-left text-[16px] font-medium text-white">
            {item.label}
          </button>
        )}
        {item.children ? (
          <button type="button" aria-expanded={open} aria-label={`${open ? "Close" : "Open"} ${item.label} menu`} onClick={() => setOpen(!open)} className="px-5 py-[12px] text-white">
            <Caret className={`h-[12px] w-[12px] transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        ) : null}
      </div>
      {item.children && open ? (
        <ul>
          {item.children.map((c) => (
            <MobileItem key={c.label} item={c} path={path} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function Header({ menu, logo, siteName }: { menu: MenuItem[]; logo: Img; siteName: string }) {
  const path = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 43);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const chat = (
    <Link href="/contact-us/" data-open-chat className="rounded-[30px] border border-copper bg-copper px-[20px] py-[13px] text-[18px] font-medium leading-[20px] text-white transition-colors hover:bg-white hover:text-copper max-[1024px]:px-[12px] max-[1024px]:py-[6px] max-[1024px]:font-montserrat max-[1024px]:text-[12px] max-[1024px]:font-bold">
      Let’s Chat
    </Link>
  );

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? "bg-black/80" : "bg-transparent"}`}>
      <div className="mx-auto flex h-[70px] max-w-[1440px] items-center gap-3 px-[20px] min-[1025px]:h-[112px] min-[1025px]:px-[60px]">
        <button
          type="button"
          className="text-white min-[1025px]:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <Close className="h-[26px] w-[26px]" /> : <MenuIcon className="h-[26px] w-[26px]" />}
        </button>
        <Link href="/" className="block w-[180px] shrink-0 min-[1025px]:w-[395px]" aria-label={`${siteName} home`}>
          <Picture img={logo} sizes="(min-width: 1025px) 395px, 180px" eager className="h-auto w-full" />
        </Link>
        <nav aria-label="Main" className="ml-auto hidden min-[1025px]:block">
          <ul className="flex items-center">
            {menu.map((item) => (
              <DesktopItem key={item.label} item={item} path={path} depth={0} />
            ))}
            <li className="ml-[1px]">{chat}</li>
          </ul>
        </nav>
        <div className="ml-auto min-[1025px]:hidden">{chat}</div>
      </div>
      {open ? (
        <nav id="mobile-menu" aria-label="Main" className="max-h-[calc(100dvh-70px)] overflow-y-auto bg-black/80 pb-5 min-[1025px]:hidden">
          <ul>
            {menu.map((item) => (
              <MobileItem key={item.label} item={item} path={path} depth={0} onNavigate={() => setOpen(false)} />
            ))}
          </ul>
          <div className="px-[15px] pt-3">
            <Link href="/contact-us/" data-open-chat onClick={() => setOpen(false)} className="inline-block rounded-[30px] bg-copper px-[20px] py-[13px] text-[16px] font-medium text-white">
              Let’s Chat
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
