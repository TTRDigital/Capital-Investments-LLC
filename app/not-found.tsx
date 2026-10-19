import "./globals.css";
import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";

export const metadata = { title: { absolute: "Page not found - Capital Investment LLC" }, robots: { index: false } };

export default function NotFound() {
  return (
    <SiteShell>
      <section className="bg-night pb-[100px] pt-[200px] text-center text-white">
        <div className="container-box">
          <h1 className="font-serif text-[40px] font-bold md:text-[56px]">Page not found</h1>
          <p className="mt-4 font-sans">The page you were looking for has moved or no longer exists.</p>
          <Link href="/" className="btn mt-8">
            Back to the home page
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
