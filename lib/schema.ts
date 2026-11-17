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

const ORG_ID = () => `${absoluteUrl("/")}#organization`;

/** The firm plus one branch per office, all built from the Site settings (no ratings, reviews or prices). */
export function businessSchema(s: SiteSettings) {
  const sameAs = s.social.map((x) => x.href);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateAgent",
        "@id": ORG_ID(),
        name: s.name,
        legalName: s.legalName,
        slogan: s.tagline,
        url: absoluteUrl("/"),
        logo: absoluteUrl(s.footerLogo.src),
        image: absoluteUrl(s.logo.src),
        telephone: s.phone,
        email: s.email,
        sameAs,
        address: postal(s.offices[0]),
        areaServed: ["Washington, DC", "Virginia", "Maryland", "Miami, FL"],
        contactPoint: [{ "@type": "ContactPoint", contactType: "customer service", telephone: s.phone, email: s.email, areaServed: "US" }],
      },
      ...s.offices.map((o) => ({
        "@type": "RealEstateAgent",
        "@id": `${absoluteUrl("/offices/")}#${o.key}`,
        name: `${s.name}, ${o.name}`,
        url: absoluteUrl("/offices/"),
        parentOrganization: { "@id": ORG_ID() },
        address: postal(o),
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.mapQuery)}`,
        ...(o.phone ? { telephone: o.phone } : {}),
      })),
      { "@type": "WebSite", "@id": `${absoluteUrl("/")}#website`, url: absoluteUrl("/"), name: s.name, inLanguage: "en-US", publisher: { "@id": ORG_ID() } },
    ],
  };
}

/** Service pages: the service as offered by the firm in the markets it serves. Text comes from the page's own title and description. */
export function serviceSchema(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID() },
    areaServed: ["Washington, DC", "Virginia", "Maryland", "Miami, FL"],
  };
}

/** Profile links and the degree are only included when the member's own bio on the site shows them. No license numbers or ratings. */
export function personSchema(m: TeamMember, path: string, phone?: string) {
  const bio = m.bio.join(" ");
  const sameAs = [...new Set([...bio.matchAll(/\]\((https:\/\/(?:www\.)?(?:linkedin\.com|loopnet\.com|homes\.com|thebrokerlist\.com|showcase\.com)[^)\s]*)\)/g)].map((x) => x[1]))];
  const school = bio.match(/Juris Doctor(?: degree)? from the ([A-Z][A-Za-z ]+? (?:Law School|University))/)?.[1];
  const tel = phone ?? bio.match(/\]\(tel:(\+?\d+)\)/)?.[1];
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${absoluteUrl(path)}#person`,
    name: m.name,
    jobTitle: m.role,
    url: absoluteUrl(path),
    ...(m.photo ? { image: absoluteUrl(m.photo.src) } : {}),
    worksFor: { "@id": ORG_ID() },
    description: plain(m.seo.description),
    ...(sameAs.length ? { sameAs } : {}),
    ...(school ? { alumniOf: { "@type": "CollegeOrUniversity", name: school } } : {}),
    ...(tel ? { telephone: tel } : {}),
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
