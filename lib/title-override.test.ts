import { test } from "node:test";
import assert from "node:assert/strict";
import { applyMemberTitles, fixDavidTitle } from "./title-override.ts";

const OLD = "Executive Vice President";

// What live Sanity still returns for David (old title everywhere).
const david = {
  slug: "david-krucoff",
  name: "David Krucoff",
  role: OLD,
  order: 2,
  photo: { src: "/x.webp", alt: `David Krucoff, ${OLD} at Capital Investment LLC` },
  bio: ["Mr. Krucoff has a broad range of experience."],
  seo: { title: `David Krucoff, ${OLD} | Capital Investment LLC`, description: `David Krucoff is an ${OLD} at Capital Investment LLC.` },
};
const other = { slug: "someone-else", name: "Someone Else", role: OLD, order: 9, photo: { src: "/y.webp", alt: `Someone Else, ${OLD} at Capital Investment LLC` }, bio: ["Other bio."], seo: { title: `Someone Else, ${OLD} | Capital Investment LLC`, description: `Someone Else is an ${OLD}.` } };

test("David's role, photo alt and SEO text all say Associate Broker", () => {
  const [d] = applyMemberTitles([david]);
  assert.equal(d.role, "Associate Broker");
  assert.equal(d.photo.alt, "David Krucoff, Associate Broker at Capital Investment LLC");
  assert.equal(d.seo.title, "David Krucoff, Associate Broker | Capital Investment LLC");
  assert.equal(d.seo.description, "David Krucoff is an Associate Broker at Capital Investment LLC.");
});

test("nothing else changes: name, order, photo src, bio, and other people", () => {
  const [d, o] = applyMemberTitles([david, other]);
  assert.equal(d.name, "David Krucoff");
  assert.equal(d.order, 2);
  assert.equal(d.photo.src, "/x.webp");
  assert.deepEqual(d.bio, david.bio);
  assert.deepEqual(o, other); // someone else's identical title is untouched
});

test("input is not mutated", () => {
  const before = JSON.stringify(david);
  applyMemberTitles([david]);
  assert.equal(JSON.stringify(david), before);
});

test("page content: carousel and office alts for David are fixed, others are not", () => {
  const page = { sections: [{ members: [
    { slug: "david-krucoff", photo: { alt: `David Krucoff, ${OLD} at Capital Investment LLC` } },
    { slug: "someone-else", photo: { alt: `Someone Else, ${OLD} at Capital Investment LLC` } },
  ] }] };
  const out = fixDavidTitle(page);
  assert.equal(out.sections[0].members[0].photo.alt, "David Krucoff, Associate Broker at Capital Investment LLC");
  assert.equal(out.sections[0].members[1].photo.alt, `Someone Else, ${OLD} at Capital Investment LLC`);
});

test("already-updated content is left alone", () => {
  const [d] = applyMemberTitles([{ ...david, role: "Associate Broker", photo: { src: "/x.webp", alt: "David Krucoff, Associate Broker at Capital Investment LLC" } }]);
  assert.equal(d.role, "Associate Broker");
  assert.equal(d.photo.alt, "David Krucoff, Associate Broker at Capital Investment LLC");
});
