"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { handleNav } from "../utils/navigation";
import { handleCardDragStart } from "../utils/dragCard";
import { getPeriodParam } from "../utils/mtg";
import { ChevronLeft, ChevronRight, HelpCircle, Sparkles, Layers } from "lucide-react";

export interface ExpansionCardItem {
  name: string;
  images: string[];
  val1: number;
  trend: number | "" | null;
  delta?: number | null;
  category?: string;
  color_identity?: string[];
  set_code?: string | null;
}

export interface ExpansionData {
  code: string;
  codes?: string[];
  name: string;
  released_at: string;
  icon_svg_uri: string;
  total_played_cards?: number;
  cards: ExpansionCardItem[];
}

export function buildDisplayExpansions(expansions: ExpansionData[]): ExpansionData[] {
  if (!expansions || expansions.length === 0) return [];
  const hasAll = expansions.some((e) => e.code === "ALL");
  if (hasAll || expansions.length <= 1) return expansions;

  const mergedMap = new Map<string, ExpansionCardItem>();
  for (const exp of expansions) {
    for (const card of exp.cards || []) {
      if (!mergedMap.has(card.name)) {
        mergedMap.set(card.name, {
          ...card,
          set_code: card.set_code || exp.code,
        });
      }
    }
  }
  const mergedCards = Array.from(mergedMap.values())
    .sort((a, b) => b.val1 - a.val1 || a.name.localeCompare(b.name))
    .slice(0, 250);

  return [
    ...expansions,
    {
      code: "ALL",
      codes: expansions.map((e) => e.code),
      name: "Tutte le ultime espansioni",
      released_at: "",
      icon_svg_uri: "",
      cards: mergedCards,
    },
  ];
}

interface ExpansionsCarouselProps {
  expansions: ExpansionData[];
  onItemClick: (cardName: string) => void;
  onViewAll: (expansionCode: string) => void;
  filtroTempo: string;
}

