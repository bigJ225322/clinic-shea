# Cases tab differentiator — lab steps + UIC workflow audit

## What we're trying to build

Per the directive: the differentiator between the Cases tab and the Steps tab is
**(1)** explicit lab steps between clinical appointments, and **(2)** integrated
UIC-workflow content that pulls from domain-specific resources (RPD Manual, CD/IOD
lectures, treatment-planning lectures) on top of the per-appointment Swade content
already in Steps.

Today most Cases pathways have `phases: [{label, count}]` that group clinical
chapters. The gaps between clinical phases — where the student is responsible for
boxing the impression, pouring stone, surveying, fabricating a custom tray, sending
the framework Rx, etc. — are implicit. The Steps tab doesn't show those because
Steps is per-appointment. So right now neither tab tells the student "between visit
3 and visit 4 you owe the lab the wax-rim Rx, here's what the lab does on its
end, and here's the turnaround you should expect."

## What sources I have vs. what I'd need

**Already in the codebase (Swade chunks, chunks 1–~1500):**
- Per-appointment clinical steps (the Steps tab content)
- A `LAB_SCRIPTS` library with the Rx text for PFM, bridge, RPD, F/F, II denture,
  reline, abutment, etc. (chunks 107–120)
- Lab instructions section in Swade chunk 590 (titles only — Diagnostic Impressions,
  Wax Rims for Bite Registration, Facebow & Mounting Casts, Surveying & Practice
  Rest Seats, Guide Planes & Rest Seats, RPD Design, Intraoral Preparations, Custom
  Trays, Framework Try-In & Framework Wax Rims, Setting Teeth)
- Scattered lecture references already embedded in pathway keyDecisions
  (Vital Pulp Therapy 2025, Endo Emergencies 2025, TRAUMA, Connectors 2025,
  Latta Class IV layering, IOD lecture page citations)

**What I do NOT have direct access to** and would need from you to write actual
content (not just gap markers):
- The current RPD Manual PDF (sequencing of lab + clinic steps, lab forms)
- The current CD lecture deck (border molding sequence, mounting protocol, processing)
- The IOD lecture deck (attachment selection, pickup workflow)
- The Dx + TP lecture decks (the "treatment planning" documents you mentioned)
- Lab turnaround expectations specific to UIC's lab queue

For pathways where I flag a lab gap below, the prose itself should come from those
PDFs, not from me guessing.

---

## RPD family (highest lab density — recommended start)

### `rpd-kennedy3` — Kennedy III RPD

**Current phases:**
`Diagnostic + records → Survey + design → Final impression → Framework try-in → Delivery`

**Lab gaps not currently explicit in Cases:**

| Between phase N → N+1 | Lab work the student owes / lab returns | UIC source |
|---|---|---|
| Diagnostic + records → Survey + design | Pour diagnostic cast, articulate, survey the diagnostic cast, complete Preliminary Design Form | RPD Manual + RPD Preliminary Design Sheet (referenced in Swade chunk 590) |
| Survey + design → Final impression | Fabricate custom tray for altered-cast or single-impression workflow; mount on surveyor; mark final design in red per Lab 4 convention | RPD Lab 4 (color convention already encoded in engine) |
| Final impression → Framework try-in | Pour master cast, mark tripod + path of insertion in red, send framework Rx (template `lab-rpd` exists) — student responsibility before the Rx leaves; lab fabrication turnaround | RPD Manual + `lab-rpd` template (already in chunks) |
| Framework try-in → Delivery | Tooth setup wax-up (often done with lab; student review of tooth mold + shade); wax try-in if anterior teeth involved; processing into acrylic | RPD lectures — sequencing chapter |

### `rpd-distal-extension` — Kennedy I/II RPD

Same skeleton as `rpd-kennedy3`, plus:
- **Altered-cast technique** between framework try-in and final wax try-in (the
  framework comes back, gets seated, an altered-cast impression of the distal-
  extension ridge is taken, lab modifies the cast to reflect the displaced-tissue
  position before tooth setup). This is currently called out in keyDecisions but
  not in phases.
- UIC source: RPD Manual altered-cast section + the distal-extension specific
  lecture content.

### `rpd-kennedy4-anterior` — Anterior single-tooth replacement RPD

Lab gaps similar to Kennedy III but with an extra:
- **Wax try-in with denture tooth before processing** is critical here because it's
  the only chance to verify anterior tooth shade + position with the patient before
  the acrylic is processed. Currently in phases as "Esthetic check" but the lab
  step (tooth setup → wax try-in → process) is not differentiated.

