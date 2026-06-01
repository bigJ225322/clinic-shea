# Vetting source-map

## Maps tab pathways — current per-claim source log

**Rebuilt 2026-06-01.** The legacy "Cases tab" tables further down predate the Maps tab and cover NONE of the Maps pathways. This section is the live source log for the Maps tab (CD / RPD / Crown / Bridge / Digital). Per-pathway audit status:

- **Crown (crown-pfm)** — audited 2026-06-01 ✓ (3 minor flags)
- **Bridge (bridge-pfm)** — audited 2026-06-01 ✓ (1 fix: prep finish line 1.2-1.5→1-1.25; recement/removal inferred)
- **Digital (digital-emax)** — audited 2026-06-01 ✓ (design + Ivoclean fixed; recement/removal inferred; best-sourced of the three)
- **CD (cd-conventional)** — structure verified 2026-06-01 ✓ vs Swade Denture #1-7 (deep lecture-PDF re-verify deferred)
- **RPD (rpd-conventional)** — structure verified 2026-06-01 ✓ vs Swade #4-10 + survey-crown branch (deep lecture-PDF re-verify deferred)

### Crown (crown-pfm) — audited 2026-06-01

Sources: Swade clinical manual (FIXED section, ~pp. 58-72); UIC fixed-pros decks in `~/Desktop/Crowns HY/`.

| Chapter / block | Primary source | Status |
|---|---|---|
| crownc-foundation — build-up | Swade CORE BUILDUP | ✓ |
| crownc-foundation — post | Prefabricated Post Systems (Alapati); ferrule/restorability from Assessing Tooth Restorability Pt 1 | ✓ |
| crownc-prep — reductions/sequence/burs | PFM Crowns deck; Swade CROWN PREP | ✓ — ⚠ finish-line width conflict |
| crownc-prep — retention & resistance | Principles of Tooth Preparation deck | ✓ |
| crownc-impression | Soft Tissue Mgmt & Final Impression (Marcano); Swade CROWN FINAL IMPRESSION | ✓ |
| crownc-provisional | Swade PROVISIONAL CROWN | ✓ |
| crownc-delivery | Swade CROWN DELIVERY | ✓ |
| crownc-recement | inferred (general principles + CDT D2920); no dedicated Swade section | ⚠ inferred |
| crownc-removal | Swade CROWN REMOVAL + ENDO ACCESS FILL | ✓ — ⚠ bur material unverified |
| lab tile (pour / die-trim / fabricate) | Mounting & Die Trimming (Vlagos); Swade die-trim + PFM lab-Rx examples | ✓ |

**Flags:**
1. **Finish-line width** — the PFM Crowns deck says facial deep chamfer/shoulder **1.2–1.5 mm**; Swade's PFM table says **1.0–1.25 mm**. Content currently uses the deck (1.2–1.5). → Rami: which does UIC want?
2. **crownc-recement** — three-way check + recement steps are sound but **inferred**; Swade has no dedicated "recement crown" procedure. D2920 is the correct code.
3. **crownc-removal** — "crown-removing burs (anterior/posterior)" material (diamond vs carbide) **unverified**. → Rami.

Otherwise the crown is claim-for-claim sourced — the audit confirms the most heavily-vetted pathway is solid.

### Bridge (bridge-pfm) — audited 2026-06-01

Sources: UIC fixed-pros decks (`~/Desktop/Crowns HY/` FPD decks + shared crown decks); the FPD lab-Rx templates; CDT codes from the app catalog. **Swade has NO bridge section** (only lab-Rx examples) — the bridge is sourced entirely from lectures + reasonable inference.

