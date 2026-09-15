/* Tests for the Flu Facts content registry + selection logic.
   Run with:  npm test   (uses Node's built-in test runner — no dependencies)

   fluFacts.js is a classic browser script that assigns `globalThis.FluFacts`.
   We load it into a fresh vm context and read that global back out. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const code = readFileSync(new URL("../fluFacts.js", import.meta.url), "utf8");
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(code, ctx, { filename: fileURLToPath(new URL("../fluFacts.js", import.meta.url)) });
/** @type {typeof import("../fluFacts.js")} */
const F = ctx.FluFacts;

// A tiny deterministic RNG (mulberry32) so shuffles are repeatable in tests.
function seeded(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

test("module loaded with facts and sources", () => {
  assert.ok(Array.isArray(F.fluFacts) && F.fluFacts.length > 0);
  assert.ok(Array.isArray(F.healthSources) && F.healthSources.length > 0);
});

test("every fact references only existing sources (no typos)", () => {
  const problems = F.validateContent(F.fluFacts, F.healthSources);
  assert.equal(problems.length, 0, problems.join("\n"));
});

test("shuffle is a permutation and never mutates its input", () => {
  const input = ["a", "b", "c", "d", "e"];
  const copy = input.slice();
  const out = F.shuffle(input, seeded(1));
  assert.deepEqual(input, copy, "input must not be mutated");
  assert.equal(out.length, input.length);
  assert.deepEqual([...out].sort(), [...input].sort(), "same elements");
});

test("shuffle is deterministic for a fixed random sequence", () => {
  const a = F.shuffle(["1", "2", "3", "4", "5", "6"], seeded(42));
  const b = F.shuffle(["1", "2", "3", "4", "5", "6"], seeded(42));
  assert.deepEqual(a, b);
});

test("buildQueue lists every fact once, core before additional", () => {
  const queue = F.buildQueue(F.fluFacts, seeded(7));
  assert.equal(queue.length, F.fluFacts.length, "queue covers all facts");
  assert.equal(new Set(queue).size, queue.length, "no duplicates");
  const byId = new Map(F.fluFacts.map((f) => [f.id, f]));
  let seenAdditional = false;
  for (const id of queue) {
    const prio = byId.get(id).priority;
    if (prio === "additional") seenAdditional = true;
    if (prio === "core") assert.ok(!seenAdditional, "a core fact appeared after an additional one");
  }
});

test("no-repeat rotation: every fact appears once before any repeats", () => {
  const rand = seeded(99);
  let state = {};
  const seen = [];
  for (let i = 0; i < F.fluFacts.length; i++) {
    const res = F.pickNext(state, F.fluFacts, rand);
    state = res.state;
    assert.ok(res.fact, "a fact was returned");
    seen.push(res.fact.id);
  }
  assert.equal(new Set(seen).size, F.fluFacts.length, "all facts appeared, none repeated");
});

test("rotation resets into a fresh cycle after exhaustion", () => {
  const rand = seeded(3);
  let state = {};
  for (let i = 0; i < F.fluFacts.length; i++) state = F.pickNext(state, F.fluFacts, rand).state;
  assert.equal(state.pos, F.fluFacts.length, "queue fully consumed");
  // Next pick starts a new cycle: queue rebuilt, seen reset to just this pick.
  const res = F.pickNext(state, F.fluFacts, rand);
  assert.equal(res.state.pos, 1, "position reset to 1");
  assert.equal(res.state.seen.length, 1, "seen reset for the new cycle");
  assert.ok(res.fact);
});

test("pickNext is pure — it does not mutate the passed-in state", () => {
  const state = { queue: ["x"], pos: 0, seen: [] };
  const snapshot = JSON.stringify(state);
  F.pickNext(state, [{ id: "x", sourceIds: [] }], seeded(1));
  assert.equal(JSON.stringify(state), snapshot, "input state unchanged");
});

test("getSourcesFor resolves valid sources and flags missing ones without throwing", () => {
  const fact = { id: "t", sourceIds: ["phac-vaccine", "does-not-exist"] };
  let res;
  assert.doesNotThrow(() => {
    res = F.getSourcesFor(fact, F.healthSources);
  });
  assert.equal(res.sources.length, 1);
  assert.equal(res.sources[0].id, "phac-vaccine");
  // Spread re-realms the vm-returned array so deepEqual compares by value.
  assert.deepEqual([...res.missing], ["does-not-exist"]);
});

test("all core facts are included in the first full rotation cycle", () => {
  const rand = seeded(5);
  const coreIds = F.fluFacts.filter((f) => f.priority === "core").map((f) => f.id);
  let state = {};
  const firstCoreCount = coreIds.length;
  const firstCycle = [];
  for (let i = 0; i < firstCoreCount; i++) {
    const res = F.pickNext(state, F.fluFacts, rand);
    state = res.state;
    firstCycle.push(res.fact.id);
  }
  // The first `coreIds.length` picks must be exactly the core facts (core-first).
  assert.deepEqual([...firstCycle].sort(), [...coreIds].sort());
});
