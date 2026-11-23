import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const distDir = process.env.CENTMETA_TEST_DIST;
if (!distDir) {
  throw new Error("CENTMETA_TEST_DIST non impostato");
}

const mtg = require(path.join(distDir, "mtg.js"));
const parser = require(path.join(distDir, "decklistParser.js"));
const search = require(path.join(distDir, "scryfallSearch.js"));
const notes = require(path.join(distDir, "notesStorage.js"));

test("mtg helpers: basic lands, period params and color identity", () => {
  assert.equal(mtg.isBasicLand("Island"), true);
  assert.equal(mtg.isBasicLand("  snow-covered swamp "), true);
  assert.equal(mtg.isBasicLand("Wastes"), true);
  assert.equal(mtg.isBasicLand("Command Tower"), false);
  assert.equal(mtg.isBasicLand(""), false);

  assert.equal(mtg.getPeriodQuery("Ultimi 30 giorni"), "");
  assert.equal(mtg.getPeriodParam("Ultimi 30 giorni"), "");
  assert.equal(mtg.getPeriodQuery("Tutti i tempi"), "?periodo=Tutti%20i%20tempi");
  assert.equal(mtg.getPeriodParam("Tutti i tempi"), "&periodo=Tutti%20i%20tempi");

  assert.equal(mtg.matchesColorIdentity(["U", "R"], ["U", "R"]), true);
  assert.equal(mtg.matchesColorIdentity(["U", "R", "W"], ["U", "R"]), false);
  assert.equal(mtg.matchesColorIdentity([], ["C"]), true);
  assert.equal(mtg.matchesColorIdentity(["W", "U"], ["M"]), true);
});

test("decklistParser: Moxfield, MTGA About/Name, MTGO SB, counts, tags, special collector & Partner+DFC", () => {
  const raw = [
    "About",
    "Name Il Mio Mazzo Centurion",
    "",
    "Commander (2)",
    "1 Esika, God of the Tree // The Prismatic Bridge (KHM) 168 *F*",
    "1 Tymna the Weaver",
    "",
    "Deck (100)",
    "1 Lightning Bolt (2X2) 123★ #Burn #Removal",
    "1x Sink into Stupor // Soporific Springs [MH3] 241",
    "3 Snow-Covered Island #Land",
    "1 Sol Ring *CMDR*",
    "",
    "Sideboard (15)",
    "1 Rest in Peace",
    "SB: 1 Grafdigger's Cage",
    "Maybeboard",
    "1 Counterspell",
  ].join("\n");

  const parsed = parser.parseDecklistText(
    raw,
    "Esika, God of the Tree // The Prismatic Bridge / Tymna the Weaver",
  );
  const names = parsed.entries.map((e) => e.name);
  assert.deepEqual(names, [
    "Lightning Bolt",
    "Sink into Stupor // Soporific Springs",
    "Snow-Covered Island",
    "Sol Ring",
  ]);
  assert.equal(parsed.totalQuantity, 6);
  assert.equal(parsed.ignoredSectionsCount, 3);
  assert.equal(
    parsed.entries.find((e) => e.name === "Snow-Covered Island")?.quantity,
    3,
  );
});

test("decklistParser: compareDeckWithMeta computes missing, shared, unique and curve", () => {
  const parsed = parser.parseDecklistText(
    "1 Lightning Bolt\n1 Brainstorm\n1 Island\n1 My Spicy Tech",
    "Kraum",
  );
  const statsData = {
    total_decks: 10,
    type_distribution: { Terre: 36 },
    mana_curve: { 1: 12, 2: 8 },
    cards: [
      { card_name: "Lightning Bolt", Percentuale: 90, category: "Istantanei", cmc: 1, Sinergia: 15 },
      { card_name: "Counterspell", Percentuale: 80, category: "Istantanei", cmc: 2 },
      { card_name: "Brainstorm", Percentuale: 50, category: "Istantanei", cmc: 1 },
      { card_name: "Island", Percentuale: 95, category: "Terre", cmc: 0 },
    ],
  };

  const cmp = parser.compareDeckWithMeta(parsed, statsData);
  assert.equal(cmp.totalNonCommanderCards, 4);
  assert.equal(cmp.userLands, 1);
  assert.equal(cmp.metaAvgLands, 36);
  assert.equal(cmp.staplesCovered, 2); // Bolt e Brainstorm (le terre base sono escluse dalle staple)
  assert.equal(cmp.totalStaplesCount, 3);
  assert.deepEqual(
    cmp.missingStaples.map((c) => c.name),
    ["Counterspell"],
  );
  assert.deepEqual(
    cmp.uniqueCards.map((c) => c.name),
    ["My Spicy Tech"],
  );
  assert.equal(cmp.curveComparison.find((p) => p.cmc === "1")?.userCount, 2);
});

