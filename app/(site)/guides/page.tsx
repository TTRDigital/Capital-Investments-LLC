import type { Metadata } from "next";
import Link from "next/link";
import { getGuides } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/ui/JsonLd";
import { Picture } from "@/components/ui/Picture";
import { Reveal } from "@/components/sections/parts";
import { GuideHero } from "@/components/guides/GuideParts";
import type { Guide, Seo } from "@/lib/types";

/* Guides index (/guides/): market conditions, statistics and client questions in plain language. */

const seo: Seo = {
  title: "Commercial Real Estate Guides: Miami and the DC Area",
  description: "Plain-language guides for commercial real estate investors, with sourced market figures and the checks to run first.",
};
const banner = { src: "/images/places/downtown-miami-dusk.webp", alt: "Downtown Miami skyline at dusk", width: 1368, height: 912 };

export async function generateMetadata(): Promise<Metadata> {
  const guides = await getGuides();
  // The index stays out of search engines until at least one guide is live.
  return pageMetadata({ ...seo, noIndex: !guides.some((g) => g.status === "live") }, "/guides/", banner);
}

export default async function GuidesIndex() {
  const guides: Guide[] = await getGuides();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: seo.title,
          url: absoluteUrl("/guides/"),
          hasPart: guides.map((g) => ({ "@type": "Article", headline: g.title, url: absoluteUrl(`/guides/${g.slug}/`) })),
        }}
      />
      <GuideHero title="Commercial real estate guides" image={banner} crumbs={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
      <section className="py-[40px] md:py-[60px]">
        <div className="container-box">
          <p className="mx-auto max-w-[820px] font-sans text-[16px] leading-[1.75] text-ink md:text-[18px]">
            Short, plain-language guides on market conditions, public statistics and the questions investors ask us most. Every figure names its public source and date. The guides are general information, not legal, tax or investment advice.
          </p>
          <ul className="mx-auto mt-[36px] grid max-w-[1100px] gap-[24px] md:grid-cols-2">
            {guides.map((g) => (
              <Reveal as="li" key={g.slug}>
                <Link href={`/guides/${g.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-[16px] bg-white shadow-card ring-1 ring-black/5">
                  <Picture img={g.image} sizes="(min-width: 768px) 540px, 100vw" className="aspect-[16/9] w-full object-cover" />
                  <div className="flex flex-1 flex-col p-[20px] md:p-[26px]">
                    {g.status !== "live" ? <p className="mb-[8px] font-sans text-[12px] font-semibold uppercase tracking-wide text-copper">Draft for review</p> : null}
                    <h2 className="font-serif text-[22px] font-bold leading-[1.3] text-black group-hover:text-copper md:text-[26px]">{g.title}</h2>
                    <p className="mt-[10px] flex-1 font-sans text-[15px] leading-[1.7] text-ink/80">{g.summary}</p>
                    <p className="mt-[14px] font-sans text-[13px] text-ink/60">
                      By {g.author.name}
                      {" "}· Updated{" "}
                      {new Date(`${g.updatedAt}T12:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
