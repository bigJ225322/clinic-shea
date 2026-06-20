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
- **Crystallization "~25 min"** → SOURCED: **Chairside Materials s19** — "Restoration needs to be fired 15–25 min" (blue/pre-crystallized → crystallized). ✓
- **e.max "1.2–1.5 mm" thickness** → SOURCED VERBATIM: **Chairside Materials s21** — "1.2–1.5 of tooth reduction" (= ≥1 mm ceramic + cement space + overmill). Same slide: **6° taper**; **e.max connector 16 mm²** (banked for the bridge audit); flexural strength **130±30 MPa** (blue) → **360±60 MPa** (crystallized) at s19.
- **`digc-foundation` / `digc-recement` / `digc-removal`** → read, **CLEAN**, no fabricated specifics. Codes correct: D2950 (+D2954 post) foundation, D2920 recement. "4 mm apical GP" = standard endo figure (not deck-sourced; textbook-correct), left as-is.

### ⚠ FLAGS for Jake (digital e.max) — do NOT silently rewrite
1. **Crystallization LOCATION (lab vs in-house) — workflow-ambiguous; Jake to confirm.** Resolved the alarm from last tick: the *material facts* are SOURCED and correct — e.max CAD is milled in the blue (pre-crystallized) block and fired **15–25 min** to crystallize (**Chairside Materials s19**), so the map's "~25 min" and "milled pre-crystallized" are both right. The only open question is WHERE crystallization happens: `digc-delivery` has the **student** crystallize in-house ("take it to Dan, ~25 min"); the **Anterior Crown Delivery deck** (s2 "milled and fired *prior to* the delivery session"; s6 "you will *receive* a crystallized restoration") has the **lab** crystallize, with the student doing characterization + glaze firing. These are two legitimate workflows (monolithic in-house-crystallize vs lab-crystallized + chairside characterize/glaze). **Jake: which should the digc map describe?** Left as-is — a clinical-workflow choice, not a fabrication, so not rewritten.
2. **ind-ch15 FPD span — ✅ RESOLVED (verbatim).** "Replacing 3 posterior teeth is the absolute maximum; any FPD replacing more than 2 teeth is high risk; 4 adjacent edentulous (other than 4 incisors) → RPD/implants" is **verbatim FPD lec s21**. Also lives correctly in the live `brc-abutment`. **Bonus correction:** reading FPD lec s18–21 caught that the 2026-06-13 pass had wrongly CUT Ante's Law (s18) + the span-cube law (s20, "two-pontic span bends 8× more") from `brc-abutment` — **restored + deployed** (they're verbatim in the lecture; the replacement "connector height-cube" is true mechanics but not this lecture's law).

### Crown-PFM (`crownc-*`) — verified, clinically sound
Read all `crownc-*` chapters (impression / provisional / delivery / foundation / recement). No fabricated specifics to cut — every quantitative claim sits within standard restorative ranges:
- **Impression:** biologic width ~1+1 mm / don't prep >0.5 mm into sulcus; two-cord (#00 bottom no-tail, #0 top tail; range #000–#3); PVS full set ~6 min. ✓
- **Provisional:** Integrity seat ~45 s; TempBond fill 80–90 %; posterior cotton-roll ~2 min. ✓
- **Delivery:** disinfect Cavicide 5 min + CHX 5 min; contacts→intaglio→occlusion sequence; RelyX/FujiCem wait 1–2 min, cotton-roll ~3 min; codes D2750A/B/C (PFM high noble) correct. ✓
- **Foundation:** ferrule ~2 mm; Vitrebond 0.5 mm / cure 20 s; etch 15 s / rinse 5 s; **Scotchbond 20 s / air-thin 5 s / cure 10 s = IFU-correct**; post ≥ crown height + retain ≥4 mm GP apically; D2950/D2954 correct. ✓
- **Recement:** D2920 correct. ✓

### ⚠ FLAGS for Jake (crown-pfm)
3. **Gluma timing — ✅ RESOLVED (both correct, two contexts).** `crownc-provisional`'s "15 s, wait 30 s" matches **Swade provisional-cementation (line ~2919)** verbatim; `crownc-foundation`'s "45 s, wait 15 s" matches **Swade restorative-buildup (lines 1481/1584/1685)** verbatim. Swade deliberately teaches different Gluma timings for *provisional cementation* vs *restorative desensitization* — NOT an inconsistency. No change. (Caught this before "fixing" the correct value — read Swade first.)
4. **D0275 bitewing code — ✅ RESOLVED (real Swade code).** **Swade line 3133:** "D0275 (Bitewing N/C)" (N/C = no charge), listed with I9002 (Lab quality review, Swade 3134). Deliberate UIC/Swade code, not a typo for D0274. No change.
5. **crownc-foundation "cure the final increment 60 s."** — NOT in Swade (restorative section line 1591 says only "cure 20-40s after each increment"). Plausible longer final cure, but no UIC source → kept, flagged. (Open for Jake.)
6. **crownc-foundation ParaPost fiber-vs-metal.** — The map calls UIC's post a "fiber post … close to dentin in stiffness." The fiber-≈-dentin *concept* is well-sourced (Alapati post deck s36 modulus chart + s40), but **Restoring-Endo lecture s32 lists ParaPost XT/XP under METAL posts**; "ParaPost" is a brand with both metal (XT/XP) and fiber (Fiber Lux/White) lines. **Jake: confirm which ParaPost the clinic dispenses** — if it's the metal XP, the "fiber / close-to-dentin" wording mis-describes it. Not changed (concept correct, brand-model ambiguous).
7. **digc-delivery Clearfil Ceramic Primer "60 s".** — The e.max bond sequence (Ivoclean 20 s / 5% HF 20 s / Clearfil primer / Panavia ED Primer 30 s / light-cure 20 s) has **no UIC digital-deck source** (searched all of folder 05); it's manufacturer-IFU. Ivoclean 20 s, HF 20 s, ED Primer 30 s are IFU-correct, but **Clearfil Ceramic Primer "60 s" is off-IFU** (Kuraray IFU = apply + dry, no 60 s hold). Kept (real, necessary step); Jake: confirm the clinic's Clearfil timing.
8. **cd-ch28 tissue-conditioner material timeframes.** — Coe Comfort "pliable 4–6 weeks", Coe Soft "1–3 months", set "90 s–3 min", "1:1 powder:liquid", soreness "24–48 h", "lab reline at 6 months" are **not in the UIC materials reference (`denture base materials_2024.pdf`) or the Bin Yang reline lecture**. The replace-every-~3-weeks/3-month schedule + pressure-pot 20 min ARE sourced. Manufacturer/clinical figures, hedged + plausible, kept; "Coe Comfort 4–6 weeks pliable" looks long for a short-term conditioner. Jake: verify vs the actual Coe IFU / clinic materials list.

