import { describe, it, expect } from "vitest";
import { cleanProseText, CHUNKS, TEMPLATES } from "./App.jsx";

// ---------------------------------------------------------------------------
// Steps-tab verbatim lock.
//
// Swade is the holy bible in the clinic: the Steps tab may restyle HOW the
// chunk bodies render (markers, indentation, rejoined PDF line-wraps) but must
// never change a word. cleanProseText is the only text transform between a
// chunk body and the rendered article (ProseBlock then only swaps the leading
// ○/■/● glyph for a styled marker and re-renders "N." prefixes verbatim).
//
// These tests turn any future "helpful cleanup" that touches actual characters
// into a loud failure, for every chunk in the corpus at once.
// ---------------------------------------------------------------------------

// Collapse whitespace + zero-width spaces; everything that remains is content.
const squeeze = (s) => s.replace(/[\s​]+/g, "");

describe("Steps render pipeline keeps Swade verbatim", () => {
  it("cleanProseText changes nothing besides whitespace, for every chunk body", () => {
    for (const c of CHUNKS) {
      expect(squeeze(cleanProseText(c.body)), `chunk ${c.id}`).toBe(squeeze(c.body));
    }
  });

  it("corpus carries no zero-width spaces (U+200B scrub lock)", () => {
    for (const c of CHUNKS) {
      expect(c.body.includes("​"), `chunk ${c.id} body`).toBe(false);
      expect(c.title.includes("​"), `chunk ${c.id} title`).toBe(false);
    }
  });

  it("note templates carry no zero-width spaces", () => {
    for (const id of Object.keys(TEMPLATES)) {
      expect(String(TEMPLATES[id]).includes("​"), `template ${id}`).toBe(false);
    }
  });
});
