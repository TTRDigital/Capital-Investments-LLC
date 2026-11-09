# URL map

Every changed address answers a permanent 301, keeps the query string (utm_, gclid), and goes straight to
the final page (no chains). Rows live in `lib/url-map.ts` (this work) and `lib/legacy-redirects.ts` (old
WordPress addresses). Check against any running copy of the site:

    node scripts/check-redirects.mjs https://<preview-url>

Undo: delete the row in `lib/url-map.ts`. To undo everything, revert the PR.

## Implemented

| Old URL | New URL | Action |
| --- | --- | --- |
| `/investments-in-miami/` | `/locations/miami-florida/` | 301, one Miami market page (already in the site from the rebuild, now keeps the query string) |
| `/investments-in-washington-dc/` | `/locations/washington-dc/` | 301, one Washington DC market page (same) |
| `/investments-in-northern-virginia/` | `/locations/virginia/` | 301, one Northern Virginia market page (same) |
| `/investments-in-washington-d-c/` | `/locations/washington-dc/` | 301, spelling variant |
| `/locations/investments-in-miami/`, `/locations/miami/` | `/locations/miami-florida/` | 301, variants |
| `/locations/investments-in-washington-dc/` | `/locations/washington-dc/` | 301, variant |
| `/locations/investments-in-northern-virginia/`, `/locations/northern-virginia/` | `/locations/virginia/` | 301, variants |
| `/commercial-real-estate-services-in-<hood>/` and `/locations/commercial-real-estate-services-in-<hood>/` for central-business-district, downtown, government-center, historic-district, miami-arts-and-entertainment-district, park-west (all `-miami`) | `/locations/miami-florida/commercial-real-estate-services-in-<hood>-miami/` | 301, every Miami neighbourhood page, Government Center included, lives inside the Miami folder |
| `/team/windy-parsons/` | `/our-team/` | 301, person has left the firm (Reza, TTR-1419); profile, menu, carousel, sitemap and schema entries removed; old photo URLs answer 410 |
| `/team/nitika-dumera/` | `/our-team/` | 301, person has left the firm (Reza, TTR-1419); profile, menu, carousel, sitemap and schema entries removed; old photo URLs answer 410 |
| `/team/john-daly/` | `/our-team/` | 301, person has left the firm (Reza, TTR-1419); profile, menu, carousel, sitemap and schema entries removed; old photo URLs answer 410 |
| `/team/alex-parra/` | `/our-team/` | 301, person has left the firm (Reza, TTR-1419); profile, menu, carousel, sitemap and schema entries removed; old photo URLs answer 410 |
| `/team/connor-zarebi/` | `/our-team/` | 301, person has left the firm (Reza, TTR-1419); profile, menu, carousel, sitemap and schema entries removed; old photo URLs answer 410 |
| `/subscribe/` | `/contact-us/` | 301, newsletter removed (client has no newsletter) |
| `/confirmation-thank-you/` | `/contact-us/` | 301, same |
| `/newsletter-subscribe-thank-you/` | `/contact-us/` | 301, same |

The three `/investments-in-*` pages and the Miami neighbourhood pages were already merged or moved by the
rebuild (Government Center was already at `/locations/miami-florida/commercial-real-estate-services-in-government-center-miami/`).
The variant rows only protect old links; I could not read the old WordPress sitemap from here, so please
compare them with the Search Console "Pages" report and delete any that never existed.

Old WordPress `?p=` and `?page_id=` links still map as before, with the ID removed and any other parameter kept.

## Unchanged

All other 29 pages and the 18 remaining team profiles keep their URL.

## Proposed, not implemented (needs Kia and the client)

| Old URL | Proposed URL | Why |
| --- | --- | --- |
| `/locations/brickell-miami/` | `/locations/miami-florida/brickell-miami/` | Brickell is a Miami neighbourhood like the six already in the Miami folder |
| `/locations/south-beach-florida/` | `/locations/miami-florida/south-beach-florida/` | same |
| `/locations/miami-dade-county/` | `/locations/miami-florida/miami-dade-county/` | same |
| `/locations/fairfax-county/` | `/locations/virginia/fairfax-county/` | same logic for Northern Virginia |

Not in the Sep 18 plan and moving a ranking URL has a cost, so I left them. If approved it is four rows in
`lib/url-map.ts`, four `path` values in `lib/data/pages.ts`, and the menu links.

Success stories: no page exists today and none is created (the plan is one section as HTML text, no page per deal).
The deals, dates and wording have to come from the client; nothing is invented here.
