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
  "id", "identity", "ci", "commander", "cmd",
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

const STAT_FIELD_MAP: Record<string, "power" | "toughness" | "loyalty"> = {
  pow: "power",
  power: "power",
  tou: "toughness",
  toughness: "toughness",
  loy: "loyalty",
  loyalty: "loyalty",
};

const VALID_COLORS = new Set(["W", "U", "B", "R", "G"]);

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
          ((buf.length === 0 || buf === "-") &&
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

const MAX_REGEX_LENGTH = 120;
const MAX_REGEX_QUANTIFIERS = 6;

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}

function isSafeRegexPattern(pattern: string): boolean {
  if (!pattern || pattern.length > MAX_REGEX_LENGTH) return false;
  if (/\\(?:[1-9]|k<)/.test(pattern)) return false;

  const groupStack: Array<{ hasQuantifier: boolean; hasAlternation: boolean }> = [
    { hasQuantifier: false, hasAlternation: false },
  ];
  let inCharClass = false;
  let totalRepeatQuantifiers = 0;

  let i = 0;
  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (inCharClass) {
      if (ch === "]") inCharClass = false;
      i++;
      continue;
    }
    if (ch === "[") {
      inCharClass = true;
      i++;
      continue;
    }
    if (ch === "(") {
      groupStack.push({ hasQuantifier: false, hasAlternation: false });
      i++;
      continue;
    }
    if (ch === ")") {
      if (groupStack.length <= 1) return false;
      const closed = groupStack.pop()!;
      const parent = groupStack[groupStack.length - 1];
      if (closed.hasQuantifier) parent.hasQuantifier = true;

      let nextIdx = i + 1;
      if (nextIdx < pattern.length && (pattern[nextIdx] === "+" || pattern[nextIdx] === "*" || pattern[nextIdx] === "{")) {
        if (closed.hasQuantifier || closed.hasAlternation) {
          return false;
        }
      }
      i++;
      continue;
    }
    if (ch === "|") {
      groupStack[groupStack.length - 1].hasAlternation = true;
      i++;
      continue;
    }

    if (ch === "+" || ch === "*") {
      const next = pattern[i + 1];
      if (next === "+" || next === "*") return false;
      totalRepeatQuantifiers++;
      if (totalRepeatQuantifiers > MAX_REGEX_QUANTIFIERS) return false;
      groupStack[groupStack.length - 1].hasQuantifier = true;
      i++;
      continue;
    }
    if (ch === "{") {
      const closeBrace = pattern.indexOf("}", i + 1);
      if (closeBrace !== -1 && /^\d+(?:,\d*)?$/.test(pattern.slice(i + 1, closeBrace))) {
        totalRepeatQuantifiers++;
        if (totalRepeatQuantifiers > MAX_REGEX_QUANTIFIERS) return false;
        groupStack[groupStack.length - 1].hasQuantifier = true;
        i = closeBrace + 1;
        continue;
      }
    }
    i++;
  }

  return !inCharClass && groupStack.length === 1;
}

function parseRegexLiteral(val: string): RegExp | null {
  if (val.length >= 2 && val.startsWith("/") && val.endsWith("/")) {
    const pattern = val.slice(1, -1);
    if (!isSafeRegexPattern(pattern)) {
      return null;
    }
    try {
      return new RegExp(pattern, "i");
    } catch {
      return null;
    }
  }
  return null;
}

function compileTextMatcher(rawVal: string, exact = false): (text: string) => boolean {
  if (rawVal.length >= 2 && rawVal.startsWith("/") && rawVal.endsWith("/")) {
    const regex = parseRegexLiteral(rawVal);
    return regex ? (text) => regex.test(text) : () => false;
  }
  const needle = stripQuotes(rawVal).trim().toLowerCase();
  if (!needle) return () => true;
  if (exact) return (text) => text.toLowerCase() === needle;
  return (text) => text.toLowerCase().includes(needle);
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
    const up = ch.toUpperCase();
    if (VALID_COLORS.has(up)) {
      letters.add(up);
    } else {
      return { numericCount: null, special: null, target: new Set() };
    }
  }
  return { numericCount: null, special: null, target: letters };
}

