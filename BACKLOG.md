# Cases tab vetting + gap-filling backlog

Two missions:
1. **Vet** existing Cases tab content for accuracy against Swade + lecture PDFs
2. **Fill gaps** — find Swade subjects the Cases tab doesn't cover at all, and create new chapters/pathways for them (user suspects Swade is broader than current coverage)

Loop reads this file each iteration. Check off groups as you finish. Add notes inline (e.g., "[skipped — unverified]", "[partial — re-vet next pass]", "[gap noted, not filled — needs user input]").

---

## Phase 1 — Prerequisite (do FIRST)

- [x] **Inventory + source-map.** Created `VETTING-SOURCE-MAP.md` in iteration 1 (commit c233855). Three tables built; ~25 substantive gap topics identified across 3 tiers.

**Original task description retained for reference:**
- [ ] ~~Inventory + source-map.~~ Create `VETTING-SOURCE-MAP.md` with three tables:
    1. **Chapter → Swade source**: every chapter id (96 total: 17 direct, 30 indirect, 28 CD, 21 RPD) mapped to the Swade page range that covers it (or "no direct Swade match" if UIC-lecture-only).
    2. **Swade topic → Chapter**: scan Swade page-by-page; for each distinct topic Swade covers, either name the chapter that covers it OR mark `[GAP]`. **This is the gap-finding inventory.**
    3. **Dentistry Files lecture → Chapter**: same for the lecture PDFs in the 5 subdirectories under `/Users/jakeshea/Documents/Dentistry Files/`.
    
    This file unlocks every subsequent iteration. Loop should not start vetting or gap-filling until this exists.

## Phase 1.5 — Gap analysis + filling (new priority)

Once VETTING-SOURCE-MAP.md is built, work through every `[GAP]` entry:

