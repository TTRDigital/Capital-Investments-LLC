import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage, getPages, getSiteSettings, getTeam } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import type { Page } from "@/lib/types";

/* Every page except team members: home, services, service areas, company, legal and form pages. */

export const dynamicParams = false;

type Params = { slug?: string[] };
const toPath = (slug?: string[]) => (slug?.length ? `/${slug.join("/")}/` : "/");

export async function generateStaticParams(): Promise<Params[]> {
  const pages = await getPages();
  return pages.map((p) => ({ slug: p.path === "/" ? [] : p.path.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const page = await getPage(toPath((await params).slug));
  if (!page) return {};
  const heroImg = page.sections.find((s) => s._type === "hero" || s._type === "homeHero") as { image?: Page["seo"]["image"] } | undefined;
  return pageMetadata(page.seo, page.path, heroImg?.image);
}

/** Breadcrumb trail from the URL: each parent path that is a page. */
function trail(page: Page, pages: Page[]) {
  const parts = page.path.split("/").filter(Boolean);
  const items: { label: string; href?: string; path: string }[] = [{ label: "Home", href: "/", path: "/" }];
  parts.forEach((_, i) => {
    const path = `/${parts.slice(0, i + 1).join("/")}/`;
    const p = pages.find((x) => x.path === path);
    if (p) items.push({ label: p.title, href: path === page.path ? undefined : path, path });
  });
  return items;
}

export default async function SitePage({ params }: { params: Promise<Params> }) {
  const path = toPath((await params).slug);
  const [page, pages, settings, team] = await Promise.all([getPage(path), getPages(), getSiteSettings(), getTeam()]);
  if (!page) notFound();
  const crumbs = trail(page, pages);
  const faqs = page.sections.flatMap((s) => (s._type === "faq" ? s.items : []));
  return (
    <>
      {path !== "/" ? <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.label, path: c.path })))} /> : null}
      {faqs.length ? <JsonLd data={faqSchema(faqs)} /> : null}
      {page.sections.map((s, i) => (
        <SectionRenderer key={s._key ?? i} section={s} ctx={{ settings, team, pages, crumbs }} />
      ))}
    </>
  );
}
