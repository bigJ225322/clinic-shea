const RPD_TEETH_MAX = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
const RPD_TEETH_MAND = [17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32];

const RPD_THIRD_MOLARS = new Set([1, 16, 17, 32]);
const RPD_SECOND_MOLARS = new Set([2, 15, 18, 31]);
const RPD_FIRST_MOLARS = new Set([3, 14, 19, 30]);
const RPD_SECOND_PREMOLARS = new Set([4, 13, 20, 29]);
const RPD_FIRST_PREMOLARS = new Set([5, 12, 21, 28]);
const RPD_CANINES = new Set([6, 11, 22, 27]);
const RPD_MAX_INCISORS = new Set([7, 8, 9, 10]);
const RPD_MAND_INCISORS = new Set([23, 24, 25, 26]);
const RPD_ANTERIOR = new Set([6,7,8,9,10,11,22,23,24,25,26,27]);
const RPD_POSTERIOR = new Set([2,3,4,5,12,13,14,15,18,19,20,21,28,29,30,31]);
// Maxillary anteriors: "no-clasp" rule applies here (historically
// called "esthetic omission"). These teeth, when they bound a modification
// space (NOT when they are primary DE abutments or Class IV primary
// abutments), receive rest-only design with long/parallel guide planes,
// no clasp.
const RPD_MAX_ANTERIOR = new Set([6, 7, 8, 9, 10, 11]);
// Esthetic zone for I-bar (esthetic) clasp choice — includes both arches
// since lower anteriors are still visible enough to justify an esthetic
// clasp variant when one is required.
const RPD_ESTHETIC_ZONE = new Set([6, 7, 8, 9, 10, 11, 22, 23, 24, 25, 26, 27]);

const rpdArchTeeth = (arch) => arch === "maxillary" ? RPD_TEETH_MAX: RPD_TEETH_MAND;
const rpdArchOf = (n) => (n >= 1 && n <= 16) ? "maxillary": "mandibular";

// Patient's right vs left
const rpdSideOf = (n) => {
 if ((n >= 1 && n <= 8) || (n >= 25 && n <= 32)) return "right";
 return "left";
};

// "Distal rank" — 1 = central incisor, increases toward distal end of arch.
// Used to identify "most posterior" teeth (Applegate's Rule 5).
const rpdDistalRank = (n) => {
 const m = {
 8:1,9:1,24:1,25:1, 7:2,10:2,23:2,26:2, 6:3,11:3,22:3,27:3,
 5:4,12:4,21:4,28:4, 4:5,13:5,20:5,29:5, 3:6,14:6,19:6,30:6,
 2:7,15:7,18:7,31:7, 1:8,16:8,17:8,32:8,
 };
 return m[n] || 0;
};

// Mirror across the midline (#21 ↔ #28, #8 ↔ #9, etc.) — contralateral, SAME arch
const rpdMirrorTooth = (n) => {
 if (n >= 1 && n <= 16) return 17 - n;
 if (n >= 17 && n <= 32) return 49 - n;
 return null;
};

// Opposing antagonist tooth in the OTHER arch (#2 ↔ #31, #15 ↔ #18, etc.).
// Used for Applegate Rule 4 (2nd molar opposing-arch check).
const rpdOpposingTooth = (n) => {
 if (n >= 1 && n <= 32) return 33 - n;
 return null;
};

const rpdToothName = (n) => `#${n}`;
const rpdToothList = (arr) => arr.map(rpdToothName).join(", ");

// Default abutment attributes — student flips only what's abnormal.
const RPD_ABUTMENT_DEFAULTS = {
 tilt: "normal", // normal | tilted | extreme
 crownHeight: "normal", // normal | short
 perioPrognosis: "good", // good | fair | poor | hopeless
 mesialRestPossible: true,
 distalRestPossible: true,
 occlusalInterference: false, // blocks rest seat at mesial
 existingRestorations: "none", // none | small | extensive
 enamelIntegrityAtRestSeat: "sufficient",
 undercutLocation: "mid-buccal", // mid-buccal | mesio-buccal | disto-buccal | none
 undercutDepth: 0.01, // inches
 attachedGingivaAdequate: true,
 highFrenum: false, // in I-bar approach path
 softTissueUndercut: "none", // none | leq-1mm | gt-1mm
};

// Verbatim rationale strings (from NotebookLM-sourced materials).
const RPD_RATIONALE = {
 major: {
 "A-P Strap": "Rigid major connector of choice for Maxillary Kennedy Class I and II. Two transverse straps (8 mm anterior, 6-8 mm posterior) connected laterally provide cross-arch rigidity essential for distal extension support.",
 "A-P Strap (Class III)":"Rigid major connector for bilateral tooth-supported Maxillary Class III when both quadrants have substantial edentulous spans. A-P configuration provides more rigidity than a single Strap for wider-span cases.",
 "Single Palatal Strap": "Rigid major connector of choice for short-span Maxillary Class III. Single transverse strap, 8 mm minimum width, positioned across rugae with 6 mm clearance from gingival margins anteriorly and 6 mm anterior to vibrating line posteriorly.",
 "Full Palatal Plate": "Connector of choice when few abutments remain (≤4 abutments, typically distributed). Maximum stability + retention via broad palatal coverage; posterior border AT vibrating line. Rigid plate; not for severe gag reflex patients.",
 "U-Shaped Connector": "Used due to large inoperable maxillary tori or severe sensitive gag reflex that cannot tolerate palatal coverage. Least rigid maxillary major connector — last-resort choice; avoid for Class I/II distal extensions if at all possible.",
 "Lingual Bar": "Major connector of choice when sufficient lingual sulcus space exists (≥8 mm from gingival margin to floor of mouth). Half-pear cross-section, 4 mm vertical height, superior border ≥3 mm below gingival margins. Minimal tissue coverage, easiest for patient to adapt to.",
 "Lingual Plate": "Connector of choice when lingual sulcus depth is insufficient (<8 mm). Extends from same superior position as Lingual Bar onto cingula of anterior teeth; finishes on tooth surface (not gingival margin). MUST be paired with rests at terminal abutments to prevent ortho force on anteriors.",
 "Lingual Plate (Tori)": "Used due to presence of mandibular tori obstructing the Lingual Bar inferior border. Plate covers tori and routes superior to them; surgical removal of tori is the preferred alternative if patient is amenable.",
 "Sublingual Bar": "Alternative to Lingual Bar when high lingual frenum / shallow lingual sulcus prevents standard Lingual Bar AND Lingual Plate is contraindicated (healthy mobile anteriors, perio concerns with lingual plate contact). Bar sits in sublingual space below standard Lingual Bar position. Uncommon at.",
 },
 clasp: {
 "Akers": "Cast circumferential clasp of choice for tooth-supported abutments (Kennedy III/IV). Engages 0.01\" buccal undercut on mesial half of tooth; rigid until terminal third where it flexes into undercut. Reciprocation by opposite-arch plating or cast lingual arm. NOT for distal extension (causes Class I torquing).",
 "RPI": "Stress-releasing clasp assembly of choice for distal-extension abutments (Kennedy I/II) (Retainers PDF p. 16, 31, 35). Rest mesial + Proximal plate distal (house spec: covers 1/2 to 2/3 of the occluso-gingival height of the distal proximal surface — Kratochvil-vs-Krol compromise, Retainers p. 31) + I-bar engaging 0.01\" mid-buccal undercut at gingival 1/3. I-bar geometry: 3 mm horizontal arm + 1.5 mm vertical engagement (Retainers p. 32). Vertical-projection I-bar rotates AWAY from abutment under occlusal load → stress-release.",
 "Combination": "Stress-releasing clasp assembly when RPI is contraindicated (vestibular depth <5 mm, undercut location mid-mesial/MB/DB). Cast rest + 18ga wrought-wire C-clasp arm engaging 0.02\" undercut; wrought wire flexes more than cast metal under stress.",
 "I-bar (esthetic)": "Clasp of choice for the esthetic zone (canine/premolar) when display is high. I-bar approach is invisible below gingival line; rest seat is cingulum (canine) or occlusal (premolar). Requires ≥5 mm vestibular depth and a buccal undercut.",
 "Reverse Akers": "Used when ONLY a mesial/lingual undercut is available on a bicuspid or cuspid (NEVER molar — aspiration risk per Retainers PDF p. 27). Cast clasp originates from the distal aspect of the tooth and wraps to engage a mesio-lingual undercut. Tier-downgraded for molars (use Combination or Embrasure instead).",
 "Embrasure": "Clasp of choice for a quadrant with no edentulous space (Class III mod 0 where retention is needed on a quadrant where no teeth are missing). Two opposing C-clasps cradle adjacent teeth at the embrasure; each engages a 0.01\" undercut. Requires a prepped occlusal rest seat at the embrasure between the two teeth.",
 "Ring": "Cast retainer for a tilted molar abutment where multiple undercut surfaces require encirclement. 360° wraparound with auxiliary occlusal rest; rare in modern practice.",
 "WW C-clasp": "18ga wrought-wire C-clasp for INTERIM RPD only (Summer 2023 IPD lecture). 0.02\" undercut engagement. Wrought wire is flexible enough to bend chairside but cannot be used in cast definitive frameworks.",
 "Ball Clasp": "18ga wrought-wire ball clasp engaging buccal embrasure (Summer 2023 IPD lecture). INTERIM only; provides retention without etching tooth surface. Common on mandibular premolar embrasures.",
 },
 guidePlane: {
 standard: "Establishes path of insertion. Cylindrical diamond bur prep on proximal surface of abutment adjacent to edentulous span; parallel to other guide planes in the arch; 2-3 mm occluso-gingival height, full B-L width.",
 longParallel: "Provides secondary retention via frictional contact along extended parallel surface. Used when primary undercut retention is marginal — the long parallel surface adds resistance to dislodgement during chewing.",
 },
 rest: {
 indirectFulcrum: "Indirect retainer placed perpendicular to the fulcrum line, as far from the axis of rotation as possible, to resist up-lifting of the distal extension base when masticatory forces displace the saddle apically (-10). Standard locations: max canines for Class I/II, mand canines or first premolars for mand Class I/II.",
 classIVAnterior: "Posterior rests provide indirect retention and additional support for the anterior edentulous span. Class IV fulcrum line runs through the two bounding anterior abutments; posterior rests sit perpendicular to this line, distal to bounding abutments.",
 additionalSupport: "Additional rest to distribute occlusal forces away from compromised abutment. Used when a single rest would overload a periodontally compromised tooth; spreading load across multiple rests reduces per-tooth force.",
 },
 base: {
 "Open Lattice": "Replace tooth and tissue; provides maximum acrylic retention (Denture Base Considerations p. 12). Cast metal grid pattern with through-holes for acrylic; standard for distal extensions and most tooth-supported spans ≥2 teeth. Required carrier for distal tissue stops. Border-mold the denture base into the vestibule like a complete denture. Acrylic base permits reline/rebase; metal bases are CONTRAINDICATED for distal extensions and recent extraction sites because they cannot be relined.",
 "Mesh": "Used where there is limited inter-occlusal space (Denture Base Considerations p. 13). Fine metal mesh provides acrylic retention with thinner profile than Open Lattice. Preferred for anterior spans ≥3 teeth (esthetic-bulk reduction). rule of thumb: mesh anterior / lattice posterior in mixed cases.",
 "Tube Tooth": "Used in tooth-supported area with limited vertical space on a well-healed ridge (≥6 mo post-extraction) (Denture Base Considerations p. 14). Metal sleeve cast into the framework; prosthetic tooth slides into sleeve. RED-TEXT rule: denture tooth must be sent to lab AT framework fabrication, set in ideal position.",
 "Facing": "Used for anterior single-tooth replacement with extremely limited vertical space + non-resorbed ridge (Denture Base Considerations p. 15). Metal backing supports a prosthetic tooth facing; ridge surface exposed. RED-TEXT rule: denture tooth must be sent to lab AT framework fabrication.",
 "_stressBearing": "STRESS-BEARING ANATOMY (Denture Base Considerations pp. 17-19):\n • MAXILLARY primary: lateral hard palate (cover for support) + posterior ridge (main distal-extension support). Secondary: buccal/lingual slopes (horizontal counters). RELIEF REQUIRED over incisive papilla + median palatal raphe.\n • MANDIBULAR primary: BUCCAL SHELF + RETROMOLAR PAD (dense cortical bone, perpendicular to occlusal forces, non-resorbing). Secondary: lingual slope. CREST NEEDS RELIEF (cancellous bone, continuous resorption — direct framework contact accelerates loss).\n • Ideal residual ridge: non-resorbing stress-bearing surface (cortical over dense cancellous), broad flat crest, increased height, saddle-shape, firm dense fibrous CT cover.\nDENTURE TOOTH MATERIAL: porcelain teeth are NO LONGER USED — they increase ridge resorption (rigid impact on bone), rely on fragile diatoric mechanical retention, fracture easily, and accelerate opposing dentition wear. default = acrylic teeth.\nOCCLUSAL LOAD FACTORS:\n • Patient sex: women generate ~20 lbs less occlusal force than men.\n • FMA (Frankfort-mandibular plane angle) classification: NORMAL 25° ± 5°; HIGH (long-face, weaker masseter pull) >30°; LOW (short-face, stronger masseter pull) <20°. High-FMA patients tolerate higher occlusal loads less well; consider narrower occlusal table + non-anatomic teeth to reduce load.\n • Narrow occlusal table reduces force on residual ridge — preferred for distal extension cases with severe resorption.",
 },
 reciprocation: {
 plate: "Reciprocation provided by the major connector plating opposite the retentive arm. When retentive arm engages buccal undercut, plating on lingual/palatal surface counteracts the buccal-pull force during insertion — prevents tooth torquing.",
 arm: "Cast lingual/buccal reciprocal arm opposing the retentive arm. Used when major connector does not contact the abutment surface opposite the retentive arm; the arm provides the counter-force at the survey line.",
 },
 framework: {
 "Co-Cr": "Standard favorable choice for RPD frameworks (default per Final Impressions p. 18). Cobalt-chromium alloy; 0.5-1.0 mm major connector thickness; excellent rigidity-to-weight ratio; biocompatible; predictable casting; standard unless allergy.",
 "Gold": "Used for documented metal allergy with Managing Partner approval. Type IV gold alloy is the metallic alternative for Co-Cr-allergic patients; significantly more expensive; same design specs as Co-Cr but slightly less rigid (compensate with thicker major connector if appropriate).",
 },
};

const RPD_AXIUM_CODES = {
 definitive: { maxillary: "D5213", mandibular: "D5214" },
 interim: { maxillary: "D5820", mandibular: "D5821" },
};

const rpdIsPresent = (caseInput, n) => caseInput.teeth[n]?.status === "present";
const rpdGetAttrs = (caseInput, n) => ({...RPD_ABUTMENT_DEFAULTS,...(caseInput.teeth[n]?.attrs || {}) });

// ============================================================================
// KENNEDY CLASSIFIER — Applegate's Rules 1–6
// ============================================================================

/**
 * Filter teeth that are "in play" for classification:
 * - Rule 2/3: 3rd molars excluded if missing and not flagged for replacement.
 * - Rule 4: 2nd molars excluded if missing AND the contralateral 2nd molar
 * is also missing/not-to-be-replaced.
 */
function rpdGetInPlayTeeth(caseInput) {
 return rpdArchTeeth(caseInput.arch).filter(n => {
 const status = caseInput.teeth[n]?.status || "present";
 const replace = caseInput.teeth[n]?.replace || false;
 // Rule 2: 3rd molar missing + not to be replaced → exclude from classification.
 if (RPD_THIRD_MOLARS.has(n) && status !== "present" && !replace) return false;
 // Rule 4 (corrected per NotebookLM/): applies to 2nd molars; the trigger is
 // the OPPOSING (cross-arch antagonist) 2nd molar being missing — NOT the
 // contralateral 2nd molar in the same arch.
 if (RPD_SECOND_MOLARS.has(n) && status !== "present" && !replace) {
 const opp = rpdOpposingTooth(n);
 const oppStatus = caseInput.teeth[opp]?.status || "present";
 const oppReplace = caseInput.teeth[opp]?.replace || false;
 if (oppStatus !== "present" && !oppReplace) return false;
 }
 return true;
 });
}

/**
 * Walk in-play teeth in arch order, group runs of missing teeth into spans,
 * then annotate each span with bounding teeth, sides crossed, and span type
 * (distal-extension / anterior / tooth-supported).
 */
function rpdGetEdentulousSpans(caseInput) {
 const arch = caseInput.arch;
 const inPlay = rpdGetInPlayTeeth(caseInput);
 const ordered = rpdArchTeeth(arch);
 const inPlaySet = new Set(inPlay);

 const spans = [];
 let current = null;
 for (const n of inPlay) {
 if (!rpdIsPresent(caseInput, n)) {
 if (!current) current = { teeth: [n] };
 else current.teeth.push(n);
 } else {
 if (current) { spans.push(current); current = null; }
 }
 }
 if (current) spans.push(current);

 for (const span of spans) {
 const sides = new Set(span.teeth.map(rpdSideOf));
 span.crossesMidline = sides.size > 1;
 span.containsAnterior = span.teeth.some(n => RPD_ANTERIOR.has(n));
 span.containsPosterior = span.teeth.some(n => RPD_POSTERIOR.has(n));

 const idxFirst = ordered.indexOf(span.teeth[0]);
 const idxLast = ordered.indexOf(span.teeth[span.teeth.length - 1]);

 let beforeBound = null;
 for (let i = idxFirst - 1; i >= 0; i--) {
 if (inPlaySet.has(ordered[i]) && rpdIsPresent(caseInput, ordered[i])) {
 beforeBound = ordered[i]; break;
 }
 }
 let afterBound = null;
 for (let i = idxLast + 1; i < ordered.length; i++) {
 if (inPlaySet.has(ordered[i]) && rpdIsPresent(caseInput, ordered[i])) {
 afterBound = ordered[i]; break;
 }
 }
 span.beforeBound = beforeBound; // toward index 0 of array
 span.afterBound = afterBound; // toward end of array

 // Detect distal extension: span runs off the end of the arch on a side
 // For max (array order = right→left): beforeBound=null + right teeth = DE right
 // For mand (array order = left→right): beforeBound=null + left teeth = DE left
 span.isDistalExtensionRight = false;
 span.isDistalExtensionLeft = false;
 if (arch === "maxillary") {
 if (beforeBound === null && span.teeth.some(n => rpdSideOf(n) === "right")) span.isDistalExtensionRight = true;
 if (afterBound === null && span.teeth.some(n => rpdSideOf(n) === "left")) span.isDistalExtensionLeft = true;
 } else {
 if (beforeBound === null && span.teeth.some(n => rpdSideOf(n) === "left")) span.isDistalExtensionLeft = true;
 if (afterBound === null && span.teeth.some(n => rpdSideOf(n) === "right")) span.isDistalExtensionRight = true;
 }

 if (span.isDistalExtensionRight || span.isDistalExtensionLeft) {
 span.type = "distal-extension";
 } else if (span.crossesMidline && span.containsAnterior && !span.containsPosterior) {
 span.type = "anterior";
 } else {
 span.type = "tooth-supported";
 }
 }
 return spans;
}

function rpdClassifyKennedy(caseInput) {
 const spans = rpdGetEdentulousSpans(caseInput);
 if (spans.length === 0) {
 return { class: null, modifications: 0, description: "Fully dentate — no RPD indicated", spans: [], primarySpans: [], modSpans: [], deSide: null };
 }
 const hasRightDE = spans.some(s => s.isDistalExtensionRight);
 const hasLeftDE = spans.some(s => s.isDistalExtensionLeft);

 let kennedyClass, deSide = null;
 if (hasRightDE && hasLeftDE) {
 kennedyClass = "I";
 } else if (hasRightDE) {
 kennedyClass = "II"; deSide = "right";
 } else if (hasLeftDE) {
 kennedyClass = "II"; deSide = "left";
 } else {
 const isAnteriorOnly = spans.length === 1 && spans[0].type === "anterior";
 kennedyClass = isAnteriorOnly ? "IV": "III";
 }

 let primarySpans;
 if (kennedyClass === "I" || kennedyClass === "II") {
 primarySpans = spans.filter(s => s.type === "distal-extension");
 } else if (kennedyClass === "IV") {
 primarySpans = [...spans];
 } else {
 // Class III: primary = most posterior bounded span
 primarySpans = [spans.reduce((a, b) => {
 const ra = Math.max(...a.teeth.map(rpdDistalRank));
 const rb = Math.max(...b.teeth.map(rpdDistalRank));
 return rb > ra ? b: a;
 })];
 }
 const modSpans = spans.filter(s => !primarySpans.includes(s));

 return {
 class: kennedyClass,
 modifications: modSpans.length,
 description: modSpans.length === 0 ? `Kennedy Class ${kennedyClass}`: `Kennedy Class ${kennedyClass} Modification ${modSpans.length}`,
 spans, primarySpans, modSpans, deSide,
 };
}

// ============================================================================
// MAJOR CONNECTOR — maxillary + mandibular decision trees
// ============================================================================

function rpdSelectMajorConnector(caseInput, kennedy) {
 const m = caseInput.measurements || {};
 const pf = caseInput.patientFactors || {};
 const arch = caseInput.arch;

 if (arch === "mandibular") {
 if (pf.mandibularTori) {
 return { type: "Lingual Plate", rationale: RPD_RATIONALE.major["Lingual Plate (Tori)"], width: "8mm contact above gingival third", note: "relief for mandibular tori", tier: "strong" };
 }
 // Sublingual Bar indication: high lingual frenum AND sulcus too
 // shallow for a standard Lingual Bar (≥8mm). The Sublingual Bar sits
 // in the floor of mouth below where the Lingual Bar would normally
 // sit — used when Lingual Plate is contraindicated (e.g., healthy
 // mobile anteriors that shouldn't be braced by a plate).
 const highFrenum = !!pf.highLingualFrenum;
 const shallowSulcus = (m.lingualSulcusDepth ?? 0) < 8;
 if (highFrenum && shallowSulcus) {
 return {
 type: "Sublingual Bar", rationale: RPD_RATIONALE.major["Sublingual Bar"],
 width: "4mm bar in floor of mouth",
 note: "patient must tolerate sublingual contact during function",
 tier: "judgment",
 alternative: "Lingual Plate",
 alternativeRationale: "Lingual Plate is the safer choice when sulcus depth is <8mm. Selected Sublingual Bar here only because the high lingual frenum prevents standard Lingual Bar placement AND there's a reason to avoid Lingual Plate (e.g., healthy mobile anteriors, periodontal concerns).",
 };
 }
 if (shallowSulcus) {
 return {
 type: "Lingual Plate", rationale: RPD_RATIONALE.major["Lingual Plate"],
 width: "8mm contact above gingival third",
 tier: "common",
 alternative: "Lingual Bar",
 alternativeRationale: "Lingual Bar is the lighter alternative when lingual sulcus depth ≥8mm. Selected Lingual Plate here because measured sulcus depth is <8mm.",
 };
 }
 // Severe vertical ridge resorption in Class I — switch to Lingual Plate
 // even with adequate sulcus depth. McCracken 12e Ch 5 lists this as
 // Linguoplate indication #2: "In those instances in which the residual
 // ridges in Class I arch have undergone such vertical resorption that
 // they will offer only minimal resistance to horizontal rotations of
 // the denture through its bases." CDEworld co-equally cites "excessive
 // vertical resorption" alongside high frenum and inadequate lingual
 // depth as a lingual-plate trigger.
 //
 // Scoped to Class I because that's where McCracken specifies the
 // rotation-resistance rationale. For Class II/III/IV with severe
 // resorption the literature is less convergent — the engine stays
 // conservative and uses the default lingual-bar logic there.
 if (kennedy.class === "I" && m.ridgeResorption === "severe") {
 return {
 type: "Lingual Plate", rationale: RPD_RATIONALE.major["Lingual Plate"],
 width: "8mm contact above gingival third",
 note: "severe ridge resorption: plate adds horizontal rotation resistance the resorbed ridge can no longer provide (McCracken 12e Ch 5)",
 tier: "common",
 alternative: "Lingual Bar",
 alternativeRationale: "Lingual Bar is acceptable if the resorption is mild-moderate or if the patient cannot tolerate plate contact on the anteriors. With severe resorption + Class I, McCracken Ch 5 indication #2 explicitly favors the plate for rotation resistance.",
 };
 }
 return {
 type: "Lingual Bar", rationale: RPD_RATIONALE.major["Lingual Bar"],
 width: "4mm + 4mm clearance from gingival margin",
 tier: "common",
 alternative: "Lingual Plate",
 alternativeRationale: "Lingual Plate is indicated if the patient has mandibular tori or if lingual sulcus depth is <8mm. Selected Lingual Bar here because sulcus is adequate and no tori.",
 };
 }

 // Maxillary
 if (pf.maxillaryTori || pf.sensitiveGagReflex) {
 const reason = pf.maxillaryTori ? "relief for maxillary tori": "configured around gag reflex";
 return { type: "U-Shaped Connector", rationale: RPD_RATIONALE.major["U-Shaped Connector"], note: reason, tier: "strong" };
 }
 // Count abutment teeth (span-boundary teeth), not raw present-tooth count.
 // "Few teeth remain" threshold must use ABUTMENTS because bystander teeth
 // (teeth present but not adjacent to any edentulous span) inflate the raw
 // count without contributing structural support to the design.
 //
 // Design Case I (6 abutments: #2,#4,#6,#9,#11,#12) → A-P Strap
 // Design Case II (4 abutments: #4,#6,#11,#12; #5 is a bystander; 5 present)
 //   → Full Palatal Plate per Dr. Shahin answer key
 //
 // presentCount ≤ 4 was wrong for Design Case II (gave A-P Strap).
 // abutmentCount ≤ 4 correctly captures both cases.
 const fppArchMin = arch === "maxillary" ? 1 : 17;
 const fppArchMax = arch === "maxillary" ? 16 : 32;
 const fppIsPresent = (n) =>
   n >= fppArchMin && n <= fppArchMax && caseInput.teeth?.[n]?.status !== "missing";
 const fppAbutSet = new Set();
 for (const span of kennedy.spans || []) {
   const spanTeeth = span.teeth || [];
   if (spanTeeth.length === 0) continue;
   const minT = Math.min(...spanTeeth);
   const maxT = Math.max(...spanTeeth);
   for (let t = minT - 1; t >= fppArchMin; t--) {
     if (fppIsPresent(t)) { fppAbutSet.add(t); break; }
   }
   for (let t = maxT + 1; t <= fppArchMax; t++) {
     if (fppIsPresent(t)) { fppAbutSet.add(t); break; }
   }
 }
 const abutmentCount = fppAbutSet.size;
 const severeResorption = (m.ridgeResorption === "severe");
 // Full Palatal Plate: Kennedy Class I (bilateral posterior DE) with ≤4
 // span-boundary abutments, OR severe resorption any class.
 //
 // Why Class I specifically? Class I means BOTH posterior quadrants are DEs
 // — zero posterior tooth support remains. Remaining support comes entirely
 // from anterior teeth. Full Palate's broad palatal coverage is the right
 // connector choice because the A-P strap depends on bilateral posterior
 // abutment engagement that Class I cannot provide.
 //
 // Classes III/IV with similarly-small abutment counts (e.g. Case 7: Class III
 // with 4 abutments) still have bounded spans and bilateral posterior support
 // — they route to Single Palatal Strap / A-P Strap as appropriate.
 //
 // Threshold of 4 derived from Design Case II (Class I, 4 abutments → Full
 // Palate per Dr. Shahin) vs Case 3 test (Class I, 4 abutments → Full Palate).
 // The raw present-tooth count was wrong because bystander tooth #5 inflated
 // it to 5, causing the engine to pick A-P Strap incorrectly.
 if ((kennedy.class === "I" && abutmentCount <= 4) || severeResorption) {
 return {
 type: "Full Palatal Plate", rationale: RPD_RATIONALE.major["Full Palatal Plate"],
 note: "0.5mm beading on tissue side",
 tier: "judgment",
 alternative: "A-P Strap",
 alternativeRationale: "Full Palatal Plate selected for Kennedy Class I with ≤4 abutments: bilateral distal extensions leave no posterior tooth support, and remaining anterior teeth alone cannot stabilize an A-P Strap. Broad palatal coverage is required for maximum tissue-supported stability. Bystander teeth (present but not flanking any span) are excluded from the count.",
 };
 }
 if (kennedy.class === "I" || kennedy.class === "II") {
 return { type: "A-P Strap", rationale: RPD_RATIONALE.major["A-P Strap"], width: "8mm each strap, 6mm gingival clearance", note: "0.5mm beading on tissue side", tier: "strong" };
 }
 if (kennedy.class === "III") {
 // Bilateral abutment check: a Single Palatal Strap (and an A-P
 // Strap, for that matter) requires abutments on BOTH sides of the
 // midline so the connector can span the palate to provide
 // bilateral retention/bracing. If all the edentulous spaces are
 // on ONE side of the arch, abutments are unilateral — a
 // palatal-strap design has no contralateral support and would
 // tip under load. Clinically, this scenario is almost always
 // treated with a fixed partial denture (bridge), not an RPD.
 //
 // Compute abutments by taking each span's bounding teeth.
 const archMin = arch === "maxillary" ? 1: 17;
 const archMax = arch === "maxillary" ? 16: 32;
 const isPresentInCase = (n) =>
 n >= archMin && n <= archMax && caseInput.teeth?.[n]?.status !== "missing";
 const abutSet = new Set;
 for (const span of kennedy.spans || []) {
 const teeth = span.teeth || [];
 if (teeth.length === 0) continue;
 const minT = Math.min(...teeth);
 const maxT = Math.max(...teeth);
 // Walk mesially / distally until we find a present tooth — that's
 // an abutment for this span.
 for (let t = minT - 1; t >= archMin; t--) {
 if (isPresentInCase(t)) { abutSet.add(t); break; }
 }
 for (let t = maxT + 1; t <= archMax; t++) {
 if (isPresentInCase(t)) { abutSet.add(t); break; }
 }
 }
 const isMaxArch = arch === "maxillary";
 const rightAbuts = [...abutSet].filter(n => isMaxArch ? n <= 8: n >= 25);
 const leftAbuts = [...abutSet].filter(n => isMaxArch ? n >= 9: n <= 24);
 const isBilateral = rightAbuts.length > 0 && leftAbuts.length > 0;

 if (!isBilateral) {
 // Unilateral abutments: no palatal-strap design works (those need
 // bilateral support). Clinical reality splits by span length:
 //
 // - Short span (≤3 missing teeth): a 3-to-5-unit FPD spanning the
 // edentulous gap is the treatment of choice. An RPD is genuine
 // overtreatment — the user is not getting a giant palatal plate
 // for a 2-tooth gap that a bridge handles cleanly.
 //
 // - Long span (>3 missing teeth): the bridge becomes unreasonable
 // under Ante's law and the patient may genuinely need a removable
 // appliance. Full Palatal Plate is the least-wrong RPD option
 // here — it's the only connector that doesn't strictly require
 // contralateral abutments, covering the palate via tissue contact.
 const totalMissing = (kennedy.spans || []).reduce((s, sp) => s + (sp.teeth?.length || 0), 0);
 if (totalMissing <= 3) {
 // the curriculum has no unilateral RPD design for short tooth-
 // bounded spaces — the Nesbit RPD is explicitly banned (aspiration
 // risk; Final RPD Huddle 2 answer key Q2). Fixed treatment is the
 // first choice; if the patient declines fixed, the fallback is
 // an Interim Partial Denture (IPD) with non-metal clasps, which
 // is indicated for "Class III or short-span IV" per the IPD
 // lecture and contraindicated for Class I/II.
 return {
 type: "FPD",
 recommendsFixed: true,
 rationale: `Short unilateral tooth-bounded space (${totalMissing} missing teeth in one span on one side). The clinical treatment of choice is a ${totalMissing + 2}-unit fixed partial denture (bridge) — definitive RPD is not indicated for this configuration. The unilateral abutment geometry would force a Full Palatal Plate, which is overtreatment for a gap a bridge handles cleanly.`,
 tier: "strong",
 alternative: "Implant-supported crowns or Interim Partial Denture (non-metal clasp)",
 alternativeRationale: "Primary alternative if the patient declines bridging: individual implant crowns at each missing-tooth site. If the patient declines BOTH FPD and implants (cost, surgical contraindication), indicates an Interim Partial Denture (IPD) with non-metal (e.g., Valplast/Duraflex thermoplastic) clasps — explicitly indicated for Class III / short-span IV cases per the IPD lecture. Unilateral cantilever (Nesbit) RPDs are banned due to aspiration risk; definitive cast-metal RPD is not appropriate for this configuration.",
 };
 }
 // Long unilateral span — fall back to Full Palatal Plate as the
 // least-wrong RPD option, but flag the case for review.
 return {
 type: "Full Palatal Plate",
 rationale: `Long unilateral edentulous span (${totalMissing} missing teeth) without contralateral abutments. Palatal-strap designs (Single Palatal Strap, A-P Strap) require bilateral support that this case lacks. Full Palatal Plate provides the most bilateral coverage by tissue contact across the contralateral palate.`,
 note: "Consider implant-supported FPD spanning the gap as the preferred definitive treatment.",
 tier: "judgment",
 alternative: "Implant-supported FPD",
 alternativeRationale: "A long unilateral edentulous space is usually treated with multiple implants and an implant-supported FPD rather than a tissue-borne RPD. Definitive RPD is reserved for cases where the patient can't pursue implants (cost, anatomic, or medical contraindications).",
 };
 }

 const isShortSpan = kennedy.spans.every(s => s.teeth.length <= 2);
 if (isShortSpan) {
 return {
 type: "Single Palatal Strap", rationale: RPD_RATIONALE.major["Single Palatal Strap"],
 width: "8mm strap", note: "0.5mm beading on tissue side",
 tier: "common",
 alternative: "A-P Strap",
 alternativeRationale: "A-P Strap is also acceptable for Class III when added rigidity is desired (e.g., bilateral long modification spans). Selected Single Palatal Strap here because all spans are ≤2 teeth.",
 };
 }
 return {
 type: "A-P Strap", rationale: RPD_RATIONALE.major["A-P Strap (Class III)"],
 width: "8mm each strap", note: "0.5mm beading on tissue side",
 tier: "common",
 alternative: "Single Palatal Strap",
 alternativeRationale: "Single Palatal Strap is acceptable for short bilateral Class III spans. Selected A-P Strap here because at least one span exceeds 2 teeth.",
 };
 }
 if (kennedy.class === "IV") {
 return { type: "A-P Strap", rationale: RPD_RATIONALE.major["A-P Strap"], width: "8mm each strap", note: "0.5mm beading on tissue side", tier: "strong" };
 }
 return { type: "A-P Strap", rationale: RPD_RATIONALE.major["A-P Strap"], tier: "strong" };
}

