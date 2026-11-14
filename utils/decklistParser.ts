import { isBasicLand } from "./mtg";

export interface ParsedDeckEntry {
  name: string;
  normalizedKey: string;
  frontKey: string;
  quantity: number;
}

export interface ParsedDecklist {
  entries: ParsedDeckEntry[];
  totalQuantity: number;
  ignoredSectionsCount: number;
}

export interface ComparedMetaCard {
  name: string;
  quantity: number;
  inclusion_rate: number;
  category?: string;
  cmc?: number;
  synergy?: number;
  images?: string[];
  color_identity?: string[];
}

export interface CurveComparisonPoint {
  cmc: string;
  userCount: number;
  metaAvg: number;
}

export interface DeckComparisonResult {
  totalNonCommanderCards: number;
  matchedCardsCount: number;
  affinityPercent: number;
  staplesCovered: number;
  totalStaplesCount: number;
  userLands: number;
  metaAvgLands: number;
  missingStaples: ComparedMetaCard[];
  sharedCards: ComparedMetaCard[];
  uniqueCards: ComparedMetaCard[];
  curveComparison: CurveComparisonPoint[];
}

const SECTION_SKIP = new Set([
  "sideboard",
  "maybeboard",
  "considering",
  "tokens",
  "token",
]);

const SECTION_IGNORE_HEADER = new Set([
  "deck",
  "mainboard",
  "main",
  "commander",
  "companion",
  "about",
  "lands",
  "creatures",
  "instants",
  "sorceries",
  "artifacts",
  "enchantments",
  "planeswalkers",
]);

