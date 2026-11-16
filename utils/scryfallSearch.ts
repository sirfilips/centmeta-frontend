// Motore di ricerca client-side compatibile con la sintassi Scryfall

export interface ScryfallSearchableItem {
  name?: string;
  card_name?: string;
  comandante?: string;
  type?: string;
  oracles?: string[];
  color_identity?: string[];
  colors?: string[];
  cmc?: number;
  mana_cost?: string;
  keywords?: string[];
  power?: string | number | null;
  toughness?: string | number | null;
  loyalty?: string | number | null;
  rarity?: string | null;
  set_code?: string | null;
  set?: string | null;
  roles?: string[];
  freq?: number;
  cnt?: number;
  val1?: number;
  Percentuale?: number;
  Sinergia?: number;
}

export const ROLE_ALIASES: Record<string, string> = {
  removal: "removal",
  removals: "removal",
  rimozione: "removal",
  rimozioni: "removal",
  burn: "burn",
  botti: "burn",
  botto: "burn",
  spari: "burn",
  counter: "counterspell",
  counters: "counterspell",
  counterspell: "counterspell",
  counterspells: "counterspell",
  draw: "card_draw",
  card_draw: "card_draw",
  carddraw: "card_draw",
  peschini: "card_draw",
  discard: "discard",
  scartini: "discard",
  scartino: "discard",
  hand_disruption: "discard",
  wipe: "board_wipe",
  wipes: "board_wipe",
  board_wipe: "board_wipe",
  boardwipe: "board_wipe",
  sweeper: "board_wipe",
  sweepers: "board_wipe",
  tutor: "tutor",
  tutors: "tutor",
  tutori: "tutor",
  tutore: "tutor",
  ramp: "ramp",
  mana: "ramp",
};

const COLOR_WORDS: Record<string, string[]> = {
  w: ["W"],
  white: ["W"],
  u: ["U"],
  blue: ["U"],
  b: ["B"],
  black: ["B"],
  r: ["R"],
  red: ["R"],
  g: ["G"],
  green: ["G"],
  azorius: ["W", "U"],
  dimir: ["U", "B"],
  rakdos: ["B", "R"],
  gruul: ["R", "G"],
  selesnya: ["G", "W"],
  orzhov: ["W", "B"],
  izzet: ["U", "R"],
  golgari: ["B", "G"],
  boros: ["R", "W"],
  simic: ["G", "U"],
  bant: ["W", "U", "G"],
  esper: ["W", "U", "B"],
  grixis: ["U", "B", "R"],
  jund: ["B", "R", "G"],
  naya: ["R", "G", "W"],
  abzan: ["W", "B", "G"],
  jeskai: ["U", "R", "W"],
  sultai: ["B", "G", "U"],
  mardu: ["R", "W", "B"],
  temur: ["G", "U", "R"],
  wubrg: ["W", "U", "B", "R", "G"],
};

const RARITY_ALIASES: Record<string, string> = {
  c: "common",
  common: "common",
  u: "uncommon",
  uncommon: "uncommon",
  r: "rare",
  rare: "rare",
  m: "mythic",
  mythic: "mythic",
};

const KNOWN_FIELDS = new Set([
  "o", "oracle", "fo", "fulloracle",
  "t", "type",
  "c", "color", "colors",
  "id", "identity", "ci",
  "mv", "cmc", "manavalue",
  "m", "mana",
  "kw", "keyword",
  "pow", "power",
  "tou", "toughness",
  "loy", "loyalty",
  "e", "set", "s",
  "r", "rarity",
  "n", "name",
  "is", "not",
  "role", "function", "otag",
  "decks", "freq", "perc", "sinergia",
]);

type Token =
  | { kind: "LPAREN" }
  | { kind: "RPAREN" }
  | { kind: "OR" }
  | { kind: "AND" }
  | { kind: "TERM"; value: string };

type CardPredicate = (card: ScryfallSearchableItem) => boolean;

const FIELD_OP_RE = /^([a-zA-Z]+)(!=|<=|>=|:|=|<|>)([\s\S]*)$/;

function getItemName(card: ScryfallSearchableItem): string {
  return card.name || card.card_name || card.comandante || "";
}

