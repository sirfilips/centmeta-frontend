'use client';
import React, { useState, useEffect, useCallback } from 'react';
import ScrollToTop from './ScrollToTop';
import Header from './Header';
import Footer from './Footer';
import SkeletonCard from './SkeletonCard';
import DeckList from './DeckList';
import CardDetail from './CardDetail';
import TrendIndicator from './TrendIndicator';
import Carousel from './Carousel';
import HeroSection from './HeroSection';
import { handleNav } from '../utils/navigation';
import { RefreshCw, ArrowRight, ArrowLeft, ArrowDown, ChevronUp, ChevronDown, Search, HelpCircle } from 'lucide-react'; 

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function CentMetaApp({ initialCommander = 'Tutti i mazzi' }: { initialCommander?: string }) {
  const [filtroTempo, setFiltroTempo] = useState('Ultimi 30 giorni');
  const [homeMode, setHomeMode] = useState<'dashboard' | 'commanders' | 'cards'>('dashboard');
  const [commanderSort, setCommanderSort] = useState<'top' | 'hot'>('top');
  const [cardSort, setCardSort] = useState<'top' | 'hot'>('top');
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const [commanders, setCommanders] = useState<any[]>([]);
  
  const [selectedCommander, setSelectedCommander] = useState(initialCommander);
  
  const [statsData, setStatsData] = useState<{ total_decks: number; avg_lands?: number; mana_curve?: any; type_distribution?: any; cards: any[] }>({ total_decks: 0, cards: [] });
  const [activeTab, setActiveTab] = useState('Top Cards');
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [commanderSearch, setCommanderSearch] = useState('');
  const [cardSearch, setCardSearch] = useState('');
  const debouncedCardSearch = useDebounce(cardSearch, 300);

  const [selectedCardDetail, setSelectedCardDetail] = useState<string | null>(null);
  const [cardDetailData, setCardDetailData] = useState<any>(null);
  const [loadingCardDetail, setLoadingCardDetail] = useState(false);
  const [activeSynergyTab, setActiveSynergyTab] = useState('Tutte');

  const [commanderDecks, setCommanderDecks] = useState<any[]>([]);
  const [loadingDecks, setLoadingDecks] = useState(false);
  const [copiedDeck, setCopiedDeck] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(50);
  const [cacheStats, setCacheStats] = useState<{ [key: string]: any }>({});
  const [isFlipped, setIsFlipped] = useState(false);
  const [showOracle, setShowOracle] = useState(false);

  const isAnyLoading = loading || dashboardLoading || loadingCardDetail || loadingDecks;

  const syncStateFromURL = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    
    let cmdFromUrl = params.get('commander');
    if (pathname.startsWith('/commander/')) {
      cmdFromUrl = decodeURIComponent(pathname.split('/')[2]);
    }

    setSelectedCardDetail(params.get('card') || null);
    setSelectedCommander(cmdFromUrl || initialCommander || 'Tutti i mazzi');
    setHomeMode((params.get('view') as any) || 'dashboard');
    setActiveTab(params.get('tab') || 'Top Cards');
    setCommanderSort((params.get('csort') as any) || 'top');
    setCardSort((params.get('csort') as any) || 'top');
  }, [initialCommander]);

  useEffect(() => {
    syncStateFromURL();
    window.addEventListener('popstate', syncStateFromURL);
    return () => window.removeEventListener('popstate', syncStateFromURL);
  }, [syncStateFromURL]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCardDetail) params.set('card', selectedCardDetail);
    if (homeMode !== 'dashboard' && selectedCommander === 'Tutti i mazzi') params.set('view', homeMode);
    if (activeTab !== 'Top Cards') params.set('tab', activeTab);
    if (commanderSort !== 'top' && homeMode === 'commanders') params.set('csort', commanderSort);
    if (cardSort !== 'top' && (homeMode === 'cards' || selectedCommander !== 'Tutti i mazzi')) params.set('csort', cardSort);
    
    let basePath = '/';
    if (selectedCommander !== 'Tutti i mazzi') {
      basePath = `/commander/${encodeURIComponent(selectedCommander)}`;
    }
    
    const newUrl = params.toString() ? `${basePath}?${params.toString()}` : basePath;
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.pushState(null, '', newUrl);
    }
  }, [selectedCommander, selectedCardDetail, homeMode, activeTab, commanderSort, cardSort]);

  useEffect(() => {
    if (selectedCommander !== 'Tutti i mazzi') {
      document.title = `${selectedCommander} | Top Carte, Sinergie e Liste Centurion`;
    } else {
      document.title = 'CentMeta | Analisi Statistiche Centurion Commander';
    }
  }, [selectedCommander]);

  useEffect(() => {
    let active = true;
    setDashboardLoading(true);
    fetch(`/api/home/dashboard?filtro_tempo=${encodeURIComponent(filtroTempo)}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        setDashboardData(data);
        setDashboardLoading(false);
      }).catch(() => setDashboardLoading(false));
    return () => { active = false; };
  }, [filtroTempo]);

  useEffect(() => {
    let active = true;
    fetch(`/api/commanders?filtro_tempo=${encodeURIComponent(filtroTempo)}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        setCommanders(data);
        setCacheStats({});
      });
    return () => { active = false; };
  }, [filtroTempo]);

  useEffect(() => {
    let active = true;
    setIsFlipped(false);
    setShowOracle(false);
    
    const cacheKey = `${filtroTempo}_${selectedCommander}`;
    if (cacheStats[cacheKey]) {
      setStatsData(cacheStats[cacheKey]);
      return;
    }
    setLoading(true);
    const cmdParam = selectedCommander === 'Tutti i mazzi' ? '' : `&comandante=${encodeURIComponent(selectedCommander)}`;
    fetch(`/api/decks/stats?filtro_tempo=${encodeURIComponent(filtroTempo)}${cmdParam}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        setCacheStats(prev => ({ ...prev, [cacheKey]: data }));
        setStatsData(data);
        setLoading(false);
      });
    return () => { active = false; };
  }, [filtroTempo, selectedCommander]);

  useEffect(() => {
    let active = true;
    if (!selectedCardDetail) return;
    setIsFlipped(false);
    setLoadingCardDetail(true);
    setActiveSynergyTab('Tutte');
    setVisibleCount(50);
    fetch(`/api/card/details?card_name=${encodeURIComponent(selectedCardDetail)}&filtro_tempo=${encodeURIComponent(filtroTempo)}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        setCardDetailData(data);
        setLoadingCardDetail(false);
      });
    return () => { active = false; };
  }, [selectedCardDetail, filtroTempo]);

  useEffect(() => {
    let active = true;
    if (selectedCommander === 'Tutti i mazzi' || activeTab !== 'Liste Mazzi') return;
    setLoadingDecks(true);
    fetch(`/api/commander/decks?comandante=${encodeURIComponent(selectedCommander)}&filtro_tempo=${encodeURIComponent(filtroTempo)}`)
      .then(res => res.json())
      .then(data => {
        if (!active) return;
        setCommanderDecks(data);
        setLoadingDecks(false);
      });
    return () => { active = false; };
  }, [selectedCommander, filtroTempo, activeTab]);

  useEffect(() => { setVisibleCount(50); }, [activeTab, debouncedCardSearch, activeColors, selectedCommander, selectedCardDetail, homeMode, commanderSort, cardSort]);

  const handleSelectCard = (val: string | null) => {
    setSelectedCardDetail(val);
    if (val) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCommander = (val: string) => {
    setSelectedCommander(val);
    if (val !== 'Tutti i mazzi') {
      setCommanderSearch('');
      setActiveTab('Top Cards');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleColor = (col: string) => {
    if (col === 'Tutti') {
      setActiveColors([]);
    } else {
      setActiveColors(prev => {
        if (prev.includes(col)) return prev.filter(c => c !== col);
        return [...prev, col];
      });
    }
    setVisibleCount(50);
  };

  const terreBase = ["Plains", "Island", "Swamp", "Mountain", "Forest", "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp", "Snow-Covered Mountain", "Snow-Covered Forest"];

  const applyFilters = (cards: any[], tab: string) => {
    let filtered = cards || [];
    
    if (homeMode === 'cards' && cardSort === 'hot' && selectedCommander === 'Tutti i mazzi') {
      filtered = (dashboardData?.hot_cards || []).map((c: any) => ({
        card_name: c.name, images: c.images, freq: c.val1, Percentuale: 0, Sinergia: 0, delta: c.delta, category: c.category, color_identity: c.color_identity || []
      }));
    }
    
    if (tab === 'Top Sinergie' || tab === 'In Crescita') {
      filtered = filtered.filter(c => !terreBase.includes(c.card_name) && c.category !== 'Terre');
      filtered = [...filtered].sort((a, b) => (b.Sinergia || 0) - (a.Sinergia || 0));
    } else if (tab === 'Top Cards') {
      filtered = filtered.filter(c => !terreBase.includes(c.card_name));
      filtered = [...filtered].sort((a, b) => (b.Percentuale || 0) - (a.Percentuale || 0));
    } else if (tab === 'Terre') {
      filtered = filtered.filter(c => c.category === 'Terre' || terreBase.includes(c.card_name));
    } else if (tab !== 'Tutte' && tab !== 'Hot Cards' && tab !== 'Liste Mazzi') {
      filtered = filtered.filter(c => c.category === tab);
    }
    
    if (debouncedCardSearch.trim() !== '') {
      filtered = filtered.filter(c => c.card_name.toLowerCase().includes(debouncedCardSearch.toLowerCase()));
    }
    
    if (activeColors.length > 0) {
      filtered = filtered.filter(c => {
        const isC = c.color_identity.length === 0;
        const isM = c.color_identity.length > 1;
        const matchC = activeColors.includes('C') && isC;
        const matchM = activeColors.includes('M') && isM;
        const baseColors = activeColors.filter(a => a !== 'C' && a !== 'M');
        
        let matchBase = false;
        if (baseColors.length > 0) {
          matchBase = c.color_identity.some((col: string) => baseColors.includes(col));
        }
        
        if (activeColors.includes('M') && baseColors.length > 0) return matchBase && isM;
        if (baseColors.length > 0) return matchBase || matchC || matchM;
        return matchC || matchM;
      });
    }
    return filtered;
  };

  let synergyLabel = 'Top Sinergie';
  if (selectedCommander === 'Tutti i mazzi') {
      synergyLabel = 'In Crescita';
  }

  let categories = ['Top Cards', synergyLabel, 'Creature', 'Istantanei', 'Stregonerie', 'Artefatti', 'Incantesimi', 'Planeswalker', 'Terre'];
  if (selectedCommander === 'Tutti i mazzi' && filtroTempo === 'Tutti i tempi') {
      categories = categories.filter(c => c !== 'In Crescita');
  }

  const synergyCategories = ['Tutte', 'Creature', 'Istantanei', 'Stregonerie', 'Artefatti', 'Incantesimi', 'Planeswalker', 'Terre'];
  const colors = [{ label: 'Tutti', val: 'Tutti' }, { label: '⚪', val: 'W' }, { label: '🔵', val: 'U' }, { label: '⚫', val: 'B' }, { label: '🔴', val: 'R' }, { label: '🟢', val: 'G' }, { label: '🎨', val: 'M' }, { label: '⚙️', val: 'C' }];

  const filteredCommanders = commanders.filter(c => c.comandante.toLowerCase().includes(commanderSearch.toLowerCase()));
  const listToRender = commanderSort === 'hot' 
    ? (dashboardData?.hot_commanders || []).filter((c: any) => c.name.toLowerCase().includes(commanderSearch.toLowerCase()))
    : filteredCommanders;

  const selectedCmdObj = commanders.find(c => c.comandante === selectedCommander);
  const visibleCardsData = applyFilters(statsData.cards, activeTab);
  const visibleSynergiesData = applyFilters(cardDetailData?.synergies, activeSynergyTab);

  const handleResetHome = () => {
    setSelectedCardDetail(null);
    setSelectedCommander('Tutti i mazzi');
    setCommanderSearch('');
    setActiveTab('Top Cards');
    setHomeMode('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToTab = (mode: 'commanders'|'cards', tab: string = 'Top Cards', sort: 'top'|'hot' = 'top') => {
    setHomeMode(mode);
    setActiveTab(tab);
    if (mode === 'commanders') setCommanderSort(sort);
    if (mode === 'cards') setCardSort(sort);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDecks = () => {
    setActiveTab('Liste Mazzi');
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      const y = contentSection.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleTypeClick = (type: string) => {
    const validCategories = ['Creature', 'Istantanei', 'Stregonerie', 'Artefatti', 'Incantesimi', 'Planeswalker', 'Terre'];
    if (validCategories.includes(type)) {
      setActiveTab(type);
      setVisibleCount(50);
      const contentSection = document.getElementById('content-section');
      if (contentSection) {
        const y = contentSection.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleBackToCards = () => {
    setActiveTab('Top Cards');
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      const y = contentSection.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative">
      
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${isAnyLoading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
        <div className="bg-blue-600/90 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 border border-blue-400/50">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm font-bold tracking-wide">Caricamento dati...</span>
        </div>
      </div>

      <div className="flex-grow pb-24">
        
        <Header 
          filtroTempo={filtroTempo} setFiltroTempo={setFiltroTempo} onReset={handleResetHome} 
          totalDecks={homeMode === 'dashboard' ? dashboardData?.total_decks : statsData.total_decks} 
          lastUpdated={(statsData as any).last_updated} 
        />

        <div className="max-w-[1600px] w-full mx-auto px-4 md:px-8 mt-8">
          
          {selectedCardDetail ? (
            <CardDetail 
              selectedCardDetail={selectedCardDetail} setSelectedCardDetail={handleSelectCard} loadingCardDetail={loadingCardDetail} cardDetailData={cardDetailData}
              filtroTempo={filtroTempo} isFlipped={isFlipped} setIsFlipped={setIsFlipped} commanders={commanders} setSelectedCommander={handleSelectCommander}
              setCommanderSearch={setCommanderSearch} setActiveTab={setActiveTab} activeSynergyTab={activeSynergyTab} setActiveSynergyTab={setActiveSynergyTab}
              visibleCount={visibleCount} setVisibleCount={setVisibleCount} activeColors={activeColors} toggleColor={toggleColor} colors={colors}
              synergyCategories={synergyCategories} visibleSynergiesData={visibleSynergiesData}
            />
          ) : (
            <div>
              {(homeMode === 'dashboard' || homeMode === 'commanders') && selectedCommander === 'Tutti i mazzi' && (
                <div className="animate-fade-in mb-14">
                  
                  <HeroSection 
                    homeMode={homeMode}
                    setHomeMode={setHomeMode}
                    commanderSearch={commanderSearch}
                    setCommanderSearch={setCommanderSearch}
                    dashboardLoading={dashboardLoading}
                    dashboardData={dashboardData}
                    handleResetHome={handleResetHome}
                    commanderSort={commanderSort}
                    setCommanderSort={setCommanderSort}
                  />

                  {homeMode === 'dashboard' && (
                    <>
                      {dashboardLoading || !dashboardData ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 mt-10">
                          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                      ) : (
                        <>
                          <Carousel title="Comandanti Più Usati" items={dashboardData.top_commanders} isCard={false} isHot={false} viewAllHref="/?view=commanders&csort=top" onViewAll={() => navigateToTab('commanders', 'Top Cards', 'top')} onItemClick={handleSelectCommander} />
                          <Carousel title="Comandanti Hot (7gg)" items={dashboardData.hot_commanders} isCard={false} isHot={true} viewAllHref="/?view=commanders&csort=hot" onViewAll={() => navigateToTab('commanders', 'Top Cards', 'hot')} onItemClick={handleSelectCommander} />
                          <Carousel title="Carte Più Usate" items={(dashboardData.top_cards || []).filter((c:any) => c.category !== 'Terre').slice(0, 25)} isCard={true} isHot={false} viewAllHref="/?view=cards&tab=Top+Cards&csort=top" onViewAll={() => navigateToTab('cards', 'Top Cards', 'top')} onItemClick={handleSelectCard} />
                          <Carousel title="Carte Hot (7gg)" items={(dashboardData.hot_cards || []).filter((c:any) => c.category !== 'Terre').slice(0, 25)} isCard={true} isHot={true} viewAllHref="/?view=cards&tab=Top+Cards&csort=hot" onViewAll={() => navigateToTab('cards', 'Top Cards', 'hot')} onItemClick={handleSelectCard} />
                        </>
                      )}
                    </>
                  )}

                  {homeMode === 'commanders' && (
                    <>
                      {listToRender.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">Nessun comandante trovato.</div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-10 gap-x-6">
                          {listToRender.slice(0, visibleCount).map((cmd: any) => {
                            const isHotSort = commanderSort === 'hot';
                            const cmdName = isHotSort ? cmd.name : cmd.comandante;
                            const count = isHotSort ? cmd.val1 : cmd.cnt;
                            const globalRank = isHotSort ? null : commanders.findIndex(c => c.comandante === cmdName) + 1;
                            const isPartner = cmdName.includes(' / ') && !cmdName.includes(' // ');

                            return (
                              <a 
                                key={cmdName} 
                                href={`/commander/${encodeURIComponent(cmdName)}`}
                                onClick={(e) => handleNav(e, () => handleSelectCommander(cmdName))}
                                className="flex flex-col items-center group cursor-pointer"
                              >
                                <div className="relative w-full aspect-[2.5/3.5] flex justify-center items-center mb-2 md:mb-3">
                                  {isPartner && cmd.images?.length > 1 ? (
                                    <div className="relative w-full h-full flex justify-center items-center">
                                      <img src={cmd.images[0]} className="absolute w-[65%] max-h-[90%] object-contain rounded-xl shadow-lg -translate-x-4 -translate-y-2 -rotate-6 z-10 hover:z-30 hover:scale-110 transition-all duration-300" />
                                      <img src={cmd.images[1]} className="absolute w-[65%] max-h-[90%] object-contain rounded-xl shadow-lg translate-x-4 translate-y-2 rotate-6 z-20 hover:z-30 hover:scale-110 transition-all duration-300" />
                                    </div>
                                  ) : cmd.images?.length > 0 ? (
                                    <img src={cmd.images[0]} className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 group-hover:shadow-blue-900/40 transition-all duration-300 object-contain" />
                                  ) : (
                                    <div className="text-xs text-slate-500 w-full h-full bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">{cmdName}</div>
                                  )}
                                </div>
                                <div className="text-center w-full px-1">
                                  <div className="font-bold text-sm text-slate-200 truncate flex items-center justify-center gap-1.5" title={cmdName}>
                                    {!isHotSort && <span className="bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded text-[10px] font-black">#{globalRank}</span>}
                                    <span className="truncate">{cmdName}</span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2 mt-1">
                                     <span className="text-[11px] text-slate-400 font-medium">{count} mazzi</span>
                                     {isHotSort ? <TrendIndicator delta={cmd.delta} /> : <TrendIndicator trend={cmd.trend} />}
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      )}
                      {listToRender.length > visibleCount && (
                        <div className="mt-14 text-center">
                          <button onClick={() => setVisibleCount(v => v + 50)} className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-bold py-3 px-10 rounded-full border border-slate-700 transition shadow-lg flex items-center justify-center gap-2 mx-auto">
                            Mostra altri <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                      
                      <div className="mt-8 text-left">
                         <a href="/" onClick={(e) => handleNav(e, handleResetHome)} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-md border border-blue-500/30 inline-flex items-center justify-center gap-2">
                           <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Torna alla Dashboard
                         </a>
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectedCommander !== 'Tutti i mazzi' && (
                <section className={`mb-8 md:mb-10 border border-slate-800 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row items-center lg:items-start gap-5 md:gap-12 shadow-2xl relative overflow-hidden transition-all duration-500 ${loading ? 'bg-slate-950/80' : 'bg-slate-900/40 animate-fade-in'}`}>
                  
                  <div className={`absolute inset-0 z-50 bg-slate-950/50 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                     <div className="flex flex-col items-center gap-3 bg-slate-900/90 p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
                       <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">Analisi in corso...</span>
                     </div>
                  </div>

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-900 z-10"></div>
                  
                  <div className={`relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-5 md:gap-12 w-full transition-opacity duration-300 ${loading ? 'opacity-40 grayscale-[30%]' : 'opacity-100'}`}>
                    
                    <div className="flex justify-center items-center flex-shrink-0 mx-auto lg:mx-0 w-44 sm:w-56 md:w-64 xl:w-[350px]">
                      {selectedCommander.includes(' / ') && !selectedCommander.includes(' // ') ? (
                         <div className="relative w-full aspect-[2.5/3.5] flex-shrink-0 flex justify-center items-center">
                            <img src={selectedCmdObj?.images?.[0]} className="absolute w-[75%] max-h-full object-contain rounded-2xl shadow-xl border border-slate-700/50 -translate-x-4 md:-translate-x-8 -translate-y-3 md:-translate-y-6 -rotate-6 z-10 hover:z-30 hover:scale-105 transition-all duration-300" />
                            <img src={selectedCmdObj?.images?.[1]} className="absolute w-[75%] max-h-full object-contain rounded-2xl shadow-xl border border-slate-700/50 translate-x-4 md:translate-x-8 translate-y-3 md:translate-y-6 rotate-6 z-20 hover:z-30 hover:scale-105 transition-all duration-300" />
                         </div>
                      ) : selectedCmdObj?.images && selectedCmdObj.images.length > 1 ? (
                        <div className="relative w-full aspect-[2.5/3.5] [perspective:1000px] group flex-shrink-0">
                          <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                            <div className="absolute inset-0 [backface-visibility:hidden]">
                              <img src={selectedCmdObj.images[0]} className="w-full h-full object-contain rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50" />
                            </div>
                            <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                              <img src={selectedCmdObj.images[1]} className="w-full h-full object-contain rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50" />
                            </div>
                          </div>
                          <button onClick={() => setIsFlipped(!isFlipped)} title="Gira Carta" className="absolute -bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-lg border-2 border-blue-400 z-20 transition-transform hover:scale-110">
                            <RefreshCw className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : selectedCmdObj?.images && selectedCmdObj.images.length === 1 ? (
                        <img src={selectedCmdObj.images[0]} className="w-full object-contain rounded-xl md:rounded-2xl shadow-xl border border-slate-700/50 flex-shrink-0" />
                      ) : null}
                    </div>
                    
                    <div className="flex flex-col gap-3 md:gap-4 w-full flex-1 relative isolate rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-10 border border-slate-700/50 shadow-xl min-h-[auto] lg:min-h-[320px] justify-start">
  
                        {/* FIX DEFINITIVO WEBKIT: mask-image e translateZ forzano il browser a non sbrodolare il blur fuori dai bordi */}
                        <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden -z-20 pointer-events-none [mask-image:linear-gradient(white,white)] [transform:translateZ(0)]">
                          {selectedCmdObj?.art_crops?.[0] && (
                            <div className="absolute -inset-8 bg-cover bg-center filter blur-md opacity-80" style={{ backgroundImage: `url("${selectedCmdObj.art_crops[0]}")` }}></div>
                          )}
                          <div className="absolute inset-0 bg-slate-950/70 md:bg-slate-950/50 backdrop-blur-sm"></div>
                        </div>
                      <div className="relative z-10 flex flex-col gap-2 md:gap-4 w-full">
                        <div className="text-center lg:text-left">
                          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold bg-blue-950/50 px-2.5 py-1 md:px-3 md:py-1 rounded-full border border-blue-900/50 shadow-inner">Comandante Analizzato</span>
                          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mt-3 md:mt-4 drop-shadow-md leading-tight">{selectedCommander}</h1>
                        </div>
                        
                        {selectedCmdObj?.oracles && selectedCmdObj.oracles.length > 0 && (
                          <div className="flex flex-col gap-2 mt-2 md:mt-4">
                            <button 
                              onClick={() => setShowOracle(!showOracle)}
                              className="lg:hidden flex items-center justify-between text-[11px] font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 px-4 py-2.5 rounded-xl border border-slate-700/50 shadow-sm transition-colors"
                            >
                              <span>Testo della carta (Oracle)</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                {showOracle ? <><ChevronUp className="w-3 h-3"/> Nascondi</> : <><ChevronDown className="w-3 h-3"/> Mostra</>}
                              </span>
                            </button>
                            
                            <div className={`flex-col gap-2 ${showOracle ? 'flex' : 'hidden lg:flex'}`}>
                              {selectedCmdObj.oracles.map((oracle: string, idx: number) => (
                                <p key={idx} className="text-slate-200 text-xs md:text-base bg-slate-950/80 md:bg-slate-950/60 p-4 md:p-5 rounded-xl border border-slate-800 whitespace-pre-line leading-relaxed shadow-inner">
                                  {oracle}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-col xl:flex-row flex-wrap items-stretch gap-3 md:gap-4 mt-3 md:mt-5">
                          <div className="bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-sm flex flex-col w-full xl:w-auto xl:min-w-[160px] overflow-hidden">
                            <div className="px-4 py-3 md:px-6 md:py-5 flex-1 flex flex-col justify-center items-center xl:items-start text-center xl:text-left">
                              <span className="text-[10px] md:text-xs text-slate-400 block mb-0.5 md:mb-2 font-medium">Mazzi Trovati</span>
                              <span className="text-3xl md:text-4xl font-black text-blue-400">{statsData.total_decks}</span>
                            </div>
                            {statsData.total_decks > 0 && (
                              <a 
                                href="#content-section"
                                onClick={(e) => handleNav(e, handleViewDecks)}
                                className="bg-slate-900/60 hover:bg-slate-700/80 border-t border-slate-700/50 px-4 py-2.5 md:px-6 md:py-3 flex items-center justify-center xl:justify-between transition-all group cursor-pointer gap-2"
                              >
                                <span className="text-xs md:text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Liste Mazzi</span>
                                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
                              </a>
                            )}
                          </div>

                          {statsData.mana_curve && Object.keys(statsData.mana_curve).length > 0 && (
                            <div className="bg-slate-800/80 px-4 py-4 md:px-6 md:py-5 rounded-xl border border-slate-700/50 shadow-sm flex flex-col flex-1 w-full xl:max-w-[450px]">
                              <span className="text-[10px] md:text-xs text-slate-400 block mb-2 md:mb-4 font-medium text-center xl:text-left">Curva del Mana Media</span>
                              <div className="flex flex-col h-16 md:h-24 w-full">
                                <div className="flex items-end justify-start gap-1 sm:gap-2 h-full w-full border-b border-slate-700/50 pb-1">
                                  {[0, 1, 2, 3, 4, 5, 6].map(cmc => {
                                    const val = statsData.mana_curve[cmc] || 0;
                                    const maxVal = Math.max(...(Object.values(statsData.mana_curve) as number[]));
                                    const height = maxVal > 0 ? `${(val / maxVal) * 100}%` : '0%';
                                    return (
                                      <div key={cmc} className="flex-1 flex flex-col justify-end group relative h-full">
                                        <div className="w-full bg-blue-500/80 rounded-t-sm transition-all duration-500 group-hover:bg-blue-400" style={{ height }}></div>
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-900 text-slate-200 text-[9px] md:text-[10px] px-1.5 py-0.5 md:px-2 md:py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700/50">
                                          <span className="font-bold text-blue-400">{val}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="flex justify-start gap-1 sm:gap-2 w-full mt-1.5">
                                  {[0, 1, 2, 3, 4, 5, 6].map(cmc => (
                                    <span key={`label-${cmc}`} className="flex-1 text-center text-[9px] md:text-[10px] text-slate-400 font-bold leading-none">{cmc}{cmc === 6 ? '+' : ''}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {statsData.type_distribution && Object.keys(statsData.type_distribution).length > 0 && (
                            <div className="bg-slate-800/80 px-4 py-4 md:px-6 md:py-5 rounded-xl border border-slate-700/50 shadow-sm flex flex-col flex-1 w-full xl:max-w-[450px]">
                              <span className="text-[10px] md:text-xs text-slate-400 block mb-2 md:mb-4 font-medium text-center xl:text-left">Composizione Media</span>
                              <div className="flex flex-col gap-3 md:gap-5 h-full justify-center">
                                
                                <div className="flex w-full h-3 md:h-4 rounded-md overflow-hidden bg-slate-900 shadow-inner gap-[1px]">
                                  {Object.entries(statsData.type_distribution)
                                    .sort(([typeA, countA], [typeB, countB]) => {
                                      if (typeA === 'Terre') return 1;
                                      if (typeB === 'Terre') return -1;
                                      return (countB as number) - (countA as number);
                                    })
                                    .map(([type, count]) => {
                                      const totalCards = Object.values(statsData.type_distribution).reduce((a: any, b: any) => a + b, 0) as number;
                                      const perc = ((count as number) / totalCards) * 100;
                                      const width = `${perc}%`;
                                      let bgColor = 'bg-slate-500';
                                      if (type === 'Creature') bgColor = 'bg-emerald-500';
                                      if (type === 'Istantanei') bgColor = 'bg-blue-500';
                                      if (type === 'Stregonerie') bgColor = 'bg-red-500';
                                      if (type === 'Artefatti') bgColor = 'bg-slate-400';
                                      if (type === 'Incantesimi') bgColor = 'bg-purple-500';
                                      if (type === 'Planeswalker') bgColor = 'bg-pink-500'; 
                                      if (type === 'Terre') bgColor = 'bg-yellow-600'; 
                                      
                                      return (
                                        <div 
                                          key={type} 
                                          onClick={() => handleTypeClick(type)}
                                          style={{ width }} 
                                          className={`${bgColor} h-full transition-all hover:brightness-125 hover:scale-105 cursor-pointer`} 
                                          title={`Filtra per ${type}: ${Math.round(count as number)} carte (${perc.toFixed(1)}%)`} 
                                        />
                                      );
                                  })}
                                </div>

                                <div className="flex flex-wrap justify-center xl:justify-start gap-x-3 gap-y-1.5 mt-1">
                                  {Object.entries(statsData.type_distribution)
                                    .sort(([typeA, countA], [typeB, countB]) => {
                                      if (typeA === 'Terre') return 1;
                                      if (typeB === 'Terre') return -1;
                                      return (countB as number) - (countA as number);
                                    }) 
                                    .map(([type, count]) => {
                                      let dotColor = 'text-slate-500';
                                      if (type === 'Creature') dotColor = 'text-emerald-500';
                                      if (type === 'Istantanei') dotColor = 'text-blue-500';
                                      if (type === 'Stregonerie') dotColor = 'text-red-500';
                                      if (type === 'Artefatti') dotColor = 'text-slate-400';
                                      if (type === 'Incantesimi') dotColor = 'text-purple-500';
                                      if (type === 'Planeswalker') dotColor = 'text-pink-500';
                                      if (type === 'Terre') dotColor = 'text-yellow-600';

                                      return (
                                        <div 
                                          key={type} 
                                          onClick={() => handleTypeClick(type)}
                                          title={`Filtra per ${type}`}
                                          className="flex items-center gap-1.5 text-[10px] md:text-[11px] text-slate-300 font-medium cursor-pointer hover:text-white transition-colors group"
                                        >
                                          <span className={`${dotColor} text-lg leading-none group-hover:scale-125 transition-transform`}>•</span>
                                          <span>{type} ({Math.round(count as number)})</span>
                                        </div>
                                      );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <a href="/" onClick={(e) => handleNav(e, handleResetHome)} className="mt-4 md:mt-6 self-center lg:self-start bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-xs md:text-sm font-bold px-6 py-3 md:px-8 md:py-3.5 rounded-full transition-all duration-300 shadow-md border border-blue-500/30 inline-flex items-center justify-center gap-2">
                          <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Torna alla Dashboard
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {(homeMode === 'cards' || selectedCommander !== 'Tutti i mazzi') && (
                <div id="content-section" className="animate-fade-in">
                  <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md pt-4 pb-3 border-b border-slate-800/80 mb-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      
                      {homeMode === 'cards' && selectedCommander === 'Tutti i mazzi' ? (
                        <>
                          <a href="/" onClick={(e) => handleNav(e, handleResetHome)} className="text-xl font-black text-slate-100 flex items-center gap-2 cursor-pointer group">
                            <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" strokeWidth={2.5} />
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full ml-1"></span> Tutte le Carte
                          </a>
                          
                          <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                             <button onClick={() => setCardSort('top')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${cardSort === 'top' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Top</button>
                             <button onClick={() => setCardSort('hot')} className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all flex items-center gap-1.5 ${cardSort === 'hot' ? 'bg-orange-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Hot (7gg)</button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                          <select 
                            value={selectedCommander} 
                            onChange={(e) => handleSelectCommander(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm font-semibold w-full sm:w-80 focus:outline-none focus:border-blue-500 text-slate-200 shadow-inner"
                          >
                            <option value="Tutti i mazzi">Tutti i mazzi (Seleziona Comandante)</option>
                            {commanders.map((c, idx) => (
                              <option key={idx} value={c.comandante}>{c.comandante}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        {activeTab !== 'Liste Mazzi' && (
                          <input 
                            type="text" placeholder="Filtra carte per nome..." value={cardSearch} onChange={(e) => setCardSearch(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-full px-5 py-2 text-sm w-full sm:w-72 focus:outline-none focus:border-blue-500 text-slate-200"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      {activeTab !== 'Liste Mazzi' && (
                        <div className="flex gap-2 overflow-x-auto pb-1 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {categories.map((cat) => (
                            <div key={cat} className="relative group/tab flex items-center">
                              <button onClick={() => { setActiveTab(cat); setVisibleCount(50); }} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === cat ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'}`}>
                                {cat}
                              </button>
                              
                              {/* Tooltip Etichette Speciali */}
                              {(cat === 'In Crescita' || cat === 'Top Sinergie') && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tab:block w-48 p-2.5 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none text-center whitespace-normal leading-relaxed">
                                  {cat === 'In Crescita' 
                                    ? "Carte con il maggiore incremento globale di utilizzo negli ultimi 7 giorni." 
                                    : "Carte con il tasso di affinità e inclusione più alto per questo specifico comandante."}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {activeTab !== 'Liste Mazzi' && (
                        <div className="flex gap-1.5 overflow-x-auto pb-1 w-full sm:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                          {colors.map((col) => {
                            const isActive = activeColors.length === 0 ? col.val === 'Tutti' : activeColors.includes(col.val);
                            return (
                              <button key={col.val} onClick={() => toggleColor(col.val)} className={`px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap transition-all border ${isActive ? 'bg-slate-700 text-white border-slate-500' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'}`}>
                                {col.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {activeTab === 'Liste Mazzi' ? (
                    <div className="animate-fade-in flex flex-col w-full">
                      <div className="w-full flex justify-start mb-6">
                         <a href="#content-section" onClick={(e) => handleNav(e, handleBackToCards)} className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-bold py-2 px-6 rounded-full border border-slate-700 transition shadow-sm flex items-center justify-center gap-2">
                           <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Torna alle Carte
                         </a>
                      </div>
                      <DeckList loadingDecks={loadingDecks} commanderDecks={commanderDecks} copiedDeck={copiedDeck} setCopiedDeck={setCopiedDeck} />
                    </div>
                  ) : loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                      {[...Array(14)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  ) : (
                    <>
                      {visibleCardsData.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center">
                          <Search className="w-12 h-12 mb-4 opacity-30 text-slate-500" strokeWidth={1.5} />
                          <p className="text-slate-400 font-medium">Nessuna carta trovata con i filtri attuali.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-y-10 gap-x-6">
                          {visibleCardsData.slice(0, visibleCount).map((card: any, idx: number) => {
                            const displayImages = card.images?.length > 0 ? [card.images[0]] : [];
                            return (
                              <a 
                                key={idx} 
                                href={`/?card=${encodeURIComponent(card.card_name)}`}
                                onClick={(e) => handleNav(e, () => handleSelectCard(card.card_name))}
                                className="flex flex-col items-center group cursor-pointer"
                              >
                                <div className="relative w-full aspect-[2.5/3.5] flex justify-center items-center mb-2 md:mb-3">
                                  {displayImages.length === 1 ? (
                                    <img src={displayImages[0]} className="max-h-full max-w-full rounded-xl shadow-lg group-hover:-translate-y-2 group-hover:shadow-blue-900/30 transition-all duration-300 object-contain" />
                                  ) : (
                                    <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-500">{card.card_name}</div>
                                  )}
                                </div>
                                <div className="text-center w-full px-1">
                                  <div className="font-bold text-xs text-slate-200 truncate" title={card.card_name}>{card.card_name}</div>
                                  <div className="flex flex-wrap justify-center items-center gap-1.5 mt-1">
                                    {(homeMode === 'cards' && cardSort === 'hot' && selectedCommander === 'Tutti i mazzi') ? (
                                      <>
                                        <span className="text-[11px] text-slate-400 font-medium">{card.freq} mazzi</span>
                                        {/* Tooltip per Delta Positivo */}
                                        <div className="group/delta relative flex items-center cursor-help">
                                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded font-bold">+{card.delta}</span>
                                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/delta:block w-40 p-2.5 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none text-center font-normal">
                                            <strong className="text-orange-400 block mb-1">Trend Positivo</strong>
                                            Nuovi mazzi in cui è stata inclusa negli ultimi 7 giorni.
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div className="text-[11px] text-blue-400 font-semibold">
                                          {card.Percentuale}% <span className="text-slate-500 font-normal">({card.freq})</span>
                                        </div>
                                        {(activeTab === 'Top Sinergie' || activeTab === 'In Crescita') && card.Sinergia > 0 && (
                                          /* Tooltip per Sinergia */
                                          <div className="group/syn relative flex items-center cursor-help">
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">+{card.Sinergia}%</span>
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/syn:block w-48 p-2.5 bg-slate-800 text-[11px] text-slate-200 rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none text-center font-normal">
                                              <strong className="text-emerald-400 block mb-1">Valore Sinergia</strong>
                                              Indica quanto questa carta è giocata in più in questo mazzo rispetto alla media globale.
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {visibleCardsData.length > visibleCount && (
                        <div className="mt-14 text-center">
                          <button onClick={() => setVisibleCount(v => v + 50)} className="bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-bold py-3 px-10 rounded-full border border-slate-700 transition shadow-lg flex items-center justify-center gap-1.5 mx-auto">
                            Mostra altre carte <ArrowDown className="w-4 h-4" strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                      
                      {homeMode === 'cards' && (
                        <div className="mt-8 text-left">
                           <a href="/" onClick={(e) => handleNav(e, handleResetHome)} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-sm font-bold px-8 py-3.5 rounded-full transition-all duration-300 shadow-md border border-blue-500/30 inline-flex items-center justify-center gap-2">
                             <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Torna alla Dashboard
                           </a>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}