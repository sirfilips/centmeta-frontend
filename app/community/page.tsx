"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Trophy, 
  Users, 
  Star, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Layers, 
  Swords, 
  Vote, 
  FlaskConical, 
  ChevronRight,
  BarChart2
} from "lucide-react";
import CommunityNav from "../../components/CommunityNav";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

interface CardPreview {
  card_name: string;
  total_votes: number;
  avg_score: number;
  images: string[];
  art_crops: string[];
}

interface OverviewData {
  total_votes: number;
  total_cards_rated: number;
  top_rated: CardPreview[];
  most_voted: CardPreview[];
}

export default function CommunityPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/community/overview")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((resData) => {
        if (active) {
          setData(resData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const topCard = data?.top_rated?.[0];
  const mostVotedCard = data?.most_voted?.[0];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <CommunityNav />

      {/* Glow Atmosferico Dinamico */}
      <div 
        aria-hidden="true" 
        className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[340px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-[120px] pointer-events-none -z-0 animate-pulse duration-1000"
      />

      <div className="flex-grow pb-24 max-w-[1080px] w-full mx-auto px-4 md:px-8 mt-10 relative z-10 space-y-10">
        
        {/* HERO HEADER */}
        <section className="text-center space-y-4 max-w-2xl mx-auto animate-fade-in">
          {/* Badge con Live Radar Dot */}
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold shadow-sm transition-all hover:bg-blue-500/15 hover:border-blue-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Osservatorio Community
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Il Giudizio della Community
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            In questa sezione puoi votare le carte del formato Centurion Commander assegnando da 1 a 5 stelle.
            I voti raccolti costruiscono la classifica della community, per confrontare l&apos;opinione dei giocatori con la reale presenza delle carte nei mazzi.
          </p>

          {/* BOX CITAZIONE ORIGINALE */}
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-purple-950/40 border border-blue-900/30 rounded-2xl p-6 sm:p-7 shadow-xl relative isolate overflow-hidden">
            <div className="text-3xl text-blue-400/30 font-serif leading-none absolute top-3 left-4 select-none">“</div>
            <p className="text-lg sm:text-xl font-medium text-slate-200 italic leading-relaxed px-4">
              “Le carte di Magic sono tutte scarse, a meno che non siano forti.”
            </p>
            <div className="mt-3 text-xs sm:text-sm font-bold text-blue-400 tracking-wide uppercase">
              — Anonimo
            </div>
          </div>
        </section>

        {/* METRICHE TELEMETRICHE IN TEMPO REALE */}
        <section aria-label="Metriche Community" className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* 1. Voti Totali */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm transition-all duration-300 flex flex-col justify-between group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-amber-300 transition-colors">
                Voti Totali
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Vote className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {loading ? (
                <span className="animate-pulse text-slate-600">---</span>
              ) : (
                data?.total_votes?.toLocaleString("it-IT") ?? 0
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Valutazioni registrate</p>
          </div>

          {/* 2. Carte Valutate */}
          <div className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm transition-all duration-300 flex flex-col justify-between group">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-300 transition-colors">
                Carte Valutate
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {loading ? (
                <span className="animate-pulse text-slate-600">---</span>
              ) : (
                data?.total_cards_rated?.toLocaleString("it-IT") ?? 0
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Con almeno un voto</p>
          </div>

          {/* 3. Top Rated */}
          <Link
            href={
              topCard && topCard.total_votes < 2
                ? "/community/classifica?sort=highest&min_votes=1"
                : "/community/classifica?sort=highest"
            }
            className="group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm transition-all duration-300 flex flex-col justify-between cursor-pointer"
            title="Visualizza classifica per punteggio"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 group-hover:text-blue-300 uppercase tracking-wider transition-colors">
                Top Rated
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-blue-400 group-hover:scale-110 transition-all">
                <Trophy className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg font-bold text-blue-300 truncate tracking-tight group-hover:text-white transition-colors">
              {loading ? "..." : topCard?.card_name || "In attesa"}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
              {topCard ? (
                <>
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {topCard.avg_score.toFixed(1)}
                  </span>
                  <span>• {topCard.total_votes} {topCard.total_votes === 1 ? "voto" : "voti"}</span>
                </>
              ) : (
                <span>Prime votazioni in corso</span>
              )}
            </div>
          </Link>

          {/* 4. Più Votata */}
          <Link
            href={
              mostVotedCard && mostVotedCard.total_votes < 2
                ? "/community/classifica?sort=most_voted&min_votes=1"
                : "/community/classifica?sort=most_voted"
            }
            className="group bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm transition-all duration-300 flex flex-col justify-between cursor-pointer"
            title="Visualizza classifica per numero di voti"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 group-hover:text-orange-300 uppercase tracking-wider transition-colors">
                Più Votata
              </span>
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center text-orange-400 group-hover:scale-110 transition-all">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-base sm:text-lg font-bold text-orange-300 truncate tracking-tight group-hover:text-white transition-colors">
              {loading ? "..." : mostVotedCard?.card_name || "In attesa"}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
              {mostVotedCard ? (
                <>
                  <span className="text-orange-400 font-bold">
                    {mostVotedCard.total_votes} {mostVotedCard.total_votes === 1 ? "voto" : "voti"}
                  </span>
                  <span>• {mostVotedCard.avg_score.toFixed(1)} ★</span>
                </>
              ) : (
                <span>In attesa di dati</span>
              )}
            </div>
          </Link>
        </section>

        {/* ACCESSO RAPIDO ALLE SEZIONI CON MICRO-INTERAZIONI */}
        <section aria-label="Accesso Rapido" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. ARENA DI VOTO */}
          <Link
            href="/community/vota"
            className="group relative bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden"
          >
            {/* Accento superiore luminoso */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
                <Swords className="w-5 h-5 transition-transform group-hover:rotate-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    Arena di Voto
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 hidden sm:inline">
                    Pool 150 carte
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  Valuta le carte da 1 a 5 stelle o passa alla successiva
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors shrink-0">
              <span className="hidden sm:inline">Vota ora</span>
              <div className="w-7 h-7 rounded-full bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-200">
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          {/* 2. CLASSIFICA */}
          <Link
            href="/community/classifica"
            className="group relative bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer overflow-hidden"
          >
            {/* Accento superiore luminoso */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-indigo-400 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />

            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-105 transition-all duration-300 shrink-0 shadow-sm">
                <Trophy className="w-5 h-5 transition-transform group-hover:rotate-6" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                    Classifica
                  </h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 hidden sm:inline">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  Consulta tutti i punteggi, ordina e filtra per colore
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 group-hover:text-purple-300 transition-colors shrink-0">
              <span className="hidden sm:inline">Vedi classifica</span>
              <div className="w-7 h-7 rounded-full bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition-all duration-200">
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

        </section>

        {/* VETRINA COMMUNITY: TOP RATED & PIÙ DISCUSSE CON HOVER FLUIDI */}
        {data && (data.top_rated.length > 0 || data.most_voted.length > 0) && (
          <section aria-label="Carte in Evidenza" className="space-y-4 pt-2">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-400" />
                  In Evidenza dalla Community
                </h3>
              </div>

              <Link
                href="/community/classifica"
                className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 self-start sm:self-auto group"
              >
                <span>Vedi tutte nella classifica</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* PANNELLO: TOP RATED */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5 text-blue-400" />
                    Punteggio più alto
                  </h4>
                  <span className="text-[11px] text-slate-400">Media decrescente</span>
                </div>

                <div className="space-y-2.5">
                  {data.top_rated.map((card, idx) => {
                    const minVotesQuery = card.total_votes < 2 ? "&min_votes=1" : "";
                    return (
                      <Link
                        key={`top-${card.card_name}`}
                        href={`/community/classifica?card=${encodeURIComponent(card.card_name)}${minVotesQuery}`}
                        className="group bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:-translate-y-0.5 rounded-xl p-3 flex items-center gap-3.5 transition-all duration-200 shadow-sm"
                        title={`Apri ${card.card_name} nella classifica`}
                      >
                        {/* Artwork Panoramico Scryfall con Zoom fluido */}
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 relative border border-slate-700/60 shadow-inner">
                          {card.art_crops && card.art_crops[0] ? (
                            <Image
                              src={card.art_crops[0]}
                              alt={card.card_name}
                              fill
                              unoptimized
                              sizes="64px"
                              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px] font-bold">
                              MTG
                            </div>
                          )}
                          <span className="absolute top-1 left-1 bg-black/80 backdrop-blur-sm px-1 py-0.2 rounded text-[9px] font-black text-amber-300">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Dati Carta */}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-slate-200 group-hover:text-blue-300 truncate transition-colors" title={card.card_name}>
                            {card.card_name}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs">
                            <span className="flex items-center gap-1 font-bold text-amber-400">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {card.avg_score.toFixed(1)}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              {card.total_votes} {card.total_votes === 1 ? "voto" : "voti"}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* PANNELLO: PIÙ VOTATE */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Più votate
                  </h4>
                  <span className="text-[11px] text-slate-400">Numero di voti</span>
                </div>

                <div className="space-y-2.5">
                  {data.most_voted.map((card, idx) => {
                    const minVotesQuery = card.total_votes < 2 ? "&min_votes=1" : "";
                    return (
                      <Link
                        key={`voted-${card.card_name}`}
                        href={`/community/classifica?card=${encodeURIComponent(card.card_name)}${minVotesQuery}`}
                        className="group bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:-translate-y-0.5 rounded-xl p-3 flex items-center gap-3.5 transition-all duration-200 shadow-sm"
                        title={`Apri ${card.card_name} nella classifica`}
                      >
                        {/* Artwork Panoramico Scryfall con Zoom fluido */}
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 relative border border-slate-700/60 shadow-inner">
                          {card.art_crops && card.art_crops[0] ? (
                            <Image
                              src={card.art_crops[0]}
                              alt={card.card_name}
                              fill
                              unoptimized
                              sizes="64px"
                              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px] font-bold">
                              MTG
                            </div>
                          )}
                          <span className="absolute top-1 left-1 bg-black/80 backdrop-blur-sm px-1 py-0.2 rounded text-[9px] font-black text-orange-300">
                            #{idx + 1}
                          </span>
                        </div>

                        {/* Dati Carta */}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-slate-200 group-hover:text-orange-300 truncate transition-colors" title={card.card_name}>
                            {card.card_name}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs">
                            <span className="flex items-center gap-1 font-bold text-orange-400">
                              <Vote className="w-3 h-3 text-orange-400" />
                              {card.total_votes} {card.total_votes === 1 ? "voto" : "voti"}
                            </span>
                            <span className="text-slate-400 text-[11px] flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              {card.avg_score.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </section>
        )}

        {/* NOTA VERSIONE BETA */}
        <div className="flex items-start sm:items-center gap-3.5 bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs sm:text-sm p-4 sm:p-5 rounded-2xl shadow-lg">
          <FlaskConical className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-amber-300 font-bold">Versione Beta:</strong> Questa sezione è attualmente in fase di test e calibrazione. Stiamo raccogliendo i primi feedback dalla community e affinando gli algoritmi di rotazione delle carte e consolidamento dei voti.
          </p>
        </div>

        {/* GARANZIA PRIVACY */}
        <section aria-label="Informativa Privacy" className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-4 sm:p-5 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-0.5">
            <span className="font-bold text-slate-200">Voto Anonimo e Cookie-Free</span>
            <p className="leading-relaxed">
              Nessun dato personale viene profilato o ceduto. L&apos;identificativo anonimo salvato in locale nel browser serve esclusivamente a evitare la ripetizione delle carte già votate. Maggiori dettagli nella pagina{" "}
              <Link href="/legal" className="text-blue-400 hover:underline">
                Note Legali e Privacy
              </Link>.
            </p>
          </div>
        </section>

      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
