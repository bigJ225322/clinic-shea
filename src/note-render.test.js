import { describe, it, expect } from "vitest";
import { renderTemplate, TEMPLATES, DEFAULT_FIELDS } from "./App.jsx";

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
});