// ============================================================================
// CLASP DECISION — RPI contraindications, Combination fallback, Akers default
// ============================================================================

/**
 * Returns ordered list of triggered RPI contraindications. Empty array = RPI OK.
 * Order matches the official 6-item list (Retainers lecture, RPI Contraindications
 * slide). Two engine-only additions surface practical clinical gaps not in the
 * primary 6 (high frenum and undercut-location accessibility).
 */
function rpdCheckRPIContraindications(attrs) {
 const out = [];
 // #1 — mesial occlusal rest must be possible (biomechanical primary)
 if (!attrs.mesialRestPossible || attrs.occlusalInterference) {
 out.push({ key: "no-mesial-rest", text: "mesial occlusal rest not possible (occlusal interference or decay)" });
 }
 // #2 — soft tissue undercut >1mm at 4–5mm below the buccal gingival margin
 if (attrs.softTissueUndercut === "gt-1mm") {
 out.push({ key: "soft-tissue-undercut", text: "soft tissue undercut >1mm at 4–5mm below the buccal gingival margin" });
 }
 // #3 — vestibular depth ≤5mm (checked at case level, caller adds it; left
 // here for completeness if attrs override at per-tooth level)
 // #4 — lack of attached gingiva
 if (!attrs.attachedGingivaAdequate) {
 out.push({ key: "no-attached-gingiva", text: "lack of attached gingiva at I-bar crossing" });
 }
 // #5 — extremely tilted crowns
 if (attrs.tilt === "extreme") {
 out.push({ key: "extreme-tilt", text: "extremely tilted crown" });
 }
 // #6 — short clinical crowns
 if (attrs.crownHeight === "short") {
 out.push({ key: "short-crown", text: "short clinical crown" });
 }
 // Engine additions (not in the primary 6 but clinically necessary):
 if (attrs.highFrenum) {
 out.push({ key: "frenum", text: "high frenum in I-bar approach path" });
 }
 // I-bar requires undercut on the BUCCAL side (mid-buccal or mesio-buccal).
 // Distal-buccal or lingual undercuts mean the I-bar cannot engage properly;
 // those abutments need an Akers-family clasp (potentially Reverse Akers if
 // the undercut is on the distal surface).
 if (attrs.undercutLocation === "disto-buccal"
 || attrs.undercutLocation === "disto-lingual"
 || attrs.undercutLocation === "mesio-lingual"
 || attrs.undercutLocation === "none") {
 out.push({ key: "undercut-location", text: `usable undercut not at mid-buccal/mesio-buccal (${attrs.undercutLocation})` });
 }
 return out;
}

function rpdFindEmbrasurePair(caseInput, side) {
 const arch = caseInput.arch;
 const teethList = rpdArchTeeth(arch);

 const isPosterior = (n) =>
 RPD_FIRST_PREMOLARS.has(n) || RPD_SECOND_PREMOLARS.has(n)
 || RPD_FIRST_MOLARS.has(n) || RPD_SECOND_MOLARS.has(n);

 const isAcceptable = (tooth) => {
 if (!rpdIsPresent(caseInput, tooth)) return false;
 if (RPD_THIRD_MOLARS.has(tooth)) return false;
 if (rpdSideOf(tooth) !== side) return false;
 if (!isPosterior(tooth)) return false;
 const attrs = rpdGetAttrs(caseInput, tooth);
 if (attrs.perioPrognosis === "hopeless") return false;
 return true;
 };

 const pairs = [];
 for (let i = 0; i < teethList.length - 1; i++) {
 const a = teethList[i], b = teethList[i + 1];
 if (!isAcceptable(a) || !isAcceptable(b)) continue;
 // Combined distal rank — higher = more posterior = better leverage.
 const score = rpdDistalRank(a) + rpdDistalRank(b);
 pairs.push({ a, b, score });
 }
 if (pairs.length === 0) return null;
 pairs.sort((p, q) => q.score - p.score);
 const winner = pairs[0];
 return [winner.a, winner.b].sort((x, y) => teethList.indexOf(x) - teethList.indexOf(y));
}

/**
 * Fall-back contralateral retainer: the most-posterior present, periodontally
 * acceptable, non-third-molar POSTERIOR tooth on the given side. Anterior
 * teeth are not used here (esthetic zone — would need I-bar esthetic or
 * no-clasp instead, and those don't provide retention on the contralateral
 * side without an adjacent edentulous space to anchor the design).
 * Returns tooth number or null.
 */
function rpdFindContralateralAkers(caseInput, side) {
 const arch = caseInput.arch;
 const teethList = rpdArchTeeth(arch);

 const candidates = teethList.filter(n => {
 if (rpdSideOf(n) !== side) return false;
 if (!rpdIsPresent(caseInput, n)) return false;
 if (RPD_THIRD_MOLARS.has(n)) return false;
 const isPosterior =
 RPD_FIRST_PREMOLARS.has(n) || RPD_SECOND_PREMOLARS.has(n)
 || RPD_FIRST_MOLARS.has(n) || RPD_SECOND_MOLARS.has(n);
 if (!isPosterior) return false;
 const attrs = rpdGetAttrs(caseInput, n);
 if (attrs.perioPrognosis === "hopeless") return false;
 return true;
 });
 if (candidates.length === 0) return null;
 return candidates.reduce((a, b) => rpdDistalRank(b) > rpdDistalRank(a) ? b: a);
}

// ============================================================================
// REBUILD V2 — RetentionPlan + planner (Phase 1)
// ============================================================================
// Top-down retention planner. Builds a RetentionPlan that satisfies every
// hard invariant from RPD-PRINCIPLES.md BY CONSTRUCTION rather than by
// post-hoc patching. Runs alongside the V1 engine during Phase 1-4; the
// V1 orchestrator (rpdRunEngine) does not call this yet.
//
// RetentionPlan schema:
// {
// directRetainers: [{
// tooth: number,
// source: "span-boundary" | "bilateral-invariant-embrasure"
// | "bilateral-invariant-akers" | "kennedy-iv-bounding",
// mechanic: "akers-family" | "rpi-family" | "embrasure-pair" | "rest-only",
// span?: <SpanRef from kennedy.spans>,
// pairedWith?: number, // for embrasure-pair
// roleHint?: string, // optional descriptor for hydrator
// }],
// indirectRetainers: [{
// tooth: number,
// source: "fulcrum-opposite-distalmost" | "kennedy-iv-bounding-dual-role"
// | "kennedy-i-bilateral",
// dualRoleWith?: number, // if also a directRetainer
// }],
// notDesignable: { reason: string } | null,
// }
//
// References:
// - INV-1 (bilateral retention): McCracken p. 69
// - INV-3 (Class III no indirect): McCracken p. 117
// - INV-4 (indirect retainer placement): McCracken p. 125-126
// - INV-5 (Embrasure for unmodified III/II): McCracken p. 82
// - INV-6 (quadrilateral configuration ideal): McCracken Fig 10-1B
// - INV-15 (cross-arch stabilization): McCracken p. 27
// - INV-18 (Class II diagonal fulcrum): McCracken Fig 8-2

function rpdPlanRetention(caseInput, kennedy) {
 // Dispatch by Kennedy class. Each per-class planner encodes its OWN
 // retention pattern explicitly. The mechanics differ structurally:
 // - Class I has bilateral DE terminals → 2 direct + 2 indirect retainers
 // - Class II has unilateral DE → 1+ direct + 1 indirect on opposite side
 // - Class III is tooth-bounded → span-boundary direct retainers,
 // no indirect, bilateral-retention invariant
 // - Class IV has anterior bounding → bounding canines dual-role,
 // potentially with mod spans
 if (!kennedy.class || !(kennedy.spans || []).length) {
 return { directRetainers: [], indirectRetainers: [], notDesignable: null };
 }
 const arch = caseInput.arch;
 const teethList = rpdArchTeeth(arch);

 let plan;
 switch (kennedy.class) {
 case "I": plan = planRetentionClassI(caseInput, kennedy); break;
 case "II": plan = planRetentionClassII(caseInput, kennedy); break;
 case "III": plan = planRetentionClassIII(caseInput, kennedy); break;
 case "IV": plan = planRetentionClassIV(caseInput, kennedy); break;
 default: plan = { directRetainers: [], indirectRetainers: [], notDesignable: null };
 }

 // Sort direct retainers in arch order. Indirect retainers preserved in
 // the order each class planner produces them (Class I returns
 // [right, left]; matches V1 iteration order for stable lab Rx output).
 plan.directRetainers.sort((a, b) =>
 teethList.indexOf(a.tooth) - teethList.indexOf(b.tooth));
 return plan;
}

/**
 * CLASS I — Bilateral distal extension.
 *
 * Retention pattern (McCracken Ch 10):
 * - TWO direct retainers, one per DE terminal abutment, both rpi-family
 * (with Combination fallback when RPI contraindicated)
 * - TWO indirect retainers (bilateral) — one each side, perpendicular to
 * the fulcrum line through the two DE terminals, as anterior as
 * practical
 * - PLUS span-boundary direct retainers for any modification spans
 * - Major connector spans the arch (cross-arch stability)
 */
function planRetentionClassI(caseInput, kennedy) {
 const directRetainers = [];
 const claimed = new Set;

 // Required role 1: TWO DE terminals (one per primary span)
 for (const span of (kennedy.primarySpans || [])) {
 if (span.type !== "distal-extension") continue;
 const terminal = span.beforeBound || span.afterBound;
 if (!terminal || claimed.has(terminal)) continue;
 claimed.add(terminal);
 directRetainers.push({
 tooth: terminal, source: "kennedy-i-de-terminal",
 mechanic: "rpi-family", span,
 roleHint: "de-terminal",
 });
 }

 // Required role 2: span-boundary direct retainers for modification spans.
 // Mandibular canines bounding a purely-anterior TS span (e.g. #22/#27
 // flanking missing incisors) are routed to canineModIndirects instead
 // of directRetainers — they serve as rest-only indirect retainers.
 const canineModIndirects = [];
 for (const span of (kennedy.modSpans || [])) {
 appendSpanBoundaryRetainers({
 span, kennedy, arch: caseInput.arch,
 directRetainers, claimed,
 mandibularCanineAnteriorIndirects: caseInput.arch === "mandibular" ? canineModIndirects : null,
 });
 }

 // Required role 3: bilateral indirect retainers (one per side).
 // If canineModIndirects already provides bilateral (one per arch side)
 // coverage, skip the geometric algorithm — those canines ARE the IRs.
 const canineSides = new Set(canineModIndirects.map(c => rpdSideOf(c.tooth)));
 const hasBilateralCanineIndirects = canineSides.size >= 2;
 const geometricIndirects = hasBilateralCanineIndirects
 ? []
 : planClassIIndirectRetainers(caseInput, kennedy);
 const indirectRetainers = [...canineModIndirects, ...geometricIndirects];

 return { directRetainers, indirectRetainers, notDesignable: null };
}

/**
 * CLASS II — Unilateral distal extension (with optional modifications).
 *
 * Retention pattern (McCracken Ch 10):
 * - ONE direct retainer on the DE terminal (rpi-family / Combination)
 * - PLUS span-boundary direct retainers for any modification spans
 * - ONE indirect retainer on the side OPPOSITE the DE (perpendicular
 * to the diagonal fulcrum line per McCracken Fig 8-2 C)
 * - NO bilateral-direct-retention enforcement (Class II uses indirect
 * on opposite side, not extra direct — McCracken Ch 10)
 */
function planRetentionClassII(caseInput, kennedy) {
 const directRetainers = [];
 const claimed = new Set;

 // Required role 1: ONE DE terminal
 for (const span of (kennedy.primarySpans || [])) {
 if (span.type !== "distal-extension") continue;
 const terminal = span.beforeBound || span.afterBound;
 if (!terminal || claimed.has(terminal)) continue;
 claimed.add(terminal);
 directRetainers.push({
 tooth: terminal, source: "kennedy-ii-de-terminal",
 mechanic: "rpi-family", span,
 roleHint: "de-terminal",
 });
 }

 // Required role 2: modification-span boundaries.
 // Mandibular canines bounding purely-anterior TS spans are routed to
 // canineModIndirects (rest-only indirect retainers, no clasp arm).
 const canineModIndirects = [];
 for (const span of (kennedy.modSpans || [])) {
 appendSpanBoundaryRetainers({
 span, kennedy, arch: caseInput.arch,
 directRetainers, claimed,
 mandibularCanineAnteriorIndirects: caseInput.arch === "mandibular" ? canineModIndirects : null,
 });
 }

 // Required role 3: ONE geometric indirect retainer (opposite side from DE).
 // If canineModIndirects provides bilateral coverage (one canine per side),
 // those canines already satisfy indirect retention — skip the geometry step.
 const canineSides = new Set(canineModIndirects.map(c => rpdSideOf(c.tooth)));
 const hasBilateralCanineIndirects = canineSides.size >= 2;
 const geometricIndirects = hasBilateralCanineIndirects
 ? []
 : planClassIIIndirectRetainers(caseInput, kennedy);
 const indirectRetainers = [...canineModIndirects, ...geometricIndirects];

 return { directRetainers, indirectRetainers, notDesignable: null };
}

/**
 * INV-20 — Detect Class III configurations that effectively behave like
 * Class II for indirect-retention purposes. Per McCracken Fig 8-2 G:
 *
 * "In a Class III arch with a posterior tooth on the right side, which
 * has a poor prognosis and eventually will be lost, the fulcrum line is
 * considered the same as though posterior tooth were not present."
 *
 * Translation: if a span-boundary tooth in a Class III case has poor or
 * hopeless periodontal prognosis, the design should ANTICIPATE the future
 * loss of that tooth — which would turn the case into Class II with a
 * diagonal fulcrum line through the (now-compromised) distal abutment and
 * the opposite-side terminal. The framework therefore needs an indirect
 * retainer on the side OPPOSITE the compromised tooth, perpendicular to
 * that anticipated diagonal fulcrum.
 *
 * Returns { compromisedTooth, compromisedSide, perio } or null.
 */
function detectClassIIICompromisedAbutment(caseInput, kennedy) {
 if (kennedy.class !== "III") return null;
 // Find the most-posterior span-boundary tooth with poor/hopeless perio.
 // Most-posterior because that's the one whose loss would most change the
 // fulcrum geometry (the distal abutment of a span anchors retention).
 let compromised = null;
 for (const span of (kennedy.spans || [])) {
 for (const t of [span.beforeBound, span.afterBound]) {
 if (!t) continue;
 const attrs = rpdGetAttrs(caseInput, t);
 if (attrs.perioPrognosis === "poor" || attrs.perioPrognosis === "hopeless") {
 if (!compromised || rpdDistalRank(t) > rpdDistalRank(compromised.compromisedTooth)) {
 compromised = {
 compromisedTooth: t,
 compromisedSide: rpdSideOf(t),
 perio: attrs.perioPrognosis,
 };
 }
 }
 }
 }
 return compromised;
}

/**
 * CLASS III — Tooth-bounded edentulous space(s), no distal extension.
 *
 * Retention pattern (McCracken Ch 10 + Ch 7 principle #4 + Fig 8-2 G/H):
 * - Direct retainers at every span boundary (akers-family default; max
 * anteriors bordering mod spaces get rest-only per protocol rule)
 * - BILATERAL retention INVARIANT: if span-derived abutments are all on
 * one side, ADD contralateral retention (Embrasure pair preferred per
 * McCracken p. 82; single Akers as fallback; otherwise notDesignable).
 * - NO indirect retainers (no fulcrum line to rotate about — INV-3),
 * EXCEPT when a span-boundary tooth has poor/hopeless perio prognosis
 * (INV-20 / McCracken Fig 8-2 G): treat as if that tooth is already
 * gone (anticipating Class II), and add an indirect retainer on the
 * opposite side.
 * - Ideal: quadrilateral configuration of 4 direct retainers (INV-6)
 */
function planRetentionClassIII(caseInput, kennedy) {
 const directRetainers = [];
 const indirectRetainers = [];
 const claimed = new Set;
 let notDesignable = null;

 // Required role 1: span-boundary direct retainers for every span
 for (const span of (kennedy.spans || [])) {
 appendSpanBoundaryRetainers({
 span, kennedy, arch: caseInput.arch,
 directRetainers, claimed,
 });
 }

 // Required role 2: bilateral-retention invariant (Class III only)
 if (directRetainers.length > 0) {
 const sides = new Set(directRetainers.map(d => rpdSideOf(d.tooth)));
 if (sides.size < 2) {
 const presentSide = sides.values().next().value;
 const missingSide = presentSide === "right" ? "left": "right";

 const pair = rpdFindEmbrasurePair(caseInput, missingSide);
 if (pair) {
 const [t1, t2] = pair;
 if (!claimed.has(t1) && !claimed.has(t2)) {
 claimed.add(t1); claimed.add(t2);
 directRetainers.push({
 tooth: t1, source: "bilateral-invariant-embrasure",
 mechanic: "embrasure-pair", pairedWith: t2,
 roleHint: "contralateral-retention-embrasure",
 });
 directRetainers.push({
 tooth: t2, source: "bilateral-invariant-embrasure",
 mechanic: "embrasure-pair", pairedWith: t1,
 roleHint: "contralateral-retention-embrasure",
 });
 }
 } else {
 const akers = rpdFindContralateralAkers(caseInput, missingSide);
 if (akers != null && !claimed.has(akers)) {
 claimed.add(akers);
 directRetainers.push({
 tooth: akers, source: "bilateral-invariant-akers",
 mechanic: "akers-family",
 roleHint: "contralateral-retention-single-akers",
 });
 } else {
 notDesignable = {
 reason: "Class III configuration with all span-derived abutments on one side AND no viable contralateral retention possible (no acceptable posterior tooth on the missing side). RPD design would be unilateral (Nesbit), which is prohibited (McCracken p. 69 + Final RPD Huddle 2 Q2 — aspiration risk). Recommend fixed prosthesis (FPD or implant) for this configuration.",
 };
 }
 }
 }
 }

 // Required role 3: INV-20 — Class III with compromised boundary tooth.
 // Per McCracken Fig 8-2 G, if a span-boundary abutment has poor/hopeless
 // prognosis, design for anticipated tooth loss → effectively Class II.
 // Add an indirect retainer on the side OPPOSITE the compromised tooth.
 const compromised = detectClassIIICompromisedAbutment(caseInput, kennedy);
 if (compromised) {
 const opposingSide = compromised.compromisedSide === "right" ? "left": "right";
 const ir = pickClassIIIAnticipatedIndirectRetainer(caseInput, kennedy, opposingSide);
 if (ir) {
 indirectRetainers.push({
 tooth: ir.tooth,
 source: "class-iii-anticipated-class-ii",
 anticipatedDueTo: compromised.compromisedTooth,
 perioPrognosis: compromised.perio,
 _legacyData: ir,
 });
 }
 }

 return { directRetainers, indirectRetainers, notDesignable };
}

/**
 * Pick an indirect retainer for a Class III case anticipating Class II
 * behavior (INV-20). Returns a legacy-shape entry the lab Rx generator
 * already knows how to render, or null if no viable tooth exists.
 *
 * Logic mirrors the Class II "opposite side from DE, distalmost viable
 * non-compromised tooth" rule, but applied to the side opposite the
 * compromised Class III boundary.
 */
function pickClassIIIAnticipatedIndirectRetainer(caseInput, kennedy, oppositeSide) {
 const arch = caseInput.arch;
 const teethList = rpdArchTeeth(arch);
 // Identify span-boundary teeth on the opposite side (don't double-up;
 // direct retainers already exist there)
 const oppositeSpanBounds = new Set;
 for (const span of (kennedy.spans || [])) {
 for (const t of [span.beforeBound, span.afterBound]) {
 if (!t) continue;
 if (rpdSideOf(t) === oppositeSide) oppositeSpanBounds.add(t);
 }
 }
 // Find candidates: opposite side, present, non-incisor, non-third-molar,
 // not a span boundary (mod boundaries already get direct retainers), and
 // anterior to the most-posterior present tooth on that side.
 const oppositeSidePresent = teethList.filter(n => rpdSideOf(n) === oppositeSide)
.filter(n => rpdIsPresent(caseInput, n))
.filter(n => !RPD_THIRD_MOLARS.has(n))
.filter(n => !oppositeSpanBounds.has(n));
 if (oppositeSidePresent.length === 0) return null;
 // Prefer first premolar > second premolar > canine (convention for
 // mandibular indirect retainers; reversed for maxillary). Drop incisors.
 const isPremolar = (n) => RPD_FIRST_PREMOLARS.has(n) || RPD_SECOND_PREMOLARS.has(n);
 const isCanine = (n) => RPD_CANINES.has(n);
 // Maxillary: canine preferred (anatomically prominent cingulum)
 // Mandibular: first premolar preferred (canine cingulum often inadequate)
 let pick;
 if (arch === "maxillary") {
 pick = oppositeSidePresent.find(isCanine) || oppositeSidePresent.find(isPremolar);
 } else {
 pick = oppositeSidePresent.find(n => RPD_FIRST_PREMOLARS.has(n))
 || oppositeSidePresent.find(n => RPD_SECOND_PREMOLARS.has(n))
 || oppositeSidePresent.find(isCanine);
 }
 if (!pick) return null;
 // Build a legacy-shape indirect retainer entry the lab Rx generator
 // already knows how to render
 let restType;
 if (RPD_CANINES.has(pick)) {
 restType = arch === "mandibular" ? "ML ball rest": "mesial cingulum rest";
 } else if (RPD_FIRST_PREMOLARS.has(pick) || RPD_SECOND_PREMOLARS.has(pick)) {
 restType = "mesial occlusal rest";
 } else {
 restType = "cingulum rest";
 }
 return {
 tooth: pick,
 restType,
 rationale: `Class III with compromised distal abutment (poor/hopeless prognosis). Per McCracken Fig 8-2 G, design ANTICIPATES future tooth loss, which would convert this case to Class II. Indirect retainer placed on the side opposite the compromised tooth, perpendicular to the anticipated diagonal fulcrum line. ${RPD_RATIONALE.rest.indirectFulcrum}`,
 tier: "common",
 alternativeRationale: "If the compromised tooth's prognosis improves with treatment (perio therapy, endo, splinting), the indirect retainer can be omitted — but designing for the more pessimistic scenario is safer and McCracken-recommended.",
 };
}


/**
 * CLASS IV — Single bounded anterior edentulous space crossing midline.
 *
 * Retention pattern (McCracken Ch 10 + Design Case II):
 * - Bounding teeth (canines, laterals, or premolars depending on extent
 * of anterior loss) serve as DUAL-ROLE direct + indirect retainers
 * - PLUS span-boundary direct retainers for any modification spans
 * - Indirect retention is satisfied STRUCTURALLY by the bounding teeth
 * (the anterior fulcrum line passes through them)
 */
function planRetentionClassIV(caseInput, kennedy) {
 const directRetainers = [];
 const claimed = new Set;

 // Required role 1: bounding teeth of the anterior span
 // (These are span boundaries that need direct retention since the
 // anterior gap IS the primary span. Mechanic = akers-family.)
 for (const span of (kennedy.primarySpans || [])) {
 appendSpanBoundaryRetainers({
 span, kennedy, arch: caseInput.arch,
 directRetainers, claimed,
 // Force akers-family for Class IV bounding (overrides max-anterior
 // rest-only rule, since they're Class IV primary abutments)
 forceMechanicForClassIV: true,
 });
 }

 // Required role 2: modification-span boundaries
 for (const span of (kennedy.modSpans || [])) {
 appendSpanBoundaryRetainers({
 span, kennedy, arch: caseInput.arch,
 directRetainers, claimed,
 });
 }

 // Required role 3: indirect retention via dual-role bounding teeth
 // (delegated to existing rpdPlaceIndirectRetainers Class IV branch which
 // emits ML ball / cingulum / distal ball rests on the bounding teeth)
 const indirectRetainers = planClassIVIndirectRetainers(caseInput, kennedy);

 return { directRetainers, indirectRetainers, notDesignable: null };
}

/**
 * Shared helper: append direct retainers for every present boundary tooth
 * of a span. Determines mechanic (rpi-family / akers-family / rest-only)
 * based on tooth + span + arch context.
 */
function appendSpanBoundaryRetainers({
 span, kennedy, arch, directRetainers, claimed,
 forceMechanicForClassIV = false,
 mandibularCanineAnteriorIndirects = null,
}) {
 for (const tooth of [span.beforeBound, span.afterBound]) {
 if (!tooth) continue;
 if (claimed.has(tooth)) continue;
 const isDE = span.type === "distal-extension";
 const isMaxAnterior = arch === "maxillary" && RPD_MAX_ANTERIOR.has(tooth);
 const isClassIVPrimary = kennedy.class === "IV"
 && (kennedy.primarySpans || []).includes(span);

 // Mandibular canines bounding a PURELY ANTERIOR tooth-supported span
 // (e.g. #22/#27 flanking missing incisors #23-26) serve as rest-only
 // INDIRECT retainers, not clasped direct retainers. With lingual plate
 // the major connector contacts the lingual surface, providing bracing
 // in lieu of a clasp arm. McCracken Ch 5 + UIC Design Case II protocol.
 if (
 mandibularCanineAnteriorIndirects !== null
 && arch === "mandibular"
 && RPD_CANINES.has(tooth)
 && !isDE
 && span.containsAnterior
 && !span.containsPosterior
 ) {
 claimed.add(tooth);
 const spanDesc = (span.teeth || []).map(String).join(", ");
 mandibularCanineAnteriorIndirects.push({
 tooth,
 source: "mand-canine-anterior-mod-bound",
 _legacyData: {
 tooth,
 restType: "ML ball rest",
 rationale:
 `Mandibular canine #${tooth} flanks the anterior modification span (teeth ${spanDesc}). `
 + `It functions as a REST-ONLY indirect retainer — the ML ball rest resists `
 + `rotation of the distal-extension base. No clasp arm is placed: the lingual plate `
 + `contacts and braces the lingual surface, making a clasp arm both esthetically `
 + `unacceptable and biomechanically redundant. `
 + `McCracken Ch 5 + UIC Design Case II (Prelim Case 2) protocol.`,
 tier: "strong",
 alternativeRationale: null,
 },
 });
 continue; // do NOT add to directRetainers
 }

 claimed.add(tooth);
 let mechanic;
 if (isDE) {
 mechanic = "rpi-family";
 } else if (forceMechanicForClassIV || isClassIVPrimary) {
 // Class IV bounding teeth need retention even if they're max anteriors
 mechanic = "akers-family";
 } else if (isMaxAnterior) {
 mechanic = "rest-only";
 } else {
 mechanic = "akers-family";
 }
 directRetainers.push({
 tooth, source: "span-boundary", span, mechanic,
 roleHint: isDE ? "de-terminal": (isClassIVPrimary ? "kennedy-iv-anterior-bounding": "tooth-bounded"),
 });
 }
}

/**
 * Bridge to existing rpdPlaceIndirectRetainers logic. Used by Class IV
 * (dual-role bounding teeth) where the bridge logic is correct and
 * non-trivial. Class I and Class II now compute from first principles
 * in their per-class planners below.
 */
function legacyIndirectRetainers(caseInput, kennedy, source) {
 const ir = rpdPlaceIndirectRetainers(caseInput, kennedy);
 return ir.map(r => ({
 tooth: r.tooth,
 source,
 dualRoleWith: kennedy.class === "IV" ? r.tooth: undefined,
 _legacyData: r,
 }));
}

// ============================================================================
// PER-CLASS INDIRECT RETAINER PLANNERS — computed from first principles
// ============================================================================
// These functions compute indirect retainers structurally from the kennedy
// classification + dentition, NOT by delegating to rpdPlaceIndirectRetainers.
// The legacy function remains for backwards compat (other consumers may
// import it), but the planner pipeline is now self-sufficient.

/**
 * Class I indirect retainers — bilateral, one per side. Each indirect
 * retainer sits anterior to the DE terminal on its side, perpendicular to
 * the fulcrum line through the two DE terminals. convention: first
 * premolar preferred over canine on mandibular arch (mand canine cingulum
 * inadequate); canine preferred on maxillary (max cingulum anatomically
 * prominent). Mand incisors and max lateral incisors excluded.
 *
 * Returns plan entries with `source: "kennedy-i-bilateral"`.
 */
function planClassIIndirectRetainers(caseInput, kennedy) {
 const arch = caseInput.arch;
 const out = [];
 for (const side of ["right", "left"]) {
 const pick = pickIndirectRetainerForSide(caseInput, kennedy, arch, side);
 if (!pick) continue;
 out.push({
 tooth: pick.tooth,
 source: "kennedy-i-bilateral",
 _legacyData: pick.legacyEntry,
 });
 }
 return out;
}

/**
 * Approximate 2D position of each tooth in arch coordinates (mm, anatomic).
 * +x = patient's right side. +y = anterior (toward lips).
 *
 * Values are derived from average adult arch dimensions (Wheeler's Dental
 * Anatomy + McCracken Ch 1). Used for geometric fulcrum-line calculations
 * in Class II indirect-retainer placement (INV-18, McCracken Fig 8-2 C).
 *
 * Not used for any actual measurement — only for relative perpendicular
 * projection ranking. Approximation accuracy ±2 mm is fine for this purpose.
 */
const RPD_TOOTH_COORDS = {
 // Maxillary arch (1-16); 1 = patient's right 3rd molar, 16 = left 3rd molar
 1: { x: 31, y: -30 }, 2: { x: 29, y: -22 }, 3: { x: 26, y: -15 },
 4: { x: 22, y: -7 }, 5: { x: 18, y: 0 }, 6: { x: 14, y: 8 },
 7: { x: 7, y: 14 }, 8: { x: 3, y: 16 }, 9: { x: -3, y: 16 },
 10: { x: -7, y: 14 }, 11: { x: -14, y: 8 }, 12: { x: -18, y: 0 },
 13: { x: -22, y: -7 }, 14: { x: -26, y: -15 }, 15: { x: -29, y: -22 },
 16: { x: -31, y: -30 },
 // Mandibular arch (17-32); 17 = patient's left 3rd molar, 32 = right 3rd molar
 17: { x: -28, y: -28 }, 18: { x: -26, y: -22 }, 19: { x: -23, y: -15 },
 20: { x: -20, y: -7 }, 21: { x: -17, y: 0 }, 22: { x: -13, y: 7 },
 23: { x: -6, y: 12 }, 24: { x: -2, y: 14 }, 25: { x: 2, y: 14 },
 26: { x: 6, y: 12 }, 27: { x: 13, y: 7 }, 28: { x: 17, y: 0 },
 29: { x: 20, y: -7 }, 30: { x: 23, y: -15 }, 31: { x: 26, y: -22 },
 32: { x: 28, y: -28 },
};

