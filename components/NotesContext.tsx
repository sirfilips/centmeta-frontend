"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  NOTES_STORAGE_KEY,
  NoteCardItem,
  NotesState,
  createEmptyNotesState,
  loadNotesFromStorage,
  saveNotesToStorage,
  normalizeCardKey,
} from "../utils/notesStorage";
import { isBasicLand } from "../utils/mtg";

export type AddCardInput = Omit<NoteCardItem, "quantity"> & { quantity?: number };

export interface NotesDataContextValue {
  notes: NotesState;
  isHydrated: boolean;
  hasCard: (name: string) => boolean;
  addCard: (card: AddCardInput) => void;
  removeCard: (name: string) => void;
  toggleCard: (card: AddCardInput) => void;
  updateQuantity: (name: string, delta: number) => void;
  setCommander: (
    name: string | null,
    images?: string[],
    colorIdentity?: string[],
  ) => void;
  clearNotes: () => void;
  mainboardCount: number;
}

export interface NotesUIContextValue {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  toastMessage: string | null;
}

type NotesContextValue = NotesDataContextValue & NotesUIContextValue;

const NotesDataContext = createContext<NotesDataContextValue | null>(null);
const NotesUIContext = createContext<NotesUIContextValue | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<NotesState>(createEmptyNotesState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipNextPersistRef = useRef(true);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  useEffect(() => {
    skipNextPersistRef.current = true;
    setNotes(loadNotesFromStorage());
    setIsHydrated(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === NOTES_STORAGE_KEY) {
        skipNextPersistRef.current = true;
        setNotes(loadNotesFromStorage());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (skipNextPersistRef.current) {
      skipNextPersistRef.current = false;
      return;
    }
    saveNotesToStorage(notes);
  }, [notes, isHydrated]);

  const persistUpdate = useCallback((updater: (prev: NotesState) => NotesState) => {
    setNotes(updater);
  }, []);

  const cardKeysSet = useMemo(() => {
    const s = new Set<string>();
    for (const c of notes.cards) {
      s.add(normalizeCardKey(c.name));
    }
    return s;
  }, [notes.cards]);

  const hasCard = useCallback(
    (name: string) => cardKeysSet.has(normalizeCardKey(name)),
    [cardKeysSet],
  );

  const addCard = useCallback(
    (card: AddCardInput) => {
      const cleanName = (card.name || "").trim();
      if (!cleanName) return;
      const key = normalizeCardKey(cleanName);
      const isBasic = isBasicLand(cleanName);
      const addQty = Math.max(1, card.quantity || 1);
      const alreadyExists = cardKeysSet.has(key);

      persistUpdate((prev) => {
        const idx = prev.cards.findIndex((c) => normalizeCardKey(c.name) === key);
        const nowIso = new Date().toISOString();
        if (idx >= 0) {
          const existing = prev.cards[idx];
          const updatedCards = [...prev.cards];
          updatedCards[idx] = {
            ...existing,
            image: existing.image || card.image,
            category: existing.category || card.category,
            color_identity: existing.color_identity?.length
              ? existing.color_identity
              : card.color_identity,
            cmc: existing.cmc ?? card.cmc,
            quantity: isBasic
              ? Math.min(99, (existing.quantity || 1) + addQty)
              : 1,
          };
          return { ...prev, cards: updatedCards, updatedAt: nowIso };
        }
        return {
          ...prev,
          cards: [
            ...prev.cards,
            {
              name: cleanName,
              quantity: isBasic ? Math.min(99, addQty) : 1,
              image: card.image,
              category: card.category,
              color_identity: card.color_identity,
              cmc: card.cmc,
            },
          ],
          updatedAt: nowIso,
        };
      });

      showToast(
        !alreadyExists || isBasic
          ? `"${cleanName}" aggiunta agli appunti`
          : `"${cleanName}" è già negli appunti`,
      );
    },
    [cardKeysSet, persistUpdate, showToast],
  );

  const removeCard = useCallback(
    (name: string) => {
      const key = normalizeCardKey(name);
      persistUpdate((prev) => ({
        ...prev,
        cards: prev.cards.filter((c) => normalizeCardKey(c.name) !== key),
        updatedAt: new Date().toISOString(),
      }));
    },
    [persistUpdate],
  );

  const toggleCard = useCallback(
    (card: AddCardInput) => {
      const cleanName = (card.name || "").trim();
      if (!cleanName) return;
      const key = normalizeCardKey(cleanName);

      if (cardKeysSet.has(key)) {
        removeCard(cleanName);
        showToast(`"${cleanName}" rimossa dagli appunti`);
      } else {
        addCard(card);
      }
    },
    [cardKeysSet, removeCard, addCard, showToast],
  );

  const updateQuantity = useCallback(
    (name: string, delta: number) => {
      const key = normalizeCardKey(name);
      persistUpdate((prev) => {
        const nextCards = prev.cards
          .map((c) => {
            if (normalizeCardKey(c.name) !== key) return c;
            if (!isBasicLand(c.name) && delta > 0) return c;
            const nextQty = (c.quantity || 1) + delta;
            if (nextQty <= 0) return null;
            return { ...c, quantity: Math.min(99, nextQty) };
          })
          .filter(Boolean) as NoteCardItem[];
        return { ...prev, cards: nextCards, updatedAt: new Date().toISOString() };
      });
    },
    [persistUpdate],
  );

  const setCommander = useCallback(
    (name: string | null, images?: string[], colorIdentity?: string[]) => {
      const clean = name && name.trim() ? name.trim() : null;
      persistUpdate((prev) => ({
        ...prev,
        commander: clean,
        commanderImages: clean ? images || [] : [],
        commanderColorIdentity: clean ? colorIdentity || [] : [],
        updatedAt: new Date().toISOString(),
      }));
      if (clean) {
        showToast(`Comandante appunti: ${clean}`);
      } else {
        showToast("Comandante rimosso dagli appunti");
      }
    },
    [persistUpdate, showToast],
  );

  const clearNotes = useCallback(() => {
    persistUpdate(() => ({
      ...createEmptyNotesState(),
      updatedAt: new Date().toISOString(),
    }));
    showToast("Appunti svuotati");
  }, [persistUpdate, showToast]);

  const mainboardCount = useMemo(
    () => notes.cards.reduce((sum, c) => sum + (c.quantity || 1), 0),
    [notes.cards],
  );

  const dataValue = useMemo<NotesDataContextValue>(
    () => ({
      notes,
      isHydrated,
      hasCard,
      addCard,
      removeCard,
      toggleCard,
      updateQuantity,
      setCommander,
      clearNotes,
      mainboardCount,
    }),
    [
      notes,
      isHydrated,
      hasCard,
      addCard,
      removeCard,
      toggleCard,
      updateQuantity,
      setCommander,
      clearNotes,
      mainboardCount,
    ],
  );

  const uiValue = useMemo<NotesUIContextValue>(
    () => ({
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      toastMessage,
    }),
    [isDrawerOpen, openDrawer, closeDrawer, toggleDrawer, toastMessage],
  );

  return (
    <NotesDataContext.Provider value={dataValue}>
      <NotesUIContext.Provider value={uiValue}>{children}</NotesUIContext.Provider>
    </NotesDataContext.Provider>
  );
}

export function useNotesData(): NotesDataContextValue {
  const ctx = useContext(NotesDataContext);
  if (!ctx) {
    throw new Error("useNotesData deve essere usato dentro NotesProvider");
  }
  return ctx;
}

export function useNotesUI(): NotesUIContextValue {
  const ctx = useContext(NotesUIContext);
  if (!ctx) {
    throw new Error("useNotesUI deve essere usato dentro NotesProvider");
  }
  return ctx;
}

export function useNotes(): NotesContextValue {
  const data = useNotesData();
  const ui = useNotesUI();
  return useMemo(() => ({ ...data, ...ui }), [data, ui]);
}
