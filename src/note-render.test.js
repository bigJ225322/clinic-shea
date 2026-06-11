import { describe, it, expect } from "vitest";
import { renderTemplate, TEMPLATES, DEFAULT_FIELDS, noteTripwire } from "./App.jsx";

// ---------------------------------------------------------------------------
// Note-rendering harness.
//
// Every bug in the "silent substitution" family — age not inserting, a flag
// stripping a phrase a later step needed, a dead input, a leftover [date]/
// MAF:X — shares one signature: a t.replace(/.../, …) that quietly no-ops or
// mismatches because the template prose drifted out from under it. None throw;
// they just render the WRONG note. This harness renders every template across a
// few field permutations and asserts invariants that turn those silent failures
// into loud, regression-locking test failures.
//
// renderTemplate is pure (template string + fields -> note string), exported
// from App.jsx, so this needs no DOM / React render.
// ---------------------------------------------------------------------------

const ALL_IDS = Object.keys(TEMPLATES);
const ICC_IDS = ALL_IDS.filter((id) => /^icc-/.test(id));

// Fresh, deep-ish copy of DEFAULT_FIELDS per render so nothing leaks between
// cases and renderTemplate can't mutate shared state.
const fields = (over = {}) => ({
  ...structuredClone(DEFAULT_FIELDS),
  ...over,
  examFindings: { ...DEFAULT_FIELDS.examFindings, ...(over.examFindings || {}) },
  labPlaceholders: { ...DEFAULT_FIELDS.labPlaceholders, ...(over.labPlaceholders || {}) },
});
const render = (id, over = {}) => renderTemplate(TEMPLATES[id], fields(over));

const FILLED = {
  age: "44", gender: "", clinic: "Gershwin",
  bp: "120/80", bg: "95", temp: "98.6", nv: "2 weeks",
  names: "S.Swade/Dr. Nice/W.Assistant",
};

describe("every template renders to a non-empty string without throwing", () => {
  it.each(ALL_IDS)("%s", (id) => {
    let out;
    expect(() => { out = render(id); }).not.toThrow();
    expect(typeof out).toBe("string");
    expect(out.trim().length).toBeGreaterThan(0);
  });
});

describe("no engine-internal token leaks (sentinels / {{tokens}} / NOANES)", () => {
  // @ANES@ etc. are render-time sentinels; if one survives to the output the
  // student sees raw machinery. Check a blank pass and a filled pass.
  it.each(ALL_IDS)("%s", (id) => {
    for (const over of [{}, FILLED]) {
      const out = render(id, over);
      expect(out, `${id} leaked an internal token`).not.toMatch(/@[A-Z]+@|\bNOANES\b|\{\{[^}]*\}\}/);
    }
  });
});

describe("ICC notes substitute/strip all [brackets] (no unfilled placeholder leaks)", () => {
  // ICC clinic-visit templates are bracket-driven and strip any unfilled
  // [bracket] on render. icc-refusal is intentionally excluded: it's a
  // fill-in-the-blank legal template whose [brackets] are REQUIRED content the
  // student must complete (declined recommendations, risks discussed,
  // interpreter, referring provider, etc.), so they're left visible as forced
  // reminders rather than silently stripped to blank. (Design call worth a look,
  // but not a silent-substitution bug — the student sees them.)
  const AUTOSTRIP = ICC_IDS.filter((id) => id !== "icc-refusal");
  it.each(AUTOSTRIP)("%s", (id) => {
    const out = render(id);
    const leftover = out.match(/\[[^\]\n]{1,60}\]/g) || [];
    expect(leftover, `${id} leaked brackets`).toEqual([]);
  });
});

describe("age round-trips into every patient-facing template", () => {
  // The age-in-Screening bug lived here: a template begins " y/o", an earlier
  // strip eats the space, and the age regex silently misses. Assert that for
  // EVERY template whose note contains "y/o", a set age appears before it.
  it.each(ALL_IDS)("%s", (id) => {
    if (!/y\/o/.test(render(id))) return; // not a patient-facing note
    const out = render(id, { age: "44" });
    expect(out, `${id} dropped the age before "y/o"`).toMatch(/(^|\D)44 y\/o\b/);
  });
});

