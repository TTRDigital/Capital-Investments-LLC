import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteUrl } from "@/lib/site";

/*
 * Root layout is intentionally bare: the website's styles and chrome live
 * in app/(site)/layout.tsx so the embedded Sanity Studio at /cms loads
 * without them. Two self-hosted typefaces (next/font): Cormorant Garamond
 * for display headings, Manrope for everything else.
 */
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap", variable: "--font-display" });
const text = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-text" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Capital Investment LLC", template: "%s - Capital Investment LLC" },
  applicationName: "Capital Investment LLC",
  formatDetection: { telephone: false, address: false, email: false },
  icons: { icon: [{ url: "/images/brand/logo-mark.webp", type: "image/webp" }], apple: "/images/brand/logo-mark.webp" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#121821" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
