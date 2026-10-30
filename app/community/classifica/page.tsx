"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trophy, 
  Flame, 
  ThumbsDown, 
  Star, 
  Search, 
  SearchX,
  Swords, 
  ArrowRight,
  Filter,
  X,
  RotateCw,
  Hand,
  ExternalLink
} from "lucide-react";
import CommunityNav from "../../../components/CommunityNav";
import Footer from "../../../components/Footer";
import ScrollToTop from "../../../components/ScrollToTop";
import { COLOR_FILTERS, matchesColorIdentity } from "../../../utils/mtg";
import { handleCardDragStart } from "../../../utils/dragCard";

interface LeaderboardItem {
  card_name: string;
  total_votes: number;
  avg_score: number;
  stars_breakdown: Record<number, number>;
  last_voted_at: string | null;
  images: string[];
  art_crops: string[];
  type: string;
  cmc: number;
  color_identity: string[];
}

export default function ClassificaPage() {
  const [sort, setSort] = useState<"highest" | "most_voted" | "lowest">("highest");
  const [minVotes, setMinVotes] = useState(2);
  const [search, setSearch] = useState("");
  const [activeColors, setActiveColors] = useState<string[]>([]);

  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stato modale visualizzazione carta draggable
  const [selectedCard, setSelectedCard] = useState<LeaderboardItem | null>(null);
  const [isModalFlipped, setIsModalFlipped] = useState(false);

  // Sincronizzazione URL e gestione storico browser
  const isInitialized = useRef(false);
  const isPopState = useRef(false);
  const [initialCardParam, setInitialCardParam] = useState<string | null>(null);
  const prevSortRef = useRef(sort);
  const prevCardRef = useRef<string | null>(null);

  // 1. Sincronizza lo stato dai parametri URL
  const syncStateFromURL = useCallback(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const sortParam = params.get("sort");
    if (sortParam === "highest" || sortParam === "most_voted" || sortParam === "lowest") {
      setSort(sortParam);
    } else {
      setSort("highest");
    }

    const minVotesParam = params.get("min_votes");
    if (minVotesParam) {
      const parsed = parseInt(minVotesParam, 10);
      if ([1, 2, 5, 10].includes(parsed)) {
        setMinVotes(parsed);
      }
    } else {
      setMinVotes(2);
    }

    const searchParam = params.get("q") || params.get("search");
    setSearch(searchParam || "");

    const colorsParam = params.get("colors");
    if (colorsParam) {
      setActiveColors(colorsParam.split(",").filter(Boolean));
    } else {
      setActiveColors([]);
    }

    const cardParam = params.get("card");
    if (cardParam) {
      setInitialCardParam(cardParam);
    } else {
      setSelectedCard(null);
    }
  }, []);

  // 2. Ascolto popstate (frecce Avanti/Indietro del browser) e prima lettura URL
  useEffect(() => {
    syncStateFromURL();
    isInitialized.current = true;

    const handlePopState = () => {
      isPopState.current = true;
      syncStateFromURL();
      setTimeout(() => {
        isPopState.current = false;
      }, 100);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncStateFromURL]);

  // 3. Apertura automatica card se presente nel parametro URL e gli items sono pronti
  useEffect(() => {
    if (initialCardParam && items.length > 0) {
      const found = items.find(
        (i) => i.card_name.toLowerCase() === initialCardParam.toLowerCase()
      );
      if (found) {
        setSelectedCard(found);
        setInitialCardParam(null);
      }
    }
  }, [initialCardParam, items]);

  // 4. Aggiorna l'URL quando cambiano filtri, tab o modale
  useEffect(() => {
    if (!isInitialized.current || typeof window === "undefined") return;

    const params = new URLSearchParams();
    if (sort !== "highest") params.set("sort", sort);
    if (minVotes !== 2) params.set("min_votes", minVotes.toString());
    if (search.trim()) params.set("q", search.trim());
    if (activeColors.length > 0) params.set("colors", activeColors.join(","));
    if (selectedCard) params.set("card", selectedCard.card_name);

    const newQuery = params.toString();
    const newUrl = newQuery ? `/community/classifica?${newQuery}` : `/community/classifica`;
    const currentUrl = window.location.pathname + window.location.search;

    if (currentUrl !== newUrl) {
      if (!isPopState.current) {
        const isTabChanged = prevSortRef.current !== sort;
        const currentCardName = selectedCard?.card_name || null;
        const isCardModalChanged = prevCardRef.current !== currentCardName;

        if (isTabChanged || isCardModalChanged) {
          window.history.pushState(null, "", newUrl);
        } else {
          window.history.replaceState(null, "", newUrl);
        }
      }
    }

    prevSortRef.current = sort;
    prevCardRef.current = selectedCard?.card_name || null;
  }, [sort, minVotes, search, activeColors, selectedCard]);

  // Chiusura modale con tasto Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedCard(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Fetch dei dati dalla classifica
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      sort: sort,
      min_votes: minVotes.toString(),
      limit: "100",
      offset: "0",
    });

    fetch(`/api/community/leaderboard?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setItems(data.items || []);
        setTotalCount(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch leaderboard:", err);
        if (!active) return;
        setError("Impossibile caricare la classifica. Riprova tra poco.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sort, minVotes]);

  // Gestione filtro colori
  const toggleColor = (colorVal: string) => {
    if (colorVal === "Tutti") {
      setActiveColors([]);
      return;
    }
    setActiveColors((prev) =>
      prev.includes(colorVal) ? prev.filter((c) => c !== colorVal) : [...prev, colorVal]
    );
  };

  // Filtraggio locale per ricerca testuale e colori
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.card_name.toLowerCase().includes(search.toLowerCase());
      const matchColor = matchesColorIdentity(item.color_identity || [], activeColors);
      return matchSearch && matchColor;
    });
  }, [items, search, activeColors]);

  const hasActiveFilters = search !== "" || activeColors.length > 0 || minVotes !== 2;
  const resetFilters = () => {
    setSearch("");
    setActiveColors([]);
    setMinVotes(2);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative selection:bg-blue-600 selection:text-white">
      <CommunityNav />

      <div className="flex-grow pb-24 max-w-[1100px] w-full mx-auto px-4 md:px-8 mt-8 sm:mt-12 relative z-10 space-y-8">
        
        {/* INTESTAZIONE */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            Classifiche Community CentMeta
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Hall of Fame delle Carte
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            I giudizi aggregati della community per il formato Centurion Commander. Scopri quali carte hanno conquistato i giocatori e quali sono state bocciate.
          </p>
        </div>

        {/* CONTROLLI: TAB DI ORDINAMENTO */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setSort("highest")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                sort === "highest"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Più Forti</span>
            </button>

            <button
              onClick={() => setSort("most_voted")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                sort === "most_voted"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Più Votate</span>
            </button>

            <button
              onClick={() => setSort("lowest")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
                sort === "lowest"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <ThumbsDown className="w-4 h-4 text-red-400" />
              <span>Flop / Scarse</span>
            </button>
          </div>

          {/* FILTRO SOGLIA MINIMA VOTI */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold hidden sm:inline">Soglia voti:</span>
            <select
              value={minVotes}
              onChange={(e) => setMinVotes(parseInt(e.target.value, 10))}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 shadow-inner cursor-pointer"
            >
              <option value={1}>Almeno 1 voto</option>
              <option value={2}>Almeno 2 voti</option>
              <option value={5}>Almeno 5 voti</option>
              <option value={10}>Almeno 10 voti</option>
            </select>
          </div>
        </div>

        {/* FILTRI DI RICERCA & COLORI */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl">
          {/* BARRA DI RICERCA */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca carta per nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          {/* FILTRO COLOR IDENTITY */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Colore:
            </span>
            {COLOR_FILTERS.map((f) => {
              const isSelected = f.val === "Tutti" ? activeColors.length === 0 : activeColors.includes(f.val);
              return (
                <button
                  key={f.val}
                  type="button"
                  onClick={() => toggleColor(f.val)}
                  title={f.label}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isSelected
                      ? "bg-blue-600/30 border-blue-500 text-blue-300 shadow-sm"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {f.icon ? <i className={f.icon} /> : f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* STATO ERRORE */}
        {error && (
          <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-6 text-center text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* LISTA / TABELLA CLASSIFICA */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-20 bg-slate-900/40 border border-slate-800/80 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* EMPTY STATE */
          <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-10 text-center space-y-4 max-w-lg mx-auto mt-8">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <SearchX className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Nessuna carta trovata</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {search || activeColors.length > 0 || minVotes > 1
                ? "Nessuna carta corrisponde ai filtri selezionati. Prova a ridurre la soglia minima di voti o azzerare la ricerca."
                : "La classifica è ancora vuota. Sii il primo a votare le carte per far decollare la classifica!"}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all border border-slate-700"
                >
                  Azzera Filtri
                </button>
              )}
              <Link
                href="/community/vota"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-900/30"
              >
                <span>Vota le Carte Ora</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* LISTA DELLE CARTE */
          <div className="space-y-3">
            <div className="text-xs text-slate-400 font-semibold px-2 flex justify-between items-center">
              <span>Mostrando {filteredItems.length} carte ({totalCount} totali nel database)</span>
              <span>Punteggio medio su 5.0 ★</span>
            </div>

            {filteredItems.map((item, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3 && sort === "highest";

              return (
                <div
                  key={item.card_name}
                  onClick={() => {
                    setSelectedCard(item);
                    setIsModalFlipped(false);
                  }}
                  className={`bg-slate-900/60 border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-blue-500/50 hover:bg-slate-800/70 shadow-md cursor-pointer group ${
                    isTop3
                      ? "border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-slate-900/70 to-slate-900/60"
                      : "border-slate-800/80"
                  }`}
                >
                  {/* LATO SINISTRO: RANK + ART CROP + NOME + TIPO */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* BADGE POSIZIONE */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 border ${
                        rank === 1 && sort === "highest"
                          ? "bg-amber-400/20 border-amber-400 text-amber-300"
                          : rank === 2 && sort === "highest"
                          ? "bg-slate-300/20 border-slate-300 text-slate-200"
                          : rank === 3 && sort === "highest"
                          ? "bg-amber-700/20 border-amber-700 text-amber-500"
                          : "bg-slate-800/80 border-slate-700 text-slate-400"
                      }`}
                    >
                      {rank}
                    </div>

                    {/* ANTEPRIMA ART CROP DRAGGABLE */}
                    <div
                      draggable={true}
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleCardDragStart(e, item.card_name, item.images?.[0]);
                      }}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 relative border border-slate-700/60 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                      title="Trascina su Moxfield o clicca per ingrandire"
                    >
                      {item.art_crops && item.art_crops[0] ? (
                        <Image
                          src={item.art_crops[0]}
                          alt={item.card_name}
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-bold">
                          MTG
                        </div>
                      )}
                    </div>

                    {/* NOME CARTA E INFO */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm sm:text-base text-white group-hover:text-blue-300 transition-colors truncate" title={item.card_name}>
                          {item.card_name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {item.type}
                      </p>
                    </div>
                  </div>

                  {/* LATO DESTRO: PUNTEGGIO & STELLE */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    
                    {/* BARRA PROGRESSO STELLE */}
                    <div className="flex flex-col items-start sm:items-end">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
                          {item.avg_score.toFixed(1)}
                        </span>
                        <span className="text-xs text-slate-500">/ 5.0</span>
                      </div>
                      <div className="w-24 sm:w-28 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="bg-amber-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${(item.avg_score / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* NUMERO VOTI */}
                    <div className="text-right min-w-[70px]">
                      <div className="text-xs font-bold text-slate-300">
                        {item.total_votes} {item.total_votes === 1 ? "voto" : "voti"}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {item.stars_breakdown[5] || 0} staple
                      </span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CALL TO ACTION IN FONDO */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">Manca il tuo voto su questa classifica?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Contribuisci a definire la percezione del metagame votando carte casuali nell&apos;Arena di Voto.
            </p>
          </div>
          <Link
            href="/community/vota"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-900/30"
          >
            <Swords className="w-4 h-4" />
            <span>Vai all&apos;Arena di Voto</span>
          </Link>
        </div>

      </div>

      {/* MODALE ANTEPRIMA CARTA DRAGGABLE */}
      {selectedCard && (
        <div 
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedCard(null)}
        >
          <div 
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative flex flex-col md:flex-row gap-6 items-center md:items-start"
            onClick={(e) => e.stopPropagation()}
          >
            {/* PULSANTE CHIUDI */}
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors z-10"
              title="Chiudi (Esc)"
            >
              <X className="w-5 h-5" />
            </button>

            {/* IMMAGINE CARTA DRAGGABLE */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="relative w-[240px] sm:w-[280px] h-[335px] sm:h-[391px] rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-2xl group">
                {selectedCard.images && selectedCard.images.length > 0 ? (
                  <img
                    src={
                      isModalFlipped && selectedCard.images.length > 1
                        ? selectedCard.images[1]
                        : selectedCard.images[0]
                    }
                    alt={selectedCard.card_name}
                    draggable={true}
                    onDragStart={(e) =>
                      handleCardDragStart(
                        e,
                        selectedCard.card_name,
                        isModalFlipped && selectedCard.images.length > 1
                          ? selectedCard.images[1]
                          : selectedCard.images[0]
                      )
                    }
                    className="w-full h-full object-contain cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform select-none"
                    title="Trascina questa carta su Moxfield o Archidekt"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <span className="font-bold text-white mb-2">{selectedCard.card_name}</span>
                    <span className="text-xs">Immagine non disponibile</span>
                  </div>
                )}
              </div>

              {/* INDICAZIONE TRASCINAMENTO */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                <Hand className="w-3.5 h-3.5 animate-pulse" />
                <span>Trascina su Moxfield o Archidekt</span>
              </div>

              {/* GIRA CARTA BIFRONTE */}
              {selectedCard.images && selectedCard.images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsModalFlipped((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-xl border border-slate-700 transition-colors shadow-sm"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Gira ({isModalFlipped ? "Fronte" : "Retro"})</span>
                </button>
              )}
            </div>

            {/* DETTAGLI CARTA NELLA MODALE */}
            <div className="flex-1 space-y-5 min-w-0 self-stretch flex flex-col justify-between">
              <div className="space-y-3">
                <div className="pr-8">
                  <h3 className="text-2xl font-black text-white leading-tight">
                    {selectedCard.card_name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {selectedCard.type}
                  </p>
                </div>

                {/* PUNTEGGIO COMMUNITY */}
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Valutazione Community</span>
                    <div className="flex items-center gap-1 font-black text-amber-300 text-sm">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{selectedCard.avg_score.toFixed(1)} / 5.0</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    Basato su <span className="font-bold text-white">{selectedCard.total_votes}</span> {selectedCard.total_votes === 1 ? "voto" : "voti"}
                  </div>

                  {/* BREAKDOWN STELLE */}
                  <div className="space-y-1 pt-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = selectedCard.stars_breakdown[stars] || 0;
                      const percent = selectedCard.total_votes > 0 ? (count / selectedCard.total_votes) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2 text-[10px]">
                          <span className="w-6 text-slate-400 font-bold">{stars} ★</span>
                          <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="w-6 text-right text-slate-500 font-mono">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* AZIONI RAPIDE */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={`/?card=${encodeURIComponent(selectedCard.card_name)}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase py-2.5 px-4 rounded-xl transition-all shadow-md shadow-blue-900/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Vedi Statistiche & Sinergie CentMeta</span>
                </a>

                <a
                  href={`https://scryfall.com/search?q=%21%22${encodeURIComponent(selectedCard.card_name)}%22`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs py-2 px-4 rounded-xl border border-slate-700 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Apri su Scryfall</span>
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </main>
  );
}