export function normalizeCardKey(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function getFrontFaceKey(name: string): string {
  const norm = normalizeCardKey(name);
  const idx = norm.indexOf(" // ");
  return idx !== -1 ? norm.slice(0, idx).trim() : norm;
}

function getCommanderKeySet(commanderName?: string): Set<string> {
  const keys = new Set<string>();
  if (!commanderName) return keys;
  const parts =
    commanderName.includes(" / ") && !commanderName.includes(" // ")
      ? commanderName.split(" / ")
      : [commanderName];
  for (const part of parts) {
    const k = normalizeCardKey(part);
    const fk = getFrontFaceKey(part);
    if (k) keys.add(k);
    if (fk) keys.add(fk);
  }
  return keys;
}

/**
 * Analizza una decklist testuale esportata da Moxfield, MTGO, Arena o ManaBox.
 */
export function parseDecklistText(
  rawText: string,
  commanderName?: string
): ParsedDecklist {
  const commanderKeys = getCommanderKeySet(commanderName);
  const map = new Map<string, ParsedDeckEntry>();
  let totalQuantity = 0;
  let ignoredSectionsCount = 0;
  let inSkippedSection = false;
  let inCommanderSection = false;

  const lines = rawText.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      inCommanderSection = false;
      continue;
    }

    if (line.startsWith("//") || line.startsWith("#")) {
      const headerWord = line.replace(/^[/#\s]+/, "").replace(/:$/, "").toLowerCase();
      if (SECTION_SKIP.has(headerWord)) {
        inSkippedSection = true;
        inCommanderSection = false;
      } else if (headerWord === "commander") {
        inCommanderSection = true;
        inSkippedSection = false;
      } else if (SECTION_IGNORE_HEADER.has(headerWord)) {
        inSkippedSection = false;
        inCommanderSection = false;
      }
      continue;
    }

    const cleanHeader = line.replace(/:$/, "").toLowerCase();
    if (SECTION_SKIP.has(cleanHeader)) {
      inSkippedSection = true;
      inCommanderSection = false;
      continue;
    }
    if (cleanHeader === "commander") {
      inCommanderSection = true;
      inSkippedSection = false;
      continue;
    }
    if (SECTION_IGNORE_HEADER.has(cleanHeader)) {
      inSkippedSection = false;
      inCommanderSection = false;
      continue;
    }

    if (inSkippedSection) {
      ignoredSectionsCount += 1;
      continue;
    }

    // Estrae quantita' opzionale all'inizio (es. "1 ", "1x ", "10X ")
    let qty = 1;
    let cardPart = line;
    const qtyMatch = line.match(/^(\d+)\s*[xX]?\s+(.+)$/);
    if (qtyMatch) {
      qty = Math.max(1, parseInt(qtyMatch[1], 10));
      cardPart = qtyMatch[2].trim();
    }

    // Rimuove suffissi tipo "(CMM) 412", "[MH2]", "*F*", "*CMDR*", tag "#Ramp"
    cardPart = cardPart
      .replace(/\s+#[^#]+$/g, "")
      .replace(/\s+\*(?:F|E|A|CMDR)\*\s*$/gi, "")
      .replace(/\s+\([A-Za-z0-9]{2,6}\)(?:\s+[A-Za-z0-9-]+)?(?:\s+\*[FE]\*)?\s*$/g, "")
      .replace(/\s+\[[A-Za-z0-9]{2,6}\](?:\s+[A-Za-z0-9-]+)?\s*$/g, "")
      .trim();

    if (!cardPart) continue;

    const normKey = normalizeCardKey(cardPart);
    const frontKey = getFrontFaceKey(cardPart);

    // Esclude il comandante sia se sotto sezione Commander sia se corrisponde al nome
    if (inCommanderSection || commanderKeys.has(normKey) || commanderKeys.has(frontKey)) {
      continue;
    }

    const existing = map.get(normKey);
    if (existing) {
      existing.quantity += qty;
    } else {
      map.set(normKey, {
        name: cardPart,
        normalizedKey: normKey,
        frontKey,
        quantity: qty,
      });
    }
    totalQuantity += qty;
  }

  return {
    entries: Array.from(map.values()),
    totalQuantity,
    ignoredSectionsCount,
  };
}

export function compareDeckWithMeta(
  parsed: ParsedDecklist,
  statsData: {
    total_decks: number;
    avg_lands?: number;
    mana_curve?: Record<string, number>;
    cards: any[];
  }
): DeckComparisonResult {
  const metaCards = statsData?.cards || [];
  const metaLookup = new Map<string, any>();

  for (const c of metaCards) {
    if (!c?.name) continue;
    const nk = normalizeCardKey(c.name);
    const fk = getFrontFaceKey(c.name);
    if (!metaLookup.has(nk)) metaLookup.set(nk, c);
    if (!metaLookup.has(fk)) metaLookup.set(fk, c);
  }

  const userKeySet = new Set<string>();
  for (const entry of parsed.entries) {
    userKeySet.add(entry.normalizedKey);
    userKeySet.add(entry.frontKey);
  }

  const sharedCards: ComparedMetaCard[] = [];
  const uniqueCards: ComparedMetaCard[] = [];
  const userCurve: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  let userLands = 0;
  let matchedCardsCount = 0;

  for (const entry of parsed.entries) {
    const metaMatch = metaLookup.get(entry.normalizedKey) || metaLookup.get(entry.frontKey);

    if (metaMatch) {
      matchedCardsCount += 1;
      const isLand =
        metaMatch.category === "Terre" || isBasicLand(metaMatch.name || entry.name);
      if (isLand) {
        userLands += entry.quantity;
      } else {
        const cmcVal = Math.min(6, Math.max(0, Math.round(Number(metaMatch.cmc || 0))));
        userCurve[cmcVal] = (userCurve[cmcVal] || 0) + entry.quantity;
      }

      const item: ComparedMetaCard = {
        name: metaMatch.name || entry.name,
        quantity: entry.quantity,
        inclusion_rate: Number(metaMatch.inclusion_rate || 0),
        category: metaMatch.category,
        cmc: metaMatch.cmc,
        synergy: metaMatch.synergy,
        images: metaMatch.images,
        color_identity: metaMatch.color_identity,
      };

      if (item.inclusion_rate >= 10 || isBasicLand(item.name)) {
        sharedCards.push(item);
      } else {
        uniqueCards.push(item);
      }
    } else {
      if (isBasicLand(entry.name)) {
        userLands += entry.quantity;
      }
      uniqueCards.push({
        name: entry.name,
        quantity: entry.quantity,
        inclusion_rate: 0,
      });
    }
  }

  const missingStaples: ComparedMetaCard[] = [];
  let totalStaplesCount = 0;
  let staplesCovered = 0;

  for (const c of metaCards) {
    if (!c?.name || isBasicLand(c.name)) continue;
    const rate = Number(c.inclusion_rate || 0);
    if (rate < 20) continue;

    totalStaplesCount += 1;
    const nk = normalizeCardKey(c.name);
    const fk = getFrontFaceKey(c.name);
    if (userKeySet.has(nk) || userKeySet.has(fk)) {
      staplesCovered += 1;
    } else {
      missingStaples.push({
        name: c.name,
        quantity: 1,
        inclusion_rate: rate,
        category: c.category,
        cmc: c.cmc,
        synergy: c.synergy,
        images: c.images,
        color_identity: c.color_identity,
      });
    }
  }

  missingStaples.sort((a, b) => b.inclusion_rate - a.inclusion_rate);
  sharedCards.sort((a, b) => b.inclusion_rate - a.inclusion_rate);
  uniqueCards.sort((a, b) => a.inclusion_rate - b.inclusion_rate);

  const affinityPercent =
    totalStaplesCount > 0
      ? Math.round((staplesCovered / totalStaplesCount) * 100)
      : parsed.entries.length > 0
      ? Math.round((matchedCardsCount / parsed.entries.length) * 100)
      : 0;

  const metaCurve = statsData?.mana_curve || {};
  const curveComparison: CurveComparisonPoint[] = [0, 1, 2, 3, 4, 5, 6].map((cmc) => ({
    cmc: cmc === 6 ? "6+" : String(cmc),
    userCount: userCurve[cmc] || 0,
    metaAvg: Number(metaCurve[cmc] ?? metaCurve[String(cmc)] ?? 0),
  }));

  return {
    totalNonCommanderCards: parsed.totalQuantity,
    matchedCardsCount,
    affinityPercent,
    staplesCovered,
    totalStaplesCount,
    userLands,
    metaAvgLands: Number(statsData?.avg_lands || 0),
    missingStaples,
    sharedCards,
    uniqueCards,
    curveComparison,
  };
}
