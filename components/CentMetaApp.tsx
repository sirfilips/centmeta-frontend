"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ScrollToTop from "./ScrollToTop";
import Header from "./Header";
import Footer from "./Footer";
import SkeletonCard from "./SkeletonCard";
import DeckList from "./DeckList";
import CardDetail from "./CardDetail";
import TrendIndicator from "./TrendIndicator";
import Carousel from "./Carousel";
import HeroSection from "./HeroSection";
import CommandersGrid from "./CommandersGrid";
import CommanderOverview from "./CommanderOverview";
import CardsFilterBar from "./CardsFilterBar";
import { CardsGrid } from "./CardsGrid";
import { EmptyState } from "./EmptyState";
import { CATEGORY_INFO, matchesColorIdentity } from "../utils/mtg";
import { handleNav } from "../utils/navigation";
import { handleCardDragStart } from "../utils/dragCard";
import { ArrowLeft } from "lucide-react";

export { CATEGORY_INFO, matchesColorIdentity } from "../utils/mtg";
export { EmptyState } from "./EmptyState";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export default function CentMetaApp({
  initialCommander = "Tutti i mazzi",
}: {
  initialCommander?: string;
}) {
  const [filtroTempo, setFiltroTempo] = useState("Ultimi 30 giorni");
  const [homeMode, setHomeMode] = useState<
    "dashboard" | "commanders" | "cards"
  >("dashboard");
  const [commanderSort, setCommanderSort] = useState<"top" | "hot">("top");
  const [cardSort, setCardSort] = useState<"top" | "hot">("top");

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const [commanders, setCommanders] = useState<any[]>([]);

  const [selectedCommander, setSelectedCommander] = useState(initialCommander);

  const [statsData, setStatsData] = useState<{
    total_decks: number;
    avg_lands?: number;
    mana_curve?: any;
    type_distribution?: any;
    cards: any[];
  }>({ total_decks: 0, cards: [] });
  const [activeTab, setActiveTab] = useState("Top Cards");
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [commanderSearch, setCommanderSearch] = useState("");
  const [cardSearch, setCardSearch] = useState("");
  const debouncedCardSearch = useDebounce(cardSearch, 300);

  const [selectedCardDetail, setSelectedCardDetail] = useState<string | null>(
    null,
  );
  const [cardDetailData, setCardDetailData] = useState<any>(null);
  const [loadingCardDetail, setLoadingCardDetail] = useState(false);
  const [activeSynergyTab, setActiveSynergyTab] = useState("Tutte");

  const [commanderDecks, setCommanderDecks] = useState<any[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [copiedDeck, setCopiedDeck] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(50);
  const [cacheStats, setCacheStats] = useState<{ [key: string]: any }>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [showOracle, setShowOracle] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // SENTINELLE PER LA CRONOLOGIA BROWSER
  const isPopState = useRef(false);
  const isInitialUrlCorrected = useRef(false);

  const isAnyLoading =
    loading || dashboardLoading || loadingCardDetail || loadingDecks;

  const syncStateFromURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;

    let cmdFromUrl = params.get("commander");
    if (pathname.startsWith("/commander/")) {
      cmdFromUrl = decodeURIComponent(pathname.split("/")[2]);
    }

    const timeParam = params.get("periodo") || params.get("time");
    const validPeriods = [
      "Ultimi 7 giorni",
      "Ultimi 30 giorni",
      "Ultimi 3 mesi",
      "Ultimi 6 mesi",
      "Ultimo anno",
      "Tutti i tempi",
    ];
    if (timeParam && validPeriods.includes(timeParam)) {
      setFiltroTempo(timeParam);
    }

    setSelectedCardDetail(params.get("card") || null);
    setSelectedCommander(cmdFromUrl || initialCommander || "Tutti i mazzi");
    const viewMode = (params.get("view") as any) || "dashboard";
    setHomeMode(viewMode);
    setActiveTab(params.get("tab") || "Top Cards");

    // Supporta sia 'cardsort' che il vecchio 'csort' con retrocompatibilità per vecchi bookmark
    const cmdSortParam = (params.get("csort") as any) || "top";
    const cardSortParam = (params.get("cardsort") ||
      (viewMode === "cards" ? params.get("csort") : null) ||
      "top") as any;
    setCommanderSort(cmdSortParam);
    setCardSort(cardSortParam);

    setIsInitialized(true);
  }, [initialCommander]);

  useEffect(() => {
    syncStateFromURL();

    // Gestore per le frecce Avanti/Indietro del browser
    const handlePopState = () => {
      isPopState.current = true;
      syncStateFromURL();
      // Resetta il blocco cronologia dopo che React ha aggiornato la grafica
      setTimeout(() => {
        isPopState.current = false;
      }, 100);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [syncStateFromURL]);

  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    if (filtroTempo !== "Ultimi 30 giorni") params.set("periodo", filtroTempo);
    if (selectedCardDetail) params.set("card", selectedCardDetail);
    if (homeMode !== "dashboard" && selectedCommander === "Tutti i mazzi")
      params.set("view", homeMode);
    if (activeTab !== "Top Cards") params.set("tab", activeTab);
    if (commanderSort !== "top" && homeMode === "commanders")
      params.set("csort", commanderSort);
    if (
      cardSort !== "top" &&
      (homeMode === "cards" || selectedCommander !== "Tutti i mazzi")
    )
      params.set("cardsort", cardSort);

    let basePath = "/";
    if (selectedCommander !== "Tutti i mazzi") {
      basePath = `/commander/${encodeURIComponent(selectedCommander)}`;
    }

    const newUrl = params.toString()
      ? `${basePath}?${params.toString()}`
      : basePath;
    const currentUrl = window.location.pathname + window.location.search;

    // Se l'URL deve cambiare...
    if (currentUrl !== newUrl) {
      // 1. Se è il primo caricamento (es. apro da un link vecchio), correggilo ma NON aggiungere storico
      if (!isInitialUrlCorrected.current) {
        window.history.replaceState(null, "", newUrl);
        isInitialUrlCorrected.current = true;
      }
      // 2. Se l'utente ha cliccato nel sito (e NON sta usando le frecce indietro), aggiungi allo storico
      else if (!isPopState.current) {
        window.history.pushState(null, "", newUrl);
      }
    } else {
      isInitialUrlCorrected.current = true;
    }
  }, [
    selectedCommander,
    selectedCardDetail,
    homeMode,
    activeTab,
    commanderSort,
    cardSort,
    filtroTempo,
    isInitialized,
  ]);

  useEffect(() => {
    if (selectedCommander !== "Tutti i mazzi") {
      document.title = `${selectedCommander} | Top Carte, Sinergie e Liste Centurion`;
    } else {
      document.title = "CentMeta | Analisi Statistiche Centurion Commander";
    }
  }, [selectedCommander]);

  useEffect(() => {
    let active = true;
    setDashboardLoading(true);
    setApiError(null);
    fetchJson(
      `/api/home/dashboard?filtro_tempo=${encodeURIComponent(filtroTempo)}`,
    )
      .then((data) => {
        if (!active) return;
        setDashboardData(data);
        setDashboardLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setDashboardLoading(false);
        setApiError("Impossibile caricare i dati. Riprova tra poco.");
      });
    return () => {
      active = false;
    };
  }, [filtroTempo]);

  useEffect(() => {
    let active = true;
    setApiError(null);
    fetchJson(`/api/commanders?filtro_tempo=${encodeURIComponent(filtroTempo)}`)
      .then((data) => {
        if (!active) return;
        setCommanders(Array.isArray(data) ? data : []);
        setCacheStats({});
      })
      .catch(() => {
        if (!active) return;
        setApiError("Impossibile caricare i dati. Riprova tra poco.");
      });
    return () => {
      active = false;
    };
  }, [filtroTempo]);

  useEffect(() => {
    let active = true;
    setIsFlipped(false);
    setShowOracle(false);
    setApiError(null);

    const cacheKey = `${filtroTempo}_${selectedCommander}`;
    if (cacheStats[cacheKey]) {
      setStatsData(cacheStats[cacheKey]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const cmdParam =
      selectedCommander === "Tutti i mazzi"
        ? ""
        : `&comandante=${encodeURIComponent(selectedCommander)}`;
    fetchJson(
      `/api/decks/stats?filtro_tempo=${encodeURIComponent(filtroTempo)}${cmdParam}`,
    )
      .then((data) => {
        if (!active) return;
        const normalizedData = {
          ...data,
          total_decks: data?.total_decks ?? 0,
          cards: Array.isArray(data?.cards) ? data.cards : [],
        };
        setCacheStats((prev) => ({ ...prev, [cacheKey]: normalizedData }));
        setStatsData(normalizedData);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
        setApiError("Impossibile caricare i dati. Riprova tra poco.");
      });
    return () => {
      active = false;
    };
  }, [filtroTempo, selectedCommander]);

  useEffect(() => {
    let active = true;
    if (!selectedCardDetail) {
      setLoadingCardDetail(false);
      return;
    }
    setIsFlipped(false);
    setLoadingCardDetail(true);
    setActiveSynergyTab("Tutte");
    setVisibleCount(50);
    setApiError(null);
    fetchJson(
      `/api/card/details?card_name=${encodeURIComponent(selectedCardDetail)}&filtro_tempo=${encodeURIComponent(filtroTempo)}`,
    )
      .then((data) => {
        if (!active) return;
        setCardDetailData({
          ...data,
          commanders: Array.isArray(data?.commanders) ? data.commanders : [],
          synergies: Array.isArray(data?.synergies) ? data.synergies : [],
        });
        setLoadingCardDetail(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadingCardDetail(false);
        setApiError("Impossibile caricare i dati. Riprova tra poco.");
      });
    return () => {
      active = false;
    };
  }, [selectedCardDetail, filtroTempo]);

  useEffect(() => {
    let active = true;
    if (selectedCommander === "Tutti i mazzi" || activeTab !== "Liste Mazzi") {
      setLoadingDecks(false);
      return;
    }
    setLoadingDecks(true);
    setApiError(null);
    fetchJson(
      `/api/commander/decks?comandante=${encodeURIComponent(selectedCommander)}&filtro_tempo=${encodeURIComponent(filtroTempo)}`,
    )
      .then((data) => {
        if (!active) return;
        setCommanderDecks(Array.isArray(data) ? data : []);
        setLoadingDecks(false);
      })
      .catch(() => {
        if (!active) return;
        setLoadingDecks(false);
        setApiError("Impossibile caricare i dati. Riprova tra poco.");
      });
    return () => {
      active = false;
    };
  }, [selectedCommander, filtroTempo, activeTab]);

  useEffect(() => {
    setVisibleCount(50);
  }, [
    activeTab,
    debouncedCardSearch,
    activeColors,
    selectedCommander,
    selectedCardDetail,
    homeMode,
    commanderSort,
    cardSort,
  ]);

  const handleSelectCard = (val: string | null) => {
    setSelectedCardDetail(val);
    if (val) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSelectCommander = (val: string) => {
    setSelectedCommander(val);
    if (val !== "Tutti i mazzi") {
      setCommanderSearch("");
      setActiveTab("Top Cards");
      setActiveColors([]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleColor = (col: string) => {
    if (col === "Tutti") {
      setActiveColors([]);
    } else {
      setActiveColors((prev) => {
        if (prev.includes(col)) return prev.filter((c) => c !== col);
        return [...prev, col];
      });
    }
    setVisibleCount(50);
  };

  const terreBase = [
    "Plains",
    "Island",
    "Swamp",
    "Mountain",
    "Forest",
    "Snow-Covered Plains",
    "Snow-Covered Island",
    "Snow-Covered Swamp",
    "Snow-Covered Mountain",
    "Snow-Covered Forest",
  ];

  const applyFilters = (cards: any[], tab: string) => {
    let filtered = cards || [];

    if (
      homeMode === "cards" &&
      cardSort === "hot" &&
      selectedCommander === "Tutti i mazzi"
    ) {
      filtered = (dashboardData?.hot_cards || []).map((c: any) => ({
        card_name: c.name,
        images: c.images,
        freq: c.val1,
        Percentuale: 0,
        Sinergia: 0,
        delta: c.delta,
        category: c.category,
        color_identity: c.color_identity || [],
      }));
    }

    if (tab === "Top Sinergie" || tab === "In Crescita") {
      filtered = filtered.filter(
        (c) => !terreBase.includes(c.card_name) && c.category !== "Terre",
      );
      filtered = [...filtered].sort(
        (a, b) => (b.Sinergia || 0) - (a.Sinergia || 0),
      );
    } else if (tab === "Top Cards") {
      filtered = filtered.filter((c) => !terreBase.includes(c.card_name));
      filtered = [...filtered].sort(
        (a, b) => (b.Percentuale || 0) - (a.Percentuale || 0),
      );
    } else if (tab === "Terre") {
      filtered = filtered.filter(
        (c) => c.category === "Terre" || terreBase.includes(c.card_name),
      );
    } else if (
      tab !== "Tutte" &&
      tab !== "Hot Cards" &&
      tab !== "Liste Mazzi"
    ) {
      filtered = filtered.filter((c) => c.category === tab);
    }

    if (debouncedCardSearch.trim() !== "") {
      filtered = filtered.filter((c) =>
        c.card_name.toLowerCase().includes(debouncedCardSearch.toLowerCase()),
      );
    }

    if (activeColors.length > 0) {
      filtered = filtered.filter((c) =>
        matchesColorIdentity(c.color_identity, activeColors),
      );
    }
    return filtered;
  };

  let synergyLabel = "Top Sinergie";
  if (selectedCommander === "Tutti i mazzi") {
    synergyLabel = "In Crescita";
  }

  let categories = [
    "Top Cards",
    synergyLabel,
    "Creature",
    "Istantanei",
    "Stregonerie",
    "Artefatti",
    "Incantesimi",
    "Planeswalker",
    "Terre",
  ];
  if (
    selectedCommander === "Tutti i mazzi" &&
    filtroTempo === "Tutti i tempi"
  ) {
    categories = categories.filter((c) => c !== "In Crescita");
  }

  const synergyCategories = [
    "Tutte",
    "Creature",
    "Istantanei",
    "Stregonerie",
    "Artefatti",
    "Incantesimi",
    "Planeswalker",
    "Terre",
  ];

  const colors = [
    { label: "Tutti", val: "Tutti", icon: null },
    { label: "White", val: "W", icon: "ms ms-w ms-cost shadow-sm" },
    { label: "Blue", val: "U", icon: "ms ms-u ms-cost shadow-sm" },
    { label: "Black", val: "B", icon: "ms ms-b ms-cost shadow-sm" },
    { label: "Red", val: "R", icon: "ms ms-r ms-cost shadow-sm" },
    { label: "Green", val: "G", icon: "ms ms-g ms-cost shadow-sm" },
    { label: "Multi", val: "M", icon: "ms ms-multicolor ms-cost shadow-sm" },
    { label: "Colorless", val: "C", icon: "ms ms-c ms-cost shadow-sm" },
  ];

  const baseFilteredCommanders = commanders.filter((c) =>
    c.comandante.toLowerCase().includes(commanderSearch.toLowerCase()),
  );
  let listToRender =
    commanderSort === "hot"
      ? (dashboardData?.hot_commanders || []).filter((c: any) =>
          c.name.toLowerCase().includes(commanderSearch.toLowerCase()),
        )
      : baseFilteredCommanders;

  if (activeColors.length > 0 && homeMode === "commanders") {
    listToRender = listToRender.filter((c: any) => {
      const colorsArray = c.color_identity || c.colors || [];
      return matchesColorIdentity(colorsArray, activeColors);
    });
  }

  const selectedCmdObj = commanders.find(
    (c) => c.comandante === selectedCommander,
  );
  const visibleCardsData = applyFilters(statsData.cards, activeTab);
  const visibleSynergiesData = applyFilters(
    cardDetailData?.synergies,
    activeSynergyTab,
  );

  const handleResetHome = () => {
    setSelectedCardDetail(null);
    setSelectedCommander("Tutti i mazzi");
    setCommanderSearch("");
    setActiveTab("Top Cards");
    setActiveColors([]);
    setHomeMode("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToTab = (
    mode: "commanders" | "cards",
    tab: string = "Top Cards",
    sort: "top" | "hot" = "top",
  ) => {
    // 1. Azzera la navigazione profonda per forzare il ritorno alla "Home" (/)
    setSelectedCommander("Tutti i mazzi");
    setSelectedCardDetail(null);
    setCommanderSearch("");
    setActiveColors([]);

    // 2. Imposta la nuova visualizzazione globale richiesta dalle tendine
    setHomeMode(mode);
    setActiveTab(tab);
    if (mode === "commanders") setCommanderSort(sort);
    if (mode === "cards") setCardSort(sort);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewDecks = () => {
    setActiveTab("Liste Mazzi");
    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      const y =
        contentSection.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleTypeClick = (type: string) => {
    const validCategories = [
      "Creature",
      "Istantanei",
      "Stregonerie",
      "Artefatti",
      "Incantesimi",
      "Planeswalker",
      "Terre",
    ];
    if (validCategories.includes(type)) {
      setActiveTab(type);
      setVisibleCount(50);
      const contentSection = document.getElementById("content-section");
      if (contentSection) {
        const y =
          contentSection.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const handleBackToCards = () => {
    setActiveTab("Top Cards");
    const contentSection = document.getElementById("content-section");
    if (contentSection) {
      const y =
        contentSection.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative">
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${isAnyLoading ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
      >
        <div className="bg-blue-600/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-blue-400/50">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-sm font-bold tracking-wide">
            Caricamento dati...
          </span>
        </div>
      </div>

      <div className="flex-grow pb-24">
        <Header
          filtroTempo={filtroTempo}
          setFiltroTempo={setFiltroTempo}
          onReset={handleResetHome}
          totalDecks={
            homeMode === "dashboard"
              ? dashboardData?.total_decks
              : statsData.total_decks
          }
          lastUpdated={(statsData as any).last_updated}
          onNavigate={navigateToTab}
        />

        {apiError && (
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-4">
            <div className="bg-red-950/40 border border-red-900/50 text-red-200 rounded-xl px-4 py-3 text-sm flex items-center justify-between">
              <span>{apiError}</span>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-900/50 hover:bg-red-800 text-white font-bold py-1 px-3 rounded-lg border border-red-700/50 transition-colors"
              >
                Riprova
              </button>
            </div>
          </div>
        )}

        <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 mt-8">
          {selectedCardDetail ? (
            <CardDetail
              selectedCardDetail={selectedCardDetail}
              setSelectedCardDetail={handleSelectCard}
              loadingCardDetail={loadingCardDetail}
              cardDetailData={cardDetailData}
              filtroTempo={filtroTempo}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
              commanders={commanders}
              setSelectedCommander={handleSelectCommander}
              setCommanderSearch={setCommanderSearch}
              setActiveTab={setActiveTab}
              activeSynergyTab={activeSynergyTab}
              setActiveSynergyTab={setActiveSynergyTab}
              visibleCount={visibleCount}
              setVisibleCount={setVisibleCount}
              activeColors={activeColors}
              toggleColor={toggleColor}
              colors={colors}
              synergyCategories={synergyCategories}
              visibleSynergiesData={visibleSynergiesData}
            />
          ) : (
            <div>
              {(homeMode === "dashboard" || homeMode === "commanders") &&
                selectedCommander === "Tutti i mazzi" && (
                  <div className="animate-fade-in mb-14">
                    <HeroSection
                      homeMode={homeMode}
                      setHomeMode={setHomeMode}
                      commanderSearch={commanderSearch}
                      setCommanderSearch={setCommanderSearch}
                      dashboardLoading={dashboardLoading}
                      dashboardData={dashboardData}
                      handleResetHome={handleResetHome}
                      commanderSort={commanderSort}
                      setCommanderSort={setCommanderSort}
                    />

                    {homeMode === "dashboard" && (
                      <>
                        {apiError && !dashboardLoading && !dashboardData ? (
                          <div className="mt-10 py-12 text-center text-slate-500 flex flex-col items-center animate-fade-in">
                            <p className="text-slate-300 font-bold mb-4">
                              {apiError}
                            </p>
                            <button
                              onClick={() => window.location.reload()}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold py-2.5 px-6 rounded-xl border border-slate-600 transition shadow-sm"
                            >
                              Riprova
                            </button>
                          </div>
                        ) : dashboardLoading || !dashboardData ? (
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 mt-10">
                            {[...Array(6)].map((_, i) => (
                              <SkeletonCard key={i} />
                            ))}
                          </div>
                        ) : (
                          <>
                            <Carousel
                              title="Comandanti Più Usati"
                              items={dashboardData.top_commanders}
                              isCard={false}
                              isHot={false}
                              viewAllHref="/?view=commanders&csort=top"
                              onViewAll={() =>
                                navigateToTab("commanders", "Top Cards", "top")
                              }
                              onItemClick={handleSelectCommander}
                            />
                            <Carousel
                              title="Comandanti Hot (7gg)"
                              items={dashboardData.hot_commanders}
                              isCard={false}
                              isHot={true}
                              viewAllHref="/?view=commanders&csort=hot"
                              onViewAll={() =>
                                navigateToTab("commanders", "Top Cards", "hot")
                              }
                              onItemClick={handleSelectCommander}
                            />
                            <Carousel
                              title="Carte Più Usate"
                              items={(dashboardData.top_cards || [])
                                .filter((c: any) => c.category !== "Terre")
                                .slice(0, 25)}
                              isCard={true}
                              isHot={false}
                              viewAllHref="/?view=cards&tab=Top+Cards&csort=top"
                              onViewAll={() =>
                                navigateToTab("cards", "Top Cards", "top")
                              }
                              onItemClick={handleSelectCard}
                            />
                            <Carousel
                              title="Carte Hot (7gg)"
                              items={(dashboardData.hot_cards || [])
                                .filter((c: any) => c.category !== "Terre")
                                .slice(0, 25)}
                              isCard={true}
                              isHot={true}
                              viewAllHref="/?view=cards&tab=Top+Cards&csort=hot"
                              onViewAll={() =>
                                navigateToTab("cards", "Top Cards", "hot")
                              }
                              onItemClick={handleSelectCard}
                            />
                          </>
                        )}
                      </>
                    )}

                    {homeMode === "commanders" && (
                      <CommandersGrid
                        colors={colors}
                        activeColors={activeColors}
                        toggleColor={toggleColor}
                        listToRender={listToRender}
                        visibleCount={visibleCount}
                        setVisibleCount={setVisibleCount}
                        commanderSort={commanderSort}
                        commanders={commanders}
                        handleSelectCommander={handleSelectCommander}
                        setCommanderSearch={setCommanderSearch}
                        setActiveColors={setActiveColors}
                        handleResetHome={handleResetHome}
                      />
                    )}
                  </div>
                )}

              {selectedCommander !== "Tutti i mazzi" && (
                <CommanderOverview
                  loading={loading}
                  selectedCommander={selectedCommander}
                  selectedCmdObj={selectedCmdObj}
                  isFlipped={isFlipped}
                  setIsFlipped={setIsFlipped}
                  showOracle={showOracle}
                  setShowOracle={setShowOracle}
                  statsData={statsData}
                  handleViewDecks={handleViewDecks}
                  handleTypeClick={handleTypeClick}
                  handleResetHome={handleResetHome}
                />
              )}

              {(homeMode === "cards" ||
                selectedCommander !== "Tutti i mazzi") && (
                <div id="content-section" className="animate-fade-in">
                  <CardsFilterBar
                    homeMode={homeMode}
                    selectedCommander={selectedCommander}
                    cardSort={cardSort}
                    setCardSort={setCardSort}
                    commanders={commanders}
                    handleSelectCommander={handleSelectCommander}
                    cardSearch={cardSearch}
                    setCardSearch={setCardSearch}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    categories={categories}
                    colors={colors}
                    activeColors={activeColors}
                    toggleColor={toggleColor}
                    setVisibleCount={setVisibleCount}
                    handleResetHome={handleResetHome}
                  />

                  {activeTab === "Liste Mazzi" ? (
                    <div className="animate-fade-in flex flex-col w-full">
                      <div className="w-full flex justify-start mb-6">
                        <a
                          href="#content-section"
                          onClick={(e) => handleNav(e, handleBackToCards)}
                          className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-bold py-2 px-6 rounded-full border border-slate-700 transition shadow-sm flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />{" "}
                          Torna alle Carte
                        </a>
                      </div>
                      <DeckList
                        loadingDecks={loadingDecks}
                        commanderDecks={commanderDecks}
                        copiedDeck={copiedDeck}
                        setCopiedDeck={setCopiedDeck}
                      />
                    </div>
                  ) : (
                    <CardsGrid
                      loading={loading}
                      visibleCardsData={visibleCardsData}
                      visibleCount={visibleCount}
                      setVisibleCount={setVisibleCount}
                      handleSelectCard={handleSelectCard}
                      handleNav={handleNav}
                      homeMode={homeMode}
                      cardSort={cardSort}
                      selectedCommander={selectedCommander}
                      activeTab={activeTab}
                      setCardSearch={setCardSearch}
                      setActiveColors={setActiveColors}
                      setActiveTab={setActiveTab}
                      handleResetHome={handleResetHome}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
