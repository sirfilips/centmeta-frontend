import React, { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, ChevronDown, Trophy, Flame } from 'lucide-react';

interface HeaderProps {
  filtroTempo: string;
  setFiltroTempo: (val: string) => void;
  onReset: () => void;
  totalDecks?: number;
  lastUpdated?: string | null;
  // CORREZIONE: Aggiunto il parametro "tab" mancante per allinearsi a CentMetaApp
  onNavigate?: (mode: 'commanders' | 'cards', tab: string, sort: 'top' | 'hot') => void; 
}

export default function Header({ filtroTempo, setFiltroTempo, onReset, totalDecks, lastUpdated, onNavigate }: HeaderProps) {
  const [openDropdown, setOpenDropdown] = useState<'commanders' | 'cards' | null>(null);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/D';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleNavClick = (mode: 'commanders' | 'cards', sort: 'top' | 'hot') => {
    setOpenDropdown(null);
    if (onNavigate) {
      // CORREZIONE: Passiamo esplicitamente 'Top Cards' come secondo parametro
      onNavigate(mode, 'Top Cards', sort);
    }
  };

  const toggleDropdown = (menu: 'commanders' | 'cards') => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 py-2 md:py-3 px-3 md:px-8 shadow-md relative z-50">
      
      <div className="flex flex-wrap justify-between items-center lg:grid lg:grid-cols-3 gap-y-3 lg:gap-0">
        
        {/* 1. LATO SINISTRO: Logo */}
        <div className="flex justify-start items-center">
          <div className="cursor-pointer w-28 md:w-36 lg:w-44 transition-transform hover:scale-105" onClick={onReset} title="Torna alla Dashboard">
            <Image 
              src="/logo.png" 
              alt="CentMeta Logo" 
              width={300} 
              height={100} 
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* 2. LATO DESTRO: Controlli (e Statistiche Desktop) */}
        <div className="flex flex-col items-end lg:col-start-3">
          
          <div className="flex flex-row items-center justify-end gap-1.5 md:gap-2">
            <select
              value={filtroTempo}
              onChange={(e) => setFiltroTempo(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] md:text-xs font-semibold w-[120px] sm:w-36 focus:outline-none focus:border-blue-500 text-slate-200 shadow-inner cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <option value="Ultimi 7 giorni">7 giorni</option>
              <option value="Ultimi 30 giorni">30 giorni</option>
              <option value="Ultimi 3 mesi">3 mesi</option>
              <option value="Ultimi 6 mesi">6 mesi</option>
              <option value="Ultimo anno">Ultimo anno</option>
              <option value="Tutti i tempi">Tutti i tempi</option>
            </select>

            <a 
              href="https://www.centurioncommander.eu/it/home-ita/" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Sito Ufficiale Centurion"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors border border-slate-700 flex items-center justify-center shadow-sm group h-[28px] md:h-[30px]"
            >
              <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
            </a>
          </div>

          {/* STATISTICHE DESKTOP: Visibili solo da schermi grandi, in griglia sotto ai filtri */}
          <div className="hidden lg:flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
            {totalDecks !== undefined && (
              <span className="text-blue-400 font-bold bg-blue-950/30 px-1.5 rounded border border-blue-900/30">
                {totalDecks} mazzi
              </span>
            )}
            {lastUpdated && (
              <span>Aggiornato: {formatDate(lastUpdated)}</span>
            )}
          </div>
          
        </div>

        {/* 3. CENTRO: Navigazione (e Statistiche Mobile) */}
        <div className="flex flex-row justify-between lg:justify-center items-center w-full lg:w-auto lg:col-start-2 lg:row-start-1">
          
          <nav className="flex items-center gap-4 lg:gap-8 z-50">
            <div 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('commanders')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                onClick={() => toggleDropdown('commanders')}
                className="flex items-center gap-1 text-slate-300 hover:text-white font-bold text-xs md:text-sm lg:text-base py-1 transition-colors"
              >
                Comandanti <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === 'commanders' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute top-full left-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transition-all duration-200 origin-top ${openDropdown === 'commanders' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                <div className="py-2 flex flex-col">
                  <button onClick={() => handleNavClick('commanders', 'top')} className="flex items-center gap-2 text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50">
                    <Trophy className="w-4 h-4 text-blue-400" /> Top Comandanti
                  </button>
                  <button onClick={() => handleNavClick('commanders', 'hot')} className="flex items-center gap-2 text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                    <Flame className="w-4 h-4 text-orange-500" /> Hot (7 Giorni)
                  </button>
                </div>
              </div>
            </div>

            <div 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('cards')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                onClick={() => toggleDropdown('cards')}
                className="flex items-center gap-1 text-slate-300 hover:text-white font-bold text-xs md:text-sm lg:text-base py-1 transition-colors"
              >
                Carte <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${openDropdown === 'cards' ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`absolute top-full left-0 lg:left-1/2 lg:-translate-x-1/2 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl transition-all duration-200 origin-top ${openDropdown === 'cards' ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                <div className="py-2 flex flex-col">
                  <button onClick={() => handleNavClick('cards', 'top')} className="flex items-center gap-2 text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50">
                    <Trophy className="w-4 h-4 text-blue-400" /> Top Carte
                  </button>
                  <button onClick={() => handleNavClick('cards', 'hot')} className="flex items-center gap-2 text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                    <Flame className="w-4 h-4 text-orange-500" /> Hot (7 Giorni)
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* STATISTICHE MOBILE: Visibili solo da telefono, incollati a destra sulla stessa riga dei menù */}
          <div className="flex lg:hidden flex-col items-end text-[9px] sm:text-[10px] text-slate-400 leading-tight">
            {totalDecks !== undefined && (
              <span className="text-blue-400 font-bold bg-blue-950/30 px-1.5 rounded border border-blue-900/30 mb-0.5">
                {totalDecks} mazzi
              </span>
            )}
            {lastUpdated && (
              <span>Aggiornato: {formatDate(lastUpdated)}</span>
            )}
          </div>
          
        </div>

      </div>
    </header>
  );
}