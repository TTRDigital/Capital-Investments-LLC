import type { Metadata, Viewport } from "next";
import { DM_Sans, Inter, Lexend, Lora, Montserrat, Outfit, Roboto } from "next/font/google";
import { siteUrl } from "@/lib/site";

/*
 * Root layout is intentionally bare: the website's styles and chrome live
 * in app/(site)/layout.tsx so the embedded Sanity Studio at /cms loads
 * without them. Fonts are self-hosted by next/font; only Lora and Inter
 * (headings and body, above the fold) are preloaded.
 */
const lora = Lora({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-inter" });
const roboto = Roboto({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-roboto-f", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"], display: "swap", variable: "--font-montserrat-f", preload: false });
const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700"], display: "swap", variable: "--font-outfit-f", preload: false });
const lexend = Lexend({ subsets: ["latin"], weight: ["500"], display: "swap", variable: "--font-lexend-f", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-dm-f", preload: false });

/**
 * Decorative CSS backgrounds far down the page (.bg-later: footer, CTA shapes) wait for the load event,
 * so on a phone they do not compete with the main content (TTR-2880). Without JavaScript they show as before.
 */
const bgWaitScript = `(function(d){d.setAttribute("data-bg-wait","");addEventListener("load",function(){d.removeAttribute("data-bg-wait")})})(document.documentElement)`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Capital Investment LLC", template: "%s - Capital Investment LLC" },
  applicationName: "Capital Investment LLC",
  formatDetection: { telephone: false, address: false, email: false },
  icons: { icon: [{ url: "/images/brand/logo-mark.webp", type: "image/webp" }], apple: "/images/brand/logo-mark.webp" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1421" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${lora.variable} ${inter.variable} ${roboto.variable} ${montserrat.variable} ${outfit.variable} ${lexend.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bgWaitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
