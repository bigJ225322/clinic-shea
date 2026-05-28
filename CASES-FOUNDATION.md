# Cases tab — foundation principles

**Status: rebuilding.** The Cases tab was sidelined from the live nav on 2026-05-26
(`PATHWAY_DOMAINS` and the Cases nav entry are commented out in `src/App.jsx`).
The pathway code and renderer are retained — only the nav entry is hidden — so
the rebuild can land incrementally and the tab can be turned back on once the
foundation is solid.

This document is the **why**. The **what** (the current procedure list, visit
sequence, and lab steps) lives in `CASES-PROCEDURES.md`.

---

## What Cases is for

Cases is the tab a UIC predoctoral student opens when they want to see a
specific procedure as a multi-appointment workflow — *across* visits, including
the lab work between visits.

It is **not**:
- a substitute for Swade's per-appointment clinical steps (that's the **Steps** tab)
- a fully comprehensive textbook (that's the lectures + Swade + Dentistry Files)
- a wizard that picks the procedure for you (the picker is a flat pill grid; you
  bring a case in mind and select it)

It **is**:
- a sequence the student can follow from consult through delivery
- explicit about what happens between visits (lab fabrication, the lab Rx, the
  turnaround expectation)
- anchored to UIC content — Swade for clinical steps, UIC lectures for lab
  steps, the DxTP comprehensive-treatment list as the structural skeleton
- trustworthy — see "What makes content trustworthy" below

---

## The differentiator between Cases and Steps

Per the directive that prompted this rebuild:

> "the biggest differentiator between 'steps' and 'Cases' should be (1) the
> addition of lab steps between appointments (probably using the domain-specific
> resources in addition to the 'treatment planning' documents specifically), and
> (2) the integrated organization of 100% accurate to UIC workflow information,
> including the clinical steps, already super well-illuminated by swade (and
> steps tab) and also new steps pulled from the UIC lecture and other UIC content"

So Steps tells you what to do **at** an appointment. Cases tells you what
happens **between** appointments — and what the whole multi-visit treatment plan
looks like end-to-end.

---

## What counts as in-scope for Cases

The cutting criterion is: **is this a procedure the UG predoctoral student
actually performs, or is it part of the treatment plan the student is
responsible for managing?**

**In scope** (the student does these in clinic):
- COE / POE / treatment planning presentation
- Prophy, SRP, perio maintenance
- Direct restorations — composite (Class I-V), amalgam, sealants, PRR
- Indirect restorations — PFM/cast crowns, e.max/zirconia crowns, bridges,
  inlays/onlays, veneers
- Endo — anterior, premolar, and molar RCT (same-day access-and-fill per UIC
  protocol); direct + indirect pulp cap; vital pulp therapy
- Oral surgery — simple extractions, multi-rooted extractions, surgical
  extraction with flap (faculty-supervised), dry socket management, post-op
  bleeding management
- Complete dentures (CD, IID, IOD) including 2-implant mandibular overdenture
- Removable partial dentures (Kennedy I/II/III/IV) including repairs + relines
- Pedo — exam, prophy, fluoride varnish, sealants, restorations (composite,
  amalgam, SSC, strip crown, pulpotomy, IPT), space maintainers, SDF, simple
  pedo extractions, behavior management
- Implant **restoration** (cement-retained, screw-retained, custom abutment,
  overdenture pickup) on non-excluded teeth per the PIP table
- Emergency / urgent care (anterior trauma, fractured anterior, avulsion
  replantation, acute apical abscess, acute periodontal abscess)

**In scope as recognize-and-refer** (the student sees these cases and
participates in the treatment-plan decision, but doesn't perform the procedure):
- Perio surgery (crown lengthening, gingivectomy, soft-tissue grafts) → PG Perio
- Pre-prosthetic surgery (alveoloplasty, tuberosity reduction, frenectomy) → OMS
- Implant placement → Implant Clinic / OS (predoc does restoration phase only,
  except in the UG STI / UG OD tracks where the predoc participates in placement
  under PG supervision per the PIP table)
- Complex impacted third molars → PGOS
- Endo retreatment, surgical endo (apicoectomy) → PG Endo
- Pediatric oral surgery beyond simple extractions → PG OMS / pedo OS
- Soft-tissue biopsy → Oral Med / OMS / Oral Path

**Out of scope** (cut from Cases entirely):
- Orthodontic procedures (brackets, expanders, exposure)
- TMD splints / complex occlusal therapy (Faculty Practice / TMD clinic)
- Full-mouth rehabilitation requiring multiple specialty inputs as a single
  case
- Maxillary IOD, >2 implant overdenture, full-arch implant prostheses (PG Pros)
- Restoration of excluded-tooth implants per PIP (#1, #2, #8, #9, #15, #16, #17,
  #18, #31, #32)
- Cosmetic-driven multi-veneer cases with extensive diagnostic wax-up beyond
  what UG handles

The **DxTP lectures** (`01 Clinical Reference/Treatment Planning and Diagnosis/`,
especially `Dx and Tx Planning (Spring 2025).pdf`) are the authoritative source
for what counts as "the procedures the predoc plans and performs." A pathway
belongs in Cases if-and-only-if DxTP frames it as part of the predoc's
treatment-planning + execution scope.

---

## What makes content trustworthy

Three rules, in order of importance:

### 1. Limited scope — the procedures we actually do

If a pathway covers a procedure the UG predoc doesn't do (and isn't responsible
for planning a referral on), it doesn't belong in Cases. See "What counts as
in-scope" above. The DxTP comprehensive-treatment list is the test.

### 2. Don't cite — don't pretend to authority I don't have

External citations ("per AAPD 2025", "per AAE 2019", "McGill Consensus 2002",
"Reeh et al. 1989", "Aquilino & Caplan 2002", "IADT 2020", "Source: AAOMR
position") create the appearance of verified authority. Strip them. The
underlying clinical statement can stay; the citation handle goes.

Two exceptions that **stay**:
- **AAP 2018 staging/grading** inside the perio Dx engine — the engine
  literally implements the AAP 2018 framework as its computation, so the
  engine's narrative ("Stage II per AAP 2018, CAL 3–4mm") is a functional
  self-description, not an external citation.
- **AAE pulpal + periapical diagnostic terminology** — these are the dropdown
  labels the student selects, not editorial claims.

UIC lecture references **stay** when they are the actual source of the content
in question. "Per the TRAUMA lecture (slides 17-18)", "per the Vital Pulp
Therapy 2025 lecture" — these are anchored to documents the student has access
to and the clinic teaches.

### 3. Don't declare with too much certainty

- "the #1 cause" → "a leading cause"
- "the gold standard" → drop
- "THE prognostic factor" → "a dominant prognostic factor"
- "the modern default" → drop, just state what to use
- Specific brand names in parentheticals when the brand isn't verified UIC stock
  ("Z-Prime Plus", "Variolink Esthetic LC vs DC", "ParaPost Fiber White
  (Coltène)") → strip; "MDP-containing primer", "resin cement", "fiber post"
  are accurate at the type level
- Over-precise stats from a single study presented as the answer ("5-year
  survival ~84% with crown vs ~36% without (Aquilino & Caplan 2002)") → strip;
  the underlying clinical truth (cuspal coverage substantially improves
  endo-treated posterior tooth survival) is enough
- Year-tagged regulatory claims I can't actually verify ("Alvogyl was
  discontinued in much of the US/EU around 2019-2021") → tone to "availability
  varies, check what the clinic stocks"

Brands and products **stay** when they're in Swade's materials list (chunk 1232)
— FujiCEM, RelyX, Panavia, Integrity, UltraTemp, TempBond NE, Renamel,
ScotchBond Universal, Gluma, Vitrebond, Dycal, Bisco Light-Core, ParaPost,
Viscostat, Hemodent, PIP, Fit-Checker, Coe Comfort, Coe Soft, GC Reline.

---

## Source hierarchy

For any content claim in Cases, the source priority is:

1. **Swade** (the per-appointment clinical steps — the chunks below line 22000
   of `src/App.jsx`). This is the canonical UIC clinical content. If Swade
   covers it, quote Swade or paraphrase Swade closely.
2. **DxTP lectures** for the structural framework — what the comprehensive
   treatment includes, the visit sequence, the recall schedule.
3. **Domain-specific UIC lectures** (RPD Sequencing, CD Tooth Arrangement, CD
   Processing, FPD Metal Framework Fab + Try-in, FPD PFM Porcelain Application,
   IOD lecture, TRAUMA lecture, Vital Pulp Therapy 2025 lecture, Endo
   Emergencies lecture, Connectors lecture, etc.) for lab-step content and
   procedure-specific decisions.
4. **Materials list** (Swade chunk 1232) and the Note Builder's `LAB_SCRIPTS`
   collection (chunks 107–120) for product names and lab-Rx text.

Content that doesn't trace to a UIC source above should not land in Cases. If
the right move is "I don't know — ask faculty," say that.

### What counts as a UIC-official source (added 2026-05-27)

A practical heuristic when deciding whether a document is usable as a primary
source for pathway content:

- ✅ **UIC official**: presentation slide decks (PDFs or PowerPoints with
  numbered slides), grading sheets, lab-session worksheets, huddle sheets,
  faculty-authored handouts (often named after the lecturer, e.g.
  `... SALARI-Final.pdf`, `Dr. Obrez.pdf`).
- ❌ **NOT UIC official**: `.docx` Word docs (typically student notes or
  compiled study guides), AI-compiled "comprehensive guides", HTML
  compilations, any document built "with old logic" that bundles multiple
  sources into a single narrative.
- **When in doubt, ASK the user before using a document as a pathway source.**

The "Comprehensive CD Guide" (in any format — `.docx`, `.html`, `.pdf`) and
any similarly-named compiled guide are **explicitly not valid sources**. They
were built with old logic that contained errors (e.g. collapsing the
two-appointment wax try-in into a single visit). Per-visit sequencing must
come from primary UIC documents only.

---

## How Cases relates to the other tabs

- **Note** — pulls procedure templates and the Note Builder substitution
  pipeline. Independent of Cases.
- **Steps** — the canonical per-appointment view (Swade chunks). Cases links
  back to Steps chapters via the `sections` array on each pathway.
- **Codes** — the CDT code catalog (`RVU_DATA`). Cases pathway keyDecisions
  reference CDT codes; the codes themselves live in Codes.
- **RPD** — the framework design engine. Cases pathways for RPD reference the
  engine output (Lab 4 design conventions, undercut + HOC visualization).
- **Perio chart** — the Dx engine that drives the Perio COE diagnosis.

Cases is the "what's the multi-visit plan" view that knits across these.

---

## Sidelined-pathway disposition

When pathways are cut during this rebuild:
- They are **comment-blocked**, not deleted, with a `/* === CUT [reason] ===
  */` marker noting the cut reason and date.
- The cut reason is one of:
  - `out-of-UG-scope` (perio surgery, implant placement, etc.)
  - `not-in-DxTP` (DxTP doesn't frame this as a comprehensive treatment the
    predoc plans)
  - `redundant-with-X` (functionally a duplicate of pathway X)
  - `borderline-deferred` (might come back; parked while we focus on core)
- Recovery is one paste away.

The PATHWAY_GROUPS arrays are updated to remove cut entries. The PATHWAYS array
itself preserves the data inside the comment block.

---

## Process for adding a new pathway after the rebuild

1. **Verify it's in DxTP scope** — check `Dx and Tx Planning (Spring 2025).pdf`
   and related DxTP docs. If DxTP doesn't frame it as a predoc treatment, it
   doesn't belong.
2. **Find the Swade chunk(s)** that cover the per-appointment clinical steps.
   The pathway's `sections` array points to those Swade chapters.
3. **Find the UIC lecture(s)** that cover the lab steps and the multi-visit
   sequence (RPD Sequencing, CD Treatment Planning, FPD framework, etc.).
4. **Write the pathway**:
   - `description` — short, no superlatives, no external citations
   - `keyDecisions` — the few things the student needs to get right
   - `phases` — clinical-visit buckets (Records, Mounting, etc.)
   - `labSteps` (new field — see `CASES-PROCEDURES.md` for schema) — what
     happens in the lab between each clinical phase, with a source citation
     to the specific UIC PDF + page
   - `sections` — the Swade chapter references
5. **Update `CASES-PROCEDURES.md`** — add the procedure to the canonical list
   with the same source citations.
6. **Commit with a message that names the source PDFs used.**

---

## Open questions / things to revisit later

- Whether to keep the "Combo" cross-pathway category or fold its contents into
  the domain it most resembles (CD or RPD).
- Whether `cd-anxious-firsttime`, `cd-xerostomic`, `cd-rapid-need`,
  `cd-limited-dexterity` should be pathways or just keyDecision sidebars on
  `cd-conventional`. They're patient-modifier variants, not separate workflows.
- Whether the Pedo pathways should be its own tab altogether given the volume.
- Whether the Cases picker UX should evolve into a wizard (the "Future TODO"
  comment in `PATHWAY_GROUPS`).

These are deferred. Get the foundation right first, evolve the UX later.