function rpdToothPos(tooth) {
 return RPD_TOOTH_COORDS[tooth] || { x: 0, y: 0 };
}

/**
 * Class II indirect retainer — ONE retainer placed using diagonal-fulcrum
 * geometry per McCracken Fig 8-2 C.
 *
 * Algorithm (INV-18):
 * 1. Identify fulcrum line endpoints:
 * - DE-terminal: distalmost present tooth on DE side
 * - Opposite-distalmost: distalmost present tooth on opposite side
 * 2. Compute fulcrum-line midpoint and the perpendicular-anterior vector.
 * 3. For each candidate tooth (opposite side, anterior to opposite-
 * distalmost, present, viable), compute its anteriority distance
 * from the fulcrum line (positive = anterior).
 * 4. Filter by tooth-type priority (canine/premolar — convention).
 * 5. Among candidates of the highest priority class, pick the one with
 * the GREATEST perpendicular distance from the fulcrum line.
 *
 * Per McCracken Fig 8-2 D: if a Class II Mod 1's mesial-most modification-
 * span abutment is far enough anterior, it can serve double-duty as both
 * direct AND indirect retainer (dual-role) — the rest seat already exists
 * on the direct retainer; no separate IR needed. The function detects this
 * and emits a dual-role marker rather than a separate IR entry.
 *
 * Returns plan entries with `source: "fulcrum-diagonal-perpendicular"`.
 */
function planClassIIIndirectRetainers(caseInput, kennedy) {
 const arch = caseInput.arch;
 if (!kennedy.deSide) return [];
 const oppositeSide = kennedy.deSide === "right" ? "left": "right";
 const teethList = rpdArchTeeth(arch);

 // Step 1: identify fulcrum line endpoints
 const deSideTeeth = teethList.filter(n =>
 rpdSideOf(n) === kennedy.deSide && rpdIsPresent(caseInput, n));
 const oppositeTeeth = teethList.filter(n =>
 rpdSideOf(n) === oppositeSide && rpdIsPresent(caseInput, n));
 if (deSideTeeth.length === 0 || oppositeTeeth.length === 0) return [];
 // DE terminal: distalmost present on DE side. Excludes 3rd molars when
 // they're typically not abutments (Rule 2). For now: just most-distal present.
 const deTerminal = deSideTeeth.reduce((a, b) =>
 rpdDistalRank(b) > rpdDistalRank(a) ? b: a);
 const oppDistalmost = oppositeTeeth.reduce((a, b) =>
 rpdDistalRank(b) > rpdDistalRank(a) ? b: a);

 // Step 2: midpoint + perpendicular-anterior vector
 const p1 = rpdToothPos(deTerminal);
 const p2 = rpdToothPos(oppDistalmost);
 const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
 // Fulcrum direction (p1 → p2)
 const dx = p2.x - p1.x;
 const dy = p2.y - p1.y;
 // Perpendicular: two options (-dy, dx) and (dy, -dx). The anterior one
 // is the one with positive y component (i.e., toward the lips).
 // Choose the perpendicular vector with positive y.
 let perpX = -dy, perpY = dx;
 if (perpY < 0) { perpX = dy; perpY = -dx; }
 // Normalize for cleaner projection math
 const perpMag = Math.sqrt(perpX * perpX + perpY * perpY) || 1;
 perpX /= perpMag; perpY /= perpMag;

 // Step 3 + 4: candidate teeth on opposite side, anterior to oppDistalmost,
 // viable (no incisor exclusions), with anteriority scores
 const RPD_MAX_LATERALS = new Set([7, 10]);
 const RPD_MAND_INCISORS = new Set([23, 24, 25, 26]);
 const candidates = oppositeTeeth.filter(n => rpdDistalRank(n) < rpdDistalRank(oppDistalmost))
.filter(n => !RPD_MAND_INCISORS.has(n) && !RPD_MAX_LATERALS.has(n));
 if (candidates.length === 0) return [];

 // Anteriority score = perpendicular distance from fulcrum line
 // (signed: positive = anterior to fulcrum, negative = posterior).
 const anteriority = (tooth) => {
 const t = rpdToothPos(tooth);
 return (t.x - mid.x) * perpX + (t.y - mid.y) * perpY;
 };

 // Step 4: tooth-type priority classes (convention)
 const priorityClasses = arch === "maxillary"
 ? [
 candidates.filter(n => RPD_CANINES.has(n)),
 candidates.filter(n => RPD_FIRST_PREMOLARS.has(n)),
 candidates.filter(n => RPD_SECOND_PREMOLARS.has(n)),
 candidates.filter(n => n === 8 || n === 9),
 ]: [
 candidates.filter(n => RPD_FIRST_PREMOLARS.has(n)),
 candidates.filter(n => RPD_SECOND_PREMOLARS.has(n)),
 candidates.filter(n => RPD_CANINES.has(n)),
 ];

 // McCracken Fig 8-2 D: span boundaries on the opposite side are candidates
 // for dual-role (direct + indirect). Build this set BEFORE pick selection
 // so we can favour a more-anterior dual-role tooth over the type-priority
 // pick when geometry strongly supports it.
 const oppSpanBoundaries = new Set;
 for (const span of (kennedy.spans || [])) {
 for (const t of [span.beforeBound, span.afterBound]) {
 if (!t) continue;
 if (rpdSideOf(t) === oppositeSide) oppSpanBoundaries.add(t);
 }
 }

 // Step 5: within the highest non-empty priority class, pick the tooth
 // with the greatest anteriority. This is the geometric refinement —
 // when a priority class has multiple eligible teeth (rare in standard
 // dentition but real for Class II Mod 1 with anterior modification),
 // the more-anterior tooth wins.
 let pick = null;
 for (const cls of priorityClasses) {
 if (cls.length === 0) continue;
 pick = cls.reduce((a, b) => anteriority(b) > anteriority(a) ? b: a);
 break;
 }
 if (!pick) {
 pick = candidates.reduce((a, b) => anteriority(b) > anteriority(a) ? b: a);
 }
 if (!pick) return [];

 // McCracken Fig 8-2 D refinement (INV-18b): if a span-boundary (dual-role)
 // candidate is MORE ANTERIOR to the fulcrum line than the type-priority
 // pick, prefer the dual-role candidate. The "mesial-most modification-span
 // abutment" should serve as the IR when it's geometrically further anterior
 // — even if its tooth type has a lower conventional priority.
 // Confirmed: Huddle 6 Case 2 — #9 (central, dual-role) is more anterior
 // than #12 (1st premolar, type-priority pick) → instructor chose #9.
 const dualRoleCandidates = candidates.filter(n => oppSpanBoundaries.has(n));
 if (dualRoleCandidates.length > 0) {
 const bestDualRole = dualRoleCandidates.reduce((a, b) =>
 anteriority(b) > anteriority(a) ? b: a);
 if (anteriority(bestDualRole) > anteriority(pick)) {
 pick = bestDualRole;
 }
 }

 const isDualRole = oppSpanBoundaries.has(pick);

 // Build legacy-shape entry
 let restType;
 if (RPD_CANINES.has(pick)) {
 restType = arch === "mandibular" ? "ML ball rest": "mesial cingulum rest";
 } else if (RPD_FIRST_PREMOLARS.has(pick) || RPD_SECOND_PREMOLARS.has(pick)) {
 restType = "mesial occlusal rest";
 } else if (pick === 8 || pick === 9) {
 restType = "distal ball rest";
 } else {
 restType = "cingulum rest";
 }

 const projAnteriority = anteriority(pick);
 const rationaleSuffix = isDualRole
 ? ` Per McCracken Fig 8-2 D, this tooth's anterior position relative to the diagonal fulcrum line (#${deTerminal}–#${oppDistalmost}) permits dual-role direct + indirect retention; no separate IR tooth is needed.`: ` Indirect retainer placement chosen via diagonal fulcrum-line geometry (McCracken Fig 8-2 C): fulcrum endpoints #${deTerminal} (DE terminal) and #${oppDistalmost} (opposite-side distalmost); perpendicular projection from fulcrum midpoint = ${projAnteriority.toFixed(1)} mm anterior. Among -preferred tooth types on opposite side, this tooth has the greatest anteriority.`;

 return [{
 tooth: pick,
 source: "fulcrum-diagonal-perpendicular",
 fulcrumEndpoints: { deTerminal, oppDistalmost },
 anteriority: projAnteriority,
 dualRole: isDualRole,
 _legacyData: {
 tooth: pick,
 restType,
 rationale: RPD_RATIONALE.rest.indirectFulcrum + rationaleSuffix,
 tier: "common",
 alternativeRationale: "If the indirect retainer's chosen tooth has compromised support, the next-best tooth in the priority class (canine ↔ premolar) can be used. Geometric perpendicular ranking is a refinement, not a hard rule — instructor judgment can pick a different anterior tooth if support is inadequate at the geometric ideal.",
 dualRole: isDualRole,
 },
 }];
}

/**
 * Class IV indirect retainers — bounding teeth themselves serve as dual-role
 * direct + indirect. Returns one entry per bounding tooth of the primary
 * anterior span. The bounding teeth get rest seats appropriate to their
 * anatomy (canine ML ball mand / mesial cingulum max; premolar mesial
 * occlusal; max central distal ball per protocol Huddle 6 Q8).
 *
 * Delegated to rpdPlaceIndirectRetainers because the Class IV logic there
 * is already correct and non-trivial (handles bounding-tooth identification,
 * dual-role marking, rest-type per tooth anatomy). Refactoring it here
 * adds code volume without behavioral change.
 *
 * Returns plan entries with `source: "kennedy-iv-bounding-dual-role"`.
 */
function planClassIVIndirectRetainers(caseInput, kennedy) {
 return legacyIndirectRetainers(caseInput, kennedy, "kennedy-iv-bounding-dual-role");
}

/**
 * Helper for Class I/II indirect retainer placement. Picks the best tooth
 * on `side` for an indirect retainer, anterior to the most-distal present
 * tooth on that side. Returns { tooth, legacyEntry } or null.
 *
 * Selection priority (convention):
 * - Maxillary: canine > first premolar > second premolar > max central (#8/#9)
 * - Mandibular: first premolar > second premolar > canine
 * - Excludes: mandibular incisors (cingulum inadequate); max lateral
 * incisors (root too short to support indirect retention reliably).
 */
function pickIndirectRetainerForSide(caseInput, kennedy, arch, side) {
 const teethList = rpdArchTeeth(arch);
 const presentTeeth = teethList.filter(n => rpdIsPresent(caseInput, n));
 const sideTeeth = presentTeeth.filter(n => rpdSideOf(n) === side);
 if (sideTeeth.length === 0) return null;
 // Find most-distal present tooth on this side as the "primary abutment"
 // for distance comparisons.
 const primary = sideTeeth.reduce((a, b) =>
 rpdDistalRank(b) > rpdDistalRank(a) ? b: a);
 // Candidates: anterior to primary, side-matched, present, excluded
 // categories filtered out.
 const RPD_MAX_LATERALS = new Set([7, 10]);
 const RPD_MAND_INCISORS = new Set([23, 24, 25, 26]);
 const candidates = sideTeeth.filter(n => rpdDistalRank(n) < rpdDistalRank(primary))
.filter(n => !RPD_MAND_INCISORS.has(n) && !RPD_MAX_LATERALS.has(n));
 if (candidates.length === 0) return null;

 let pick;
 if (arch === "maxillary") {
 pick = candidates.find(n => RPD_CANINES.has(n))
 || candidates.find(n => RPD_FIRST_PREMOLARS.has(n))
 || candidates.find(n => RPD_SECOND_PREMOLARS.has(n))
 || candidates.find(n => n === 8 || n === 9);
 } else {
 pick = candidates.find(n => RPD_FIRST_PREMOLARS.has(n))
 || candidates.find(n => RPD_SECOND_PREMOLARS.has(n))
 || candidates.find(n => RPD_CANINES.has(n));
 }
 if (!pick) {
 pick = candidates.reduce((a, b) => rpdDistalRank(b) < rpdDistalRank(a) ? b: a);
 }

 let restType;
 if (RPD_CANINES.has(pick)) {
 restType = arch === "mandibular" ? "ML ball rest": "mesial cingulum rest";
 } else if (RPD_FIRST_PREMOLARS.has(pick) || RPD_SECOND_PREMOLARS.has(pick)) {
 restType = "mesial occlusal rest";
 } else if (pick === 8 || pick === 9) {
 restType = "distal ball rest";
 } else {
 restType = "cingulum rest";
 }

 const tier = kennedy.class === "I" ? "strong": "common";
 const altRationale = kennedy.class === "I" ? null:
 "Engine places indirect retainer on the opposite side from the distal extension. The textbook clinical rule is geometric — perpendicular to the fulcrum line at its midpoint, on the side opposite the saddle. For most Class II cases these give the same answer, but in some configurations (Class II Mod 1 with diagonal fulcrum line) in practice the indirect is sometimes placed on the SAME side as the DE but at a perpendicular position to the fulcrum. In practice, instructors may also reuse an existing rest-only abutment (max anterior with ball/cingulum rest) as the dual-role indirect retainer rather than adding a separate one.";

 return {
 tooth: pick,
 legacyEntry: {
 tooth: pick,
 restType,
 rationale: RPD_RATIONALE.rest.indirectFulcrum,
 tier,
 alternativeRationale: altRationale,
 },
 };
}

/**
 * V2 Hydrator — given a single RetentionPlan entry, produce a fully-hydrated
 * AbutmentDesign object that matches the existing engine's output shape.
 *
 * In Phase 2, this is a thin dispatcher over the existing design functions
 * (rpdDesignAbutment, rpdDesignEmbrasureAbutment, rpdDesignContralateralAkers).
 * The dispatcher keys off planEntry.source. Future phases will factor out
 * cross-cutting helpers and split the giant rpdDesignAbutment into smaller
 * focused functions, but Phase 2 preserves behavior exactly.
 */
function rpdHydrateAbutment(planEntry, caseInput, kennedy) {
 const attrs = rpdGetAttrs(caseInput, planEntry.tooth);
 const vestibularLow = (caseInput.measurements?.vestibularDepth ?? 99) <= 5;

 // Source dispatch — DE terminal sources (kennedy-i / kennedy-ii) share the
 // same hydration path as span-boundary (rpdDesignAbutment uses the attached
 // span object to compute side, mechanic, rest seat, etc.).
 const SPAN_BOUNDARY_SOURCES = new Set([
 "span-boundary",
 "kennedy-i-de-terminal",
 "kennedy-ii-de-terminal",
 ]);

 let design = null;
 if (SPAN_BOUNDARY_SOURCES.has(planEntry.source)) {
 design = rpdDesignAbutment({
 tooth: planEntry.tooth,
 span: planEntry.span,
 caseInput,
 kennedy,
 attrs,
 vestibularLow,
 });
 } else if (planEntry.source === "bilateral-invariant-embrasure") {
 design = rpdDesignEmbrasureAbutment({
 tooth: planEntry.tooth,
 pairedWith: planEntry.pairedWith,
 caseInput,
 kennedy,
 attrs,
 });
 } else if (planEntry.source === "bilateral-invariant-akers") {
 design = rpdDesignContralateralAkers({
 tooth: planEntry.tooth,
 caseInput,
 kennedy,
 attrs,
 });
 }
 if (!design) return null;
 design.attrs = attrs;
 // Map planEntry source → existing role string for backward compat
 if (planEntry.source === "bilateral-invariant-embrasure" && !design.role) {
 design.role = "embrasure-retention";
 } else if (planEntry.source === "bilateral-invariant-akers" && !design.role) {
 design.role = "contralateral-akers";
 } else if (SPAN_BOUNDARY_SOURCES.has(planEntry.source) && !design.role) {
 design.role = "primary";
 }
 return design;
}

// ============================================================================
// END REBUILD V2 — RetentionPlan + planner + hydrator
// ============================================================================

// ============================================================================
// HYDRATION HELPERS — extracted from rpdDesignAbutment for testability
// ============================================================================
// Each helper computes one well-defined aspect of an abutment design.
// They are pure functions (no side effects); rpdDesignAbutment (and the
// future V2 hydrator) compose them. Extracting these enables:
// 1. Independent unit testing of each clinical rule
// 2. Reuse across span-boundary / embrasure / contralateral-Akers designs
// 3. Future replacement of any single rule without touching the orchestrator

/**
 * Compute the surface of THIS tooth that faces the adjacent edentulous space.
 * Returns "mesial" or "distal" for tooth-supported abutments based on which
 * arch-neighbor of the tooth is in the span. For distal-extension terminals,
 * always returns "distal".
 *
 * Returns "mesial" as a default fallback when neither neighbor is in the span
 * (a degenerate case that shouldn't arise from rpdGetEdentulousSpans output).
 */
function computeSideToward(tooth, span, arch) {
 if (span.type === "distal-extension") return "distal";
 const teethList = rpdArchTeeth(arch);
 const idx = teethList.indexOf(tooth);
 const before = teethList[idx - 1];
 const after = teethList[idx + 1];
 const beforeInSpan = before !== undefined && span.teeth.includes(before);
 const afterInSpan = after !== undefined && span.teeth.includes(after);
 if (beforeInSpan) {
 if (arch === "maxillary") return rpdSideOf(tooth) === "right" ? "distal": "mesial";
 return rpdSideOf(tooth) === "left" ? "distal": "mesial";
 }
 if (afterInSpan) {
 if (arch === "maxillary") return rpdSideOf(tooth) === "right" ? "mesial": "distal";
 return rpdSideOf(tooth) === "left" ? "mesial": "distal";
 }
 return "mesial";
}

/**
 * Determine if a survey crown is indicated for this abutment, based on attrs.
 * Per four independent criteria; ANY one triggers a
 * survey crown. Returns a SurveyCrownSpec object when indicated, or null.
 */
function evaluateSurveyCrown(attrs) {
 const needsSurveyCrown = (attrs.enamelIntegrityAtRestSeat === "insufficient" ||
 attrs.existingRestorations === "extensive" ||
 attrs.tilt === "extreme" ||
 attrs.existingCrown === "obstructing"
);
 if (!needsSurveyCrown) return null;
 const reason = attrs.existingCrown === "obstructing"
 ? "existing crown obstructs rest-seat/guide-plane prep — survey crown needed to put these features in metal": attrs.enamelIntegrityAtRestSeat === "insufficient"
 ? "cannot safely create ideal rests + undercuts + guide planes + HOC in enamel (preparations would penetrate dentin)": attrs.existingRestorations === "extensive"
 ? "extensive existing restorations jeopardize tooth integrity if further modified": "extreme tilt — axial re-contouring beyond enameloplasty (would also need to re-establish plane of occlusion)";
 return {
 indicated: true,
 reason,
 note: "PFM survey crown required. Total of 2.5–3.0mm occlusal tooth reduction at the rest seat area; 0.5–1mm for metal thickness. Rest seats and guide planes must be completed in METAL, not porcelain. Use surveyor BEFORE CEMENTATION to verify HOC, axial undercuts, ideal guide planes, and positive rest seats.",
 };
}

/**
 * Determine if crown lengthening (Phase II perio surgery) is indicated.
 * Triggers when crown height is short AND survey crown wasn't already
 * indicated (a survey crown subsumes crown lengthening).
 */
function evaluateCrownLengthening(attrs, surveyCrownIndicated) {
 if (surveyCrownIndicated) return null;
 if (attrs.crownHeight !== "short") return null;
 return {
 indicated: true,
 reason: "short clinical crown — evaluate for Phase II crown lengthening to establish vertical height for RPD components",
 };
}

/**
 * Test whether the max-anterior no-clasp rule should apply to this tooth.
 * the no-clasp rule: max anteriors bounding tooth-supported modification
 * spaces get rest + long/parallel guide plane only (no clasp). Class IV
 * PRIMARY abutments are excluded — they still need retention because the
 * anterior gap IS the primary span.
 */
function shouldApplyMaxAnteriorNoClasp(tooth, span, kennedy, arch) {
 if (arch !== "maxillary") return false;
 if (!RPD_MAX_ANTERIOR.has(tooth)) return false;
 if (span.type === "distal-extension") return false;
 const isClassIVPrimary = kennedy.class === "IV"
 && (kennedy.primarySpans || []).includes(span);
 if (isClassIVPrimary) return false;
 return true;
}

/**
 * Hydrate a max-anterior no-clasp abutment. Centrals get a distal ball rest;
 * canines + laterals get a cingulum rest. Major connector contact provides
 * bracing in lieu of a clasp.
 */
function hydrateMaxAnteriorNoClasp({ tooth, span, sideToward, surveyCrown, crownLengthening }) {
 const restType = (tooth === 8 || tooth === 9) ? "ball": "cingulum";
 const restDimensions = restType === "ball"
 ? "1.5 mm diameter hemispherical depression on distal line angle of central incisor lingual surface": "V-shaped (teardrop) depression on cingulum; 1.5 mm deep × 2.5 mm M-D × 2 mm I-G; perpendicular to long axis of tooth";
 return {
 tooth, isPrimaryAbutment: false, spanType: span.type,
 claspType: "Rest Only (no clasp)",
 claspRationale: "For esthetic reasons, no clasp designed on maxillary anterior; long/parallel guide plane provides secondary retention",
 retentiveArm: "None — major connector contact provides bracing",
 reciprocation: null,
 restSeat: { surface: sideToward, type: restType, bur: "inverted cone", dimensions: restDimensions },
 restRationale: RPD_RATIONALE.rest.additionalSupport,
 guidePlane: { surface: sideToward, length: "long/parallel (full clinical crown height)" },
 guidePlaneRationale: RPD_RATIONALE.guidePlane.longParallel,
 surveyCrown, crownLengthening,
 contraindications: [],
 claspTier: "judgment",
 claspAlternative: "I-bar (esthetic)",
 claspAlternativeRationale: "Worked clinical cases sometimes use I-bar esthetic on a max-anterior abutment that's terminal to a posterior tooth-bounded gap (LabRx Case A example: #6 terminal to #4-5 gap → I-bar esthetic). Consider I-bar esthetic if the case has only 2-3 retentive clasps and additional anterior retention is needed.",
 };
}

/**
 * Hydrate an interim (acrylic) abutment. No rest seats, no guide planes, no
 * reciprocation. Uses wrought-wire C-clasp; posteriors may use ball clasp as
 * an alternative. Summer 2023 IPD lecture.
 */
function hydrateInterimAbutment(tooth) {
 const isPosterior = RPD_FIRST_PREMOLARS.has(tooth) || RPD_SECOND_PREMOLARS.has(tooth)
 || RPD_FIRST_MOLARS.has(tooth) || RPD_SECOND_MOLARS.has(tooth)
 || RPD_THIRD_MOLARS.has(tooth);
 return {
 tooth, claspType: "WW C-clasp",
 claspRationale: RPD_RATIONALE.clasp["WW C-clasp"] +
 " (Summer 2023 IPD lecture: wrought wire clasps are mostly used; lab can fabricate cast clasps when indicated).",
 retentiveArm: "18ga wrought wire C-clasp engaging 0.02\" undercut (re-contour abutment if no usable undercut surveyed)",
 reciprocation: null, restSeat: null, restRationale: null,
 guidePlane: null, guidePlaneRationale: null,
 surveyCrown: null, crownLengthening: null,
 claspTier: "strong",
 claspAlternative: isPosterior ? "Ball clasp (engages buccal embrasure)": null,
 claspAlternativeRationale: isPosterior
 ? "Ball clasp is a -taught alternative for posterior interim cases — engages the buccal embrasure between adjacent teeth rather than a circumferential undercut. Useful when the abutment lacks a survey-able buccal undercut and recontouring is contraindicated.": null,
 };
}

/**
 * Pick the rest seat specification for a tooth-supported (non-DE, non-anterior-
 * esthetic) abutment. Returns a RestSeatSpec object. Caller has already
 * determined `sideToward` and verified the tooth isn't governed by a more
 * specific rule (interim, max-anterior-no-clasp).
 *
 * For DE terminals: anterior teeth → cingulum rest; posteriors → mesial
 * occlusal rest (RPI signature).
 * For tooth-supported: posteriors → occlusal on sideToward; mand canines →
 * ML ball; max canines → cingulum; other anteriors → cingulum.
 */
function pickRestSeat({ tooth, isDE, sideToward, arch }) {
 const isMolar = RPD_FIRST_MOLARS.has(tooth) || RPD_SECOND_MOLARS.has(tooth)
 || RPD_THIRD_MOLARS.has(tooth);
 const isPremolar = RPD_FIRST_PREMOLARS.has(tooth) || RPD_SECOND_PREMOLARS.has(tooth);
 const isCanine = RPD_CANINES.has(tooth);
 const isIncisor = RPD_MAX_INCISORS.has(tooth) || RPD_MAND_INCISORS.has(tooth);

 if (isDE) {
 // DE terminals: anteriors get cingulum; posteriors get mesial occlusal.
 if (isCanine || isIncisor) {
 return {
 surface: "mesial", type: "cingulum", bur: "inverted cone",
 dimensions: "V-shaped (teardrop) depression on cingulum; 1.5 mm deep × 2.5 mm M-D × 2 mm I-G; perpendicular to long axis of tooth",
 };
 }
 const burForTooth = isMolar
 ? "#8 round (outline) / #6 round (axial inclination) / #4 round (refinement)": "#6 round (outline) / #4 round (axial inclination)";
 return {
 surface: "mesial", type: "occlusal", bur: burForTooth,
 dimensions: isMolar
 ? "1/4 M-D × 1/3 B-L × 1.5 mm marginal-ridge reduction; spoon-shaped; floor inclines 20° axially toward tooth center; #8 round bur outline + #6 axial (Lab 5 p. 8)": "1/3 M-D × 1/3 B-L × 1.5 mm marginal-ridge reduction; spoon-shaped; floor inclines 20° axially toward tooth center; #6 round bur outline + #4 axial (Lab 5 p. 8)",
 };
 }

 // Tooth-supported abutments
 if (isMolar || isPremolar) {
 const bur = isMolar
 ? "#8 round (outline) / #6 round (axial inclination) / #4 round (refinement)": "#6 round (outline) / #4 round (axial inclination)";
 return {
 surface: sideToward, type: "occlusal", bur,
 dimensions: isMolar
 ? "1/4 M-D × 1/3 B-L × 1.5 mm marginal-ridge reduction; spoon-shaped; floor inclines 20° axially toward tooth center; #8 round bur outline + #6 axial (Lab 5 p. 8)": "1/3 M-D × 1/3 B-L × 1.5 mm marginal-ridge reduction; spoon-shaped; floor inclines 20° axially toward tooth center; #6 round bur outline + #4 axial (Lab 5 p. 8)",
 };
 }
 if (isCanine) {
 // Mandibular canines: ML ball rest (cingulum too flat for positive stop).
 // Maxillary canines: cingulum rest (cingulum anatomically adequate).
 if (arch === "mandibular") {
 return {
 surface: "mesio-lingual", type: "ball", bur: "inverted cone",
 dimensions: "1.5 mm diameter hemispherical depression on mesio-lingual line angle; positioned at mesial 1/3 of lingual surface above cingulum",
 };
 }
 return {
 surface: sideToward, type: "cingulum", bur: "inverted cone",
 dimensions: "V-shaped (teardrop) depression on cingulum; 1.5 mm deep × 2.5 mm M-D × 2 mm I-G; perpendicular to long axis of tooth; floor-to-axial-wall angle <90° (Lab 5 p. 9 — sharp inner angle for positive seating, prevents lateral displacement)",
 };
 }
 // Other anteriors (incisors as bounding abutments — rare)
 return {
 surface: sideToward, type: "cingulum", bur: "inverted cone",
 dimensions: "V-shaped depression on cingulum; 1.5 mm deep × 2 mm M-D × 1.5 mm I-G",
 };
}

/**
 * Pick the guide plane specification for an abutment.
 * Returns { surface, length } describing the prepared guide plane.
 * Per Lab 5 p. 5:
 * - Posterior abutments: 1/3 B-L × 2/3 cervically from marginal ridge
 * - Anterior abutments: linguo-proximal placement (esthetic — minimize labial metal)
 * - I-bar esthetic clasp: long/parallel (full clinical crown height)
 */
function pickGuidePlane({ tooth, isDE, sideToward, claspType }) {
 const isAnteriorAbutment = RPD_CANINES.has(tooth)
 || RPD_MAX_INCISORS.has(tooth) || RPD_MAND_INCISORS.has(tooth);
 const surface = isDE ? "distal": sideToward;
 const length = (claspType === "I-bar (esthetic)")
 ? "long/parallel (full clinical crown height)": isAnteriorAbutment
 ? "linguo-proximal, 2/3 crown length cervically from incisal edge (Lab 5 p. 5 — esthetic placement; minimizes labial metal show)": "1/3 B-L width × 2/3 length cervically from marginal ridge (Lab 5 p. 5)";
 const rationale = length.startsWith("long")
 ? RPD_RATIONALE.guidePlane.longParallel: RPD_RATIONALE.guidePlane.standard;
 return { spec: { surface, length }, rationale };
}

/**
 * Compute the effective undercut location for chart annotation / output text.
 * Differs from the user-set attrs.undercutLocation when:
 * - Akers on tooth-supported: engine substitutes the textbook-standard
 * undercut (DB if sideToward=mesial, MB if sideToward=distal) when user
 * hasn't overridden the default mid-buccal.
 * - Combination: always engages mesio-buccal (convention, Retainers
 * slide 37) regardless of user setting.
 * - RPI / I-bar esthetic: engages mid-buccal by clasp geometry.
 * - Other: pass-through user setting.
 */
function computeEffectiveUndercutForOutput({ claspType, sideToward, userUndercut }) {
 if (claspType === "Akers" && userUndercut === "mid-buccal") {
 return sideToward === "mesial" ? "disto-buccal": "mesio-buccal";
 }
 if (claspType === "Combination") {
 return "mesio-buccal";
 }
 return userUndercut;
}

/**
 * Determine if the case warrants a Ring clasp alternative note. option
 * for tilted molars with a mesial undercut (mand: ML; max: MB). Surfaced
 * as an alternative — engine doesn't auto-select Ring (Reverse Akers is
 * more common in actual Rx).
 */
function maybeRingClaspAlternative({ tooth, attrs, claspType }) {
 const isMolar = RPD_FIRST_MOLARS.has(tooth) || RPD_SECOND_MOLARS.has(tooth);
 const isTilted = attrs.tilt === "tilted";
 const undercutMesial = attrs.undercutLocation === "mesio-lingual"
 || attrs.undercutLocation === "mesio-buccal";
 if (isMolar && isTilted && undercutMesial
 && (claspType === "Akers" || claspType === "Reverse Akers")) {
 return `Consider Ring clasp as an alternative for this tilted molar — provides ~360° encirclement with primary mesial occlusal rest + distal auxiliary rest + supportive strut, engaging the ${attrs.undercutLocation} undercut.`;
 }
 return null;
}

/**
 * Pick the clasp mechanic (clasp type + retentive arm + reciprocation + tier +
 * alternatives) for a definitive-design abutment.
 *
 * Returns an object with the clasp-related fields; rpdDesignAbutment merges
 * these into the final design.
 *
 * The three branches:
 * 1. DE terminal: RPI (default) or Combination (when RPI contraindicated)
 * 2. Tooth-supported, esthetic zone with valid undercut: I-bar esthetic
 * 3. Tooth-supported, distal undercut user-set: Reverse Akers
 * 4. Tooth-supported, default: Akers
 */
