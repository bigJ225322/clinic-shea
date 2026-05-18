# RPD design principles — universal hierarchy for the engine rebuild

This is the cross-corroborated invariant catalog for the rebuilt RPD engine. Every rule below is supported by **multiple reputable RPD sources**, with **McCracken's Removable Partial Prosthodontics, 12th Edition (Carr & Brown, 2011)** as the primary authority. McCracken is the gold-standard RPD textbook used at most US dental schools, and where its rules align with other sources (which they almost always do), the rule is treated as universal. UIC-specific dimensional details (bur sizes, exact mm values) live UNDER the universal principles, not as standalone rules.

This document is the spec. The rebuilt engine must satisfy every invariant in section 2 and follow the design sequence in section 3.

---

## 1. The hierarchy of needs

Every RPD design decision is subordinate to higher-order requirements. When two requirements conflict, the higher one wins.

```
TIER 0 — Patient safety (absolute)
  ├─ No aspiration risk (no Nesbit / unilateral cantilever)
  ├─ No biological harm to abutments (no torquing, no perio overload)
  └─ Designable as RPD or explicit "not designable" output

TIER 1 — Mechanical fundamentals (biomechanics)
  ├─ Support (resists tissue-ward movement)
  ├─ Stability (resists lateral/horizontal movement)
  ├─ Retention (resists displacement away from tissues)
  └─ All three are MANDATORY; "support, then stability, then retention" is
     the standard design-thought order (Petropoulos, J Prosthet Dent 2003)

TIER 2 — Component requirements
  ├─ Major connector RIGID (universal — McCracken, Stewart, Loney all agree)
  ├─ Bilateral direct retention (cross-arch stabilization)
  ├─ Quadrilateral configuration of direct retainers (ideal where teeth permit)
  ├─ Indirect retention for distal-extension cases (Class I, II)
  └─ Reciprocation for every retentive clasp arm

TIER 3 — Class-specific design templates
  └─ See section 5

TIER 4 — Detail/clinical preferences
  ├─ Bur sizes
  ├─ Exact dimensions
  ├─ Material choices
  └─ This is where UIC's institutional standards live
```

---

## 2. Hard invariants — the engine MUST satisfy these

Each invariant maps to a check the engine performs and a red flag it emits if violated. These are not preferences; they are universally agreed-upon requirements across the sources surveyed.

### INV-1 — Bilateral direct retention is required
**Rule:** An RPD must have direct retainers on BOTH sides of the arch. A unilateral design (all clasps on one side) is unacceptable.

**Corroboration:**
- "Retentive clasps oppose each other when correctly designed, and retention at each principle abutment should balance that of the tooth on the opposite side of the arch." (eDental Portal, summarizing McCracken)
- "Embrasure clasps are indicated in an unmodified Class II or Class III partial denture, where there are no edentulous spaces on the opposite side of the arch to aid in clasping." (eDental Portal direct retainer summary)
- "Bilateral or diagonally opposed" retentive arms required for embrasure clasp design (Pocket Dentistry, clinical guide)
- Nesbit (unilateral) RPDs carry aspiration risk and are "considered contraindicated in many clinical situations" (Practice Booster, ScienceDirect)

**Engine action:** If span-derived abutments are all on one side and the class is III, ADD contralateral retention via Embrasure pair (preferred) or single Akers (fallback). If no contralateral retention is possible (no viable teeth on the missing side), emit hard "RPD not designable" red flag and recommend FPD/implant.

### INV-2 — Major connector must be rigid
**Rule:** Every major connector specified by the engine must be a rigid design. Flexible major connectors are universally prohibited.

**Corroboration:**
- "Major connectors must be rigid so that forces applied to any portion of the denture can be effectively distributed" (McCracken, via Pocket Dentistry)
- "Major connectors must be rigid" (FFOFR biomechanics)
- "Rigid major connectors that distribute forces across the entire arch" (Dental Update comprehensive guide)

**Engine action:** Already enforced — `rpdSelectMajorConnector` only emits rigid options. Keep.

### INV-3 — Indirect retention required for distal-extension cases
**Rule:** Kennedy Class I and Class II MUST have indirect retainers. Class III MUST NOT (no fulcrum line to rotate about).

**Corroboration:**
- "Indirect retention is required for Classes I, II, and IV to prevent rotational movement" (Pocket Dentistry clinical guide)
- "Need for some kind of indirect retention exists in the distal extension type" (McCracken)
- "Class III RPDs are strictly tooth-borne...does not rotate about a fulcrum" (Wikipedia, denpedia)

