# Cases tab — rebuild execution plan

**Status as of 2026-05-26 evening:** Cases tab sidelined from live nav. Foundation
docs `CASES-FOUNDATION.md` (philosophy) and `CASES-PROCEDURES.md` (extracted UIC
content + per-pathway keep/cut review) are committed. The DxTP framework is
captured.

**Strategic decision:** rather than surgically cut + rewrite the existing 100+
PATHWAYS entries (which carry accumulated drift from many iterations of fabricated
content), we **start fresh**. The legacy array is renamed and parked as dead code;
a new empty `PATHWAYS` is built up one pathway at a time, sequentially, from UIC
source PDFs, with a source citation on every claim.

This document is the **executable recipe**. It is the thing future-Claude and
future-Jake read to know exactly what to do at each step. If conversation context
compresses, this doc is the resume point. Treat it as binding.

---

## End state

When Cases is rebuilt and re-launched:

- ~30–40 pathways covering the procedures UG predocs actually perform at UIC
- Every pathway has:
  - `phase` tag (urgent / dx / phase1 / phase2 / phase3 / phase4) from the UIC
    Tx Dx- Overview framework
  - `category` tag (operative / digital / fixed / dentures / perio / endo / os /
    sti / iod / pedo) from the UIC Patient Disposition roster taxonomy
  - `labSteps` array — explicit lab work between clinical phases, with source
    citation per step
  - Source citation on every keyDecision, labStep, and description claim
- The picker is reorganized by phase (the primary lens; category is secondary
  filter)
- The Cases tab is unhidden in nav
- Pathways that were CUT are documented in `CASES-PROCEDURES.md` so the
  decision history is preserved

---

## The new schema

Each PATHWAYS entry, when fully built, looks like:

```js
{
  id: "cd-conventional",

  // ── NEW required fields ─────────────────────────────────────────
  category: "dentures",   // one of: operative, digital, fixed, dentures,
                          //   perio, endo, os, sti, iod, pedo
  phase: "phase3",        // one of: urgent, dx, phase1, phase2, phase3, phase4
                          //   (use the "primary" phase even if the case spans)

  // ── existing fields (kept) ──────────────────────────────────────
  domain: "cd",           // legacy field; kept for backward compat with current
                          //   PATHWAY_GROUPS routing
  label: "Conventional CD (fully edentulous)",
  description: "...",     // 2-4 sentences, no superlatives, no external citations
  keyDecisions: [
    { text: "Border molding must be region-by-region with green compound...",
      source: "CD lecture: Custom tray_Boxing_Technique.pdf p. 8-11" },
    { text: "Wax try-in is the moment of patient sign-off...",
      source: "CD lecture: Clinical Evaluation of the Trial Denture_2025.pdf p. 5" },
    // ...
  ],
  phases: [
    { label: "Records", count: 4 },
    { label: "Mounting", count: 3 },
    // ...
  ],
  sections: [
    { guideId: "cd", chapterId: "cd-ch1" },
    // ...
  ],

  // ── NEW required field ──────────────────────────────────────────
  labSteps: [
    {
      after: 0,                  // index into phases[]; this lab work happens
                                 //   after phases[0] "Records"
      title: "Pour preliminary cast + fabricate custom trays",
      body: "Box the alginate impression with utility wax and a paper boxing
             collar. Pour Type III dental stone (powder/water ratio per Dental
             Stones lecture). Separate at 60 minutes. Outline the custom tray
             on the cast: extend 2 mm short of the vestibular reflection;
             relieve over hard areas and tori; trim handle to the canine area
             so it doesn't interfere with the patient's lip.",
      source: "CD lab: Custom tray_Boxing_Technique.pdf p. 3-7; Dental Stones.pdf p. 11",
      turnaround: "1 week before next clinical visit",
    },
    // ...
  ],
}
```

**Schema rules:**

- `keyDecisions` entries become **objects** `{text, source}` (previously strings).
  This forces source attribution on every entry. The renderer can show the
  source as a tooltip or footnote.
- `labSteps` is required for any pathway that has lab work between visits
  (essentially all CD, RPD, indirect, and implant restoration pathways).
  Pathways that complete in a single visit (most direct restorative, simple
  ext, urgent care) omit `labSteps` entirely.
