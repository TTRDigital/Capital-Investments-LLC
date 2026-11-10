# Speed measurements (TTR-1449)

Lighthouse 12, one run per cell, localhost production builds, simulated slow 4G phone and desktop. No GA, GTM, Ahrefs or chat tags (their IDs are not set outside production). Single runs vary by about 5 points.

| Page | Before mobile | After mobile | Before desktop | After desktop | Weight before / after (mobile) |
| --- | --- | --- | --- | --- | --- |
| / | 91, LCP 3.1 s | 92, LCP 3.1 s | 98, LCP 1.1 s | 98, LCP 1.1 s | 2,375 / 1,147 KB |
| /services/ | 95, LCP 2.8 s | 90, LCP 3.6 s | 100 | 100 | 650 / 653 KB |
| /services/property-management/ | 87, LCP 4.0 s | 89, LCP 3.6 s | 100 | 100 | 523 / 525 KB |
| /locations/miami-florida/ | 87, LCP 3.9 s | 84, LCP 4.4 s | 99 | 99 | 589 / 594 KB |
| /our-team/ | 92, LCP 3.3 s | 90, LCP 3.5 s | 100 | 100 | 799 / 742 KB |
| /contact-us/ | 90, LCP 3.6 s | 93, LCP 3.1 s | 100 | 100 | 442 / 445 KB |

Before = branch claude/ben-vercel-ready. After = this branch. Desktop home weight 4,197 to 1,599 KB.

What changed: the 2.6 MB skyline video now starts on first scroll, touch or key press or after 4 seconds (PR 5), which halves the home page weight. Everything else is within run to run noise.

Tried and rejected: Next `experimental.inlineCss` (about 16 KB of CSS in the HTML). It removed the CSS requests but made the HTML about 40 KB larger and mobile LCP worse on 5 of 6 pages (3.0 to 4.5 s), so it is not in the PR.

Why the lab is better than the 44 reported: the lab has no third-party tags and no real network. The LCP element on every page is the banner photo or the H1, with about 700 to 1,050 ms of render blocking CSS on the simulated phone and 30 to 60 KB of avoidable banner image bytes. Fixing those means a smaller or re-encoded banner image (changes what visitors see) or splitting the CSS, so I did not do it. Please run PageSpeed Insights on the PR preview for the real numbers before deciding.
