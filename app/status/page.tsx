'use client';
import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { SubpageHeader, BackToDashboardLink } from '../../components/SubpageHeader';
import { Activity, Server, Clock, Database, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface PingEntry {
  status: string;
  timestamp: string;
}

// Il componente dei rettangolini di monitoraggio uptime
function UptimeBar({ name, pings }: { name: string; pings: PingEntry[] }) {
  const maxPings = 48;
  const emptySlots = Math.max(0, maxPings - pings.length);
  const padding: PingEntry[] = Array(emptySlots).fill({ status: 'unknown', timestamp: '' });
  const timeline = [...padding, ...pings];

  const getColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'rate_limited':
        return 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]';
      case 'error':
      case 'down':
        return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
      default:
        return 'bg-slate-800';
    }
  };

  const hasData = pings.length > 0;
  const lastStatus = hasData ? pings[pings.length - 1].status : 'unknown';
  const goodPings = pings.filter((p) => p.status === 'operational').length;
  const uptime = hasData ? ((goodPings / pings.length) * 100).toFixed(1) : null;

  const renderStatusIcon = () => {
    if (!hasData) return <Clock className="w-5 h-5 text-slate-400" />;
    if (['error', 'down'].includes(lastStatus)) return <XCircle className="w-5 h-5 text-red-500" />;
    if (lastStatus === 'rate_limited') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    return <CheckCircle className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 shadow-xl">
      <div className="flex justify-between items-center">
        <span className="text-slate-100 font-bold text-lg capitalize flex items-center gap-2">
          {renderStatusIcon()}
          Connessione {name}
        </span>
        {uptime !== null ? (
          <span className="text-emerald-400 font-black text-lg">{uptime}% uptime</span>
        ) : (
          <span className="text-slate-400 font-semibold text-sm">In attesa di dati</span>
        )}
      </div>

      <div className="flex items-end justify-between gap-[2px] sm:gap-1 h-12 w-full group">
        {timeline.map((ping, idx) => {
          const date = ping.timestamp ? new Date(ping.timestamp).toLocaleString('it-IT') : 'Dati in attesa';
          return (
            <div
              key={idx}
              title={`${date} - ${ping.status.toUpperCase()}`}
              className={`flex-1 min-w-[3px] rounded-sm transition-all duration-300 hover:opacity-80 hover:scale-y-125 cursor-help
                ${getColor(ping.status)} 
                ${ping.status === 'unknown' ? 'h-6 opacity-30' : 'h-12'}`}
            ></div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
        <span>48 ore fa</span>
        <span>Oggi</span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealthData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatUpdateDate = (dateStr?: string) => {
    if (!dateStr) return 'Scraping non ancora eseguito';
    return new Date(dateStr).toLocaleString('it-IT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <SubpageHeader />

      <div className="flex-grow pb-24 max-w-[1000px] w-full mx-auto px-4 md:px-8 mt-12">
        <BackToDashboardLink />

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-black text-white flex items-center justify-center md:justify-start gap-4 mb-4">
            <Activity className="w-10 h-10 text-blue-500" strokeWidth={2.5} />
            Stato dei Servizi
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Monitoraggio in tempo reale delle API esterne e del motore di database di CentMeta.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 animate-fade-in">
            {/* Blocco 1: Database Locale */}
            <div className="bg-blue-950/20 border border-blue-900/30 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-blue-900/50 p-4 rounded-full">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-slate-300 font-bold text-lg">Ultimo aggiornamento del Database</span>
                <span className="text-blue-300 font-medium flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Clock className="w-4 h-4" /> {formatUpdateDate(healthData?.db_last_updated)}
                </span>
              </div>
            </div>

            {/* Blocco 2: Uptime API Esterne */}
            <h2 className="text-xl font-bold text-slate-300 mt-4 flex items-center gap-2">
              <Server className="w-5 h-5 text-slate-500" /> Latenza e Affidabilità API (ultime 48h)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UptimeBar name="Moxfield" pings={healthData?.history?.moxfield || []} />
              <UptimeBar name="Scryfall" pings={healthData?.history?.scryfall || []} />
            </div>

            {/* Box Segnalazione Anomalie / GitHub Issue */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-sm sm:text-base font-bold text-slate-200">
                  Riscontri un&apos;anomalia o un disservizio?
                </span>
                <p className="text-xs sm:text-sm text-slate-400">
                  Puoi aprire una segnalazione su GitHub oppure contattarci via e-mail a <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline">privacy@centmeta.it</a>.
                </p>
              </div>
              <a
                href="https://github.com/sirfilips/centmeta-frontend/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0"
              >
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>Segnala su GitHub</span>
              </a>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
