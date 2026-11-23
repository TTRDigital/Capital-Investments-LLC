import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { siteUrl } from "@/lib/site";

/*
 * Root layout is intentionally bare: the website's styles and chrome live
 * in app/(site)/layout.tsx so the embedded Sanity Studio at /cms loads
 * without them. Two self-hosted typefaces (next/font): Lora for headings,
 * Inter for everything else.
 */
const lora = Lora({ subsets: ["latin"], weight: ["500"], style: ["normal", "italic"], display: "swap", variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap", variable: "--font-inter" });

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
    <html lang="en-US" className={`${lora.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
