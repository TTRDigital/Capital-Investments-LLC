# Capital Investment LLC website

Next.js 16 (App Router, static export) + Sanity rebuild of
https://www.capitalinvestmentllc.com/. The build in `out/` is plain HTML/CSS/JS
plus one PHP form handler, hosted on SiteGround.

- Every page keeps its old URL, title and meta description (see **URLs** below).
- All copy and images are the client's own. Images were downloaded from the old
  WordPress media library, metadata stripped, renamed and given alt text.
- The site works with no CMS at all: every page's content lives in `lib/data/`
  and Sanity content is merged over it when present.

## Stack

| Piece | Where |
| --- | --- |
| Pages | `app/(site)/[[...slug]]/page.tsx` (one route renders every CMS page), `app/(site)/team/[slug]/page.tsx` (team profiles) |
| Sections | `components/sections/*`, picked by `_type` in `SectionRenderer.tsx` (33 section types) |
| Built-in content | `lib/data/pages.ts`, `team.ts`, `site.ts` (menu, footer, offices), `images.ts` |
| Content layer | `lib/content.ts` (GROQ fetch, merge over built-in content), `lib/merge.ts`, `lib/sanity/fetch.ts` |
| CMS | Sanity Studio at `/cms` (`sanity.config.ts`, `sanity/schemaTypes/*`), project `850gl5j0`, dataset `production` |
| Styling | Tailwind v4, tokens in `app/globals.css` (copper `#bb6e3d`, cream `#fff6ef`, Lora / Inter / Roboto / Montserrat / Outfit / DM Sans) |
| Images | `scripts/optimize-images.mjs` writes WebP sizes to `public/_img/` at build time; `lib/image-loader.ts` picks them |
| Hosting rules | `public/.htaccess` (canonical host, trailing slashes, old-URL 301s, security headers + CSP, caching, compression) |
| Forms | `components/forms/*` → `public/api/lead.php` → GoHighLevel webhook |
| Deploy | `.github/workflows/deploy-siteground.yml` (build, write `api/lead-config.php`, FTPS upload) |
| CMS loader | `scripts/seed.ts` + `.github/workflows/seed-sanity.yml` ("Load content into Sanity") |

## Development

```bash
npm ci
npm run dev          # http://localhost:3000, Studio at http://localhost:3000/cms
npm run lint
npm run typecheck
npm run build        # static export to out/
```

Copy `.env.example` to `.env.local` if you need to override anything. If your
shell already sets `NEXT_PUBLIC_SANITY_PROJECT_ID` for another project, clear it
for this repo (`env -u NEXT_PUBLIC_SANITY_PROJECT_ID -u NEXT_PUBLIC_SANITY_DATASET npm run dev`),
or the site will read the wrong Sanity project.

To test the export the way SiteGround serves it, point an Apache + PHP vhost at
`out/` with `AllowOverride All`.

## Content conventions

Text fields are arrays of paragraphs. Inside a paragraph:

- `## Heading` starts a sub-heading, `- ` a bullet, `1. ` a numbered item
- `**bold**`, `_italic_`, `*accent*` (copper text in headings), `[label](/path/)` links
- `\n` is a line break

## Editing in /cms

Open `/cms` on the live site (or localhost) and sign in with your Sanity account.

- **Pages** are grouped by Company, Services, Locations, Forms and Legal. Each page
  is a list of sections; reorder, edit or hide sections there. The **SEO** tab
  holds the title, description and noindex flag.
- **Team members** hold the profile pages at `/team/<slug>/`.
- **Site settings** holds the menu, footer, offices, phone numbers and social links.

Any field left empty in Sanity falls back to the built-in content, so a page is
never blank. Publishing in Sanity triggers a rebuild once the publish webhook is
set up (below).

## Loading content into Sanity

`npm run seed` (locally, with `SANITY_WRITE_TOKEN` set) or the **Load content into
Sanity** workflow (GitHub > Actions, run by hand) uploads every built-in page, team
member, site setting and image.

| Mode | What it does |
| --- | --- |
| `add-missing` | Creates documents that don't exist yet. Never touches edits made in /cms. |
| `overwrite` | Replaces every document with the built-in content. **Discards edits made in /cms.** |
| `dry-run` | Converts everything and reports, writes nothing. |

The workflow uses the repository secret `SANITY_WRITE_TOKEN` (a Sanity Editor token).

## Hosting and secrets

The deploy workflow runs on every push to `main` (and this build branch), on
`repository_dispatch` type `sanity-publish`, and by hand.

