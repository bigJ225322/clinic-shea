# Cases — canonical procedure list + visit sequences + lab steps

**This document is the compression-resistant source of truth.** If a future
Claude session loses context, this file is what it reads to know what we
extracted from UIC PDFs and what was decided. Every claim should have a source
citation to a specific PDF and page (or Swade chunk id) in the format:

> `[source: <PDF filename>, p. <N>]` or `[source: Swade chunk <id>]`

If a claim doesn't have a source citation, it doesn't go in.

The companion doc `CASES-FOUNDATION.md` covers the philosophy (why we're
building it this way). This doc covers the substance (what we found).

---

## Status

**Phase 0 — Sidelined.** Cases tab hidden from live nav 2026-05-26. PATHWAYS
data preserved. Rebuild in progress.

| Step | Status |
|---|---|
| Hide Cases tab from nav | ✅ Done (commit pending in working tree) |
| Write CASES-FOUNDATION.md | ✅ Done |
| Write CASES-PROCEDURES.md skeleton | ✅ Done (this doc) |
| Read DxTP lectures → extract comprehensive treatment list | ⏳ Next |
| Read DxTP lectures → extract visit sequence framework | ⏳ Next |
| Produce keep / cut / reframe list for current PATHWAYS | ⏳ Pending |
| User reviews keep / cut list | ⏳ Pending |
| Cut sidelined pathways (comment-block with reason) | ⏳ Pending |
| Add `labSteps` field + Cases renderer band | ⏳ Pending |
| Populate `cd-conventional` | ⏳ Pending |
| Populate `rpd-kennedy3` | ⏳ Pending |
| Populate `ind-conventional-crown` | ⏳ Pending |
| Fan out to siblings | ⏳ Pending |
| User reviews + approves | ⏳ Pending |
| Restore Cases tab to live nav | ⏳ Pending |

---

## Source PDFs

Located at `~/Desktop/HY Folders/Dentistry Files/`.

### Treatment Planning + Diagnosis (the structural skeleton)
Path: `01 Clinical Reference/Treatment Planning and Diagnosis/`

- `Dx and Tx Planning (Spring 2025).pdf` — the master TP lecture (referenced
  inline as **DxTP-master** below once extracted)
- `Tx Dx- Overview.pdf` — **DxTP-overview**
- `Patient Disposition & Case Type.pdf` — **DxTP-disposition**
- `Risk Assessment and patient evaluation and diagnotic process PDF with highlight.pdf` — **DxTP-risk-assessment**
- Inside `ALL DxTP FILES/`:
  - `Axium Clincal Activity 2024.docx` — Axium workflow
  - `CRA in TX planning.pdf` — caries risk in treatment planning
  - `Geriatrics.pdf`, `Ortho considerations in Tx palnning.pdf`, `Pros Considerations.pdf`, `Periodontal aspects of treatment planning 2020-Ashrafi.pdf`, `endo_eval_and_tx_planning_3-25-2020.pdf` — domain considerations in TP
  - Problem List Case 1–4 + keys — concrete TP case examples

### Complete Dentures (CD/IOD)
Path: `01 Clinical Reference/Complete Dentures/ALL CD FILES/`

- `Comprehensive CD Guide.docx`
- `Custom tray_Boxing_ Technique.pdf`, `Boxing and Pouring(1).pdf`
- `Record Base & Wax Rim - Reminders.pdf`
- `Articulator+Facebow.pdf`, `Mark300-Inst_07141.pdf`
- `Jaw Relation Records copy.pdf`
- `Anterior teeth set up-Technique.pdf`, `Chapter 12_Tooth Arrangement.pdf`
- `Anatomy of the edentoulus oral cavity, Posterior palatal seal _Dr. Obrez_.pdf`
- `Denture occlusion and articulation, Hanau's quint - Dr. Obrez.pdf`
- `Clinical Evaluation of the Trial Denture_2025.pdf`
- `24_Final_wax_contouring_UIC(1).pdf`
- `Processing+Festooning.pdf`, `26_Denture_processing(1).pdf`
- `Complete Denture Delivery and follow-up.pdf`
- `Delivery of Final Denture(2).pdf`
- `IMMEDIATE DENTURES - Dr. Agrawal.pdf`
- `Reline rebase and repair - Bin Yang.pdf`
- `TruExpression Mould Chart_Literature_EN.pdf`
- Per-week lab exercises (`Week 2/3/4/6/7_Lab session/Exercise.pdf`)

### Removable Partial Dentures
Path: `01 Clinical Reference/Removable Partial Dentures/ALL RPD FILES/`

- `Comprehensive RPD Guide.docx`
- `Lecture 1_Introduction To Removable Partial Denture_SHAHIN_2025.pdf`
- `Lecture 2_Diagnosis and Treatment planning_Sabbagh_2024.pdf`
- `Lecture 3_Maxillo-mandibular relationship_SHAHIN_2025.pdf`
- `Lecture 4-Part A_RPD Sequencing.pdf` — **the master sequencing lecture**
- `Lecture 4_Part B_Treatment sequence Removable Partial Dentures_SHAHIN_2025.pdf`
- `RPD Treatment Sequence Fall 2022.pdf`
- `RPD Fall 2022 Fabrication of custom tray, framework try-in.pdf`
- `RPD Fall 2022 Final Impressions.pdf`
- `RPD Fall 2022 Setting denture teeth.pdf`
- `RPD Fall 2022 Wax rims.pdf`
- `RPD Fall 2022 LabPresciption Example.pdf`
- `RPD Fall 2022 Retainers.pdf`
- `RPD Fall 2022 Design Case I.pdf`, `Design Case II- BS- Fall 2022.pdf`
- `RPD Fall 2022 Denture Base Considerations.pdf`
- `RPD Fall 2022 Dental Occlusion_articulation for RPD.pdf`
- `RPD Fall 2023 -Lab 4- Introduction to RPD Design-BS.pdf`
- `RPD Fall 2023 Lab 5.pdf`, `Lab 6.pdf`
- `Reline_Rebase_Repair of RPD Fall 2022.pdf`
- `Fall RPD 22 Combination Syndrome.pdf`
- `Fall RPD 22 Delivery RPD.pdf`
- `Fall RPD 22 Non-metal clasps.pdf`
- `Summer RPD 2023- Interim Removable Partial Denture-BS.pdf`