function compileNumericComparator(
  op: string,
  targetStr: string,
): (actual: number | null | undefined) => boolean {
  const t = stripQuotes(targetStr).trim().toLowerCase();
  if (t === "even" || t === "odd") {
    const wantOdd = t === "odd";
    const invert = op === "!=";
    return (actual) => {
      if (
        actual === null ||
        actual === undefined ||
        Number.isNaN(actual) ||
        !Number.isInteger(actual)
      ) {
        return false;
      }
      const isOdd = Math.abs(actual % 2) === 1;
      const matchesParity = wantOdd ? isOdd : !isOdd;
      return invert ? !matchesParity : matchesParity;
    };
  }
  const target = Number(t);
  if (t === "" || Number.isNaN(target)) return () => false;

  switch (op) {
    case ":":
    case "=":
      return (a) => a !== null && a !== undefined && a === target;
    case "!=":
      return (a) => a !== null && a !== undefined && a !== target;
    case "<":
      return (a) => a !== null && a !== undefined && a < target;
    case "<=":
      return (a) => a !== null && a !== undefined && a <= target;
    case ">":
      return (a) => a !== null && a !== undefined && a > target;
    case ">=":
      return (a) => a !== null && a !== undefined && a >= target;
    default:
      return () => false;
  }
}

function isSubset(a: Set<string>, b: Set<string>): boolean {
  return Array.from(a).every((item) => b.has(item));
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  return a.size === b.size && isSubset(a, b);
}

function normalizeColorList(actualList: string[] | undefined): Set<string> {
  const actual = new Set<string>();
  if (!actualList) return actual;
  for (const c of actualList) {
    const up = (c || "").toUpperCase();
    if (VALID_COLORS.has(up)) actual.add(up);
  }
  return actual;
}

function compileColorComparator(
  op: string,
  val: string,
  isIdentity: boolean,
): (actualList: string[] | undefined) => boolean {
  const { numericCount, special, target } = parseColorExpr(val);

  if (numericCount !== null) {
    const numCmp = compileNumericComparator(op, String(numericCount));
    return (actualList) => numCmp(normalizeColorList(actualList).size);
  }
  if (special === "c") {
    const wantNot = op === "!=";
    return (actualList) => {
      const isC = normalizeColorList(actualList).size === 0;
      return wantNot ? !isC : isC;
    };
  }
  if (special === "m") {
    const wantNot = op === "!=";
    return (actualList) => {
      const isM = normalizeColorList(actualList).size > 1;
      return wantNot ? !isM : isM;
    };
  }
  if (target.size === 0) return () => false;

  return (actualList) => {
    const actual = normalizeColorList(actualList);
    if (op === "=") return setsEqual(actual, target);
    if (op === "!=") return !setsEqual(actual, target);
    if (op === "<=") return isSubset(actual, target);
    if (op === "<") return isSubset(actual, target) && actual.size < target.size;
    if (op === ">=") return isSubset(target, actual);
    if (op === ">") return isSubset(target, actual) && actual.size > target.size;
    return isIdentity ? isSubset(actual, target) : isSubset(target, actual);
  };
}

