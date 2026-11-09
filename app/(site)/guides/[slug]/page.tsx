import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getGuide, getGuides, getTeamMember } from "@/lib/content";
import { defaultGuideBanner } from "@/lib/data/guides";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { guideSchema } from "@/lib/guide-schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { Picture } from "@/components/ui/Picture";
import { Cta, Hero } from "@/components/sections/Basic";
import { GuideBody, readingMinutes } from "@/components/guides/GuideBody";
import { Inline, SmartLink } from "@/components/ui/Rich";

/* One guide (/guides/<slug>/): banner, byline, body, sources, related links, call to action. */

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getGuides()).map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = await getGuide((await params).slug);
  if (!g) return {};
  const meta = pageMetadata(g.seo, `/guides/${g.slug}/`, g.banner ?? defaultGuideBanner);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: g.publishedAt, modifiedTime: g.updatedAt || g.publishedAt } };
}

const formatDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "long", day: "numeric" });

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await getGuide(slug);
  if (!g) notFound();
  const author = await getTeamMember(g.authorSlug);
  const path = `/guides/${g.slug}/`;
  const banner = g.banner ?? defaultGuideBanner;
  const minutes = readingMinutes(g.body);
  return (
    <>
      <JsonLd data={guideSchema(g, author, path, banner.src)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides/" }, { name: g.title, path }])} />
      <Hero s={{ _type: "hero", heading: g.title, image: banner, overlay: 0.55, position: "center", breadcrumbs: false, align: "center" }} />
      <article className="py-[40px] md:py-[70px]">
        <div className="container-box">
          <div className="mx-auto max-w-[760px]">
            <nav aria-label="Breadcrumb" className="font-sans text-[14px] text-slate">
              <ol className="flex flex-wrap items-center gap-x-[8px]">
                <li><Link href="/" className="hover:text-copper">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/guides/" className="hover:text-copper">Guides</Link></li>
              </ol>
            </nav>
            <div className="mt-[22px] flex items-center gap-[14px] border-b border-black/10 pb-[24px]">
              {author?.photo ? <Picture img={author.photo} sizes="56px" className="h-[56px] w-[56px] rounded-full object-cover" /> : null}
              <p className="font-sans text-[14px] leading-[1.5] text-slate">
                {author ? (
                  <>
                    By <Link href={`/team/${author.slug}/`} className="font-semibold text-black hover:text-copper">{author.name}</Link>, {author.role}
                    <br />
                  </>
                ) : null}
                <time dateTime={g.publishedAt}>{formatDate(g.publishedAt)}</time> · {minutes} min read
              </p>
            </div>
            <div className="mt-[28px]">
              <GuideBody paras={g.body} />
            </div>

            {g.sources.length ? (
              <section className="mt-[48px] rounded-[16px] bg-cream-2 p-[22px] md:p-[32px]">
                <h2 className="font-serif text-[22px] font-bold leading-[1.3] text-black md:text-[26px]">Where do these figures come from?</h2>
                <ol className="mt-[16px] list-decimal space-y-[14px] pl-[22px] font-sans text-[15px] leading-[1.65] text-ink marker:font-semibold marker:text-copper">
                  {g.sources.map((s) => (
                    <li key={s.url}>
                      <span className="font-semibold">{s.publisher}.</span>{" "}
                      <SmartLink href={s.url} className="break-words underline decoration-copper underline-offset-2 hover:text-copper">{s.label}</SmartLink>
                      . {s.date}.{s.note ? ` ${s.note}` : ""}
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            {g.disclaimer.length ? (
              <div className="mt-[28px] font-sans text-[13px] leading-[1.7] text-slate">
                {g.disclaimer.map((d, i) => (
                  <p key={i}><Inline text={d} /></p>
                ))}
              </div>
            ) : null}

            {g.related.length ? (
              <section className="mt-[48px]">
                <h2 className="font-serif text-[22px] font-bold leading-[1.3] text-black md:text-[26px]">Where can you read more?</h2>
                <ul className="mt-[16px] grid gap-[12px] sm:grid-cols-2">
                  {g.related.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="flex h-full items-center justify-between gap-[12px] rounded-[10px] bg-white p-[16px] font-sans text-[15px] font-semibold leading-[1.4] text-black shadow-card transition-colors hover:text-copper">
                        <span>{r.label}</span>
                        <span aria-hidden="true" className="text-copper">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </div>
      </article>
      <Cta s={{ _type: "cta", heading: "Would you like to talk it through?", text: ["Tell us about the property or the plan you have in mind. We will start with a conversation, and your own advisers stay in the loop."], button: { label: "Let's Chat", href: "#chat" } }} />
    </>
  );
}
