# Visible changes that need Kia's and the client's approval

Nothing here is live: the PR is a draft and nothing is merged. Page copy is not edited in code; the
proposed content goes to Sanity through `content-export/sanity-seed.json` (see below) after approval.

## Already in this PR (visible, need approval before merge)

1. **Footer newsletter form removed** on every page, replaced by a "be contacted" form: heading
   "Request a consultation", line "Leave your name, email and phone number and ask to be contacted about your property or investment.",
   fields Full Name, Email, Phone, consent checkbox, button **SUBMIT** (the consent text says "Submit"; the old button said SEND).
   Sends to TTR OS through `/api/lead` as form `consultation`. Wording is stored in Sanity Site settings
   (Footer form: heading, short text) with these defaults.
2. **Pages removed:** /subscribe/, /confirmation-thank-you/, /newsletter-subscribe-thank-you/ (301 to /contact-us/).
3. **Home video** starts on first scroll/touch/key or after 4 seconds instead of right after load (looks the same, loads lighter).

## Not done, needs content from the client

4. **Success stories** as one section of HTML text: the deals, years and wording have to come from the client.
5. **Government Center and Park West Miami copy** (and to a lesser degree Central Business District, Historic District): rewrite so each page is specific to its neighbourhood.
6. **Claims to review in the existing page copy** (counts of pages containing the word):
   expert (22), top (18), proven (18), maximize (16), ensures (16), best (14), ensure (14), trusted (13),
   excellence (10), seamless (10), unmatched (8), highest (6), exceptional (5), premier (4), unparalleled (4), leading (4).
   Titles and descriptions avoid all of them; the page text still uses them. Ask the client which can be backed up.
7. **Optional URL moves** (Brickell, South Beach, Miami-Dade into the Miami folder, Fairfax into Virginia): see `url-map.md`.
8. Home heading "Celebrating 10 Years of Excellence in Commercial Real Estate": confirm the 10 years and the wording.

## Loading content into Sanity

    npm run seed -- --export      # writes content-export/sanity-seed.json and .ndjson, no token, no network

56 documents (1 siteSettings, 32 pages, 23 team members), ids without dots, images as
`_sanityAsset` URLs on https://www.capitalinvestmentllc.com. Load with
`npx sanity dataset import content-export/sanity-seed.ndjson production --missing` (never replaces existing
documents) after approval. Production Sanity currently has no page documents; the site reads its built-in
copy until they are loaded.