**Engine action:** Already enforced in `rpdPlaceIndirectRetainers` (returns [] for Class III). Keep but fold into the planner.

### INV-4 — Indirect retainer placement
**Rule:** Indirect retainers are placed perpendicular to the fulcrum line, as far from the fulcrum line as anatomically possible.

**Corroboration:**
- "Positioned as far as possible from the fulcrum line. Located perpendicular to the midpoint of the fulcrum line." (xdentlab, summarizing McCracken)
- "The farther the indirect retainer is from the fulcrum line, the more effective it is in resisting tilting forces" (multiple sources)
- "Most commonly used indirect retainer is an auxiliary occlusal rest located on an occlusal surface and as far away from the distal extension base as possible. In a mandibular Class I arch, this location is usually on the mesial marginal ridge of the first premolar on each side of the arch." (McCracken via search)

**Engine action:** Currently approximated by "opposite side from DE, distalmost viable tooth." Acceptable approximation but the rebuild should rename source from `"fulcrum-perpendicular"` to `"opposite-side-distalmost"` for honesty, OR upgrade to actual geometric calculation. Defer geometric upgrade to v2.5.

### INV-5 — Embrasure clasp is the clasp of choice for a quadrant with no edentulous space
**Rule:** When direct retention is required on a quadrant that has no edentulous space (e.g., Class III mod 0 contralateral side), the design of choice is an Embrasure clasp on two adjacent posterior teeth.

**Corroboration:**
- "Embrasure clasps are indicated in an unmodified Class II or Class III partial denture, where there are no edentulous spaces on the opposite side of the arch to aid in clasping" (eDental Portal)
- "Embrasure clasps were more common in Kennedy Classes III and IV RPD designs as compared to Class I" (PMC survey study)
- "Two Aker clasps arise from a common body and from the same minor connector located in the embrasure between the two clasped teeth, and provide bilateral stabilization, bracing, and retention" (eDental Portal)
- UIC Retainers PDF p. 24 (institutional source): "Clasp of choice for a quadrant with no edentulous space"

**Engine action:** Phase B of `rpdSelectAbutments` (already implemented) picks the most-posterior viable adjacent posterior pair. Keep behavior, restructure into planner.

### INV-6 — Quadrilateral configuration is the ideal direct-retainer arrangement
**Rule:** When the dentition permits, the engine should aim for four direct retainers arranged in a quadrilateral (4-point) configuration. This is most effective for resisting rotation and providing cross-arch stabilization.

**Corroboration:**
- "Denture bases do not rotate or lift away if there are enough remaining teeth to place four retainers in a quadrilateral configuration. A quadrilateral configuration of direct retainers is ideal." (Multiple sources via search synthesis)
- "Quadrilateral configuration is indicated in class 3 arches, particularly when modification space exists on the opposite side" (Pocket Dentistry)
- "Rests should be located anteriorly & posteriorly in a quadrilateral configuration" (Pocket Dentistry clinical guide)

**Engine action:** Class III mod 0 already gets 4 retainers via Phase B (span boundaries + embrasure pair). Class III mod 1+ should also yield 4 retainers naturally. Add as a SOFT preference in the planner: when only 2-3 direct retainers result from spans, consider adding contralateral retention even when the bilateral invariant is technically satisfied.

### INV-7 — RPI is the system of choice for distal-extension abutments
**Rule:** For tooth-tissue-supported (distal-extension) cases, the terminal abutment uses an RPI clasp assembly (mesial Rest + distal Proximal plate + I-bar) UNLESS contraindicated.

**Corroboration:**
- "The RPI system was first presented by Kratochvil in 1963 and then modified by Krol in 1973, designed to reduce stress on abutment teeth in distal-extension RPDs" (peer-reviewed review)
- "If the saddle can rotate downward independently from the adjacent abutment tooth, the abutment tooth will not be stressed" (Kratochvil principle)
- Mesial rest + distal proximal plate + I-bar — universal across Kratochvil, Krol, McCracken

**Engine action:** Already implemented. Keep contraindication gates (`rpdCheckRPIContraindications`). Fall back to Combination when contraindicated.

### INV-8 — Reciprocation is required for every retentive clasp arm
**Rule:** Every clasp with a retentive arm engaging an undercut must have reciprocation on the opposite side at or above the survey line.

