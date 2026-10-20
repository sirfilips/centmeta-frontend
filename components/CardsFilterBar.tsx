"use client";
import React from "react";
import { handleNav } from "../utils/navigation";
import { CATEGORY_INFO } from "../utils/mtg";
import { ArrowLeft } from "lucide-react";

interface CardsFilterBarProps {
  homeMode: "dashboard" | "commanders" | "cards";
  selectedCommander: string;
  cardSort: "top" | "hot";
  setCardSort: (val: "top" | "hot") => void;
  commanders: any[];
  handleSelectCommander: (val: string) => void;
  cardSearch: string;
  setCardSearch: (val: string) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  categories: string[];
  colors: { label: string; val: string; icon?: string | null }[];
  activeColors: string[];
  toggleColor: (val: string) => void;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  handleResetHome: () => void;
}

export default function CardsFilterBar({
  homeMode,
  selectedCommander,
  cardSort,
  setCardSort,
  commanders,
  handleSelectCommander,
  cardSearch,
  setCardSearch,
  activeTab,
  setActiveTab,
  categories,
  colors,
  activeColors,
  toggleColor,
  setVisibleCount,
  handleResetHome,
}: CardsFilterBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md pt-4 pb-3 border-b border-slate-800/80 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        {homeMode === "cards" && selectedCommander === "Tutti i mazzi" ? (
          <>
            <a
              href="/"
              onClick={(e) => handleNav(e, handleResetHome)}
              className="text-xl font-black text-slate-100 flex items-center gap-2 cursor-pointer group"
            >
              <ArrowLeft
                className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors"
                strokeWidth={2.5}
              />
              <span className="w-1.5 h-6 bg-blue-500 rounded-full ml-1"></span>{" "}
              Tutte le Carte
            </a>
            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setCardSort("top")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${cardSort === "top" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
              >
                Top
              </button>
              <button
                onClick={() => setCardSort("hot")}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${cardSort === "hot" ? "bg-orange-500 text-white shadow" : "text-slate-400 hover:text-slate-200"}`}
              >
                Hot (7gg)
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
            <select
              value={selectedCommander}
              onChange={(e) => handleSelectCommander(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-semibold w-full sm:w-80 focus:outline-none focus:border-blue-500 text-slate-200 shadow-inner"
            >
              <option value="Tutti i mazzi">
                Tutti i mazzi (Seleziona Comandante)
              </option>
              {commanders.map((c, idx) => (
                <option key={idx} value={c.comandante}>
                  {c.comandante}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {activeTab !== "Liste Mazzi" && (
            <input
              type="text"
              placeholder="Filtra carte per nome..."
              value={cardSearch}
              onChange={(e) => setCardSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-full px-5 py-2 text-sm w-full sm:w-72 focus:outline-none focus:border-blue-500 text-slate-200"
            />
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {activeTab !== "Liste Mazzi" && (
          <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {categories.map((cat) => {
              const iconClass = CATEGORY_INFO[cat]?.icon || "";
              return (
                <div key={cat} className="relative group/tab flex items-center">
                  <button
                    onClick={() => {
                      setActiveTab(cat);
                      setVisibleCount(50);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      activeTab === cat
                        ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                    }`}
                  >
                    {iconClass && (
                      <i className={`ms ${iconClass} text-[13px]`}></i>
                    )}
                    <span>{cat}</span>
                  </button>
                  {(cat === "In Crescita" || cat === "Top Sinergie") && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden sm:group-hover/tab:block w-48 p-2.5 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none text-center whitespace-normal leading-relaxed">
                      {cat === "In Crescita"
                        ? "Carte con il maggiore incremento globale di utilizzo negli ultimi 7 giorni."
                        : "Carte con il tasso di affinità e inclusione più alto per questo specifico comandante."}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {activeTab !== "Liste Mazzi" && (
          <div className="flex gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                  className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all border flex items-center justify-center min-w-[40px] h-8 ${
                    isActive
                      ? "bg-slate-700 text-white border-slate-500 shadow-inner"
                      : "bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800"
                  }`}
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
        )}
      </div>
    </div>
  );
}