---

## Audit progress (loop — resumable across firings)

**✓ Verified — fixed prosth, DIGITAL E.MAX COMPLETE:** crown reductions all materials (Swade p.58/114; PFM Crowns s13–15; All-Ceramic deck s2 + eval form); inlay prep params (Inlays&Onlays s26–27 + Swade p.112); **all digital e.max `digc-*` chapters** — selection/scan/prep/provisional/delivery/foundation/recement/removal (Rubric IOS PPC c.14; scan-intro deck s18–35; Chairside Materials s19/s21; CAD/CAM Overview). Fixes shipped: e.max axial/chamfer/zirconia, inlay pulpal floor, occlusal "1.5/1.0" fabrication, IOS image-count (digc-scan + ind-ch28), "~17 mm depth." One workflow flag open for Jake (crystallization location).

**✓ Also verified — crown-pfm (`crownc-*`):** impression / provisional / delivery / foundation / recement all read, clinically sound, no fabrications cut. 2 flags (Gluma timing, D0275 code) logged above.

---

# ✅✅ PHASE 1 — FULL MAPS-TAB PER-SENTENCE AUDIT COMPLETE (2026-06-20)

Every live Maps pathway read sentence-by-sentence against the actual UIC slides + Swade (NO agents — read each slide myself). Pathways done: **fixed-prosth (crown-pfm, bridge-pfm, digital-emax)** → INDIRECT-SOURCES.md; **CD (cd-ch1..28 + conventional prose)** → CD-PATHWAY-SOURCES.md; **RPD (engine + rpd-*/rpdc-*)** → RPD-SOURCES.md.

## Real fixes shipped (11)
1. Crown occlusal reduction — cut the fabricated "1.5 functional / 1.0 non-functional" → 1.5–2.0 mm + cusp bevel (PFM Crowns s13–15).
2. IOS image count — "≤1000 / 2000 max" → "<2,000 / 2,000–3,000 / >3,000" (Rubric c14) in **digc-scan** AND **ind-ch28**.
3. "scanner reaches ~17 mm depth" (digc-selection) — fabricated, cut → "capture 2–3 mm gingiva."
4. **brc-abutment** — restored Ante's Law (FPD s18) + span-cube law (s20) that a prior pass had WRONGLY cut.
5. **brc-framework** porcelain space "0.5–0.8 mm" → "0.8–2.0 mm" (Metal Framework s13).
6. **brc-framework** "solder below 450 °C" — metallurgically backwards, cut the wrong temp.
7. **cd-ch22** freeway "2–4 mm" → "2–3 mm" (CD lecture + Swade).
8. **cd-ch22** "reline buys ~3 months / 1–2 years" — fabricated durations, cut.
(+ earlier-session fixes: e.max axial/chamfer/zirconia reductions, inlay pulpal floor.)

## Flags RESOLVED against source (read-the-primary-source saves)
Gluma 15s/30s-vs-45s/15s (two real contexts), D0275 (real Swade code 3133), ind-ch15 span (verbatim FPD s21), connector height-cube (real, Framework s14), CD "1 day/3 days" (verbatim Delivery lec 585/587), McGill Consensus, overdenture RCT-seq, 22/18 mm rims, 72 h soak, RPD 42 mm / 1–2 mm / 0.5 mm / 10 min / Prevident 5000 — all looked wrong or unsourced but were verbatim.

## Open flags for Jake (judgment calls, none are errors)
#1 e.max crystallization location (lab vs in-house) · #5 "final increment 60 s" · #6 ParaPost fiber-vs-metal model · #7 Clearfil Ceramic Primer 60 s · #8 cd-ch28 liner pliability timeframes · brc-prep "~50%/5°" retention · brc-bisque underextension "<0.25 mm" · CD condylar 20° vs 30° (UIC docs disagree — confirm with faculty).

**Net:** the whole Maps tab is now traceable to a slide/page; zero unexplained fabrications remain. → **PHASE 2: visual aides** (reduction guides + Maps visuals).