function normalizeManaQuery(rawVal: string): string {
  const v = stripQuotes(rawVal).trim().toUpperCase();
  if (v.includes("{")) return v;
  const compact = v.replace(/\s+/g, "");
  if (!compact) return "";
  const tokens = compact.match(/\d+|[WUBRG]\/[WUBRG]\/P|[WUBRG2C]\/[WUBRGP]|[A-Z]/g);
  return tokens ? tokens.map((tok) => `{${tok}}`).join("") : "";
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
    return typeLine.includes("land") && /sacrifice [^:]+: search your library for/i.test(oracles);
  }
  if (p === "shockland") return typeLine.includes("land") && oracles.includes("you may pay 2 life");
  if (p === "dual") {
    const oraclesNoReminder = oracles.replace(/\([^)]*\)/g, "").trim();
    const basicTypeCount = ["plains", "island", "swamp", "mountain", "forest"].filter((bt) =>
      typeLine.includes(bt),
    ).length;
    return typeLine.includes("land") && !oraclesNoReminder && !typeLine.includes("basic") && basicTypeCount >= 2;
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
      const isNeg = op === "!=";

      if (field === "o" || field === "oracle" || field === "fo" || field === "fulloracle") {
        const baseMatcher = compileTextMatcher(val);
        const hasTilde = val.includes("~");
        const isRegex = val.length >= 2 && val.startsWith("/") && val.endsWith("/");
        const needleTemplate = isRegex ? "" : stripQuotes(val).trim().toLowerCase();
        return (card) => {
          const oraclesStr = (card.oracles || []).join("\n");
          let matched = false;
          if (oraclesStr) {
            if (baseMatcher(oraclesStr)) {
              matched = true;
            } else if (hasTilde) {
              const name = getItemName(card);
              if (name) {
                const candidates = Array.from(
                  new Set(
                    [name, ...name.split(" // ").map((p) => p.trim())].filter(Boolean),
                  ),
                );
                if (isRegex) {
                  matched = candidates.some((cand) =>
                    compileTextMatcher(val.replace(/~/g, escapeRegExp(cand)))(oraclesStr),
                  );
                } else if (needleTemplate) {
                  const oraclesLower = oraclesStr.toLowerCase();
                  matched = candidates.some((cand) =>
                    oraclesLower.includes(needleTemplate.replace(/~/g, cand.toLowerCase())),
                  );
                }
              }
            }
          }
          return isNeg ? !matched : matched;
        };
      }

      if (field === "t" || field === "type") {
        const typeMatcher = compileTextMatcher(val);
        return (card) => {
          const matched = typeMatcher(card.type || "");
          return isNeg ? !matched : matched;
        };
      }

      if (field === "n" || field === "name") {
        const nameMatcher = compileTextMatcher(val, op === "=");
        return (card) => {
          const matched = nameMatcher(getItemName(card));
          return isNeg ? !matched : matched;
        };
      }

      if (
        field === "id" ||
        field === "identity" ||
        field === "ci" ||
        field === "commander" ||
        field === "cmd"
      ) {
        const idCmp = compileColorComparator(op, val, true);
        return (card) => idCmp(card.color_identity);
      }

      if (field === "c" || field === "color" || field === "colors") {
        const colorCmp = compileColorComparator(op, val, false);
        return (card) => colorCmp(getEffectiveColors(card));
      }

      if (field === "mv" || field === "cmc" || field === "manavalue") {
        const cmcCmp = compileNumericComparator(op, val);
        return (card) => cmcCmp(card.cmc);
      }

      if (STAT_FIELD_MAP[field]) {
        const key = STAT_FIELD_MAP[field];
        const statCmp = compileNumericComparator(op, val);
        const valLower = stripQuotes(val).trim().toLowerCase();
        const supportsTextFallback = op === ":" || op === "=" || op === "!=";
        return (card) => {
          const raw = card[key];
          if (raw === null || raw === undefined || raw === "") return false;
          const num = Number(raw);
          if (!Number.isNaN(num)) return statCmp(num);
          if (!supportsTextFallback) return false;
          const eq = valLower === String(raw).trim().toLowerCase();
          return isNeg ? !eq : eq;
        };
      }

      if (field === "m" || field === "mana") {
        const normQ = normalizeManaQuery(val);
        if (!normQ) return () => false;
        return (card) => {
          const mc = (card.mana_cost || "").toUpperCase();
          const matched = !mc ? false : op === "=" ? mc === normQ : mc.includes(normQ);
          return isNeg ? !matched : matched;
        };
      }

      if (field === "kw" || field === "keyword") {
        const kwNeedle = stripQuotes(val).trim().toLowerCase();
        const escaped = kwNeedle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const kwRegex = kwNeedle ? new RegExp(`(?:^|[\\n,])\\s*${escaped}\\b`, "i") : null;
        return (card) => {
          let matched: boolean;
          if (!kwNeedle) {
            matched = true;
          } else {
            const kws = card.keywords || [];
            if (kws.some((k) => k.toLowerCase().includes(kwNeedle))) {
              matched = true;
            } else {
              matched = kwRegex ? kwRegex.test((card.oracles || []).join("\n")) : false;
            }
          }
          return isNeg ? !matched : matched;
        };
      }

      if (field === "e" || field === "set" || field === "s") {
        const sNeedle = stripQuotes(val).trim().toLowerCase();
        return (card) => {
          const sc = (card.set_code || card.set || "").trim().toLowerCase();
          const matched = !sc ? false : op === "=" ? sc === sNeedle : sc.includes(sNeedle);
          return isNeg ? !matched : matched;
        };
      }

      if (field === "r" || field === "rarity") {
        const rawR = stripQuotes(val).trim().toLowerCase();
        const rTarget = RARITY_ALIASES[rawR] || rawR;
        return (card) => {
          const matched = (card.rarity || "").trim().toLowerCase() === rTarget;
          return isNeg ? !matched : matched;
        };
      }

      if (field === "is" || field === "not") {
        const propClean = stripQuotes(val).trim().toLowerCase();
        const negate = (field === "not") !== isNeg;
        return negate ? (card) => !matchIsProperty(card, propClean) : (card) => matchIsProperty(card, propClean);
      }

      if (field === "role" || field === "function" || field === "otag") {
        const canonical = ROLE_ALIASES[stripQuotes(val).trim().toLowerCase()];
        return (card) => {
          if (!canonical) return false;
          const matched = Array.isArray(card.roles) && card.roles.includes(canonical);
          return isNeg ? !matched : matched;
        };
      }

      if (field === "decks" || field === "freq" || field === "perc" || field === "sinergia") {
        const metricCmp = compileNumericComparator(op, val);
        return (card) => {
          const raw =
            field === "perc"
              ? card.Percentuale
              : field === "sinergia"
                ? card.Sinergia
                : card.freq ?? card.cnt ?? card.val1;
          return metricCmp(raw);
        };
      }
    }
  }

  const plainMatcher = compileTextMatcher(term);
  return (card) => plainMatcher(getItemName(card));
}

