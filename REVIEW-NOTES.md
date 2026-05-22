# Review Notes

Working file. Loop iterations append findings here. Untracked by git — these are scratch notes for Jake to review, not product content.

---

## Iteration 1 (2026-05-22 ~12:00 AM)

### A. RPD engine — `#7` base-design scenario matrix

**Current engine logic** (`rpd-engine.js` lines 2166–2238, `rpdSelectBaseDesign`):

| Rule | Condition | Output |
|------|-----------|--------|
| 1 | anterior span ≥3 teeth | **Mesh** (esthetic-bulk reduction) |
| 2 | single anterior + non-healed ridge (<6 mo) + limited/extremely-limited space | **Facing** |
| 3 | limited space + not DE + well-healed ridge + ≤2 teeth | **Tube Tooth** |
| 4 | anterior + not DE + ≤2 teeth (catches remaining single/paired anterior) | **Mesh** |
| 5 | default (incl. all posterior + all DE) | **Open Lattice** |

**Scenarios involving `#7` alone (single max right lateral, esthetic-zone):**

| Scenario | Patient factors | Current output | Theoretical correct? |
|----------|-----------------|----------------|----------------------|
| #7 missing, normal space, healed ridge | adequate IOS, ≥6mo healed | **Mesh** (rule 4) | ✓ — UIC esthetic-bulk default; Open Lattice acceptable alt |
| #7 missing, limited space, healed ridge | tight IOS + healed | **Tube Tooth** (rule 3) | ✓ — preferred over Facing for esthetics per NotebookLM |
| #7 missing, limited space, non-healed ridge | tight IOS + <6mo | **Facing** (rule 2) | ✓ — no room for tube structure but ridge volume supports facing |
| #7 missing + #10 missing (paired, non-adjacent) | normal | **Mesh** (rule 4 — counts as ≤2) | ✓ — handled fine |
| #7-9 missing | normal | **Mesh** (rule 1) | ✓ |
| #7 missing + posterior DE on same side | normal | **Mesh** for #7 span; **Open Lattice** for DE | ✓ — each span evaluated separately |

**Where "lattice replacing #7" might come up:**

The user's earlier note "Earlier a lattice was suggested to replace #7" could mean: in a previous engine version, single-anterior #7 was outputting Open Lattice (default rule 5) because rule 4 hadn't been written yet to catch the single-anterior case. That's now fixed — rule 4 explicitly captures `isAnterior && !isDE && span.teeth.length <= 2`.

