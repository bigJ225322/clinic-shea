# Crown-prep reduction guide — build spec (Phase 2)

> Built on the Phase-1 audit's VERIFIED figures (docs/SOURCE-MAP.md). The earlier
> `mcp__visualize` demo was never integrated; this is the plan to build a real,
> parametrized React component and wire it into the Maps tab.

## Jake's critiques of the first attempt (must all be fixed)
1. **Axial reduction is uniform all around** — no "metal-only lingual", no different facial vs lingual amount. Same gap every wall.
2. **Margins illustrated correctly** — the finish line is a real chamfer/shoulder of the right depth, drawn at ~0.5 mm supragingival, shown ONLY in views where it's actually visible.
3. **No random projections** — nothing stray.
4. **Seamlessly switch between teeth** — a tooth picker; one component, all 32 teeth.
5. **Occlusal view has occlusal anatomy** — cusp inclines + central groove, NOT one flat surface of uniform reduction.

## VERIFIED reduction table (source of truth — from the audit)
| Crown | Axial | Occlusal/Incisal | Finish line | Notes |
|---|---|---|---|---|
| **Metal (FGC)** | 1.0–1.25 | 1.25–1.5 | chamfer 0.5–0.8 | functional cusp bevel |
| **Zirconia (monolithic)** | 1.0–1.25 | 1.25–1.5 | chamfer 0.5–0.8 | |
| **PFM** | 1.25–1.5 | 1.5–2.0 | deep chamfer/shoulder 1.0–1.25 | porcelain space 0.8–2.0 over 0.2–0.3 metal; functional cusp bevel |
| **e.max (LD)** | 1.25–1.5 | 1.5–2.0 (incisal too) | deep chamfer 1.0–1.25 | bonded; anterior incisal 1.5–2.0 |
All: **6–10° total taper**, **~0.5 mm supragingival** finish line. e.max bridge connector **16 mm²** (bridge visual only).

## Views (each feature shown ONLY where visible)
- **Buccolingual section** (hero): ghost original tooth (dashed) + solid prepped tooth; shows axial reduction (labeled on BOTH walls = uniform), anatomic occlusal reduction, functional cusp bevel, the chamfer margin + its depth, the taper, gingiva + root stub.
- **Occlusal view**: prepped occlusal table with cusp ridges + central groove (M–D) + functional-cusp-bevel band + the margin as the outer perimeter. Anterior teeth: incisal-edge reduction + the lingual concavity, not cusps.
- **Proximal (mesial) view**: interproximal reduction + the margin around the proximal; for anteriors, the incisal + cingulum.

## Tooth-type geometry
- **Posterior (premolar/molar):** 2+ cusps (buccal functional on mandibular, palatal functional on maxillary), central groove; functional cusp bevel on the functional cusp.
- **Anterior (incisor/canine):** incisal-edge reduction (1.5–2.0 for e.max/PFM), labial reduction in TWO planes (incisal + cervical), lingual concavity reduction, cingulum; NO "cusps". Finish line follows the gingival contour.
- All 32 teeth selectable; geometry chosen by quadrant + tooth number → {central, lateral, canine, 1st PM, 2nd PM, 1st molar, 2nd molar, 3rd molar} × {max, mand}.

## Component API (plan)
`<CrownReductionGuide toothNumber={19} crownType="pfm" view="bl" />`
- A pure data table `REDUCTION_FIGS[crownType] = {axial, occlusal, chamfer, label}`.
- A geometry function per view that draws ghost + prepped from those figures (so the labels and the drawn offsets always agree with the table).
- A tooth picker (reuse the existing tooth-selector pattern) + crown-type segmented toggle + view tabs.
- Wire into the Maps tab under `crownc-prep` / `digc-prep` (and a standalone entry), as a `widget` like `mouldSelector`.

## Status
- ✅ Corrected geometry prototype shown (PFM molar, BL + occlusal) — fixes all 5 critiques.
- ▶ Next: port to a parametrized React component; start with posterior BL+occlusal for all 4 crown types; then anterior geometry; then proximal view; then the tooth picker + Maps wiring; verify each with preview screenshots.
- Then: Maps visual aides for the PFM + e.max pathways (prep cross-section inline, the bond-protocol sequence, the bridge connector).
