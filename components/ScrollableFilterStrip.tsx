"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ScrollableFilterStripProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  fadeFromClass?: string;
}

export default function ScrollableFilterStrip({
  children,
  className = "",
  innerClassName = "",
  fadeFromClass = "from-slate-950",
}: ScrollableFilterStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateScrollState);
      resizeObserver.observe(el);
    }

    let mutationObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(updateScrollState);
      mutationObserver.observe(el, { childList: true });
    }

    window.addEventListener("resize", updateScrollState);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByAmount = (delta: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={`relative w-full min-w-0 max-w-full ${className}`}>
      {canScrollLeft && (
        <div
          className={`absolute left-0 top-0 bottom-0 z-10 flex items-center pr-4 bg-gradient-to-r ${fadeFromClass} via-slate-950/75 to-transparent pointer-events-none`}
        >
          <button
            type="button"
            onClick={() => scrollByAmount(-220)}
            aria-label="Scorri filtri a sinistra"
            className="pointer-events-auto w-7 h-7 rounded-full bg-slate-900/95 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white shadow-md flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}

      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className={`flex items-center gap-2 w-full min-w-0 overflow-x-auto overscroll-x-contain touch-pan-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
          canScrollLeft ? "pl-8" : ""
        } ${canScrollRight ? "pr-8" : ""} ${innerClassName}`}
      >
        {children}
      </div>

      {canScrollRight && (
        <div
          className={`absolute right-0 top-0 bottom-0 z-10 flex items-center pl-4 bg-gradient-to-l ${fadeFromClass} via-slate-950/75 to-transparent pointer-events-none`}
        >
          <button
            type="button"
            onClick={() => scrollByAmount(220)}
            aria-label="Scorri filtri a destra"
            className="pointer-events-auto w-7 h-7 rounded-full bg-slate-900/95 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white shadow-md flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
}