### `rpd-broken-clasp`, `rpd-broken-denture-tooth`, `rpd-broken-framework`, `rpd-valplast-repair`

Repair pathways. Each has an implicit "send to lab for repair, lab returns" step.
- Most are simple solder/repair turnarounds (1–3 days at UIC lab).
- `rpd-broken-framework` may end in remake (lab fabrication of new framework).
- UIC source: lab turnaround times (currently a stub at `lab-turnaround` — chunk 2370).

### `rpd-loose-rpd`, `rpd-reline`

Already have a `Lab Reline` phase (chunk 2362). The pathway sends the existing RPD
to the lab with a wash impression for hard or soft reline. This one is the closest
to the user's vision today — good model.

### `rpd-first-time-patient`, `rpd-tmd-considering`, `rpd-recurrent-caries-abutment`

These are case-selection / planning pathways, not workflow pathways. They might not
need lab-step phases because they describe the *decision* to make an RPD, not the
fabrication itself. Worth confirming.

---

## CD / IOD family

### `cd-conventional` — Fully edentulous conventional CD

**Current phases:**
`Pre-prosthetic eval → Records → Mounting → VDO & CR → Setup → Try-in → Process & deliver → Follow-up`

**Lab gaps not currently explicit:**

| Between phase N → N+1 | Lab work | UIC source |
|---|---|---|
| Records → Mounting | Box the alginate, pour preliminary cast, fabricate custom trays (acrylic or VLC) per UIC convention | CD Lecture 1 (Diagnostic Impressions) + Custom Trays from chunk 590 |
| Mounting → VDO & CR | Pour master cast from PVS, fabricate record bases + wax rims (Hanau torch + greenstick), face-bow record mounting on Denar Mark 320 | CD Lecture 2 + Wax Rims for Bite Registration |
| VDO & CR → Setup | Lab tooth setup against the wax rims (anterior + posterior; tooth mold selected at appt) | CD Lecture 3 + Setting Teeth lab |
| Setup → Try-in | Final wax-up festooning + smoothing | CD Lecture 4 (try-in sequencing) |
| Try-in → Process & deliver | Investing, processing, deflasking, recovery, finishing, polishing | CD lecture — processing |

This is the cleanest pathway to model in the new structure because it has 5 distinct
lab blocks with well-defined deliverables.

### `cd-iid` — Immediate Interim Denture

Adds:
- **Tooth modifications on the cast** before setup (lab grinds the cast to mimic
  the extractions). Critical step that's not in Steps content.
- UIC source: IID lecture + the `lab-ii-denture` Rx template (chunk 116).

### `cd-iod-canine-roots`, `cd-implant-supported-lower`

Overdenture workflows add:
- **Block-out + housing pickup** at processing or delivery
- **Attachment-pickup chairside reline** (cold-cure PMMA around the housings)
- UIC source: IOD lecture (already cited inline by page number in existing keyDecisions)

### `cd-adjustment`, `cd-reline-lab`

Already lab-focused. `cd-reline-lab` is essentially all lab work between two short
clinical visits. Good model for the lab-step structure.

### `cd-anxious-firsttime`, `cd-xerostomic`, `cd-rapid-need`, `cd-limited-dexterity`

Patient-modifier pathways — they describe how the standard CD workflow changes
based on patient factors. Lab steps are the same as `cd-conventional`; no separate
lab content needed.

---

## Indirect family (lower lab density per case but high case volume)

### `ind-conventional-crown` — PFM/cast crown

**Current phases:**
`Diagnosis → Prep + provisional → Final impression → Lab try-ins → Delivery`

**Lab gaps:**

| Between phase N → N+1 | Lab work | UIC source |
|---|---|---|
| Prep + provisional → Final impression | (Student fabricates provisional chairside — not a true lab gap, but the Integrity / Jet Set 4 fabrication is in chunk 524/530) | Provisional chunks (already in Steps) |
| Final impression → Lab try-ins | Pour master die + opposing cast, mount on articulator, wax-up + cast or press, porcelain stack, return for try-in | Fixed prosth lectures |
| Lab try-ins → Delivery | Glaze + final firing after the try-in (often not visualized as a separate visit but is a lab turnaround step) | Fixed prosth lectures |

### `ind-bridge` — 3-unit FPD

