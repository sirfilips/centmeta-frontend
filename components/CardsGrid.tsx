import React from "react";
import { ArrowDown, ArrowLeft, Sparkles } from "lucide-react";
import SkeletonCard from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { handleCardDragStart } from "../utils/dragCard";

interface CardsGridProps {
  loading: boolean;
  visibleCardsData: any[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  handleSelectCard: (name: string) => void;
  handleNav: (e: React.MouseEvent, action: () => void) => void;
  homeMode: "dashboard" | "commanders" | "cards";
  cardSort: "top" | "hot";
  selectedCommander: string;
  activeTab: string;
  setCardSearch: (val: string) => void;
  setActiveColors: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTab: (tab: any) => void;
  handleResetHome: () => void;
}

export const CardsGrid: React.FC<CardsGridProps> = ({
  loading,
  visibleCardsData,
  visibleCount,
  setVisibleCount,
  handleSelectCard,
  handleNav,
  homeMode,
  cardSort,
  selectedCommander,
  activeTab,
  setCardSearch,
  setActiveColors,
  setActiveTab,
  handleResetHome,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
        {[...Array(14)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 hidden sm:flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/70 border border-slate-800/80 rounded-xl text-xs text-slate-400">
        <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
        <span>
          <strong className="text-slate-200">Deckbuilding rapido:</strong>{" "}
          Trascina qualsiasi carta o comandante direttamente su una scheda di
          Moxfield per aggiungerlo al tuo mazzo.
        </span>
      </div>
      {visibleCardsData.length === 0 ? (
        <EmptyState
          message="Nessuna carta trovata con i filtri attuali."
          onResetFilters={() => {
            setCardSearch("");
            setActiveColors([]);
            setActiveTab("Top Cards");
          }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-10 gap-x-6">
          {visibleCardsData
            .slice(0, visibleCount)
            .map((card: any, idx: number) => {
              const displayImages =
                card.images?.length > 0 ? [card.images[0]] : [];
              return (
                <a
                  key={idx}
                  href={`/?card=${encodeURIComponent(card.card_name)}`}
                  onClick={(e) =>
                    handleNav(e, () => handleSelectCard(card.card_name))
                  }
                  draggable={true}
                  onDragStart={(e) =>
                    handleCardDragStart(e, card.card_name, displayImages[0])
                  }
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="relative w-full aspect-[2.5/3.5] flex justify-center items-center mb-2 md:mb-3">
                    {displayImages.length === 1 ? (
                      <img
                        src={displayImages[0]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(
                            e,
                            card.card_name,
                            displayImages[0],
                          )
                        }
                        className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 group-hover:shadow-blue-900/30 transition-all duration-300 object-contain"
                        alt={card.card_name}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
                        {card.card_name}
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full px-1">
                    <div
                      className="font-bold text-xs text-slate-200 truncate"
                      title={card.card_name}
                    >
                      {card.card_name}
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-1.5 mt-1">
                      {homeMode === "cards" &&
                      cardSort === "hot" &&
                      selectedCommander === "Tutti i mazzi" ? (
                        <>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {card.freq} mazzi
                          </span>
                          <div className="group/delta relative flex items-center cursor-help">
                            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold">
                              +{card.delta}
                            </span>
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden sm:group-hover/delta:block w-40 p-2.5 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none text-center font-normal">
                              <strong className="text-orange-400 block mb-1">
                                Trend Positivo
                              </strong>
                              Nuovi mazzi in cui è stata inclusa negli ultimi 7
                              giorni.
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-[11px] text-blue-400 font-semibold">
                            {card.Percentuale}%{" "}
                            <span className="text-slate-500 font-normal">
                              ({card.freq})
                            </span>
                          </div>
                          {(activeTab === "Top Sinergie" ||
                            activeTab === "In Crescita") &&
                            card.Sinergia > 0 && (
                              <div className="group/syn relative flex items-center cursor-help">
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                                  +{card.Sinergia}%
                                </span>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden sm:group-hover/syn:block w-48 p-2.5 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none text-center font-normal">
                                  <strong className="text-emerald-400 block mb-1">
                                    Valore Sinergia
                                  </strong>
                                  Indica quanto questa carta è giocata in più in
                                  questo mazzo rispetto alla media globale.
                                </div>
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
        </div>
      )}

      {visibleCardsData.length > visibleCount && (
        <div className="mt-14 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + 50)}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-bold py-3 px-10 rounded-full border border-slate-700 transition shadow-lg flex items-center justify-center gap-1.5 mx-auto"
          >
            Mostra altre carte{" "}
            <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      {homeMode === "cards" && (
        <div className="mt-8 text-left">
          <a
            href="/"
            onClick={(e) => handleNav(e, handleResetHome)}
            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-md border border-blue-500/30 inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Torna alla
            Dashboard
          </a>
        </div>
      )}
    </>
  );
};
