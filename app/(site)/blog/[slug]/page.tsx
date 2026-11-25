import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/ui/JsonLd";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { ArrowRight } from "@/components/ui/Icons";
import { PillButton } from "@/components/sections/parts";
import { formatDate } from "@/lib/format-date";

/* Blog post (/blog/<slug>/). */

export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getPost((await params).slug);
  return p ? pageMetadata(p.seo, `/blog/${p.slug}/`, p.image) : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getPost((await params).slug);
  if (!p) notFound();
  const path = `/blog/${p.slug}/`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: p.title,
          datePublished: p.date,
          description: p.seo.description || undefined,
          image: p.image ? absoluteUrl(p.image.src) : undefined,
          url: absoluteUrl(path),
          author: p.author ? { "@type": "Person", name: p.author.name, url: absoluteUrl(`/team/${p.author.slug}/`) } : { "@type": "Organization", name: "Capital Investment LLC" },
          publisher: { "@type": "Organization", name: "Capital Investment LLC" },
        }}
      />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }, { name: p.title, path }])} />
      <article className="bg-paper pb-20 pt-10 md:pb-32 md:pt-16">
        <div className="container-box">
          <nav aria-label="Breadcrumb" className="caps mb-8 text-muted">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <li>
                <Link href="/" className="transition-colors hover:text-copper">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="h-px w-5 bg-line" />
              <li>
                <Link href="/blog/" className="transition-colors hover:text-copper">
                  Blog
                </Link>
              </li>
            </ol>
          </nav>
          <div className="max-w-[860px]">
            <p className="caps text-copper">
              {formatDate(p.date)}
              {p.author ? (
                <>
                  {" · "}
                  <Link href={`/team/${p.author.slug}/`} className="hover:underline">
                    {p.author.name}
                  </Link>
                </>
              ) : null}
            </p>
            <h1 className="h-page mt-5 text-ink">{p.title}</h1>
          </div>
          {p.image ? (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[24px] md:mt-14 lg:aspect-[21/9] lg:rounded-[28px]">
              <Picture img={p.image} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
            </div>
          ) : null}
          <Rich paras={p.body} headingTag="h2" headingClass="h-sub mt-12" className="mx-auto mt-12 max-w-[720px] text-[17px] leading-[1.85] text-body md:mt-16" />
          <div className="mx-auto mt-14 flex max-w-[720px] flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
            <Link href="/blog/" className="caps inline-flex items-center gap-2 text-ink transition-colors hover:text-copper">
              <ArrowRight className="h-3 w-3 rotate-180" /> All articles
            </Link>
            <PillButton link={{ label: "Let's Chat", href: "#chat" }} />
          </div>
        </div>
      </article>
    </>
  );
}
