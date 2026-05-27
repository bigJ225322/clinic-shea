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

Located at `/Users/jakeshea/Desktop/HY Folders/Dentistry Files/`.

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

#### `Patient Disposition & Case Type.pdf` — TBD

#### `Risk Assessment and patient evaluation and diagnotic process PDF with highlight.pdf` — TBD

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

## Decisions log

Decisions about what to do with specific pathways. Append as we go.

*(Empty — fills as we go through the keep/cut review.)*

---

## Next action

Read `Dx and Tx Planning (Spring 2025).pdf` and extract:
1. The canonical list of comprehensive treatments DxTP covers
2. The visit sequence framework DxTP uses
3. Anything that contradicts the current scope assumptions in
   `CASES-FOUNDATION.md`

Update this doc with what's found. Then propose the keep/cut list.