export function compileScryfallQuery(query: string): CardPredicate {
  const q = (query || "").trim();
  if (!q) return () => true;

  const tokens = tokenizeScryfallQuery(q);
  if (tokens.length === 0) return () => true;

  let pos = 0;
  const peek = (): Token | undefined => tokens[pos];
  const consume = (): Token => tokens[pos++];

  function parseOr(): CardPredicate | null {
    while (peek()?.kind === "OR") {
      consume();
    }
    let left: CardPredicate | null = parseAnd();
    if (!left) return null;
    while (peek()?.kind === "OR") {
      consume();
      while (peek()?.kind === "OR") {
        consume();
      }
      const right = parseAnd();
      if (!right) break;
      const prev: CardPredicate = left;
      left = (card) => prev(card) || right(card);
    }
    return left;
  }

  function parseAnd(): CardPredicate | null {
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
    if (terms.length === 0) return null;
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
      return inner || (() => true);
    }

    if (nxt.kind === "TERM") {
      consume();
      const val = nxt.value;
      if (val === "-") {
        if (!peek() || peek()?.kind === "RPAREN" || peek()?.kind === "OR") {
          return () => true;
        }
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

  const rootBranches: CardPredicate[] = [];
  while (pos < tokens.length) {
    if (peek()?.kind === "RPAREN") {
      consume();
      continue;
    }
    const branch = parseOr();
    if (branch) rootBranches.push(branch);
  }
  if (rootBranches.length === 0) return () => true;
  if (rootBranches.length === 1) return rootBranches[0];
  return (card) => rootBranches.every((fn) => fn(card));
}

export function hasScryfallSyntax(query: string): boolean {
  const q = (query || "").trim();
  if (!q) return false;
  if (
    /[()!"]/.test(q) ||
    /\s(?:OR|AND)\s/.test(q) ||
    /(?:^|\s)-/.test(q) ||
    /(?:^|\s)-?\/[^/\s][^/]*\//.test(q)
  ) {
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
  { query: "commander:jund otag:removal", desc: "Removal giocabili in Jund" },
  { query: 'o:"draw a card" id<=ur', desc: "Peschini Izzet" },
  { query: "t:creature (c:b OR c:r) mv=1", desc: "Creature B o R a costo 1" },
  { query: "id:jund -is:fetchland -t:land", desc: "Magie giocabili in Jund" },
  { query: '!"Lightning Bolt"', desc: "Nome esatto della carta" },
];