### Fixed Prosthodontics (Indirect)
Path: `01 Clinical Reference/Fixed Prosthodontics/`

Phase 1 (`Phase 1 DAOB Fixed Prosth/`):
- `Review and Overview.pdf`
- `Assessing Tooth Restorability Part 1.pdf`
- `Modified version Posterior FPD Preparation and Pontic Design.pdf`
- `Putty reduction cosiderations.pdf`
- `Dental Stones.pdf`
- `Mounting and Die Trimming.pdf`
- `Updated Custom incisal guide table.pdf`
- `Review of Occlusion DAOB 322.pdf`
- `Modified version - Bis-acryl Provisional Restorations for Posterior FPD.pdf`

Phase 2 (`DAOB Phase 2 Fixed Prosth/`):
- `Assessing Tooth Restorability Part 2.pdf`
- `Dental Alloys.pdf`
- `Metal Framework Fabrication & Try-in.pdf` — **the framework lab step lecture**
- `PFM Porcelain Application and Final Contouring.pdf` — **the porcelain lab step lecture**
- `Shade Taking and Porcelain Characterization.pdf`
- `Acrylic Provisional Restorations for Posterior FPD.pdf`
- `Information to include on lab prescription for FPD metal framework fabrication.pdf`
- `Information to include in lab prescription for FPD porcelain addition.pdf`
- `Levin & Halperin-Sternfeld article.pdf`

Root files:
- `2024 #3-5 FPD Acrylic Provisional Study Guide.pdf`
- `2025-prosth-cast-metal-crown-criteria.pdf`
- `2025-prosth-ceramic-crown-criteria.pdf`
- `2025-prosth-pfm-crown-criteria.pdf`
- `guide-to-fabrication-of-putty-matrices.pdf`
- `PROSTH Notes.pdf`

---

## Schema for the new `labSteps` field

To be added to each PATHWAYS entry that has lab work between clinical visits.

```js
{
  id: "cd-conventional",
  // ...existing fields (description, keyDecisions, phases, sections)...
  labSteps: [
    {
      after: 1,           // index into phases[] — this lab work happens AFTER phase[1]
      title: "Pour preliminary cast + fabricate custom tray",
      body: "Box the alginate. Pour stone (Type III, ratio per Dental Stones lecture). Separate at 60 min. Outline tray on the cast: 2 mm short of the vestibular reflection; relief over hard areas; ...",
      source: "Custom tray_Boxing_Technique.pdf p. 3-7 + Dental Stones.pdf p. 11",
      turnaround: "Same week before next clinical visit",
    },
    // ...
  ],
}
```

**Conventions:**
- `after` is the index into the existing `phases` array. The renderer inserts
  the lab band between phase[after] and phase[after+1].
- `title` is a noun phrase (no leading verb) — what the lab work is, not what
  the student does.
- `body` is the lab procedure in plain language. No citations inside the body —
  the `source` field carries the citation.
- `source` always points to a specific UIC PDF + page (or Swade chunk id).
- `turnaround` is when the work needs to be done relative to the next clinical
  visit. Helps the student plan.

The renderer (to be built) inserts a visually-distinct band between phases —
paper-colored background, "LAB" tag in the accent color, italic body text. The
existing phase styling stays unchanged.

---

## DxTP-derived comprehensive procedure list

⏳ **In progress** — extracting from each domain's TP lecture (the canonical
"comprehensive treatment list" doesn't live in a single master document;
it's distributed across domain TP lectures).

### What each DxTP-folder lecture actually covers (extracted 2026-05-26)

The DxTP folder name is misleading — these aren't the procedure-skeleton
lectures. They're the **shared TP framework** lectures.

#### `Dx and Tx Planning (Spring 2025).pdf` — Michael Han, OMS [62 pp]

Actually titled "Medical and Surgical Considerations in Routine Patient
Care." Two halves:

**Part 1 — Medical Considerations** (~slides 1–34):
- The dentist-physician relationship for medical clearance
- The principle: dentist owns the dental procedure detail; physician owns
  the medical condition detail. "Clearance" is a poorly-framed concept;
  the dentist should ask specific questions, not request blanket clearance
- Running example: 67y/F on warfarin for AFib needing FMX + alveoloplasty +
  CD. The medical-clearance letter pattern that fails is "Coumadin
  discontinued 5 days pre, restart 1 day post" — leads to CVA in one case
  because the physician answered the wrong question
- Lesson: ask "is it safe to render this specific dental procedure given
  this patient's specific medical condition" rather than "please clear for
  dentistry"

**Part 2 — Oral Surgical Considerations in Comprehensive Dental Care**
(~slides 35–62):
- Treatment goals framework: **healthy dentition (natural or prosthetic)**,
  **healthy periodontium**, **healthy TMJ**, **absence of pathology**
- Surgical interventions that support those goals (the predoc recognizes +
  refers; OMS performs):
  - **Healthy dentition**: extraction of hopeless teeth (restorative,
    endodontic, periodontal hopeless), removal of exostoses preventing OH
  - **Foundation for sound prostheses**:
    - Hard tissue contour/bulk: alveoloplasty/alveolectomy, torus/exostosis/
      undercut removal, bone graft / sinus lift
    - Soft tissue: soft tissue grafting (attached gingiva augmentation),
      vestibuloplasty, frenectomy
    - Interarch relationship: bone graft, jaw repositioning (orthognathic)
  - **Special prosthetic cases**: immediate dentures (must account for final
    prosthesis VDO + lip support)
  - "Pseudo-Class III" — resorption-driven jaw relationship issue that
    presents like Class III malocclusion; needs orthognathic if to be
    corrected

**Takeaway for Cases scope**:
- Confirms pre-prosthetic surgery (alveoloplasty, torus removal,
  vestibuloplasty, frenectomy, FGG, bone graft, sinus lift) belongs in
  Cases as **recognition + referral** pathways the predoc owns during TP.
  Han's lecture says explicitly: "You do not have to be a surgeon, but you
  DO have to know the options/considerations."
- Confirms immediate dentures (CD/IID) are explicitly in scope and need to
  coordinate with extractions
- Confirms orthognathic surgery is recognition-only at the UG level (no
  predoc role beyond identifying the pseudo-Class-III pattern and
  referring)

#### `Tx Dx- Overview.pdf` — Dr. Sharif Mohammad (course director DAOB 323/301) [8 pp]

