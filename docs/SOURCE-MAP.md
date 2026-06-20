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

### ⚠ Flagged — multi-source conflict, NOT yet resolved
- Crown occlusal "**1.5 mm functional / 1.0 mm non-functional cusp**" (appears 2× in the maps): conflicts with **Swade p.58** PFM/e.max (**1.5–2.0**) and with **PFM Crowns guide** ("Final occlusal reduction **1.25–1.5 mm**"). Three different UIC figures. Needs visual read of PFM Crowns + Full Crown Prep decks to pick the authoritative one before any edit. **Do not "fix" until resolved.**
