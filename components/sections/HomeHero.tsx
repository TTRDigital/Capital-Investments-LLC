"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroVideo, HomeHeroSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Inline, Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { PillButton } from "@/components/sections/parts";

/**
 * Home banner: the Miami skyline video behind the heading, the service areas
 * (the old typewriter words, now one static line), the welcome text and two
 * buttons; then the team photos as one strip below the banner.
 */

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
    // Start after the page has loaded and then on the first touch, scroll or key press, or after 4 seconds
    // (same idea as the chat widget): the video file never competes with the page load.
    let started = false;
    let t = 0;
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    const start = () => {
      if (started) return;
      started = true;
      events.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(t);
      setSources(list);
    };
    const arm = () => {
      events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
      t = window.setTimeout(start, 4000);
    };
    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });
    return () => {
      window.removeEventListener("load", arm);
      events.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(t);
    };
  }, [video]);
  return sources;
}

export function HomeHero({ s }: { s: HomeHeroSection }) {
  const videoSources = useVideoSources(s.video);
  const [playing, setPlaying] = useState(false);
  // The two old grids repeat the same photos; show each photo once.
  const photos = [...(s.galleryLeft ?? []), ...(s.galleryRight ?? [])].filter((img, i, all) => img?.src && all.findIndex((x) => x?.src === img.src) === i);

  return (
    <>
      <section data-tone="ink" className="relative isolate flex min-h-[calc(100svh-68px)] items-end overflow-hidden bg-ink min-[1025px]:min-h-[max(calc(100svh-84px),640px)]">
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
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_21_29/0.82)_0%,rgb(16_21_29/0.45)_55%,rgb(16_21_29/0.2)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" aria-hidden="true" />
        <div className="container-box w-full pb-16 pt-32 md:pb-24">
          {s.words?.length ? (
            <p className="eyebrow eyebrow-rule flex-wrap !text-gold">
              {s.words.map((w, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 ? <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold/60" /> : null}
                  {w}
                </span>
              ))}
            </p>
          ) : null}
          <div className="mt-8 grid items-end gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
            <div>
              <h1 className="h-display max-w-[920px] text-paper">
                <Inline text={s.heading} accentClass="italic text-gold" />
              </h1>
              <span aria-hidden="true" className="mt-9 block h-px w-28 bg-paper/60" />
            </div>
            <div className="lg:pb-3">
              <Rich paras={s.text} className="text-[15.5px] leading-[1.85] text-white/75" />
              <div className="mt-8 flex flex-wrap gap-3">
                <PillButton link={s.button} />
                <Link href="/services/" className="btn btn-ghost">
                  Our Services <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <a href="#home-services" className="caps absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-white/60 transition-colors hover:text-white md:flex" aria-label="Scroll down">
          Scroll
          <span aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-white/20">
            <span className="scroll-cue absolute inset-0 bg-gold" />
          </span>
        </a>
      </section>
      {photos.length ? (
        <section aria-label="Our team at work" className="overflow-hidden bg-paper pt-5 md:pt-6">
          <ul
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:grid md:overflow-visible md:px-6"
            style={{ gridTemplateColumns: `repeat(${photos.length}, minmax(0, 1fr))` }}
          >
            {photos.map((img, i) => (
              <li key={i} className="relative aspect-[3/4] w-[34vw] shrink-0 snap-start overflow-hidden rounded-[16px] shadow-card md:w-auto">
                <Picture img={img} fill sizes="(min-width: 768px) 15vw, 34vw" className="object-cover transition-transform duration-700 hover:scale-[1.05]" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
