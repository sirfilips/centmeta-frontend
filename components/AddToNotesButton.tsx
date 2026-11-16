"use client";

import React from "react";
import { BookmarkPlus, BookmarkCheck, Check, Plus } from "lucide-react";
import { useNotes, AddCardInput } from "./NotesContext";

interface AddToNotesButtonProps {
  card: AddCardInput;
  variant?: "icon" | "pill" | "compact";
  className?: string;
}

export default function AddToNotesButton({
  card,
  variant = "icon",
  className = "",
}: AddToNotesButtonProps) {
  const { hasCard, toggleCard, isHydrated } = useNotes();
  const isAdded = isHydrated && hasCard(card.name);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCard(card);
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={isAdded ? "Rimuovi dagli appunti" : "Aggiungi agli appunti"}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-md border ${
          isAdded
            ? "bg-emerald-600/25 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/35"
            : "bg-slate-800/90 hover:bg-blue-600/25 text-slate-200 hover:text-white border-slate-700 hover:border-blue-500/50"
        } ${className}`}
      >
        {isAdded ? (
          <>
            <BookmarkCheck className="w-4 h-4 text-emerald-400" strokeWidth={2.3} />
            <span>Negli Appunti</span>
          </>
        ) : (
          <>
            <BookmarkPlus className="w-4 h-4 text-blue-400" strokeWidth={2.3} />
            <span>+ Appunti</span>
          </>
        )}
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleClick}
        title={isAdded ? "Rimuovi dagli appunti" : "Aggiungi agli appunti"}
        aria-label={isAdded ? `Rimuovi ${card.name} dagli appunti` : `Aggiungi ${card.name} agli appunti`}
        className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all shrink-0 ${
          isAdded
            ? "bg-emerald-600/25 text-emerald-300 border-emerald-500/50 hover:bg-emerald-600/35"
            : "bg-slate-900/80 text-slate-400 border-slate-700 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/50"
        } ${className}`}
      >
        {isAdded ? (
          <Check className="w-4 h-4" strokeWidth={2.5} />
        ) : (
          <Plus className="w-4 h-4" strokeWidth={2.5} />
        )}
      </button>
    );
  }

  // Variant "icon": discreto sopra l'angolo alto-destro della carta
  return (
    <button
      type="button"
      onClick={handleClick}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      title={isAdded ? "Rimuovi dagli appunti" : "Aggiungi agli appunti"}
      aria-label={isAdded ? `Rimuovi ${card.name} dagli appunti` : `Aggiungi ${card.name} agli appunti`}
      className={`w-7 h-7 rounded-full flex items-center justify-center border backdrop-blur-sm shadow-md transition-all duration-200 ${
        isAdded
          ? "bg-emerald-600/90 text-white border-emerald-400/70 opacity-100 scale-100"
          : "bg-slate-950/80 hover:bg-blue-600 text-slate-200 hover:text-white border-slate-700/80 hover:border-blue-400/70 opacity-90 md:opacity-0 md:group-hover/card:opacity-100 md:group-hover:opacity-100 focus:opacity-100"
      } ${className}`}
    >
      {isAdded ? (
        <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
      ) : (
        <Plus className="w-3.5 h-3.5" strokeWidth={2.8} />
      )}
    </button>
  );
}