- [ ] **Catalog the gaps.** Add a `## Gaps to consider` section to VETTING-SOURCE-MAP.md listing every Swade topic that has no chapter coverage. Categorize as: substantive (≥1 page of Swade content) / drive-by (mentioned but not detailed).
- [ ] **Fill substantive gaps.** For each substantive gap, create a new chapter following the existing schema. Add to the appropriate guide (direct/indirect/cd/rpd) using the next available chapter number. Cite Swade pages in the chapter content.
- [ ] **Add pathway pills** for gaps that students would reach for via the Cases tab. Pathway goes in the existing domain — do NOT invent new domains.
- [ ] **Areas to scan for gaps** (likely candidates based on user's hint that Swade is broader):
    - Endodontic procedures (RCT step-by-step, retreatment, apicoectomy, pulp cap protocols)
    - Oral surgery (simple + surgical extractions, alveoloplasty, suturing technique)
    - Periodontal procedures (SRP, perio maintenance, gingivectomy, biologic width)
    - Diagnostic + treatment planning workflow (COE, treatment plan sequencing)
    - Pediatric considerations (if Swade covers — verify before creating)
    - Emergency dentistry (avulsion, fracture, pulpitis triage)
    - Local anesthesia technique (block + infiltration patterns)
    - Radiography protocols (FMX, panoramic, CBCT indications)
    - Infection control / clinic protocols
    - Pre-operative medical management (premedication, bleeding-risk patients)

## Phase 2 — First-pass vetting (clinical claims)

### Indirect Restorations

- [ ] **ind-ch1** Conventional crown workflow (4 appointments) — Swade pp. 66-72
- [ ] **ind-ch2** Digital CAD/CAM workflow — Swade pp. 106-117 (partially vetted pass 1-2; re-confirm)
- [ ] **ind-ch3** Metal framework try-in — finishing burs (alox only, no diamond)
- [ ] **ind-ch4** Cementation comprehensive — Ivoclean → HF → Clearfil → Panavia sequence
- [ ] **ind-ch5** PFM material — alloy options, finishing protocol (partially vetted pass 2)
- [ ] **ind-ch6** Lithium disilicate (e.max) — strength jump, crystallization, cement (partially vetted pass 2)
- [ ] **ind-ch7** Zirconia 3Y/4Y/5Y + layered — air-abrasion, MDP primer (partially vetted pass 2)
- [ ] **ind-ch8** Cast gold — reduction specs, cement (partially vetted pass 2)
- [ ] **ind-ch9** Feldspathic porcelain — HF 10% × 60s, refractory dies vs pressed (partially vetted pass 3)
- [ ] **ind-ch10** Hybrid ceramic / resin-ceramic — PICN vs RNC distinction (verified pass 3)
- [ ] **ind-ch11** Survey crowns for RPD abutments — PFM mandatory, 2.5-3.0 mm occlusal reduction
- [ ] **ind-ch12** ¾ crown — partial coverage, conservative
- [ ] **ind-ch13** Inlay (intracoronal) — pulpal floor 1.5-2.0 mm, isthmus
- [ ] **ind-ch14** Onlay (cuspal coverage) — when cuspal coverage is indicated
- [ ] **ind-ch15** FPDs (bridges) — pontic design, connector dimensions
- [ ] **ind-ch16** Restoring endo-treated teeth — post indication, ferrule
- [ ] **ind-ch17** Dental stones — type IV (Silky Rock), Snap Stone
- [ ] **ind-ch18** Mounting on Mark 320 / Whip Mix 8500
- [ ] **ind-ch19** Die trimming — workflow
- [ ] **ind-ch20** Diagnostic wax-up + lost-wax casting
- [ ] **ind-ch21** Porcelain application, characterization, bisque bake
- [ ] **ind-ch22** Shade taking — pre-isolation, polarizing filter
- [ ] **ind-ch23** Common pitfalls + faculty checkpoints
- [ ] **ind-ch24** [check what's in this slot]
- [ ] **ind-ch25** Post-cementation occlusal adjustment + follow-up
- [ ] **ind-ch26** Implant prosthetics fundamentals — torque values, brands (vetted pass 2)
- [ ] **ind-ch27** Implant impression copings — closed-tray PVS workflow (vetted pass 2)
- [ ] **ind-ch28** Intraoral scanner workflow + troubleshooting
- [ ] **ind-ch29** Intraoral repair protocols — PFM chip + zirconia chip (vetted pass 2)
- [ ] **ind-ch30** Maryland / resin-bonded bridge (RBFPD)

### Complete Dentures

- [ ] **cd-ch1** Diagnostic impression — alginate, stock tray sizing
- [ ] **cd-ch2** Custom tray fabrication — VLC + baseplate wax spacer
- [ ] **cd-ch3** Border molding — green-stick, sequence (vetted pass 2: temperature 122-124°F)
- [ ] **cd-ch4** Final PVS impression — single-step selective-pressure technique
- [ ] **cd-ch5** Boxing & pouring — wax wall, Silky Rock
- [ ] **cd-ch6** Face-bow (edentulous) — Denar facebow, 43 mm anterior reference (vetted pass 2)
- [ ] **cd-ch7** Mounting on Mark 320 — Snap Stone, mounting plates
- [ ] **cd-ch8** [check what's in this slot]
- [ ] **cd-ch9** [check what's in this slot]
- [ ] **cd-ch10** [check what's in this slot]
- [ ] **cd-ch11** Tooth setup order + position — Trubyte Classic, F30 10°, central groove on ridge crest
- [ ] **cd-ch12** [check what's in this slot]
- [ ] **cd-ch13** Wax try-in — 9 steps, VDO checks, phonetics
- [ ] **cd-ch14** Processing + lab remount — SR Ivocap, compression molding
- [ ] **cd-ch15** Delivery — clinical remount, BULL rule
- [ ] **cd-ch16** [check what's in this slot]
- [ ] **cd-ch17** [check what's in this slot]
- [ ] **cd-ch18** Phonetics — S/F/V/TH testing
- [ ] **cd-ch19** Types (immediate / interim / IID / conventional)
- [ ] **cd-ch20** Reline / rebase / repair
- [ ] **cd-ch21** [check what's in this slot]
- [ ] **cd-ch22** Loose denture differential
- [ ] **cd-ch23** [check what's in this slot]
- [ ] **cd-ch24** Edge-case patient management (gag, xerostomia, anxiety, dexterity, bisphosphonates, TMD)
- [ ] **cd-ch25** [check what's in this slot]
- [ ] **cd-ch26** Clinical remount + selective grinding at delivery (vetted pass 2: BULL rule)
- [ ] **cd-ch27** Attachment systems for overdentures — Locator, ball, magnetic (vetted pass 2: typo fixed)
- [ ] **cd-ch28** Chairside denture liners — Coe Comfort, Coe Soft, GC Reline (vetted pass 2)

### Removable Partial Dentures

- [ ] **rpd-ch1** [check what's in this slot]
- [ ] **rpd-ch2** Mount diagnostic casts (Denar 320)
- [ ] **rpd-ch3** How to survey a cast — 0.01"/0.02" undercut gauges (vetted pass 1)
- [ ] **rpd-ch4** Custom tray fabrication — VLC + baseplate wax spacer
- [ ] **rpd-ch5** [check what's in this slot]
- [ ] **rpd-ch6** [check what's in this slot]
- [ ] **rpd-ch7** Preliminary Partial Denture Design Form (Lab 4) — 7 elements
- [ ] **rpd-ch8** Survey crown prep specifics — PFM mandatory, 2.5-3.0 mm occlusal reduction at rest seat
- [ ] **rpd-ch9** How to write the lab Rx
- [ ] **rpd-ch10** PIP + Mizzy technique — pressure-indicating paste
- [ ] **rpd-ch11** Pressure point map (maxilla + mandible)
- [ ] **rpd-ch12** Occlusal adjustment sequence at delivery
- [ ] **rpd-ch13** POI script for RPD delivery
- [ ] **rpd-ch14** 7 esthetic parameters in depth (vetted pass 1: lips-at-rest table)
- [ ] **rpd-ch15** [check what's in this slot]
- [ ] **rpd-ch16** Common pitfalls / pre-appointment checklist
- [ ] **rpd-ch17** [check what's in this slot]
- [ ] **rpd-ch18** Repair procedures (chairside + lab) — 5 scenarios (vetted pass 2: soldering caveat)
- [ ] **rpd-ch19** [check what's in this slot]
- [ ] **rpd-ch20** Framework try-in (appointment 5) — PIP scope corrected pass 3
- [ ] **rpd-ch21** Wax try-in (appointment 6) — Triad LC

### Direct Restorations

- [ ] **dir-ch1** Universal workflow — 8-step sequence (vetted pass 1, curing-light reset pass 4)
- [ ] **dir-ch2** Rubber dam isolation
- [ ] **dir-ch3** Caries removal — selective excavation, indicator dye
- [ ] **dir-ch4** Etch & bond — selective/total/self-etch (vetted pass 1)
- [ ] **dir-ch5** Composite placement — incremental vs bulk-fill
- [ ] **dir-ch6** Light cure protocol (rewritten pass 4 — radiometer-free version)
- [ ] **dir-ch7** Finishing & polishing
- [ ] **dir-ch10** Class I — pit and fissure (anterior + posterior; description updated pass 4)
- [ ] **dir-ch11** Class II — proximal contact, sectional matrix (vetted pass 1)
- [ ] **dir-ch12** Class III — Mylar strip, lingual access
- [ ] **dir-ch13** Class IV — incisal corner build-up
- [ ] **dir-ch14** Class V — composite vs RMGI (vetted pass 1: 15s conditioner; pass 2 confirmed)
- [ ] **dir-ch15** Direct composite veneer
- [ ] **dir-ch20** Sedative restoration (D2940)
- [ ] **dir-ch21** Core buildup (D2950)
- [ ] **dir-ch30** Composite material reference
- [ ] **dir-ch31** Common pitfalls (post-op sensitivity, marginal staining, open contacts)

## Phase 3 — Pathway-level checks (App.jsx PATHWAYS)

- [ ] **Direct pathways** — 9 pills, descriptions + keyDecisions
- [ ] **Indirect pathways** — verify the partially-vetted ones
- [ ] **RPD pathways** — confirm rpd-broken-denture-tooth + rpd-broken-framework descriptions match rpd-ch18 content
- [ ] **CD pathways** — 8+ pathways, descriptions accurate to cd-ch1-28
- [ ] **Cross-disciplinary pathways** — combination syndrome, full-mouth-rehab, anterior-implant-esthetic (partial pass 3), IOD (pass 3), pre-radiation (pass 3)
- [ ] **Repair pathways** — RPD repair pills (3 added), CD repair, indirect repair (zirconia chip added)

## Phase 4 — Cross-chapter consistency

- [ ] **Cement protocols** — verify same protocol stated identically across chapters that reference it
- [ ] **Brand names** — Renamel, Ketac Nano, Bisco, RelyX, Panavia, Ivoclean, Clearfil, ED Primer II, ParaPost, Silky Rock, Coe Comfort, Coe Soft, GC Reline appear consistently
- [ ] **Torque values** — Astra 25 Ncm, Straumann 35 Ncm consistent across ind-ch26 + cross-anterior-implant-esthetic + cross-cd-iod-implants
- [ ] **HF etch times** — 10% × 60s feldspathic, 5% × 20s e.max consistent
- [ ] **Articulator names** — "Denar 320" vs "Mark 320" — pick one and use consistently in user-facing prose
- [ ] **Bite registration** — Regisil PB / Regisil PVS / "Regisil" — pick one canonical form

## Phase 5 — Stretch (only if time remains)

- [ ] Audit `src/rpd-engine.js` `message:` fields for clinical accuracy (user-facing strings only)
- [ ] Verify pathway phase counts equal the number of sections in each pathway
- [ ] Identify any chapters still rendering as stubs that should have content

---

## Stop conditions met (set when done)

- [ ] All Phase 1-2 items checked off, OR
- [ ] Last 3 iterations made zero actionable changes, OR
- [ ] User explicitly stopped the loop
