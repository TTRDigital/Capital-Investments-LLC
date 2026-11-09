import type { Guide, TeamMember } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";
import { plain } from "@/components/ui/Rich";
import { images } from "@/lib/data/images";

/* JSON-LD for a guide: Article with the author's Person and the company as publisher. Built only from the guide and team data. */
export function guideSchema(g: Guide, author: TeamMember | undefined, path: string, bannerSrc?: string) {
  const description = plain(g.seo.description || g.excerpt);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    headline: g.title,
    description,
    datePublished: g.publishedAt,
    dateModified: g.updatedAt || g.publishedAt,
    image: [absoluteUrl(bannerSrc ?? images.logoDark.src)],
    inLanguage: "en-US",
    ...(author ? { author: { "@type": "Person", name: author.name, jobTitle: author.role, url: absoluteUrl(`/team/${author.slug}/`) } } : {}),
    publisher: { "@id": absoluteUrl("/#organization") },
    citation: g.sources.map((s) => ({ "@type": "WebPage", name: `${s.publisher}: ${s.label}`, url: s.url })),
  };
}
