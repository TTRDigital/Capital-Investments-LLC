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
      <section data-tone="ink" className="relative isolate flex min-h-[calc(100svh-64px)] items-center overflow-hidden bg-ink min-[1025px]:min-h-[min(calc(100svh-76px),860px)]">
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
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(16_27_45/0.9)_0%,rgb(16_27_45/0.62)_50%,rgb(16_27_45/0.35)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" aria-hidden="true" />
        <div className="container-box py-20 md:py-28">
          {s.words?.length ? (
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 !text-[#e6b892]">
              {s.words.map((w, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 ? <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" /> : null}
                  {w}
                </span>
              ))}
            </p>
          ) : null}
          <h1 className="h-display mt-6 max-w-[900px] text-white">
            <Inline text={s.heading} accentClass="italic text-[#e6b892]" />
          </h1>
          <Rich paras={s.text} className="lead mt-6 max-w-[640px] text-white/80" />
          <div className="mt-10 flex flex-wrap gap-3">
            <PillButton link={s.button} />
            <Link href="/services/" className="btn btn-ghost">
              Our Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      {photos.length ? (
        <section aria-label="Our team at work" className="overflow-hidden bg-white pt-4 md:pt-5">
          <ul
            className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:grid md:gap-4 md:overflow-visible md:px-5"
            style={{ gridTemplateColumns: `repeat(${photos.length}, minmax(0, 1fr))` }}
          >
            {photos.map((img, i) => (
              <li key={i} className="relative aspect-[4/5] w-[42vw] shrink-0 snap-start overflow-hidden rounded-xl md:w-auto">
                <Picture img={img} fill sizes="(min-width: 768px) 15vw, 42vw" className="object-cover transition-transform duration-500 hover:scale-[1.04]" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
