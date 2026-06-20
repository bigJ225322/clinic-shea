# SOURCE MAP — Maps-tab provenance (file paths + the citation standard)

**Why this exists:** the old ledgers cited sources by vague name ("Inlay/Onlay lecture", "Sw reduction table ~2440-2500") with no on-disk location and no slide/page. That gave false confidence and shipped wrong figures (the e.max/zirconia reductions). This file fixes the rot at the root.

## The citation standard (non-negotiable)

Every sentence in the Maps tab must carry a citation of the form:

> **[Source short-name], slide N  (or  Swade p.N)  — verified ✓/✗**

…where the short-name resolves to an **absolute file path on this computer** via the index below. "slide N" = the PDF/PPTX page that the claim is literally on. Swade uses the document's printed page numbers. No citation may be a bare name with "zero else to show for it."

A claim is **verified ✓** only after the actual slide/page has been read and the number/fact matches digit-for-digit. Anything not yet read is **unverified** and says so.

---

## Path index (resolve short-names here)

### Swade master
- **Swade** → `/Users/jakeshea/Desktop/clinic (swade).pdf` (printed page numbers; e.g. reduction table = **p.58**, digital crown-prep guidelines = **p.114**)

### Fixed prosth — `/Users/jakeshea/Desktop/MASTER REFERENCE CS/04 — Fixed Prosth — Crown & Bridge/`
- **Principles of Tooth Prep** → `Principles of Tooth Preparation.pdf`
- **Full Crown Prep guide** → `Full crown preparation - Step-by-step guide.pdf`
- **PFM Crowns** → `PFM Crowns.pdf`
- **Goodacre** → `Goodacre - Tooth preparations for complete crowns.pdf`
- **FPD Prep & Pontic** → `Modified version Posterior FPD Preparation and Pontic Design.pdf`
- **Restorability 1/2/3** → `Assessing Tooth Restorability Part 1.pdf` / `…Part 2.pdf` / `Assessing tooth restorability Part 3.pdf`
- **All-Ceramic Crown Eval Form** → `All Ceramic Crown Preparation Evaluation Form 2023 version.pdf`

### Digital — `/Users/jakeshea/Desktop/MASTER REFERENCE CS/05 — Digital Dentistry/`
- **Inlays & Onlays Overview** → `Inlays and Onlays Overview .pdf` (40 slides; prep parameters = **slides 26–27**)
- **Inlay/Onlay Criteria** → `Inlays to Onlay criteria.pdf` (+ `.pptx`)
- **All-Ceramic Crown Step-by-step** → `All Ceramic Crown Prep Step-by-step Guide.pdf`
- **Inlay Scan & Design** → `Inlay Scan and Design.pdf`
- **Digital Clinic Workflow** → `DIGITAL DENTISTRY CLINIC WORKFLOW.pdf`
- **Posterior crown prep #5** → `Posterior crown prep #5.pdf`

### Perio (Dx engine)
- **Tonetti 2018 (framework — THE authority)** → `/Users/jakeshea/Downloads/Perio Papers/Journal of Periodontology - 2018 - Tonetti - Staging and grading of periodontitis  Framework and proposal of a new.pdf` (Table 3 = staging, Table 4 = grading)
- **EFP decision tree** → `/Users/jakeshea/Downloads/perio grading staging.pdf` (simplification — defer to Tonetti on conflict; see [[perio-dx-source-hierarchy]])
- **2017 World Workshop full set** → `/Users/jakeshea/Downloads/Perio Papers/` (all workgroup papers)
- **UIC perio criteria** → `/Users/jakeshea/Desktop/MASTER REFERENCE CS/07 — Board Criteria, Exam & Clinic Forms/2025-dental-periodontal-criteria.pdf`

### CD + RPD source folders (to be path-indexed per source as those pathways are audited)
- CD → `/Users/jakeshea/Desktop/MASTER REFERENCE CS/02 — Complete Dentures/`
- RPD → `/Users/jakeshea/Desktop/MASTER REFERENCE CS/03 — Removable Partial Denture (RPD)/`

---

## Verified per-sentence citations (rebuild in progress — fixed prosth first)

### Crown reductions (digital-emax / crown maps)
- e.max axial **1.25–1.5 mm**; zirconia + metal **1.0–1.25 mm** → **Swade p.58** (reduction table, 3 columns) + **Swade p.114** (digital CROWN PREP) — **✓ verified** (corrected the earlier "1.0 axial / 0.5–1.0 chamfer / 2.0 zirconia" drift).
- e.max occlusal **1.5–2.0 mm**; metal/zirconia **1.25–1.5 mm** → **Swade p.58 + p.114** — **✓ verified**.
- e.max finish line **deep chamfer 1.0–1.25 mm**; metal/zirconia **0.5–0.8 mm chamfer** → **Swade p.58** — **✓ verified**.
- **6–10° taper**, **0.5 mm supragingival finish line** → **Swade p.114** — **✓ verified**.