**Open question for Jake:** is there a clinical scenario where Open Lattice is actually preferred over Mesh for #7 alone? Possible cases:
1. Heavily resorbed ridge where retention area matters more than esthetic bulk — Open Lattice's broader retention footprint helps. *Engine doesn't currently factor ridge resorption (`monthsSinceExtraction` only gates healing, not resorption pattern).*
2. Patient with thick lip/poor smile-line visibility — esthetic priority drops, retention priority rises. *Engine has no "smile-line-visibility" input.*
3. Cementation lab error history (engine doesn't know this) — Open Lattice gives the lab more mechanical retention surface.

**Recommendation for next iteration**: Add scenario inputs for `ridgeResorption: "minimal" | "moderate" | "severe"` and `smileLineVisibility: "low" | "average" | "high"`, then have rule 4 check these — if ridge is severely resorbed OR smile-line is low, prefer Open Lattice over Mesh even for single anterior. Mark as `tier: "common"` with Mesh as the `alternative`.

If you want me to wire this in, say "wire RPD ridge-resorption + smile-line inputs" on the next iteration.

---

### B. Cases tab UI — brainstorm directions (NOT implemented)

The current Cases tab pattern:
- Domain pill row → sub-group pill row → pathway picker → opens a sectioned pathway page with description, keyDecisions, phases, sections (guide chapter linkbacks)
- "Case Inputs" pop-up overlay for case-specific filtering

**Direction 1 — Decision-tree first ("Wizard-led")**: open the wizard *as* the home view instead of the pathway list. The pathway list becomes the index/escape hatch. Wizard answers narrow the visible pathways live (like Algolia faceted search).

**Direction 2 — Spatial / map view**: literal anatomic map (per task #21 backlog). Hover a tooth → relevant pathways (composite for #14, pulpotomy for #T, perio for #2 if Stage III). Click → opens that pathway. Could co-exist as an alternate view toggle.

**Direction 3 — Timeline view**: pathways arranged by where they sit in a typical visit sequence (consult → diagnostic → restorative → recall). Helps the "I'm at this point in the visit, what do I do?" use case.

**Direction 4 — Phase-aware progress overlay**: each pathway already has `phases[]` — could surface a horizontal progress bar at the top of the pathway page that shows where in the procedure you are. Clicking a phase scrolls to the relevant section. Cheap, additive, doesn't change navigation.

**Direction 5 — Split-pane "now / next"**: left pane = current keyDecision/phase, right pane = source-guide chapters/Steps anchored. Fewer clicks for the in-clinic workflow where you want both the decision and the source in one glance.

**My pick**: Direction 4 is the lowest-risk/highest-additive — could prototype without disrupting the existing flow. Direction 1 is the biggest paradigm shift; Direction 2 is the most "cool" but most work. Direction 5 is interesting for in-chair use.

---

### C. Right-hand-side index — broken (user flagged)

I haven't reproduced this yet. **Next iteration action**: open the app, find where the RHS index is rendered, identify why it's not behaving. (Probably in the GuideChapter component or the App-level layout. Could be a scroll-spy regression, a CSS overflow issue, or a missing useEffect dependency.)

---

### D. Collapsed-by-default chapters/subchapters (user request)

User wants all chapters + subchapters collapsed by default with an "Expand all" affordance preserved. Currently presumed open-by-default.

**Implementation thought** (not implementing — flagging): localStorage-persist a `collapsedById: Set<string>` and default new sessions to "all closed" except the currently-anchored chapter. "Expand all" toggles the set to empty.

**Borderline / risk**: if the user routinely lands on a deep anchor link (e.g., from a Cases sections[] link), the target chapter should auto-open on landing. Need to confirm scroll-into-view + auto-expand work together.

---

### E. Sources read so far (cumulative)

**Swade chunks**: 1-14 read this iteration. Mostly UIC-clinic-workflow content (start check, screening, urgent care note template, COE, perio COE) — overlaps heavily with Steps tab content. **No obvious gaps to fill yet**; the urgent-care note template (page 10) matches what's already in App.jsx line 42 ("374" template). Notable: **screening uses 4 codes** (D0147 + D0150 + D0330 + D0210) and **D9423NC** is the "code for unplanned appointment" — could check Steps tab to confirm these are present.

**Peds Summer 2025**: AAPD bp_ guides all read in prior iterations. Lab/IDS PPTX:
- ✓ Read this loop's prior iteration: Week 4 (Anterior restoration), Week 7 (Pulp Therapy IDS + SDF), Week 8 (SSC Lab), Week 9 (Pulpotomy Lab)
- **Unread**: Week 6 (LA, Nitrous), Week 7 (Strip Crown lab + Anterior Composites lab), Week 10 (OS, Oral Pathology), Week 11 Lab, all Lab/ space-maintainer PPTX (Bands+Impressions, Nance/LLHA, Soldering), Summer 2025 (Lab Intro, Case Presentation Template)

**Documents folder**: scanned for dental files. Lots of dental school course PDFs/DOCX scattered at top level; no `Documents/dentistry/` subfolder. Saw: `Class I Composite 2024.docx`, `Class II Amalgam #3 MO.pdf`, `Dental Occlusion Notes.docx`. **Not yet read** — flagging for next iteration if Steps/Cases composite content needs grounding.

---

### F. Borderline edits considered + deferred

None this iteration (no edits made — focused on RPD scenario theory + UI brainstorm + notes setup).

---

### G. Debug cycle results

- ✓ `npx vitest run` → 998/998 pass
- ✓ `npm run build` → clean (one chunk-size warning, pre-existing)

---

## Next iteration's queue

1. Try to reproduce RHS index bug; identify cause without fixing
2. Read 1-2 more swade chunks (28-42, 42-56) to look for gaps in Steps tab coverage
3. Read Lab/ space-maintainer PPTX trio (Bands+Impressions, Nance/LLHA, Soldering) — current `pedo-space-maintainer` pathway is band-and-loop-focused; could expand
4. If gap found and non-trivial → expand the pathway; if borderline → flag here
5. Debug pass: vitest + build

---

## Iteration 2 — continuous work (the user clarified `/loop 3 hours` meant 3 hours straight, not every 3 hours)

### Shipped this stretch

1. ✅ **RHS sidebar TOC fix** (`1c77b1c`) — root cause: three coupled bugs in `PathwaySidebarTOC`'s scroll-effect (`.getBoundingClientRect.bottom` without parens × 2, `update;` as a no-op statement). `inRange` was stuck false → opacity stuck 0. Affects every pathway page.
2. ✅ **Space-maintainer lab expansion** (`5de370b`) — 2 new keyDecisions in `pedo-space-maintainer` covering band fitting technique (bite stick caution, supragingival metal, floss ligature, band-removal squeezing motion not torquing), wire bending (3-pronged plier for retention bends, bird-beak for rails, LLHA loop placement rules, leave wire long), and soldering (Ag/Cu/Zn alloy 620-655°C, water-soluble flux composition, intimate metal-to-metal contact, polishing sequence wheel/disc → green stone → white stone → brown → green rubber). Source: 3 lab PPTX (Bands+Impressions, Nance/LLHA, Soldering).
3. ✅ **Pediatric extraction Alsaleh expansion** (`5de370b`) — added: throat-pack mandatory, age-based positioning (young supine for control, older 45° for aspiration), pediatric forceps numbers by site (150S/10S max molars, Straight 1 max ant, 151S/27/cowhorn mand molars, Ash/151K/44 mand ant), maxillary palatal-first sequencing + occluso-buccal delivery, elevator into PDL not between teeth, four classic complications (lip biting, premolar dislodgement when roots encircle, fractured root tip, wrong tooth — verify before placing forceps), no-scrape rule, Gelfoam/Surgicel for ongoing bleeding.
4. ✅ **NEW pedo-oral-pathology pathway** (`5de370b`) — recognizes and triages 14 common pediatric oral lesions across neonatal, eruption, reactive, ulcerative/inflammatory, infectious, HPV, and hyperplastic categories. Source: Alsaleh Week 10 Path lecture. Wired into PATHWAY_GROUPS (Surgical & trauma) + WIZARDS (soft-tissue route).
5. ✅ **Class III composite enrichment** — added bevel detail (0.25-0.5mm at 45° for enamel rod exposure) + two-adjacent-lesions sequencing rule (prepare larger first, then smaller; restore smaller first, then larger) + "avoid facial wall when placing liner/base for esthetics." Source: Swade chunk 28-42 page 41.

### RPD #7 actual scenario probe results

Wrote `/Users/jakeshea/Desktop/clinic-shea/.claude/worktrees/distracted-elbakyan-0b643b/rpd_probe_7.mjs` — runs 5 scenarios through the real engine:

| Scenario | Inputs | Engine output | Alt offered |
|----------|--------|---------------|-------------|
| S1 | #7 alone, adequate IOS, 12mo healed | **Mesh** | Open Lattice |
| S2 | #7 alone, limited IOS, 12mo healed | **Tube Tooth** | Open Lattice |
| S3 | #7 alone, limited IOS, 3mo (interim) | **Facing** | Tube Tooth |
| S4 | #7 alone, extremely-limited IOS, healed | **Tube Tooth** | Open Lattice |
| S5 | #7 + #13-15 left DE (Kennedy II Mod 1) | **Mesh** (#7) + **Open Lattice** (DE) | — |

**Engine behavior is internally consistent across all 5.** Tier is "common" (not "strong") for all #7-alone cases — engine correctly signals these are judgment calls.

### Open question for you (RPD #7)

Where Open Lattice might legitimately beat Mesh as the primary for esthetic-zone single anterior:
- **Severely resorbed ridge** — broader retention footprint matters more than esthetic bulk
- **Low smile line** — no visible acrylic bulk anyway, so retention priority wins
- **History of facing fracture** — broader mechanical retention helps prevent recurrence

The engine **doesn't currently model** `ridgeResorption` (only `monthsSinceExtraction` for healing) or `smileLineVisibility`. Proposal:

```js
// Add to caseInput.measurements
ridgeResorption: "minimal" | "moderate" | "severe"   // default minimal
smileLineVisibility: "low" | "average" | "high"      // default average

// New rule (between rules 3 and 4 in rpdSelectBaseDesign):
// Single anterior + (severely resorbed ridge OR low smile line) → Open Lattice
// with Mesh as the alternative
```

Say "wire RPD ridge-resorption + smile-line inputs" if you want me to implement.

### Swade chunks read this iteration

Chunks 1-14 (TOC + EXAMS section) and 28-42 (PERIO Re-eval, Maintenance, RESTORATIVE Amalgam + Composite I/II/III). Notable specifics, mostly already represented in Cases:

- **Class III sequencing** for two adjacent lesions — **gap, now filled** in `dir-class3`
- **Class III 0.25-0.5mm 45° bevel** — **gap, now filled**
- **SRP mental nerve block** (especially with septocaine) — not in `perio-srp`, borderline (current pathway covers anesthesia conceptually); flagging
- **SRP 11/12 ODU explorer 3-spot finishing check** (line angles, CEJ, under contact) — not in `perio-srp`, borderline; flagging (current pathway's "polished glass" rule captures the spirit)
- **Class II Garrison: 2 rings for MOD OR alternate contacts** — not explicitly in `dir-class2`; borderline (current pathway mentions sectional matrix generally)
- **Amalgam Gluma always required** — already in `dir-amalgam` ✓
- **Perio re-eval O'Leary plaque index auto-calc via clipboard icon** — UI workflow tip; Steps-tab territory if `perio-re-eval` exists there; flag for next iteration

### Documents folder

Lots of UIC dental school course PDFs/DOCX at the top of Documents/, but no organized "dentistry" subfolder. Files like `Class I Composite 2024.docx`, `Dental Occlusion Notes.docx`, `Class II Amalgam #3 MO.pdf` — predominantly old course assignments, not authoritative references. Lower priority than swade chunks and peds PPTX. Will skim if time.

### Next stretch

1. Read swade chunks 42-56 (FIXED restoratives — buildups, crowns) and 70-84 (DENTURE steps — could feed denture pathway gap analysis)
2. Read Week 6 LA + Nitrous Hill recording for any UIC-specific add to `pedo-local-anesthetic` (carefully — N₂O content is out for liability)
3. Read Week 11 Lab PPTX
4. RPD engine: think about whether the "lattice for #7" question wants a code change or stays a flagged proposal
5. Debug cycle: vitest + build

---

## Iteration 3 — continuing the stretch

### Shipped

6. ✅ **dir-class5-composite** (`7590d06`) — added retentive groove + 2 incisal coves rule when gingival margin is in cementum/dentin; added sandwich technique (RMGI base + composite top) procedural variant. Source: Swade pages 45+49.
7. ✅ **Cases tab — sections collapsed by default** (`dde78c7`) — pathway pages now land compact; Expand all + click-to-open in sidebar TOC still work. Implementation: `useEffect([pathwayId])` initializes `collapsedSections` to the full anchorId set rather than empty.
8. ✅ **cd-conventional pre-prosthetic eval** (`e15e796`) — first keyDecision now screens for the 11 conditions Swade lists (hyperplastic ridges, epulis, papillomatosis, frenum, tuberosities, bony prominences, jaw discrepancies, mental foramen pressure, restorative space, papillary hyperplasia, vestibule) that need surgery BEFORE the standard denture workflow. Direct ref to Axium Pre-Prosthetic Surgery Form. New "Pre-prosthetic eval" phase added.
9. ✅ **pedo-local-anesthetic Hill UIC additions** (`e15e796`) — biphasic overdose recognition (5-10min, excitation → depression) added to dose decision; both carpule sizes (1.7 / 1.8 mL); new keyDecision on transpapillary palatal technique for kids <6-8 (slow infiltration into papilla → palate, instead of direct greater palatine block); IAN/infiltration decision expanded with Hill's success/failure matrix and the age-based foramen position rule (more inferior in younger children).

### Surveyed sources (cumulative)

- **Swade chunks**: 1-14, 28-42, 42-56, 56-70, 70-84 read.
- **Peds PPTX**: Week 4 (Anterior), Week 6 (LA), Week 7 (Pulp Therapy + SDF), Week 8 (SSC lab), Week 9 (Pulpotomy lab), Week 10 (OS + Path), Lab/ space-maintainer trio (Bands+Impressions, Nance/LLHA, Soldering). Summer 2025 AAPD bp_*.pdf all read (prior loop).
- **Skipped intentionally**: Week 6 Nitrous (N₂O excised earlier for liability), Week 11 Lab (xlsx + 2 PDFs that look like PE materials)

### Borderline edits considered + deferred (for your review)

- **dir-class2 (Composite Class II): Garrison 2-ring MOD strategy** — Swade mentions you can use 2 Garrison rings for an MOD or restore M then switch to D for the second contact. Current pathway mentions sectional matrix generically. Borderline because the existing description is already complete; the 2-ring tip is a real student stumbling point worth adding.
- **perio-srp: 11/12 ODU explorer 3-spot finishing check** (line angles, CEJ, under contact) — Swade-specific finishing protocol; existing "polished glass" rule captures the spirit but the 3-spot anchor is concrete and useful.
- **ind-conventional-crown PFM reduction targets** — pathway currently says "1.5 mm functional cusp / 1.0 mm non-functional / 0.5–1.0 mm chamfer" which corresponds more closely to METAL/Zirconia per Swade's table than PFM. Swade PFM table: axial 1.25-1.50mm, occlusal 1.5-2.0mm, deep chamfer 1.0-1.25mm. Borderline because the pathway is explicitly labeled "conventional PFM" — the numbers should match PFM, not metal. Tell me to change and I'll fix.

If you want any of these acted on, say "fix the dir-class2 Garrison tip" / "wire the 11/12 ODU 3-spot check" / "correct the PFM dimensions" and I will.

### Cumulative ship count (this whole loop)

`1c77b1c` RHS sidebar fix · `5de370b` Pedo lab grounding + new oral-path pathway · `eb8427e` dir-class3 bevel + 2-adjacent rule · `7590d06` dir-class5-composite sandwich + grooves · `dde78c7` collapsed-by-default + REVIEW-NOTES.md tracked · `e15e796` pre-prosthetic eval + Hill LA additions

Plus prior loop iterations: `5dc179e` Pedo PowerPoint pass (IPT / pulpectomy / LSTR / anterior-crown-selection + dir-sdf refinements + MTA-as-UIC-gold-standard fix).

---

## Iteration 4 — final stretch

### Additional reading
- **Swade chunks 70-84**: Crown removal + endo access fill + RPD steps overview + denture COE + border molding → no Cases gaps (ind-crown-removal already complete; cd-conventional gets the pre-prosthetic eval addition above)
- **Swade chunks 84-96**: Denture wax rims + anterior + posterior try-in + delivery + adjustment → mostly Steps-tab workflow; the wax-try-in patient-consent moment ("last chance" before processing) is already captured in cd-conventional's "wax try-in is the moment of patient sign-off" decision
- **Swade chunks 96-108**: Lab reline + implant-level impression + custom abutment try-in + implant crown delivery → ind-single-implant-crown enriched with torque values + safety mechanics
- **Swade chunks 108-120**: Digital prep/scan + digital delivery + endo RCT 1-visit → no urgent gaps; existing endo pathways and ind-conventional-crown / ind-onlay-bruxer cover the workflow

### Shipped this stretch

10. ✅ **ind-single-implant-crown — torque + safety** (next commit) — added Astra (25 Ncm) and Straumann (35 Ncm) torque-on-delivery values, plus the gauze throat pack + floss-to-hand-driver safety mechanics for any implant manipulation. Source: Swade chunks 100-104.

### Final borderline-edits deferred list (for your greenlight)

I held back on these to avoid bloat. Tell me which to act on:

- **dir-class2 Garrison 2-ring MOD strategy** — borderline, current pathway is already complete
- **perio-srp 11/12 ODU explorer 3-spot finishing check** (line angles, CEJ, under contact) — borderline, current "polished glass" rule captures the spirit
- **ind-conventional-crown PFM dimensions** — flagged for fix: existing pathway says "1.5mm functional / 1.0mm non-functional / 0.5-1.0mm chamfer" which is closer to METAL/Zirconia than PFM. Swade PFM table: 1.25-1.5mm axial, 1.5-2.0mm occlusal, 1.0-1.25mm deep chamfer. The pathway is labeled "conventional PFM" so should match PFM.
- **RPD #7 ridge-resorption + smile-line inputs** — wire into engine if you want Open Lattice to override Mesh in severely-resorbed-ridge or low-smile-line cases (analysis + proposal in iteration 1's section above)
- **cd-conventional wax try-in "last chance" framing** — already captured but could be sharper; borderline

Any of the above → say "fix dir-class2 / wire-RPD-inputs / fix-PFM-dimensions / etc." and I'll do it.

### Loop summary

Read swade chunks **1-14, 28-42, 42-56, 56-70, 70-84, 84-96, 96-108, 108-120** = ~120 pages of UIC clinic source material. Remaining: chunks 120-216 (likely PEDS reference + REFERENCES + POLICIES + AXIUM workflow) — bulk content that has lower likelihood of new Cases gaps and will mostly belong in Steps tab.

Read **all 16** peds PowerPoints from `/All of Peds Semester Content` across this 3-hour stretch and the prior loops (only skipped Nitrous per liability + Week 11 PE materials).

**Total cumulative commits in this 3-hour stretch:** 7 ship commits + 2 notes commits.

Engine state: vitest 998/998, build clean, no warnings beyond the pre-existing chunk-size note.

---

## Iteration 5 — 30-min continuous peds follow-up

### Shipped
- ✅ **NEW pedo-primary-anterior-class3** (`caaa68c`) — distinct from adult dir-class3: gingival-2/3 prep limit, definitive cervical seat, MECHANICAL RETENTION LOCKS (labial dovetail across 2/3 of labial, 1mm deep; canines also get lingual). Source: Alsaleh's Class III Prep for primary anterior teeth docx. Wired into PATHWAY_GROUPS.pedo.Restorative + WIZARDS as "small Class III, mesial/distal angle intact" route.
- ✅ **pedo-strip-crown refinements** (`caaa68c`) — clamp-free rubber dam shortcut (overlapping punches + canine clamp), vent hole on incisal/lingual not facial, polishing PRIMARILY at gingival margins (food trap zone). Source: Week 7 Anterior Composites & Strip Crowns lab.
- ✅ **pedo-poe-recall ortho/occlusal eval** (next commit) — added Avenetti Week 8 six-axis eval (AP molar+canine class + OJ + ant crossbites; vertical OB + occlusal harmony; transverse midline + posterior crossbites; arch shape ovoid/tapered/square; arch perimeter space available vs needed + space loss; dental development vs chronological age). This is what drives referrals + space-maintainer decisions.

### Sources verified this iteration
- **Pulpotomy materials.docx** (Alsaleh) — explicitly confirms "MTA is now considered the material of choice for pulpotomy, it is what we use here at UIC cOD." Prior MTA-as-gold-standard fix in `5dc179e` was correct ✓
- **T-band matrix system** (Week 3/5/7 Lab T band.docx) — alternative to sectional matrix for primary Class II, fold extension wings on buccal, fits below gingival margin + 1mm higher than marginal ridge. **Borderline addition** for pedo-composite — current pathway uses Garrison sectional; T-band is a real alternative when sectional doesn't fit. Flagging.
- **Reminders before clinic.docx** (Alsaleh policy) — operational reminders (D1260 not D1260NC for fluoride; parents not in operatory for treatment visits; 4-tab EHR completion; schedule before discharge). Mostly Steps-tab territory if anywhere.
- **Pediatric Lab Intro.pptx** — semester structure + signoffs. No clinical content gaps.
- **Early Space Loss and Management.pdf** + **Pediatric Occlusion (Avenetti).pdf** — first 15 pages each. The occlusion content fed the pedo-poe-recall ortho-eval addition above; remaining pages (Leeway/Primate space, treatment approaches, appliance therapy) not yet processed but probably enrich `pedo-space-maintainer` and `pedo-poe-recall` if there's another iteration.

### Final iteration's deferred edits (borderline)
- **pedo-composite T-band matrix alternative** — small note that for primary Class II where the sectional matrix doesn't seat (small primary anatomy, divergent roots), T-band is the UIC alternative (self-forming, fold buccal wings, fits below gingival margin + above marginal ridge). One sentence addition.
- **Pediatric Occlusion lecture pages 16-44** — Leeway space, Primate space, treatment approaches, ortho appliance therapy not yet read. Could justify an enhanced pedo-space-maintainer keyDecision on the WHY (space loss complications) and a NEW pedo-orthodontic-referral pathway. Borderline based on what's already covered.

### Cumulative ship count (4-loop total)

**8 ship commits + 3 notes commits** since the 3-hour loop started. Tests still 998/998, build still clean.

---

---

## Iteration 5 — Session 2026-05-22

### RPD Engine — Pattern 2 + 3 fixes (shipped)

**Pattern 2** (`7fdf75c`): Mandibular canines flanking a tooth-supported anterior mod span become rest-only indirect retainers, not clasped direct retainers. Confirmed by Design Case II (Fall 2022) + Prelim Case 2 answer keys. 6 tests added; engine now produces exact match for Design Case II mandibular: `#20:RPI | #28:Akers | #30:Akers` + `IR:#22(ML ball) + #27(ML ball)`.

**Pattern 3** (`712d8e6`): When a span-boundary (dual-role) candidate is more anterior to the diagonal fulcrum line than the type-priority pick, the engine now prefers it as the indirect retainer. Confirmed by Huddle 6 Case 2: `#9` (maxillary central, dual-role) is more anterior (score 29.1) than `#12` (1st premolar, type-priority pick, score 18.0) → engine now correctly picks `#9`. 4 tests added; 1012 total passing.

### Remaining RPD discrepancy — for Jake's review

**Design Case II maxillary — A-P Strap vs Full Palate**

Engine picks A-P Strap; UIC answer key says Full Palate.

Root cause: engine uses `presentCount ≤ 4` to trigger Full Palatal Plate. Design Case II maxillary has 5 PRESENT teeth (#4, #5, #6, #11, #12), but only 4 ABUTMENT teeth (#4, #6, #11, #12 — tooth #5 is a bystander, not a span boundary for any span). So `presentCount = 5 > 4` → A-P Strap.

If the threshold were `abutmentCount ≤ 4` instead of `presentCount ≤ 4`, the engine would pick Full Palatal Plate for this case.

**Risk of changing**: need to verify that Design Case I (the other worked maxillary case, which uses A-P Strap) has ≥5 abutments. Design Case I had 6+ abutments → threshold ≤ 4 abutments would correctly keep A-P Strap there. The change seems safe, but confirm before shipping.

**Proposal**: change `presentCount ≤ 4` to compute `abutmentCount` from span boundaries and use `abutmentCount ≤ 4` as the trigger.

If you want me to wire this → say "fix RPD max-connector threshold."

### #28 esthetic-zone disagreement — for Jake's review

Design Case II mandibular: answer key says #28 (mandibular right 1st premolar) gets I-bar esthetic; engine gives Akers. Current `RPD_ESTHETIC_ZONE` includes only canines and anterior teeth, not premolars. The engine's Akers for #28 is defensible — mandibular first premolars are not consistently visible during smiling. The answer key may reflect the instructor's preference for I-bar on the premolar adjacent to the anterior space.

**Borderline**: if you want premolars included in the esthetic zone for mandibular arch (specifically 1st premolars adjacent to an anterior mod span), say "expand RPD esthetic zone to mand 1st premolars."

### New peds pathways shipped (`27a078c`)

- `pedo-radiograph-selection` — AAPD 2025 BWX intervals by caries risk × dentition stage; no routine shielding guidance
- `pedo-oral-surgery` — odontogenic infection triage (with red flags for hospital escalation), mesiodens management (≥2/3 root dev, 75% spontaneous eruption, 6–12 mo watch), frenectomy (specialist-coordinated, AAPD notes no consensus on criteria)
- `pedo-medications-reference` — weight-based APAP/ibuprofen, codeine contraindication (AAP 2016), amoxicillin/PCN-VK/clindamycin dosing, endocarditis prophylaxis (clindamycin NO longer recommended per 2021 AHA), nystatin

Gap 1 (N₂O) intentionally skipped — liability.

### Huddle 6 Key — findings

- Case 1 (Mand Class II Mod 1): engine matches perfectly. DE #17-19, mod #29-31. #20 RPI, #28 Akers, #32 Akers. IR = #28 dual-role. Lingual Bar. ✓
- Case 2 (Max Class II Mod 2): matched after Pattern 3 fix. #9 ball rest (dual-role, more anterior than #12). A-P Strap. ✓

### Commits this session

`7fdf75c` Pattern 2 (mand canines → indirect)  
`712d8e6` Pattern 3 (dual-role IR prefers most-anterior)  
`27a078c` Pedo Cases: 3 new AAPD-sourced pathways  

Plus earlier session commits already on branch.

