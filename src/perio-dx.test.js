import { describe, it, expect } from "vitest";
import { computePerioCOEDx } from "./App.jsx";

// ---------------------------------------------------------------------------
// AAP 2018 staging + grading — regression-locking table.
//
// The engine had been under-staging two real cases:
//   1. tooth loss of 1–4 from periodontitis (a Stage III SEVERITY criterion —
//      you can't lose teeth to perio and still be Stage I/II), and
//   2. Stage III complexity factors (vertical BL ≥3mm, furcation II/III,
//      moderate ridge defect), which AAP lets elevate the stage.
// These tests pin the corrected rules so they can't silently regress.
// ---------------------------------------------------------------------------

const base = (o = {}) => ({
  maxIntPD: "5", maxRecession: "0", boneLossPct: "15-33", bop: "",
  teethLostFromPerio: "0", complexityFactors: [], age: "50",
  smoking: "none", diabetes: "none", extent: "generalized", ...o,
});
const stage = (o) => computePerioCOEDx(base(o)).stage;
const grade = (o) => computePerioCOEDx(base(o)).grade;

describe("AAP 2018 — no periodontitis (no radiographic bone loss)", () => {
  it("healthy: no BL + no BOP", () => {
    const dx = computePerioCOEDx(base({ boneLossPct: "0", bop: "none", maxIntPD: "3" }));
    expect(dx.stage).toBe(null);
    expect(dx.aap).toMatch(/healthy/i);
  });
  it("localized gingivitis: no BL + localized BOP", () =>
    expect(computePerioCOEDx(base({ boneLossPct: "0", bop: "localized" })).aap).toMatch(/localized gingivitis/i));
  it("generalized gingivitis: no BL + generalized BOP", () =>
    expect(computePerioCOEDx(base({ boneLossPct: "0", bop: "generalized" })).aap).toMatch(/generalized gingivitis/i));
});

describe("AAP 2018 — staging by severity (CAL / bone loss)", () => {
  it("Stage I: CAL ≤2, BL <15%", () => expect(stage({ maxIntPD: "2", boneLossPct: "<15" })).toBe("I"));
  it("Stage II: CAL 3–4, BL 15–33%", () => expect(stage({ maxIntPD: "4", boneLossPct: "15-33" })).toBe("II"));
  it("Stage III: CAL ≥5", () => expect(stage({ maxIntPD: "6", boneLossPct: "33-50" })).toBe("III"));
  it("CAL = PD + recession (interdental)", () =>
    expect(stage({ maxIntPD: "3", maxRecession: "3", boneLossPct: "33-50" })).toBe("III")); // CAL 6
});

