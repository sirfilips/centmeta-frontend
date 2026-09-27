import React from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { handleNav } from '../utils/navigation';

interface HeroSectionProps {
  homeMode: 'dashboard' | 'commanders' | 'cards';
  setHomeMode: (mode: 'dashboard' | 'commanders' | 'cards') => void;
  commanderSearch: string;
  setCommanderSearch: (val: string) => void;
  dashboardLoading: boolean; 
  dashboardData: any;        
  handleResetHome: () => void;
  commanderSort: 'top' | 'hot';
  setCommanderSort: (val: 'top' | 'hot') => void;
}

export default function HeroSection({
  homeMode,
  setHomeMode,
  commanderSearch,
  setCommanderSearch,
  handleResetHome,
  commanderSort,
  setCommanderSort
}: HeroSectionProps) {
  
  const isDashboard = homeMode === 'dashboard';

  return (
    <div className={`relative transition-all duration-500 ease-in-out flex ${
      isDashboard 
        /* Box centrale spazioso (py-12 md:py-24), largo (w-full) e con gradiente di sfondo */
        ? 'mb-12 mt-4 w-full flex-col items-center justify-center py-12 md:py-24 px-4 rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl relative isolate' 
        : 'flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mb-8 mt-2 border-transparent bg-transparent'
    }`}>
      
      {/* SFONDO GLASSMORPHISM CON ARTWORK "OPPOSITION" (Visibile solo in Dashboard) */}
      {isDashboard && (
        <div className="absolute inset-0 -z-20 pointer-events-none [mask-image:linear-gradient(white,white)] [transform:translateZ(0)]">
          {/* bg-top per allineare l'artwork in alto */}
          <div 
            className="absolute -inset-8 bg-cover bg-top filter blur-md opacity-70 scale-105 transition-all duration-1000" 
            style={{ backgroundImage: `url("https://api.scryfall.com/cards/named?exact=Opposition&format=image&version=art_crop")` }}
          ></div>
          {/* Velo scuro per garantire contrasto elegante senza nascondere l'artwork */}
          <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"></div>
        </div>
      )}

      {/* TESTI E GLOW */}
      {isDashboard && (
        <div className="flex flex-col items-center w-full max-w-4xl animate-fade-in order-1 sm:order-none relative">
          
          {/* Glow ambientale azzurro (luce morbida) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-blue-600/20 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>
          
          {/* TITOLO H1 OTTIMIZZATO (Tornato all'ombra naturale) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-3 sm:mb-5 z-10 drop-shadow-lg tracking-tight">
            Il Meta del <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Centurion Commander</span>
          </h1>
          
          {/* PARAGRAFO DESCRITTIVO CON KEYWORDS */}
          <p className="text-slate-200 text-sm md:text-base lg:text-lg text-center mb-8 md:mb-10 z-10 max-w-2xl px-2 leading-relaxed drop-shadow-md font-medium">
            Esplora il meta del formato 1v1 italiano di <strong>Magic: The Gathering</strong>. Analizziamo migliaia di decklist della community per offrirti sinergie e statistiche sempre aggiornate.
          </p>
        </div>
      )}

      {/* PULSANTE INDIETRO */}
      {!isDashboard && (
        <a href="/" onClick={(e) => handleNav(e, handleResetHome)} className="text-xl font-black text-slate-100 flex items-center gap-2 cursor-pointer group shrink-0 relative z-10 order-1 sm:order-none">
          <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" strokeWidth={2.5} />
          <span className="w-1.5 h-6 bg-blue-500 rounded-full ml-1"></span> Tutti i Comandanti
        </a>
      )}

      {/* FILTRI (Top/Hot) */}
      {!isDashboard && homeMode === 'commanders' && (
        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800 shrink-0 z-10 sm:absolute sm:left-1/2 sm:-translate-x-1/2 order-3 sm:order-none self-center sm:self-auto">
           <button onClick={() => setCommanderSort('top')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${commanderSort === 'top' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Top</button>
           <button onClick={() => setCommanderSort('hot')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${commanderSort === 'hot' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Hot (7gg)</button>
        </div>
      )}

      {/* CONTENITORE RICERCA */}
      <div className={`flex flex-col sm:flex-row items-center z-10 transition-all duration-500 order-2 sm:order-none ${
        /* Allargato il contenitore massimo da max-w-lg a max-w-2xl */
        isDashboard ? 'w-full max-w-2xl flex-col justify-center' : 'w-full sm:w-auto justify-end'
      }`}>
        <div className={`relative transition-all duration-500 w-full ${isDashboard ? '' : 'sm:w-64'}`}>
          <Search className={`absolute text-slate-400 transition-all ${isDashboard ? 'left-5 top-1/2 -translate-y-1/2 w-5 h-5' : 'left-3 top-1/2 -translate-y-1/2 w-4 h-4'}`} strokeWidth={2.5} />
          
          <input 
            type="text" 
            placeholder="Cerca comandante..." 
            value={commanderSearch}
            onChange={(e) => {
              setCommanderSearch(e.target.value);
              if (homeMode !== 'commanders') setHomeMode('commanders');
            }}
            className={`w-full focus:outline-none text-slate-100 shadow-xl transition-all placeholder:text-slate-400 ${
              isDashboard 
                /* Input reso più "bold" con py-4 e testo più grande */
                ? 'bg-slate-950/60 backdrop-blur-md border border-slate-700/60 hover:border-blue-500/50 focus:border-blue-500 rounded-full pl-12 pr-5 py-3.5 md:py-4 text-base md:text-lg font-medium' 
                : 'bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-sm focus:border-blue-500'
            }`}
          />
        </div>
      </div>
    </div>
  );
}