import { isBasicLand } from "./mtg";

export const NOTES_STORAGE_KEY = "centmeta_notes_v1";

export interface NoteCardItem {
  name: string;
  quantity: number;
  image?: string;
  category?: string;
  color_identity?: string[];
  cmc?: number;
}

export interface NotesState {
  commander: string | null;
  commanderImages?: string[];
  commanderColorIdentity?: string[];
  cards: NoteCardItem[];
  updatedAt: string;
}

export function createEmptyNotesState(): NotesState {
  return {
    commander: null,
    commanderImages: [],
    commanderColorIdentity: [],
    cards: [],
    updatedAt: "",
  };
}

export function normalizeCardKey(name?: string | null): string {
  return (name || "").trim().toLowerCase();
}

export function isPartnerCommanderName(name?: string | null): boolean {
  if (!name) return false;
  return name.includes(" / ") && !name.includes(" // ");
}

export function parseQuickAddLine(raw: string): { name: string; quantity: number } | null {
  const trimmed = (raw || "").trim();
  if (!trimmed) return null;
  const match = /^(\d+)\s*[xX]?\s+(.+)$/.exec(trimmed);
  if (match) {
    const qty = Math.max(1, Math.min(99, parseInt(match[1], 10)));
    const name = match[2].trim();
    if (!name) return null;
    return { name, quantity: isBasicLand(name) ? qty : 1 };
  }
  return { name: trimmed, quantity: 1 };
}

export function isOutsideCommanderIdentity(
  cardColorIdentity?: string[],
  commanderColorIdentity?: string[],
  hasCommander: boolean = false,
): boolean {
  if (!hasCommander || !commanderColorIdentity) {
    return false;
  }
  if (!cardColorIdentity || cardColorIdentity.length === 0) {
    return false;
  }
  const allowed = new Set(commanderColorIdentity.map((c) => c.toUpperCase()));
  return cardColorIdentity.some((c) => c && !allowed.has(c.toUpperCase()));
}

export function formatMoxfieldCommanderLines(commander?: string | null): string[] {
  if (!commander || !commander.trim()) return [];
  if (isPartnerCommanderName(commander)) {
    return commander
      .split(" / ")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `1 ${p}`);
  }
  return [`1 ${commander.trim()}`];
}

export function formatMoxfieldDecklist(
  notes: NotesState,
  includeCommander: boolean = false,
): string {
  const lines: string[] = [];

  if (includeCommander && notes.commander) {
    lines.push(...formatMoxfieldCommanderLines(notes.commander));
  }

  for (const card of notes.cards) {
    const cleanName = (card.name || "").trim();
    if (!cleanName) continue;
    const qty = isBasicLand(cleanName) ? Math.max(1, Math.min(99, card.quantity || 1)) : 1;
    lines.push(`${qty} ${cleanName}`);
  }

  return lines.join("\n");
}

export function loadNotesFromStorage(): NotesState {
  if (typeof window === "undefined") return createEmptyNotesState();
  try {
    const raw = window.localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return createEmptyNotesState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return createEmptyNotesState();

    const cards: NoteCardItem[] = Array.isArray(parsed.cards)
      ? parsed.cards
          .filter((c: any) => c && typeof c.name === "string" && c.name.trim().length > 0)
          .map((c: any) => ({
            name: c.name.trim(),
            quantity: isBasicLand(c.name)
              ? Math.max(1, Math.min(99, Number(c.quantity) || 1))
              : 1,
            image: typeof c.image === "string" ? c.image : undefined,
            category: typeof c.category === "string" ? c.category : undefined,
            color_identity: Array.isArray(c.color_identity) ? c.color_identity : undefined,
            cmc: typeof c.cmc === "number" ? c.cmc : undefined,
          }))
      : [];

    return {
      commander: typeof parsed.commander === "string" && parsed.commander.trim() ? parsed.commander.trim() : null,
      commanderImages: Array.isArray(parsed.commanderImages) ? parsed.commanderImages : [],
      commanderColorIdentity: Array.isArray(parsed.commanderColorIdentity) ? parsed.commanderColorIdentity : [],
      cards,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return createEmptyNotesState();
  }
}

export function saveNotesToStorage(state: NotesState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota o modalità privata: fallimento silenzioso senza bloccare la UI
  }
}
