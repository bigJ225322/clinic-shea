#!/bin/bash
# Fabrication-smell sweep for clinic-shea content (guides-data.json + App.jsx
# pathway prose). These are the recurring AI-fabrication families found and cut
# during the 2026-06 CD source audit (see docs/CD-PATHWAY-SOURCES.md). A hit is
# NOT automatically wrong — it's a prompt to verify the claim against Swade /
# the UIC lectures before shipping. Run: npm run audit-smells
cd "$(dirname "$0")/.." || exit 1

echo "── fabrication-smell sweep ───────────────────────────────────────────"
echo "Each hit needs a source (Swade page / lecture line) or a cut."
echo ""

PATTERNS=(
  '[0-9](\.[0-9])? ?lb\b'                          # retention forces in pounds
  '[0-9]{2,3}–[0-9]{2,3} ?nm'                      # cure wavelengths
  'functions? at (roughly |about |~)?[0-9]+%'      # the "30% of natural dentition" family
  '[0-9]+(\.[0-9])?× the'                          # invented multipliers (1.5x chair time)
  'replace(d|ment)? (every|at) [0-9]+(–|-)[0-9]+ (months|years)'  # invented maintenance intervals
  '\(equal parts'                                  # invented mix ratios
  'Bennett angle'                                  # cut twice already; UIC sources never state it
  '[0-9]+°? divergence'                            # implant angulation tolerances
  'Boley'                                          # cut from all CD chapters (caliper)
  'clinical remount \+ selective grinding'         # students don't do this; lab does
)

HITS=0
for p in "${PATTERNS[@]}"; do
  out=$(grep -nE "$p" src/guides-data.json src/App.jsx 2>/dev/null | grep -v 'audit-smells' | head -5)
  if [ -n "$out" ]; then
    echo "▲ pattern: $p"
    echo "$out" | sed 's/^/    /' | cut -c1-160
    echo ""
    HITS=1
  fi
done

if [ "$HITS" -eq 0 ]; then
  echo "✓ clean — no fabrication-family patterns in content files"
fi
