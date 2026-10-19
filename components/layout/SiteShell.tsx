import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/content";
import { businessSchema } from "@/lib/schema";
import { revealScript } from "@/lib/reveal-script";
import { JsonLd } from "@/components/ui/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatPopup } from "@/components/layout/ChatPopup";
import { ChatWidget } from "@/components/layout/ChatWidget";
import { Analytics } from "@/components/layout/Analytics";
import { HydrationSignal } from "@/components/layout/HydrationSignal";
import { AttributionCapture } from "@/components/forms/AttributionCapture";

/** Header, footer and site-wide behaviors. Used by the site layout and the 404 page. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const popupOffices = settings.contactOffices.map((k) => settings.offices.find((o) => o.key === k)).filter((o) => !!o);
  return (
    <>
      <JsonLd data={businessSchema(settings)} />
      <a href="#main" className="sr-only z-[100] rounded bg-copper px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Header menu={settings.menu} logo={settings.logo} siteName={settings.name} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} />
      <ChatPopup offices={popupOffices} consentText={settings.consentText} />
      <ChatWidget />
      <AttributionCapture />
      <HydrationSignal />
      <Analytics />
      <script dangerouslySetInnerHTML={{ __html: revealScript }} />
    </>
  );
}