describe("AAP 2018 — tooth loss is itself a severity criterion (was the bug)", () => {
  it("1–4 teeth lost floors an otherwise-Stage-II case to Stage III", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", teethLostFromPerio: "1-4" })).toBe("III"));
  it("≥5 teeth lost = Stage IV regardless of CAL", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", teethLostFromPerio: "≥5" })).toBe("IV"));
});

describe("AAP 2018 — complexity factors elevate the stage", () => {
  it("furcation II–III floors a Stage-II case to III", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", complexityFactors: ["furcation-23"] })).toBe("III"));
  it("vertical BL ≥3mm floors a Stage-II case to III", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", complexityFactors: ["vertical-3mm"] })).toBe("III"));
  it("Stage IV elevator (mobility ≥2) on Stage III severity → IV", () =>
    expect(stage({ maxIntPD: "6", boneLossPct: "33-50", complexityFactors: ["mobility-2plus"] })).toBe("IV"));
  it("Tonetti Table 3: 1–4 teeth (→III) + a Stage IV factor → IV, irrespective of CAL", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", teethLostFromPerio: "1-4", complexityFactors: ["mobility-2plus"] })).toBe("IV"));
  it("CAL ≥5 + a IV elevator → IV", () =>
    expect(stage({ maxIntPD: "6", boneLossPct: "33-50", complexityFactors: ["mobility-2plus"] })).toBe("IV"));
  it("no complexity factor does NOT elevate a Stage I case", () =>
    expect(stage({ maxIntPD: "2", boneLossPct: "<15" })).toBe("I"));
});

describe("AAP 2018 — grading (%BL ÷ age, with smoking / diabetes modifiers)", () => {
  it("Grade A: slow ratio, no risk factors", () => expect(grade({ boneLossPct: "<15", age: "60" })).toBe("A"));
  it("Grade B: moderate ratio", () => expect(grade({ boneLossPct: "15-33", age: "50" })).toBe("B"));
  it("Grade C: rapid ratio", () => expect(grade({ boneLossPct: ">50", age: "40" })).toBe("C"));
  it("Grade C: ≥10 cig/day overrides a slow ratio", () => expect(grade({ boneLossPct: "<15", age: "60", smoking: "≥10" })).toBe("C"));
  it("Grade C: uncontrolled diabetes overrides a slow ratio", () => expect(grade({ boneLossPct: "<15", age: "60", diabetes: "uncontrolled" })).toBe("C"));
  it("Grade B: <10 cig/day lifts a slow ratio off Grade A", () => expect(grade({ boneLossPct: "<15", age: "60", smoking: "<10" })).toBe("B"));
});

describe("AAP 2018 — composite diagnosis line", () => {
  it("assembles extent + stage + grade", () =>
    expect(computePerioCOEDx(base({ maxIntPD: "6", boneLossPct: "33-50", age: "50" })).aap)
      .toBe("Generalized Stage III Grade B periodontitis"));
});

// ---------------------------------------------------------------------------
// Stress test vs the AAP "FAQs on the 2018 Classification" worked examples
// (American Academy of Periodontology, © 2019) — the authoritative source.
// ---------------------------------------------------------------------------
describe("AAP 2018 FAQ — worked examples", () => {
  // "Does the area with the most severe destruction determine the stage? Yes."
  // Generalized mild-to-moderate + localized severe (CAL ≥5, PD ≥6) → Generalized Stage III.
  it("worst site sets the stage: localized CAL ≥5 → Generalized Stage III", () => {
    const dx = computePerioCOEDx(base({ maxIntPD: "6", boneLossPct: "33-50", extent: "generalized" }));
    expect(dx.stage).toBe("III");
    expect(dx.extentLabel).toBe("Generalized");
  });
  // "2 teeth previously lost + 3 planned for extraction = 5 lost due to perio → Stage IV."
  it("5 teeth lost from perio (incl. planned extractions) → Stage IV", () =>
    expect(stage({ maxIntPD: "5", boneLossPct: "33-50", teethLostFromPerio: "≥5" })).toBe("IV"));
  // Regeneration example: a case is "Stage III DUE TO a vertical defect ≥3mm or
  // Class II furcation"; after regeneration (CAL 3-4, furcation Class I/none,
  // PD ≤5) it drops to Stage II.
  it("Class II/III furcation makes a CAL-3-4 case Stage III (per the FAQ)", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", complexityFactors: ["furcation-23"] })).toBe("III"));
  it("a vertical defect ≥3mm makes a CAL-3-4 case Stage III", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", complexityFactors: ["vertical-3mm"] })).toBe("III"));
  it("after regeneration (CAL 3-4, no furcation/defect) → Stage II", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", complexityFactors: [] })).toBe("II"));
  // Stage severity anchors from "How does a clinician arrive at the proper stage".
  it("Stage I: CAL 1-2", () => expect(stage({ maxIntPD: "2", boneLossPct: "<15" })).toBe("I"));
  it("Stage II: CAL 3-4", () => expect(stage({ maxIntPD: "4", boneLossPct: "15-33" })).toBe("II"));
  it("Stage III: CAL ≥5", () => expect(stage({ maxIntPD: "6", boneLossPct: "33-50" })).toBe("III"));
  // Grading: "if the HbA1c is 9%... assign a grade of C."
  it("uncontrolled diabetes (HbA1c ≥7) → Grade C", () =>
    expect(grade({ boneLossPct: "<15", age: "55", diabetes: "uncontrolled" })).toBe("C"));
});

// ---------------------------------------------------------------------------
// EFP / Tonetti "clinical decision tree for staging and grading" (Sanz &
// Tonetti, EFP, March 2019; based on Tonetti & Sanz, J Clin Periodontol 2019).
// Verbatim algorithmic criteria — the authoritative implementation algorithm.
// ---------------------------------------------------------------------------
describe("EFP decision tree (Sanz & Tonetti 2019)", () => {
  // Step 3c: "Stage I if BL <15% and CAL 1-2mm; Stage II if BL 15-33% and CAL 3-4mm."
  it("Step 3c — Stage I: BL <15% + CAL 1-2", () => expect(stage({ maxIntPD: "2", boneLossPct: "<15" })).toBe("I"));
  it("Step 3c — Stage II: BL 15-33% + CAL 3-4", () => expect(stage({ maxIntPD: "4", boneLossPct: "15-33" })).toBe("II"));
  it("Step 3c — Stage III: CAL ≥5 / BL mid-third", () => expect(stage({ maxIntPD: "6", boneLossPct: "33-50" })).toBe("III"));
  // Step 3b: "If CAL ≤5mm... look for furcation II/III. If present → Stage III or IV."
  it("Step 3b — furcation II/III on a CAL 3-4 case → Stage III", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", complexityFactors: ["furcation-23"] })).toBe("III"));
  // Tonetti 2018 Table 3: complexity shifts the stage "irrespective of CAL", and
  // a Stage IV factor (in addition to Stage III complexity) reaches IV.
  it("Table 3 — furcation-elevated III + a Stage IV factor → IV (irrespective of CAL)", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", complexityFactors: ["furcation-23", "mobility-2plus"] })).toBe("IV"));
  it("Step 3c — CAL ≥5 + a Stage IV factor → IV", () =>
    expect(stage({ maxIntPD: "6", boneLossPct: "33-50", complexityFactors: ["ridge-severe"] })).toBe("IV"));
  it("Step 3c — PTL >4 teeth → Stage IV on its own", () =>
    expect(stage({ maxIntPD: "5", boneLossPct: "33-50", teethLostFromPerio: "≥5" })).toBe("IV"));
  // Step 4a (verbatim): "BL/A <0.25 → Grade A; 0.25-1.0 → Grade B; >1.0 → Grade C."
  it("Step 4a — Grade A: BL/age <0.25", () => expect(grade({ boneLossPct: "<15", age: "60" })).toBe("A"));
  it("Step 4a — Grade B: BL/age 0.25-1.0", () => expect(grade({ boneLossPct: "15-33", age: "50" })).toBe("B"));
  it("Step 4a — Grade C: BL/age >1.0", () => expect(grade({ boneLossPct: ">50", age: "40" })).toBe("C"));
  // Step 4a modifiers (verbatim): "≥10 cig/day → C; HbA1c ≥7.0 → C; <10 cig / HbA1c<7 → upgrade to B."
  it("Step 4a — smoking ≥10/day → Grade C", () => expect(grade({ boneLossPct: "<15", age: "60", smoking: "≥10" })).toBe("C"));
  it("Step 4a — HbA1c ≥7 → Grade C", () => expect(grade({ boneLossPct: "<15", age: "60", diabetes: "uncontrolled" })).toBe("C"));
  it("Step 4a — smoking <10/day lifts Grade A → B", () => expect(grade({ boneLossPct: "<15", age: "60", smoking: "<10" })).toBe("B"));
});
