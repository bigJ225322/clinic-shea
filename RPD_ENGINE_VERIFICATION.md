# RPD Engine Verification Against UIC Worked Cases

This document traces the engine's expected output against six worked RPD cases pulled from the official UIC course materials (Design Case I, Design Case II, Prelim Design Case 2, Huddle Week 6 Cases 1 & 2, plus Class II Mod 1 mandibular case from Design Case I). For each case it lists:
- **Inputs**: missing teeth and patient factors
- **UIC answer key**: every clinically-correct element
- **Engine prediction**: what the engine *should* produce per its code paths
- **Verdict**: confirmed, mismatch, or needs manual run

Run each case in the live tool and check that the engine's output column matches the answer-key column. If it does, the case is verified; if not, the divergence is annotated.

---

## Case 1 — Maxillary Class II Mod 3 (Design Case I)

### Inputs
- Arch: maxillary
- Present: #2, #4, #6, #9, #11, #12 (#1, #16 are 3rd molars, omitted by Rule 2 default)
- Missing: #3, #5, #7, #8, #10, #13, #14, #15 (all opt-in for replacement)
- Vestibular depth: adequate (>5mm) for #2, #4; **≤5mm at #12** (per case: "short vestibule")
- Frenum: **high at #12** (per case: "frenum")
- Undercut depth/location at #12: 0.02" MB