function pickClaspMechanic({
 tooth, span, attrs, claspContras, sideToward,
}) {
 const isDE = (span.type === "distal-extension");
 const inEsthetic = RPD_ESTHETIC_ZONE.has(tooth);

 // ── DE branch ────────────────────────────────────────────────────────
 if (isDE) {
 if (claspContras.length === 0) {
 return {
 claspType: "RPI",
 claspRationale: RPD_RATIONALE.clasp["RPI"],
 retentiveArm: "I-bar engaging 0.01\" mid-buccal undercut at the greatest curvature of the buccal surface (mesial-buccal aspect)",
 reciprocation: {
 type: "plate",
 text: "Distal proximal plate contacting 1/2–2/3 of the occluso-gingival height of the abutment's distal proximal surface (house rule, between Kratochvil and Krol) + lingual plating for reciprocation",
 rationale: RPD_RATIONALE.reciprocation.plate,
 },
 claspTier: "strong",
 claspAlternative: null,
 claspAlternativeRationale: null,
 };
 }
 return {
 claspType: "Combination",
 claspRationale: `${RPD_RATIONALE.clasp["Combination"]} (${claspContras[0].text})`,
 retentiveArm: "18ga wrought wire retentive arm engaging 0.02\" mesio-buccal undercut",
 reciprocation: { type: "arm", text: "Cast lingual reciprocal arm", rationale: RPD_RATIONALE.reciprocation.arm },
 claspTier: "strong",
 claspAlternative: null,
 claspAlternativeRationale: null,
 };
 }

 // ── Tooth-supported branches ─────────────────────────────────────────
 const userUndercut = attrs.undercutLocation;
 const akersStandardUndercut = sideToward === "mesial" ? "disto-buccal": "mesio-buccal";
 const effectiveUndercut = (userUndercut === "mid-buccal") ? akersStandardUndercut: userUndercut;

 // Esthetic I-bar — requires mid- or mesio-buccal undercut + no RPI contras
 const useEstheticIBar = inEsthetic && claspContras.length === 0
 && userUndercut !== "disto-buccal" && userUndercut !== "none";
 if (useEstheticIBar) {
 return {
 claspType: "I-bar (esthetic)",
 claspRationale: RPD_RATIONALE.clasp["I-bar (esthetic)"],
 retentiveArm: "I-bar engaging 0.01\" mid-buccal undercut",
 reciprocation: { type: "plate", text: "Lingual plating for reciprocation", rationale: RPD_RATIONALE.reciprocation.plate },
 claspTier: "judgment",
 claspAlternative: "Rest Only (no clasp)",
 claspAlternativeRationale: "Design Case II uses Rest Only on max-anterior abutments when the case already has adequate retention from other clasps (e.g., bilateral RPI on premolars). Consider Rest Only if the design has ≥2 strong retentive clasps elsewhere.",
 };
 }

 // Reverse Akers — only when USER explicitly set a distal undercut
 if (userUndercut === "disto-buccal" || userUndercut === "disto-lingual") {
 const isBicuspidOrCanine = RPD_FIRST_PREMOLARS.has(tooth)
 || RPD_SECOND_PREMOLARS.has(tooth) || RPD_CANINES.has(tooth);
 const isMolarTooth = RPD_FIRST_MOLARS.has(tooth) || RPD_SECOND_MOLARS.has(tooth)
 || RPD_THIRD_MOLARS.has(tooth);
 const isLingualUndercut = userUndercut === "disto-lingual" || userUndercut === "mesio-lingual";
 const isTilted = attrs.tilt === "tilted" || attrs.tilt === "extreme";
 const isTiltedTerminalMolar = isMolarTooth && isTilted && isLingualUndercut;
 const inScope = isBicuspidOrCanine || isTiltedTerminalMolar;
 return {
 claspType: "Reverse Akers",
 claspRationale: RPD_RATIONALE.clasp["Reverse Akers"]
 + ` (retentive arm engages ${userUndercut} undercut)`
 + (isBicuspidOrCanine ? "":
 isTiltedTerminalMolar ?
 " — Huddle 6 Q10 carve-out: lingually inclined terminal molar permits Reverse Akers (or Ring clasp). The tilt makes lingual surface the practical engagement location.":
 " — NOTE: restricts Reverse Akers to bicuspids and cuspids (or tilted terminal molars per Huddle 6 Q10); this tooth is outside that indication scope. Consider Ring clasp instead for a tilted molar with distal undercut."),
 retentiveArm: `Cast retentive arm engaging 0.01" ${userUndercut} undercut`,
 reciprocation: {
 type: "arm",
 text: userUndercut === "disto-lingual" ? "Cast buccal reciprocal arm": "Cast lingual reciprocal arm",
 rationale: RPD_RATIONALE.reciprocation.arm,
 },
 claspTier: inScope ? "common": "judgment",
 claspAlternative: isBicuspidOrCanine ? null: "Ring clasp",
 claspAlternativeRationale: isBicuspidOrCanine
 ? "the lab Rx convention writes \"Akers clasp engaging 0.01\" [DL/DB] undercut\" rather than \"Reverse Akers\" explicitly — same physical design, different name. Either notation is accepted.": isTiltedTerminalMolar
 ? "Ring clasp is the alternative for tilted terminal molars with lingual undercut: ~360° encirclement with primary mesial occlusal rest + distal auxiliary rest + supportive strut. Both Reverse Akers AND Ring are -acceptable for this scenario (Huddle 6 Q10).": "Ring clasp is the typical choice for a tilted molar with a distal undercut: ~360° encirclement with primary mesial occlusal rest + distal auxiliary rest + supportive strut. Reverse Akers on a non-tilted molar is off-label per the Retainers lecture scope.",
 };
 }

 // Standard Akers (default for tooth-supported)
 return {
 claspType: "Akers",
 claspRationale: RPD_RATIONALE.clasp["Akers"],
 retentiveArm: `Cast circumferential retentive arm engaging 0.01" ${effectiveUndercut} undercut`,
 reciprocation: { type: "arm", text: "Cast lingual reciprocal arm", rationale: RPD_RATIONALE.reciprocation.arm },
 claspTier: "strong",
 claspAlternative: null,
 claspAlternativeRationale: null,
 };
}

// ============================================================================
// END HYDRATION HELPERS
// ============================================================================

function rpdDesignAbutment({ tooth, span, caseInput, kennedy, attrs, vestibularLow }) {
 const designIntent = caseInput.patientFactors?.designIntent || "definitive";

 // Interim branch — Summer 2023 IPD lecture (WW C-clasp default)
 if (designIntent === "interim") {
 return hydrateInterimAbutment(tooth);
 }

 // ─── Definitive branch — compose hydration from extracted helpers ─────
 const sideToward = computeSideToward(tooth, span, caseInput.arch);
 const surveyCrown = evaluateSurveyCrown(attrs);
 const crownLengthening = evaluateCrownLengthening(attrs, !!surveyCrown);

 // Max anteriors bounding modification spaces — early return (Rest Only)
 if (shouldApplyMaxAnteriorNoClasp(tooth, span, kennedy, caseInput.arch)) {
 const out = hydrateMaxAnteriorNoClasp({ tooth, span, sideToward, surveyCrown, crownLengthening });
 out.attrs = attrs;
 return out;
 }

 // Clasp contraindications (RPI gates + vestibular check)
 const claspContras = rpdCheckRPIContraindications(attrs);
 if (vestibularLow) claspContras.unshift({ key: "vestibular", text: "vestibular depth ≤5mm" });

 const isDE = (span.type === "distal-extension");

 // Clasp mechanic — RPI/Combination (DE) or I-bar esthetic/Reverse Akers/Akers (TS)
 const { claspType, claspRationale, retentiveArm, reciprocation,
 claspTier, claspAlternative, claspAlternativeRationale } =
 pickClaspMechanic({ tooth, span, attrs, claspContras, sideToward });

 // Ring clasp alternative for tilted molars (Retainers PDF — surfaced
 // as judgment-call alternative; engine doesn't auto-select Ring)
 const claspAlternatives = maybeRingClaspAlternative({ tooth, attrs, claspType });

 // Rest seat (anatomy-aware: DE vs TS, posterior vs canine vs incisor)
 const restSeat = pickRestSeat({ tooth, isDE, sideToward, arch: caseInput.arch });

 // Guide plane (anterior-vs-posterior dimensions, I-bar-aware length)
 const { spec: guidePlane, rationale: guidePlaneRationale } =
 pickGuidePlane({ tooth, isDE, sideToward, claspType });

 // Effective undercut for chart annotation / inspector display
 const effectiveUndercutLocation = computeEffectiveUndercutForOutput({
 claspType, sideToward, userUndercut: attrs.undercutLocation,
 });

 return {
 tooth, isPrimaryAbutment: isDE, spanType: span.type,
 claspType, claspRationale, retentiveArm, reciprocation,
 claspAlternatives,
 claspTier, claspAlternative, claspAlternativeRationale,
 restSeat, restRationale: null,
 guidePlane, guidePlaneRationale,
 surveyCrown, crownLengthening,
 contraindications: claspContras,
 effectiveUndercutLocation,
 attrs,
 };
}

// ============================================================================
// CONTRALATERAL RETENTION DESIGNS — Embrasure pair + single-Akers fallback
// ============================================================================
// These design functions handle abutments added by rpdSelectAbutments' Phase B
// invariant pass (top-down bilateral-retention enforcement). They differ from
// rpdDesignAbutment in that the abutment has NO adjacent edentulous span —
// it exists purely to satisfy the bilateral direct-retention requirement.
// No guide plane, no proximal plate (no adjacent span). Rest seat and clasp
// are dimensioned per protocol textbook defaults for the role.

/**
 * Embrasure-clasp abutment for a contralateral retention pair. Each tooth
 * in the pair gets its own design (rendered as a separate abutment card),
 * but the clasp itself is one continuous unit cradling both teeth at their
 * shared occlusal embrasure.
 *
 * Reference: Retainers PDF p. 24 — Embrasure is "Clasp of choice for a
 * quadrant with no edentulous space (Class III mod 0 where retention is
 * needed on a quadrant where no teeth are missing)."
 */
function rpdDesignEmbrasureAbutment({ tooth, pairedWith, caseInput, kennedy, attrs }) {
 const designIntent = caseInput.patientFactors?.designIntent || "definitive";
 const partner = rpdToothName(pairedWith);
 const arch = caseInput.arch;

 // ── Interim branch — wrought-wire C-clasps on each tooth (no embrasure
 // cast assembly on an IPD, but pair them functionally). ─────────────
 if (designIntent === "interim") {
 return {
 tooth, isPrimaryAbutment: true,
 spanType: "no-span-contralateral-retention",
 role: "embrasure-retention", pairedWith,
 claspType: "WW C-clasp",
 claspRationale: RPD_RATIONALE.clasp["WW C-clasp"] +
 ` Paired with a WW C-clasp on ${partner} for contralateral retention — avoids unilateral (Nesbit) design (PROHIBITS, Final RPD Huddle 2 answer key Q2, aspiration risk).`,
 retentiveArm: `18ga wrought wire C-clasp engaging 0.02" buccal undercut`,
 reciprocation: null,
 restSeat: null, restRationale: null,
 guidePlane: null, guidePlaneRationale: null,
 surveyCrown: null, crownLengthening: null,
 contraindications: [],
 claspTier: "common",
 claspAlternative: "Ball clasp engaging the buccal embrasure (when undercut is unavailable)",
 claspAlternativeRationale: "Ball clasp is the IPD alternative when no usable circumferential undercut is present — engages between the two teeth at the buccal embrasure without surveying a single-tooth undercut.",
 };
 }

 // ── Definitive branch — Embrasure clasp pair ─────────────────────────
 // Each tooth has a buccal C-clasp engaging its own 0.01" undercut, plus
 // a shared occlusal rest at the embrasure between the two teeth. Determine
 // which surface of THIS tooth faces the partner (mesial vs distal depends
 // on arch order and side).
 // Determine which surface of THIS tooth faces the partner. Depends on
 // arch order and side:
 // max array [1→16]: right side 1-8 goes distal→mesial (incr idx = more mesial)
 // left side 9-16 goes mesial→distal (incr idx = more distal)
 // mand array [17→32]: left side 17-24 goes distal→mesial (incr idx = more mesial)
 // right side 25-32 goes mesial→distal (incr idx = more distal)
 // So if partner is at a HIGHER array index than me:
 // • max right / mand left → partner is more MESIAL → embrasure on my MESIAL
 // • max left / mand right → partner is more DISTAL → embrasure on my DISTAL
 const teethList = rpdArchTeeth(arch);
 const myIdx = teethList.indexOf(tooth);
 const partnerIdx = teethList.indexOf(pairedWith);
 const mySide = rpdSideOf(tooth);
 // True when increasing array index = more DISTAL for this side+arch.
 const incrIdxIsDistal =
 (arch === "maxillary" && mySide === "left") ||
 (arch === "mandibular" && mySide === "right");
 const partnerAfter = myIdx < partnerIdx;
 // Embrasure surface = the one FACING the partner.
 const surface = (partnerAfter === incrIdxIsDistal) ? "distal": "mesial";

 const isMolar = RPD_FIRST_MOLARS.has(tooth) || RPD_SECOND_MOLARS.has(tooth);
 const restDim = isMolar
 ? "spoon-shaped depression 1.5 mm deep × 2.5 mm M-D × 2.5 mm B-L": "spoon-shaped depression 1.0 mm deep × 2.0 mm M-D × 2.0 mm B-L";
 // bur convention (Lab 5 p. 8) — molar rests use #8 round outline +
 // #6 axial; premolar rests use #6 round outline + #4 axial. Same burs
 // used for the shared embrasure rest.
 const burText = isMolar
 ? "#8 round (outline) / #6 round (axial inclination)": "#6 round (outline) / #4 round (axial inclination)";
 const reciprocalSide = arch === "maxillary" ? "Palatal": "Lingual";

 return {
 tooth, isPrimaryAbutment: true,
 spanType: "no-span-contralateral-retention",
 role: "embrasure-retention", pairedWith,
 claspType: "Embrasure",
 claspRationale: RPD_RATIONALE.clasp["Embrasure"] +
 ` This Embrasure clasp provides PRIMARY cross-arch retention paired with ${partner}, required to satisfy the bilateral direct-retention invariant. Without it the design would be unilateral (Nesbit) — PROHIBITS Nesbit RPDs (Final RPD Huddle 2 answer key Q2, aspiration risk).`,
 retentiveArm: `Cast C-clasp arm engaging 0.01" buccal undercut on ${rpdToothName(tooth)}, continuous with the opposing arm on ${partner} via the shared embrasure rest`,
 reciprocation: {
 type: "arm",
 text: `${reciprocalSide} reciprocal clasp arm (the matching half of the Embrasure assembly self-reciprocates)`,
 rationale: "Embrasure clasps are mutually reciprocating — each buccal arm has a matching lingual/palatal arm; insertion force on one tooth is counteracted by the corresponding arm on the partner tooth.",
 },
 restSeat: {
 surface, type: "occlusal",
 bur: burText,
 dimensions: `${restDim} at the embrasure shared with ${partner}`,
 },
 restRationale: `Shared occlusal embrasure rest between ${rpdToothName(tooth)} and ${partner}; provides vertical support for the continuous Embrasure clasp assembly. Prepared at the marginal ridge of each tooth so the shared rest spans the contact.`,
 guidePlane: null, // No adjacent edentulous space → no guide plane needed.
 guidePlaneRationale: null,
 surveyCrown: null, // Embrasure pair does not normally require survey crowns.
 crownLengthening: null,
 contraindications: [],
 claspTier: "strong",
 claspAlternative: "Single Akers on this tooth (forgoing the embrasure pair) — less retention but simpler if the partner tooth has poor undercut access.",
 claspAlternativeRationale: "Embrasure provides superior bilateral retention but requires an acceptable buccal undercut + suitable occlusal embrasure on BOTH teeth. If either fails clinical evaluation, fall back to a single Akers on the most posterior premolar/molar on this side.",
 };
}

/**
 * Single Akers as contralateral retention. Used as a fallback when no viable
 * Embrasure pair exists on the missing side — e.g., only one posterior tooth
 * remains on that quadrant, or the partner tooth has hopeless prognosis.
 */
function rpdDesignContralateralAkers({ tooth, caseInput, kennedy, attrs }) {
 const designIntent = caseInput.patientFactors?.designIntent || "definitive";
 const arch = caseInput.arch;

 if (designIntent === "interim") {
 return {
 tooth, isPrimaryAbutment: true,
 spanType: "no-span-contralateral-retention",
 role: "contralateral-akers",
 claspType: "WW C-clasp",
 claspRationale: RPD_RATIONALE.clasp["WW C-clasp"] +
 " Single wrought-wire clasp provides contralateral retention to avoid unilateral (Nesbit) design.",
 retentiveArm: `18ga wrought wire C-clasp engaging 0.02" buccal undercut`,
 reciprocation: null,
 restSeat: null, restRationale: null,
 guidePlane: null, guidePlaneRationale: null,
 surveyCrown: null, crownLengthening: null,
 contraindications: [],
 claspTier: "common",
 };
 }

 const isMolar = RPD_FIRST_MOLARS.has(tooth) || RPD_SECOND_MOLARS.has(tooth);
 const restDim = isMolar
 ? "spoon-shaped depression 1.5 mm deep × 2.5 mm M-D × 2.5 mm B-L": "spoon-shaped depression 1.0 mm deep × 2.0 mm M-D × 2.0 mm B-L";
 const burText = isMolar
 ? "#8 round (outline) / #6 round (axial inclination)": "#6 round (outline) / #4 round (axial inclination)";
 const reciprocalSide = arch === "maxillary" ? "Palatal": "Lingual";

 // For an Akers retainer, the engine convention (see rpdDesignAbutment) sets
 // effectiveUndercutLocation to the surface OPPOSITE the side facing any
 // adjacent space. With no adjacent space, default to the distal-buccal
 // undercut (Akers default per Retainers PDF — buccal undercut on mesial
 // half of tooth means the engagement surface is mesio-buccal, so
 // effectiveUndercutLocation flips to disto-buccal for the retentive arm).
 // Defaulting to "mesio-buccal" here keeps the engagement on the side of
 // the tooth most likely to have an undercut on a healthy posterior.
 return {
 tooth, isPrimaryAbutment: true,
 spanType: "no-span-contralateral-retention",
 role: "contralateral-akers",
 claspType: "Akers",
 effectiveUndercutLocation: "disto-buccal",
 claspRationale: RPD_RATIONALE.clasp["Akers"] +
 " Engine added this Akers as contralateral retention because no viable Embrasure pair exists on this side. Without it, the design would be unilateral (Nesbit), which PROHIBITS (Final RPD Huddle 2 answer key Q2, aspiration risk).",
 retentiveArm: `Cast Akers retentive arm engaging 0.01" disto-buccal undercut on the mesial half of the tooth`,
 reciprocation: {
 type: "arm",
 text: `${reciprocalSide} reciprocal clasp arm at the survey line`,
 rationale: RPD_RATIONALE.reciprocation.arm,
 },
 restSeat: {
 surface: "mesial", type: "occlusal",
 bur: burText,
 dimensions: restDim,
 },
 restRationale: "Mesial occlusal rest provides vertical support for the contralateral Akers retainer (no adjacent edentulous span → mesial rest is the textbook default).",
 guidePlane: null,
 guidePlaneRationale: null,
 surveyCrown: null,
 crownLengthening: null,
 contraindications: [],
 claspTier: "common",
 claspAlternative: "Embrasure clasp pair (with an adjacent tooth) — preferred whenever both teeth permit; provides stronger bilateral retention than a single Akers.",
 claspAlternativeRationale: "Engine chose single Akers because no acceptable adjacent posterior pair was available on this side (e.g., partner tooth missing or compromised). If clinical evaluation finds a usable embrasure pair, prefer Embrasure clasp instead.",
 };
}

// ============================================================================
// INDIRECT RETAINERS — algorithmic (fulcrum-line projection w/ filters)
// ============================================================================

function rpdPlaceIndirectRetainers(caseInput, kennedy) {
 if (kennedy.class === "III" || kennedy.class == null) return [];

 const arch = caseInput.arch;
 const presentTeeth = rpdArchTeeth(arch).filter(n => rpdIsPresent(caseInput, n));

 // ─── Class IV: bounding canine rests serve as indirect retainers ───
 // Per Design Case II logic: the bounding canine abutments themselves
 // act as both primary abutments AND indirect retainers via their ML ball
 // rest (mandibular) or mesial cingulum rest (maxillary). The rest seat on
 // the canine perpendicular to the fulcrum line through the anterior span
 // provides the indirect retention; no separate posterior rests are needed.
 //
 // Previous behavior placed indirect retainers on the most-distal posterior
 // premolars/molars on each side, which doesn't match the actual Class IV
 // design. The bounding canines' rests already cover the indirect retention
 // role; the lab Rx generator dedupes these against the abutment list so
 // they're reported as dual-role rather than added as separate rests.
 if (kennedy.class === "IV") {
 const span = kennedy.primarySpans[0];
 // Identify the bounding teeth (canines, PMs, or centrals).
 const bounding = [span.beforeBound, span.afterBound].filter(Boolean);
 const out = [];
 for (const t of bounding) {
 // Pick the rest type appropriate for the bounding tooth.
 // Per Final Huddle Week 6 Q8 + Design Case II:
 // • Canine bounding: ball rest (mand) or mesial cingulum rest (max)
 // • PM bounding (canine missing): mesial occlusal rest
 // • Max central incisor bounding (e.g. #8, #9 when laterals + canines missing):
 // distal ball rest on the central acts as BOTH direct retainer AND
 // indirect retainer simultaneously per Huddle 6 Q8.
 // • Other anteriors (laterals): cingulum rest fallback.
 let restType;
 const isMaxCentral = (t === 8 || t === 9);
 if (RPD_CANINES.has(t)) {
 restType = arch === "mandibular" ? "ML ball rest": "mesial cingulum rest";
 } else if (RPD_FIRST_PREMOLARS.has(t) || RPD_SECOND_PREMOLARS.has(t)) {
 // Canine missing — premolar bounds the span instead.
 restType = "mesial occlusal rest";
 } else if (isMaxCentral) {
 // Max central bounding the span (lateral + canine both missing on
 // that side, OR the gap is small enough that one central bounds it).
 // permits distal ball rest serving dual direct+indirect role.
 restType = "distal ball rest";
 } else {
 restType = "cingulum rest";
 }
 out.push({
 tooth: t, restType,
 rationale: RPD_RATIONALE.rest.classIVAnterior +
 (isMaxCentral
 ? " Per Huddle 6 Q8, a distal ball rest on a maxillary central incisor bounding the anterior span can serve simultaneously as direct retainer AND indirect retainer.": ""),
 dualRole: true, // flags that this tooth is BOTH a primary abutment AND indirect retainer
 });
 }
 return out;
 }

 // ─── Class I/II: indirect retainer anterior to the primary abutment ───
 // arch-specific rules:
 // - Mandibular: first premolar PREFERRED over canine, with mesial occlusal
 // rest. Reason: the mandibular canine cingulum is often insufficient for
 // a positive vertical stop, and a premolar occlusal rest provides a
 // superior seat. Canine is used only as a fallback (with ML ball rest).
 // - Maxillary: canine PREFERRED (max canine cingulum is anatomically
 // adequate). Premolar is the fallback.
 // - Mand incisors always excluded; max anterior incisors avoided.

 const primaryOnSide = (side) => {
 const sideTeeth = presentTeeth.filter(n => rpdSideOf(n) === side);
 if (sideTeeth.length === 0) return null;
 return sideTeeth.reduce((a, b) => rpdDistalRank(b) > rpdDistalRank(a) ? b: a);
 };

 // the exclusion list for indirect retainer placement:
 // "Avoid mandibular incisors and maxillary LATERAL incisors." Maxillary
 // CENTRALS (#8, #9) are permitted — Final Huddle Week 6 Case 2 explicitly
 // uses #9 distal ball rest as an indirect retainer. Engine previously
 // excluded all 4 max incisors via RPD_MAX_INCISORS, which was over-broad.
 const RPD_MAX_LATERALS = new Set([7, 10]);

 const pickIndirectFor = (side) => {
 const primary = primaryOnSide(side);
 if (primary == null) return null;
 const candidates = presentTeeth.filter(n =>
 rpdSideOf(n) === side && rpdDistalRank(n) < rpdDistalRank(primary)
);
 // Exclude mand incisors always; exclude max LATERAL incisors (centrals
 // are permitted per protocol's Retainers PDF and Final Huddle Week 6 Case 2).
 const filtered = candidates.filter(n =>
 !RPD_MAND_INCISORS.has(n) && !RPD_MAX_LATERALS.has(n)
);
 if (filtered.length === 0) return null;

 const firstPremolar = filtered.find(n => RPD_FIRST_PREMOLARS.has(n));
 const secondPremolar = filtered.find(n => RPD_SECOND_PREMOLARS.has(n));
 const canine = filtered.find(n => RPD_CANINES.has(n));
 // Max central incisors (#8, #9) — permitted as fallback after PMs/canines
 // when nothing better is available. Distal ball rest convention per protocol.
 const maxCentral = filtered.find(n => n === 8 || n === 9);

 if (arch === "mandibular") {
 if (firstPremolar) return firstPremolar;
 if (secondPremolar) return secondPremolar;
 if (canine) return canine;
 } else {
 if (canine) return canine;
 if (firstPremolar) return firstPremolar;
 if (secondPremolar) return secondPremolar;
 if (maxCentral) return maxCentral;
 }
 return filtered.reduce((a, b) => rpdDistalRank(b) < rpdDistalRank(a) ? b: a);
 };

 const out = [];
 const sidesToPlace = kennedy.class === "I" ? ["right", "left"]: [kennedy.deSide === "right" ? "left": "right"];
 // Class I gets bilateral indirect retainers (deterministic rule per protocol).
 // Class II uses an "opposite side from DE" heuristic which matches in
 // 3 of 5 documented Class II cases but diverges on 2 (one geometric, one
 // dual-role with an existing rest-only abutment).
 const tier = kennedy.class === "I" ? "strong": "common";
 const altRationale = kennedy.class === "I" ? null:
 "Engine places indirect retainer on the opposite side from the distal extension. The textbook clinical rule is geometric — perpendicular to the fulcrum line at its midpoint, on the side opposite the saddle. For most Class II cases these give the same answer, but in some configurations (Class II Mod 1 with diagonal fulcrum line) in practice the indirect is sometimes placed on the SAME side as the DE but at a perpendicular position to the fulcrum. In practice, instructors may also reuse an existing rest-only abutment (max anterior with ball/cingulum rest) as the dual-role indirect retainer rather than adding a separate one.";
 for (const side of sidesToPlace) {
 const t = pickIndirectFor(side);
 if (!t) continue;
 let restType;
 if (RPD_CANINES.has(t)) {
 restType = arch === "mandibular" ? "ML ball rest": "mesial cingulum rest";
 } else if (RPD_FIRST_PREMOLARS.has(t) || RPD_SECOND_PREMOLARS.has(t)) {
 restType = "mesial occlusal rest";
 } else if (t === 8 || t === 9) {
 // Max central as indirect retainer — convention is distal ball rest
 // (Final Huddle Week 6 Case 2: #9 distal ball rest).
 restType = "distal ball rest";
 } else {
 restType = "cingulum rest";
 }
 out.push({
 tooth: t, restType, rationale: RPD_RATIONALE.rest.indirectFulcrum,
 tier, alternativeRationale: altRationale,
 });
 }
 return out;
}

// ============================================================================
// BASE DESIGN — open lattice / mesh / tube tooth / facing
// ============================================================================

function rpdSelectBaseDesign(caseInput, kennedy) {
 const m = caseInput.measurements || {};
 const designs = [];

 for (const span of kennedy.spans) {
 let type, rationale, note;
 const isDE = span.type === "distal-extension";
 const isAnterior = span.containsAnterior && !span.containsPosterior;
 const limitedSpace = m.interocclusalSpace === "limited" || m.interocclusalSpace === "extremely_limited";
 const extremelyLimited = m.interocclusalSpace === "extremely_limited";
 const wellHealedRidge = (caseInput.patientFactors?.monthsSinceExtraction ?? 12) >= 6;

 // Per NotebookLM (standards):
 // - Mesh (top priority for anteriors): anterior span ≥3 teeth → Mesh
 // REGARDLESS of interocclusal space (esthetic-bulk preference; reduces
 // acrylic bulk in the visible zone). Also preferred for single/pair anterior
 // spans with normal space — Open Lattice would put too much acrylic in the
 // smile zone for one or two missing teeth.
 // - Facing: limited or extremely limited vertical space + single anterior
 // tooth + NON-resorbed ridge. The clinical trigger is no room for any
 // structure between the prosthetic tooth and ridge, which applies to
 // both "limited" and "extremely_limited" interocclusalSpace values when
 // the ridge hasn't resorbed.
 // - Tube Tooth: limited space + ≤2 teeth + WELL-HEALED ridge. Preferred over
 // Facing for esthetics (Facings show metal hue).
 // - Open Lattice: default for posterior, multi-tooth tooth-supported spans,
 // and distal extensions (only choice that supports distal tissue stops).
 let tier = "strong";
 let alternative = null;
 let alternativeRationale = null;
 if (isAnterior && span.teeth.length >= 3) {
 type = "Mesh";
 rationale = RPD_RATIONALE.base["Mesh"];
 tier = "common";
 alternative = "Open Lattice";
 alternativeRationale = "Mesh is the preferred choice for anterior spans ≥3 teeth (esthetic-bulk preference reduces acrylic bulk in the visible zone). Open Lattice is also acceptable and provides slightly more acrylic retention.";
 } else if (isAnterior && span.teeth.length === 1 && !wellHealedRidge && (extremelyLimited || limitedSpace)) {
 // Facing: single anterior + non-resorbed ridge + tight vertical space.
 // Expanded from "extremely_limited only" to also include "limited" when
 // the ridge is non-healed — clinically, "limited + non-healed" still
 // has insufficient room for a tube structure but the ridge still has
 // enough volume to support a facing.
 type = "Facing";
 rationale = RPD_RATIONALE.base["Facing"];
 tier = "common";
 alternative = "Tube Tooth";
 alternativeRationale = "Facing is selected for single-tooth anterior spans with non-resorbed ridges. Tube Tooth is preferred when the ridge has healed (≥6 months) for better esthetics (Facings show metal hue).";
 } else if (limitedSpace && !isDE && wellHealedRidge && span.teeth.length <= 2) {
 type = "Tube Tooth";
 rationale = RPD_RATIONALE.base["Tube Tooth"];
 tier = "common";
 alternative = "Open Lattice";
 alternativeRationale = "Tube Tooth is preferred for limited interocclusal space + healed ridge + ≤2 teeth. Open Lattice is acceptable if interocclusal space is adequate.";
 } else if (isAnterior && !isDE && span.teeth.length <= 2) {
 // Single or paired anterior tooth in the smile zone with adequate space:
 // Mesh is the esthetic-preserving default (less visible acrylic bulk than
 // Open Lattice). Open Lattice is acceptable if maximum retention is
 // prioritized over esthetics.
 type = "Mesh";
 rationale = RPD_RATIONALE.base["Mesh"];
 tier = "common";
 alternative = "Open Lattice";
 alternativeRationale = "For a single or paired anterior tooth in the smile zone, Mesh reduces visible acrylic bulk. Open Lattice is acceptable when maximum retention matters more than esthetics (e.g., heavily resorbed ridge needing the broader retention footprint).";
 } else {
 type = "Open Lattice";
 rationale = RPD_RATIONALE.base["Open Lattice"];
 if (isDE) note = "Distal tissue stop required";
 tier = "strong";
 }
 designs.push({ spanTeeth: span.teeth, type, rationale, note, tier, alternative, alternativeRationale });
 }

 return designs;
}

// ============================================================================
// FRAMEWORK MATERIAL
// ============================================================================

function rpdSelectFrameworkMaterial(caseInput) {
 const pf = caseInput.patientFactors || {};
 if (pf.metalAllergy) {
 return { material: "Gold", rationale: RPD_RATIONALE.framework["Gold"], requiresApproval: true };
 }
 return { material: "Co-Cr", rationale: RPD_RATIONALE.framework["Co-Cr"], requiresApproval: false };
}

// ============================================================================
// RED FLAGS — healing period, altered cast, NMCD, perio compromise, hopeless
// ============================================================================