// ---------------------------------------------------------------------------
// Regression locks for the specific silent-substitution bugs found in the audit.
// Each one would have failed before its fix landed.
// ---------------------------------------------------------------------------
describe("regression locks", () => {
  it("Screening / Tx-Plan / Implant-Consult (273/807/871) insert age despite leading-space templates", () => {
    for (const id of ["273", "807", "871"]) {
      expect(render(id, { age: "52" }), `${id} age`).toMatch(/\b52 y\/o\b/);
    }
  });

  it("RCT (5472): MAF value reaches the note (not the 'MAF: X' placeholder)", () => {
    const out = render("5472", { endoMaf: "30" });
    expect(out).toMatch(/MAF:\s*30\b/);
    expect(out).not.toMatch(/MAF:\s*X\b/);
  });

  it("RCT (5472): consult date fills both lines and leaves no literal [date]", () => {
    const out = render("5472", { endoConsultDate: "5/1/2026" });
    expect(out).toMatch(/consult visit\s+5\/1\/2026/);
    expect(out).toMatch(/Re-evaluated BW & PA taken\s+5\/1\/2026/);
    expect(out).not.toMatch(/\[date\]/);
  });

  it("Restorative COE (703): the Occlusal Assessment text input reaches the note", () => {
    const out = render("703", { examFindings: { "occlusal assessment": "Class I molar, Class I canine" } });
    expect(out).toMatch(/occlusal assessment:\s*Class I molar, Class I canine/i);
  });

  it("Peds Initial/Recall (5985): bitewings-off keeps the odontogram findings and drops 'radiographic &'", () => {
    const out = render("5985", { tookBitewings: false, examFindings: { odontogram: "- caries on #3" } });
    expect(out).toMatch(/Updated odontogram with intraoral hard tissue findings:/);
    expect(out).toMatch(/caries on #3/);
    expect(out).not.toMatch(/radiographic &/i);
  });

  it("Peds Initial/Recall (5985): dentition dropdown overrides the bullet; default stays 'mixed'", () => {
    expect(render("5985")).toMatch(/-\s*mixed dentition/);
    expect(render("5985", { examFindings: { dentition: "primary dentition" } })).toMatch(/-\s*primary dentition/);
  });

  it("ICC SRP (icc-srp): quadrant drives the anesthetic phrasing; no-anesthetic strips it", () => {
    expect(render("icc-srp", { labPlaceholders: { quadrants: "LR" } }))
      .toMatch(/IAN & long buccal block on R/);
    expect(render("icc-srp", { labPlaceholders: { quadrants: "UR" } }))
      .toMatch(/buccal infiltrations of UR quadrant & greater palatine block on R/);
    expect(render("icc-srp", { labPlaceholders: { "no anesthetic": "NOANES" } }))
      .toMatch(/No local anesthetic administered\./);
  });

  it("Urgent Care Wisdom Tooth (448): the extraction tooth list reaches the note (not the bare 'extraction #.')", () => {
    // The fill's regex expected an OLD template baking in 'extraction #1, #16,
    // #17, #32'; the body was simplified to 'extraction #.' and the fill
    // silently dropped the student's entry. The tripwire caught it.
    const out = render("448", { examFindings: { "extraction teeth": "1, 16" } });
    expect(out).toMatch(/PGOS for extraction #1, #16\./);
    expect(out).not.toMatch(/extraction #\./);
  });

  it("Perio maintenance (1425): 'Probed' off removes the perio chart block; on keeps it", () => {
    expect(render("1425")).toMatch(/Updated perio EPR & perio chart:/); // default = probed
    const off = render("1425", { perioProbed: false });
    expect(off).not.toMatch(/Updated perio EPR & perio chart:/);
    expect(off).not.toMatch(/probing depths:/);
    expect(off).toMatch(/Perio maintenance:/);          // rest of the note intact
    expect(off).toMatch(/Removed plaque & calculus/);   // content after the block intact
  });

  it("Urgent Care (374): consultations array injects named consults (survives the step-0 dedent)", () => {
    // The handler regex required a literal leading space before 'Consultations:',
    // but step 0 strips that single indent — so it silently no-op'd and consults
    // never reached the note. The handler now matches with/without the indent.
    const out = render("374", { examFindings: { consultations: [
      { name: "Smith", type: "restorative" }, { name: "", type: "OS" },
    ] } });
    expect(out).toMatch(/- Dr\. Smith -- restorative consult:/);
    expect(out).toMatch(/- Dr\. \[Name\] -- OS consult:/);
    // a single filled consult collapses the 3 placeholder lines to the ones entered
    const one = render("374", { examFindings: { consultations: [{ name: "Lee", type: "endo" }] } });
    expect(one).toMatch(/- Dr\. Lee -- endo consult:/);
    expect(one).not.toMatch(/-- perio consult:/);
  });

  it("Urgent Care (374): an empty consultations array strips the whole block", () => {
    const out = render("374", { examFindings: { consultations: [] } });
    expect(out).not.toMatch(/Consultations:/);
  });

  it("Urgent Care (374): a selected diagnosis tooth shows immediately, before any dx is picked", () => {
    // Tooth chosen, neither pulpal nor periapical selected yet — the row used to
    // emit nothing, so the tooth pick looked like a no-op. Now bare #N lines show.
    const out = render("374", { examFindings: { "dx count": 1, "dx1 tooth": "#8" } });
    expect(out).toMatch(/- Pulpal diagnosis #8:/);
    expect(out).toMatch(/- Periapical diagnosis #8:/);
    // and once a dx is picked, the value fills in on that tooth
    const dx = render("374", { examFindings: { "dx count": 1, "dx1 tooth": "#8", "dx1 pulpal": "Pulp necrosis" } });
    expect(dx).toMatch(/- Pulpal diagnosis #8: Pulp necrosis/);
  });

  it("Urgent Care (374): EVERY form field reaches the note (consults-family sweep)", () => {
    // One sentinel per UI field in the 374 exam form (App.jsx EXAM form def).
    // A missing sentinel = that input silently never reaches the note — the
    // exact failure mode of the consultations bug. Structured sections
    // (endo rows, consults, dx rows, IOE dropdowns, yn-toggles) asserted by
    // their handlers' output shapes.
    const out = render("374", { examFindings: {
      cc: "ZZCC",
      location: "ZZLOC", inception: "ZZWHEN", quality: "ZZQUAL", intensity: "ZZINT",
      frequency: "ZZFREQ", duration: "ZZDUR", triggers: "ZZTRIG", relief: "ZZREL",
      "other symptoms": "ZZSYMP", "treatment/evaluation thus far": "ZZTX",
      "last pain medication taken & effectiveness": "ZZMED", "anything else?": "ZZELSE",
      "spontaneous pain": "Yes", "lingering pain": "No", "pain wakes pt up at night": "Yes",
      "radiograph findings": "ZZRADS", "pt opts for": "ZZOPT", EOE: "ZZEOE",
      "ioe restoration": "heavily restored", "ioe completeness": "partially edentulous",
      "ioe perio": "heavy calculus & active periodontal disease",
      "endo count": 1, "endo1 #": "8", "endo1 perc": "+++", "endo1 palp": "-",
      "dx count": 1, "dx1 tooth": "#8", "dx1 pulpal": "Pulp necrosis",
      consultations: [{ name: "Sweep", type: "perio" }],
    } });
    for (const s of ["ZZCC","ZZLOC","ZZWHEN","ZZQUAL","ZZINT","ZZFREQ","ZZDUR","ZZTRIG",
                     "ZZREL","ZZSYMP","ZZTX","ZZMED","ZZELSE","ZZRADS","ZZOPT","ZZEOE"]) {
      expect(out, `${s} never reached the note — dead input`).toContain(s);
    }
    expect(out).toMatch(/spontaneous pain:\s*Yes/i);
    expect(out).toMatch(/lingering pain:\s*No/i);
    expect(out).toMatch(/wakes pt up at night:\s*Yes/i);
    expect(out).toMatch(/heavily restored dentition, partially edentulous/);
    expect(out).toMatch(/- #8: percussion \+\+\+, palpation -/);
    expect(out).toMatch(/- Dr\. Sweep -- perio consult:/);
    expect(out).toMatch(/Pulpal diagnosis #8: Pulp necrosis/);
  });

  it("Urgent Care Wisdom Tooth (448): every form field reaches the note", () => {
    const out = render("448", { examFindings: {
      cc: "ZZCC8", "wt-ioe": "ZZIOE8", "wt-pano": "ZZPANO8",
      "pericoronitis severity": "moderate", "extraction teeth": "1, 16",
      "wt-consult-date": "ZZDATE8",
    } });
    for (const s of ["ZZCC8","ZZIOE8","ZZPANO8","ZZDATE8"]) {
      expect(out, `${s} never reached the note — dead input`).toContain(s);
    }
    expect(out).toMatch(/moderate pericoronitis/);
    expect(out).toMatch(/extraction #1, #16\./);
  });

  it("Urgent Care (374): 'dx count' stored as a NUMBER does not throw (latent crash guard)", () => {
    // The UI writes update('dx count', n) as a number; the field loop's .trim()
    // would throw on it. Adding a 2nd diagnosis row must not crash the render.
    expect(() => render("374", { examFindings: { "dx count": 2, "dx1 tooth": "#3", "dx2 tooth": "#14" } })).not.toThrow();
    const out = render("374", { examFindings: { "dx count": 2, "dx1 tooth": "#3", "dx2 tooth": "#14" } });
    expect(out).toMatch(/- Pulpal diagnosis #3:/);
    expect(out).toMatch(/- Pulpal diagnosis #14:/);
  });
});

// ---------------------------------------------------------------------------
// Tier 1 tripwire (NOTES-ENGINE-HARDENING.md): renderTemplate's field-driven
// fills are wrapped in sub(t, re, val, label). With the tripwire armed, each
// call records how many times its pattern matched. Render every template with
// the fields those fills read; a fill whose regex has drifted off ALL its
// templates matches zero everywhere -> its label's max is 0 -> fail. This
// catches the silent-no-op family with no per-template false positives, and
// without a per-fill output assertion. As more fills are instrumented, they
// auto-join this check.
// ---------------------------------------------------------------------------
describe("tripwire: no instrumented fill is dead across all templates", () => {
  it("every sub() fill fires for at least one template", () => {
    const kitchenSink = {
      age: "44", endoMaf: "30", endoConsultDate: "5/1/2026", temp: "98.6", bg: "95", bp: "120/80",
      crownType: "all-ceramic", srpDate: "1/1/2026",
      endoNumCanals: "3", medications: "lisinopril", brushing: "3x a day", flossing: "2x a day",
      examFindings: {
        cc: "tooth pain",
        "pulpal diagnosis": "irreversible pulpitis", "diagnosis tooth": "8",
        "pt opts for": "extraction", "extraction teeth": "1, 16",
        "brushing frequency": "3x/day", "flossing frequency": "2x/week",
        technique: "fair", "plaque level": "heavy", "plaque area": "the posterior teeth",
        emphasis: "improve flossing", impressions: true,
      },
    };
    noteTripwire.hits = [];
    noteTripwire.armed = true;
    try {
      // Permutation 1 — fields populated: exercises the value-FILL branches.
      for (const id of ALL_IDS) render(id, kitchenSink);
      // Permutation 2 — all blank (DEFAULT_FIELDS): exercises the STRIP branches
      // that fire when a vital/section is empty (temperature, blood glucose,
      // blood pressure, intraoral photos, endo testing, other symptoms, anything
      // else, mounting records). A drifted strip leaves a dangling placeholder.
      for (const id of ALL_IDS) render(id, {});
      // Permutation 3 — value-specific choices: exercises the strips that fire on
      // a deliberate non-default value (nitrous off, restoration not removed, peds
      // IUTD / mother-helps / nutrition off, perio bone-loss / calculus "none").
      const valueSpecific = {
        nitrous: false, removedExistingRestoration: false, perioProbed: false,
        pedsIUTD: false, pedsMotherHelps: false, pedsNutritionalCounseling: false,
        examFindings: { "bl distribution": "none", "calc distribution": "none" },
      };
      for (const id of ALL_IDS) render(id, valueSpecific);
    } finally {
      noteTripwire.armed = false;
    }
    const maxByLabel = {};
    for (const { label, matched } of noteTripwire.hits) {
      maxByLabel[label] = Math.max(maxByLabel[label] || 0, matched);
    }
    const dead = Object.entries(maxByLabel).filter(([, m]) => m === 0).map(([l]) => l);
    expect(dead, `instrumented fills that matched NO template (drifted/dead): ${dead.join(", ")}`).toEqual([]);
    // sanity — the fills we instrumented are actually exercised
    expect(Object.keys(maxByLabel)).toEqual(
      expect.arrayContaining([
        "age-leading", "age-global", "endoMaf", "endoConsultDate-visit", "endoConsultDate-reeval",
        "temperature", "bloodGlucose", "cc", "crownType", "srpDate",
        "endoCanals", "medications", "brushing-peds", "brushing-coe", "flossing-peds", "flossing-coe",
        "diagnosis-hashform", "pt-opts-for", "extraction-teeth",
        "perio-gingiva", "perio-brush-freq", "perio-floss-freq", "perio-technique",
        "perio-plaque-level", "perio-plaque-area", "perio-emphasis", "mounting-records",
        "bloodPressure", "temperature-strip", "bloodGlucose-strip", "bloodPressure-strip",
        "intraoralPhotos-strip", "endoTesting-strip", "otherSymptoms-strip", "anythingElse-strip",
        "mounting-strip",
        "removedRestoration-strip", "pedsIUTD-strip", "pedsMotherHelps-strip", "pedsNutrition-strip",
        "BL-none-strip", "calc-none-strip", "nitrous-strip", "nitrous-o2-strip", "perioChart-strip",
      ])
    );
  });
});
