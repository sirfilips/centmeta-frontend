"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ScrollToTop";
import MetagameHistoryChart, {
  HistoryBucket,
  HistoryCommanderMeta,
} from "../../components/MetagameHistoryChart";
import { trackEvent } from "../../utils/analytics";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Layers,
  Activity,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

interface MoverItem {
  name: string;
  first_share: number;
  second_share: number;
  delta_share: number;
  total_decks: number;
  color_identity: string[];
  image?: string | null;
}

interface HistoryResponse {
  granularity: "month" | "week";
  months: number;
  top_n: number;
  top_commanders: HistoryCommanderMeta[];
  buckets: HistoryBucket[];
  movers: {
    rising: MoverItem[];
    falling: MoverItem[];
  };
  summary: {
    total_decks: number;
    global_total_decks?: number;
    last_updated?: string | null;
    periods_count: number;
    unique_commanders: number;
    peak_period: { period: string; label: string; total_decks: number } | null;
    most_diverse_period: {
      period: string;
      label: string;
      unique_commanders: number;
    } | null;
  };
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function StoricoMetagamePage() {
  const router = useRouter();
  const [granularity, setGranularity] = useState<"month" | "week">("month");
  const [months, setMonths] = useState<number>(12);
  const [metric, setMetric] = useState<"share" | "count">("share");
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/api/metagame/history?granularity=${granularity}&months=${months}&top_n=6`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: HistoryResponse = await res.json();
        if (active) setData(json);
      } catch (err) {
        console.error("Errore fetch storico metagame:", err);
        if (active)
          setError(
            "Impossibile caricare lo storico del metagame in questo momento."
          );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, [granularity, months]);

  const handleGranularityChange = (g: "month" | "week") => {
    setGranularity(g);
    trackEvent("Storico Meta - Cambio Granularita", { granularity: g });
  };

  const handleMonthsChange = (m: number) => {
    setMonths(m);
    trackEvent("Storico Meta - Cambio Finestra", { months: m });
  };

  const handleMetricChange = (m: "share" | "count") => {
    setMetric(m);
    trackEvent("Storico Meta - Cambio Metrica", { metric: m });
  };

  const handleHeaderNavigate = (
    mode: "commanders" | "cards",
    tab: string,
    sort: "top" | "hot" | "expansions"
  ) => {
    if (mode === "commanders") {
      router.push(`/?view=commanders&csort=${sort}`);
    } else {
      router.push(
        `/?view=cards&tab=${encodeURIComponent(tab)}&cardsort=${sort}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <div className="flex-grow pb-24">
        <Header
          onReset={() => router.push("/")}
          totalDecks={
            data?.summary?.global_total_decks ?? data?.summary?.total_decks
          }
          lastUpdated={data?.summary?.last_updated ?? null}
          onNavigate={handleHeaderNavigate}
        />

        <main className="max-w-[1600px] w-full mx-auto px-4 md:px-8 mt-8 space-y-8">
          {/* Intestazione coerente con CommanderOverview / HeroSection */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold bg-blue-950/50 px-3 py-1 rounded-full border border-blue-900/50 inline-flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> Evoluzione del Formato
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Storico del Metagame
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Analizza l&apos;evoluzione dei comandanti più giocati, l&apos;equilibrio dei colori, la concentrazione del meta e chi sta salendo nelle ultime settimane.
              </p>
            </div>
            <Link
              href="/"
              className="self-start md:self-center bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white text-xs md:text-sm font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-md border border-blue-500/30 inline-flex items-center gap-2 shrink-0"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Torna alla Dashboard
            </Link>
          </div>

          {/* Barra controlli nello stile del sito */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-3 sm:p-4 shadow-md">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Raggruppa:
              </span>
              <button
                type="button"
                onClick={() => handleGranularityChange("month")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  granularity === "month"
                    ? "bg-blue-600 text-white border-blue-500 shadow"
                    : "bg-slate-900/70 text-slate-300 hover:bg-slate-800 border-slate-700/60"
                }`}
              >
                Mensile
              </button>
              <button
                type="button"
                onClick={() => handleGranularityChange("week")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  granularity === "week"
                    ? "bg-blue-600 text-white border-blue-500 shadow"
                    : "bg-slate-900/70 text-slate-300 hover:bg-slate-800 border-slate-700/60"
                }`}
              >
                Settimanale
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {[6, 12, 24].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMonthsChange(m)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                    months === m
                      ? "bg-slate-700 text-white border-slate-500"
                      : "bg-slate-900/70 text-slate-400 hover:text-white border-slate-700/50"
                  }`}
                >
                  {m} mesi
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => handleMetricChange("share")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  metric === "share"
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Share %
              </button>
              <button
                type="button"
                onClick={() => handleMetricChange("count")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  metric === "count"
                    ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Mazzi
              </button>
            </div>
          </div>

          {/* Contenuto */}
          {loading ? (
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl p-8 animate-pulse space-y-4">
              <div className="h-6 w-52 bg-slate-700 rounded"></div>
              <div className="h-72 w-full bg-slate-800 rounded-2xl"></div>
            </div>
          ) : error || !data ? (
            <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-8 text-center text-red-200 text-sm">
              {error || "Dati non disponibili."}
            </div>
          ) : (
            <>
              {/* KPI sintetici */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-md">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" /> Mazzi nella Finestra
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                    {data.summary.total_decks}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-md">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" /> Comandanti Unici
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-1.5">
                    {data.summary.unique_commanders}
                  </p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-md">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Picco di Attività
                  </p>
                  <p className="text-lg sm:text-xl font-black text-blue-400 mt-1.5 truncate">
                    {data.summary.peak_period?.label || "N/D"}
                  </p>
                  {data.summary.peak_period && (
                    <p className="text-xs text-slate-400">
                      {data.summary.peak_period.total_decks} mazzi registrati
                    </p>
                  )}
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-md">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                    Massima Varietà
                  </p>
                  <p className="text-lg sm:text-xl font-black text-purple-400 mt-1.5 truncate">
                    {data.summary.most_diverse_period?.label || "N/D"}
                  </p>
                  {data.summary.most_diverse_period && (
                    <p className="text-xs text-slate-400">
                      {data.summary.most_diverse_period.unique_commanders} comandanti unici
                    </p>
                  )}
                </div>
              </div>

              {/* Tutti i grafici interattivi */}
              <MetagameHistoryChart
                buckets={data.buckets}
                topCommanders={data.top_commanders}
                metric={metric}
                onCommanderClick={(name) =>
                  trackEvent("Storico Meta - Click Comandante", {
                    commander: name,
                  })
                }
              />

              {/* Movers: In Ascesa & In Calo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Comandanti in Ascesa
                  </h2>
                  {data.movers.rising.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Nessuna variazione significativa nella finestra selezionata.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {data.movers.rising.map((m) => (
                        <Link
                          key={m.name}
                          href={`/commander/${encodeURIComponent(m.name)}`}
                          onClick={() =>
                            trackEvent("Storico Meta - Click Comandante", {
                              commander: m.name,
                            })
                          }
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-700/50 hover:border-emerald-500/40 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {m.image && (
                              <img
                                src={m.image}
                                alt={m.name}
                                loading="lazy"
                                className="w-8 h-10 object-cover rounded-md border border-slate-700 shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-100 truncate">
                                {m.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {m.first_share}% → {m.second_share}% ({m.total_decks} mazzi)
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-300 bg-emerald-950/60 border border-emerald-700/40 px-2.5 py-1 rounded-full shrink-0">
                            +{m.delta_share}%
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-xl space-y-3">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" /> Comandanti in Calo
                  </h2>
                  {data.movers.falling.length === 0 ? (
                    <p className="text-xs text-slate-500">
                      Nessun calo significativo nella finestra selezionata.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {data.movers.falling.map((m) => (
                        <Link
                          key={m.name}
                          href={`/commander/${encodeURIComponent(m.name)}`}
                          onClick={() =>
                            trackEvent("Storico Meta - Click Comandante", {
                              commander: m.name,
                            })
                          }
                          className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-700/50 hover:border-rose-500/40 transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {m.image && (
                              <img
                                src={m.image}
                                alt={m.name}
                                loading="lazy"
                                className="w-8 h-10 object-cover rounded-md border border-slate-700 shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-100 truncate">
                                {m.name}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {m.first_share}% → {m.second_share}% ({m.total_decks} mazzi)
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-rose-300 bg-rose-950/60 border border-rose-700/40 px-2.5 py-1 rounded-full shrink-0">
                            {m.delta_share}%
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
