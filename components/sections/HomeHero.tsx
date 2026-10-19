"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeHeroSection } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { PillButton } from "@/components/sections/parts";

/**
 * Home banner: night skyline, heading, typewriter cycling the service areas,
 * and two photo grids that slide apart on scroll to reveal the welcome text
 * (the old site did this with GSAP; here it is a scroll listener). With
 * reduced motion the grids start apart and the text is shown.
 */

function useTypewriter(words: string[], wait = 3000) {
  const [text, setText] = useState(words[0] ?? "");
  useEffect(() => {
    if (!words.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let shown = words[0];
    let deleting = true;
    let t = window.setTimeout(function tick() {
      const full = words[i % words.length];
      shown = deleting ? full.slice(0, shown.length - 1) : full.slice(0, shown.length + 1);
      setText(shown);
      let delay = 80;
      if (!deleting && shown === full) {
        delay = wait;
        deleting = true;
      } else if (deleting && shown === "") {
        deleting = false;
        i++;
        delay = 500;
      }
      t = window.setTimeout(tick, delay);
    }, wait);
    return () => window.clearTimeout(t);
  }, [words, wait]);
  return text;
}

const TALL = [0, 3, 4];

function Grid({ imgs }: { imgs: HomeHeroSection["galleryLeft"] }) {
  return (
    <div className="grid grid-cols-3 gap-[6px] md:gap-[16px]">
      {imgs.slice(0, 6).map((img, i) => (
        <div key={i} className={`relative overflow-hidden rounded-[16px] ${TALL.includes(i) ? "row-span-3 pt-[133%]" : "row-span-1 pt-[75%]"}`}>
          <Picture img={img} fill sizes="(min-width: 768px) 16vw, 33vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

export function HomeHero({ s }: { s: HomeHeroSection }) {
  const word = useTypewriter(s.words);
  const wrap = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      raf = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(raf);
    }
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.2;
      const total = Math.max(r.height - window.innerHeight * 0.8, 1);
      setP(Math.min(Math.max((start - r.top) / total, 0), 1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-night pt-[200px] text-white">
      <Picture img={s.image} fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />
      <div className="container-box text-center">
        <h1 className="font-sans text-[22px] font-bold uppercase leading-[1.55] md:text-[30px] md:leading-[1.6]">{s.heading}</h1>
        <p className="mt-[20px] flex min-h-[36px] items-center justify-center font-serif text-[32px] font-semibold uppercase leading-[1.12] md:min-h-[73px] md:text-[56px] md:leading-[1.3]" aria-live="off">
          <span className="sr-only">{s.words.join(", ")}</span>
          <span aria-hidden="true" className="type-cursor">
            {word}
          </span>
        </p>
        <Picture img={images.downArrow} sizes="45px" className="mx-auto mt-[40px] h-[49px] w-[40px] md:h-[55px] md:w-[45px]" priority={false} eager />
      </div>
      <div ref={wrap} className="relative mt-[40px] flex min-h-[500px] items-start justify-center gap-[16px] overflow-hidden md:mt-[80px] md:min-h-[620px] md:items-center">
        <div className="absolute -left-[51%] top-0 z-[1] w-full md:relative md:left-auto" style={{ transform: `translateX(${-50 * p}%)` }}>
          <Grid imgs={s.galleryLeft} />
        </div>
        <div className="absolute -right-[51%] top-0 z-[1] w-full md:relative md:right-auto" style={{ transform: `translateX(${50 * p}%)` }}>
          <Grid imgs={s.galleryRight} />
        </div>
        <div
          className="relative z-0 mx-auto flex max-w-[600px] max-md:!opacity-100 flex-col items-center justify-center gap-[20px] px-[15px] pb-[40px] pt-[300px] text-center md:absolute md:inset-x-0 md:top-[30%] md:pt-0"
          style={{ opacity: p }}
        >
          <Rich paras={s.text} className="font-montserrat text-[16px] font-normal leading-[1.5] md:text-[20px]" />
          <PillButton link={s.button} />
        </div>
      </div>
    </section>
  );
}