function rpdCheckRedFlags(caseInput, kennedy, abutmentDesigns) {
 const flags = [];
 const pf = caseInput.patientFactors || {};
 const m = caseInput.measurements || {};
 const designIntent = pf.designIntent || "definitive";

 // Healing period
 const months = pf.monthsSinceExtraction;
 if (months != null && months < 6 && designIntent === "definitive") {
 flags.push({
 severity: "blocker",
 type: "healing-period",
 message: `Only ${months} mo since last extraction. Definitive RPD impressions cannot be taken until extraction sites have healed for at least 6 months. Recommend Interim RPD (IPD) until healing is complete.`,
 });
 }

 // Nesbit RPD prohibition — informational flag for case configurations
 // that historically might have been treated with a unilateral cantilever
 // RPD ("Nesbit"). explicitly bans this design due to aspiration risk
 // (Final RPD Huddle 2 answer key Q2).
 //
 // Trigger: Class III with all SPAN-DERIVED abutments on one side. The
 // engine resolves this by adding contralateral retention via Embrasure
 // pair or single Akers (rpdSelectAbutments Phase B); the flag remains
 // to (a) document why those extra retainers appear in the design and
 // (b) prompt the student to confirm RPD is the right modality vs. FPD
 // or implants for the short unilateral span.
 if (kennedy.class === "III") {
 const archMin = caseInput.arch === "maxillary" ? 1: 17;
 const archMax = caseInput.arch === "maxillary" ? 16: 32;
 const isPresentInCase = (n) =>
 n >= archMin && n <= archMax && caseInput.teeth?.[n]?.status !== "missing";
 const abutSet = new Set;
 for (const span of kennedy.spans || []) {
 const teeth = span.teeth || [];
 if (teeth.length === 0) continue;
 const minT = Math.min(...teeth);
 const maxT = Math.max(...teeth);
 for (let t = minT - 1; t >= archMin; t--) {
 if (isPresentInCase(t)) { abutSet.add(t); break; }
 }
 for (let t = maxT + 1; t <= archMax; t++) {
 if (isPresentInCase(t)) { abutSet.add(t); break; }
 }
 }
 const isMaxArch = caseInput.arch === "maxillary";
 const rightAbuts = [...abutSet].filter(n => isMaxArch ? n <= 8: n >= 25);
 const leftAbuts = [...abutSet].filter(n => isMaxArch ? n >= 9: n <= 24);
 if (rightAbuts.length === 0 || leftAbuts.length === 0) {
 // Find any contralateral-retention abutments the engine added.
 const ctrlRetainers = (abutmentDesigns || []).filter(a => a.role === "embrasure-retention" || a.role === "contralateral-akers");
 const ctrlSummary = ctrlRetainers.length === 0
 ? "Engine could not find acceptable contralateral retention (no viable posterior tooth on the opposite side) — RPD is contraindicated for this configuration as designed.": ctrlRetainers[0].role === "embrasure-retention"
 ? `Engine added Embrasure clasp pair on ${ctrlRetainers.map(a => `#${a.tooth}`).join(" + ")} for the required contralateral retention.`: `Engine added single Akers on #${ctrlRetainers[0].tooth} for contralateral retention (no viable embrasure pair on that side).`;
 flags.push({
 severity: "info",
 type: "nesbit-prohibition",
 message: `Nesbit (unilateral cantilever) RPD is PROHIBITED per Final RPD Huddle 2 answer key Q2 — aspiration risk. The span-derived abutments alone would have been unilateral, so the engine satisfied the bilateral direct-retention invariant by adding cross-arch retention. ${ctrlSummary} Confirm RPD is the appropriate modality for this short unilateral span; a fixed solution (FPD or implant) is often preferable for Class III mod 0. If the patient declines fixed treatment, this RPD design is acceptable.`,
 });
 }
 }

 // INV-20 — Class III with compromised boundary tooth flag (McCracken Fig 8-2 G).
 // The planner already adds an indirect retainer in this case; this flag
 // surfaces the rationale for the student/clinician.
 if (kennedy.class === "III") {
 const compromisedIR = (abutmentDesigns ? null: null); // not used; we check the plan's IR instead
 // Find a compromised-IR indirect retainer added by the planner
 // (the planner attaches anticipatedDueTo to the entry it inserts).
 // We pass it via the engine's result; lookup happens in the orchestrator.
 // Here we just check if a span boundary has poor/hopeless perio.
 for (const span of (kennedy.spans || [])) {
 for (const t of [span.beforeBound, span.afterBound]) {
 if (!t) continue;
 const teethRecord = caseInput.teeth?.[t];
 const perio = (teethRecord?.attrs || {}).perioPrognosis;
 if (perio === "poor" || perio === "hopeless") {
 flags.push({
 severity: "info",
 type: "class-iii-compromised-abutment",
 message: `Class III abutment #${t} has ${perio} periodontal prognosis. Per McCracken Fig 8-2 G, the design ANTICIPATES future tooth loss — when #${t} is lost, this case effectively becomes Class II with a diagonal fulcrum line. Engine added an indirect retainer on the side opposite #${t} to handle that anticipated configuration. If perio prognosis improves with treatment (perio therapy, splinting), the indirect retainer can be omitted. Document the prognosis in the chart; re-evaluate the design at each maintenance visit.`,
 });
 // Only emit once per case even if multiple compromised abutments
 break;
 }
 }
 }
 }

 // Altered cast (auto for Class I/II definitive)
 if ((kennedy.class === "I" || kennedy.class === "II") && designIntent === "definitive") {
 flags.push({
 severity: "info",
 type: "altered-cast",
 // the actual stance (Final Impressions): default
 // is SINGLE-STEP impression for all Kennedy classes. Altered cast is
 // invoked specifically when disclosing-wax framework try-in reveals
 // a discrepancy between master-cast seating and intraoral seating, OR
 // when the distal-extension ridge tissue is visibly flabby/compressible.
 // The engine flags Class I/II at info-tier (not blocker) as a heads-up
 // that the case MAY need altered cast at try-in — not a guarantee.
 message: "Class I/II distal extension: altered cast technique MAY be needed at framework try-in. default is single-step PVS. Indication for altered cast: (a) disclosing-wax try-in shows the framework seats differently on the master cast vs intraorally, OR (b) the distal-extension ridge tissue is visibly flabby/compressible. If indicated: heat framework saddle, add Triad spacer, border-mold the saddle, light-body PVS impression — press on REST SEATS ONLY, never on the distal extension framework. Lab sections the master cast and pours new distal extensions.",
 });
 }

 // Combination Syndrome — maxillary complete denture opposing
 // mandibular Kennedy Class I RPD. This is a HIGH-RISK scenario
 // requiring prevention strategies.
 if (caseInput.arch === "mandibular"
 && kennedy.class === "I"
 && pf.opposingArch === "complete_denture") {
 flags.push({
 severity: "warning",
 type: "combination-syndrome",
 message: "Combination Syndrome risk: maxillary complete denture opposing mandibular Class I RPD.\nMECHANISM (4): patient functions in protrusive relationship to feel mastication sensation; this tilts the maxillary CD upward, creating negative pressure that drives papillary hyperplasia of the hard palate.\nFIVE CLASSIC CONSEQUENCES:\n 1. Supra-eruption of mandibular anterior teeth\n 2. Resorption of maxillary anterior ridge\n 3. Downward growth of maxillary tuberosities\n 4. Resorption of mandibular posterior ridge\n 5. Papillary hyperplasia of the hard palate\nADDITIONAL CONSEQUENCES: epulis fissuratum (flange irritation), occlusal plane discrepancy, anterior repositioning of mandible, loss of VDO, flabby anterior maxillary tissue, shallow anterior maxillary vestibule but deep posterior vestibule, worsening prosthesis fit, periodontal changes around remaining mandibular teeth.\nPREVENTION: clinical remount at 1 year, 3-month perio recall, reline as needed, bilateral balanced articulation, altered-cast impression technique (selective pressure), 24-hr post-delivery + 1-week + 3-month follow-up.\nAVOIDANCE PRINCIPLE : maintain a distal abutment tooth even when it's not ideal — converting to Class III biomechanics is preferable to Class I + CD opposing.\nIMPLANT-ASSISTED RPD — definitive prevention strategy:\n • Requires ≥10 mm vertical space (locator + implant + framework + acrylic + denture tooth).\n • Implants must be parallel to the RPD path of insertion in 3D.\n • Anteriorly placed implants allow removal of the retentive clasp for esthetics (locator engages the implant abutment, eliminating the need for tooth-engaging metal in the smile zone).\nWORKFLOW : diagnostic tooth setup → IPD + surgical guide → implant placement → pick-up locators on the IPD → definitive RPD after osseointegration.",
 });
 }

 // CAMBRA caries-protective prescription block.
 // require the dentist to address caries risk BEFORE delivering an RPD.
 // A retained framework on a high-caries-risk mouth fails fast: abutments
 // decay under clasps, secondary caries undermines rest seats, and the
 // framework levers further damage. The CAMBRA package below is the 
 // protocol — prescribe ALL items, not pick-and-choose.
 const cariesRisk = pf.cariesRisk; // expected: "low" | "moderate" | "high" | "extreme"
 if (cariesRisk === "high" || cariesRisk === "extreme") {
 const riskLabel = cariesRisk === "extreme" ? "EXTREME": "HIGH";
 const extremeRationale = cariesRisk === "extreme"
 ? " EXTREME risk = HIGH + severe xerostomia OR recent tooth loss to caries; this is a hard prerequisite — do NOT deliver definitive RPD until risk is stabilized.": "";
 flags.push({
 severity: cariesRisk === "extreme" ? "warning": "info",
 type: "cambra-prescription",
 message: `Caries risk: ${riskLabel} per CAMBRA assessment. Prescribe the full protective package BEFORE framework delivery: (1) PreviDent 5000 — Rx 1.1% NaF dentifrice, brush BID in place of regular toothpaste; (2) Peridex (0.12% chlorhexidine gluconate) rinse — 1 week per month, BID, do not rinse with water after; (3) Fluoride varnish 5% NaF in-office, 3x per year minimum; (4) Xylitol — gum or lozenges, 2x per day for 15 min (stimulates salivary flow + bacteriostatic to S. mutans); (5) CariFree xylitol spray for dry-mouth episodes; (6) Diet counseling — limit fermentable carb exposures to <3 per day, no sipping sugary drinks.${extremeRationale} Recall: 3-month perio/caries recall, not 6-month. Document each prescription in Axium and reassess risk at every recall.`,
 });
 }

 // Perio-risk prerequisite (— Phase I Active Disease
 // Control must be complete before definitive RPD impressions). High
 // overall perio risk = active disease; the framework will accelerate
 // bone loss around abutments if disease is not stabilized first.
 const perioRisk = pf.perioRisk; // expected: "low" | "moderate" | "high"
 if (perioRisk === "high" && designIntent === "definitive") {
 flags.push({
 severity: "warning",
 type: "perio-risk",
 message: "Overall perio risk: HIGH. sequence: Phase I Active Disease Control must be COMPLETE before definitive RPD impressions. Required prior to impressions: full-mouth SRP, OHI, 4-6 week re-evaluation with re-probing, all pockets ≤5mm + no BOP at abutment sites. If perio is unstable, deliver an IPD as a holding phase and reassess. Recall: 3-month perio maintenance schedule, indefinitely. Document stabilization in Axium before advancing to Phase III.",
 });
 }

 // Existing RPD on the SAME arch — require reline-vs-rebase-vs-remake
 // decision before automatically scheduling a new framework. The new
 // framework is the last resort; if the existing one can be salvaged,
 // it's faster + cheaper + better-adapted to the patient's adapted
 // proprioception. Per Removable Partial Denture Maintenance lecture
 // and procedure-code conventions (D5750 reline, D5710 rebase, D5213
 // remake).
 const existingRpd = pf.existingRpdSameArch;
 if (existingRpd) {
 const cond = pf.existingRpdCondition || "unspecified";
 let recommendation;
 if (cond === "fits-ridge-resorption-only") {
 recommendation = "LAB RELINE (D5750 max / D5751 mand). Take pickup impression with RPD seated, bite registration, ship to lab. Framework and denture teeth retained. Turnaround: ~1 week.";
 } else if (cond === "teeth-worn") {
 recommendation = "REBASE (D5710 max / D5711 mand). Lab strips old acrylic base + replaces denture teeth on existing framework. Use only if framework is structurally intact and well-designed.";
 } else if (cond === "framework-broken" || cond === "design-inadequate") {
 recommendation = "REMAKE (D5213 max / D5214 mand). Cast Co-Cr cannot be reliably welded; broken rests / clasps / connectors are NOT repairable to clinical standard. A poorly-designed framework (no rests, no indirect retainers, no path of insertion) is a doomed substrate — don't reline it.";
 } else if (cond === "fits-good") {
 recommendation = "NO INTERVENTION required at this visit. Document fit + retention + occlusion in Axium. Continue maintenance recall schedule. Reassess at next recall.";
 } else {
 recommendation = "Evaluate fit (PIP paste intaglio), retention (clasp tension test), occlusion (AccuFilm), denture-tooth wear, and framework integrity (palpate clasps, rest seats, major connector). Decision tree: ridge-resorption only → RELINE; denture teeth worn → REBASE; framework broken or design inadequate → REMAKE.";
 }
 flags.push({
 severity: "info",
 type: "existing-rpd-decision",
 message: `Existing RPD on this arch documented (condition: ${cond.replaceAll('-', ' ')}). maintenance decision tree: ${recommendation} Note: do NOT routinely remake a serviceable RPD — patients adapt proprioceptively to existing prostheses, and remake risks rejection of the new framework.`,
 });
 }

 // Refer-to-prosthodontist triggers. The predoctoral student handles PDI Class
 // I-II; PDI Class III-IV cases warrant consult OR referral. The triggers
 // below approximate PDI Class III/IV from existing engine inputs.
 const referralTriggers = [];
 // Trigger 1: VDO reestablishment required = full-mouth rehab territory.
 if (pf.vdoLoss === true) {
 referralTriggers.push("loss of vertical dimension of occlusion requiring reestablishment (full-mouth rehab)");
 }
 // Trigger 2: Severe ridge resorption + distal extension + high perio risk
 // = compromised abutments AND compromised ridge AND active disease.
 if ((m.ridgeResorption === "severe")
 && (kennedy.class === "I" || kennedy.class === "II")
 && perioRisk === "high") {
 referralTriggers.push("severe ridge resorption + distal-extension Kennedy + high perio risk (PDI Class IV biomechanics)");
 }
 // Trigger 3: Existing Combination Syndrome (CD opposing mand Class I)
 // already documented (not just at risk) — full-mouth rehab considerations.
 if (caseInput.arch === "mandibular"
 && kennedy.class === "I"
 && pf.opposingArch === "complete_denture"
 && pf.vdoLoss === true) {
 referralTriggers.push("active Combination Syndrome with VDO loss");
 }
 // Trigger 4: Class IV with high esthetic demand — anterior esthetic
 // restoration in a partially edentulous Class IV span is challenging
 // (smile line, lip support, denture tooth shade matching).
 if (kennedy.class === "IV" && pf.estheticDemand === "high") {
 referralTriggers.push("Kennedy Class IV anterior modification with high esthetic demand");
 }
 // Trigger 5: New prosthesis to opposing arch simultaneously (RPD opposing
 // a new prosthesis means dual-arch reconstruction).
 if (pf.opposingArch === "new_prosthesis" && designIntent === "definitive") {
 referralTriggers.push("simultaneous bilateral arch reconstruction (new prosthesis opposing)");
 }
 if (referralTriggers.length) {
 flags.push({
 severity: "warning",
 type: "refer-prosthodontist",
 message: `Consider prosthodontist consult or referral. Triggers: ${referralTriggers.join("; ")}. Per scope-of-practice guidance, predoctoral student handles PDI Class I-II partial edentulism predictably; PDI Class III-IV cases benefit from specialist input (ACP Prosthodontic Diagnostic Index). At minimum, present this case at Tx Plan Conference for faculty review before proceeding.`,
 });
 }

 // Hopeless abutments — Lab 6 p. 2 definition: probing depth ≥8 mm
 // PLUS Miller class III mobility = hopeless. These teeth must be removed
 // from the cast BEFORE design begins (engine treats them as already-
 // extracted for classification purposes per Applegate Rule 1).
 const hopeless = rpdArchTeeth(caseInput.arch).filter(n => rpdIsPresent(caseInput, n) && caseInput.teeth[n]?.attrs?.perioPrognosis === "hopeless");
 if (hopeless.length) {
 flags.push({
 severity: "blocker",
 type: "hopeless-tooth",
 message: `Tooth ${rpdToothList(hopeless)} has hopeless prognosis. Lab 6 p. 2 hopeless definition: probing depth ≥8 mm + Miller class III mobility. Per standard practice, extract during Phase I: Active Disease Control. Re-classify arch after extraction (Applegate's Rule 1). Mark these teeth as "to be extracted" in the engine so the Kennedy classifier produces the post-extraction class — designing around a hopeless tooth wastes lab work when the tooth fails 6-12 months post-delivery.`,
 });
 }

 // Poor / questionable abutments
 const poor = rpdArchTeeth(caseInput.arch).filter(n => rpdIsPresent(caseInput, n) && caseInput.teeth[n]?.attrs?.perioPrognosis === "poor");
 if (poor.length && designIntent === "definitive") {
 flags.push({
 severity: "warning",
 type: "questionable-abutment",
 message: `Tooth ${rpdToothList(poor)} has questionable periodontal prognosis. Consider Interim RPD (IPD) for transient reassessment phase before committing to definitive framework.`,
 });
 }

 // NMCD — Fueki 2016 two-tier split + contraindication list (Fall RPD
 // 22 Non-metal clasps).
 if (pf.metalAllergy) {
 flags.push({
 severity: "warning",
 type: "nmcd",
 message: "Metal allergy documented. NON-METAL CLASP DENTURE (NMCD) pathway is the last resort — requires SIGNED INFORMED CONSENT BEFORE fabrication begins (not just discussion) and Managing Partner approval.\nFUEKI 2016 TWO-TIER SPLIT:\n • FLEXIBLE NMCD (thermoplastic: Valplast, Duraflex polyamide) — indicated for METAL ALLERGY pathway only.\n • RIGID NMCD (CAD/CAM arylketone polymer — more rigid + biocompatible + high temp/chem stability) — indicated for ESTHETIC REFUSERS (patient declines metal-show in esthetic zone but has no metal allergy).\nVARIANTS:\n • NMCD WITH metal major connector (rigid hybrid): cast metal MC + non-metal clasps. Restorative space ≥6 mm REQUIRED.\n • NMCD WITHOUT metal MC (pure flexible/rigid): no metal anywhere. Restorative space ≥5 mm required. Permitted indications: definitive for metal allergy patients (Fueki 2016 exception), few missing anteriors with stable bilateral posterior occlusion, limited mouth opening (<40 mm).\nSHARED CONTRAINDICATIONS (ALL variants):\n • Kennedy Class I/II (rigidity required for distal extension support)\n • Severely resorbed ridge\n • Abnormal mucosa on ridge\n • Clinically short crowns\n • Severe tissue undercut\n • Poor periodontal support of remaining teeth\n • High caries risk\n • Poor manual dexterity (handling fragile thermoplastic)\n • Parafunction / clenching (thermoplastic fatigues + fractures)\nRECALL: more frequent POE/OHI/caries-risk assessment for NMCD recipients; Prevident 5000 or fluoride varnish prescribed.",
 });
 }

 // Bilateral balanced occlusion required when opposing arch is a complete
 // denture (Fall RPD 22 Combination Syndrome lecture, Prevention p. 9;
 //. the RPD-opposing-CD scenario
 // demands bilateral balanced articulation including protrusive movements
 // to prevent denture tipping and Combination Syndrome progression.
 if (pf.opposingArch === "complete_denture"
 && designIntent === "definitive"
 && kennedy.class !== null) {
 flags.push({
 severity: "info",
 type: "bilateral-balanced-occlusion",
 message: "Opposing arch is a complete denture. require BILATERAL BALANCED ARTICULATION including protrusive and lateral excursive movements for this RPD. At wax-rim try-in, set teeth for simultaneous bilateral contacts in MI, protrusion, and lateral excursions. Use the Denar facebow + bite registration to mount casts. Selective pressure or altered cast impression technique is also required.",
 });
 }

 // Kennedy Class I distal extension — Occlusion splits
 // this rule BY ARCH:
 // • MAXILLARY Class I: REQUIRES balancing contacts (denture teeth set
 // lateral to the residual alveolar ridge for cross-arch loading)
 // • MANDIBULAR Class I: does NOT require balancing contacts (use
 // standard group function with no balancing-side interferences)
 // The earlier "balanced is also strived in Class I" is
 // refined here by the arch-specific Occlusion lecture.
 if (kennedy.class === "I"
 && caseInput.arch === "maxillary"
 && (pf.opposingArch === "natural" || pf.opposingArch === "existing_partial" || !pf.opposingArch)
 && designIntent === "definitive") {
 flags.push({
 severity: "info",
 type: "max-class-i-balanced-required",
 message: "Maxillary Kennedy Class I distal extension: Occlusion — REQUIRES balancing contacts (in addition to group function on remaining natural teeth). Set posterior denture teeth LATERAL to the residual alveolar ridge (cross-arch loading consideration — distributes occlusal force across the palate). At wax-rim try-in, verify simultaneous bilateral contacts in lateral excursions on denture teeth; natural-tooth side maintains group function with no interferences.",
 });
 }

 // Class IV anterior MI contact (Occlusion): the maxillary
 // anterior denture teeth in Class IV MUST contact mandibular anteriors
 // at MI to prevent supra-eruption of the opposing anteriors. If MI
 // contact is impossible, at minimum establish protrusive contact. NO
 // contacts during lateral movements (distinct from generic excursion
 // rule).
 if (kennedy.class === "IV" && designIntent === "definitive") {
 flags.push({
 severity: "info",
 type: "class-iv-anterior-mi-contact",
 message: "Kennedy Class IV (anterior crossing midline): Occlusion — anterior denture teeth MUST contact opposing anteriors at MI to prevent supra-eruption of opposing anteriors. If MI contact impossible (e.g., anterior open bite tendency), at minimum establish PROTRUSIVE contact. Critically: NO contacts during lateral movements on the anterior denture teeth (lateral guidance by canines/posteriors only — Class IV anterior teeth are stress-released during excursion).",
 });
 }

 // Group function scheme for RPD opposing natural dentition. When opposing arch is intact natural teeth or
 // an existing RPD, the standard is GROUP FUNCTION on the working side
 // with no balancing-side interferences. Canine guidance is acceptable if
 // the patient's natural dentition exhibits it. Bilateral balanced is
 // SPECIFIC to CD-opposing-RPD; do not apply it to natural-opposing-RPD.
 // EXCEPTION: Class I cases ALSO strive for bilateral balanced — handled
 // in the class-i-balanced-strived flag above.
 if ((pf.opposingArch === "natural" || pf.opposingArch === "existing_partial" || !pf.opposingArch)
 && designIntent === "definitive"
 && kennedy.class !== null) {
 flags.push({
 severity: "info",
 type: "occlusion-scheme-group-function",
 message: "Occlusion scheme: GROUP FUNCTION on the working side. Denture teeth on the NON-WORKING (balancing) side MUST have NO contact during excursion — the convention. Excursive movement should happen on natural teeth whenever possible; only balance forces on denture teeth if natural-tooth guidance is unavailable. Canine guidance is acceptable if patient's natural dentition exhibits it. At delivery, verify with AccuFilm II: working-side contacts at premolar + molar denture teeth, balancing-side fully clear during lateral excursions. Adjust premature contacts on the DENTURE TEETH, never on natural teeth.",
 });
 }

 // "Always close the anterior edentulous area" — // (red text, hard rule). Engine surfaces this as an info-tier confirmation
 // whenever the case includes an anterior span (#7-10 max or #23-26 mand),
 // so the student is reminded the gap MUST be closed by some means (RPD,
 // FPD, or implant) — never left open. The engine never recommends leaving
 // an anterior gap open, but the explicit reminder reinforces the hard rule.
 const RPD_MAX_ANTERIOR_SET = new Set([7, 8, 9, 10]);
 const RPD_MAND_ANTERIOR_SET = new Set([23, 24, 25, 26]);
 const anteriorSet = caseInput.arch === "maxillary" ? RPD_MAX_ANTERIOR_SET: RPD_MAND_ANTERIOR_SET;
 const missingAnteriors = rpdArchTeeth(caseInput.arch).filter(n => anteriorSet.has(n) && !rpdIsPresent(caseInput, n));
 if (missingAnteriors.length > 0) {
 flags.push({
 severity: "info",
 type: "always-close-anterior",
 message: `Anterior edentulous area present (${rpdToothList(missingAnteriors)}). UIC Lecture 2 hard rule: "Always close the anterior edentulous area." Replacement options (in order of preference): FPD (if abutments allow), implant-supported crown(s), RPD with appropriate base design (Mesh for ≥3 anterior teeth, Facing for extremely limited vertical space + non-resorbed ridge), or IPD with denture teeth bonded to acrylic base if transitional. Leaving the gap open is never an acceptable definitive outcome.`,
 });
 }

 // Short crown / crown lengthening recommended
 const shortCrownTeeth = abutmentDesigns.filter(a => a.crownLengthening?.indicated).map(a => a.tooth);
 if (shortCrownTeeth.length) {
 flags.push({
 severity: "info",
 type: "crown-lengthening",
 message: `Crown lengthening (Phase II) recommended for ${rpdToothList(shortCrownTeeth)} before definitive RPD components are prepared.`,
 });
 }

 // Survey crown recommended
 const surveyCrownTeeth = abutmentDesigns.filter(a => a.surveyCrown?.indicated).map(a => a.tooth);
 if (surveyCrownTeeth.length) {
 flags.push({
 severity: "info",
 type: "survey-crown",
 message: `Survey crown required for ${rpdToothList(surveyCrownTeeth)} — minor enameloplasty cannot achieve required contours safely.`,
 });
 }

 // Vestibular depth — flagged here only; per-abutment effect was already
 // applied during clasp design.
 if ((m.vestibularDepth ?? 99) <= 5 && designIntent === "definitive") {
 flags.push({
 severity: "info",
 type: "vestibular-depth",
 message: "Vestibular depth ≤5mm: I-bar approach is contraindicated arch-wide. RPI assemblies have been switched to Combination Clasp.",
 });
 }

 return flags;
}

// ============================================================================
// LAB SCRIPT — verbatim Axium Instructions block
// ============================================================================

// ─── Lab Rx format helpers (standard convention from primary-source Axium Rx examples) ──

// Format a span of teeth as "#5", "#4-5", or "#23, 26" (handles consecutive vs. mixed)
function rpdFormatToothSpan(teeth) {
 if (!teeth || teeth.length === 0) return "";
 const sorted = [...teeth].sort((a, b) => a - b);
 if (sorted.length === 1) return `#${sorted[0]}`;
 // Consecutive?
 let consecutive = true;
 for (let i = 1; i < sorted.length; i++) {
 if (sorted[i] !== sorted[i - 1] + 1) { consecutive = false; break; }
 }
 if (consecutive) return `#${sorted[0]}-${sorted[sorted.length - 1]}`;
 return `#${sorted.map(n => String(n)).join(", #")}`;
}

// Describe rest seat per protocol lab Rx convention.
// Premolar/molar mesial occlusal → "Mesial rest"
// Distal occlusal → "Distal rest"
// Cingulum (any surface) → "Cingulum rest" (drops the surface qualifier)
// Ball (central incisor distal) → "Distal ball rest"
function rpdDescribeRestSeat(restSeat) {
 if (!restSeat) return null;
 const { surface, type } = restSeat;
 if (type === "cingulum") return "Cingulum rest";
 if (type === "ball") return `${surface.charAt(0).toUpperCase()}${surface.slice(1)} ball rest`;
 // occlusal default
 return `${surface.charAt(0).toUpperCase()}${surface.slice(1)} rest`;
}

// Proximal plate sits on the guide plane; lists it by surface (capitalized).
function rpdDescribeProximalPlate(guidePlane) {
 if (!guidePlane) return null;
 const s = guidePlane.surface;
 return `${s.charAt(0).toUpperCase()}${s.slice(1)} proximal plate`;
}

// abbreviation for undercut locations in lab Rx
const RPD_UNDERCUT_SHORT = {
 "mid-buccal": "mid-buccal",
 "mesio-buccal": "MB",
 "disto-buccal": "DB",
 "disto-lingual": "DL",
 "mesio-lingual": "ML",
};

// Determine whether the retentive arm engages on the BUCCAL or LINGUAL side
// based on the undercut location. Reciprocation goes on the opposite side.
function rpdUndercutSide(undercutLocation) {
 if (!undercutLocation) return "buccal";
 if (undercutLocation.endsWith("buccal")) return "buccal";
 if (undercutLocation.endsWith("lingual")) return "lingual";
 return "buccal";
}

// Clasp + undercut description per standard convention (matches actual lab Rx examples).
// -format clasp descriptor for lab Rx (matches Design Case I/II, framework
// Case 1, Lab Rx Example A/B verbatim):
// "Akers clasp engaging 0.01\" DB undercut"
// "I-bar engaging 0.01\" mid-buccal undercut"
// "Combination clasp engaging 0.02\" MB undercut"
// "Embrasure clasp engaging 0.01\" MB undercut"
// "18ga wrought wire C-clasp engaging 0.02\" undercut"
// Undercut surfaces are abbreviated to the lab Rx convention (DB/MB/DL/ML)
// EXCEPT mid-buccal which writes out as "mid-buccal" or "Mid-B".
function rpdDescribeClasp(a, abutmentAttrs) {
 const t = a.claspType;
 // Determine the effective undercut surface. Engine fields are layered:
 // 1. a.effectiveUndercutLocation (engine-computed, e.g. DB for Akers
 // with sideToward=mesial — the textbook default).
 // 2. abutmentAttrs.undercutLocation (user-set, e.g. when the surveyed
 // cast shows a non-default surface).
 // 3. fall back to "mid-buccal" if nothing else is set.
 const loc = a.effectiveUndercutLocation
 || abutmentAttrs?.undercutLocation
 || "mid-buccal";
 // Map to the lab-Rx surface abbreviation. mid-buccal is written out;
 // others abbreviated to 2 letters (DB/MB/DL/ML).
 const surface = (loc === "mid-buccal") ? "mid-buccal": (RPD_UNDERCUT_SHORT[loc] || loc);
 if (t === "RPI" || t === "I-bar (esthetic)") {
 return `I-bar engaging 0.01" ${surface} undercut`;
 }
 if (t === "Akers" || t === "Reverse Akers") {
 return `Akers clasp engaging 0.01" ${surface} undercut`;
 }
 if (t === "Embrasure") {
 return `Embrasure clasp engaging 0.01" ${surface} undercut`;
 }
 if (t === "Combination") {
 // Combination clasps use 18ga WW + 0.02" undercut per protocol.
 // the actual lab Rx writes the short form: "Combination clasp
 // engaging 0.02\" MB undercut" — the wrought-wire gauge is shown on
 // the Preliminary Design Form, not in the Rx text.
 return `Combination clasp engaging 0.02" ${surface} undercut`;
 }
 if (t === "WW C-clasp") {
 return `18ga wrought wire C-clasp engaging 0.02" undercut`;
 }
 if (t === "Ball Clasp") {
 return `18ga wrought wire ball clasp engaging buccal embrasure`;
 }
 if (t === "Ring" || t === "Ring Clasp") {
 return `Ring clasp engaging 0.01" ${surface} undercut`;
 }
 // Fallback: emit the raw retentive arm description.
 return a.retentiveArm || "";
}

// Reciprocation per protocol actual lab Rx examples. is inconsistent on
// whether to explicitly mention the reciprocal plate for RPI / I-bar
// esthetic clasps:
// - Design Case I max #6 + #14 (I-bar): OMITS "Palatal reciprocal plate"
// - Design Case I mand #21 (Combination): includes "Lingual reciprocal plate"
// - Design Case II max #4 + #12 (RPI): includes "Palatal reciprocal plate"
// - Framework Case 1 #14 (I-bar RPI): OMITS reciprocal notation
// - LabRx Example B #29 (RPI): OMITS reciprocal notation
//
// 4 of 5 RPI/I-bar examples omit the reciprocal plate (it's implicit in
// the proximal-plate + lingual-plating). Combination always includes it
// (different clasp scheme — wrought wire arm needs explicit plating
// counterpart). Engine adopts the majority convention: omit for RPI /
// I-bar esthetic, include for Combination + arm reciprocation for
// Akers / Reverse Akers / Embrasure.
function rpdDescribeReciprocation(claspType, arch, abutmentAttrs) {
 const side = arch === "maxillary" ? "Palatal": "Lingual";
 if (claspType === "RPI" || claspType === "I-bar (esthetic)") return null;
 if (claspType === "Combination") {
 return `${side} reciprocal plate`;
 }
 if (["Akers", "Reverse Akers", "Embrasure"].includes(claspType)) {
 const undercutSide = rpdUndercutSide(abutmentAttrs?.undercutLocation);
 // Reciprocation goes on the OPPOSITE side from the retentive arm.
 // Standard Akers: undercut on buccal → reciprocal on Palatal (max) or Lingual (mand).
 // Reverse Akers: undercut on lingual → reciprocal on Buccal.
 if (undercutSide === "lingual") {
 return "Buccal reciprocal clasp";
 }
 return `${side} reciprocal clasp`;
 }
 return null;
}