| Name | Type | Purpose |
| --- | --- | --- |
| `SG_FTP_SERVER`, `SG_FTP_USERNAME`, `SG_FTP_PASSWORD` | secrets | SiteGround FTPS (Site Tools > Site > FTP Accounts; use an account whose folder is the site's `public_html`). Without them the workflow builds but skips the upload. |
| `GHL_WEBHOOK_URL` | secret | GoHighLevel inbound webhook for all forms. Written to `api/lead-config.php` on the server only. |
| `CAREERS_EMAIL` | variable (optional) | Where résumés are emailed, default `reza@capitalinvestmentllc.com` |
| `GHL_CHAT_WIDGET_ID` | variable (optional) | GoHighLevel chat widget; empty = no chat bubble, "Let's Chat" opens the contact popup |
| `GA_ID`, `GTM_ID`, `AHREFS_KEY` | variables (optional) | Default to the old site's IDs |
| `SANITY_WRITE_TOKEN` | secret | Only for the "Load content into Sanity" workflow |

**Sanity publish webhook:** in sanity.io/manage > project > API > Webhooks, add a
webhook on create/update/delete for the `production` dataset that POSTs to
`https://api.github.com/repos/TTRDigital/Capital-Investments-LLC/dispatches` with
body `{"event_type":"sanity-publish"}` and headers `Accept: application/vnd.github+json`
and `Authorization: Bearer <fine-grained GitHub token with Contents: read & write>`.

## Forms

| Form | Fields | Goes to |
| --- | --- | --- |
| Contact (Contact Us page, "Let's Chat" popup) | Full Name, Email, Phone, consent | Webhook, tags `website-lead`, `contact-form` |
| Newsletter (footer) | Full Name, Email, consent | Webhook, tag `newsletter`, then `/confirmation-thank-you/` |
| Subscribe (`/subscribe/`) | First Name, Last Name, Email, consent | Webhook, tag `newsletter`, then `/confirmation-thank-you/` |
| Careers (careers pages) | Full Name, Email, Phone, Résumé (PDF/DOC/DOCX, 5 MB), consent | Résumé emailed to `CAREERS_EMAIL`, details to the webhook, tag `career-application` |

`lead.php` checks same-origin, rate-limits, rejects bots (honeypot + fill time),
validates fields and forwards JSON (with UTM/attribution data) to the webhook. Until
`GHL_WEBHOOK_URL` is set the forms validate but leads are not delivered.

## URLs

All 35 pages and 23 team profiles keep their old paths. Old URLs that changed:

| Old | New |
| --- | --- |
| `/home/` | `/` (301) |
| `/team/`, `/team/page/N/` | `/our-team/` (301) |
| `/?page_id=N`, `/?p=N` | the matching page or profile (301) |
| `/wp-content/uploads/...` (every size, `-scaled`) | the same image under `/images/` (301), unused uploads 410 |
| `/wp-sitemap*.xml`, `/sitemap_index.xml` etc. | `/sitemap.xml` (301) |
| `/wp-admin/`, `/wp-login.php`, `/xmlrpc.php`, `/feed/`, `/wp-json/` … | 410 |
| `capitalinvestmentllc.com` | `https://www.capitalinvestmentllc.com` (301) |
| missing trailing slash | added (301) |

The old site's own legacy redirects (`/investments-in-*`, `/about`, `/contact`,
`/properties`, `/author/ttrdigital/`) are kept.

## Changes from the old site

Fixed:

- Typos in body copy; "Our Our Key" → "Our Key"; Maryland page "Miami's" → "Maryland's"
- Home moved from `/home/` to `/` (301 kept); team listing at `/our-team/` (`/team/` 301s)
- Pages with no meta description got one written from their own copy; the
  Development page's description (copied from another page) was replaced
- Team profiles: the person's name is the H1 (was the job title)
- Wrong alt text corrected (e.g. photos labelled "Reza Farazmand" that weren't him)
- Broken contact links: Ramzah's email pointed to another person's address; Justin's
  phone numbers weren't `tel:` links; Reza's profile URLs weren't links
- `#` placeholder city links now go to the real location page, or are plain text
- Footer links point straight at pages instead of redirecting
- Copyright year updates automatically
- Assets loaded from the staging host or other companies' sites are self-hosted; the
  home hero video (hosted on an unrelated site) is replaced by its still image
- The Adobe link and the third-party chat iframe forms were removed; forms post to
  our own endpoint with a consent checkbox
- Privacy and Terms pages get a dark band behind the white header so the menu is readable
- Office addresses use consistent punctuation

Flagged and kept as written (please confirm with the client):

- Home hero copy mentions "wealth management" and "50 years"
- Reza's profile says "Houston, Texas"
- Date ranges "2014 - 2024" / "10 years" in profiles
