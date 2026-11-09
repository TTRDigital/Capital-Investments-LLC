/*
 * URL changes made in the SEO re-optimization. Every row is a permanent 301
 * (query strings are kept, so utm_ and gclid values survive). The same rows
 * are listed in docs/seo/url-map.md. To undo a row, delete it here.
 *
 * Paths are matched without regard to a trailing slash or letter case.
 * Destinations must be live pages (scripts/check-redirects.mjs checks this).
 */
export type Move = { from: string; to: string; why: string };

const MIAMI = "/locations/miami-florida/";
const hoods = [
  "commercial-real-estate-services-in-central-business-district-miami",
  "commercial-real-estate-services-in-downtown-miami",
  "commercial-real-estate-services-in-government-center-miami",
  "commercial-real-estate-services-in-historic-district-miami",
  "commercial-real-estate-services-in-miami-arts-and-entertainment-district",
  "commercial-real-estate-services-in-park-west-miami",
];

export const moves: Move[] = [
  // The client has no newsletter: the signup pages are gone, the contact page is the closest match.
  { from: "/subscribe/", to: "/contact-us/", why: "newsletter signup removed" },
  { from: "/confirmation-thank-you/", to: "/contact-us/", why: "newsletter thank-you page removed" },
  { from: "/newsletter-subscribe-thank-you/", to: "/contact-us/", why: "newsletter thank-you page removed" },
  // One page per market, neighbourhood pages inside the Miami folder (plan agreed Sep 18).
  // /investments-in-* are in lib/legacy-redirects.ts. These cover the neighbourhood pages if they were ever linked outside the Miami folder.
  ...hoods.flatMap((h) => [
    { from: `/locations/${h}/`, to: `${MIAMI}${h}/`, why: "neighbourhood page lives in the Miami folder" },
    { from: `/${h}/`, to: `${MIAMI}${h}/`, why: "neighbourhood page lives in the Miami folder" },
  ]),
  { from: "/investments-in-washington-d-c/", to: "/locations/washington-dc/", why: "one Washington DC page" },
  { from: "/locations/investments-in-miami/", to: MIAMI, why: "one Miami page" },
  { from: "/locations/investments-in-washington-dc/", to: "/locations/washington-dc/", why: "one Washington DC page" },
  { from: "/locations/investments-in-northern-virginia/", to: "/locations/virginia/", why: "one Northern Virginia page" },
  { from: "/locations/northern-virginia/", to: "/locations/virginia/", why: "one Northern Virginia page" },
  { from: "/locations/miami/", to: MIAMI, why: "one Miami page" },
];
