"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, Users, Star, ArrowRight, Flame, Shield, HelpCircle, Layers, Swords, Vote, FlaskConical } from "lucide-react";
import CommunityNav from "../../components/CommunityNav";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";

interface OverviewData {
  total_votes: number;
  total_cards_rated: number;
  top_rated: Array<{
    card_name: string;
    total_votes: number;
    avg_score: number;
    images: string[];
    art_crops: string[];
  }>;
  most_voted: Array<{
    card_name: string;
    total_votes: number;
    avg_score: number;
    images: string[];
    art_crops: string[];
  }>;
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative selection:bg-blue-600 selection:text-white">
      <CommunityNav />

      <div className="flex-grow pb-24 max-w-[1100px] w-full mx-auto px-4 md:px-8 mt-10 relative z-10 space-y-12">
        
        {/* HERO SECTION CON CITAZIONE */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Users className="w-4 h-4 text-blue-400" />
              Osservatorio Community CentMeta
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <FlaskConical className="w-3.5 h-3.5" />
              Beta
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Il Giudizio della Community
          </h1>

          {/* BOX CITAZIONE AMICO */}
          <div className="bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-purple-950/40 border border-blue-900/30 rounded-2xl p-6 sm:p-7 shadow-xl relative isolate overflow-hidden">
            <div className="text-3xl text-blue-400/30 font-serif leading-none absolute top-3 left-4 select-none">“</div>
            <p className="text-lg sm:text-xl font-medium text-slate-200 italic leading-relaxed px-4">
              “Le carte di Magic sono tutte scarse, a meno che non siano forti.”
            </p>
            <div className="mt-3 text-xs sm:text-sm font-bold text-blue-400 tracking-wide uppercase">
              — Anonimo
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Esprimi il tuo voto sulle carte del formato Centurion Commander. Scopri cosa ne pensano gli altri giocatori, individua le staple indiscutibili e le carte più sottovalutate.
          </p>

          {/* BANNER NOTA VERSIONE BETA */}
          <div className="inline-flex items-center gap-3 bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs sm:text-sm px-4 py-3 rounded-2xl max-w-2xl mx-auto text-left shadow-lg">
            <FlaskConical className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              <strong className="text-amber-300 font-bold">Versione Beta:</strong> Questa sezione è attualmente in fase di test e calibrazione. Stiamo raccogliendo i primi feedback dalla community e affinando gli algoritmi di rotazione delle carte e consolidamento dei voti.
            </p>
          </div>
        </div>

        {/* CONTATORI IN TEMPO REALE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <Vote className="w-3.5 h-3.5 text-amber-400" /> Voti Totali
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {loading ? "..." : data?.total_votes ?? 0}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Carte Valutate
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {loading ? "..." : data?.total_cards_rated ?? 0}
            </div>
          </div>

          <Link
            href="/community/classifica?sort=highest"
            className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-5 text-center shadow-lg transition-all group block cursor-pointer"
            title="Vedi le carte con punteggio più alto"
          >
            <div className="text-xs font-bold text-slate-400 group-hover:text-blue-300 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5 transition-colors">
              <Trophy className="w-3.5 h-3.5 text-blue-400" /> Top Rated
            </div>
            <div className="text-sm sm:text-base font-bold text-blue-300 truncate" title={data?.top_rated[0]?.card_name || "Nessuna"}>
              {loading ? "..." : data?.top_rated[0]?.card_name || "In attesa di voti"}
            </div>
          </Link>

          <Link
            href="/community/classifica?sort=most_voted"
            className="bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 rounded-2xl p-5 text-center shadow-lg transition-all group block cursor-pointer"
            title="Vedi le carte più votate"
          >
            <div className="text-xs font-bold text-slate-400 group-hover:text-orange-300 uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5 transition-colors">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Più Votata
            </div>
            <div className="text-sm sm:text-base font-bold text-orange-300 truncate" title={data?.most_voted[0]?.card_name || "Nessuna"}>
              {loading ? "..." : data?.most_voted[0]?.card_name || "In attesa di voti"}
            </div>
          </Link>
        </div>

        {/* DUE CARD PRINCIPALI DI AZIONE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. ARENA DI VOTO */}
          <Link
            href="/community/vota"
            className="group bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-7 sm:p-9 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Swords className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white group-hover:text-blue-300 transition-colors">
                Arena di Voto
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Ti mostriamo carte pescate casualmente tra le più giocate nell&apos;ultimo mese e dal catalogo CentMeta. Valutale da 1 a 5 stelle o saltale liberamente.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-blue-400 font-bold text-sm">
              <span>Inizia a Votare</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </Link>

          {/* 2. CLASSIFICA COMMUNITY */}
          <Link
            href="/community/classifica"
            className="group bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-7 sm:p-9 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Trophy className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                Classifica & Hall of Fame
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Consulta le graduatorie aggiornate in tempo reale: scopri le carte col punteggio medio più alto, quelle con più recensioni e le più controverse.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-purple-400 font-bold text-sm">
              <span>Consulta la Classifica</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </div>
          </Link>

        </div>

        {/* ANTEPRIME: TOP 3 & PIÙ VOTATE */}
        {data && (data.top_rated.length > 0 || data.most_voted.length > 0) && (
          <div className="space-y-8 pt-4">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              In Evidenza dalla Community
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.top_rated.map((card, idx) => (
                <Link
                  href={`/community/classifica?card=${encodeURIComponent(card.card_name)}`}
                  key={card.card_name}
                  className="bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/80 rounded-2xl p-4 flex items-center gap-4 transition-all shadow-md group block cursor-pointer"
                  title={`Apri ${card.card_name} nella Classifica`}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 relative border border-slate-700/50">
                    {card.art_crops && card.art_crops[0] ? (
                      <Image
                        src={card.art_crops[0]}
                        alt={card.card_name}
                        fill
                        unoptimized
                        sizes="56px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-bold">
                        MTG
                      </div>
                    )}
                    <span className="absolute top-1 left-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-black text-amber-300">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-blue-300 transition-colors" title={card.card_name}>
                      {card.card_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="flex items-center gap-1 font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {card.avg_score.toFixed(1)}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {card.total_votes} {card.total_votes === 1 ? "voto" : "voti"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* PRIVACY & ETICA */}
        <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-5 text-xs text-slate-400 flex items-start gap-3.5">
          <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-200">Voto Anonimo e Privacy-First</span>
            <p className="leading-relaxed">
              Il sistema di voto di CentMeta non utilizza cookie di tracciamento né cookie tecnici memorizzati nel tuo browser. La protezione anti-spam opera tramite un identificatore crittografico unidirezionale anonimo (SHA-256) elaborato unicamente al momento del voto.
            </p>
          </div>
        </div>

      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}

