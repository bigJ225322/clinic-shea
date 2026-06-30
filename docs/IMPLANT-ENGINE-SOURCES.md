# Implant placement engine — verified source ledger

Private record of every threshold the `computeImplantPlan` engine uses, traced
to a primary source. Numbers were read digit-for-digit from the lecture text,
not paraphrased. The deployed UI states the clinical reason only (e.g. "needs
≥2 mm above the nerve"), never the citation — this ledger is where the
attribution lives.

**Sources used (authoritative):**
- **[Han]** "Diagnosis and Treatment Planning II: Surgical Indications," Michael D. Han, DDS, OMFS (DAOB 302). The minimum-anatomic-distances table + host-factor stances.
- **[TBL]** "Implant TBL Lecture" — the clinic case-acceptance checklist (the screening form).
- **[Sukotjo]** "Diagnosis and Treatment Planning I: Restorative Indications," Cortino Sukotjo, DDS (DAOB 302). Contraindication list + prosthesis-option framework.
- **[Yuan]** "Clinical Procedures for Single Tooth Implant Restorations," Judy Chia-Chun Yuan, DDS, MS, FACP (UIC Predoctoral STI, wk7). The restorative sequence, prosthetic components, and the implant-system sizes UIC stocks. **This is the authority for the Implant-builder component views.**
- **[Straumann BL / Atlantis]** "Restorative Considerations III — Straumann STI BL" (Mohammad) + "Custom abutment" (Touloumi) + the Atlantis Abutment decks. Component materials (cover screw, healing abutment, custom abutment) + emergence-profile options.

**Source NOT used — flagged AI slop:** "Implants Comprehensive Guide (UIC).pdf" sits in `MASTER REFERENCE CS/_EXCLUDED — suspected AI slop`. Not trusted; no number taken from it.

---

## 1. Feasibility gates — the clinic case-acceptance checklist [TBL]

A site **passes as-is** only if all hold; otherwise the engine names the failing gate and the remedy (augmentation / CBCT / refer).

| Gate | Threshold | Source | Fail → |
|---|---|---|---|
| Mesiodistal width (between adjacent teeth) | ≥ 7 mm | TBL L82 | narrow site / consider bridge |
| Faciolingual ridge width (3–4 mm below crest) | ≥ 7 mm | TBL L91 | GBR / ridge split |
| Bone height — maxilla or anterior mandible | > 10 mm | TBL L85 | graft / sinus lift |
| Bone height — mandibular posterior (above IAN) | ≥ 12 mm | TBL L86 | short implant / refer |
| Interocclusal (ridge → opposing marginal ridge) | ≥ 7 mm | TBL L87 | gain clearance |
| Keratinized tissue (faciolingual) | ≥ 4 mm | TBL L93 | soft-tissue graft |
| Internal sinus lift achievable at placement | ≤ 3 mm needed | TBL L95 | lateral-window lift (staged) |

## 2. Placement constraints — minimum anatomic distances [Han L337-352]

| From the implant to… | Min |
|---|---|
| Buccal plate | 0.5 mm |
| Lingual plate | 1.0 mm |
| Maxillary sinus | 1.0 mm |
| Nasal floor | 1.0 mm |
| Adjacent natural tooth | 1.5–2.0 mm |
| Adjacent implant | 3.0 mm |
| Inferior alveolar canal (incl. vertical clearance) | 2.0 mm |
| Mental foramen | 5.0 mm (3 mm anterior loop + 2) |
| Inferior border of mandible | 1.0 mm |

**Derived (do not hard-code a separate width number — derive it):**
- Min ridge width for a given diameter = diameter + buccal 0.5 + lingual 1.0 = **diameter + 1.5 mm** [Han]. NB the TBL clinic gate (≥7 mm F-L) is the more conservative *screening* number and governs acceptance; the Han derivation governs which diameter fits a given ridge.
- Max implant length = available height − safety margin to the structure below (IAN 2.0 / sinus 1.0 / nasal 1.0) [Han].

## 3. Esthetic / papilla spacing [TBL L335-347]

- Tooth → implant: 1.5–2 mm (Esposito). Implant → implant: 3 mm (Tarnow).
- Bone crest → interproximal contact: 5–6 mm for papilla fill between natural teeth; ≤ 5 mm implant-to-tooth; 2–4 mm papilla between implants (Tarnow).
- Facial bone thickness: ≥ 1 mm, **2 mm ideal**. Thin/scalloped biotype = higher recession risk.

## 4. Host / medical factors [Han unless noted]

- **"Indications/contraindications are almost always RELATIVE"** [Han L13] — engine outputs cautions, not hard bans, except the few below.
- **Diabetes** — NOT a contraindication; keep HbA1c < 7–8; consider antibiotic prophylaxis [Han L108-115].
- **Antiresorptives / MRONJ** [Han L131-142]: **IV bisphosphonate → avoid implants** (hard stop). PO bisphosphonate → not a contraindication, drug holiday may be needed. RANK-L inhibitor (denosumab) → dissipates after 6-mo holiday.
- **Radiation** — not an absolute contraindication; dose-dependent (≈60 Gy), worse in mandible; consider HBO [Han L174-180].
- **Smoking** — not a contraindication; dose effect, **>10 cig/day or >10 pack-yr significant**; 2–2.5× failure (3.6× in grafted sites); nicotine holiday (quit 1 wk pre, 8 wk post) [Han L181-246].
- **Age — lower limit:** defer until facial growth ceases (**12–14 F, 16–18 M**); implants in a growing alveolus behave like ankylosed teeth and submerge [Han L247-257]. **Hard defer.**
- **Age — upper limit:** none; assess comorbidities, cognition, dexterity [Han L258-267].
- **Parafunction / bruxism:** higher failure (OR 3.83, Zhou 2016) [Han L280-283] — caution.
- **Defer / hospital** [Han L52-60]: uncontrolled HTN, recent ACS, unstable angina → defer; severe uncontrollable bleeding disorder → hospital.
- Sukotjo contraindication list (corroborating) [Sukotjo L69-82]: uncontrolled metabolic disease (HTN, DM), prior radiation > 6000 rads, abnormal bone metabolism (osteoporosis, MRONJ), acute illness, pregnancy, psychiatric, malnutrition, alcohol abuse, bleeding disorders.
- **Osteoporosis itself is not the bar — the antiresorptive taken for it is** (synthesis of Han MRONJ + Sukotjo).

## 5. Core principle [Han L330-332]

> "Implant should be placed where the final restoration should be placed, and NOT where there is bone." Restoratively-driven. If bone is inadequate → augment or choose a non-implant option, never reposition for convenience.

## 6. Implant-system sizes — what UIC stocks [Yuan]

The predoc program assigns one of three systems; the engine's diameter/length
sets are the union of their stocked sizes (so every number the UI prints is a
real, orderable fixture — no invented values like the old 11.5 mm).

| System | Diameters (mm) | Lengths (mm) |
|---|---|---|
| Straumann | 3.3, 4.1, 4.8 | 10, 12 |
| Astra Tech Osseospeed | 3.5, 4.0, 4.5, 5.0 | (6), 8, 11, 13 |
| Astra Tech EV | 3.6, 4.2, 4.8, 5.4 | 11, 13 |

- Engine `DIA = {narrow 3.3, standard 4.1, wide 5.0}` and `LENGTHS = [6, 8, 10, 11, 13]` are all drawn from the above. Implant: Dentsply/Astra, **internal connection, 4.0 mm platform** [Yuan].

## 7. Restorative phase & prosthetic components [Yuan; Straumann BL; Atlantis]

The Implant-builder's component toggle (cover screw → healing abutment → custom
abutment → crown) is the **UIC two-stage STI sequence**, drawn here:

