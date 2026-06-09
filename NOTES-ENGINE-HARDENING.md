# Notes Engine Hardening Plan

> Status: Tier 0 (test harness) **DONE**. Tier 1 (tripwire) is the recommended next step.
> This doc is self-contained on purpose — a future session with no memory of the
> original conversation should be able to pick the plan up from here alone.

## TL;DR

The Notes tab (the most important tab) builds clinical note text by running each
procedure's prose **template string** through `renderTemplate(raw, f)` in
`src/App.jsx`, which performs dozens of `t = t.replace(/regex/, …)` substitutions
to fill user fields, strip optional sections, and tidy formatting. The recurring
bug class — and it has bitten repeatedly — is a substitution that **silently
no-ops** because the template prose drifted out from under its regex, or because
an earlier strip pre-empted a later fill. No error is thrown; the note just
renders wrong (age missing, a finding dropped, a dead input, a leftover
`[date]`). For a clinical-documentation tool this is the worst failure mode: a
student can sign/paste an incomplete note without noticing.

We are hardening this in tiers. **Tier 0 (automated harness) is already in place.**
The recommended next move is **Tier 1 (a substitution "tripwire")**: cheap,
attacks the root (the *silence*), and protects without rewriting templates.

## The problem (root cause)

Standard templates encode their slots **implicitly in prose**:
`" y/o"`, `"- occlusal assessment:"`, `"radiographic & "`, `"MAF: X"`, `"[date]"`.
`renderTemplate` hunts those exact phrases with regex to fill or strip them.
So the template author and the regex author are coupled by *invisible string
identity*. Any time the prose is edited (`"brushes"` vs `"brushing"`,
`"MAF: 25"` vs `"MAF: X"`, `"1/1/2021"` → `"[date]"`), a regex somewhere falls off
it and silently misses. The disease is the implicit coupling + the silence; every
bug below is a symptom.

## Bugs found of this family (all fixed; all now locked by the harness)

| Procedure | Bug | Commit |
|---|---|---|
| 273 Exams→Screening (also 807, 871) | age never inserted — a leading-space strip ate the space the age regex needed | (pre-existing fix `3a943e0`) |
| 5985 Peds Initial/Recall | "Took bitewings" off stripped `radiographic &` but the odontogram regex required it → findings stopped inserting | `7a8dada` |
| 5985 Peds Initial/Recall | doubled hairline — divider rendered above an empty grid | `081f6c7` |
| 703 Restorative COE | Occlusal Assessment input was dead — peds occlusal strip deleted the stub before the generic fill | `8b5a735` |
| 5472 RCT | `MAF:` value never inserted (`/MAF:\d+/` vs template `MAF: X`); endo consult date dropped + literal `[date]` leaked (×2 lines) | `76785b3` |

A full live runtime sweep of **all 95 procedures'** default renders is otherwise
clean (no sentinel leaks, empty notes, doubled hairlines, stranded punctuation).

## Tier 0 — automated harness (DONE)

- `src/note-render.test.js` (vitest). Run with **`npm test`** (added to
  `package.json`; runs this + the RPD-engine tests; ~1330 tests, all green).
- `renderTemplate`, `TEMPLATES`, and `DEFAULT_FIELDS` are exported from
  `src/App.jsx` (named exports at end of file — no effect on the app bundle) so
  the engine can be unit-tested with no React/DOM.
- Invariants it asserts across every template:
  1. every template renders to a non-empty string without throwing;
  2. no engine sentinels leak (`@ANES@`, `NOANES`, `{{…}}`);
  3. ICC notes strip every unfilled `[bracket]` (icc-refusal excluded — see Open
     Items);
  4. a set age round-trips into every patient-facing template (locks the age
     family for *all* templates at once);
  5. explicit regression locks for each specific bug above.
- **This is the safety net that makes Tier 2 migration safe** — convert a
  template, run `npm test`, prove nothing changed.

## The plan (cheapest first)

### Tier 1 — substitution tripwire  ← DO THIS NEXT
Wrap the bare `t = t.replace(re, val)` calls in a helper, e.g.