function rpdGenerateLabScript({ arch, framework, majorConnector, abutmentDesigns, indirectRetainers, baseDesigns, designIntent, axiumCode, kennedy }) {
 const archLc = arch === "maxillary" ? "maxillary": "mandibular";
 const isInterim = designIntent === "interim";
 const lines = [];

 // ── Interim RPD lab Rx ─────────────────────────────────────────────────
 // Per Summer 2023 IPD lecture + IPD lab Rx template (lab-ii-rpd):
 // Standard hard-acrylic IPD uses Red Pattern resin or Ortho Resin Denture
 // material for the acrylic base (Triad is NOT advisable — doesn't bond
 // to denture teeth). Clasps are 18ga wrought wire C-clasps with 0.02"
 // undercut engagement, or ball clasps for buccal embrasure retention on
 // posterior teeth. The lab Rx must specify denture tooth mold + shade
 // + acrylic gingival shade — these are chairside selections matched to
 // the patient's existing teeth at the wax-rim try-in.
 if (isInterim) {
 lines.push(`Please fabricate ${archLc} interim immediate acrylic removable partial denture.`);
 lines.push("");
 lines.push("IPD lecture goal statement (Summer 2023 IPD-BS p. 20): \"Avoid IPD if possible. Aimed for short period only.\" Document specific transitional purpose in chart note (esthetic, space maintenance, trial occlusal change, patient conditioning, or bridge-to-implant interval).");
 lines.push("");
 lines.push("Base: rigid acrylic — Red Pattern resin OR Ortho Resin Denture material.");
 lines.push("(Triad NOT advisable — does not bond reliably to denture teeth per protocol IPD lecture.)");
 lines.push("(Acrylic clasps are an option per p. 13 but impinge gingiva and cause irritation — discourages routine use.)");
 lines.push("");
 lines.push("Set posterior teeth over the residual ridge. Do NOT increase VDO (unless this is a deliberate trial-VDO IPD).");
 lines.push("");
 abutmentDesigns.forEach(a => {
 const claspLine = a.claspType === "Ball Clasp"
 ? `${rpdToothName(a.tooth)}: 18ga wrought wire ball clasp engaging buccal embrasure.`: `${rpdToothName(a.tooth)}: 18ga wrought wire C-clasp engaging 0.02" undercut.`;
 lines.push(claspLine);
 });
 lines.push("");
 lines.push("Denture tooth mold (anterior): [Trubyte Classic mold — TBD at wax-rim try-in].");
 lines.push("Denture tooth mold (posterior): [Trubyte Classic posterior, e.g. F30 10° — TBD at wax-rim try-in].");
 lines.push("Tooth shade: [TBD chairside via Vita shade guide — matched to patient's existing teeth].");
 lines.push("Acrylic gingival shade: 50% OR (original) + 50% DK (dark) per standard mix, or as adjusted at try-in.");
 lines.push("");
 lines.push("Survey cast to identify undercuts; recontour abutments if no usable undercut present.");
 lines.push("Ensure occlusal clearance for clasps.");
 lines.push("");
 lines.push("Please set teeth, festoon, process & polish, and return for delivery.");
 lines.push("Thank you.");
 return lines.join("\n");
 }

 // ── Definitive RPD lab Rx (Axium format, per primary-source examples) ──
 const material = framework.material === "Co-Cr" ? "Co-Cr": framework.material;
 lines.push(`Please fabricate ${material} metal framework for ${archLc} RPD.`);
 lines.push("");

 // Major connector (no Kennedy line — that's on the Preliminary Design Form)
 const mcModifier = majorConnector.note ? ` with ${majorConnector.note.replace("on tissue side", "on the tissue side")}`: "";
 lines.push(`Major connector: ${majorConnector.type}${mcModifier}.`);
 lines.push("");
 // standard convention: standard notice about undercut color-coding on the surveyed cast
 lines.push("* Exact undercuts to engage are marked in red. *");
 lines.push("");

 // Combine abutments and standalone indirect retainers into a single per-tooth
 // list, sorted by tooth number (standard convention). Dual-role teeth (abutment +
 // indirect retainer) are represented in the abutment list — doesn't
 // separately annotate them in the lab Rx.
 const abutmentTeethSet = new Set(abutmentDesigns.map(a => a.tooth));
 const standaloneIndirect = (indirectRetainers || []).filter(r => !abutmentTeethSet.has(r.tooth));

 // Build per-tooth Rx entries with their effective tooth-order rank for sorting.
 const perToothEntries = [];

 abutmentDesigns.forEach(a => {
 const isEsthetic = a.claspType === "Rest Only (no clasp)";
 const parts = [];
 // actual lab Rx convention: Proximal plate FIRST, then Rest, then Clasp, then Reciprocation.
 // Per primary-source examples (Design Case II, framework Design Case 1), the
 // proximal plate IS included even for no-clasp abutments when the major connector
 // contacts that abutment surface.
 const pp = rpdDescribeProximalPlate(a.guidePlane);
 if (pp) parts.push(pp);
 const rest = rpdDescribeRestSeat(a.restSeat);
 if (rest) parts.push(rest);
 if (!isEsthetic) {
 const clasp = rpdDescribeClasp(a, a.attrs);
 if (clasp) parts.push(clasp);
 const recip = rpdDescribeReciprocation(a.claspType, arch, a.attrs);
 if (recip) parts.push(recip);
 }
 perToothEntries.push({ tooth: a.tooth, text: `${rpdToothName(a.tooth)}: ${parts.join(", ")}.` });
 });

 standaloneIndirect.forEach(r => {
 let desc;
 if (/cingulum/i.test(r.restType)) desc = "Cingulum rest";
 else if (/ball/i.test(r.restType)) desc = "Distal ball rest";
 else if (/additional/i.test(r.restType)) desc = "Occlusal rest (additional, for indirect retention)";
 else if (/mesial/i.test(r.restType)) desc = "Mesial rest";
 else if (/distal/i.test(r.restType)) desc = "Distal rest";
 else desc = r.restType.charAt(0).toUpperCase() + r.restType.slice(1);
 perToothEntries.push({ tooth: r.tooth, text: `${rpdToothName(r.tooth)}: ${desc}.` });
 });

 // standard convention: sort by tooth number.
 perToothEntries.sort((a, b) => a.tooth - b.tooth);
 perToothEntries.forEach(e => lines.push(e.text));

 // Retention webbing — one line per span, no "Retention webbing:" prefix
 if (baseDesigns && baseDesigns.length) {
 lines.push("");
 baseDesigns.forEach(b => {
 const span = rpdFormatToothSpan(b.spanTeeth);
 const hasDistalStop = b.note && /distal tissue stop/i.test(b.note);
 const suffix = hasDistalStop ? " with distal tissue stop": "";
 const typeText = b.type === "Open Lattice" ? "Open lattice": b.type;
 lines.push(`${span}: ${typeText}${suffix}.`);
 });
 }

 // red-text rule for Facing / Tube Tooth base designs (Denture Base
 // Considerations pp.14-15 — repeated in red, both lectures): the denture
 // tooth MUST be sent to the lab AT THE TIME OF FRAMEWORK FABRICATION,
 // preferably set in its ideal location. The framework is built around
 // the pre-positioned tooth (vs the standard workflow where teeth are
 // set after framework try-in).
 const hasFacingOrTube = (baseDesigns || []).some(b =>
 b.type === "Facing" || b.type === "Tube Tooth");
 if (hasFacingOrTube) {
 const types = (baseDesigns || []).filter(b => b.type === "Facing" || b.type === "Tube Tooth").map(b => `${b.type} #${rpdFormatToothSpan(b.spanTeeth).replace(/^#/, "")}`).join(", ");
 lines.push("");
 lines.push(`** ${types}: denture tooth MUST be provided to the lab at the time of framework fabrication, set in its ideal location. The framework is cast around the pre-positioned tooth. **`);
 }

 // Maxillary major connector relief callouts (Final Impressions p.21):
 // Mandatory relief over the incisive papilla and median palatal raphe.
 if (arch === "maxillary") {
 lines.push("");
 lines.push("Relief: 0.5 mm relief over the incisive papilla and median palatal raphe (mandatory per protocol).");
 // Posterior boundary per protocol Major Connectors lecture: posterior border at the vibrating
 // line (junction of hard and soft palate), 1-2 mm anterior to the
 // junction for tissue-stop coverage. The exact landmark varies by
 // connector type:
 // • Single Palatal Strap: posterior boundary 6 mm anterior of vibrating line
 // • A-P Strap: anterior strap 6 mm posterior to gingival margins
 // of anterior teeth; posterior strap 6 mm anterior of vibrating line
 // • Full Palatal Plate: posterior boundary AT the vibrating line
 // • U-Shaped: anterior boundary 6 mm posterior to gingival margins
 const mcType = majorConnector.type || "";
 if (/Single Palatal Strap/i.test(mcType)) {
 lines.push("Posterior boundary: 6 mm anterior to the vibrating line. Strap width: 8 mm minimum.");
 lines.push("Anterior boundary: 6 mm posterior to the gingival margins of remaining maxillary teeth.");
 } else if (/A-P Strap|Anterior[- ]Posterior Strap/i.test(mcType)) {
 lines.push("Anterior strap: 6 mm posterior to gingival margins of anterior teeth, 8 mm wide.");
 lines.push("Posterior strap: 6 mm anterior to vibrating line, 6-8 mm wide.");
 lines.push("Lateral straps: ≥4 mm wide; cross the palate at oblique angle for tongue comfort.");
 lines.push("Beading: 0.5 mm finish-line beading on the tissue side of both anterior and posterior straps (per LabRx Example p. 2 — improves border seal and prevents food impaction).");
 } else if (/Full Palatal Plate/i.test(mcType)) {
 lines.push("Posterior boundary: AT the vibrating line (junction of hard and soft palate); confirm with T-burnisher or 'ah' line marking.");
 lines.push("Anterior boundary: extends to lingual surfaces of anterior teeth (NOT covering gingival margin — finish on tooth surface above gingival third).");
 } else if (/U-Shaped|Horseshoe/i.test(mcType)) {
 lines.push("Anterior boundary: 6 mm posterior to gingival margins of remaining maxillary teeth (avoid gingival impingement).");
 lines.push("Posterior boundary: 6 mm anterior of vibrating line.");
 } else if (/Single Palatal Bar/i.test(mcType)) {
 lines.push("Central palate position: midline of palate, 4-6 mm wide (bar profile, not strap).");
 }
 // Framework material thickness — house spec from design references.
 lines.push("Framework metal thickness: 0.5-1.0 mm Co-Cr at major connector; smooth, polished tongue-facing surface.");
 }

 // Mandibular major connector spec: vertical clearance from gingival
 // margin and superior-border position are critical for periodontal health.
 if (arch === "mandibular") {
 const mcType = majorConnector.type || "";
 lines.push("");
 if (/Lingual Bar/i.test(mcType)) {
 lines.push("Lingual bar: superior border ≥3 mm below gingival margins of remaining mandibular teeth (spec). Inferior border at functional vestibular depth (do not impinge on lingual frenum). Half-pear cross-section, 4 mm vertical height minimum.");
 lines.push("Lingual sulcus depth requirement: ≥8 mm (verify clinically before approving design).");
 } else if (/Lingual Plate/i.test(mcType)) {
 lines.push("Lingual plate: extends from superior border ≥3 mm below gingival margins onto cingula of remaining anterior teeth. Finish on tooth surface at cingulum (not gingival margin).");
 lines.push("Rests at terminal abutments are mandatory to prevent plate from acting as orthodontic force on anterior teeth.");
 } else if (/Sublingual Bar/i.test(mcType)) {
 lines.push("Sublingual bar: positioned in floor of mouth, parallel to lingual mucosa, horizontal orientation. Use when high lingual frenum or shallow lingual sulcus prevents standard lingual bar.");
 }
 lines.push("Framework metal thickness: 0.5-1.0 mm Co-Cr at major connector.");
 // Mandibular relief callouts (Final Impressions p. 22). Three
 // anatomical landmarks require 0.5 mm relief because they are bony
 // prominences with thin overlying mucosa — direct framework contact
 // causes ulceration and chronic sore spots.
 lines.push("Relief: 0.5 mm relief over the genial tubercles, mylohyoid ridge, and external oblique ridge (mandatory per protocol).");
 }

 // clasp 1/3 rule reminder (+ Retainers PDF p. 14).
 // Every cast retentive arm is divided into thirds along its length:
 // • Origin third (cast): rigid, above survey line, sits on supragingival
 // enamel. Provides rigid attachment to framework.
 // • Middle third: rigid, at or near survey line. Resists lateral
 // dislodgement during occlusal load (stability).
 // • Terminal third (flex): below survey line, in undercut. Engages
 // 0.01" (cast) or 0.02" (wrought wire) undercut. Provides retention
 // by flexing over the height of contour during seating + retention.
 // The clasp tip should fall in the gingival 1/3 of the crown — NEVER on
 // the gingival margin (causes plaque trap + perio inflammation).
 const hasCastClasps = abutmentDesigns.some(a =>
 ["Akers", "Reverse Akers", "Embrasure", "Ring", "I-bar (esthetic)", "RPI"].includes(a.claspType));
 if (hasCastClasps) {
 lines.push("");
 lines.push("Cast clasp arm position: terminal 1/3 in undercut (0.01\" engagement); middle 1/3 at survey line; origin 1/3 rigid above survey line. Clasp tip in gingival 1/3 of clinical crown — NOT on gingival margin.");
 }

 // Denture tooth mold + shade callouts (per protocol lab Rx convention — these
 // are chairside selections completed at wax-rim try-in; the engine
 // surfaces them as TBD fields so the lab knows to wait for the data).
 const hasDentureTeeth = (baseDesigns || []).some(b =>
 b.type === "Open Lattice" || b.type === "Mesh" || b.type === "Tube Tooth" || b.type === "Facing");
 if (hasDentureTeeth) {
 lines.push("");
 lines.push("Denture tooth mold (anterior): [Trubyte Classic — TBD at wax-rim try-in based on intercanine distance + high-smile line].");
 lines.push("Denture tooth mold (posterior): [Trubyte Classic posterior, e.g. F30 10° — TBD at wax-rim try-in].");
 lines.push("Tooth shade: [TBD chairside via Vita shade guide — matched to existing natural teeth].");
 lines.push("Acrylic gingival shade: [TBD via the gingival shade guide — typically L199-OR or 50% OR + 50% DK mix].");
 }

 // Block out instruction (— surveyor procedure). The
 // student blocks out unwanted undercuts on the cast BEFORE submitting
 // to the lab; this is part of the surveying step. The lab Rx reminds
 // the lab to verify block-out integrity before duplicating the cast for
 // framework casting.
 lines.push("");
 lines.push("Block out: all undercuts NOT engaged by clasps have been blocked out on the master cast with hard baseplate wax (per protocol surveyor protocol,). Lab to verify block-out integrity before duplicating cast for framework investing.");

 // Saddle base sulcus engagement (Huddle 6 p. 1 Q11 — verbatim rule).
 // Mandibular distal extension acrylic saddle must engage the sulcus IN
 // ITS ENTIRETY both buccally AND lingually. Maxillary distal extension
 // saddle must completely engage the BUCCAL sulcus only (palatal side is
 // covered by the major connector).
 const hasDistalExtension = (baseDesigns || []).some(b =>
 b.note && /distal tissue stop/i.test(b.note));
 if (hasDistalExtension) {
 lines.push("");
 if (arch === "mandibular") {
 lines.push("Distal extension saddle acrylic: must engage the sulcus IN ITS ENTIRETY — BOTH buccally AND lingually (Huddle 6 Q11 — verbatim rule). Maximum tissue contact distributes occlusal load across the residual ridge and resists framework rotation under load.");
 } else {
 lines.push("Distal extension saddle acrylic: must COMPLETELY engage the BUCCAL sulcus (Huddle 6 Q11). Palatal coverage is provided by the major connector — saddle extension is buccal-only on the maxilla.");
 }
 }

 lines.push("");
 lines.push("Please return for try-in. Thank you.");
 return lines.join("\n");
}

// ============================================================================
// PHASE 2: MECHANICAL DATA BACKFILL
// ============================================================================

// ─── NMCD Design (Non-Metal Clasp Denture) ────────────────────────────────
/**
 * Per primary sources, there are TWO distinct NMCD variants:
 *
 * 1. NMCD WITH metal major connector (rigid hybrid):
 * - Indications: high esthetic demand, DEFINITIVE prosthesis, Class III
 * or short-span Class IV
 * - Cast metal major connector + thermoplastic / non-metal clasps
 *
 * 2. NMCD WITHOUT metal major connector (pure flexible / Valplast-type):
 * - Indications: metal allergy, few missing anteriors with stable
 * bilateral posterior occlusion, Class III or short-span IV, limited
 * mouth opening
 * - CONTRAINDICATED for definitive use (this is interim-priority);
 * exception per Fueki 2016: definitive permitted for metal allergy patients
 *
 * Both variants share: Class I/II contraindicated (no rigidity for DE);
 * informed consent required; anti-caries protocol; frequent recalls.
 *
 * Short-span IV: "only few missing anterior teeth" — engine uses ≤4 (the four
 * incisors) as the cutoff. Class IV with canines also missing = too wide.
 */
function rpdDesignNMCD(caseInput, kennedy) {
 if (kennedy.class !== "III" && kennedy.class !== "IV") {
 return null; // Class I/II contraindicated regardless of patient factors
 }
 if (!caseInput.patientFactors?.metalAllergy) {
 return null; // Trigger is metal allergy
 }

 // Short-span IV check
 if (kennedy.class === "IV") {
 const primarySpan = kennedy.primarySpans?.[0];
 if (!primarySpan || primarySpan.teeth.length > 4) {
 return {
 applicable: false,
 contraindicated: true,
 reason: `Class IV span of ${primarySpan?.teeth.length || "more than 4"} teeth is too wide for NMCD. Only short-span Class IV (≤4 incisor teeth) is appropriate; the patient's wider anterior span requires definitive cast metal RPD despite the metal allergy (consider Gold framework with MP approval) or implant-supported alternative.`,
 };
 }
 }

 // Compute bounding abutments
 const spans = kennedy.spans;
 const abutments = new Set;
 for (const span of spans) {
 const bounding = [span.beforeBound, span.afterBound].filter(Boolean);
 bounding.forEach(t => abutments.add(t));
 }
 const claspTeeth = Array.from(abutments);

 // restorative-space gating:
 // - NMCD WITH metal major connector: contraindicated if restorative space <6 mm
 // - NMCD WITHOUT metal (pure Valplast): contraindicated if restorative space <5 mm
 // The engine uses categorical interocclusalSpace ("limited" ≈ 5-6mm,
 // "extremely_limited" ≈ <5mm) as a proxy since exact mm isn't a separate
 // input. "extremely_limited" disables both variants; "limited" disables
 // the hybrid (which has the stricter ≥6mm requirement) but permits the
 // pure variant.
 const ioSpace = caseInput.measurements?.interocclusalSpace;
 const hybridSpaceContra = ioSpace === "extremely_limited" || ioSpace === "limited";
 const pureSpaceContra = ioSpace === "extremely_limited";

 return {
 applicable: true,
 designIntent: caseInput.patientFactors?.designIntent || "definitive",
 classQualifier: kennedy.class === "IV" ? "short-span Class IV": "Class III",

 // Option A: hybrid (metal major connector + non-metal clasps)
 hybrid: {
 label: "NMCD with metal major connector (hybrid — definitive option)",
 indication: "High esthetic demand patient who refuses visible cast clasps; definitive prosthesis.",
 material: "Cast metal major connector (Co-Cr or Gold per allergy status) + acetyl resin / PEEK thermoplastic clasps",
 majorConnector: "Metal (cast) — see primary design above",
 claspTeeth,
 claspDescription: "Thermoplastic clasps on each abutment, engaging undercuts (no rest seats / guide planes — adhesive retention)",
 contraindicatedBySpace: hybridSpaceContra,
 spaceContraReason: hybridSpaceContra
 ? `Hybrid NMCD requires ≥6mm restorative space (Non-metal Clasps lecture). The case's interocclusal space is "${ioSpace}" — below threshold. Consider definitive cast metal RPD or implant-supported alternative.`: null,
 },

 // Option B: pure non-metal (Valplast-type)
 pure: {
 label: "Pure NMCD / Valplast (no metal anywhere)",
 indication: "Metal allergy + interim-priority restoration. Definitive use contraindicated except as a Fueki-2016 exception for documented metal allergy patients who refuse the hybrid option.",
 material: "Thermoplastic (acetyl resin, PEEK, or Valplast) throughout — no metal",
 majorConnector: "Thermoplastic / acetyl (no metal connector)",
 claspTeeth,
 claspDescription: "Flexible thermoplastic clasps; no rest seats / guide planes",
 interimPreferred: true,
 contraindicatedBySpace: pureSpaceContra,
 spaceContraReason: pureSpaceContra
 ? `Pure NMCD (no metal) requires ≥5mm restorative space (Non-metal Clasps lecture). The case's interocclusal space is "${ioSpace}" — below threshold.`: null,
 },

 // Shared
 consent: "Signed informed consent required; Managing Partner approval mandatory.",
 additionalContraindications: [
 "Strong mastication forces / parafunctional habit (e.g., clenching)",
 "Severely resorbed residual ridge",
 "Clinically short crowns",
 "Severe tissue undercut",
 "Poor periodontal support",
 "High caries risk",
 "Limited restorative space (<6mm hybrid; <5mm pure)",
 "Poor oral hygiene / compliance / manual dexterity",
 ],
 careProtocol: "Anti-caries products (Prevident, fluoride varnish); more frequent periodic oral evaluations; oral hygiene instructions; caries risk assessment.",
 };
}

// ─── Axium Clinic Steps Sequencer ────────────────────────────────────────
/**
 * clinic workflow for RPD design and treatment planning.
 * Maps design decisions to Axium steps and documentation points.
 */
