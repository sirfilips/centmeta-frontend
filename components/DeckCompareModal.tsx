"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  X,
  GitCompareArrows,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowLeft,
  ClipboardPaste,
} from "lucide-react";
import {
  parseDecklistText,
  compareDeckWithMeta,
  ComparedMetaCard,
} from "../utils/decklistParser";
import { useDialogFocus } from "../utils/useDialogFocus";

interface DeckCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCommander: string;
  statsData: {
    total_decks: number;
    avg_lands?: number;
    type_distribution?: Record<string, number>;
    mana_curve?: Record<string, number>;
    cards: any[];
  };
  onSelectCard: (cardName: string) => void;
}

type CompareTab = "missing" | "shared" | "unique";

export default function DeckCompareModal({
  isOpen,
  onClose,
  selectedCommander,
  statsData,
  onSelectCard,
}: DeckCompareModalProps) {
  const [rawList, setRawList] = useState("");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [activeTab, setActiveTab] = useState<CompareTab>("missing");
  const [inputError, setInputError] = useState<string | null>(null);
  const dialogPanelRef = useRef<HTMLDivElement>(null);

  const parsed = useMemo(
    () => (hasAnalyzed ? parseDecklistText(rawList, selectedCommander) : null),
    [hasAnalyzed, rawList, selectedCommander]
  );

  const comparison = useMemo(
    () => (parsed ? compareDeckWithMeta(parsed, statsData) : null),
    [parsed, statsData]
  );

  useDialogFocus(isOpen, onClose, dialogPanelRef);

  if (!isOpen) return null;

  const handleAnalyze = () => {
    const check = parseDecklistText(rawList, selectedCommander);
    if (check.entries.length === 0) {
      setInputError(
        "Inserisci almeno una carta valida (es. '1 Lightning Bolt' o export da Moxfield)."
      );
      return;
    }
    setInputError(null);
    setHasAnalyzed(true);
    setActiveTab("missing");
  };

  const handleTabChange = (tab: CompareTab) => {
    setActiveTab(tab);
  };

  const handleCardClick = (cardName: string) => {
    onClose();
    onSelectCard(cardName);
  };

  const renderCardList = (items: ComparedMetaCard[], emptyMsg: string, mode: CompareTab) => {
    if (items.length === 0) {
      return (
        <div className="py-10 text-center text-slate-400 text-sm bg-slate-900/50 rounded-2xl border border-slate-800">
          {emptyMsg}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((card) => (
          <button
            key={`${mode}-${card.name}`}
            type="button"
            onClick={() => handleCardClick(card.name)}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {card.images?.[0] ? (
                <img
                  src={card.images[0]}
                  alt={card.name}
                  loading="lazy"
                  className="w-9 h-12 object-cover rounded-md border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-9 h-12 rounded-md bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                  MTG
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors truncate">
                  {card.quantity > 1 ? `${card.quantity}x ` : ""}
                  {card.name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {card.category || "Fuori dal campione meta"}
                  {card.synergy !== undefined && card.synergy > 0
                    ? ` • +${card.synergy}% sin.`
                    : ""}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-extrabold px-2.5 py-1 rounded-full shrink-0 border ${
                mode === "missing"
                  ? "bg-amber-950/50 text-amber-300 border-amber-700/40"
                  : mode === "shared"
                  ? "bg-emerald-950/50 text-emerald-300 border-emerald-700/40"
                  : "bg-purple-950/50 text-purple-300 border-purple-700/40"
              }`}
            >
              {card.inclusion_rate > 0 ? `${card.inclusion_rate}%` : "Tech"}
            </span>
          </button>
        ))}
      </div>
    );
  };

  const maxCurve = comparison
    ? Math.max(
        1,
        ...comparison.curveComparison.map((p) => Math.max(p.userCount, p.metaAvg))
      )
    : 1;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div
        ref={dialogPanelRef}
        tabIndex={-1}
        className="w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden focus:outline-none"
      >
        {/* Header fisso */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-slate-800 bg-slate-900/95 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <GitCompareArrows className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <h2
                id="compare-modal-title"
                className="text-base sm:text-lg font-extrabold text-white truncate"
              >
                Confronta la tua lista
              </h2>
              <p className="text-xs text-slate-400 truncate">
                vs Community ({statsData.total_decks} mazzi di {selectedCommander})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi confronto lista"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo scorrevole */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {!hasAnalyzed || !comparison ? (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <p className="font-semibold text-white mb-1 flex items-center gap-2">
                  <ClipboardPaste className="w-4 h-4 text-blue-400" />
                  Incolla la tua lista (Moxfield, MTGO, ManaBox o testo semplice)
                </p>
                <p className="text-slate-400 text-xs">
                  Il confronto avviene interamente nel tuo browser senza salvare alcun dato.
                  Eventuali sezioni <code className="text-blue-300">Sideboard</code> o{" "}
                  <code className="text-blue-300">Maybeboard</code> vengono ignorate automaticamente.
                </p>
              </div>

              <textarea
                value={rawList}
                onChange={(e) => {
                  setRawList(e.target.value);
                  if (inputError) setInputError(null);
                }}
                rows={11}
                placeholder={`1 Lightning Bolt\n1 Brainstorm\n1 Swords to Plowshares (CMM) 62\n1 Sink into Stupor // Soporific Springs\n...`}
                className="w-full rounded-2xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none p-4 text-xs sm:text-sm text-slate-100 font-mono placeholder:text-slate-600 resize-y"
              />

              {inputError && (
                <div className="text-xs sm:text-sm text-rose-300 bg-rose-950/40 border border-rose-700/40 rounded-xl px-4 py-2.5">
                  {inputError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-900/30 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Analizza contro il Meta
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Pulsante modifica lista */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setHasAnalyzed(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Modifica lista incollata
                </button>
                <span className="text-xs text-slate-400">
                  {comparison.totalNonCommanderCards} carte rilevate (escluso comandante)
                </span>
              </div>

              {/* KPI principali */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Affinità col Meta
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-blue-400">
                      {comparison.affinityPercent}%
                    </span>
                    <span className="text-xs text-slate-400">
                      ({comparison.staplesCovered}/{comparison.totalStaplesCount} staple)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Terre in Lista vs Media
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-emerald-400">
                      {comparison.userLands}
                    </span>
                    <span className="text-xs text-slate-400">
                      vs {comparison.metaAvgLands.toFixed(1)} media community
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Scelte Personali
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-purple-400">
                      {comparison.uniqueCards.length}
                    </span>
                    <span className="text-xs text-slate-400">
                      carte rare o fuori meta (&lt;10%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Curva di mana affiancata */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                    Confronto Curva di Mana
                  </h3>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
                      Tua lista
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block"></span>
                      Media Community
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2">
                  {comparison.curveComparison.map((pt) => {
                    const userH = Math.round((pt.userCount / maxCurve) * 100);
                    const metaH = Math.round((pt.metaAvg / maxCurve) * 100);
                    return (
                      <div key={pt.cmc} className="flex flex-col items-center gap-1 h-full justify-end">
                        <div className="w-full flex items-end justify-center gap-1 h-20">
                          <div
                            title={`Tua lista CMC ${pt.cmc}: ${pt.userCount}`}
                            className="w-2.5 sm:w-3.5 bg-blue-500 rounded-t-sm transition-all"
                            style={{ height: `${Math.max(4, userH)}%` }}
                          />
                          <div
                            title={`Media community CMC ${pt.cmc}: ${pt.metaAvg}`}
                            className="w-2.5 sm:w-3.5 bg-slate-600 rounded-t-sm transition-all"
                            style={{ height: `${Math.max(4, metaH)}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">
                          {pt.cmc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tabs risultati */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => handleTabChange("missing")}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    activeTab === "missing"
                      ? "bg-amber-600/20 text-amber-300 border border-amber-500/40"
                      : "bg-slate-800/70 text-slate-400 hover:text-white border border-transparent"
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Staple Mancanti ({comparison.missingStaples.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("shared")}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    activeTab === "shared"
                      ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800/70 text-slate-400 hover:text-white border border-transparent"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  In Comune ({comparison.sharedCards.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange("unique")}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                    activeTab === "unique"
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/40"
                      : "bg-slate-800/70 text-slate-400 hover:text-white border border-transparent"
                  }`}
                >
                  <Flame className="w-4 h-4" />
                  Scelte Uniche ({comparison.uniqueCards.length})
                </button>
              </div>

              {activeTab === "missing" &&
                renderCardList(
                  comparison.missingStaples,
                  "Complimenti! Hai già tutte le staple principali (>= 20% inclusione) di questo comandante.",
                  "missing"
                )}
              {activeTab === "shared" &&
                renderCardList(
                  comparison.sharedCards,
                  "Nessuna carta in comune rilevata con il campione attuale.",
                  "shared"
                )}
              {activeTab === "unique" &&
                renderCardList(
                  comparison.uniqueCards,
                  "La tua lista segue molto fedelmente le scelte della community: nessuna carta rara rilevata.",
                  "unique"
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