- `category` and `phase` are required on every pathway. No exceptions.
- The legacy `domain` field is kept so the existing PATHWAY_GROUPS structure
  doesn't break during the transition. Long-term, `domain` can be dropped.

---

## The build sequence

### Step 0 — Foundation (DONE 2026-05-26)
- ✅ Cases tab sidelined (`PATHWAY_DOMAINS` and Cases nav entry commented out)
- ✅ `CASES-FOUNDATION.md` committed (philosophy, three trust rules, source
  hierarchy, in-scope criterion)
- ✅ `CASES-PROCEDURES.md` committed (extracted UIC content, per-pathway
  keep/cut review)
- ✅ `CASES-BUILD-PLAN.md` (this doc) committed

### Step 1 — Rename legacy data (commit 1)
- Rename `PATHWAYS` → `PATHWAYS_LEGACY_2026_05` in `src/App.jsx`
- Rename `PATHWAY_GROUPS` → `PATHWAY_GROUPS_LEGACY_2026_05`
- Rename `PATHWAY_DOMAINS` → `PATHWAY_DOMAINS_LEGACY_2026_05`
- Create new empty `const PATHWAYS = []`, `const PATHWAY_GROUPS = {}`,
  `const PATHWAY_DOMAINS = []` at the same locations
- The Cases renderer reads `PATHWAYS` etc.; with these empty, the tab would
  render empty if unhidden (which it currently isn't)
- Verify build passes (`npx vite build`)
- Commit message names this as the rename commit and explains the rebuild

### Step 2 — Renderer prep (commit 2)
- Modify `keyDecisions` rendering to handle BOTH old (string) and NEW (object
  with `{text, source}`) forms, since the legacy array will need to keep
  rendering if we ever turn it back on for reference. Use a helper:
  ```js
  function renderKeyDecision(kd) {
    if (typeof kd === 'string') return { text: kd, source: null };
    return kd;
  }
  ```
- Add a `LabStepBand` component in the Cases card renderer that:
  - Renders between phases per the `after` index
  - Visual: paper-colored background (slightly different from clinical phase
    blocks), "LAB" tag in accent color, italic body, monospace source
    footnote underneath
  - Includes turnaround text if present
- Phase + category visual indicators on the pathway card header
- Build passes, no rendering crashes (test by setting a tiny test pathway)

### Step 3 — Build `cd-conventional` (commit 3)
**This is the first real pathway.** Read sequentially:

Required UIC PDFs (located in `/Users/jakeshea/Desktop/HY Folders/Dentistry Files/01 Clinical Reference/Complete Dentures/ALL CD FILES/`):

| Lab step it covers | PDF |
|---|---|
| Diagnostic impressions + custom tray fabrication | `Custom tray_Boxing_ Technique.pdf`, `Boxing and Pouring(1).pdf`, `Dental Stones.pdf` (Phase 1 FPD folder) |
| Border molding + final impression | `DAOB Removable Prosth - Final Impression - SALARI-Final.pdf`, `Anatomy of the edentoulus oral cavity, Posterior palatal seal _Dr. Obrez_.pdf`, `Vibrating line and posterior palatal seal area(1).pdf` |
| Master cast + record bases + wax rims | `Record Base & Wax Rim - Reminders.pdf`, `Record Bases Grading Sheet_2022.pdf` |
| Articulator setup + facebow + mounting | `Articulator+Facebow.pdf`, `Mark300-Inst_07141.pdf`, `Jaw Relation Records copy.pdf` |
| Tooth selection + setup | `Chapter 12_Tooth Arrangement.pdf`, `Anterior teeth set up-Technique.pdf`, `Monoplane Set up Grading_2024.pdf`, `Monoplane-Balancing ramp set up_2021.pdf`, `Denture occlusion and articulation, Hanau's quint - Dr. Obrez.pdf` |
| Wax try-in | `Clinical Evaluation of the Trial Denture_2025.pdf`, `24_Final_wax_contouring_UIC(1).pdf` |
| Processing | `Processing+Festooning.pdf`, `26_Denture_processing(1).pdf` |
| Delivery | `Complete Denture Delivery and follow-up.pdf`, `Delivery of Final Denture(2).pdf` |
| Comprehensive guide | `Comprehensive CD Guide.docx` (read this first for the overarching framework) |
| Weekly lab structure | `Week 2_Lab session.pdf`, `Week 3_Lab Exercise.pdf`, `Week 4_Lab session(3).pdf`, `Week 6_Lab Exercise.pdf`, `Week 7_Lab session(1)_2021.pdf`, `Week 14_Lab Exercise_2022.pdf` |

**Per-pathway build recipe** (apply this template):

1. **Read source PDFs sequentially.** Don't skim. Extract:
   - Visit sequence (clinical visits, in order)
   - Lab work between each visit
   - Decision points the student makes
   - CDT codes (cross-reference with `RVU_DATA` array in App.jsx)
   - Materials list (cross-reference with Swade chunk 1232)
   - Source citation for every fact (PDF + page number)

2. **Map to the new schema.** For cd-conventional:
   - `category: "dentures"`
   - `phase: "phase3"`
   - `domain: "cd"` (legacy)
   - 8 clinical phases (Pre-prosth eval → Diagnostic + custom tray → Border
     molding + final imp → Records (wax rim + facebow + CR) → Wax try-in →
     Processing → Delivery → Follow-up). May adjust based on what the PDFs
     actually say.
   - ~5 labSteps blocks (between clinical phases as the PDFs describe them)
   - keyDecisions distilled from the Comprehensive CD Guide + delivery PDF

3. **Write the pathway** into the new (empty) `PATHWAYS` array.

4. **Add to `PATHWAY_GROUPS`** under the appropriate phase grouping:
   ```js
   const PATHWAY_GROUPS = {
     phase3: [
       { label: "Dentures", ids: ["cd-conventional"] },
       // ...
     ],
   };
   ```

5. **Build verification:**
   - `npx vite build` passes
   - No React rendering errors when the Cases tab is temporarily unhidden
   - labSteps render between the correct phases
   - Source citations show on hover (or wherever the renderer puts them)

6. **Commit** with a message that:
   - Names every source PDF used
   - Notes the phase count + labStep count
   - Calls out any decision points where the PDFs were ambiguous or
     contradictory (so Jake can review)

7. **User review.** Temporarily unhide the Cases tab. User views the
   `cd-conventional` rendered pathway. Feedback → adjustments → re-commit.
   Re-hide the tab.

### Step 4 — Build `rpd-kennedy3` (commit 4-ish)

Required UIC PDFs (`/Users/jakeshea/Desktop/HY Folders/Dentistry Files/01 Clinical Reference/Removable Partial Dentures/ALL RPD FILES/`):

| Lab step it covers | PDF |
|---|---|
| Diagnostic + survey + design framework | `Lecture 1_Introduction To Removable Partial Denture_SHAHIN_2025.pdf`, `Lecture 2_Diagnosis and Treatment planning_ Sabbagh_2024.pdf`, `RPD Fall 2023 -Lab 4- Introduction to RPD Design-BS.pdf`, `RPD Fall 2022 Design Case I.pdf`, `Design Case II- BS- Fall 2022.pdf`, `RPD Summer 2023 Prelim Design Case2.pdf` |
| Intraoral preps (rest seats, guide planes) | `RPD Fall 2025 Lab 3- Preparations of GP and Rest Seats.pdf`, `RPD Fall 2023 Lab 5.pdf` |
| Custom tray + final impression | `RPD Fall 2022 Fabrication of custom tray, framework try-in.pdf`, `RPD Fall 2022 Final Impressions.pdf`, `Lab 6.pdf` |
| Framework try-in | (continued in same PDF as custom tray) |
| Wax rim + tooth setup | `RPD Fall 2022 Wax rims.pdf`, `RPD Fall 2022 Setting denture teeth.pdf` |
| Delivery | `Fall RPD 22 Delivery RPD.pdf`, `Fall 2023 RPD Lab 5.pdf` |
| Sequencing overview | `Lecture 4-Part A_RPD Sequencing.pdf`, `Lecture 4_Part B_Treatment sequence Removable Partial Dentures_SHAHIN_2025.pdf`, `RPD Treatment Sequence Fall 2022.pdf` |
| Lab Rx examples | `RPD Fall 2022 LabPresciption Example.pdf` |
| Comprehensive guide | `Comprehensive RPD Guide.docx` (read first) |

Same per-pathway recipe as Step 3. Same review-before-fanout pattern.

### Step 5 — Build `ind-conventional-crown` (commit 5-ish)

Required UIC PDFs (`/Users/jakeshea/Desktop/HY Folders/Dentistry Files/01 Clinical Reference/Fixed Prosthodontics/`):

Phase 1 folder (foundation):
- `Review and Overview.pdf`
- `Assessing Tooth Restorability Part 1.pdf`
- `Modified version Posterior FPD Preparation and Pontic Design.pdf`
- `Putty reduction cosiderations.pdf`
- `Dental Stones.pdf`
- `Mounting and Die Trimming.pdf`
- `Modified version - Bis-acryl Provisional Restorations for Posterior FPD.pdf`

Phase 2 folder (advanced):
- `Assessing Tooth Restorability Part 2.pdf`
- `Dental Alloys.pdf`
- `Metal Framework Fabrication & Try-in.pdf`
- `PFM Porcelain Application and Final Contouring.pdf`
- `Shade Taking and Porcelain Characterization.pdf`
- `Acrylic Provisional Restorations for Posterior FPD.pdf`
- `Information to include on lab prescription for FPD metal framework fabrication.pdf`
- `Information to include in lab prescription for FPD porcelain addition.pdf`

Root files:
- `2025-prosth-cast-metal-crown-criteria.pdf`
- `2025-prosth-pfm-crown-criteria.pdf`
- `2025-prosth-ceramic-crown-criteria.pdf`
- `2025-prosth-progress-form.pdf`

Same per-pathway recipe. Same review pattern.

### Step 6 — Fan-out to siblings

After the three model pathways are reviewed + approved, build:

- **CD family** (~3-4 more): `cd-iid` (immediate interim denture),
  `cd-adjustment`, `cd-reline-lab`, `cd-iod-canine-roots`,
  `cd-implant-supported-lower` (2-implant Mn overdenture)
- **RPD family** (~5-7 more): `rpd-distal-extension` (Kennedy I/II with altered
  cast), `rpd-kennedy4-anterior`, `rpd-broken-clasp`, `rpd-broken-denture-tooth`,
  `rpd-broken-framework`, `rpd-loose-rpd`, `rpd-reline`, `rpd-implant-hybrid`
- **Indirect family** (~10-15 more): `ind-digital-emax`, `ind-cad-cam-inlay-onlay`,
  `ind-veneers`, `ind-bridge`, `ind-survey-crown`, `ind-recement`,
  `ind-failing-existing-crown`, `ind-crown-endo-access-fill`, `ind-inlay`,
  `ind-post-and-core`, `ind-single-implant-crown`, `ind-cracked-tooth-syndrome`,
  `ind-onlay-vs-crown-decision`
- **Direct family** (~10 pathways): all dir-class1 through dir-class5, dir-amalgam,
  dir-sealant, dir-prr, dir-direct-veneer, dir-deep-caries-decision (read from
  Operative and Restorative folder + Swade chunks)
- **Endo family** (~9 pathways): endo-diagnosis-workflow, endo-anterior-rct,
  endo-premolar-rct, endo-molar-rct, endo-direct-pulp-cap, endo-indirect-pulp-cap,
  endo-necrotic-acute (urgent I&D), endo-necrotic-chronic, endo-broken-instrument
- **Surgery family** (~5 pathways): surgery-simple-ext, surgery-multi-rooted-ext,
  surgery-surgical-ext (faculty-supervised), surgery-dry-socket, surgery-post-op-bleed
- **Perio family** (~5 pathways): perio-coe (the Dx engine pathway),
  perio-prophy, perio-srp, perio-maintenance, perio-acute-abscess
- **Pedo family** (decision pending; if user confirms Option A, ~10-15 pathways
  from the Pedo folder content)
- **Urgent/cross family** (~5 pathways): cross-anterior-trauma,
  cross-cd-iod-implants, cross-rpd-to-implants, cross-anterior-implant-esthetic,
  cross-pre-radiation-extractions, cross-odontogenic-infection-airway-risk,
  cross-caries-risk, cross-sdf-arrest

Fan-out commits group by family (one commit per family is fine if individually
reviewed in a batch).

### Step 7 — Restore Cases to live nav

Once enough pathways are built to be useful (probably the three model pathways +
the families they unlock the immediate workflows for), restore the Cases entry
in the TABS array. The build is incrementally usable.

---

## Per-claim citation discipline

Every keyDecision and labStep body must trace to one of:

1. **A specific Swade chunk** by ID (e.g., `Swade chunk c060` for RCT anatomy,
   `Swade chunk 1232` for materials list, `Swade chunk c091.0` for antibiotic
   prophylaxis table). The Swade chunks are at lines ~39-22000 of `src/App.jsx`.

2. **A specific UIC PDF + page range** (e.g., `Tx Dx- Overview.pdf p. 7`,
   `RPD Fall 2022 Setting denture teeth.pdf p. 12-15`).

3. **A Stefanac & Nesbit chapter + section** (only for medical-risk-assessment
   content — most clinical claims should not need this).

**Rules:**

- The `source` field on each `keyDecision` and `labStep` is mandatory
- If a claim has no clear source, the claim doesn't go in
- "Common knowledge" is not a valid source ("everyone knows you HF etch e.max"
  doesn't pass — find the actual UIC source that says so)
- UIC lectures take precedence over external citations; if a UIC lecture says X
  and an external paper says Y, the pathway says X with the UIC source
- The Stefanac & Nesbit textbook is the required UIC TP textbook so its
  citations are fine for TP-foundation claims
- Brand names are OK if listed in Swade chunk 1232 (the materials list); brands
  not in Swade need a different UIC source or they get genericized

---

## What NOT to do (lessons learned)

The audit pass on the legacy PATHWAYS array surfaced patterns I introduced
across many iterations that we explicitly do not repeat:

- ❌ Citing external authorities to lend credibility (AAPD 2024, AHA 2021,
  AAE 2019, IADT 2020, McGill Consensus 2002, Aquilino & Caplan 2002, Reeh
  1989, Moore & Hersh JADA 2018). Even when the citation is accurate, the
  citation itself is the problem because students can't verify it.
- ❌ Specific stat claims dressed up as evidence ("5-year survival 84%
  vs 36%"). Strip the stat; keep the principle.
- ❌ Brand-name parentheticals for products not in Swade's materials list
  ("Z-Prime Plus", "Variolink Esthetic LC", "ParaPost Fiber White (Coltène)",
  "CoJet", "Rocatec"). Use type-level descriptors instead ("MDP-containing
  primer", "light-cure resin cement", "fiber post").
- ❌ Superlatives ("#1 cause", "the gold standard", "the modern default",
  "THE prognostic factor"). Use comparative phrasing ("a dominant factor",
  "leading cause", "preferred when feasible").
- ❌ Regulatory claims I can't verify ("Alvogyl discontinued in US/EU
  2019-2021", "AAPD radiograph guidelines Table 1"). Default to "check what
  the clinic stocks" or omit.
- ❌ Patient-modifier pathways that are just keyDecision variants of the
  main pathway (`cd-anxious-firsttime`, `rpd-tmd-considering`, etc.). If
  the patient-modifier matters, it's a keyDecision in the model pathway.
- ❌ Pathways for procedures the UG predoc doesn't do or doesn't refer
  through TP (`ind-large-span-fpd`, `cross-full-mouth-rehab`,
  `ind-3-4-crown`, `rpd-valplast-repair`). Cut, don't keep.

---

## Open questions to revisit later (NOT NOW)

These are deferred. Don't try to solve them during the build:

- **Picker UX redesign**: Should pills be phase-based (`Phase I`, `Phase II`...)
  or category-based (`Operative`, `Fixed`, `Dentures`...)? Or both, with one as
  primary filter and the other as secondary? Current legacy picker is
  domain-based (matches what's in `PATHWAY_DOMAINS_LEGACY_2026_05`).
  Build the simplest version that works; revisit when more pathways are built.
- **Cases ↔ Steps deep links**: each pathway's `sections` array references
  Swade chapter IDs. The renderer could deep-link to the Steps tab at that
  chapter. Not blocking; nice-to-have.
- **Pedo as its own tab**: kept inline per user decision (Option A). Could
  spin to its own tab if the volume gets unwieldy.
- **Wizard mode**: the "future TODO" comment in legacy PATHWAY_GROUPS about a
  question-based wizard ("which tooth? vital? esthetic zone?") that routes the
  student to one specific scenario. Defer until base pathways are complete.

---

## Resume points for future Claude (or future Jake)

If you're picking this up cold:

1. **Read this doc first** (`CASES-BUILD-PLAN.md`).
2. **Then read** `CASES-FOUNDATION.md` (philosophy) and `CASES-PROCEDURES.md`
   (the extracted UIC content + the keep/cut decisions log).
3. **Check `src/App.jsx`** for current state:
   - Are `PATHWAYS_LEGACY_2026_05` etc. present? → Step 1 done
   - Is `LabStepBand` component present in the Cases renderer? → Step 2 done
   - How many pathways are in the new `PATHWAYS` array? Each one was a commit
4. **Pick up at the next step in the build sequence.** Each step has a clear
   stopping point (one pathway built, build passes, user review pending).
5. **Don't skip the per-pathway recipe.** No shortcuts. Read the PDFs. Cite
   the sources.

---

## User answers locked in (don't re-ask)

These are decided. Don't ask again unless you encounter a contradiction:

- **Sidelined-Cases approach**: confirmed — Cases tab hidden, rebuild in
  progress. Don't unhide until rebuild has enough pathways.
- **Legacy data location**: same file (`src/App.jsx`) with `_LEGACY_2026_05`
  suffix. Don't move to a separate file.
- **Pedo disposition**: keep in Cases (Option A). Don't cut or spin to own tab.
- **`ind-3-4-crown`**: CUT — not in UIC UG scope.
- **`rpd-valplast-repair`**: CUT — not done at UIC UG.
- **Patient-modifier pathways**: CUT (not merge) — content is mostly modifier
  hogwash; if the modifier matters, it's a keyDecision in the model pathway.
- **The 5 referral pathways** (perio-CL, perio-graft, cross-pre-prosth-surg,
  surgery-third-molar, endo-retreatment): CUT — content not UIC-accurate. If
  UIC lecture content reveals real need later, **remake from scratch**, don't
  recover from legacy.
- **Build order**: cd-conventional → rpd-kennedy3 → ind-conventional-crown →
  fan-out by family.
- **Review cadence**: user reviews live after each model pathway; user reviews
  commit diffs for fan-out siblings.
- **Citation discipline**: source per claim, mandatory. No exceptions.
- **Agents**: no parallel agents for the build. Sequential, by me, one
  pathway at a time. Parallel agents are okay for mechanical extraction work
  if it comes up later, but the build itself is sequential.

---

## What's already in the repo (commits to look at if confused)

Recent foundation commits (read these in order if picking up cold):

```
c7ade6a  Sideline Cases tab + write CASES-FOUNDATION + CASES-PROCEDURES
a5af915  CASES-PROCEDURES: capture the UIC 6-phase TP framework from Tx Dx- Overview
62459c2  CASES-PROCEDURES: full keep/cut/reframe/merge list for review
```

Files to start with:
- `CASES-FOUNDATION.md` — why we're rebuilding this way
- `CASES-PROCEDURES.md` — what we extracted from UIC PDFs
- `CASES-BUILD-PLAN.md` — this doc, the execution recipe
- `src/App.jsx` — the code. Cases nav entry is currently commented out around
  line 27913. PATHWAYS array currently has the legacy ~100 entries; rename to
  `_LEGACY_2026_05` and start fresh per Step 1 above.

---

## Final note

This doc captures the **plan**. It's binding. If something below conflicts with
what's actually been built, the build is wrong, not the doc — fix the build to
match. If something in this doc proves wrong in practice, update the doc
deliberately with a date-stamped revision note, not silently.

The goal: a Cases tab the UIC predoc student opens and trusts. Every claim has
a source. Every procedure is in scope. The lab steps fill the gap between
appointments that Steps can't reach. The DxTP framework gives the case its
place in the comprehensive treatment plan. That's it.