function tokenizeScryfallQuery(query: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = query.length;

  while (i < n) {
    const ch = query[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ kind: "LPAREN" });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ kind: "RPAREN" });
      i++;
      continue;
    }

    let buf = "";
    while (i < n) {
      const c = query[i];
      if (/\s/.test(c) || c === "(" || c === ")") {
        if (buf.length > 0 || c === "(") break;
      }
      if (c === '"') {
        buf += c;
        i++;
        while (i < n) {
          if (query[i] === "\\" && i + 1 < n) {
            buf += query[i + 1];
            i += 2;
            continue;
          }
          if (query[i] === '"') {
            buf += '"';
            i++;
            break;
          }
          buf += query[i];
          i++;
        }
        continue;
      }
      const prevChar = buf.length > 0 ? buf[buf.length - 1] : "";
      const isFieldRegex =
        c === "/" &&
        ((buf.length > 0 && (prevChar === ":" || prevChar === "=" || prevChar === "<" || prevChar === ">")) ||
          (buf.length === 0 &&
            i + 1 < n &&
            query[i + 1] !== "/" &&
            query[i + 1] !== " " &&
            query.indexOf("/", i + 1) !== -1));
      if (isFieldRegex) {
        buf += c;
        i++;
        while (i < n) {
          if (query[i] === "\\" && i + 1 < n) {
            buf += query[i] + query[i + 1];
            i += 2;
            continue;
          }
          if (query[i] === "/") {
            buf += "/";
            i++;
            break;
          }
          buf += query[i];
          i++;
        }
        continue;
      }
      buf += c;
      i++;
    }

    if (!buf) continue;
    const upper = buf.toUpperCase();
    if (upper === "OR") {
      tokens.push({ kind: "OR" });
    } else if (upper === "AND") {
      tokens.push({ kind: "AND" });
    } else {
      tokens.push({ kind: "TERM", value: buf });
    }
  }

  return tokens;
}

function stripQuotes(val: string): string {
  if (val.length >= 2 && val.startsWith('"') && val.endsWith('"')) {
    return val.slice(1, -1);
  }
  return val;
}

function parseRegexLiteral(val: string): RegExp | null {
  if (val.length >= 2 && val.startsWith("/") && val.endsWith("/")) {
    try {
      return new RegExp(val.slice(1, -1), "i");
    } catch {
      return null;
    }
  }
  return null;
}

function matchText(text: string, rawVal: string, exact = false): boolean {
  const regex = parseRegexLiteral(rawVal);
  if (regex) {
    return regex.test(text);
  }
  const needle = stripQuotes(rawVal).trim().toLowerCase();
  if (!needle) return true;
  const hay = text.toLowerCase();
  return exact ? hay === needle : hay.includes(needle);
}

function parseColorExpr(val: string): {
  numericCount: number | null;
  special: "c" | "m" | null;
  target: Set<string>;
} {
  const v = stripQuotes(val).trim().toLowerCase();
  if (!v) return { numericCount: null, special: null, target: new Set() };
  if (/^\d+$/.test(v)) {
    return { numericCount: parseInt(v, 10), special: null, target: new Set() };
  }
  if (v === "c" || v === "colorless") {
    return { numericCount: null, special: "c", target: new Set() };
  }
  if (v === "m" || v === "multicolor") {
    return { numericCount: null, special: "m", target: new Set() };
  }
  if (COLOR_WORDS[v]) {
    return { numericCount: null, special: null, target: new Set(COLOR_WORDS[v]) };
  }
  const letters = new Set<string>();
  for (const ch of v) {
    if (ch === "w" || ch === "u" || ch === "b" || ch === "r" || ch === "g") {
      letters.add(ch.toUpperCase());
    } else {
      return { numericCount: null, special: null, target: new Set() };
    }
  }
  return { numericCount: null, special: null, target: letters };
}

function compareNumeric(actual: number | null | undefined, op: string, targetStr: string): boolean {
  if (actual === null || actual === undefined || Number.isNaN(actual)) return false;
  const t = stripQuotes(targetStr).trim().toLowerCase();
  if (t === "even") return Number.isInteger(actual) && actual % 2 === 0;
  if (t === "odd") return Number.isInteger(actual) && Math.abs(actual % 2) === 1;
  const target = Number(t);
  if (t === "" || Number.isNaN(target)) return false;
  switch (op) {
    case ":":
    case "=":
      return actual === target;
    case "!=":
      return actual !== target;
    case "<":
      return actual < target;
    case "<=":
      return actual <= target;
    case ">":
      return actual > target;
    case ">=":
      return actual >= target;
    default:
      return false;
  }
}

