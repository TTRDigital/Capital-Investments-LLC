import type { StructureResolver } from "sanity/structure";
import { Building2, Cog, FileText, Home, MapPin, Scale, Send, Users } from "lucide-react";

const pages = (S: Parameters<StructureResolver>[0], group: string, title: string, icon: React.ComponentType) =>
  S.listItem()
    .title(title)
    .icon(icon)
    .child(S.documentList().title(title).schemaType("page").filter('_type == "page" && group == $group').params({ group }).defaultOrdering([{ field: "order", direction: "asc" }]));

/** Sidebar: Settings, pages by group, Team. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Capital Investment LLC")
    .items([
      S.listItem().title("Site settings").id("siteSettings").icon(Cog).child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site settings")),
      S.divider(),
      pages(S, "company", "Company pages", Home),
      pages(S, "services", "Services", Building2),
      pages(S, "locations", "Service areas", MapPin),
      pages(S, "forms", "Contact & forms", Send),
      pages(S, "legal", "Legal", Scale),
      S.listItem().title("All pages").icon(FileText).child(S.documentTypeList("page").title("All pages").defaultOrdering([{ field: "order", direction: "asc" }])),
      S.divider(),
      S.listItem().title("Team").icon(Users).child(S.documentTypeList("teamMember").title("Team").defaultOrdering([{ field: "order", direction: "asc" }])),
    ]);
