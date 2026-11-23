"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google Maps embed that starts loading only after the page has loaded and the
 * map is near the screen (TTR-2880). A native loading="lazy" iframe still loads
 * up to about 1,250 px below the screen, so on a phone the maps' scripts used
 * to compete with the page's main content. Same size and look once loaded; the
 * box keeps its size before that, so nothing moves.
 */
export function LazyMap({ title, src, className }: { title: string; src: string; className?: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | undefined;
    const watch = () => {
      io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            setOn(true);
            io?.disconnect();
          }
        },
        { rootMargin: "300px 0px" },
      );
      io.observe(el);
    };
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });
    return () => {
      window.removeEventListener("load", watch);
      io?.disconnect();
    };
  }, []);

  return (
    <>
      <iframe ref={ref} title={title} src={on ? src : undefined} className={className} referrerPolicy="no-referrer-when-downgrade" />
      <noscript>
        <iframe title={title} src={src} loading="lazy" className={className} referrerPolicy="no-referrer-when-downgrade" />
      </noscript>
    </>
  );
}