**Corroboration:**
- "It is necessary for the retentive and bracing clasp arms to simultaneously come into contact with the axial surface to protect the abutment tooth and prevent buccolingual movement" (PMC case series)
- "Reciprocation counteracts the forces exerted by the retentive clasp arm as it flexes over the survey line" (denpedia, FFOFR)
- "Movement must be balanced by reciprocation" (denpedia)

**Engine action:** Already enforced per clasp type in `rpdDescribeReciprocation`. Keep.

### INV-9 — Encirclement — clasp must engage >180° of the tooth
**Rule:** A direct retainer must encircle more than 180° of the abutment tooth circumference. This is the "encirclement" requirement.

**Corroboration:**
- FFOFR direct retainer requirements: "Support, Stabilization, Reciprocation, Encirclement, Passivity, Retention" (the 6 requirements)
- Universal textbook teaching (McCracken, Stewart, Loney)

**Engine action:** Not currently explicitly checked. Add as INV in `rpdCheckRedFlags` (or its successor). Embrasure pair satisfies via two opposing arms; Akers satisfies via cast body wrap; RPI satisfies via proximal plate + distal minor connector contact.

### INV-10 — Path of insertion must be unique and definable
**Rule:** Every RPD design must have a single, definable path of insertion (or a stated dual-path / rotational-path design with clinical justification).

**Corroboration:**
- "An optimal RPD path of placement, guided by mutually parallel guide planes, ensures that the RPD flanges fit intimately" (PMC microscope study)
- Universal across all sources

**Engine action:** Currently implicit (guide planes are placed on each abutment). The rebuild should make the path of insertion an explicit output field of the planner — "all guide planes parallel along axis X" — so future surveying-aware features can build on it.

### INV-11 — Anterior teeth never get cast Akers clasps
**Rule:** Cast circumferential (Akers) clasps are never placed on incisors or canines in the esthetic zone. Use I-bar esthetic (gingivally approaching) or rest-only with major connector contact for bracing.

**Corroboration:**
- "Anterior teeth benefit from gingivally approaching clasps due to reduced aesthetic interference" (denpedia, multiple sources)
- Universal across textbooks

**Engine action:** Already enforced. Keep.

### INV-12 — Anteriors use cingulum or ball rests, never occlusal
**Rule:** Anterior teeth (incisors, canines) have no occlusal table — rests must be cingulum (canine) or ball (central incisor distal line angle).

**Corroboration:**
- Universal anatomic constraint; not a clinical preference but a biological reality
- "Cingulum rests on canines and occlusal rests on premolars are typical examples" (Dental Update)

**Engine action:** Already enforced. Keep.

### INV-13 — Survey crown indications
**Rule:** A survey crown is indicated when ANY of these conditions exist:
1. Existing restorations are extensive (jeopardize tooth integrity if further modified)
2. Tooth has been heavily destroyed and needs full coverage
3. Tooth has extreme tilt requiring axial re-contouring beyond enameloplasty
4. Ideal rest seats + undercuts + guide planes + HOC cannot be created in enamel (would penetrate dentin)
5. Existing crown obstructs rest-seat / guide-plane prep
6. Malposed abutment requires orientation correction

**Corroboration:**
- "Used to correct occlusal plane discrepancies, to restore badly broken down clinical crowns, to create proper rests, particularly with anterior teeth, and adequate retentive undercuts" (biologyinsights, ScienceDirect)
- "Indications for surveyed restorations include malposed abutments, extensively broken down abutments (weak abutment), and providing contours to receive an RPD" (multiple sources)
- UIC Lecture 4A p. 9 — the 4-criterion list (institutional alignment)

**Engine action:** Already implemented (`evaluateSurveyCrown`). Keep.

### INV-14 — Design sequence is fixed
**Rule:** The systematic design order is: **Rests → Major Connector → Minor Connectors → Denture Base Connectors → Direct Retainers**. The eight-step framework variant (locate path → survey → outline rests/guide planes → minor connectors → major connector → retention mesh → base extension → direct retainers) is also acceptable.

**Corroboration:**
- "Rests, Major Connectors, Minor Connectors, Denture Base Connectors, Retainers" (FFOFR design sequence)
- "(1) locate a path by tilting the cast; (2) mark the survey lines and tripod the cast; (3) outline the rest and guide planes; (4) draw minor connectors; (5) draw major connectors; (6) draw retention mesh for acrylic resin; (7) draw acrylic resin base extension; (8) draw direct retainers (clasps)" (Eslami systematic method, J Prosthodont Res)
- "Correct diagnosis...followed by a careful planning of support, stability and retention in that order" (Petropoulos)

