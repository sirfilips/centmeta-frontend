"use client";

import React, { useState, useRef, useEffect } from "react";
import { handleNav } from "../utils/navigation";
import { handleCardDragStart } from "../utils/dragCard";
import { getPeriodParam } from "../utils/mtg";
import TrendIndicator from "./TrendIndicator";
import ScrollableFilterStrip from "./ScrollableFilterStrip";
import AddToNotesButton from "./AddToNotesButton";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Crosshair,
  Flame,
  Shield,
  BookOpen,
  Skull,
  Layers,
  Search,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface RoleCardItem {
  name: string;
  images: string[];
  val1: number;
  trend: number | "" | null;
  delta?: number | null;
  category?: string;
  color_identity?: string[];
  cmc?: number;
}

export interface RoleCategoryData {
  key: string;
  label: string;
  title: string;
  description: string;
  accent?: string;
  total_cards: number;
  cards: RoleCardItem[];
}

interface RoleCategoriesCarouselProps {
  roles: RoleCategoryData[];
  onItemClick: (cardName: string) => void;
  onViewAll: (roleKey: string) => void;
  filtroTempo: string;
}

const ROLE_STYLES: Record<
  string,
  {
    bar: string;
    hoverText: string;
    helpHover: string;
    activeTab: string;
    activeBadge: string;
    rankBadge: string;
    cardHoverShadow: string;
    arrowBtnHover: string;
    icon: LucideIcon;
  }
> = {
  removal: {
    bar: "bg-rose-500",
    hoverText: "hover:text-rose-400",
    helpHover: "hover:text-rose-400",
    activeTab: "bg-rose-600/20 text-white border-rose-500/60 shadow-md shadow-rose-950/40",
    activeBadge: "bg-rose-500/30 text-rose-200",
    rankBadge: "bg-rose-600/20 text-rose-400",
    cardHoverShadow: "group-hover/card:shadow-rose-900/50",
    arrowBtnHover: "hover:bg-rose-600",
    icon: Crosshair,
  },
  burn: {
    bar: "bg-orange-500",
    hoverText: "hover:text-orange-400",
    helpHover: "hover:text-orange-400",
    activeTab: "bg-orange-600/20 text-white border-orange-500/60 shadow-md shadow-orange-950/40",
    activeBadge: "bg-orange-500/30 text-orange-200",
    rankBadge: "bg-orange-600/20 text-orange-400",
    cardHoverShadow: "group-hover/card:shadow-orange-900/50",
    arrowBtnHover: "hover:bg-orange-600",
    icon: Flame,
  },
  counterspell: {
    bar: "bg-blue-500",
    hoverText: "hover:text-blue-400",
    helpHover: "hover:text-blue-400",
    activeTab: "bg-blue-600/20 text-white border-blue-500/60 shadow-md shadow-blue-950/40",
    activeBadge: "bg-blue-500/30 text-blue-200",
    rankBadge: "bg-blue-600/20 text-blue-400",
    cardHoverShadow: "group-hover/card:shadow-blue-900/50",
    arrowBtnHover: "hover:bg-blue-600",
    icon: Shield,
  },
  card_draw: {
    bar: "bg-cyan-500",
    hoverText: "hover:text-cyan-400",
    helpHover: "hover:text-cyan-400",
    activeTab: "bg-cyan-600/20 text-white border-cyan-500/60 shadow-md shadow-cyan-950/40",
    activeBadge: "bg-cyan-500/30 text-cyan-200",
    rankBadge: "bg-cyan-600/20 text-cyan-400",
    cardHoverShadow: "group-hover/card:shadow-cyan-900/50",
    arrowBtnHover: "hover:bg-cyan-600",
    icon: BookOpen,
  },
  discard: {
    bar: "bg-violet-500",
    hoverText: "hover:text-violet-400",
    helpHover: "hover:text-violet-400",
    activeTab: "bg-violet-600/20 text-white border-violet-500/60 shadow-md shadow-violet-950/40",
    activeBadge: "bg-violet-500/30 text-violet-200",
    rankBadge: "bg-violet-600/20 text-violet-400",
    cardHoverShadow: "group-hover/card:shadow-violet-900/50",
    arrowBtnHover: "hover:bg-violet-600",
    icon: Skull,
  },
  board_wipe: {
    bar: "bg-amber-500",
    hoverText: "hover:text-amber-400",
    helpHover: "hover:text-amber-400",
    activeTab: "bg-amber-600/20 text-white border-amber-500/60 shadow-md shadow-amber-950/40",
    activeBadge: "bg-amber-500/30 text-amber-200",
    rankBadge: "bg-amber-600/20 text-amber-400",
    cardHoverShadow: "group-hover/card:shadow-amber-900/50",
    arrowBtnHover: "hover:bg-amber-600",
    icon: Layers,
  },
  tutor: {
    bar: "bg-emerald-500",
    hoverText: "hover:text-emerald-400",
    helpHover: "hover:text-emerald-400",
    activeTab: "bg-emerald-600/20 text-white border-emerald-500/60 shadow-md shadow-emerald-950/40",
    activeBadge: "bg-emerald-500/30 text-emerald-200",
    rankBadge: "bg-emerald-600/20 text-emerald-400",
    cardHoverShadow: "group-hover/card:shadow-emerald-900/50",
    arrowBtnHover: "hover:bg-emerald-600",
    icon: Search,
  },
  ramp: {
    bar: "bg-lime-500",
    hoverText: "hover:text-lime-400",
    helpHover: "hover:text-lime-400",
    activeTab: "bg-lime-600/20 text-white border-lime-500/60 shadow-md shadow-lime-950/40",
    activeBadge: "bg-lime-500/30 text-lime-200",
    rankBadge: "bg-lime-600/20 text-lime-400",
    cardHoverShadow: "group-hover/card:shadow-lime-900/50",
    arrowBtnHover: "hover:bg-lime-600",
    icon: Zap,
  },
};