```js
// dev/test only: record when a substitution that should fire matches nothing.
function sub(t, re, val, { expect = null, label = "" } = {}) {
  if (expect != null) {
    const n = (t.match(new RegExp(re, re.flags.includes("g") ? re.flags : re.flags + "g")) || []).length;
    if (n !== expect && (import.meta?.env?.DEV || globalThis.__NOTE_TRIPWIRE__)) {
      console.warn(`[note tripwire] ${label}: expected ${expect} match(es), got ${n}`);
      globalThis.__NOTE_TRIPWIRE_HITS__?.push({ label, expected: expect, got: n });
    }
  }
  return t.replace(re, val);
}
```

Convert the substitutions that are *supposed* to fire (the fills) to
`sub(t, re, val, { expect: 1, label: "endoMaf" })`. This turns the entire
**silent** failure mode into a **loud** one without touching a single template.
In tests, flip `globalThis.__NOTE_TRIPWIRE__ = true`, render every template ×
permutations (reuse the harness), and assert `__NOTE_TRIPWIRE_HITS__` is empty
for the permutations where each fill should apply. ~Half a day; ~90% of the
protection. **Highest leverage per effort.**

### Tier 2 — explicit slot tokens (the real cure, done gradually)
The ICC half of the app already does this right: every slot is an explicit
`[token]` parsed into a typed input and filled by a dumb key→value replace — no
prose-matching at all (see `parseLabPlaceholders`, `ICC_FIELD_CFG`,
`ICCNoteInputs`, and the labPlaceholder substitution in `renderTemplate`).
Migrate the **standard** templates to the same model:
`{{age}}y/o`, `- occlusal assessment:{{occlusal}}`,
`{{bitewingsPrefix}}updated odontogram with{{radiographicQualifier}}intraoral…`,
`MAF: {{maf}}`. Then the engine core becomes one robust pass: for each token,
substitute its value or strip it. A missed token is *visible* (`{{age}}` in the
output) and harness invariant #2 catches it immediately.

It's a real migration (~40 standard templates + rewriting the substitution core),
so do it **incrementally and provably**:
1. pick the most-edited template;
2. add tokens; write the new token-fill path;
3. run old regex path and new token path side-by-side and **diff outputs** across
   the harness's permutations to prove parity;
4. cut over + delete the old regex path for that template;
5. repeat. The harness is the guardrail.

### Tier 0.5 — shared constants (for anything NOT migrated)
Wherever prose-matching stays, make the matched literal a single named constant
used to build **both** the template string and the regex
(`const OCCLUSAL_STUB = "- occlusal assessment:"`). Then they physically can't
drift. Cheap insurance for the long tail.

### Skip — structured-data note model
Authoring every note as data (sections→lines→slots objects) is the most
"correct" but is more machinery than this personal tool needs.

## Recommendation / order
1. **Tier 1 tripwire** (next).
2. **Tier 2** incrementally over time (the architectural cure; pattern already
   proven on the ICC side).
3. Tier 0.5 for substitutions left behind.
This combination moves the engine's robustness from ~C+ toward A.

## Key code locations (`src/App.jsx`, ~31.5k lines, single file)
- `TEMPLATES` (procedure id → template string): declared ~line 39.
- `renderTemplate(raw, f)`: ~line 4049–5770 — the substitution engine. The fills
  to tripwire live here.
- `DEFAULT_FIELDS`: ~line 3621 — the baseline `f` object.
- Conditional strips to scrutinize (pre-empt hazards): tookBitewings (~4111),
  peds occlusal (~4832), poeOnly, no-treatments, COVID block, temperature/BG omit.
- ICC explicit-token machinery (the Tier-2 model to emulate):
  `parseLabPlaceholders` (~5867+), `ICC_FIELD_CFG` (~6437), `ICCNoteInputs`
  (~6470+), and the labPlaceholder substitution inside `renderTemplate`.
- Harness: `src/note-render.test.js`. Engine export block: bottom of `src/App.jsx`.

## Verifying
- Code/unit: `npm test`.
- Live behavior: `npm run dev`, open the Note tab, drive procedures (or use the
  preview-eval pattern: set the Category + Procedure selects, read the longest
  `<textarea>` value as the note output).

## Open items (Jake's call, not bugs)
- **icc-refusal** leaves its ~11 fill-in `[brackets]` (`[declined recommendation 1]`,
  `[interpreter name]`, etc.) visible when the form is left blank — currently *by
  design* (legal form forcing completion). Decide whether it should strip-when-
  blank like the other ICC notes. The harness excludes it from the bracket-strip
  invariant for now.