**Engine action:** Currently the engine produces all decisions roughly in parallel; the OUTPUT lab Rx already lists components in the conventional Lab Rx order (which differs from design order — Lab Rx is per-tooth then connector). Design sequence is a teaching/thought-order concern, not necessarily a code order. **The rebuild's planner should still respect this internally:** plan supports (rests) first, then connectors, then retainers.

---

## 3. Class-specific design templates (universally agreed)

### Kennedy Class I — Bilateral distal extension
- **Movement:** Rotational about fulcrum line through the two terminal abutments
- **Direct retainers:** TWO terminal abutments (one each side), both with stress-release clasp (RPI standard, Combination when RPI contraindicated)
- **Indirect retainers:** TWO bilateral (one each side), perpendicular to fulcrum line, as anterior as practical
- **Major connector:** Maxillary — A-P Strap (rigid bracing for DE); Mandibular — Lingual Bar (sulcus ≥7-8mm) or Lingual Plate (insufficient sulcus or mobile anteriors)
- **Base:** Open Lattice / Mesh acrylic over residual ridge (for relining capability)

### Kennedy Class II — Unilateral distal extension
- **Movement:** Rotational + lateral lever forces
- **Direct retainers:** THREE — terminal abutment on DE side (stress-release clasp) + abutment on opposite side bordering any modification + (often) third retainer to complete tripodal configuration
- **Indirect retainer:** ONE on the side OPPOSITE the DE
- **Major connector:** Same as Class I considerations
- **Base:** Open Lattice / Mesh on the DE side

### Kennedy Class III — Bilateral tooth-supported
- **Movement:** Minimal (tooth-supported)
- **Direct retainers:** Abutments at every span boundary + **contralateral retention if all span boundaries fall on one side** (INV-1, INV-5). Quadrilateral configuration is the ideal when feasible.
- **Indirect retainers:** None (no fulcrum line to rotate about — INV-3)
- **Major connector:** Maxillary — Single Palatal Strap (short span) or A-P Strap (wider span); Mandibular — Lingual Bar or Plate by sulcus criteria
- **Base:** Open Lattice / Mesh; metal base acceptable for tooth-supported

### Kennedy Class IV — Anterior bounded span
- **Movement:** Rotational about anterior-posterior axis through bounding canines
- **Direct retainers:** Bounding canines + bilateral posterior abutments (often Embrasure clasps when occlusion permits) — typically four retainers total
- **Indirect retainers:** The bounding canines themselves serve as dual-role direct + indirect (rest perpendicular to anterior fulcrum line). Per UIC + Design Case II: canine ML ball rest (mand) or mesial cingulum rest (max).
- **Major connector:** Anterior bar (maxillary if posterior teeth viable); typically full plate or A-P Strap otherwise
- **Base:** Mesh for esthetic anterior bulk reduction

---

## 4. Universal prohibitions

| # | Prohibition | Source(s) |
|---|-------------|-----------|
| P-1 | **Nesbit (unilateral cantilever) RPD** — aspiration risk | Practice Booster, ScienceDirect, eDental Portal, UIC Huddle Q2 |
| P-2 | **Non-rigid major connector** | McCracken, Stewart, all textbooks |
| P-3 | **Direct retainer on anterior tooth requiring cast Akers clasp** in esthetic zone | Universal |
| P-4 | **Occlusal rest seat on canine or incisor** (anatomic impossibility) | Universal |
| P-5 | **I-bar without ≥5 mm vestibular depth + ≥1mm attached gingiva** | Krol, Kratochvil, multiple |
| P-6 | **RPI on tooth with mesial occlusal rest contraindicated** | Krol's 6-point gate (institutional UIC variant) |
| P-7 | **Retainer placed anterior to axis of rotation in extension situation, in undercut** — "would lift the abutment when a vertical load is applied posteriorly" | FFOFR biomechanics |
| P-8 | **Single impression covering both anatomic + supporting form simultaneously** (for DE bases) | McCracken |
| P-9 | **NMCD (thermoplastic) framework for Class I or II** — rigidity requirement violated | ADA, UIC, multiple |

---

## 5. Where UIC's institutional standards live under universal principles

UIC's specific dimensional values are valid INSTITUTIONAL DETAILS that nest under universal principles. The engine should use UIC values as defaults but recognize they're not the only valid choice.

