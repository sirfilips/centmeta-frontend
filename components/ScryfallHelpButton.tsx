"use client";

import React, { useState, useRef, useEffect } from "react";
import { HelpCircle, X, Sparkles } from "lucide-react";
import { SCRYFALL_HELP_EXAMPLES } from "../utils/scryfallSearch";

interface ScryfallHelpButtonProps {
  onSelectExample?: (query: string) => void;
  align?: "left" | "right";
  size?: "sm" | "md";
}

export default function ScryfallHelpButton({
  onSelectExample,
  align = "right",
  size = "sm",
}: ScryfallHelpButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-flex items-center">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        title="Guida sintassi Scryfall"
        aria-label="Guida sintassi Scryfall"
        aria-expanded={open}
        className={`rounded-full text-slate-400 hover:text-blue-400 hover:bg-slate-800/80 transition-colors flex items-center justify-center ${
          size === "md" ? "p-1.5" : "p-1"
        }`}
      >
        <HelpCircle className={size === "md" ? "w-4 h-4" : "w-3.5 h-3.5"} strokeWidth={2.3} />
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-full mt-2 w-[min(22rem,calc(100vw-2rem))] sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-3.5 sm:p-4 z-[120] text-left animate-fade-in ${
            align === "left" ? "left-0" : "right-0"
          }`}
        >
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Sintassi Scryfall Supportata</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
              aria-label="Chiudi guida"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px] text-slate-300 mb-3">
            <div>
              <code className="text-blue-300 font-mono">t:</code> tipo carta
            </div>
            <div>
              <code className="text-blue-300 font-mono">o:</code> testo oracle
            </div>
            <div>
              <code className="text-blue-300 font-mono">id: / commander:</code> identità
            </div>
            <div>
              <code className="text-blue-300 font-mono">c: / mv</code> colore e costo
            </div>
            <div>
              <code className="text-blue-300 font-mono">kw:</code> keyword
            </div>
            <div>
              <code className="text-blue-300 font-mono">otag: / role:</code> ruolo meta
            </div>
            <div>
              <code className="text-blue-300 font-mono">is: / not:</code> proprietà
            </div>
            <div>
              <code className="text-blue-300 font-mono">- / OR / ( )</code> logica
            </div>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Esempi rapidi {onSelectExample ? "(clicca per provare)" : ""}
          </div>
          <div className="flex flex-col gap-1.5">
            {SCRYFALL_HELP_EXAMPLES.map((ex) => (
              <button
                key={ex.query}
                type="button"
                onClick={() => {
                  if (onSelectExample) onSelectExample(ex.query);
                  setOpen(false);
                }}
                className="flex items-center justify-between gap-2 text-left px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 transition-colors"
              >
                <code className="text-[11px] text-blue-300 font-mono truncate">
                  {ex.query}
                </code>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {ex.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
