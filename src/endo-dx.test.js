import { describe, it, expect } from "vitest";
import { computeEndoDx, endoCold, endoPP, endoRecForTooth, matchEndoOption } from "./App.jsx";

// Endodontic diagnosis engine — verifies the two-axis (pulpal + periapical)
// AAE diagnosis against standard textbook scenarios. The engine is decision
// SUPPORT: tests in, diagnosis out, no treatment.

const base = {
  cold: "", ept: "", spontaneousPain: "", pulpHistory: "",
  percussion: "", palpation: "", radiograph: "", sinusTract: "", swelling: "",
};
const dx = (over) => computeEndoDx({ ...base, ...over });

describe("Pulpal axis", () => {
  it("Normal pulp — mild cold response, no symptoms, normal apex", () => {
    const r = dx({ cold: "wnl", percussion: "neg", palpation: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Normal Pulp");
    expect(r.periapical).toBe("Normal Apical Tissues");
    expect(r.incomplete).toBe(false);
    expect(r.flags).toEqual([]);
  });

  it("Reversible pulpitis — exaggerated but non-lingering cold, no spontaneous pain", () => {
    const r = dx({ cold: "exaggerated", spontaneousPain: "no", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Reversible Pulpitis");
    expect(r.periapical).toBe("Normal Apical Tissues");
  });

  it("Symptomatic irreversible pulpitis — lingering cold", () => {
    const r = dx({ cold: "lingering", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Symptomatic Irreversible Pulpitis");
  });

  it("Symptomatic irreversible pulpitis — spontaneous pain even with only a normal cold", () => {
    const r = dx({ cold: "wnl", spontaneousPain: "yes", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Symptomatic Irreversible Pulpitis");
  });

  it("Asymptomatic irreversible pulpitis — vital + carious exposure, no symptoms", () => {
    const r = dx({ cold: "wnl", pulpHistory: "carious-exposure", spontaneousPain: "no", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Asymptomatic Irreversible Pulpitis");
  });

  it("Carious exposure that IS symptomatic resolves to SIP, not AIP", () => {
    const r = dx({ cold: "lingering", pulpHistory: "carious-exposure", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Symptomatic Irreversible Pulpitis");
  });

  it("Pulp necrosis — no cold, no EPT", () => {
    const r = dx({ cold: "none", ept: "none", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Pulp Necrosis");
  });

  it("Conflicting vitality — cold none but EPT responds → flagged uncertain", () => {
    const r = dx({ cold: "none", ept: "responds", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toMatch(/uncertain/i);
  });

  it("Previously treated — prior completed RCT", () => {
    const r = dx({ pulpHistory: "previously-treated", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Previously Treated");
  });

  it("Previously initiated therapy — pulpotomy started, not finished", () => {
    const r = dx({ pulpHistory: "previously-initiated", percussion: "neg", radiograph: "normal" });
    expect(r.pulpal).toBe("Previously Initiated Therapy");
  });
});

describe("Periapical axis", () => {
  it("Symptomatic apical periodontitis — percussion positive", () => {
    const r = dx({ cold: "lingering", percussion: "pos", radiograph: "widened-pdl" });
    expect(r.periapical).toBe("Symptomatic Apical Periodontitis");
  });

  it("Asymptomatic apical periodontitis — PARL, no symptoms, necrotic", () => {
    const r = dx({ cold: "none", ept: "none", percussion: "neg", palpation: "neg", radiograph: "radiolucency" });
    expect(r.pulpal).toBe("Pulp Necrosis");
    expect(r.periapical).toBe("Asymptomatic Apical Periodontitis");
    expect(r.flags).toEqual([]); // necrotic + PARL is coherent
  });

  it("Acute apical abscess — necrotic pulp + localized swelling", () => {
    const r = dx({ cold: "none", ept: "none", swelling: "localized", percussion: "pos", radiograph: "radiolucency" });
    expect(r.periapical).toBe("Acute Apical Abscess");
  });

  it("Chronic apical abscess — necrotic pulp + sinus tract over PARL", () => {
    const r = dx({ cold: "none", ept: "none", sinusTract: "yes", radiograph: "radiolucency" });
    expect(r.periapical).toBe("Chronic Apical Abscess");
  });

  it("Condensing osteitis — apical radiopacity, vital low-grade", () => {
    const r = dx({ cold: "wnl", percussion: "neg", radiograph: "condensing" });
    expect(r.periapical).toBe("Condensing Osteitis");
    expect(r.flags).toEqual([]); // vital + condensing is allowed
  });

  it("Necrosis + symptomatic apical periodontitis", () => {
    const r = dx({ cold: "none", ept: "none", percussion: "pos", radiograph: "radiolucency" });
    expect(r.pulpal).toBe("Pulp Necrosis");
    expect(r.periapical).toBe("Symptomatic Apical Periodontitis");
  });
});

describe("Coherence cross-checks", () => {
  it("Vital pulp + swelling → flag a periodontal abscess, not apical", () => {
    const r = dx({ cold: "wnl", swelling: "localized" });
    expect(r.flags.join(" ")).toMatch(/periodontal abscess/i);
  });

  it("Normal/reversible pulp + PARL → flag the inconsistency", () => {
    const r = dx({ cold: "wnl", percussion: "neg", radiograph: "radiolucency" });
    expect(r.flags.join(" ")).toMatch(/irreversible or necrotic|inconsistent/i);
  });

  it("Healthy pulp + healthy apex → no flags", () => {
    const r = dx({ cold: "wnl", percussion: "neg", palpation: "neg", radiograph: "normal" });
    expect(r.flags).toEqual([]);
  });
});

describe("Incomplete inputs", () => {
  it("All blank → incomplete, asks for inputs, no crash", () => {
    const r = dx({});
    expect(r.incomplete).toBe(true);
    expect(r.missing.length).toBeGreaterThan(0);
    expect(r.narrative).toMatch(/not enough/i);
  });

  it("Pulpal given, apical blank → still asks for an apical finding", () => {
    const r = dx({ cold: "wnl" });
    expect(r.pulpal).toBe("Normal Pulp");
    expect(r.incomplete).toBe(true);
    expect(r.missing.join(" ")).toMatch(/apical/i);
  });

  it("Handles undefined inputs object without throwing", () => {
    expect(() => computeEndoDx(undefined)).not.toThrow();
  });
});

describe("Urgent-care input mapping (free-text → engine)", () => {
  it("Cold test parsing", () => {
    expect(endoCold("NR")).toBe("none");
    expect(endoCold("-")).toBe("none");
    expect(endoCold("2/2s")).toBe("wnl");      // quick resolution
    expect(endoCold("2/20s")).toBe("lingering"); // lingers ~18s
    expect(endoCold("lingers")).toBe("lingering");
    expect(endoCold("3")).toBe("wnl");
    expect(endoCold("")).toBe("");
  });

  it("Percussion/palpation symbol mapping", () => {
    expect(endoPP("-")).toBe("neg");
    expect(endoPP("+")).toBe("pos");
    expect(endoPP("+++")).toBe("pos");
    expect(endoPP("")).toBe("");
  });

  it("matchEndoOption maps engine Title Case → sentence-case dropdown option", () => {
    const PULPAL = ["", "Normal pulp", "Symptomatic irreversible pulpitis", "Pulp necrosis"];
    expect(matchEndoOption(PULPAL, "Symptomatic Irreversible Pulpitis")).toBe("Symptomatic irreversible pulpitis");
    expect(matchEndoOption(PULPAL, "Pulp Necrosis (uncertain — vitality signals conflict)")).toBe("Pulp necrosis");
    expect(matchEndoOption(PULPAL, "")).toBe("");
  });

  it("endoRecForTooth — lingering cold + percussion + spontaneous pain → SIP + symptomatic AP", () => {
    const f = {
      "endo count": 1, "endo1 #": "#8", "endo1 cold": "2/20s", "endo1 perc": "++", "endo1 palp": "-",
      "spontaneous pain": "Yes", "radiograph findings": "",
    };
    const rec = endoRecForTooth("#8", f);
    expect(rec.pulpal).toBe("Symptomatic Irreversible Pulpitis");
    expect(rec.periapical).toBe("Symptomatic Apical Periodontitis");
  });

  it("endoRecForTooth — necrosis + PARL on the named tooth → necrosis + asymptomatic AP", () => {
    const f = {
      "endo count": 1, "endo1 #": "#14", "endo1 cold": "NR", "endo1 perc": "-", "endo1 palp": "-",
      "spontaneous pain": "No", "radiograph findings": "periapical radiolucency on #14",
    };
    const rec = endoRecForTooth("#14", f);
    expect(rec.pulpal).toBe("Pulp Necrosis");
    expect(rec.periapical).toBe("Asymptomatic Apical Periodontitis");
  });

  it("endoRecForTooth — no matching test row (multi-tooth) returns null", () => {
    const f = { "endo count": 2, "endo1 #": "#3", "endo2 #": "#4", "endo1 cold": "NR" };
    expect(endoRecForTooth("#19", f)).toBe(null);
  });
});