Same as conventional crown plus:
- **Framework try-in** between metal cast and porcelain application — student
  evaluates the metal framework for fit + occlusion before porcelain stacks.
  Currently buried in "Lab try-ins" phase; should be its own visit.
- UIC source: `lab-porcelain` template (already in chunks) — the Rx that goes back
  to the lab after framework try-in for porcelain application only.

### `ind-veneers` — 6 anterior veneers

Adds:
- **Diagnostic wax-up + putty mock-up** review with patient before any reduction
- Lab cycle similar to crowns × 6 (per-tooth)

### `ind-survey-crown`

Lab gap is specific: the lab fabricates a survey crown with rest seat + guide
plane + undercut features per the surveyed cast that goes with the Rx. The
`lab-survey-crown` template (chunk 119) is one of the most detailed Rxes in the
codebase — its content is essentially the lab-step description. Could be inlined
into the pathway.

### `ind-digital-emax`, `ind-cad-cam-inlay-onlay`

**No traditional lab gap** — chairside mill in the digital clinic. Same-day delivery.
The "lab" work is the design + mill + crystallize, all in clinic. Pathways here
should explicitly note "no lab turnaround" instead of leaving the gap implicit.

### `ind-endo-treated`, `ind-recement`, `ind-crown-endo-access-fill`, `ind-fractured-cusp`, `ind-crown-removal`, `ind-failing-existing-crown`

Repair / re-cement / single-visit pathways. No new lab fabrication. Don't need
lab-step phases.

### `ind-zirconia-posterior`, `ind-3-4-crown`, `ind-bruxer-crown`, `ind-onlay-bruxer`, `ind-anterior-crown-esthetic`, `ind-post-and-core`, `ind-large-span-fpd`, `ind-single-implant-crown`, `ind-cracked-tooth-syndrome`, `ind-onlay-vs-crown-decision`

Variants of conventional crown / onlay / bridge with the same lab cycle. They'd
inherit whatever lab-step content `ind-conventional-crown` ends up with.

---

## Cross- pathways with lab steps

- `cross-cd-rpd` (combined CD + RPD): inherits CD lab steps + RPD lab steps in
  sequence.
- `cross-cd-iod-implants` (existing CD → add implants): inherits CD steps + adds
  pickup-of-housings lab step.
- `cross-rpd-to-implants`: RPD repair + implant restoration lab steps.

---

## Recommended structure for the new lab-step field

```jsx
{
  id: "cd-conventional",
  // ...existing fields...
  phases: [ ... ],
  sections: [ ... ],
  // NEW
  labSteps: [
    {
      after: 1, // index into phases — this lab work happens after phase[1] "Records"
      title: "Pour preliminary cast + fabricate custom trays",
      body: "Box the alginate, pour stone, separate cast at 1 hr. Outline...",
      source: "CD Lecture 1 (Diagnostic Impressions) + Swade chunk 590",
      turnaround: "Same week — fabricate before next clinical visit",
    },
    { after: 2, title: "...", body: "...", source: "...", turnaround: "..." },
    // ...
  ],
}
```

Renderer in the Cases card would insert a visually distinct band ("Lab block — N") between phase
N and phase N+1, styled differently from clinical phases (e.g. paper-colored
background, "LAB" tag in the accent color, italic body text).

---

## Recommended next step

1. **You send me** the PDFs (or pasted text) of:
   - RPD Manual lab sequencing section
   - CD Lecture series 1–4
   - IOD lecture (or page references)
   - Any "treatment planning" documents you specifically meant
2. **I build** the `labSteps` field + renderer (small structural change to PATHWAYS schema + one render block in Cases.jsx)
3. **I populate** `cd-conventional` first (cleanest pathway), then `rpd-kennedy3` (densest pathway), then `ind-conventional-crown` (broadest reach because many ind- pathways inherit from it)
4. **You review** the first three populated pathways and we iterate before fanning out to the rest

For the pathways where lab content is just a remake/repair (RPD broken pieces,
ind- repair pathways, ind- chairside-only digital cases), I'd note "no lab block"
instead of fabricating one — the absence is informative.

If you'd rather I start now with the renderer + content based on what's already in
the codebase (Swade chunk 590 lab instructions, IOD page references in existing
keyDecisions, RPD Lab 4 design conventions in the engine), I can do a v0 that gives
you a working visual and we replace placeholder lab-step prose as you share
source PDFs.
