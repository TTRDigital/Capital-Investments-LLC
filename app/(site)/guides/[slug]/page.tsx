import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getGuide, getGuides, getTeamMember } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { Cta } from "@/components/sections/Basic";
import { Faq } from "@/components/sections/Interactive";
import { Byline, Disclaimer, GuideBody, GuideHero, RelatedLinks, ReviewNotice, Sources, Takeaways } from "@/components/guides/GuideParts";

/* One guide (/guides/<slug>/). Content comes from Sanity "guide" documents, with lib/data/guides.ts as the built-in copy. */

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = await getGuide((await params).slug);
  if (!g) return {};
  // Guides waiting for review stay out of search engines.
  return pageMetadata({ ...g.seo, noIndex: g.status !== "live" }, `/guides/${g.slug}/`, g.image);
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) notFound();
  const author = await getTeamMember(g.author.slug);
  const path = `/guides/${g.slug}/`;
  const crumbs = [{ label: "Home", href: "/" }, { label: "Guides", href: "/guides/" }, { label: g.title }];
  return (
    <>
      <JsonLd data={articleSchema(g, path, author)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }, { name: g.title, path }])} />
      {g.faqs.length ? <JsonLd data={faqSchema(g.faqs)} /> : null}
      <GuideHero title={g.title} image={g.image} crumbs={crumbs} />
      <article className="py-[36px] md:py-[56px]">
        <div className="container-box">
          <div className="mx-auto max-w-[820px]">
            {g.status !== "live" ? <ReviewNotice /> : null}
            <div className={g.status !== "live" ? "mt-[24px]" : ""}>
              <Byline guide={g} author={author} />
            </div>
            <p className="mt-[28px] font-serif text-[19px] font-medium leading-[1.6] text-black md:text-[22px]">{g.summary}</p>
            <div className="mt-[28px]">
              <Takeaways items={g.takeaways} />
            </div>
            <div className="mt-[36px]">
              <GuideBody paras={g.body} />
            </div>
            <Sources guide={g} />
            <Disclaimer>This guide is general information only. It is not legal, tax or investment advice, and nothing here promises a result or return.</Disclaimer>
            <RelatedLinks links={g.related} />
          </div>
        </div>
      </article>
      {g.faqs.length ? <Faq s={{ _type: "faq", heading: "What else do investors ask?", items: g.faqs }} /> : null}
      <Cta s={{ _type: "cta", heading: "Want to talk it through with our team?", text: ["Tell us what you plan to buy, where and why, and we will help you work out what to look at next."], button: { label: "Let's Chat", href: "#chat" } }} />
    </>
  );
}
