# SEO audit and changes

Measured with Playwright on a production build of this branch, 58 URLs before (35 pages and 23 team profiles), 55 now (the three newsletter URLs redirect). Raw data: `crawl-before.json`, `crawl-after.json`.

## Findings

| Area | Before | After |
| --- | --- | --- |
| Title / meta | 32 pages with generic or repeated wording, 23 team pages with a cut off description ending in "…", home title said "Capital Investment Consulting" | specific titles (46 to 62 characters, team titles to 65) and meta descriptions (107 to 158 characters), phone numbers and addresses that are on the site, no dashes as punctuation, no superlatives or promises |
| H1 | exactly one per page | unchanged |
| Heading order | 5 pages skipped a level (team profiles and terms used h3 under the h1) | 1 left: `/services/property-management/` |
| Canonical | present, self referencing, trailing slash | unchanged |
| Alt text | 0 images without alt, 82 different texts | unchanged (no change needed) |
| Lazy loading | below the fold images lazy, hero and logo eager, map frames lazy | unchanged |
| Image files | 130 photos already WebP, each served at 7 widths | unchanged |
| Sideways scroll | none at 375, 390, 1440 | none |
| Structured data | one RealEstateAgent, Person, BreadcrumbList, FAQPage | RealEstateAgent firm plus one branch per office, WebSite, Service on the five service pages, Person with sameAs links, degree school and phone only where the bio shows them, BreadcrumbList |
| Sitemap / robots | 55 indexable URLs, noindex form pages already left out, robots fine | 55 URLs, same set; the three newsletter pages are gone and redirect |
| Newsletter | footer form on every page, /subscribe/ and 2 thank-you pages | removed, "be contacted" form in the footer posting to /api/lead (TTR OS) |
| Redirects | query strings dropped | query strings kept (utm_, gclid), see `url-map.md` |

## Core Web Vitals

Lab run (Lighthouse 12, localhost, no throttled network, no GA/GTM/Ahrefs/chat tags because their IDs are not set outside production):

| Home page | Before | After |
| --- | --- | --- |
| Desktop score | 98 | 99 |
| Desktop page weight at load | 4,197 KiB | 1,608 KiB |
| Desktop LCP / TBT / CLS | 1.0 s / 0 ms / 0.003 | 0.9 to 1.0 s / 0 to 10 ms / 0.003 |
| Mobile score | not measured | 85 (LCP 4.1 s on the simulated slow phone) |

The weight drop is the 2.6 MB skyline video: it used to start right after the page loaded, it now starts on the first scroll, touch or key press or after 4 seconds. It looks the same to a visitor.

The PageSpeed desktop score of 44 on the live site cannot be reproduced here. What the lab run does show, and what to check on the preview with PageSpeed Insights:
- the video (2.6 MB desktop file, 1.4 MB phone file) now deferred;
- Google Maps frames on the home page (about 400 KB of scripts, lazy but close to the fold);
- seven font families (five load only where used);
- GA, GTM, Ahrefs and the chat widget, all `lazyOnload`, so they should not hurt LCP but do add main thread work.

An estimate for production needs a PageSpeed run on the preview URL once the PR deploys.

## Pages that need a rewrite (visible copy, for the client)

- Government Center Miami and Park West Miami share 39% of their five word runs with each other, Central Business District and Historic District about 22 to 24%. They are not thin (727 to 890 words each) but they read as one template. Rewrite so each says something specific about its own neighbourhood.
- No page is thin by word count (smallest location page 727 words).