### Inlay prep parameters
- Isthmus **⅓–½ intercuspal width** → **Inlays & Onlays Overview, slides 26–27** — **✓ verified** (NOT Swade's "1.5 mm", which is only the underextended floor).
- Pulpal floor **1.5 mm (minimum)** → **Inlays & Onlays Overview, slides 26–27** + **Swade p.112** — **✓ verified** (corrected from the overstated "1.5–2.0 mm").
- Interproximal cavosurface **100–120°**; B/L divergence **6–10°**; butt-joint margin → **Swade p.112** + Overview slides 26–27 — **✓ verified**.

### Crown occlusal reduction — RESOLVED by reading the slides
- Crown occlusal reduction **1.5–2.0 mm** (anatomic) + a separate **functional cusp bevel** → **PFM Crowns deck, slides 13–14** (PFM-vs-FGC table: PFM occlusal/incisal 1.5–2.0; prep diagram labels "occlusal reduction 1.5–2mm"; sequence step 4 = functional cusp bevel) + **Swade p.58/p.114** — **✓ verified visually**.
- The "1.25–1.5 mm" that text-extraction surfaced is the **GOLD/FGC** column (Full Crown Prep guide p.20; PFM Crowns slide 13 gold column) — not PFM.
- The map's old "**1.5 functional / 1.0 non-functional cusp**" was a fabrication present in NO source — **fixed** in guides-data + the note-builder "O:" template menu.
- Crown axial **1.25–1.5 mm** (PFM); **taper 2–5°/wall** → PFM Crowns slides 13–14 (≈4–10° total, consistent with Swade's 6–10°). ✓ verified.
- ⚠ Minor finish-line discrepancy to confirm later: **Swade p.58** PFM deep chamfer = **1.0–1.25 mm**; **PFM Crowns slide 13** = deep chamfer/shoulder **1.2–1.5 mm** (~0.2 mm apart). e.max map currently uses Swade's 1.0–1.25. Low priority.

### All-ceramic (e.max) prep — corroborated (4th source)
- e.max axial 1.25–1.5, occlusal/incisal 1.5–2.0, deep chamfer / round shoulder → **All Ceramic Crown Prep Step-by-step, slide 2** + **All-Ceramic Crown Eval Form (04), p.1** (facial axial 1.25–1.5, lingual 1.0–1.25; incisal 1.5–2.0) — ✓ consistent with Swade p.58/p.114, no fix. Anterior all-ceramic incisal reduction = **1.5–2.0 mm**.

### Digital e.max — non-reduction chapters (digc-scan / digc-selection / digc-delivery / ind-ch28)
- **IOS image count:** recommended **< 2,000 images**; **2,000–3,000** clinically acceptable; **> 3,000** exceeds what the software allows → **Rubric for IOS PPC, criterion 14** (+ scan-intro deck s35). **FIXED** the fabricated "under ~1000 / 2000 absolute max" in BOTH `digc-scan` AND `ind-ch28` (recurring-term sweep).
- **Subgingival margin capture** = retract tissue + capture **2–3 mm of gingiva** around the margin → scan-intro deck s18/21/28 + Rubric "scan" criterion. **CUT** the fabricated "scanner reaches ~17 mm depth" (`digc-selection`).
- **e.max minimum material thickness 1.2 mm** → **CAD CAM Dentistry Overview** deck (literal "1.2mm") — the map's "1.2–1.5 mm" is SOURCED, left as-is (do NOT normalize to 1.25).
- **Bond/etch durations** (Ivoclean 20 s, IPS Ceramic Etching Gel **5% HF 20 s** on lithium disilicate, Clearfil Ceramic Primer, Panavia ED Primer 30 s, light-cure 20 s/surface) = manufacturer-IFU standard; the per-step UIC source not yet located → carried as plausible, **source pending** (find the cementation handout).

### ⚠ FLAGS for Jake (digital e.max) — do NOT silently rewrite
1. **Crystallization-state conflict.** `digc-delivery` says the crown arrives "milled but **pre-crystallized — soft**," you adjust it soft, then "**crystallize it in-house** (~25 min)." But **Anterior Crown Delivery deck slide 6** states: "**You will receive a crystallized restoration** with no glaze and sprue still present," and slide 7 warns to adjust gently *because it is already crystallized* ("can overheat"). That deck's workflow = receive **crystallized** → adjust → characterize/stain → **glaze + correction firing** (slides 13–19), NOT student-side crystallization. The map may describe the wrong arrival state / firing. Needs the authoritative cementation-protocol source before any rewrite.
2. **ind-ch15 FPD span:** "3 posterior teeth replaced is the absolute maximum / >2 teeth = high risk" — verify vs Ante's law during the bridge audit.

---

## Audit progress (loop — resumable across firings)

**✓ Verified — fixed prosth:** crown reductions all materials (Swade p.58/114; PFM Crowns s13–15; All-Ceramic deck s2 + eval form); inlay prep params (Inlays&Onlays s26–27 + Swade p.112); **digital e.max non-reduction — scan + selection chapters** (Rubric IOS PPC c.14; scan-intro deck s18–35; CAD/CAM Overview). Fixes shipped so far: e.max axial/chamfer/zirconia, inlay pulpal floor, occlusal "1.5/1.0" fabrication, IOS image-count (digc-scan + ind-ch28), "~17 mm depth."

**▶ Next queue:**
1. digital e.max — **resolve the `digc-delivery` crystallization-state flag** (locate the cementation-protocol source: Ivoclean/HF/Clearfil/Panavia durations + soft-vs-crystallized arrival) + verify provisional/recement/removal
2. crown-pfm (`crownc-*`) — impression / provisional / delivery / foundation / recement
3. bridge-pfm (`brc-*` / `ind-ch15`) — pontic designs + connectors (MFT) + abutment / Ante's-law / span
4. CD pathway (`cd-ch22..28` + `cd-conventional` prose) — per docs/CD-PATHWAY-SOURCES.md
5. RPD pathway (`rpd-*` / `rpdc-*`)
