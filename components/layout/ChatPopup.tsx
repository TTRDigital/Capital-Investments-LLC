"use client";

import { useEffect, useRef, useState } from "react";
import type { Office } from "@/lib/types";
import { LeadForm } from "@/components/forms/LeadForm";
import { Close, Phone, Pin } from "@/components/ui/Icons";

/**
 * The old "Get In Touch" popup behind every "Let's Chat" button: the two
 * offices (phone button + address) and the contact form. Any link with
 * data-open-chat (or href="#chat") opens it; without JavaScript those links
 * go to /contact-us/, which has the same form.
 */
export function ChatPopup({ offices, consentText }: { offices: Office[]; consentText: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("[data-open-chat], a[href='#chat']") as HTMLElement | null;
      if (!a) return;
      // Capture phase + stopPropagation: the popup opens before next/link can navigate.
      e.preventDefault();
      e.stopPropagation();
      opener.current = a;
      setOpen(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const close = () => {
    setOpen(false);
    opener.current?.focus();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="chat-title"
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === ref.current && close()}
      className="m-auto max-h-[92dvh] w-[calc(100%-24px)] max-w-[920px] overflow-y-auto rounded-2xl bg-white p-0 text-body shadow-lift backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      {open ? (
        <div className="relative grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          <button type="button" onClick={close} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand">
            <Close className="h-5 w-5" />
          </button>
          <div className="bg-sand px-6 pb-8 pt-10 md:px-10 md:py-12">
            <h2 id="chat-title" className="h-section">
              Get In Touch
            </h2>
            <ul className="mt-8 space-y-6">
              {offices.map((o) => (
                <li key={o.key} className="border-t border-line pt-6 first:border-0 first:pt-0">
                  <h3 className="h-card">{o.label}</h3>
                  <p className="mt-2 flex gap-2.5 text-[14.5px] leading-relaxed">
                    <Pin className="mt-[5px] h-3.5 w-3 shrink-0 text-copper" />
                    <span>{o.longAddress}</span>
                  </p>
                  {o.phone ? (
                    <a href={`tel:+1${o.phone.replace(/\D/g, "")}`} className="mt-3 inline-flex items-center gap-2 text-[15px] font-semibold text-ink transition-colors hover:text-copper">
                      <Phone className="h-3.5 w-3.5 text-copper" />
                      {o.phone}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 pb-8 pt-6 md:px-10 md:py-12">
            <LeadForm kind="contact" consentText={consentText} />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
