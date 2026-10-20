"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { HeroVideo, HomeHeroSection } from "@/lib/types";
import { images } from "@/lib/data/images";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { PillButton } from "@/components/sections/parts";

/**
 * Home banner: night skyline, heading, typewriter cycling the service areas,
 * and two photo grids that slide apart on scroll to reveal the welcome text.
 * Same timing as the old site's GSAP ScrollTrigger: from the photo area's top
 * at 20% of the window until its bottom meets the window's bottom, smoothed
 * like `scrub: 1`. When the area is shorter than that range (phones) the
 * grids part as soon as its top passes 20%. Progress is written to the
 * `--p` CSS variable (0 to 1). With reduced motion the grids start apart.
 */

/** Smoothing time constant in seconds (approximates GSAP's `scrub: 1`). */
const SCRUB = 0.35;

type VideoSource = { src: string; type: string };

/**
 * The skyline video starts only after the page has loaded, so the photo stays
 * the first paint. WebM first, MP4 as the fallback; smaller files on phones.
 * Skipped for reduced motion and data-saver connections.
 */

function useVideoSources(video?: HeroVideo) {
  const [sources, setSources] = useState<VideoSource[]>([]);
  useEffect(() => {
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const phone = window.matchMedia("(max-width: 767px)").matches;
    const webm = (phone && video.webmMobile) || video.webm;
    const mp4 = (phone && video.mp4Mobile) || video.mp4;
    const list = [webm && { src: webm, type: "video/webm" }, mp4 && { src: mp4, type: "video/mp4" }].filter(Boolean) as VideoSource[];
    if (!list.length) return;
    const start = () => setSources(list);
    let t = 0;
    const onLoad = () => {
      t = window.setTimeout(start, 0);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(t);
    };
  }, [video]);
  return sources;
}

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
  const videoSources = useVideoSources(s.video);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = root.current;
    const el = wrap.current;
    if (!sec || !el) return;
    const set = (v: number) => sec.style.setProperty("--p", v.toFixed(4));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(1);
      return;
    }
    let target = 0;
    let cur = 0;
    let raf = 0;
    let last = 0;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const start = window.innerHeight * 0.2;
      const total = r.height - window.innerHeight * 0.8;
      target = total > 0 ? Math.min(Math.max((start - r.top) / total, 0), 1) : r.top <= start ? 1 : 0;
    };
    const tick = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 1 / 60;
      last = t;
      cur += (target - cur) * (1 - Math.exp(-dt / SCRUB));
      if (Math.abs(target - cur) < 0.001) {
        cur = target;
        raf = 0;
        last = 0;
      } else raf = requestAnimationFrame(tick);
      set(cur);
    };
    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    measure();
    cur = target;
    set(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={root} style={{ "--p": 0 } as CSSProperties} className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden bg-night pt-[200px] text-white">
      <Picture img={s.image} fill priority sizes="100vw" className="-z-20 object-cover" />
      {videoSources.length ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        >
          {videoSources.map((v) => (
            <source key={v.src} src={v.src} type={v.type} />
          ))}
        </video>
      ) : null}
      {/* Old site: black gradient (solid to 71% at mid-height) at 70% opacity over the video. */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,#000_0%,#000000b5_50%)] opacity-70" aria-hidden="true" />
      <div className="container-box text-center">
        <h1 className="font-sans text-[22px] font-bold uppercase leading-[1.55] md:text-[30px] md:leading-[1.6]">{s.heading}</h1>
        <p className="mt-[20px] flex min-h-[36px] items-center justify-center font-serif text-[32px] font-semibold uppercase leading-[1.12] md:min-h-[73px] md:text-[56px] md:leading-[1.3]" aria-live="off">
          <span className="sr-only">{s.words.join(", ")}</span>
          <span aria-hidden="true" className="type-cursor">
            {word}
          </span>
        </p>
        {/* The old arrow box moved down 40% of its height: 20px on phones, 74px on desktop. */}
        <div className="mt-[40px] [--shift:20px] md:mt-[120px] md:[--shift:74px]" style={{ transform: "translateY(calc(var(--p) * var(--shift)))" }}>
          <Picture img={images.downArrow} sizes="45px" className="mx-auto h-[49px] w-[40px] md:h-[55px] md:w-[45px]" priority={false} eager />
        </div>
      </div>
      {/* Phones: the welcome text sets the height and the grids cover it, half off each side. */}
      <div ref={wrap} className="relative mt-[19px] min-h-[300px] overflow-hidden pb-[35px] md:mt-[14px] md:flex md:min-h-[620px] md:items-center md:justify-center md:gap-[16px] md:pb-0">
        <div className="absolute -left-[51%] top-[10px] z-[1] w-full md:relative md:left-auto md:top-auto" style={{ transform: "translateX(calc(var(--p) * -50%))" }}>
          <Grid imgs={s.galleryLeft} />
        </div>
        <div className="absolute -right-[51%] top-[10px] z-[1] w-full md:relative md:right-auto md:top-auto" style={{ transform: "translateX(calc(var(--p) * 50%))" }}>
          <Grid imgs={s.galleryRight} />
        </div>
        <div
          className="relative z-0 mx-auto flex max-w-[600px] flex-col items-center justify-center gap-[20px] pb-[30px] pt-[45px] text-center [--y0:20px] md:absolute md:inset-x-0 md:top-[188px] md:py-0 md:[--y0:0px]"
          style={{ opacity: "var(--p)", transform: "translateY(calc((1 - var(--p)) * var(--y0) + var(--p) * -20%))" }}
        >
          <Rich paras={s.text} className="font-lexend text-[16px] font-medium leading-[24px] text-[#fffefe] md:max-[1024px]:text-[22px] md:max-[1024px]:leading-[37px] min-[1025px]:text-[28px] min-[1025px]:leading-[43px]" />
          <PillButton link={s.button} className="max-md:!px-[20px] max-md:!py-[11px] min-[1025px]:!py-[16px]" />
        </div>
      </div>
    </section>
  );
}