function isSubset(a: Set<string>, b: Set<string>): boolean {
  return Array.from(a).every((item) => b.has(item));
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  return a.size === b.size && isSubset(a, b);
}

function compareColorSet(
  actualList: string[] | undefined,
  op: string,
  val: string,
  isIdentity: boolean,
): boolean {
  const actual = new Set(
    (actualList || [])
      .map((c) => (c || "").toUpperCase())
      .filter((c) => c === "W" || c === "U" || c === "B" || c === "R" || c === "G"),
  );
  const { numericCount, special, target } = parseColorExpr(val);

  if (numericCount !== null) {
    return compareNumeric(actual.size, op, String(numericCount));
  }
  if (special === "c") {
    const isC = actual.size === 0;
    return op === "!=" ? !isC : isC;
  }
  if (special === "m") {
    const isM = actual.size > 1;
    return op === "!=" ? !isM : isM;
  }
  if (target.size === 0) return false;

  if (op === "=") return setsEqual(actual, target);
  if (op === "!=") return !setsEqual(actual, target);
  if (op === "<=") return isSubset(actual, target);
  if (op === "<") return isSubset(actual, target) && actual.size < target.size;
  if (op === ">=") return isSubset(target, actual);
  if (op === ">") return isSubset(target, actual) && actual.size > target.size;
  return isIdentity ? isSubset(actual, target) : isSubset(target, actual);
}

function normalizeManaQuery(rawVal: string): string {
  const v = stripQuotes(rawVal).trim().toUpperCase();
  if (v.includes("{")) return v;
  return v
    .replace(/\s+/g, "")
    .split("")
    .map((ch) => `{${ch}}`)
    .join("");
}

function getEffectiveColors(card: ScryfallSearchableItem): string[] {
  if (card.colors) return card.colors;
  const frontType = (card.type || "").toLowerCase().split(" // ")[0];
  if (frontType.includes("land")) return [];
  return card.color_identity || [];
}

function matchIsProperty(card: ScryfallSearchableItem, prop: string): boolean {
  const p = stripQuotes(prop).trim().toLowerCase();
  const name = getItemName(card).toLowerCase();
  const typeLine = (card.type || "").toLowerCase();
  const frontType = typeLine.split(" // ")[0];
  const oracles = (card.oracles || []).join(" ").toLowerCase();
  const colors = getEffectiveColors(card);
  const manaCost = (card.mana_cost || "").toLowerCase();

  if (
    p === "creature" ||
    p === "instant" ||
    p === "sorcery" ||
    p === "artifact" ||
    p === "enchantment" ||
    p === "planeswalker" ||
    p === "land" ||
    p === "battle" ||
    p === "legendary" ||
    p === "basic" ||
    p === "snow"
  ) {
    return typeLine.includes(p);
  }
  if (p === "tribal" || p === "kindred") {
    return typeLine.includes("tribal") || typeLine.includes("kindred");
  }
  if (p === "nonland" || p === "spell") {
    return !frontType.includes("land");
  }
  if (p === "permanent") {
    return (
      typeLine.includes("creature") ||
      typeLine.includes("artifact") ||
      typeLine.includes("enchantment") ||
      typeLine.includes("planeswalker") ||
      typeLine.includes("land") ||
      typeLine.includes("battle")
    );
  }
  if (p === "historic") {
    return typeLine.includes("artifact") || typeLine.includes("legendary") || typeLine.includes("saga");
  }
  if (p === "commander" || p === "cmd") {
    return (
      (typeLine.includes("legendary") && typeLine.includes("creature")) ||
      oracles.includes("can be your commander") ||
      card.comandante !== undefined
    );
  }
  if (p === "partner") {
    return (
      name.includes(" / ") ||
      oracles.includes("partner") ||
      oracles.includes("friends forever") ||
      oracles.includes("choose a background")
    );
  }
  if (p === "dfc" || p === "transform" || p === "mdfc" || p === "split") {
    return name.includes(" // ") || typeLine.includes(" // ");
  }
  if (p === "modal") {
    return (
      oracles.includes("choose one") ||
      oracles.includes("choose two") ||
      oracles.includes("choose three") ||
      oracles.includes("escalate") ||
      oracles.includes("spree") ||
      name.includes(" // ")
    );
  }
  if (p === "vanilla") {
    return typeLine.includes("creature") && oracles.trim().length === 0;
  }
  if (p === "multicolor") return colors.length > 1;
  if (p === "monocolor") return colors.length === 1;
  if (p === "colorless") return colors.length === 0;
  if (p === "hybrid") return /\{[wubrg]\/[wubrg2]\}/i.test(manaCost || oracles);
  if (p === "phyrexian") return /\{[wubrg]\/p\}/i.test(manaCost || oracles);
  if (p === "etb") return oracles.includes("enters");
  if (p === "fetchland") {
    return typeLine.includes("land") && oracles.includes("sacrifice this land: search your library for");
  }
  if (p === "shockland") return typeLine.includes("land") && oracles.includes("you may pay 2 life");
  if (p === "dual") {
    return typeLine.includes("land") && !oracles.trim() && !typeLine.includes("basic");
  }
  if (p === "painland") return typeLine.includes("land") && oracles.includes("deals 1 damage to you");
  if (p === "surveilland") return typeLine.includes("land") && oracles.includes("surveil 1");
  if (ROLE_ALIASES[p]) {
    const canonical = ROLE_ALIASES[p];
    return Array.isArray(card.roles) && card.roles.includes(canonical);
  }
  return false;
}

