# Crown-prep reduction guide — design brief (for Claude Design)

A set of **stylized vector diagrams** (flat, not photoreal 3D) for a dental-student app. Each shows a tooth in cross-section: the **original tooth** behind and the **prepped tooth** in front, with the gap between them = the reduction, labeled with measurements.

## Palette (match the app exactly)
- Background: cream **#FAF6ED** (or card cream **#FCF9F2**); transparent PNG also fine.
- Original-tooth silhouette (behind): warm gray **#7A6F5C** at ~85% opacity (soft, recedes).
- Prepped-tooth outline (front): **oxblood #7A1E1E**, ~2.5px stroke, cream fill (#FCF9F2).
- Dimension brackets + measurement labels: **oxblood #7A1E1E** (bold). Optional second accent: gold **#9A7B3F**.
- Ink for any body text: **#1A1612**. Hairlines/rules: **#D8CEBA**.
- Fonts: **Fraunces** (serif) for a title; **Geist** (sans) for labels; **JetBrains Mono** for the mm numbers.
- Flat and clean — line-art + flat fills, no gradients/photoreal shading.

## The two contours (this is what matters — get these right)
- **Original tooth:** natural anatomy — has a **height-of-contour bulge**, full cusps, and is **asymmetric** (e.g. mesiobuccal cusp taller/broader than distobuccal; buccal groove off-center; incisal edge slopes). Drawn as the gray silhouette, slightly larger all around the crown.
- **Prepped tooth:** a **tapered stump** — the axial walls **converge toward the occlusal/incisal (6–10° total taper) so there are NO undercuts** (you could lift a crown straight off it). A **shallow** occlusal scallop (gentle cusp form, NOT a deep V/“pac-man”). A **flared cervical collar at the base = the finish line / chamfer**. No height-of-contour bulge on the prep.
- The **gray halo** (gap between original and prep) is the reduction: **largest at the cusp tips (occlusal), smaller on the walls (axial), smallest at the margin.** Draw the gaps roughly to scale so occlusal reads as the deepest cut.
- Reference look: ADEX/“My Dental” crown-prep frames (gray original + white prepped + bracketed callouts) — same idiom, but flat/vector in this palette.

## Measurements to label (USE THESE — they're audited UIC figures, NOT the ADEX numbers)
Label **3 reductions per image** + one small taper note. Bracket each with end-caps + a short leader, in oxblood.

| | Axial walls | Occlusal / Incisal | Finish line |
|---|---|---|---|
| **PFM / e.max** | 1.25–1.5 mm | 1.5–2.0 mm | deep chamfer 1.0–1.25 mm |
| **Zirconia** (conservative) | 1.0–1.25 mm | 1.25–1.5 mm | chamfer 0.5–0.8 mm |

All: **6–10° total taper**, finish line **~0.5 mm supragingival**. (**No gold** — we don't do gold crowns.)

> Label each image with the **PFM / e.max** numbers (that's most of UIC's work, and PFM = e.max numerically). The app shows the per-material numbers in a text card beneath, so you don't need a separate image per material — but if it's easy, a **zirconia variant** of each is a bonus.

## Images to make (recommended set = 3; +1 optional)
1. **Posterior molar — buccal section** (the “W” profile). Labels: **occlusal 1.5–2.0**, **axial 1.25–1.5** (on a wall), **deep chamfer 1.0–1.25** (at the collar).
2. **Anterior central incisor — labial section** (and/or a proximal/profile view). Labels: **incisal 1.5–2.0**, **labial 1.25–1.5** (note: *two planes* — incisal + cervical), **deep chamfer 1.0–1.25**; also call the **reduced lingual concavity + cingulum**.
3. **Posterior molar — occlusal (top-down)**. Show the prepped occlusal table with real cusp/groove anatomy (asymmetric) + a thin gray reduction halo. Label: **anatomic occlusal — follow the cusp inclines** + the **axial 1.25–1.5** around the perimeter.
4. *(optional)* **Premolar — buccal section** (two cusps) — same idea as #1, smaller.

## Output format (so they drop straight into the app)
- **PNG**, transparent or cream background, ~**1100–1400 px** wide, landscape-ish per the views.
- Name them: `rg-post-buccal.png`, `rg-anterior.png`, `rg-post-occlusal.png` (+ `rg-premolar.png` / `*-zirconia.png` variants if made).
- Drop into `~/Desktop/clinic-shea/public/reductions/`. Tell me the filenames + which view/material each is; I wire them into the reduction-guide card (right image per tooth-type, with the verified numbers beneath).
