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

## 6. Gaps to fill before/while coding

- **Diameter classes** (narrow ~3.0–3.5 / standard ~4.0–4.3 / wide ~5+) and **length options** are implant-system specs, not stated in these decks — confirm from the Osseointegration deck or treat as standard system values, clearly flagged.
- **Apicocoronal platform depth** (≈3 mm below the planned gingival margin) — not explicit here; confirm or mark as standard restorative convention.
- Bone quality **D1–D4** map is shown [Han L316-326] as a diagram (anterior mandible densest, posterior maxilla least) — usable qualitatively for a primary-stability caution.