**This is the canonical UIC treatment-planning framework.** This is the
structural skeleton Cases must align to. Source: course director for the
TP course.

**TP philosophy (slide 6):**
- Diagnosis precedes treatment planning, which precedes treatment
- Treatment plans are phased
- Each phase requires a re-evaluation
- Treatment plans expire after 12 months
- "Not set in stone" — modifiable per patient case (slide 8)

**The six TP phases (slide 7):**
1. **Urgent Care phase** — SOAP Note format for Tx notes (immediate
   emergencies that bypass the diagnostic phase: acute apical abscess,
   acute perio abscess, dental trauma, fractured tooth, post-op
   bleeding, dry socket, odontogenic infection with airway concern)
2. **Diagnostic phase** — generation of problem list and diagnosis
   (COE, POE, perio chart, treatment-plan presentation)
3. **Phase I Treatment** — disease control / elimination / prevention /
   stabilization (operative restorations, SRP, simple extractions of
   non-restorable teeth, endo on restorable teeth, sealants, OHI,
   fluoride varnish, SDF, caries-risk management, smoking cessation,
   nutritional counseling)
4. **Phase II Treatment** — surgical and/or orthodontic (pre-prosthetic
   surgery, crown lengthening, soft-tissue grafts, implant placement,
   ortho intervention — almost entirely *recognize + refer* at the UG
   level; the UG performs simple alveoloplasty + simple frenectomy
   under faculty supervision in some cases)
5. **Phase III Treatment** — reconstructive (crowns, bridges, inlays,
   onlays, veneers, RPDs, CDs, IODs, implant restorations,
   post-and-core, survey crowns)
6. **Phase IV Treatment** — maintenance (perio maintenance, recall
   exam, recall prophy)

**Course context (slides 4–5):**
- Required textbook: *Treatment Planning in Dentistry, 3rd ed.*
  (Stefanac & Nesbit) — this is the foundation text for UIC TP
- D2 (DAOB 323) and AS (DAOB 301) grading: 2 mini case
  presentations, 4 Case 1–4 Axium ED exercises, performance exam,
  attendance

**Implications for Cases:**

The pill organization could shift from domain-based (Direct / Indirect /
OS / RPD / CD / Pedo) to phase-based (Urgent / Phase I / Phase II / Phase
III / Phase IV) — or both, with phase as the primary lens. Phase-based
makes the *why does this matter in the TP* visible, which is what the
user keeps emphasizing.

Each pathway should declare a `phase` field: "urgent" | "diagnostic" |
"phase1" | "phase2" | "phase3" | "phase4". Some pathways span phases
(e.g., cd-conventional starts in Diagnostic with the COE + diagnostic
impressions, but the bulk lives in Phase III). For span-pathways, declare
the *primary* phase and note the span.

This phase mapping is also the keep/cut filter:
- If a pathway represents a procedure done in one of the six phases → keep
- If it's a recognition + referral case relevant to a phase decision → keep,
  framed as referral
- If it doesn't fit any phase OR isn't part of a UG predoc's TP role in
  any phase → cut or merge

#### `Patient Disposition & Case Type.pdf` — UIC operational tracking sheet [4 pp]

This file is **not a lecture** — it's the Excel-as-PDF spreadsheet template
students use to maintain their patient roster. Found in the DxTP folder
because TP planning meetings reference this dashboard.

