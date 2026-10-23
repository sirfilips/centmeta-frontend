"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  ArrowLeft,
  X,
  Sparkles,
  ChevronRight,
  Crown,
  Layers,
} from "lucide-react";
import { handleNav } from "../utils/navigation";
import { CATEGORY_INFO } from "../utils/mtg";

interface HeroSectionProps {
  homeMode: "dashboard" | "commanders" | "cards";
  setHomeMode: (mode: "dashboard" | "commanders" | "cards") => void;
  commanderSearch: string;
  setCommanderSearch: (val: string) => void;
  dashboardLoading: boolean;
  dashboardData: any;
  handleResetHome: () => void;
  commanderSort: "top" | "hot";
  setCommanderSort: (val: "top" | "hot") => void;
  commanders?: any[];
  cards?: any[];
  onSelectCommander?: (name: string) => void;
  onSelectCard?: (name: string) => void;
  setCardSearch?: (val: string) => void;
  setActiveTab?: (val: string) => void;
}

const BACKGROUND_IMAGES = [
  "bg-1.webp",
  "bg-2.webp",
  "bg-3.webp",
  "bg-4.webp",
  "bg-5.webp",
  "bg-6.webp",
  "bg-7.webp",
  "bg-8.webp",
  "bg-9.webp",
  "bg-10.webp",
];

const CAROUSEL_INTERVAL = 7000;

const COLOR_MAP: Record<string, string> = {
  W: "ms ms-w ms-cost",
  U: "ms ms-u ms-cost",
  B: "ms ms-b ms-cost",
  R: "ms ms-r ms-cost",
  G: "ms ms-g ms-cost",
  C: "ms ms-c ms-cost",
};

