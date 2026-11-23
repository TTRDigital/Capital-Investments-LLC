import "./globals.css";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata = { title: { absolute: "Page not found - Capital Investment LLC" }, robots: { index: false } };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="bg-sand py-24 text-center md:py-36">
        <div className="container-box">
          <p className="eyebrow">404</p>
          <h1 className="h-page mt-4">Page not found</h1>
          <p className="lead mx-auto mt-5 max-w-[520px]">The page you were looking for has moved or no longer exists.</p>
          <Link href="/" className="btn mt-10">
            Back to the home page
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
