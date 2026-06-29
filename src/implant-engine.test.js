import { describe, it, expect } from "vitest";
import { computeImplantPlan } from "./implant-engine.js";

// Verifies computeImplantPlan against worked scenarios. Thresholds trace to
// docs/IMPLANT-ENGINE-SOURCES.md (clinic acceptance screen + OMFS anatomic
// distances + host-factor stances).

const has = (arr, re) => (arr || []).some((s) => re.test(s));

describe("Feasibility — place as-is", () => {
  it("#19 healthy molar with ample bone → place, wide fixture", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 14, keratinizedTissue: 4 });
    expect(r.feasibility).toBe("place");
    expect(r.implant.diameterClass).toBe("wide"); // molar, ridge 7 → 5.5 cap ≥ 5.0
    expect(r.implant.length).toBe(11.5);           // 14 − 2 (IAN) = 12 usable
    expect(r.adjuncts).toEqual([]);
  });

  it("#9 central, adequate ridge → standard fixture, anterior position cues", () => {
    const r = computeImplantPlan({ site: 9, mdSpace: 8, ridgeWidth: 7, boneHeight: 13 });
    expect(r.feasibility).toBe("place");
    expect(r.implant.diameterClass).toBe("standard"); // MD 8 → 5.0 cap, central ideal 4.1
    expect(r.position.buccolingual).toMatch(/cingulum/);
  });

  it("#7 lateral incisor → narrow fixture", () => {
    const r = computeImplantPlan({ site: 7, mdSpace: 7, ridgeWidth: 7, boneHeight: 12 });
    expect(r.feasibility).toBe("place");
    expect(r.implant.diameterClass).toBe("narrow"); // lateral ideal 3.3
  });
});

describe("Feasibility — augmentation", () => {
  it("Narrow ridge (5 mm) → GBR, narrow fixture fits the anatomic minimum", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 5, boneHeight: 14 });
    expect(r.feasibility).toBe("augment");
    expect(has(r.adjuncts, /GBR/)).toBe(true);
    expect(r.implant.diameterClass).toBe("narrow"); // 5 − 1.5 = 3.5 → 3.3
  });

  it("Maxillary posterior, 2 mm short of sinus → internal sinus lift", () => {
    const r = computeImplantPlan({ site: 3, mdSpace: 9, ridgeWidth: 8, boneHeight: 8 });
    expect(r.feasibility).toBe("augment");
    expect(has(r.adjuncts, /internal.*sinus lift/i)).toBe(true);
  });

  it("Mandibular posterior below 12 mm but short implant fits → augment/short", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 9 });
    expect(r.feasibility).toBe("augment");
    expect(has(r.adjuncts, /short implant/i)).toBe(true);
  });

  it("Narrow MD space (5 mm) → flag a bridge alternative", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 5, ridgeWidth: 7, boneHeight: 14 });
    expect(r.feasibility).toBe("augment");
    expect(has(r.flags, /bridge/i)).toBe(true);
  });
});

describe("Feasibility — stage / refer", () => {
  it("Knife-edge ridge (4 mm) → ridge augmentation, no fixture fits", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 4, boneHeight: 14 });
    expect(r.feasibility).toBe("stage-refer");
    expect(has(r.adjuncts, /ridge split|augmentation/i)).toBe(true);
  });

  it("Maxillary posterior, severe height deficit → lateral-window sinus lift", () => {
    const r = computeImplantPlan({ site: 3, mdSpace: 9, ridgeWidth: 8, boneHeight: 5 });
    expect(r.feasibility).toBe("stage-refer");
    expect(has(r.adjuncts, /lateral-window/i)).toBe(true);
  });

  it("Mandibular posterior, no room above IAN even for a short implant → refer", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 7 });
    expect(r.feasibility).toBe("stage-refer");
    expect(has(r.adjuncts, /vertical augmentation|refer/i)).toBe(true);
  });
});

describe("Hard stops — medical hold (override anatomy)", () => {
  it("IV antiresorptive → avoid, regardless of good anatomy", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 14, antiresorptive: "iv" });
    expect(r.feasibility).toBe("medical-hold");
    expect(r.headline).toMatch(/MRONJ|avoid/i);
    expect(r.implant).toBe(null);
  });

  it("Skeletally growing patient → defer", () => {
    const r = computeImplantPlan({ site: 9, mdSpace: 8, ridgeWidth: 7, boneHeight: 13, growthComplete: false });
    expect(r.feasibility).toBe("medical-hold");
    expect(r.headline).toMatch(/growth|defer/i);
  });

  it("Hard stop fires even with missing anatomy", () => {
    const r = computeImplantPlan({ antiresorptive: "iv" });
    expect(r.feasibility).toBe("medical-hold");
  });
});

describe("Relative host factors — cautions, not stops", () => {
  it("Heavy smoking → caution flag, still placeable", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 14, smoking: "heavy" });
    expect(r.feasibility).toBe("place");
    expect(has(r.flags, /smoker/i)).toBe(true);
  });

  it("Oral bisphosphonate + controlled diabetes → flags, not holds", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 14, antiresorptive: "oral", diabetes: "controlled" });
    expect(r.feasibility).toBe("place");
    expect(has(r.flags, /bisphosphonate/i)).toBe(true);
    expect(has(r.flags, /HbA1c/)).toBe(true);
  });

  it("Thin biotype in the esthetic zone → recession-risk flag", () => {
    const r = computeImplantPlan({ site: 9, mdSpace: 8, ridgeWidth: 7, boneHeight: 13, biotype: "thin" });
    expect(has(r.flags, /thin biotype/i)).toBe(true);
  });

  it("Low keratinized tissue → soft-tissue graft adjunct", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 14, keratinizedTissue: 2 });
    expect(has(r.adjuncts, /keratinized|soft-tissue/i)).toBe(true);
  });
});

describe("Incomplete + always-on principle", () => {
  it("Missing core inputs → incomplete with a list", () => {
    const r = computeImplantPlan({ site: 19 });
    expect(r.feasibility).toBe("incomplete");
    expect(r.missing.length).toBeGreaterThan(0);
  });

  it("Every plan carries the restoratively-driven principle", () => {
    const r = computeImplantPlan({ site: 19, mdSpace: 10, ridgeWidth: 7, boneHeight: 14 });
    expect(has(r.flags, /restoratively-driven/i)).toBe(true);
  });

  it("Does not throw on undefined input", () => {
    expect(() => computeImplantPlan(undefined)).not.toThrow();
  });
});
