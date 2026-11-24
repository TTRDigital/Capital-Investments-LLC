import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTeam, getTeamMember } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import Link from "next/link";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import { PillButton } from "@/components/sections/parts";

/* Team member pages (/team/<slug>/): breadcrumb, portrait, name, role and bio. */

// A path that was not built ahead is rendered on request: in draft preview (lib/preview.ts) that is how an
// unpublished page (e.g. TTR OS's scratch draft) shows. For visitors nothing changes: published content has no
// such path, so the page is not found and it is the same 404 as before.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getTeam()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = await getTeamMember((await params).slug);
  return m ? pageMetadata(m.seo, `/team/${m.slug}/`, m.photo) : {};
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await getTeamMember(slug);
  if (!m) notFound();
  const path = `/team/${m.slug}/`;
  return (
    <>
      <JsonLd data={personSchema(m, path)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Our Team", path: "/our-team/" }, { name: m.name, path }])} />
      <section className="bg-paper pb-20 pt-10 md:pb-32 md:pt-16">
        <div className="container-box">
          <nav aria-label="Breadcrumb" className="caps text-muted">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <li>
                <Link href="/" className="transition-colors hover:text-copper">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-line">
                /
              </li>
              <li>
                <Link href="/our-team/" className="transition-colors hover:text-copper">
                  Our Team
                </Link>
              </li>
              <li aria-hidden="true" className="text-line">
                /
              </li>
              <li aria-current="page" className="text-ink">
                {m.name}
              </li>
            </ol>
          </nav>
          <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-16 lg:gap-28">
            <div className="md:sticky md:top-28 md:self-start">
              <div className="relative mx-auto max-w-[380px] md:max-w-none">
                <span aria-hidden="true" className="absolute -bottom-4 -right-4 h-full w-full rounded-[24px] border border-bronze/40" />
                <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#e8e1d6] to-[#cfc5b7] shadow-lift">
                  <Picture img={m.photo} sizes="(min-width: 768px) 380px, 90vw" priority className="aspect-[4/5] h-auto w-full object-cover object-top" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="h-page">{m.name}</h1>
              <p className="eyebrow eyebrow-rule mt-6">{m.role}</p>
              <span className="mt-9 block h-px w-full bg-line" aria-hidden="true" />
              <Rich paras={m.bio} className="mt-8 text-[16.5px] leading-[1.8] text-body" headingTag="h2" headingClass="text-[19px]" />
              <div className="mt-10">
                <PillButton link={{ label: "Let’s Chat", href: "#chat" }} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