function buildTermPredicate(term: string): CardPredicate {
  if (term.startsWith("!")) {
    const target = stripQuotes(term.slice(1)).trim().toLowerCase();
    return (card) => {
      const name = getItemName(card).trim().toLowerCase();
      if (name === target) return true;
      if (name.includes(" // ")) {
        return name.split(" // ").some((p) => p.trim() === target);
      }
      return false;
    };
  }

  const m = FIELD_OP_RE.exec(term);
  if (m) {
    const field = m[1].toLowerCase();
    const op = m[2];
    const val = m[3];

    if (KNOWN_FIELDS.has(field)) {
      if (field === "o" || field === "oracle" || field === "fo" || field === "fulloracle") {
        return (card) => {
          const oraclesStr = (card.oracles || []).join("\n");
          if (!oraclesStr) return false;
          const name = getItemName(card);
          const cleanVal = val.includes("~") && name ? val.replace(/~/g, name) : val;
          return matchText(oraclesStr, cleanVal) || matchText(oraclesStr, val);
        };
      }

      if (field === "t" || field === "type") {
        return (card) => matchText(card.type || "", val);
      }

      if (field === "n" || field === "name") {
        return (card) => matchText(getItemName(card), val, op === "=");
      }

      if (field === "id" || field === "identity" || field === "ci") {
        return (card) => compareColorSet(card.color_identity, op, val, true);
      }

      if (field === "c" || field === "color" || field === "colors") {
        return (card) => compareColorSet(getEffectiveColors(card), op, val, false);
      }

      if (field === "mv" || field === "cmc" || field === "manavalue") {
        return (card) => compareNumeric(card.cmc, op, val);
      }

      if (
        field === "pow" ||
        field === "power" ||
        field === "tou" ||
        field === "toughness" ||
        field === "loy" ||
        field === "loyalty"
      ) {
        const key =
          field === "pow" || field === "power"
            ? "power"
            : field === "tou" || field === "toughness"
              ? "toughness"
              : "loyalty";
        return (card) => {
          const raw = card[key];
          if (raw === null || raw === undefined || raw === "") return false;
          const num = Number(raw);
          if (!Number.isNaN(num)) {
            return compareNumeric(num, op, val);
          }
          return stripQuotes(val).trim().toLowerCase() === String(raw).trim().toLowerCase();
        };
      }

      if (field === "m" || field === "mana") {
        const normQ = normalizeManaQuery(val);
        return (card) => {
          const mc = (card.mana_cost || "").toUpperCase();
          if (!mc) return false;
          return op === "=" ? mc === normQ : mc.includes(normQ);
        };
      }

      if (field === "kw" || field === "keyword") {
        const kwNeedle = stripQuotes(val).trim().toLowerCase();
        const escaped = kwNeedle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const kwRegex = kwNeedle ? new RegExp(`(?:^|[\\n,])\\s*${escaped}\\b`, "i") : null;
        return (card) => {
          if (!kwNeedle) return true;
          const kws = (card.keywords || []).map((k) => k.toLowerCase());
          if (kws.some((k) => k === kwNeedle || k.includes(kwNeedle))) return true;
          const oraclesStr = (card.oracles || []).join("\n");
          return kwRegex ? kwRegex.test(oraclesStr) : false;
        };
      }

      if (field === "e" || field === "set" || field === "s") {
        const sNeedle = stripQuotes(val).trim().toLowerCase();
        return (card) => {
          const sc = (card.set_code || card.set || "").trim().toLowerCase();
          if (!sc) return false;
          return op === "=" ? sc === sNeedle : sc.includes(sNeedle);
        };
      }

      if (field === "r" || field === "rarity") {
        const rawR = stripQuotes(val).trim().toLowerCase();
        const rTarget = RARITY_ALIASES[rawR] || rawR;
        return (card) => (card.rarity || "").trim().toLowerCase() === rTarget;
      }

      if (field === "is") {
        return (card) => matchIsProperty(card, val);
      }

      if (field === "not") {
        return (card) => !matchIsProperty(card, val);
      }

      if (field === "role" || field === "function" || field === "otag") {
        const canonical = ROLE_ALIASES[stripQuotes(val).trim().toLowerCase()];
        return (card) => {
          if (!canonical) return false;
          return Array.isArray(card.roles) && card.roles.includes(canonical);
        };
      }

      if (field === "decks" || field === "freq" || field === "perc" || field === "sinergia") {
        return (card) => {
          const raw =
            field === "perc"
              ? card.Percentuale
              : field === "sinergia"
                ? card.Sinergia
                : card.freq ?? card.cnt ?? card.val1;
          return compareNumeric(raw, op, val);
        };
      }
    }
  }

  return (card) => matchText(getItemName(card), term);
}