### Expected (UIC answer)
| Field | Value |
|---|---|
| Kennedy class | II (left distal extension; mods #3, #5, #7–8, #10) |
| Framework | Co-Cr |
| Major connector | A-P Strap, 8mm width, 6mm gingival clearance |
| #2 | Akers, mesial guide plane |
| #4 | Akers, distal guide plane, axial recontouring to lower DB HOC |
| #9 | **Rest only** (esthetic omission), distal **ball rest**, distal guide plane |
| #11 | **Rest only** (esthetic omission), **cingulum rest**, mesial guide plane |
| #12 | **Combination** (RPI contraindicated by vestibule + frenum), 0.02" MB undercut, distal guide plane, axial recontouring |
| Indirect retainer | #6 cingulum rest |
| Saddles | #3 lattice (mod, tooth-supported), #7-8 mesh (anterior mod), #10 facing (single anterior), #13-15 lattice with distal tissue stop (DE) |

### Engine prediction (from code trace)
- Kennedy classifier (`rpdClassifyKennedy`): left DE → Class II ✓
- Major connector (`rpdSelectMajorConnector` line 11025-11026): Class II maxillary → A-P Strap ✓
- #2, #4 abutment design (`rpdDesignAbutment`, `isDE=false`, `inEsthetic=false`): Akers ✓
- #9 abutment design (`isMaxAnterior=true`, span tooth-supported, tooth===9): **Rest Only, ball rest** ✓
- #11 abutment design (`isMaxAnterior=true`, span tooth-supported, `RPD_CANINES.has(11)=true`): **Rest Only, cingulum rest** ✓
- #12 abutment design (`isDE=true`, `vestibularLow=true` triggers contras list non-empty): **Combination** ✓
- Indirect retainer placement: `rpdPlaceIndirectRetainers` for Class II → opposite side of DE. #6 is canine on the right (opposite the left DE). Should be selected. ✓

### Verdict
**Should match.** Manual run needed to confirm:
1. The Kennedy classifier correctly identifies the left side as the distal-extension primary span (not picking #3 as the primary if its rank scoring is off)
2. The anterior modifications (#7-8 and #10) are correctly classified as separate spans with `span.type === "tooth-supported"`, so #9 and #11 get rest-only
3. Saddle type for #7-8 specifically (anterior, may render as Mesh instead of Open Lattice — both are acceptable per UIC for anterior gaps)

---

## Case 2 — Mandibular Class II Mod 1 (Design Case I, lower arch)

### Inputs
- Arch: mandibular
- Present: #21–29, #31 (#22, #23, #24, #25, #26, #27 all present; #28 present)
- Missing: #17 (3M, Rule 2), #18, #19, #20 (left DE); #30 (tooth-supported mod between #29 and #31)
- #32 (3M, Rule 2 default)
- Soft tissue undercut at #21: **>1mm** (per case: "tissue undercut")
- #31: lingually tilted, undercut location = **disto-lingual**

### Expected
| Field | Value |
|---|---|
| Kennedy class | II Mod 1 (left DE + right mod) |
| Major connector | Lingual bar (8mm sulcus space available) |
| Framework | Co-Cr |
| #21 | **Combination** (soft tissue undercut → RPI contraindicated), 0.02" MB undercut, distal guide plane |
| #28 | Indirect retainer (mesial rest) |
| #29 | Akers, buccal retentive arm, distal guide plane |
| #31 | **Reverse Akers** (DL undercut), retentive arm lingual, reciprocal buccal, distal guide plane (labeled "Akers" by UIC nomenclature) |

### Engine prediction
- Kennedy: left DE + right tooth-bounded → Class II Mod 1 ✓
- Major connector (`rpdSelectMajorConnector` line 11002-11009): mandibular, no tori, sulcus assumed ≥8mm → **Lingual Bar** ✓
- #21 (`isDE=true`, `attrs.softTissueUndercut === "gt-1mm"` triggers contra): **Combination** ✓
- #29 (`isDE=false`, posterior, not esthetic, default): **Akers** ✓
- #31 (`isDE=false`, `undercutLocation === "disto-lingual"` → line 11199): **Reverse Akers** with lingual retentive arm + buccal reciprocal ✓
- Indirect retainer: Class II mod 1, fulcrum line through #20 distal rest and #32 mesial rest. Indirect should sit perpendicular to fulcrum line at midpoint. #28 (lower first PM on right) is the expected placement per UIC. Engine: need to verify `rpdPlaceIndirectRetainers` picks #28.

### Verdict
**Likely matches with one nomenclature flag:** Engine outputs "Reverse Akers" for #31; UIC's lecture slide groups it under "Akers" with notation "retentive arm is lingually, DL 0.01 undercut." Same physical design, different label. **Consider renaming "Reverse Akers" to "Akers (DL undercut)" in the engine for label fidelity to UIC.**

---

## Case 3 — Maxillary "Few teeth remaining" (Design Case II / Prelim Case 2)

### Inputs
- Arch: maxillary
- Present: **only #4, #6, #11, #12**
- Missing: #1, #2, #3, #5, #7, #8, #9, #10, #13, #14, #15, #16

### Expected
| Field | Value |
|---|---|
| Kennedy class | I Mod (bilateral DE + anterior mod) — case actually shown without explicit Kennedy class, treated as low-abutment maxillary |
| Framework | Co-Cr |
| Major connector | **Full Palatal Plate** (only 4 abutments remain, rigidity required) |
| #4 | RPI (distal proximal plate, MO rest, I-bar 0.01" mid-B, palatal reciprocal plate) |
| #6 | Rest only (esthetic), cingulum rest, mesial guide plane |
| #11 | Rest only (esthetic), cingulum rest, mesial guide plane |
| #12 | RPI (axial re-contouring needed to create 0.01" MB undercut), distal proximal plate, MO rest, I-bar, palatal reciprocal plate |
| Indirect retainers | #6, #11 cingulum rests serve as indirect retention for the bilateral DE |
| Saddles | #3 lattice + tissue stop, #7-10 lattice or mesh (anterior), #13-14 lattice + tissue stop |

### Engine prediction
- Major connector (`rpdSelectMajorConnector` line 11017-11020): `presentCount=4 ≤ 6` → **Full Palatal Plate** ✓
- #4, #12 (isDE=true, no contras): **RPI** ✓
- #6, #11 (isMaxAnterior, tooth-supported anterior gap on at least one side): **Rest Only**, cingulum rest ✓
- Saddles: distal extension spans → Open Lattice with distal tissue stop ✓
- Anterior span #7-10: engine likely picks Mesh or Lattice (need to verify which the engine outputs for an anterior span)

### Verdict
**Should match.** Confirm in UI:
1. Major connector correctly selects Full Palatal Plate
2. Both #4 and #12 are designed RPI (assuming no per-tooth contraindications are flagged)
3. Anterior saddle type matches what UIC's instructor prefers (lattice or mesh both acceptable)

---

## Case 4 — Mandibular Class II Mod 2 (Prelim Design Case 2 / Design Case II lower)

### Inputs
- Arch: mandibular
- Present: #20, #21, #22, #27, #28, #30 (and others; key abutments listed)
- Missing: #18, #19 (left DE), #23–26 (anterior mod), #29 (posterior mod)
- Lingual sulcus depth: **<8mm** (per case: "insufficient space") or mandibular tori present

### Expected
| Field | Value |
|---|---|
| Kennedy class | II Mod 2 |
| Major connector | **Lingual Plate** (insufficient lingual space) |
| Framework | Co-Cr |
| #20 | RPI or Combination (borderline — case allows either) |
| #22 | Mesial-lingual ball rest (indirect retainer + anterior support) |
| #27 | Mesial-lingual ball rest (indirect retainer + anterior support) |
| #28 | Akers OR I-bar esthetic with lingual plating reciprocation |
| #30 | Akers |
| Saddles | #19 open lattice + tissue stop, #23-26 lattice or mesh, #29 lattice or tube-tooth |

### Engine prediction
- Major connector (`rpdSelectMajorConnector` lines 11002-11008): if `lingualSulcusDepth < 8` OR `mandibularTori`, return **Lingual Plate** ✓
- #20 (isDE=true): RPI if no contras, Combination if soft-tissue undercut. **Matches case** depending on input.
- #28: `RPD_ESTHETIC_ZONE` = {6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27}. **#28 is NOT in this set.** Engine: `inEsthetic=false` → Akers only (not I-bar esthetic).
  - **MISMATCH:** UIC allows I-bar esthetic on #28 for "esthetic reason"; engine doesn't recognize #28 as esthetic.
  - **Fix:** Add #28 (and #21, the contralateral mand 1st PM) to RPD_ESTHETIC_ZONE so the engine offers I-bar esthetic as an option when the patient prioritizes esthetics.
- #30 (isDE=false, posterior, default): Akers ✓
- #22, #27 indirect retainers: engine should add them via `rpdPlaceIndirectRetainers` for Class II Mod cases.

### Verdict
**One real mismatch identified.** The engine's `RPD_ESTHETIC_ZONE` is limited to teeth #6-11 (max anteriors) and #22-27 (mand anteriors). It excludes the premolars (#4, #5, #12, #13, #20, #21, #28, #29) which can be esthetically visible during smile in some patients. UIC's Case 4 explicitly allows esthetic I-bar on #28 — engine won't offer this.

**Action item:** Consider adding mandibular first premolars (#21, #28) and maxillary first premolars (#5, #12) to RPD_ESTHETIC_ZONE, gated on a patient factor flag (`prioritizeEsthetics: true`) so it doesn't fire by default.

---

## Case 5 — Mandibular Class II Mod 1 (Huddle Week 6 Case 1)

### Inputs
- Arch: mandibular
- Edentulous: #17–19 (left DE) + #29–31 (right mod, tooth-bounded by #28 and #32)
- Present: #20–28, #32 (#17 is 3M, Rule 2 default omit; #32 explicit abutment)
- Vestibular depth ≥5mm (per case requirement for RPI)
- Lingual sulcus ≥8mm (lingual bar indicated)

### Expected (Huddle answer key, explicit)
| Field | Answer |
|---|---|
| Kennedy class | II Mod 1 ✓ |
| Edentulous areas | #17–19 and #29–31 ✓ |
| Direct retainers | #20, #28, #32 ✓ |
| Guide planes | #20D, #28D, #32M ✓ |
| Major connector | Lingual bar |
| Indirect retainer | Yes — perpendicular to fulcrum line #20–#32. Indirect retainer can be part of #28's mesial rest. |
| #20 | RPI or Combination |
| #28 | Akers |
| #32 | Akers (or Reverse Akers / Ring if lingually inclined) |

### Engine prediction
- Kennedy: ✓ Class II Mod 1
- Major connector: ✓ Lingual Bar (sulcus ≥ 8mm)
- #20 (isDE=true): RPI default, Combination if contras → ✓
- #28 (isDE=false, posterior, not esthetic): Akers ✓
- #32 (isDE=false, posterior, 3rd molar but PRESENT as abutment, default undercut): Akers ✓
- Indirect retainer: Engine should place near #28 area or at canine #22. The UIC answer says it "can be part of the distal rest #28" — implying the mesial rest on #28 (since #28D is the guide plane facing the saddle, mesial rest is on the OTHER side of #28, which is perpendicular-ish to the fulcrum line).
  - **Note:** This is a subtle point. The case treats the same rest as serving dual roles (direct + indirect retention). Engine's separate handling may produce a discrete "indirect retainer on #21 or #22" instead of recognizing the dual-role design.

### Verdict
**Likely matches with the dual-role indirect retainer caveat.** Confirm: does the engine place an EXTRA indirect retainer (e.g. on #21 or #22) on top of the #28 direct retainer? If yes, that's "engine over-prescribing"; if no, that's "engine matches UIC's elegant dual-role solution." Either is defensible — but worth knowing which one fires.

---

## Case 6 — Maxillary Class II Mod 2 (Huddle Week 6 Case 2)

### Inputs
- Arch: maxillary
- Edentulous: #1–3 (right DE), #10–11 (anterior mod), #14 (posterior mod)
- Present: #4, #5, #6, #7, #8, #9, #12, #13, #15 (#1 is 3M, Rule 2 omit; #16 if missing also omitted)
- Vestibular depth ≥5mm (RPI indicated for #4)

### Expected (Huddle answer key)
| Field | Answer |
|---|---|
| Kennedy class | II Mod 2 ✓ |
| Direct retainers | #4, #9, #12, #13, #15 ✓ |
| Guide planes | #4D, #9D, #12M, #13D, #15M ✓ |
| Major connector | A-P Strap |
| Indirect retainer | Yes — ball rest on #9 also serves as indirect retainer |
| #4 | RPI or Combination |
| #9 | Ball rest |
| #12, #13, #15 | Akers |

### Engine prediction
- Kennedy: right DE (Class II) + 2 modifications (#10-11 anterior, #14 single posterior) → **II Mod 2** ✓
- Major connector: Class II, presentCount > 6 → **A-P Strap** ✓
- #4 (isDE=true): RPI default, Combination if contras → ✓
- #9 (isMaxAnterior=true, span tooth-supported): **Rest Only, ball rest** ✓
- #12 (NOT in RPD_MAX_ANTERIOR which is {6-11}, NOT in esthetic zone for premolars): **Akers** ✓
- #13, #15 (posteriors, default): **Akers** ✓
- Indirect retainer: For Class II Mod 2, the engine's logic for indirect placement is critical. The UIC answer says #9's ball rest dual-functions as indirect retainer.

### Verdict
**Should match.** Same dual-role caveat as Case 5: does the engine ALSO add an indirect retainer on #6 (canine on the side opposite the DE) on top of #9's ball rest? If yes, engine is over-prescribing; if no, engine matches UIC. Worth confirming.

---

## Summary of Identified Issues

### Issue 1 — Nomenclature: "Reverse Akers" vs "Akers (DL/DB undercut)"
**Severity:** Cosmetic/optical
**Where:** Engine outputs `claspType = "Reverse Akers"` (line 11200) for distally-located undercuts. UIC labels these as "Akers" in their clinical slides (Case 1 mandibular, #31).
**Fix:** Either rename the claspType to "Akers (Reverse pattern)" or "Akers" + a separate `claspVariant` field. Low effort, high label-fidelity.

### Issue 2 — Esthetic zone excludes premolars
**Severity:** Real clinical gap
**Where:** `RPD_ESTHETIC_ZONE = {6,7,8,9,10,11,22,23,24,25,26,27}` (line 10739). Excludes #4, #5, #12, #13, #20, #21, #28, #29 — all of which can be esthetically visible in some patients.
**Impact:** Engine won't offer I-bar esthetic on these teeth, while UIC's worked Case 4 explicitly allows I-bar on #28 for esthetic reasons.
**Fix:** Add a per-patient `prioritizeEsthetics` flag that, when true, expands the esthetic zone to include premolars. Default off so the engine doesn't over-offer I-bars.

### Issue 3 — Dual-role rest (direct + indirect) not modeled
**Severity:** Architectural mismatch
**Where:** UIC frequently designs cases where a max-anterior rest-only (e.g. #9 ball rest in Cases 1 and 6) ALSO serves as the indirect retainer. Engine separates direct retainers (`abutmentDesigns`) from indirect retainers (`indirectRetainers`) and may add an ADDITIONAL indirect retainer on a different tooth, double-counting.
**Impact:** Engine may produce one extra rest seat that UIC's design doesn't need. Not biomechanically wrong, but adds unnecessary tooth preparation.
**Fix:** When `rpdPlaceIndirectRetainers` runs, check if a tooth perpendicular to the fulcrum line is already in `abutmentDesigns` as "Rest Only (esthetic omission)" and reuse it as the indirect retainer rather than adding a new one.

### Issue 4 — Anterior saddle type not explicitly differentiated
**Severity:** Low — both Lattice and Mesh are clinically acceptable for anterior spans
**Where:** `result.baseDesigns` chooses between Open Lattice, Mesh, Tube Tooth, Facing. UIC's Cases 1 and 4 use Mesh for anterior gaps; Cases 2 and 3 use Lattice. The engine's choice between Lattice and Mesh for an anterior span depends on `interocclusalSpace` measurement.
**Action:** Verify in UI that anterior spans get Mesh when `interocclusalSpace === "limited"` or `"extremely_limited"`, and Lattice otherwise. This is likely working but worth confirming.

---

## Manual Test Plan

For each of the 6 cases above, in the live tool:

1. Set Arch correctly (maxillary or mandibular)
2. Toggle each missing tooth to "missing" on the chart
3. For #12 (Case 1): set vestibular depth = 4mm, set frenum = high
4. For #21 (Case 2): set softTissueUndercut = "gt-1mm"
5. For #31 (Case 2): set undercutLocation = "disto-lingual", tilt = "tilted"
6. For Case 3: just mark teeth missing, defaults should produce Full Palate + RPI
7. For Case 4: set lingualSulcusDepth = 6mm or mandibularTori = true
8. Verify each output column against the answer-key column

Pass criteria: Every row in the answer-key column matches the engine's output, OR the divergence is a known/acceptable variant (e.g., Mesh vs Lattice for anterior, Akers vs Reverse Akers for DL undercut).

Once all 6 cases pass, the engine is verified against UIC's worked cases and safe to share with the class.
