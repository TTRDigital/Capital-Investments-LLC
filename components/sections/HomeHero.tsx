"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HeroVideo, HomeHeroSection } from "@/lib/types";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { PillButton } from "@/components/sections/parts";

/**
 * Home banner: the Miami skyline video with only the heading on it; the welcome
 * text and the two buttons follow as one centred statement below. (The old
 * service-area words and team photo strip are no longer shown here.)
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
        {/* Only a soft shade at the bottom left, so the skyline stays bright. */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(15deg,rgb(16_21_29/0.78)_0%,rgb(16_21_29/0.35)_45%,rgb(16_21_29/0.05)_75%)]" aria-hidden="true" />
        <div className="container-box w-full pb-14 pt-40 md:pb-20">
          {/* Redesign headline. Sanity is shared with the live site, so it is set here on staging;
              when the redesign ships, put it in Sanity (Home > hero heading) and use s.heading again. */}
          <h1 className="font-serif text-[clamp(44px,6.6vw,100px)] font-normal leading-[1.02] tracking-[-0.015em] text-paper">
            Beyond <em className="italic text-gold">Brokerage.</em>
          </h1>
          <span aria-hidden="true" className="mt-8 block h-px w-24 bg-paper/70" />
        </div>
      </section>
      {/* The welcome text and the two buttons, as one calm centred statement below the banner. */}
      <section className="border-b border-line bg-paper py-24 md:py-36">
        <div className="container-box text-center">
          <p className="eyebrow inline-flex items-center gap-4 before:h-px before:w-10 before:bg-current before:opacity-55 after:h-px after:w-10 after:bg-current after:opacity-55">
            Capital Investment LLC
          </p>
          <Rich paras={s.text} className="mx-auto mt-8 max-w-[880px] font-serif text-[clamp(22px,2.3vw,31px)] leading-[1.5] text-ink" />
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <PillButton link={s.button} variant="dark" className="min-w-[210px] justify-center" />
            <Link href="/services/" className="btn btn-outline min-w-[210px] justify-center">
              Our Services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
