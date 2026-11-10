# Sanity fields the page fixer writes (TTR-1449)

Document types `page` and `teamMember`. Every field falls back to the value built into the code
(`lib/data`), so a draft can carry only the fields it changes plus the key (`path` for pages,
`slug.current` for team members). Reader: `lib/content.ts`, `lib/seo-fields.ts`.

| What | Field | Notes |
| --- | --- | --- |
| Page key | `path` (page), `slug.current` (teamMember) | e.g. `/services/property-management/`, `david-krucoff` |
| Title | `seo.title` | used as written, nothing is appended |
| Meta description | `seo.description` | |
| Hide from search | `seo.noIndex` | boolean |
| Social image | `seo.image` | image with `alt` |
| Structured data | `seo.schema` (written by the TTR OS fixer) or `seo.structuredData`; `schema` wins when both are set and valid | JSON-LD as text, one object or an array. Replaces the page-level schema built in code (breadcrumbs, service, FAQ; team pages: person and breadcrumbs). The site-wide business schema stays. Empty or invalid JSON falls back to the code values. `@context` is added when missing |
| Image alt text | `altOverrides[]` of `{ match, alt }` | `match` is a file name or path (`two-professionals.webp`, `/images/events/two-professionals.webp`) or part of a Sanity image URL; `alt` replaces the alt text of every image on that page that uses the file |

Document ids follow the seed script: `page-home`, `page-services--property-management`, `teamMember-david-krucoff` (no dots).

## Draft preview

1. Preview deployments only (never `VERCEL_ENV=production`).
2. Vercel > Settings > Environment Variables, scope **Preview**: `PREVIEW_SECRET` (any long random string; `SANITY_PREVIEW_SECRET` also works) and `SANITY_READ_TOKEN` (Viewer token from sanity.io/manage > API > Tokens). Values are never in the repo. If either is missing, `/api/preview` answers 404 and previews show published content only.
3. TTR OS opens the signed link `<preview-url>/api/preview?path=<path>&exp=<unix seconds>&sig=<hex>` (sig = HMAC-SHA256 hex of `<path>\n<exp>` keyed with `PREVIEW_SECRET`; exp in the future, at most 30 days ahead) and follows the redirects, keeping the cookie. Editors can use `<preview-url>/api/preview?secret=<PREVIEW_SECRET>&path=/services/property-management/`. That page and every other page on that deployment then render the draft; visitors without the cookie still see published content. `/api/preview/exit` turns it off.
4. The site paths use a trailing slash, so `/api/preview` redirects once to `/api/preview/` (query kept). Follow redirects.

Tested locally against a mock of the Sanity API: wrong secret 404; with the cookie the draft title, description, alt text, structured data and a team page title appear; without the cookie the published values stay.
