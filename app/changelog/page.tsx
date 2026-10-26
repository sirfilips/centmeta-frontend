import React from 'react';
import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import { SubpageHeader, BackToDashboardLink } from '../../components/SubpageHeader';

export const metadata: Metadata = {
  title: 'Note di Rilascio | CentMeta',
  description: 'Cronologia degli aggiornamenti, ottimizzazioni architetturali e nuove funzionalità della piattaforma CentMeta per Centurion Commander.',
};

interface ReleaseCardProps {
  title: string;
  date: string;
  gradient: string;
  titleColor?: string;
  badgeStyle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function ReleaseCard({
  title,
  date,
  gradient,
  titleColor = 'text-slate-200 group-open:text-blue-400',
  badgeStyle = 'bg-slate-900/70 text-slate-300 border-slate-700/80',
  defaultOpen = false,
  children,
}: ReleaseCardProps) {
  return (
    <details
      open={defaultOpen}
      className="group bg-slate-900/40 open:bg-slate-900/60 border border-slate-800 open:border-slate-700/70 rounded-3xl shadow-lg open:shadow-2xl relative isolate overflow-hidden mb-5 transition-all duration-300"
    >
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} z-10`}></div>

      <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer select-none p-6 sm:px-8 sm:py-6 lg:px-10 lg:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
        <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold transition-colors min-w-0 pr-2 ${titleColor}`}>
          {title}
        </h2>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className={`text-xs lg:text-sm px-4 py-1.5 rounded-full font-bold w-fit border shrink-0 whitespace-nowrap ${badgeStyle}`}>
            {date}
          </span>
          <span className="w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-white group-open:bg-blue-600/20 group-open:border-blue-500/40 group-open:text-blue-400 transition-all shrink-0">
            <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" strokeWidth={2.5} />
          </span>
        </div>
      </summary>

      <div className="px-6 pb-8 sm:px-10 sm:pb-10 lg:px-14 lg:pb-12 pt-6 border-t border-slate-800/80 space-y-10 lg:space-y-12 animate-fade-in">
        {children}
      </div>
    </details>
  );
}