export default function RoleCategoriesCarousel({
  roles,
  onItemClick,
  onViewAll,
  filtroTempo,
}: RoleCategoriesCarouselProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const periodParam = getPeriodParam(filtroTempo);

  useEffect(() => {
    if (selectedIdx >= roles.length) {
      setSelectedIdx(0);
    }
  }, [roles, selectedIdx]);

  if (!roles || roles.length === 0) return null;

  const activeRole = roles[selectedIdx] || roles[0];
  const style = ROLE_STYLES[activeRole.key] || ROLE_STYLES.removal;
  const items = (activeRole?.cards || []).slice(0, 25);
  const viewAllHref = `/?view=cards&tab=Top+Cards&role=${encodeURIComponent(activeRole.key)}${periodParam}`;

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const handleSelectRole = (idx: number) => {
    setSelectedIdx(idx);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 md:mb-10 min-w-0">
      {/* Header + Selettore Categoria Ruolo */}
      <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-3 mb-3 md:mb-4 min-w-0">
        <div className="flex items-center flex-wrap gap-y-1 shrink-0">
          <a
            href={viewAllHref}
            onClick={(e) => handleNav(e, () => onViewAll(activeRole.key))}
            data-umami-event="Vedi Tutte Carte Ruolo"
            data-umami-event-role={activeRole.key}
            className={`font-display text-base sm:text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2 sm:gap-2.5 cursor-pointer transition tracking-tight ${style.hoverText}`}
          >
            <span className={`w-1 h-5 rounded-sm shrink-0 ${style.bar}`}></span>
            <span>{activeRole.title}</span>
            <span className="text-slate-500 ml-0.5 sm:ml-1 font-sans">➔</span>
          </a>

          {/* Tooltip Didattico */}
          <div className="group/info relative inline-flex items-center justify-center cursor-help ml-2.5 sm:ml-3">
            <HelpCircle
              className={`w-4 h-4 text-slate-500 transition-colors ${style.helpHover}`}
              strokeWidth={2.5}
            />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 hidden group-hover/info:block w-64 sm:w-72 max-w-[calc(100vw-2rem)] p-3 bg-slate-800 text-xs text-slate-200 rounded-xl shadow-xl border border-slate-700 z-50 pointer-events-none normal-case font-normal text-left leading-relaxed">
              <strong className="text-white block mb-1">{activeRole.label}</strong>
              <span>{activeRole.description}</span>
            </div>
          </div>
        </div>

        {/* Tabs per le categorie del formato (scrollabili su mobile e schermi piccoli) */}
        <div className="w-full 2xl:w-auto 2xl:max-w-[60%] min-w-0">
          <ScrollableFilterStrip innerClassName="py-0.5">
            {roles.map((role, idx) => {
              const isSelected = idx === selectedIdx;
              const rStyle = ROLE_STYLES[role.key] || ROLE_STYLES.removal;
              const IconComp = rStyle.icon;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => handleSelectRole(idx)}
                  data-umami-event="Cambio Tab Ruolo Home"
                  data-umami-event-role={role.key}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? rStyle.activeTab
                      : "bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
                  <span>{role.label}</span>
                  {role.total_cards > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-black tabular-nums ${
                        isSelected
                          ? rStyle.activeBadge
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {role.total_cards}
                    </span>
                  )}
                </button>
              );
            })}
          </ScrollableFilterStrip>
        </div>
      </div>

      {/* Carosello Carte */}
      {items.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl py-10 px-4 text-center text-slate-400 text-sm">
          Nessuna carta trovata per la categoria{" "}
          <strong className="text-slate-200">{activeRole?.label}</strong>{" "}
          nel periodo selezionato.
        </div>
      ) : (
        <div className="relative group/carousel">
          <button
            type="button"
            onClick={() => scroll(-500)}
            aria-label="Scorri a sinistra"
            className={`hidden md:flex absolute left-0 top-[148px] -translate-y-1/2 -ml-6 z-20 bg-slate-900 border border-slate-700 text-slate-300 w-12 h-12 rounded-full items-center justify-center hover:text-white transition shadow-xl opacity-0 md:group-hover/carousel:opacity-100 pointer-events-none md:group-hover/carousel:pointer-events-auto ${style.arrowBtnHover}`}
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => scroll(500)}
            aria-label="Scorri a destra"
            className={`hidden md:flex absolute right-0 top-[148px] -translate-y-1/2 -mr-6 z-20 bg-slate-900 border border-slate-700 text-slate-300 w-12 h-12 rounded-full items-center justify-center hover:text-white transition shadow-xl opacity-0 md:group-hover/carousel:opacity-100 pointer-events-none md:group-hover/carousel:pointer-events-auto ${style.arrowBtnHover}`}
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto overscroll-x-contain touch-pan-x snap-x pt-4 md:pt-5 pb-4 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {items.map((item, idx) => {
              const itemHref = `/?card=${encodeURIComponent(item.name)}${periodParam}`;
              return (
                <a
                  key={`${activeRole.key}-${item.name}-${idx}`}
                  href={itemHref}
                  onClick={(e) => handleNav(e, () => onItemClick(item.name))}
                  draggable={true}
                  onDragStart={(e) =>
                    handleCardDragStart(e, item.name, item.images?.[0])
                  }
                  className="snap-start flex-shrink-0 w-36 sm:w-44 md:w-48 flex flex-col items-center cursor-pointer group/card"
                >
                  <div className="relative w-full h-52 sm:h-60 md:h-64 flex justify-center items-center mb-2.5 md:mb-3">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(e, item.name, item.images[0])
                        }
                        loading="lazy"
                        decoding="async"
                        className={`max-h-full max-w-full rounded-[4.75%] shadow-lg group-hover/card:-translate-y-3 transition-all duration-300 object-contain ${style.cardHoverShadow}`}
                        alt={item.name}
                      />
                    ) : (
                      <div className="text-xs text-slate-500 w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 px-2 text-center">
                        {item.name}
                      </div>
                    )}
                    <AddToNotesButton
                      card={{
                        name: item.name,
                        image: item.images?.[0],
                        category: item.category,
                        color_identity: item.color_identity,
                        cmc: item.cmc,
                      }}
                      className="absolute top-1.5 right-1.5 z-30"
                    />
                  </div>
                  <div className="text-center w-full px-1">
                    <div className="font-bold text-xs text-slate-200 truncate flex items-center justify-center gap-1.5">
                      <span
                        className={`px-1.5 rounded text-[10px] font-black ${style.rankBadge}`}
                      >
                        #{idx + 1}
                      </span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.val1} mazzi
                      </span>
                      <TrendIndicator trend={item.trend} delta={item.delta} />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
