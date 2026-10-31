"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  RotateCw, 
  SkipForward, 
  CalendarDays,
  Database,
  CheckCircle2, 
  AlertCircle, 
  BookOpen,
  ArrowRight,
  Flame,
  Award
} from "lucide-react";
import { getVoterToken } from "../../../utils/voterToken";
import CommunityNav from "../../../components/CommunityNav";
import Footer from "../../../components/Footer";
import ScrollToTop from "../../../components/ScrollToTop";

interface CardData {
  card_name: string;
  images: string[];
  art_crops: string[];
  oracles: string[];
  type: string;
  cmc: number;
  color_identity: string[];
  decks_count: number;
  is_recent_pool: boolean;
  is_core_staple?: boolean;
  is_daily_spotlight?: boolean;
  community_stats: {
    total_votes: number;
    avg_score: number;
    stars_breakdown: Record<number, number>;
    user_score: number | null;
  };
  daily_progress?: {
    voted_today: number;
    pool_size: number;
    total_voted: number;
  };
}

const STAR_LABELS: Record<number, { title: string; desc: string; color: string }> = {
  1: { title: "Ingiocabile", desc: "Non adatta al formato Centurion", color: "text-red-400" },
  2: { title: "Scarsa / Marginale", desc: "Giocabile solo in strategie molto ristrette", color: "text-orange-400" },
  3: { title: "Situazionale / Buona", desc: "Valida nel mazzo giusto, bilanciata", color: "text-yellow-400" },
  4: { title: "Forte / Eccellente", desc: "Tra le migliori carte per il suo archetipo", color: "text-emerald-400" },
  5: { title: "Staple Assoluto", desc: "Colonna portante del formato, fortissima", color: "text-blue-400" }
};