export default function Changelog() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <SubpageHeader />

      <div className="flex-grow pb-24 max-w-[1000px] w-full mx-auto px-4 md:px-8 mt-12">
        <BackToDashboardLink />

        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">Note di Rilascio</h1>
          <p className="text-base lg:text-lg text-slate-400">
            Cronologia degli aggiornamenti, ottimizzazioni e nuove funzionalità di CentMeta. Clicca su una versione per espanderne i dettagli.
          </p>
        </div>

        {/* Blocco Versione v4.0.0 (ATTUALE - Espanso di default) */}
        <ReleaseCard
          title="v4.0.0 - Motore Covering Index (-80% Latenza), Social Preview Art Crop & Strict Architecture"
          date="26 Ottobre 2026"
          gradient="from-amber-400 via-blue-500 to-purple-600"
          titleColor="text-amber-400"
          badgeStyle="bg-amber-900/30 text-amber-300 border-amber-500/30"
          defaultOpen={true}
        >
          {/* Sezione Performance SQLite & Backend */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-amber-400 pl-4">
              Motore SQLite Covering Index &amp; Abbattimento Latenza (-80%)
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-amber-400 font-bold">•</span> <div><strong className="text-slate-200">Indici Compositi Covering B-Tree:</strong> Riprogettata la strategia di indicizzazione della tabella <code>deck_cards</code> con indici compositi <code>(deck_id, card_name)</code> e <code>(card_name, deck_id)</code> affiancati all&apos;esecuzione automatica di <code>ANALYZE</code>. L&apos;ottimizzatore di SQLite risolve ora le <code>JOIN</code> e i conteggi <code>COUNT(DISTINCT)</code> interamente all&apos;interno dell&apos;albero dell&apos;indice senza accedere alle pagine dati della tabella né allocare B-Tree temporanei di raggruppamento: i tempi di risposta a freddo crollano di oltre l&apos;<strong>80%</strong> (la Dashboard scende da ~190ms a <strong>~38ms</strong>, le statistiche globali da ~270ms a <strong>~88ms</strong> e il dettaglio carta da ~110ms a <strong>~35ms</strong>).</div></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold">•</span> <div><strong className="text-slate-200">Inversione Filtro Comandanti e Pre-Calcolo in Cache:</strong> Sostituito il filtro positivo <code>comandante IN (...)</code> (che iniettava centinaia di parametri SQL a ogni richiesta) con l&apos;esclusione compatta <code>comandante NOT IN (...)</code> e memorizzato in cache (<code>@lru_cache</code>) il calcolo delle frequenze globali, eliminando le scansioni ridondanti del database.</div></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold">•</span> <div><strong className="text-slate-200">Invarianza del Timestamp Database (<code>mtime</code>):</strong> Isolata l&apos;inizializzazione degli indici e del checkpoint WAL all&apos;avvio del server per preservare al millisecondo la data di modifica di <code>centurion.db</code>, garantendo che l&apos;indicatore di ultimo aggiornamento rifletta esclusivamente l&apos;ultimo allineamento reale dello scraper.</div></li>
            </ul>
          </div>

          {/* Sezione Cache Scryfall & Accuratezza Dati */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-blue-500 pl-4">
              Ottimizzazione Cache Scryfall, Thread-Safety &amp; Precisione Analitica
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Sessioni HTTP Thread-Local &amp; Consolidamento I/O:</strong> Introdotta nello scraper la gestione <code>threading.local()</code> per il riutilizzo sicuro delle connessioni TCP/TLS (<code>keep-alive</code>) in multithreading ed eliminata la doppia serializzazione su disco di <code>scryfall_cache.json</code> durante la migrazione verso SQLite.</div></li>
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Auto-Riparazione Record Parziali Scryfall:</strong> Integrata una verifica automatica di integrità che intercetta e rigenera eventuali carte salvate senza artwork o tipo, distinguendo correttamente le carte Incolore (<code>color_identity: []</code>) per azzerare qualsiasi chiamata API superflua.</div></li>
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Calcolo Dinamico Composizione (99 vs 98 Carte):</strong> Perfezionato l&apos;algoritmo di stima delle terre e della composizione media del mazzo distinguendo automaticamente tra comandanti singoli (<code>99</code> carte nel mainboard) e coppie Partner (<code>98</code> carte).</div></li>
            </ul>
          </div>

          {/* Sezione Social Graph Art Crop & Condivisione */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-indigo-500 pl-4">
              Social Preview Dinamiche (Scryfall Art Crop) &amp; Condivisione Universale
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Anteprime Link con Art Crop di Scryfall:</strong> Implementata la generazione server-side dinamica dei metadati <code>OpenGraph</code> e <code>Twitter Card</code> sia per le pagine dei Comandanti (<code>/commander/[nome]</code>) sia per i link diretti alle Carte (<code>/?card=...</code>), mostrando l&apos;illustrazione <code>art_crop</code> della carta o del comandante nelle anteprime su WhatsApp, Telegram, Discord e social network.</div></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Condivisione Carte &amp; Layout Mobile Ottimizzato:</strong> Esteso il pulsante di condivisione rapida anche alla pagina di dettaglio delle singole carte e riposizionato il controllo in fondo al box su dispositivi mobili per un&apos;ergonomia più pulita e meno invasiva.</div></li>
            </ul>
          </div>

          {/* Sezione Reattività Frontend & Strict Mode */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-purple-500 pl-4">
              Reattività Interfaccia, Persistenza Filtri &amp; TypeScript Strict Mode
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-purple-400 font-bold">•</span> <div><strong className="text-slate-200">Ricerca Carte con Debounce e Paginazione Sinergie:</strong> Introdotto un debounce di <code>200ms</code> sulla ricerca testuale delle carte per garantire digitazione istantanea senza blocchi del main thread, affiancato dalla paginazione incrementale anche nella griglia delle carte sinergiche.</div></li>
              <li className="flex gap-3"><span className="text-purple-400 font-bold">•</span> <div><strong className="text-slate-200">Persistenza Periodo su Nuova Scheda &amp; Drag-and-Drop Esteso:</strong> Propagato il parametro <code>?periodo=</code> a tutti i link nativi di Caroselli, Griglie, Header e Dettaglio Carta per preservare il filtro temporale anche aprendo i collegamenti con <em>Middle-Click</em>, ed esteso il Drag &amp; Drop verso Moxfield anche ai Comandanti Principali nella vista di dettaglio carta.</div></li>
              <li className="flex gap-3"><span className="text-purple-400 font-bold">•</span> <div><strong className="text-slate-200">TypeScript Strict Mode &amp; Restyling Pagine Informative:</strong> Abilitata la verifica rigorosa dei tipi (<code>&quot;strict&quot;: true</code>) sull&apos;intero frontend Next.js, unificato l&apos;header di navigazione su tutte le sottopagine (inclusa <code>/status</code>) e introdotto il nuovo layout ad accordion espandibili per il Changelog.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v3.2.0 */}
        <ReleaseCard
          title="v3.2.0 - Ricerca Unificata Hero, Condivisione Rapida & Statistiche Privacy-First"
          date="24 Ottobre 2026"
          gradient="from-blue-500 via-indigo-500 to-purple-500"
          titleColor="text-blue-400"
          badgeStyle="bg-blue-900/30 text-blue-300 border-blue-500/30"
        >
          {/* Sezione Ricerca Unificata Hero */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-blue-500 pl-4">
              Ricerca Globale Intelligente nella Hero Section
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-blue-500 font-bold">•</span> <div><strong className="text-slate-200">Ricerca Unificata Comandanti e Carte:</strong> Integrato un motore di autocompletamento istantaneo direttamente nella Hero della homepage, che consente di accedere rapidamente sia a tutti i comandanti del meta che alle carte censite.</div></li>
              <li className="flex gap-3"><span className="text-blue-500 font-bold">•</span> <div><strong className="text-slate-200">Navigazione da Tastiera & Filtri Rapidi:</strong> Selezione rapida dei risultati con frecce direzionali, Invio ed Escape, schede di filtro dedicate (Tutti, Comandanti, Carte), anteprime visive, identità di colore e pulsante di pulizia istantanea.</div></li>
            </ul>
          </div>

          {/* Sezione Condivisione Comandante */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-indigo-500 pl-4">
              Condivisione Ottimizzata Comandante
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-indigo-500 font-bold">•</span> <div><strong className="text-slate-200">Condivisione Multi-Piattaforma Adattiva:</strong> Introdotto un pulsante di condivisione dedicato nella panoramica del comandante che attiva il foglio di condivisione nativo su mobile (Web Share API) e copia silenziosamente il link diretto negli appunti su desktop con feedback visivo.</div></li>
            </ul>
          </div>

          {/* Sezione Analitiche Privacy-First e Z-Index */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-purple-500 pl-4">
              Metriche Privacy-First & Raffinamento Interfaccia
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-purple-500 font-bold">•</span> <div><strong className="text-slate-200">Statistiche Senza Cookie (Umami Analytics):</strong> Integrato il tracciamento aggregato e anonimo delle visite e dei trend di ricerca tramite Umami, soluzione 100% esente da cookie e conforme al GDPR (nessuna memorizzazione di indirizzi IP o dati personali).</div></li>
              <li className="flex gap-3"><span className="text-purple-500 font-bold">•</span> <div><strong className="text-slate-200">Perfezionamento Gerarchia Z-Index:</strong> Risolti i conflitti di sovrapposizione tra la barra di navigazione superiore, i menu a tendina e i caroselli della homepage, garantendo la stratificazione corretta di tutti gli elementi grafici.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v3.1.0 */}
        <ReleaseCard
          title="v3.1.0 - Drag & Drop Moxfield, Architettura a Componenti & Micro-Interazioni"
          date="20 Ottobre 2026"
          gradient="from-sky-400 via-blue-500 to-indigo-500"
          titleColor="text-sky-400"
          badgeStyle="bg-sky-900/30 text-sky-300 border-sky-500/30"
        >
          {/* Sezione Moxfield Drag & Drop */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-sky-500 pl-4">
              Integrazione Nativa Drag & Drop verso Moxfield Deckbuilder
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-sky-400 font-bold">•</span> <div><strong className="text-slate-200">Deckbuilding Diretto tra Schede:</strong> Implementato il supporto nativo HTML5 Drag & Drop su tutte le carte e comandanti del portale. Trascinando un&apos;immagine da CentMeta a una scheda aperta del deckbuilder di Moxfield, la carta viene istantaneamente inserita nella lista del mazzo senza doverne digitare il nome o copiarla manualmente.</div></li>
              <li className="flex gap-3"><span className="text-sky-400 font-bold">•</span> <div><strong className="text-slate-200">Supporto Completo Partner e Bifronte:</strong> Gestione intelligente delle carte speciali: per i comandanti con meccanica Partner è possibile trascinare singolarmente ciascuna delle due carte, mentre per le carte trasformabili (DDFC) il trascinamento conserva il nome primario canonico riconosciuto da Moxfield.</div></li>
            </ul>
          </div>

          {/* Sezione UX & Micro-Interazioni */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-blue-500 pl-4">
              Esperienza Utente & Micro-Banner Guida Deckbuilding
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Micro-Banner Informativo Contestuale:</strong> Introdotto un micro-banner discreto ed elegante in testa alle griglie carte e comandanti che segnala la possibilità di trascinare gli elementi direttamente su Moxfield, preservando al 100% la leggibilità visiva di immagini, nomi e costi di mana senza coperture accidentali al passaggio del cursore.</div></li>
              <li className="flex gap-3"><span className="text-blue-400 font-bold">•</span> <div><strong className="text-slate-200">Copertura Universale dell&apos;Interfaccia:</strong> La funzione e i relativi suggerimenti visivi sono operativi in modo omogeneo nel Carosello della Dashboard, nella Griglia Comandanti, nel box Hero del Comandante, nella Griglia Carte e nella schermata Sinergie.</div></li>
            </ul>
          </div>

          {/* Sezione Refactoring Modulare */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-indigo-500 pl-4">
              Refactoring Modulare e Decoupling Componenti Frontend
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Scomposizione Componenti Core:</strong> Scorporato il file monolitico <code>CentMetaApp.tsx</code> (ridotto da oltre 1100 a ~600 righe) in componenti specializzati e riutilizzabili (<code>CommandersGrid</code>, <code>CommanderOverview</code>, <code>CardsFilterBar</code>, <code>CardsGrid</code>, <code>EmptyState</code> e modulo utility <code>mtg.ts</code>).</div></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Manutenibilità e Zero Regressioni:</strong> Mantenuta al 100% l&apos;integrità di sincronizzazione dei parametri nell&apos;URL (deep linking), la gestione dello stato globale e la navigazione client-side senza ricaricamento forzato.</div></li>
            </ul>
          </div>

          {/* Sezione Backend & Resilienza Connessioni */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-emerald-400 pl-4">
              Resilienza Backend e Sanitizzazione Header Moxfield
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-emerald-400 font-bold">•</span> <div><strong className="text-slate-200">Sanitizzazione Header HTTP:</strong> Rafforzata la gestione dello User-Agent personalizzato per le richieste Moxfield nel modulo backend, garantendo l&apos;eliminazione automatica di spazi bianchi o ritorni a capo involontari ed evitando allarmi nei log di connessione in produzione.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v3.0.0 */}
        <ReleaseCard
          title="v3.0.0 - Architettura B-Tree, Decoupling Cache & Deep Linking"
          date="19 Ottobre 2026"
          gradient="from-emerald-400 via-teal-500 to-cyan-500"
          titleColor="text-emerald-400"
          badgeStyle="bg-emerald-900/30 text-emerald-300 border-emerald-500/30"
        >
          {/* Sezione Database & Query Performance */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-emerald-500 pl-4">
              Prestazioni Database e Ricerca Indicizzata B-Tree
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-emerald-500 font-bold">•</span> <div><strong className="text-slate-200">Range Scan Diretto su B-Tree SQLite:</strong> Riscritte integralmente le interrogazioni temporali sul database, sostituendo la valutazione runtime <code>datetime(data_aggiornamento)</code> con filtri lessicografici ISO-8601 conformi (<code>strftime(&apos;%Y-%m-%dT%H:%M:%S&apos;, &apos;now&apos;, ...)</code>). L&apos;ottimizzatore di SQLite passa così da una scansione lineare dell&apos;intera tabella (<code>SCAN</code>) a una ricerca per intervallo B-Tree a tempo logaritmico (<code>SEARCH USING INDEX</code>), abbattendo drasticamente i tempi di esecuzione e l&apos;occupazione CPU sul server.</div></li>
              <li className="flex gap-3"><span className="text-emerald-500 font-bold">•</span> <div><strong className="text-slate-200">Copertura Completa Indici:</strong> Verificata e consolidata la topologia degli indici sulle tabelle <code>decks</code> e <code>deck_cards</code>, garantendo tempi di aggregazione sub-millisecondo e scalabilità architetturale a prova di futuro con l&apos;aumentare dei mazzi archiviati.</div></li>
            </ul>
          </div>

          {/* Sezione Cache & Memoria */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-teal-500 pl-4">
              Architettura Cache e Gestione Memoria (Decoupled Pagination)
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-teal-500 font-bold">•</span> <div><strong className="text-slate-200">Disaccoppiamento Cache dalla Paginazione:</strong> Riorganizzata la memorizzazione in memoria nell&apos;endpoint delle statistiche mazzo. La cache memorizza ora l&apos;aggregato completo per intervallo temporale e comandante; la paginazione (<code>offset</code> e <code>limit</code>) viene eseguita istantaneamente tramite slicing in memoria nello strato endpoint. Questo azzera i cache-miss quando l&apos;utente naviga tra le pagine dei mazzi o cambia ordinamento, eliminando query ridondanti al database.</div></li>
              <li className="flex gap-3"><span className="text-teal-500 font-bold">•</span> <div><strong className="text-slate-200">Pre-warming Deferito e Flessibile:</strong> Ottimizzata la procedura di preriscaldamento cache all&apos;avvio dell&apos;applicazione. Il warm-up viene avviato in background con un ritardo controllato per consentire al server FastAPI di aprire immediatamente le porte HTTP e accettare connessioni senza bloccare l&apos;infrastruttura.</div></li>
            </ul>
          </div>

          {/* Sezione Deep Linking & UX */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-cyan-400 pl-4">
              Navigazione, Deep Linking e Sincronizzazione Temporale
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Sincronizzazione Bidirezionale dell&apos;Intervallo (<code>?periodo=</code>):</strong> L&apos;intervallo temporale selezionato dall&apos;utente è ora sincronizzato direttamente nei parametri dell&apos;URL. Il filtro persiste con precisione al ricaricamento del browser (F5), alla navigazione nella cronologia e al clic sul pulsante &quot;Riprova&quot; in caso di disconnessioni di rete.</div></li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Deep Linking Comandanti Fuori Finestra:</strong> Risolta l&apos;anomalia di condivisione dei link per comandanti presenti in archi temporali estesi (es. 3 o 6 mesi) ma privi di liste negli ultimi 30 giorni: condividendo l&apos;URL, chi riceve il collegamento atterra direttamente sul periodo corretto senza visualizzare schermate con zero mazzi.</div></li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Disaccoppiamento Ordinamenti e Retrocompatibilità:</strong> Separati chiaramente i parametri URL per l&apos;ordinamento dei comandanti (<code>csort</code>) e delle carte (<code>cardsort</code>), preservando piena retrocompatibilità con i link precedentemente condivisi.</div></li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Empty State Interattivo Integrato:</strong> Sviluppato un componente unificato per le ricerche senza risultati con contatore di clic, citazioni a rotazione di Fblthp e pulsante di ripristino rapido dei filtri con icone SVG native tramite <code>lucide-react</code>.</div></li>
            </ul>
          </div>

          {/* Sezione Hardening, Backup & Toolchain */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-indigo-400 pl-4">
              Hardening Sicurezza, Backup Preventivo & Toolchain
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Protezione Amministrativa con Header Segreto:</strong> Blindato l&apos;endpoint di rimozione mazzi (<code>/api/admin/remove-deck</code>), migrando la chiave di sicurezza dall&apos;URL all&apos;header HTTP <code>X-Admin-Secret</code>, occultando l&apos;endpoint dalla documentazione OpenAPI pubblica e mascherando i messaggi di errore interni.</div></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Backup Preventivo Snapshot pre-scrittura:</strong> Introdotta nello scraper notturno la generazione di una copia snapshot (<code>centurion.db.bak</code>) tramite <code>sqlite3.backup()</code> prima dell&apos;avvio della transazione di aggiornamento/rimozione, garantendo un punto di ripristino coerente in caso di anomalie di sistema.</div></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Resilienza Metadati Scryfall (Fail-Safe):</strong> Integrata una politica di tolleranza ai guasti: rallentamenti o rate limit transitori verso le API Scryfall non provocano più l&apos;esclusione accidentale dei comandanti censiti dal catalogo.</div></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Modernizzazione Toolchain TypeScript:</strong> Aggiornata la risoluzione dei moduli in <code>tsconfig.json</code> a <code>moduleResolution: &quot;bundler&quot;</code>, eliminando gli avvisi di deprecazione e garantendo piena compatibilità con TypeScript 6 e 7.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v2.8.0 */}
        <ReleaseCard
          title="v2.8.0 - Concorrenza Database & Resilienza Scraper"
          date="09 Ottobre 2026"
          gradient="from-violet-500 via-purple-500 to-fuchsia-500"
          titleColor="text-violet-400"
          badgeStyle="bg-violet-900/30 text-violet-300 border-violet-500/30"
        >
          {/* Sezione Concorrenza SQLite */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-violet-500 pl-4">
              Concorrenza e Zero Downtime
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-violet-400 font-bold">•</span> <div><strong className="text-slate-200">Abilitazione WAL Mode (Write-Ahead Logging):</strong> Il database SQLite è stato migrato al protocollo WAL. Questa architettura consente ora l&apos;accesso simultaneo di infiniti lettori mentre lo scraper notturno esegue operazioni di scrittura, eliminando i colli di bottiglia e garantendo zero tempi di inattività (downtime) durante l&apos;allineamento dei dati.</div></li>
              <li className="flex gap-3"><span className="text-violet-400 font-bold">•</span> <div><strong className="text-slate-200">Risoluzione Timestamp:</strong> Affinata l&apos;estrazione dell&apos;orario di ultimo aggiornamento esposto nella dashboard di monitoraggio, integrando la lettura del file temporaneo WAL per restituire un riscontro temporale sempre sincronizzato al secondo.</div></li>
            </ul>
          </div>

          {/* Sezione Resilienza Scraper */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-purple-500 pl-4">
              Resilienza dell&apos;Estrattore Dati
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-purple-400 font-bold">•</span> <div><strong className="text-slate-200">Prevenzione da Eliminazioni Massive:</strong> Introdotto un rigoroso meccanismo di salvaguardia (safety check). Qualora l&apos;API di Moxfield restituisse anomalie o timeout estesi durante la paginazione, il sistema preserverà l&apos;integrità del database locale, interrompendo la sincronizzazione e impedendo l&apos;eliminazione accidentale dei mazzi.</div></li>
              <li className="flex gap-3"><span className="text-purple-400 font-bold">•</span> <div><strong className="text-slate-200">Ottimizzazione Dry-Run:</strong> L&apos;ambiente di test isolato (dry-run) è stato blindato. È ora possibile avviare simulazioni di allineamento e leggere file JSON storici senza alcun rischio di alterare le tabelle SQL in produzione.</div></li>
            </ul>
          </div>

          {/* Sezione Thread Safety */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-fuchsia-500 pl-4">
              Sicurezza in Memoria e Thread-Safety
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-fuchsia-400 font-bold">•</span> <div><strong className="text-slate-200">Cache Scryfall Isolato:</strong> Ristrutturata l&apos;architettura di scrittura dei file temporanei sfruttando il PID (Process ID) e il Thread ID univoci. Due thread concorrenti non potranno mai più sovrascrivere lo stesso blocco JSON in memoria, azzerando le probabilità di corruzione dei dati.</div></li>
              <li className="flex gap-3"><span className="text-fuchsia-400 font-bold">•</span> <div><strong className="text-slate-200">Negative Cache Dinamica:</strong> Rivista la logica di memorizzazione temporanea delle carte mancanti. Un errore transitorio (timeout o 429) dai server di Scryfall non causerà più l&apos;occultamento di una carta per 24 ore: l&apos;API riproverà in modo proattivo al caricamento successivo.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v2.7.0 */}
        <ReleaseCard
          title="v2.7.0 - Monitoraggio Servizi, GDPR Oblio & Fix UX"
          date="04 Ottobre 2026"
          gradient="from-rose-500 via-red-500 to-orange-500"
          titleColor="text-rose-400"
          badgeStyle="bg-rose-900/30 text-rose-300 border-rose-500/30"
        >
          {/* Sezione Stato Servizi */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-rose-500 pl-4">
              Dashboard &quot;Stato del Sistema&quot; (Uptime Monitoring)
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-rose-400 font-bold">•</span> <div><strong className="text-slate-200">Monitoraggio API 24/7:</strong> Introdotta una nuova dashboard pubblica dedicata al monitoraggio dello stato di salute in tempo reale di Moxfield e Scryfall. L&apos;infrastruttura backend interroga periodicamente gli endpoint esterni garantendo piena trasparenza operativa.</div></li>
              <li className="flex gap-3"><span className="text-rose-400 font-bold">•</span> <div><strong className="text-slate-200">Cronologia Visiva (48 Ore):</strong> Sviluppata un&apos;interfaccia a segmenti per monitorare lo storico degli ultimi due giorni, facilitando l&apos;individuazione di picchi di latenza o interruzioni temporanee dei servizi esterni.</div></li>
              <li className="flex gap-3"><span className="text-rose-400 font-bold">•</span> <div><strong className="text-slate-200">Trasparenza di Allineamento:</strong> La piattaforma espone ora l&apos;orario certificato in cui l&apos;ecosistema locale è stato sincronizzato per l&apos;ultima volta con le fonti pubbliche.</div></li>
            </ul>
          </div>

          {/* Sezione GDPR & Sicurezza */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-red-500 pl-4">
              Integrità Dati e Diritto all&apos;Oblio (GDPR)
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-red-400 font-bold">•</span> <div><strong className="text-slate-200">Infrastruttura di Blacklisting:</strong> Sviluppata un&apos;architettura backend per la gestione dell&apos;Oblio Permanente. I mazzi rimossi per conformità privacy sono esclusi dai cicli di scraping futuri e disaccoppiati in modo irreversibile dall&apos;aggregazione.</div></li>
            </ul>
          </div>

          {/* Sezione Fix UX */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-orange-500 pl-4">
              User Experience e Navigazione
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-orange-400 font-bold">•</span> <div><strong className="text-slate-200">Ripristino Middle-Click:</strong> Ristrutturata l&apos;architettura del menù di navigazione (Header) tramite elementi semantici. Le operazioni di apertura in background (Middle-Click o Ctrl/Cmd + Clic) sono ora supportate nativamente.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v2.6.0 */}
        <ReleaseCard
          title="v2.6.0 - Filtri Avanzati, Mana Font & Navigazione"
          date="27 Settembre 2026"
          gradient="from-amber-400 via-orange-500 to-yellow-500"
          titleColor="text-amber-400"
          badgeStyle="bg-amber-900/30 text-amber-300 border-amber-500/30"
        >
          {/* Sezione Filtri ed Exact Match */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-amber-500 pl-4">
              Filtraggio Cromatico (Exact Match)
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-amber-400 font-bold">•</span> <div><strong className="text-slate-200">Query Restrittive (AND):</strong> Implementata una logica di filtro rigorosa basata sull&apos;identità di colore. Il sistema estrae esclusivamente le carte corrispondenti all&apos;esatta combinazione cromatica richiesta, bloccando sovrapposizioni non desiderate.</div></li>
              <li className="flex gap-3"><span className="text-amber-400 font-bold">•</span> <div><strong className="text-slate-200">Estensione Dashboard:</strong> Il meccanismo di classificazione cromatica è stato esteso alle dashboard riepilogative, permettendo analisi verticali sulle tendenze dei Comandanti.</div></li>
            </ul>
          </div>

          {/* Sezione Design */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-orange-500 pl-4">
              Integrazione Design Ufficiale
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-orange-400 font-bold">•</span> <div><strong className="text-slate-200">Libreria Mana Font:</strong> Deprecata la simbologia testuale a favore del pacchetto vettoriale standard di mercato (Mana Font), garantendo uniformità estetica e professionale nell&apos;esposizione delle tipologie di carte.</div></li>
            </ul>
          </div>

          {/* Sezione Bug Fixes e Storia */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-yellow-500 pl-4">
              Routing e Stato Applicativo
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-yellow-400 font-bold">•</span> <div><strong className="text-slate-200">Risoluzione Disallineamenti di Stato:</strong> Sistemata l&apos;interazione con l&apos;History API del browser. Il meccanismo di gestione dello stato React previene ora conflitti URL durante la navigazione regressiva o l&apos;apertura asincrona di viste.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v2.5.0 */}
        <ReleaseCard
          title="v2.5.0 - Official Moxfield API, Privacy & Backend Hardening"
          date="23 Settembre 2026"
          gradient="from-teal-400 via-emerald-500 to-cyan-500"
          titleColor="text-teal-400"
          badgeStyle="bg-teal-900/30 text-teal-300 border-teal-500/30"
        >
          {/* Sezione Moxfield & API */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-teal-500 pl-4">
              Compliance API Moxfield
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-teal-400 font-bold">•</span> <div><strong className="text-slate-200">Rate Limiting Globale:</strong> Abbandonato il framework di scraping parallelo a favore di un estrattore sequenziale governato da un rate limiter esatto, garantendo piena conformità ai Termini di Servizio (ToS).</div></li>
              <li className="flex gap-3"><span className="text-teal-400 font-bold">•</span> <div><strong className="text-slate-200">Gestione Retry e Backoff:</strong> Introdotti meccanismi di tolleranza all&apos;errore (fault tolerance) volti a mitigare l&apos;impatto di instabilità di rete, preservando lo stato consistente del database.</div></li>
            </ul>
          </div>

          {/* Sezione Privacy e GDPR */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-emerald-500 pl-4">
              Adeguamento Privacy e Data Minimization
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-emerald-400 font-bold">•</span> <div><strong className="text-slate-200">Minimizzazione Dati:</strong> Ottimizzata l&apos;impronta di stoccaggio espellendo campi metadati non necessari e focalizzandosi solo sugli identificativi operativi essenziali per le metriche.</div></li>
              <li className="flex gap-3"><span className="text-emerald-400 font-bold">•</span> <div><strong className="text-slate-200">Ecosistema Legale:</strong> Formalizzate le policy di gestione dati in accordo alla normativa vigente e attivato il canale istituzionale protetto dedicato alle questioni di conformità.</div></li>
            </ul>
          </div>

          {/* Sezione GitHub & Security */}
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-cyan-500 pl-4">
              Isolamento Credenziali
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Environment Injection:</strong> Disaccoppiate le credenziali e l&apos;API Key (User-Agent) di Moxfield dalla base di codice, delegandone l&apos;iniezione a livello di servizio di sistema (systemd).</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v2.0.1 */}
        <ReleaseCard
          title="v2.0.1 - Quality of Life, Desktop UI e Fix Visivi"
          date="21 Settembre 2026"
          gradient="from-indigo-400 via-blue-500 to-violet-500"
          titleColor="text-indigo-400"
          badgeStyle="bg-indigo-900/30 text-indigo-300 border-indigo-500/30"
        >
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-indigo-500 pl-4">
              Funzionalità e Aggiornamenti Interfaccia
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Composizione Dinamica:</strong> La componente a barra delle tipologie è ora interattiva, facilitando il filtraggio rapido della lista carte tramite interazione diretta col diagramma.</div></li>
              <li className="flex gap-3"><span className="text-indigo-400 font-bold">•</span> <div><strong className="text-slate-200">Ottimizzazione Desktop:</strong> Ampliamento della Hero Section per ambienti desktop e risoluzione di bug visivi legati al sistema WebKit (clipping e sovrapposizioni z-index errate in fase di ingrandimento).</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v2.0.0 */}
        <ReleaseCard
          title="v2.0.0 - Architettura Dinamica, SEO e Social"
          date="16 Settembre 2026"
          gradient="from-cyan-400 via-sky-500 to-blue-600"
          titleColor="text-cyan-400"
          badgeStyle="bg-cyan-900/30 text-cyan-300 border-cyan-500/30"
        >
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-cyan-500 pl-4">
              Ottimizzazione Motori di Ricerca (SEO) e Social
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Indicizzazione Strutturata:</strong> Implementata sitemap dinamica e gerarchia avanzata dei tag per migliorare l&apos;esposizione sui motori di ricerca mainstream.</div></li>
              <li className="flex gap-3"><span className="text-cyan-400 font-bold">•</span> <div><strong className="text-slate-200">Social Graph:</strong> Supporto nativo ai protocolli di Open Graph per arricchire l&apos;anteprima dei link su canali di messaggistica e social network.</div></li>
            </ul>
          </div>
        </ReleaseCard>

        {/* Blocco Versione v1.5.1 */}
        <ReleaseCard
          title="v1.5.1 - Ottimizzazione Analitica e Revisione UX"
          date="14 Settembre 2026"
          gradient="from-fuchsia-500 via-pink-500 to-rose-500"
          titleColor="text-fuchsia-400"
          badgeStyle="bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-500/30"
        >
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-slate-200 mb-5 border-l-4 border-fuchsia-500 pl-4">
              Migrazione Architetturale e Migliorie Analitiche
            </h3>
            <ul className="list-none space-y-4 text-sm md:text-base lg:text-lg text-slate-300 leading-relaxed">
              <li className="flex gap-3"><span className="text-fuchsia-400 font-bold">•</span> <div><strong className="text-slate-200">Dismissione Pandas:</strong> Riscrittura completa dei meccanismi di elaborazione backend per abbattere i consumi di memoria. L&apos;aggregazione statistica è ora integralmente off-boardata al motore SQLite nativo.</div></li>
              <li className="flex gap-3"><span className="text-fuchsia-400 font-bold">•</span> <div><strong className="text-slate-200">Gestione Anomalie UX Mobile:</strong> Sistemati bug di ritenzione focus su tastiera mobile e aggiunte rappresentazioni grafiche proporzionali per una rapida consultazione analitica in ambiente compatto.</div></li>
            </ul>
          </div>
        </ReleaseCard>

      </div>

      <Footer />
      <ScrollToTop />
    </main>
  );
}