// RPD clinical sequencing, per the Sequencing of RPD Treatment lecture.
// Steps are organized into: (A) Diagnostic & Treatment Planning, (B) Phase I
// Active Disease Control, (C) Phase II Surgical, (D) Phase III Prosthetic.
const RPD_AXIUM_STEPS = [
 // ── (A) Diagnostic & Treatment Planning ───────────────────────────────
 {
 step: 1,
 phase: "Diagnostic & Treatment Planning",
 clinic: "Comprehensive Oral Examination",
 action: "Medical/dental history (meds, allergies — esp. metal allergy; CC).\nRADIOGRAPHS — BOTH required: full mouth series (FMS, ~18 PAs + 4 BWX) AND panoramic. Not one or the other.\nEXTRAORAL EXAM:\n • Oral cancer screening — palpate lymph nodes (submental, submandibular, cervical, supraclavicular), visual + palpation of lips, perioral skin, parotid + submandibular glands.\n • TMD screening — palpate TMJ + masseter + temporalis; auscultate for joint sounds (clicking, crepitus); measure maximum opening (normal ≥40 mm); lateral excursion range (normal ≥10 mm each side).\nINTRAORAL EXAM:\n • Oral cancer screening — visual + palpation of buccal mucosa, lateral/ventral/dorsal tongue, floor of mouth, soft palate, oropharynx, lips.\n • Hard tissue exam (existing restorations, caries, fractures).\n • Soft tissue exam (gingiva color/texture/contour, frena).\n • Perio exam — full mouth probing depths, BOP, mobility (Miller 0-3), furcation involvement (Glickman I-IV), recession, attached gingiva width, mucogingival defects.\n • Examination of current prosthesis (if existing RPD: fit, retention, occlusion, denture teeth wear, stomatitis).\nDIAGNOSTIC RECORDS:\n • Alginate impressions for diagnostic casts.\n • Occlusal records (centric record if MI unstable; facebow transfer).",
 axiumEntry: "PMH/PDH; CC; FMS + panoramic radiograph notes; EOE/IOE findings (cancer screen, TMD screen with maximum opening + excursion measurements); perio chart with BOP/probing/furcation/mobility/recession; prior prosthesis history; D9310 oral exam code; D0150 comprehensive exam code; D0210 FMS code; D0330 pan code",
 design: "Confirm metal allergy status (gates NMCD). Assess per-abutment perio prognosis (good/fair/poor/hopeless — gates definitive vs interim vs Phase I extraction). Document 3rd molar status (Applegate Rules 2/3). Note maximum opening (<40 mm + bilateral arches = limited mouth opening, NMCD-without-MC may be indicated).",
 },
 {
 step: 2,
 phase: "Diagnostic & Treatment Planning",
 clinic: "Mounting Diagnostic Casts",
 action: "Mount maxillary + mandibular alginate casts on Denar 320 articulator. Mounting is \"absolutely necessary\" for proper RPD diagnosis — HARD GATE, not optional. If casts cannot be hand-articulated in stable MI, wax rims are MANDATORY before mounting.\nFIVE DIAGNOSTIC-CAST QUESTIONS:\n 1. Is a VDO increase needed?\n 2. Are supra-erupted teeth present, and should they be kept?\n 3. Is RCT (root canal therapy) needed on any abutment candidate?\n 4. Is crown lengthening needed for adequate clinical crown height?\n 5. Are mal-positioned teeth worth restoring/orthodontically repositioning, or should they be extracted?\nEvaluate inter-arch relationship, static + dynamic occlusion. Assess VDO, supra-erupted teeth, RCT / crown-lengthening needs.",
 axiumEntry: "Mounting note (Denar 320 + facebow + bite registration if needed); VDO assessment; supra-eruption / occlusal plane findings; answers to the 5 diagnostic-cast questions documented",
 design: "Confirm interocclusal space (gates Open Lattice vs Mesh vs Tube Tooth vs Facing). Note supra-erupted teeth (may need crown lengthening or restoration). Hard rule: do NOT proceed to Phase III without mounted casts and answered diagnostic questions.",
 },
 {
 step: 3,
 phase: "Diagnostic & Treatment Planning",
 clinic: "Survey Diagnostic Casts + Preliminary Partial Denture Design Form",
 action: "SURVEYING PROTOCOL (— required before any design decisions):\n 1. Mount diagnostic cast on dental surveyor (Ney-style); horizontal table.\n 2. Determine PATH OF INSERTION (POI): standard is SINGLE LEVEL POI (no tilt). Rotational paths are reserved for advanced cases.\n 3. With analyzing rod (graphite tip), mark SURVEY LINE on every potential abutment — the line of greatest convexity (HOC, height of contour) along the POI.\n 4. Identify clasp-tip position candidates BELOW the survey line in the gingival 1/3 of the crown.\n 5. With undercut gauge (0.01\" for cast, 0.02\" for wrought wire), measure undercut depth at candidate clasp-tip locations. Record location (mid-B, MB, DB, ML, DL) + depth.\n 6. TRIPOD the cast: scribe 3 reference dots on the cast (one anterior, two posterior) that share a single Z-plane at the chosen POI. This locks the POI so the cast can be re-mounted later.\n 7. BLOCK OUT undercuts NOT engaged by the clasp design with wax — prevents framework binding during seating.\n 8. Mark proximal GUIDE PLANE locations on the cast.\nDESIGN STEPS (after surveying):\n • Propose RPD design per protocol prosthodontic principles.\n • Identify tooth modifications needed; survey-crown vs enameloplasty decisions.\n • Duplicate diagnostic cast; practice tooth modifications.\n • Fill out Preliminary Partial Denture Design Form (Lab 4 p. 2 sequence: propose with peer → instructor confirms → survey casts → complete form → draw on casts → complete lab Rx → practice guide planes/rest seats).\n • Form must mark all 7 elements: guide planes, rest seats, undercuts, HOC, clasps, minor connectors, major connector (Lab 4 p. 4).\n • RED-PEN items on form: acrylic portion, undercuts, the circle around HOC, tissue stop (Lab 4 p. 6).\nDESIGN PROHIBITIONS:\n • INTRACORONAL RETAINERS (precision attachments within crown restorations) are CONTRAINDICATED for distal extension RPDs. They lack a stress-breaker mechanism — under occlusal load on the saddle, the framework transmits torque directly to the abutment via the rigid intracoronal pin, risking tooth fracture or PDL trauma. Use RPI or Combination for distal extensions instead.\nCLASP ASSEMBLY FUNCTION MAP (Huddle 3 p. 1 Q1 — exam identification):\n • PROXIMAL PLATE → connection of the clasp assembly to the major connector.\n • RECIPROCAL ARM → stabilization (resists horizontal forces, counters the retentive arm during insertion).\n • RETENTIVE ARM → retention (engages undercut; flexes over HOC during seating + removal).\n • REST → support (positive vertical stop; transmits occlusal load through long axis of abutment).\nEvery RPD direct retainer must include ALL FOUR components or have one explicitly substituted (e.g., RPI replaces the cast circumferential reciprocal arm with the major connector plating + proximal plate combination).\nENCIRCLEMENT RULE: clasp assembly must encompass >180° of tooth circumference OR have a minimum of 3 widely separated contact points. Insufficient encirclement = unstable clasp + risk of orthodontic force on abutment.\nCLASP ARM TAPER (Retainers PDF p. 12, McCracken): retentive arm tapers in BOTH thickness AND width (only terminal third flexes); reciprocal arm tapers in thickness ONLY (width stays uniform for rigidity). Taper region ≈ one tenth or less of clasp length.\nCLASP MATERIAL FLEXIBILITY (Retainers PDF p. 11-13): wrought wire (round cross-section) flexes in ALL spatial planes → flexible. Cast metal flexes in ONE plane only → rigid. Flexibility rank: wrought wire > cast gold > Cr-Co. This is why Combination uses WW for the retentive arm (stress-release) on a distal extension where the saddle moves.\nSUPRABULGE vs INFRABULGE TAXONOMY:\n • SUPRABULGE clasps (approach survey line from occlusal): Akers, Embrasure, Ring. Origin from rest seat above HOC, retentive third drops below HOC.\n • INFRABULGE clasps (approach from gingival vestibule): I-bar (RPI), T-bar, modified T-bar, Y-bar. Origin from the major connector at the vestibule level, retentive third rises to engage HOC from below. Only ONE terminal engages the undercut — more esthetic than suprabulge (less metal visible).\nBAR CLASP VARIANTS:\n • I-bar: straight vertical bar from major connector, single terminal point engaging mid-buccal undercut at gingival 1/3. Standard RPI component.\n • T-bar: I-bar approach + horizontal cross-bar at the terminal forming a T-shape. Engages two points across the buccal HOC. Used when single-point retention is inadequate.\n • Modified T-bar: T-bar with one shorter terminal arm (asymmetric T). Used when one side of the tooth has unfavorable contour.\n • Y-bar: I-bar approach with bifurcated terminal forming a Y-shape. Engages mesio-buccal AND disto-buccal undercuts simultaneously. Highest retention of the bar family, used when patient cannot tolerate forces of multiple I-bars elsewhere.",
 axiumEntry: "Surveying note: POI determined + tripod marks scribed + undercut measurements per abutment recorded. Preliminary Partial Denture Design Form (separate from lab Rx); design rationales documented.",
 design: "Finalize Kennedy classification. Run engine: major connector, per-abutment clasp + rest + guide plane, indirect retainers, base design, framework material. Surface red flags for clinician review.",
 },
 // ── (B) Phase I: Active Disease Control ────────────────────────────────
 {
 step: 4,
 phase: "Phase I: Active Disease Control",
 clinic: "Necessary Extractions, Periodontal Therapy, Caries Control",
 action: "Extract teeth flagged as hopeless. Periodontal therapy (SRP, re-evaluation 4-6 weeks). Caries control. Re-classify arch per Applegate's Rule 1 if extractions alter the classification.",
 axiumEntry: "Extraction notes; perio re-eval results; caries treatment completion",
 design: "After extractions, re-input case to engine to update Kennedy classification.",
 },
 // ── (C) Phase II: Surgical Phase ──────────────────────────────────────
 {
 step: 5,
 phase: "Phase II: Surgical",
 clinic: "Pre-Prosthetic Surgery + Implant Placement (if indicated)",
 action: "PRE-PROSTHETIC SURGICAL INTERVENTIONS:\n • Tori removal — palatal tori obstructing major connector path; mandibular tori obstructing lingual bar. If retained: switch maxillary connector to U-Shaped or Full Palatal Plate AROUND the torus; switch mandibular to Lingual Plate (avoids torus completely).\n • Hyperplastic tissue removal — flabby maxillary tuberosity, redundant ridge tissue (epulis fissuratum from ill-fitting denture). Excise + suture; 6-week soft-tissue heal before impression.\n • Frenectomy — if frenum attachment within 3 mm of crest disrupts peripheral seal or denture stability. Mandibular lingual frenum + maxillary labial frenum are common candidates.\n • Alveoplasty — smooth sharp ridge crests, remove bony spicules palpable through mucosa. Often combined with extractions in Phase I.\n • Tuberosity reduction — overlarge maxillary tuberosities that impinge on coronoid space on opening; flag if patient reports limited mouth opening with current prosthesis.\n • Vestibuloplasty — increase vestibular depth in atrophic ridges. Rare for RPDs (mostly used for complete dentures with severe resorption); refer to OS.\n • Implant placement — if RPD design incorporates implant abutments (distal extension Class I/II support, locator attachments). 4-6 mo osseointegration period.\n • Crown lengthening — surgical for sub-gingival rest seat access; handled per crown lengthening red flag.\nHEALING PERIOD: 6 months minimum after any extraction or bone surgery before definitive RPD impressions; 6 weeks for soft-tissue-only procedures (frenectomy, hyperplastic tissue excision).",
 axiumEntry: "Surgical procedure notes (per intervention); healing timeline (≥6 mo bone surgery / ≥6 wk soft tissue); follow-up evaluation note",
 design: "If mandibular tori NOT surgically removed → engine selects Lingual Plate automatically. If palatal torus NOT removed → engine selects U-Shaped or Full Palatal Plate. If healing <6mo → BLOCKER red flag, IPD recommended as transitional.",
 },
 // ── (D) Phase III: Prosthetic Phase ────────────────────────────────────
 {
 step: 6,
 phase: "Phase III: Prosthetic",
 clinic: "Abutment Tooth Preparation",
 action: "DECISION POINT: enameloplasty (minor modifications) vs SURVEY CROWN PATHWAY (significant modifications).\n\nMINOR MODIFICATIONS (sound enamel, no existing restorations) — standard prep sequence:\n 1. GUIDE PLANES first — proximal surfaces, parallel to path of insertion (cylindrical diamond bur)\n 2. AXIAL TOOTH CONTOURS — modify if HOC unfavorable for selected direct retainer\n 3. CREATE UNDERCUTS if necessary\n 4. VERIFICATION CAST: take alginate impression, pour FAST-SET STONE cast, CHECK axial wall modifications on the surveyor. This verification gate is REQUIRED before rest seat prep — rest seats are last only AFTER verification cast confirms axial modifications are correct.\n 5. Repeat steps 1-4 if verification cast shows errors.\n 6. REST SEATS prepared LAST (premolars: #4 + #6 round burs; molars: #4, #6, #8 round burs; cingulum rests: inverted cone)\n\nSURVEY CROWN PATHWAY (when abutment has extensive restorations, occlusal plane discrepancy, insufficient enamel for rest seat, or HOC obstruction not correctable by enameloplasty) — multi-appointment workflow Part A pp. 12-16:\n APPT 1: Crown preps for survey crowns. PFM substrate REQUIRED — IPS e.max/Empress/zirconia NOT compatible (porcelain cracks under rest load). Numeric specs: 2.5-3.0 mm TOTAL occlusal reduction at rest seat area, 0.5-1.0 mm metal thickness. Rest seats + guide planes IN METAL. Final impression: light + medium OR heavy body PVS. Temporize with Integrity. Send to lab for pour + Pindex.\n LAB 1: Lab pours master cast, Pindexes. If able to hand-articulate casts, lab fabricates wax rims on master cast.\n APPT 2: Take bite registration on wax rims (skip if able to hand-articulate). Denar facebow + Regisil bite registration.\n LAB 2: Lab mounts master cast (hand-articulate or via bite registration). Lab fabricates survey crowns + returns mounted master cast.\n PRE-CEMENTATION VERIFICATION GATE (p. 14 — REQUIRED before APPT 3): place survey crowns on the surveyor on the master cast. Verify positive rest seats, ideal HOC, ideal guide planes are ALL present on the survey crown contour. If any spec is missing, send back to lab for adjustment. Do NOT cement until surveyor verification passes.\n APPT 3: Cement survey crowns. Take NEW alginate impressions (the survey crowns are now the substrate — diagnostic cast is obsolete).\n RESTART RPD SEQUENCE: post-cementation, restart the RPD impression workflow with: NEW alginate → NEW diagnostic cast → NEW custom tray → border-mold → single-step selective-pressure final impression. The pre-survey-crown master cast is discarded.\n LAB 3: Duplicate the NEW diagnostic cast → practice abutment teeth preparations on cast (guide planes, HOC modification, undercut modification, rest seats).\n APPT 4: Prepare patient's abutment teeth (the survey crowns are now the substrate). Take alginate, pour Snap stone, verify proper preparations with surveyor.",
 axiumEntry: "Tooth modification sequence completed (per abutment, in order); rest seat verification. Survey crown notes: prep code (D2740 — Crown, porcelain fused to metal), survey crown cement code (D2950 if core buildup), survey crown design rationale.",
 design: "For survey-crown candidates: 2.5-3.0 mm occlusal tooth reduction at rest seat area; 0.5-1 mm metal thickness; PFM substrate REQUIRED — IPS e.max / Empress / zirconia are NOT compatible with rest seats. Rest seats + guide planes IN METAL.",
 },
 {
 step: 7,
 phase: "Phase III: Prosthetic",
 clinic: "Final Impression + Lab Rx + Framework Fabrication",
 action: "CUSTOM TRAY (FI protocol):\n • Material: Triad LC (light-cured resin). Pattern resin is fallback if Triad doesn't bond securely.\n • Spacer asymmetry: 2 sheets baseplate wax over teeth + tooth-supported edentulous areas; 1 sheet over distal extension areas (this is the selective-pressure technique).\n • Vestibular extension: 2 mm short of full vestibular depth.\n • Border wax relief: remove 2 mm wax from intaglio borders on impression day to allow border-mold compound.\n • Cure cycle: 2 min top, 1 min intaglio. WAX MUST NOT MELT.\n • Relief hole: maxillary tray YES, mandibular tray NO.\n • Handles: finger rests at 1st molar region; anterior handle so it doesn't interfere with impression.\nBORDER MOLDING:\n • Maxillary: distal extension areas only.\n • Mandibular: distal extension areas AND entire lingual vestibule.\n • Material: green-stick compound, Hanau torch.\n • Reduce border thickness 0.5 mm before final impression.\nFINAL IMPRESSION:\n • PVS adhesive applied to tray, 10-minute dry time before loading.\n • Light body PVS on teeth; medium or heavy body in tray.\n • Single-step selective-pressure technique (the 2/1 spacer asymmetry + viscosity split IS the selective pressure).\nMASTER CAST POUR:\n • Type III stone (Coe-Cal or Microstone).\n • Wait 24-48 hours; soak cast in warm water before separating impression to soften compound.\nMASTER CAST PRE-LAB CHECKLIST (Huddle 3 p. 3 Q4 — required before shipping):\n ☐ HOC (Height of Contour) lines drawn on every potential abutment with analyzing rod (graphite tip).\n ☐ Undercut depth marked with RED DOT at each clasp-tip location + label: 0.01\" (cast clasps) or 0.02\" (wrought wire).\n ☐ Tripod marks scribed: 3 reference points at single Z-plane — convention is a BLACK LINE through a RED CIRCLE at each tripod point.\n ☐ Block out completed: all undercuts NOT engaged by clasps filled with hard baseplate wax.\n ☐ Path of insertion (POI) clearly documented (single level POI for predoctoral; rotational only for advanced).\nMARKING CONVENTION FOR LAB CAST:\n • Master cast: tripod marks, exact undercut points (RED), HOC of abutments.\n • Design cast: full framework design.\n • Metal components: BLUE ink (framework outline, rests, clasps, major connector).\n • RED ink: tissue stops, wrought wire, acrylic base extensions, undercut points, relief over palatal raphe/incisive papilla.\nSEND TO LAB: Axium Lab Rx (this engine's output), master cast, design cast.\nFRAMEWORK TRY-IN (in order):\n 1. On master cast first: verify rest seats flush, clasps engage correct undercuts, major connector adapted.\n 2. Intraorally with disclosing wax thinly painted on metal-tooth contact areas.\n 3. DO NOT FORCE the framework — adjust binding spots with high-speed coarse diamond bur.\n 4. Repeat until passive seating intraorally matches cast seating.\nFRAMEWORK TRY-IN 6-POINT FAILURE CHECKLIST (Fabrication of Custom Tray + Framework Try-In — verify all 6 before approving):\n ☐ DESIGN correctness: framework matches the Preliminary Design Form + lab Rx.\n ☐ ROCKING: framework does not rock when seated; pressure on one rest does not lift the contralateral side.\n ☐ REST SEATS flush + fully seated: no gap between rest and prepared rest seat (verify with disclosing wax).\n ☐ CLASPS engaging the CORRECT undercut surface + depth.\n ☐ MAJOR CONNECTOR adapted to tissue with no gross discrepancies.\n ☐ LATTICE-TO-TISSUE DISTANCE noted: large gap at distal extension = altered cast technique likely needed; small uniform gap is normal (acrylic will fill).\nADJUSTMENT RULE: leave BROAD AND EVEN contacts; remove only SMALL METAL SHOW-THROUGHS in disclosing wax. Broad contacts distribute load; pinpoint contacts concentrate force on abutment.\nOCCLUSION CHECK: occlusion must be the SAME with AND without framework in place. If bilateral arches, check one arch at a time, then both together.\nALTERED CAST: only if framework-try-in disclosing wax reveals discrepancy between cast and mouth, OR flabby distal-extension tissue. default is single-step.\nDuring altered-cast impression: PRESS ON REST SEATS ONLY — do NOT press on distal extension framework.\nWAX RIM / TEETH SET-UP / PROCESSING / DELIVERY.",
 axiumEntry: "Lab Rx submitted (D5213/D5214 definitive; D5820/D5821 interim); framework try-in note (disclosing-wax check); altered cast impression note if indicated; final delivery note",
 design: "This engine's lab script section becomes the Rx text. Procedure code in metadata. Maxillary lab Rx must include 0.5 mm relief over incisive papilla and median palatal raphe.",
 },
 {
 step: 8,
 phase: "Phase III: Prosthetic",
 clinic: "Wax Rim / Wax Try-In + Bite Registration",
 action: "WAX RIM CONSTRUCTION:\n • Apply vaseline to abutments + ridge → soft baseplate wax pressed over framework saddle → heat with torch → seat framework → expose UPPER HALF of superior framework lattice → Triad LC pressed above lattice → cure 1 min top / remount / 2 min top / 1 min intaglio.\n • Triad layer must end AT the external finish line of the framework.\n • Remove wax from retromolar pad area before cure.\n • Use GREENIE and BROWNIE lab burs for framework adjustment/polish (silicone polishers — Greenie coarse, Brownie fine).\nWAX RIM TRY-IN (after framework fits passively):\n • Add baseplate wax to retentive lattice/mesh areas of framework. Build a wax occlusion rim on the edentulous saddles.\n • Adjust wax rim with Fox plane: maxillary plane parallel to ala-tragus line + interpupillary line.\n • Anterior wax rim: 1-2 mm visible at rest, ~70° inclination, 6-8 mm thick (lip support).\n • Mark MIDLINE (between maxillary central incisors, aligned with philtrum + chin midline).\n • Mark CANINE LINES (distal of maxillary canine = approximately corners of mouth in repose).\n • Mark HIGH SMILE LINE (incisal edge of maxillary central incisor visible during full smile — select anterior mold based on this measurement).\n • Mark INTERCANINE DISTANCE (canine-to-canine distance — anterior mold selection).\n • VDR (vertical dimension at rest) marked.\n • Mandibular wax rim: adjust occlusal plane to match maxillary, achieve proper VDO.\n • CLEARANCE CHECK: ≥1 mm of clearance between wax rims and the opposing dental arch (Wax Rims p. 5 — threshold). Insufficient clearance = wax rim cannot achieve proper VDO; trim wax rim down by 1+ mm before bite registration.\nVDO DETERMINATION:\n • Closest speaking space test: have patient say \"Mississippi\"; observe inter-incisor gap during /s/ — should be ~1 mm. >1 mm = VDO too low; closure (teeth touch) = VDO too high.\n • Phonetic test for /F/ /V/: max incisor incisal edges should contact wet-dry border of lower lip vermilion during sustained /F/ phonation. If teeth go BEHIND lower lip = teeth too short or set too lingual. If teeth pass below the wet-dry border = teeth too long.\n • /S/ test: clear /S/ sibilant indicates correct anterior position; lisp = teeth too far forward or VDO too high; whistle = teeth too far back.\n • Facial measurement: nasion-menton at REST (lips relaxed, no contact) MINUS 2-4 mm = VDO at occlusion (— the standard range).\n • Swallowing reflex: have patient swallow then relax — teeth should not contact (VDR is when teeth apart; VDO when in MI).\nBITE REGISTRATION (-9 — the protocol):\n • REFERENCE POSITION: MI (Maximum Intercuspation) is the operating reference for RPD, NOT CR. The patient's existing MI defines VDO; CR/CO is only used as a fallback when stable MI is missing (insufficient remaining tooth contacts).\n • RECORD BASE + WAX RIM is required for the bite registration ONLY when bite is unstable or large edentulous spaces are present. If MI is stable on remaining natural teeth, hand articulation suffices for the mandibular cast mounting.\n • Denar facebow: bite fork on maxillary wax rim, transfer to Denar articulator (standard — NOT Hanau).\n • Bite registration material: Regisil PVS OR Alluwax. Place between wax rims at established MI/VDO.\n • Verify ALL natural teeth touching simultaneously when checking the bite record.\n • Verify the cast bite matches the intraoral bite BEFORE mounting.\n • If MI unstable (fall back to CR): bimanual Dawson technique — patient relaxed, gentle posterior pressure on chin + upward force at ramus.\n • Send mounted casts to lab for tooth set-up.\nDENTURE TOOTH SELECTION (concurrent):\n • Tooth shade: Vita Classical (A1-D4) or Vita 3D-Master. Evaluate under overhead + ambient + natural light at arm's length. Match VALUE first, then chroma, then hue. Aging considerations: A3/A3.5 for patients 40+, B2/B3 for younger.\n • Gingival shade: the gingival shade guide (typically OR original or 50% OR + 50% DK mix). Match patient's keratinized gingiva.\n • Anterior mold: Trubyte Classic anterior, selected via intercanine distance + high smile line + face shape (square / tapered / ovoid — Williams classification matches tooth form to face form).\n • Posterior mold: Trubyte Classic posterior (e.g. F30 10° = 30-tooth size with 10° cuspal inclination; 0° cusp for full balanced; 10-20° for monoplane group function).\nPOSTERIOR TOOTH SET-UP RULES:\n • Tooth-to-tooth relationship (3 accepted patterns): cusp-to-marginal-ridge (most common), cusp-to-fossa (ideal balanced), or cusp-to-cusp (acceptable when ridge alignment forces it).\n • Mandibular CENTRAL GROOVES must align with the crest of the residual alveolar ridge — line extended back to the retromolar pad landing area. This is non-negotiable: posterior teeth set BL-offset from ridge crest will lever the saddle on chewing.\n • Mandibular posteriors must be set ANTERIOR to the ascending ramus — distal extension cannot lap onto the ramus.\n • Number of teeth replaced ≠ number missing — judgment call; e.g., if 1st molar to 3rd molar are missing, often only 1st molar + (sometimes) 2nd molar are replaced; 3rd is typically omitted (per Applegate Rules).\n • Acrylic teeth may be modified in: HEIGHT (occlusal reduction), INTAGLIO (fit to ridge), MESIODISTAL WIDTH (narrow to fit space), OCCLUSAL SURFACE (cuspal adjustment), PROXIMAL SURFACES (modification for framework clearance) — five permitted modifications.\n • Proximal modification: to accommodate framework without compromising esthetics.\n • Decide STATIC + DYNAMIC occlusal scheme BEFORE setting teeth — group function vs bilateral balanced determined at design phase.\n • Setting tool: #7 wax spatula to melt baseplate wax for tooth placement.\nSIX SET-UP CRITERIA — evaluated for every tooth:\n 1. Bucco-lingual tilt\n 2. Mesio-distal tilt\n 3. Gingival margin location\n 4. Occlusal contact\n 5. Bucco-lingual position (over residual ridge)\n 6. Central groove on ridge crest\nFESTOONING RULES:\n • Use patient's natural gingival contours as guide.\n • Slightly EXAGGERATE festoon depth (smoothens during polishing — flat festoon = unnatural).\n • Do NOT move teeth while festooning (don't aim Hanau torch flame at wax adjacent to teeth — will displace them).\n • Shade-match the gingival shade (the gingival shade guide — typically OR or 50% OR + 50% DK mix).\nPROCESSING:\n • Compression molding: investment → boil out → pack acrylic → heat process → deflask → lab remount (verify occlusion in articulator) → finish/polish.\nWAX TRY-IN (after lab sets teeth):\n • Try framework + wax-set teeth intraorally. Verify ALL of:\n 1. VDO (re-check with closest speaking space / phonetics)\n 2. OVJ (1-2 mm horizontal overlap)\n 3. OVB (1-2 mm vertical overlap, no edge-to-edge)\n 4. Midline alignment (philtrum + chin)\n 5. Occlusion at CR (premature contacts on denture teeth, never natural)\n 6. Phonetics (S / F-V / TH clarity)\n 7. Esthetics — patient approves tooth shade + mold + arrangement (give patient hand mirror; ask in positive terms)\n 8. Lip support (no lip collapse at rest)\n 9. Buccal corridor (denture teeth fill the visible curve when smiling)\n • If unacceptable, return to lab with specific tooth-by-tooth changes noted.\n • If acceptable, send back to lab for processing.",
 axiumEntry: "Wax rim try-in note (Fox plane orientation, midline + canine line + high smile line marked); bite registration (Denar facebow + Regisil in CR); tooth shade/mold selection; wax try-in approval (VDO, OVJ/OVB, midline, occlusion, phonetics, esthetics confirmed); D5213/D5214 procedure code",
 design: "Wax try-in is the LAST chance to adjust tooth position, shade, or VDO before processing. Lab cannot reverse acrylic processing. Use tray sheet to document patient approval with signature.",
 },
 // ── (E) Phase IV: Post-Delivery Follow-up (per protocol Delivery RPD lecture) ──
 {
 step: 9,
 phase: "Phase IV: Post-Delivery Follow-Up",
 clinic: "Delivery Day + 24-Hour Recall",
 action: "INTAGLIO FIT CHECK (PIP paste + Mizzy spray):\n • Maxillary pressure spots to identify and adjust (Delivery RPD p. 8): buccal posterior border parallel to tuberosities, hamular notch bilaterally, zygomatic-arch temporal root, rugae, mid-palatal suture/torus, incisive papilla.\n • Mandibular pressure spots (Delivery RPD p. 9): lingual ridge (especially premolar), mylohyoid ridge, buccal shelf, retromylohyoid space, retromolar pad, disto-buccal in ramus / external oblique area, genial tubercles.\n • Apply PIP in thin uniform layer in ONE DIRECTION (brush strokes uniform → easier to read high spots — Delivery p. 6).\n • Then spray Mizzy ON THE PIP (NOT on the residual ridge tissue) — Mizzy keeps PIP on the RPD and prevents it from spreading to lips/cheeks. This is the reverse of the complete denture protocol.\n • Seat with light hand pressure at 1st molar position; remove after 5 sec; reduce high spots (show-through) with lab burs.\n • Repeat until no high-pressure show-through.\nDISCLOSING WAX (separate test from PIP — Delivery p. 9): verify proximal plate + rest seat metal-to-tooth contact. Thin wax painted on metal contact surfaces; framework seated and removed; displaced wax = binding spot. PIP is for ACRYLIC-to-tissue contact; disclosing wax is for METAL-to-tooth contact. Use BOTH at delivery.\nFRAMEWORK CONTACT VERIFICATION:\n • Disclosing wax thinly painted on metal-tooth contacts; framework seated and removed; any displaced wax = binding spot. Adjust with high-speed coarse diamond bur.\n • Verify proximal plate + rest seat seat passively on each abutment.\nOCCLUSION ADJUSTMENT (AccuFilm II or Surgident full-arch horseshoe articulating paper — -specific brand standard, Delivery p. 13):\n • ADJUSTMENT LOGIC (Delivery p. 14): if inter-occlusal contact is high BUT framework seats without interference, the prematurity is on the DENTURE TEETH (not the framework). Reduce denture teeth GRADUALLY until natural-tooth occlusion AND VDO re-establish simultaneously.\n • Reduce premature contacts on DENTURE TEETH ONLY until natural teeth occlude simultaneously in MI.\n • Do NOT reduce natural tooth structure for occlusion.\nCLINICAL REMOUNT PROTOCOL (Delivery p. 16 — for cases with persistent occlusal issues after delivery): fabricate a remount jig OR retake new facebow + new bite registration + take a PICK-UP IMPRESSION with the RPD seated. Send to lab for articulator remount + occlusal refinement. Common indication: distal extension cases where occlusion changes after the saddle settles into the ridge over the first few weeks.\n • Check lateral excursions per opposing arch type: GROUP FUNCTION (no balancing interferences) for natural-opposing; BILATERAL BALANCED for CD-opposing.\n • Check protrusion: posterior disclusion with anterior contact in natural-opposing; protrusive contact in CD-opposing.\nCLASP ADJUSTMENT:\n • Bird Beak pliers (cast metal, narrow tips) or Three Prong pliers (wrought wire, 3-point grip).\n • Cast clasps are HARDER than wrought wire — fewer adjustment cycles tolerated. I-bar adjusted INWARD/OUTWARD only; never twist. Cast Akers adjusted in HORIZONTAL plane only (don't bend vertically — risks fracture at the rest seat origin).\nPOLISH:\n • Metal kit on framework (polishing wheels + rouge).\n • Pumice + rag wheel for acrylic flange surfaces.\n • DO NOT polish intaglio (changes tissue fit) or denture teeth (removes anatomy).\nPATIENT INSTRUCTIONS (standard handout):\n • FIRST 24 HOURS: wear continuously (helps tissue adapt + identifies sore spots). After 24 hours: remove nightly, soak in water or denture cleaner solution.\n • NIGHTLY REMOVAL is non-negotiable — wearing 24/7 causes denture stomatitis (Candida albicans), papillary hyperplasia of palate, accelerated ridge resorption.\n • CLEANING: soft denture brush + mild soap OR denture cleaner (Polident, Efferdent). NEVER toothpaste — abrasive, scratches acrylic, traps plaque.\n • STORAGE: water-filled container with denture cleaner tablet, OR plain water. NEVER let denture dry out (acrylic warps).\n • NEVER bleach: corrodes metal framework, weakens acrylic.\n • DIET: start soft (yogurt, mashed potato, soft pasta) for first 1-2 days. Gradually progress to firm. Cut food into small pieces. Chew BILATERALLY (both sides simultaneously) to balance load on framework.\n • HOT DRINKS/FOOD: cool slightly before consuming with denture in (acrylic can warp; tongue may not register temperature normally with palatal coverage).\n • SPEECH: 2-3 weeks adaptation expected. Read aloud daily (Delivery p. 21 — concrete adaptation drill, accelerates phonetic mapping for the new tooth positions).\n • SALIVA: increased flow first few days is normal; subsides as adaptation occurs.\n • SORE SPOTS: expected days 1-3; call clinic if pain persists past day 3 or causes inability to wear.\n • SMOKING: discouraged — accelerates ridge resorption, stains acrylic, increases stomatitis risk.\n • XEROSTOMIA RISK (Delivery p. 27): patients on xerogenic medications or with radiation history are at elevated risk for ROOT CARIES specifically AROUND THE RETAINERS — the clasp + plate trap plaque against the abutment surface. Prescribe Prevident 5000 or 5% NaF varnish 3x/year; recall every 3 months.\n • RECALL: 24-hour follow-up scheduled. Subsequent recalls per risk profile (3-mo high-caries/perio; 6-mo low risk).\n • EMERGENCIES: if clasp arm fractures or rest seat breaks, do NOT attempt to wear — call clinic same-day.",
 axiumEntry: "Delivery note (D5213/D5214); intaglio adjustment note; occlusal adjustments; pressure-spot adjustments; clinical-remount note if pick-up impression taken; printed patient instruction handout reviewed + signed; 24-hour follow-up scheduled",
 design: "Avoid delivery the day before a holiday or weekend (patient needs same-week access for adjustments). Document each adjustment with which surface + how much was reduced.",
 },
 {
 step: 10,
 phase: "Phase IV: Post-Delivery Follow-Up",
 clinic: "24-Hour Follow-Up + 1-Week Follow-Up",
 action: "24-hour follow-up: identify and adjust soft tissue irritation, verify intaglio comfort, re-check occlusion. 1-week follow-up: re-evaluate patient adaptation, check for sore spots, re-evaluate occlusion under function, reinforce home-care + nightly removal + water storage. Subsequent recall every 6 months (or 3-4 months for high-perio-risk patients).",
 axiumEntry: "D9445 (Office visit — follow-up); adjustment notes; sore spot relief notes; recall schedule",
 design: "If Class I distal extension RPD begins rotating around the fulcrum line at follow-up (alginate test: thick alginate on intaglio = reline indicated), schedule lab reline.",
 },
 {
 step: 11,
 phase: "Phase IV: Post-Delivery Follow-Up",
 clinic: "Long-Term Recall + Maintenance Decision Tree",
 action: "RECALL SCHEDULE:\n • Low/moderate caries + low perio risk: 6-month recall.\n • High/extreme caries OR moderate/high perio risk: 3-month recall.\n • Combination Syndrome at risk (mand Class I vs maxillary CD): 3-month recall + clinical remount at 1 yr.\nAT EACH RECALL:\n • Re-prob abutments + monitor mobility (Miller class 0-3 — Miller 2+ at abutment is a serious red flag).\n • PIP-paste fit check intaglio.\nRELINE DIAGNOSTIC TESTS (Reline/Rebase/Repair):\n • CLASSIC ROTATION TEST: have patient seat the RPD with finger pressure ONLY on the most-distal point of the saddle. Observe whether the anterior indirect retainer rises off the abutment. Lift = framework rotates around the fulcrum line = ridge resorption + lab reline indicated.\n • ALGINATE TEST: thin layer of alginate on the intaglio of the RPD; seat with finger pressure on REST SEATS ONLY (never the distal extension). After set, remove and measure alginate thickness at the distal extension. Thick film = ridge has resorbed away from the saddle = lab reline indicated.\nIMPRESSION TECHNIQUE FOR RELINE:\n • CLOSED-MOUTH technique: tooth-supported cases. Patient bites into MI; the bite force seats the RPD evenly. PVS captures intaglio against passively-seated framework.\n • OPEN-MOUTH technique: distal extension cases. Dentist holds the RPD seated by applying finger pressure on REST SEATS + major connector ONLY (NOT on the distal extension) — prevents overseating that would distort the ridge contour record.\n • Verify clasp retention (adjust with Bird Beak or Three Prong pliers if loose).\n • Re-take radiographs of abutments yearly (PA + BWX, evaluate crestal bone level around abutments — 1 mm bone loss/year average; >2 mm/year = active disease).\n • Verify occlusion (AccuFilm); refine premature contacts on denture teeth, never on natural teeth.\n • Caries risk reassessment + CAMBRA prescription renewal.\n • Inspect for denture stomatitis (erythema under palatal coverage, papillary hyperplasia, angular cheilitis = systemic Candida).\nDECISION TREE WHEN RPD HAS ISSUES (in order of intervention severity):\n • SORE SPOT only, framework + occlusion fine → CHAIRSIDE ADJUSTMENT (D5410 max / D5411 mand). Mark sore spot with Thompson stick; transfer to intaglio; reduce with lab bur; smooth + polish. Done in single visit.\n • CLASP ARM FRACTURED → REPAIR (D5640 — Replace broken clasp). Lab strips old clasp arm from framework; wrought wire or new cast arm soldered. Cast Co-Cr cannot be welded but CAN be soldered with appropriate gold solder. turnaround: ~5 business days.\n • TOOTH FRACTURED or worn through → ADD TOOTH (D5650). Lab adds replacement denture tooth to existing acrylic base. Single tooth only — multiple = rebase.\n • CLASP NEEDED on new abutment (after re-classification post-extraction) → ADD CLASP (D5660). Lab adds wrought wire clasp + acrylic flange extension to existing prosthesis.\n • ACRYLIC FLANGE CHIPPED or chipped denture tooth → REPAIR ACRYLIC (D5630). Lab adds new acrylic + denture tooth as needed.\n • Tender ridge / acutely sore tissue, no other failure → TISSUE CONDITIONER (Coe-Comfort, D5850) chairside soft reline. Replace weekly for 2-3 wk to allow tissue rest. NOT a definitive reline.\n • Chronically tender residual ridge (severe resorption, bony spicules) → SOFT RELINE (Coe-Soft, D5740/D5741) lab-processed. Semi-permanent; replace every 6-12 mo.\n • Ridge resorption only, framework still fits + denture teeth intact → LAB HARD RELINE (D5750/D5751) with GC Reline. Take pickup impression with the RPD seated; ship to lab with bite reg. does NOT recommend chairside hard reline for RPDs — poor bond to Co-Cr framework.\n • Framework fits + denture teeth worn or chipped (multiple) → REBASE (D5710/D5711). Lab strips old base resin and re-processes new base + new teeth on existing framework.\n • Framework fractured (rest seat broken, clasp arm broken AND not repairable) OR design inadequate (no rests, no indirect retainers, no path of insertion) → REMAKE (D5213/D5214). Cast Co-Cr cannot be reliably welded for rests/connectors; trying to repair is throwing good labor after a bad framework.\n • If 2+ failure modes present, lean REMAKE (don't reline a poorly-designed framework — you're investing in a doomed prosthesis).\nDENTURE STOMATITIS PROTOCOL (if erythema/papillary hyperplasia detected):\n • Confirm nightly removal compliance — non-compliance is the #1 cause.\n • Prescribe nystatin oral suspension (100,000 U/mL) 5 mL swish-and-spit QID × 14 days; ALSO soak denture in nystatin overnight × 14 days.\n • Alternative: clotrimazole troches 10 mg × 5/day for 14 days.\n • Patient education: nightly removal + denture cleaner soak nightly.\n • Reassess at 14 days; refractory cases → systemic fluconazole 100 mg/day × 14 days (consult MD for drug interactions).\n • Newly diabetic? — refer for HbA1c if not done in last 6 mo (uncontrolled diabetes = Candida overgrowth).",
 axiumEntry: "Recall note (D0120 periodic exam, D1110 prophy); D5410/D5411 chairside adjustment; D5640 replace broken clasp; D5650 add tooth; D5660 add clasp; D5630 repair acrylic; D5850 tissue conditioner; D5740/D5741 soft reline; D5750/D5751 hard reline; D5710/D5711 rebase; D5213/D5214 remake; nystatin Rx if stomatitis; risk reassessment",
 design: "Document each maintenance decision with rationale. Adjustment ≠ repair ≠ reline ≠ rebase ≠ remake — these are distinct procedure codes ranging from D5410 (single chairside visit) to D5213 (lab remake, ~3 wk turnaround). Material choice (Coe-Comfort vs Coe-Soft vs GC Reline) is determined by clinical indication, not student preference.",
 },
];

function rpdGenerateAxiumSteps(caseInput, kennedy, designIntent) {
 const steps = [];
 let lastPhase = null;
 for (const s of RPD_AXIUM_STEPS) {
 if (s.phase && s.phase !== lastPhase) {
 if (lastPhase !== null) steps.push("");
 steps.push(`══ ${s.phase} ══`);
 lastPhase = s.phase;
 }
 steps.push(`Step ${s.step}: ${s.clinic} — ${s.action}`);
 steps.push(` Axium entry: ${s.axiumEntry}`);
 if (designIntent && s.design) {
 steps.push(` Design note: ${s.design}`);
 }
 steps.push("");
 }
 return steps.join("\n");
}

// ─── Enhanced Rationale Strings (Phase 2 expansion) ──────────────────────
/**
 * Additional rationale strings for edge cases and special scenarios.
 * Sourced from NotebookLM materials.
 */
const RPD_RATIONALE_PHASE2 = {
 thirdMolar: {
 "Replace — posterior support": "Replacing 3rd molars adds vertical support and reduces risk of distal extension base fracture",
 "Omit — Rule 2": "3rd molar missing and not to be replaced per Applegate Rule 2",
 "Omit — impacted/ectopic": "Impacted, ectopic, or severely tilted 3rd molars should NOT be replaced in RPD design; extraction may be indicated",
 },
 alteredCast: {
 "Class I definitive": "Altered Cast Technique (two-stage functional impression) required to capture compressible mucosa and limit framework rotation during insertion",
 "Class II definitive": "Altered Cast Technique ensures distal extension base seats passively when mucosa is at rest; prevents framework tipping",
 },
 surveyMarks: {
 "Survey-crown candidate": "Minor tooth contours prevent safe enameloplasty to establish path of insertion; survey crown required (minor restoration with guide planes pre-cut)",
 "Enameloplasty safe": "Natural tooth contours permit safe enameloplasty (≤0.5mm) to establish path of insertion; survey crown NOT required",
 },
 crownLengthening: {
 indication: "Crown height <7mm or pulpal proximity prevents adequate rest-seat depth; Phase II crown lengthening recommended before definitive RPD prep",
 timing: "Complete crown lengthening and 6-month remodeling BEFORE taking definitive impressions for RPD fabrication",
 },
 tubeTooth: {
 indication: "Limited interocclusal space (≤5mm) in well-healed tooth-supported areas; artificial tooth anchors in buccal tube only (no ridge contact)",
 advantage: "Reduces acrylic mass; improves cleansing access vs. Open Lattice",
 },
 facing: {
 indication: "Anterior single-tooth replacement with EXTREMELY limited vertical space (<4mm) and high esthetic demand",
 material: "Tooth-colored acrylic or porcelain labial facing; denture base color buccal surface only",
 },
};