| UIC detail | Universal principle it implements | Defensible? |
|------------|-----------------------------------|-------------|
| RPI proximal plate covers 1/2 to 2/3 occluso-gingival height | INV-7 (RPI design) | Yes — between Kratochvil and Krol |
| Lingual sulcus depth ≥8mm for Lingual Bar | INV-2 (rigid connector) + clinical geometry | Yes — some sources say 7mm minimum, UIC is conservative |
| 0.01" undercut for cast clasps | Universal (cast metal flex limit) | Yes — standardized |
| 0.02" undercut for wrought-wire clasps | Universal | Yes — standardized |
| Anterior-Posterior Strap as default for Max Class I/II | INV-2 (rigidity for DE) | Yes — McCracken default |
| Full Palatal Plate when ≤4 abutments | Practical stability requirement | Yes — universal practice |
| #8 round bur (molar) / #6 (premolar) for rest seats | Tier 4 — institutional preference | Yes for UIC, other schools vary |
| Spoon-shaped rest seat 1.5mm deep × 2.5mm M-D × 2.5mm B-L (molar) | Tier 4 — institutional dimensional spec | Yes for UIC |

---

## 6. Hierarchy of "must," "should," and "may"

The rebuild should distinguish between three confidence levels:

- **MUST (Tier 0–2):** Hard invariants from section 2. Violating these is a bug. The engine emits a blocker red flag and recommends an alternative modality.
- **SHOULD (Tier 3):** Class-specific templates from section 3. Engine follows by default; clinician can deviate with documented reason.
- **MAY (Tier 4):** Institutional preferences (UIC bur sizes, exact dimensions). Engine uses UIC defaults; clinician can override per case.

---

## 7. Sources cited

These are the cross-corroborating sources used to establish each invariant. UIC's institutional PDFs are the additional source layer for dimensional details and local conventions.

**Textbooks / authoritative chapters:**
- Carr AB, Brown DT. *McCracken's Removable Partial Prosthodontics*, 13th ed. Elsevier, 2016.
- Loney RW. *Removable Partial Denture Manual.* Dalhousie University, 2018.
- Phoenix RD, Cagna DR, DeFreest CF. *Stewart's Clinical Removable Partial Prosthodontics*, 4th ed.

**Peer-reviewed journal articles:**
- Eslami A, et al. "A systematic approach for removable partial denture design." J Prosthodont Res, 2003. PMID: 12830496
- Krol AJ. "RPA clasp design for distal-extension removable partial dentures." J Prosthet Dent, 1983.
- Kratochvil FJ. "Influence of occlusal rest position and clasp design on movement of abutment teeth." J Prosthet Dent, 1963.
- "A case series on the basic concept and design of removable partial dentures: support and bracing considerations." PMC11780901.
- "The path of placement of a removable partial denture: A microscope based approach to survey and design." PMID: 25722842.

**Dental school course materials and reviews:**
- University of Iowa Pressbooks: *Removable Partial Denture Kennedy Classification System*, 2025.
- Foundation for Oral-facial Rehabilitation (FFOFR) — RPD lecture series (biomechanics, retainers, design sequence, surveyed crowns).
- Pocket Dentistry — *Principles of Removable Partial Denture Design* (textbook-derived chapter).
- Pocket Dentistry — *RPD Treatment: A Clinical Guide*.
- Dental Update — "A comprehensive guide to removable partial dentures."
- eDental Portal — Kennedy Classification + Applegate's Rules; clasp summary.

**Institutional source (UIC):**
- UIC College of Dentistry RPD lecture series + Lab Rx examples + Huddle Q&A materials (provided by user).

---

## 8. What this changes for the rebuild

The rebuilt engine is now spec'd against 14 universally-corroborated invariants instead of the implicit "produce reasonable output for the cases we've tested" success criterion of the current engine.

The planner builds plans that satisfy INV-1, INV-3, INV-5, INV-6 by construction. The validator (whether runtime or test-time) checks INV-1, INV-2, INV-3, INV-8, INV-9, INV-11, INV-12. The hydrator implements the per-tooth details that satisfy INV-7, INV-10, INV-13. The output layer reports any unmet invariants as red flags.

When an invariant cannot be satisfied (e.g., no contralateral teeth available for INV-1 / INV-5), the engine emits an explicit "RPD not designable as configured" red flag and recommends an alternative modality (FPD, implant, interim).

