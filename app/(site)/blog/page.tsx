import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { Picture } from "@/components/ui/Picture";
import { ArrowRight } from "@/components/ui/Icons";
import { PillButton, Reveal, Rule } from "@/components/sections/parts";
import { formatDate } from "@/lib/format-date";

/* Blog index (/blog/): posts written in /cms (Blog post), newest first. */

const SEO = { title: "Blog | Capital Investment LLC", description: "Commercial real estate articles from Capital Investment LLC." };

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts();
  // Kept out of search results until the first post is published.
  return pageMetadata({ ...SEO, noIndex: posts.length === 0 }, "/blog/");
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog/" }])} />
      <section className="bg-paper pb-20 pt-10 md:pb-32 md:pt-16">
        <div className="container-box">
          <nav aria-label="Breadcrumb" className="caps mb-8 text-muted">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <li>
                <Link href="/" className="transition-colors hover:text-copper">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="h-px w-5 bg-line" />
              <li aria-current="page" className="text-copper">
                Blog
              </li>
            </ol>
          </nav>
          <h1 className="h-page text-ink">Blog</h1>
          <Rule className="mt-8 text-copper" />

          {posts.length ? (
            <ul className="mt-14 grid gap-6 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Reveal as="li" key={p.slug}>
                  <Link href={`/blog/${p.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-white transition-[box-shadow,transform] duration-500 hover:-translate-y-1 hover:shadow-lift">
                    <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                      {p.image ? <Picture img={{ ...p.image, alt: "" }} fill sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" /> : null}
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <p className="caps text-copper">{formatDate(p.date)}</p>
                      <h2 className="mt-4 font-serif text-[26px] font-normal leading-[1.2] text-ink transition-colors group-hover:text-copper">{p.title}</h2>
                      {p.excerpt ? <p className="mt-3 line-clamp-3 text-[15px] leading-[1.75] text-body">{p.excerpt}</p> : null}
                      <span className="caps mt-auto inline-flex items-center gap-2 pt-6 text-ink">
                        Read more <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <div className="mx-auto mt-16 max-w-[560px] rounded-[24px] border border-line bg-white px-8 py-14 text-center md:mt-20">
              <p className="font-serif text-[28px] leading-snug text-ink">Articles coming soon.</p>
              <p className="mt-4 text-[15px] leading-[1.75] text-body">In the meantime, our team is happy to talk about your property or investment.</p>
              <div className="mt-8">
                <PillButton link={{ label: "Let's Chat", href: "#chat" }} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
