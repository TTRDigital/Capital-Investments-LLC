import type { Office, SiteSettings, TeamMember } from "@/lib/types";
import { absoluteUrl } from "@/lib/site";
import { plain } from "@/components/ui/Rich";

/* JSON-LD built only from facts on the site (offices, phones, social profiles). No ratings or reviews. */

function postal(o: Office) {
  const m = o.address.match(/^(.*?)\s+([A-Za-z .]+?),?\s+([A-Z]{2})\.?,?\s+(\d{5})$/);
  return m
    ? { "@type": "PostalAddress", streetAddress: m[1].replace(/,$/, ""), addressLocality: m[2].replace(/\.$/, ""), addressRegion: m[3], postalCode: m[4], addressCountry: "US" }
    : { "@type": "PostalAddress", streetAddress: o.address, addressCountry: "US" };
}

export function businessSchema(s: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": absoluteUrl("/#organization"),
    name: s.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(s.footerLogo.src),
    image: absoluteUrl(s.logo.src),
    telephone: s.phone,
    email: s.email,
    sameAs: s.social.map((x) => x.href),
    address: postal(s.offices[0]),
    location: s.offices.map((o) => ({ "@type": "Place", name: `${s.name} – ${o.name}`, address: postal(o), ...(o.phone ? { telephone: o.phone } : {}) })),
  };
}

export function personSchema(m: TeamMember, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.role,
    url: absoluteUrl(path),
    ...(m.photo ? { image: absoluteUrl(m.photo.src) } : {}),
    worksFor: { "@id": absoluteUrl("/#organization") },
    description: plain(m.seo.description),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function faqSchema(items: { question: string; answer: string[] }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: plain(f.question), acceptedAnswer: { "@type": "Answer", text: f.answer.map(plain).join(" ") } })),
  };
}
