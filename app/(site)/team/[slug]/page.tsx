import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage, getTeam, getTeamMember } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { JsonLd } from "@/components/ui/JsonLd";
import { Hero } from "@/components/sections/Basic";
import { Picture } from "@/components/ui/Picture";
import { Rich } from "@/components/ui/Rich";
import type { HeroSection } from "@/lib/types";

/* Team member pages (/team/<slug>/), same layout as the old WordPress "team" posts. */

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getTeam()).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const m = await getTeamMember((await params).slug);
  return m ? pageMetadata(m.seo, `/team/${m.slug}/`, m.photo) : {};
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [m, teamPage] = await Promise.all([getTeamMember(slug), getPage("/our-team/")]);
  if (!m) notFound();
  // Same banner photo as /our-team/.
  const teamHero = teamPage?.sections.find((s) => s._type === "hero") as HeroSection | undefined;
  const hero: HeroSection = { _type: "hero", heading: m.role, image: teamHero?.image, overlay: teamHero?.overlay ?? 0.4, position: teamHero?.position ?? "top", breadcrumbs: true, align: "left" };
  const path = `/team/${m.slug}/`;
  return (
    <>
      <JsonLd data={personSchema(m, path)} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Our Team", path: "/our-team/" }, { name: m.name, path }])} />
      <Hero s={hero} headingTag="p" crumbs={[{ label: "Home", href: "/" }, { label: "Our Team", href: "/our-team/" }, { label: m.name }]} />
      <section className="py-[40px] md:py-[60px]">
        <div className="container-box grid gap-[30px] md:grid-cols-[minmax(0,1fr)_300px] md:gap-[60px] lg:pr-[60px]">
          <div>
            <h1 className="font-serif text-[26px] font-bold leading-[1.3] text-black">{m.name}</h1>
            <p className="font-serif text-[17px] font-bold text-black">{m.role}</p>
            <div className="mt-[20px] md:hidden">
              <Picture img={m.photo} sizes="100vw" className="h-auto w-full max-w-[360px]" />
            </div>
            <Rich
              paras={m.bio}
              className="mt-[20px] font-sans text-[16px] leading-[1.7] text-black/85"
              headingClass="!mt-[28px] font-sans text-[20px] font-semibold text-[#334155]"
              listClass="list-disc pl-[22px]"
            />
          </div>
          <div className="hidden md:block">
            <Picture img={m.photo} sizes="300px" priority className="mt-[20px] h-auto w-full" />
          </div>
        </div>
      </section>
    </>
  );
}
