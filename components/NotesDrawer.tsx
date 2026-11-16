"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  X,
  Trash2,
  Copy,
  Check,
  Download,
  Plus,
  Minus,
  AlertTriangle,
  Crown,
} from "lucide-react";
import { useNotes } from "./NotesContext";
import {
  formatMoxfieldCommanderLines,
  formatMoxfieldDecklist,
  isOutsideCommanderIdentity,
  parseQuickAddLine,
} from "../utils/notesStorage";
import { isBasicLand } from "../utils/mtg";
import { copyTextToClipboard } from "../utils/share";
import { handleCardDragStart } from "../utils/dragCard";
import { trackEvent } from "../utils/analytics";

export default function NotesDrawer() {
  const {
    notes,
    isHydrated,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    addCard,
    removeCard,
    updateQuantity,
    setCommander,
    clearNotes,
    mainboardCount,
    toastMessage,
  } = useNotes();

  const pathname = usePathname() || "/";
  const [quickInput, setQuickInput] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [includeCommander, setIncludeCommander] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [copiedCommander, setCopiedCommander] = useState(false);
  const [isDragOverTrigger, setIsDragOverTrigger] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) {
      setConfirmClear(false);
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const hasAnything = notes.cards.length > 0 || Boolean(notes.commander);

  const offColorCardsCount = useMemo(() => {
    if (!notes.commander) return 0;
    return notes.cards.filter((c) =>
      isOutsideCommanderIdentity(
        c.color_identity,
        notes.commanderColorIdentity,
        Boolean(notes.commander),
      ),
    ).length;
  }, [notes.cards, notes.commander, notes.commanderColorIdentity]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseQuickAddLine(quickInput);
    if (!parsed) return;
    addCard({ name: parsed.name, quantity: parsed.quantity });
    setQuickInput("");
  };

  const handleCopyList = async () => {
    const text = formatMoxfieldDecklist(notes, includeCommander);
    if (!text) return;
    const ok = await copyTextToClipboard(text);
    trackEvent("Appunti - Copia Lista", { cards: mainboardCount });
    if (ok) {
      setExportFeedback(
        "Lista copiata! Incollala direttamente su Moxfield (Import / Bulk Edit).",
      );
      setTimeout(() => setExportFeedback(null), 5000);
    }
  };

  const handleCopyCommander = async () => {
    if (!notes.commander) return;
    const cmdText = formatMoxfieldCommanderLines(notes.commander)
      .map((l) => l.replace(/^1\s+/, ""))
      .join("\n");
    const ok = await copyTextToClipboard(cmdText);
    if (ok) {
      setCopiedCommander(true);
      setTimeout(() => setCopiedCommander(false), 2000);
    }
  };

  const handleDownloadTxt = () => {
    const text = formatMoxfieldDecklist(notes, includeCommander);
    if (!text) return;
    trackEvent("Appunti - Scarica TXT", { cards: mainboardCount });
    const blob = new Blob([text + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "centmeta-appunti.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDropOnTrigger = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverTrigger(false);
    const cardName =
      e.dataTransfer.getData("application/x-scryfall-card") ||
      e.dataTransfer.getData("text/plain");
    const trimmed = (cardName || "").trim();
    if (
      trimmed &&
      trimmed.length <= 150 &&
      !trimmed.startsWith("http://") &&
      !trimmed.startsWith("https://")
    ) {
      addCard({ name: trimmed });
    }
  };

  const handleOpenCardFromNotes = (e: React.MouseEvent, cardName: string) => {
    closeDrawer();
    if (
      (pathname === "/" || pathname.startsWith("/commander/")) &&
      e.button === 0 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey
    ) {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent("centmeta:select-card", { detail: cardName }),
      );
    }
  };

  return (
    <>
      {/* Toast discreto sopra il pulsante flottante */}
      {isHydrated && toastMessage && !isDrawerOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-[95] bg-slate-900/95 border border-slate-700 text-slate-100 text-xs font-semibold px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in pointer-events-none max-w-[calc(100vw-2rem)] truncate">
          {toastMessage}
        </div>
      )}

      {/* Pulsante flottante Appunti (lato sinistro, non interferisce con ScrollToTop a destra) */}
      <button
        type="button"
        onClick={openDrawer}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOverTrigger(true);
        }}
        onDragLeave={() => setIsDragOverTrigger(false)}
        onDrop={handleDropOnTrigger}
        aria-label="Apri Appunti"
        title="Appunti mazzo (clicca o trascina qui una carta)"
        className={`fixed bottom-5 left-4 sm:left-6 z-[90] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-full shadow-2xl border transition-all duration-200 backdrop-blur-md ${
          isDragOverTrigger
            ? "bg-blue-600 text-white border-blue-300 scale-110 ring-4 ring-blue-500/30"
            : mainboardCount > 0 || notes.commander
              ? "bg-slate-900/95 hover:bg-slate-800 text-white border-blue-500/50 hover:border-blue-400"
              : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700"
        }`}
      >
        <ClipboardList className="w-4 h-4 text-blue-400 shrink-0" strokeWidth={2.3} />
        <span className="text-xs sm:text-sm font-bold">Appunti</span>
        {isHydrated && (mainboardCount > 0 || notes.commander) && (
          <span className="bg-blue-600 text-white text-[11px] font-black px-2 py-0.5 rounded-full tabular-nums">
            {mainboardCount}
          </span>
        )}
      </button>

      {/* Drawer Laterale */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[130] flex justify-end bg-slate-950/75 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="notes-drawer-title"
          onClick={closeDrawer}
        >
          <div
            className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Drawer */}
            <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b border-slate-800 bg-slate-950/70 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-4 h-4 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h2
                    id="notes-drawer-title"
                    className="text-base font-extrabold text-white truncate"
                  >
                    Appunti Mazzo
                  </h2>
                  <p className="text-xs text-slate-400 tabular-nums">
                    {mainboardCount} {mainboardCount === 1 ? "carta" : "carte"}
                    {notes.commander ? " + Comandante" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {hasAnything && !confirmClear && (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-xs font-bold text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Svuota
                  </button>
                )}
                {confirmClear && (
                  <div className="flex items-center gap-1 bg-rose-950/60 border border-rose-700/50 rounded-lg px-2 py-1 text-[11px]">
                    <span className="text-rose-200 font-semibold">Sicuro?</span>
                    <button
                      type="button"
                      onClick={() => {
                        clearNotes();
                        setConfirmClear(false);
                      }}
                      className="text-rose-300 hover:text-white font-bold px-1.5"
                    >
                      Sì
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="text-slate-400 hover:text-white px-1"
                    >
                      No
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Chiudi Appunti"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slot Comandante (opzionale) + Aggiunta Rapida */}
            <div className="p-4 border-b border-slate-800/80 space-y-3 bg-slate-900/60 shrink-0">
              {notes.commander && (
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                        Comandante
                      </div>
                      <div className="text-xs font-bold text-white truncate" title={notes.commander}>
                        {notes.commander}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyCommander}
                      title="Copia nome comandante"
                      className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-[11px] font-bold text-slate-200 border border-slate-700 flex items-center gap-1"
                    >
                      {copiedCommander ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copiato</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-blue-400" />
                          <span>Copia</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCommander(null)}
                      title="Rimuovi comandante"
                      className="p-1 text-slate-400 hover:text-rose-400 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {offColorCardsCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {offColorCardsCount}{" "}
                    {offColorCardsCount === 1 ? "carta fuori" : "carte fuori"} identità colore del comandante.
                  </span>
                </div>
              )}

              <form onSubmit={handleQuickAdd} className="flex items-center gap-2">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="Aggiungi carta (es. Lightning Bolt o 6 Island)..."
                  className="flex-1 min-w-0 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!quickInput.trim()}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold flex items-center gap-1 shrink-0 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Aggiungi</span>
                </button>
              </form>
            </div>

            {/* Lista Carte */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {notes.cards.length === 0 ? (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center px-4 text-slate-400">
                  <ClipboardList className="w-10 h-10 text-slate-600 mb-3" />
                  <p className="text-sm font-bold text-slate-300">
                    Nessuna carta negli appunti
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                    Clicca su <strong className="text-slate-300">+</strong> su qualsiasi carta del sito (o trascinala sul pulsante Appunti) per costruire la tua lista da esportare su Moxfield.
                  </p>
                </div>
              ) : (
                notes.cards.map((card) => {
                  const isBasic = isBasicLand(card.name);
                  const offColor = isOutsideCommanderIdentity(
                    card.color_identity,
                    notes.commanderColorIdentity,
                    Boolean(notes.commander),
                  );
                  return (
                    <div
                      key={card.name}
                      draggable={true}
                      onDragStart={(e) => handleCardDragStart(e, card.name, card.image)}
                      className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/70 border border-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {card.image ? (
                          <img
                            src={card.image}
                            alt={card.name}
                            loading="lazy"
                            className="w-8 h-11 object-cover rounded border border-slate-700 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-11 rounded bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center text-[9px] font-bold text-slate-500">
                            MTG
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/?card=${encodeURIComponent(card.name)}`}
                            onClick={(e) => handleOpenCardFromNotes(e, card.name)}
                            className="text-xs sm:text-sm font-bold text-slate-100 hover:text-blue-400 truncate block transition-colors"
                            title={card.name}
                          >
                            {card.name}
                          </Link>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {card.category && (
                              <span className="text-[10px] text-slate-400">
                                {card.category}
                              </span>
                            )}
                            {offColor && (
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-700/40 px-1.5 py-0.2 rounded">
                                Fuori identità
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isBasic ? (
                          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg">
                            <button
                              type="button"
                              onClick={() => updateQuantity(card.name, -1)}
                              aria-label={`Riduci quantità ${card.name}`}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold text-slate-200 px-1.5 tabular-nums">
                              {card.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(card.name, 1)}
                              aria-label={`Aumenta quantità ${card.name}`}
                              className="p-1 text-slate-400 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono font-bold text-slate-400 px-1.5">
                            1x
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => removeCard(card.name)}
                          aria-label={`Rimuovi ${card.name}`}
                          title="Rimuovi"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Export Moxfield */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2.5 shrink-0">
              {notes.commander && (
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeCommander}
                    onChange={(e) => setIncludeCommander(e.target.checked)}
                    className="rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Includi il comandante nel testo esportato</span>
                </label>
              )}

              {exportFeedback && (
                <div className="text-xs text-emerald-200 bg-emerald-950/60 border border-emerald-700/50 rounded-xl px-3 py-2 leading-relaxed">
                  {exportFeedback}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={notes.cards.length === 0 && !(includeCommander && notes.commander)}
                  onClick={handleCopyList}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-950/40 flex items-center justify-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copia lista</span>
                </button>
                <button
                  type="button"
                  disabled={notes.cards.length === 0 && !(includeCommander && notes.commander)}
                  onClick={handleDownloadTxt}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Scarica .txt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
