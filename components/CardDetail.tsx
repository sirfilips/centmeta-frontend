import React, { useState } from "react";
import SkeletonCard from "./SkeletonCard";
import { EmptyState } from "./EmptyState";
import { CATEGORY_INFO } from "../utils/mtg";
import { handleNav } from "../utils/navigation";
import { handleCardDragStart } from "../utils/dragCard";
import { RefreshCw, Share2, Check } from "lucide-react";

interface CardDetailProps {
  selectedCardDetail: string;
  setSelectedCardDetail: (val: string | null) => void;
  loadingCardDetail: boolean;
  cardDetailData: any;
  filtroTempo: string;
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  commanders: any[];
  setSelectedCommander: (val: string) => void;
  setCommanderSearch: (val: string) => void;
  setActiveTab: (val: string) => void;
  activeSynergyTab: string;
  setActiveSynergyTab: (val: string) => void;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  activeColors: string[];
  toggleColor: (val: string) => void;
  colors: { label: string; val: string; icon?: string | null }[];
  synergyCategories: string[];
  visibleSynergiesData: any[];
}

export default function CardDetail({
  selectedCardDetail,
  setSelectedCardDetail,
  loadingCardDetail,
  cardDetailData,
  filtroTempo,
  isFlipped,
  setIsFlipped,
  commanders,
  setSelectedCommander,
  setCommanderSearch,
  setActiveTab,
  activeSynergyTab,
  setActiveSynergyTab,
  visibleCount,
  setVisibleCount,
  activeColors,
  toggleColor,
  colors,
  synergyCategories,
  visibleSynergiesData,
}: CardDetailProps) {
  const [isCopied, setIsCopied] = useState(false);

  const periodQuery =
    filtroTempo && filtroTempo !== "Ultimi 30 giorni"
      ? `?periodo=${encodeURIComponent(filtroTempo)}`
      : "";
  const periodParam =
    filtroTempo && filtroTempo !== "Ultimi 30 giorni"
      ? `&periodo=${encodeURIComponent(filtroTempo)}`
      : "";

  const handleShare = async () => {
    const cName = cardDetailData?.card_name || selectedCardDetail;
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://centmeta.it";
    const url = `${origin}/?card=${encodeURIComponent(cName)}${periodParam}`;

    const isMobile =
      typeof navigator !== "undefined" &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth < 1024));

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `${cName} | CentMeta`,
          text: `Statistiche, comandanti principali e sinergie per ${cName} nel formato Centurion Commander`,
          url,
        });
        return;
      } catch (err: any) {
        if (err.name === "AbortError") return;
      }
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        throw new Error("Clipboard API non supportata");
      }
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (fallbackErr) {
        console.error("Impossibile copiare il link:", fallbackErr);
      }
    }
  };

  return (
    <div>
      <a
        href="/"
        onClick={(e) => handleNav(e, () => setSelectedCardDetail(null))}
        className="mb-6 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition border border-slate-700 shadow-sm inline-block"
      >
        ← Torna alle Statistiche
      </a>
      {loadingCardDetail ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6 mt-12">
          {[...Array(14)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        cardDetailData && (
          <div className="space-y-12">
            <div className="border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 shadow-2xl relative bg-slate-900/40">
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full">
                <div className="flex justify-center items-center flex-shrink-0 mx-auto md:mx-0 w-full md:w-auto xl:w-[350px]">
                  {cardDetailData.images && cardDetailData.images.length > 1 ? (
                    <div className="relative w-56 md:w-72 xl:w-80 aspect-[2.5/3.5] [perspective:1000px] group">
                      <div
                        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
                      >
                        <div className="absolute inset-0 [backface-visibility:hidden]">
                          <img
                            src={cardDetailData.images[0]}
                            draggable={true}
                            onDragStart={(e) =>
                              handleCardDragStart(
                                e,
                                cardDetailData.card_name || selectedCardDetail,
                                cardDetailData.images[0],
                              )
                            }
                            className="w-full h-full object-contain rounded-2xl shadow-xl border border-slate-700/50"
                            alt="Face 1"
                          />
                        </div>
                        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <img
                            src={cardDetailData.images[1]}
                            draggable={true}
                            onDragStart={(e) =>
                              handleCardDragStart(
                                e,
                                cardDetailData.card_name || selectedCardDetail,
                                cardDetailData.images[1],
                              )
                            }
                            className="w-full h-full object-contain rounded-2xl shadow-xl border border-slate-700/50"
                            alt="Face 2"
                          />
                        </div>
                      </div>
                      {/* Pulsante Flip con Icona SVG */}
                      <button
                        onClick={() => setIsFlipped(!isFlipped)}
                        title="Gira Carta"
                        className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg border-2 border-blue-400 z-20 transition-transform hover:scale-110"
                      >
                        <RefreshCw
                          className="w-5 h-5 md:w-6 md:h-6"
                          strokeWidth={2.5}
                        />
                      </button>
                    </div>
                  ) : cardDetailData.images &&
                    cardDetailData.images.length === 1 ? (
                    <div className="relative group w-56 md:w-72 xl:w-80">
                      <img
                        src={cardDetailData.images[0]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(
                            e,
                            cardDetailData.card_name || selectedCardDetail,
                            cardDetailData.images[0],
                          )
                        }
                        className="w-full object-contain rounded-2xl shadow-xl border border-slate-700/50"
                        alt={cardDetailData.card_name || selectedCardDetail}
                      />
                    </div>
                  ) : (
                    <div className="w-56 md:w-72 h-80 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 px-4 text-center">
                      {cardDetailData.card_name || selectedCardDetail}
                    </div>
                  )}
                </div>
                {/* PANNELLO ESTESO (flex-1) */}
                <div className="flex flex-col gap-4 w-full flex-1 relative isolate overflow-hidden rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-xl min-h-[320px] justify-center">
                  {cardDetailData.art_crops?.[0] && (
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-md scale-110 opacity-80 -z-20 pointer-events-none"
                      style={{
                        backgroundImage: `url("${cardDetailData.art_crops[0]}")`,
                      }}
                    ></div>
                  )}
                  <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm -z-10"></div>
                  <div className="relative z-10 flex flex-col gap-4 w-full">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold bg-blue-950/50 px-3 py-1 rounded-full border border-blue-900/50 shadow-inner">
                          Analisi Carta ({filtroTempo})
                        </span>
                        <button
                          onClick={handleShare}
                          title="Condividi o copia link carta"
                          className={`hidden lg:inline-flex text-xs font-bold px-3.5 py-1.5 rounded-full transition-all duration-300 shadow-sm border items-center gap-1.5 ${
                            isCopied
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2.5} />
                              <span>Link copiato!</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3.5 h-3.5 text-blue-400" strokeWidth={2.5} />
                              <span>Condividi</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-md">
                          {cardDetailData.card_name || selectedCardDetail}
                        </h2>
                      </div>
                    </div>
                    {cardDetailData.oracles &&
                      cardDetailData.oracles.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                          {cardDetailData.oracles.map(
                            (oracle: string, idx: number) => (
                              <p
                                key={idx}
                                className="text-slate-200 text-sm md:text-base bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 whitespace-pre-line leading-relaxed shadow-inner"
                              >
                                {oracle}
                              </p>
                            ),
                          )}
                        </div>
                      )}
                    <div className="mt-4 bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 flex flex-col gap-1 shadow-sm">
                      <div className="text-sm md:text-base text-slate-200">
                        Presente in{" "}
                        <span className="text-blue-400 font-black text-xl">
                          {cardDetailData.total_decks_with_card ?? 0}
                        </span>{" "}
                        mazzi nella finestra temporale.
                      </div>
                      <div className="text-xs text-slate-400">
                        Totale storico registrato:{" "}
                        {cardDetailData.total_decks_global ?? 0} mazzi.
                      </div>
                    </div>
                    <div className="mt-2 flex lg:hidden justify-end">
                      <button
                        onClick={handleShare}
                        title="Condividi o copia link carta"
                        className={`text-sm font-bold px-5 py-3 rounded-full transition-all duration-300 shadow-md border inline-flex items-center justify-center gap-2 w-full sm:w-auto ${
                          isCopied
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : "bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border-slate-700"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                            <span>Link copiato!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                            <span>Condividi</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black mb-6 text-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>{" "}
                Comandanti Principali
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                {cardDetailData.commanders.map((cmd: any, idx: number) => {
                  const foundIdx = commanders.findIndex(
                    (c) => c.comandante === cmd.comandante,
                  );
                  const globalRank = foundIdx >= 0 ? foundIdx + 1 : idx + 1;
                  const isPartner =
                    cmd.comandante.includes(" / ") &&
                    !cmd.comandante.includes(" // ");
                  return (
                    <a
                      key={idx}
                      href={`/commander/${encodeURIComponent(cmd.comandante)}${periodQuery}`}
                      onClick={(e) =>
                        handleNav(e, () => {
                          setSelectedCommander(cmd.comandante);
                          setSelectedCardDetail(null);
                          setCommanderSearch("");
                          setActiveTab("Top Cards");
                        })
                      }
                      draggable={true}
                      onDragStart={(e) =>
                        handleCardDragStart(
                          e,
                          isPartner
                            ? cmd.comandante.split(" / ")[0]
                            : cmd.comandante,
                          cmd.images?.[0],
                        )
                      }
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div className="relative w-full h-72 flex justify-center items-center mb-3">
                        {isPartner && cmd.images?.length > 1 ? (
                          <div className="relative w-full h-full flex justify-center items-center">
                            <img
                              src={cmd.images[0]}
                              alt={cmd.comandante.split(" / ")[0]}
                              draggable={true}
                              onDragStart={(e) =>
                                handleCardDragStart(
                                  e,
                                  cmd.comandante.split(" / ")[0],
                                  cmd.images[0],
                                )
                              }
                              className="absolute w-[70%] max-h-[90%] object-contain rounded-xl shadow-lg -translate-x-3 -translate-y-1 -rotate-6 z-10 hover:z-30 hover:scale-110 transition-all duration-300"
                            />
                            <img
                              src={cmd.images[1]}
                              alt={cmd.comandante.split(" / ")[1]}
                              draggable={true}
                              onDragStart={(e) =>
                                handleCardDragStart(
                                  e,
                                  cmd.comandante.split(" / ")[1],
                                  cmd.images[1],
                                )
                              }
                              className="absolute w-[70%] max-h-[90%] object-contain rounded-xl shadow-lg translate-x-3 translate-y-3 rotate-6 z-20 hover:z-30 hover:scale-110 transition-all duration-300"
                            />
                          </div>
                        ) : cmd.images?.length > 0 ? (
                          <img
                            src={cmd.images[0]}
                            alt={cmd.comandante}
                            draggable={true}
                            onDragStart={(e) =>
                              handleCardDragStart(
                                e,
                                cmd.comandante,
                                cmd.images[0],
                              )
                            }
                            className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 group-hover:shadow-blue-900/30 transition-all duration-300 object-contain"
                          />
                        ) : (
                          <span className="text-xs text-slate-500 text-center">
                            {cmd.comandante}
                          </span>
                        )}
                      </div>
                      <div className="text-center w-full px-1">
                        <div
                          className="font-bold text-xs text-slate-200 truncate flex items-center justify-center gap-1.5"
                          title={cmd.comandante}
                        >
                          <span className="bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-black">
                            #{globalRank}
                          </span>
                          <span className="truncate">{cmd.comandante}</span>
                        </div>
                        <div className="flex flex-col items-center mt-1">
                          <div className="text-[11px] flex items-center justify-center gap-1 font-medium">
                            <span
                              className={`font-bold ${
                                cmd.Percentuale >= 70
                                  ? "text-blue-400"
                                  : cmd.Percentuale >= 40
                                  ? "text-cyan-400"
                                  : "text-slate-300"
                              }`}
                            >
                              {cmd.Percentuale}%
                            </span>
                            <span className="text-slate-500">
                              ({cmd.mazzi_carta}/{cmd.totale_comandante})
                            </span>
                          </div>
                          {/* Mini-Barra Compatta Centrata */}
                          <div className="w-14 bg-slate-800 rounded-full h-[2.5px] mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                cmd.Percentuale >= 70
                                  ? "bg-blue-400"
                                  : cmd.Percentuale >= 40
                                  ? "bg-cyan-400"
                                  : "bg-slate-500"
                              }`}
                              style={{
                                width: `${Math.min(100, Math.max(8, cmd.Percentuale))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black mb-4 text-slate-100 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>{" "}
                Sinergie Principali
              </h3>
              <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md pt-4 pb-4 border-b border-slate-800 mb-6 flex flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {synergyCategories.map((cat) => {
                    const iconClass = CATEGORY_INFO[cat]?.icon || "";
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveSynergyTab(cat);
                          setVisibleCount(50);
                        }}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          activeSynergyTab === cat
                            ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                        }`}
                      >
                        {iconClass && (
                          <i className={`ms ${iconClass} text-[13px]`}></i>
                        )}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {colors.map((col) => {
                    const isActive =
                      activeColors.length === 0
                        ? col.val === "Tutti"
                        : activeColors.includes(col.val);
                    return (
                      <button
                        key={col.val}
                        onClick={() => toggleColor(col.val)}
                        title={col.label}
                        className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all border flex items-center justify-center min-w-[40px] h-8 ${isActive ? "bg-slate-700 text-white border-slate-500 shadow-inner" : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"}`}
                      >
                        {col.icon ? (
                          <i className={`${col.icon} text-base`}></i>
                        ) : (
                          col.label
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
              {visibleSynergiesData.length === 0 ? (
                <EmptyState
                  message="Nessuna carta trovata con i filtri selezionati."
                  onResetFilters={
                    activeSynergyTab !== "Tutte" || activeColors.length > 0
                      ? () => {
                          setActiveSynergyTab("Tutte");
                          toggleColor("Tutti");
                        }
                      : undefined
                  }
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-8 gap-x-6">
                  {visibleSynergiesData
                    .slice(0, visibleCount)
                    .map((syn: any, idx: number) => {
                      const displayImages =
                        syn.images?.length > 0 ? [syn.images[0]] : [];
                      return (
                        <a
                          key={idx}
                          href={`/?card=${encodeURIComponent(syn.card_name)}${periodParam}`}
                          onClick={(e) =>
                            handleNav(e, () =>
                              setSelectedCardDetail(syn.card_name),
                            )
                          }
                          draggable={true}
                          onDragStart={(e) =>
                            handleCardDragStart(
                              e,
                              syn.card_name,
                              displayImages[0],
                            )
                          }
                          className="flex flex-col items-center group cursor-pointer"
                        >
                          <div className="relative w-full h-80 flex justify-center items-center mb-3">
                            {displayImages.length === 1 ? (
                              <img
                                src={displayImages[0]}
                                draggable={true}
                                onDragStart={(e) =>
                                  handleCardDragStart(
                                    e,
                                    syn.card_name,
                                    displayImages[0],
                                  )
                                }
                                className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 transition-transform duration-300 object-contain"
                                alt={syn.card_name}
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">
                                {syn.card_name}
                              </div>
                            )}
                          </div>
                          <div className="text-center w-full px-1">
                            <div
                              className="font-bold text-xs text-slate-200 truncate"
                              title={syn.card_name}
                            >
                              {syn.card_name}
                            </div>
                            <div className="flex flex-col items-center mt-1">
                              <div className="text-[11px] flex items-center justify-center gap-1 font-semibold">
                                <span
                                  className={`font-bold ${
                                    syn.Percentuale >= 70
                                      ? "text-blue-400"
                                      : syn.Percentuale >= 40
                                      ? "text-cyan-400"
                                      : "text-slate-300"
                                  }`}
                                >
                                  {syn.Percentuale}%
                                </span>
                                <span className="text-slate-500 font-normal">
                                  ({syn.freq} mazzi)
                                </span>
                              </div>
                              {/* Mini-Barra Compatta Centrata */}
                              <div className="w-14 bg-slate-800 rounded-full h-[2.5px] mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    syn.Percentuale >= 70
                                      ? "bg-blue-400"
                                      : syn.Percentuale >= 40
                                      ? "bg-cyan-400"
                                      : "bg-slate-500"
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.max(8, syn.Percentuale))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                </div>
              )}
              {visibleSynergiesData.length > visibleCount && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setVisibleCount((v) => v + 50)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold py-2.5 px-8 rounded-full border border-slate-700 transition shadow-sm"
                  >
                    Mostra altre carte ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
