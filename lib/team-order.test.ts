import { test } from "node:test";
import assert from "node:assert/strict";
import { applyTeamOrder, TEAM_ORDER_OVERRIDE } from "./team-order.ts";

const m = (slug: string, order: number) => ({ slug, order, name: slug });

// Sanity still holds the old numbers: Christina 6, Boyd 7, Yassin 8, Justin 9, Brooke 5.
const sanity = [
  m("reza-sabaii-esq", 1), m("david-krucoff", 2), m("mani-milan-mps", 3),
  m("justin-katz", 9), m("yassin-kadir", 8), m("boyd-lawrence", 7), m("christina-davies", 6), m("brooke-fontan", 5),
  m("mikayel-aakil-bey", 10), m("ali-tofigh-esq", 11),
];

test("row 2 is Justin, Christina, Boyd, Yassin; row 1 and the rest unchanged", () => {
  const slugs = applyTeamOrder(sanity).map((x) => x.slug);
  assert.deepEqual(slugs, [
    "reza-sabaii-esq", "david-krucoff", "mani-milan-mps", "brooke-fontan",
    "justin-katz", "christina-davies", "boyd-lawrence", "yassin-kadir",
    "mikayel-aakil-bey", "ali-tofigh-esq",
  ]);
});

test("only order changes: other fields are kept and the input is not mutated", () => {
  const before = JSON.stringify(sanity);
  const out = applyTeamOrder(sanity);
  assert.equal(JSON.stringify(sanity), before);
  assert.equal(out.find((x) => x.slug === "justin-katz")?.name, "justin-katz");
  assert.equal(out.find((x) => x.slug === "justin-katz")?.order, 6);
});

test("members not in the override keep Sanity's order, and a new member sorts by its own order", () => {
  const out = applyTeamOrder([...sanity, m("new-person", 12)]).map((x) => x.slug);
  assert.equal(out[out.length - 1], "new-person");
  assert.equal(out.indexOf("mikayel-aakil-bey"), 8);
});

test("works when Sanity already has the new numbers", () => {
  const already = sanity.map((x) => ({ ...x, order: TEAM_ORDER_OVERRIDE[x.slug] ?? x.order }));
  assert.deepEqual(applyTeamOrder(already).map((x) => x.slug), applyTeamOrder(sanity).map((x) => x.slug));
});