**Sheet 1 (Patient roster columns):**
- Axium Number, Patient Name (Last, First), Language, Patient Status
- Patient Letter (Y/N, Letter Type)
- **Current Phase of Care** (the active phase of the TP)
- **Active Patients procedure-tracking columns**, each with (Y/N, #):
  - Operative
  - Digital
  - Fixed
  - Dentures
  - Perio
  - Endo
  - OS
  - Ortho
  - STI (Single Tooth Implant)
  - IOD (Implant Overdenture)
- Last POE Date, Next POE due Date, Prophy/Maint Due Date
- General Comments Regarding Patient
- Transfer columns: Current Provider, D4/AS, D3

**Sheet 2 — Language dropdown:** English / Spanish / Cantonese / Mandarin / Other

**Sheet 3 — Validations (Letter → Phase mapping — THE UIC TAXONOMY):**
| Letter | Phase |
|---|---|
| A | COE/Tx Plan |
| B | Phase I |
| C | Phase II |
| S | Phase III |
| D | Phase IV |
| Custom | (no fixed mapping) |

(Note: "S" for Phase III is the legacy UIC code, not an alphabetic
continuation. Phase III = reconstructive = the S letter on the roster.)

**Sheet 4 — Patient status dropdown:** Active / Recall

**Implications for Cases:**

This roster confirms the **canonical UIC procedure taxonomy** the school
actually uses in patient management:

```
Operative · Digital · Fixed · Dentures · Perio · Endo · OS · Ortho · STI · IOD
```

Notable differences from current Cases `PATHWAY_DOMAINS`:
- **No "Pedo"** — separate clinic with its own tracker, not on the UG predoc
  roster (the current Pedo pathway domain may be more appropriate as its
  own tab or sidelined here)
- **No "RPD" as its own column** — RPDs roll into the "Dentures" bucket
  alongside CD/IID/IOD. The current `cd-` and `rpd-` pathway split could
  collapse to a unified Dentures group with Kennedy-class + edentulous-
  arch sub-grouping
- **"Digital" is its own bucket** — separate from Fixed. Currently
  `ind-digital-emax` and `ind-cad-cam-inlay-onlay` sit under Indirect; UIC
  treats Digital as a tracked category in its own right (because it's a
  separate clinic location)
- **STI and IOD are separate from Fixed** — implant restoration isn't lumped
  with crown+bridge work at the roster level. Current Cases puts
  `ind-single-implant-crown` and `cross-anterior-implant-esthetic` under
  Indirect; the operational taxonomy says implant restoration is its own
  tracking bucket
- **"Ortho" exists on the roster** but is referral-only at UG predoc. Worth
  recognizing in TP scope (the predoc plans the timing around ortho), not
  as a how-to-perform pathway

**The combined framework — phase + category:**

A pathway's organization could carry two axes:
- **Phase** (Urgent / Diagnostic / I / II / III / IV) = where in the TP
- **Category** (one of the 10 above) = which clinic / which discipline

Phase tells the student WHY this matters in the TP. Category tells them
WHERE this happens. Both are useful, and the spreadsheet uses both.

#### `Risk Assessment and patient evaluation and diagnotic process PDF with highlight.pdf` — Textbook chapter [39 pp, first 10 read]

This is a **textbook chapter excerpt** (Stefanac & Nesbit, Treatment
Planning in Dentistry, 3rd ed., Ch 1: "Patient Evaluation, Risk Assessment,
and the Diagnostic Process") — not a UIC lecture. Filed in the DxTP folder
because it's the required-textbook chapter cited in `Tx Dx- Overview.pdf`.

Content (the patient-evaluation framework):

- **Diagnostic sequential process** (slide-equivalent of Box 1.2 checklist):
  - **R: Recognize risks** — be aware of adverse events that may occur
  - **P: Patient evaluation** — review medical history; identify medications;
    examine for signs/symptoms; review labs + imaging; obtain medical
    consultation if needed
  - **A: Antibiotics, Analgesics, Anesthesia, Anxiety** — prophylactic
    abx need, NSAID-aspirin bleeding risk, LA + vasoconstrictor concerns,
    sedative needs
  - **B: Bleeding, Breathing, Blood pressure** — abnormal hemostasis,
    respiratory difficulty, BP control
  - **C: Capacity to tolerate care** — cardiovascular + emotional capacity
  - **D: Drugs, Devices** — drug interactions; prosthetic devices (heart
    valves, joints, pacemakers, AVF, defibrillators)
  - **E: Equipment, Emergencies** — equipment compatibility (e.g.,
    electrocautery near pacemakers); anticipated medical emergencies
  - **F: Follow-up care** — analgesics, abx prophylaxis post-op, patient
    contact

- **Medical-history conditions organized by body system** (with relevance
  to dental tx noted):
  - Cardiovascular: heart failure, MI, angina, HTN, heart murmur, MVP,
    rheumatic fever, congenital heart disease, artificial heart valve,
    arrhythmias, CABG/angioplasty/stent
  - Hematologic: inherited bleeding disorders, blood transfusion hx,
    anemia, leukemia/lymphoma, anticoagulant/antiplatelet use
  - Neurologic: stroke, epilepsy/seizures (Dilantin gingival overgrowth)
  - Behavioral/psychiatric: drug interactions with vasoconstrictors,
    xerostomia from psych drugs, anxiety management
  - GI: ulcers (NSAID caution), hepatitis (infection control)

**Implications for Cases:**

This is the foundation content for any "case-typing" or "risk assessment"
pathway. The cross-caries-risk pathway already exists; analogous medical-
risk pathways could be added for cardiac / bleeding / immunocompromised
patients. But this is **Steps-tab territory** more than Cases-tab — Cases
is about the procedural workflow, Steps is about the per-appointment
checklist. The medical-risk content belongs in Steps (under PE/COE
chunks) or in a reference doc.

**Will not pull from this PDF for Cases pathway content** — covered better
by Swade's medical-history coverage in the COE chunks and by the Han
lecture's surgical-considerations content.

---

## Source-reading status — DxTP folder complete enough to make decisions

Read so far:
- ✅ `Dx and Tx Planning (Spring 2025).pdf` — Han, medical+surgical
  considerations
- ✅ `Tx Dx- Overview.pdf` — **the canonical 6-phase framework**
- ✅ `Patient Disposition & Case Type.pdf` — **the 10-category UIC roster
  taxonomy**
- ✅ `Risk Assessment.pdf` — Stefanac & Nesbit Ch 1 (medical risk
  framework, will not be used for pathway content)

**Deferred** (not needed for the keep/cut decision; will read when
populating individual pathways):
- Per-domain TP lectures (RPD Lecture 2, CD intro, FPD overview, etc.)
- Problem List cases 1–4 + keys (these are exam material)
- Periodontal aspects of TP (Ashrafi), Ortho considerations, Endo
  eval+TP, Prosth Considerations, Geriatrics, Pros Considerations (all
  domain-specific deep-dives)

We now have what we need to produce the keep/cut list.

### Domain TP lectures (where the comprehensive procedure list actually lives)

These need to be read for the per-domain procedure-skeleton + visit-sequence:

- **RPD**: `Lecture 2_Diagnosis and Treatment planning_ Sabbagh_2024.pdf`,
  `Lecture 4-Part A_RPD Sequencing.pdf`, `Lecture 4_Part B_Treatment sequence
  Removable Partial Dentures_SHAHIN_2025.pdf`
- **CD**: `Comprehensive CD Guide.docx`, `Prosthodontics intro(1)_2025_BB.pdf`,
  `Treatment planning.pdf` (in the CD folder)
- **FPD**: `Review and Overview.pdf` (Phase 1), `Assessing Tooth Restorability
  Part 1 + 2.pdf`
- **Endo**: `endo_eval_and_tx_planning_3-25-2020.pdf` (in DxTP folder)
- **Perio**: `Periodontal aspects of treatment planning 2020-Ashrafi.pdf`
  (in DxTP folder)
- **Pedo**: `Pediatrics Comprehensive Cases.docx` (in repo root)

Read order plan: shared TP framework (DxTP folder) first, then per-domain
TP lectures (in priority order: CD → RPD → FPD → others).

### Final canonical list (entries below to be populated as I read)

```
### Conventional complete denture (CD/F-F)
- Visit sequence: COE + diagnostic imp → border molding + final imp → wax rim
  try-in + jaw relations + facebow + tooth selection → anterior wax try-in →
  posterior wax try-in → delivery → 24-hr followup → 1-week followup
- Lab steps between visits: [5 lab blocks — populated from CD PDFs]
- Source: domain TP lecture + Comprehensive CD Guide
- Maps to current pathway: cd-conventional
```

⏳ TO BE FILLED.

---

## Current PATHWAYS inventory (as of 2026-05-26, sidelined state)

These are the pathways currently in the PATHWAYS array. The "Status after DxTP
read" column will be filled when DxTP extraction is complete.

### Direct (operative)
| ID | Label | Status after DxTP read |
|---|---|---|
| dir-class1 | Class I (occlusal pit/fissure) | TBD |
| dir-class2 | Class II (interproximal posterior) | TBD |
| dir-class3 | Class III (anterior interproximal) | TBD |
| dir-class4 | Class IV (anterior incisal-corner) | TBD |
| dir-class5 | Class V (cervical) | TBD |
| dir-amalgam | Amalgam restoration | TBD |
| dir-sealant | Sealant | TBD |
| dir-prr | PRR | TBD |
| dir-direct-veneer | Direct composite veneer (chairside) | TBD |
| dir-deep-caries-decision | Deep caries near pulp (decision) | TBD |

### Indirect (fixed prosth)
| ID | Label | Status after DxTP read |
|---|---|---|
| ind-conventional-crown | Conventional crown (PFM/cast) | TBD — populate model |
| ind-digital-emax | Digital e.max (chairside CAD/CAM) | TBD |
| ind-veneers | Anterior veneers (6-unit) | TBD |
| ind-bridge | 3-unit FPD | TBD |
| ind-survey-crown | Survey crown (for RPD abutment) | TBD |
| ind-endo-treated | Endo-treated tooth restoration | TBD |
| ind-recement | Re-cement / re-bond | TBD |
| ind-bruxer-crown | Crown for bruxer | TBD |
| ind-fractured-cusp | Fractured cusp restoration | TBD |
| ind-failing-existing-crown | Failing existing crown (decision) | TBD |
| ind-crown-removal | Crown removal | TBD |
| ind-crown-endo-access-fill | Crown endo access fill (D2950) | TBD |
| ind-inlay | Inlay | TBD |
| ind-onlay-bruxer | Onlay for bruxer | TBD |
| ind-anterior-crown-esthetic | Anterior crown (esthetic zone) | TBD |
| ind-post-and-core | Post and core | TBD |
| ind-large-span-fpd | Large-span FPD | TBD |
| ind-zirconia-posterior | Posterior zirconia | TBD |
| ind-3-4-crown | 3/4 crown | TBD |
| ind-cad-cam-inlay-onlay | CAD/CAM inlay/onlay | TBD |
| ind-single-implant-crown | Single implant crown | TBD |
| ind-cracked-tooth-syndrome | Cracked tooth syndrome | TBD |
| ind-onlay-vs-crown-decision | Onlay vs crown decision | TBD |

### Endo
| ID | Label | Status after DxTP read |
|---|---|---|
| endo-diagnosis-workflow | Endo diagnosis workflow | TBD |
| endo-anterior-rct | Anterior RCT | TBD |
| endo-premolar-rct | Premolar RCT | TBD |
| endo-molar-rct | Molar RCT | TBD |
| endo-direct-pulp-cap | Direct pulp cap | TBD |
| endo-indirect-pulp-cap | Indirect pulp cap (perm tooth) | TBD |
| endo-vital-pulp-therapy | Vital pulp therapy (perm tooth) | TBD |
| endo-emergency-incision-and-drainage | Endo emergency I&D | TBD |
| endo-retreatment | RCT retreatment (referral) | TBD |
| endo-trauma-replantation | Trauma — replantation | TBD |
| endo-fractured-anterior | Fractured anterior tooth | TBD |

### Surgery (OS)
| ID | Label | Status after DxTP read |
|---|---|---|
| surgery-simple-ext | Simple single-rooted extraction | TBD |
| surgery-multi-rooted-ext | Multi-rooted molar extraction | TBD |
| surgery-surgical-ext | Surgical extraction (faculty-supervised) | TBD |
| surgery-third-molar | Third molar (referral) | TBD |
| surgery-dry-socket | Dry socket | TBD |
| surgery-post-op-bleed | Post-op bleeding | TBD |
| surgery-fractured-anterior | Fractured anterior (trauma) | TBD |
| cross-odontogenic-infection-airway-risk | Odontogenic infection (airway risk) | TBD |

### Perio
| ID | Label | Status after DxTP read |
|---|---|---|
| perio-coe | Perio COE | TBD |
| perio-prophy | Adult prophy | TBD |
| perio-srp | SRP | TBD |
| perio-maintenance | Perio maintenance | TBD |
| perio-acute-abscess | Acute periodontal abscess | TBD |
| perio-crown-lengthening | Crown lengthening (referral) | TBD |
| perio-gingival-graft | Gingival graft (referral) | TBD |
| cross-pre-prosthetic-surgery | Pre-prosthetic surgery (referral) | TBD |

### CD / IOD
| ID | Label | Status after DxTP read |
|---|---|---|
| cd-conventional | Fully edentulous (conventional CD) | TBD — populate model |
| cd-iid | Immediate interim denture | TBD |
| cd-adjustment | CD adjustment | TBD |
| cd-reline-lab | CD lab reline | TBD |
| cd-iod-canine-roots | IOD on canine roots | TBD |
| cd-implant-supported-lower | 2-implant Mn overdenture | TBD |
| cd-anxious-firsttime | Anxious first-time CD pt | TBD — maybe merge |
| cd-xerostomic | Xerostomic CD pt | TBD — maybe merge |
| cd-rapid-need | Rapid CD need | TBD — maybe merge |
| cd-limited-dexterity | Limited dexterity CD pt | TBD — maybe merge |

### RPD
| ID | Label | Status after DxTP read |
|---|---|---|
| rpd-kennedy3 | Kennedy III RPD | TBD — populate model |
| rpd-distal-extension | Kennedy I/II RPD | TBD |
| rpd-kennedy4-anterior | Kennedy IV anterior RPD | TBD |
| rpd-broken-clasp | RPD repair — broken clasp | TBD |
| rpd-broken-denture-tooth | RPD repair — broken denture tooth | TBD |
| rpd-broken-framework | RPD repair — broken framework | TBD |
| rpd-valplast-repair | Valplast repair | TBD |
| rpd-loose-rpd | Loose RPD | TBD |
| rpd-reline | RPD reline | TBD |
| rpd-implant-hybrid | RPD + implant attachments | TBD |
| rpd-first-time-patient | RPD first-time patient | TBD — maybe merge |
| rpd-tmd-considering | RPD + TMD | TBD |
| rpd-recurrent-caries-abutment | Recurrent caries on RPD abutment | TBD |

### Pedo
| ID | Label | Status after DxTP read |
|---|---|---|
| pedo-composite | Primary tooth composite | TBD |
| pedo-stainless-crown | SSC | TBD |
| pedo-pulpotomy | Pulpotomy | TBD |
| pedo-indirect-pulp-therapy | Primary IPT | TBD |
| pedo-pulpectomy | Pulpectomy | TBD |
| pedo-lstr | LSTR (alternative) | TBD — possibly cut |
| pedo-sealant | Pedo sealant | TBD |
| pedo-fluoride-varnish | Fluoride varnish | TBD |
| pedo-behavior-management | Behavior management | TBD |
| pedo-local-anesthetic | Pedo local anesthetic | TBD |
| pedo-strip-crown | Strip crown (primary anterior) | TBD |
| pedo-primary-anterior-class3 | Primary anterior Class III | TBD |
| pedo-anterior-crown-selection | Primary anterior crown selection | TBD |
| pedo-space-maintainer | Space maintainer | TBD |
| pedo-primary-trauma | Primary tooth trauma | TBD |
| pedo-oral-pathology | Pedo oral pathology | TBD |
| pedo-extraction | Pedo extraction | TBD |
| pedo-poe-recall | Pedo POE / recall | TBD |
| pedo-tx-sequencing | Pedo tx sequencing | TBD |
| pedo-radiograph-selection | Pedo radiograph prescribing | TBD |
| pedo-oral-surgery | Pedo oral surgery | TBD |
| pedo-medications-reference | Pedo medications reference | TBD |
| pedo-deep-caries-or-pulpotomy | Pedo deep caries / pulpotomy decision | TBD |

### Cross (multi-domain combos)
| ID | Label | Status after DxTP read |
|---|---|---|
| cross-cd-rpd | Combined CD + RPD | TBD |
| cross-survey-crown | Survey crown coordination | TBD |
| cross-full-mouth-rehab | Full-mouth rehab | TBD — probably cut (out of scope) |
| cross-cd-iod-implants | Existing CD → add implants | TBD |
| cross-rpd-to-implants | RPD pt → implants | TBD |
| cross-anterior-trauma | Anterior trauma multi-option | TBD |
| cross-dental-photo-composite | Dental photography + composite | TBD |
| cross-anterior-implant-esthetic | Anterior single implant esthetic | TBD |
| cross-pre-radiation-extractions | Pre-radiation extractions | TBD |
| cross-cementation-re-cement | Cementation / re-cement | TBD |
| cross-radiograph-protocols | Radiograph selection (adult) | TBD |
| cross-caries-risk | Caries risk assessment | TBD |
| cross-sdf-arrest | SDF for caries arrest | TBD |
| cross-odontogenic-infection-airway-risk | Odontogenic infection airway risk | TBD |
| cross-veneer-debond | Veneer debond repair | TBD |

### Repair (sub-domain — currently mixed in with ind/rpd above)
- `ind-recement`, `ind-failing-existing-crown`, `ind-crown-removal`,
  `ind-crown-endo-access-fill`, `ind-fractured-cusp`, `cross-veneer-debond` —
  considered "Repair" by the picker UI.

### Ref (reference-only — no patient procedure)
- `pedo-medications-reference` (and any other reference-only entries)

---

## Keep / Cut / Reframe / Merge list — DRAFT for review

Applying the DxTP framework (6 phases × 10 categories) to the current
PATHWAYS array. Each entry is tagged with:
- **Category** (UIC roster taxonomy: Operative/Digital/Fixed/Dentures/Perio/Endo/OS/STI/IOD; or "Diagnostic" / "Urgent" for cross-domain phases)
- **Phase** (Urgent / Dx / I / II / III / IV)
- **Verdict** (KEEP / CUT / REFRAME / MERGE / DEFER)

A note on "MERGE": means roll this pathway's content into another as a
keyDecision variant or material modifier, rather than maintaining it as
a standalone pathway. Reduces clutter on the picker without losing the
clinical content.

"DEFER" means a borderline judgment call — flagged for explicit user
input below.

### Direct / Operative (Category: Operative · Phase I)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| dir-class1 | Operative | I | **KEEP** | Core Phase I procedure |
| dir-class2 | Operative | I | **KEEP** | Core Phase I procedure |
| dir-class3 | Operative | I | **KEEP** | Core Phase I procedure |
| dir-class4 | Operative | I | **KEEP** | Core Phase I procedure |
| dir-class5 | Operative | I | **KEEP** | Core Phase I procedure |
| dir-amalgam | Operative | I | **KEEP** | Still taught at UIC |
| dir-sealant | Operative | I (preventive) | **KEEP** | Preventive — Phase I |
| dir-prr | Operative | I | **KEEP** | Preventive Resin Restoration |
| dir-direct-veneer | Operative | I | **KEEP** | Chairside direct composite veneer (not indirect) |
| dir-deep-caries-decision | Diagnostic+Operative | Dx → I | **KEEP** | Decision pathway (when to pulp cap vs RCT) |

### Indirect / Fixed (Category: Fixed · Phase III)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| ind-conventional-crown | Fixed | III | **KEEP** (model pathway) | Foundation crown workflow |
| ind-digital-emax | Digital | III | **KEEP** | Digital clinic chairside workflow |
| ind-veneers | Fixed | III | **KEEP** | 6-unit anterior veneers |
| ind-bridge | Fixed | III | **KEEP** | 3-unit FPD |
| ind-survey-crown | Fixed | III | **KEEP** | Specifically for RPD prep — distinct workflow |
| ind-endo-treated | Fixed | III | **MERGE** into ind-conventional-crown as a keyDecision variant | "Crown on endo tooth" is conventional crown + ferrule consideration |
| ind-recement | Fixed (repair) | IV | **KEEP** | Common urgent visit |
| ind-bruxer-crown | Fixed | III | **MERGE** into ind-conventional-crown as a material-choice keyDecision | Patient-modifier, not separate workflow |
| ind-fractured-cusp | Fixed | III | **KEEP** | Decision pathway — onlay vs crown after cusp loss |
| ind-failing-existing-crown | Fixed | III | **KEEP** | Decision pathway — repair vs remake |
| ind-crown-removal | Fixed | III (intra-procedural step) | **MERGE** into ind-failing-existing-crown | Crown removal is a step within "failing crown" workflow |
| ind-crown-endo-access-fill | Operative | I | **KEEP** | Actually operative (composite over RCT access); fine as own pathway |
| ind-inlay | Fixed | III | **KEEP** | Inlay distinct from onlay/crown |
| ind-onlay-bruxer | Fixed | III | **MERGE** into ind-onlay-vs-crown-decision as a bruxer variant | Patient-modifier |
| ind-anterior-crown-esthetic | Fixed | III | **MERGE** into ind-conventional-crown as anterior-esthetic variant | Material + shade variant, not separate workflow |
| ind-post-and-core | Fixed | III | **KEEP** | Distinct from crown (additional pre-crown step) |
| ind-large-span-fpd | Fixed | III | **CUT** | Large-span FPDs (>3 unit) exceed UG predoc scope per PIP |
| ind-zirconia-posterior | Fixed | III | **MERGE** into ind-conventional-crown as material variant | Material modifier |
| ind-3-4-crown | Fixed | III | **DEFER** | Uncommon at UG; could merge into conventional crown — *you tell me if UG does 3/4 crowns at UIC* |
| ind-cad-cam-inlay-onlay | Digital | III | **KEEP** | Digital clinic distinct workflow |
| ind-single-implant-crown | STI | III | **KEEP** | Distinct STI workflow |
| ind-cracked-tooth-syndrome | Fixed | III | **KEEP** | Decision pathway (Cracked Tooth Dx → restoration choice) |
| ind-onlay-vs-crown-decision | Fixed | III | **KEEP** | Decision pathway |

### Endo (Category: Endo · Phase I or Urgent)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| endo-diagnosis-workflow | Diagnostic+Endo | Dx | **KEEP** | The Endo Dx workflow — critical |
| endo-anterior-rct | Endo | I | **KEEP** | Core RCT |
| endo-premolar-rct | Endo | I | **KEEP** | Core RCT |
| endo-molar-rct | Endo | I | **KEEP** | Core RCT |
| endo-direct-pulp-cap | Endo | I | **KEEP** | Vital pulp therapy |
| endo-indirect-pulp-cap | Endo | I | **KEEP** | VPT alternative |
| endo-vital-pulp-therapy | Endo | I | **MERGE** with endo-direct-pulp-cap | Same clinical concept; reduces redundancy |
| endo-emergency-incision-and-drainage | Endo | Urgent | **KEEP** | Urgent care pathway |
| endo-retreatment | Endo | I | **KEEP** as referral | UG refers to PG Endo |
| endo-trauma-replantation | Endo + OS | Urgent | **KEEP** | Avulsion replantation |
| endo-fractured-anterior | Endo + Operative | Urgent | **MERGE** with surgery-fractured-anterior into a single cross-trauma-fractured-anterior pathway | Both pathways are the same case; just different starting domains |

### Surgery / OS (Category: OS · Phase I or Urgent)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| surgery-simple-ext | OS | I | **KEEP** | Core Phase I |
| surgery-multi-rooted-ext | OS | I | **KEEP** | Core Phase I |
| surgery-surgical-ext | OS | I | **KEEP** | Faculty-supervised; already disclaimed in description |
| surgery-third-molar | OS | I/II | **KEEP** as referral | UG refers to PGOS |
| surgery-dry-socket | OS | Urgent | **KEEP** | Post-op urgent |
| surgery-post-op-bleed | OS | Urgent | **KEEP** | Post-op urgent |
| surgery-fractured-anterior | OS + Endo | Urgent | **MERGE** with endo-fractured-anterior | See note above |
| cross-odontogenic-infection-airway-risk | OS + Endo | Urgent | **KEEP** | Safety-critical pathway |

### Perio (Category: Perio · varies)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| perio-coe | Diagnostic+Perio | Dx | **KEEP** | THE Perio Dx engine lives here |
| perio-prophy | Perio | I or IV | **KEEP** | Phase I (adult prophy) or IV (recall prophy) |
| perio-srp | Perio | I | **KEEP** | Core Phase I |
| perio-maintenance | Perio | IV | **KEEP** | Core Phase IV |
| perio-acute-abscess | Perio | Urgent | **KEEP** | Urgent care |
| perio-crown-lengthening | Perio | II | **KEEP** as referral | Already reframed; recognize+refer |
| perio-gingival-graft | Perio | II | **KEEP** as referral | Already reframed; recognize+refer |
| cross-pre-prosthetic-surgery | OS | II | **KEEP** as referral | Already reframed |

### CD / IOD (Category: Dentures or IOD · Phase III)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| cd-conventional | Dentures | III | **KEEP** (model pathway) | Foundation CD workflow |
| cd-iid | Dentures | III | **KEEP** | Immediate Interim Denture workflow |
| cd-adjustment | Dentures | IV | **KEEP** | Phase IV maintenance adjustment |
| cd-reline-lab | Dentures | IV | **KEEP** | Phase IV lab reline |
| cd-iod-canine-roots | Dentures (tooth-retained OD) | III | **KEEP** | Distinct tooth-retained overdenture workflow |
| cd-implant-supported-lower | IOD | III | **KEEP** | 2-implant Mn overdenture — UG scope per PIP |
| cd-anxious-firsttime | Dentures | III | **MERGE** into cd-conventional as keyDecision variant | Patient-modifier |
| cd-xerostomic | Dentures | III | **MERGE** into cd-conventional | Patient-modifier |
| cd-rapid-need | Dentures | III | **MERGE** into cd-conventional | Workflow-modifier |
| cd-limited-dexterity | Dentures | III | **MERGE** into cd-conventional | Patient-modifier |

### RPD (Category: Dentures · Phase III or IV)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| rpd-kennedy3 | Dentures (RPD) | III | **KEEP** (model pathway) | Foundation RPD workflow |
| rpd-distal-extension | Dentures (RPD) | III | **KEEP** | Kennedy I/II with altered-cast variation |
| rpd-kennedy4-anterior | Dentures (RPD) | III | **KEEP** | Anterior single-tooth RPD distinct |
| rpd-broken-clasp | Dentures (RPD) | IV (repair) | **KEEP** | Common repair scenario |
| rpd-broken-denture-tooth | Dentures (RPD) | IV | **KEEP** | Common repair scenario |
| rpd-broken-framework | Dentures (RPD) | IV | **KEEP** | Often ends in remake decision |
| rpd-valplast-repair | Dentures (RPD) | IV | **DEFER** | *Is Valplast (flexible RPD) used at UIC UG predoc?* If not, **CUT** |
| rpd-loose-rpd | Dentures (RPD) | IV | **KEEP** | Common complaint scenario |
| rpd-reline | Dentures (RPD) | IV | **KEEP** | Distinct from broken-clasp; lab reline workflow |
| rpd-implant-hybrid | Dentures (RPD) + STI/IOD | III | **KEEP** | Implant-retained RPD scenario |
| rpd-first-time-patient | Dentures (RPD) | III | **MERGE** into rpd-kennedy3 | Patient-modifier |
| rpd-tmd-considering | Dentures (RPD) | III | **MERGE** into rpd-kennedy3 as keyDecision | TMD recognition flag |
| rpd-recurrent-caries-abutment | Dentures (RPD) | IV | **MERGE** into rpd-maintenance flow (new pathway?) or into perio-maintenance | Recall finding — not a separate workflow |

### Pedo — **HOW SHOULD THIS BE HANDLED?**

The Patient Disposition spreadsheet doesn't list Pedo on the UG predoc
roster — pedo is tracked separately in the UG Pedo clinic. **Two options:**

- **Option A**: Keep all Pedo pathways in Cases under a Pedo pill (current
  state). Pro: UG students do perform pedo procedures and Cases serves
  them too. Con: mixes adult and pedo workflows in one nav.
- **Option B**: Cut all Pedo pathways from Cases (out of UG predoc adult-
  clinic roster). Pro: Cases matches the UIC adult-clinic taxonomy
  cleanly. Con: pedo students lose the multi-visit lab-step view.
- **Option C**: Spin Pedo into its own tab. Pro: clean separation. Con:
  build cost.

⏳ **Need your decision before listing per-pathway verdicts for Pedo.**

Pedo pathways currently: pedo-composite, pedo-stainless-crown,
pedo-pulpotomy, pedo-indirect-pulp-therapy, pedo-pulpectomy, pedo-lstr,
pedo-sealant, pedo-fluoride-varnish, pedo-behavior-management,
pedo-local-anesthetic, pedo-strip-crown, pedo-primary-anterior-class3,
pedo-anterior-crown-selection, pedo-space-maintainer, pedo-primary-trauma,
pedo-oral-pathology, pedo-extraction, pedo-poe-recall, pedo-tx-sequencing,
pedo-radiograph-selection, pedo-oral-surgery, pedo-medications-reference,
pedo-deep-caries-or-pulpotomy.

### Cross (multi-domain combos)

| Pathway | Category | Phase | Verdict | Reason |
|---|---|---|---|---|
| cross-cd-rpd | Dentures (RPD+CD) | III | **KEEP** | Common combined edentulous arch workflow |
| cross-survey-crown | Fixed (overlap with ind-survey-crown) | III | **MERGE** into ind-survey-crown | Same workflow under two IDs |
| cross-full-mouth-rehab | (out of scope) | — | **CUT** | Full-mouth rehab exceeds UG scope per philosophy |
| cross-cd-iod-implants | IOD | III | **KEEP** | Existing-CD → add implants workflow |
| cross-rpd-to-implants | Dentures + STI/IOD | III | **KEEP** | Transition workflow |
| cross-anterior-trauma | Urgent (multi-domain) | Urgent → III | **KEEP** | The decision pathway for max anterior trauma — implant vs FPD vs RPD |
| cross-dental-photo-composite | Operative (technique) | I | **MERGE** into dir-class4 or dir-direct-veneer | Photography is a technique, not its own workflow |
| cross-anterior-implant-esthetic | STI | III | **KEEP** | Specifically for #6-11 esthetic-zone implant (and PIP-excluded #8/#9 → PG referral) |
| cross-pre-radiation-extractions | OS + Dentures | I (urgent timing) | **KEEP** | Medical-context case; coordination with oncology |
| cross-cementation-re-cement | Fixed (technique) | III/IV | **MERGE** into ind-recement | Same workflow |
| cross-radiograph-protocols | Diagnostic | Dx | **CUT** | Belongs in Steps tab (per-appointment) or as Reference doc |
| cross-caries-risk | Diagnostic | Dx | **KEEP** | CAMBRA case-typing — feeds TP |
| cross-sdf-arrest | Operative (preventive) | I | **KEEP** | Distinct preventive workflow |
| cross-veneer-debond | Fixed (repair) | IV | **MERGE** into ind-recement as ceramic-veneer variant | Same workflow |

### Pedo-specific reference

| Pathway | Verdict | Reason |
|---|---|---|
| pedo-medications-reference | **DEFER (pending Pedo decision)** | Reference data, not a workflow; if Pedo stays in Cases, keep |

---

## Summary of the keep/cut list

By count (current PATHWAYS array has ~100 pathways):

| Verdict | Adult pathways | Pedo pathways | Total |
|---|---|---|---|
| KEEP as standalone | ~55 | TBD (depends on Option A/B/C) | TBD |
| MERGE into another | ~16 | TBD | TBD |
| KEEP as referral | 5 (perio-CL, perio-graft, cross-pre-prosth-surg, surgery-3rd-molar, endo-retreatment) | TBD | TBD |
| CUT entirely | 3 (ind-large-span-fpd, cross-full-mouth-rehab, cross-radiograph-protocols) | TBD | TBD |
| DEFER (pending input) | ~4 | TBD | TBD |

## Questions for you before any code cuts

1. **Pedo disposition** — Option A (keep), B (cut), or C (own tab)?
2. **ind-3-4-crown** — does UG predoc do 3/4 crowns at UIC, or merge it into conventional crown?
3. **rpd-valplast-repair** — does UIC UG predoc see/repair Valplast (flexible) RPDs, or cut?
4. **The MERGE candidates** — particularly the patient-modifier merges
   (cd-anxious/xerostomic/rapid-need/limited-dexterity, rpd-first-time-patient/tmd-considering,
   ind-bruxer-crown, ind-zirconia-posterior, ind-anterior-crown-esthetic): are you OK with these
   being absorbed into the model pathway as keyDecision variants, or do you want them as
   standalone pathways for findability?
5. **The KEEP-as-referral pathways** (perio-CL, perio-graft, cross-pre-prosthetic-surgery,
   surgery-third-molar, endo-retreatment): keep all five, or trim further?

Once you respond to those five, I'll execute the cuts as comment-blocks per the
`CASES-FOUNDATION.md` disposition rule (recoverable; not deleted).

---

## Next action

Read `Dx and Tx Planning (Spring 2025).pdf` and extract:
1. The canonical list of comprehensive treatments DxTP covers
2. The visit sequence framework DxTP uses
3. Anything that contradicts the current scope assumptions in
   `CASES-FOUNDATION.md`

Update this doc with what's found. Then propose the keep/cut list.
