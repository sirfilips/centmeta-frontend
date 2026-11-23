"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export interface HistoryCommanderMeta {
  name: string;
  total_decks: number;
  avg_share: number;
  color_identity: string[];
  image?: string | null;
}

export interface HistoryBucket {
  period: string;
  label: string;
  total_decks: number;
  unique_commanders: number;
  commanders: Record<string, { count: number; share: number }>;
  top_share?: number;
  others_count: number;
  others_share: number;
  color_shares?: Record<string, number>;
}

interface MetagameHistoryChartProps {
  buckets: HistoryBucket[];
  topCommanders: HistoryCommanderMeta[];
  metric: "share" | "count";
  onCommanderClick?: (name: string) => void;
}

const SERIES_COLORS = [
  "#0ea5e9", // azzurro sky (brand)
  "#f59e0b", // ambra
  "#10b981", // smeraldo
  "#f43f5e", // cremisi
  "#a855f7", // viola
  "#06b6d4", // ciano
  "#f97316", // arancio
  "#ec4899", // rosa
];

const MTG_COLORS: Array<{
  key: "W" | "U" | "B" | "R" | "G";
  label: string;
  hex: string;
  msClass: string;
  textClass: string;
}> = [
  { key: "W", label: "Bianco", hex: "#fde68a", msClass: "ms-w", textClass: "text-amber-200" },
  { key: "U", label: "Blu", hex: "#38bdf8", msClass: "ms-u", textClass: "text-sky-400" },
  { key: "B", label: "Nero", hex: "#a78bfa", msClass: "ms-b", textClass: "text-violet-400" },
  { key: "R", label: "Rosso", hex: "#fb7185", msClass: "ms-r", textClass: "text-rose-400" },
  { key: "G", label: "Verde", hex: "#34d399", msClass: "ms-g", textClass: "text-emerald-400" },
];

