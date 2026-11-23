"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

interface FblthpEasterEggProps {
  variant?: "404" | "error";
}

const QUOTES_BY_VARIANT: Record<"404" | "error", string[]> = {
  "404": [
    "Fblthp si è perso di nuovo... e anche questa pagina.",
    "«Totally Lost!» — Ha preso la svolta sbagliata nel Dedalo Implicito.",
    "«Non era questa la strada per Ravnica...»",
    "«Aiuto, qui non c'è nessuno!»",
    "«Se mi trovi, peschi due carte!»",
  ],
  error: [
    "Fblthp ha inciampato nei cavi del server...",
    "«Totally Lost!» — Qualcosa è andato storto nel laboratorio Izzet.",
    "«Giuro che non ho toccato niente!»",
    "«Aiuto, si è rotto il Dedalo Implicito!»",
    "«Se clicchi abbastanza forte forse riparte tutto!»",
  ],
};

const FOUND_MESSAGE_BY_VARIANT: Record<"404" | "error", string> = {
  "404": "Incredibile! Hai aiutato Fblthp a ritrovare la strada!",
  error:
    "Ottimo! Fblthp ha ricollegato il cavo — prova a cliccare Riprova!",
};

export default function FblthpEasterEgg({
  variant = "404",
}: FblthpEasterEggProps) {
  const [clickCount, setClickCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleFblthpClick = () => {
    setIsAnimating(true);
    setClickCount((prev) => prev + 1);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsAnimating(false);
      timerRef.current = null;
    }, 600);
  };

  const quotes = QUOTES_BY_VARIANT[variant];
  const isFound = clickCount >= 5;
  const currentQuote = isFound
    ? FOUND_MESSAGE_BY_VARIANT[variant]
    : quotes[clickCount % quotes.length];

  return (
    <div className="flex items-center gap-4 sm:gap-5 select-none">
      <button
        type="button"
        onClick={handleFblthpClick}
        data-umami-event="Click Fblthp Easter Egg"
        title="Clicca su Fblthp!"
        aria-label="Clicca su Fblthp"
        className="relative group shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        <img
          src="https://cards.scryfall.io/art_crop/front/7/9/79b2c547-0d9e-4fd7-a399-347ad908c70b.jpg"
          alt="Fblthp, the Lost"
          className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-slate-800 shadow-xl transition-all duration-500 hover:border-blue-500 hover:scale-110 active:scale-95 ${
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
      </button>

      <div className="min-w-0 space-y-1">
        <p
          className={`font-semibold text-sm sm:text-base transition-colors duration-300 flex items-center gap-1.5 ${
            isFound ? "text-emerald-400" : "text-slate-200"
          }`}
        >
          {isFound && (
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{currentQuote}</span>
        </p>
        <p className="text-[11px] text-slate-500">
          Art:{" "}
          <a
            href="https://scryfall.com/search?q=a%3A%E2%80%9CJesper+Ejsing%E2%80%9D&unique=art"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-300 hover:underline transition-colors"
          >
            Jesper Ejsing
          </a>{" "}
          · © WotC
        </p>
      </div>
    </div>
  );
}
