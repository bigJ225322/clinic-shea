// ─────────────────────────────────────────────────────────────────────────
// Single-tooth implant placement engine.
//
// Structured site facts in → feasibility verdict + implant size + 3D position,
// each line carrying its own clinical "why". Decision SUPPORT and teaching
// aid, NOT a surgical guide — the surgeon plans from the CBCT.
//
// Every threshold is traced to a primary source in docs/IMPLANT-ENGINE-SOURCES.md
// (read digit-for-digit, not paraphrased): the clinic case-acceptance checklist
// for the feasibility gates, the OMFS minimum-anatomic-distances table for the
// placement constraints, the host-factor stances likewise. Diameter/length
// CLASS values are standard implant-system specs (flagged), not clinic numbers.
// The UI states the clinical reason only — never a citation.
// ─────────────────────────────────────────────────────────────────────────

// Minimum anatomic distances (mm) — the placement constraints.
const MIN = {
  buccalPlate: 0.5,
  lingualPlate: 1.0,
  sinus: 1.0,
  nasalFloor: 1.0,
  adjacentTooth: 1.5, // 1.5–2.0; 1.5 is the floor
  adjacentImplant: 3.0,
  ian: 2.0, // vertical clearance to the inferior alveolar canal
  inferiorBorder: 1.0,
};

// Clinic case-acceptance screen (mm).
const SCREEN = {
  mdWidth: 7, // mesiodistal, between adjacent teeth
  flWidth: 7, // faciolingual ridge, measured 3–4 mm below the crest
  heightMaxOrAntMand: 10, // > 10 mm of bone
  heightMandPost: 12, // ≥ 12 mm above the IAN
  interocclusal: 7, // ridge → opposing marginal ridge
  keratinized: 4, // faciolingual band
  internalSinusLift: 3, // max gain at placement; more needs a lateral window
};

// Diameter classes — standard implant-system values (NOT clinic-tabulated).
const DIA = { narrow: 3.3, standard: 4.1, wide: 5.0 };
// Stock lengths — standard system values.
// UIC-stocked lengths (Astra Osseospeed 6/8/11/13, Straumann 10/12) — no system
// stocks 11.5. Diameters likewise: Straumann 3.3/4.1, Astra Osseospeed 5.0.
const LENGTHS = [6, 8, 10, 11, 13];

const MAX_ANT = new Set([6, 7, 8, 9, 10, 11]);
const MAND_ANT = new Set([22, 23, 24, 25, 26, 27]);

function siteInfo(site) {
  const n = Number(site);
  if (!n || n < 1 || n > 32) return null;
  const arch = n <= 16 ? "maxillary" : "mandibular";
  const anterior = MAX_ANT.has(n) || MAND_ANT.has(n);
  const region = anterior ? "anterior" : "posterior";
  let type;
  if ([8, 9, 24, 25].includes(n)) type = "central";
  else if ([7, 10, 23, 26].includes(n)) type = "lateral";
  else if ([6, 11, 22, 27].includes(n)) type = "canine";
  else if ([4, 5, 12, 13, 20, 21, 28, 29].includes(n)) type = "premolar";
  else type = "molar";
  // The structure beneath the site, and its required vertical clearance.
  let structure, safety;
  if (arch === "maxillary" && region === "posterior") { structure = "maxillary sinus"; safety = MIN.sinus; }
  else if (arch === "maxillary") { structure = "nasal floor"; safety = MIN.nasalFloor; }
  else if (region === "posterior") { structure = "inferior alveolar nerve"; safety = MIN.ian; }
  else { structure = "inferior border"; safety = MIN.inferiorBorder; }
  const esthetic = arch === "maxillary" && region === "anterior";
  const mandPost = arch === "mandibular" && region === "posterior";
  return { n, label: "#" + n, arch, region, type, structure, safety, esthetic, mandPost };
}

const num = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

