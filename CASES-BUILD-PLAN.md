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

### Step 2 — Renderer prep (DONE — commit 4881ad0)

What was added (so future-Claude doesn't reimplement):

**`PHASE_LABELS` + `CATEGORY_LABELS` constants** at module scope, near the
new empty PATHWAYS array. Maps schema ids to display strings:

```js
const PHASE_LABELS = {
  urgent: "Urgent", dx: "Diagnostic",
  phase1: "Phase I", phase2: "Phase II",
  phase3: "Phase III", phase4: "Phase IV",
};
const CATEGORY_LABELS = {
  operative: "Operative", digital: "Digital", fixed: "Fixed",
  dentures: "Dentures", perio: "Perio", endo: "Endo",
  os: "OS", sti: "STI", iod: "IOD", pedo: "Pedo",
};
```

**KeyDecisions rendering — REMOVED 2026-05-27 per user feedback.** The
"What's specific to this scenario" framing belonged to the old scenario-
builder model. Pathways are now generic procedures. The keyDecisions
field is still tolerated in data (legacy pathways may still have it) but
the renderer no longer surfaces it. New pathways should omit the field
entirely.

**Lab Rx callout** (added 2026-05-27) replaces the keyDecisions section
between Description and Sequence. Pathways set `labRx: [templateId, ...]`
referencing the existing `TEMPLATES` (LAB_SCRIPTS) data. The renderer
looks up each template id and shows the Rx text in a monospace block on
a paper-colored background. Spotlights the "central-lab interactions"
angle that's central to the Cases-tab differentiator.

**Source citations on labSteps — no longer rendered.** Source field stays
in data (per CASES-FOUNDATION.md trust rules — every claim has a source
we can audit), but it's hidden from the UI. It's a data-integrity tool,
not student-facing copy.

**Sequence card promoted to visual hero.** Border thickened, accent-color
left edge (3px), more padding (20px 26px when open), larger uppercase
header (0.95rem). Drop-shadow + radius increased for prominence.

**Card-header badges** under the h2 title, conditional on `phase`/`category`
existing on the pathway:
- Phase badge: solid accent background, paper-colored text, padding `3px 9px`
- Category badge: white card background, accent border, accent text, padding `2px 9px`
- Both: `0.62rem`, uppercase, `0.14em` letter-spacing, 600 weight
- Hidden entirely when neither field is set (so legacy pathways unchanged)

**Lab-step band rendering** interleaved within the existing `phases.forEach`
loop. The helper function `renderLabStep(ls, key)` produces:
- Paper-colored background (`var(--paper, #FBF8F2)`)
- Dashed border (`var(--rule-soft, var(--rule))`)
- Header row (flex, baseline alignment, wrappable):
  - "Lab" tag: solid accent block, paper-colored text, `0.6rem`, uppercase
  - Title: `0.78rem`, weight 500, ink color
  - Turnaround (optional): `0.7rem`, ink-faint, italic, right-aligned via `marginLeft: auto`
- Body: `0.8rem`, line-height 1.55, ink-soft, italic
- Source (optional): `0.66rem`, ink-faint, monospace, opacity 0.75

**`after` index semantics:**
- `after: -1` → lab band renders before phase 0 (loop pre-pass)
- `after: N` → lab band renders between phase N and phase N+1 (after the
  phase's `rendered.push(...)`)
- Multiple lab steps can share the same `after` value — they render in
  array order

**Backward compatibility verified**: a pathway without `phase`, `category`,
or `labSteps` fields renders exactly as before. The legacy keyDecisions
(strings) also render with no source footnote.

**Build verification: `npx vite build` passes.** Bundle size 2.29 MB
(unchanged from Step 1 since the new renderer code is tiny vs the legacy
data that got tree-shaken).

### The temporary-unhide-for-visual-review pattern

Before Step 3 lands, this pattern is useful and worth captureing for the rest
of the build:

1. Write a **test pathway** (or the next real model pathway).
2. **Temporarily unhide the Cases tab** by uncommenting the `{ id: "pathways", label: "Cases", ... }` entry in the TABS array (near line 27916).
3. Add the test/model pathway to `PATHWAYS` and a matching minimal entry to
   `PATHWAY_DOMAINS` + `PATHWAY_GROUPS` so the picker can reach it.
4. Commit + push.
5. User reviews live on Vercel.
6. Adjust visual treatment / content based on feedback.
7. For the test-pathway flow: subsequent commit removes the test data
   and re-hides the tab. For the real-pathway flow: tab stays unhidden as
   more content lands; the rebuild becomes incrementally usable.

The test-pathway approach is a one-time-only proof-of-concept before
`cd-conventional` lands, to verify the visual treatment of phase
badges + lab bands works as intended. After cd-conventional is built,
this pattern continues with real pathways — the test/throwaway phase
ends.

### Step 3 — Build `cd-conventional` (commit 3)
**This is the first real pathway.** Read sequentially.

**Canonical visit structure (locked in 2026-05-27):** 8 clinical visits + 5
lab blocks, per Swade page 80. Try-in is **two separate appointments**
(anterior try-in then posterior try-in) — not one. Do not collapse them.

```
Visit 1 — Dx + TP + diagnostic impressions
   ↓ Lab #1 — pour diagnostic casts, fabricate custom trays
Visit 2 — Border molding + final impression
   ↓ Lab #2 — box & pour master casts, fabricate record bases + wax rims
Visit 3 — Wax-rim try-in + JRR + facebow + tooth selection
   ↓ Lab #3 — mount master casts (max via facebow, mand via JRR), set anterior teeth
Visit 4 — Anterior teeth try-in
   ↓ Lab #4 — set posterior teeth
Visit 5 — Posterior teeth try-in
   ↓ Lab #5 — final wax contouring + festoon + invest + process + deflask + finish
Visit 6 — Delivery
Visit 7 — 24-hour follow-up
Visit 8 — 1-week follow-up
```

**Sources allowed (primary UIC documents only):** located in
`/Users/jakeshea/Documents/Dentistry Files/ALL CD FILES/`.

| Lab block it covers | UIC source PDFs (slide decks / worksheets / grading sheets) |
|---|---|
| Visit 1 (clinical) + Lab #1 (diagnostic casts + custom trays) | `Custom tray_Boxing_ Technique.pdf`, `Boxing and Pouring(1).pdf`, `Custom Tray Grading Sheet_2022.pdf` |
| Visit 2 (clinical) + Lab #2 (master casts + record bases + wax rims) | `DAOB Removable Prosth - Final Impression - SALARI-Final.pdf`, `Vibrating line and posterior palatal seal area(1).pdf`, `Anatomy of the edentoulus oral cavity, Posterior palatal seal _Dr. Obrez_.pdf`, `Record Base & Wax Rim - Reminders (1).pdf`, `Record Bases Grading Sheet_2022.pdf` |
| Visit 3 (clinical) + Lab #3 (mounting + anterior tooth setup) | `Articulator+Facebow.pdf`, `Jaw Relation Records copy (1).pdf`, `Anterior teeth set up-Technique.pdf` |
| Visit 4 (anterior try-in) | `Clinical Evaluation of the Trial Denture_2025.pdf` |
| Lab #4 (posterior tooth setup) | `Monoplane Set up Grading_2024.pdf`, `Monoplane-Balancing ramp set up_2021.pdf`, `Denture occlusion and articulation, Hanau's quint - Dr. Obrez.pdf`, `33 Degree Teeth Set-up (Bilateral Balanced Articulation) Grading Sheeet_2024.pdf` |
| Visit 5 (posterior try-in) | `Clinical Evaluation of the Trial Denture_2025.pdf` |
| Lab #5 (final wax + processing) | `24_Final_wax_contouring_UIC(1).pdf`, `Processing+Festooning.pdf`, `26_Denture_processing(1).pdf` |
| Visit 6 (delivery) | `Complete Denture Delivery and follow-up.pdf`, `Delivery of Final Denture(2).pdf` |
| Visits 7–8 (follow-ups) | `Complete Denture Delivery and follow-up.pdf` (follow-up section) |

**Explicitly disqualified for cd-conventional:**
- `"Comprehensive CD Guide".docx` — disqualified compiled guide
- `CD Comprehensive Guide.html` — disqualified compiled guide
- `CD Comprehensive Appointment Guide (UIC).pdf` — derived from the
  disqualified compiled guide despite the "UIC" filename suffix
- `CD Comprehensive Guide — Deep Dives (UIC).pdf` — same
- Any `.docx` content from the folder

**Borderline (ASK USER before using):**
- `Mark300-Inst_07141.pdf` — Whip Mix manufacturer instruction manual
- `TruExpression Mould Chart_Literature_EN.pdf` — Dentsply commercial mould chart
- `facebow_tech_spec_gen_lr1 2.pdf` — manufacturer tech spec
- `Chapter 12_Tooth Arrangement.pdf` — likely a textbook chapter, not a UIC lecture
- `denture base materials_ 2024.pdf` — author/origin unclear
- `Edentulous Anatomy & Support Areas_1_.pdf` — likely UIC presentation but verify
- `Treatment planning.pdf` — generic name, verify it's a UIC lecture not a compilation

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
   - **Phantom-visual scrub**: no `table`/`figure`/`diagram`/`see below`/`see
     above` references to elements the card doesn't render (see "What NOT to
     do (lessons learned)" — this bit cd-conventional and must be checked on
     every Map)

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

### Step 6 — Fan-out to siblings — comprehensive source map

After the three model pathways are reviewed + approved. Each pathway below
lists the PDFs to read before writing it. Paths are relative to the
Dentistry Files root (`/Users/jakeshea/Desktop/HY Folders/Dentistry Files/`).
A path of `01CR/` means `01 Clinical Reference/`.

If a pathway's row says "**Gap**: ...", we don't have enough UIC source to
write it confidently yet — flag for Jake to share more content, or skip
that pathway in this rebuild.

#### CD / IOD family (Category: Dentures or IOD · Phase III/IV)

| Pathway | Primary UIC sources |
|---|---|
| `cd-conventional` *(model — built in Step 3)* | Full source map listed in Step 3 above |
| `cd-iid` (immediate interim denture) | `01CR/Complete Dentures/ALL CD FILES/IMMEDIATE DENTURES - Dr. Agrawal.pdf`; `Immediate Dentures_1_ (1).pdf`; `Immediate Dentures_1_.pdf`; Han lecture `Dx and Tx Planning (Spring 2025).pdf` slides 49-50 on IID prosthesis planning (VDO + lip support) |
| `cd-adjustment` | `01CR/Complete Dentures/ALL CD FILES/Complete Denture Delivery and follow-up.pdf` (follow-up section); same delivery PDF; Swade chunk 4374 (CD adjustment note template) |
| `cd-reline-lab` | `01CR/Complete Dentures/ALL CD FILES/Reline rebase and repair - Bin Yang.pdf`; Swade chunk 4454 (F/ lab reline note template) |
| `cd-iod-canine-roots` | **Gap**: No dedicated UIC tooth-retained-overdenture lecture in folder. Use the `Comprehensive CD Guide.docx` IOD section + the Implantology folder lectures cross-referenced + Swade chunks for the overall workflow. If insufficient, flag for additional content. |
| `cd-implant-supported-lower` (2-implant Mn OD) | **Gap**: same as above. `01CR/Implantology/IMPLANT TBL LECTURE.pptx` may have attachment coverage. Han lecture slides 49+ touch on IOD context. Likely need additional UIC IOD-specific content from Jake. |

#### RPD family (Category: Dentures · Phase III or IV)

| Pathway | Primary UIC sources |
|---|---|
| `rpd-kennedy3` *(model — built in Step 4)* | Full source map listed in Step 4 above |
| `rpd-distal-extension` (Kennedy I/II) | `01CR/Removable Partial Dentures/ALL RPD FILES/RPD Treatment Sequence Fall 2022.pdf` (sequencing); `Lecture 4-Part A_RPD Sequencing.pdf`, `Lecture 4_Part B_Treatment sequence...pdf`; `RPD Fall 2022 Final Impressions.pdf` (altered-cast technique section); `Fall RPD 22 Combination Syndrome.pdf` (Kennedy I considerations); `Design Case II- BS- Fall 2022.pdf` (worked Kennedy I/II example) |
| `rpd-kennedy4-anterior` | Same sequencing lectures as above; `RPD Fall 2022 Setting denture teeth.pdf` (anterior esthetic considerations); `Comprehensive RPD Guide.docx` (Kennedy IV section) |
| `rpd-broken-clasp` | `01CR/Removable Partial Dentures/ALL RPD FILES/Reline_Rebase_Repair of RPD Fall 2022.pdf`; Swade chunks for repair note templates |
| `rpd-broken-denture-tooth` | Same as broken-clasp |
| `rpd-broken-framework` | Same as broken-clasp + `Comprehensive RPD Guide.docx` for the remake-vs-repair decision logic |
| `rpd-loose-rpd` | `Reline_Rebase_Repair of RPD Fall 2022.pdf` (causes of loose RPD section); `Fall RPD 22 Combination Syndrome.pdf` (combination-syndrome-driven looseness) |
| `rpd-reline` | `Reline_Rebase_Repair of RPD Fall 2022.pdf`; Swade chunk for F/ reline procedure |
| `rpd-implant-hybrid` | **Gap**: cross-references RPD lectures + Implantology folder. `RPD Fall 2022 Retainers.pdf` (attachment retainers section). Likely needs additional content. |
| `rpd-interim-immediate` (was "Summer RPD 2023 Interim RPD") | `01CR/Removable Partial Dentures/ALL RPD FILES/Summer RPD 2023- Interim Removable Partial Denture-BS.pdf`; Swade `lab-ii-rpd` Rx template (chunk 120) |

#### Indirect / Fixed Prosth family (Category: Fixed or Digital · Phase III)

| Pathway | Primary UIC sources |
|---|---|
| `ind-conventional-crown` *(model — built in Step 5)* | Full source map listed in Step 5 above |
| `ind-digital-emax` | `01CR/Digital Dentistry/Phase 1 DAOB Digital Dentistry/2024- Intraoral scan introduction- presentation.pdf`; `CAD CAM Dentistry Oveview- 2024.pdf`; `Design Studio- steps.pdf`; `DAOB Phase 2 Digital Dentistry/Posterior crown prep #5.pdf`; Swade chunk 5062 (e.max crown prep note template) |
| `ind-cad-cam-inlay-onlay` | `01CR/Digital Dentistry/Phase 1 DAOB Digital Dentistry/Inlays and Onlays Overview.pdf`; `Inlays to Onlay criteria.pdf`; `DAOB Phase 2 Digital Dentistry/#14 Onlay & #30 Inlay.pdf`; `Inlay Scan and Design.pdf`; Swade chunks 5004 (digital inlay prep) and 5032 (digital onlay prep) |
| `ind-veneers` | **Gap**: No dedicated UIC veneer lecture in the Fixed Prosth folder. The current pathway content may not be UIC-anchored. Use `01CR/Fixed Prosthodontics/Phase 1 DAOB Fixed Prosth/Modified version Posterior FPD Preparation and Pontic Design.pdf` for prep principles transferred to anterior + `Shade Taking and Porcelain Characterization.pdf` for shade. May need additional UIC veneer content from Jake; consider deferring or building lightly. |
| `ind-bridge` | `01CR/Fixed Prosthodontics/Phase 2 DAOB Fixed Prosth/Metal Framework Fabrication & Try-in.pdf`; `Information to include on lab prescription for FPD metal framework fabrication.pdf`; `Information to include in lab prescription for FPD porcelain addition.pdf`; `PFM Porcelain Application and Final Contouring.pdf`; Phase 1 `Modified version Posterior FPD Preparation and Pontic Design.pdf` (pontic design) |
| `ind-survey-crown` | Cross-reference: `01CR/Removable Partial Dentures/ALL RPD FILES/Lecture 3_Maxillo-mandibular relationship_SHAHIN_2025.pdf` + `RPD Fall 2023 -Lab 4- Introduction to RPD Design-BS.pdf` (surveyed features integrated into crown); Fixed Prosth Phase 1 `Review and Overview.pdf` for crown workflow basis; Swade `lab-survey-crown` template (chunk 119) |
| `ind-recement` | **Gap**: No dedicated UIC re-cement lecture. Use Swade chunks for re-cement note templates + the Fixed Prosth Phase 1 `Review and Overview.pdf` cementation section. Decision logic (re-cement vs remake) is mostly clinical principles. |
| `ind-failing-existing-crown` | Cross-reference: Fixed Prosth `Assessing Tooth Restorability Part 1.pdf` + `Part 2.pdf` (decision logic for restorability of teeth under existing crowns) |
| `ind-crown-endo-access-fill` | `01CR/Endodontics/Restoring Endodontically Treated Teeth.pdf`; `01CR/Endodontics/Week 7 -Restoring Endodontically Treated Teeth.pdf`; Swade chunk 3319 (crown endo access fill note template) |
| `ind-inlay` | `01CR/Fixed Prosthodontics/Phase 1 DAOB Fixed Prosth/Modified version Posterior FPD Preparation and Pontic Design.pdf` (prep principles); cross-reference with `ind-cad-cam-inlay-onlay` digital lectures for material/cement considerations |
| `ind-post-and-core` | `01CR/Endodontics/Restoring Endodontically Treated Teeth.pdf` (ferrule + post discussion); `01CR/Endodontics/Week 7 -Restoring Endodontically Treated Teeth.pdf`; Fixed Prosth Phase 1 `Review and Overview.pdf` for restorability assessment |
| `ind-single-implant-crown` | `01CR/Implantology/IMPLANT TBL LECTURE.pdf` (implant restoration coverage); `Peri-implantitis lecture Final.pdf` (residual cement concern); Swade chunks 4574-4812 (implant impression → custom abutment → cement note templates) |
| `ind-cracked-tooth-syndrome` | **Gap**: No dedicated UIC cracked-tooth-syndrome lecture in folder. Use Fixed Prosth `Assessing Tooth Restorability Part 2.pdf` for restorability decision logic. Mostly principles-based. |
| `ind-onlay-vs-crown-decision` | Fixed Prosth `Assessing Tooth Restorability Part 1.pdf` + `Part 2.pdf` (the decision pathway); Digital `Inlays to Onlay criteria.pdf` (when to expand from inlay to onlay) |

#### Direct / Operative family (Category: Operative · Phase I)

The Operative and Restorative folder is **sparse on lectures** — content is in
the "From All folder" subfolder which has mostly study guides + exam material.
The Swade chunks below are the primary source for the per-appointment workflow;
UIC PDFs supplement with prep principles and grading criteria.

| Pathway | Primary UIC sources |
|---|---|
| `dir-class1` | `01CR/Operative and Restorative/From All folder/Class I Composite 2024.docx`; Swade chunks for Class I composite note templates |
| `dir-class2` | `01CR/Operative and Restorative/From All folder/HUDDLE for Class II composite.docx`; `Class II Amalgam #3 MO.pdf`; `Class II PE Instructions 2024.pdf`; `Shea_Jacob_Slot Prep Tips Part 1_2024.pdf` + `Part 2_2024.pdf` (these are by Jake!) |
| `dir-class3` | Swade chunks (Class III composite note template); `01CR/Operative and Restorative/From All folder/Operative Dent Final Exam Study Guide.pdf` (Class III section) |
| `dir-class4` | `01CR/Operative and Restorative/From All folder/8 9 Diastema Closure.pptx`; `Diastema Closure Huddle Students 2023.docx` (Class IV + diastema closure principles); Swade chunks |
| `dir-class5` | `01CR/Operative and Restorative/From All folder/Operative Dent Final Exam Study Guide.pdf`; Swade chunks |
| `dir-amalgam` | `01CR/Operative and Restorative/From All folder/Class II Amalgam #3 MO.pdf`; `DAOB 312 Amalgam Removal Huddle (5).docx`; Swade chunks |
| `dir-sealant` | Swade chunks (sealant note template + lab procedure); cross-reference Pedo `DOST 331 Pediatric Restorative (1).pptx` for prevention principles |
| `dir-prr` | Swade chunks (PRR note template); same Pedo cross-reference |
| `dir-direct-veneer` | `01CR/Operative and Restorative/Direct Veneer Pics/*.png` (10+ technique screenshots — these are Jake's reference images for direct veneer technique); Swade chunks for note template |
| `dir-deep-caries-decision` | Decision pathway — pulls from `dir-class1`/`dir-class2` deep-caries handling + `endo-direct-pulp-cap`. Cross-reference: `01CR/Endodontics/Vital pulp therapy 2025.pdf` |

#### Endo family (Category: Endo · Phase I or Urgent)

| Pathway | Primary UIC sources |
|---|---|
| `endo-diagnosis-workflow` | `01CR/Endodontics/ENDO Notes.pdf`; `Hindy lecture.pdf` (pulpal + periapical Dx terminology); cross-reference `01CR/Treatment Planning and Diagnosis/ALL DxTP FILES/endo_eval_and_tx_planning_3-25-2020 - Copy(1).pdf` |
| `endo-anterior-rct` | `01CR/Endodontics/Phase 1 DAOB Endodontics/week 2 anterior access.pdf`; `week 3 WL determination.pdf`; `week 3 principles of root canal preparation.pdf`; `week 4 Guide path preparation, hand Niti preparation.pdf`; Swade chunks (anterior RCT note + steps); `Crown-Down, Step-Back Manual Weeks-Baker 2015.doc` |
| `endo-premolar-rct` | `01CR/Endodontics/Phase 1 DAOB Endodontics/week 2 Premolar Access.pdf` + same WL/prep weeks as anterior; Swade chunks |
| `endo-molar-rct` | `01CR/Endodontics/Phase 1 DAOB Endodontics/week 1 Molar Access.pdf` + same WL/prep weeks; `DAOB Phase 2 Endodontics/week 5 Engin-Driven Rotary preparation.pdf`; `week 6 Engin-Driven Rotary preparation II.pdf`; `week 7 obturation.pdf`; Swade chunks (molar RCT note + steps); `Powered Canal Preparation Method Vortex Blue 150518.doc` (Vortex orifice opener reference) |
| `endo-direct-pulp-cap` | `01CR/Endodontics/Endo Lectures/Vital pulp therapy 2025.pdf`; Swade chunks for direct pulp cap procedure |
| `endo-indirect-pulp-cap` | Same `Vital pulp therapy 2025.pdf`; cross-reference `dir-deep-caries-decision` |
| `endo-necrotic-acute` (acute I&D) | `01CR/Endodontics/Endo Lectures/Management of Endodontic Emergencies DAOB 303 322 DBCS 327 2025.pdf`; `01CR/Endodontics/Management of Endodontic Emergencies DAOB 303 322 DBCS 327 2024 mod 200326.pdf`; Swade chunks (acute apical abscess note template) |
| `endo-necrotic-chronic` | Same emergency-management lectures; `01CR/Endodontics/Problem Avoidance in Endo Clinic.pdf` |
| `endo-broken-instrument` | `01CR/Endodontics/DAOB Phase 2 Endodontics/week 8 Endodontic problem solving.pdf`; `Problem Avoidance in Endo Clinic.pdf` |
| `endo-trauma-replantation` (avulsion) | `01CR/Endodontics/Endo Lectures/TRAUMA guidelines UIC.key.pdf.pptx` (the TRAUMA lecture); `New Techniques in Endo.pdf` for follow-up content |
| `endo-fractured-anterior` (Ellis II/III) | TRAUMA lecture (same); `01CR/Endodontics/Endo Lectures/Vital pulp therapy 2025.pdf` for vital pulp therapy decision on Ellis III with pulp exposure |

#### Surgery / OS family (Category: OS · Phase I or Urgent)

| Pathway | Primary UIC sources |
|---|---|
| `surgery-simple-ext` | `01CR/Oral Surgery/OS Surgical Principles Instrumentation.pptx`; Swade chunks for simple extraction note template + steps |
| `surgery-multi-rooted-ext` | Same `OS Surgical Principles Instrumentation.pptx`; `01CR/Oral Surgery/OS Lectures/Complications and Post-Op Management.pdf` (sectioning when needed); Swade chunks |
| `surgery-surgical-ext` (faculty-supervised) | `01CR/Oral Surgery/Impacted Teeth_weyh 2024.pdf` (surgical flap technique principles); `OS Lectures/Complications and Post-Op Management.pdf`; Swade chunks |
| `surgery-dry-socket` | `01CR/Oral Surgery/Complications and Post-Op Management copy.pdf`; `01CR/Oral Surgery/Wound Healing Lecture.pdf`; Swade chunks for dry-socket note template |
| `surgery-post-op-bleed` | Same `Complications and Post-Op Management copy.pdf`; Swade chunks |
| `surgery-fractured-anterior` (trauma — to be reconciled with `endo-fractured-anterior` since they overlap) | TRAUMA lecture + `01CR/Endodontics/Endo Lectures/Vital pulp therapy 2025.pdf`. **Decision needed during build**: merge into one cross-trauma pathway or keep distinct entries |

#### Perio family (Category: Perio · Phase I, IV, or Urgent)

| Pathway | Primary UIC sources |
|---|---|
| `perio-coe` (the Dx engine pathway) | `01CR/Periodontics/Updated Study Manual for Periodontology - revised 11-11-20.pdf`; `Student Presentation- Periodontal Screening and Recording_SA_FA 5-12-22.pdf`; AAP 2018 framework is encoded in the existing perio Dx engine in App.jsx (functional implementation, not a citation) |
| `perio-prophy` | Swade chunks (adult prophy note + steps); cross-reference `01CR/Periodontics/Phase 1 DAOB Periodontics/Week 2- Overview of the Non-Surgical Periodontal Therapy.pdf` |
| `perio-srp` | `01CR/Periodontics/Phase 1 DAOB Periodontics/Week 2- Overview of the Non-Surgical Periodontal Therapy.pdf`; `Week 3- 4-6 Post SRP Reevaluation- Dr. Ashrafi.pdf` (the post-SRP re-evaluation timing); Swade chunks |
| `perio-maintenance` | Cross-reference: `01CR/Treatment Planning and Diagnosis/ALL DxTP FILES/Periodontal aspects of treatment planning 2020-Ashrafi(1)(1).pdf`; `Week 3- 4-6 Post SRP Reevaluation- Dr. Ashrafi.pdf`; Swade chunks |
| `perio-acute-abscess` | **Gap**: no dedicated UIC acute-abscess perio lecture. Use principles from `Updated Study Manual for Periodontology` + `Week 1- Highly Destructive Form of Periodontitis-Dr. Ashrafi.pdf`. Pulp-test differential from `endo-diagnosis-workflow` cross-reference. |

#### Pedo family (Category: Pedo · keep per Option A) — **COVERAGE IS THIN**

The Pediatric Dentistry folder at `01CR/Pediatric Dentistry/` is **empty**.
DOST 331 coursework has only 3 weeks of content (Week 1 Allergic Reaction,
Week 2 JIA/TMJ, Week 3 Pediatric Restorative). The Dentistry Files root has
`Pediatrics Comprehensive Cases.docx`.

| Pathway | Available sources |
|---|---|
| `pedo-composite` | `02 Coursework and Exams/DOST 331/Week 3 Dost/DOST 331 Pediatric Restorative (1).pptx`; Swade chunks for note templates; `Pediatrics Comprehensive Cases.docx` |
| `pedo-stainless-crown` (SSC) | `02 Coursework and Exams/DOST 331/Week 3 Dost/DOST 331 Pediatric Restorative (1).pptx`; Swade chunks; `01CR/Operative and Restorative/From All folder/SSC Criteria Sheets.pdf`; `SSC PE #2 Rubric.pdf` |
| `pedo-pulpotomy` | Same Week 3 Pediatric Restorative + Swade chunks |
| `pedo-strip-crown` (primary anterior) | Same + Swade chunks |
| `pedo-sealant`, `pedo-fluoride-varnish` | Swade chunks; `Pediatrics Comprehensive Cases.docx` |
| `pedo-space-maintainer` | Swade chunks; `Pediatrics Comprehensive Cases.docx` |
| `pedo-primary-trauma`, `pedo-extraction` | Swade chunks; cross-reference TRAUMA lecture (note: primary tooth trauma protocol DIFFERS from permanent — don't replant primary) |
| `pedo-poe-recall`, `pedo-behavior-management`, `pedo-local-anesthetic` | Swade chunks (these are mostly clinical-workflow chapters that Swade covers in depth) |
| `pedo-deep-caries-or-pulpotomy` decision | Same Week 3 Pediatric Restorative + cross-reference `dir-deep-caries-decision` |
| `pedo-medications-reference` (reference-only) | Cross-reference adult Pharmacology folder; Swade chunks |

**Gap flagged**: Pedo coverage in the available source PDFs is significantly
thinner than CD/RPD/FPD. Recommend either (a) doing the Pedo pathways from
Swade chunks alone as the primary source (since Swade has comprehensive Pedo
coverage already), or (b) flagging for Jake to share more Pedo lecture
content if it exists.

#### Urgent / cross family (multi-domain combos)

| Pathway | Primary UIC sources |
|---|---|
| `cross-anterior-trauma` (multi-option discussion) | TRAUMA lecture; `Vital pulp therapy 2025.pdf`; cross-reference with implant + FPD + RPD pathways for the replacement options discussion |
| `cross-cd-iod-implants` (existing CD → add implants) | Implantology folder + CD `Comprehensive CD Guide.docx` IOD section + Han lecture slides 49+ |
| `cross-rpd-to-implants` (RPD patient → implants) | RPD `Retainers.pdf` (attachment options); Implantology folder |
| `cross-anterior-implant-esthetic` (anterior single-implant) | Implantology `IMPLANT TBL LECTURE.pdf`; `Peri-implantitis lecture Final.pdf` |
| `cross-pre-radiation-extractions` (pre-radiation oncology coordination) | Han lecture (`Dx and Tx Planning (Spring 2025).pdf`) slides 35-50 on pre-prosthetic surgical considerations; Swade chunks for extraction note templates |
| `cross-odontogenic-infection-airway-risk` (urgent infection management) | `01CR/Oral Surgery/OS Lectures/Odontogenic infections 2025.pdf`; `01CR/Oral Surgery/OS Management of Medical Emergencies.pdf`; cross-reference `endo-necrotic-acute` |
| `cross-caries-risk` (CAMBRA case-typing) | `01CR/Treatment Planning and Diagnosis/ALL DxTP FILES/CRA in TX planning.pdf` (caries-risk-in-TP); Swade chunks |
| `cross-sdf-arrest` (SDF for caries arrest) | Cross-reference `dir-class1` + `pedo-sealant`/`pedo-fluoride-varnish`; Swade chunks for SDF note template |

#### Repair sub-family (currently mixed across domains)

| Pathway | Primary UIC sources |
|---|---|
| `repair-cd-fracture` | `01CR/Complete Dentures/ALL CD FILES/Reline rebase and repair - Bin Yang.pdf` |
| `repair-loose-cd` | Same + `Comprehensive CD Guide.docx` adjustment section |
| `repair-crown-bridge-loss` (= `ind-recement`) | Already covered above under `ind-recement` |
| `repair-veneer-debond` | **Gap**: same gap as `ind-veneers`. Use cementation/bonding principles from Fixed Prosth folder. |
| `repair-fractured-porcelain-pfm` | `01CR/Fixed Prosthodontics/DAOB Phase 2 Fixed Prosth/PFM Porcelain Application and Final Contouring.pdf` (for understanding what's failing); intraoral repair principles |
| `repair-zirconia-chip` | **Gap**: no dedicated UIC zirconia-repair content. The current pathway's mention of CoJet / tribochemical silica coating + MDP primer is principles-based, not UIC-specific. May need to defer or simplify. |
| `repair-tooth-loss-after-rpd` | `01CR/Removable Partial Dentures/ALL RPD FILES/Reline_Rebase_Repair of RPD Fall 2022.pdf`; cross-reference `rpd-broken-clasp` |

---

#### Summary of source-coverage gaps

Pathways flagged with **Gap** above (need additional content from Jake or
should be deferred / built lightly from principles):

- `cd-iod-canine-roots`, `cd-implant-supported-lower` — tooth-retained + 2-implant
  overdenture content
- `rpd-implant-hybrid` — RPD + implant coordination
- `ind-veneers` — anterior veneer lecture content
- `ind-recement` (mostly fine from Swade); `ind-failing-existing-crown` (decision
  logic only); `ind-cracked-tooth-syndrome` (no dedicated lecture)
- `perio-acute-abscess` — no dedicated acute-abscess lecture
- All Pedo pathways — thin coverage; recommend Swade-primary approach
- `repair-veneer-debond`, `repair-zirconia-chip` — thin coverage

These don't block the rebuild. The three model pathways (cd-conventional,
rpd-kennedy3, ind-conventional-crown) have comprehensive coverage. Gaps can
be addressed later as Jake shares more content or as we accept that some
pathways are principles-based rather than UIC-lecture-anchored.

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

- ❌ **Recovering content from the legacy `PATHWAYS_LEGACY_2026_05` array.**
  The legacy entries carry accumulated drift from many iterations of
  fabricated content and old-logic mistakes. **Complete rebuild from primary
  UIC sources only.** Don't even check what's "reusable" — that's exactly
  how the drift survives the rebuild. (User directive 2026-05-27.)
- ❌ **Using the "Comprehensive CD Guide"** (or any similar AI-compiled
  "comprehensive guide" / HTML compilation / Word-doc study guide) as a
  source. These were built with old logic that contains real errors — e.g.
  the CD Comprehensive Guide collapsed UIC's two-appointment wax try-in
  (anterior + posterior, per Swade page 80) into a single visit. Use
  primary UIC sources only (slide decks, PowerPoints, grading sheets,
  worksheets). See `CASES-FOUNDATION.md` "What counts as a UIC-official
  source" for the heuristic. (User directive 2026-05-27.)

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
- ❌ **Referencing a visual element the Maps card doesn't render.** Steps
  pulled closely from Swade/UIC handouts carry layout phrases that assume a
  table/figure that existed in the source PDF but does NOT exist in the Maps
  popup — the card only renders prose, bullets, numbered lists, callouts, and
  dropdowns. Patterns seen in cd-conventional (fixed 2026-05-29): a section
  titled "Complaint-by-complaint **table**" (content was categorized bullets),
  "match the finding to the **table above**" (no table; the list was *below*),
  "per the Week 14 huddle **table** (see below)" (nothing below; external
  handout). **For every successive Map, scrub the referenced chapter content for
  `table` / `figure` / `diagram` / `image` / `chart` / `see below` / `see above`
  and fix by:** (a) dropping the visual word from a section title
  ("Complaint-by-complaint table" → "Complaint by complaint"); (b) repointing to
  a real in-card location ("the table above" → "the cause list below"); or
  (c) citing the external handout without implying it's reproduced here ("per the
  Week 14 huddle table (see below)" → "per the Week 14 huddle"). **Keep**
  genuine physical-object uses — the articulator's incisal *table*, the
  light-cure *rotating table*, the *bracket table*/instrument tray, the patient
  *chart*/record — and genuine internal cross-refs where the target really is in
  the same card ("(see below)" pointing at the next section). Quick audit: a
  Node walk of the guide's blocks with a keyword regex catches ~all of them.

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

## Scope clarifications from Jake (2026-05-27) — READ BEFORE BUILDING ANY OF THESE FAMILIES

These narrow the rebuild significantly. The Step 6 source-map tables above
list more pathways than we should actually build. Use this section as the
final scope filter.

### Implants — SHELVED entirely for now

Jake's words: "we are only loosely involved with implants — i actually
don't know much about the process other than that we don't place them.
I know we have to go to appointments related to them, and maybe fabricate
a surgical guide, which i bet we have a resource on, but there's way more
content on implants which suggest we are way more involved than we actually
are. We take them to the implant consult appointment, and then we get a
resident, but i don't know much beyond that."

Concrete: shelf the entire implant family until we have a clear UIC
pathway. Don't build:
- `ind-single-implant-crown`
- `cd-iod-canine-roots`
- `cd-implant-supported-lower` (2-implant Mn IOD)
- `rpd-implant-hybrid`
- `cross-anterior-implant-esthetic`
- `cross-cd-iod-implants`
- `cross-rpd-to-implants`

If we revisit later, the workflow we'd build is roughly: predoc takes
patient to the implant consult appointment → predoc connects with the
implant resident → predoc may fabricate a surgical guide (Swade chunk
278 references `D6190 Implant surgical guide`) → predoc returns the
patient to the resident for placement. **None of the placement,
abutment fabrication, or crown restoration steps belong to the predoc
in any depth I (Claude) currently understand.** The current pathway
content overstates predoc involvement.

### Oral Surgery — narrowest possible scope

Jake's words: "we really just extract teeth. There's some students that
use the surgical handpiece to do some minor stuff, but we can probably
not cover it. It's very very straight forward, and there are not
multi-step, or especially no lab steps involved. There's followups, but
they're not worth our time to illuminate."

Concrete: only build extraction pathways. Skip everything else.
- ✅ `surgery-simple-ext` — single-rooted extraction
- ✅ `surgery-multi-rooted-ext` — molar extraction
- ❌ `surgery-surgical-ext` (flap + bone removal) — skip; surgical
  handpiece work is minor and not multi-step
- ❌ `surgery-dry-socket`, `surgery-post-op-bleed` — follow-up scenarios,
  not multi-visit workflows
- ❌ `surgery-third-molar` — already cut
- ❌ `surgery-fractured-anterior` — overlaps with endo trauma; cover in
  the endo/trauma pathway instead

OS pathways: **2 total** (down from ~6 in the previous plan).

### Perio — clinic-focused, no surgery

Jake's words: "I'm hoping you keep a good scope of Perio too. We have to
know a lot about it, (well, what's involved with the appointments, as in
the theory behind what we're doing) but 0 surgery stuff. Just perio
maintenance, SRP, prophy (restorative chair, but technically perio), and
perio COE. Don't start getting into the weeds because we have the
content available to us. We're keeping this clinic-focused."

Concrete:
- ✅ `perio-coe` — the Perio COE Dx engine pathway
- ✅ `perio-prophy` — adult prophy (done in restorative chair but technically perio)
- ✅ `perio-srp` — scaling + root planing
- ✅ `perio-maintenance` — recall perio maintenance
- ❌ `perio-acute-abscess` — see note below
- ❌ `perio-crown-lengthening` — already cut (referral)
- ❌ `perio-gingival-graft` — already cut (referral)

Perio pathways: **4 total** (down from ~8 in the previous plan).

### Acute perio abscess — not its own pathway

Jake's words: "Acute perio abscess is literally just an outcome of an
urgent care appointment, or other exams, i guess, but mostly urgent care.
Beyond knowing how it presents, how it works, don't see reason for a
whole pathway. Result is always Endo. If it requries drainage, that's not
something we're doing."

Concrete: don't build `perio-acute-abscess` as a standalone pathway. The
recognition + outcome ("this is acute perio abscess; refer to endo or
drainage by faculty/OS") could appear as a keyDecision in `perio-coe` or
in an urgent-care reference. Probably skip entirely.

### Veneers — UIC UG doesn't do them at all

Jake's words: "I don't think we do veneers at all. Don't do any veneer
stuff."

Concrete: cut all veneer pathways from the rebuild scope.
- ❌ `ind-veneers` — indirect anterior veneers (the 6-unit case)
- ❌ `dir-direct-veneer` — chairside direct composite veneer (also a
  veneer; Jake said "don't do any veneer stuff")
- ❌ `repair-veneer-debond`

### Zirconia repairs — shelved

Jake's words: "Idk if we even do zirconia repairs. Shelf that one for
now."

Concrete: don't build `repair-zirconia-chip`. Revisit if UIC content
shows it's actually done at UG.

### Pedo — shelved entirely for now

Jake's words: "Pedo stuff is also not very multi step, and there are zero
lab steps. All crowns are SSC (same day), everything is same day, and we
don't do RCT in peds. So... Let's not do Pedo here. At least not yet."

Concrete: shelf the ENTIRE Pedo family from this rebuild. The Cases tab
differentiator is multi-visit + lab-steps; pedo procedures are largely
single-visit with no lab steps. The Steps tab + the Note Builder +
Swade chunks already serve the per-appointment view that pedo needs.

Don't build:
- All `pedo-*` pathways (composite, SSC, pulpotomy, IPT, pulpectomy,
  sealant, fluoride varnish, behavior management, local anesthetic,
  strip crown, primary anterior class III, anterior crown selection,
  space maintainer, primary trauma, oral pathology, extraction,
  POE/recall, tx sequencing, radiograph selection, oral surgery,
  medications reference, deep caries decision)

**This means the Peds pill is removed from the picker entirely for the
rebuild.** Revisit if multi-visit pedo workflows emerge (space maintainers
might be the only candidate — they do involve a lab step for fabrication).

### Net effect on the rebuild

Previous plan target was ~30-40 pathways across all families. With the
scope clarifications:

| Family | Was | Now |
|---|---|---|
| Direct / Operative | 10 | 9 (cut dir-direct-veneer) |
| Indirect / Fixed | 14 | 11 (cut ind-veneers, ind-single-implant-crown; need to verify ind-cracked-tooth-syndrome) |
| Digital | 2 | 2 |
| Endo | 9 | 9 |
| OS | 6 | 2 (extraction only) |
| Perio | 5 | 4 |
| CD | 5 | 2 (cut cd-iod-canine-roots, cd-implant-supported-lower; keep cd-conventional, cd-iid; merge cd-adjustment + cd-reline-lab) |
| RPD | 8 | 7 (cut rpd-implant-hybrid) |
| Pedo | 15 | **0 (shelved)** |
| Cross | 8 | ~3-4 (cut all implant-cross; keep cross-anterior-trauma, cross-pre-radiation-extractions, cross-caries-risk, maybe cross-sdf-arrest) |
| **TOTAL** | **~80** | **~50** |

About 50 pathways across the active families. Much more manageable.

The anterior-trauma cross-pathway (`cross-anterior-trauma`) needs a
rewrite: previously it discussed three replacement options (implant /
3-unit FPD / Kennedy IV RPD). With implants shelved, the discussion
pivots to FPD vs RPD vs leave-it-alone or refer-for-implant-consult.

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
