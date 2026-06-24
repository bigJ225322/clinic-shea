// Probe the RPD engine for #7-alone configurations.
// Runs five scenarios that vary interocclusal space, ridge healing, and
// the presence of additional posterior gaps. Reports base-design output
// for the span containing #7.

import {
  rpdMakeBlankCase, rpdRunEngine,
} from "~/Desktop/clinic-shea/.claude/worktrees/distracted-elbakyan-0b643b/src/rpd-engine.js";

const setMissing = (c, teeth) => {
  for (const n of teeth) c.teeth[n].status = "missing";
  return c;
};

const scenarios = [
  {
    name: "S1: #7 alone, normal IOS, healed ridge",
    build: () => {
      const c = rpdMakeBlankCase("maxillary");
      setMissing(c, [1, 16, 7]);
      c.measurements.interocclusalSpace = "adequate";
      c.patientFactors.monthsSinceExtraction = 12;
      return c;
    },
  },
  {
    name: "S2: #7 alone, limited IOS, healed ridge",
    build: () => {
      const c = rpdMakeBlankCase("maxillary");
      setMissing(c, [1, 16, 7]);
      c.measurements.interocclusalSpace = "limited";
      c.patientFactors.monthsSinceExtraction = 12;
      return c;
    },
  },
  {
    name: "S3: #7 alone, limited IOS, non-healed ridge (<6mo)",
    build: () => {
      const c = rpdMakeBlankCase("maxillary");
      setMissing(c, [1, 16, 7]);
      c.measurements.interocclusalSpace = "limited";
      c.patientFactors.monthsSinceExtraction = 3;
      c.patientFactors.designIntent = "interim";  // avoid blocker flag
      return c;
    },
  },
  {
    name: "S4: #7 alone, extremely limited IOS, healed",
    build: () => {
      const c = rpdMakeBlankCase("maxillary");
      setMissing(c, [1, 16, 7]);
      c.measurements.interocclusalSpace = "extremely_limited";
      c.patientFactors.monthsSinceExtraction = 12;
      return c;
    },
  },
  {
    name: "S5: #7 + posterior DE (Kennedy II) on left, normal IOS",
    build: () => {
      const c = rpdMakeBlankCase("maxillary");
      setMissing(c, [1, 16, 7, 13, 14, 15]);  // #7 anterior + #13-15 left DE
      c.measurements.interocclusalSpace = "adequate";
      c.patientFactors.monthsSinceExtraction = 12;
      return c;
    },
  },
];

for (const s of scenarios) {
  const c = s.build();
  const r = rpdRunEngine(c);
  const spans = r.baseDesigns || [];
  console.log(`\n${s.name}`);
  console.log(`  Kennedy: ${r.kennedy.class}${r.kennedy.modifications ? ` Mod ${r.kennedy.modifications}` : ""}`);
  for (const span of spans) {
    const teeth = span.spanTeeth.join(", ");
    console.log(`  span [${teeth}] → ${span.type}  (tier: ${span.tier}${span.alternative ? `; alt: ${span.alternative}` : ""})`);
  }
}
