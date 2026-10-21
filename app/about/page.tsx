import React from 'react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { 
  Compass, 
  Database, 
  Cpu, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Coffee, 
  Mail, 
  ExternalLink,
  ArrowLeft,
  Flame,
  CheckCircle2
} from 'lucide-react';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

export const metadata: Metadata = {
  title: 'Il Progetto | CentMeta',
  description: 'Scopri come nasce e funziona CentMeta: genesi, metodologia analitica, fonti dei dati e filosofia a supporto della community Centurion Commander.',
};

export default function About() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col relative">
      {/* Header Allineato al Contenuto */}
      <header className="bg-slate-900 border-b border-slate-800 shadow-lg relative z-50">
        <div className="max-w-[1000px] w-full mx-auto py-3 md:py-4 px-4 md:px-8 flex justify-center sm:justify-start">
          <a href="/" className="w-36 sm:w-48 cursor-pointer hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="CentMeta Logo" 
              width={300} 
              height={100} 
              priority
              className="w-full h-auto object-contain"
            />
          </a>
        </div>
      </header>

      <div className="flex-grow pb-24 max-w-[1000px] w-full mx-auto px-4 md:px-8 mt-12 relative z-10">
        
        {/* Pulsante Torna alla Dashboard */}
        <a 
          href="/" 
          className="text-sm md:text-base font-bold text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 mb-10 w-fit group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Torna alla Dashboard
        </a>

        {/* Intestazione Principale */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            Dietro le quinte
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">Il Progetto</h1>
          <p className="text-base lg:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Infrastruttura statistica e analitica indipendente dedicata al formato Centurion Commander: genesi, pipeline dei dati e visione comunitaria.
          </p>
        </div>

        {/* Contenitore Principale delle Sezioni */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl relative isolate overflow-hidden space-y-12 lg:space-y-16">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 z-10"></div>

          {/* 1. Genesi e Missione */}
          <section className="space-y-5">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 flex items-center gap-3 border-l-4 border-blue-500 pl-4">
              <Compass className="w-6 h-6 text-blue-400" />
              Origine e Finalità
            </h2>
            <div className="space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                Il <strong className="text-slate-100">Centurion Commander</strong> è il formato competitivo 1v1 a 100 carte singleton nato per offrire uno scontro puro, tecnico e privo delle dinamiche politiche tipiche del multiplayer. Con i suoi 25 punti vita iniziali, una banlist autonoma costantemente calibrata dal Comitato e l&apos;assenza di sideboard, ogni singola scelta di deckbuilding ha un peso determinante sul ritmo e sull&apos;efficacia della partita.
              </p>
              <p>
                Le piattaforme statistiche tradizionali di Magic si concentrano prevalentemente sul Commander a 4 giocatori o su formati con filosofie e banlist radicalmente differenti, rendendo i loro dati poco rappresentativi per chi compete in Centurion. <strong className="text-slate-100">CentMeta</strong> nasce esattamente per colmare questa lacuna: un osservatorio indipendente e trasparente che aggrega unicamente mazzi Centurion, offrendo ai giocatori metriche oggettive sull&apos;evoluzione del metagame, la diffusione dei comandanti e la reale incidenza delle carte nei 99.
              </p>
            </div>
          </section>

          {/* 2. Come Funziona l'Analisi dei Dati */}
          <section className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 flex items-center gap-3 border-l-4 border-indigo-500 pl-4">
              <Database className="w-6 h-6 text-indigo-400" />
              Metodologia e Flusso dei Dati
            </h2>
            
            <p className="text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              L&apos;infrastruttura opera attraverso una serie di processi automatizzati che estraggono, normalizzano e arricchiscono le informazioni di gioco:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Card 1: Moxfield */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-blue-400 font-bold text-base">
                  <Layers className="w-5 h-5 text-blue-400" />
                  Raccolta Liste Pubbliche
                </div>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  I mazzi provengono dalle liste registrate come pubbliche dalla community su Moxfield all&apos;interno del formato Centurion. La sincronizzazione avviene tramite un accesso concordato nel rispetto dei ritmi di chiamata e delle linee guida di frequenza.
                </p>
              </div>

              {/* Card 2: Elaborazione & Aggregazione */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  Elaborazione e Aggregazione
                </div>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Il motore backend analizza la composizione delle liste e raggruppa le carte giocate per ciascun comandante, calcolando percentuali di inclusione, sinergie e frequenze statistiche sull&apos;intero catalogo dei mazzi registrati.
                </p>
              </div>

              {/* Card 3: Scryfall */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-purple-400 font-bold text-base">
                  <ExternalLink className="w-5 h-5 text-purple-400" />
                  Ruolo di Scryfall
                </div>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  I dati ufficiali di ogni carta (testo Oracle, identità di colore, costi di mana e stampe ad alta risoluzione) sono forniti dalle API di Scryfall, punto di riferimento dell&apos;ecosistema per la visualizzazione e la consultazione tecnica.
                </p>
              </div>

              {/* Card 4: Aggiornamento Notturno */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  Sincronizzazione Quotidiana
                </div>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  Ogni sera alle ore 23:00 il crawler incrementale rileva le nuove liste e gli aggiornamenti, ricalcola le percentuali di inclusione e rigenera le visualizzazioni per i differenti orizzonti temporali (dai 7 giorni a tutti i tempi).
                </p>
              </div>

            </div>
          </section>

          {/* 3. Indipendenza e Riservatezza */}
          <section className="space-y-5">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 flex items-center gap-3 border-l-4 border-emerald-500 pl-4">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Indipendenza ed Etica dei Dati
            </h2>
            <div className="space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                CentMeta è una piattaforma amatoriale autonoma: non è affiliata al Comitato Ufficiale Centurion Commander, né a Moxfield o a Wizards of the Coast. Tutte le analisi sono elaborate a scopi informativi, aggregativi e comunitari.
              </p>
              <p>
                Il sito adotta una rigorosa filosofia di rispetto della riservatezza:
              </p>
              <ul className="list-none space-y-3 text-sm md:text-base text-slate-400 pl-1">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-200">Zero cookie di profilazione:</strong> la piattaforma non impiega cookie di profilazione o tracciamento pubblicitario e non raccoglie dati personali, rendendo superflui banner di consenso o richieste invasive all&apos;accesso.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-200">Anonimizzazione delle liste:</strong> il database memorizza solo carte e comandanti, senza salvare i nomi arbitrari attribuiti alle liste dai rispettivi autori.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-slate-200">Diritto all&apos;oblio:</strong> qualsiasi autore che desideri escludere una propria lista dalle statistiche può richiederlo in qualsiasi momento scrivendo a <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline font-medium">privacy@centmeta.it</a>.</span>
                </li>
              </ul>
              <p className="text-xs md:text-sm text-slate-500 pt-2">
                Per il testo contrattuale, l&apos;elenco dei diritti GDPR e la Fan Content Policy ufficiale di Wizards of the Coast, consulta la pagina dedicata alle <a href="/legal" className="text-slate-400 hover:text-blue-400 underline underline-offset-2">Privacy &amp; Note Legali</a>.
              </p>
            </div>
          </section>

          {/* 4. Sviluppo, Community e Supporto */}
          <section className="space-y-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-200 flex items-center gap-3 border-l-4 border-amber-500 pl-4">
              <Flame className="w-6 h-6 text-amber-400" />
              Sviluppo e Supporto alla Community
            </h2>
            <div className="space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <p>
                L&apos;intera architettura (backend FastAPI in Python, algoritmi statistici, indicizzazione del database SQLite e interfaccia Next.js 14) è ideata, programmata e curata da <strong className="text-slate-100">Filippo Zanardi</strong> come contributo volontario alla scena competitiva di Magic.
              </p>
              <p>
                Il sito è completamente gratuito e accessibile senza limitazioni o funzionalità a pagamento. I costi vivi legati all&apos;hosting del server, all&apos;elaborazione notturna e alla distribuzione della rete sono sostenuti su base personale e tramite il supporto spontaneo di chi apprezza lo strumento.
              </p>
            </div>

            {/* Box Box Donazioni & Contatto */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">
              <div className="space-y-2 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-slate-200">
                  Ti piace CentMeta e vuoi sostenere i server?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                  Un contributo su Ko-fi aiuta direttamente a coprire le spese vive di mantenimento dell&apos;infrastruttura e a finanziare lo sviluppo di nuove funzionalità.
                </p>
              </div>
              <a
                href="https://ko-fi.com/centmeta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-amber-500/10 whitespace-nowrap shrink-0"
              >
                <Coffee className="w-4 h-4" strokeWidth={2.5} />
                Supportami su Ko-fi
              </a>
            </div>

            {/* Sezione Feedback */}
            <div className="flex items-center gap-3 text-xs md:text-sm text-slate-400 pt-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                Hai idee per nuovi filtri, anomalie da segnalare o suggerimenti sul metagame? Scrivi a <a href="mailto:privacy@centmeta.it" className="text-blue-400 hover:underline font-medium">privacy@centmeta.it</a>.
              </span>
            </div>
          </section>

        </div>

      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}