export default function MetagameHistoryChart({
  buckets,
  topCommanders,
  metric,
  onCommanderClick,
}: MetagameHistoryChartProps) {
  const [selectedIdx, setSelectedIdx] = useState<number>(
    Math.max(0, buckets.length - 1)
  );
  const [focusedCmd, setFocusedCmd] = useState<string | null>(null);
  const [focusedColor, setFocusedColor] = useState<string | null>(null);

  useEffect(() => {
    setSelectedIdx(Math.max(0, buckets.length - 1));
  }, [buckets]);

  useEffect(() => {
    if (focusedCmd && !topCommanders.some((c) => c.name === focusedCmd)) {
      setFocusedCmd(null);
    }
  }, [focusedCmd, topCommanders]);

  const width = 820;
  const height = 310;
  const padLeft = 46;
  const padRight = 18;
  const padTop = 20;
  const padBottom = 40;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const maxVal = useMemo(() => {
    let m = 0;
    for (const b of buckets) {
      for (const cmd of topCommanders) {
        const entry = b.commanders?.[cmd.name];
        const v = metric === "share" ? entry?.share ?? 0 : entry?.count ?? 0;
        if (v > m) m = v;
      }
    }
    if (m <= 0) return metric === "share" ? 20 : 10;
    return metric === "share"
      ? Math.min(100, Math.ceil(m / 5) * 5 + 2)
      : Math.ceil(m * 1.15);
  }, [buckets, topCommanders, metric]);

  const getX = (idx: number) => {
    if (buckets.length <= 1) return padLeft + innerW / 2;
    return padLeft + (idx / (buckets.length - 1)) * innerW;
  };

  const getY = (val: number, maxLimit = maxVal) => {
    const ratio = Math.max(0, Math.min(1, val / maxLimit));
    return padTop + innerH - ratio * innerH;
  };

  const yTicks = useMemo(() => {
    const steps = 4;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const val = (maxVal / steps) * i;
      return {
        val,
        label: metric === "share" ? `${Math.round(val)}%` : `${Math.round(val)}`,
        y: getY(val),
      };
    });
  }, [maxVal, metric]);

  const maxColorShare = useMemo(() => {
    let m = 0;
    for (const b of buckets) {
      for (const mc of MTG_COLORS) {
        const v = b.color_shares?.[mc.key] ?? 0;
        if (v > m) m = v;
      }
    }
    return m <= 0 ? 60 : Math.min(100, Math.ceil(m / 10) * 10 + 5);
  }, [buckets]);

  const maxDecksPeriod = useMemo(
    () => Math.max(1, ...buckets.map((b) => b.total_decks)),
    [buckets]
  );

  const activeBucket = buckets[selectedIdx] || buckets[buckets.length - 1];
  const xLabelStep = buckets.length > 10 ? Math.ceil(buckets.length / 8) : 1;

  if (buckets.length === 0 || topCommanders.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 text-sm bg-slate-800/40 border border-slate-700/50 rounded-2xl md:rounded-3xl">
        Nessun dato storico disponibile per questa finestra temporale.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Grafico Principale: Andamento Top Comandanti */}
      <section className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-wide">
              Andamento dei Top Comandanti
            </h2>
            <p className="text-xs text-slate-400">
              Tocca o passa il mouse su un periodo per ispezionare le quote esatte. Clicca un comandante per isolare la sua curva.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setSelectedIdx((prev) => Math.max(0, prev - 1))}
              disabled={selectedIdx <= 0}
              aria-label="Periodo precedente"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-slate-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono tabular-nums text-xs sm:text-sm font-bold text-blue-400 min-w-[68px] text-center">
              {activeBucket?.label}
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedIdx((prev) => Math.min(buckets.length - 1, prev + 1))
              }
              disabled={selectedIdx >= buckets.length - 1}
              aria-label="Periodo successivo"
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-slate-200 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-1">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto select-none overflow-visible"
            role="img"
            aria-label="Grafico storico dell'andamento dei comandanti nel metagame"
          >
            {yTicks.map((t, i) => (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={t.y}
                  x2={width - padRight}
                  y2={t.y}
                  stroke="#393d44"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                  opacity="0.55"
                />
                <text
                  x={padLeft - 8}
                  y={t.y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[11px] font-semibold"
                >
                  {t.label}
                </text>
              </g>
            ))}

            {activeBucket && (
              <line
                x1={getX(selectedIdx)}
                y1={padTop}
                x2={getX(selectedIdx)}
                y2={padTop + innerH}
                stroke="#38bdf8"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                opacity="0.7"
              />
            )}

            {buckets.map((b, idx) => {
              const showLabel =
                idx === 0 ||
                idx === buckets.length - 1 ||
                idx % xLabelStep === 0;
              if (!showLabel) return null;
              return (
                <text
                  key={b.period}
                  x={getX(idx)}
                  y={height - 12}
                  textAnchor="middle"
                  className={`text-[11px] font-semibold ${
                    idx === selectedIdx ? "fill-blue-400" : "fill-slate-400"
                  }`}
                >
                  {b.label}
                </text>
              );
            })}

            {topCommanders.map((cmd, cIdx) => {
              const color = SERIES_COLORS[cIdx % SERIES_COLORS.length];
              const isDimmed = focusedCmd !== null && focusedCmd !== cmd.name;
              const points = buckets.map((b, bIdx) => {
                const entry = b.commanders?.[cmd.name];
                const v =
                  metric === "share" ? entry?.share ?? 0 : entry?.count ?? 0;
                return `${getX(bIdx)},${getY(v)}`;
              });

              return (
                <g
                  key={cmd.name}
                  style={{
                    opacity: isDimmed ? 0.16 : 1,
                    transition: "opacity 200ms ease",
                  }}
                >
                  <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth={focusedCmd === cmd.name ? 3.5 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.join(" ")}
                  />
                  {buckets.map((b, bIdx) => {
                    const entry = b.commanders?.[cmd.name];
                    const v =
                      metric === "share"
                        ? entry?.share ?? 0
                        : entry?.count ?? 0;
                    const isActive = bIdx === selectedIdx;
                    return (
                      <circle
                        key={`${cmd.name}-${b.period}`}
                        cx={getX(bIdx)}
                        cy={getY(v)}
                        r={isActive ? 5 : 3}
                        fill={color}
                        stroke="#16171a"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              );
            })}

            {buckets.map((b, bIdx) => {
              const colW =
                buckets.length > 1 ? innerW / (buckets.length - 1) : innerW;
              const xStart = Math.max(padLeft, getX(bIdx) - colW / 2);
              const xEnd = Math.min(padLeft + innerW, getX(bIdx) + colW / 2);
              return (
                <rect
                  key={`hit-${b.period}`}
                  x={xStart}
                  y={padTop}
                  width={Math.max(1, xEnd - xStart)}
                  height={innerH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setSelectedIdx(bIdx)}
                  onClick={() => setSelectedIdx(bIdx)}
                />
              );
            })}
          </svg>
        </div>

        {/* Legenda interattiva con thumbnail comandante */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {topCommanders.map((cmd, idx) => {
            const color = SERIES_COLORS[idx % SERIES_COLORS.length];
            const isFocused = focusedCmd === cmd.name;
            const periodStat = activeBucket?.commanders?.[cmd.name];

            return (
              <div
                key={cmd.name}
                className={`flex items-center justify-between gap-2.5 p-3 rounded-xl border transition-all ${
                  isFocused
                    ? "bg-slate-800 border-blue-500/60 shadow-lg"
                    : "bg-slate-900/70 border-slate-700/50 hover:border-slate-600"
                }`}
              >
                <button
                  type="button"
                  aria-pressed={isFocused}
                  onClick={() =>
                    setFocusedCmd((prev) => (prev === cmd.name ? null : cmd.name))
                  }
                  className="flex items-center justify-between gap-2.5 flex-1 min-w-0 text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    {cmd.image && (
                      <img
                        src={cmd.image}
                        alt={cmd.name}
                        loading="lazy"
                        className="w-8 h-10 object-cover rounded-md border border-slate-700 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                        {cmd.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Media: {cmd.avg_share}% ({cmd.total_decks} mazzi)
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 shrink-0">
                    {metric === "share"
                      ? `${periodStat?.share ?? 0}%`
                      : `${periodStat?.count ?? 0}`}
                  </span>
                </button>

                <Link
                  href={`/commander/${encodeURIComponent(cmd.name)}`}
                  onClick={() => onCommanderClick?.(cmd.name)}
                  aria-label={`Apri analisi di ${cmd.name}`}
                  title={`Apri analisi di ${cmd.name}`}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 text-slate-400 hover:text-blue-300 transition shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Sezione Secondaria a 2 Colonne: Volume/Varietà + Concentrazione Meta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafico Volume Mazzi vs Comandanti Unici */}
        <section className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 sm:p-6 flex flex-col justify-between space-y-4 min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                Volume Mazzi vs Comandanti Unici
              </h3>
              <p className="text-xs text-slate-400">
                Confronto diretto sulla stessa scala: più le due barre sono vicine, più il meta è vario
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
                Mazzi totali
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span>
                Comandanti unici
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-3 sm:p-4 overflow-hidden">
            {(() => {
              const vw = 560;
              const vh = 195;
              const vPadLeft = 36;
              const vPadRight = 8;
              const vPadTop = 14;
              const vPadBottom = 24;
              const vInnerW = vw - vPadLeft - vPadRight;
              const vInnerH = vh - vPadTop - vPadBottom;
              const yMax = Math.max(4, Math.ceil(maxDecksPeriod / 4) * 4);
              const slotW = vInnerW / Math.max(1, buckets.length);
              const barW = Math.max(3, Math.min(18, slotW * 0.65));
              const baseY = vPadTop + vInnerH;
              const vStep = buckets.length > 10 ? Math.ceil(buckets.length / 6) : 1;

              return (
                <svg
                  viewBox={`0 0 ${vw} ${vh}`}
                  className="w-full h-48 select-none"
                  role="img"
                  aria-label="Volume mazzi e comandanti unici sulla stessa scala"
                >
                  {[0, 0.5, 1].map((ratio, rIdx) => {
                    const tickVal = Math.round(yMax * ratio);
                    const y = baseY - ratio * vInnerH;
                    return (
                      <g key={`vy-${rIdx}`}>
                        <line
                          x1={vPadLeft}
                          y1={y}
                          x2={vw - vPadRight}
                          y2={y}
                          stroke="#393d44"
                          strokeDasharray={ratio === 0 ? undefined : "4 4"}
                          strokeWidth="1"
                          opacity={ratio === 0 ? 0.9 : 0.5}
                        />
                        <text
                          x={vPadLeft - 6}
                          y={y + 4}
                          textAnchor="end"
                          className="fill-slate-400 text-[10px] font-semibold"
                        >
                          {tickVal}
                        </text>
                      </g>
                    );
                  })}

                  {buckets.map((b, idx) => {
                    const slotX = vPadLeft + idx * slotW;
                    const barX = slotX + (slotW - barW) / 2;
                    const deckH = Math.max(2, (b.total_decks / yMax) * vInnerH);
                    const uniqH = Math.max(
                      2,
                      (b.unique_commanders / yMax) * vInnerH
                    );
                    const isActive = idx === selectedIdx;
                    const showLbl =
                      idx === 0 ||
                      idx === buckets.length - 1 ||
                      idx % vStep === 0;

                    return (
                      <g
                        key={`vol-${b.period}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setSelectedIdx(idx)}
                        onClick={() => setSelectedIdx(idx)}
                      >
                        <rect
                          x={slotX}
                          y={vPadTop}
                          width={slotW}
                          height={vInnerH}
                          fill={isActive ? "#282b2f" : "transparent"}
                          opacity={isActive ? 0.7 : 0}
                          rx={3}
                        />
                        {/* Barra totale mazzi (sky) */}
                        <rect
                          x={barX}
                          y={baseY - deckH}
                          width={barW}
                          height={deckH}
                          rx={2}
                          fill={isActive ? "#38bdf8" : "#0ea5e9"}
                          opacity={isActive ? 0.95 : 0.65}
                        />
                        {/* Barra sovrapposta comandanti unici sulla stessa scala (smeraldo) */}
                        <rect
                          x={barX + barW * 0.15}
                          y={baseY - uniqH}
                          width={barW * 0.7}
                          height={uniqH}
                          rx={1.5}
                          fill={isActive ? "#6ee7b7" : "#10b981"}
                          opacity={isActive ? 1 : 0.95}
                        />
                        {showLbl && (
                          <text
                            x={slotX + slotW / 2}
                            y={vh - 6}
                            textAnchor="middle"
                            className={`text-[9px] font-semibold ${
                              isActive ? "fill-blue-400" : "fill-slate-400"
                            }`}
                          >
                            {b.label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
              <span className="font-bold text-blue-400">
                {activeBucket?.label}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <span>
                  <strong className="text-blue-300">{activeBucket?.total_decks}</strong>{" "}
                  mazzi
                </span>
                <span>
                  <strong className="text-emerald-300">
                    {activeBucket?.unique_commanders}
                  </strong>{" "}
                  comandanti unici
                </span>
                <span className="text-slate-400">
                  (Varietà:{" "}
                  <strong className="text-white">
                    {activeBucket && activeBucket.total_decks > 0
                      ? Math.round(
                          (activeBucket.unique_commanders /
                            activeBucket.total_decks) *
                            100
                        )
                      : 0}
                    %
                  </strong>
                  )
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Grafico Concentrazione Meta (Top N vs Resto del Formato) */}
        <section className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 sm:p-6 flex flex-col justify-between space-y-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                Concentrazione del Metagame
              </h3>
              <p className="text-xs text-slate-400">
                Quota occupata dai Top {topCommanders.length} rispetto al resto dei comandanti (dal più recente)
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block"></span>
                Top {topCommanders.length}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block"></span>
                Altri
              </span>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-3 sm:p-4 space-y-2.5 max-h-56 overflow-y-auto pr-2">
            {[...buckets].reverse().map((b) => {
              const topPct =
                b.top_share !== undefined
                  ? b.top_share
                  : Math.max(0, 100 - b.others_share);
              const otherPct = Math.max(0, 100 - topPct);
              return (
                <div key={`conc-${b.period}`} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{b.label}</span>
                    <span className="text-slate-400">
                      Top {topCommanders.length}:{" "}
                      <strong className="text-amber-300">
                        {topPct.toFixed(1)}%
                      </strong>{" "}
                      • Altri {otherPct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden bg-slate-800 flex">
                    <div
                      className="bg-amber-400/90 h-full transition-all"
                      style={{ width: `${topPct}%` }}
                    />
                    <div
                      className="bg-slate-600/80 h-full transition-all"
                      style={{ width: `${otherPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 3. Grafico Distribuzione Colori nel Tempo (W / U / B / R / G) */}
      <section className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
              Presenza dei Colori nel Meta
            </h3>
            <p className="text-xs text-slate-400">
              Percentuale di mazzi che includono ciascun colore nella propria identità di comandante
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {MTG_COLORS.map((mc) => {
              const isFocused = focusedColor === mc.key;
              const currentPct = activeBucket?.color_shares?.[mc.key] ?? 0;
              return (
                <button
                  key={mc.key}
                  type="button"
                  onClick={() =>
                    setFocusedColor((prev) => (prev === mc.key ? null : mc.key))
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                    isFocused
                      ? "bg-slate-700 border-blue-400 text-white"
                      : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <i className={`ms ${mc.msClass} ${mc.textClass} text-sm`}></i>
                  <span>{currentPct}%</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-3 sm:p-4">
          <svg
            viewBox={`0 0 ${width} 230`}
            className="w-full h-auto select-none overflow-visible"
            role="img"
            aria-label="Andamento percentuale dei 5 colori nel metagame"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const val = Math.round(maxColorShare * ratio);
              const y = 16 + 170 - ratio * 170;
              return (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#393d44"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                    opacity="0.5"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[10px] font-semibold"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {buckets.map((b, idx) => {
              const showLabel =
                idx === 0 ||
                idx === buckets.length - 1 ||
                idx % xLabelStep === 0;
              if (!showLabel) return null;
              return (
                <text
                  key={`c-lbl-${b.period}`}
                  x={getX(idx)}
                  y={216}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold ${
                    idx === selectedIdx ? "fill-blue-400" : "fill-slate-400"
                  }`}
                >
                  {b.label}
                </text>
              );
            })}

            {MTG_COLORS.map((mc) => {
              const isDimmed =
                focusedColor !== null && focusedColor !== mc.key;
              const pts = buckets.map((b, idx) => {
                const v = b.color_shares?.[mc.key] ?? 0;
                const y = 16 + 170 - (Math.min(maxColorShare, v) / maxColorShare) * 170;
                return `${getX(idx)},${y}`;
              });
              return (
                <polyline
                  key={`line-${mc.key}`}
                  fill="none"
                  stroke={mc.hex}
                  strokeWidth={focusedColor === mc.key ? 3.5 : 2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    opacity: isDimmed ? 0.15 : 0.9,
                    transition: "opacity 200ms ease",
                  }}
                  points={pts.join(" ")}
                />
              );
            })}
          </svg>
        </div>
      </section>
    </div>
  );
}
