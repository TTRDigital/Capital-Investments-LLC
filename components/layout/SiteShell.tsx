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

/** TTR OS tracker site key. Public (it ships in every page), so it falls back to Capital's key; NEXT_PUBLIC_TTR_SITE_KEY overrides it. */
const TTR_SITE = process.env.NEXT_PUBLIC_TTR_SITE_KEY || "rpHDHW5PBWuKNAXadcNPiQ";

/** Header, footer and site-wide behaviors. Used by the site layout and the 404 page. */
export async function SiteShell({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();
  const popupOffices = settings.contactOffices.map((k) => settings.offices.find((o) => o.key === k)).filter((o) => !!o);
  return (
    <>
      {businessSchema(settings).map((node, i) => (
        <JsonLd key={i} data={node} />
      ))}
      <a href="#main" className="sr-only z-[100] rounded bg-copper px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Header menu={settings.menu} siteName={settings.name} phone={settings.phone} offices={popupOffices} />
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
      <script src="https://portal.ttrdigitalmarketing.com/api/site/script/5a23a7758595" data-site={TTR_SITE} defer />
    </>
  );
}
