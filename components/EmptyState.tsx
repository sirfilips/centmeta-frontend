"use client";
import React, { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  message: string;
  onResetFilters?: () => void;
}

export default function EmptyState({
  message,
  onResetFilters,
}: EmptyStateProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const quotes = [
    "Fblthp si è perso di nuovo... e anche la tua ricerca.",
    "«Totally Lost!» — Ha preso la svolta sbagliata nel Dedalo Implicito.",
    "«Non era questa la strada per Ravnica...»",
    "«Aiuto, c'è troppa gente qui intorno!»",
    "«Ha sempre odiato la folla. E i filtri di ricerca.»",
    "«Se mi trovi, peschi due carte!»",
  ];
  const handleFblthpClick = () => {
    setIsAnimating(true);
    setClickCount((prev) => prev + 1);
    setTimeout(() => setIsAnimating(false), 600);
  };
  const isFound = clickCount >= 5;
  const currentQuote = isFound
    ? "Incredibile! Hai aiutato Fblthp a ritrovare la strada nel meta!"
    : quotes[clickCount % quotes.length];
  return (
    <div className="py-16 text-center text-slate-500 flex flex-col items-center animate-fade-in select-none">
      <div
        className="relative group cursor-pointer inline-block"
        onClick={handleFblthpClick}
        title="Clicca su Fblthp!"
      >
        <img
          src="https://api.scryfall.com/cards/named?exact=Fblthp,+the+Lost&format=image&version=art_crop"
          alt="Fblthp, the Lost"
          className={`w-24 h-24 object-cover rounded-full border-4 border-slate-800 shadow-xl mb-4 transition-all duration-500 hover:border-blue-500 hover:scale-110 active:scale-95 ${
            isAnimating
              ? "rotate-[360deg] scale-125 ring-4 ring-blue-400"
              : "hover:rotate-6"
          } ${isFound ? "border-emerald-500 shadow-emerald-500/20" : ""}`}
        />
        {clickCount > 0 && (
          <span
            className={`absolute -top-1 -right-1 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border shadow animate-pulse ${
              isFound
                ? "bg-emerald-600 border-emerald-400"
                : "bg-blue-600 border-blue-400"
            }`}
          >
            +{clickCount}
          </span>
        )}
      </div>
      <p
        className={`font-bold text-sm sm:text-base max-w-md transition-all duration-300 flex items-center justify-center gap-1.5 ${isFound ? "text-emerald-400" : "text-slate-200"}`}
      >
        {isFound && <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />}
        <span>{currentQuote}</span>
        {isFound && <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />}
      </p>
      <p className="text-xs sm:text-sm mt-1.5 text-slate-500">{message}</p>
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className={`mt-4 inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all duration-300 shadow-sm ${
            isFound
              ? "bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-white border border-emerald-500/40 animate-bounce"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Azzera filtri di ricerca</span>
        </button>
      )}
    </div>
  );
}
export { EmptyState };