export default function HeroSection({
  homeMode,
  setHomeMode,
  commanderSearch,
  setCommanderSearch,
  handleResetHome,
  commanderSort,
  setCommanderSort,
  dashboardData,
  commanders = [],
  cards = [],
  onSelectCommander,
  onSelectCard,
  setCardSearch,
  setActiveTab,
}: HeroSectionProps) {
  const isDashboard = homeMode === "dashboard";
  const [bgIndex, setBgIndex] = useState(0);

  // Stato ricerca ed autocomplete
  const [query, setQuery] = useState(commanderSearch || "");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<"all" | "commanders" | "cards">("all");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sincronizza input se il valore esterno cambia
  useEffect(() => {
    if (!isDashboard) {
      setQuery(commanderSearch);
    }
  }, [commanderSearch, isDashboard]);

  // Carosello sfondi
  useEffect(() => {
    if (!isDashboard) return;

    const intervalId = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isDashboard]);

  // Chiusura al click fuori dal contenitore
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cleanQ = query.trim().toLowerCase();

  // Comandanti che corrispondono alla ricerca
  const matchingCommanders = useMemo(() => {
    if (cleanQ.length < 2 || !commanders.length) return [];
    return commanders
      .filter((c) => c?.comandante && c.comandante.toLowerCase().includes(cleanQ))
      .sort((a, b) => {
        const aName = a.comandante.toLowerCase();
        const bName = b.comandante.toLowerCase();
        if (aName === cleanQ) return -1;
        if (bName === cleanQ) return 1;
        if (aName.startsWith(cleanQ) && !bName.startsWith(cleanQ)) return -1;
        if (!aName.startsWith(cleanQ) && bName.startsWith(cleanQ)) return 1;
        return (b.cnt || b.decks_count || 0) - (a.cnt || a.decks_count || 0);
      });
  }, [commanders, cleanQ]);

  // Carte che corrispondono alla ricerca
  const matchingCards = useMemo(() => {
    if (cleanQ.length < 2) return [];

    const pool = [
      ...cards,
      ...(dashboardData?.top_cards || []).map((c: any) => ({
        card_name: c.name || c.card_name,
        art_crops: c.art_crops,
        images: c.images,
        freq: c.val1 || c.freq,
        category: c.category,
      })),
      ...(dashboardData?.hot_cards || []).map((c: any) => ({
        card_name: c.name || c.card_name,
        art_crops: c.art_crops,
        images: c.images,
        freq: c.val1 || c.freq,
        category: c.category,
      })),
    ];

    const seen = new Set<string>();
    const deduplicated: any[] = [];
    for (const c of pool) {
      const name = c.card_name || c.name;
      if (name && !seen.has(name.toLowerCase())) {
        seen.add(name.toLowerCase());
        deduplicated.push(c);
      }
    }

    return deduplicated
      .filter((c) => {
        const name = (c.card_name || c.name || "").toLowerCase();
        return name.includes(cleanQ);
      })
      .sort((a, b) => {
        const aName = (a.card_name || a.name || "").toLowerCase();
        const bName = (b.card_name || b.name || "").toLowerCase();
        if (aName === cleanQ) return -1;
        if (bName === cleanQ) return 1;
        if (aName.startsWith(cleanQ) && !bName.startsWith(cleanQ)) return -1;
        if (!aName.startsWith(cleanQ) && bName.startsWith(cleanQ)) return 1;
        return (b.freq || b.val1 || 0) - (a.freq || a.val1 || 0);
      });
  }, [cards, dashboardData, cleanQ]);

  // Lista visibile in base al tab attivo
  const visibleCommanders =
    searchTab === "cards"
      ? []
      : searchTab === "all"
        ? matchingCommanders.slice(0, 4)
        : matchingCommanders.slice(0, 8);

  const visibleCards =
    searchTab === "commanders"
      ? []
      : searchTab === "all"
        ? matchingCards.slice(0, 4)
        : matchingCards.slice(0, 8);

  // Lista piatta per navigazione da tastiera
  const flatItems = useMemo(() => {
    const items: { type: "commander" | "card"; data: any }[] = [];
    visibleCommanders.forEach((c) => items.push({ type: "commander", data: c }));
    visibleCards.forEach((c) => items.push({ type: "card", data: c }));
    return items;
  }, [visibleCommanders, visibleCards]);

  const handleSelect = (item: { type: "commander" | "card"; data: any }) => {
    setIsOpen(false);
    if (item.type === "commander") {
      const cmdName = item.data.comandante;
      if (onSelectCommander) {
        onSelectCommander(cmdName);
      } else {
        setCommanderSearch(cmdName);
        setHomeMode("commanders");
      }
    } else {
      const cardName = item.data.card_name || item.data.name;
      if (onSelectCard) {
        onSelectCard(cardName);
      } else if (setCardSearch) {
        setCardSearch(cardName);
        if (setActiveTab) setActiveTab("Top Cards");
        setHomeMode("cards");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(val.trim().length >= 2);
    setHighlightedIndex(-1);

    if (!isDashboard) {
      setCommanderSearch(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || flatItems.length === 0) {
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault();
        setIsOpen(false);
        setCommanderSearch(query.trim());
        setHomeMode("commanders");
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && flatItems[highlightedIndex]) {
        handleSelect(flatItems[highlightedIndex]);
      } else if (flatItems.length > 0) {
        handleSelect(flatItems[0]);
      } else {
        setIsOpen(false);
        setCommanderSearch(query.trim());
        setHomeMode("commanders");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setCommanderSearch("");
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const totalResults = matchingCommanders.length + matchingCards.length;

  return (
    <div
      className={`relative z-30 transition-all duration-500 ease-in-out flex ${
        isDashboard
          ? "mb-12 mt-4 w-full flex-col items-center justify-center py-12 md:py-24 px-4 rounded-3xl border border-slate-800/50 overflow-visible shadow-2xl bg-slate-950"
          : "flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mb-8 mt-2 border-transparent bg-transparent"
      }`}
    >
      {/* SFONDO GLASSMORPHISM CON CAROSELLO (Visibile solo in Dashboard) */}
      {isDashboard && (
        <div className="absolute inset-0 -z-20 pointer-events-none rounded-3xl overflow-hidden">
          {BACKGROUND_IMAGES.map((image, index) => (
            <div
              key={image}
              className={`absolute inset-[-10%] bg-cover bg-[center_33%] transition-opacity duration-1000 ease-in-out ${
                index === bgIndex ? "opacity-70" : "opacity-0"
              }`}
              style={{ backgroundImage: `url("/background/${image}")` }}
            ></div>
          ))}
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[12px]"></div>
        </div>
      )}

      {/* TESTI E GLOW */}
      {isDashboard && (
        <div className="flex flex-col items-center w-full max-w-4xl animate-fade-in order-1 sm:order-none relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-blue-600/20 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-3 sm:mb-5 z-10 drop-shadow-lg tracking-tight">
            Il Meta del{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Centurion Commander
            </span>
          </h1>
          <p className="text-slate-200 text-sm md:text-base lg:text-lg text-center mb-8 md:mb-10 z-10 max-w-3xl px-2 leading-relaxed drop-shadow-md font-medium">
            Esplora il meta del formato 1v1 italiano di <strong>Magic: The Gathering</strong>.
            Analizziamo migliaia di decklist della community per offrirti sinergie e statistiche sempre aggiornate.
          </p>
        </div>
      )}

      {/* PULSANTE INDIETRO */}
      {!isDashboard && (
        <a
          href="/"
          onClick={(e) => handleNav(e, handleResetHome)}
          className="text-xl font-black text-slate-100 flex items-center gap-2 cursor-pointer group shrink-0 relative z-10 order-1 sm:order-none"
        >
          <ArrowLeft
            className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors"
            strokeWidth={2.5}
          />
          <span className="w-1.5 h-6 bg-blue-500 rounded-full ml-1"></span> Tutti i Comandanti
        </a>
      )}

      {/* FILTRI (Top/Hot) */}
      {!isDashboard && homeMode === "commanders" && (
        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800 shrink-0 z-10 sm:absolute sm:left-1/2 sm:-translate-x-1/2 order-3 sm:order-none self-center sm:self-auto">
          <button
            onClick={() => setCommanderSort("top")}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
              commanderSort === "top"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Top
          </button>
          <button
            onClick={() => setCommanderSort("hot")}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${
              commanderSort === "hot"
                ? "bg-orange-500 text-white shadow"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Hot (7gg)
          </button>
        </div>
      )}

      {/* CONTENITORE RICERCA CON AUTOCOMPLETE */}
      <div
        ref={containerRef}
        className={`flex flex-col sm:flex-row items-center z-40 transition-all duration-500 order-2 sm:order-none relative ${
          isDashboard ? "w-full max-w-2xl flex-col justify-center" : "w-full sm:w-auto justify-end"
        }`}
      >
        <div
          className={`relative transition-all duration-500 w-full ${
            isDashboard ? "" : "sm:w-72"
          }`}
        >
          <Search
            className={`absolute text-slate-400 transition-all pointer-events-none ${
              isDashboard
                ? "left-5 top-1/2 -translate-y-1/2 w-5 h-5"
                : "left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
            }`}
            strokeWidth={2.5}
          />

          <input
            ref={inputRef}
            type="text"
            placeholder={isDashboard ? "Cerca comandante o carta..." : "Cerca comandante..."}
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              if (cleanQ.length >= 2) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full focus:outline-none text-slate-100 shadow-xl transition-all placeholder:text-slate-400 ${
              isDashboard
                ? "bg-slate-950/70 backdrop-blur-md border border-slate-700/60 hover:border-blue-500/50 focus:border-blue-500 rounded-full pl-12 pr-11 py-3.5 md:py-4 text-base md:text-lg font-medium"
                : "bg-slate-900 border border-slate-800 rounded-full pl-9 pr-9 py-2 text-sm focus:border-blue-500"
            }`}
          />

          {query && (
            <button
              onClick={handleClear}
              className={`absolute text-slate-400 hover:text-white transition-colors p-1 rounded-full ${
                isDashboard
                  ? "right-4 top-1/2 -translate-y-1/2"
                  : "right-2.5 top-1/2 -translate-y-1/2"
              }`}
              title="Cancella ricerca"
            >
              <X className={isDashboard ? "w-4 h-4" : "w-3.5 h-3.5"} />
            </button>
          )}

          {/* MENU A TENDINA DELL'AUTOCOMPLETE */}
          {isOpen && cleanQ.length >= 2 && (
            <div
              className={`absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden text-left animate-fade-in ${
                isDashboard ? "" : "sm:w-96 sm:right-0 sm:left-auto"
              }`}
            >
              {/* BARRA TAB (TUTTI / COMANDANTI / CARTE) */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-950/70 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSearchTab("all");
                      setHighlightedIndex(-1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                      searchTab === "all"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Tutti ({totalResults})
                  </button>
                  <button
                    onClick={() => {
                      setSearchTab("commanders");
                      setHighlightedIndex(-1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                      searchTab === "commanders"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Crown className="w-3 h-3" />
                    Comandanti ({matchingCommanders.length})
                  </button>
                  <button
                    onClick={() => {
                      setSearchTab("cards");
                      setHighlightedIndex(-1);
                    }}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                      searchTab === "cards"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    Carte ({matchingCards.length})
                  </button>
                </div>
              </div>

              {/* LISTA DEI RISULTATI */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-800/60">
                {totalResults === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    <p className="font-semibold text-slate-300">
                      Nessun risultato per &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Prova a controllare l&apos;ortografia o usa il nome in inglese della carta.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* SEZIONE COMANDANTI */}
                    {visibleCommanders.length > 0 && (
                      <div>
                        {searchTab === "all" && (
                          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/40 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span className="flex items-center gap-1.5 text-blue-400">
                              <Crown className="w-3 h-3" /> Comandanti
                            </span>
                            <span>{matchingCommanders.length} trovati</span>
                          </div>
                        )}
                        {visibleCommanders.map((cmd) => {
                          const flatIdx = flatItems.findIndex(
                            (it) => it.type === "commander" && it.data.comandante === cmd.comandante
                          );
                          const isHighlighted = flatIdx === highlightedIndex;
                          const img =
                            cmd.art_crops?.[0] ||
                            cmd.images?.[0] ||
                            `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
                              cmd.comandante.split(" / ")[0]
                            )}&format=image&version=art_crop`;

                          return (
                            <div
                              key={cmd.comandante}
                              onClick={() => handleSelect({ type: "commander", data: cmd })}
                              onMouseEnter={() => setHighlightedIndex(flatIdx)}
                              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                                isHighlighted
                                  ? "bg-slate-800/90 ring-1 ring-inset ring-blue-500/50"
                                  : "hover:bg-slate-800/50"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <img
                                  src={img}
                                  alt={cmd.comandante}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-700/80 shrink-0 bg-slate-800"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-sm text-slate-100 truncate flex items-center gap-1.5">
                                    <span className="truncate">{cmd.comandante}</span>
                                    {cmd.color_identity && cmd.color_identity.length > 0 && (
                                      <span className="inline-flex items-center gap-0.5 shrink-0 ml-1">
                                        {cmd.color_identity.map((c: string) => (
                                          <i
                                            key={c}
                                            className={`${COLOR_MAP[c] || ""} text-[11px]`}
                                          />
                                        ))}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    Comandante Centurion
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="text-[11px] font-bold text-blue-400 bg-blue-950/60 border border-blue-900/50 px-2 py-0.5 rounded-full">
                                  {cmd.cnt || cmd.decks_count || 0} mazzi
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* SEZIONE CARTE */}
                    {visibleCards.length > 0 && (
                      <div>
                        {searchTab === "all" && (
                          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/40 text-[10px] font-black uppercase tracking-wider text-slate-400">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <Sparkles className="w-3 h-3" /> Carte
                            </span>
                            <span>{matchingCards.length} trovate</span>
                          </div>
                        )}
                        {visibleCards.map((card) => {
                          const cardName = card.card_name || card.name;
                          const flatIdx = flatItems.findIndex(
                            (it) =>
                              it.type === "card" &&
                              (it.data.card_name || it.data.name) === cardName
                          );
                          const isHighlighted = flatIdx === highlightedIndex;
                          const img =
                            card.art_crops?.[0] ||
                            card.images?.[0] ||
                            `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
                              cardName.split("//")[0].trim()
                            )}&format=image&version=art_crop`;

                          const catInfo = CATEGORY_INFO[card.category];

                          return (
                            <div
                              key={cardName}
                              onClick={() => handleSelect({ type: "card", data: card })}
                              onMouseEnter={() => setHighlightedIndex(flatIdx)}
                              className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer transition-colors ${
                                isHighlighted
                                  ? "bg-slate-800/90 ring-1 ring-inset ring-emerald-500/50"
                                  : "hover:bg-slate-800/50"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <img
                                  src={img}
                                  alt={cardName}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-700/80 shrink-0 bg-slate-800"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-sm text-slate-100 truncate">
                                    {cardName}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                    {card.category && (
                                      <span className="flex items-center gap-1">
                                        {catInfo?.icon && (
                                          <i className={`ms ${catInfo.icon} text-[10px]`}></i>
                                        )}
                                        <span>{card.category}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="text-[11px] font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
                                  {card.Percentuale
                                    ? `${card.Percentuale}%`
                                    : `${card.freq || card.val1 || 0} mazzi`}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* FOOTER AZIONI RAPIDE */}
              {totalResults > 0 && (
                <div className="p-2 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setCommanderSearch(query.trim());
                      setHomeMode("commanders");
                    }}
                    className="text-blue-400 hover:text-blue-300 font-bold px-2.5 py-1 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Vedi comandanti per &ldquo;{query}&rdquo;
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      if (setCardSearch) setCardSearch(query.trim());
                      if (setActiveTab) setActiveTab("Top Cards");
                      setHomeMode("cards");
                    }}
                    className="text-emerald-400 hover:text-emerald-300 font-bold px-2.5 py-1 rounded-lg hover:bg-slate-800/60 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Vedi carte per &ldquo;{query}&rdquo;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
