# RPD source ledger — designer engine vs the RPD Treasure Trove

*Started 2026-06-11. Same regime as [CD-PATHWAY-SOURCES.md](CD-PATHWAY-SOURCES.md): citations live here, never user-facing. Sources extracted to /tmp/rpdtrove.*

## The trove (`~/Downloads/RPD Treasure Trove`)

Study guides: [1] Removable Pros + Sequencing + **Retainers** (Kim) · [2] Dx & TP + Base/Tissue/Final-Impression (Kim) · [3] Occlusion (Koslow) + Temporary RPD (Hofmeister) · [4] Pre-Prosthetic (Touloumi) + **Delivery** (Hofmeister) · [5] **Major & Minor Connectors** (Kim) + Reline/Rebase/Repair (Koslow). Lab instruction PDFs [1]–[10] (diagnostic impressions → setting teeth). Plus the **Swade RPD design guide** (the full option/rationale decision table) and the official **UIC Preliminary Design forms** (max + mand).

**File notes:** `RPD Manual.pdf` extracted to zero text — it's image-based/scanned (OCR available on request). `Unconfirmed 238129.crdownload` is an incomplete Chrome download — whatever it was, re-download it.

## Diff verdict: the engine already implements most of this

The designer (src/rpd-engine.js, 4.4k lines, 1025 tests incl. Design Case I/II answer keys and huddle keys) was built from an earlier UIC RPD source set and matches the trove almost everywhere. Confirmed engine≡trove on this pass: the 8 mm lingual-bar rule (4+4 mm), A-P strap as maxillary default, horseshoe only for gag/torus, palatal strap for short Class III, RPI contraindications verbatim (mesial rest impossible / soft-tissue undercut >1 mm at 4-5 mm / vestibule <5 mm → Combination fallback), Combination's 0.02" wrought-wire spec, embrasure for the no-edentulous-space quadrant, ring for tilted molars (molars only), I-bar indications + contras, indirect retainers perpendicular to the fulcrum midpoint with **mandibular incisors + maxillary laterals excluded** (Kim Retainers verbatim — already coded), the mid-arch-clasp-replaces-indirect-retainer rule (the engine's canine dual-role skip), guide planes at the interproximal-lingual line angle on anteriors, Co-Cr default with gold-for-allergy, lattice-vs-mesh, facings/tube teeth, Kelly combination-syndrome mechanism + consequences (Koslow's five match the engine's five).

## Changes made this pass (commit refs in git)

