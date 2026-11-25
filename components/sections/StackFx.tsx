"use client";

import { useEffect } from "react";

/**
 * Flashcard stacking for a list of sticky cards: as the next card slides up
 * over a card, that card shrinks a little (to 94%) and darkens, like a deck.
 * Reads `[data-stack-item]` inside the element with `id`; each item's first
 * child is the card. Off for reduced motion (the cards still stack).
 */
export function StackFx({ id }: { id: string }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.getElementById(id);
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>("[data-stack-item]")];
    const cards = items.map((li) => li.firstElementChild as HTMLElement | null);
    let frame = 0;
    const update = () => {
      frame = 0;
      for (let i = 0; i < items.length; i++) {
        const card = cards[i];
        if (!card) continue;
        const next = items[i + 1];
        let p = 0;
        if (next) {
          const a = items[i].getBoundingClientRect();
          const b = next.getBoundingClientRect();
          const step = 20;
          p = Math.min(1, Math.max(0, (a.height - (b.top - a.top)) / (a.height - step)));
        }
        card.style.transform = p ? `scale(${(1 - 0.06 * p).toFixed(4)})` : "";
        card.style.setProperty("--stack-shade", (0.42 * p).toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [id]);
  return null;
}