test("scryfallSearch: != operators, mv!=even/odd, is:dual reminder-text, mana tokens, ~ escape & anti-ReDoS", () => {
  const cards = [
    {
      card_name: "Lightning Bolt",
      type: "Instant",
      oracles: ["Lightning Bolt deals 3 damage to any target."],
      color_identity: ["R"],
      colors: ["R"],
      cmc: 1,
      mana_cost: "{R}",
      set_code: "2X2",
      rarity: "common",
      artist: "Christopher Moeller",
    },
    {
      card_name: "Counterspell",
      type: "Instant",
      oracles: ["Counter target spell."],
      color_identity: ["U"],
      colors: ["U"],
      cmc: 2,
      mana_cost: "{U}{U}",
      set_code: "CMM",
      rarity: "common",
      artist: "Zack Stella",
    },
    {
      card_name: "Tundra",
      type: "Land — Plains Island",
      oracles: ["({T}: Add {W} or {U}.)"],
      color_identity: ["W", "U"],
      colors: [],
      cmc: 0,
      set_code: "VMA",
      rarity: "rare",
    },
    {
      card_name: "Card (Alpha)",
      type: "Artifact",
      oracles: ["When Card (Alpha) enters, draw a card."],
      color_identity: [],
      colors: [],
      cmc: 3,
      mana_cost: "{2}{W/U}",
      set_code: "MH3",
      rarity: "mythic",
      artist: "John Avon",
    },
  ];

  const run = (q) => {
    const pred = search.compileScryfallQuery(q);
    return cards.filter(pred).map((c) => c.card_name);
  };

  assert.deepEqual(run("t:instant t!=sorcery set!=cmm"), ["Lightning Bolt"]);
  assert.deepEqual(run("mv!=even t:instant"), ["Lightning Bolt"]);
  assert.deepEqual(run("mv!=odd mv>0"), ["Counterspell"]);
  assert.deepEqual(run("is:dual"), ["Tundra"]);
  assert.deepEqual(run("m:uu"), ["Counterspell"]);
  assert.deepEqual(run("m:{2}{w/u}"), ["Card (Alpha)"]);
  assert.deepEqual(run('o:"When ~ enters"'), ["Card (Alpha)"]);
  assert.deepEqual(run("r!=common r!=rare"), ["Card (Alpha)"]);
  assert.deepEqual(run("t!=instant t!=land"), ["Card (Alpha)"]);

  // Anti-ReDoS: pattern nidificati pericolosi non devono bloccare o lanciare eccezioni
  const redosPred = search.compileScryfallQuery("o:/(a+)+$/");
  assert.equal(typeof redosPred(cards[0]), "boolean");
});

test("notesStorage: quick add, off-color check & Moxfield export formatting", () => {
  assert.deepEqual(notes.parseQuickAddLine("6x Island"), { name: "Island", quantity: 6 });
  assert.deepEqual(notes.parseQuickAddLine("4 Lightning Bolt"), { name: "Lightning Bolt", quantity: 1 });
  assert.equal(notes.parseQuickAddLine("   "), null);

  assert.equal(notes.isOutsideCommanderIdentity(["W"], ["U", "R"], true), true);
  assert.equal(notes.isOutsideCommanderIdentity(["U"], ["U", "R"], true), false);
  assert.equal(notes.isOutsideCommanderIdentity(["W"], [], false), false);

  const exported = notes.formatMoxfieldDecklist(
    {
      commander: "Kraum, Ludevic's Opus / Tymna the Weaver",
      cards: [
        { name: "Lightning Bolt", quantity: 4 },
        { name: "Island", quantity: 120 },
      ],
      updatedAt: "",
    },
    true,
  );
  assert.equal(
    exported,
    [
      "1 Kraum, Ludevic's Opus",
      "1 Tymna the Weaver",
      "1 Lightning Bolt",
      "99 Island",
    ].join("\n"),
  );
});