1. **Tooth-supported abutment with fair/poor perio → Combination (wrought wire), Akers demoted to alternative.** Swade design guide: combination is the "clasp of choice for tooth-supported areas with periodontally compromised teeth" (0.02" undercut); Akers row: "if the tooth is periodontally compromised, use a wrought wire clasp instead… less stress on tooth." Kim Retainers: wrought wire flexes in all planes vs cast half-round's one. Implemented in `pickClaspMechanic`'s TS path, ahead of the Akers default; hopeless teeth remain excluded upstream. *Locked by 2 new tests.*
2. **Periodontally involved mandibular anteriors (fair/poor, #22-27) → Lingual Plate over Lingual Bar.** The Swade guide's two non-space bar-contraindications: "teeth are periodontally involved" and "existing teeth will later need to be replaced by (added to) the existing RPD" — fair/poor anteriors trigger both (splinting now, easy addition later). Scoped to anteriors so the validated #21-poor Class I case keeps its Lingual Bar (the compromised-posterior response belongs to the clasp, not the connector). *Locked by 2 new tests.*
3. **Reverse Akers rationale now carries the Kim guide's "do not use at UIC" flag** + the lab-Rx phrasing ("Akers clasp engaging the DL/DB undercut" — same physical clasp). The engine's Huddle-6-Q10 tilted-molar carve-out stands (answer-key authority); the naming guidance reconciles the two docs.
4. **Class II mid-arch alternative text** now presents the Swade guide's option set: Combination engaging 0.02" MB as the choice, cast at 0.01" when retention is adequate + DE span short + abutment healthy + masticatory force low — alongside the engine's embrasure-pair (which is itself [Kim]-sourced for the no-space quadrant). Both designs surfaced; no behavioral change.
5. **Reciprocation rationale enriched** with Kim's functional definition: rigid, tapers in thickness only, middle/cervical third, and contacts the tooth BEFORE the retentive tip passes the height of contour.

Three snapshots updated — diffs verified to be exactly the intended rationale text (no clasp/connector type changed anywhere; answer-key outputs intact). Suite: 1344 total (1025 engine).

## Deliberately NOT changed

- **Maxillary Full-Palate threshold:** the guide's "prosthetic teeth > remaining teeth" trigger vs the engine's answer-key-derived Class-I-with-≤4-abutments rule — they agree on Design Case II; the engine's version is the validated one. No churn.
- ~~"Clinical remount at 1 year / 3-month recall"~~ **RESOLVED the same day:** Jake supplied `ALL RPD FILES`, including the paginated `Fall RPD 22 Delivery RPD.pdf` and the `Combination Syndrome` lecture. Neither contains the 1-year or 3-month figures — the lecture's prevention list reads "Clinical remount of the dentures • Periodic recall and intra-oral examination" (deliberately unnumbered), and the Delivery doc covers remount-jig mechanics only. **✂ Both engine blocks softened to the lecture's actual phrasing.** (The Cases cross-cd-rpd cut stands.)
- **rpd-chN guide chapters + rpd-conventional Maps pathway:** the trove's 9 study guides + 10 lab PDFs could feed CD-style per-sentence chapter ledgers — a separate session-sized job, available on request. Tonight's pass deliberately stayed on the designer per "don't force anything."

---

# rpd-conventional Maps pathway — per-sentence ledger *(2026-06-11)*

**Corpora:** /tmp/rpdfiles (= `ALL RPD FILES`: the Fall 2022/2023/2025 lecture set, Design Cases, huddle keys) + /tmp/rpdtrove (the numbered study guides + lab instructions) + Swade RPD STEPS (Sw 3236-3310). Cite forms: **Kim-Tray** = RPD Fall 2022 Fabrication of custom tray, framework try-in · **FinalImp22** = RPD Fall 2022 Final Impressions · **SetTeeth22** = RPD Fall 2022 Setting denture teeth · **Lab3-25** = Fall 2025 Lab 3 GP & Rest Seats · **Lab4-23** = Fall 2023 Lab 4 Intro to RPD Design · **Seq** = Lecture 4-Part A Sequencing / Treatment Sequence 2022 · **[N]** = RPD trove docs · **Sw** = Swade.

### description
- "surveyed design right before you touch an abutment (V3); framework try-in (V5) is the point of no return — a casting that will not seat passively is remade, not adjusted" — Sw RPD steps order (design faculty-approved pre-prep) + Kim-Tray framework-try-in slides ("Is the framework rocking?… Do not force the framework in") + the engine's validated passivity rule. ✅
- "nine clinical visits with six lab blocks" — maps exactly onto Sw 3236-3310's no-survey-crown path (perio COE + restorative COE + TP appointment, then RPD appointments #4-#10 = prep, final impression, framework try-in, wax try-in, delivery, 24-hr, 1-week; lab steps 1-7 with the diagnostic mount folded in). ✅ Structural phrasing ⓘ.

### keyDecisions
- Single-step (Kennedy III) vs **altered-cast** (I/II) — **FinalImp22 verbatim** ("Functional (Altered cast)"; "Altered cast (two-stage) impression"; single-step described as fewer steps). ✅
- Survey crown vs enameloplasty — Sw RPD steps (survey-crown sub-flow, appointments #1-#3) + Lab4-23 design form. ✅
- Design before prep, in sequence (guide planes → axial → undercuts → rest seats) — Sw clinical appointment #4 + lab step #3 ("practice abutment teeth preparations… guide planes, HOC modification, undercut modification, rest seats" — that order) + Lab3-25 (GP + rest seats prepped per design). ✅
- Mounting method (facebow maxillary; hand-articulation vs wax-rim bite reg) — **Sw lab step #1 verbatim** ("mount maxillary cast using facebow & mount mandibular cast via hand articulation; if you cannot hand articulate, fabricate wax rims"). ✅
- Framework passivity non-negotiable — Kim-Tray try-in slides + Final RPD Huddle keys. ✅
- D5213/D5214 + survey crowns billed separately — Sw codes + ADA. ✅

### Phase details (V1-V9)
- **V1** comp-exam content + alginates + facebow at this visit — Sw perio-COE appointment ("take diagnostic impressions & facebow at perio COE") + Lecture 2 Sabbagh D&TP (history, radiographs, abutment perio status, existing prosthesis). ✅
- **V2** bite reg on rims if not hand-articulable + survey/design between visits + faculty approval + "complete all Phase 1/Phase 2 treatment first" — **Sw verbatim** (restorative-COE + TP appointment + the em-dashed phase line). ✅
- **V3** prep order + alginate → **Snap stone** → verify on surveyor — **Sw clinical appointment #4 verbatim** ("take alginate impressions → pour in Snap stone → ensure proper preparations with surveyor"). ✅
- **V4** single-step vs altered-cast — FinalImp22 (above). ✅
- **V5** framework try-in: every rest seats, no rock, remade-not-adjusted; altered-cast now if needed; mould + shade; wax rims on framework + bite — **Sw clinical appointment #6 verbatim** + Kim-Tray try-in protocol (disclosing wax thin layer on metal-tooth contacts, adjust binding with high-speed coarse diamond, broad even contacts, repeat until seated). ✅
- **V6** wax try-in last-change point — Sw appointment #7 + SetTeeth22. ✅
- **V7** delivery (PIP intaglio + framework fit, occlusion to even bilateral contact, clasp seat/retention, POI) — Fall RPD 22 Delivery (the engine's sourced delivery block: PIP one-direction + Mizzy-on-the-PIP, disclosing wax for metal-tooth, AccuFilm/Surgident, clasp pliers) + trove [4] Hofmeister. ✅
- **V8/V9** follow-ups — Sw appointments #9/#10 + [4] (clinical remount best for Class I/II occlusal adjustment when needed). ✅

### Lab steps
- **Lab 1 (pour + mount):** microstone pour ✅ Sw; mounting split ✅ Sw lab step #1; **✂ FIXED** condylar "25–30°" → **25°** (**[3] RPD facebow lab verbatim**: "Denar Articulator Settings — Condylar Inclination: 25, Incisal Pin at Zero"); Bennett 15° kept as the Mark 320's fixed value (Whip Mix manual). Record-base build (Vaseline, Triad sheet, buffalo knife, sulcus coverage; rims on sticky wax) — Kim-Tray + Sw wax-rim flow. **✂ FIXED:** the "intaglio 20 sec" cure figure (unverifiable anywhere) → "brief final cure, don't over-cure the intaglio."
- **Lab 2 (survey + design):** analyzing rod, HOC + 0.01/0.02/0.03 gauges, black HOC / red undercut marks, tripod, design form fields, survey-crown identification, duplicate-and-practice, faculty approval — Sw lab steps #2-#3 verbatim + Lab4-23 + the UIC Preliminary Design form (trove) field-for-field. ⓘ The "path of insertion roughly perpendicular (within ~10°), rod contacting occlusal ½–⅔" specifics: Lab4-23 extracts image-only — **⏸ FLAG-keep** (validated previously against Design Case I/II answer keys).
- **Lab 3 (verify preps + custom tray):** Snap-stone verification ✅ Sw; **two sheets over teeth/tooth-supported areas + one sheet over DE areas ("avoid primary stress-bearing areas") + expose tripod stops + borders 2 mm short + finger stops/handle — Kim-Tray verbatim**; **✂ FIXED** cure cycle to Kim-Tray's actual formula (1 min → rest a few minutes → 1 min → intaglio 1 min, wax must not melt; was "~2 min + ~1 min"); cut excess wax to expose border-molding space ✅ verbatim. ✅
- **Lab 4 (box/pour + framework Rx):** **Coe-Cal or Microstone + 24-48 h warm-water soak + trim preserving vestibule — Kim-Tray/FinalImp22 verbatim**; master cast (tripod, red undercut points, HOC) vs design cast (full design; **"metal components in BLUE except tissue stop in RED; wrought wire and acrylic base extensions in RED"** — Kim-Tray verbatim, the Lab-4 color convention); framework Rx fields — Sw lab-script example (Vitallium, connectors, rests, guide planes, clasp gauge + undercut). ✅
- **Lab 5 (set teeth):** count ≠ number missing + stop anterior to the ascending ramus + **central grooves over the crest to the retromolar-pad landing area** + BBA against an opposing CD + #7 spatula technique + festoon slightly exaggerated — **SetTeeth22 verbatim cluster** ("Aligning central groove of the denture teeth with the crest of the residual alveolar ridge"; "retromolar pad landing area"; "ramus"; "This patient had an opposing complete denture, so we strive for bilateral balanced articulation"). ✅
- **Lab 6 (process):** compression-molding processing + boil-out + lab remount + finish/polish around the framework — Sw lab step #7 + the RPD processing convention (the CD-side Ivocap conflict doesn't arise here). ✅

### Engine note (same pass)
- **✂** The engine's two "clinical remount at 1 year / 3-month perio recall" combination-syndrome lines softened to the lecture's actual phrasing — **Fall RPD 22 Combination Syndrome verbatim**: "Prevention: • Clinical remount of the dentures • Periodic recall and intra-oral examination" (deliberately unnumbered). This closes the open question from the trove pass — the paginated Delivery doc has the remount-jig mechanics but no annual schedule either.
