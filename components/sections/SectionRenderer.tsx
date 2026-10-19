import type { Page, Section, SiteSettings, TeamMember } from "@/lib/types";
import { Article, CardGrid, Cta, Hero, ImageCards, Intro, Panel, ServiceBlocks, SplitStack, Steps, WhyList } from "@/components/sections/Basic";
import { Faq, ServiceSlider, Slider, SplitAccordion, Tabs } from "@/components/sections/Interactive";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomeServices } from "@/components/sections/HomeServices";
import { Comparison, OfficeMaps, Stats, TeamCarousel } from "@/components/sections/Home";
import { Careers, ContactFormBlock, Jobs, Legal, MarketSlider, Message, OfficeCards, OfficeList, SitemapList, Subscribe, TeamGrid } from "@/components/sections/Company";

export type RenderContext = { settings: SiteSettings; team: TeamMember[]; pages: Page[]; crumbs: { label: string; href?: string }[] };

/** Maps each content section to its component. Unknown types (e.g. a CMS type added later) render nothing. */
export function SectionRenderer({ section: s, ctx }: { section: Section; ctx: RenderContext }) {
  const offices = (keys: string[]) => keys.map((k) => ctx.settings.offices.find((o) => o.key === k)).filter((o) => !!o);
  switch (s._type) {
    case "hero":
      return <Hero s={s} crumbs={ctx.crumbs} />;
    case "intro":
      return <Intro s={s} />;
    case "panel":
      return <Panel s={s} />;
    case "slider":
      return <Slider s={s} />;
    case "splitAccordion":
      return <SplitAccordion s={s} />;
    case "splitStack":
      return <SplitStack s={s} />;
    case "imageCards":
      return <ImageCards s={s} />;
    case "whyList":
      return <WhyList s={s} />;
    case "tabs":
      return <Tabs s={s} />;
    case "cta":
      return <Cta s={s} />;
    case "faq":
      return <Faq s={s} />;
    case "cardGrid":
      return <CardGrid s={s} />;
    case "article":
      return <Article s={s} />;
    case "steps":
      return <Steps s={s} />;
    case "serviceBlocks":
      return <ServiceBlocks s={s} />;
    case "serviceSlider":
      return <ServiceSlider s={s} />;
    case "homeHero":
      return <HomeHero s={s} />;
    case "homeServices":
      return <HomeServices s={s} />;
    case "comparison":
      return <Comparison s={s} />;
    case "stats":
      return <Stats s={s} />;
    case "teamCarousel":
      return <TeamCarousel s={s} team={ctx.team} />;
    case "officeMaps":
      return <OfficeMaps s={s} offices={offices(s.offices)} />;
    case "officeCards":
      return <OfficeCards s={s} offices={offices(s.offices)} />;
    case "officeList":
      return <OfficeList s={s} offices={offices(s.offices)} />;
    case "marketSlider":
      return <MarketSlider s={s} />;
    case "teamGrid":
      return <TeamGrid s={s} team={ctx.team} />;
    case "careers":
      return <Careers s={s} />;
    case "jobs":
      return <Jobs s={s} consentText={ctx.settings.consentText} />;
    case "contactForm":
      return <ContactFormBlock consentText={ctx.settings.consentText} />;
    case "subscribe":
      return <Subscribe s={s} consentText={ctx.settings.consentText} />;
    case "message":
      return <Message s={s} />;
    case "sitemapList":
      return <SitemapList s={s} pages={ctx.pages} />;
    case "legal":
      return <Legal s={s} />;
    default:
      return null;
  }
}