- **First stage (submerged):** implant placed with a **cover screw**; tissue closed over it. (Order form ships the cover screw with the implant.)
- **Second stage (~3 months):** **healing abutment** placed, "appropriate heights — **2 mm above soft-tissue crest**"; ≥ 3 weeks soft-tissue healing before restorative [Yuan].
- **Custom abutment:** **Atlantis**, ordered via the Atlantis weborder; **Titanium** (gold-shaded Ti or zirconia options); has a **finish line + emergence profile** (default "contour tissue"); screw-retained into the fixture, torqued [Yuan; Atlantis/Touloumi].
- **Crown:** **cement-retained, all-ceramic emax CAD (lithium disilicate)** or PFM noble; seats over the abutment, margin at the finish line; Teflon over the screw-access hole, permanent luting agent, excess cement removed [Yuan].
- Impression: **implant-level, closed-tray** (transfer coping + implant replica), soft-tissue working cast in Type IV gypsum [Yuan].

## 8. Still qualitative / not yet used

- **Apicocoronal platform depth** (≈3 mm below the planned gingival margin) — standard restorative convention; not a hard spec in these decks.
- Bone quality **D1–D4** map is shown [Han L316-326] as a diagram (anterior mandible densest, posterior maxilla least) — usable qualitatively for a primary-stability caution.
