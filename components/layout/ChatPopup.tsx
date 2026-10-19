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
      className="m-auto max-h-[92dvh] w-[calc(100%-30px)] max-w-[775px] overflow-y-auto rounded-[10px] bg-white p-0 text-ink backdrop:bg-black/60"
    >
      {open ? (
        <div className="relative px-[15px] pb-[40px] pt-[30px] md:px-[30px]">
          <button type="button" onClick={close} aria-label="Close" className="absolute right-[18px] top-[18px] flex h-[36px] w-[36px] items-center justify-center rounded-full bg-copper text-white transition-transform hover:scale-110">
            <Close className="h-[16px] w-[16px]" />
          </button>
          <h2 id="chat-title" className="text-center font-serif text-[32px] font-bold leading-[1.3] md:text-[44px]">
            Get In Touch
          </h2>
          <div className="mt-[20px] divide-y divide-[#555]">
            {offices.map((o) => (
              <div key={o.key} className="grid items-center gap-4 py-[25px] md:grid-cols-2 md:py-[35px]">
                <div className="md:pl-[10px]">
                  <h3 className="font-serif text-[30px] font-bold leading-[1.2] md:text-[38px]">{o.label}</h3>
                  {o.phone ? (
                    <a href={`tel:+1${o.phone.replace(/\D/g, "")}`} className="mt-[14px] inline-flex items-center gap-[6px] rounded-[30px] bg-copper px-[24px] py-[10px] font-dm text-[15px] font-semibold text-white transition-opacity hover:opacity-90">
                      <Phone className="h-[14px] w-[14px]" />
                      {o.phone}
                    </a>
                  ) : null}
                </div>
                <p className="flex items-center gap-[18px] font-dm text-[17px] leading-[1.6]">
                  <Pin className="h-[22px] w-[16px] shrink-0 text-[#6b7280]" />
                  <span>{o.longAddress}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="mx-auto max-w-[566px]">
            <LeadForm kind="contact" consentText={consentText} />
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