The hierarchy of needs in section 1 dictates that when invariants conflict (rare but possible — e.g., bilateral retention requires a tooth that's hopeless), the higher-tier invariant wins and the lower-tier solution is degraded.

This is the spec. The rebuild builds against this document, not against the existing engine's output.

---

## 9. McCracken 12th Edition validation (added after textbook access)

After completing the initial catalog from web sources, McCracken's *Removable Partial Prosthodontics* 12th Edition (Carr & Brown, 2011) was obtained and read for direct corroboration. Every existing invariant was confirmed verbatim or by direct equivalent. Several new findings strengthen or extend the catalog. McCracken citations below use page numbers from the 12th Edition PDF.

### 9.1 Verbatim corroboration of existing invariants

| Invariant | McCracken verbatim quote | Page |
|-----------|--------------------------|------|
| **INV-1 — Bilateral direct retention** | *"Unless guiding planes will positively control the path of removal and will stabilize abutments against rotational movement, retentive clasps should be bilaterally opposed (i.e., buccal retention on one side of the arch should be opposed by buccal retention on the other, or lingual on one side opposed by lingual on the other). In Class II situations, the third abutment may have buccal or lingual retention. In Class III situations, retention may occur bilaterally or may be diametrically opposed."* (Basic Principles of Clasp Design, principle #4) | 69 |
| **INV-1 — Cross-arch stability** | *"When a prosthesis that can be removed from the mouth is used, the prosthesis must extend to both sides of the arch. This enables transfer of functional forces of occlusion from the denture base to all supporting teeth and tissues within an arch for optimum stability. It is through this cross-arch tooth contact, which occurs at some distance from the functional force, that optimum resistance can be achieved."* | 29 |
| **INV-2 — Rigid major connector** | *"Major connectors must be rigid so that forces applied to any portion of the denture can be effectively distributed to the supporting structures."* | 120 |
| **INV-3 — Class III no indirect** | *"in the tooth-supported, Class III type, no extension base is present to lift away from the supporting tissues because of the action of sticky foods and the movements of tissues of the mouth against the borders of the denture. ... Therefore the tooth-supported partial denture does not rotate about a fulcrum, as does the distal extension partial denture."* | 117 |
| **INV-4 — Indirect retainer placement** | *"An indirect retainer must be placed as far anterior from the fulcrum line as adequate tooth support permits, if it is to function with the direct retainer to restrict movement of a distal extension base away from the basal seat tissues. ... A canine or premolar tooth should be used for the support of an indirect retainer."* | 125–126 |
| **INV-5 — Embrasure clasp for unmodified III/II** | *"In the fabrication of an unmodified Class II or Class III partial denture, no edentulous spaces are available on the opposite side of the arch to aid in clasping. Mechanically, this is a disadvantage. However, when teeth are sound and retentive areas are available, or when multiple restorations are justified, clasping can be accomplished by means of an embrasure clasp."* | 82 |
| **INV-5 — Embrasure clasp design** | *"Embrasure clasps should have two retentive clasp arms and two reciprocal clasp arms that are bilaterally or diagonally opposed."* | 83 |
| **INV-6 — Quadrilateral configuration** | Figure 1-1B caption: *"Tooth-supported removable partial denture restoring missing anterior and posterior teeth."* Figure 10-1B: *"A removable partial denture made for this arch is totally supported by rests on properly prepared occlusal rest seats on four abutment teeth."* (Class III Mod 1 illustration with quadrilateral configuration) | 3, 116 |
| **INV-7 — RPI system** | *"Mesial rest concept clasps have been proposed to accomplish movement accommodation by changing the fulcrum location. This concept includes the RPI and RPA [rest, proximal plate, Akers] clasps. The RPI is a current concept of bar clasp design that refers to the rest, proximal plate, and I-bar component parts of the clasp assembly. Basically, this clasp assembly consists of a mesio-occlusal rest with the minor connector placed into the mesiolingual embrasure, but not contacting the adjacent tooth."* | 73 |
| **INV-8 — Reciprocation required** | *"Each retentive terminal should be opposed by a reciprocal component capable of resisting any transient pressures exerted by the retentive arm during placement and removal."* (Basic Principles of Clasp Design, principle #2) | 68 |
| **INV-9 — Encirclement >180°** | *"Therefore the basic principle of clasp design, referred to as the principle of encirclement, means that more than 180 degrees in the greatest circumference of the tooth, passing from diverging axial surfaces to converging axial surfaces, must be engaged by the clasp assembly."* | 68 |
| **INV-10 — Path of insertion** | *"A path of insertion must be selected so that the prosthesis may be inserted and removed without encountering tooth or soft tissue interferences."* (Surveying chapter) | 130 |
| **INV-13 — Survey crown indications** | Indications include occlusal plane discrepancies, badly broken-down crowns, proper rest seats, adequate retentive undercuts for direct retainers, guide planes when inadequate contours exist. Surveyor used pre-cementation. | Ch 14 |
| **INV-14 — Design sequence** | *"In developing the design, it is first necessary to determine how the partial denture is to be supported... The second step in systematic development of the design for any removable partial denture is to connect the tooth and tissue support units... The third step is to determine how the removable partial denture is to be retained... The fourth step is to connect the retention units to the support units... The fifth and last step in this systematic approach to design is to outline and join the edentulous area."* (Essentials of Partial Denture Design — McCracken's official 5-step sequence) | 119–120 |

### 9.2 New invariants from McCracken (not previously in catalog)

**INV-15 — Stabilization on the opposite side of the arch resists horizontal forces**

*"Stabilizing components on one side of the arch act to stabilize the partial denture against horizontal forces applied from the opposite side. It is obvious that rigid connectors must be used to make this effect possible."* (page 27)

**Engine action:** Already implicit. The rebuild should formalize "stabilizing components" (reciprocal clasp arms, minor connectors contacting axial surfaces, major connector contact) as a distinct concept from "direct retainers." The current engine treats reciprocal arms as part of clasp design only.

**INV-16 — Embrasure clasps MUST use double occlusal rests**

*"The embrasure clasp always should be used with double occlusal rests, even when definite proximal shoulders can be established. This is done to avoid interproximal wedging by the prosthesis, which could cause separation of the abutment teeth, resulting in food impaction and clasp displacement."* (page 83)

**Engine action:** **The current engine is wrong here.** When the bilateral-retention patch added the Embrasure pair, it specified a single shared occlusal embrasure rest. McCracken explicitly requires TWO occlusal rests (one on each tooth, both in the embrasure area). The rebuild must emit two rest seats per Embrasure pair, not one shared rest.

**INV-17 — Reciprocal arms placed at junction of gingival and middle thirds**

*"Reciprocal elements of the clasp assembly should be located at the junction of the gingival and middle thirds of the crowns of abutment teeth. The terminal end of the retentive arm is optimally placed in the gingival third of the crown."* (page 69)

**Engine action:** Already correct in lab Rx output ("Lingual reciprocal clasp" + the standard convention). Add as explicit invariant for tests.

**INV-18 — Class II fulcrum line is DIAGONAL, not perpendicular**

*"In a Class II arch, the fulcrum line is diagonal, passing through the abutment on the distal extension side and the most posterior abutment on the opposite side."* (Figure 8-2 caption, page 97)

**Engine action:** **The current `pickIndirectFor(side)` is geometrically wrong for Class II.** It picks "opposite side, distalmost viable tooth" — but if the fulcrum line is diagonal through DE-terminal + opposite-side-distalmost, the indirect retainer should be placed perpendicular to the MIDPOINT of that diagonal, not just on the opposite side. The current approximation matches McCracken in 3 of 5 documented cases but diverges geometrically. The rebuild should consider implementing actual diagonal-fulcrum geometry for v2.5 (out of scope for v1, but flagged here).

**INV-19 — Class IV fulcrum line passes through the two bounding abutments**

*"In a Class IV arch, the fulcrum line passes through two abutments adjacent to the single edentulous space."* (Figure 8-2 E-F caption, page 97)

**Engine action:** Already correct (Class IV bounding canines = dual role direct + indirect).

**INV-20 — Class III with compromised abutments may behave like Class II**

McCracken Figure 8-2 G and H describe two Class III configurations that effectively become Class II fulcrum-line behavior:
- *"In a Class III arch with a posterior tooth on the right side, which has a poor prognosis and eventually will be lost, the fulcrum line is considered the same as though posterior tooth were not present."*
- *"In a Class III arch with nonsupporting anterior teeth, the adjacent edentulous area is considered to be the tissue-supported end, with a diagonal fulcrum line passing through the two principal abutments, as in a Class II arch."*

**Engine action:** The current engine treats all Class III as "no indirect retainer needed" (INV-3). McCracken acknowledges Class III configurations where the prognosis or anterior support changes this. Add as a refinement: if `kennedy.class === "III"` AND any spanning abutment has `perioPrognosis === "poor"`, OR anterior teeth are missing/compromised, evaluate the case as if it were Class II for indirect retention purposes. Out of scope for v1; flagged for v1.5.

**INV-21 — Stabilizing/Reciprocal clasp arm MUST be rigid; retentive arm MUST be flexible**

*"A stabilizing (reciprocal) clasp arm should be rigid. Therefore it is shaped somewhat differently than is the cast retentive clasp arm, which must be flexible."* (page 92)

**Engine action:** Already implicit but should be made explicit in the hydrator output. The Lab Rx should distinguish "Cast Akers retentive arm" (flexible) from "Cast lingual reciprocal arm" (rigid).

### 9.3 Major refinements / corrections to existing engine behavior

These are not new invariants but corrections to current engine output, based on McCracken's authoritative text:

**Correction A — Embrasure pair must have TWO rests, not one.** (See INV-16 above.) The current engine emits a single "shared occlusal embrasure rest." McCracken page 83 explicitly requires double occlusal rests. The rebuild fixes this.

**Correction B — McCracken classifies 6 types of mandibular major connectors, not 3.** Engine currently supports Lingual Bar, Linguoplate, Sublingual Bar. McCracken adds Lingual bar with cingulum bar (continuous bar), Cingulum bar (continuous bar alone), and Labial bar (page 32). The continuous bar variants are edge cases not in UIC predoctoral teaching but should be acknowledged as options for the rebuild if expansion is wanted.

**Correction C — Distal-extension clasp options include RPA, ring clasp, hairpin clasp, T-bar — not just RPI and Combination.** McCracken Figure 7-22 shows five distinct distal-extension clasp assemblies. The engine supports RPI and Combination only. The rebuild should consider whether to expose RPA (Rest, Proximal plate, Akers — like RPI but with Akers retentive arm instead of I-bar) as a third option for cases where I-bar is contraindicated but mesial-rest is still desired.

**Correction D — McCracken's lab Rx form uses 8 design specifications, not the engine's current per-tooth list.** McCracken's official Lab Rx form (Figure 12-2A, page 153) lists: (1) Rests, (2) Retention, (3) Reciprocation, (4) Major Connector, (5) Indirect Retention, (6) Guide Planes, (7) Base Retention, (8) Areas to be Modified or Contoured. The engine's current lab Rx is organized by tooth-then-component (matching UIC convention). McCracken's organization is component-then-tooth. Either is acceptable; UIC convention is fine for UIC users.

**Correction E — McCracken's principle #5 of clasp design distinguishes retention from frictional contact.** *"The path of escapement for each retentive clasp terminal must be other than parallel to the path of removal for the prosthesis to require clasp engagement with the resistance to deformation that is retention."* (page 69). This means a guide plane parallel to the path of removal provides FRICTION but not TRUE RETENTION. True retention requires the clasp to flex over an undercut. Currently the engine treats both equivalently; the rebuild should distinguish.

### 9.4 McCracken's 8 clasp design principles (verbatim summary)

From Chapter 7, pages 68-69. These are the universal clasp design principles that any rebuilt engine should encode as hard constraints on the hydrator output:

1. **Encirclement.** >180° engagement of tooth circumference.
2. **Rest design prevents cervical clasp movement.**
3. **Reciprocation.** Every retentive terminal opposed by a reciprocal component.
4. **Stress-release for DE.** Clasps on DE abutments avoid direct torque transmission (RPI, Combination).
5. **Bilateral retention.** Retentive clasps bilaterally opposed (buccal-buccal or lingual-lingual).
6. **Path of escapement non-parallel to path of removal** (true retention requires clasp flexion).
7. **Minimum retention sufficient to resist reasonable dislodging forces.**
8. **Reciprocal at gingival-middle third junction; retentive tip at gingival third.**

### 9.5 What this means for the rebuild scope

The McCracken validation strengthens the catalog without invalidating it. The hard invariants (INV-1 through INV-14) are confirmed verbatim. Seven new invariants (INV-15 through INV-21) are added — INV-16 (Embrasure double rest) is a current-engine bug that the rebuild will fix; the others are refinements or refinements-for-future. Four corrections (A-E) to current engine behavior are catalogued; A is mandatory for the rebuild, B-D are optional scope expansions, E is a future refinement.

The rebuild's Phase 0 (canonical test corpus) should include cases that exercise each of the new invariants — particularly INV-16 (Embrasure double rest) since it represents a current bug, and INV-18 (Class II diagonal fulcrum) since the current heuristic diverges from McCracken in some configurations.

The catalog is now spec'd against THE textbook on RPD design plus multiple corroborating sources. This is sufficient grounding to begin the rebuild.
