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
  it("compound: 1–4 teeth (→III) + a Stage IV elevator → IV even at low CAL", () =>
    expect(stage({ maxIntPD: "4", boneLossPct: "15-33", teethLostFromPerio: "1-4", complexityFactors: ["mobility-2plus"] })).toBe("IV"));
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
