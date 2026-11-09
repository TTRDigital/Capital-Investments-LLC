import Link from "next/link";
import type { Metadata } from "next";
import { getGuides, getTeam } from "@/lib/content";
import { defaultGuideBanner } from "@/lib/data/guides";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/sections/Basic";
import { readingMinutes } from "@/components/guides/GuideBody";

/* Guides index (/guides/). */

const seo = {
  title: "Commercial Real Estate Guides | Capital Investment LLC",
  description: "Plain guides on commercial real estate market conditions, public statistics and what investors should check, from Capital Investment LLC.",
};

export const metadata: Metadata = pageMetadata(seo, "/guides/", defaultGuideBanner);

const formatDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" });

export default async function GuidesIndex() {
  const [guides, team] = await Promise.all([getGuides(), getTeam()]);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }])} />
      <Hero s={{ _type: "hero", heading: "Commercial Real Estate Guides", image: defaultGuideBanner, overlay: 0.55, position: "center", breadcrumbs: true, align: "center" }} crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <section className="py-[40px] md:py-[70px]">
        <div className="container-box">
          <p className="mx-auto max-w-[760px] text-center font-sans text-[16px] leading-[1.8] text-ink md:text-[18px]">
            Market conditions, public statistics and what to check before you invest. Every figure names its source, and none of it replaces your own advisers.
          </p>
          <ul className="mx-auto mt-[36px] grid max-w-[1100px] gap-[24px] md:grid-cols-2">
            {guides.map((g) => {
              const author = team.find((m) => m.slug === g.authorSlug);
              return (
                <li key={g.slug} className="h-full">
                  <Link href={`/guides/${g.slug}/`} className="group flex h-full flex-col rounded-[14px] bg-cream-2 p-[24px] shadow-card md:p-[30px]">
                    <h2 className="font-serif text-[22px] font-bold leading-[1.3] text-black group-hover:text-copper md:text-[26px]">{g.title}</h2>
                    <p className="mt-[12px] font-sans text-[15px] leading-[1.7] text-ink">{g.excerpt}</p>
                    <p className="mt-auto pt-[18px] font-sans text-[13px] text-slate">
                      {author ? `${author.name} · ` : ""}
                      {formatDate(g.publishedAt)} · {readingMinutes(g.body)} min read
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
