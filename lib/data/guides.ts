/*
 * Built-in guide content (fallback for Sanity and source of the seed export).
 * Same pattern as lib/data/pages.ts: the guides live in Sanity as documents of
 * type "guide"; this file is what `npm run export:guides` turns into
 * content/guides/guides.seed.json, and what the site shows until Sanity has them.
 *
 * Every statistic names its public source in the text and in `sources`.
 * Figures were read on 2026-11-09. Nothing here is legal, tax or investment advice.
 */
import type { Guide } from "@/lib/types";

const READ = "Read on November 9, 2026";

const DISCLAIMER = [
  "This guide is general information for people exploring commercial real estate. It is not legal, tax, accounting or investment advice, and it does not promise any result or return. Figures come from the public sources listed above, as read on November 9, 2026, and can change. Please speak with your own attorney, tax adviser, lender and other advisers before you make a decision.",
];

export const fallbackGuides: Guide[] = [
  {
    slug: "investing-in-washington-dc-commercial-real-estate",
    title: "Investing in Washington, D.C. commercial real estate: what investors should know",
    excerpt: "A plain guide to the D.C. office market, the District's commercial property tax rates, closing costs and the rules foreign investors should ask about, with every figure sourced.",
    seo: {
      title: "D.C. Commercial Real Estate Guide | Capital Investment LLC",
      description: "A plain guide for investors on the Washington, D.C. office market, property tax rates, closing costs and foreign investor rules, with every figure sourced.",
    },
    authorSlug: "reza-sabaii-esq",
    publishedAt: "2026-11-09",
    body: [
      "Washington, D.C. is the capital of the United States and a commercial real estate market with its own tax rules, its own zoning rules and its own pace. Investors who know other cities often find that the District works differently, so it helps to start with what can be checked.",
      "This guide walks through the office market, the cost of holding commercial property, what happens at closing and what foreign investors should ask about. Every figure names a public source, and the guide ends with questions to take to your own advisers.",
      "## Where does the D.C. office market stand right now?",
      "Two widely read brokerage reports for the third quarter of 2026 describe the market in different ways. Both are worth reading.",
      "- [Cushman & Wakefield's Washington, DC office MarketBeat](https://www.cushmanwakefield.com/en/united-states/insights/us-marketbeats/washington-dc-marketbeats/office) for Q3 2026 says vacancy rose to 23.5%, up 20 basis points from the prior quarter and up 140 basis points from a year earlier. It also reports 123,800 square feet of negative absorption and gross leasing of just over 1.7 million square feet, made up of roughly 980,000 square feet of new deals and 773,000 square feet of renewals.",
      "- [CBRE's Washington DC office figures](https://www.cbre.com/insights/figures/washington-dc-office-figures-q3-2026) for Q3 2026, published on September 30, 2026, report 360,154 square feet of positive absorption and a 40 basis point decline in overall vacancy. CBRE also reports prime (trophy) vacancy of 8.3%.",
      "### Why do two reports point in different directions?",
      "Each firm decides which buildings to count and how to measure vacancy and absorption, so the same quarter can read differently. Before you rely on a number, read how the report defines it.",
      "### What does that mean for an investor?",
      "A citywide average combines buildings of very different quality, age and location. Neither report tells you how one particular building will perform, so ask for the figures that match the submarket and class of building you are considering, and ask what they are based on.",
      "## What does it cost to hold commercial property in the District?",
      "The District's Office of Tax and Revenue (OTR) publishes real property tax rates. Commercial and industrial property, including hotels and motels, falls in Class 2. OTR's rate table lists these Class 2 rates, per $100 of assessed value:",
      "- $1.65 if assessed value is not greater than $5 million",
      "- $1.77 if assessed value is greater than $5 million but not greater than $10 million",
      "- $1.89 if assessed value is greater than $10 million",
      "OTR notes that rates are set by the Council of the District of Columbia and may change from year to year. Confirm the rate for the tax year of your purchase, and ask your tax adviser how it applies to a specific property.",
      "### What else shows up at closing?",
      "Deeds in the District are recorded with the Recorder of Deeds, which is part of OTR, and the District charges recordation and transfer taxes on many transactions. The rates and exemptions have changed over the years, so ask your attorney or title company to confirm the figures that apply on your closing date.",
      "## What should foreign investors know?",
      "Foreign investors are active in U.S. commercial real estate, and the federal rules deserve attention early. The IRS explains that withholding under the Foreign Investment in Real Property Tax Act (FIRPTA) generally is 15% when a foreign person disposes of a U.S. real property interest. The IRS page also describes reduced withholding and exceptions in some situations.",
      "FIRPTA can matter when you buy from a foreign owner and when you eventually sell. The rules depend on who the seller is and how the transaction is structured, so speak with a U.S. tax adviser before you sign.",
      "## What should you check before making an offer?",
      "Every property is different, but a short list of questions applies almost everywhere in the District:",
      "- What uses does the zoning allow, and do they fit your plan?",
      "- What is the current assessed value and tax class, and what could change after a sale?",
      "- When do the leases expire, what renewal options exist and how varied is the tenant mix?",
      "- What is the condition of the roof, mechanical systems and elevators, and what capital spending could come next?",
      "- How does the building compare with others in its submarket and class, using figures for that group rather than a citywide average?",
      "- What do the title work, survey and environmental reports show?",
      "- What financing is available, and on what terms?",
      "## How does D.C. connect to the wider Washington region?",
      "Many investors look at the District alongside Northern Virginia and suburban Maryland. Each has its own taxes, rules and rhythm. Our companion guide, [Northern Virginia commercial real estate, Tysons and Vienna](/guides/northern-virginia-commercial-real-estate-tysons-vienna/), covers the Virginia side. You can also read about our work in [Washington, D.C.](/locations/washington-dc/), [Virginia](/locations/virginia/) and [Maryland](/locations/maryland/).",
      "## What questions should you take to your own advisers?",
      "- Which entity should hold the property, and what does that mean for liability and taxes?",
      "- How do the District's property tax, recordation and transfer taxes apply to this deal?",
      "- If I am a foreign investor, how do FIRPTA and other federal rules apply to me?",
      "- What are my financing options, and what do lenders in this market expect?",
      "- What insurance and reserves does this type of building call for?",
      "## How can Capital Investment LLC help?",
      "Capital Investment LLC works with investors, developers, property owners and landowners on commercial real estate in the Washington, D.C. area and Miami. If you would like to talk through a property or a plan, we are glad to start with a conversation.",
    ],
    sources: [
      { label: "Washington, DC Office MarketBeat, Q3 2026", publisher: "Cushman & Wakefield", url: "https://www.cushmanwakefield.com/en/united-states/insights/us-marketbeats/washington-dc-marketbeats/office", date: READ, note: "Vacancy 23.5%, absorption and leasing figures." },
      { label: "Washington DC Office Figures, Q3 2026", publisher: "CBRE", url: "https://www.cbre.com/insights/figures/washington-dc-office-figures-q3-2026", date: "Published September 30, 2026. Read on November 9, 2026", note: "Absorption, vacancy change and prime vacancy." },
      { label: "Real property tax rates", publisher: "District of Columbia Office of Tax and Revenue", url: "https://otr.cfo.dc.gov/page/real-property-tax-rates", date: READ, note: "Class 2 rate table. The page does not state a tax year." },
      { label: "Recorder of Deeds", publisher: "District of Columbia Office of Tax and Revenue", url: "https://otr.cfo.dc.gov/page/recorder-deeds", date: READ },
      { label: "FIRPTA withholding", publisher: "Internal Revenue Service", url: "https://www.irs.gov/individuals/international-taxpayers/firpta-withholding", date: READ, note: "Generally 15% withholding rate." },
    ],
    related: [
      { label: "Commercial real estate services in Washington, D.C.", href: "/locations/washington-dc/" },
      { label: "Northern Virginia guide: Tysons and Vienna", href: "/guides/northern-virginia-commercial-real-estate-tysons-vienna/" },
      { label: "Investment sales and acquisition services", href: "/services/investment-sales-and-acquisition-services/" },
      { label: "Valuation and consultation", href: "/services/valuation-consultation/" },
    ],
    disclaimer: DISCLAIMER,
  },
  {
    slug: "northern-virginia-commercial-real-estate-tysons-vienna",
    title: "Northern Virginia commercial real estate, Tysons and Vienna: what investors should check",
    excerpt: "A plain guide to the Tysons and Vienna office market, the long-term Tysons plan, how local taxes differ and what to check before you buy, with every figure sourced.",
    seo: {
      title: "Tysons and Vienna Real Estate Guide | Capital Investment LLC",
      description: "A plain guide to Tysons and Vienna for investors: the office market, the Tysons plan, local taxes and what to check before buying, with sources.",
    },
    authorSlug: "reza-sabaii-esq",
    publishedAt: "2026-11-09",
    body: [
      "Tysons and Vienna sit close together in Fairfax County, Virginia, and investors often look at them in the same search. They are run differently, though, and the difference shows up in taxes, zoning and the questions worth asking before you buy.",
      "This guide covers the office market, the long-term plan for Tysons, local taxes and a practical checklist. Every figure names a public source, and the guide ends with questions to take to your own advisers.",
      "## What is the difference between Tysons and Vienna?",
      "[Fairfax County describes Tysons](https://www.fairfaxcounty.gov/tysons/) as a County \"downtown\" served by four Silver Line Metro stations.",
      "The Town of Vienna is a separate local government. It publishes its own zoning code and map, and it levies its own real estate tax. The Town's [Finance page](https://www.viennava.gov/Town-Departments/Finance/Real-Estate-Taxes) lists a rate of 19 cents per $100 of assessed value for 2026 and notes that Town residents must also pay Fairfax County real estate taxes.",
      "### Why does the address matter?",
      "Which government a property falls under decides which zoning rules and which taxes apply. A postal address alone may not answer that, so confirm jurisdiction for the exact parcel with Fairfax County and the Town of Vienna.",
      "## How is the Northern Virginia office market doing?",
      "[Cushman & Wakefield's Northern Virginia office report](https://www.cushmanwakefield.com/en/united-states/insights/us-marketbeats/washington-dc-marketbeats/northern-virginia-office) for Q3 2026 gives a mixed picture:",
      "- Overall vacancy ended the quarter at 23.6%, down 10 basis points from Q2 and up 60 basis points from a year earlier.",
      "- Net absorption was positive 413,800 square feet for the region.",
      "- Fairfax County led the region with 674,300 square feet of new leasing, which was 69% of total activity. It was also the only major market to record occupancy losses, at negative 51,600 square feet.",
      "- In Tysons, the report shows 235,600 square feet of new leasing, 86,300 square feet of renewals and positive 79,800 square feet of absorption.",
      "### What should an investor take from this?",
      "Activity and occupancy can move in different directions in the same quarter. Strong leasing does not guarantee that a particular building is full, and a regional vacancy rate does not describe one block. Ask for figures on the specific building and its competitors.",
      "## What is the long-term plan for Tysons?",
      "Fairfax County's Tysons Comprehensive Plan aims to transform Tysons, by the year 2050, into a walkable, green urban center and [home to up to 100,000 residents and 200,000 jobs](https://www.fairfaxcounty.gov/tysons/comprehensive-plan).",
      "That is a goal set out in the county's plan. It is not a forecast and it is not a guarantee. What it does tell you is the direction of local policy, so the plan's guidance for your site is worth reading closely.",
      "## What taxes and charges should you look at?",
      "Fairfax County publishes its real estate tax rates each year on its [tax rates page](https://www.fairfaxcounty.gov/taxes/real-estate/tax-rates). For Tax Year 2026 the page lists a base rate and additional districts. For commercial property it lists a Commercial Transportation Tax District and Dulles Rail transportation improvement districts, and it lists a Tysons Service District that applies to both commercial and residential owners.",
      "When we read the page, the 2026 rates were labeled as proposed. Confirm the adopted rates and which districts cover your parcel before you build a model. For property inside the Town of Vienna, add the Town's own rate.",
      "## What should you check before buying near Tysons or in Vienna?",
      "- Is the parcel in unincorporated Fairfax County or inside the Town of Vienna?",
      "- What does the Tysons Comprehensive Plan say about the site, or what does the Town's zoning say if the parcel is in Vienna?",
      "- The Town of Vienna's [zoning code and map page](https://www.viennava.gov/Town-Departments/Planning-Zoning/Zoning-Code-Map-Updates) says the code was updated by Town Council on October 23, 2023 and took effect January 1, 2024. Zoning questions for a Vienna parcel start there.",
      "- How far is the property from a Metro station, and how do tenants and visitors actually reach it?",
      "- When do the leases expire, and who are the likely replacement tenants?",
      "- How does the building compare with others of its class nearby, using figures for that group rather than a regional average?",
      "- What do the title work, survey, environmental reports and building condition reports show?",
      "## How does Northern Virginia connect to the rest of the region?",
      "Many investors compare Northern Virginia with the District and with suburban Maryland. Our companion guide, [Investing in Washington, D.C. commercial real estate](/guides/investing-in-washington-dc-commercial-real-estate/), covers the District side. You can also read about our work in [Virginia](/locations/virginia/) and [Fairfax County](/locations/fairfax-county/), and see our [office locations](/offices/).",
      "## What questions should you take to your own advisers?",
      "- Which entity should hold the property, and what does that mean for liability and taxes?",
      "- Which county and Town taxes and special districts apply to this parcel, and what will the bill look like?",
      "- What do zoning and the Tysons Comprehensive Plan allow now, and what could change?",
      "- What are my financing options, and what do lenders in this market expect?",
      "- If I am a foreign investor, which federal rules apply to me?",
      "## How can Capital Investment LLC help?",
      "Capital Investment LLC works with investors, developers, property owners and landowners on commercial real estate in the Washington, D.C. area, including an office in Tysons. If you would like to talk through a property or a plan, we are glad to start with a conversation.",
    ],
    sources: [
      { label: "Northern Virginia Office, Q3 2026", publisher: "Cushman & Wakefield", url: "https://www.cushmanwakefield.com/en/united-states/insights/us-marketbeats/washington-dc-marketbeats/northern-virginia-office", date: READ, note: "Regional vacancy, absorption and Fairfax County and Tysons leasing." },
      { label: "Tysons", publisher: "Fairfax County", url: "https://www.fairfaxcounty.gov/tysons/", date: READ, note: "Four Silver Line Metro stations." },
      { label: "Tysons Comprehensive Plan", publisher: "Fairfax County", url: "https://www.fairfaxcounty.gov/tysons/comprehensive-plan", date: READ, note: "Up to 100,000 residents and 200,000 jobs by 2050." },
      { label: "Real estate tax rates", publisher: "Fairfax County", url: "https://www.fairfaxcounty.gov/taxes/real-estate/tax-rates", date: READ, note: "Tax Year 2026 rates were labeled proposed when read." },
      { label: "Real estate taxes", publisher: "Town of Vienna, VA", url: "https://www.viennava.gov/Town-Departments/Finance/Real-Estate-Taxes", date: READ, note: "19 cents per $100 for 2026." },
      { label: "Zoning code, map and updates", publisher: "Town of Vienna, VA", url: "https://www.viennava.gov/Town-Departments/Planning-Zoning/Zoning-Code-Map-Updates", date: READ, note: "Code updated October 23, 2023, effective January 1, 2024." },
    ],
    related: [
      { label: "Commercial real estate services in Virginia", href: "/locations/virginia/" },
      { label: "Fairfax County", href: "/locations/fairfax-county/" },
      { label: "Washington, D.C. guide for investors", href: "/guides/investing-in-washington-dc-commercial-real-estate/" },
      { label: "Our offices, including Tysons", href: "/offices/" },
    ],
    disclaimer: DISCLAIMER,
  },
];

/** Banner used when a guide has none. */
export const defaultGuideBanner = { src: "/images/heroes/glass-towers.webp", alt: "Looking up at glass office towers", width: 1440, height: 526 };
