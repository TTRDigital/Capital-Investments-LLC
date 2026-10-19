"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "@/components/ui/Icons";

/**
 * Swipeable carousel on native scroll snapping (replaces the old site's Slick
 * sliders). Slides keep their own widths (`slideClass`); `center` keeps the
 * active slide centred with its neighbours peeking in. Autoplay pauses on
 * hover, focus, touch, hidden tabs and reduced motion.
 */
export function Carousel({
  children,
  slideClass,
  label,
  center = false,
  autoplay = 0,
  arrows = "none",
  dots = false,
  gapClass = "gap-[20px]",
  trackClass = "",
  className = "",
  onIndex,
  goTo,
}: {
  children: ReactNode;
  slideClass: string;
  label: string;
  center?: boolean;
  autoplay?: number;
  arrows?: "none" | "sides" | "below";
  dots?: boolean;
  gapClass?: string;
  /** Extra track classes, e.g. side padding + matching scroll padding so neighbours peek in. */
  trackClass?: string;
  className?: string;
  onIndex?: (i: number) => void;
  goTo?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const slides = Children.toArray(children);
  const count = slides.length;

  const scrollTo = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const n = ((i % count) + count) % count;
      const slide = el.children[n] as HTMLElement | undefined;
      if (!slide) return;
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      const left = center ? slide.offsetLeft - (el.clientWidth - slide.clientWidth) / 2 : slide.offsetLeft - el.offsetLeft - pad;
      el.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    },
    [center, count],
  );

  // Track which slide is in view.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
      const mid = el.scrollLeft + (center ? el.clientWidth / 2 : pad + 1);
      let best = 0;
      let bestDist = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const s = c as HTMLElement;
        const d = Math.abs((center ? s.offsetLeft + s.clientWidth / 2 : s.offsetLeft - el.offsetLeft) - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setIndex(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [center]);

  useEffect(() => onIndex?.(index), [index, onIndex]);

  useEffect(() => {
    if (goTo !== undefined) scrollTo(goTo);
  }, [goTo, scrollTo]);

  // Centre the first slide on load.
  useEffect(() => {
    if (center) {
      const el = track.current;
      const first = el?.children[0] as HTMLElement | undefined;
      if (el && first) el.scrollLeft = first.offsetLeft - (el.clientWidth - first.clientWidth) / 2;
    }
  }, [center]);

  useEffect(() => {
    if (!autoplay || count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (!paused.current && !document.hidden) scrollTo(index + 1 >= count ? 0 : index + 1);
    }, autoplay);
    return () => window.clearInterval(t);
  }, [autoplay, count, index, scrollTo]);

  const pause = { onMouseEnter: () => (paused.current = true), onMouseLeave: () => (paused.current = false), onFocus: () => (paused.current = true), onBlur: () => (paused.current = false), onTouchStart: () => (paused.current = true) };

  const arrowBtn = (dir: -1 | 1) => (
    <button
      type="button"
      onClick={() => scrollTo(index + dir)}
      aria-label={dir < 0 ? "Previous slide" : "Next slide"}
      className={
        arrows === "below"
          ? "flex h-[32px] w-[32px] items-center justify-center rounded-full bg-copper text-white transition-opacity hover:opacity-85"
          : "absolute top-1/2 z-10 flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_0_10px_rgb(0_0_0/0.15)] " + (dir < 0 ? "left-[2px]" : "right-[2px]")
      }
    >
      {dir < 0 ? <ChevronLeft className="h-[12px] w-[12px]" /> : <ChevronRight className="h-[12px] w-[12px]" />}
    </button>
  );

  return (
    <div className={`relative ${className}`} role="region" aria-roledescription="carousel" aria-label={label} {...pause}>
      <div ref={track} className={`no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain ${gapClass} ${trackClass}`}>
        {slides.map((s, i) => (
          <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} className={`shrink-0 ${center ? "snap-center" : "snap-start"} ${slideClass}`}>
            {s}
          </div>
        ))}
      </div>
      {arrows === "sides" && count > 1 ? (
        <>
          {arrowBtn(-1)}
          {arrowBtn(1)}
        </>
      ) : null}
      {arrows === "below" && count > 1 ? <div className="mt-[20px] flex justify-center gap-[10px]">{[arrowBtn(-1), arrowBtn(1)].map((b, i) => <span key={i}>{b}</span>)}</div> : null}
      {dots && count > 1 ? (
        <div className="mt-[20px] flex justify-center gap-[6px]">
          {slides.map((_, i) => (
            <button key={i} type="button" onClick={() => scrollTo(i)} aria-label={`Go to slide ${i + 1}`} aria-current={i === index ? "true" : undefined} className="p-[3px]">
              <span className={`block h-[8px] w-[8px] rounded-full transition-colors ${i === index ? "bg-copper" : "bg-[#d8c2b2]"}`} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