export default function VotaPage() {
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const [imageError, setImageError] = useState(false);

  // Stato carta e voto
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showOracle, setShowOracle] = useState(false);
  const [dailyProgress, setDailyProgress] = useState<{
    voted_today: number;
    pool_size: number;
    total_voted: number;
  } | null>(null);

  // Feedback post-voto prima del passaggio
  const [feedback, setFeedback] = useState<{
    score: number;
  } | null>(null);

  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Caricamento prossima carta
  const loadNextCard = useCallback(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    setLoading(true);
    setError(null);
    setImageError(false);
    setHoveredStar(null);
    setSelectedScore(null);
    setIsFlipped(false);
    setShowOracle(false);
    setFeedback(null);

    const token = getVoterToken();
    const headers: Record<string, string> = {};
    if (token) headers["X-Voter-Token"] = token;

    fetch("/api/community/card/random", { headers })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: CardData) => {
        setCurrentCard(data);
        if (data.community_stats?.user_score) {
          setSelectedScore(data.community_stats.user_score);
        }
        if (data.daily_progress) {
          setDailyProgress(data.daily_progress);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Errore fetch random card:", err);
        setError("Impossibile caricare la carta. Verifica la connessione e riprova.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadNextCard();
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, [loadNextCard]);

  // Invio del voto
  const handleVote = useCallback((score: number) => {
    if (!currentCard || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setSelectedScore(score);

    const token = getVoterToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["X-Voter-Token"] = token;

    fetch("/api/community/rate", {
      method: "POST",
      headers,
      body: JSON.stringify({
        card_name: currentCard.card_name,
        score: score
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.daily_progress) {
          setDailyProgress(data.daily_progress);
        } else {
          setDailyProgress((prev) => prev ? { ...prev, voted_today: prev.voted_today + 1 } : null);
        }
        setFeedback({
          score: score
        });

        // Passa alla prossima carta dopo 600ms di feedback visivo
        fetchTimeoutRef.current = setTimeout(() => {
          isSubmittingRef.current = false;
          setIsSubmitting(false);
          loadNextCard();
        }, 600);
      })
      .catch((err) => {
        console.error("Errore durante il voto:", err);
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        setError("Errore durante l'invio del voto. Riprova.");
      });
  }, [currentCard, loadNextCard]);

  // Scorciatoie da tastiera
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        handleVote(parseInt(e.key, 10));
      } else if (e.key === " " || e.key === "ArrowRight") {
        e.preventDefault();
        loadNextCard();
      } else if (e.key.toLowerCase() === "f" && currentCard && currentCard.images.length > 1) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleVote, loadNextCard, currentCard]);

  // Calcolo immagine corrente (supporto bifronte)
  const currentImage = currentCard?.images?.length
    ? isFlipped && currentCard.images.length > 1
      ? currentCard.images[1]
      : currentCard.images[0]
    : null;

  const activeStarPreview = hoveredStar ?? selectedScore;

  const todayCount = dailyProgress?.voted_today ?? 0;
  const poolSize = dailyProgress?.pool_size ?? 150;
  const progressPercent = Math.min(100, Math.round((todayCount / (poolSize || 1)) * 100));

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative selection:bg-blue-600 selection:text-white">
      <CommunityNav />

      <div className="flex-grow pb-20 max-w-[950px] w-full mx-auto px-3 sm:px-6 md:px-8 mt-4 sm:mt-8 relative z-10 flex flex-col items-center">
        
        {/* INDICATORE PROGRESSO GIORNALIERO (BEN VISIBILE SU MOBILE E DESKTOP) */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:px-5 sm:py-3.5 mb-4 sm:mb-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-200">
                Voti di oggi:
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full text-xs sm:text-sm font-black text-amber-300">
              <span>{todayCount}</span>
              <span className="text-amber-500/70">/</span>
              <span>{poolSize}</span>
            </div>
          </div>

          {/* Barra di avanzamento giornaliero */}
          <div className="w-full sm:w-60 flex items-center gap-2.5">
            <div className="flex-1 bg-slate-800 h-2 sm:h-2.5 rounded-full overflow-hidden border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-400 min-w-[34px] text-right">
              {progressPercent}%
            </span>
          </div>

          {/* Scorciatoie da tastiera (visibili solo desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 text-xs border-l border-slate-800 pl-4">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">1-5</kbd> Vota
            <span className="text-slate-600">•</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">Spazio</kbd> Salta
            {currentCard && currentCard.images.length > 1 && (
              <>
                <span className="text-slate-600">•</span>
                <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">F</kbd> Gira
              </>
            )}
          </div>
        </div>

        {/* STATO DI ERRORE */}
        {error && (
          <div className="w-full bg-red-950/40 border border-red-900/50 rounded-2xl p-5 text-center text-red-200 mb-5 flex flex-col items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="font-medium text-xs sm:text-sm">{error}</p>
            <button
              onClick={loadNextCard}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase px-4 py-2 rounded-xl transition-all shadow-md"
            >
              Riprova
            </button>
          </div>
        )}

        {/* CARD CONTAINER PRINCIPALE (OTTIMIZZATO MOBILE E DESKTOP) */}
        <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl relative isolate overflow-hidden flex flex-col md:flex-row gap-5 sm:gap-7 md:gap-8 items-center md:items-start justify-center">
          
          {/* LATO SINISTRO: IMMAGINE CARTA MTG (COMPATTA SU MOBILE) */}
          <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
            <div className="relative w-[190px] xs:w-[220px] sm:w-[250px] md:w-[280px] h-[265px] xs:h-[307px] sm:h-[349px] md:h-[391px] rounded-2xl overflow-hidden bg-slate-800/80 border border-slate-700/60 shadow-xl group">
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-500 animate-pulse">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin" />
                  <span className="text-xs font-semibold">Pesco la carta...</span>
                </div>
              ) : currentImage && !imageError ? (
                <>
                  <Image
                    src={currentImage}
                    alt={currentCard?.card_name || "MTG Card"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 220px, 280px"
                    priority
                    onError={() => setImageError(true)}
                    className={`object-contain transition-transform duration-300 ${
                      isSubmitting ? "scale-95 opacity-80" : "group-hover:scale-[1.02]"
                    }`}
                  />
                  {feedback && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-fade-in z-20">
                      <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mb-2 animate-bounce" />
                      <div className="text-base sm:text-lg font-black text-white">Voto Registrato!</div>
                      <div className="text-xs text-slate-300 mt-1">
                        Hai dato <span className="text-amber-400 font-bold">{feedback.score} ★</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-2 font-medium">
                        Caricamento prossima carta...
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-900 border-2 border-dashed border-slate-700 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-bold mb-2">
                    MTG
                  </div>
                  <div className="font-bold text-white text-xs sm:text-sm mb-1">{currentCard?.card_name}</div>
                  <div className="text-[11px] text-slate-400">{currentCard?.type}</div>
                </div>
              )}
            </div>

            {/* CONTROLLI SOTTO L'IMMAGINE: GIRA CARTA (SE BIFRONTE) */}
            {currentCard && currentCard.images.length > 1 && (
              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all border border-slate-700 shadow-sm"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Gira ({isFlipped ? "Fronte" : "Retro"})</span>
              </button>
            )}
          </div>

          {/* LATO DESTRO: DETTAGLI & AZIONI DI VOTO */}
          <div className="flex-1 w-full space-y-4 sm:space-y-5 flex flex-col justify-between self-stretch">
            
            {/* INTESTAZIONE CARTA */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {currentCard?.is_daily_spotlight ? (
                  <span className="inline-flex items-center gap-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    <CalendarDays className="w-3 h-3 text-purple-400" /> In Rotazione Oggi
                  </span>
                ) : currentCard?.is_core_staple ? (
                  <span className="inline-flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    <Flame className="w-3 h-3 text-orange-400" /> Top 100 Metagame
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    <Database className="w-3 h-3 text-blue-400" /> Catalogo CentMeta
                  </span>
                )}

                {currentCard && (
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-2.5 py-0.5 rounded-full border border-slate-700/50">
                    Presente in <strong className="text-slate-200">{currentCard.decks_count}</strong> {currentCard.decks_count === 1 ? "mazzo" : "mazzi"} (30gg)
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {loading ? "Caricamento carta..." : currentCard?.card_name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                  {currentCard?.type || "Tipologia carta"}
                </p>
              </div>

              {/* SE L'UTENTE AVEVA GIÀ VOTATO LA CARTA IN PASSATO */}
              {currentCard?.community_stats.user_score && (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    Il tuo voto attuale: {currentCard.community_stats.user_score} ★ (puoi cambiarlo)
                  </span>
                </div>
              )}
            </div>

            {/* SEZIONE VALUTAZIONE CON LE 5 STELLE (NESSUN BIAS VISIVO) */}
            <div className="space-y-3 bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Il tuo giudizio:
                </span>
                {activeStarPreview && (
                  <span className={`text-xs font-black uppercase tracking-wide ${STAR_LABELS[activeStarPreview].color}`}>
                    {STAR_LABELS[activeStarPreview].title}
                  </span>
                )}
              </div>

              {/* PULSANTI DELLE 5 STELLE */}
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isHovered = hoveredStar !== null && star <= hoveredStar;
                  const isSelected = selectedScore !== null && star <= selectedScore;
                  const isActive = isHovered || (!hoveredStar && isSelected);

                  return (
                    <button
                      key={star}
                      type="button"
                      disabled={loading || isSubmitting}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => handleVote(star)}
                      className={`flex-1 flex flex-col items-center justify-center py-2.5 sm:py-3.5 px-1 rounded-xl sm:rounded-2xl border transition-all duration-150 group relative ${
                        isActive
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-400 scale-105 shadow-md shadow-amber-500/10"
                          : "bg-slate-900/60 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Star
                        className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110 ${
                          isActive ? "fill-amber-400 text-amber-400" : ""
                        }`}
                      />
                      <span className="text-[10px] sm:text-[11px] font-bold mt-1 font-mono">
                        {star} ★
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* DESCRIZIONE DEL LIVELLO DI VOTO SELEZIONATO */}
              <div className="text-center text-xs text-slate-400 min-h-[18px]">
                {activeStarPreview ? (
                  <span>{STAR_LABELS[activeStarPreview].desc}</span>
                ) : (
                  <span className="text-slate-500">Tocca da 1 a 5 stelle per esprimere la tua valutazione</span>
                )}
              </div>
            </div>

            {/* PULSANTI DI AZIONE SECONDARI: SALTA & ORACLE */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={loading || isSubmitting}
                onClick={loadNextCard}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm py-2.5 sm:py-3 px-4 rounded-xl border border-slate-700/80 transition-all shadow-sm group disabled:opacity-50"
              >
                <SkipForward className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                <span>Non la conosco / Salta</span>
              </button>

              {currentCard?.oracles && currentCard.oracles.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowOracle((prev) => !prev)}
                  className={`w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 sm:py-3 px-4 rounded-xl border transition-all ${
                    showOracle
                      ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                      : "bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showOracle ? "Nascondi Testo" : "Testo Oracle"}</span>
                </button>
              )}
            </div>

            {/* TESTO ORACLE SE ESPANSO */}
            {showOracle && currentCard?.oracles && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2 whitespace-pre-wrap leading-relaxed shadow-inner animate-fade-in font-serif">
                {currentCard.oracles.map((txt, i) => (
                  <div key={i}>{txt}</div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* LINK RAPIDO ALLA CLASSIFICA */}
        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/community/classifica"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-400 hover:text-blue-400 transition-colors py-2 px-4 rounded-xl hover:bg-slate-900/60"
          >
            <span>Vuoi vedere quali carte dominano i voti? Vai alla Classifica</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
