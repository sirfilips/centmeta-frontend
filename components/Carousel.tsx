import React, { useRef } from "react";
import TrendIndicator from "./TrendIndicator";
import AddToNotesButton from "./AddToNotesButton";
import { handleNav } from "../utils/navigation";
import { handleCardDragStart } from "../utils/dragCard";
import { getPeriodParam, getPeriodQuery } from "../utils/mtg";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

const Carousel = ({
  title,
  items,
  onItemClick,
  onViewAll,
  viewAllHref,
  isHot = false,
  isCard = false,
  filtroTempo,
}: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const periodQuery = getPeriodQuery(filtroTempo);
  const periodParam = getPeriodParam(filtroTempo);

  const scroll = (offset: number) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 md:mb-10">
      <div className="flex items-center mb-2 md:mb-3">
        <a
          href={`${viewAllHref}${periodParam}`}
          onClick={(e) => handleNav(e, onViewAll)}
          className="font-display text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2.5 cursor-pointer hover:text-blue-400 transition tracking-tight"
        >
          <span
            className={`w-1 h-5 rounded-sm ${isHot ? "bg-orange-500" : "bg-blue-400"}`}
          ></span>{" "}
          {title}
          <span className="text-slate-500 hover:text-blue-400 ml-1 font-sans">➔</span>
        </a>
        {/* Tooltip Didattico per i titoli */}
        <div className="group/info relative inline-flex items-center justify-center cursor-help ml-3">
          <HelpCircle
            className="w-4 h-4 text-slate-500 hover:text-blue-400 transition-colors"
            strokeWidth={2.5}
          />
          <div className="absolute bottom-full mb-2 right-0 sm:right-auto sm:left-0 hidden group-hover/info:block w-56 sm:w-64 p-3 bg-slate-800 text-xs text-slate-200 rounded-xl shadow-xl border border-slate-700 z-50 pointer-events-none normal-case font-normal text-left leading-relaxed">
            {isHot ? (
              <span>
                <strong className="text-orange-400">Classifica Trend:</strong>{" "}
                Mostra chi ha registrato il maggiore incremento negli ultimi 7
                giorni. Il valore (+X) indica i nuovi mazzi in cui è apparso.
              </span>
            ) : (
              <span>
                <strong className="text-blue-400">Classifica Assoluta:</strong>{" "}
                Mostra i più giocati nel periodo. Le frecce (▲/▼) o "NEW"
                indicano il cambio di posizione rispetto al periodo precedente.
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="relative group/carousel">
        <button
          type="button"
          onClick={() => scroll(-500)}
          aria-label="Scorri a sinistra"
          className="hidden md:flex absolute left-0 top-[148px] -translate-y-1/2 -ml-6 z-20 bg-slate-900 border border-slate-700 text-slate-300 w-12 h-12 rounded-full items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-xl opacity-0 md:group-hover/carousel:opacity-100 focus:opacity-100 focus:pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 pointer-events-none md:group-hover/carousel:pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scroll(500)}
          aria-label="Scorri a destra"
          className="hidden md:flex absolute right-0 top-[148px] -translate-y-1/2 -mr-6 z-20 bg-slate-900 border border-slate-700 text-slate-300 w-12 h-12 rounded-full items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-xl opacity-0 md:group-hover/carousel:opacity-100 focus:opacity-100 focus:pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 pointer-events-none md:group-hover/carousel:pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6" strokeWidth={2.5} aria-hidden="true" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto overscroll-x-contain touch-pan-x snap-x pt-4 md:pt-5 pb-4 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {items.map((item: any, idx: number) => {
            const itemName = item?.name || "";
            const imgs = Array.isArray(item?.images) ? item.images : [];
            const isPartner =
              itemName.includes(" / ") && !itemName.includes(" // ");
            const itemHref = isCard
              ? `/?card=${encodeURIComponent(itemName)}${periodParam}`
              : `/commander/${encodeURIComponent(itemName)}${periodQuery}`;
            return (
              <a
                key={itemName || idx}
                href={itemHref}
                onClick={(e) => handleNav(e, () => onItemClick(itemName))}
                draggable={true}
                onDragStart={(e) =>
                  handleCardDragStart(
                    e,
                    isPartner ? itemName.split(" / ")[0] : itemName,
                    imgs[0],
                  )
                }
                className="snap-start flex-shrink-0 w-36 sm:w-44 md:w-48 flex flex-col items-center cursor-pointer group/card"
              >
                <div className="relative w-full h-52 sm:h-60 md:h-64 flex justify-center items-center mb-2.5 md:mb-3">
                  {isPartner && imgs.length > 1 ? (
                    <div className="relative w-full h-full flex justify-center items-center">
                      <img
                        src={imgs[0]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(
                            e,
                            itemName.split(" / ")[0],
                            imgs[0],
                          )
                        }
                        loading="lazy" decoding="async" className="absolute w-[70%] max-h-[90%] object-contain rounded-[4.75%] shadow-lg -translate-x-3 -translate-y-1 -rotate-6 z-10 hover:z-40 hover:scale-110 transition-all duration-300"
                        alt={itemName}
                      />
                      <img
                        src={imgs[1]}
                        draggable={true}
                        onDragStart={(e) =>
                          handleCardDragStart(
                            e,
                            itemName.split(" / ")[1],
                            imgs[1],
                          )
                        }
                        loading="lazy" decoding="async" className="absolute w-[70%] max-h-[90%] object-contain rounded-[4.75%] shadow-lg translate-x-3 translate-y-3 rotate-6 z-20 hover:z-40 hover:scale-110 transition-all duration-300"
                        alt={itemName}
                      />
                    </div>
                  ) : imgs.length > 0 ? (
                    <img
                      src={imgs[0]}
                      draggable={true}
                      onDragStart={(e) =>
                        handleCardDragStart(e, itemName, imgs[0])
                      }
                      loading="lazy" decoding="async" className="max-h-full max-w-full rounded-[4.75%] shadow-lg group-hover/card:-translate-y-3 group-hover/card:shadow-blue-900/50 transition-all duration-300 object-contain"
                      alt={itemName}
                    />
                  ) : (
                    <div className="text-xs text-slate-500 w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                      {itemName}
                    </div>
                  )}
                  {isCard && (
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
                  )}
                </div>
                <div className="text-center w-full px-1">
                  <div className="font-bold text-xs text-slate-200 truncate flex items-center justify-center gap-1.5">
                    {!isCard && !isHot && (
                      <span className="bg-blue-600/20 text-blue-400 px-1.5 rounded text-[10px] font-black">
                        #{idx + 1}
                      </span>
                    )}
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
    </div>
  );
};

export default Carousel;