export default function ExpansionsCarousel({
  expansions,
  onItemClick,
  onViewAll,
  filtroTempo,
}: ExpansionsCarouselProps) {
  // Di default 0 = l'ultima espansione uscita
  const [selectedIdx, setSelectedIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const periodParam = getPeriodParam(filtroTempo);

  const displayExpansions = useMemo(
    () => buildDisplayExpansions(expansions),
    [expansions],
  );

  useEffect(() => {
    if (selectedIdx >= displayExpansions.length) {
      setSelectedIdx(0);
    }
  }, [displayExpansions, selectedIdx]);

  if (displayExpansions.length === 0) return null;

  const activeExp = displayExpansions[selectedIdx] || displayExpansions[0];
  const isAllSelected = activeExp?.code === "ALL";
  const items = (activeExp?.cards || []).slice(0, 25);
  const viewAllHref = `/?view=cards&tab=Top+Cards&cardsort=expansions&exp=${encodeURIComponent(activeExp.code)}${periodParam}`;

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleSelectExpansion = (idx: number) => {
    setSelectedIdx(idx);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 md:mb-10">
      {/* Header + Selettore Espansioni */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3 md:mb-4">
        <div className="flex items-center">
          <a
            href={viewAllHref}
            onClick={(e) => handleNav(e, () => onViewAll(activeExp.code))}
            className="text-lg md:text-xl font-black text-slate-100 flex items-center gap-2 cursor-pointer hover:text-purple-400 transition"
          >
            <span className="w-1.5 h-6 rounded-full bg-purple-500"></span>
            <span>Top Carte Ultime Espansioni</span>
            <span className="text-slate-500 hover:text-purple-400 ml-1">➔</span>
          </a>
          {/* Tooltip Didattico */}
          <div className="group/info relative inline-flex items-center justify-center cursor-help ml-3">
            <HelpCircle
              className="w-4 h-4 text-slate-500 hover:text-purple-400 transition-colors"
              strokeWidth={2.5}
            />
            <div className="absolute bottom-full mb-2 right-0 sm:right-auto sm:left-0 hidden group-hover/info:block w-60 sm:w-72 p-3 bg-slate-800 text-xs text-slate-200 rounded-xl shadow-xl border border-slate-700 z-50 pointer-events-none normal-case font-normal text-left leading-relaxed">
              <span>
                <strong className="text-purple-400">Nuove Uscite:</strong>{" "}
                Mostra le nuove carte (escluse le ristampe) più giocate nel
                periodo selezionato appartenenti alle ultime 3 espansioni
                principali e relativi set Commander, singolarmente o raggruppate.
                Clicca sul titolo per aprire la pagina completa con tutti i filtri.
              </span>
            </div>
          </div>
        </div>

        {/* Tabs per le 3 espansioni + Tutte le ultime espansioni */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {displayExpansions.map((exp, idx) => {
            const isSelected = idx === selectedIdx;
            const isAllTab = exp.code === "ALL";
            return (
              <button
                key={exp.code}
                type="button"
                onClick={() => handleSelectExpansion(idx)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? "bg-purple-600/20 text-white border-purple-500/60 shadow-md shadow-purple-950/40"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                {isAllTab ? (
                  <Layers
                    className={`w-4 h-4 shrink-0 ${
                      isSelected ? "text-purple-400" : "text-slate-400"
                    }`}
                  />
                ) : exp.icon_svg_uri ? (
                  <img
                    src={exp.icon_svg_uri}
                    alt={exp.code}
                    className={`w-4 h-4 object-contain invert brightness-200 transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-60"
                    }`}
                  />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                )}
                <span>{exp.name}</span>
                {!isAllTab && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${
                      isSelected
                        ? "bg-purple-500/30 text-purple-200"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {exp.code}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carosello Carte */}
      {items.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl py-10 px-4 text-center text-slate-400 text-sm">
          Nessuna nuova carta di{" "}
          <strong className="text-slate-200">{activeExp?.name}</strong>{" "}
          registrata nei mazzi di questo periodo temporale.
        </div>
      ) : (
        <div className="relative group/carousel">
          <button
            onClick={() => scroll(-500)}
            className="absolute left-0 top-[148px] -translate-y-1/2 -ml-6 z-20 bg-slate-900 border border-slate-700 text-slate-300 w-12 h-12 rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition shadow-xl opacity-0 md:group-hover/carousel:opacity-100 pointer-events-none md:group-hover/carousel:pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => scroll(500)}
            className="absolute right-0 top-[148px] -translate-y-1/2 -mr-6 z-20 bg-slate-900 border border-slate-700 text-slate-300 w-12 h-12 rounded-full flex items-center justify-center hover:bg-purple-600 hover:text-white transition shadow-xl opacity-0 md:group-hover/carousel:opacity-100 pointer-events-none md:group-hover/carousel:pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x pt-5 pb-4 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {items.map((item, idx) => {
              const itemHref = `/?card=${encodeURIComponent(item.name)}${periodParam}`;
              return (
                <a
                  key={`${activeExp.code}-${item.name}-${idx}`}
                  href={itemHref}
                  onClick={(e) => handleNav(e, () => onItemClick(item.name))}
                  draggable={true}
                  onDragStart={(e) =>
                    handleCardDragStart(e, item.name, item.images?.[0])
                  }
                  className="snap-start flex-shrink-0 w-48 flex flex-col items-center cursor-pointer group/card"
                >
                  <div className="relative w-full h-64 flex justify-center items-center mb-3">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(e, item.name, item.images[0])
                        }
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full rounded-xl shadow-lg group-hover/card:-translate-y-3 group-hover/card:shadow-purple-900/50 transition-all duration-300 object-contain"
                        alt={item.name}
                      />
                    ) : (
                      <div className="text-xs text-slate-500 w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 px-2 text-center">
                        {item.name}
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full px-1">
                    <div className="font-bold text-xs text-slate-200 truncate flex items-center justify-center gap-1.5">
                      <span className="bg-purple-600/20 text-purple-400 px-1.5 rounded text-[10px] font-black">
                        #{idx + 1}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      {isAllSelected && item.set_code && (
                        <span className="text-[9px] bg-slate-800 text-slate-300 border border-slate-700/70 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                          {item.set_code}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.val1} mazzi
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
