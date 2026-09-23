import React from 'react';
import SkeletonCard from './SkeletonCard';
import { handleNav } from '../utils/navigation';
import { RefreshCw } from 'lucide-react'; // <-- Nuova icona importata

interface CardDetailProps {
  selectedCardDetail: string;
  setSelectedCardDetail: (val: string | null) => void;
  loadingCardDetail: boolean;
  cardDetailData: any;
  filtroTempo: string;
  isFlipped: boolean;
  setIsFlipped: (val: boolean) => void;
  commanders: any[];
  setSelectedCommander: (val: string) => void;
  setCommanderSearch: (val: string) => void;
  setActiveTab: (val: string) => void;
  activeSynergyTab: string;
  setActiveSynergyTab: (val: string) => void;
  visibleCount: number;
  setVisibleCount: React.Dispatch<React.SetStateAction<number>>;
  activeColors: string[];
  toggleColor: (val: string) => void;
  colors: { label: string; val: string }[];
  synergyCategories: string[];
  visibleSynergiesData: any[];
}

export default function CardDetail({
  selectedCardDetail, setSelectedCardDetail, loadingCardDetail, cardDetailData,
  filtroTempo, isFlipped, setIsFlipped, commanders, setSelectedCommander,
  setCommanderSearch, setActiveTab, activeSynergyTab, setActiveSynergyTab,
  visibleCount, setVisibleCount, activeColors, toggleColor, colors,
  synergyCategories, visibleSynergiesData
}: CardDetailProps) {
  
  return (
    <div>
      <a 
        href="/"
        onClick={(e) => handleNav(e, () => setSelectedCardDetail(null))}
        className="mb-6 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-lg transition border border-slate-700 shadow-sm inline-block"
      >
        ← Torna alle Statistiche
      </a>

      {loadingCardDetail ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6 mt-12">
          {[...Array(14)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : cardDetailData && (
        <div className="space-y-12">
          
          <div className="border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 shadow-2xl relative bg-slate-900/40">
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 w-full">
              
              <div className="flex justify-center items-center flex-shrink-0 mx-auto md:mx-0 w-full md:w-auto xl:w-[350px]">
                {cardDetailData.images && cardDetailData.images.length > 1 ? (
                  <div className="relative w-56 md:w-72 xl:w-80 aspect-[2.5/3.5] [perspective:1000px] group">
                    <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                      <div className="absolute inset-0 [backface-visibility:hidden]">
                        <img src={cardDetailData.images[0]} className="w-full h-full object-contain rounded-2xl shadow-xl border border-slate-700/50" alt="Face 1" />
                      </div>
                      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <img src={cardDetailData.images[1]} className="w-full h-full object-contain rounded-2xl shadow-xl border border-slate-700/50" alt="Face 2" />
                      </div>
                    </div>
                    {/* Pulsante Flip con Icona SVG */}
                    <button onClick={() => setIsFlipped(!isFlipped)} title="Gira Carta" className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg border-2 border-blue-400 z-20 transition-transform hover:scale-110">
                      <RefreshCw className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                    </button>
                  </div>
                ) : cardDetailData.images && cardDetailData.images.length === 1 ? (
                  <img src={cardDetailData.images[0]} className="w-56 md:w-72 xl:w-80 object-contain rounded-2xl shadow-xl border border-slate-700/50" alt={cardDetailData.card_name} />
                ) : (
                  <div className="w-56 md:w-72 h-80 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500">{cardDetailData.card_name}</div>
                )}
              </div>

              {/* PANNELLO ESTESO (flex-1) */}
              <div className="flex flex-col gap-4 w-full flex-1 relative isolate overflow-hidden rounded-3xl p-6 md:p-10 border border-slate-700/50 shadow-xl min-h-[320px] justify-center">
                {cardDetailData.art_crops?.[0] && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center filter blur-md scale-110 opacity-80 -z-20 pointer-events-none"
                    style={{ backgroundImage: `url("${cardDetailData.art_crops[0]}")` }}
                  ></div>
                )}
                <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm -z-10"></div>
                
                <div className="relative z-10 flex flex-col gap-4 w-full">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold bg-blue-950/50 px-3 py-1 rounded-full border border-blue-900/50 shadow-inner">Analisi Carta ({filtroTempo})</span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mt-4 drop-shadow-md">{cardDetailData.card_name}</h2>
                  </div>
                  
                  {cardDetailData.oracles && cardDetailData.oracles.length > 0 && (
                    <div className="flex flex-col gap-3 mt-4">
                      {cardDetailData.oracles.map((oracle: string, idx: number) => (
                        <p key={idx} className="text-slate-200 text-sm md:text-base bg-slate-950/60 p-5 rounded-xl border border-slate-800/80 whitespace-pre-line leading-relaxed shadow-inner">
                          {oracle}
                        </p>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 flex flex-col gap-1 shadow-sm">
                    <div className="text-sm md:text-base text-slate-200">
                      Presente in <span className="text-blue-400 font-black text-xl">{cardDetailData.total_decks_with_card}</span> mazzi nella finestra temporale.
                    </div>
                    <div className="text-xs text-slate-400">
                      Totale storico registrato: {cardDetailData.total_decks_global} mazzi.
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div>
            <h3 className="text-xl font-black mb-6 text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Comandanti Principali
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
              {cardDetailData.commanders.map((cmd: any, idx: number) => {
                const globalRank = commanders.findIndex(c => c.comandante === cmd.comandante) + 1;
                const isPartner = cmd.comandante.includes(' / ') && !cmd.comandante.includes(' // ');
                
                return (
                  <a 
                    key={idx} 
                    href={`/?commander=${encodeURIComponent(cmd.comandante)}`}
                    onClick={(e) => handleNav(e, () => { setSelectedCommander(cmd.comandante); setSelectedCardDetail(null); setCommanderSearch(''); setActiveTab('Top Cards'); })}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="relative w-full h-72 flex justify-center items-center mb-3">
                      {isPartner && cmd.images?.length > 1 ? (
                        <div className="relative w-full h-full flex justify-center items-center">
                          <img src={cmd.images[0]} className="absolute w-[70%] max-h-[90%] object-contain rounded-xl shadow-lg -translate-x-3 -translate-y-1 -rotate-6 z-10 hover:z-30 hover:scale-110 transition-all duration-300" />
                          <img src={cmd.images[1]} className="absolute w-[70%] max-h-[90%] object-contain rounded-xl shadow-lg translate-x-3 translate-y-3 rotate-6 z-20 hover:z-30 hover:scale-110 transition-all duration-300" />
                        </div>
                      ) : cmd.images?.length > 0 ? (
                        <img src={cmd.images[0]} alt={cmd.comandante} className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 group-hover:shadow-blue-900/30 transition-all duration-300 object-contain" />
                      ) : (
                        <span className="text-xs text-slate-500 text-center">{cmd.comandante}</span>
                      )}
                    </div>
                    <div className="text-center w-full px-1">
                      <div className="font-bold text-xs text-slate-200 truncate flex items-center justify-center gap-1.5" title={cmd.comandante}>
                        <span className="bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-black">#{globalRank}</span>
                        <span className="truncate">{cmd.comandante}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium mt-1">
                        {cmd.Percentuale}% <span className="text-slate-500">({cmd.mazzi_carta}/{cmd.totale_comandante})</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black mb-4 text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span> Sinergie Principali
            </h3>
            
            <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md pt-4 pb-4 border-b border-slate-800 mb-6 flex flex-col gap-3">
              <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {synergyCategories.map((cat) => (
                  <button key={cat} onClick={() => { setActiveSynergyTab(cat); setVisibleCount(50); }} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeSynergyTab === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {colors.map((col) => {
                  const isActive = activeColors.length === 0 ? col.val === 'Tutti' : activeColors.includes(col.val);
                  return (
                    <button key={col.val} onClick={() => toggleColor(col.val)} className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all border ${isActive ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'}`}>
                      {col.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {visibleSynergiesData.length === 0 ? (
              <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                <span className="text-4xl mb-4 opacity-50">🔍</span>
                <p>Nessuna carta trovata con i filtri selezionati.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-8 gap-x-6">
                {visibleSynergiesData.slice(0, visibleCount).map((syn: any, idx: number) => {
                  const displayImages = syn.images?.length > 0 ? [syn.images[0]] : [];
                  return (
                    <a 
                      key={idx} 
                      href={`/?card=${encodeURIComponent(syn.card_name)}`}
                      onClick={(e) => handleNav(e, () => setSelectedCardDetail(syn.card_name))}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div className="relative w-full h-80 flex justify-center items-center mb-3">
                        {displayImages.length === 1 ? (
                          <img src={displayImages[0]} className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 transition-transform duration-300 object-contain" alt={syn.card_name} />
                        ) : (
                          <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">{syn.card_name}</div>
                        )}
                      </div>
                      <div className="text-center w-full px-1">
                        <div className="font-bold text-xs text-slate-200 truncate" title={syn.card_name}>{syn.card_name}</div>
                        <div className="text-[11px] text-blue-400 font-semibold mt-1">
                          {syn.Percentuale}% <span className="text-slate-500 font-normal">({syn.freq} mazzi)</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {visibleSynergiesData.length > visibleCount && (
              <div className="mt-12 text-center">
                <button onClick={() => setVisibleCount(v => v + 50)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold py-2.5 px-8 rounded-full border border-slate-700 transition shadow-sm">
                  Mostra altre carte ↓
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}