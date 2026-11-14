import type { NextConfig } from "next";

/*
 * Hosted on Vercel. Old WordPress addresses are handled in proxy.ts (rules in
 * lib/legacy-redirects.ts). The lead form posts to app/api/lead/route.ts, which
 * sends leads to TTR OS. Images are WebP copies made before the build by
 * scripts/optimize-images.mjs, picked by lib/image-loader.ts.
 */
const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.googletagmanager.com https://analytics.ahrefs.com https://*.leadconnectorhq.com https://*.msgsndr.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://*.leadconnectorhq.com https://*.msgsndr.com https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://*.leadconnectorhq.com https://*.msgsndr.com https://fonts.gstatic.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://analytics.ahrefs.com https://*.leadconnectorhq.com https://*.msgsndr.com wss://*.leadconnectorhq.com https://*.googleapis.com https://challenges.cloudflare.com; frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com https://*.leadconnectorhq.com https://*.msgsndr.com https://challenges.cloudflare.com; media-src 'self' blob: https://cdn.sanity.io; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests";

/*
 * Staging copy previews only (VERCEL_ENV=preview): let the Feedback Studio edit bar load and
 * save, and keep previews out of search results. The production policy above is untouched.
 */
const isPreview = process.env.VERCEL_ENV === "preview";
const previewCsp = csp
  .replace("script-src 'self'", "script-src 'self' https://portal.ttrdigitalmarketing.com https://ttr-portal.vercel.app")
  .replace("connect-src 'self'", "connect-src 'self' https://portal.ttrdigitalmarketing.com https://ttr-portal.vercel.app")
  .replace("img-src 'self'", "img-src 'self' https://*.blob.vercel-storage.com");

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    // Keep in sync with WIDTHS in scripts/optimize-images.mjs.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [96, 256, 384],
    qualities: [75],
  },
  async redirects() {
    return [
      // One address: https://www.capitalinvestmentllc.com
      {
        source: "/:path*",
        has: [{ type: "host", value: "capitalinvestmentllc.com" }],
        destination: "https://www.capitalinvestmentllc.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    const common = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
      { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
    ];
    return [
      // Everything except the Sanity studio (/cms), which talks to many Sanity hosts.
      { source: "/((?!cms).*)", headers: [...common, { key: "Content-Security-Policy", value: isPreview ? previewCsp : csp }, ...(isPreview ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] : [])] },
      { source: "/cms/:path*", headers: isPreview ? [...common, { key: "X-Robots-Tag", value: "noindex, nofollow" }] : common },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
      { source: "/videos/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }] },
    ];
  },
};

export default nextConfig;