// ─── 3rd Molar Replacement Logic (Applegate Rules 2 & 3 ONLY) ────────────
// Per NotebookLM (standards): Rule 4 is a 2nd-molar rule and does NOT
// apply to 3rd molars. For 3rd molars, only Rule 2 (omit if missing + not
// replacing) and Rule 3 (include if present or to-be-replaced) apply.
function rpdEvaluate3rdMolarReplacement(caseInput, arch) {
 const third = RPD_THIRD_MOLARS;
 const firstMolar = RPD_FIRST_MOLARS;

 const teeth3 = Array.from(third).filter(n => rpdArchOf(n) === arch);
 const teeth1 = Array.from(firstMolar).filter(n => rpdArchOf(n) === arch);

 const replacement = {
 applicableTeeth: teeth3,
 decisions: [],
 };

 for (const tooth of teeth3) {
 const status = caseInput.teeth[tooth]?.status || "present";
 const toReplace = caseInput.teeth[tooth]?.replace;

 // Applegate Rule 2: 3rd molar missing + not to be replaced → omit
 if (status !== "present" && !toReplace) {
 replacement.decisions.push({
 tooth,
 rule: "Applegate Rule 2",
 decision: "Omit (missing, not to be replaced)",
 rationale: RPD_RATIONALE_PHASE2.thirdMolar["Omit — Rule 2"],
 });
 continue;
 }

 // Distinguish PRESENT (Rule 3 — abutment) vs MISSING-TO-BE-REPLACED
 // (Rule 2 inverse + Rule 5 — replaced tooth creates/extends the span,
 // which then becomes the most-posterior edentulous area driving the
 // classification).
 if (status === "present") {
 const firstMolarPresent = teeth1.some(n => rpdIsPresent(caseInput, n));
 if (!firstMolarPresent && !teeth1.some(n => caseInput.teeth[n]?.replace)) {
 replacement.decisions.push({
 tooth,
 rule: "Posterior support assessment",
 decision: "Replace (adds rigidity to distal extension)",
 rationale: RPD_RATIONALE_PHASE2.thirdMolar["Replace — posterior support"],
 });
 } else {
 replacement.decisions.push({
 tooth,
 rule: "Applegate Rule 3",
 decision: "Include in class determination (present + used as abutment)",
 rationale: `Tooth #${tooth} is present and used as an abutment; included in classification per Applegate Rule 3.`,
 });
 }
 } else if (toReplace) {
 // Missing tooth flagged for replacement — Rule 2 exclusion no longer
 // triggers, so the edentulous space is included per Rule 5.
 replacement.decisions.push({
 tooth,
 rule: "Applegate Rule 2 (inverse) + Rule 5",
 decision: "Include (missing but flagged for replacement)",
 rationale: `Missing tooth #${tooth} is flagged for replacement; included in classification per Applegate Rules 2 and 5 — the edentulous space becomes the most-posterior area driving the class.`,
 });
 }
 }

 return replacement;
}

// ─── 2nd Molar Evaluation (Applegate Rule 4) ─────────────────────────────
// Per NotebookLM/: Rule 4 says a missing 2nd molar is omitted from the
// classification if the OPPOSING (cross-arch antagonist) 2nd molar is also
// missing and not to be replaced. Surfacing these decisions in the UI helps
// the student write rationales for the Preliminary Partial Denture Design
// Form and reconciles manual counting with the engine output.
function rpdEvaluate2ndMolarRule4(caseInput, arch) {
 const archTeeth = Array.from(RPD_SECOND_MOLARS).filter(n => rpdArchOf(n) === arch);
 const decisions = [];

 for (const tooth of archTeeth) {
 const status = caseInput.teeth[tooth]?.status || "present";
 const toReplace = caseInput.teeth[tooth]?.replace;
 const opp = rpdOpposingTooth(tooth);
 const oppStatus = caseInput.teeth[opp]?.status || "present";
 const oppReplace = caseInput.teeth[opp]?.replace || false;

 if (status === "present") {
 decisions.push({
 tooth,
 rule: "Applegate Rule 4 (n/a)",
 decision: "Include (present)",
 rationale: `Tooth #${tooth} is present and included in classification.`,
 });
 } else if (toReplace) {
 decisions.push({
 tooth,
 rule: "Applegate Rule 4 (n/a)",
 decision: "Include (flagged for replacement)",
 rationale: `Missing tooth #${tooth} is flagged for replacement; included in classification.`,
 });
 } else if (oppStatus !== "present" && !oppReplace) {
 // Both 2nd molars missing-and-not-being-replaced → Rule 4 fires
 decisions.push({
 tooth,
 rule: "Applegate Rule 4",
 decision: `Omit (opposing #${opp} also missing, not being replaced)`,
 rationale: `Per Applegate Rule 4, missing 2nd molar #${tooth} is excluded from classification because the opposing-arch 2nd molar #${opp} is also missing and not being replaced.`,
 });
 } else {
 decisions.push({
 tooth,
 rule: "Applegate Rule 4",
 decision: `Include (opposing #${opp} present or being replaced)`,
 rationale: `Missing 2nd molar #${tooth} remains in classification because the opposing-arch 2nd molar #${opp} is present or being replaced.`,
 });
 }
 }

 return { applicableTeeth: archTeeth, decisions };
}

// ============================================================================
// ACP PRODSTHODONTIC DIAGNOSTIC INDEX (PDI) for partially edentulous patients
// ----------------------------------------------------------------------------
// Source: McGarry et al. 1998 / 2002; (Sabbagh 2024 Diagnosis &
// Treatment Planning). Four criteria, "worst single criterion sets the class":
//
// 1. Location & extent of edentulous area
// 2. Condition of abutment teeth
// 3. Occlusal characteristics
// 4. Residual ridge characteristics
//
// PDI gives a parallel complexity rating (I=ideal / IV=most complex) that
// supplements Kennedy classification and helps gate referral vs in-house care.
//
// Inference strategy: derive from existing case inputs — no separate UI yet.
// - Location: from Kennedy class + missing-tooth count + arch
// - Abutment: from worst perio prognosis among bounding abutments
// - Occlusion: default to Class I unless opposing-arch flag suggests issues
// - Residual ridge: from measurements.ridgeResorption
// ============================================================================

function rpdComputePDI(caseInput, kennedy, abutmentDesigns) {
 const arch = caseInput.arch;
 const m = caseInput.measurements || {};
 const pf = caseInput.patientFactors || {};

 // ----- Criterion 1: Location & extent -----
 // Class I: ideal — single edentulous area in any quadrant, ≤3 teeth missing
 // Class II: moderately compromised — edentulous area in 2 sextants, ≤3 teeth each
 // Class III: substantially compromised — any edentulous area requiring tooth-tissue support
 // (Kennedy I, II, IV) OR long span (>3 teeth) tooth-supported
 // Class IV: severely compromised — anterior span crossing midline (Class IV) AND
 // long-span distal extension, OR acquired defects
 const missingInArch = rpdArchTeeth(arch).filter(n => !rpdIsPresent(caseInput, n) && caseInput.teeth[n]?.replace !== false).length;
 const isToothSupported = kennedy.class === "III";
 const isAnteriorCrossing = kennedy.class === "IV";
 const isDistalExtension = kennedy.class === "I" || kennedy.class === "II";

 let locationClass = 1;
 let locationRationale = "";
 if (kennedy.class === null) {
 locationClass = 1;
 locationRationale = "Fully dentate or no qualifying edentulous span.";
 } else if (isAnteriorCrossing && missingInArch > 4) {
 locationClass = 4;
 locationRationale = `Kennedy Class IV (anterior span crossing midline) with ${missingInArch} teeth missing — severely compromised location.`;
 } else if (isAnteriorCrossing) {
 locationClass = 3;
 locationRationale = "Kennedy Class IV (anterior span crossing midline) — substantially compromised; esthetics + biomechanics demand careful planning.";
 } else if (isDistalExtension) {
 locationClass = 3;
 locationRationale = `Kennedy Class ${kennedy.class} (distal extension) — substantially compromised; requires tooth-tissue support.`;
 } else if (isToothSupported && missingInArch <= 3) {
 locationClass = (kennedy.modifications || 0) > 0 ? 2: 1;
 locationRationale = `Kennedy Class III, ≤3 teeth missing${(kennedy.modifications || 0) > 0 ? " with modification space": ""} — tooth-supported in ${(kennedy.modifications || 0) > 0 ? "2 sextants": "single sextant"}.`;
 } else if (isToothSupported) {
 locationClass = 3;
 locationRationale = `Kennedy Class III with long span (${missingInArch} teeth missing) — substantially compromised.`;
 } else {
 locationClass = 2;
 locationRationale = "Moderate edentulous extent.";
 }

 // ----- Criterion 2: Abutment condition -----
 // Class I: all abutments ideal — no preprosthetic therapy needed
 // Class II: abutments in 1-2 sextants need localized adjunctive therapy
 // Class III: abutments in 3 sextants need substantial therapy
 // Class IV: abutments have guarded prognosis; extensive preprosthetic therapy
 let worstPerio = "good";
 const perioRank = { good: 0, fair: 1, poor: 2, hopeless: 3 };
 const compromisedAbutments = [];
 for (const a of abutmentDesigns) {
 const attrs = a.attrs || {};
 const p = attrs.perioPrognosis || "good";
 if (perioRank[p] > perioRank[worstPerio]) worstPerio = p;
 if (p === "fair" || p === "poor" || p === "hopeless") {
 compromisedAbutments.push({ tooth: a.tooth, prognosis: p });
 }
 }
 let abutmentClass = 1;
 let abutmentRationale = "";
 if (worstPerio === "hopeless") {
 abutmentClass = 4;
 abutmentRationale = `One or more abutments hopeless (${compromisedAbutments.map(a => `#${a.tooth}`).join(", ")}) — guarded prognosis until extraction + reclassification.`;
 } else if (worstPerio === "poor") {
 abutmentClass = 4;
 abutmentRationale = `One or more abutments with poor periodontal prognosis (${compromisedAbutments.filter(a => a.prognosis === "poor").map(a => `#${a.tooth}`).join(", ")}) — extensive preprosthetic therapy required.`;
 } else if (worstPerio === "fair") {
 abutmentClass = compromisedAbutments.length >= 3 ? 3: 2;
 abutmentRationale = `${compromisedAbutments.length} abutment(s) with fair periodontal prognosis (${compromisedAbutments.map(a => `#${a.tooth}`).join(", ")}) — ${abutmentClass === 3 ? "substantial": "localized"} adjunctive therapy indicated.`;
 } else {
 abutmentClass = 1;
 abutmentRationale = "All bounding abutments have good periodontal prognosis — no preprosthetic therapy required on abutments.";
 }

 // ----- Criterion 3: Occlusal characteristics -----
 // Class I: ideal — occlusion does not require reestablishment / Angle Class I
 // Class II: occlusion requires localized adjustment
 // Class III: occlusion requires reestablishment without VDO change
 // Class IV: occlusion requires reestablishment WITH VDO change (e.g., severe wear)
 // Inference: opposing complete denture, severe interocclusal space issues, or
 // severe ridge resorption with opposing dentate arch suggest occlusal complexity.
 let occlusionClass = 1;
 let occlusionRationale = "Angle Class I occlusion assumed; no VDO change anticipated.";
 if (pf.vdoLoss === true) {
 occlusionClass = 4;
 occlusionRationale = "Loss of vertical dimension of occlusion documented — full reestablishment with VDO change required (PDI Class IV by definition).";
 } else if (pf.opposingArch === "complete_denture" && arch === "mandibular" && kennedy.class === "I") {
 occlusionClass = 4;
 occlusionRationale = "Combination Syndrome risk (mandibular bilateral distal extension opposing complete maxillary denture) — VDO reestablishment + careful occlusal scheme required.";
 } else if (pf.opposingArch === "complete_denture") {
 occlusionClass = 3;
 occlusionRationale = "Opposing complete denture — occlusal scheme must be reestablished against artificial teeth.";
 } else if (pf.opposingArch === "new_prosthesis") {
 occlusionClass = 3;
 occlusionRationale = "New prosthesis to be fabricated on opposing arch — bilateral arch reconstruction with simultaneous occlusal scheme establishment required.";
 } else if (m.interocclusalSpace === "excessive" || m.interocclusalSpace === "insufficient") {
 occlusionClass = 2;
 occlusionRationale = `${m.interocclusalSpace === "excessive" ? "Excessive": "Insufficient"} interocclusal space — localized occlusal adjustment likely required.`;
 }

 // ----- Criterion 4: Residual ridge characteristics -----
 // Class I: ideal — Atwood Class I-II (minimal resorption)
 // Class II: minimally compromised — Atwood Class III
 // Class III: moderately compromised — Atwood Class IV
 // Class IV: severely compromised — Atwood Class V-VI (extreme resorption)
 let ridgeClass = 1;
 let ridgeRationale = "Ridge resorption minimal — adequate denture-bearing support.";
 if (m.ridgeResorption === "severe") {
 ridgeClass = 4;
 ridgeRationale = "Severe ridge resorption — severely compromised support; consider implant-assisted RPD or altered cast technique.";
 } else if (m.ridgeResorption === "moderate") {
 ridgeClass = 3;
 ridgeRationale = "Moderate ridge resorption — moderately compromised support; altered cast technique strongly indicated for distal extension.";
 } else if (m.ridgeResorption === "mild") {
 ridgeClass = 1;
 ridgeRationale = "Mild ridge resorption — adequate residual ridge support.";
 }

 // ----- Worst single criterion sets the class -----
 const overallNum = Math.max(locationClass, abutmentClass, occlusionClass, ridgeClass);
 const romanByNum = { 1: "I", 2: "II", 3: "III", 4: "IV" };
 const overallClass = romanByNum[overallNum];

 // Driver: which criterion(s) drove the worst class
 const drivers = [];
 if (locationClass === overallNum) drivers.push("location");
 if (abutmentClass === overallNum) drivers.push("abutment condition");
 if (occlusionClass === overallNum) drivers.push("occlusion");
 if (ridgeClass === overallNum) drivers.push("residual ridge");

 // Care-setting recommendation per ACP guidelines
 let careRecommendation = "";
 if (overallNum === 1) careRecommendation = "PDI Class I — appropriate for predoctoral / general dentistry care.";
 else if (overallNum === 2) careRecommendation = "PDI Class II — appropriate for predoctoral with faculty oversight; straightforward case.";
 else if (overallNum === 3) careRecommendation = "PDI Class III — substantially complex; consider postgraduate prosthodontic input.";
 else careRecommendation = "PDI Class IV — severely compromised; prosthodontic specialty referral recommended.";

 return {
 class: overallClass,
 classNum: overallNum,
 drivers,
 careRecommendation,
 breakdown: {
 location: { class: romanByNum[locationClass], rationale: locationRationale },
 abutmentCondition: { class: romanByNum[abutmentClass], rationale: abutmentRationale },
 occlusion: { class: romanByNum[occlusionClass], rationale: occlusionRationale },
 residualRidge: { class: romanByNum[ridgeClass], rationale: ridgeRationale },
 },
 };
}

// ============================================================================
// MASTER ORCHESTRATOR — rpdRunEngine
// ============================================================================
// The engine pipeline: classify → plan retention → hydrate per-tooth designs
// → generate outputs (lab Rx, axium steps, PDI, red flags).
//
// Architecture (built during the V2 rebuild, supersedes the V1 monolith):
// 1. rpdClassifyKennedy — Kennedy + Applegate's Rules classification
// 2. rpdSelectMajorConnector — major connector per arch + class
// 3. rpdSelectFrameworkMaterial — Co-Cr / Gold / NMCD by patient factors
// 4. rpdPlanRetention — top-down RetentionPlan (planRetentionClassI/II/III/IV
// + bilateral-retention invariant for Class III)
// 5. rpdHydrateAbutment — per-tooth AbutmentDesign from plan entries
// (dispatches to rpdDesignAbutment / Embrasure /
// ContralateralAkers; design functions compose
// cross-cutting helpers from §HYDRATION HELPERS)
// 6. rpdSelectBaseDesign + rpdGenerateLabScript + rpdCheckRedFlags +
// rpdDesignNMCD + rpdGenerateAxiumSteps + rpdComputePDI — output layer.
//
// Returns the canonical result object consumed by the UI.

function rpdRunEngine(caseInput) {
 const safeCase = {
 arch: caseInput.arch || "mandibular",
 teeth: caseInput.teeth || {},
 measurements: caseInput.measurements || {},
 patientFactors: caseInput.patientFactors || {},
 };
 const designIntent = safeCase.patientFactors.designIntent || "definitive";

 // Classification — unchanged
 const kennedy = rpdClassifyKennedy(safeCase);
 const majorConnector = rpdSelectMajorConnector(safeCase, kennedy);
 const framework = rpdSelectFrameworkMaterial(safeCase);

 // ── Plan retention top-down ────────────────────────────────────────
 const retentionPlan = rpdPlanRetention(safeCase, kennedy);

 // ── Hydrate each direct retainer ───────────────────────────────────
 const abutmentDesigns = [];
 for (const planEntry of retentionPlan.directRetainers) {
 const design = rpdHydrateAbutment(planEntry, safeCase, kennedy);
 if (design) abutmentDesigns.push(design);
 }

 // Sort in arch order (match V1)
 const teethList = rpdArchTeeth(safeCase.arch);
 abutmentDesigns.sort((a, b) => teethList.indexOf(a.tooth) - teethList.indexOf(b.tooth));

 // ── Post-hoc Embrasure suggestion ──────────────────────────────────
 // Surfaces Embrasure as an ALTERNATIVE (judgment call) when two adjacent
 // posterior abutments have no edentulous space between them. Distinct
 // from the planner's bilateral-invariant Embrasure pair (which is PRIMARY
 // retention for Class III unilateral configurations). Skip when either
 // abutment is already an Embrasure-as-primary, RPI, Combination, or
 // Rest Only — those have defined retention schemes that shouldn't be
 // overridden by an Embrasure alternative.
 const RPD_POSTERIOR_LOCAL = new Set([
 1,2,3,4,5,12,13,14,15,16,
 17,18,19,20,21,28,29,30,31,32,
 ]);
 for (let i = 0; i < abutmentDesigns.length - 1; i++) {
 const a1 = abutmentDesigns[i];
 const a2 = abutmentDesigns[i + 1];
 const i1 = teethList.indexOf(a1.tooth);
 const i2 = teethList.indexOf(a2.tooth);
 if (i2 !== i1 + 1) continue;
 if (!RPD_POSTERIOR_LOCAL.has(a1.tooth) || !RPD_POSTERIOR_LOCAL.has(a2.tooth)) continue;
 if (a1.role === "embrasure-retention" || a2.role === "embrasure-retention") continue;
 const skipClasps = new Set(["Rest Only (no clasp)", "RPI", "Combination"]);
 if (skipClasps.has(a1.claspType) || skipClasps.has(a2.claspType)) continue;
 const note = `Consider Embrasure clasp spanning ${rpdToothName(a1.tooth)} and ${rpdToothName(a2.tooth)} — one continuous clasp with a shared occlusal embrasure rest assembly, engaging facing undercuts on both teeth. uses Embrasure as the PRIMARY direct retainer in some Class II Mod 1 cases (Lab Rx Example B, Mand) but keeps separate Akers in others (Lab Rx Example A, Max). Choice depends on overall retention budget; instructor judgment call.`;
 a1.claspAlternatives = a1.claspAlternatives ? `${a1.claspAlternatives}\n\n${note}`: note;
 a2.claspAlternatives = a2.claspAlternatives ? `${a2.claspAlternatives}\n\n${note}`: note;
 }

 // ── Indirect retainers (planner already computed; merge plan-entry
 // metadata with the rendered legacy data for the UI/lab Rx) ──────
 const indirectRetainers = retentionPlan.indirectRetainers.filter(ir => ir._legacyData)
.map(ir => ({
...ir._legacyData,
 // Preserve plan-entry traceability fields
 source: ir.source,
...(ir.anticipatedDueTo ? { anticipatedDueTo: ir.anticipatedDueTo }: {}),
...(ir.perioPrognosis ? { perioPrognosis: ir.perioPrognosis }: {}),
...(ir.dualRoleWith != null ? { dualRoleWith: ir.dualRoleWith }: {}),
 }));

 // ── Base design + red flags + output ───────────────────────────────
 const baseDesigns = rpdSelectBaseDesign(safeCase, kennedy);
 const redFlags = rpdCheckRedFlags(safeCase, kennedy, abutmentDesigns);

 // ── notDesignable path — append hard red flag if plan rejected ─────
 if (retentionPlan.notDesignable) {
 redFlags.push({
 severity: "blocker",
 type: "rpd-not-designable",
 message: retentionPlan.notDesignable.reason,
 });
 }

 const axiumCode = RPD_AXIUM_CODES[designIntent === "interim" ? "interim": "definitive"][safeCase.arch];

 const labScript = rpdGenerateLabScript({
 arch: safeCase.arch,
 framework, majorConnector, abutmentDesigns, indirectRetainers, baseDesigns,
 designIntent, axiumCode, kennedy,
 });

 // Phase 2 mechanical backfill — unchanged
 const nmcdDesign = rpdDesignNMCD(safeCase, kennedy);
 const axiumSteps = rpdGenerateAxiumSteps(safeCase, kennedy, designIntent);
 const thirdMolarEval = rpdEvaluate3rdMolarReplacement(safeCase, safeCase.arch);
 const secondMolarEval = rpdEvaluate2ndMolarRule4(safeCase, safeCase.arch);
 const pdi = rpdComputePDI(safeCase, kennedy, abutmentDesigns);

 return {
 kennedy, majorConnector, framework, abutmentDesigns, indirectRetainers,
 baseDesigns, redFlags, axiumCode, labScript, designIntent,
 nmcdDesign, axiumSteps, thirdMolarEval, secondMolarEval, pdi,
 // Plan exposed for debugging — not consumed by UI
 retentionPlan,
 };
}

// ============================================================================
// TEST CASES — representative scenarios for engine validation
// ============================================================================

function rpdBuildTeeth(arch, presetMissing = [], abutmentAttrs = {}) {
 const teeth = {};
 for (const n of rpdArchTeeth(arch)) {
 teeth[n] = { status: presetMissing.includes(n) ? "missing": "present" };
 if (abutmentAttrs[n]) teeth[n].attrs = abutmentAttrs[n];
 }
 return teeth;
}

const RPD_TEST_CASES = [
 {
 id: "mand-class-i",
 label: "Mandibular Class I — bilateral distal extension",
 description: "Missing #17-19 and #30-32 (3rd molars ignored). Anteriors and premolars intact. Classic bilateral distal extension.",
 expectedClass: "Kennedy Class I",
 caseInput: {
 arch: "mandibular",
 teeth: rpdBuildTeeth("mandibular", [17, 18, 19, 30, 31, 32]),
 measurements: { lingualSulcusDepth: 9, vestibularDepth: 8, ridgeResorption: "mild", interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 8 },
 },
 },
 {
 id: "max-class-ii-mod-1",
 label: "Maxillary Class II Mod 1",
 description: "Missing #14-16 (left DE) and #5-6 (modification space, tooth-supported). Tests Mod 1 logic + Akers on modification abutments.",
 expectedClass: "Kennedy Class II Modification 1",
 caseInput: {
 arch: "maxillary",
 teeth: rpdBuildTeeth("maxillary", [5, 6, 14, 15, 16]),
 measurements: { vestibularDepth: 8, ridgeResorption: "mild", interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 12 },
 },
 },
 {
 id: "max-class-iii-short",
 label: "Maxillary Class III — short tooth-supported span",
 description: "Missing #4-5 only. Single bounded tooth-supported space. Tests Single Palatal Strap selection.",
 expectedClass: "Kennedy Class III",
 caseInput: {
 arch: "maxillary",
 teeth: rpdBuildTeeth("maxillary", [4, 5]),
 measurements: { vestibularDepth: 8, interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 12 },
 },
 },
 {
 id: "mand-class-iv",
 label: "Mandibular Class IV — anterior span crossing midline",
 description: "Missing #23-26 (all four mandibular incisors). Bounded by canines. Tests Class IV + indirect retainers on posteriors.",
 expectedClass: "Kennedy Class IV",
 caseInput: {
 arch: "mandibular",
 teeth: rpdBuildTeeth("mandibular", [23, 24, 25, 26]),
 measurements: { lingualSulcusDepth: 9, vestibularDepth: 8, interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 10 },
 },
 },
 {
 id: "mand-class-i-frenum",
 label: "Mandibular Class I — high frenum forces Combination clasp on #20",
 description: "Same as Class I above, but #20 (left terminal abutment) has a high frenum in the I-bar approach. Tests RPI→Combination fallback on that abutment only; #29 should still get RPI.",
 expectedClass: "Kennedy Class I",
 caseInput: {
 arch: "mandibular",
 teeth: rpdBuildTeeth("mandibular", [17, 18, 19, 30, 31, 32], { 20: { highFrenum: true } }),
 measurements: { lingualSulcusDepth: 9, vestibularDepth: 8, interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 8 },
 },
 },
 {
 id: "mand-class-i-poor-prognosis",
 label: "Mandibular Class I — questionable abutment #21",
 description: "Same as Class I above, but #21 has poor periodontal prognosis. Tests interim-RPD recommendation flag.",
 expectedClass: "Kennedy Class I",
 caseInput: {
 arch: "mandibular",
 teeth: rpdBuildTeeth("mandibular", [17, 18, 19, 30, 31, 32], { 21: { perioPrognosis: "poor" } }),
 measurements: { lingualSulcusDepth: 9, vestibularDepth: 8, interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 8 },
 },
 },
 {
 id: "max-class-i-few-teeth",
 label: "Maxillary Class I — few teeth remain (full palate)",
 description: "Missing most posteriors and laterals. Only 6 teeth remain (canines, centrals, premolars). Tests Full Palatal Plate trigger.",
 expectedClass: "Kennedy Class I",
 caseInput: {
 arch: "maxillary",
 teeth: rpdBuildTeeth("maxillary", [1, 2, 3, 4, 7, 10, 13, 14, 15, 16]),
 measurements: { vestibularDepth: 8, ridgeResorption: "moderate", interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 12 },
 },
 },
 {
 id: "mand-class-i-recent-extraction",
 label: "Mandibular Class I — 3 months post-extraction (forces interim)",
 description: "Same case as the basic Class I, but only 3 months since last extraction. Tests the healing-period blocker.",
 expectedClass: "Kennedy Class I",
 caseInput: {
 arch: "mandibular",
 teeth: rpdBuildTeeth("mandibular", [17, 18, 19, 30, 31, 32]),
 measurements: { lingualSulcusDepth: 9, vestibularDepth: 8, interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 3 },
 },
 },
 {
 id: "mand-class-i-interim",
 label: "Mandibular Class I — INTERIM design",
 description: "Same anatomy as basic Class I, but design intent set to interim. Tests the interim branch (WW C-clasps, no rest seats / guide planes).",
 expectedClass: "Kennedy Class I",
 caseInput: {
 arch: "mandibular",
 teeth: rpdBuildTeeth("mandibular", [17, 18, 19, 30, 31, 32]),
 measurements: { lingualSulcusDepth: 9, vestibularDepth: 8, interocclusalSpace: "normal" },
 patientFactors: { designIntent: "interim", monthsSinceExtraction: 3 },
 },
 },
 {
 id: "max-class-iii-metal-allergy",
 label: "Maxillary Class III — metal allergy (NMCD pathway)",
 description: "Missing #4-5 (single bounded span). Documented metal allergy triggers NMCD design (thermoplastic, no rest seats/guide planes). Requires informed consent and MP approval.",
 expectedClass: "Kennedy Class III",
 caseInput: {
 arch: "maxillary",
 teeth: rpdBuildTeeth("maxillary", [4, 5]),
 measurements: { vestibularDepth: 8, interocclusalSpace: "normal" },
 patientFactors: { designIntent: "definitive", monthsSinceExtraction: 12, metalAllergy: true },
 },
 },
];

// ============================================================================
// PHASE 3: INTERACTIVE TOOTH CHART + INPUT FORMS
// ============================================================================

// Deep clone a case input so a preset doesn't get mutated when the user
// then edits the chart or forms.
const rpdCloneCase = (c) => JSON.parse(JSON.stringify(c));

// Blank-slate case: all teeth present, sensible measurement defaults.
// The dentist clicks teeth to mark missing and edits attributes from there.
function rpdMakeBlankCase(arch = "mandibular") {
 const teeth = {};
 for (const n of [...RPD_TEETH_MAX,...RPD_TEETH_MAND]) {
 teeth[n] = { status: "present" };
 }
 return {
 arch,
 teeth,
 measurements: {
 vestibularDepth: 8,
 lingualSulcusDepth: 9,
 ridgeResorption: "mild",
 interocclusalSpace: "normal",
 },
 patientFactors: {
 designIntent: "definitive",
 monthsSinceExtraction: 12,
 },
 };
}

// Build a complete teeth object (all 32 positions) from a partial one, so
// the chart can render every tooth even if a preset only listed missing
// teeth. Defaults: all present, no abnormal attrs.
function rpdNormalizeTeeth(caseInput) {
 const teeth = {...(caseInput.teeth || {}) };
 for (const n of [...RPD_TEETH_MAX,...RPD_TEETH_MAND]) {
 if (!teeth[n]) teeth[n] = { status: "present" };
 }
 return teeth;
}

// ─── Interactive Tooth Chart ──────────────────────────────────────────────
// design overlay color conventions (per NotebookLM-sourced materials):
// Blue = cast metal (major connectors, rests, proximal plates, cast clasps,

// ============================================================================
// EXPORTS — public API of the RPD engine module
// ============================================================================
export {
 // Constants
 RPD_TEETH_MAX, RPD_TEETH_MAND,
 RPD_MAX_ANTERIOR, RPD_ESTHETIC_ZONE,
 RPD_CANINES, RPD_FIRST_PREMOLARS, RPD_SECOND_PREMOLARS,
 RPD_FIRST_MOLARS, RPD_SECOND_MOLARS, RPD_THIRD_MOLARS,
 RPD_ABUTMENT_DEFAULTS, RPD_RATIONALE, RPD_AXIUM_CODES,
 RPD_AXIUM_STEPS,
 // Pure utilities
 rpdArchTeeth, rpdArchOf, rpdSideOf, rpdDistalRank,
 rpdMirrorTooth, rpdOpposingTooth, rpdToothName, rpdToothList,
 rpdIsPresent, rpdGetAttrs,
 // Classification
 rpdGetInPlayTeeth, rpdGetEdentulousSpans, rpdClassifyKennedy,
 // Major connector, framework, base
 rpdSelectMajorConnector, rpdSelectFrameworkMaterial, rpdSelectBaseDesign,
 // Direct retainer building blocks
 rpdCheckRPIContraindications,
 rpdFindEmbrasurePair, rpdFindContralateralAkers,
 // Planner + hydrator (top-down architecture)
 rpdPlanRetention, rpdHydrateAbutment,
 // Hydration helpers
 computeSideToward, evaluateSurveyCrown, evaluateCrownLengthening,
 shouldApplyMaxAnteriorNoClasp, hydrateMaxAnteriorNoClasp,
 hydrateInterimAbutment, pickRestSeat, pickGuidePlane,
 computeEffectiveUndercutForOutput, maybeRingClaspAlternative, pickClaspMechanic,
 // Design functions
 rpdDesignAbutment, rpdDesignEmbrasureAbutment, rpdDesignContralateralAkers,
 // Indirect retainers + red flags + NMCD + lab Rx + axium + PDI
 rpdPlaceIndirectRetainers, rpdCheckRedFlags,
 rpdGenerateLabScript, rpdDesignNMCD, rpdGenerateAxiumSteps,
 rpdEvaluate3rdMolarReplacement, rpdEvaluate2ndMolarRule4, rpdComputePDI,
 // Master orchestrator
 rpdRunEngine,
 // Case helpers (test/UI bridging)
 rpdBuildTeeth, rpdCloneCase, rpdMakeBlankCase, rpdNormalizeTeeth,
};