export function compileScryfallQuery(query: string): CardPredicate {
  const q = (query || "").trim();
  if (!q) return () => true;

  const tokens = tokenizeScryfallQuery(q);
  if (tokens.length === 0) return () => true;

  let pos = 0;
  const peek = (): Token | undefined => tokens[pos];
  const consume = (): Token => tokens[pos++];

  function parseOr(): CardPredicate {
    let left = parseAnd();
    while (peek()?.kind === "OR") {
      consume();
      const right = parseAnd();
      const prev = left;
      left = (card) => prev(card) || right(card);
    }
    return left;
  }

  function parseAnd(): CardPredicate {
    const terms: CardPredicate[] = [];
    while (true) {
      const nxt = peek();
      if (!nxt || nxt.kind === "RPAREN" || nxt.kind === "OR") break;
      if (nxt.kind === "AND") {
        consume();
        continue;
      }
      terms.push(parseUnary());
    }
    if (terms.length === 0) return () => true;
    if (terms.length === 1) return terms[0];
    return (card) => terms.every((fn) => fn(card));
  }

  function parseUnary(): CardPredicate {
    const nxt = peek();
    if (!nxt) return () => true;

    if (nxt.kind === "LPAREN") {
      consume();
      const inner = parseOr();
      if (peek()?.kind === "RPAREN") consume();
      return inner;
    }

    if (nxt.kind === "TERM") {
      consume();
      const val = nxt.value;
      if (val === "-") {
        const sub = parseUnary();
        return (card) => !sub(card);
      }
      if (val.startsWith("-") && val.length > 1) {
        const inner = buildTermPredicate(val.slice(1));
        return (card) => !inner(card);
      }
      return buildTermPredicate(val);
    }

    consume();
    return () => true;
  }

  return parseOr();
}

export function hasScryfallSyntax(query: string): boolean {
  const q = (query || "").trim();
  if (!q) return false;
  if (/[()!"]/.test(q) || /\sOR\s|\sAND\s/i.test(q) || /(?:^|\s)-/.test(q)) {
    return true;
  }
  const tokens = tokenizeScryfallQuery(q);
  return tokens.some((t) => {
    if (t.kind !== "TERM") return false;
    const m = FIELD_OP_RE.exec(t.value.startsWith("-") ? t.value.slice(1) : t.value);
    return Boolean(m && KNOWN_FIELDS.has(m[1].toLowerCase()));
  });
}

export const SCRYFALL_HELP_EXAMPLES = [
  { query: "t:instant cmc<=2", desc: "Istantanei a costo ≤ 2" },
  { query: 'o:"draw a card" id<=ur', desc: "Peschini Izzet" },
  { query: "t:creature (c:b OR c:r) mv=1", desc: "Creature B o R a costo 1" },
  { query: "role:removal -c:w", desc: "Removal non bianchi" },
  { query: "kw:flash cmc<=3", desc: "Carte con Flash a costo ≤ 3" },
  { query: '!"Lightning Bolt"', desc: "Nome esatto della carta" },
];
