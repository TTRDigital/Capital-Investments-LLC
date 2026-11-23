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
      <section className="bg-sand pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="container-box">
          <nav aria-label="Breadcrumb" className="text-[13.5px] font-medium text-muted">
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
          <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:gap-16 lg:gap-24">
            <div className="md:sticky md:top-28 md:self-start">
              <div className="mx-auto max-w-[380px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#e9e4dd] to-[#d6cfc6] md:max-w-none">
                <Picture img={m.photo} sizes="(min-width: 768px) 380px, 90vw" priority className="aspect-[4/5] h-auto w-full object-cover object-top" />
              </div>
            </div>
            <div>
              <h1 className="h-page">{m.name}</h1>
              <p className="mt-3 text-[15px] font-semibold uppercase tracking-[0.12em] text-copper">{m.role}</p>
              <span className="mt-7 block h-px w-full bg-line" aria-hidden="true" />
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
