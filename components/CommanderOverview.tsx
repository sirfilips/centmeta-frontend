"use client";

import React, { useState } from "react";
import { handleNav } from "../utils/navigation";
import { handleCardDragStart } from "../utils/dragCard";
import { CATEGORY_INFO } from "../utils/mtg";
import {
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Share2,
  Check,
} from "lucide-react";

interface CommanderOverviewProps {
  loading: boolean;
  selectedCommander: string;
  selectedCmdObj: any;
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  showOracle: boolean;
  setShowOracle: (val: boolean) => void;
  statsData: {
    total_decks: number;
    avg_lands?: number;
    mana_curve?: any;
    type_distribution?: any;
    cards?: any[];
  };
  handleViewDecks: () => void;
  handleTypeClick: (type: string) => void;
  handleResetHome: () => void;
}

export default function CommanderOverview({
  loading,

  selectedCommander,

  selectedCmdObj,

  isFlipped,

  setIsFlipped,

  showOracle,

  setShowOracle,

  statsData,

  handleViewDecks,

  handleTypeClick,

  handleResetHome,
}: CommanderOverviewProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/commander/${encodeURIComponent(selectedCommander)}`
        : `https://centmeta.it/commander/${encodeURIComponent(selectedCommander)}`;

    // Rileva se è un vero dispositivo mobile (smartphone/tablet)
    const isMobile =
      typeof navigator !== "undefined" &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      ) ||
        (navigator.maxTouchPoints > 1 && window.innerWidth < 1024));

    // Su mobile apre la comoda condivisione nativa (WhatsApp, Telegram, ecc.)
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `${selectedCommander} | CentMeta`,
          text: `Analisi, statistiche e migliori carte per ${selectedCommander} nel formato Centurion Commander`,
          url: url,
        });
        return;
      } catch (err: any) {
        if (err.name === "AbortError") return;
      }
    }

    // Su PC: copia rapida e silenziosa negli appunti senza finestre di sistema
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch (err) {
      console.error("Impossibile copiare il link", err);
    }
  };
  return (
    <section
      className={`mb-8 md:mb-10 border border-slate-800 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row items-center lg:items-start gap-5 md:gap-12 shadow-2xl relative overflow-hidden transition-all duration-500 ${loading ? "bg-slate-950/80" : "bg-slate-900/40 animate-fade-in"}`}
    >
      {/* Loading overlay */}
      <div
        className={`absolute inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center gap-3 bg-slate-900/90 p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
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
          <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">
            Analisi in corso...
          </span>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-900 z-10"></div>
      <div
        className={`relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-5 md:gap-12 w-full transition-opacity duration-300 ${loading ? "opacity-40 grayscale-[30%]" : "opacity-100"}`}
      >
        {/* Immagine Comandante (Partner / Flip / Singola con Drag & Drop) */}
        <div className="relative group flex justify-center items-center flex-shrink-0 mx-auto lg:mx-0 w-44 sm:w-56 md:w-64 xl:w-[350px]">
          {selectedCommander.includes(" / ") &&
          !selectedCommander.includes(" // ") ? (
            <div className="relative w-full aspect-[2.5/3.5] flex-shrink-0 flex justify-center items-center">
              <img
                src={selectedCmdObj?.images?.[0]}
                draggable={true}
                onDragStart={(e) =>
                  handleCardDragStart(
                    e,
                    selectedCommander.split(" / ")[0],
                    selectedCmdObj?.images?.[0],
                  )
                }
                className="absolute w-[75%] max-h-full object-contain rounded-2xl shadow-xl border border-slate-700/50 -translate-x-4 md:-translate-x-8 -translate-y-3 md:-translate-y-6 -rotate-6 z-10 hover:z-30 hover:scale-105 transition-all duration-300"
                alt="Partner 1"
              />
              <img
                src={selectedCmdObj?.images?.[1]}
                draggable={true}
                onDragStart={(e) =>
                  handleCardDragStart(
                    e,
                    selectedCommander.split(" / ")[1],
                    selectedCmdObj?.images?.[1],
                  )
                }
                className="absolute w-[75%] max-h-full object-contain rounded-2xl shadow-xl border border-slate-700/50 translate-x-4 md:translate-x-8 translate-y-3 md:translate-y-6 rotate-6 z-20 hover:z-30 hover:scale-105 transition-all duration-300"
                alt="Partner 2"
              />
            </div>
          ) : selectedCmdObj?.images && selectedCmdObj.images.length > 1 ? (
            <div className="relative w-full aspect-[2.5/3.5] [perspective:1000px] flex-shrink-0">
              <div
                className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
              >
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <img
                    src={selectedCmdObj.images[0]}
                    draggable={true}
                    onDragStart={(e) =>
                      handleCardDragStart(
                        e,
                        selectedCommander,
                        selectedCmdObj.images[0],
                      )
                    }
                    className="w-full h-full object-contain rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50"
                    alt="Face 1"
                  />
                </div>
                <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <img
                    src={selectedCmdObj.images[1]}
                    draggable={true}
                    onDragStart={(e) =>
                      handleCardDragStart(
                        e,
                        selectedCommander,
                        selectedCmdObj.images[1],
                      )
                    }
                    className="w-full h-full object-contain rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50"
                    alt="Face 2"
                  />
                </div>
              </div>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                title="Gira Carta"
                className="absolute -bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-lg border-2 border-blue-400 z-20 transition-transform hover:scale-110"
              >
                <RefreshCw
                  className="w-5 h-5 md:w-6 md:h-6"
                  strokeWidth={2.5}
                />
              </button>
            </div>
          ) : selectedCmdObj?.images && selectedCmdObj.images.length === 1 ? (
            <img
              src={selectedCmdObj.images[0]}
              draggable={true}
              onDragStart={(e) =>
                handleCardDragStart(
                  e,
                  selectedCommander,
                  selectedCmdObj.images[0],
                )
              }
              className="w-full object-contain rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50 flex-shrink-0"
              alt={selectedCommander}
            />
          ) : null}
        </div>
        {/* Pannello Dati: Titolo, Oracle, Mazzi, Mana Curve, Composizione */}
        <div className="flex flex-col gap-3 md:gap-4 w-full flex-1 relative isolate rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 border border-slate-700/50 shadow-xl min-h-[auto] lg:min-h-[320px] justify-start">
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden -z-20 pointer-events-none [mask-image:linear-gradient(white,white)] [transform:translateZ(0)]">
            {selectedCmdObj?.art_crops?.[0] && (
              <div
                className="absolute -inset-8 bg-cover bg-center filter blur-md opacity-80"
                style={{
                  backgroundImage: `url("${selectedCmdObj.art_crops[0]}")`,
                }}
              ></div>
            )}
            <div className="absolute inset-0 bg-slate-950/70 md:bg-slate-950/50 backdrop-blur-sm"></div>
          </div>
          <div className="relative z-10 flex flex-col gap-2 md:gap-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center lg:text-left">
              <div>
                <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold bg-blue-950/50 px-2.5 py-1 md:px-3 md:py-1 rounded-full border border-blue-900/50 shadow-inner inline-block">
                  Comandante Analizzato
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mt-2 md:mt-3 drop-shadow-md leading-tight">
                  {selectedCommander}
                </h1>
              </div>

              {/* Tasto Condividi Comandante */}
              <button
                onClick={handleShare}
                className={`self-center lg:self-start inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md border shrink-0 ${
                  isCopied
                    ? "bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-emerald-900/30 scale-105"
                    : "bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white border-slate-700 hover:border-slate-600 shadow-slate-950/50 hover:scale-105 active:scale-95"
                }`}
                title="Condividi questo comandante"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                    <span>Link Copiato!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
                    <span>Condividi</span>
                  </>
                )}
              </button>
            </div>
            {selectedCmdObj?.oracles && selectedCmdObj.oracles.length > 0 && (
              <div className="flex flex-col gap-2 mt-2 md:mt-4">
                <button
                  onClick={() => setShowOracle(!showOracle)}
                  className="lg:hidden flex items-center justify-between text-[11px] font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-700/50 shadow-sm transition-colors"
                >
                  <span>Testo della carta (Oracle)</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    {showOracle ? (
                      <>
                        <ChevronUp className="w-3 h-3" /> Nascondi
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" /> Mostra
                      </>
                    )}
                  </span>
                </button>
                <div
                  className={`flex-col gap-2 ${showOracle ? "flex" : "hidden lg:flex"}`}
                >
                  {selectedCmdObj.oracles.map((oracle: string, idx: number) => (
                    <p
                      key={idx}
                      className="text-slate-200 text-xs md:text-base bg-slate-950/80 md:bg-slate-950/60 p-4 md:p-5 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed shadow-inner"
                    >
                      {oracle}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col xl:flex-row flex-wrap items-stretch gap-3 md:gap-4 mt-3 md:mt-5">
              {/* Box Mazzi Trovati */}
              <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-sm flex flex-col w-full xl:w-auto xl:min-w-[160px] overflow-hidden">
                <div className="px-4 py-3 md:px-6 md:py-5 flex-1 flex flex-col justify-center items-center xl:items-start text-center xl:text-left">
                  <span className="text-[10px] md:text-xs text-slate-400 block mb-0.5 md:mb-2 font-medium">
                    Mazzi Trovati
                  </span>
                  <span className="text-3xl md:text-4xl font-black text-blue-400">
                    {statsData.total_decks}
                  </span>
                </div>
                {statsData.total_decks > 0 && (
                  <a
                    href="#content-section"
                    onClick={(e) => handleNav(e, handleViewDecks)}
                    className="bg-slate-900/60 hover:bg-slate-700/80 border-t border-slate-700/50 px-4 py-2.5 md:px-6 md:py-3 flex items-center justify-center xl:justify-between transition-all group cursor-pointer gap-2"
                  >
                    <span className="text-xs md:text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                      Liste Mazzi
                    </span>
                    <ArrowRight
                      className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
                      strokeWidth={2.5}
                    />
                  </a>
                )}
              </div>
              {/* Grafico Curva del Mana */}
              {statsData.mana_curve &&
                Object.keys(statsData.mana_curve).length > 0 && (
                  <div className="bg-slate-800/80 px-4 py-4 md:px-6 md:py-5 rounded-xl border border-slate-700/50 shadow-sm flex flex-col flex-1 w-full xl:max-w-[450px]">
                    <span className="text-[10px] md:text-xs text-slate-400 block mb-2 md:mb-4 font-medium text-center xl:text-left">
                      Curva del Mana Media
                    </span>
                    <div className="flex flex-col h-16 md:h-24 w-full">
                      <div className="flex items-end justify-start gap-1 sm:gap-2 h-full w-full border-b border-slate-700/50 pb-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((cmc) => {
                          const val = statsData.mana_curve[cmc] || 0;
                          const maxVal = Math.max(
                            ...(Object.values(
                              statsData.mana_curve,
                            ) as number[]),
                          );
                          const height =
                            maxVal > 0 ? `${(val / maxVal) * 100}%` : "0%";
                          return (
                            <div
                              key={cmc}
                              className="flex-1 flex flex-col justify-end group relative h-full"
                            >
                              <div
                                className="w-full bg-blue-500/80 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400"
                                style={{ height }}
                              ></div>
                              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-200 text-[9px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700/50">
                                <span className="font-bold text-blue-400">
                                  {val}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-start gap-1 sm:gap-2 w-full mt-1.5">
                        {[0, 1, 2, 3, 4, 5, 6].map((cmc) => (
                          <span
                            key={`label-${cmc}`}
                            className="flex-1 text-center text-[9px] md:text-[10px] text-slate-400 font-bold leading-none"
                          >
                            {cmc}
                            {cmc === 6 ? "+" : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              {/* Grafico Composizione Media */}
              {statsData.type_distribution &&
                Object.keys(statsData.type_distribution).length > 0 && (
                  <div className="bg-slate-800/80 px-4 py-4 md:px-6 md:py-5 rounded-xl border border-slate-700/50 shadow-sm flex flex-col flex-1 w-full xl:max-w-[450px]">
                    <span className="text-[10px] md:text-xs text-slate-400 block mb-2 md:mb-4 font-medium text-center xl:text-left">
                      Composizione Media
                    </span>
                    <div className="flex flex-col gap-3 md:gap-5 h-full justify-center">
                      <div className="flex w-full h-3 md:h-4 rounded-md overflow-hidden bg-slate-900 shadow-inner gap-[1px]">
                        {Object.entries(statsData.type_distribution)
                          .sort(([typeA, countA], [typeB, countB]) => {
                            if (typeA === "Terre") return 1;
                            if (typeB === "Terre") return -1;
                            return (countB as number) - (countA as number);
                          })
                          .map(([type, count]) => {
                            const totalCards = Object.values(
                              statsData.type_distribution,
                            ).reduce((a: any, b: any) => a + b, 0) as number;
                            const perc = ((count as number) / totalCards) * 100;
                            const width = `${perc}%`;
                            let bgColor = "bg-slate-500";
                            if (type === "Creature") bgColor = "bg-emerald-500";
                            if (type === "Istantanei") bgColor = "bg-blue-500";
                            if (type === "Stregonerie") bgColor = "bg-red-500";
                            if (type === "Artefatti") bgColor = "bg-slate-400";
                            if (type === "Incantesimi")
                              bgColor = "bg-purple-500";
                            if (type === "Planeswalker")
                              bgColor = "bg-pink-500";
                            if (type === "Terre") bgColor = "bg-yellow-600";
                            return (
                              <div
                                key={type}
                                onClick={() => handleTypeClick(type)}
                                style={{ width }}
                                className={`${bgColor} h-full transition-all hover:brightness-125 hover:scale-105 cursor-pointer`}
                                title={`Filtra per ${type}: ${Math.round(count as number)} carte (${perc.toFixed(1)}%)`}
                              />
                            );
                          })}
                      </div>
                      <div className="flex flex-wrap justify-center xl:justify-start gap-x-3 gap-y-1.5 mt-1">
                        {Object.entries(statsData.type_distribution)
                          .sort(([typeA, countA], [typeB, countB]) => {
                            if (typeA === "Terre") return 1;
                            if (typeB === "Terre") return -1;
                            return (countB as number) - (countA as number);
                          })
                          .map(([type, count]) => {
                            let dotColor =
                              CATEGORY_INFO[type]?.dotColor || "text-slate-500";
                            let iconClass = CATEGORY_INFO[type]?.icon || "";
                            return (
                              <div
                                key={type}
                                onClick={() => handleTypeClick(type)}
                                title={`Filtra per ${type}`}
                                className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-slate-300 font-medium cursor-pointer hover:text-white transition-colors group"
                              >
                                <i
                                  className={`ms ${iconClass} ${dotColor} text-sm group-hover:scale-110 transition-transform`}
                                ></i>
                                <span>
                                  {type} ({Math.round(count as number)})
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <a
              href="/"
              onClick={(e) => handleNav(e, handleResetHome)}
              className="mt-4 md:mt-6 self-center lg:self-start bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-xs md:text-sm font-bold px-6 py-3 md:px-8 md:py-3.5 rounded-full transition-all duration-300 shadow-md border border-blue-500/30 inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Torna alla
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