// Feasibility severity ladder — the engine reports the worst gate.
const RANK = { place: 0, augment: 1, "stage-refer": 2, "medical-hold": 3 };
const worse = (a, b) => (RANK[b] > RANK[a] ? b : a);

export function computeImplantPlan(inputs) {
  const i = inputs || {};
  const site = siteInfo(i.site);
  const mdSpace = num(i.mdSpace);
  const ridgeWidth = num(i.ridgeWidth);
  const boneHeight = num(i.boneHeight);
  const kt = num(i.keratinizedTissue);

  const missing = [];
  if (!site) missing.push("tooth site (#1–32)");
  if (mdSpace === null) missing.push("mesiodistal space (mm)");
  if (ridgeWidth === null) missing.push("ridge width (mm)");
  if (boneHeight === null) missing.push("bone height (mm)");

  const hardStops = [];
  const adjuncts = [];
  const flags = [];

  // ── Host / medical — checked first; some are hard stops ───────────────
  if (i.antiresorptive === "iv")
    hardStops.push("IV antiresorptive (bisphosphonate / denosumab) — avoid implant placement; high MRONJ risk. Refer / medical decision.");
  if (i.growthComplete === false || i.skeletal === "growing")
    hardStops.push("Skeletal growth not complete — defer. Implants in a growing alveolus submerge like ankylosed teeth (wait until ~12–14 F / 16–18 M).");
  if (i.cardiac === "unstable")
    hardStops.push("Medically unstable (uncontrolled HTN / recent ACS / unstable angina) — defer until stabilized.");
  if (i.bleeding === "severe")
    hardStops.push("Severe bleeding disorder not controllable with local measures — manage in a hospital setting.");

  // Relative host factors → cautions (the lecture: 'almost always RELATIVE').
  if (i.diabetes === "uncontrolled")
    flags.push("Uncontrolled diabetes — get HbA1c < 7–8 first; elevated failure and marginal bone loss. Consider antibiotic prophylaxis.");
  else if (i.diabetes === "controlled")
    flags.push("Diabetes (controlled) — not a contraindication; keep HbA1c < 7–8, consider antibiotic prophylaxis.");
  if (i.antiresorptive === "oral")
    flags.push("Oral bisphosphonate — not a contraindication; a drug holiday may be considered, and document informed consent re: MRONJ.");
  if (i.smoking === "heavy")
    flags.push("Heavy smoker (>10/day) — 2–2.5× higher failure (3.6× in grafted sites). Advise cessation; a nicotine holiday (quit 1 wk before, 8 wks after) helps.");
  else if (i.smoking === "light")
    flags.push("Smoker — a dose-dependent risk factor for failure and peri-implantitis; advise cessation.");
  if (i.radiation === "high")
    flags.push("Prior high-dose radiation (≈>60 Gy) to the site — elevated osteoradionecrosis/failure risk, worse in the mandible. OMFS consult; consider HBO.");
  else if (i.radiation === "low")
    flags.push("Prior radiation to the jaws — dose-dependent risk; confirm dose and field with the oncology record.");
  if (i.bruxism)
    flags.push("Parafunction / bruxism — ~3.8× higher failure. Protect with an occlusal guard; favor a wider fixture.");

  let feasibility = hardStops.length ? "medical-hold" : "place";

  // A hard stop holds regardless of anatomy — report it even if site facts
  // are still missing.
  if (feasibility === "medical-hold") {
    return {
      site: site || null, feasibility, missing: [],
      headline: hardStops[0],
      hardStops, flags, adjuncts: [], implant: null, position: null,
    };
  }
  // Otherwise we need the core site facts to plan.
  if (missing.length) {
    return {
      site: site || null, feasibility: "incomplete", missing,
      headline: `Add ${missing.join(", ")} to generate a plan.`,
      hardStops, flags, adjuncts: [], implant: null, position: null,
    };
  }

  // ── Anatomy gates ─────────────────────────────────────────────────────
  // Mesiodistal: need ≥7 mm between teeth (clinic screen); the implant needs
  // ≥1.5 mm clearance to each adjacent root.
  if (mdSpace < SCREEN.mdWidth) {
    feasibility = worse(feasibility, "augment");
    if (mdSpace < DIA.narrow + 2 * MIN.adjacentTooth)
      flags.push(`Mesiodistal space ${mdSpace} mm is below the ≥7 mm screen and too tight even for a narrow fixture with 1.5 mm to each root — consider a cantilever/bridge instead.`);
    else
      flags.push(`Mesiodistal space ${mdSpace} mm is below the ≥7 mm clinic screen — a narrow fixture may fit; confirm ≥1.5 mm to each adjacent root on CBCT.`);
  }

  // Faciolingual ridge width: ≥7 mm clinic screen. Below that, a narrower
  // fixture may still satisfy the buccal 0.5 + lingual 1.0 minimums (ridge ≥
  // diameter + 1.5), but it's below the screen.
  if (ridgeWidth < SCREEN.flWidth) {
    if (ridgeWidth < DIA.narrow + MIN.buccalPlate + MIN.lingualPlate) {
      feasibility = worse(feasibility, "stage-refer");
      adjuncts.push("Ridge augmentation (GBR or ridge split) before placement — too narrow even for a 3.3 mm fixture with the 0.5 mm buccal / 1.0 mm lingual minimums.");
    } else {
      feasibility = worse(feasibility, "augment");
      adjuncts.push("Likely benefits from GBR — ridge is below the 7 mm screen, though a narrower fixture fits the anatomic minimums (diameter + 1.5 mm). Confirm on CBCT.");
    }
  }

  // Bone height — gate and remedy depend on the site.
  const minHeight = site.mandPost ? SCREEN.heightMandPost : SCREEN.heightMaxOrAntMand;
  const heightShort = site.mandPost ? boneHeight < minHeight : boneHeight <= minHeight;
  if (heightShort) {
    if (site.structure === "maxillary sinus") {
      const shortfall = minHeight - boneHeight;
      if (shortfall <= SCREEN.internalSinusLift) {
        feasibility = worse(feasibility, "augment");
        adjuncts.push(`Internal (crestal) sinus lift at placement — ~${shortfall.toFixed(1)} mm short of the sinus floor, within the 3 mm achievable at surgery.`);
      } else {
        feasibility = worse(feasibility, "stage-refer");
        adjuncts.push(`Lateral-window sinus lift (staged) — ~${shortfall.toFixed(1)} mm short, beyond the 3 mm internal-lift limit.`);
      }
    } else if (site.mandPost) {
      const usable = boneHeight - MIN.ian;
      if (usable >= 6) {
        feasibility = worse(feasibility, "augment");
        adjuncts.push(`Below the 12 mm screen above the IAN — a short implant (≤ ${Math.min(8, Math.floor(usable))} mm) is an option, keeping 2 mm above the nerve; otherwise refer for vertical augmentation.`);
      } else {
        feasibility = worse(feasibility, "stage-refer");
        adjuncts.push("Insufficient height above the IAN even for a short implant (need ≥ 2 mm clearance) — refer for vertical augmentation or an alternative.");
      }
    } else {
      feasibility = worse(feasibility, "stage-refer");
      adjuncts.push(`Inadequate height (≤ ${minHeight} mm) near the ${site.structure} — graft / refer, or choose a non-implant option.`);
    }
  }

  // Interocclusal clearance and keratinized tissue — flags/adjuncts, not gates.
  const interocclusal = num(i.interocclusal);
  if (interocclusal !== null && interocclusal < SCREEN.interocclusal)
    flags.push(`Interocclusal clearance ${interocclusal} mm (< 7 mm) — gain restorative space before committing to a screw-retained crown.`);
  if (kt !== null && kt < SCREEN.keratinized) {
    adjuncts.push(`Soft-tissue graft to ≥ 4 mm keratinized tissue — only ${kt} mm present; keratinized width supports long-term peri-implant health.`);
  }

  // Esthetic-zone biotype.
  if (site.esthetic && i.biotype === "thin")
    flags.push("Thin biotype in the esthetic zone — recession risk; consider a connective-tissue graft and a slightly palatal, deeper platform. Facial bone 2 mm ideal.");

  // ── Implant sizing — restoratively-driven, constrained by what fits ───
  const idealDia = site.type === "molar" ? DIA.wide : site.type === "lateral" ? DIA.narrow : DIA.standard;
  const maxByRidge = ridgeWidth - (MIN.buccalPlate + MIN.lingualPlate); // − 1.5
  const maxByMD = mdSpace - 2 * MIN.adjacentTooth; // − 3.0
  const diaVal = Math.min(idealDia, maxByRidge, maxByMD);
  let diameter = null, diameterClass = null, diaRationale;
  if (diaVal >= DIA.narrow) {
    diameterClass = diaVal >= DIA.wide ? "wide" : diaVal >= DIA.standard ? "standard" : "narrow";
    diameter = DIA[diameterClass];
    const limiter = diaVal === maxByRidge ? `ridge width (keeps ≥ 0.5 mm buccal / 1.0 mm lingual)`
      : diaVal === maxByMD ? `mesiodistal space (keeps ≥ 1.5 mm to each root)`
      : `the ${site.type} position`;
    const idealNote = diameter < idealDia ? ` A ${site.type} ideally takes a ${idealDia} mm fixture, but ${limiter} caps it here — graft for more width if a wider implant is wanted.` : "";
    diaRationale = `${diameterClass} (~${diameter} mm), set by ${limiter}.${idealNote}`;
  } else {
    diaRationale = "No standard fixture fits the current width/space — augment first.";
  }

  // Length: available height minus the safety margin to the structure below.
  const usableHeight = boneHeight - site.safety;
  let length = null, lengthRationale;
  const fit = LENGTHS.filter((L) => L <= usableHeight);
  if (fit.length) {
    length = fit[fit.length - 1];
    lengthRationale = `${length} mm — the ${boneHeight} mm of height minus ${site.safety} mm of clearance to the ${site.structure} leaves ${usableHeight.toFixed(1)} mm usable.`;
  } else {
    lengthRationale = `Height leaves < 6 mm usable above the ${site.structure} — too short; graft or refer.`;
  }

  const implant = (diameter || length) ? { diameter, diameterClass, length, rationale: `${diaRationale} ${lengthRationale}`.trim() } : null;

  // ── Position — restoratively-driven (place where the crown goes) ──────
  const position = {
    mesiodistal: "Center the space — ≥ 1.5–2 mm to each adjacent tooth (3 mm to an adjacent implant).",
    buccolingual: site.region === "anterior"
      ? "Slightly palatal of the incisal edge; screw access through the cingulum; preserve ≥ 1 mm (2 mm ideal) facial bone."
      : "Centered to slightly lingual; screw access through the central fossa; preserve ≥ 1 mm facial bone.",
    apicocoronal: "Platform ~3 mm apical to the planned gingival margin (deeper in the esthetic zone for emergence).",
    angulation: site.region === "anterior"
      ? "Angle for cingulum screw access — avoid a facial emergence."
      : "Angle for central-fossa screw access.",
  };

  // ── Verdict-first headline ────────────────────────────────────────────
  const dxLabel = implant && implant.diameter && implant.length ? `${implant.diameterClass} ⌀${implant.diameter} × ${implant.length} mm` : "sizing pending augmentation";
  const verb = { place: "Place as-is", augment: "Placeable with augmentation", "stage-refer": "Stage / refer first" }[feasibility];
  const headline = `${verb} — ${site.label}, ${dxLabel}.`;

  // Always-on principle.
  flags.push("Restoratively-driven: place where the crown should be, not where the bone is. If bone is inadequate, graft or choose a non-implant option.");

  return { site, feasibility, headline, implant, position, adjuncts, flags, hardStops, missing: [] };
}
