"use client";

import React from "react";
import { handleNav } from "../utils/navigation";
import { handleCardDragStart } from "../utils/dragCard";
import EmptyState from "./EmptyState";
import TrendIndicator from "./TrendIndicator";
import { ArrowLeft, ArrowDown } from "lucide-react";

interface CommandersGridProps {
  colors: { label: string; val: string; icon?: string | null }[];
  activeColors: string[];
  toggleColor: (val: string) => void;
  listToRender: any[];
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  commanderSort: "top" | "hot";
  commanders: any[];
  handleSelectCommander: (name: string) => void;
  setCommanderSearch: (val: string) => void;
  setActiveColors: React.Dispatch<React.SetStateAction<string[]>>;
  handleResetHome: () => void;
}

export default function CommandersGrid({
  colors,

  activeColors,

  toggleColor,

  listToRender,

  visibleCount,

  setVisibleCount,

  commanderSort,

  commanders,

  handleSelectCommander,

  setCommanderSearch,

  setActiveColors,

  handleResetHome,
}: CommandersGridProps) {
  return (
    <>
      {/* Filtri Colore Comandante */}
      <div className="flex justify-center sm:justify-start gap-1.5 overflow-x-auto pb-6 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
              className={`px-3 py-1.5 rounded-lg flex items-center justify-center min-w-[44px] h-9 transition-all border ${
                isActive
                  ? "bg-slate-700 text-white border-slate-500 shadow-inner"
                  : "bg-slate-900/50 text-slate-500 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {col.icon ? (
                <i className={`${col.icon} text-lg`}></i>
              ) : (
                <span className="text-xs font-bold">{col.label}</span>
              )}
            </button>
          );
        })}
      </div>
      {listToRender.length === 0 ? (
        <EmptyState
          message="Nessun comandante trovato con questi filtri."
          onResetFilters={() => {
            setCommanderSearch("");
            setActiveColors([]);
          }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-10 gap-x-6">
          {listToRender.slice(0, visibleCount).map((cmd: any) => {
            const isHotSort = commanderSort === "hot";
            const cmdName = isHotSort ? cmd.name : cmd.comandante;
            const count = isHotSort ? cmd.val1 : cmd.cnt;
            const globalRank = isHotSort
              ? null
              : commanders.findIndex((c) => c.comandante === cmdName) + 1;
            const isPartner =
              cmdName.includes(" / ") && !cmdName.includes(" // ");
            return (
              <a
                key={cmdName}
                href={`/commander/${encodeURIComponent(cmdName)}`}
                onClick={(e) =>
                  handleNav(e, () => handleSelectCommander(cmdName))
                }
                draggable={true}
                onDragStart={(e) =>
                  handleCardDragStart(
                    e,
                    isPartner ? cmdName.split(" / ")[0] : cmdName,
                    cmd.images?.[0],
                  )
                }
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="relative w-full aspect-[2.5/3.5] flex justify-center items-center mb-2 md:mb-3">
                  {isPartner && cmd.images?.length > 1 ? (
                    <div className="relative w-full h-full flex justify-center items-center">
                      <img
                        src={cmd.images[0]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(
                            e,
                            cmdName.split(" / ")[0],
                            cmd.images[0],
                          )
                        }
                        className="absolute w-[65%] max-h-[90%] object-contain rounded-xl shadow-lg -translate-x-4 -translate-y-2 -rotate-6 z-10 hover:z-30 hover:scale-110 transition-all duration-300"
                        alt="Partner 1"
                      />
                      <img
                        src={cmd.images[1]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(
                            e,
                            cmdName.split(" / ")[1],
                            cmd.images[1],
                          )
                        }
                        className="absolute w-[65%] max-h-[90%] object-contain rounded-xl shadow-lg translate-x-4 translate-y-2 rotate-6 z-20 hover:z-30 hover:scale-110 transition-all duration-300"
                        alt="Partner 2"
                      />
                    </div>
                  ) : cmd.images?.length > 0 ? (
                    <img
                      src={cmd.images[0]}
                      draggable={true}
                      onDragStart={(e) =>
                        handleCardDragStart(e, cmdName, cmd.images[0])
                      }
                      className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 group-hover:shadow-blue-900/40 transition-all duration-300 object-contain"
                      alt={cmdName}
                    />
                  ) : (
                    <div className="text-xs text-slate-500 w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                      {cmdName}
                    </div>
                  )}
                </div>
                <div className="text-center w-full px-1">
                  <div
                    className="font-bold text-sm text-slate-200 truncate flex items-center justify-center gap-1.5"
                    title={cmdName}
                  >
                    {!isHotSort && (
                      <span className="bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-black">
                        #{globalRank}
                      </span>
                    )}
                    <span className="truncate">{cmdName}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {count} mazzi
                    </span>
                    {isHotSort ? (
                      <TrendIndicator delta={cmd.delta} />
                    ) : (
                      <TrendIndicator trend={cmd.trend} />
                    )}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}
      {listToRender.length > visibleCount && (
        <div className="mt-14 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + 50)}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-bold py-3 px-10 rounded-full border border-slate-700 transition shadow-lg flex items-center justify-center gap-2 mx-auto"
          >
            Mostra altri <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
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
    </>
  );
}