| Chapter / block | Primary source | Status |
|---|---|---|
| brc-foundation | Swade CORE BUILDUP (applied to the abutment) + Prefab Post + Restorability | ✓ |
| brc-abutment | Intro to FPD / Abutment Evaluation (Organ-Boshes) | ✓ verbatim |
| brc-prep | Modified Posterior FPD Prep & Pontic Design deck | ✓ **after fix** (finish line corrected to 1–1.25 mm; 4–10° taper added) |
| brc-pontic | FPD Prep & Pontic + Framework decks | ✓ |
| brc-provisional | Bis-acryl Provisional Restorations for Posterior FPD (Marcano) | ✓ (rebuilt) — ⚠ direct-vs-indirect (Rami) |
| brc-impression | Soft Tissue Mgmt & Final Impression (Marcano, incl. #9-11 FPD example) | ✓ — "2 cords/abutment" extended from the single-crown technique |
| brc-framework | Metal Framework Fabrication & Try-in deck | ✓ — ⚠ does UG section-and-solder? (Rami) |
| brc-bisque | PFM Porcelain Application & Final Contouring deck | ✓ |
| brc-delivery | Framework deck (seat/rock) + crown delivery + porcelain (metal-collar polish) | ✓ — ⚠ framework-visit coding (Rami) |
| brc-recement | inferred (general principles + CDT D6930) | ⚠ inferred |
| brc-removal | inferred (crown removal + sectioning logic) | ⚠ inferred |
| lab tiles (framework cast / porcelain / glaze) | Framework + Porcelain decks + FPD lab-Rx templates; Vlagos die-trim | ✓ — ⚠ student die-trim/mount ownership? (Rami) |

**Flags / fixes:**
1. **FIXED — brc-prep finish line:** was 1.2–1.5 mm (borrowed from the single-crown PFM deck); the FPD prep deck specifies **1–1.25 mm all around** (lingual chamfer 0.8–1 mm). Corrected, and added the deck's **4–10° between opposing walls** taper.
2. **brc-recement / brc-removal — inferred** (no FPD-specific source; the D6930 / removal logic is reasonable, codes correct).
3. **Rami:** bridge provisional direct-vs-indirect; UG section-and-solder vs remake; student die-trim/mount on a bridge; framework-try-in coding.

### Digital (digital-emax) — audited 2026-06-01

Sources: Swade **DIGITAL** section (PREP & SCAN / PREP GUIDELINES / DELIVERY, pp. ~106-116); Digital HY decks (`~/Desktop/HY Folders/Digital HY/`).

| Chapter / block | Primary source | Status |
|---|---|---|
| digc-foundation | Swade CORE BUILDUP (as any crown) | ✓ |
| digc-selection | Swade (translucency + shade) + Case Selection deck (indications) | ✓ — ⚠ contraindications from inlay/onlay deck |
| digc-prep | Swade DIGITAL PREP GUIDELINES + Posterior crown prep deck | ✓ **exact** to Swade |
| digc-scan | Swade DIGITAL PREP & SCAN | ✓ **exact** (TRIOS setup, cord-trim, codes) |
| digc-provisional | Swade (Integrity before scan) | ✓ |
| digc-delivery | Swade DIGITAL DELIVERY | ✓ **exact** (sprue, adjust-prep, crystallize, Panavia) — Ivoclean corrected |
| digc-recement | inferred (mirrors the sourced Panavia protocol + CDT D2920) | ⚠ inferred |
| digc-removal | inferred (crown removal + bonded-interface logic) | ⚠ inferred |
| lab tile (design + mill) | Design Studio deck (you design) + Swade (lab mills, pre-crystallized) | ✓ **corrected** (was "lab designs") |

**Flags / fixes:**
1. **FIXED — design ownership:** the **student** designs in Design Studio; the lab mills. (Was "lab designs.")
2. **FIXED — Ivoclean:** now a standard cement-prep step (the crown is always tried in), per Swade — was conditional.
3. **digc-selection contraindications** — dropped lower-anteriors + >2-adjacent; the remaining (surveyed crowns, rest seats, moisture) still trace to the inlay/onlay decision-tree deck. → Rami: confirm the real full-crown contraindications.
4. **digc-recement / digc-removal — inferred** (no Swade digital recement/removal; D2920 correct).

Prep, scan, and the entire Panavia delivery are verbatim-faithful to Swade — Digital is the best-sourced of the three new pathways.

### CD (cd-conventional) — structure verified 2026-06-01

Sources: Swade CD (Denture #1-7, pp. ~76-97); CD lecture decks in `ALL CD FILES` (Tan, Obrez, grading sheets) — cited per labStep `source` field.

Visit structure cross-checks cleanly to Swade Denture #1-7: V1=#1 (COE + diagnostic) · V2=#2 (border-mold + final) · V3=#3 (wax rims: facebow/VDO/CR/tooth selection) · V4=#4 (anterior try-in) · V5=#5 (posterior try-in) · V6=#6 (delivery + clinical remount) · V7+V8 = #7 (adjustment, split into 24h + 1-week).

**Status:** structure ✓; labSteps cite primary sources; heavily vetted in prior sessions. **Not re-verified claim-by-claim against the CD lecture PDFs this pass** (not converted — prior-session audits + the per-step source fields stand).
**Flag:** Swade lists ONE CD adjustment visit (#7); the pathway shows **24h + 1-week** — consistent with standard practice + the CD lecture material, but worth a one-line confirm.

### RPD (rpd-conventional) — structure verified 2026-06-01

Sources: Swade RPD STEPS (clinical appts #1-10, pp. ~74-75 + lab steps); Kim Lecture 4-Part A; RPD Fall 2022 Lab PDFs — cited per labStep. Plus the RPD design-engine (separately verified vs the Design Case answer keys in prior sessions).

Visit structure cross-checks to Swade's RPD sequence: main path V1-V9 = Swade #4-10 (abutment prep → border-mold/final → framework try-in → wax try-in → delivery → 24h → 1-week), with the **survey-crown branch** = Swade #1-3 (conditional, "skip to #4 if no survey crowns"). The 24h + 1-week split **matches** Swade #9 + #10.

**Status:** structure ✓; labSteps cite Swade + Kim + RPD Fall 2022; engine verified vs answer keys (prior sessions). **Not re-verified claim-by-claim against the RPD Lab PDFs this pass** (not converted — prior audits + source fields stand). No new flags.

---

## LEGACY — Cases-tab era source map (superseded by the Maps section above)

Built iteration 1, autonomous loop. Three tables below, plus a gap analysis section identifying topics Swade covers that the Cases tab does NOT.

**Sources:**
- Swade UIC clinical manual: `/Users/jakeshea/Desktop/clinic (swade).pdf` (220 pages)
- Dentistry Files: `/Users/jakeshea/Documents/Dentistry Files/`

---

## Table 1 — Cases tab chapter → Swade source pages

| Chapter | Guide | Title | Swade pages |
|---|---|---|---|
| dir-ch1 | direct | Universal direct workflow | pp. 35-49 (composite procedure context) |
| dir-ch2 | direct | Rubber dam isolation | no direct Swade match (Cases-tab original) |
| dir-ch3 | direct | Caries removal | pp. 171 (ADA caries class), 35-45 (procedure context) |
| dir-ch4 | direct | Etch and adhesive | pp. 37-45 (composite procedure) |
| dir-ch5 | direct | Composite placement (incremental vs bulk-fill) | pp. 37-45 |
| dir-ch6 | direct | Light cure protocol | implicit in pp. 37-45 |
| dir-ch7 | direct | Finishing and polishing | implicit in pp. 37-45 |
| dir-ch10 | direct | Class I composite | pp. 37-38 (Composite — Class I) |
| dir-ch11 | direct | Class II composite | pp. 39-40 (Composite — Class II) |
| dir-ch12 | direct | Class III composite | pp. 41-42 (Composite — Class III) |
| dir-ch13 | direct | Class IV composite | pp. 43-44 (Composite — Class IV) |
| dir-ch14 | direct | Class V composite/RMGI | pp. 45-46 + p. 49 (RMGI) |
| dir-ch15 | direct | Direct composite veneer | pp. 47-48 (Composite Veneers) |
| dir-ch20 | direct | Sedative restoration (D2940) | p. 172 (Materials — IRM) |
| dir-ch21 | direct | Core buildup (D2950) | pp. 55-57, 59-60 |
| dir-ch30 | direct | Composite material reference | p. 172 (Materials summary) |
| dir-ch31 | direct | Common pitfalls | no direct Swade match (Cases-tab original) |
| ind-ch1 | indirect | Conventional crown workflow | pp. 55-69 (full crown sequence) |
| ind-ch2 | indirect | Digital CAD/CAM workflow | pp. 105-117 |
| ind-ch3 | indirect | Metal framework try-in | inferred from pp. 62-67 |
| ind-ch4 | indirect | Cementation comprehensive | pp. 68-69, 114-117 |
| ind-ch5 | indirect | PFM | p. 172 (materials), pp. 55-69 |
| ind-ch6 | indirect | Lithium disilicate (e.max) | pp. 105-117 (digital), 114-115 (cementation) |
| ind-ch7 | indirect | Zirconia | p. 172, pp. 105-117 |
| ind-ch8 | indirect | Cast gold | p. 172 |
| ind-ch9 | indirect | Feldspathic porcelain | pp. 47-48 (composite veneers — analog), no direct ceramic-veneer pages |
| ind-ch10 | indirect | Hybrid ceramic / resin-ceramic | no direct Swade match (modern materials) |
| ind-ch11 | indirect | Survey crowns for RPD abutments | p. 75 (RPD steps mention), Lab 3 PDF in ALL RPD FILES |
| ind-ch12 | indirect | ¾ crown | no direct Swade match |
| ind-ch13 | indirect | Inlay | pp. 108-111 (digital inlay) |
| ind-ch14 | indirect | Onlay | pp. 108-112 (digital onlay specs) |
| ind-ch15 | indirect | FPDs (bridges) | no direct Swade match (only lab Rx examples on p. 197) |
| ind-ch16 | indirect | Restoring endo-treated teeth | p. 71 (Crown Endo Access Fill), pp. 119-121 (RCT) |
| ind-ch17 | indirect | Dental stones | p. 172 (materials reference) |
| ind-ch18 | indirect | Mounting on Mark 320 | Articulator+Facebow.pdf in ALL CD FILES |
| ind-ch19 | indirect | Die trimming | no direct Swade match (lab procedure) |
| ind-ch20 | indirect | Diagnostic wax-up + lost-wax | no direct Swade match (lab procedure) |
| ind-ch21 | indirect | Porcelain application + bisque | no direct Swade match (lab procedure) |
| ind-ch22 | indirect | Shade taking | pp. 62, 106-110 (digital scan + shade) |
| ind-ch23 | indirect | Common pitfalls | no direct Swade match (Cases-tab original) |
| ind-ch24 | indirect | (chapter not currently in PATHWAYS) | — |
| ind-ch25 | indirect | Post-cementation adjustment + follow-up | pp. 68-69 (delivery) |
| ind-ch26 | indirect | Implant prosthetics fundamentals | pp. 98-104 |
| ind-ch27 | indirect | Implant impression copings | pp. 99-100 |
| ind-ch28 | indirect | Intraoral scanner workflow | pp. 106-110 |
| ind-ch29 | indirect | Intraoral repair protocols (PFM + zirconia chip) | no direct Swade match (Cases-tab original) |
| ind-ch30 | indirect | Maryland / RBFPD | no direct Swade match |
| cd-ch1 | cd | Diagnostic impression | pp. 80-82 (Denture #1) |
| cd-ch2 | cd | Custom tray fabrication | pp. 83 (custom tray modification context) |
| cd-ch3 | cd | Border molding | pp. 83-84 (Denture #2) |
| cd-ch4 | cd | Final PVS impression | pp. 83-84 |
| cd-ch5 | cd | Boxing & pouring | Boxing and Pouring.pdf in ALL CD FILES |
| cd-ch6 | cd | Face-bow (edentulous) | Articulator+Facebow.pdf |
| cd-ch7 | cd | Mounting on Mark 320 | Articulator+Facebow.pdf |
| cd-ch8 | cd | (slot) | — |
| cd-ch9 | cd | (slot) | — |
| cd-ch10 | cd | (slot) | — |
| cd-ch11 | cd | Tooth setup order + position | pp. 88-91 (Denture #4 + #5), Anterior teeth set up-Technique.pdf |
| cd-ch12 | cd | (slot) | — |
| cd-ch13 | cd | Wax try-in | pp. 84-91 (Denture #3-5) |
| cd-ch14 | cd | Processing + lab remount | 26_Denture_processing.pdf |
| cd-ch15 | cd | Delivery | pp. 92-93 (Denture #6) |
| cd-ch16 | cd | (slot) | — |
| cd-ch17 | cd | (slot) | — |
| cd-ch18 | cd | Phonetics | pp. 84-87 (wax rim VDO + phonetics) |
| cd-ch19 | cd | Types (immediate / interim / IID / conventional) | pp. 76-77 (CD pathway) |
| cd-ch20 | cd | Reline / rebase / repair | pp. 96-97 (Lab reline) |
| cd-ch21 | cd | (slot) | — |
| cd-ch22 | cd | Loose denture differential | pp. 94-95 (Denture #7 adjustment) |
| cd-ch23 | cd | (slot) | — |
| cd-ch24 | cd | Edge-case management | no direct Swade match (Cases-tab original) |
| cd-ch25 | cd | (slot) | — |
| cd-ch26 | cd | Clinical remount + selective grinding | no direct Swade match (deep-dive) |
| cd-ch27 | cd | Attachments for overdentures | no direct Swade match (mostly implant section pp. 98-104) |
| cd-ch28 | cd | Chairside denture liners | pp. 172 (materials), 96-97 (reline context) |
| rpd-ch1 | rpd | (slot) | — |
| rpd-ch2 | rpd | Mount diagnostic casts | Lab PDFs in ALL RPD FILES |
| rpd-ch3 | rpd | How to survey a cast | Lab 1-2 PDFs |
| rpd-ch4 | rpd | Custom tray fabrication | Lab PDF |
| rpd-ch5 | rpd | (slot) | — |
| rpd-ch6 | rpd | (slot) | — |
| rpd-ch7 | rpd | Preliminary Partial Denture Design Form (Lab 4) | Lab 4 PDF |
| rpd-ch8 | rpd | Survey crown prep specifics | Lab 3 PDF (Preparations of GP and Rest Seats) |
| rpd-ch9 | rpd | How to write the lab Rx | pp. 197-199 (lab Rx examples) |
| rpd-ch10 | rpd | PIP + Mizzy technique | no direct Swade match |
| rpd-ch11 | rpd | Pressure point map | no direct Swade match |
| rpd-ch12 | rpd | Occlusal adjustment sequence at delivery | no direct Swade match |
| rpd-ch13 | rpd | POI script for RPD delivery | no direct Swade match |
| rpd-ch14 | rpd | 7 esthetic parameters in depth | p. 85-86 (wax rim eval — includes esthetics) |
| rpd-ch15 | rpd | (slot) | — |
| rpd-ch16 | rpd | Common pitfalls | no direct Swade match (Cases-tab original) |
| rpd-ch17 | rpd | (slot) | — |
| rpd-ch18 | rpd | Repair procedures (5 scenarios) | no direct Swade match (deep-dive content) |
| rpd-ch19 | rpd | (slot) | — |
| rpd-ch20 | rpd | Framework try-in | Lab PDFs |
| rpd-ch21 | rpd | Wax try-in | Lab PDFs |

---

## Table 2 — Swade topic → Cases-tab chapter (the gap inventory)

This is the source-of-truth table for gap analysis. Topics marked `[GAP]` are not covered by any current Cases-tab chapter.

### Swade pp. 5-20 — Examinations & Treatment Planning

| Swade topic | Pages | Coverage |
|---|---|---|
| Start Check | 5-6 | `[GAP]` — no Cases-tab chapter for the initial-visit checklist |
| Screening | 6-7 | `[GAP]` |
| Urgent Care | 8-11 | `[GAP]` |
| COE (Comprehensive Oral Exam) overview | 12 | `[GAP]` |
| Perio COE (Part 1) | 13-14 | `[GAP]` |
| Restorative COE (Part 2) | 15-16 | `[GAP]` |
| Treatment Plan (Part 3) | 17-18 | `[GAP]` |
| Implant Consult | 19-20 | partially covered by ind-ch26 (prosthetics side); no surgical-consult chapter |

### Swade pp. 21-24 — Periodontal Procedures

| Swade topic | Pages | Coverage |
|---|---|---|
| POE (Periodic Oral Exam) | 21-24 | `[GAP]` |
| Prophy (D1110) | 22 | `[GAP]` |
| SRP (D4243/D4341) | 22 | `[GAP]` |
| Perio Reevaluation (D0170) | 22 | `[GAP]` |
| Perio Maintenance (D4910) | 22 | `[GAP]` |

### Swade pp. 35-51 — Restorative (covered above mostly, but check gaps)

| Swade topic | Pages | Coverage |
|---|---|---|
| Amalgam | 35-36 | `[GAP]` — no Cases-tab amalgam chapter; we have composite only |
| Composite Class I-V | 37-48 | ✓ dir-ch10/11/12/13/14 |
| Composite Veneers | 47-48 | ✓ dir-ch15 (direct composite veneer) |
| RMGI (Ketac Nano / Fuji IX) | 49 | partially ✓ dir-ch14 (Class V RMGI); standalone material reference is `[GAP]` |
| Sealants | 51 | `[GAP]` — no sealant chapter |

### Swade pp. 55-75 — Fixed Prosth (covered above mostly)

| Swade topic | Pages | Coverage |
|---|---|---|
| Core buildup + crown prep + provisional + impression | 55-57 | ✓ ind-ch1, dir-ch21 |
| Provisional materials (bis-acryl, PMMA) | 63 | partially covered; standalone reference `[GAP]` |
| Provisional crown fabrication | 64-65 | partially covered by ind-ch1 |
| Crown removal | 70 | `[GAP]` — no chapter for removing existing crown |
| Crown endo access fill | 71 | partially covered by ind-ch16 |

### Swade pp. 76-97 — Complete Dentures (covered above mostly, see Table 1)

### Swade pp. 98-117 — Implants + Digital (covered above mostly)

### Swade pp. 118-124 — Endodontics

| Swade topic | Pages | Coverage |
|---|---|---|
| RCT — 1-visit protocol | 119-121 | `[GAP]` — no endo chapter at all in Cases tab |
| RCT tooth anatomy tables | 122-124 | `[GAP]` |

### Swade pp. 125-159 — Pediatric Dentistry (MAJOR GAP)

| Swade topic | Pages | Coverage |
|---|---|---|
| Peds initial/recall exam | 130-132 | `[GAP]` |
| SDF (silver diamine fluoride) | 133, 182 | `[GAP]` |
| Sealants application (peds-specific) | 134-135 | `[GAP]` |
| PRR (preventive resin restoration) | 136-137 | `[GAP]` |
| Peds composite Class I-V | 138-147 | `[GAP]` (we have adult composite, not peds-specific) |
| Peds amalgam | 148-149 | `[GAP]` |
| SSC (stainless steel crown) | 150-154 | `[GAP]` |
| Pulpotomy | 152-154 | `[GAP]` |
| Strip crown fabrication | 155-156 | `[GAP]` |
| Space maintainer | 157-159 | `[GAP]` |

### Swade pp. 160-167 — Oral Surgery (MAJOR GAP)

| Swade topic | Pages | Coverage |
|---|---|---|
| Extraction procedure | 161-163 | `[GAP]` — only have pre-radiation pathway, no general extraction workflow |
| Post-extraction care | 162-163 | `[GAP]` |
| Surgical instruments reference | 163-167 | `[GAP]` |

### Swade pp. 168-188 — Reference / Pharm / Adjunctive

| Swade topic | Pages | Coverage |
|---|---|---|
| Blood pressure reference | 168 | `[GAP]` (Notes tab may have it; not a Cases-tab thing) |
| Common medications | 169-170 | `[GAP]` (Notes tab) |
| ADA caries classification | 171 | `[GAP]` |
| Materials summary | 172 | partially covered (dir-ch30) but Swade is broader |
| Endodontic diagnosis chart | 173-174 | `[GAP]` (no endo coverage) |
| Maxillary anesthesia blocks | 175-177 | `[GAP]` — no anesthesia workflow chapter |
| Mandibular anesthesia blocks | 178-179 | `[GAP]` |
| Local anesthetic dosing chart | 180 | `[GAP]` |
| Antibiotic prophylaxis | 184-185 | `[GAP]` |
| Bisphosphonates (MRONJ) | 186 | partially covered (cross-pre-radiation discusses ORN vs MRONJ); no dedicated chapter |
| Pregnant patients care | 187 | `[GAP]` |
| Common prescriptions | 188 | `[GAP]` |

### Swade pp. 190-220 — Clinical operations / Axium workflow

These are administrative; mostly not Cases-tab material. Notes tab probably covers most of it.

---

## Table 3 — Lecture PDF inventory (Dentistry Files)

Partial — high-level folder structure with notable PDFs identified. Subsequent iterations should drill in.

| Folder | Notable PDFs | Maps to |
|---|---|---|
| ALL CD FILES | Comprehensive CD Guide.docx, CD Comprehensive Appointment Guide.pdf, CD Comprehensive Guide — Deep Dives.pdf, Articulator+Facebow.pdf, Anterior teeth set up-Technique.pdf, Boxing and Pouring.pdf, Anatomy of the edentulous oral cavity (Dr. Obrez), 33° Teeth Set-up grading sheet, 24_Final_wax_contouring, 26_Denture_processing | cd-ch1 through cd-ch28 + ind-ch18 (Mark 320 mounting) |
| ALL DxTP FILES | (not yet scanned) | Would feed the Dx/TP chapters that don't yet exist |
| ALL IMPLANTS FILES | (not yet scanned) | ind-ch26, ind-ch27, cross-anterior-implant-esthetic, cross-cd-iod-implants |
| ALL INDIRECT RESTORATION FILES | (not yet scanned) | ind-ch1 through ind-ch30 |
| ALL RPD FILES | RPD Fall 2025 Lab 3 - Preparations of GP and Rest Seats.pdf, Comprehensive RPD Guide.docx (referenced earlier), retainers PDF, design cases | rpd-ch1 through rpd-ch21 |
| Endo Lectures | DBCS 327 New Techniques in ENDO Clinic.pdf, Management of Endodontic Emergencies.pdf, TRAUMA guidelines UIC, Vital pulp therapy 2025, ENDO Clinic Problem Avoidance | Would feed endo chapters that don't yet exist |
| O.S. Lectures | Complications and Post-Op Management.pdf, Salivary Gland disorders, Odontogenic infections, Pre-Prosthetic Surgery | Would feed oral surgery chapters that don't yet exist |
| Oral Pathology | (not yet scanned) | Reference; would feed Notes tab |

---

## Gap analysis — substantive Swade topics with no Cases-tab coverage

Ranked by clinical breadth and student-touchpoint priority. **Iteration 2+ should fill these.**

### Tier 1 — biggest student-facing gaps

1. **Diagnostic + Treatment Planning workflow** (Swade pp. 5-20). Start Check, Screening, Urgent Care, COE (perio + restorative), Treatment Plan. Every UIC student does these constantly. Suggested new guide: `dxtp` (new domain? or fold into existing domains?). At minimum, a new pill cluster like "Initial visit workflow" with chapters for Start Check, COE Part 1, COE Part 2, Treatment Plan.

2. **Periodontal procedures** (Swade pp. 21-24). Prophy, SRP, Perio Reeval, Perio Maintenance. Distinct from COE; these are billable procedures. Suggested new guide: `perio` or fold into a broader prevention/maintenance domain.

3. **Endodontic procedures** (Swade pp. 118-124 + lecture material). RCT, tooth anatomy, vital pulp therapy, emergency endo. Significant scope.

4. **Oral Surgery** (Swade pp. 160-167 + lecture material). Extraction protocol (simple + surgical), post-op care, suturing.

5. **Pediatric Dentistry** (Swade pp. 125-159). HUGE section. Peds composite, amalgam, SSC, pulpotomy, strip crown, space maintainer, SDF, PRR. Likely worth its own new domain `peds` if the user accepts the scope.

### Tier 2 — narrower but substantive gaps

6. **Amalgam restoration** (Swade pp. 35-36). One chapter would cover it.
7. **Sealants** (Swade p. 51 + 134-135). One chapter.
8. **Local anesthesia workflow** (Swade pp. 175-180). Maxillary + mandibular blocks, dosing, with diagrams. One or two chapters.
9. **Crown removal** (Swade p. 70). Short standalone chapter.
10. **Provisional crown materials reference** (Swade pp. 63-65). Could be added to ind-ch4 (cementation) or as its own chapter.

### Tier 3 — reference material (probably Notes tab, not Cases)

- ADA caries classification (p. 171)
- Antibiotic prophylaxis (pp. 184-185)
- Pregnant patient care (p. 187)
- Common prescriptions (p. 188)
- Blood pressure reference (p. 168)

---

## Iteration 1 stop notes

Built table 1 (chapter → Swade), table 2 (Swade topic → chapter with gap markers), and partial table 3 (lecture inventory). Gap-analysis section identifies 10 specific gap topics ranked by priority.

Iteration 2 should pick Tier 1 #1 (diagnostic + treatment planning) and create the first new chapters. Smaller scope choice: Tier 2 #6-#10, which are single-chapter additions and lower-risk.

Issue worth user input: **does the user want a new domain for peds, endo, OS, perio?** Or fold them under existing domains? Current 6 domains are direct/indirect/rpd/cd/cross/repair — none fit peds/endo/OS/perio naturally. Logging here as `[needs user input]` per loop.md rules.
