import type { SiteSettings } from "@/lib/types";
import { images } from "./images.ts";

/* Site-wide settings: offices, menu, footer, form consent. Copied from the old site's header, footer and "Let's Chat" popup. */

export const fallbackSettings: SiteSettings = {
  name: "Capital Investment LLC",
  legalName: "Capital Investment LLC",
  tagline: "Commercial Real Estate Advisors",
  phone: "(571) 540-8688",
  email: "reza@capitalinvestmentllc.com",
  offices: [
    {
      key: "tysons",
      name: "Tysons Corner, VA",
      label: "Tysons, VA",
      address: "8230 Old Courthouse Rd. Suite 110 Vienna, VA. 22182",
      longAddress: "Tysons Corner, VA. Office 8230 Old Courthouse Rd. Suite 110 Vienna, VA. 22182",
      phone: "(571) 540-8688",
      mapQuery: "8230 Old Courthouse Rd. Suite 110 Vienna, VA. 22182",
      image: images.tysons,
    },
    {
      key: "dc",
      name: "Washington, D.C.",
      label: "Washington, DC",
      address: "6323 Georgia Avenue NW Suite 107 Washington, DC 20011",
      longAddress: "Washington, DC Office: 6323 Georgia Avenue NW Suite 107 Washington, DC 20011",
      phone: "(571) 500-2661",
      mapQuery: "6323 Georgia Avenue NW Suite 107 Washington, DC 20011",
      image: images.dcOffice,
    },
    {
      key: "miami",
      name: "Miami, FL",
      label: "Miami, FL",
      address: "777 Brickell Avenue, Suite 160 Miami, FL 33131",
      longAddress: "Miami, FL Office: 777 Brickell Avenue, Suite 160 Miami, FL 33131",
      phone: "(305) 404-6426",
      mapQuery: "777 Brickell Avenue, Suite 160 Miami, FL 33131",
      image: images.miami,
    },
    {
      key: "bethesda",
      name: "Bethesda, MD",
      label: "Bethesda, MD",
      address: "7809 Woodmont Ave #3A, Bethesda, MD 20814",
      longAddress: "Bethesda, MD Office: 7809 Woodmont Ave #3A, Bethesda, MD 20814",
      phone: "(240) 792-7525",
      mapQuery: "7809 Woodmont Ave #3a, Bethesda, MD 20814",
      image: images.bethesda,
    },
  ],
  contactOffices: ["tysons", "miami"],
  social: [
    { network: "linkedin", href: "https://www.linkedin.com/company/capital-investment-llc/" },
    { network: "facebook", href: "https://www.facebook.com/capitalinvestmentllc" },
    { network: "instagram", href: "https://www.instagram.com/capitalinvestmentllc/" },
  ],
  menu: [
    {
      label: "CRE Services",
      href: "/services/",
      children: [
        { label: "Landlord & Tenant Representation", href: "/services/landlord-and-tenant-representation/" },
        { label: "Investment Sales And Acquisitions Services", href: "/services/investment-sales-and-acquisition-services/" },
        { label: "Development Services & Project Management", href: "/services/development-services-and-project-management/" },
        { label: "Property Management", href: "/services/property-management/" },
        { label: "Valuation & Consultation", href: "/services/valuation-consultation/" },
      ],
    },
    {
      label: "About",
      href: "",
      children: [
        { label: "Our Team", href: "/our-team/" },
        {
          label: "Careers",
          href: "/careers/",
          children: [
            { label: "Careers In Miami FL", href: "/careers-in-miami-fl/" },
            { label: "Careers In Washington, DC Metro", href: "/careers-in-washington-dc-metro/" },
          ],
        },
      ],
    },
    {
      label: "Service Area",
      href: "/locations/",
      children: [
        { label: "Washington DC", href: "/locations/washington-dc/" },
        {
          label: "Florida",
          href: "",
          children: [
            { label: "Miami", href: "/locations/miami-florida/" },
            { label: "Central Business District Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-central-business-district-miami/" },
            { label: "Coral Gables", href: "/locations/miami-florida/coral-gables-florida/" },
            { label: "Downtown Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-downtown-miami/" },
            { label: "Government Center Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-government-center-miami/" },
            { label: "Historic District Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-historic-district-miami/" },
            { label: "Miami Arts and Entertainment District", href: "/locations/miami-florida/commercial-real-estate-services-in-miami-arts-and-entertainment-district/" },
            { label: "Park West Miami", href: "/locations/miami-florida/commercial-real-estate-services-in-park-west-miami/" },
          ],
        },
        { label: "Virginia", href: "/locations/virginia/" },
        { label: "Maryland", href: "/locations/maryland/" },
      ],
    },
  ],
  // The old footer linked through redirects (/investments-in-miami/ etc.); these point at the pages directly.
  footerQuickLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/our-team/" },
    { label: "Contact Us", href: "/contact-us/" },
    { label: "Investment in Miami", href: "/locations/miami-florida/" },
    { label: "Investment in Washington DC", href: "/locations/washington-dc/" },
    { label: "Investment in Northern Virginia", href: "/locations/virginia/" },
  ],
  footerServiceLinks: [
    { label: "Investment Sales", href: "/services/investment-sales-and-acquisition-services/" },
    { label: "Property Management", href: "/services/property-management/" },
    { label: "Project Management", href: "/services/development-services-and-project-management/" },
    { label: "Much More...", href: "/services/" },
  ],
  consentText:
    "By clicking 'Submit,' I provide my express written consent for Capital Investment LLC to contact me via phone calls and SMS/text messages at the number provided. I agree that these communications may be initiated using automated dialing systems, pre-recorded messages, or AI voice technology for marketing and informational purposes. I understand that consent is not a condition of purchase and that message/data rates may apply. I can opt-out at any time by replying STOP or by emailing reza@capitalinvestmentllc.com.",
  credit: { label: "TTR Digital Marketing", href: "https://ttrdigitalmarketing.com/" },
  logo: images.logoLight,
  footerLogo: images.logoDark,
};
