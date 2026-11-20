/*
 * Service-in-a-city pages (TTR-2490, branch rory/capital-batch-1). Drafts for
 * Reza's review: nothing here is live until the client approves it.
 *
 * Facts come only from the client brain and the live site: the offices and
 * phones in lib/data/site.ts, the five services, the licensed states (MD, VA,
 * DC, FL), the in-house legal review, the exclusive off-market listings, the
 * client types listed on the site, and the closed deals shown on the home page
 * (named by property and type, never by price). No prices, returns, promises,
 * investment advice or booking language. Each page opens with Reza's author
 * line on its own line, as the brain asks.
 */
import type { Page } from "@/lib/types";

const AUTHOR = "_Written by Reza Sabaii, Esq., CEO, principal broker and attorney, Capital Investment LLC_";
const chat = { label: "Let's Chat", href: "#chat" };

export const areaPages: Page[] = [
  /* ---------- 1. Commercial real estate brokerage in Miami, FL ---------- */
  {
    path: "/commercial-real-estate-brokerage-miami-fl/",
    title: "Commercial Real Estate Brokerage in Miami, FL",
    group: "locations",
    order: 40,
    areaServed: "Miami, FL",
    seo: {
      title: "Commercial Real Estate Brokerage in Miami, FL | Capital Investment LLC",
      description: "Attorney-led commercial real estate brokerage at 777 Brickell Avenue, Miami: sales, acquisitions, leasing, valuation and property management.",
    },
    sections: [
      {
        _type: "hero",
        heading: "Commercial Real Estate Brokerage in Miami, FL",
        image: { src: "/images/places/miami-night-skyline.webp", alt: "Miami skyline at night", width: 2400, height: 1607 },
        overlay: 0.4,
        position: "center",
        hFont: "serif",
        _key: "s1",
      },
      {
        _type: "intro",
        heading: "An Attorney-Led *Brokerage on Brickell Avenue*",
        text: [
          "Capital Investment LLC is a commercial real estate brokerage with an office at 777 Brickell Avenue, Suite 160, in Miami, FL. Attorney Reza Sabaii founded the firm in 2014 and leads it as CEO and principal broker. In Miami the firm brokers commercial sales, acquisitions and leases for investors, business owners and property owners.",
          AUTHOR,
          "Because the principal broker is also an attorney, contracts, leases and other deal documents are reviewed in house by the same firm that works on the deal.",
        ],
        image: { src: "/images/events/miami-team.webp", alt: "Capital Investment LLC team members in Miami", width: 693, height: 552 },
        imageSide: "right",
        button: chat,
        hFont: "sans",
        _key: "s2",
      },
      {
        _type: "article",
        heading: "How Commercial Brokerage Works With Capital Investment LLC in Miami",
        body: [
          "## What does a commercial real estate brokerage do?",
          "A commercial real estate brokerage represents one side of a purchase, sale or lease of property used for business or investment. That includes office, retail and industrial buildings, mixed-use property and land. The broker finds and screens property or buyers, works through terms with the other side and keeps the deal moving to closing.",
          "## Which brokerage services does the firm offer in Miami?",
          "- [Investment sales and acquisitions](/services/investment-sales-and-acquisition-services/) for buyers and sellers of commercial property.",
          "- [Landlord and tenant representation](/services/landlord-and-tenant-representation/) for leases on either side of the table.",
          "- [Valuation and consultation](/services/valuation-consultation/) when an owner or buyer needs a view of what a property is worth.",
          "- [Commercial property management](/services/property-management/) for owners who want the day-to-day handled.",
          "- [Development services and project management](/services/development-services-and-project-management/) for builders and developers.",
          "## Who does the firm work with in Miami?",
          "The firm's clients include local and foreign investors, real estate developers, business owners, property owners, landowners and builders, and private equity firms.",
          "## Does the firm have listings that are not on the open market?",
          "Yes. Alongside publicly listed property, the firm offers exclusive off-market listings. Read more on our page about [off-market commercial properties in Miami](/off-market-commercial-properties-miami-fl/).",
          "## Where can I read about Miami neighborhoods?",
          "Our [Miami, Florida page](/locations/miami-florida/) covers the city and its business districts, and our [Brickell page](/locations/brickell-miami/) covers the district where the Miami office sits.",
        ],
        hFont: "sans",
        _key: "s3",
      },
      {
        _type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "Is Capital Investment LLC licensed in Florida?",
            answer: ["Yes. The firm is licensed in Florida, and also in Maryland, Virginia and Washington, DC."],
          },
          {
            question: "Where is the Miami office?",
            answer: ["The Miami office is at 777 Brickell Avenue, Suite 160, Miami, FL 33131. The phone number is (305) 404-6426, also written 305.404.MIAMI."],
          },
          {
            question: "Who leads the firm?",
            answer: ["Reza Sabaii, Esq., an attorney, founded Capital Investment LLC in 2014 and serves as its CEO and principal broker."],
          },
          {
            question: "What does in-house legal review mean for a Miami deal?",
            answer: ["The firm is attorney-owned, so purchase contracts, leases and other deal documents are reviewed within the firm instead of being sent out for a first read."],
          },
          {
            question: "Does the firm work with foreign investors?",
            answer: ["Yes. Local and foreign investors are both among the clients the firm works with."],
          },
        ],
        hFont: "sans",
        _key: "s4",
      },
      {
        _type: "cta",
        heading: "Talk With Our Miami Team",
        text: ["Tell us about the property, the space or the investment you have in mind. Use the form, or call the Miami office at (305) 404-6426."],
        button: chat,
        hFont: "sans",
        _key: "s5",
      },
    ],
  },

  /* ---------- 2. Tenant representation in Miami, FL ---------- */
  {
    path: "/tenant-representation-miami-fl/",
    title: "Tenant Representation in Miami, FL",
    group: "locations",
    order: 41,
    areaServed: "Miami, FL",
    seo: {
      title: "Commercial Tenant Representation in Miami, FL | Capital Investment LLC",
      description: "Tenant representation for businesses leasing commercial space in Miami, from an attorney-led brokerage at 777 Brickell Avenue, with in-house lease review.",
    },
    sections: [
      {
        _type: "hero",
        heading: "Commercial Tenant Representation in Miami, FL",
        image: { src: "/images/places/downtown-miami-towers.webp", alt: "Office towers in downtown Miami", width: 1200, height: 800 },
        overlay: 0.4,
        position: "center",
        hFont: "serif",
        _key: "s1",
      },
      {
        _type: "intro",
        heading: "A Broker on the *Tenant's Side of the Lease*",
        text: [
          "Capital Investment LLC represents businesses that are looking for commercial space to lease in Miami, FL. The work is part of the firm's landlord and tenant representation service and runs from its office at 777 Brickell Avenue, Suite 160. The firm is led by Reza Sabaii, its CEO, principal broker and an attorney, so lease documents are reviewed in house.",
          AUTHOR,
          "This page explains what a tenant representative does and which parts of a commercial lease deserve a close read.",
        ],
        image: { src: "/images/services/clients-reviewing-documents.webp", alt: "Clients reviewing lease documents with an advisor", width: 603, height: 433 },
        imageSide: "right",
        button: chat,
        hFont: "sans",
        _key: "s2",
      },
      {
        _type: "article",
        heading: "What Tenant Representation Covers",
        body: [
          "## What is tenant representation?",
          "Tenant representation means a broker works for the business that needs space, not for the building owner. The work usually covers setting out what the business needs, finding and viewing options, comparing proposals, negotiating the terms and reading the lease before it is signed.",
          "## Why does it matter which side the broker is on?",
          "In most leases the landlord already has a broker, and that broker's job is the landlord's side. A tenant with its own representative has someone whose job is the tenant's side of each term.",
          "## Which lease terms deserve a close read?",
          "- Base rent and how it changes over the term.",
          "- Operating expenses, taxes and insurance, and which of them the tenant pays.",
          "- Length of the term, and any renewal, expansion or early exit options.",
          "- Improvement allowance, and who builds out the space.",
          "- The use clause, and the rules on assigning the lease or subletting.",
          "- Any personal guarantee or security deposit the landlord asks for.",
          "## How does the firm's legal background apply to leases?",
          "The firm's principal broker is an attorney, so the lease and related documents are reviewed inside the firm as part of the same engagement.",
          "## Does the firm also represent landlords?",
          "Yes. Owners who need tenants can read about the other side of this service on our [landlord and tenant representation](/services/landlord-and-tenant-representation/) page.",
        ],
        hFont: "sans",
        _key: "s3",
      },
      {
        _type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "What kinds of space does the firm help tenants lease in Miami?",
            answer: ["Commercial space, including office, retail and industrial property."],
          },
          {
            question: "Is Capital Investment LLC licensed in Florida?",
            answer: ["Yes. The firm is licensed in Florida, and also in Maryland, Virginia and Washington, DC."],
          },
          {
            question: "Who reviews the lease?",
            answer: ["The firm is attorney-owned. Its CEO and principal broker, Reza Sabaii, Esq., is an attorney, and lease documents are reviewed in house."],
          },
          {
            question: "Where is the Miami office?",
            answer: ["777 Brickell Avenue, Suite 160, Miami, FL 33131. Phone (305) 404-6426."],
          },
        ],
        hFont: "sans",
        _key: "s4",
      },
      {
        _type: "cta",
        heading: "Looking for Commercial Space in Miami?",
        text: ["Tell us what your business needs: the type of space, the size and the area. Use the form, or call the Miami office at (305) 404-6426."],
        button: chat,
        hFont: "sans",
        _key: "s5",
      },
    ],
  },

  /* ---------- 3. Off-market commercial properties in Miami, FL ---------- */
  {
    path: "/off-market-commercial-properties-miami-fl/",
    title: "Off-Market Commercial Properties in Miami, FL",
    group: "locations",
    order: 42,
    areaServed: "Miami, FL",
    seo: {
      title: "Off-Market Commercial Properties in Miami, FL | Capital Investment LLC",
      description: "Capital Investment LLC offers exclusive off-market commercial listings in Miami. What off-market means, why owners sell that way and what buyers check.",
    },
    sections: [
      {
        _type: "hero",
        heading: "Off-Market Commercial Properties in Miami, FL",
        image: { src: "/images/places/brickell-skyline.webp", alt: "Brickell skyline and Biscayne Bay, Miami", width: 1920, height: 720 },
        overlay: 0.4,
        position: "center",
        hFont: "serif",
        _key: "s1",
      },
      {
        _type: "intro",
        heading: "Exclusive Listings *Beyond the Open Market*",
        text: [
          "Capital Investment LLC offers exclusive off-market commercial listings in Miami, FL, along with property listed on the open market. An off-market property is for sale without a public listing, so it is shown only to buyers the seller and broker choose. The firm works from 777 Brickell Avenue and is led by Reza Sabaii, its CEO, principal broker and an attorney.",
          AUTHOR,
          "Off-market listings are not posted on this website. To ask what is available in Miami, contact the Miami office.",
        ],
        image: { src: "/images/services/handshake.webp", alt: "Two people shaking hands over a deal", width: 603, height: 541 },
        imageSide: "right",
        button: chat,
        hFont: "sans",
        _key: "s2",
      },
      {
        _type: "article",
        heading: "What Buyers and Sellers Should Know About Off-Market Deals",
        body: [
          "## What is an off-market commercial property?",
          "It is a property whose owner is willing to sell but has not listed it publicly. Instead of a public marketing campaign, the property is shown privately to a small group of buyers.",
          "## Why do some owners sell off market?",
          "- To keep the sale private from tenants, staff or competitors.",
          "- To share the property's income and expense figures with fewer people.",
          "- To talk with a few serious buyers before deciding whether to sell at all.",
          "## What should a buyer check on an off-market property?",
          "The same things as on any commercial purchase. With fewer buyers looking, there is no wide public test of the price, so the property's own numbers carry more weight.",
          "- Rent roll, lease terms and the tenants behind them.",
          "- Operating expenses and their history.",
          "- Physical condition of the building and its systems.",
          "- Zoning and the uses the property allows.",
          "- Recent sales of comparable property nearby.",
          "## Can an owner sell this way through the firm?",
          "Yes. Owners who want a quieter sale can talk to the firm about an off-market listing through our [investment sales and acquisitions](/services/investment-sales-and-acquisition-services/) service. Purchase documents are reviewed in house, since the firm is attorney-owned.",
        ],
        hFont: "sans",
        _key: "s3",
      },
      {
        _type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "Is an off-market property a better deal?",
            answer: ["Not by default. A property's value rests on its income, its condition and its market, whether or not it was listed publicly. That is why the same checks apply."],
          },
          {
            question: "Are the firm's off-market listings shown online?",
            answer: ["No. They are not posted on this website. Contact the Miami office to ask what is available."],
          },
          {
            question: "Does the firm work with foreign buyers?",
            answer: ["Yes. The firm works with both local and foreign investors."],
          },
          {
            question: "Is Capital Investment LLC licensed in Florida?",
            answer: ["Yes. The firm is licensed in Florida, and also in Maryland, Virginia and Washington, DC."],
          },
        ],
        hFont: "sans",
        _key: "s4",
      },
      {
        _type: "cta",
        heading: "Ask About Off-Market Property in Miami",
        text: ["Tell us the property type, the area and what you want the investment to do. Use the form, or call the Miami office at (305) 404-6426."],
        button: chat,
        hFont: "sans",
        _key: "s5",
      },
    ],
  },

  /* ---------- 4. Commercial real estate brokerage in Bethesda, MD ---------- */
  {
    path: "/commercial-real-estate-brokerage-bethesda-md/",
    title: "Commercial Real Estate Brokerage in Bethesda, MD",
    group: "locations",
    order: 43,
    areaServed: "Bethesda, MD",
    seo: {
      title: "Commercial Real Estate Brokerage in Bethesda, MD | Capital Investment LLC",
      description: "Attorney-led commercial real estate brokerage with an office at 7809 Woodmont Avenue, Bethesda: sales, acquisitions, leasing, valuation and management.",
    },
    sections: [
      {
        _type: "hero",
        heading: "Commercial Real Estate Brokerage in Bethesda, MD",
        image: { src: "/images/offices/bethesda-md.webp", alt: "Bethesda, Maryland", width: 1462, height: 1271 },
        overlay: 0.4,
        position: "center",
        hFont: "serif",
        _key: "s1",
      },
      {
        _type: "intro",
        heading: "A Bethesda Office on *Woodmont Avenue*",
        text: [
          "Capital Investment LLC is a commercial real estate brokerage with an office at 7809 Woodmont Avenue, Suite 3A, in Bethesda, MD. The firm brokers commercial sales, acquisitions and leases, and also offers valuation, property management and development services. Attorney Reza Sabaii founded the firm in 2014 and leads it as CEO and principal broker.",
          AUTHOR,
          "The firm is licensed in Maryland, and deal documents are reviewed in house because the principal broker is an attorney.",
        ],
        image: { src: "/images/places/maryland-office-building.webp", alt: "Office building in Maryland", width: 610, height: 558 },
        imageSide: "right",
        button: chat,
        hFont: "sans",
        _key: "s2",
      },
      {
        _type: "article",
        heading: "Commercial Brokerage From the Bethesda Office",
        body: [
          "## Which services does the firm offer in Bethesda?",
          "- [Investment sales and acquisitions](/services/investment-sales-and-acquisition-services/) for buyers and sellers of commercial property.",
          "- [Landlord and tenant representation](/services/landlord-and-tenant-representation/) for office, retail and other commercial leases.",
          "- [Valuation and consultation](/services/valuation-consultation/) when a decision depends on what a property is worth.",
          "- [Commercial property management](/services/property-management/) for owners.",
          "- [Development services and project management](/services/development-services-and-project-management/) for builders and developers.",
          "## Has the firm closed deals nearby?",
          "Yes. The closed deals shown on our home page include a light industrial property at 2355 Lewis Avenue in Rockville, MD, in Montgomery County like Bethesda.",
          "## Who does the firm work with?",
          "Local and foreign investors, real estate developers, business owners, property owners, landowners and builders, and private equity firms.",
          "## What is different about an attorney-owned brokerage?",
          "The principal broker is an attorney, so contracts, leases and other deal documents are reviewed within the firm, by the same team that works on the deal.",
          "## Where can I read more about the firm in Maryland?",
          "Our [Maryland page](/locations/maryland/) covers the firm's work across the state. The firm also has an office in Washington, DC, at 6323 Georgia Avenue NW, Suite 107.",
        ],
        hFont: "sans",
        _key: "s3",
      },
      {
        _type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "Is Capital Investment LLC licensed in Maryland?",
            answer: ["Yes. The firm is licensed in Maryland, and also in Virginia, Washington, DC and Florida."],
          },
          {
            question: "Where is the Bethesda office?",
            answer: ["7809 Woodmont Avenue, Suite 3A, Bethesda, MD 20814. Phone (240) 792-7525."],
          },
          {
            question: "Does the firm handle leases as well as sales in Bethesda?",
            answer: ["Yes. The firm represents both landlords and tenants on commercial leases, as well as buyers and sellers."],
          },
          {
            question: "Who leads the firm?",
            answer: ["Reza Sabaii, Esq., an attorney, founded Capital Investment LLC in 2014 and serves as its CEO and principal broker."],
          },
        ],
        hFont: "sans",
        _key: "s4",
      },
      {
        _type: "cta",
        heading: "Talk With Our Bethesda Office",
        text: ["Tell us about the property, the space or the investment you have in mind. Use the form, or call the Bethesda office at (240) 792-7525."],
        button: chat,
        hFont: "sans",
        _key: "s5",
      },
    ],
  },

  /* ---------- 5. Commercial real estate brokerage in Vienna, VA ---------- */
  {
    path: "/commercial-real-estate-brokerage-vienna-va/",
    title: "Commercial Real Estate Brokerage in Vienna, VA",
    group: "locations",
    order: 44,
    areaServed: "Vienna, VA",
    seo: {
      title: "Commercial Real Estate Brokerage in Vienna, VA | Capital Investment LLC",
      description: "Attorney-led commercial real estate brokerage at 8230 Old Courthouse Road, Vienna, VA: sales, acquisitions, leasing, valuation and management.",
    },
    sections: [
      {
        _type: "hero",
        heading: "Commercial Real Estate Brokerage in Vienna, VA",
        image: { src: "/images/offices/tysons-va.webp", alt: "Office buildings near the firm's Vienna, Virginia office", width: 1462, height: 1241 },
        overlay: 0.4,
        position: "center",
        hFont: "serif",
        _key: "s1",
      },
      {
        _type: "intro",
        heading: "Our Office on *Old Courthouse Road*",
        text: [
          "Capital Investment LLC is a commercial real estate brokerage with an office at 8230 Old Courthouse Road, Suite 110, in Vienna, VA, the office our site lists as Tysons Corner. The firm brokers commercial sales, acquisitions and leases, and also offers valuation, property management and development services. Attorney Reza Sabaii founded the firm in 2014 and leads it as CEO and principal broker.",
          AUTHOR,
          "The firm is licensed in Virginia, and deal documents are reviewed in house because the principal broker is an attorney.",
        ],
        image: { src: "/images/events/partners-talking.webp", alt: "Capital Investment LLC partners in conversation", width: 693, height: 450 },
        imageSide: "right",
        button: chat,
        hFont: "sans",
        _key: "s2",
      },
      {
        _type: "article",
        heading: "Commercial Brokerage From the Vienna Office",
        body: [
          "## Which services does the firm offer in Vienna?",
          "- [Investment sales and acquisitions](/services/investment-sales-and-acquisition-services/) for buyers and sellers of commercial property.",
          "- [Landlord and tenant representation](/services/landlord-and-tenant-representation/) for office, retail, flex and other commercial leases.",
          "- [Valuation and consultation](/services/valuation-consultation/) when a decision depends on what a property is worth.",
          "- [Commercial property management](/services/property-management/) for owners.",
          "- [Development services and project management](/services/development-services-and-project-management/) for builders and developers.",
          "## Has the firm closed deals nearby?",
          "Yes. The closed deals shown on our home page include an office property at 8230 Old Courthouse Road, the same address as the firm's office, and a flex office and industrial property at 365 Herndon Parkway in Herndon, VA.",
          "## Who does the firm work with?",
          "Local and foreign investors, real estate developers, business owners, property owners, landowners and builders, and private equity firms.",
          "## What is different about an attorney-owned brokerage?",
          "The principal broker is an attorney, so contracts, leases and other deal documents are reviewed within the firm, by the same team that works on the deal.",
          "## Where can I read more about the firm in Virginia?",
          "Our [Virginia page](/locations/virginia/) and our [Fairfax County page](/locations/fairfax-county/) cover the firm's work in the area. For a deal further out in Loudoun County, see our page on [commercial real estate brokerage in Leesburg, VA](/commercial-real-estate-brokerage-leesburg-va/).",
        ],
        hFont: "sans",
        _key: "s3",
      },
      {
        _type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "Is Capital Investment LLC licensed in Virginia?",
            answer: ["Yes. The firm is licensed in Virginia, and also in Maryland, Washington, DC and Florida."],
          },
          {
            question: "Where is the Vienna office?",
            answer: ["8230 Old Courthouse Road, Suite 110, Vienna, VA 22182. Phone (571) 540-8688."],
          },
          {
            question: "Does the firm handle leases as well as sales in Vienna?",
            answer: ["Yes. The firm represents both landlords and tenants on commercial leases, as well as buyers and sellers."],
          },
          {
            question: "Who leads the firm?",
            answer: ["Reza Sabaii, Esq., an attorney, founded Capital Investment LLC in 2014 and serves as its CEO and principal broker."],
          },
        ],
        hFont: "sans",
        _key: "s4",
      },
      {
        _type: "cta",
        heading: "Talk With Our Vienna Office",
        text: ["Tell us about the property, the space or the investment you have in mind. Use the form, or call the Vienna office at (571) 540-8688."],
        button: chat,
        hFont: "sans",
        _key: "s5",
      },
    ],
  },

  /* ---------- 6. Commercial real estate brokerage in Leesburg, VA ---------- */
  {
    path: "/commercial-real-estate-brokerage-leesburg-va/",
    title: "Commercial Real Estate Brokerage in Leesburg, VA",
    group: "locations",
    order: 45,
    areaServed: "Leesburg, VA",
    seo: {
      title: "Commercial Real Estate Brokerage in Leesburg, VA | Capital Investment LLC",
      description: "Commercial real estate brokerage for Leesburg, VA from an attorney-led firm whose closed deals include net-lease retail with Dunkin' and Five Guys.",
    },
    sections: [
      {
        _type: "hero",
        heading: "Commercial Real Estate Brokerage in Leesburg, VA",
        image: { src: "/images/places/virginia-skyline-sunset.webp", alt: "Virginia skyline at sunset beside a river", width: 1920, height: 1280 },
        overlay: 0.4,
        position: "center",
        hFont: "serif",
        _key: "s1",
      },
      {
        _type: "intro",
        heading: "Commercial Brokerage *for Leesburg Property*",
        text: [
          "Capital Investment LLC brokers commercial sales, acquisitions and leases for property in Leesburg, VA. The firm's closed deals, shown on our home page, include a net-lease retail property in Leesburg with Dunkin' and Five Guys. The nearest office is at 8230 Old Courthouse Road, Suite 110, in Vienna, VA, and the firm is led by Reza Sabaii, its CEO, principal broker and an attorney.",
          AUTHOR,
          "The firm is licensed in Virginia, and deal documents are reviewed in house because the principal broker is an attorney.",
        ],
        image: { src: "/images/services/building-facades.webp", alt: "Commercial building facades", width: 603, height: 541 },
        imageSide: "right",
        button: chat,
        hFont: "sans",
        _key: "s2",
      },
      {
        _type: "article",
        heading: "Commercial Brokerage for Leesburg Owners, Buyers and Tenants",
        body: [
          "## What is a net-lease retail property?",
          "It is a retail building leased to a tenant who pays some or all of the property's operating costs, such as taxes, insurance and upkeep, on top of rent. The exact split depends on the lease. Buyers of these properties look closely at the tenant, the length of the lease left and who pays which costs.",
          "## Which services does the firm offer for Leesburg property?",
          "- [Investment sales and acquisitions](/services/investment-sales-and-acquisition-services/) for buyers and sellers, including net-lease retail.",
          "- [Landlord and tenant representation](/services/landlord-and-tenant-representation/) for commercial leases.",
          "- [Valuation and consultation](/services/valuation-consultation/), covered for Leesburg on our page about [commercial property valuation and consultation in Leesburg, VA](/commercial-property-valuation-consultation-leesburg-va/).",
          "- [Commercial property management](/services/property-management/) for owners.",
          "- [Development services and project management](/services/development-services-and-project-management/) for builders and developers.",
          "## Who does the firm work with?",
          "Local and foreign investors, real estate developers, business owners, property owners, landowners and builders, and private equity firms.",
          "## Where is the firm's nearest office?",
          "In Vienna, VA. Read more on our page about [commercial real estate brokerage in Vienna, VA](/commercial-real-estate-brokerage-vienna-va/) and on our [Virginia page](/locations/virginia/).",
        ],
        hFont: "sans",
        _key: "s3",
      },
      {
        _type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "Has Capital Investment LLC closed a deal in Leesburg?",
            answer: ["Yes. The firm's closed deals include a net-lease retail property in Leesburg, VA with Dunkin' and Five Guys."],
          },
          {
            question: "Is Capital Investment LLC licensed in Virginia?",
            answer: ["Yes. The firm is licensed in Virginia, and also in Maryland, Washington, DC and Florida."],
          },
          {
            question: "Which office serves Leesburg?",
            answer: ["The Vienna office, at 8230 Old Courthouse Road, Suite 110, Vienna, VA 22182. Phone (571) 540-8688."],
          },
          {
            question: "Who leads the firm?",
            answer: ["Reza Sabaii, Esq., an attorney, founded Capital Investment LLC in 2014 and serves as its CEO and principal broker."],
          },
        ],
        hFont: "sans",
        _key: "s4",
      },
      {
        _type: "cta",
        heading: "Talk With Us About Leesburg Property",
        text: ["Tell us about the property, the space or the investment you have in mind. Use the form, or call the Vienna office at (571) 540-8688."],
        button: chat,
        hFont: "sans",
        _key: "s5",
      },
    ],
  },

  /* ---------- 8. Commercial property valuation and consultation in Leesburg, VA ---------- */
  {
    path: "/commercial-property-valuation-consultation-leesburg-va/",
    title: "Commercial Property Valuation and Consultation in Leesburg, VA",
    group: "locations",
    order: 46,
    areaServed: "Leesburg, VA",
    seo: {
      title: "Commercial Property Valuation in Leesburg, VA | Capital Investment LLC",
      description: "Commercial property valuation and consultation in Leesburg, VA from an attorney-led brokerage whose closed deals include Leesburg net-lease retail.",
    },
    sections: [
      {
        _type: "hero",
        heading: "Commercial Property Valuation and Consultation in Leesburg, VA",
        image: { src: "/images/heroes/glass-office-building.webp", alt: "Glass office building", width: 2400, height: 877 },
        overlay: 0.4,
        position: "center",
        hFont: "serif",
        _key: "s1",
      },
      {
        _type: "intro",
        heading: "A View of Value *Tied to a Decision*",
        text: [
          "Capital Investment LLC offers commercial property valuation and consultation for owners, buyers and investors with property in Leesburg, VA. It is one of the firm's five services, and the firm's closed deals include a net-lease retail property in Leesburg with Dunkin' and Five Guys. The work is led by Reza Sabaii, the firm's CEO, principal broker and an attorney.",
          AUTHOR,
          "This page explains what goes into a commercial valuation and when Leesburg owners and buyers tend to ask for one.",
        ],
        image: { src: "/images/services/valuation-document.webp", alt: "Valuation document on a desk", width: 603, height: 541 },
        imageSide: "right",
        button: chat,
        hFont: "sans",
        _key: "s2",
      },
      {
        _type: "article",
        heading: "What a Commercial Valuation Looks At",
        body: [
          "## What does a commercial property valuation weigh?",
          "It starts from what the property earns and what similar property has sold for. The usual inputs are:",
          "- The rent roll and the terms of each lease.",
          "- Operating expenses, and which of them the tenants pay.",
          "- Sales of comparable property in the area.",
          "- The building's condition and any work it needs.",
          "- Zoning and the uses the property allows.",
          "## How is a net-lease property valued?",
          "Mostly through its lease. The tenant, the years left on the lease, the rent steps and which costs the tenant pays shape what a buyer will look at, which is why the lease is read line by line.",
          "## When do owners and buyers ask for a valuation?",
          "- Before deciding whether to sell, hold or buy, often alongside our [investment sales and acquisitions](/services/investment-sales-and-acquisition-services/) work.",
          "- When a lease is up for renewal or a space is being re-leased.",
          "- When an offer arrives and the owner wants an independent view of it.",
          "## Is a valuation the same as an appraisal or a tax assessment?",
          "No. A lender's appraisal supports a loan, and a local tax assessment sets a tax bill. A market valuation asks what the property is worth to buyers today. The three numbers often differ.",
          "## Where can I read more?",
          "See our [valuation and consultation](/services/valuation-consultation/) service page, and our page on [commercial real estate brokerage in Leesburg, VA](/commercial-real-estate-brokerage-leesburg-va/).",
        ],
        hFont: "sans",
        _key: "s3",
      },
      {
        _type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "Does Capital Investment LLC offer valuation and consultation in Leesburg?",
            answer: ["Yes. Valuation and consultation is one of the firm's five services, and the firm works on Leesburg property from its Vienna office."],
          },
          {
            question: "Is a valuation a tax appeal?",
            answer: ["No. A valuation is a view of market value. It is not a tax appeal filing."],
          },
          {
            question: "Is Capital Investment LLC licensed in Virginia?",
            answer: ["Yes. The firm is licensed in Virginia, and also in Maryland, Washington, DC and Florida."],
          },
          {
            question: "Which office serves Leesburg?",
            answer: ["The Vienna office, at 8230 Old Courthouse Road, Suite 110, Vienna, VA 22182. Phone (571) 540-8688."],
          },
        ],
        hFont: "sans",
        _key: "s4",
      },
      {
        _type: "cta",
        heading: "Talk With Us About a Leesburg Property",
        text: ["Tell us about the property and the decision in front of you. Use the form, or call the Vienna office at (571) 540-8688."],
        button: chat,
        hFont: "sans",
        _key: "s5",
      },
    ],
  },
];
